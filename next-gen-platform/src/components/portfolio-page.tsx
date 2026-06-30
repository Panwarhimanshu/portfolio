'use client';

import { useEffect, useRef, useState } from 'react';
import { sendContactMessage } from '@/app/actions';

const MONO = "var(--font-jetbrains),'JetBrains Mono',monospace";
const SERIF = "var(--font-newsreader),Newsreader,serif";
const SANS = "var(--font-space-grotesk),'Space Grotesk',sans-serif";
const DARK = '#1B1714';
const CREAM = '#F1EBDD';
const TERRA = '#C25A38';
const MUTED = '#6B6157';

const DEFAULT_TECH_ROW1 = ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Prisma', 'Framer Motion', 'Figma'];
const DEFAULT_TECH_ROW2 = ['MongoDB', 'AWS', 'Docker', 'Vercel', 'Redux', 'Supabase', 'Git', 'REST API'];
const DEFAULT_SERVICES = [
  { n: '/ 01', title: 'Web Development',  desc: 'Scalable, blazing-fast web apps built with Next.js, React, and modern cloud infrastructure.' },
  { n: '/ 02', title: 'UI/UX Design',     desc: 'Pixel-perfect interfaces designed for delight — where aesthetics meet seamless experience.' },
  { n: '/ 03', title: 'Motion Design',    desc: 'Breathing life into interfaces with cinematic animations and micro-interactions that captivate.' },
  { n: '/ 04', title: 'Cloud & DevOps',   desc: 'Deploying and scaling production apps on AWS, Vercel, Docker — zero downtime, maximum reliability.' },
  { n: '/ 05', title: 'Cybersecurity',    desc: 'Hardening applications and infrastructure — threat analysis, secure architecture, peace of mind.' },
];
const DEFAULT_PROJECTS = [
  { href: 'https://www.deepak-engg.com/',  title: 'Deepak Engineering Works', type: 'Marketing site', year: '2024', tech: 'HTML5 · CSS3 · JavaScript · Bootstrap/Tailwind · SEO', imgLabel: 'deepak-engg screenshot', imgSrc: '' },
  { href: 'https://mliptvservices.in/',     title: 'Mahalaxmi IPTV Services',  type: 'Web platform',  year: '2024', tech: 'PHP · MySQL · HTML5 · CSS3 · JavaScript · Bootstrap',  imgLabel: 'mliptv screenshot',     imgSrc: '' },
];

type HeroData = { id: string; heading: string; subheading: string; ctaText?: string | null; ctaLink?: string | null; imageUrl?: string | null } | null;
type AboutData = { id: string; bio: string; avatarUrl?: string | null; resumeLink?: string | null } | null;
type ProjectData = { id: string; title: string; description: string; link?: string | null; image?: string | null; tags: string };
type ServiceData = { id: string; displayId: string; title: string; description: string };
type TechItemData = { id: string; name: string; icon?: string | null };
type CertificateData = { id: string; title: string; issuer: string; date: Date; imageUrl?: string | null; credentialUrl?: string | null };
type ContactInfoData = { id: string; mobile?: string | null; email?: string | null; address?: string | null; linkedin?: string | null; instagram?: string | null; github?: string | null } | null;
type InstaPostData = { id: string; imageUrl: string; postUrl?: string | null };

interface Props {
  hero: HeroData;
  about: AboutData;
  projects: ProjectData[];
  services: ServiceData[];
  techItems: TechItemData[];
  certificates: CertificateData[];
  contactInfo: ContactInfoData;
  instagramPosts: InstaPostData[];
}

export default function PortfolioPage({ hero, about, projects, services, techItems, certificates, contactInfo, instagramPosts }: Props) {
  const [formDone, setFormDone] = useState(false);
  const [formError, setFormError] = useState('');
  const ghGridRef = useRef<HTMLDivElement>(null);

  // Resolve dynamic content with fallbacks
  const portrait = hero?.imageUrl || null;
  const bioText = about?.bio || "I'm a full-stack developer and cybersecurity enthusiast obsessed with building next-gen digital experiences. I merge technical depth with motion design to create interfaces that don't just work — they feel extraordinary.";
  const email = contactInfo?.email || 'panwarhimanshu4321@gmail.com';
  const mobile = contactInfo?.mobile || '+91 93899 43911';
  const address = contactInfo?.address || 'Vadodara, Gujarat';
  const linkedin = contactInfo?.linkedin || 'https://www.linkedin.com/in/himanshupanwar11/';
  const github = contactInfo?.github || 'https://github.com/Panwarhimanshu';
  const instagram = contactInfo?.instagram || 'https://www.instagram.com/i_himanshupanwar/';

  // Tech marquee rows — split DB items in half or use defaults
  let techRow1: string[], techRow2: string[];
  if (techItems.length >= 2) {
    const mid = Math.ceil(techItems.length / 2);
    techRow1 = techItems.slice(0, mid).map(t => t.name);
    techRow2 = techItems.slice(mid).map(t => t.name);
  } else {
    techRow1 = DEFAULT_TECH_ROW1;
    techRow2 = DEFAULT_TECH_ROW2;
  }

  // Services
  const srvList = services.length > 0
    ? services.map((s, i) => ({ n: s.displayId || `/ 0${i + 1}`, title: s.title, desc: s.description }))
    : DEFAULT_SERVICES;

  // Projects
  const projList = projects.length > 0
    ? projects.map(p => ({ href: p.link || '#', title: p.title, type: p.description, year: '', tech: p.tags, imgLabel: p.title, imgSrc: p.image || '' }))
    : DEFAULT_PROJECTS;

  // Scroll reveals + skill bars + count-up
  useEffect(() => {
    const inViewEl = (el: Element) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.92 && r.bottom > 0;
    };

    const reveals = document.querySelectorAll('[data-reveal]');
    const revealEl = (el: Element) => el.classList.add('hp-in');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { revealEl(e.target); io.unobserve(e.target); } }),
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
      );
      reveals.forEach(el => inViewEl(el) ? revealEl(el) : io.observe(el));
    } else { reveals.forEach(revealEl); }

    const skills = document.querySelectorAll('.hp-skill');
    const fillSkill = (el: Element) => { (el as HTMLElement).style.width = ((el as HTMLElement).dataset.pct || '0') + '%'; };
    if ('IntersectionObserver' in window) {
      const sio = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { fillSkill(e.target); sio.unobserve(e.target); } }),
        { threshold: 0.35 }
      );
      skills.forEach(el => inViewEl(el) ? fillSkill(el) : sio.observe(el));
    } else { skills.forEach(fillSkill); }

    const counts = document.querySelectorAll('.hp-count');
    const runCount = (el: Element) => {
      const target = parseInt((el as HTMLElement).dataset.count || '0', 10);
      const suffix = (el as HTMLElement).dataset.suffix || '';
      const dur = 1300, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { cio.unobserve(e.target); runCount(e.target); } }),
        { threshold: 0.5 }
      );
      counts.forEach(el => inViewEl(el) ? runCount(el) : cio.observe(el));
    } else { counts.forEach(runCount); }

    const timer = setTimeout(() => {
      reveals.forEach(el => { if (!el.classList.contains('hp-in')) revealEl(el); });
      skills.forEach(el => { const h = el as HTMLElement; if (!h.style.width || h.style.width === '0px') fillSkill(el); });
      counts.forEach(el => { const h = el as HTMLElement; if (h.textContent?.trim().startsWith('0')) h.textContent = (h.dataset.count || '0') + (h.dataset.suffix || ''); });
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // GitHub contribution grid
  useEffect(() => {
    const grid = ghGridRef.current;
    if (!grid || grid.childElementCount) return;
    const palette = ['rgba(27,23,20,.08)', 'rgba(27,23,20,.08)', '#D8A38C', TERRA, '#8E3E22'];
    for (let c = 0; c < 28; c++) {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex;flex-direction:column;gap:3px';
      for (let r = 0; r < 7; r++) {
        const cell = document.createElement('div');
        const w = Math.random();
        cell.style.cssText = `width:11px;height:11px;border-radius:2px;background:${palette[w > 0.86 ? 4 : w > 0.7 ? 3 : w > 0.5 ? 2 : 0]}`;
        col.appendChild(cell);
      }
      grid.appendChild(col);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    const fd = new FormData(e.currentTarget);
    try {
      await sendContactMessage(fd);
      setFormDone(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ background: CREAM, color: DARK, fontFamily: SANS, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>

      {/* Paper glow */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 'auto', left: 0, height: 620, background: 'radial-gradient(120% 90% at 80% -10%, rgba(194,90,56,.10), rgba(194,90,56,0) 60%)', pointerEvents: 'none' }} />

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px clamp(20px,4vw,56px)', background: 'rgba(241,235,221,.78)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(27,23,20,.10)' }}>
        <a href="#top" style={{ textDecoration: 'none', color: DARK, fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: '-.01em', display: 'flex', alignItems: 'center', gap: 9 }}>
          Himanshu <span style={{ color: TERRA, fontSize: 16 }}>✦</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,2.4vw,34px)' }}>
          {[['About','#about'],['Work','#work'],['Certificates','#certs'],['Contact','#contact']].map(([label, href]) => (
            <a key={label} className="hp-navlink" href={href} style={{ textDecoration: 'none', color: DARK, fontSize: 13, fontWeight: 500, letterSpacing: '.02em' }}>{label}</a>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 13px', border: '1px solid rgba(27,23,20,.20)', borderRadius: 100, fontFamily: MONO, fontSize: 11, letterSpacing: '.03em' }}>
            <span style={{ position: 'relative', width: 7, height: 7 }}>
              <span style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: '50%', background: '#2E7D52' }} />
              <span style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: '50%', background: '#2E7D52', animation: 'hp-pulse 1.8s ease-in-out infinite' }} />
            </span>
            Available for work
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header id="top" style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(28px,5vw,70px) clamp(20px,4vw,56px) clamp(40px,6vw,80px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontFamily: MONO, fontSize: 12, letterSpacing: '.04em', color: MUTED, marginBottom: 'clamp(24px,4vw,52px)', flexWrap: 'wrap' }}>
          <span>FULL-STACK DEVELOPER · CYBERSECURITY</span>
          <span>VADODARA, GUJARAT · IST UTC+5:30</span>
          <span>PORTFOLIO — &#39;26</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.55fr .9fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'end' }}>
          <div data-reveal="">
            <div style={{ fontFamily: SERIF, fontWeight: 500, lineHeight: .82, letterSpacing: '-.02em', fontSize: 'clamp(58px,12.5vw,210px)' }}>
              <div>Himanshu</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.18em', flexWrap: 'wrap' }}>
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: TERRA }}>Panwar</span>
                <span style={{ fontFamily: SANS, fontSize: 'clamp(13px,1.3vw,17px)', fontWeight: 500, letterSpacing: '.01em', color: MUTED, maxWidth: 340, lineHeight: 1.45, fontStyle: 'normal', alignSelf: 'flex-end', paddingBottom: '.4em' }}>
                  Architecting next-generation digital experiences where code, design & motion meet.
                </span>
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div data-reveal="" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(27,23,20,.18)', backgroundColor: '#E7DECC', backgroundImage: portrait ? 'none' : 'repeating-linear-gradient(135deg, rgba(27,23,20,.06) 0 2px, transparent 2px 11px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {portrait
                ? <img src={portrait} alt="Himanshu Panwar" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                : <>
                    <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', color: '#8C8377', textTransform: 'uppercase' }}>[ your portrait ]</span>
                    <span style={{ position: 'absolute', top: 10, left: 12, fontFamily: MONO, fontSize: 10, color: '#8C8377' }}>portrait.webp</span>
                  </>
              }
            </div>
            <div style={{ position: 'absolute', bottom: -14, left: -14, background: DARK, color: CREAM, fontFamily: MONO, fontSize: 11, padding: '7px 12px', borderRadius: 100, transform: 'rotate(-3deg)' }}>est. India 🇮🇳</div>
          </div>
        </div>

        {/* Roles row */}
        <div data-reveal="" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,26px)', marginTop: 'clamp(30px,4vw,56px)', flexWrap: 'wrap', borderTop: '1px solid rgba(27,23,20,.14)', borderBottom: '1px solid rgba(27,23,20,.14)', padding: '18px 0' }}>
          <span style={{ fontFamily: SERIF, fontSize: 'clamp(20px,2.6vw,34px)', fontWeight: 500 }}>Full-Stack Developer</span>
          <span style={{ color: TERRA, fontSize: 20 }}>✦</span>
          <span style={{ fontFamily: SERIF, fontSize: 'clamp(20px,2.6vw,34px)', fontWeight: 500, fontStyle: 'italic' }}>Cybersecurity Analyst</span>
          <span style={{ color: TERRA, fontSize: 20 }}>✦</span>
          <span style={{ fontFamily: SERIF, fontSize: 'clamp(20px,2.6vw,34px)', fontWeight: 500 }}>Motion-minded Engineer</span>
        </div>

        {/* CTAs */}
        <div data-reveal="" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'clamp(26px,3vw,40px)', flexWrap: 'wrap' }}>
          <a href="#work" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, background: DARK, color: CREAM, padding: '15px 26px', borderRadius: 100, fontSize: 14, fontWeight: 600, letterSpacing: '.01em' }}>View my work <span>→</span></a>
          <a href="#contact" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(27,23,20,.28)', color: DARK, padding: '15px 26px', borderRadius: 100, fontSize: 14, fontWeight: 600 }}>Let&apos;s talk</a>
          <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 12, color: MUTED }}>↓ scroll to explore</span>
        </div>
      </header>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ borderTop: '1px solid rgba(27,23,20,.14)', borderBottom: '1px solid rgba(27,23,20,.14)', background: DARK, color: CREAM, overflow: 'hidden', padding: '16px 0' }}>
        <div className="hp-marq-track" style={{ animation: 'hp-marq 26s linear infinite' }}>
          {[0, 1].map(i => (
            <span key={i} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 30, padding: '0 28px', whiteSpace: 'nowrap' }}>
              Strategy <span style={{ color: TERRA }}>✦</span> Design <span style={{ color: TERRA }}>✦</span> Development <span style={{ color: TERRA }}>✦</span> Security <span style={{ color: TERRA }}>✦</span> Motion <span style={{ color: TERRA }}>✦</span>&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── STATEMENT ── */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(60px,9vw,140px) clamp(20px,4vw,56px)' }}>
        <div data-reveal="" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: TERRA, marginBottom: 30 }}>( 01 ) — WHAT I DO</div>
        <h2 data-reveal="" style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(32px,5.4vw,82px)', lineHeight: 1.04, letterSpacing: '-.015em', maxWidth: '16ch' }}>
          Building <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy', textDecorationColor: TERRA, textUnderlineOffset: 10, textDecorationThickness: 2 }}>experiences</span> that help products grow through <span style={{ fontStyle: 'italic', color: TERRA }}>clean code</span>, thoughtful design & motion.
        </h2>
      </section>

      {/* ── TECH ARSENAL ── */}
      <section style={{ padding: 'clamp(40px,5vw,72px) 0', borderTop: '1px solid rgba(27,23,20,.14)', borderBottom: '1px solid rgba(27,23,20,.14)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto 34px', padding: '0 clamp(20px,4vw,56px)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(24px,3vw,40px)' }}>Tech Arsenal</h3>
          <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>powering next-gen experiences</span>
        </div>
        {[
          { tags: techRow1, anim: 'hp-marq 30s linear infinite',     hl: techRow1.includes('Framer Motion') ? 'Framer Motion' : techRow1[0], hlBg: DARK,  hlCol: CREAM },
          { tags: techRow2, anim: 'hp-marq-rev 34s linear infinite', hl: techRow2.includes('REST API') ? 'REST API' : techRow2[0],           hlBg: TERRA, hlCol: CREAM },
        ].map(({ tags, anim, hl, hlBg, hlCol }) => (
          <div key={anim} style={{ overflow: 'hidden', padding: '6px 0' }}>
            <div className="hp-marq-track" style={{ animation: anim, gap: 14 }}>
              {[0, 1].map(i => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                  {tags.map(tag => (
                    <span key={tag} style={{ fontFamily: MONO, fontSize: 'clamp(15px,1.6vw,20px)', border: '1px solid rgba(27,23,20,.22)', padding: '11px 20px', borderRadius: 100, whiteSpace: 'nowrap', ...(tag === hl ? { background: hlBg, color: hlCol, borderColor: hlBg } : {}) }}>
                      {tag}
                    </span>
                  ))}
                  &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(60px,9vw,140px) clamp(20px,4vw,56px)' }}>
        <div data-reveal="" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: TERRA, marginBottom: 30 }}>( 02 ) — ABOUT ME</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 'clamp(30px,5vw,72px)', alignItems: 'start' }}>
          <div>
            <h2 data-reveal="" style={{ margin: '0 0 28px', fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(30px,4.6vw,66px)', lineHeight: 1.05, letterSpacing: '-.015em' }}>
              Crafting the <span style={{ fontStyle: 'italic', color: TERRA }}>future</span> of the web.
            </h2>
            <p data-reveal="" style={{ margin: '0 0 22px', fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.7, color: '#3A332D', maxWidth: '54ch' }}>{bioText}</p>
            <p data-reveal="" style={{ margin: 0, fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.7, color: '#3A332D', maxWidth: '54ch' }}>
              From scalable architectures to pixel-tuned micro-interactions, I care about the whole journey: clean code, performance, and systems that scale without losing their soul.
            </p>
            <div data-reveal="" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginTop: 'clamp(34px,4vw,52px)' }}>
              {[{ count: 3, suffix: '+', label: 'Years Coding' }, { count: 20, suffix: '+', label: 'Projects Built' }, { count: 16, suffix: '+', label: 'Technologies' }, { count: 100, suffix: '%', label: 'Passion' }].map(({ count, suffix, label }) => (
                <div key={label} style={{ borderTop: '1px solid rgba(27,23,20,.2)', paddingTop: 14 }}>
                  <div className="hp-count" data-count={count} data-suffix={suffix} style={{ fontFamily: SERIF, fontSize: 'clamp(32px,3.6vw,52px)', fontWeight: 500, lineHeight: 1 }}>0{suffix}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, marginTop: 8 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Capability matrix */}
          <div data-reveal="" style={{ background: '#F7F2E8', border: '1px solid rgba(27,23,20,.12)', borderRadius: 8, padding: 'clamp(22px,2.4vw,32px)' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, marginBottom: 22, letterSpacing: '.06em' }}>CAPABILITY MATRIX</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Frontend — React / Next.js', pct: 93 },
                { label: 'Backend — Node / APIs',       pct: 82 },
                { label: 'UI/UX & Motion Design',       pct: 78 },
                { label: 'Cloud & DevOps',              pct: 70 },
                { label: 'Cybersecurity',               pct: 72 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                    <span>{label}</span><span style={{ fontFamily: MONO, color: TERRA }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(27,23,20,.1)', borderRadius: 100, overflow: 'hidden' }}>
                    <div className="hp-skill" data-pct={pct} style={{ height: '100%', width: 0, background: DARK, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 26 }}>
              {['Clean code', 'Performance', 'Systems thinking'].map(tag => (
                <span key={tag} style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(27,23,20,.06)', padding: '6px 11px', borderRadius: 100 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ borderTop: '1px solid rgba(27,23,20,.14)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(50px,6vw,90px) clamp(20px,4vw,56px) 10px' }}>
          <div data-reveal="" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: TERRA, marginBottom: 20 }}>( 03 ) — SERVICES & EXPERTISE</div>
          <h2 data-reveal="" style={{ margin: '0 0 18px', fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(28px,4.4vw,60px)', lineHeight: 1.05, letterSpacing: '-.015em' }}>What I do best.</h2>
        </div>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 clamp(20px,4vw,56px) clamp(50px,6vw,90px)' }}>
          {srvList.map(({ n, title, desc }, idx, arr) => (
            <div key={n} className="hp-srv" data-reveal="" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1.4fr auto', gap: 'clamp(14px,3vw,40px)', alignItems: 'center', padding: 'clamp(22px,2.4vw,34px) 0', borderTop: '1px solid rgba(27,23,20,.16)', ...(idx === arr.length - 1 ? { borderBottom: '1px solid rgba(27,23,20,.16)' } : {}) }}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: TERRA }}>{n}</span>
              <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(22px,2.6vw,34px)' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#3A332D' }}>{desc}</p>
              <span style={{ fontSize: 22, color: DARK }}>↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="work" style={{ background: DARK, color: CREAM }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(60px,8vw,120px) clamp(20px,4vw,56px)' }}>
          <div data-reveal="" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 'clamp(34px,4vw,56px)' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: TERRA, marginBottom: 20 }}>( 04 ) — SELECTED WORK</div>
              <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(34px,5.6vw,84px)', lineHeight: 1, letterSpacing: '-.02em' }}>Curated <span style={{ fontStyle: 'italic' }}>Projects</span></h2>
            </div>
            <p style={{ margin: 0, maxWidth: '38ch', fontSize: 14, lineHeight: 1.6, color: '#B7AFA2' }}>A showcase of digital craftsmanship — engineering meets design at the edge of innovation.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: projList.length === 1 ? '1fr' : '1fr 1fr', gap: 'clamp(20px,2.6vw,36px)' }}>
            {projList.map(({ href, title, type, year, tech, imgLabel, imgSrc }) => (
              <a key={href + title} className="hp-proj" href={href} target="_blank" rel="noopener noreferrer" data-reveal="" style={{ textDecoration: 'none', color: CREAM, display: 'block' }}>
                <div style={{ position: 'relative', aspectRatio: '16/11', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(241,235,221,.14)' }}>
                  <div className="hp-proj-img" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#2A2521', backgroundImage: imgSrc ? 'none' : 'repeating-linear-gradient(135deg, rgba(241,235,221,.06) 0 2px, transparent 2px 13px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .7s cubic-bezier(.2,.7,.2,1)' }}>
                    {imgSrc
                      ? <img src={imgSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: MONO, fontSize: 11, color: '#8C8377', letterSpacing: '.06em' }}>[ {imgLabel} ]</span>
                    }
                  </div>
                  {year && <span style={{ position: 'absolute', top: 14, left: 16, fontFamily: MONO, fontSize: 11, color: TERRA }}>{year}</span>}
                  <span className="hp-proj-arrow" style={{ position: 'absolute', top: 14, right: 16, width: 40, height: 40, borderRadius: '50%', background: CREAM, color: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, transition: 'transform .4s ease' }}>↗</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginTop: 18, paddingBottom: 6, borderBottom: '1px solid rgba(241,235,221,.16)' }}>
                  <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(22px,2.6vw,32px)' }}>{title}</h3>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: '#B7AFA2', whiteSpace: 'nowrap' }}>{type}</span>
                </div>
                <p style={{ margin: '12px 0 0', fontFamily: MONO, fontSize: 12, lineHeight: 1.6, color: '#8C8377' }}>{tech}</p>
              </a>
            ))}
          </div>

          <div data-reveal="" style={{ marginTop: 'clamp(30px,4vw,48px)', display: 'flex', justifyContent: 'center' }}>
            <a href={github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(241,235,221,.3)', color: CREAM, padding: '14px 26px', borderRadius: 100, fontSize: 14, fontWeight: 600 }}>More on GitHub <span>→</span></a>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATES ── */}
      <section id="certs" style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(60px,9vw,130px) clamp(20px,4vw,56px)' }}>
        <div data-reveal="" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: TERRA, marginBottom: 20 }}>( 05 ) — CERTIFICATES</div>
        <div data-reveal="" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 'clamp(30px,4vw,48px)' }}>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(30px,4.6vw,66px)', lineHeight: 1.04, letterSpacing: '-.015em' }}>Credentials & <span style={{ fontStyle: 'italic', color: TERRA }}>learning</span>.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(16px,2vw,26px)' }}>
          {(certificates.length > 0 ? certificates : [null, null, null]).map((cert, n) => (
            <div key={cert?.id ?? n} data-reveal="" style={{ background: '#F7F2E8', border: '1px solid rgba(27,23,20,.12)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/10', backgroundColor: '#E7DECC', backgroundImage: cert?.imageUrl ? 'none' : 'repeating-linear-gradient(135deg, rgba(27,23,20,.06) 0 2px, transparent 2px 11px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {cert?.imageUrl
                  ? <img src={cert.imageUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: MONO, fontSize: 10, color: '#8C8377' }}>certificate-0{n + 1}.jpg</span>
                }
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: TERRA, letterSpacing: '.08em', marginBottom: 9 }}>CERTIFICATE</div>
                {cert?.credentialUrl
                  ? <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: DARK }}>
                      <h3 style={{ margin: '0 0 6px', fontFamily: SERIF, fontWeight: 500, fontSize: 20 }}>{cert.title}</h3>
                    </a>
                  : <h3 style={{ margin: '0 0 6px', fontFamily: SERIF, fontWeight: 500, fontSize: 20 }}>{cert?.title ?? 'Add credential title'}</h3>
                }
                <p style={{ margin: 0, fontSize: 12, color: MUTED, fontFamily: MONO }}>{cert ? `${cert.issuer} · ${new Date(cert.date).getFullYear()}` : 'Issuer · Year'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section style={{ borderTop: '1px solid rgba(27,23,20,.14)', borderBottom: '1px solid rgba(27,23,20,.14)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(50px,7vw,100px) clamp(20px,4vw,56px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,56px)' }}>
          {/* Instagram */}
          <div data-reveal="">
            <div style={{ fontFamily: MONO, fontSize: 12, color: MUTED, marginBottom: 12 }}>Life in frames</div>
            <h3 style={{ margin: '0 0 22px', fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(24px,3vw,40px)' }}>Catch me on Instagram <span style={{ color: TERRA }}>✦</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {(instagramPosts.length > 0 ? instagramPosts.slice(0, 6) : Array.from({ length: 6 })).map((post, i) => (
                <a key={(post as InstaPostData)?.id ?? i} href={(post as InstaPostData)?.postUrl || instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', aspectRatio: '1', borderRadius: 5, overflow: 'hidden', backgroundColor: '#E7DECC', backgroundImage: (post as InstaPostData)?.imageUrl ? 'none' : 'repeating-linear-gradient(135deg, rgba(27,23,20,.07) 0 2px, transparent 2px 10px)' }}>
                  {(post as InstaPostData)?.imageUrl && <img src={(post as InstaPostData).imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </a>
              ))}
            </div>
            <a href={instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: DARK, fontFamily: MONO, fontSize: 13, borderBottom: `1px solid ${TERRA}` }}>@i_himanshupanwar →</a>
          </div>

          {/* GitHub */}
          <div data-reveal="">
            <div style={{ fontFamily: MONO, fontSize: 12, color: MUTED, marginBottom: 12 }}>Open source vibes</div>
            <h3 style={{ margin: '0 0 22px', fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(24px,3vw,40px)' }}>Catch me on GitHub <span style={{ color: TERRA }}>✦</span></h3>
            <div style={{ background: '#F7F2E8', border: '1px solid rgba(27,23,20,.12)', borderRadius: 8, padding: 22 }}>
              <div ref={ghGridRef} style={{ display: 'flex', gap: 3, overflow: 'hidden' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontFamily: MONO, fontSize: 11, color: MUTED }}>
                <span>contributions</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  less
                  {['rgba(27,23,20,.1)', '#D8A38C', TERRA, '#8E3E22'].map((bg, i) => (
                    <span key={i} style={{ width: 9, height: 9, borderRadius: 2, background: bg, display: 'inline-block' }} />
                  ))}
                  more
                </span>
              </div>
            </div>
            <a href={github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: DARK, fontFamily: MONO, fontSize: 13, borderBottom: `1px solid ${TERRA}` }}>@Panwarhimanshu →</a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(60px,9vw,140px) clamp(20px,4vw,56px)' }}>
        <div data-reveal="" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: TERRA, marginBottom: 24 }}>( 06 ) — GET IN TOUCH</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(30px,5vw,72px)', alignItems: 'start' }}>
          <div>
            <h2 data-reveal="" style={{ margin: '0 0 26px', fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(34px,5.6vw,88px)', lineHeight: .98, letterSpacing: '-.02em' }}>Let&apos;s build something <span style={{ fontStyle: 'italic', color: TERRA }}>memorable</span>.</h2>
            <p data-reveal="" style={{ margin: '0 0 30px', fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.7, color: '#3A332D', maxWidth: '44ch' }}>Have a project in mind or just want to connect? Drop me a message — I&apos;ll get back within 24 hours.</p>
            <div data-reveal="" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: DARK, fontFamily: SERIF, fontSize: 'clamp(20px,2.4vw,30px)', borderBottom: '1px solid rgba(27,23,20,.2)', paddingBottom: 8 }}>{email}</a>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: MONO, fontSize: 13, color: MUTED, marginTop: 8 }}>
                {mobile && <span>{mobile}</span>}
                {address && <span>{address}</span>}
                <span>IST · UTC+5:30</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                {[['LinkedIn ↗', linkedin], ['GitHub ↗', github], ['Instagram ↗', instagram]].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: DARK, fontFamily: MONO, fontSize: 12, border: '1px solid rgba(27,23,20,.24)', padding: '9px 15px', borderRadius: 100 }}>{label}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div data-reveal="" style={{ background: DARK, color: CREAM, borderRadius: 10, padding: 'clamp(24px,3vw,38px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: '#9C9488', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2E7D52', display: 'inline-block' }} />
              connected — type your message below
            </div>
            {!formDone ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ display: 'block' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#9C9488' }}>~/name</span>
                  <input name="name" type="text" required placeholder="Your name" style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(241,235,221,.24)', color: CREAM, fontFamily: SANS, fontSize: 16, padding: '8px 0', outline: 'none' }} />
                </label>
                <label style={{ display: 'block' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#9C9488' }}>~/email</span>
                  <input name="email" type="email" required placeholder="you@email.com" style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(241,235,221,.24)', color: CREAM, fontFamily: SANS, fontSize: 16, padding: '8px 0', outline: 'none' }} />
                </label>
                <label style={{ display: 'block' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#9C9488' }}>~/message</span>
                  <textarea name="message" rows={3} required placeholder="Tell me about your project…" style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(241,235,221,.24)', color: CREAM, fontFamily: SANS, fontSize: 16, padding: '8px 0', outline: 'none', resize: 'none' }} />
                </label>
                {formError && <div style={{ fontSize: 13, color: '#ff7f7f' }}>{formError}</div>}
                <button type="submit" style={{ marginTop: 6, background: TERRA, color: CREAM, border: 'none', padding: 15, borderRadius: 100, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Send message →</button>
              </form>
            ) : (
              <div style={{ padding: '30px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>✦</div>
                <div style={{ fontFamily: SERIF, fontSize: 24, marginBottom: 8 }}>Message sent.</div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: '#9C9488' }}>I&apos;ll get back to you within 24 hours.</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: DARK, color: CREAM, overflow: 'hidden' }}>
        <div style={{ padding: 'clamp(36px,5vw,70px) 0 0' }}>
          <div style={{ overflow: 'hidden' }}>
            <div className="hp-marq-track" style={{ animation: 'hp-marq 24s linear infinite' }}>
              {[0, 1].map(i => (
                <span key={i} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(54px,11vw,150px)', lineHeight: 1, letterSpacing: '-.02em', padding: '0 30px', whiteSpace: 'nowrap' }}>
                  Himanshu Panwar <span style={{ color: TERRA, fontStyle: 'italic' }}>— let&apos;s talk</span>&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1320, margin: 'clamp(30px,4vw,50px) auto 0', padding: 'clamp(34px,4vw,56px) clamp(20px,4vw,56px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', borderTop: '1px solid rgba(241,235,221,.14)' }}>
          <div>
            <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: CREAM, display: 'inline-flex', alignItems: 'center', gap: 10, background: TERRA, padding: '14px 24px', borderRadius: 100, fontSize: 14, fontWeight: 600 }}>Start a project →</a>
            <div style={{ fontFamily: MONO, fontSize: 12, color: '#9C9488', marginTop: 20 }}>© 2026 Himanshu Panwar. All rights reserved.</div>
          </div>
          <div style={{ display: 'flex', gap: 26, fontFamily: MONO, fontSize: 13 }}>
            {[['LinkedIn', linkedin], ['GitHub', github], ['Instagram', instagram]].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: CREAM }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
