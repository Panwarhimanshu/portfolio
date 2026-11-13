import { useEffect, useRef, useState } from 'react';
import { DemoBar, usePortfolio } from './Demos.jsx';
import './neon.css';

/*
  A particle field behind the whole page. Particles form a word, scatter away from the mouse,
  burst on click, and re-form into each section's title as you scroll.
*/
function particleField(canvas) {
  const g = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1;
  let parts = [];
  let word = '';
  let side = 'center';
  const mouse = { x: -9999, y: -9999 };

  const COLORS = ['#3df2ff', '#5b8cff', '#a96bff', '#ff4fd8'];

  function targetsFor(text) {
    const off = document.createElement('canvas');
    const scale = side === 'center' ? 1 : 0.62;
    const w = Math.floor(W * scale), h = Math.floor(H * 0.6);
    off.width = w; off.height = h;
    const o = off.getContext('2d');
    let size = Math.min(h * 0.75, (w * 1.7) / Math.max(4, text.length));
    o.font = `800 ${size}px "Libre Franklin", system-ui, sans-serif`;
    while (o.measureText(text).width > w * 0.92 && size > 20) { size -= 4; o.font = `800 ${size}px "Libre Franklin", system-ui, sans-serif`; }
    o.fillStyle = '#fff';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText(text, w / 2, h / 2);
    const data = o.getImageData(0, 0, w, h).data;
    const step = Math.max(4, Math.round(Math.sqrt((w * h) / 9000) * 1.6));
    const pts = [];
    const ox = side === 'center' ? (W - w) / 2 : W - w - W * 0.02;
    const oy = side === 'center' ? (H - h) / 2 - H * 0.04 : (H - h) / 2;
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push([ox + x + (Math.random() - 0.5) * step * 0.9, oy + y + (Math.random() - 0.5) * step * 0.9]);
    }
    return pts;
  }

  function setWord(text, where = 'center') {
    if (text === word && where === side) return;
    word = text; side = where;
    const pts = targetsFor(text);
    // Reuse particles, add or drop as needed
    while (parts.length < pts.length) {
      parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, tx: 0, ty: 0, c: COLORS[(Math.random() * COLORS.length) | 0], s: Math.random() < 0.15 ? 2.6 : 1.6, free: false });
    }
    parts.forEach((p, i) => {
      if (i < pts.length) { p.tx = pts[i][0]; p.ty = pts[i][1]; p.free = false; }
      else { p.free = true; p.tx = Math.random() * W; p.ty = Math.random() * H; }
    });
    // Shuffle which particle goes where, so the morph swirls
    for (let i = Math.min(parts.length, pts.length) - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [parts[i].tx, parts[j].tx] = [parts[j].tx, parts[i].tx];
      [parts[i].ty, parts[j].ty] = [parts[j].ty, parts[i].ty];
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = word; word = '';
    if (w) setWord(w, side);
  }

  function burst(x, y) {
    parts.forEach((p) => {
      const dx = p.x - x, dy = p.y - y;
      const d = Math.hypot(dx, dy) + 1;
      const f = Math.min(40, 4000 / d);
      p.vx += (dx / d) * f; p.vy += (dy / d) * f;
    });
  }

  let raf = 0, dim = 1;
  function frame() {
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = 'rgba(5, 5, 9, 0.28)';
    g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    const t = performance.now() / 1000;
    for (const p of parts) {
      // spring toward the target, wander a little when free
      const tx = p.free ? p.tx + Math.sin(t + p.ty) * 30 : p.tx;
      const ty = p.free ? p.ty + Math.cos(t + p.tx) * 30 : p.ty;
      p.vx += (tx - p.x) * (p.free ? 0.002 : 0.045);
      p.vy += (ty - p.y) * (p.free ? 0.002 : 0.045);
      // mouse pushes particles away
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120) {
        const d = Math.sqrt(d2) + 0.1;
        const f = (120 - d) * 0.9;
        p.vx += (dx / d) * f * 0.12; p.vy += (dy / d) * f * 0.12;
      }
      p.vx *= 0.84; p.vy *= 0.84;
      p.x += p.vx; p.y += p.vy;
      const a = (p.free ? 0.25 : 0.95) * dim;
      g.globalAlpha = a * 0.18;
      g.fillStyle = p.c;
      g.fillRect(p.x - p.s * 1.6, p.y - p.s * 1.6, p.s * 3.2, p.s * 3.2); // glow
      g.globalAlpha = a;
      g.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
    }
    g.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  const onLeave = () => { mouse.x = mouse.y = -9999; };
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize);
  resize();
  if (reduce) {
    // Draw the word once, still
    raf = 0;
  }
  raf = requestAnimationFrame(frame);

  return {
    setWord,
    burst,
    setDim(v) { dim = v; },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    }
  };
}

function Glitch({ as: Tag = 'h2', children }) {
  return <Tag className="glitch" data-text={children}>{children}</Tag>;
}

function NeonPage({ data }) {
  const { profile, projects, skills, experience } = data;
  const canvas = useRef(null);
  const field = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    field.current = particleField(canvas.current);
    const name = profile.name.toUpperCase();
    // Wait for the font so the letters sample correctly
    (document.fonts?.ready || Promise.resolve()).then(() => field.current?.setWord(name));

    const words = { top: [name, 'center', 1], work: ['WORK', 'right', 0.45], skills: ['SKILLS', 'right', 0.45], path: ['PATH', 'right', 0.45], contact: ['HELLO', 'center', 0.6] };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const [w, side, dim] = words[e.target.dataset.word];
        field.current?.setWord(w, side);
        field.current?.setDim(dim);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('[data-word]').forEach((s) => io.observe(s));

    const onClick = (e) => { if (!e.target.closest('a, button')) field.current?.burst(e.clientX, e.clientY); };
    window.addEventListener('click', onClick);
    return () => { io.disconnect(); window.removeEventListener('click', onClick); field.current?.dispose(); };
  }, [profile.name]);

  const copy = () => navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });

  return (
    <div className="neon">
      <canvas ref={canvas} className="neon__field" aria-hidden="true" />

      <section className="n-hero" data-word="top">
        <p className="n-kicker">&gt; {profile.role.toLowerCase()} · {profile.location.toLowerCase()}<span className="n-caret" /></p>
        <h1 className="n-sr">{profile.name}</h1>
        <p className="n-headline">{profile.headline}</p>
        <p className="n-hint">Move your mouse through the letters. Click anywhere to blow them up</p>
      </section>

      <section className="n-sec" data-word="work">
        <Glitch>Work</Glitch>
        <div className="n-grid">
          {projects.map((p, i) => (
            <article className="n-card" key={p.title} style={{ '--h': `${(i * 70 + 190) % 360}` }}>
              <p className="n-meta">{String(i + 1).padStart(2, '0')} · {[p.year, p.category].filter(Boolean).join(' · ')}</p>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p className="n-tags">{(p.tags || []).map((t) => <span key={t}>{t}</span>)}</p>
              <p className="n-links">
                {p.live && <a href={p.live} target="_blank" rel="noreferrer">live ↗</a>}
                {p.code && <a href={p.code} target="_blank" rel="noreferrer">code ↗</a>}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="n-sec" data-word="skills">
        <Glitch>Skills</Glitch>
        {skills.map((g) => (
          <div className="n-skillrow" key={g.group}>
            <p className="n-meta">{g.group.toLowerCase()}</p>
            <p className="n-skills">{g.items.map((s) => <span key={s}>{s}</span>)}</p>
          </div>
        ))}
      </section>

      <section className="n-sec" data-word="path">
        <Glitch>Path</Glitch>
        <ol className="n-path">
          {experience.map((e) => (
            <li key={e.dates + e.title}>
              <span className="n-meta">{e.dates}</span>
              <b>{e.title}{e.org ? ` · ${e.org}` : ''}</b>
              <span>{e.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="n-sec n-contact" data-word="contact">
        <p className="n-kicker">{profile.availability}</p>
        <a className="n-email" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p className="n-links">
          <button type="button" className="n-btn" onClick={copy}>{copied ? 'copied' : 'copy email'}</button>
          {profile.links.map((l) => <a key={l.url} href={l.url}>{l.label.toLowerCase()} ↗</a>)}
        </p>
      </section>
    </div>
  );
}

export default function Neon() {
  const data = usePortfolio();
  useEffect(() => { document.title = 'Design 4: Dark neon'; }, []);
  if (data === false) return <p style={{ padding: 40 }}>Could not load the portfolio</p>;
  if (!data) return <div className="demo-loading">Loading</div>;
  return (
    <>
      <NeonPage data={data} />
      <DemoBar id="neon" />
    </>
  );
}
