import { useEffect, useRef, useState } from 'react';

/*
  Wraps a project window in 3D.
  - Scrolling into view: it rises from a tipped-back angle to flat.
  - Pointer over it: it leans a few degrees toward the cursor.
  Both are skipped for people who ask for reduced motion.
*/
export default function Tilt({ children, side = 'left' }) {
  const box = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return;
    const card = el.firstElementChild;
    let frame = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--tx', `${(x * 8).toFixed(2)}deg`);
        card.style.setProperty('--ty', `${(-y * 6).toFixed(2)}deg`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      card.style.setProperty('--tx', '0deg');
      card.style.setProperty('--ty', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`tilt tilt--${side}${inView ? ' is-in' : ''}`} ref={box}>
      <div className="tilt__card">{children}</div>
    </div>
  );
}
