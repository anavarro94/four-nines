// Four Nines — 3-D hero scene (three.js)
// Floating hand tools in brand colors that drift, turn, and follow the mouse/finger.
// Loads only on devices that can handle it, and never for people who turn off motion.
(async function () {
  const hero = document.getElementById('hero');
  if (!hero) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const test = document.createElement('canvas');
  if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;

  let THREE;
  try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); }
  catch (e) { return; } // no 3-D? the site works exactly the same without it

  // ---------- Brand palette (brand.md) ----------
  const COL = { forest: 0x2F4B3A, deep: 0x1F3328, rust: 0xB4532A, rustLt: 0xE08458, cream: 0xF5F0E5, tan: 0xE6DCC6 };
  const mat = {
    steel: new THREE.MeshStandardMaterial({ color: 0xD9D3C4, metalness: 0.75, roughness: 0.32 }),
    rust:  new THREE.MeshStandardMaterial({ color: COL.rust, roughness: 0.55 }),
    rustLt:new THREE.MeshStandardMaterial({ color: COL.rustLt, roughness: 0.5 }),
    forest:new THREE.MeshStandardMaterial({ color: COL.forest, roughness: 0.6 }),
    tan:   new THREE.MeshStandardMaterial({ color: COL.tan, roughness: 0.7 }),
    cream: new THREE.MeshStandardMaterial({ color: COL.cream, roughness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xC9A26B, metalness: 0.7, roughness: 0.35 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xBFD9A8, roughness: 0.15, transparent: true, opacity: 0.85 })
  };
  const M = (geo, m) => new THREE.Mesh(geo, m);

  // ---------- Tools built from simple shapes ----------
  function hammer() {
    const g = new THREE.Group();
    const handle = M(new THREE.CylinderGeometry(0.11, 0.14, 2.3, 20), mat.rust); handle.position.y = -0.35; g.add(handle);
    const grip = M(new THREE.CylinderGeometry(0.15, 0.15, 0.7, 20), mat.forest); grip.position.y = -1.15; g.add(grip);
    const head = M(new THREE.BoxGeometry(1.25, 0.34, 0.34), mat.steel); head.position.set(0.12, 0.88, 0); g.add(head);
    const face = M(new THREE.CylinderGeometry(0.21, 0.21, 0.18, 20), mat.steel); face.rotation.z = Math.PI / 2; face.position.set(-0.55, 0.88, 0); g.add(face);
    const claw = M(new THREE.BoxGeometry(0.5, 0.22, 0.12), mat.steel); claw.position.set(0.86, 0.78, 0); claw.rotation.z = -0.45; g.add(claw);
    return g;
  }
  function screwdriver() {
    const g = new THREE.Group();
    const handle = M(new THREE.CylinderGeometry(0.2, 0.24, 0.95, 8), mat.rustLt); handle.position.y = -0.7; g.add(handle);
    const cap = M(new THREE.SphereGeometry(0.21, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat.rustLt); cap.rotation.x = Math.PI; cap.position.y = -1.17; g.add(cap);
    const ferrule = M(new THREE.CylinderGeometry(0.12, 0.2, 0.18, 16), mat.forest); ferrule.position.y = -0.14; g.add(ferrule);
    const shaft = M(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 12), mat.steel); shaft.position.y = 0.6; g.add(shaft);
    const tip = M(new THREE.BoxGeometry(0.16, 0.16, 0.03), mat.steel); tip.position.y = 1.3; g.add(tip);
    return g;
  }
  function wrench() {
    const g = new THREE.Group();
    const bar = M(new THREE.BoxGeometry(0.3, 2.0, 0.13), mat.steel); g.add(bar);
    const jaw = M(new THREE.TorusGeometry(0.34, 0.13, 10, 24, Math.PI * 1.45), mat.steel);
    jaw.position.y = 1.2; jaw.rotation.z = -Math.PI * 0.22 + Math.PI / 2; g.add(jaw);
    const ring = M(new THREE.TorusGeometry(0.28, 0.12, 10, 24), mat.steel); ring.position.y = -1.18; g.add(ring);
    return g;
  }
  function hexNut(m = mat.brass) {
    const s = new THREE.Shape();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; i ? s.lineTo(Math.cos(a) * 0.5, Math.sin(a) * 0.5) : s.moveTo(0.5, 0); }
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.22, 0, Math.PI * 2, true); s.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 20 });
    geo.center();
    return M(geo, m);
  }
  function bolt() {
    const g = new THREE.Group();
    const head = M(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 6), mat.steel); head.position.y = 0.75; g.add(head);
    const shaft = M(new THREE.CylinderGeometry(0.15, 0.15, 1.4, 16), mat.steel); g.add(shaft);
    for (let i = 0; i < 7; i++) { const t = M(new THREE.TorusGeometry(0.155, 0.025, 6, 18), mat.steel); t.rotation.x = Math.PI / 2; t.position.y = -0.62 + i * 0.12; g.add(t); }
    return g;
  }
  function level() {
    const g = new THREE.Group();
    g.add(M(new THREE.BoxGeometry(2.6, 0.4, 0.22), mat.forest));
    const edge = M(new THREE.BoxGeometry(2.62, 0.06, 0.24), mat.tan); edge.position.y = 0.2; g.add(edge);
    const edge2 = edge.clone(); edge2.position.y = -0.2; g.add(edge2);
    const vial = M(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 16), mat.glass); vial.rotation.z = Math.PI / 2; vial.position.z = 0.1; g.add(vial);
    const bub = M(new THREE.SphereGeometry(0.06, 12, 8), mat.cream); bub.position.set(0.04, 0, 0.17); g.add(bub);
    return g;
  }
  function tape() {
    const g = new THREE.Group();
    const body = M(new THREE.CylinderGeometry(0.62, 0.62, 0.4, 32), mat.rust); body.rotation.x = Math.PI / 2; g.add(body);
    const face = M(new THREE.CylinderGeometry(0.34, 0.34, 0.42, 32), mat.cream); face.rotation.x = Math.PI / 2; g.add(face);
    const blade = M(new THREE.BoxGeometry(0.9, 0.05, 0.3), mat.tan); blade.position.set(0.95, -0.52, 0); g.add(blade);
    const hook = M(new THREE.BoxGeometry(0.05, 0.16, 0.3), mat.steel); hook.position.set(1.4, -0.47, 0); g.add(hook);
    return g;
  }

  // ---------- Scene ----------
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-3d';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.HemisphereLight(0xFFF4E0, 0x1F3328, 1.25));
  const key = new THREE.DirectionalLight(0xFFE7CC, 2.2); key.position.set(-4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(COL.rustLt, 1.6); rim.position.set(6, -2, -4); scene.add(rim);

  // [maker, x, y, z, scale] — laid out as a loose cluster
  const LAYOUT = [
    [hammer,      -1.4,  1.2,  0.5, 1.15],
    [wrench,       1.9,  1.6, -1.0, 1.0],
    [level,        0.6, -0.4,  1.2, 1.0],
    [screwdriver, -2.6, -1.6, -0.6, 1.0],
    [tape,         2.6, -1.9,  0.2, 0.95],
    [bolt,         0.2,  2.9, -2.0, 0.9],
    [() => hexNut(),          -3.2,  2.6, -2.4, 0.8],
    [() => hexNut(mat.steel),  3.6,  0.2, -2.6, 0.7],
    [() => hexNut(),          -0.6, -2.9, -1.4, 0.75],
    [() => hexNut(mat.steel), -3.6,  0.1, -1.6, 0.55]
  ];
  const cluster = new THREE.Group(); scene.add(cluster);
  const items = LAYOUT.map(([make, x, y, z, s], i) => {
    const o = make(); o.scale.setScalar(s); o.position.set(x, y, z);
    o.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    cluster.add(o);
    return { o, x, y, z, ph: i * 1.7, spin: new THREE.Vector3((Math.random() - .5) * .35, (Math.random() - .5) * .45, (Math.random() - .5) * .25) };
  });

  // ---------- Size & placement ----------
  let wide = false;
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    wide = w >= 900;
    // Desktop: tools sit in the open space to the right of the headline.
    // Phone: a smaller, quieter cluster up top behind the text.
    const visW = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
    if (wide) { cluster.position.set(visW * 0.27, 0, 0); cluster.scale.setScalar(Math.min(1.1, visW / 26)); }
    else {
      const visH = visW / camera.aspect;
      cluster.position.set(visW * 0.3, -visH * 0.25, 0); cluster.scale.setScalar(visW / 13);
    }
    canvas.classList.toggle('soft', !wide);
  }
  new ResizeObserver(resize).observe(hero);
  resize();

  // ---------- Pointer + scroll ----------
  const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  addEventListener('pointermove', e => { aim.x = e.clientX / innerWidth - 0.5; aim.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  if (window.DeviceOrientationEvent && !wide) {
    addEventListener('deviceorientation', e => { if (e.gamma != null) { aim.x = Math.max(-.5, Math.min(.5, e.gamma / 60)); aim.y = Math.max(-.5, Math.min(.5, (e.beta - 45) / 90)); } }, { passive: true });
  }
  let burst = 0; // tap/click the hero to give the tools a spin
  hero.addEventListener('pointerdown', e => { if (!e.target.closest('a,button,input,select,textarea,label')) burst = 1; });

  // ---------- Animate (only while the hero is on screen) ----------
  let running = false, raf = 0, last = performance.now(), t = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    burst *= 0.96;
    cur.x += (aim.x - cur.x) * 0.05; cur.y += (aim.y - cur.y) * 0.05;
    const scrollK = Math.min(1, scrollY / Math.max(1, hero.clientHeight));
    cluster.rotation.y = cur.x * 0.6 + Math.sin(t * 0.15) * 0.12;
    cluster.rotation.x = cur.y * 0.35;
    items.forEach(it => {
      const k = 1 + burst * 9;
      it.o.rotation.x += it.spin.x * dt * k;
      it.o.rotation.y += it.spin.y * dt * k;
      it.o.rotation.z += it.spin.z * dt * k;
      it.o.position.y = it.y + Math.sin(t * 0.8 + it.ph) * 0.18 + scrollK * (1.5 + it.z * 0.4);
      it.o.position.x = it.x + Math.cos(t * 0.6 + it.ph) * 0.1;
    });
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }
  function play(on) {
    if (on && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    if (!on && running) { running = false; cancelAnimationFrame(raf); }
  }
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; play(visible && !document.hidden); }).observe(hero);
  document.addEventListener('visibilitychange', () => play(visible && !document.hidden));
  play(true);
  requestAnimationFrame(() => canvas.classList.add('on'));
})();
