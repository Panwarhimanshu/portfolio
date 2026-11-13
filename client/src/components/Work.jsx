import { useMemo, useState } from 'react';
import BrowserWindow from './BrowserWindow.jsx';
import Tilt from './Tilt.jsx';
import { projectId } from './Orbit.jsx';

function Project({ p, flip }) {
  const link = p.live || p.code || '';
  const meta = [p.year, p.role, p.category].filter(Boolean).join(' · ');
  const cls = ['project', p.featured && 'project--feature', flip && 'project--flip'].filter(Boolean).join(' ');

  return (
    <article className={cls} id={projectId(p.title)}>
      <div className="project__shot"><Tilt side={flip ? 'right' : 'left'}><BrowserWindow project={p} /></Tilt></div>
      <div className="project__text">
        {meta && <p className="project__meta mono">{meta}</p>}
        <h3>{link ? <a href={link} target="_blank" rel="noopener noreferrer">{p.title}</a> : p.title}</h3>
        <p className="project__desc">{p.description}</p>
        {p.tags?.length > 0 && <p className="project__stack mono">{p.tags.join(' / ')}</p>}
        {(p.live || p.code) && (
          <p className="project__links">
            {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Visit the site</a>}
            {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer">Read the code</a>}
          </p>
        )}
      </div>
    </article>
  );
}

export default function Work({ projects, note }) {
  const [filter, setFilter] = useState('All');

  const cats = useMemo(() => {
    const list = [];
    projects.forEach((p) => p.category && !list.includes(p.category) && list.push(p.category));
    return list;
  }, [projects]);

  const count = (c) => (c === 'All' ? projects.length : projects.filter((p) => p.category === c).length);
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  // Non-featured projects alternate sides
  let n = 0;

  return (
    <section className="wrap section" id="work" aria-labelledby="work-h">
      <header className="section__head">
        <h2 id="work-h">Work</h2>
        <p className="section__dek">Projects that real people use, newest first</p>
      </header>

      {cats.length > 1 && (
        <div className="filters" role="group" aria-label="Filter projects">
          {['All', ...cats].map((c) => (
            <button key={c} type="button" className="filter" aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {c}<span>{count(c)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="projects">
        {shown.map((p) => {
          const flip = !p.featured && n++ % 2 === 0;
          return <Project key={p.title} p={p} flip={flip} />;
        })}
      </div>

      {note && (
        <p className="more-link">{note.text} <a href={note.url}>{note.label}</a></p>
      )}
    </section>
  );
}
