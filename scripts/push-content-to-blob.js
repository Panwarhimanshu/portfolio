// Copies local content to the Vercel Blob store used by the live site:
// server/data/portfolio.json, server/data/messages.json and everything in uploads/.
//
//   vercel env pull .env.local          (gets BLOB_READ_WRITE_TOKEN)
//   node --env-file=.env.local scripts/push-content-to-blob.js
//
// Careful: this overwrites what the live admin panel has saved.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { usingBlob, writeJson, saveUpload, mimeFor, DATA_DIR, UPLOADS_DIR } from '../server/storage.js';

if (!usingBlob) {
  console.error('BLOB_READ_WRITE_TOKEN is not set. Run: node --env-file=.env.local scripts/push-content-to-blob.js');
  process.exit(1);
}

for (const name of ['portfolio.json', 'messages.json']) {
  const file = path.join(DATA_DIR, name);
  if (!existsSync(file)) continue;
  await writeJson(name, JSON.parse(await readFile(file, 'utf8')));
  console.log(`data/${name}`);
}

if (existsSync(UPLOADS_DIR)) {
  for (const file of await readdir(UPLOADS_DIR)) {
    if (!/^[a-z0-9][a-z0-9._-]*$/i.test(file)) continue;
    await saveUpload(file, await readFile(path.join(UPLOADS_DIR, file)), mimeFor(file));
    console.log(`uploads/${file}`);
  }
}
console.log('Done');
