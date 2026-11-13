import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
  A 3D mechanical keyboard.
  - press(char): presses the key for that character
  - setScroll(p): 0..1, keys fly apart as you scroll away
  - It leans toward the pointer and keys under the pointer sink.
*/

// ---------- Layout: a 60% keyboard, sizes in key units ----------
const row = (s) => [...s].map((c) => [c]);
const LAYOUT = [
  [...row('`1234567890-='), ['⌫', 2, 'mod']],
  [['Tab', 1.5, 'mod'], ...row('QWERTYUIOP[]'), ['\\', 1.5]],
  [['Caps', 1.75, 'mod'], ...row("ASDFGHJKL;'"), ['Enter', 2.25, 'accent']],
  [['Shift', 2.25, 'mod'], ...row('ZXCVBNM,./'), ['Shift', 2.75, 'mod']],
  [['Ctrl', 1.25, 'mod'], ['Fn', 1.25, 'mod'], ['Alt', 1.25, 'mod'], ['', 6.25, 'space'], ['Alt', 1.25, 'mod'], ['Fn', 1.25, 'mod'], ['☰', 1.25, 'mod'], ['Ctrl', 1.25, 'mod']]
];
const ROW_TILT = [-0.14, -0.07, 0, 0.06, 0.1];   // sculpted row profile
const ROW_LIFT = [0.1, 0.04, 0, 0.02, 0.06];
const U = 1;
const GAP = 0.12;
const CAP_H = 0.42;

const COLORS = {
  light: { alpha: '#f1ece2', mod: '#3b3631', accent: '#2a45c2', inkOnAlpha: '#2a2622', inkOnMod: '#e9e2d6', inkOnAccent: '#ffffff', base: '#2b2825' },
  dark: { alpha: '#e7e0d3', mod: '#2f2b27', accent: '#4a63e0', inkOnAlpha: '#25211d', inkOnMod: '#d9d1c4', inkOnAccent: '#ffffff', base: '#1d1b19' }
};

function legendTexture(text, ink, renderer) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = ink;
  const single = [...text].length === 1;
  g.font = `500 ${single ? 120 : 64}px "IBM Plex Mono", ui-monospace, Consolas, monospace`;
  g.textBaseline = 'top';
  g.fillText(text, single ? 34 : 30, single ? 22 : 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

export function createKeyboardScene(canvas, { dark: startDark = false } = {}) {
  let dark = startDark;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pal = dark ? COLORS.dark : COLORS.light;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

  // Lights: a warm key light with soft shadows, plus a cool fill
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x3a332c, 0.9));
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sun.position.set(-6, 14, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -14;
  sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.bias = -0.0004;
  sun.shadow.radius = 6;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xbfd0ff, 0.8);
  rim.position.set(10, 6, -10);
  scene.add(rim);

  // Ground that only shows the shadow
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: dark ? 0.55 : 0.22 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.62;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Build the keyboard ----------
  const board = new THREE.Group();
  scene.add(board);

  const width = 15 * U;
  const depth = 5 * U;
  const caseMat = new THREE.MeshStandardMaterial({ color: pal.base, metalness: 0.65, roughness: 0.38 });
  const caseMesh = new THREE.Mesh(new RoundedBoxGeometry(width + 0.7, 0.7, depth + 0.7, 4, 0.28), caseMat);
  caseMesh.position.y = -0.25;
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  board.add(caseMesh);
  // Recessed plate the keys sit in
  const plate = new THREE.Mesh(
    new RoundedBoxGeometry(width + 0.12, 0.1, depth + 0.12, 2, 0.05),
    new THREE.MeshStandardMaterial({ color: '#141210', roughness: 0.8, metalness: 0.2 })
  );
  plate.position.y = 0.08;
  board.add(plate);

  const matCache = {};
  const capMat = (color) =>
    (matCache[color] ||= new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.6, sheen: 0.3 }));
  const geoCache = {};
  const capGeo = (w) => (geoCache[w] ||= new RoundedBoxGeometry(w * U - GAP, CAP_H, U - GAP, 3, 0.09));
  const texCache = {};

  const keys = []; // { group, char, base, dir, spin, press, target, releaseAt }
  const byChar = new Map();

  LAYOUT.forEach((r, ri) => {
    let x = -width / 2;
    const z = -depth / 2 + ri * U + U / 2;
    r.forEach(([label, w = 1, kind = 'alpha']) => {
      const cx = x + (w * U) / 2;
      x += w * U;

      const fill = kind === 'mod' ? pal.mod : kind === 'accent' ? pal.accent : pal.alpha;
      const ink = kind === 'mod' ? pal.inkOnMod : kind === 'accent' ? pal.inkOnAccent : pal.inkOnAlpha;

      const group = new THREE.Group();
      group.position.set(cx, 0.36 + ROW_LIFT[ri], z);
      group.rotation.x = ROW_TILT[ri];

      const cap = new THREE.Mesh(capGeo(w), capMat(fill));
      cap.castShadow = true;
      cap.receiveShadow = true;
      group.add(cap);

      if (label) {
        const key = `${label}|${ink}`;
        const tex = (texCache[key] ||= legendTexture(label, ink, renderer));
        const legendSize = Math.min(w * U - GAP - 0.1, U - GAP - 0.06);
        const legend = new THREE.Mesh(
          new THREE.PlaneGeometry(legendSize, legendSize),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })
        );
        legend.rotation.x = -Math.PI / 2;
        legend.position.set(-(w * U - GAP) / 2 + legendSize / 2 + 0.03, CAP_H / 2 + 0.002, 0);
        group.add(legend);
      }

      board.add(group);
      const k = {
        group,
        base: group.position.clone(),
        baseRot: group.rotation.x,
        dir: new THREE.Vector3((cx / width) * 2 + (Math.random() - 0.5) * 0.8, 1.2 + Math.random() * 1.6, (z / depth) * 1.5 + (Math.random() - 0.2) * 1.2),
        spin: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6),
        press: 0,
        target: 0,
        releaseAt: 0,
        hover: false
      };
      keys.push(k);
      cap.userData.key = k;
      if (kind === 'space') byChar.set(' ', k);
      else if ([...label].length === 1) {
        byChar.set(label.toLowerCase(), k);
      }
      if (label === 'Enter') byChar.set('\n', k);
    });
  });
  // Shifted characters press their base key
  const SHIFTED = { '!': '1', '@': '2', '#': '3', $: '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', _: '-', '+': '=', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/', '{': '[', '}': ']', '|': '\\', '~': '`' };

  board.rotation.x = 0.0;

  // ---------- Camera framing ----------
  let W = 1, H = 1;
  function frame() {
    const aspect = W / H;
    camera.aspect = aspect;
    // Pull back on narrow screens so the whole board fits
    const fit = Math.max(1, 1.9 / aspect);
    const dist = 19 * fit;
    camera.position.set(0, dist * 0.62, dist * 0.78);
    camera.lookAt(0, -0.6, 0.4);
    camera.updateProjectionMatrix();
  }
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    frame();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();

  // ---------- Input ----------
  const pointer = new THREE.Vector2(9, 9);
  let mx = 0, my = 0;
  const ray = new THREE.Raycaster();
  const caps = keys.map((k) => k.group.children[0]);
  let hovered = null;

  function onPointer(e) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    mx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    my = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  function press(ch) {
    const c = String(ch).toLowerCase();
    const k = byChar.get(c) || byChar.get(SHIFTED[c]);
    if (!k) return;
    k.target = 1;
    k.releaseAt = performance.now() + 90;
  }

  let scrollP = 0;
  function setScroll(p) { scrollP = Math.max(0, Math.min(1, p)); }

  // ---------- Loop ----------
  let running = true;
  let visible = true;
  let last = performance.now();
  let raf = 0;
  let idleNext = performance.now() + 2500;
  const ease = (t) => t * t * (3 - 2 * t);

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && running && !raf) raf = requestAnimationFrame(loop); });
  io.observe(canvas);

  function loop(now) {
    raf = 0;
    if (!running || !visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // Lean toward the pointer
    const tiltK = reduce ? 0 : 1;
    board.rotation.y += ((mx * 0.22 * tiltK) - board.rotation.y) * Math.min(1, dt * 4);
    board.rotation.x += ((my * 0.08 * tiltK) - board.rotation.x) * Math.min(1, dt * 4);

    // Hover: the key under the pointer sinks
    ray.setFromCamera(pointer, camera);
    const hit = scrollP < 0.05 ? ray.intersectObjects(caps, false)[0] : null;
    const hk = hit ? hit.object.userData.key : null;
    if (hk !== hovered) {
      if (hovered) hovered.hover = false;
      hovered = hk;
      if (hovered) hovered.hover = true;
      canvas.style.cursor = hovered ? 'pointer' : '';
    }

    // A few idle presses so the board feels alive
    if (!reduce && now > idleNext && scrollP === 0) {
      const k = keys[(Math.random() * keys.length) | 0];
      k.target = 1;
      k.releaseAt = now + 80;
      idleNext = now + 700 + Math.random() * 1600;
    }

    const e = reduce ? 0 : ease(scrollP);
    keys.forEach((k) => {
      if (k.target === 1 && now > k.releaseAt && k.releaseAt) { k.target = 0; k.releaseAt = 0; }
      const goal = Math.max(k.target, k.hover ? 0.6 : 0);
      k.press += (goal - k.press) * Math.min(1, dt * (goal > k.press ? 40 : 14));
      const g = k.group;
      g.position.set(
        k.base.x + k.dir.x * e * 6,
        k.base.y - k.press * 0.2 + k.dir.y * e * 7,
        k.base.z + k.dir.z * e * 5
      );
      g.rotation.set(k.baseRot + k.spin.x * e, k.spin.y * e, k.spin.z * e);
    });
    // The empty case drops away and tips over, shadows fade, then the whole scene fades out
    caseMesh.position.y = -0.25 - e * 9;
    plate.position.y = 0.08 - e * 9;
    caseMesh.rotation.x = plate.rotation.x = e * 0.9;
    board.position.y = e * 0.5;
    ground.material.opacity = (dark ? 0.55 : 0.22) * Math.max(0, 1 - e * 2.5);
    const fade = scrollP < 0.55 ? 1 : Math.max(0, 1 - (scrollP - 0.55) / 0.4);
    canvas.style.opacity = String(fade);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  return {
    press,
    setScroll,
    setDark(isDark) {
      dark = isDark;
      pal = isDark ? COLORS.dark : COLORS.light;
      caseMat.color.set(pal.base);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    }
  };
}
