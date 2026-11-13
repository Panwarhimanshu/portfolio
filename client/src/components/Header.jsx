import { useEffect, useState } from 'react';
import { useTheme } from '../useTheme.js';

const LINKS = [
  ['work', 'Work'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['writing', 'Writing'],
  ['contact', 'Contact']
];

export default function Header({ name }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const { dark, toggle } = useTheme();

  // Hairline under the header once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mark the section currently in the middle of the screen
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  return (
    <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap topbar__inner">
        <a className="brand" href="#top">{name}</a>
        <nav className="nav" aria-label="Sections">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined}>{label}</a>
          ))}
        </nav>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggle}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
          )}
        </button>
      </div>
    </header>
  );
}
