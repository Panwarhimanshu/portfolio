import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { DemoBar, usePortfolio } from './Demos.jsx';
import './physics.css';

const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

function Playground({ data }) {
  const { profile, projects, skills } = data;
  const box = useRef(null);
  const els = useRef([]);
  const api = useRef(null);
  const [open, setOpen] = useState(null);

  const letters = [...profile.name.toUpperCase()];
  const skillItems = skills.flatMap((g, gi) => g.items.map((s) => ({ s, soft: gi === skills.length - 1 && skills.length > 1 })));
  const items = [
    ...letters.map((ch, i) => ({ kind: 'letter', key: `l${i}`, label: ch })),
    ...projects.map((p, i) => ({ kind: 'project', key: `p${i}`, p, i })),
    ...skillItems.map((k, i) => ({ kind: 'skill', key: `s${i}`, label: k.s, soft: k.soft }))
  ];

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const engine = Engine.create({ gravity: { y: 1.1 } });
    const W = () => root.clientWidth;
    const H = () => root.clientHeight;

    // Walls: floor, sides, and a ceiling far above so things can fall in
    let walls = [];
    const buildWalls = () => {
      Composite.remove(engine.world, walls);
      const t = 200;
      walls = [
        Bodies.rectangle(W() / 2, H() + t / 2, W() * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H() / 2 - 1000, t, H() * 2 + 2000, { isStatic: true }),
        Bodies.rectangle(W() + t / 2, H() / 2 - 1000, t, H() * 2 + 2000, { isStatic: true })
      ];
      Composite.add(engine.world, walls);
    };
    buildWalls();

    // One body per element, sized from the element itself
    const bodies = els.current.map((el, i) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const it = items[i];
      const isLetter = it.kind === 'letter';
      const x = isLetter
        ? W() * 0.12 + (i / Math.max(1, letters.length - 1)) * W() * 0.7
        : 60 + Math.random() * (W() - 120);
      const y = isLetter ? -200 - i * 40 : -400 - Math.random() * 1600;
      const b = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: Math.min(12, h / 4) },
        restitution: isLetter ? 0.35 : 0.25,
        friction: 0.3,
        density: isLetter ? 0.004 : 0.0015,
        angle: (Math.random() - 0.5) * (isLetter ? 0.3 : 1.2)
      });
      b.plugin.i = i;
      return b;
    });
    Composite.add(engine.world, bodies);

    // Grab and throw
    const mouse = Mouse.create(root);
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    mouse.element.removeEventListener('wheel', mouse.mousewheel);
    const grab = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } } });
    Composite.add(engine.world, grab);

    // A click without dragging on a project card opens it
    let down = null;
    Events.on(grab, 'mousedown', (e) => { down = { x: e.mouse.position.x, y: e.mouse.position.y, t: performance.now() }; });
    Events.on(grab, 'mouseup', (e) => {
      if (!down) return;
      const moved = Math.hypot(e.mouse.position.x - down.x, e.mouse.position.y - down.y);
      if (moved < 6 && performance.now() - down.t < 400) {
        const hit = Matter.Query.point(bodies, e.mouse.position)[0];
        const it = hit && items[hit.plugin.i];
        if (it?.kind === 'project') setOpen(it.i);
      }
      down = null;
    });
    Events.on(grab, 'mousemove', (e) => {
      const hit = Matter.Query.point(bodies, e.mouse.position)[0];
      root.style.cursor = grab.body ? 'grabbing' : hit ? 'grab' : '';
    });

    // Draw: move each element to its body
    let raf = 0, last = performance.now();
    const tick = (now) => {
      Engine.update(engine, Math.min(32, now - last));
      last = now;
      bodies.forEach((b, i) => {
        const el = els.current[i];
        if (!el) return;
        // Anything that escapes gets dropped back in
        if (b.position.y > H() + 400 || b.position.x < -400 || b.position.x > W() + 400) {
          Body.setPosition(b, { x: W() / 2, y: -200 }); Body.setVelocity(b, { x: 0, y: 0 });
        }
        el.style.transform = `translate(${b.position.x - el.offsetWidth / 2}px, ${b.position.y - el.offsetHeight / 2}px) rotate(${b.angle}rad)`;
      });
      raf = requestAnimationFrame(tick);
    };
    if (reduce) {
      // Settle instantly instead of animating the fall
      for (let k = 0; k < 600; k++) Engine.update(engine, 16);
    }
    raf = requestAnimationFrame(tick);

    const onResize = () => buildWalls();
    window.addEventListener('resize', onResize);

    api.current = {
      shake() {
        bodies.forEach((b) => Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.06 * b.mass, y: -(0.04 + Math.random() * 0.06) * b.mass }));
      },
      flip() { engine.gravity.y = -engine.gravity.y; },
      zeroG() { engine.gravity.y = engine.gravity.y === 0 ? 1.1 : 0; bodies.forEach((b) => Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.05)); }
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      Events.off(grab);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      Mouse.clearSourceEvents?.(mouse);
    };
  }, []);

  const p = open != null ? projects[open] : null;

  return (
    <div className="phys">
      <header className="phys__head">
        <p className="phys__kicker">{profile.role}, {profile.location}</p>
        <p className="phys__headline">{profile.headline}</p>
        <div className="phys__tools">
          <button type="button" className="key key--sm" onClick={() => api.current?.shake()}>Shake</button>
          <button type="button" className="key key--sm" onClick={() => api.current?.zeroG()}>Zero gravity</button>
          <button type="button" className="key key--sm" onClick={() => api.current?.flip()}>Flip gravity</button>
        </div>
        <p className="phys__hint">Grab anything and throw it. Click a project card to open it</p>
      </header>

      <div className="phys__box" ref={box}>
        {items.map((it, i) => (
          <div key={it.key} ref={(el) => (els.current[i] = el)} className={`phys__body phys__body--${it.kind}${it.soft ? ' is-soft' : ''}${it.p?.featured ? ' is-featured' : ''}`}>
            {it.kind === 'letter' && it.label}
            {it.kind === 'skill' && it.label}
            {it.kind === 'project' && (
              <>
                <span className="phys__meta">{[it.p.year, it.p.category].filter(Boolean).join(' · ')}</span>
                <span className="phys__title">{it.p.title}</span>
                <span className="phys__open">Open ↗</span>
              </>
            )}
          </div>
        ))}
      </div>

      <footer className="phys__contact">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        {profile.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}
      </footer>

      {p && (
        <div className="phys__modal" role="dialog" aria-modal="true" aria-label={p.title} onClick={() => setOpen(null)}>
          <div className="phys__sheet" onClick={(e) => e.stopPropagation()}>
            <p className="phys__meta">{[p.year, p.role, p.category].filter(Boolean).join(' · ')}</p>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p className="phys__tags">{(p.tags || []).join(' / ')}</p>
            <div className="phys__links">
              {p.live && <a href={p.live} target="_blank" rel="noreferrer">Visit the site</a>}
              {p.code && <a href={p.code} target="_blank" rel="noreferrer">Read the code</a>}
              <button type="button" className="key key--sm" onClick={() => setOpen(null)} autoFocus>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Physics() {
  const data = usePortfolio();
  useEffect(() => { document.title = 'Design 2: Physics playground'; }, []);
  if (data === false) return <p style={{ padding: 40 }}>Could not load the portfolio</p>;
  if (!data) return <div className="demo-loading">Loading</div>;
  return (
    <>
      <Playground data={data} />
      <DemoBar id="physics" />
    </>
  );
}
