import { useEffect, useRef, useState } from 'react';

const IDLE = 'hover a key, or type on your keyboard';

/*
  Skills as a keyboard. Each group is a row, with the group name on a wide key at the start,
  like Tab or Shift. The last group ("Learning now") is drawn as empty slots, keys not fitted yet.
  Hovering or clicking a key types it on the little screen. Typing on a real keyboard
  presses the keys that start with that letter.
*/
export default function Skills({ groups }) {
  const [line, setLine] = useState({ text: IDLE, kind: 'idle' });
  const [shown, setShown] = useState('');
  const board = useRef(null);
  const typed = useRef('');

  // Type the current line out letter by letter
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || line.kind === 'idle') { setShown(line.text); return; }
    let i = 0;
    setShown('');
    const id = setInterval(() => {
      i += 1;
      setShown(line.text.slice(0, i));
      if (i >= line.text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [line]);

  const say = (skill, learning) =>
    setLine({ text: learning ? `learning ${skill.toLowerCase()}` : `use ${skill.toLowerCase()}`, kind: learning ? 'learning' : 'ok', skill });

  // Real keyboard: press keys whose skill starts with the typed letters
  useEffect(() => {
    const el = board.current;
    if (!el) return;
    let timer = 0;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key.length !== 1 || !/[a-z0-9]/i.test(e.key)) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return; // only while the keyboard is on screen

      typed.current = (typed.current + e.key.toLowerCase()).slice(-12);
      clearTimeout(timer);
      timer = setTimeout(() => { typed.current = ''; }, 900);

      const keys = [...el.querySelectorAll('[data-skill]')];
      let hits = keys.filter((k) => k.dataset.skill.toLowerCase().startsWith(typed.current));
      if (!hits.length) {
        typed.current = e.key.toLowerCase();
        hits = keys.filter((k) => k.dataset.skill.toLowerCase().startsWith(typed.current));
      }
      hits.forEach((k) => {
        k.classList.add('is-hit');
        setTimeout(() => k.classList.remove('is-hit'), 160);
      });
      if (hits[0]) say(hits[0].dataset.skill, hits[0].dataset.learning === '1');
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timer); };
  }, []);

  return (
    <section className="wrap section" id="skills" aria-labelledby="skills-h">
      <header className="section__head">
        <h2 id="skills-h">Skills</h2>
        <p className="section__dek">Sorted by how often I reach for them</p>
      </header>

      <div className="keyboard-wrap">
        <div className="keyboard" ref={board}>
          <div className="keyboard__screen" aria-hidden="true">
            <span className="prompt">$</span>
            <span className={line.kind === 'ok' ? 'ok' : undefined}>{shown}</span>
            <span className="caret" />
          </div>

          {groups.map((g, gi) => {
            const learning = gi === groups.length - 1 && groups.length > 1;
            return (
              <div className="keyboard__row" key={g.group}>
                <h3 className={`key key--mod${learning ? ' key--mod-soft' : ''}`}>{g.group}</h3>
                <ul className="keyboard__keys">
                  {g.items.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        className={`key${learning ? ' key--slot' : ''}`}
                        data-skill={s}
                        data-learning={learning ? '1' : '0'}
                        onPointerEnter={() => say(s, learning)}
                        onFocus={() => say(s, learning)}
                        onClick={() => say(s, learning)}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
