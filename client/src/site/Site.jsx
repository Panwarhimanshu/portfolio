import '../legacy.js';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import BrowserWindow from '../components/BrowserWindow.jsx';
import './site.css';

gsap.registerPlugin(ScrollTrigger);

const REDUCE = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

const split = (text, cls) => [...text].map((ch, i) => (
  <span className={cls} key={i} aria-hidden="true">{ch === ' ' ? ' ' : ch}</span>
));

/* ---------------- Smooth scroll ---------------- */
let lenis = null;
function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled || REDUCE) return;
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Anchor links glide too
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20, duration: 1.4 });
    };
    document.addEventListener('click', onClick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenis = null; document.removeEventListener('click', onClick); };
  }, [enabled]);
}

/* ---------------- Cursor ---------------- */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (!FINE || REDUCE) return;
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.08 });
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.08 });
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3' });
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); };
    const over = (e) => {
      const el = e.target.closest('[data-cursor], a, button');
      document.body.classList.toggle('cursor-hover', !!el);
      setLabel(el?.dataset.cursor || '');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    document.body.classList.add('has-cursor');
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); document.body.classList.remove('has-cursor', 'cursor-hover'); };
  }, []);
  if (!FINE || REDUCE) return null;
  return (
    <>
      <div className="cur-dot" ref={dot} />
      <div className={`cur-ring${label ? ' has-label' : ''}`} ref={ring}><span>{label}</span></div>
    </>
  );
}

/* Buttons that lean toward the cursor */
function Magnetic({ children, strength = 0.35 }) {
  const el = useRef(null);
  useEffect(() => {
    if (!FINE || REDUCE) return;
    const node = el.current;
    const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const r = node.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); };
  }, [strength]);
  return <span className="magnetic" ref={el}>{children}</span>;
}

/* ---------------- Preloader ---------------- */
function Preloader({ name, onDone }) {
  const root = useRef(null);
  const [n, setN] = useState(0);
  useLayoutEffect(() => {
    const seen = sessionStorage.getItem('seen-intro');
    if (REDUCE || seen) { onDone(); return; }
    const ctx = gsap.context(() => {
      const c = { v: 0 };
      gsap.timeline({ onComplete: () => { try { sessionStorage.setItem('seen-intro', '1'); } catch { /* ignore */ } onDone(); } })
        .to(c, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => setN(Math.round(c.v)) })
        .to('.pre__name span', { yPercent: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to('.pre__name span', { yPercent: -110, stagger: 0.03, duration: 0.5, ease: 'power3.in' }, '+=0.15')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.2');
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div className="pre" ref={root}>
      <p className="pre__name">{split(name, '')}</p>
      <p className="pre__count">{String(n).padStart(3, '0')}</p>
    </div>
  );
}

/* ---------------- Nav ---------------- */
function useClock(tz = 'Asia/Kolkata') {
  const fmt = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 10000); return () => clearInterval(id); }, []);
  return t;
}

function Nav({ profile }) {
  const time = useClock();
  return (
    <header className="snav">
      <a href="#top" className="snav__logo" data-cursor="Top">{profile.name}<sup>©</sup></a>
      <p className="snav__meta">{profile.location}, IN · {time} IST</p>
      <nav className="snav__links">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ profile, ready }) {
  const root = useRef(null);
  const nameRef = useRef(null);

  // Make the name fill the width exactly
  useLayoutEffect(() => {
    const fit = () => {
      const el = nameRef.current;
      if (!el) return;
      el.style.fontSize = '100px';
      const w = el.scrollWidth;
      el.style.fontSize = `${(100 * el.parentElement.clientWidth) / w}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      if (REDUCE) return;
      gsap.timeline()
        .from('.h__name .ch', { yPercent: 115, rotate: 6, stagger: 0.045, duration: 1.1, ease: 'power4.out' })
        .from('.h__line', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.inOut' }, 0.2)
        .from('.h__top > *', { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.4)
        .from('.h__photo', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power4.inOut' }, 0.3)
        .from('.h__photo img', { scale: 1.4, duration: 1.6, ease: 'power3.out' }, 0.3)
        .from('.h__copy > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' }, 0.7);
      // Name drifts up and the photo grows as you scroll away
      gsap.to('.h__name', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.h__photo', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="h" id="top" ref={root}>
      <div className="h__top">
        <span>{profile.role}</span>
        <span>Based in {profile.location}, India</span>
        <span className="h__avail"><i />Available for work</span>
      </div>
      <div className="h__namewrap">
        <h1 className="h__name" ref={nameRef} aria-label={profile.name}>{split(profile.name.toUpperCase(), 'ch')}</h1>
      </div>
      <div className="h__line" />
      <div className="h__bottom">
        <div className="h__copy">
          <p className="h__headline">{profile.headline}</p>
          <div className="h__actions">
            <Magnetic><a className="pill pill--solid" href="#work" data-cursor="Go">See my work</a></Magnetic>
            {profile.resume && <Magnetic><a className="pill" href={profile.resume} data-cursor="PDF">Résumé</a></Magnetic>}
          </div>
        </div>
        {profile.photo && (
          <figure className="h__photo">
            <img src={profile.photo} alt={profile.name} onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} />
          </figure>
        )}
        <p className="h__scroll">Scroll<span /></p>
      </div>
    </section>
  );
}

/* ---------------- Skills marquee: speeds up with scroll ---------------- */
function Marquee({ skills }) {
  const root = useRef(null);
  const rows = useMemo(() => {
    const all = skills.flatMap((g) => g.items);
    const half = Math.ceil(all.length / 2);
    return [all.slice(0, half), all.slice(half)];
  }, [skills]);

  useLayoutEffect(() => {
    if (REDUCE) return;
    const ctx = gsap.context(() => {
      const tweens = gsap.utils.toArray('.mq__track').map((t, i) =>
        gsap.to(t, { xPercent: i % 2 ? 0 : -50, startAt: { xPercent: i % 2 ? -50 : 0 }, duration: 28, ease: 'none', repeat: -1 }));
      let dir = 1;
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          dir = self.direction;
          const boost = 1 + Math.min(6, Math.abs(self.getVelocity()) / 300);
          tweens.forEach((tw) => gsap.to(tw, { timeScale: boost * dir, duration: 0.2, overwrite: true }));
          gsap.delayedCall(0.25, () => tweens.forEach((tw) => gsap.to(tw, { timeScale: dir, duration: 1, overwrite: true })));
        }
      });
    }, root);
    return () => ctx.revert();
  }, [rows]);

  return (
    <section className="mq" ref={root} aria-label="Skills">
      {rows.map((r, i) => (
        <div className={`mq__row${i ? ' mq__row--alt' : ''}`} key={i}>
          <div className="mq__track">
            {[...r, ...r, ...r, ...r].map((s, k) => <span key={k}>{s}<b>✦</b></span>)}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------------- About: words light up as you scroll ---------------- */
function About({ profile, skills }) {
  const root = useRef(null);
  const words = `${profile.intro}`.split(' ');
  useLayoutEffect(() => {
    if (REDUCE) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.ab__text .w', { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.ab__text', start: 'top 80%', end: 'bottom 45%', scrub: true }
      });
      gsap.from('.ab__col', { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.ab__cols', start: 'top 85%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="ab" id="about" ref={root}>
      <p className="eyebrow">(About)</p>
      <p className="ab__text">{words.map((w, i) => <span className="w" key={i}>{w} </span>)}</p>
      <div className="ab__cols">
        {skills.map((g) => (
          <div className="ab__col" key={g.group}>
            <p className="eyebrow">{g.group}</p>
            <ul>{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Work: big list with a floating preview ---------------- */
function Work({ projects, onOpen }) {
  const root = useRef(null);
  const preview = useRef(null);
  const [hover, setHover] = useState(-1);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!REDUCE) {
        // fromTo with explicit end values: the rows have a CSS opacity transition, so a measured end value can be caught mid-fade
        gsap.fromTo('.wk__row', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.wk__list', start: 'top 80%' } });
        gsap.from('.wk__head .big', { yPercent: 100, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.wk__head', start: 'top 85%' } });
      }
    }, root);
    if (!FINE || REDUCE) return () => ctx.revert();
    gsap.set(preview.current, { xPercent: -50, yPercent: -50 }); // centre the preview on the cursor
    const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' });
    const rTo = gsap.quickTo(preview.current, 'rotate', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    const move = (e) => { xTo(e.clientX); yTo(e.clientY); rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6))); lastX = e.clientX; };
    window.addEventListener('pointermove', move);
    return () => { window.removeEventListener('pointermove', move); ctx.revert(); };
  }, []);

  return (
    <section className="wk" id="work" ref={root}>
      <div className="wk__head">
        <p className="eyebrow">(Selected work)</p>
        <h2 className="mask"><span className="big">Projects</span></h2>
        <p className="wk__count">{String(projects.length).padStart(2, '0')}</p>
      </div>

      <ol className="wk__list" onPointerLeave={() => setHover(-1)}>
        {projects.map((p, i) => (
          <li key={p.title} className={`wk__row${hover === i ? ' is-hover' : ''}${hover !== -1 && hover !== i ? ' is-dim' : ''}`}>
            <button type="button" className="wk__btn" data-cursor="View" onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => onOpen(i)}>
              <span className="wk__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="wk__title">{p.title}</span>
              <span className="wk__cat">{p.category}</span>
              <span className="wk__yr">{p.year}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* The preview that follows the cursor */}
      <div className={`wk__preview${hover >= 0 ? ' is-on' : ''}`} ref={preview} aria-hidden="true">
        <div className="wk__preview-inner" style={{ transform: `translateY(${-hover * 100}%)` }}>
          {projects.map((p) => (
            <div className="wk__slide" key={p.title}><BrowserWindow project={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Case study panel ---------------- */
function CaseStudy({ projects, index, onClose, onGo }) {
  const root = useRef(null);
  const p = index != null ? projects[index] : null;
  useEffect(() => {
    if (p == null) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const key = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onGo(1); if (e.key === 'ArrowLeft') onGo(-1); };
    window.addEventListener('keydown', key);
    if (!REDUCE) gsap.fromTo(root.current.querySelectorAll('.cs__anim'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.8, ease: 'power3.out', delay: 0.25 });
    return () => { window.removeEventListener('keydown', key); lenis?.start(); document.documentElement.style.overflow = ''; };
  }, [index]);
  return (
    <div className={`cs${p ? ' is-open' : ''}`} ref={root} role="dialog" aria-modal="true" aria-label={p?.title || 'Project'} onClick={onClose}>
      {p && (
        <div className="cs__panel" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
          <div className="cs__bar">
            <span className="cs__anim eyebrow">({String(index + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')})</span>
            <div className="cs__nav">
              <button type="button" onClick={() => onGo(-1)} aria-label="Previous project">←</button>
              <button type="button" onClick={() => onGo(1)} aria-label="Next project">→</button>
              <button type="button" onClick={onClose} className="cs__close">Close</button>
            </div>
          </div>
          <h2 className="cs__title cs__anim">{p.title}</h2>
          <div className="cs__meta cs__anim">
            <div><p className="eyebrow">Year</p><p>{p.year}</p></div>
            <div><p className="eyebrow">Role</p><p>{p.role}</p></div>
            <div><p className="eyebrow">Type</p><p>{p.category}</p></div>
            <div><p className="eyebrow">Stack</p><p>{(p.tags || []).join(', ')}</p></div>
          </div>
          <div className="cs__shot cs__anim"><BrowserWindow project={p} /></div>
          <p className="cs__desc cs__anim">{p.description}</p>
          <div className="cs__links cs__anim">
            {p.live && <Magnetic><a className="pill pill--solid" href={p.live} target="_blank" rel="noreferrer" data-cursor="Open">Visit the site ↗</a></Magnetic>}
            {p.code && <Magnetic><a className="pill" href={p.code} target="_blank" rel="noreferrer" data-cursor="Code">Read the code ↗</a></Magnetic>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Experience ---------------- */
function Experience({ items }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (REDUCE) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.xp__row').forEach((row) => {
        gsap.from(row.querySelector('.xp__rule'), { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: row, start: 'top 88%' } });
        gsap.from(row.querySelectorAll('.xp__cell'), { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 88%' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="xp" ref={root}>
      <p className="eyebrow">(Experience)</p>
      {items.map((e) => (
        <div className="xp__row" key={e.dates + e.title}>
          <span className="xp__rule" />
          <p className="xp__cell xp__date">{e.dates}</p>
          <p className="xp__cell xp__title">{e.title}</p>
          <p className="xp__cell xp__org">{e.org}</p>
          <p className="xp__cell xp__text">{e.text}</p>
        </div>
      ))}
    </section>
  );
}

/* ---------------- Contact + footer ---------------- */
function Contact({ profile }) {
  const root = useRef(null);
  const time = useClock();
  const [copied, setCopied] = useState(false);
  useLayoutEffect(() => {
    if (REDUCE) return;
    const ctx = gsap.context(() => {
      gsap.from('.ct__big .ch', { yPercent: 110, stagger: 0.025, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.ct__big', start: 'top 85%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  const copy = () => navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  return (
    <section className="ct" id="contact" ref={root}>
      <p className="eyebrow">(Contact)</p>
      <h2 className="ct__big" aria-label="Let's work together">
        <span className="mask">{split("Let's work", 'ch')}</span>
        <span className="mask">{split('together', 'ch')}</span>
      </h2>
      <div className="ct__row">
        <p className="ct__avail">{profile.availability}</p>
        <Magnetic strength={0.5}>
          <a className="ct__ball" href={`mailto:${profile.email}`} data-cursor="Say hi">Get in touch</a>
        </Magnetic>
      </div>
      <div className="ct__email">
        <a href={`mailto:${profile.email}`} data-cursor="Write">{profile.email}</a>
        <button type="button" onClick={copy} className="pill pill--sm">{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <footer className="ft">
        <div><p className="eyebrow">Local time</p><p>{time} IST, {profile.location}</p></div>
        <div><p className="eyebrow">Socials</p><p className="ft__links">{profile.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}</p></div>
        <div><p className="eyebrow">Version</p><p>{new Date().getFullYear()} © {profile.name}</p></div>
        <a className="ft__top" href="#top" data-cursor="Up">Back to top ↑</a>
      </footer>
    </section>
  );
}

/* ---------------- Page ---------------- */
export default function Site() {
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetch('/api/portfolio').then((r) => r.json()).then((d) => {
      setData(d);
      document.title = `${d.profile.name}, ${d.profile.role}`;
    }).catch(() => setData(false));
  }, []);

  useSmoothScroll(!!data);
  useEffect(() => { if (ready) ScrollTrigger.refresh(); }, [ready]);

  if (data === false) return <p className="site-err">The portfolio could not load. Is the server running?</p>;
  if (!data) return <div className="site site--blank" />;

  const { profile, projects, skills, experience } = data;
  const go = (d) => setOpen((i) => (i + d + projects.length) % projects.length);

  return (
    <div className="site">
      {!ready && <Preloader name={profile.name} onDone={() => setReady(true)} />}
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav profile={profile} />
      <main>
        <Hero profile={profile} ready={ready} />
        <Marquee skills={skills} />
        <About profile={profile} skills={skills} />
        <Work projects={projects} onOpen={setOpen} />
        <Experience items={experience} />
        <Contact profile={profile} />
      </main>
      <CaseStudy projects={projects} index={open} onClose={() => setOpen(null)} onGo={go} />
    </div>
  );
}
