import { useRef, useState } from 'react';
import { uploadFile } from './api.js';

/* Form controls shared by every editor. Each one gets `value` and `onChange(newValue)`. */

export function Text({ label, value, onChange, hint, placeholder, type = 'text' }) {
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <input type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <small className="a-hint">{hint}</small>}
    </label>
  );
}

export function Area({ label, value, onChange, hint, rows = 3 }) {
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      {hint && <small className="a-hint">{hint}</small>}
    </label>
  );
}

// A list of short strings edited as comma-separated text
export function Tags({ label, value, onChange, hint = 'Separate with commas' }) {
  const [draft, setDraft] = useState((value || []).join(', '));
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean));
        }}
      />
      {hint && <small className="a-hint">{hint}</small>}
    </label>
  );
}

// A list of strings edited one per line
export function Lines({ label, value, onChange, hint = 'One per line' }) {
  const [draft, setDraft] = useState((value || []).join('\n'));
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <textarea
        rows={Math.max(4, (value || []).length + 1)}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean));
        }}
      />
      {hint && <small className="a-hint">{hint}</small>}
    </label>
  );
}

export function Check({ label, value, onChange, hint }) {
  return (
    <label className="a-check">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}{hint && <small className="a-hint"> {hint}</small>}</span>
    </label>
  );
}

export function Select({ label, value, onChange, options, hint }) {
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
      {hint && <small className="a-hint">{hint}</small>}
    </label>
  );
}

// Upload an image or PDF, or type a path by hand
export function Upload({ label, value, onChange, accept = 'image/jpeg,image/png,image/webp', hint, preview = 'image' }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [broken, setBroken] = useState(false);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await uploadFile(file);
      setBroken(false);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="a-field">
      <span className="a-label">{label}</span>
      <div className="a-upload">
        {preview === 'image' && (
          <div className={`a-thumb${preview === 'image' && value && !broken ? '' : ' is-empty'}`}>
            {value && !broken && <img src={value} alt="" onError={() => setBroken(true)} />}
            {(!value || broken) && <span>{value ? 'File not found' : 'No image'}</span>}
          </div>
        )}
        <div className="a-upload__side">
          <input value={value ?? ''} onChange={(e) => { setBroken(false); onChange(e.target.value); }} placeholder="/uploads/file.jpg" />
          <div className="a-row">
            <button type="button" className="a-btn" onClick={() => input.current?.click()} disabled={busy}>
              {busy ? 'Uploading' : 'Upload file'}
            </button>
            {value && preview === 'link' && <a className="a-link" href={value} target="_blank" rel="noreferrer">Open</a>}
            {value && <button type="button" className="a-btn a-btn--quiet" onClick={() => onChange('')}>Remove</button>}
          </div>
          {error && <small className="a-error">{error}</small>}
          {hint && <small className="a-hint">{hint}</small>}
        </div>
      </div>
      <input ref={input} type="file" accept={accept} hidden onChange={pick} />
    </div>
  );
}
