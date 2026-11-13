import '../legacy.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import BrowserWindow from '../components/BrowserWindow.jsx';
import './glass.css';

const REDUCE = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Small helpers ---------- */

// Fade + rise when scrolled into view
function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.g-reveal:not(.is-in)');
    if (REDUCE || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

// Cycles through words with a typing effect
function useTyping(words) {
  const [text, setText] = useState(REDUCE ? words[0] : '');
  useEffect(() => {
    if (REDUCE || !words.length) return;
    let w = 0, i = 0, del = false, id;
    const tick = () => {
      const word = words[w];
      i += del ? -1 : 1;
      setText(word.slice(0, i));
      let wait = del ? 40 : 80;
      if (!del && i === word.length) { del = true; wait = 1600; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      id = setTimeout(tick, wait);
    };
    id = setTimeout(tick, 600);
    return () => clearTimeout(id);
  }, [words]);
  return text;
}

// A glow that follows the mouse, plus a spotlight on each glass card under the pointer
function useGlow() {
  useEffect(() => {
    if (REDUCE) return;
    const move = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
      const card = e.target.closest?.('.glass');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--cx', `${e.clientX - r.left}px`);
        card.style.setProperty('--cy', `${e.clientY - r.top}px`);
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
}

/* ---------- Sections ---------- */

function Nav({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = [['#about', 'About'], ['#skills', 'Skills'], ['#projects', 'Projects'], ['#experience', 'Experience'], ['#contact', 'Contact']];
  return (
    <header className={`g-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="g-nav__bar glass">
        <a href="#top" className="g-nav__logo"><span className="g-grad">{profile.name.charAt(0)}</span>{profile.name.slice(1)}<i>.</i></a>
        <nav className={`g-nav__links${open ? ' is-open' : ''}`} onClick={() => setOpen(false)}>
          {links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <a className="g-btn g-btn--grad g-btn--sm" href="#contact">Hire me</a>
        <button type="button" className="g-nav__menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}

function Hero({ profile, projects, skills, experience }) {
  const roles = useMemo(() => {
    const top = skills[0]?.items || [];
    const list = [profile.role, ...top.slice(0, 3).map((s) => `${s.split(' and ')[0]} developer`)];
    return [...new Set(list)];
  }, [profile.role, skills]);
  const typed = useTyping(roles);
  const chips = (skills[0]?.items || []).slice(0, 4).map((s) => s.split(' and ')[0]);
  const stats = [
    [projects.length, 'Projects shipped'],
    [skills.reduce((n, g) => n + g.items.length, 0), 'Technologies'],
    [experience.length, 'Roles & studies']
  ];

  return (
    <section className="g-hero" id="top">
      <div className="g-hero__text">
        <p className="g-badge glass"><span className="g-dot" />Available for work · {profile.location}</p>
        <h1 className="g-hero__title">Hi, I'm <span className="g-grad g-grad--anim">{profile.name}</span></h1>
        <p className="g-hero__role">
          <span className="g-typed">{typed}</span><span className="g-caret" aria-hidden="true" />
        </p>
        <p className="g-hero__intro">{profile.headline}</p>
        <div className="g-hero__actions">
          <a className="g-btn g-btn--grad" href="#projects">View my work <span aria-hidden="true">→</span></a>
          {profile.resume && <a className="g-btn glass" href={profile.resume}>Download résumé</a>}
        </div>
        <div className="g-stats">
          {stats.map(([n, l]) => (
            <div className="g-stat glass" key={l}><b className="g-grad">{n}+</b><span>{l}</span></div>
          ))}
        </div>
      </div>

      <div className="g-hero__visual">
        <div className="g-photo">
          <div className="g-photo__ring" />
          <div className="g-photo__glass glass">
            {profile.photo
              ? <img src={profile.photo} alt={profile.name} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              : <span className="g-photo__initial g-grad">{profile.name.charAt(0)}</span>}
          </div>
          {chips.map((c, i) => <span key={c} className={`g-chip glass g-chip--${i}`}>{c}</span>)}
        </div>
      </div>
    </section>
  );
}

function TechStrip({ skills }) {
  const all = skills.flatMap((g) => g.items);
  return (
    <div className="g-strip" aria-hidden="true">
      <div className="g-strip__track">
        {[...all, ...all].map((s, i) => <span key={i} className="glass">{s}</span>)}
      </div>
    </div>
  );
}

function SectionHead({ kicker, title, sub }) {
  return (
    <div className="g-head g-reveal">
      <p className="g-kicker">{kicker}</p>
      <h2>{title}</h2>
      {sub && <p className="g-sub">{sub}</p>}
    </div>
  );
}

function About({ profile, now }) {
  return (
    <section className="g-sec" id="about">
      <SectionHead kicker="About me" title={<>Turning messy workflows into <span className="g-grad">clean web apps</span></>} />
      <div className="g-about">
        <div className="glass g-card g-reveal">
          <p className="g-lead">{profile.intro}</p>
          <p className="g-muted">{profile.availability}</p>
        </div>
        <div className="g-about__side">
          {now.map((n) => (
            <div className="glass g-card g-mini g-reveal" key={n.label}>
              <p className="g-kicker">{n.label}</p>
              <p>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills({ skills }) {
  const icons = ['⚡', '🛠️', '🌱'];
  return (
    <section className="g-sec" id="skills">
      <SectionHead kicker="Skills" title={<>My <span className="g-grad">tech stack</span></>} sub="Tools I use to design, build and ship" />
      <div className="g-skills">
        {skills.map((g, i) => (
          <div className="glass g-card g-skill g-reveal" key={g.group} style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="g-skill__icon">{icons[i % icons.length]}</div>
            <h3>{g.group}</h3>
            <div className="g-tags">{g.items.map((s) => <span key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects({ projects }) {
  const cats = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const [cat, setCat] = useState('All');
  const shown = cat === 'All' ? projects : projects.filter((p) => p.category === cat);
  useReveal(cat);
  return (
    <section className="g-sec" id="projects">
      <SectionHead kicker="Projects" title={<>Things I've <span className="g-grad">built</span></>} sub="Real tools used by real people" />
      {cats.length > 2 && (
        <div className="g-filters glass g-reveal">
          {cats.map((c) => (
            <button key={c} type="button" className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      )}
      <div className="g-projects">
        {shown.map((p, i) => (
          <article className={`glass g-card g-project g-reveal${p.featured ? ' is-featured' : ''}`} key={p.title} style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
            <div className="g-project__shot"><BrowserWindow project={p} /></div>
            <div className="g-project__body">
              <p className="g-kicker">{[p.category, p.year].filter(Boolean).join(' · ')}{p.featured && <span className="g-feat">Featured</span>}</p>
              <h3>{p.title}</h3>
              <p className="g-muted">{p.description}</p>
              <div className="g-tags g-tags--sm">{(p.tags || []).map((t) => <span key={t}>{t}</span>)}</div>
              <div className="g-project__links">
                {p.live && <a className="g-btn g-btn--grad g-btn--sm" href={p.live} target="_blank" rel="noreferrer">Live demo ↗</a>}
                {p.code && <a className="g-btn glass g-btn--sm" href={p.code} target="_blank" rel="noreferrer">Source code</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience({ items, writing }) {
  return (
    <section className="g-sec" id="experience">
      <SectionHead kicker="Journey" title={<>Experience & <span className="g-grad">education</span></>} />
      <div className="g-timeline">
        {items.map((e, i) => (
          <div className="g-tl g-reveal" key={e.dates + e.title} style={{ transitionDelay: `${i * 80}ms` }}>
            <span className="g-tl__dot" />
            <div className="glass g-card">
              <p className="g-kicker">{e.dates}</p>
              <h3>{e.title}</h3>
              {e.org && <p className="g-org">{e.org}</p>}
              <p className="g-muted">{e.text}</p>
            </div>
          </div>
        ))}
      </div>
      {writing?.length > 0 && (
        <div className="g-writing">
          {writing.map((w) => (
            <a className="glass g-card g-post g-reveal" key={w.title} href={w.url}>
              <span className="g-kicker">{w.kind} · {w.date}</span>
              <span className="g-post__title">{w.title}</span>
              <span className="g-post__arrow">↗</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const up = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function send(e) {
    e.preventDefault();
    setStatus('sending'); setErrors({});
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const b = await r.json().catch(() => ({}));
      if (r.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '', website: '' }); }
      else if (b.errors) { setErrors(b.errors); setStatus('idle'); }
      else { setMsg(b.error || 'Something went wrong'); setStatus('failed'); }
    } catch { setMsg('Could not reach the server'); setStatus('failed'); }
  }

  return (
    <section className="g-sec" id="contact">
      <SectionHead kicker="Contact" title={<>Let's build something <span className="g-grad">together</span></>} sub={profile.availability} />
      <div className="g-contact">
        <div className="g-contact__info">
          <div className="glass g-card g-reveal">
            <p className="g-kicker">Email</p>
            <a className="g-email" href={`mailto:${profile.email}`}>{profile.email}</a>
            <button type="button" className="g-btn glass g-btn--sm" onClick={() => navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}>
              {copied ? 'Copied ✓' : 'Copy email'}
            </button>
          </div>
          <div className="glass g-card g-reveal">
            <p className="g-kicker">Find me on</p>
            <div className="g-socials">
              {profile.links.map((l) => <a key={l.url} className="g-btn glass g-btn--sm" href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
            </div>
          </div>
          <div className="glass g-card g-reveal">
            <p className="g-kicker">Based in</p>
            <p className="g-lead g-lead--sm">{profile.location}, India</p>
          </div>
        </div>

        <form className="glass g-card g-form g-reveal" onSubmit={send} noValidate>
          <label><span>Your name</span><input name="name" value={form.name} onChange={up} autoComplete="name" aria-invalid={!!errors.name} />{errors.name && <small>{errors.name}</small>}</label>
          <label><span>Your email</span><input name="email" type="email" value={form.email} onChange={up} autoComplete="email" aria-invalid={!!errors.email} />{errors.email && <small>{errors.email}</small>}</label>
          <label><span>Message</span><textarea name="message" rows="5" value={form.message} onChange={up} aria-invalid={!!errors.message} />{errors.message && <small>{errors.message}</small>}</label>
          <label className="g-trap" aria-hidden="true">Website<input name="website" value={form.website} onChange={up} tabIndex={-1} autoComplete="off" /></label>
          <button className="g-btn g-btn--grad" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
          <p className="g-status" role="status">
            {status === 'sent' && 'Thanks! Your message is in. I usually reply within two days.'}
            {status === 'failed' && msg}
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function Glass() {
  const [data, setData] = useState(null);
  useGlow();
  useEffect(() => {
    fetch('/api/portfolio').then((r) => r.json()).then((d) => { setData(d); document.title = `${d.profile.name} · ${d.profile.role}`; }).catch(() => setData(false));
  }, []);
  useReveal(data);

  if (data === false) return <p style={{ padding: 40 }}>The portfolio could not load. Is the server running?</p>;

  return (
    <div className="g">
      <div className="g-bg" aria-hidden="true">
        <span className="g-blob g-blob--1" />
        <span className="g-blob g-blob--2" />
        <span className="g-blob g-blob--3" />
        <span className="g-blob g-blob--4" />
        <span className="g-mouse" />
        <span className="g-grid" />
      </div>
      {data && (
        <>
          <Nav profile={data.profile} />
          <main>
            <Hero profile={data.profile} projects={data.projects} skills={data.skills} experience={data.experience} />
            <TechStrip skills={data.skills} />
            <About profile={data.profile} now={data.now || []} />
            <Skills skills={data.skills} />
            <Projects projects={data.projects} />
            <Experience items={data.experience} writing={data.writing} />
            <Contact profile={data.profile} />
          </main>
          <footer className="g-footer">
            <p>© {new Date().getFullYear()} {data.profile.name}. Built with React & Node.js.</p>
            <a href="#top">Back to top ↑</a>
          </footer>
        </>
      )}
    </div>
  );
}
