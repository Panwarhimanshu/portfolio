import { useEffect, useRef, useState } from 'react';
import { DemoBar, usePortfolio } from './Demos.jsx';
import BrowserWindow from '../components/BrowserWindow.jsx';
import './cinematic.css';

/*
  One pinned screen, five chapters, all driven by scroll position:
  0.00-0.16  your name in giant letters that break apart in 3D
  0.16-0.40  the 3D keyboard explodes while the headline appears
  0.40-0.74  projects fly at you through a tunnel, one by one
  0.74-0.90  skills slide past in giant rows
  0.90-1.00  contact
*/
const CH = [[0, 0.16], [0.16, 0.4], [0.4, 0.74], [0.74, 0.9], [0.9, 1]];
const local = (p, [a, b]) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const ease = (t) => t * t * (3 - 2 * t);

function Film({ data }) {
  const { profile, projects, skills } = data;
  const stage = useRef(null);
  const canvas = useRef(null);
  const kb = useRef(null);
  const [chapter, setChapter] = useState(0);
  const letters = [...profile.name.toUpperCase()];
  const rows = skills.map((g) => g.items);

  // The keyboard scene from the main site, reused for chapter 2
  useEffect(() => {
    let alive = true;
    import('../three/keyboardScene.js').then(({ createKeyboardScene }) => {
      if (!alive || !canvas.current) return;
      try { kb.current = createKeyboardScene(canvas.current, { dark: true }); } catch { /* no WebGL */ }
    });
    return () => { alive = false; kb.current?.dispose(); };
  }, []);

  useEffect(() => {
    const el = stage.current;
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      el.style.setProperty('--p', p.toFixed(4));
      CH.forEach((c, i) => el.style.setProperty(`--c${i}`, local(p, c).toFixed(4)));
      setChapter(CH.findIndex(([a, b]) => p >= a && p <= b));

      // Chapter 1: letters fly apart
      const c0 = ease(local(p, CH[0]));
      el.querySelectorAll('.cin-letter').forEach((L, i) => {
        const dir = i - (letters.length - 1) / 2;
        L.style.transform = `translate3d(${dir * c0 * 90}px, ${(i % 2 ? -1 : 1) * c0 * 160}px, ${c0 * (300 + (i % 3) * 400)}px) rotateX(${c0 * (i % 2 ? 70 : -70)}deg) rotateY(${dir * c0 * 18}deg)`;
        L.style.opacity = String(1 - c0);
      });

      // Chapter 2: keyboard explodes
      const c1 = local(p, CH[1]);
      kb.current?.setScroll(Math.max(0, (c1 - 0.25) / 0.7));
      if (canvas.current) canvas.current.parentElement.style.opacity = String(p < CH[1][0] - 0.04 || p > CH[1][1] + 0.02 ? 0 : 1);

      // Chapter 3: projects come through a tunnel
      const c2 = local(p, CH[2]);
      el.querySelectorAll('.cin-shot').forEach((S, i) => {
        const n = projects.length;
        const t = c2 * (n + 0.6) - i;           // 0 = arriving, 1 = passing the camera
        const z = -2400 + t * 2600;
        const x = (i % 2 ? 1 : -1) * (1 - Math.min(1, Math.max(0, t))) * 260;
        S.style.transform = `translate3d(calc(-50% + ${x}px), -50%, ${z}px) rotateY(${(i % 2 ? -1 : 1) * (1 - t) * 18}deg)`;
        S.style.opacity = String(t < -0.2 ? 0 : t > 1.05 ? 0 : Math.min(1, (t + 0.2) * 3));
      });
      const active = Math.min(projects.length - 1, Math.max(0, Math.floor(c2 * (projects.length + 0.6) - 0.35)));
      el.style.setProperty('--active', active);
      el.querySelectorAll('.cin-ptext').forEach((T, i) => T.classList.toggle('is-on', i === active && c2 > 0 && c2 < 1));

      // Chapter 4: skill rows slide in opposite directions
      const c3 = local(p, CH[3]);
      el.querySelectorAll('.cin-row').forEach((R, i) => {
        R.style.transform = `translateX(${(i % 2 ? -1 : 1) * (c3 - 0.5) * 60}vw)`;
      });
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, [letters.length, projects.length]);

  return (
    <div className="cin">
      <div className="cin__track">
        <div className="cin__stage" ref={stage} data-chapter={chapter}>

          {/* 1. Name */}
          <section className="cin-ch cin-ch--name">
            <p className="cin-kicker">{profile.role}, {profile.location}</p>
            <h1 className="cin-name" aria-label={profile.name}>
              {letters.map((l, i) => <span className="cin-letter" key={i} aria-hidden="true">{l}</span>)}
            </h1>
            <p className="cin-scroll">Scroll</p>
          </section>

          {/* 2. Keyboard + headline */}
          <section className="cin-ch cin-ch--kb">
            <div className="cin-kb"><canvas ref={canvas} /></div>
            <h2 className="cin-headline">{profile.headline}</h2>
          </section>

          {/* 3. Projects tunnel */}
          <section className="cin-ch cin-ch--work">
            <div className="cin-tunnel">
              {projects.map((pr) => (
                <div className="cin-shot" key={pr.title}><BrowserWindow project={pr} /></div>
              ))}
            </div>
            <div className="cin-ptexts">
              {projects.map((pr, i) => (
                <div className="cin-ptext" key={pr.title}>
                  <p className="cin-kicker">{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {[pr.year, pr.category].filter(Boolean).join(' · ')}</p>
                  <h3>{pr.title}</h3>
                  <p>{pr.description}</p>
                  <p className="cin-links">
                    {pr.live && <a href={pr.live} target="_blank" rel="noreferrer">Visit</a>}
                    {pr.code && <a href={pr.code} target="_blank" rel="noreferrer">Code</a>}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Skills */}
          <section className="cin-ch cin-ch--skills">
            {rows.map((items, i) => (
              <div className={`cin-row${i === rows.length - 1 && rows.length > 1 ? ' is-soft' : ''}`} key={i}>
                {[...items, ...items].map((s, k) => <span key={k}>{s}</span>)}
              </div>
            ))}
          </section>

          {/* 5. Contact */}
          <section className="cin-ch cin-ch--contact">
            <p className="cin-kicker">{profile.availability}</p>
            <a className="cin-email" href={`mailto:${profile.email}`}>{profile.email}</a>
            <p className="cin-links">{profile.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}</p>
          </section>

          <div className="cin-progress" aria-hidden="true"><span /></div>
        </div>
      </div>
    </div>
  );
}

export default function Cinematic() {
  const data = usePortfolio();
  useEffect(() => { document.title = 'Design 3: Cinematic scroll'; }, []);
  if (data === false) return <p style={{ padding: 40 }}>Could not load the portfolio</p>;
  if (!data) return <div className="demo-loading">Loading</div>;
  return (
    <>
      <Film data={data} />
      <DemoBar id="cinematic" />
    </>
  );
}
