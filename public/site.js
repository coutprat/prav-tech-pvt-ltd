/* ============ PRAVERSE TECH — SHARED ENGINE ============ */
(function bootPraverseEngine() {
if (!window.gsap || !window.ScrollTrigger || !window.THREE || !window.Lenis) {
  window.setTimeout(bootPraverseEngine, 30);
  return;
}
(function () {
"use strict";
gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   THREE.JS — two visions:
   light  = "Neural"  : wireframe intelligence core, light field
   space  = "Space Tour" : starfield, planet, nebula fly-through
============================================================ */
const canvas = document.getElementById('webgl');
let setSpaceScene = () => {};
let startThreeScene = null;
if (canvas && window.THREE) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 0, 9);
  const isMobile = innerWidth < 760;

  /* --- Neural core --- */
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);
  const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(icoGeo),
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 }));
  coreGroup.add(wire);
  const wire2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.9, 1)),
    new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.14 }));
  coreGroup.add(wire2);
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', icoGeo.attributes.position.clone());
  const nodeMat = new THREE.PointsMaterial({ color: 0x06b6d4, size: 0.09, transparent: true, opacity: 0.9 });
  coreGroup.add(new THREE.Points(nodeGeo, nodeMat));
  const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x6d8dff, transparent: true, opacity: 0.07 }));
  coreGroup.add(innerSphere);

  /* --- Rings + satellites --- */
  const ringGroup = new THREE.Group();
  coreGroup.add(ringGroup);
  function makeRing(radius, color, opacity, tiltX, tiltZ) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity }));
    ring.rotation.x = tiltX; ring.rotation.z = tiltZ;
    ringGroup.add(ring);
    return ring;
  }
  const ringA = makeRing(3.6, 0x06b6d4, 0.35, Math.PI / 2.3, 0.3);
  const ringB = makeRing(4.3, 0x8b5cf6, 0.22, Math.PI / 1.8, -0.5);
  const ringC = makeRing(5.1, 0x3b82f6, 0.12, Math.PI / 2.8, 0.9);
  function makeSat(color) {
    return new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial({ color }));
  }
  const satA = makeSat(0x06b6d4), satB = makeSat(0x8b5cf6), satC = makeSat(0x3b82f6);
  scene.add(satA, satB, satC);

  /* --- Particle field (morphs into the space-tour story) --- */
  const COUNT = isMobile ? 600 : 1600;
  const pPos = new Float32Array(COUNT * 3);
  const pBase = new Float32Array(COUNT * 3);
  const pSphere = new Float32Array(COUNT * 3);
  const pRing = new Float32Array(COUNT * 3);
  const pHelix = new Float32Array(COUNT * 3);
  const pGalaxy = new Float32Array(COUNT * 3);
  const pVoid = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const ix = i * 3;
    const seed = i / COUNT;
    const randA = Math.sin(i * 12.9898) * 43758.5453;
    const randB = Math.sin(i * 78.233) * 24634.6345;
    const jitterA = randA - Math.floor(randA);
    const jitterB = randB - Math.floor(randB);
    const theta = seed * Math.PI * 2 * 34 + jitterA * 0.4;
    const phi = Math.acos(1 - 2 * ((i + 0.5) / COUNT));
    const sphereRadius = 2.35 + jitterB * 0.38;
    const ringRadius = 2.0 + jitterA * 3.0;
    const helixHeight = (seed - 0.5) * 6.2;
    const helixRadius = 1.0 + seed * 2.4;
    const arm = i % 4;
    const armAngle = theta + arm * Math.PI * 0.5;
    const galaxyRadius = Math.sqrt(seed) * 5.0;
    const voidRadius = 1.0 + Math.pow(seed, 0.35) * 6.2;

    pBase[ix] = (jitterA - 0.5) * 40;
    pBase[ix + 1] = (jitterB - 0.5) * 26;
    pBase[ix + 2] = (Math.random() - 0.5) * 30 - 6;

    pSphere[ix] = Math.sin(phi) * Math.cos(theta) * sphereRadius;
    pSphere[ix + 1] = Math.cos(phi) * sphereRadius;
    pSphere[ix + 2] = Math.sin(phi) * Math.sin(theta) * sphereRadius;

    pRing[ix] = Math.cos(theta) * ringRadius;
    pRing[ix + 1] = (jitterB - 0.5) * 0.55;
    pRing[ix + 2] = Math.sin(theta) * ringRadius * 0.34;

    pHelix[ix] = Math.cos(theta * 1.7) * helixRadius;
    pHelix[ix + 1] = helixHeight;
    pHelix[ix + 2] = Math.sin(theta * 1.7) * helixRadius;

    pGalaxy[ix] = Math.cos(armAngle + galaxyRadius * 0.9) * galaxyRadius;
    pGalaxy[ix + 1] = (jitterB - 0.5) * 0.75;
    pGalaxy[ix + 2] = Math.sin(armAngle + galaxyRadius * 0.9) * galaxyRadius;

    pVoid[ix] = Math.cos(theta * 2.2) * voidRadius;
    pVoid[ix + 1] = (jitterB - 0.5) * voidRadius * 0.48;
    pVoid[ix + 2] = Math.sin(theta * 2.2) * voidRadius;

    pPos[ix] = pBase[ix];
    pPos[ix + 1] = pBase[ix + 1];
    pPos[ix + 2] = pBase[ix + 2];
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x5b7bd5, size: 0.035, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  const tourTargets = [pSphere, pRing, pHelix, pGalaxy, pVoid];
  function smoothstep(v) {
    return v * v * (3 - 2 * v);
  }
  function morphParticles(progress, time) {
    const scaled = Math.min(0.999, Math.max(0, progress)) * (tourTargets.length - 1);
    const fromIndex = Math.floor(scaled);
    const toIndex = Math.min(tourTargets.length - 1, fromIndex + 1);
    const mix = smoothstep(scaled - fromIndex);
    const from = tourTargets[fromIndex];
    const to = tourTargets[toIndex];
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const pulse = Math.sin(time * 1.8 + i * 0.037) * 0.045;
      pPos[ix] = from[ix] + (to[ix] - from[ix]) * mix;
      pPos[ix + 1] = from[ix + 1] + (to[ix + 1] - from[ix + 1]) * mix + pulse;
      pPos[ix + 2] = from[ix + 2] + (to[ix + 2] - from[ix + 2]) * mix;
    }
    pGeo.attributes.position.needsUpdate = true;
  }
  function relaxParticles(time) {
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      pPos[ix] += (pBase[ix] - pPos[ix]) * 0.035;
      pPos[ix + 1] += (pBase[ix + 1] - pPos[ix + 1]) * 0.035;
      pPos[ix + 2] += (pBase[ix + 2] - pPos[ix + 2]) * 0.035 + Math.sin(time + i) * 0.0008;
    }
    pGeo.attributes.position.needsUpdate = true;
  }

  /* --- SPACE TOUR exclusives: planet + ring, distant sun, lights --- */
  const spaceGroup = new THREE.Group();
  spaceGroup.visible = false;
  scene.add(spaceGroup);

  const keyLight = new THREE.DirectionalLight(0x9db4ff, 2.2);
  keyLight.position.set(-6, 4, 8);
  spaceGroup.add(keyLight);
  spaceGroup.add(new THREE.AmbientLight(0x223266, 1.4));

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0x33509e, roughness: 0.7, metalness: 0.25, emissive: 0x0a1442, emissiveIntensity: 0.6 })
  );
  planet.position.set(5.5, -2.2, -8);
  spaceGroup.add(planet);
  const planetRing = new THREE.Mesh(
    new THREE.TorusGeometry(4.0, 0.07, 8, 140),
    new THREE.MeshBasicMaterial({ color: 0x8fb0ff, transparent: true, opacity: 0.4 })
  );
  planetRing.position.copy(planet.position);
  planetRing.rotation.x = Math.PI / 2.4;
  planetRing.rotation.z = 0.4;
  spaceGroup.add(planetRing);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xb9c6ee, roughness: 0.9 })
  );
  spaceGroup.add(moon);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe2b0 })
  );
  sun.position.set(-18, 8, -34);
  spaceGroup.add(sun);
  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffc97a, transparent: true, opacity: 0.18 })
  );
  sunGlow.position.copy(sun.position);
  spaceGroup.add(sunGlow);

  // distant star streaks layer for tour depth
  const S_COUNT = isMobile ? 250 : 700;
  const sPos = new Float32Array(S_COUNT * 3);
  for (let i = 0; i < S_COUNT; i++) {
    sPos[i * 3] = (Math.random() - 0.5) * 90;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    sPos[i * 3 + 2] = -20 - Math.random() * 60;
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const deepStars = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 }));
  deepStars.visible = false;
  scene.add(deepStars);

  // data-node / asteroid field — flythrough toward the Praverse station
  const nodeField = new THREE.Group();
  nodeField.visible = false;
  scene.add(nodeField);
  const NODE_COUNT = isMobile ? 14 : 26;
  const nodeColors = [0x06b6d4, 0x8b5cf6, 0x3b82f6];
  for (let i = 0; i < NODE_COUNT; i++) {
    const m = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.1 + Math.random() * 0.22, 0),
      new THREE.MeshBasicMaterial({ color: nodeColors[i % 3], wireframe: true, transparent: true, opacity: 0.55 })
    );
    m.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, -4 - Math.random() * 46);
    m.userData.spin = (Math.random() - 0.5) * 0.6;
    nodeField.add(m);
  }

  /* --- Mouse parallax --- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  /* --- Scroll progress --- */
  const scrollState = { p: 0 };
  const tourState = { p: 0 };
  ScrollTrigger.create({
    trigger: document.body, start: 0, end: () => Math.max(1, document.body.scrollHeight - innerHeight),
    onUpdate: (self) => { scrollState.p = self.progress; }
  });
  ScrollTrigger.create({
    trigger: document.body, start: 0, end: () => Math.max(1, Math.min(document.body.scrollHeight - innerHeight, innerHeight * 4.6)),
    onUpdate: (self) => { tourState.p = self.progress; }
  });

  /* --- Mode switching --- */
  let spaceMode = false;
  const tourFx = { warp: 0 }; // extra camera push during tour intro
  setSpaceScene = function (on, animate) {
    spaceMode = on;
    spaceGroup.visible = on;
    deepStars.visible = on;
    nodeField.visible = on;
    coreGroup.visible = !on;
    satA.visible = satB.visible = satC.visible = !on;
    // material palette morph
    const dur = animate ? 1.6 : 0;
    gsap.to(pMat.color, { r: on ? 1 : 0.357, g: on ? 1 : 0.482, b: on ? 1 : 0.835, duration: dur });
    gsap.to(pMat, { size: on ? 0.05 : 0.035, opacity: on ? 0.95 : 0.55, duration: dur });
    gsap.to(wire.material, { opacity: on ? 0.5 : 0.35, duration: dur });
    gsap.to(wire.material.color, { r: on ? 0.49 : 0.231, g: on ? 0.83 : 0.51, b: 1, duration: dur });
    gsap.to(wire2.material, { opacity: on ? 0.22 : 0.14, duration: dur });
    gsap.to(nodeMat, { size: on ? 0.12 : 0.09, duration: dur });
    if (animate && !reduceMotion) {
      // the tour: camera dives through the starfield, swings past the planet, returns
      tourFx.warp = 0;
      const tl = gsap.timeline();
      if (on) {
        tl.to(tourFx, { warp: 1, duration: 1.1, ease: 'power2.in' })
          .to(tourFx, { warp: 0, duration: 2.2, ease: 'power3.out' });
      } else {
        tl.to(tourFx, { warp: -0.5, duration: 0.8, ease: 'power2.inOut' })
          .to(tourFx, { warp: 0, duration: 1.2, ease: 'power2.out' });
      }
    }
  };

  /* --- Render loop --- */
  const clock = new THREE.Clock();
  function setSat(sat, ring, radius, t, speed, phase) {
    const a = t * speed + phase;
    const v = new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    v.applyEuler(ring.rotation);
    sat.position.copy(v);
  }
  const renderLoop = () => {
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    coreGroup.rotation.y = t * 0.12 + mouse.x * 0.25;
    coreGroup.rotation.x = Math.sin(t * 0.2) * 0.08 + mouse.y * 0.18;
    wire2.rotation.y = -t * 0.06;
    ringGroup.rotation.y = t * 0.05;
    setSat(satA, ringA, 3.6, t, 0.5, 0);
    setSat(satB, ringB, 4.3, t, -0.35, 2);
    setSat(satC, ringC, 5.1, t, 0.25, 4);
    particles.rotation.y = t * (spaceMode ? 0.004 : 0.012);

    const p = scrollState.p;
    const tp = tourState.p;

    if (spaceMode) {
      morphParticles(tp, t);
      // flythrough: the station (planet) approaches as the tour progresses
      planet.position.x = 7.5 - tp * 2.2;
      planet.position.y = -3.2 + Math.sin(tp * Math.PI) * 1.2;
      planet.position.z = -16 + tp * 9;
      planetRing.position.copy(planet.position);
      planet.rotation.y = t * 0.08;
      planetRing.rotation.z = 0.4 + t * 0.03;
      const ma = t * 0.4;
      moon.position.set(
        planet.position.x + Math.cos(ma) * 4.6,
        planet.position.y + Math.sin(ma * 0.7) * 0.8,
        planet.position.z + Math.sin(ma) * 4.6
      );
      deepStars.rotation.y = t * 0.005;
      // asteroid / data-node field drifts past the camera
      nodeField.position.z = p * 60 - 20;
      nodeField.children.forEach((m) => {
        m.rotation.x += 0.004;
        m.rotation.y += m.userData.spin * 0.01;
      });
    } else {
      relaxParticles(t);
    }

    coreGroup.position.y = p * 6.5;
    coreGroup.position.x = Math.sin(p * Math.PI) * 2.0;
    coreGroup.scale.setScalar(1 - p * 0.45);
    satA.visible = satB.visible = satC.visible = !spaceMode && p < 0.35;

    // camera: base + scroll pull-back + tour warp dive + parallax
    camera.position.z = spaceMode ? 9.2 - tp * 1.8 - tourFx.warp * 7 : 9 + p * 4 - tourFx.warp * 7;
    camera.position.y = mouse.y * -0.3 + tourFx.warp * 1.2 + (spaceMode ? Math.sin(tp * Math.PI * 2) * 0.35 : 0);
    camera.position.x = mouse.x * 0.4 + tourFx.warp * 2.5 + (spaceMode ? Math.sin(tp * Math.PI) * 0.8 : 0);
    camera.lookAt(
      spaceMode ? tourFx.warp * 3 : coreGroup.position.x * 0.3,
      spaceMode ? 0 : coreGroup.position.y * 0.25,
      spaceMode ? tourFx.warp * -6 : 0
    );

    const fade = p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1;
    renderer.domElement.style.opacity = Math.max(0.15, fade * (spaceMode ? 1 : 0.9));
    renderer.render(scene, camera);
  };
  renderer.render(scene, camera); // paint one frame behind the loader
  startThreeScene = () => renderer.setAnimationLoop(renderLoop);

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }, { passive: true });
}

/* ---------- Theme: Space Tour toggle ---------- */
const THEME_KEY = 'praverse-theme';
function applyTheme(theme, animate) {
  document.body.setAttribute('data-theme', theme);
  setSpaceScene(theme === 'space', !!animate);
  document.body.classList.toggle('space-tour-active', theme === 'space');
  document.querySelectorAll('.theme-toggle .tt-label').forEach((el) => {
    el.textContent = theme === 'space' ? 'EARTH MODE' : 'SPACE TOUR';
  });
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem(THEME_KEY) || 'light'; } catch (e) {}
applyTheme(savedTheme, false);
document.querySelectorAll('.theme-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'space' ? 'light' : 'space';
    applyTheme(next, true);
  });
});

/* ---------- Space Tour narrative layer ---------- */
const tourSteps = [
  {
    code: '01 / INTELLIGENCE CORE',
    title: 'Enterprise AI gathers into one field',
    body: 'Praverse begins with the operating problem: documents, workflows, images, decisions, and teams that need one trustworthy intelligence layer.',
    signal: 'Machine learning, document intelligence, decision support',
    tags: ['ML systems', 'RAG', 'Decision AI']
  },
  {
    code: '02 / AGENT ORBITS',
    title: 'Agents move around real work',
    body: 'The ring forms around tasks that matter: review evidence, search knowledge, draft reports, query data, and keep humans in the loop.',
    signal: 'Document review agents, knowledge search, analysis copilots',
    tags: ['Agents', 'Copilots', 'Audit trails']
  },
  {
    code: '03 / HEALTHMATE HELIX',
    title: 'Healthcare support becomes continuous',
    body: 'The helix carries HealthMate: conversational intake, appointment assistance, hospital navigation, reminders, and clinician-ready summaries.',
    signal: 'Patient interaction, care routing, assistive healthcare workflows',
    tags: ['HealthMate', 'Voice intake', 'Care workflows']
  },
  {
    code: '04 / REGULATED GALAXY',
    title: 'Pharma quality signals connect',
    body: 'Inspection observations, CAPA reasoning, SOP gaps, data integrity, and quality risk signals become a navigable regulatory intelligence map.',
    signal: 'FDA 483 analytics, CAPA support, GMP documentation intelligence',
    tags: ['Pharma AI', 'CAPA', 'GMP']
  },
  {
    code: '05 / FRONTIER DEPLOYMENT',
    title: 'Research turns into deployed systems',
    body: 'The tour resolves into the frontier: robotics, federated learning, AIoT, biochip research, photonics, and production infrastructure.',
    signal: 'Physical AI, secure edge intelligence, research-to-product tracks',
    tags: ['Robotics', 'Federated AI', 'Frontier Lab']
  }
];
const tourOverlay = document.createElement('aside');
tourOverlay.className = 'space-tour-overlay';
tourOverlay.setAttribute('aria-hidden', 'true');
tourOverlay.innerHTML = `
  <div class="space-tour-head">
    <span>Praverse Space Tour</span>
    <b>Scroll-driven ecosystem map</b>
  </div>
  <div class="space-tour-copy">
    <span class="space-tour-kicker"></span>
    <h2></h2>
    <p></p>
    <div class="space-tour-tags"></div>
    <div class="space-tour-actions">
      <a href="#capabilities" class="btn btn-ghost">Explore the ecosystem</a>
      <a href="/contact" class="btn btn-grad">Start a project</a>
    </div>
  </div>
  <div class="space-tour-system" aria-hidden="true">
    <span class="system-label">Current signal</span>
    <strong></strong>
    <div class="system-lines">
      <i></i><i></i><i></i><i></i>
    </div>
  </div>
  <div class="space-tour-rail">
    ${tourSteps.map((_, i) => `<i data-step="${i}"></i>`).join('')}
  </div>
`;
document.body.appendChild(tourOverlay);
const tourKicker = tourOverlay.querySelector('.space-tour-kicker');
const tourTitle = tourOverlay.querySelector('h2');
const tourBody = tourOverlay.querySelector('p');
const tourTags = tourOverlay.querySelector('.space-tour-tags');
const tourSignal = tourOverlay.querySelector('.space-tour-system strong');
const tourDots = tourOverlay.querySelectorAll('.space-tour-rail i');
let activeTourStep = -1;
function setTourStep(index) {
  if (index === activeTourStep) return;
  activeTourStep = index;
  const step = tourSteps[index];
  tourKicker.textContent = step.code;
  tourTitle.textContent = step.title;
  tourBody.textContent = step.body;
  tourSignal.textContent = step.signal;
  tourTags.innerHTML = step.tags.map((tag) => `<span>${tag}</span>`).join('');
  tourDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  if (!reduceMotion) {
    gsap.fromTo([tourKicker, tourTitle, tourBody, tourTags, tourSignal], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.045, ease: 'power3.out' });
  }
}
setTourStep(0);
ScrollTrigger.create({
  trigger: document.body,
  start: 0,
  end: () => Math.max(1, Math.min(document.body.scrollHeight - innerHeight, innerHeight * 4.6)),
  onUpdate: (self) => setTourStep(Math.min(tourSteps.length - 1, Math.floor(self.progress * tourSteps.length)))
});

/* ---------- Hero intro (home) / page-hero intro (sub-pages) ---------- */
let introPlayed = false;

/* ---------- Loader ---------- */
const loader = document.getElementById('loader');
const loadBar = document.getElementById('loadBar');
function finishLoad() {
  if (!loader || loader.classList.contains('done')) return;
  loader.classList.add('done');
  introTimeline();
  if (startThreeScene) startThreeScene();
}
if (loader && loadBar) {
  let fake = 0;
  const fakeInt = setInterval(() => {
    fake = Math.min(fake + Math.random() * 22, 92);
    loadBar.style.width = fake + '%';
  }, 120);
  const completeLoader = () => {
    clearInterval(fakeInt);
    loadBar.style.width = '100%';
    setTimeout(finishLoad, 450);
  };
  if (document.readyState === 'complete') completeLoader();
  else window.addEventListener('load', completeLoader);
  setTimeout(() => { clearInterval(fakeInt); finishLoad(); }, 5000);
} else {
  const startWithoutLoader = () => { introTimeline(); if (startThreeScene) startThreeScene(); };
  if (document.readyState === 'complete') startWithoutLoader();
  else window.addEventListener('load', startWithoutLoader);
}

function introTimeline() {
  if (introPlayed) return; introPlayed = true;
  if (reduceMotion) {
    document.querySelectorAll('#hero .rv, .page-hero .rv').forEach((el) => (el.style.opacity = 1));
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (document.querySelector('#heroTitle')) {
    tl.fromTo('#heroEyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo('#heroTitle .line span', { yPercent: 110 }, { yPercent: 0, duration: 1.0, stagger: 0.12, ease: 'power4.out' }, '-=0.35')
      .fromTo('#heroSub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .fromTo('#heroCta', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
      .fromTo('.float-chip', { opacity: 0, scale: 0.85, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'back.out(1.6)' }, '-=0.6');
  } else if (document.querySelector('.page-hero')) {
    tl.fromTo('.page-hero .rv', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 });
  }
}
if (document.querySelector('#heroTitle')) gsap.set('#heroTitle .line span', { yPercent: 110 });

/* ---------- Floating hero chips ---------- */
document.querySelectorAll('.float-chip').forEach((chip, i) => {
  const depth = parseFloat(chip.dataset.depth || 1);
  gsap.to(chip, { y: '+=14', duration: 2.6 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  if (document.querySelector('#hero')) {
    gsap.to(chip, {
      yPercent: -120 * depth, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }
});

/* ---------- Scroll reveals ---------- */
if (!reduceMotion) {
  document.querySelectorAll('section .rv, .safe-note').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 44 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });
  [['.cap-grid', '.card'], ['.pharma-grid', '.pharma-cell'], ['.process-steps', '.step'],
   ['.agent-stack', '.agent-card'], ['.timeline', '.tl-item'], ['.pub-grid', '.pub-card'],
   ['.contact-grid', '.contact-card']].forEach(([wrapSel, item]) => {
    document.querySelectorAll(wrapSel).forEach((wrapEl) => {
      gsap.fromTo(wrapEl.querySelectorAll(item), { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: wrapEl, start: 'top 82%', once: true }
      });
    });
  });
} else {
  document.querySelectorAll('.rv').forEach((el) => (el.style.opacity = 1));
}

/* ---------- Horizontal frontier scroll ---------- */
const track = document.getElementById('frontierTrack');
if (track && !reduceMotion && innerWidth > 760) {
  const getDist = () => track.scrollWidth - innerWidth + 48;
  gsap.to(track, {
    x: () => -getDist(), ease: 'none',
    scrollTrigger: {
      trigger: '#frontier', start: 'top top', end: () => '+=' + getDist(),
      pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
    }
  });
} else if (track) {
  track.style.overflowX = 'auto';
  track.style.paddingBottom = '40px';
  const pin = document.querySelector('#frontier .frontier-pin');
  if (pin) pin.style.paddingBottom = '60px';
}

/* ---------- Stat counters ---------- */
document.querySelectorAll('[data-count]').forEach((el) => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; }
      });
    }
  });
});

/* ---------- HealthMate chips ---------- */
document.querySelectorAll('[data-hmfloat]').forEach((chip, i) => {
  gsap.to(chip, { y: '+=12', duration: 3 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
});

/* ---------- Card cursor glow ---------- */
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
});

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('open')));
}
// highlight current page
const currentPath = location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('nav ul a').forEach((a) => {
  const rawHref = a.getAttribute('href') || '';
  if (!rawHref || rawHref.startsWith('#')) return;
  const linkPath = new URL(rawHref, location.origin).pathname.replace(/\/$/, '') || '/';
  if (linkPath === currentPath) a.classList.add('active');
});

/* ---------- Anchor scrolling via Lenis ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- Custom glowing-dot cursor (desktop only) ---------- */
const fineCursor = window.matchMedia('(pointer: fine)').matches;
if (!reduceMotion && fineCursor) {
  document.body.classList.add('custom-cursor');
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    cursorDot.classList.add('show');
  }, { passive: true });
  gsap.ticker.add(() => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursorDot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  });
  document.querySelectorAll('a, button, .btn, .theme-toggle').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
  });
}

/* ---------- Magnetic buttons ---------- */
if (!reduceMotion && fineCursor) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, { x: mx * 0.28, y: my * 0.38, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' }));
  });
}

/* ---------- Page transitions (space warp jump) ---------- */
const PAGE_NAMES = {
  '/': 'Home Base', '/domains': 'Innovation Domains', '/healthmate': 'HealthMate',
  '/pharma': 'Pharma & Regulatory AI', '/research': 'Research Sector', '/insights': 'Insights Feed',
  '/innovate': 'Venture Lab', '/about': 'About Praverse', '/contact': 'Contact Channel'
};
const pageFade = document.createElement('div');
pageFade.className = 'page-fade';
pageFade.innerHTML = '<div class="warp-streaks"></div><div class="warp-core"></div><div class="warp-label">Entering sector</div>';
document.body.appendChild(pageFade);
const warpLabel = pageFade.querySelector('.warp-label');
document.body.classList.add('page-enter');
const clearPageEnter = () => requestAnimationFrame(() => document.body.classList.remove('page-enter'));
if (document.readyState === 'complete') clearPageEnter();
else addEventListener('load', clearPageEnter);
document.querySelectorAll('a[href]').forEach((a) => {
  const href = a.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
      href.startsWith('http') || a.target === '_blank') return;
  a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const path = new URL(href, location.origin).pathname.replace(/\/$/, '') || '/';
    warpLabel.textContent = 'Entering ' + (PAGE_NAMES[path] || 'New Sector');
    pageFade.classList.add('active');
    document.body.classList.add('page-enter');
    setTimeout(() => { location.href = href; }, 520);
  });
});

/* ---------- Scroll-linked vignette / color grading ---------- */
const vignette = document.createElement('div');
vignette.id = 'vignette';
document.body.appendChild(vignette);
if (!reduceMotion) {
  gsap.to(vignette, {
    opacity: 0.32, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
  });
}

/* ---------- Footer: Insights/Innovate links + "currently exploring" ticker ---------- */
document.querySelectorAll('.foot-grid > div').forEach((col) => {
  const h5 = col.querySelector('h5');
  if (!h5 || h5.textContent.trim() !== 'Explore') return;
  const ul = col.querySelector('ul');
  if (!ul) return;
  if (!ul.querySelector('a[href="/insights"]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="/insights">Insights</a>';
    ul.appendChild(li);
  }
  if (!ul.querySelector('a[href="/innovate"]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="/innovate">Innovate</a>';
    ul.appendChild(li);
  }
});

const FRONTIER_TRACKS = [
  'Humanoid Robotics & Physical AI', 'Biochip 2027', 'Photonics 2027',
  'GPU & AI Infrastructure', 'Federated & Secure AI', 'AIoT & Industrial Intelligence', 'Venture Lab'
];
document.querySelectorAll('.foot-bottom').forEach((bottom) => {
  const ticker = document.createElement('div');
  ticker.className = 'foot-ticker';
  ticker.innerHTML = '<span class="ft-dot"></span><span class="ft-label">Currently exploring</span><span class="ft-text"><span></span></span>';
  bottom.insertAdjacentElement('beforebegin', ticker);
  const span = ticker.querySelector('.ft-text span');
  let idx = 0;
  function showTrack() {
    span.classList.remove('active');
    setTimeout(() => {
      span.textContent = FRONTIER_TRACKS[idx];
      idx = (idx + 1) % FRONTIER_TRACKS.length;
      requestAnimationFrame(() => span.classList.add('active'));
    }, 400);
  }
  showTrack();
  setInterval(showTrack, reduceMotion ? 6000 : 4500);
});
})();
})();
