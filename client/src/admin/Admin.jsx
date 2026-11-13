import '../legacy.js';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { newId } from './ListEditor.jsx';
import Messages from './Messages.jsx';
import { ProfileEditor, ProjectsEditor, SkillsEditor, ExperienceEditor, WritingEditor, NowEditor } from './editors.jsx';
import './admin.css';

const SECTIONS = [
  ['profile', 'Profile', ProfileEditor],
  ['projects', 'Projects', ProjectsEditor],
  ['skills', 'Skills', SkillsEditor],
  ['experience', 'Experience', ExperienceEditor],
  ['writing', 'Writing', WritingEditor],
  ['now', 'Now', NowEditor],
  ['messages', 'Messages', null]
];

// Give every list item a hidden _id for editing, and strip them again before saving
const LISTS = ['projects', 'skills', 'experience', 'writing', 'now'];
function withIds(d) {
  const out = { ...d, profile: { ...d.profile, links: (d.profile?.links || []).map((l) => ({ ...l, _id: newId() })) } };
  LISTS.forEach((k) => { out[k] = (d[k] || []).map((it) => ({ ...it, _id: newId() })); });
  return out;
}
function withoutIds(d) {
  const strip = ({ _id, ...rest }) => rest;
  const out = { ...d, profile: { ...d.profile, links: (d.profile.links || []).map(strip) } };
  LISTS.forEach((k) => { out[k] = d[k].map(strip); });
  out.projects = out.projects.map((p) => {
    const clean = { ...p };
    if (!clean.mock) delete clean.mock;
    if (!clean.featured) delete clean.featured;
    return clean;
  });
  return out;
}

function Login({ onDone }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/login', { method: 'POST', body: { username, password } });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="a-login">
      <form className="a-card a-login__box" onSubmit={submit}>
        <h1 className="a-login__title">Portfolio admin</h1>
        <label className="a-field">
          <span className="a-label">Username</span>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" autoCapitalize="none" spellCheck={false} />
        </label>
        <label className="a-field">
          <span className="a-label">Password</span>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="a-error">{error}</p>}
        <button className="a-btn a-btn--primary" type="submit" disabled={busy || !username || !password}>{busy ? 'Checking' : 'Log in'}</button>
        <a className="a-link a-muted" href="/">Back to the site</a>
      </form>
    </div>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState('checking'); // checking | out | in | off
  const [offMsg, setOffMsg] = useState('');
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { kind, text }
  const [section, setSection] = useState(() => (location.hash.slice(1) || 'profile'));
  const [unread, setUnread] = useState(0);

  useEffect(() => { document.title = 'Admin, portfolio'; }, []);

  const loadAll = useCallback(async () => {
    const res = await fetch('/api/portfolio');
    const json = await res.json();
    setData(withIds(json));
    setSaved(JSON.stringify(json));
    setDirty(false);
    api('/messages').then((m) => setUnread(m.filter((x) => !x.read).length)).catch(() => {});
  }, []);

  useEffect(() => {
    api('/me')
      .then(() => { setAuth('in'); loadAll(); })
      .catch((e) => {
        if (e.status === 503) { setOffMsg(e.message); setAuth('off'); } else setAuth('out');
      });
  }, [loadAll]);

  // Track unsaved changes and warn before leaving
  const edit = (next) => {
    setData(next);
    setDirty(JSON.stringify(withoutIds(next)) !== saved);
  };
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => { history.replaceState(null, '', `#${section}`); }, [section]);

  async function save() {
    setSaving(true);
    setNotice(null);
    try {
      const clean = withoutIds(data);
      await api('/portfolio', { method: 'PUT', body: clean });
      setSaved(JSON.stringify(clean));
      setDirty(false);
      setNotice({ kind: 'ok', text: 'Saved. The site shows the changes on refresh' });
    } catch (err) {
      if (err.status === 401) setAuth('out');
      setNotice({ kind: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    if (!window.confirm('Throw away your unsaved changes?')) return;
    setData(withIds(JSON.parse(saved)));
    setDirty(false);
    setNotice(null);
  }

  async function logout() {
    if (dirty && !window.confirm('You have unsaved changes. Log out anyway?')) return;
    await api('/logout', { method: 'POST' }).catch(() => {});
    setDirty(false);
    setAuth('out');
  }

  if (auth === 'checking') return <div className="a-shell" />;
  if (auth === 'off') {
    return (
      <div className="a-login">
        <div className="a-card a-login__box">
          <h1 className="a-login__title">Admin is turned off</h1>
          <p className="a-muted">{offMsg}. Then restart the server.</p>
        </div>
      </div>
    );
  }
  if (auth === 'out') return <Login onDone={() => { setAuth('in'); loadAll(); }} />;
  if (!data) return <div className="a-shell" />;

  const current = SECTIONS.find((s) => s[0] === section) || SECTIONS[0];
  const Editor = current[2];

  return (
    <div className="a-shell">
      <aside className="a-side">
        <p className="a-brand">{data.profile.name}<span>Admin</span></p>
        <nav className="a-nav" aria-label="Admin sections">
          {SECTIONS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`a-nav__item${section === id ? ' is-active' : ''}`}
              onClick={() => setSection(id)}
              aria-current={section === id ? 'page' : undefined}
            >
              <span>{label}</span>
              {id === 'messages' && unread > 0 && <span className="a-count">{unread}</span>}
              {id !== 'messages' && Array.isArray(data[id]) && <span className="a-count a-count--quiet">{data[id].length}</span>}
            </button>
          ))}
        </nav>
        <div className="a-side__foot">
          <a className="a-nav__item" href="/" target="_blank" rel="noreferrer">View site</a>
          <button type="button" className="a-nav__item" onClick={logout}>Log out</button>
        </div>
      </aside>

      <main className="a-main">
        <header className="a-top">
          <h1 className="a-title">{current[1]}</h1>
          {current[0] !== 'messages' && (
            <div className="a-top__actions">
              <span className={`a-status${dirty ? ' is-dirty' : ''}`} role="status">
                {dirty ? 'Unsaved changes' : notice?.kind === 'ok' ? notice.text : 'All changes saved'}
              </span>
              {dirty && <button type="button" className="a-btn a-btn--quiet" onClick={discard}>Discard</button>}
              <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={!dirty || saving}>
                {saving ? 'Saving' : 'Save changes'}
              </button>
            </div>
          )}
        </header>
        {notice?.kind === 'error' && <p className="a-banner">{notice.text}</p>}

        <div className="a-content">
          {Editor ? <Editor data={data} setData={edit} /> : <Messages onCount={setUnread} />}
        </div>
      </main>
    </div>
  );
}
