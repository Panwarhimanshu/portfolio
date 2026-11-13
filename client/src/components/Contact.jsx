import { useState } from 'react';

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [failMsg, setFailMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '', website: '' });
      } else if (body.errors) {
        setErrors(body.errors);
        setStatus('idle');
      } else {
        setFailMsg(body.error || 'Something went wrong');
        setStatus('failed');
      }
    } catch {
      setFailMsg('Could not reach the server');
      setStatus('failed');
    }
  }

  function copyEmail() {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <section className="wrap section contact" id="contact" aria-labelledby="contact-h">
      <header className="section__head">
        <h2 id="contact-h">Contact</h2>
      </header>

      <div className="contact__grid">
        <div className="contact__body">
          <p className="contact__lede">{profile.availability}</p>
          <p className="contact__email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button className="copy-btn" type="button" onClick={copyEmail}>{copied ? 'Copied' : 'Copy'}</button>
          </p>
          <ul className="contact__links">
            {profile.links.map((l) => <li key={l.url}><a href={l.url}>{l.label}</a></li>)}
            {profile.resume && <li><a href={profile.resume}>Résumé</a></li>}
          </ul>
        </div>

        <form className="form" onSubmit={submit} noValidate>
          <p className="form__title">Or send a message from here</p>

          <label className="field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={update} autoComplete="name" aria-invalid={!!errors.name} />
            {errors.name && <small className="field__error">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <small className="field__error">{errors.email}</small>}
          </label>

          <label className="field">
            <span>Message</span>
            <textarea name="message" rows="5" value={form.message} onChange={update} aria-invalid={!!errors.message} />
            {errors.message && <small className="field__error">{errors.message}</small>}
          </label>

          {/* Hidden from people, bots fill it in */}
          <label className="field--trap" aria-hidden="true">
            Website <input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" />
          </label>

          <div className="form__foot">
            <button className="key key--send" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending' : 'Send message'}
            </button>
            <p className="form__status" role="status">
              {status === 'sent' && 'Thanks, your message is in. I usually reply within two days'}
              {status === 'failed' && failMsg}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
