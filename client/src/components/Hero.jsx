import { useEffect, useRef, useState } from 'react';
import Orbit from './Orbit.jsx';

// Your photo as a thick printed card, standing at an angle
function PhotoCard({ profile }) {
  const [ok, setOk] = useState(Boolean(profile.photo));
  if (!ok) return null;
  return (
    <figure className="photo-card">
      <div className="photo-card__slab">
        <img src={profile.photo} alt={profile.name} width="1000" height="1250" onError={() => setOk(false)} />
      </div>
      <figcaption className="mono">{profile.name}, {profile.location}</figcaption>
    </figure>
  );
}

// The 3D headline turns a few degrees toward the mouse
function useHeadlineTilt(ref) {
  useEffect(() => {
    const host = ref.current;
    const title = host?.querySelector('.hero__title');
    if (!host || !title) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    const move = (e) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        title.style.setProperty('--hx', `${(x * 16).toFixed(2)}deg`);
        title.style.setProperty('--hy', `${(-y * 12).toFixed(2)}deg`);
      });
    };
    const leave = () => {
      title.style.setProperty('--hx', '0deg');
      title.style.setProperty('--hy', '0deg');
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

const isDarkNow = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/*
  The 3D keyboard (Three.js, loaded only when needed), plus the headline it types out.
  Returns how many headline letters are visible so far.
*/
function useKeyboard3D(canvasRef, boxRef, text) {
  const scene = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(reduce ? text.length : 0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Load Three.js and build the scene
  useEffect(() => {
    let cancelled = false;
    import('../three/keyboardScene.js')
      .then(({ createKeyboardScene }) => {
        if (cancelled || !canvasRef.current) return;
        try {
          scene.current = createKeyboardScene(canvasRef.current, { dark: isDarkNow() });
          setReady(true);
        } catch {
          setFailed(true); // no WebGL: the page still works without the keyboard
        }
      })
      .catch(() => setFailed(true));
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, [canvasRef]);

  // Type the headline, pressing the matching 3D key for each letter
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    let id = 0;
    const start = setTimeout(() => {
      id = setInterval(() => {
        i += 1;
        scene.current?.press(text[i - 1]);
        setCount(i);
        if (i >= text.length) clearInterval(id);
      }, 48);
    }, ready || failed ? 250 : 1200);
    return () => { clearTimeout(start); clearInterval(id); };
  }, [text, ready, failed, reduce]);

  // Scroll: the keycaps fly apart as the hero leaves the screen
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = boxRef.current;
        if (!box) return;
        const start = Math.max(0, box.offsetTop + box.offsetHeight * 0.55 - window.innerHeight);
        const p = (window.scrollY - start) / (window.innerHeight * 0.7);
        scene.current?.setScroll(p);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [boxRef, ready]);

  // Typing on your real keyboard presses the 3D keys too
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      scene.current?.press(e.key === 'Enter' ? '\n' : e.key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Follow light / dark mode
  useEffect(() => {
    const sync = () => scene.current?.setDark(isDarkNow());
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', sync);
    return () => { mo.disconnect(); media.removeEventListener('change', sync); };
  }, []);

  return { count, failed };
}

export default function Hero({ profile, projects }) {
  const top = useRef(null);
  const canvas = useRef(null);
  const kbBox = useRef(null);
  const text = profile.headline || '';
  const { count, failed } = useKeyboard3D(canvas, kbBox, text);
  useHeadlineTilt(top);
  const typing = count < text.length;

  return (
    <section className="hero3d" id="top" ref={top}>
      <div className="wrap hero3d__top">
        <div className="hero3d__text">
          <p className="hero__where mono">{profile.role}, {profile.location}</p>
          <h1 className={`hero__title${typing ? ' is-typing' : ''}`} aria-label={text}>
            <span aria-hidden="true">{text.slice(0, count)}</span>
            {typing && <span className="type-caret" aria-hidden="true" />}
            <span className="ghost" aria-hidden="true">{text.slice(count)}</span>
          </h1>
          <p className="hero__intro">{profile.intro}</p>
          <div className="hero__actions">
            <a className="btn btn--solid" href="#work">See the work</a>
            {profile.resume && <a className="btn btn--line" href={profile.resume}>Résumé, PDF</a>}
          </div>
        </div>
        <PhotoCard profile={profile} />
      </div>
      {!failed && (
        <div className="kb3d" ref={kbBox} aria-hidden="true">
          <canvas ref={canvas} className="kb3d__canvas" />
          <p className="kb3d__hint mono">Type on your keyboard</p>
        </div>
      )}
      <Orbit projects={projects} />
    </section>
  );
}
