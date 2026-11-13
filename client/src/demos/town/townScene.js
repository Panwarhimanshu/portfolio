import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';

/*
  Delivery Town: ride a scooter around a little town.
  Buildings are projects, crates are skills, the letters of your name can be knocked over.
  Calls onZone(zone | null) when the scooter parks in front of something.
*/

const PAL = {
  sky: '#ffd8b4',
  ground: '#efc995',
  grass: '#9cc46b',
  road: '#4a4440',
  line: '#f6efe2',
  wood: '#a8713f',
  roof: ['#d9573b', '#2a45c2', '#2f7d5b', '#e2a33a', '#7a4fb8', '#c2405f'],
  wall: ['#fff4e2', '#f4e3cf', '#fde9d2', '#efe6da'],
  letters: '#1f1b16',
  crate: '#c98c4f',
  scooter: '#e23c2b',
  tiffin: '#2a45c2'
};

function labelTexture(text, { w = 512, h = 128, bg = '#fff4e2', ink = '#1f1b16', font = 'bold 64px "Libre Franklin", Arial, sans-serif', border = null } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (border) { g.strokeStyle = border; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); }
  g.fillStyle = ink; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  let size = parseInt(font.match(/(\d+)px/)[1], 10);
  while (g.measureText(text).width > w * 0.9 && size > 14) { size -= 2; g.font = font.replace(/\d+px/, `${size}px`); }
  g.fillText(text, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function createTown(canvas, data, { onZone, onSpeed } = {}) {
  const { profile, projects, skills } = data;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.sky);
  scene.fog = new THREE.Fog(PAL.sky, 45, 110);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);

  // Lights: warm late-afternoon sun
  scene.add(new THREE.HemisphereLight('#fff1dc', '#c98c4f', 1.1));
  const sun = new THREE.DirectionalLight('#fff0d6', 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 120 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...o });
  const mesh = (geo, m, { cast = true, recv = true } = {}) => { const x = new THREE.Mesh(geo, m); x.castShadow = cast; x.receiveShadow = recv; return x; };

  // ---------- Ground, grass and the ring road ----------
  const ground = mesh(new THREE.CircleGeometry(140, 64), mat(PAL.ground), { cast: false });
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const R_IN = 19, R_OUT = 25;
  const road = mesh(new THREE.RingGeometry(R_IN, R_OUT, 96), mat(PAL.road, { roughness: 0.95 }), { cast: false });
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.02;
  scene.add(road);
  const dash = new THREE.InstancedMesh(new THREE.BoxGeometry(0.25, 0.02, 1.4), mat(PAL.line), 60);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s1 = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, r = (R_IN + R_OUT) / 2;
    q.setFromAxisAngle(up, -a);
    m4.compose(new THREE.Vector3(Math.cos(a) * r, 0.04, Math.sin(a) * r), q, s1);
    dash.setMatrixAt(i, m4);
  }
  scene.add(dash);

  // Grass patches inside the ring
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4, r = 11 + (i % 2) * 2;
    const g = mesh(new THREE.CircleGeometry(3.2 + (i % 3), 18), mat(PAL.grass), { cast: false });
    g.rotation.x = -Math.PI / 2;
    g.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r);
    scene.add(g);
  }

  // ---------- Static colliders (circles on the ground) ----------
  const solids = []; // { x, z, r }

  // Trees
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 1.2, 6);
  const leafGeo = new THREE.IcosahedronGeometry(1.1, 0);
  const trunkMat = mat('#7a5232'), leafMat = [mat('#6faa4b'), mat('#5d9a41'), mat('#86b85a')];
  const tree = (x, z, s = 1) => {
    const t = new THREE.Group();
    const tr = mesh(trunkGeo, trunkMat); tr.position.y = 0.6; t.add(tr);
    const lf = mesh(leafGeo, leafMat[(Math.abs(x * 7 + z * 3) | 0) % 3]); lf.position.y = 1.9; lf.rotation.y = x; t.add(lf);
    t.position.set(x, 0, z); t.scale.setScalar(s);
    scene.add(t);
    solids.push({ x, z, r: 0.5 * s });
  };

  // ---------- Buildings: one per project ----------
  const zones = []; // { x, z, r, kind, index, label }
  const n = Math.max(1, projects.length);
  projects.forEach((p, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + Math.PI / n;
    const rb = R_OUT + 7;
    const bx = Math.cos(a) * rb, bz = Math.sin(a) * rb;
    const big = p.featured ? 1.35 : 1;
    const b = new THREE.Group();
    const w = 6 * big, d = 5 * big, h = (3.4 + (i % 3) * 0.9) * big;
    const wall = mesh(new THREE.BoxGeometry(w, h, d), mat(PAL.wall[i % PAL.wall.length]));
    wall.position.y = h / 2; b.add(wall);
    // pitched roof
    const roof = mesh(new THREE.CylinderGeometry(0.01, (w / 2) * 1.12, 2.2 * big, 4, 1), mat(PAL.roof[i % PAL.roof.length]));
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1, 1, d / w);
    roof.position.y = h + 1.1 * big;
    b.add(roof);
    // door and windows on the side that faces the road
    const door = mesh(new THREE.BoxGeometry(1.2, 2.1, 0.1), mat('#3b2a1e'));
    door.position.set(0, 1.05, d / 2 + 0.05); b.add(door);
    const winMat = mat('#bfe0ff', { emissive: '#ffd27a', emissiveIntensity: 0.25 });
    [-1, 1].forEach((sx) => { const wnd = mesh(new THREE.BoxGeometry(1.1, 1, 0.1), winMat); wnd.position.set(sx * w * 0.3, h * 0.55, d / 2 + 0.05); b.add(wnd); });
    // sign with the project's name
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, w * 0.9 * 0.25), new THREE.MeshBasicMaterial({ map: labelTexture(p.title, { bg: PAL.roof[i % PAL.roof.length], ink: '#ffffff' }), toneMapped: false }));
    sign.position.set(0, h - 0.5, d / 2 + 0.07); b.add(sign);
    b.position.set(bx, 0, bz);
    b.lookAt(0, 0, 0); // door faces the middle of town
    scene.add(b);
    solids.push({ x: bx, z: bz, r: Math.max(w, d) * 0.55 });
    // parking spot in front of the door
    const zx = Math.cos(a) * (R_OUT - 1.2), zz = Math.sin(a) * (R_OUT - 1.2);
    zones.push({ x: zx, z: zz, r: 2.6, kind: 'project', index: i, label: p.title });
  });

  // ---------- Billboard with your photo ----------
  const board = new THREE.Group();
  const post = mat('#3b3631');
  [-2.2, 2.2].forEach((x) => { const p = mesh(new THREE.BoxGeometry(0.25, 4, 0.25), post); p.position.set(x, 2, 0); board.add(p); });
  const panel = mesh(new THREE.BoxGeometry(5.4, 3.6, 0.3), mat('#fdfbf7'));
  panel.position.y = 4.6; board.add(panel);
  const photoMat = new THREE.MeshBasicMaterial({ color: '#d6ccba', toneMapped: false });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.1), photoMat);
  photo.position.set(-1.25, 4.6, 0.16); board.add(photo);
  if (profile.photo) new THREE.TextureLoader().load(profile.photo, (t) => { t.colorSpace = THREE.SRGBColorSpace; photoMat.map = t; photoMat.color.set('#fff'); photoMat.needsUpdate = true; });
  const about = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.1), new THREE.MeshBasicMaterial({ map: labelTexture(`Hi, I'm ${profile.name}`, { w: 512, h: 600, font: 'bold 56px "Libre Franklin", Arial' }), toneMapped: false }));
  about.position.set(1.35, 4.6, 0.16); board.add(about);
  board.position.set(-9, 0, -4);
  board.rotation.y = 0.5;
  scene.add(board);
  solids.push({ x: -10.1, z: -4.5, r: 0.5 }, { x: -7.9, z: -3.5, r: 0.5 });
  zones.push({ x: -7.4, z: -1, r: 2.4, kind: 'about', label: 'About' });

  // ---------- Post box for contact ----------
  const pbox = new THREE.Group();
  const pb = mesh(new RoundedBoxGeometry(1.1, 1.7, 0.9, 3, 0.2), mat('#d9573b'));
  pb.position.y = 1.2; pbox.add(pb);
  const pleg = mesh(new THREE.BoxGeometry(0.3, 0.6, 0.3), mat('#3b3631')); pleg.position.y = 0.3; pbox.add(pleg);
  const slot = mesh(new THREE.BoxGeometry(0.7, 0.08, 0.05), mat('#1f1b16')); slot.position.set(0, 1.6, 0.46); pbox.add(slot);
  const mailSign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({ map: labelTexture('CONTACT', { bg: '#1f1b16', ink: '#fff' }), toneMapped: false }));
  mailSign.position.set(0, 2.45, 0); pbox.add(mailSign);
  pbox.position.set(9, 0, -6);
  pbox.rotation.y = -0.6;
  scene.add(pbox);
  solids.push({ x: 9, z: -6, r: 0.8 });
  zones.push({ x: 7.6, z: -3.9, r: 2.2, kind: 'contact', label: 'Contact' });

  // Trees around the edge and a few inside
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2 + (i % 3) * 0.05;
    const r = 40 + (i % 4) * 4;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (solids.some((s) => Math.hypot(s.x - x, s.z - z) < s.r + 2.5)) continue;
    tree(x, z, 1 + (i % 3) * 0.3);
  }
  [[-13, 6], [13, 9], [-4, 14], [5, -13], [-15, -9]].forEach(([x, z], i) => tree(x, z, 0.9 + (i % 2) * 0.3));

  // ---------- Dynamic things: name letters and skill crates ----------
  const bodies = []; // { obj, pos, vel, rot (Euler-ish), angVel, r, hy, mass }
  const addBody = (obj, r, hy, mass = 1) => {
    const b = { obj, pos: obj.position, vel: new THREE.Vector3(), ang: new THREE.Vector3(), r, hy, mass, rest: obj.rotation.clone() };
    bodies.push(b);
    scene.add(obj);
    return b;
  };

  // Name in 3D letters near the start
  const font = new FontLoader().parse(fontJson);
  const letterMat = mat(PAL.letters, { flatShading: false, roughness: 0.6 });
  const name = profile.name.toUpperCase();
  let cursor = 0;
  const letterMeshes = [...name].map((ch) => {
    if (ch === ' ') { cursor += 1.2; return null; }
    const geo = new TextGeometry(ch, { font, size: 2.2, depth: 0.8, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 2 });
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const w = bb.max.x - bb.min.x;
    geo.translate(-bb.min.x - w / 2, -bb.min.y - (bb.max.y - bb.min.y) / 2, -0.4);
    const m = mesh(geo, letterMat);
    m.userData.w = w;
    m.userData.x = cursor + w / 2;
    cursor += w + 0.35;
    return m;
  }).filter(Boolean);
  letterMeshes.forEach((m) => {
    m.position.set(m.userData.x - cursor / 2, 1.1, -9);
    addBody(m, Math.max(0.7, m.userData.w / 2), 1.1, 1.4);
  });

  // Skill crates stacked in a yard
  const crateGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const allSkills = skills.flatMap((g) => g.items).slice(0, 24);
  const yard = { x: 10, z: 8 };
  allSkills.forEach((s, i) => {
    const tex = labelTexture(s, { w: 256, h: 256, bg: PAL.crate, ink: '#2a1a0c', font: 'bold 44px "Libre Franklin", Arial', border: '#8a5a2c' });
    const crate = mesh(crateGeo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }));
    const layer = i < 10 ? 0 : i < 17 ? 1 : i < 22 ? 2 : 3;
    const idx = layer === 0 ? i : layer === 1 ? i - 10 : layer === 2 ? i - 17 : i - 22;
    const perRow = [5, 4, 3, 2][layer];
    const row = Math.floor(idx / perRow), col = idx % perRow;
    crate.position.set(yard.x + (col - (perRow - 1) / 2) * 1.6, 0.75 + layer * 1.5, yard.z + (row - 0.5) * 1.6);
    crate.rotation.y = (i % 5) * 0.06;
    addBody(crate, 0.85, 0.75, 1);
  });
  const yardSign = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.9), new THREE.MeshBasicMaterial({ map: labelTexture('SKILLS YARD', { bg: '#1f1b16', ink: '#fff' }), toneMapped: false }));
  yardSign.position.set(yard.x, 0.5, yard.z + 3.2);
  yardSign.rotation.x = -Math.PI / 2.6;
  scene.add(yardSign);
  zones.push({ x: yard.x - 4.5, z: yard.z + 2, r: 2.2, kind: 'skills', label: 'Skills' });

  // Glowing parking circles, one for every zone
  const ringMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, toneMapped: false });
  zones.forEach((zn) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(zn.r - 0.25, zn.r, 40), ringMat.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(zn.x, 0.06, zn.z);
    zn.ring = ring;
    scene.add(ring);
  });

  // ---------- The scooter ----------
  const scooter = new THREE.Group();
  const lean = new THREE.Group();
  scooter.add(lean);
  const red = mat(PAL.scooter, { flatShading: false, roughness: 0.45 });
  const blackM = mat('#1f1b16', { flatShading: false, roughness: 0.6 });
  const chrome = mat('#cfc8bd', { flatShading: false, metalness: 0.8, roughness: 0.25 });
  const body = mesh(new RoundedBoxGeometry(0.9, 0.55, 2.2, 3, 0.2), red); body.position.y = 0.75; lean.add(body);
  const front = mesh(new RoundedBoxGeometry(0.8, 1.2, 0.35, 3, 0.15), red); front.position.set(0, 1.2, 0.95); front.rotation.x = -0.25; lean.add(front);
  const seat = mesh(new RoundedBoxGeometry(0.7, 0.18, 0.9, 2, 0.08), blackM); seat.position.set(0, 1.12, -0.35); lean.add(seat);
  const bar = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), chrome); bar.rotation.z = Math.PI / 2; bar.position.set(0, 1.85, 1.0); lean.add(bar);
  const lamp = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), mat('#fff6c8', { emissive: '#ffe28a', emissiveIntensity: 1.5 })); lamp.rotation.x = Math.PI / 2; lamp.position.set(0, 1.55, 1.18); lean.add(lamp);
  const tiffin = mesh(new RoundedBoxGeometry(0.95, 0.8, 0.85, 3, 0.12), mat(PAL.tiffin, { flatShading: false, roughness: 0.4 })); tiffin.position.set(0, 1.5, -0.85); lean.add(tiffin);
  const lid = mesh(new RoundedBoxGeometry(1.0, 0.12, 0.9, 2, 0.05), mat('#f6efe2', { flatShading: false })); lid.position.set(0, 1.96, -0.85); lean.add(lid);
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 20);
  const wheels = [1.0, -0.85].map((z) => {
    const w = mesh(wheelGeo, blackM); w.rotation.z = Math.PI / 2; w.position.set(0, 0.42, z); lean.add(w);
    const hub = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 10), chrome); w.add(hub);
    return w;
  });
  scooter.position.set(0, 0, 4);
  scene.add(scooter);
  const headlight = new THREE.SpotLight('#fff1c4', 0, 18, 0.5, 0.6, 1.5);
  headlight.position.set(0, 1.6, 1.2);
  headlight.target.position.set(0, 0, 8);
  scooter.add(headlight, headlight.target);

  // Dust puffs behind the scooter
  const puffs = [];
  const puffGeo = new THREE.IcosahedronGeometry(0.25, 0);
  const puffMat = new THREE.MeshStandardMaterial({ color: '#f3dcb8', transparent: true, opacity: 0.8, flatShading: true });
  for (let i = 0; i < 30; i++) { const p = new THREE.Mesh(puffGeo, puffMat.clone()); p.visible = false; scene.add(p); puffs.push({ m: p, life: 0 }); }
  let puffI = 0, puffT = 0;

  // ---------- Input ----------
  const keys = { up: false, down: false, left: false, right: false, boost: false };
  const map = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ShiftLeft: 'boost', ShiftRight: 'boost' };
  const onKey = (v) => (e) => {
    const k = map[e.code];
    if (!k) return;
    keys[k] = v;
    if (e.code.startsWith('Arrow')) e.preventDefault();
  };
  const kd = onKey(true), ku = onKey(false);
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);

  // ---------- Resize ----------
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.9 ? 58 : 40;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ---------- Simulation ----------
  const state = { heading: Math.PI, speed: 0, steer: 0 };
  const camPos = new THREE.Vector3(0, 16, 20), camLook = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let currentZone = null, running = true, raf = 0, last = performance.now(), t = 0;

  function step(dt) {
    t += dt;
    // Driving
    const max = keys.boost ? 22 : 14;
    const accel = keys.up ? 26 : keys.down ? -30 : 0;
    state.speed += accel * dt;
    if (!keys.up && !keys.down) state.speed *= Math.pow(0.25, dt);
    state.speed = Math.max(-6, Math.min(max, state.speed));
    const steerIn = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
    state.steer += (steerIn - state.steer) * Math.min(1, dt * 8);
    const turn = state.steer * 2.4 * Math.min(1, Math.abs(state.speed) / 5) * Math.sign(state.speed || 1);
    state.heading += turn * dt;

    const dir = tmp.set(Math.sin(state.heading), 0, Math.cos(state.heading));
    scooter.position.addScaledVector(dir, state.speed * dt);

    // Bump into buildings, trees and the edge of the world
    for (const s of solids) {
      const dx = scooter.position.x - s.x, dz = scooter.position.z - s.z;
      const d = Math.hypot(dx, dz), min = s.r + 0.9;
      if (d < min && d > 0.0001) {
        scooter.position.x = s.x + (dx / d) * min;
        scooter.position.z = s.z + (dz / d) * min;
        state.speed *= -0.3;
      }
    }
    const dc = Math.hypot(scooter.position.x, scooter.position.z);
    if (dc > 48) { scooter.position.multiplyScalar(48 / dc); state.speed *= -0.3; }

    scooter.rotation.y = state.heading;
    lean.rotation.z = -state.steer * Math.min(1, Math.abs(state.speed) / 8) * 0.35;
    lean.rotation.x = -Math.max(-0.08, Math.min(0.08, accel * 0.002));
    wheels.forEach((w) => { w.rotation.x += (state.speed * dt) / 0.42; });
    headlight.intensity = Math.abs(state.speed) > 0.5 ? 12 : 0;

    // Dust
    puffT += dt;
    if (Math.abs(state.speed) > 4 && puffT > 0.05) {
      puffT = 0;
      const p = puffs[puffI++ % puffs.length];
      p.life = 1; p.m.visible = true;
      p.m.position.copy(scooter.position).addScaledVector(dir, -1.3); p.m.position.y = 0.3;
      p.m.position.x += (Math.random() - 0.5) * 0.4;
    }
    puffs.forEach((p) => {
      if (p.life <= 0) return;
      p.life -= dt * 1.6;
      p.m.position.y += dt * 0.8;
      p.m.scale.setScalar(1 + (1 - p.life) * 2);
      p.m.material.opacity = Math.max(0, p.life * 0.7);
      if (p.life <= 0) p.m.visible = false;
    });

    // Physics for letters and crates
    const sp = scooter.position;
    for (const b of bodies) {
      // Scooter hits it
      const dx = b.pos.x - sp.x, dz = b.pos.z - sp.z;
      const d = Math.hypot(dx, dz), min = b.r + 0.9;
      if (d < min && b.pos.y < b.hy + 1.6) {
        const nx = dx / (d || 1), nz = dz / (d || 1);
        const hit = Math.max(2, Math.abs(state.speed)) / b.mass;
        b.vel.x += nx * hit * 0.9 + dir.x * hit * 0.4;
        b.vel.z += nz * hit * 0.9 + dir.z * hit * 0.4;
        b.vel.y += hit * 0.45;
        b.ang.set((Math.random() - 0.5) * hit, (Math.random() - 0.5) * hit, (Math.random() - 0.5) * hit);
        b.pos.x = sp.x + nx * min; b.pos.z = sp.z + nz * min;
        state.speed *= 0.85;
      }
    }
    // Push overlapping bodies apart
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j];
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z, dy = b.pos.y - a.pos.y;
      if (Math.abs(dy) > a.hy + b.hy - 0.05) continue;
      const d = Math.hypot(dx, dz), min = (a.r + b.r) * 0.9;
      if (d < min && d > 0.0001) {
        const push = (min - d) / 2, nx = dx / d, nz = dz / d;
        a.pos.x -= nx * push; a.pos.z -= nz * push; b.pos.x += nx * push; b.pos.z += nz * push;
        const rv = (b.vel.x - a.vel.x) * nx + (b.vel.z - a.vel.z) * nz;
        if (rv < 0) { a.vel.x += nx * rv * 0.5; a.vel.z += nz * rv * 0.5; b.vel.x -= nx * rv * 0.5; b.vel.z -= nz * rv * 0.5; }
      } else if (d < min * 1.05 && dy > 0 && b.vel.y <= 0 && dy < a.hy + b.hy + 0.1) {
        // resting on top of another body
        b.pos.y = a.pos.y + a.hy + b.hy; b.vel.y = 0;
      }
    }
    for (const b of bodies) {
      b.vel.y -= 22 * dt;
      b.pos.addScaledVector(b.vel, dt);
      const floor = b.hy;
      // Is something under it?
      let support = floor;
      for (const o of bodies) {
        if (o === b) continue;
        if (Math.hypot(o.pos.x - b.pos.x, o.pos.z - b.pos.z) < (o.r + b.r) * 0.7 && o.pos.y < b.pos.y) support = Math.max(support, o.pos.y + o.hy + b.hy);
      }
      if (b.pos.y < support) {
        b.pos.y = support;
        if (b.vel.y < -3) b.vel.y *= -0.3; else b.vel.y = 0;
        b.vel.x *= 0.86; b.vel.z *= 0.86;
        b.ang.multiplyScalar(0.8);
        // settle flat
        b.obj.rotation.x += (Math.round(b.obj.rotation.x / (Math.PI / 2)) * (Math.PI / 2) - b.obj.rotation.x) * 0.15;
        b.obj.rotation.z += (Math.round(b.obj.rotation.z / (Math.PI / 2)) * (Math.PI / 2) - b.obj.rotation.z) * 0.15;
      }
      b.obj.rotation.x += b.ang.x * dt;
      b.obj.rotation.y += b.ang.y * dt;
      b.obj.rotation.z += b.ang.z * dt;
      const bd = Math.hypot(b.pos.x, b.pos.z);
      if (bd > 50) { b.pos.multiplyScalar(50 / bd); b.vel.x *= -0.5; b.vel.z *= -0.5; }
    }

    // Parking zones
    let z = null;
    for (const zn of zones) {
      const inside = Math.hypot(sp.x - zn.x, sp.z - zn.z) < zn.r;
      zn.ring.material.opacity = inside ? 0.95 : 0.35 + Math.sin(t * 3 + zn.x) * 0.15;
      zn.ring.material.color.set(inside ? '#2a45c2' : '#ffffff');
      if (inside) z = zn;
    }
    if (z !== currentZone) { currentZone = z; onZone?.(z); }
    onSpeed?.(Math.abs(state.speed));

    // Camera follows from above and behind, a little ahead of where you're going
    const ahead = tmp.set(Math.sin(state.heading), 0, Math.cos(state.heading)).multiplyScalar(Math.min(6, Math.abs(state.speed) * 0.4));
    const want = new THREE.Vector3(sp.x + ahead.x, 19, sp.z + ahead.z + 18);
    camPos.lerp(want, reduce ? 1 : Math.min(1, dt * 3));
    camLook.lerp(new THREE.Vector3(sp.x + ahead.x, 0.5, sp.z + ahead.z), reduce ? 1 : Math.min(1, dt * 4));
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    // Keep the sun's shadow box around the player
    sun.position.set(sp.x - 18, 30, sp.z + 12);
    sun.target.position.set(sp.x, 0, sp.z);
  }

  // Fixed 60 Hz steps, so the game moves at the same real speed even on a slow device
  let acc = 0;
  function loop(now) {
    if (!running) return;
    acc += Math.min(0.25, (now - last) / 1000);
    last = now;
    let n = 0;
    while (acc >= 1 / 60 && n < 15) { step(1 / 60); acc -= 1 / 60; n++; }
    if (n === 15) acc = 0;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  return {
    setKey(k, v) { keys[k] = v; },
    teleport(kind, index) {
      const zn = zones.find((z) => z.kind === kind && (index == null || z.index === index));
      if (!zn) return;
      scooter.position.set(zn.x, 0, zn.z);
      state.speed = 0;
      state.heading = Math.atan2(-zn.x, -zn.z);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      scene.traverse((o) => {
        o.geometry?.dispose();
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m?.map?.dispose(); m?.dispose(); });
      });
      renderer.dispose();
    }
  };
}
