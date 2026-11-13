// Where content, messages and uploads are kept.
// - Locally: plain files in server/data and uploads/.
// - On Vercel (BLOB_READ_WRITE_TOKEN is set): a private Vercel Blob store, because
//   the Vercel filesystem is read-only and resets on every deploy.
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(here, 'data');
export const UPLOADS_DIR = path.join(here, '..', 'uploads');
export const usingBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

let blobLib;
const blob = async () => (blobLib ||= await import('@vercel/blob'));

/* ---------- JSON documents (portfolio, backup, messages) ---------- */
export async function readJson(name, fallback) {
  if (usingBlob) {
    const { get } = await blob();
    const hit = await get(`data/${name}`, { access: 'private', useCache: false }).catch((err) => {
      if (err?.name === 'BlobNotFoundError') return null;
      throw err;
    });
    if (!hit || hit.statusCode !== 200) return fallback;
    return JSON.parse(await new Response(hit.stream).text());
  }
  const file = path.join(DATA_DIR, name);
  if (!existsSync(file)) return fallback;
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function writeJson(name, data) {
  const body = JSON.stringify(data, null, 2);
  if (usingBlob) {
    const { put } = await blob();
    await put(`data/${name}`, body, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
    return;
  }
  // Write to a temp file first, then swap it in, so a crash never leaves half a file
  const file = path.join(DATA_DIR, name);
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, body);
  await rename(tmp, file);
}

// The portfolio content. On a fresh Blob store, start from the copy in the repo.
export async function readPortfolio() {
  const saved = await readJson('portfolio.json', null);
  if (saved) return saved;
  if (usingBlob) return JSON.parse(await readFile(path.join(DATA_DIR, 'portfolio.json'), 'utf8'));
  return {};
}

/* ---------- Uploaded files (photos, screenshots, résumé) ---------- */
export async function saveUpload(file, buf, contentType) {
  if (usingBlob) {
    const { put } = await blob();
    await put(`uploads/${file}`, buf, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType });
    return;
  }
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, file), buf);
}

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' };
export const mimeFor = (file) => MIME[path.extname(file).slice(1).toLowerCase()] || 'application/octet-stream';

// Streams an upload to the response. Returns false when the file does not exist.
export async function sendUpload(file, res) {
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(file)) return false;
  res.set('X-Content-Type-Options', 'nosniff');
  // File names carry a random suffix, so a file never changes once uploaded
  res.set('Cache-Control', 'public, max-age=604800, s-maxage=31536000, immutable');

  if (usingBlob) {
    const { get } = await blob();
    const hit = await get(`uploads/${file}`, { access: 'private' }).catch(() => null);
    if (!hit || hit.statusCode !== 200) return false;
    res.type(hit.blob.contentType || mimeFor(file));
    Readable.fromWeb(hit.stream).pipe(res);
    return true;
  }
  const full = path.join(UPLOADS_DIR, file);
  if (!existsSync(full)) return false;
  res.type(mimeFor(file));
  createReadStream(full).pipe(res);
  return true;
}
