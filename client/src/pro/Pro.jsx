import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Download, Mail, MapPin, Menu, Moon, Sun } from 'lucide-react';
import BrowserWindow from '@/components/BrowserWindow.jsx';
import { Button } from '@/pro/ui/button';
import { Badge } from '@/pro/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/pro/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/pro/ui/tabs';
import { Input, Label, Separator, Textarea } from '@/pro/ui/form';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/pro/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/pro/ui/avatar';
import { cn } from '@/pro/lib/utils';
import './pro.css';

const LINKS = [['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['experience', 'Experience'], ['contact', 'Contact']];

/* ---------- Brand icons (lucide no longer ships logos) ---------- */
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
function WhatsappIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.04c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 0 1 6.7 2.78 9.41 9.41 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.47 9.47Zm8.06-17.54A11.32 11.32 0 0 0 12.05.62C5.76.62.65 5.73.65 12.01c0 2.01.52 3.97 1.52 5.7L.55 23.62l6.04-1.58a11.37 11.37 0 0 0 5.45 1.39h.01c6.28 0 11.39-5.11 11.4-11.4 0-3.04-1.18-5.9-3.34-8.06Z" />
    </svg>
  );
}

// wa.me link with a short greeting already typed in. Returns '' when no number is set.
function whatsappLink(profile) {
  const digits = String(profile.whatsapp || '').replace(/\D/g, '');
  if (digits.length < 8) return '';
  const text = `Hi ${profile.name}, I saw your portfolio and would like to talk.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const socialIcon = (label) => (/github/i.test(label) ? GithubIcon : /linkedin/i.test(label) ? LinkedinIcon : ArrowUpRight);

const firstSentence = (t = '') => (t.match(/^.*?[.!?](\s|$)/)?.[0] || t).trim();

/* ---------- Hooks ---------- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('pro-theme') || 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('pro-theme', theme); } catch { /* private mode */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

// Local time in Vadodara, so visitors know when a reply is likely
function useLocalTime() {
  const fmt = () => new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

// Which section is on screen, for the nav highlight
function useActiveSection(ready) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!ready) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ready]);
  return active;
}

/* ---------- Layout helpers ---------- */
function Container({ className, ...props }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

function Section({ id, title, description, children }) {
  return (
    <section id={id} className="border-t py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="reveal lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-xs text-muted-foreground">0{LINKS.findIndex(([l]) => l === id) + 1} / {id}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
            {description && <p className="mt-4 max-w-sm text-muted-foreground text-pretty">{description}</p>}
          </div>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </Container>
    </section>
  );
}

/* ---------- Sections ---------- */
function Header({ profile, theme, toggleTheme, active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const ThemeButton = (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );

  return (
    <header className={cn('sticky top-0 z-40 w-full border-b border-transparent transition-colors', scrolled && 'border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70')}>
      <Container className="flex h-14 items-center gap-6">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Avatar className="size-7">
            <AvatarImage src={profile.photo} alt="" />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {profile.name}
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={cn('rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground', active === id && 'text-foreground')}>
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {ThemeButton}
          <Button asChild size="sm" className="ml-1 hidden sm:inline-flex">
            <a href="#contact">Get in touch</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{profile.name}</SheetTitle>
                <SheetDescription>{profile.role}, {profile.location}</SheetDescription>
              </SheetHeader>
              <nav className="grid gap-1 px-2">
                {LINKS.map(([id, label]) => (
                  <SheetClose asChild key={id}>
                    <a href={`#${id}`} className="rounded-md px-3 py-2.5 text-[15px] hover:bg-accent">{label}</a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <SheetClose asChild>
                  <Button asChild className="w-full"><a href="#contact">Get in touch</a></Button>
                </SheetClose>
                {whatsappLink(profile) && (
                  <Button asChild variant="outline" className="mt-2 w-full">
                    <a href={whatsappLink(profile)} target="_blank" rel="noreferrer"><WhatsappIcon className="size-4" />WhatsApp</a>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

function Hero({ profile, current }) {
  const time = useLocalTime();
  return (
    <section id="top" className="relative">
      <Container className="grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:min-h-[calc(100svh-3.5rem)] lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-7">
          <Badge variant="outline" className="gap-2 rounded-full px-3 py-1 text-[13px] font-normal text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Open to work · {profile.location}
          </Badge>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">{profile.role} in {profile.location}, India. {firstSentence(profile.availability)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#projects">See my projects <ArrowRight /></a>
            </Button>
            {profile.resume && (
              <Button asChild size="lg" variant="outline">
                <a href={profile.resume}><Download /> Résumé</a>
              </Button>
            )}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {profile.links.map((l) => {
              const Icon = socialIcon(l.label);
              return (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <Icon className="size-4" />{l.label}
                </a>
              );
            })}
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
              <Mail className="size-4" />Email
            </a>
            {whatsappLink(profile) && (
              <a href={whatsappLink(profile)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                <WhatsappIcon className="size-4" />WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure className="mx-auto max-w-sm overflow-hidden rounded-xl border bg-card shadow-sm lg:ml-auto">
            <div className="aspect-[4/5] bg-muted">
              {profile.photo
                ? <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="size-full object-cover" />
                : <div className="grid size-full place-items-center text-6xl font-semibold text-muted-foreground">{profile.name.charAt(0)}</div>}
            </div>
            <figcaption className="flex items-center justify-between gap-4 border-t px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.name}</p>
                <p className="truncate text-xs text-muted-foreground">{current || profile.role}</p>
              </div>
              <p className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                <MapPin className="size-3.5" />{profile.location} · {time} IST
              </p>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function About({ profile, experience, projects }) {
  const facts = [
    ['Based in', `${profile.location}, India`],
    ['Currently', experience[0] ? `${experience[0].title}${experience[0].org ? `, ${experience[0].org}` : ''}` : profile.role],
    ['Shipped', `${projects.length} projects`]
  ];
  return (
    <Section id="about" title="Plain tools for the people who keep things running">
      <div className="reveal space-y-6">
        <p className="text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-relaxed">{profile.intro}</p>
        <p className="max-w-2xl text-muted-foreground text-pretty">{profile.availability}</p>
      </div>
      <dl className="reveal mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
        {facts.map(([k, v]) => (
          <div key={k} className="bg-card px-5 py-4">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function Skills({ skills }) {
  return (
    <Section id="skills" title="What I work with" description="Grouped by how often I reach for them, not by how good they look on a list">
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((g, i) => (
          <Card key={g.group} className={cn('reveal gap-4', i === 0 && 'sm:col-span-2')}>
            <CardHeader>
              <div className="flex items-baseline justify-between gap-4">
                <CardTitle>{g.group}</CardTitle>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{String(g.items.length).padStart(2, '0')}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <Badge key={s} variant={i === 0 ? 'secondary' : 'outline'} className="px-2.5 py-1 text-[13px] font-normal">{s}</Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ProjectLinks({ p }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.live && (
        <Button asChild size="sm">
          <a href={p.live} target="_blank" rel="noreferrer">Visit site <ArrowUpRight /></a>
        </Button>
      )}
      {p.code && (
        <Button asChild size="sm" variant="outline">
          <a href={p.code} target="_blank" rel="noreferrer"><GithubIcon className="size-4" /> Source</a>
        </Button>
      )}
    </div>
  );
}

function ProjectMeta({ p }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted-foreground">
      {p.featured && <span className="text-brand">Featured</span>}
      {p.featured && <span aria-hidden="true">·</span>}
      {[p.category, p.year, p.role].filter(Boolean).join(' · ')}
    </p>
  );
}

function Tags({ tags = [] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => <li key={t}><Badge variant="outline" className="font-normal text-muted-foreground">{t}</Badge></li>)}
    </ul>
  );
}

function Projects({ projects, githubNote }) {
  const cats = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const [cat, setCat] = useState('All');
  const shown = cat === 'All' ? projects : projects.filter((p) => p.category === cat);
  const featured = shown.find((p) => p.featured);
  const rest = shown.filter((p) => p !== featured);
  useReveal(cat);

  return (
    <Section id="projects" title="Selected projects" description="Most started as a notebook, a spreadsheet or a WhatsApp group that ran out of room">
      {cats.length > 2 && (
        <Tabs value={cat} onValueChange={setCat} className="reveal mb-6">
          <TabsList>
            {cats.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid gap-4">
        {featured && (
          <Card className="reveal group gap-0 overflow-hidden p-0 transition-colors hover:border-foreground/20">
            <div className="pro-shot border-b bg-muted/40 p-3 sm:p-4">
              <BrowserWindow project={featured} />
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-3">
                <ProjectMeta p={featured} />
                <h3 className="text-2xl font-semibold tracking-tight">{featured.title}</h3>
                <p className="max-w-xl text-muted-foreground text-pretty">{featured.description}</p>
                <Tags tags={featured.tags} />
              </div>
              <ProjectLinks p={featured} />
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((p) => (
            <Card key={p.title} className="reveal group gap-5 overflow-hidden pt-0 transition-colors hover:border-foreground/20">
              <div className="pro-shot border-b bg-muted/40 p-3">
                <BrowserWindow project={p} />
              </div>
              <CardHeader className="gap-2">
                <ProjectMeta p={p} />
                <CardTitle className="text-lg tracking-tight">{p.title}</CardTitle>
                <CardDescription className="text-pretty">{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto"><Tags tags={p.tags} /></CardContent>
              <CardFooter><ProjectLinks p={p} /></CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {githubNote?.url && (
        <p className="reveal mt-6 text-sm text-muted-foreground">
          {githubNote.text}{' '}
          <a href={githubNote.url} target="_blank" rel="noreferrer" className="font-medium text-foreground underline-offset-4 hover:underline">{githubNote.label}</a>
        </p>
      )}
    </Section>
  );
}

function Experience({ items, writing }) {
  return (
    <Section id="experience" title="Experience and education">
      <ol className="reveal relative space-y-0 border-l">
        {items.map((e, i) => (
          <li key={e.dates + e.title} className="relative pb-10 pl-6 last:pb-0">
            <span className={cn('absolute -left-[5px] top-1.5 size-[9px] rounded-full border-2 border-background bg-muted-foreground/60', i === 0 && 'bg-success')} />
            <p className="font-mono text-xs text-muted-foreground tabular-nums">{e.dates}</p>
            <h3 className="mt-1.5 font-semibold">
              {e.title}
              {e.org && <span className="font-normal text-muted-foreground"> · {e.org}</span>}
            </h3>
            <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">{e.text}</p>
          </li>
        ))}
      </ol>

      {writing?.length > 0 && (
        <div className="reveal mt-16">
          <h3 className="text-sm font-medium">Writing, talks and other work</h3>
          <Card className="mt-4 gap-0 py-0">
            {writing.map((w, i) => (
              <a key={w.title} href={w.url} className={cn('group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/50', i > 0 && 'border-t')}>
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{w.date}</span>
                <span className="min-w-0 flex-1 text-[15px]">{w.title}</span>
                <Badge variant="outline" className="hidden font-normal text-muted-foreground sm:inline-flex">{w.kind}</Badge>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            ))}
          </Card>
        </div>
      )}
    </Section>
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
      else { setMsg(b.error || 'Something went wrong, please email me instead'); setStatus('failed'); }
    } catch { setMsg('Could not reach the server, please email me instead'); setStatus('failed'); }
  }

  function copy() {
    navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); });
  }

  return (
    <Section id="contact" title="Has a tool outgrown its spreadsheet?" description={profile.availability}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="reveal space-y-4">
          <Card className="gap-3 py-5">
            <CardHeader className="px-5"><CardDescription>Email</CardDescription></CardHeader>
            <CardContent className="space-y-4 px-5">
              <a href={`mailto:${profile.email}`} className="block font-medium [overflow-wrap:anywhere] underline-offset-4 hover:underline">{profile.email}</a>
              <Button variant="outline" size="sm" onClick={copy}>
                {copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy address'}
              </Button>
            </CardContent>
          </Card>
          {whatsappLink(profile) && (
            <Card className="gap-3 py-5">
              <CardHeader className="px-5"><CardDescription>WhatsApp</CardDescription></CardHeader>
              <CardContent className="space-y-4 px-5">
                <p className="text-sm text-muted-foreground">Quickest way to reach me. Opens a chat with {profile.whatsapp}</p>
                <Button asChild className="bg-[#25d366] text-[#0b2e17] hover:bg-[#25d366]/90">
                  <a href={whatsappLink(profile)} target="_blank" rel="noreferrer"><WhatsappIcon className="size-4" />Message on WhatsApp</a>
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="gap-3 py-5">
            <CardHeader className="px-5"><CardDescription>Elsewhere</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-2 px-5">
              {profile.links.map((l) => {
                const Icon = socialIcon(l.label);
                return (
                  <Button key={l.url} asChild variant="outline" size="sm">
                    <a href={l.url} target="_blank" rel="noreferrer"><Icon className="size-4" />{l.label}</a>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="reveal">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
            <CardDescription>I usually reply within two days</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={send} noValidate className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" name="name" value={form.name} onChange={up} autoComplete="name" aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" name="email" type="email" value={form.email} onChange={up} autoComplete="email" aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-msg">Message</Label>
                <Textarea id="c-msg" name="message" rows={5} value={form.message} onChange={up} className="min-h-32" aria-invalid={!!errors.message} />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>
              <label className="absolute -left-[9999px]" aria-hidden="true">Website<input name="website" value={form.website} onChange={up} tabIndex={-1} autoComplete="off" /></label>
              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</Button>
                <p role="status" className={cn('text-sm', status === 'failed' ? 'text-destructive' : 'text-muted-foreground')}>
                  {status === 'sent' && 'Thanks, your message is in. I will reply soon'}
                  {status === 'failed' && msg}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Footer({ profile }) {
  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React, Node.js and shadcn/ui</p>
        <a href="#top" className="transition-colors hover:text-foreground">Back to top</a>
      </Container>
    </footer>
  );
}

/* ---------- Page ---------- */
export default function Pro() {
  const [data, setData] = useState(null);
  const [theme, toggleTheme] = useTheme();
  const active = useActiveSection(!!data);
  useReveal(data);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => { setData(d); document.title = `${d.profile.name}, ${d.profile.role.toLowerCase()}`; })
      .catch(() => setData(false));
  }, []);

  if (data === false) {
    return <p className="p-10 text-muted-foreground">The portfolio could not load. Is the server running?</p>;
  }
  if (!data) return <div className="min-h-svh bg-background" />;

  const { profile } = data;
  const current = data.experience[0]?.title || '';

  return (
    <div className="min-h-svh bg-background font-sans text-foreground">
      <a href="#about" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2">Skip to content</a>
      <Header profile={profile} theme={theme} toggleTheme={toggleTheme} active={active} />
      <main>
        <Hero profile={profile} current={current} />
        <About profile={profile} experience={data.experience} projects={data.projects} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} githubNote={data.githubNote} />
        <Experience items={data.experience} writing={data.writing} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
