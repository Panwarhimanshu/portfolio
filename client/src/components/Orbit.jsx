import { useEffect, useRef, useState } from 'react';
import BrowserWindow from './BrowserWindow.jsx';

export const projectId = (title = '') => `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

const norm = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;

/*
  Your projects standing in a 3D ring.
  Drag, use the arrow keys or the buttons to turn it. Click a window to bring it to the front,
  click the front one to jump to that project. It moves on by itself every few seconds
  unless someone is using it, and never for people who ask for reduced motion.
*/
export default function Orbit({ projects }) {
  const stage = useRef(null);
  const cards = useRef([]);
  const s = useRef({ angle: 0, target: null, dragging: false, moved: 0, lastX: 0, lastT: 0, vel: 0, hover: false, front: 0, idle: 0 });
  const [front, setFront] = useState(0);
  const n = projects.length;
  const step = 360 / n;

  const snap = (a) => Math.round(a / step) * step;
  const goTo = (i) => {
    const cur = s.current;
    const base = cur.target ?? cur.angle;
    cur.target = base + norm(-i * step - base);
    cur.idle = 0;
  };
  const turn = (dir) => {
    const cur = s.current;
    cur.target = snap(cur.target ?? cur.angle) - dir * step;
    cur.idle = 0;
  };

  useEffect(() => {
    const el = stage.current;
    if (!el || !n) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      const cw = cards.current[0]?.offsetWidth || 480;
      const R = cw * (n <= 2 ? 0.55 : n === 3 ? 0.72 : 0.86);
      let best = 0, bestAbs = 999;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const th = norm(i * step + s.current.angle);
        const rad = (th * Math.PI) / 180;
        const d = (1 - Math.cos(rad)) / 2; // 0 front, 1 back
        const x = Math.sin(rad) * R;
        const z = (Math.cos(rad) - 1) * R;
        card.style.transform = `translate3d(${x.toFixed(1)}px, ${(-d * 28).toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(th * 0.42).toFixed(2)}deg)`;
        card.style.zIndex = String(100 - Math.round(d * 100));
        card.style.setProperty('--d', d.toFixed(3));
        if (Math.abs(th) < bestAbs) { bestAbs = Math.abs(th); best = i; }
      });
      if (best !== s.current.front) { s.current.front = best; setFront(best); }
    };

    const tick = (now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const cur = s.current;
      if (!cur.dragging) {
        if (cur.target != null) {
          const diff = cur.target - cur.angle;
          cur.angle += reduce ? diff : diff * Math.min(1, dt * 7);
          if (Math.abs(diff) < 0.03) { cur.angle = cur.target; cur.target = null; }
        } else if (!reduce && !cur.hover && !document.hidden) {
          cur.idle += dt;
          if (cur.idle > 4.5) turn(1);
        }
      }
      layout();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Dragging
    const down = (e) => {
      const cur = s.current;
      cur.dragging = true; cur.moved = 0; cur.lastX = e.clientX; cur.lastT = performance.now(); cur.vel = 0; cur.target = null;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      const cur = s.current;
      if (!cur.dragging) return;
      const now = performance.now();
      const dx = e.clientX - cur.lastX;
      cur.moved += Math.abs(dx);
      cur.angle += dx * 0.28;
      cur.vel = (dx * 0.28) / Math.max(1, now - cur.lastT) * 1000;
      cur.lastX = e.clientX; cur.lastT = now;
    };
    const up = (e) => {
      const cur = s.current;
      if (!cur.dragging) return;
      cur.dragging = false; cur.idle = 0;
      if (cur.moved < 6) {
        // A click: bring that window forward, or open the front one's details
        const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('.orbit__card');
        const i = hit ? Number(hit.dataset.i) : -1;
        if (i >= 0 && i === cur.front) {
          document.getElementById(projectId(projects[i].title))?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        } else if (i >= 0) goTo(i);
        cur.target = cur.target ?? snap(cur.angle);
      } else {
        cur.target = snap(cur.angle + Math.max(-90, Math.min(90, cur.vel * 0.25)));
      }
    };
    const enter = () => { s.current.hover = true; };
    const leave = () => { s.current.hover = false; s.current.idle = 0; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, [n, step, projects]);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
    if (e.key === 'Enter') document.getElementById(projectId(projects[front].title))?.scrollIntoView({ block: 'center' });
  };

  if (!n) return null;
  const p = projects[front];

  return (
    <div className="orbit">
      <div
        className="orbit__stage"
        ref={stage}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects. Use the left and right arrow keys to turn, Enter to open"
        onKeyDown={onKey}
        onFocus={() => { s.current.hover = true; }}
        onBlur={() => { s.current.hover = false; }}
      >
        <div className="orbit__ring">
          {projects.map((proj, i) => (
            <div className="orbit__card" key={proj.title} data-i={i} ref={(el) => (cards.current[i] = el)} aria-hidden={i !== front}>
              <BrowserWindow project={proj} />
            </div>
          ))}
        </div>
        <div className="orbit__floor" aria-hidden="true" />
      </div>

      <div className="wrap orbit__bar">
        <p className="orbit__caption" aria-live="polite">
          <span className="mono orbit__count">{String(front + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <a href={`#${projectId(p.title)}`} className="orbit__title">{p.title}</a>
          <span className="orbit__meta">{[p.year, p.category].filter(Boolean).join(' · ')}</span>
        </p>
        <div className="orbit__keys">
          <button type="button" className="key key--sm" onClick={() => turn(-1)} aria-label="Previous project">←</button>
          <button type="button" className="key key--sm" onClick={() => turn(1)} aria-label="Next project">→</button>
        </div>
      </div>
    </div>
  );
}
