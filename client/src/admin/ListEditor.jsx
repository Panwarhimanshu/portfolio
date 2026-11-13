import { useState } from 'react';

let counter = 0;
export const newId = () => `k${Date.now().toString(36)}${(counter++).toString(36)}`;

function Icon({ d }) {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d={d} /></svg>;
}
const UP = 'M8 12V4M4.5 7.5 8 4l3.5 3.5';
const DOWN = 'M8 4v8M4.5 8.5 8 12l3.5-3.5';
const CHEVRON = 'm6 4 4 4-4 4';

/*
  A list of items you can open, edit, reorder, add to and delete.
  Each item carries a hidden _id so React keeps its inputs straight while reordering.
*/
export default function ListEditor({ items, onChange, newItem, title, meta, render, addLabel = 'Add item', noun = 'item' }) {
  const [open, setOpen] = useState(null);

  const set = (id, next) => onChange(items.map((it) => (it._id === id ? next : it)));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const remove = (it) => {
    if (!window.confirm(`Delete "${title(it) || `this ${noun}`}"? This can't be undone after you save.`)) return;
    onChange(items.filter((x) => x._id !== it._id));
  };
  const add = () => {
    const it = { ...newItem(), _id: newId() };
    onChange([...items, it]);
    setOpen(it._id);
  };

  return (
    <div className="a-list">
      {items.length === 0 && <p className="a-empty">Nothing here yet</p>}
      {items.map((it, i) => {
        const isOpen = open === it._id;
        return (
          <div className={`a-item${isOpen ? ' is-open' : ''}`} key={it._id}>
            <div className="a-item__head">
              <button type="button" className="a-item__toggle" onClick={() => setOpen(isOpen ? null : it._id)} aria-expanded={isOpen}>
                <span className="a-chev"><Icon d={CHEVRON} /></span>
                <span className="a-item__title">{title(it) || <em className="a-untitled">Untitled {noun}</em>}</span>
                {meta && <span className="a-item__meta">{meta(it)}</span>}
              </button>
              <div className="a-item__tools">
                <button type="button" className="a-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Icon d={UP} /></button>
                <button type="button" className="a-icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><Icon d={DOWN} /></button>
                <button type="button" className="a-btn a-btn--quiet a-btn--danger" onClick={() => remove(it)}>Delete</button>
              </div>
            </div>
            {isOpen && <div className="a-item__body">{render(it, (next) => set(it._id, next))}</div>}
          </div>
        );
      })}
      <button type="button" className="a-btn a-add" onClick={add}>{addLabel}</button>
    </div>
  );
}
