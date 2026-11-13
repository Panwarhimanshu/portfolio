import { useEffect, useState } from 'react';
import { api } from './api.js';

const fmt = (iso) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Messages({ onCount }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    api('/messages')
      .then((m) => { setList(m); onCount(m.filter((x) => !x.read).length); })
      .catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  async function toggleRead(m) {
    await api(`/messages/${m.id}`, { method: 'PATCH', body: { read: !m.read } }).catch((e) => setError(e.message));
    load();
  }
  async function remove(m) {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    await api(`/messages/${m.id}`, { method: 'DELETE' }).catch((e) => setError(e.message));
    load();
  }

  if (error) return <p className="a-error">{error}</p>;
  if (!list) return <p className="a-muted">Loading</p>;
  if (!list.length) return <div className="a-card"><p className="a-empty">No messages yet. They appear here when someone uses the contact form.</p></div>;

  return (
    <div className="a-messages">
      {list.map((m) => (
        <article key={m.id} className={`a-card a-msg${m.read ? '' : ' is-unread'}`}>
          <header className="a-msg__head">
            <div>
              <p className="a-msg__from">{!m.read && <span className="a-dot" aria-label="Unread" />}{m.name}</p>
              <a className="a-link" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}>{m.email}</a>
            </div>
            <time className="a-muted a-mono">{fmt(m.receivedAt)}</time>
          </header>
          <p className="a-msg__body">{m.message}</p>
          <div className="a-row">
            <a className="a-btn" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}>Reply by email</a>
            <button type="button" className="a-btn a-btn--quiet" onClick={() => toggleRead(m)}>{m.read ? 'Mark unread' : 'Mark read'}</button>
            <button type="button" className="a-btn a-btn--quiet a-btn--danger" onClick={() => remove(m)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
