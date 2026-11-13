import { useState } from 'react';
import { MOCKS } from './Mocks.jsx';

const shortUrl = (u = '') => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

function Lock() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
    </svg>
  );
}

// A plain browser frame. The address bar shows the project's real link.
export default function BrowserWindow({ project }) {
  const [imgOk, setImgOk] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const link = project.live || project.code || '';
  const Mock = project.mock && MOCKS[project.mock];

  return (
    <div className="window">
      <div className="window__bar">
        {link ? (
          <a className="window__url" href={link} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
            <Lock /><span>{shortUrl(link)}</span>
          </a>
        ) : (
          <span className="window__url"><Lock /><span>{project.title.toLowerCase()}</span></span>
        )}
      </div>
      <div className={`window__view${imgOk ? ' has-img' : ''}`}>
        {Mock && !imgOk && <Mock />}
        {project.image && !imgFailed && (
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            loading="lazy"
            width="1600"
            height="1000"
            onLoad={() => setImgOk(true)}
            onError={() => setImgFailed(true)}
            style={imgOk ? undefined : { position: 'absolute', opacity: 0 }}
          />
        )}
      </div>
    </div>
  );
}
