// Four Nines — 3-D scenes (three.js r160)
//  1) Hero: tools fly in, lock into place, light rays burst behind them, then they float and follow the mouse.
//  2) Honey-do band: a 3-D toolbox that opens when you scroll to it and lifts its tools out.
// Loads only on devices that can handle it, and never for people who turn off motion.
(async function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Skip on data-saver / very slow connections and very low-memory phones
  const conn = navigator.connection || {};
  if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '') || (navigator.deviceMemory && navigator.deviceMemory < 2)) return;
  const test = document.createElement('canvas');
  if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;

  // Wait until the page (text, photos, buttons) has fully loaded and the phone is idle,
  // so the 3-D never slows down what customers came for.
  if (document.readyState !== 'complete') await new Promise(r => addEventListener('load', r, { once: true }));
  await new Promise(r => ('requestIdleCallback' in window) ? requestIdleCallback(r, { timeout: 1200 }) : setTimeout(r, 200));

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
    deep:  new THREE.MeshStandardMaterial({ color: COL.deep, roughness: 0.7 }),
    tan:   new THREE.MeshStandardMaterial({ color: COL.tan, roughness: 0.7 }),
    cream: new THREE.MeshStandardMaterial({ color: COL.cream, roughness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xC9A26B, metalness: 0.7, roughness: 0.35 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xBFD9A8, roughness: 0.15, transparent: true, opacity: 0.85 })
  };
  const M = (geo, m) => new THREE.Mesh(geo, m);
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const easeOutBack = x => { const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const easeOutCubic = x => 1 - Math.pow(1 - x, 3);

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
    g.add(M(new THREE.BoxGeometry(0.3, 2.0, 0.13), mat.steel));
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
    g.add(M(new THREE.CylinderGeometry(0.15, 0.15, 1.4, 16), mat.steel));
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
  function toolbox() {
    const g = new THREE.Group();
    const body = M(new THREE.BoxGeometry(3.4, 1.5, 1.7), mat.forest); body.position.y = 0.75; g.add(body);
    const stripe = M(new THREE.BoxGeometry(3.42, 0.16, 1.72), mat.rust); stripe.position.y = 1.15; g.add(stripe);
    const base = M(new THREE.BoxGeometry(3.5, 0.12, 1.8), mat.deep); base.position.y = 0.06; g.add(base);
    // the lid hinges on the back edge
    const lid = new THREE.Group(); lid.position.set(0, 1.5, -0.85); g.add(lid);
    const top = M(new THREE.BoxGeometry(3.46, 0.32, 1.76), mat.forest); top.position.set(0, 0.16, 0.88); lid.add(top);
    const trim = M(new THREE.BoxGeometry(3.4, 0.06, 1.7), mat.deep); trim.position.set(0, 0.02, 0.88); lid.add(trim);
    const handle = M(new THREE.TorusGeometry(0.55, 0.07, 10, 24, Math.PI), mat.tan); handle.position.set(0, 0.32, 0.88); lid.add(handle);
    for (const x of [-1.2, 1.2]) { const l = M(new THREE.BoxGeometry(0.3, 0.42, 0.08), mat.brass); l.position.set(x, 1.35, 0.88); g.add(l); }
    // tray inside (dark) so you see depth when the lid opens
    const inside = M(new THREE.BoxGeometry(3.2, 0.05, 1.5), mat.deep); inside.position.y = 1.44; g.add(inside);
    g.userData.lid = lid;
    return g;
  }

  // Light rays like a reveal flash (additive shader, brand colors)
  function rays(color = COL.rustLt) {
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uAmp: { value: 0 }, uCol: { value: new THREE.Color(color) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `varying vec2 vUv; uniform float uT; uniform float uAmp; uniform vec3 uCol;
        void main(){
          float r = length(vUv); float a = atan(vUv.y, vUv.x);
          float beams = pow(max(0.0, sin(a * 9.0 + uT * 0.35)), 6.0) + 0.6 * pow(max(0.0, sin(a * 5.0 - uT * 0.22 + 1.3)), 10.0);
          float fall = smoothstep(1.0, 0.08, r);
          float core = smoothstep(0.45, 0.0, r) * 0.55;
          gl_FragColor = vec4(uCol, (beams * fall * 0.55 + core) * uAmp);
        }`
    });
    return M(new THREE.PlaneGeometry(1, 1), m);
  }

  // Shared scene setup: renderer on a canvas, lights, pause when off screen
  function stage(host, canvas, fov = 35) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xFFF4E0, 0x1F3328, 1.25));
    const key = new THREE.DirectionalLight(0xFFE7CC, 2.2); key.position.set(-4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(COL.rustLt, 1.6); rim.position.set(6, -2, -4); scene.add(rim);
    let running = false, raf = 0, last = 0, visible = false, onFrame = () => {};
    const loop = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; onFrame(dt); renderer.render(scene, camera); if (running) raf = requestAnimationFrame(loop); };
    const play = on => {
      if (on && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
      if (!on && running) { running = false; cancelAnimationFrame(raf); }
    };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; play(visible && !document.hidden); }).observe(host);
    document.addEventListener('visibilitychange', () => play(visible && !document.hidden));
    return { renderer, scene, camera, set frame(fn) { onFrame = fn; } };
  }

  // Pointer (shared)
  const aim = { x: 0, y: 0 };
  addEventListener('pointermove', e => { aim.x = e.clientX / innerWidth - 0.5; aim.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  addEventListener('deviceorientation', e => {
    if (e.gamma != null && innerWidth < 900) { aim.x = Math.max(-.5, Math.min(.5, e.gamma / 60)); aim.y = Math.max(-.5, Math.min(.5, (e.beta - 45) / 90)); }
  }, { passive: true });

  // =====================================================================
  // 1) HERO — tools fly in, lock into place, rays flash, then float
  // =====================================================================
  const hero = document.getElementById('hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-3d'; canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    const S = stage(hero, canvas);
    S.camera.position.set(0, 0, 14);

    const LAYOUT = [ // [maker, x, y, z, scale]
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
    const cluster = new THREE.Group(); S.scene.add(cluster);
    const glow = rays(); glow.scale.setScalar(13); glow.position.z = -4; cluster.add(glow);
    const items = LAYOUT.map(([make, x, y, z, s], i) => {
      const o = make(); o.scale.setScalar(s); cluster.add(o);
      const ang = (i / LAYOUT.length) * Math.PI * 2 + 0.6;
      return {
        o, x, y, z, ph: i * 1.7, delay: 0.15 + i * 0.07,
        from: new THREE.Vector3(Math.cos(ang) * 16, Math.sin(ang) * 11, 6 + (i % 3) * 2),
        rot0: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        spin: new THREE.Vector3((Math.random() - .5) * .35, (Math.random() - .5) * .45, (Math.random() - .5) * .25)
      };
    });

    let wide = false;
    function resize() {
      const w = hero.clientWidth, h = hero.clientHeight;
      S.renderer.setSize(w, h, false);
      S.camera.aspect = w / h; S.camera.updateProjectionMatrix();
      wide = w >= 900;
      const visW = 2 * Math.tan(THREE.MathUtils.degToRad(S.camera.fov / 2)) * S.camera.position.z * S.camera.aspect;
      if (wide) { cluster.position.set(visW * 0.27, 0, 0); cluster.scale.setScalar(Math.min(1.1, visW / 26)); }
      else { const visH = visW / S.camera.aspect; cluster.position.set(visW * 0.3, -visH * 0.25, 0); cluster.scale.setScalar(visW / 13); }
      canvas.classList.toggle('soft', !wide);
    }
    new ResizeObserver(resize).observe(hero); resize();

    let spinKick = 0;
    hero.addEventListener('pointerdown', e => { if (!e.target.closest('a,button,input,select,textarea,label')) { spinKick = 1; flash = Math.max(flash, 0.7); } });

    const cur = { x: 0, y: 0 };
    let t = 0, flash = 0;
    const LAND = 1.45; // seconds until the last tool locks in
    S.frame = dt => {
      t += dt; spinKick *= Math.pow(0.08, dt);
      if (t > LAND && t - dt <= LAND) flash = 1;      // the reveal flash
      flash *= Math.pow(0.12, dt);
      glow.material.uniforms.uT.value = t;
      glow.material.uniforms.uAmp.value = (wide ? 0.22 : 0.12) * clamp01(t / LAND) + flash * 0.7;
      glow.scale.setScalar(13 + flash * 5);
      cur.x += (aim.x - cur.x) * 0.05; cur.y += (aim.y - cur.y) * 0.05;
      const scrollK = Math.min(1, scrollY / Math.max(1, hero.clientHeight));
      cluster.rotation.y = cur.x * 0.6 + Math.sin(t * 0.15) * 0.12;
      cluster.rotation.x = cur.y * 0.35;
      items.forEach(it => {
        const p = clamp01((t - it.delay) / 1.15), e = easeOutBack(p);
        const fx = it.x + Math.cos(t * 0.6 + it.ph) * 0.1;
        const fy = it.y + Math.sin(t * 0.8 + it.ph) * 0.18 + scrollK * (1.5 + it.z * 0.4);
        it.o.position.set(it.from.x + (fx - it.from.x) * e, it.from.y + (fy - it.from.y) * e, it.from.z + (it.z - it.from.z) * e);
        const k = 1 + spinKick * 9 + (1 - easeOutCubic(p)) * 14;
        it.o.rotation.x += it.spin.x * dt * k; it.o.rotation.y += it.spin.y * dt * k; it.o.rotation.z += it.spin.z * dt * k;
        if (p === 0) it.o.rotation.copy(it.rot0);
      });
    };
    requestAnimationFrame(() => canvas.classList.add('on'));
  }

  // =====================================================================
  // 2) HONEY-DO BAND — toolbox opens when it scrolls into view
  // =====================================================================
  const band = document.querySelector('.band');
  if (band) {
    const holder = document.createElement('div');
    holder.className = 'band-3d'; holder.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas'); holder.appendChild(canvas);
    band.querySelector('.wrap').appendChild(holder);
    band.classList.add('has3d');
    const S = stage(holder, canvas, 32);
    S.camera.position.set(0, 2.6, 11); S.camera.lookAt(0, 1.6, 0);

    const rig = new THREE.Group(); S.scene.add(rig);
    const glow = rays(COL.cream); glow.scale.setScalar(11); glow.position.set(0, 2.2, -2.5); rig.add(glow);
    const box = toolbox(); rig.add(box);
    const lid = box.userData.lid;
    const pop = [
      { o: hammer(),      to: new THREE.Vector3(-1.1, 3.6, 0.1), rz: 0.5 },
      { o: screwdriver(), to: new THREE.Vector3(0.05, 4.1, 0.2), rz: -0.1 },
      { o: wrench(),      to: new THREE.Vector3(1.15, 3.6, 0.0), rz: -0.5 },
      { o: hexNut(),      to: new THREE.Vector3(-1.9, 2.6, 0.6), rz: 0 },
      { o: hexNut(mat.steel), to: new THREE.Vector3(1.95, 2.7, 0.5), rz: 0 }
    ];
    pop.forEach((p, i) => { p.o.scale.setScalar(i < 3 ? 0.62 : 0.45); p.o.position.set(p.to.x * 0.5, 0.9, 0); rig.add(p.o); p.ph = i * 1.3; });

    function resize() {
      const w = holder.clientWidth, h = holder.clientHeight;
      S.renderer.setSize(w, h, false); S.camera.aspect = w / h; S.camera.updateProjectionMatrix();
      rig.scale.setScalar(w / h < 1.1 ? 0.8 : 1);
    }
    new ResizeObserver(resize).observe(holder); resize();

    let opened = -1, t = 0, flash = 0;
    new IntersectionObserver(([e]) => { if (e.isIntersecting && e.intersectionRatio > 0.55 && opened < 0) opened = t; }, { threshold: [0, 0.55, 1] }).observe(holder);
    holder.addEventListener('pointerdown', () => { if (opened >= 0) { opened = t - 0.2; flash = 0.8; } }); // tap to replay
    holder.style.pointerEvents = 'auto';
    const cur = { x: 0, y: 0 };
    S.frame = dt => {
      t += dt;
      cur.x += (aim.x - cur.x) * 0.05; cur.y += (aim.y - cur.y) * 0.05;
      rig.rotation.y = -0.45 + cur.x * 0.5 + Math.sin(t * 0.3) * 0.08;
      rig.rotation.x = cur.y * 0.15;
      const k = opened < 0 ? 0 : t - opened;
      const lidP = easeOutBack(clamp01(k / 0.7));
      lid.rotation.x = -1.8 * lidP + (opened < 0 ? Math.max(0, Math.sin(t * 2.2)) * 0.04 : 0); // little rattle before it opens
      if (k > 0.45 && k - dt <= 0.45) flash = 1;
      flash *= Math.pow(0.12, dt);
      glow.material.uniforms.uT.value = t;
      glow.material.uniforms.uAmp.value = 0.25 * clamp01((k - 0.4) / 0.6) + flash * 0.8;
      pop.forEach((p, i) => {
        const q = easeOutBack(clamp01((k - 0.35 - i * 0.08) / 0.8));
        p.o.position.set(p.to.x * (0.5 + 0.5 * q), 0.9 + (p.to.y - 0.9) * q + Math.sin(t * 1.4 + p.ph) * 0.08 * q, p.to.z * q);
        p.o.rotation.set(Math.sin(t * 0.9 + p.ph) * 0.15 * q, (t * 0.4 + p.ph) * q, p.rz * q);
      });
    };
  }
})();
