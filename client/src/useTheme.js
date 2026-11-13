import { useCallback, useEffect, useState } from 'react';

// Light / dark mode. Follows the system setting until the visitor picks one, then remembers it.
export function useTheme() {
  const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const read = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : !!(media && media.matches);
  };
  const [dark, setDark] = useState(read);

  useEffect(() => {
    if (!media) return;
    const onChange = () => setDark(read());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = read() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    setDark(next === 'dark');
  }, []);

  return { dark, toggle };
}
