import express from 'express';
import { readFile, writeFile, rename, copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(here, 'data', 'portfolio.json');
const BACKUP_FILE = path.join(here, 'data', 'portfolio.backup.json');
const MESSAGES_FILE = path.join(here, 'data', 'messages.json');
const UPLOADS = path.join(here, '..', 'uploads');
const DIST = path.join(here, '..', 'dist');
const PORT = process.env.PORT || 5050;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
// Sessions are signed with this secret. Without ADMIN_SECRET, a new one is made at start,
// which only means you log in again after the server restarts.
const SECRET = process.env.ADMIN_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_HOURS = 12;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

/* ============================================================
   Small helpers
   ============================================================ */
async function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(await readFile(file, 'utf8'));
}

// Write to a temp file first, then swap it in, so a crash never leaves half a file.
async function writeJsonSafe(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, file);
}

function rateLimiter(max, windowMs) {
  const hits = new Map();
  return (key) => {
    const now = Date.now();
    const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
    list.push(now);
    hits.set(key, list);
    return list.length > max;
  };
}

/* ============================================================
   Public API
   ============================================================ */
app.get('/api/portfolio', async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-cache').json(await readJson(DATA_FILE, {}));
  } catch (err) {
    console.error('Could not read portfolio.json:', err.message);
    res.status(500).json({ error: 'Portfolio data could not be loaded' });
  }
});

const contactLimit = rateLimiter(5, 10 * 60 * 1000);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', express.json({ limit: '20kb' }), async (req, res) => {
  const { name = '', email = '', message = '', website = '' } = req.body || {};
  if (website) return res.json({ ok: true }); // hidden field, only bots fill it

  const clean = {
    name: String(name).trim().slice(0, 100),
    email: String(email).trim().slice(0, 200),
    message: String(message).trim().slice(0, 4000)
  };
  const errors = {};
  if (!clean.name) errors.name = 'Please add your name';
  if (!EMAIL_RE.test(clean.email)) errors.email = 'Please add an email address I can reply to';
  if (clean.message.length < 10) errors.message = 'Please write a little more';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  if (contactLimit(req.ip)) {
    return res.status(429).json({ error: 'Too many messages, please try again in a few minutes' });
  }

  try {
    const saved = await readJson(MESSAGES_FILE, []);
    saved.push({ id: crypto.randomUUID(), ...clean, read: false, receivedAt: new Date().toISOString() });
    await writeJsonSafe(MESSAGES_FILE, saved);
    console.log(`New message from ${clean.name} <${clean.email}>`);
    res.json({ ok: true });
  } catch (err) {
    console.error('Could not save message:', err.message);
    res.status(500).json({ error: 'Your message could not be sent, please email me instead' });
  }
});

/* ============================================================
   Admin: login with a signed, HttpOnly cookie
   ============================================================ */
function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
}
function makeToken() {
  const expires = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  return `${expires}.${sign(expires)}`;
}
function validToken(token = '') {
  const [expires, mac] = token.split('.');
  if (!expires || !mac) return false;
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(mac);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected) && Number(expires) > Date.now();
}
function readCookie(req, name) {
  const header = req.headers.cookie || '';
  const hit = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : '';
}
function sameSecret(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin is turned off. Set ADMIN_PASSWORD in the .env file' });
  if (!validToken(readCookie(req, 'admin'))) return res.status(401).json({ error: 'Please log in' });
  next();
}

const loginLimit = rateLimiter(10, 15 * 60 * 1000);

app.post('/api/admin/login', express.json({ limit: '2kb' }), (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin is turned off. Set ADMIN_PASSWORD in the .env file' });
  if (loginLimit(req.ip)) return res.status(429).json({ error: 'Too many attempts, try again in 15 minutes' });

  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  // Check both every time and give one message, so the error never reveals which part was wrong
  const userOk = sameSecret(username.toLowerCase(), ADMIN_USERNAME.toLowerCase());
  const passOk = sameSecret(password, ADMIN_PASSWORD);
  if (!userOk || !passOk) return res.status(401).json({ error: 'Wrong username or password' });

  res.cookie('admin', makeToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: req.secure,
    maxAge: SESSION_HOURS * 3600 * 1000,
    path: '/'
  });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie('admin', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/me', requireAdmin, (_req, res) => res.json({ ok: true }));

/* ---------- Save all content ---------- */
function checkPortfolio(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Content must be an object';
  if (!data.profile || typeof data.profile !== 'object') return 'Profile is missing';
  for (const key of ['projects', 'skills', 'experience', 'writing', 'now']) {
    if (!Array.isArray(data[key])) return `"${key}" must be a list`;
  }
  if (data.projects.some((p) => !p || !String(p.title || '').trim())) return 'Every project needs a title';
  return '';
}

app.put('/api/admin/portfolio', requireAdmin, express.json({ limit: '1mb' }), async (req, res) => {
  const problem = checkPortfolio(req.body);
  if (problem) return res.status(400).json({ error: problem });
  try {
    if (existsSync(DATA_FILE)) await copyFile(DATA_FILE, BACKUP_FILE);
    await writeJsonSafe(DATA_FILE, req.body);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Could not save portfolio:', err.message);
    res.status(500).json({ error: 'Could not save, nothing was changed' });
  }
});

/* ---------- Uploads: images and PDF ----------
   Sent as base64 so no extra upload library is needed.
   The real file type is checked from its first bytes, not just its name. */
const TYPES = {
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  webp: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP',
  pdf: (b) => b.subarray(0, 5).toString() === '%PDF-'
};
const MAX_UPLOAD = 8 * 1024 * 1024;

app.post('/api/admin/upload', requireAdmin, express.json({ limit: '12mb' }), async (req, res) => {
  const { name = 'file', data = '' } = req.body || {};
  const base64 = String(data).replace(/^data:[^;]+;base64,/, '');
  const buf = Buffer.from(base64, 'base64');
  if (!buf.length) return res.status(400).json({ error: 'The file is empty' });
  if (buf.length > MAX_UPLOAD) return res.status(413).json({ error: 'Files can be up to 8 MB' });

  const ext = Object.keys(TYPES).find((t) => TYPES[t](buf));
  if (!ext) return res.status(400).json({ error: 'Use a JPG, PNG, WebP or PDF file' });

  const slug = String(name).toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'file';
  const file = `${slug}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  try {
    await mkdir(UPLOADS, { recursive: true });
    await writeFile(path.join(UPLOADS, file), buf);
    res.json({ url: `/uploads/${file}` });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/* ---------- Messages from the contact form ---------- */
app.get('/api/admin/messages', requireAdmin, async (_req, res) => {
  const list = await readJson(MESSAGES_FILE, []);
  res.json(list.slice().reverse()); // newest first
});

app.patch('/api/admin/messages/:id', requireAdmin, express.json({ limit: '1kb' }), async (req, res) => {
  const list = await readJson(MESSAGES_FILE, []);
  const msg = list.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  msg.read = Boolean(req.body?.read);
  await writeJsonSafe(MESSAGES_FILE, list);
  res.json({ ok: true });
});

app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const list = await readJson(MESSAGES_FILE, []);
  const next = list.filter((m) => m.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: 'Message not found' });
  await writeJsonSafe(MESSAGES_FILE, next);
  res.json({ ok: true });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

/* ============================================================
   Files
   ============================================================ */
app.use('/uploads', express.static(UPLOADS, {
  maxAge: '7d',
  setHeaders: (res) => res.set('X-Content-Type-Options', 'nosniff')
}));

if (existsSync(DIST)) {
  app.use(express.static(DIST, { maxAge: '1h', index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!ADMIN_PASSWORD) console.log('Admin is off: set ADMIN_PASSWORD in .env to turn it on');
});
