import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { DemoBar, usePortfolio } from './Demos.jsx';
import './world.css';

/* ---------- Canvas textures: text drawn for the monitor, phone and book spines ---------- */
function wrap(g, text, x, y, maxW, lh, maxLines = 99) {
  const words = String(text || '').split(' ');
  let line = '', n = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y + n * lh);
      line = w;
      if (++n >= maxLines) return n;
    } else line = test;
  }
  g.fillText(line, x, y + n * lh);
  return n + 1;
}

function screenCanvas(p, i, total) {
  const c = document.createElement('canvas');
  c.width = 1280; c.height = 760;
  const g = c.getContext('2d');
  g.fillStyle = '#0f1117'; g.fillRect(0, 0, c.width, c.height);
  // browser bar
  g.fillStyle = '#1b1e27'; g.fillRect(0, 0, c.width, 70);
  g.fillStyle = '#272b37'; g.beginPath(); g.roundRect(40, 16, 1200, 38, 10); g.fill();
  g.fillStyle = '#8b93a7'; g.font = '500 22px "IBM Plex Mono", monospace';
  g.fillText((p.live || p.code || p.title).replace(/^https?:\/\//, ''), 64, 42);
  // content
  g.fillStyle = '#7d89ff'; g.font = '500 24px "IBM Plex Mono", monospace';
  g.fillText(`${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}   ${[p.year, p.category].filter(Boolean).join(' · ')}`, 70, 150);
  g.fillStyle = '#f1ece2'; g.font = '400 96px Newsreader, Georgia, serif';
  g.fillText(p.title, 66, 250);
  g.fillStyle = '#b9b3a8'; g.font = '400 32px "Libre Franklin", system-ui, sans-serif';
  const lines = wrap(g, p.description, 70, 320, 1080, 46, 5);
  g.fillStyle = '#8b93a7'; g.font = '500 24px "IBM Plex Mono", monospace';
  g.fillText((p.tags || []).join('  /  '), 70, 320 + lines * 46 + 40);
  g.fillStyle = '#5c6378'; g.font = '500 22px "IBM Plex Mono", monospace';
  g.fillText('← →  browse projects', 70, 720);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function phoneCanvas(profile) {
  const c = document.createElement('canvas');
  c.width = 360; c.height = 720;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 720);
  grd.addColorStop(0, '#1d2140'); grd.addColorStop(1, '#0d0f1c');
  g.fillStyle = grd; g.fillRect(0, 0, 360, 720);
  g.fillStyle = '#f1ece2'; g.font = '400 54px Newsreader, Georgia, serif';
  g.fillText('Say hi', 32, 140);
  g.fillStyle = '#9aa2ff'; g.font = '500 22px "IBM Plex Mono", monospace';
  wrap(g, profile.email, 32, 200, 300, 30, 3);
  g.fillStyle = '#b9b3a8'; g.font = '400 22px "Libre Franklin", sans-serif';
  (profile.links || []).forEach((l, i) => g.fillText(l.label, 32, 330 + i * 40));
  g.fillStyle = '#4a63e0'; g.beginPath(); g.roundRect(32, 600, 296, 64, 32); g.fill();
  g.fillStyle = '#fff'; g.font = '500 24px "Libre Franklin", sans-serif'; g.fillText('Write to me', 112, 640);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function spineCanvas(text, bg, ink) {
  const c = document.createElement('canvas');
  c.width = 96; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 96, 512);
  g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(0, 40, 96, 4); g.fillRect(0, 468, 96, 4);
  g.save(); g.translate(60, 470); g.rotate(-Math.PI / 2);
  g.fillStyle = ink; g.font = '500 34px "Libre Franklin", sans-serif';
  g.fillText(text.length > 22 ? `${text.slice(0, 21)}…` : text, 0, 0);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- Camera stops, one per section ---------- */
const STOPS = [
  { pos: [0.6, 3.4, 8.2], look: [0, 1.4, 0] },        // the room
  { pos: [0, 1.95, 2.55], look: [0, 1.82, -0.7] },     // monitor: projects
  { pos: [3.1, 2.75, 1.1], look: [3.4, 2.55, -1.35] }, // shelf: skills
  { pos: [-1.0, 1.55, 1.6], look: [-1.75, 1.05, -0.1] }, // photo: about
  { pos: [1.15, 1.45, 1.55], look: [1.75, 0.95, 0.15] } // phone: contact
];

function buildRoom(canvas, data, onReady) {
  const { profile, projects, skills } = data;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c0b0a');
  scene.fog = new THREE.Fog('#0c0b0a', 9, 22);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 60);

  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o });
  const add = (geo, mat, x, y, z, { cast = true, recv = true } = {}) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast; m.receiveShadow = recv;
    scene.add(m);
    return m;
  };

  // Room
  add(new THREE.PlaneGeometry(40, 40), std('#1a1714', { roughness: 0.9 }), 0, 0, 0, { cast: false }).rotation.x = -Math.PI / 2;
  add(new THREE.PlaneGeometry(40, 12), std('#24201c', { roughness: 1 }), 0, 6, -1.6, { cast: false });

  // Desk
  const wood = std('#6e4a2c', { roughness: 0.55 });
  add(new RoundedBoxGeometry(6.4, 0.12, 2.6, 2, 0.04), wood, 0, 1.0, 0);
  [[-3, -1.1], [3, -1.1], [-3, 1.1], [3, 1.1]].forEach(([x, z]) => add(new THREE.BoxGeometry(0.1, 1, 0.1), std('#2a2622', { metalness: 0.6, roughness: 0.4 }), x, 0.5, z));

  // Monitor
  const dark = std('#121212', { metalness: 0.5, roughness: 0.35 });
  add(new THREE.CylinderGeometry(0.28, 0.32, 0.03, 40), dark, 0, 1.075, -0.65);
  add(new THREE.BoxGeometry(0.08, 0.6, 0.06), dark, 0, 1.38, -0.7);
  add(new RoundedBoxGeometry(2.7, 1.62, 0.08, 3, 0.03), dark, 0, 1.82, -0.75);
  const screenMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  const screen = add(new THREE.PlaneGeometry(2.6, 1.52), screenMat, 0, 1.82, -0.705, { cast: false, recv: false });
  const glow = new THREE.PointLight('#7d89ff', 4, 4, 1.6);
  glow.position.set(0, 1.8, -0.2);
  scene.add(glow);

  // Keyboard
  add(new RoundedBoxGeometry(1.5, 0.05, 0.5, 2, 0.02), std('#2b2825', { metalness: 0.5, roughness: 0.4 }), 0, 1.09, 0.35);
  const keyGeo = new RoundedBoxGeometry(0.085, 0.04, 0.085, 2, 0.012);
  const keys = new THREE.InstancedMesh(keyGeo, std('#ece6da', { roughness: 0.5 }), 14 * 4);
  const m4 = new THREE.Matrix4();
  let ki = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { m4.makeTranslation(-0.64 + c * 0.098, 1.13, 0.2 + r * 0.098); keys.setMatrixAt(ki++, m4); }
  keys.castShadow = true;
  scene.add(keys);

  // Mug
  const mug = std('#e9e2d6', { roughness: 0.35 });
  add(new THREE.CylinderGeometry(0.13, 0.12, 0.28, 32), mug, -1.05, 1.2, 0.45);
  const handle = add(new THREE.TorusGeometry(0.07, 0.022, 12, 24), mug, -0.92, 1.2, 0.45);
  handle.rotation.y = Math.PI / 2;

  // Lamp with a warm spot light
  const metal = std('#2f2b27', { metalness: 0.7, roughness: 0.35 });
  add(new THREE.CylinderGeometry(0.22, 0.25, 0.05, 32), metal, 2.5, 1.09, -0.6);
  const arm = add(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 12), metal, 2.35, 1.7, -0.5);
  arm.rotation.z = 0.35;
  const shade = add(new THREE.ConeGeometry(0.28, 0.35, 32, 1, true), std('#4a63e0', { side: THREE.DoubleSide, roughness: 0.4 }), 2.05, 2.3, -0.35);
  shade.rotation.z = -0.9;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: '#ffe2b0' }));
  bulb.position.set(1.95, 2.2, -0.3); scene.add(bulb);
  const spot = new THREE.SpotLight('#ffd9a3', 60, 9, 0.75, 0.5, 1.6);
  spot.position.set(1.95, 2.2, -0.3);
  spot.target.position.set(0.6, 1, 0.3);
  spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -0.0005;
  scene.add(spot, spot.target);

  // Soft fill so nothing is pitch black
  scene.add(new THREE.HemisphereLight('#c7c9ff', '#2a2018', 0.35));
  const fill = new THREE.DirectionalLight('#ffe9cc', 0.5);
  fill.position.set(-4, 6, 6);
  scene.add(fill);

  // Shelf with one book per skill
  const shelfX = 3.4, shelfY = 2.25, shelfZ = -1.4;
  add(new THREE.BoxGeometry(2.4, 0.06, 0.4), wood, shelfX, shelfY, shelfZ);
  add(new THREE.BoxGeometry(2.4, 0.06, 0.4), wood, shelfX, shelfY + 0.75, shelfZ);
  const shelfLight = new THREE.PointLight('#ffd9a3', 6, 3.5, 1.4);
  shelfLight.position.set(shelfX, shelfY + 1.4, shelfZ + 0.9);
  scene.add(shelfLight);
  const bookColors =[['#2a45c2', '#ffffff'], ['#e9e2d6', '#2a2622'], ['#3b3631', '#e9e2d6'], ['#8a3b2e', '#f6e7d6'], ['#2f5d4a', '#e7f2ec'], ['#c9a15a', '#2a2018']];
  const allSkills = skills.flatMap((g) => g.items).slice(0, 22);
  let bx = shelfX - 1.12, row = 0;
  allSkills.forEach((s, i) => {
    const w = 0.075 + ((i * 37) % 5) * 0.012;
    const h = 0.5 + ((i * 53) % 4) * 0.05;
    if (bx + w > shelfX + 1.15) { bx = shelfX - 1.12; row++; }
    if (row > 1) return;
    const [bg, ink] = bookColors[i % bookColors.length];
    const mats = [std(bg), std(bg), std(bg), std(bg), new THREE.MeshStandardMaterial({ map: spineCanvas(s, bg, ink), roughness: 0.6 }), std(bg)];
    const book = add(new THREE.BoxGeometry(w, h, 0.3), mats, bx + w / 2, shelfY + 0.03 + h / 2 + row * 0.75, shelfZ + 0.03);
    if (i % 7 === 3) book.rotation.z = -0.12;
    bx += w + 0.008;
  });

  // Photo frame
  const frame = add(new RoundedBoxGeometry(0.62, 0.78, 0.05, 2, 0.02), std('#e9e2d6', { roughness: 0.4 }), -1.75, 1.45, -0.35);
  frame.rotation.set(-0.12, 0.35, 0);
  const photoMat = new THREE.MeshStandardMaterial({ color: '#3b3631', roughness: 0.6 });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.66), photoMat);
  photo.position.set(0, 0, 0.027);
  frame.add(photo);
  if (profile.photo) {
    new THREE.TextureLoader().load(profile.photo, (t) => { t.colorSpace = THREE.SRGBColorSpace; photoMat.map = t; photoMat.color.set('#ffffff'); photoMat.needsUpdate = true; });
  }

  // Phone
  const phone = add(new RoundedBoxGeometry(0.36, 0.72, 0.04, 3, 0.05), std('#151515', { metalness: 0.6, roughness: 0.3 }), 1.75, 1.08, 0.25);
  phone.rotation.set(-Math.PI / 2, 0, -0.35);
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.66), new THREE.MeshBasicMaterial({ map: phoneCanvas(profile), toneMapped: false }));
  phoneScreen.position.z = 0.021;
  phone.add(phoneScreen);

  // ---------- Loop ----------
  let project = 0;
  const setProject = (i) => {
    project = (i + projects.length) % projects.length;
    screenMat.map?.dispose();
    screenMat.map = screenCanvas(projects[project], project, projects.length);
    screenMat.needsUpdate = true;
    return project;
  };
  setProject(0);

  let progress = 0, mx = 0, my = 0, raf = 0, running = true;
  const cur = { pos: new THREE.Vector3(...STOPS[0].pos), look: new THREE.Vector3(...STOPS[0].look) };
  const tPos = new THREE.Vector3(), tLook = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
  const ease = (t) => t * t * (3 - 2 * t);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 62 : 42;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const onMove = (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('pointermove', onMove, { passive: true });

  function loop() {
    if (!running) return;
    const seg = Math.min(STOPS.length - 1.0001, progress * (STOPS.length - 1));
    const i = Math.floor(seg), f = ease(seg - i);
    const A = STOPS[i], B = STOPS[i + 1];
    tPos.copy(a.set(...A.pos)).lerp(b.set(...B.pos), f);
    tLook.copy(a.set(...A.look)).lerp(b.set(...B.look), f);
    tPos.x += mx * 0.25; tPos.y -= my * 0.15;
    cur.pos.lerp(tPos, 0.08);
    cur.look.lerp(tLook, 0.08);
    camera.position.copy(cur.pos);
    camera.lookAt(cur.look);
    glow.intensity = 3.5 + Math.sin(performance.now() / 900) * 0.4;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  loop();
  onReady?.();

  return {
    setProgress: (p) => { progress = Math.max(0, Math.min(1, p)); },
    setProject,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      scene.traverse((o) => {
        o.geometry?.dispose();
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m?.map?.dispose(); m?.dispose(); });
      });
      renderer.dispose();
    }
  };
}

const SECTIONS = ['intro', 'projects', 'skills', 'about', 'contact'];

export default function World() {
  const data = usePortfolio();
  const canvas = useRef(null);
  const room = useRef(null);
  const [stop, setStop] = useState(0);
  const [project, setProject] = useState(0);

  useEffect(() => { document.title = 'Design 1: 3D world'; }, []);

  useEffect(() => {
    if (!data || !canvas.current) return;
    room.current = buildRoom(canvas.current, data);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      room.current?.setProgress(p);
      setStop(Math.round(p * (SECTIONS.length - 1)));
    };
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setProject(room.current.setProject(room.current && (projectRef.current + 1)));
      if (e.key === 'ArrowLeft') setProject(room.current.setProject(room.current && (projectRef.current - 1)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      room.current?.dispose();
    };
  }, [data]);

  const projectRef = useRef(0);
  projectRef.current = project;
  const go = (d) => setProject(room.current.setProject(project + d));

  if (data === false) return <p className="w-msg">Could not load the portfolio</p>;
  if (!data) return <div className="demo-loading">Loading the room</div>;

  const { profile, projects, skills, experience } = data;
  const p = projects[project];

  return (
    <div className="world">
      <canvas ref={canvas} className="world__canvas" />
      <div className="world__scroll" aria-hidden="true" />

      <section className={`w-panel w-panel--intro${stop === 0 ? ' is-on' : ''}`}>
        <p className="w-kicker">{profile.role}, {profile.location}</p>
        <h1>{profile.name}</h1>
        <p className="w-lede">{profile.headline}</p>
        <p className="w-hint">Scroll to look around the room</p>
      </section>

      <section className={`w-panel w-panel--right${stop === 1 ? ' is-on' : ''}`}>
        <p className="w-kicker">On the monitor · project {project + 1} of {projects.length}</p>
        <h2>{p.title}</h2>
        <p>{p.description}</p>
        <div className="w-row">
          <button type="button" className="w-btn" onClick={() => go(-1)}>←</button>
          <button type="button" className="w-btn" onClick={() => go(1)}>→</button>
          {p.live && <a className="w-link" href={p.live} target="_blank" rel="noreferrer">Visit site</a>}
          {p.code && <a className="w-link" href={p.code} target="_blank" rel="noreferrer">Code</a>}
        </div>
      </section>

      <section className={`w-panel w-panel--left${stop === 2 ? ' is-on' : ''}`}>
        <p className="w-kicker">On the shelf</p>
        <h2>Skills</h2>
        {skills.map((g) => (
          <p key={g.group}><b>{g.group}:</b> {g.items.join(', ')}</p>
        ))}
      </section>

      <section className={`w-panel w-panel--right${stop === 3 ? ' is-on' : ''}`}>
        <p className="w-kicker">About</p>
        <h2>{profile.name}</h2>
        <p>{profile.intro}</p>
        {experience.slice(0, 3).map((e) => (
          <p key={e.title} className="w-small"><b>{e.dates}</b> · {e.title}{e.org ? `, ${e.org}` : ''}</p>
        ))}
      </section>

      <section className={`w-panel w-panel--left${stop === 4 ? ' is-on' : ''}`}>
        <p className="w-kicker">Contact</p>
        <h2>Say hi</h2>
        <p>{profile.availability}</p>
        <a className="w-email" href={`mailto:${profile.email}`}>{profile.email}</a>
        <div className="w-row">
          {profile.links.map((l) => <a key={l.url} className="w-link" href={l.url}>{l.label}</a>)}
        </div>
      </section>

      <nav className="w-dots" aria-label="Sections">
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            type="button"
            className={stop === i ? 'is-on' : ''}
            aria-label={s}
            onClick={() => window.scrollTo({ top: (i / (SECTIONS.length - 1)) * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
          />
        ))}
      </nav>

      <DemoBar id="world" />
    </div>
  );
}
