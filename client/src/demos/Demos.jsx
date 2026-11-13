import '../legacy.js';
import { Suspense, lazy, useEffect, useState } from 'react';
import './demos.css';

export const DEMOS = [
  { id: 'town', name: 'Delivery Town', blurb: 'A little 3D town you ride a scooter around. Buildings are projects, crates are skills, the post box is contact' },
  { id: 'world', name: '3D world', blurb: 'Your desk in a dark room. Scroll to fly the camera to the monitor, the shelf and the phone' },
  { id: 'physics', name: 'Physics playground', blurb: 'Your name, skills and projects fall in with gravity. Grab and throw anything' },
  { id: 'cinematic', name: 'Cinematic scroll', blurb: 'Giant type and a 3D keyboard that turns, zooms and becomes your projects as you scroll' },
  { id: 'neon', name: 'Dark neon', blurb: 'Thousands of glowing particles form your name and scatter around your mouse' }
];

const PAGES = {
  town: lazy(() => import('./Town.jsx')),
  world: lazy(() => import('./World.jsx')),
  physics: lazy(() => import('./Physics.jsx')),
  cinematic: lazy(() => import('./Cinematic.jsx')),
  neon: lazy(() => import('./Neon.jsx'))
};

export function usePortfolio() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/portfolio').then((r) => r.json()).then(setData).catch(() => setData(false));
  }, []);
  return data;
}

// The bar at the top of every demo, to move between designs
export function DemoBar({ id }) {
  const i = DEMOS.findIndex((d) => d.id === id);
  const prev = DEMOS[(i - 1 + DEMOS.length) % DEMOS.length];
  const next = DEMOS[(i + 1) % DEMOS.length];
  return (
    <div className="demobar">
      <a href="/demo" className="demobar__all">All designs</a>
      <span className="demobar__now">Design {i + 1} of {DEMOS.length}: <b>{DEMOS[i].name}</b></span>
      <span className="demobar__nav">
        <a href={`/demo/${prev.id}`}>← {prev.name}</a>
        <a href={`/demo/${next.id}`}>{next.name} →</a>
      </span>
    </div>
  );
}

function Picker() {
  useEffect(() => { document.title = 'Pick a design'; }, []);
  return (
    <div className="picker">
      <h1>Pick a design</h1>
      <p className="picker__sub">Four directions for your portfolio, all using your real content. Open each one, then tell me which to keep.</p>
      <ol className="picker__list">
        {DEMOS.map((d, i) => (
          <li key={d.id}>
            <a href={`/demo/${d.id}`}>
              <span className="picker__n">{i + 1}</span>
              <span className="picker__name">{d.name}</span>
              <span className="picker__blurb">{d.blurb}</span>
            </a>
          </li>
        ))}
        <li>
          <a href="/">
            <span className="picker__n">0</span>
            <span className="picker__name">Current site</span>
            <span className="picker__blurb">The paper-and-ink version with the exploding keyboard</span>
          </a>
        </li>
      </ol>
    </div>
  );
}

export default function Demos() {
  const id = window.location.pathname.split('/')[2] || '';
  const Page = PAGES[id];
  if (!Page) return <Picker />;
  return (
    <Suspense fallback={<div className="demo-loading">Loading</div>}>
      <Page />
    </Suspense>
  );
}
