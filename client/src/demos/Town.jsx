import { useEffect, useRef, useState } from 'react';
import { DemoBar, usePortfolio } from './Demos.jsx';
import './town.css';

function TownGame({ data }) {
  const { profile, projects, skills, experience } = data;
  const canvas = useRef(null);
  const game = useRef(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    import('./town/townScene.js')
      .then(({ createTown }) => {
        if (!alive || !canvas.current) return;
        try {
          game.current = createTown(canvas.current, data, { onZone: setZone });
          setLoading(false);
        } catch { setFailed(true); }
      })
      .catch(() => setFailed(true));
    return () => { alive = false; game.current?.dispose(); };
  }, [data]);

  // Start on any key or tap
  useEffect(() => {
    if (started || loading) return;
    const go = () => setStarted(true);
    window.addEventListener('keydown', go, { once: true });
    return () => window.removeEventListener('keydown', go);
  }, [started, loading]);

  // Touch buttons
  const hold = (k) => ({
    onPointerDown: (e) => { e.preventDefault(); game.current?.setKey(k, true); },
    onPointerUp: () => game.current?.setKey(k, false),
    onPointerLeave: () => game.current?.setKey(k, false),
    onPointerCancel: () => game.current?.setKey(k, false)
  });

  const p = zone?.kind === 'project' ? projects[zone.index] : null;

  if (failed) {
    return (
      <div className="town-fail">
        <p>This device can't run the 3D town.</p>
        <a href="/">Open the classic site</a>
      </div>
    );
  }

  return (
    <div className="town">
      <canvas ref={canvas} className="town__canvas" />

      <header className="town__hud">
        <div>
          <p className="town__name">{profile.name}</p>
          <p className="town__role">{profile.role}, {profile.location}</p>
        </div>
        <nav className="town__jump" aria-label="Go to">
          {projects.map((pr, i) => (
            <button key={pr.title} type="button" onClick={() => game.current?.teleport('project', i)}>{pr.title}</button>
          ))}
          <button type="button" onClick={() => game.current?.teleport('skills')}>Skills</button>
          <button type="button" onClick={() => game.current?.teleport('about')}>About</button>
          <button type="button" onClick={() => game.current?.teleport('contact')}>Contact</button>
        </nav>
        <a className="town__classic" href="/">Classic site</a>
      </header>

      {/* What you parked at */}
      <div className={`town__card${zone ? ' is-on' : ''}`} aria-live="polite">
        {p && (
          <>
            <p className="town__meta">{[p.year, p.role, p.category].filter(Boolean).join(' · ')}</p>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p className="town__tags">{(p.tags || []).join(' / ')}</p>
            <p className="town__links">
              {p.live && <a href={p.live} target="_blank" rel="noreferrer">Visit the site</a>}
              {p.code && <a href={p.code} target="_blank" rel="noreferrer">Read the code</a>}
            </p>
          </>
        )}
        {zone?.kind === 'skills' && (
          <>
            <p className="town__meta">Skills yard</p>
            <h2>What I work with</h2>
            {skills.map((g) => <p key={g.group}><b>{g.group}:</b> {g.items.join(', ')}</p>)}
            <p className="town__tags">Ride into the crates</p>
          </>
        )}
        {zone?.kind === 'about' && (
          <>
            <p className="town__meta">About</p>
            <h2>{profile.headline}</h2>
            <p>{profile.intro}</p>
            {experience.slice(0, 3).map((e) => <p key={e.title} className="town__small"><b>{e.dates}</b> · {e.title}{e.org ? `, ${e.org}` : ''}</p>)}
          </>
        )}
        {zone?.kind === 'contact' && (
          <>
            <p className="town__meta">Post box</p>
            <h2>Send me a message</h2>
            <p>{profile.availability}</p>
            <a className="town__email" href={`mailto:${profile.email}`}>{profile.email}</a>
            <p className="town__links">{profile.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}</p>
          </>
        )}
      </div>

      {/* Phone controls */}
      <div className="town__pad" aria-hidden="true">
        <div className="town__pad-left">
          <button type="button" {...hold('left')}>◀</button>
          <button type="button" {...hold('right')}>▶</button>
        </div>
        <div className="town__pad-right">
          <button type="button" {...hold('down')}>▼</button>
          <button type="button" className="is-go" {...hold('up')}>▲</button>
        </div>
      </div>

      {/* Start screen */}
      {!started && (
        <div className="town__start" onClick={() => !loading && setStarted(true)}>
          <div className="town__start-box">
            <p className="town__meta">{profile.role}, {profile.location}</p>
            <h1>{profile.name}'s<br />Delivery Town</h1>
            <p>Ride around town. Each building is a project, the crates are my skills, and the post box is how to reach me.</p>
            <div className="town__keys">
              <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or arrows to ride</span>
              <span><kbd>Shift</kbd> to go faster</span>
            </div>
            <button type="button" className="town__go" disabled={loading} onClick={() => setStarted(true)}>
              {loading ? 'Building the town' : 'Start riding'}
            </button>
            <a className="town__skip" href="/" onClick={(e) => e.stopPropagation()}>Skip to the classic site</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Town() {
  const data = usePortfolio();
  useEffect(() => { document.title = 'Delivery Town'; }, []);
  if (data === false) return <p style={{ padding: 40 }}>Could not load the portfolio</p>;
  if (!data) return <div className="demo-loading">Loading</div>;
  return (
    <>
      <TownGame data={data} />
      <DemoBar id="town" />
    </>
  );
}
