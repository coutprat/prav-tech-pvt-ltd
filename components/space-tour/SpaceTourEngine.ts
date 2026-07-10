import * as THREE from "three";
import gsap from "gsap";

export interface SpaceTourManifestEntry {
  index: string;
  label: string;
}

export interface SpaceTourHudStat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface SpaceTourStep {
  code: string;
  title: string;
  body: string;
  tags: string[];
  manifest: SpaceTourManifestEntry[];
  href: string;
  linkLabel: string;
  hudStat: SpaceTourHudStat;
}

export const SPACE_TOUR_STEPS: SpaceTourStep[] = [
  {
    code: "01 / INTELLIGENCE CORE",
    title: "Enterprise AI gathers into one field",
    body: "Data comets from every domain arc inward — documents, workflows, images and decisions spiralling into one trustworthy intelligence layer.",
    tags: ["ML Systems", "RAG", "Decision AI"],
    manifest: [
      { index: "ML", label: "Machine Learning & Applied AI" },
      { index: "RAG", label: "Document Intelligence" },
      { index: "CV", label: "Vision & Medical Imaging" },
      { index: "DI", label: "Decision Intelligence" }
    ],
    href: "/foundry#domains",
    linkLabel: "Explore the capability map",
    hudStat: { value: 4, label: "AI capability domains" }
  },
  {
    code: "02 / AGENT ORBITS",
    title: "Agents move around real work",
    body: "Five autonomous agents orbit the core — each locked to a task: evidence review, knowledge search, report drafting, data query, human escalation.",
    tags: ["Agents", "Copilots", "Audit trails"],
    manifest: [
      { index: "01", label: "Document Review Agents" },
      { index: "02", label: "Regulatory & Research Agents" },
      { index: "03", label: "Data Analysis Agents" },
      { index: "04", label: "Knowledge Search Agents" }
    ],
    href: "/foundry#domains",
    linkLabel: "See agents in production",
    hudStat: { value: 5, label: "agents in active orbit" }
  },
  {
    code: "03 / MENNIE HELIX",
    title: "Healthcare support becomes continuous",
    body: "The double helix carries MENNIE through every layer of care: conversational intake, appointment assistance, reminders, and clinician-ready summaries.",
    tags: ["MENNIE", "Voice intake", "Care workflows"],
    manifest: [
      { index: "VX", label: "Voice-first symptom intake" },
      { index: "AP", label: "Doctor matching & appointments" },
      { index: "RM", label: "Smart medication reminders" },
      { index: "HR", label: "Humanoid kiosk exploration" }
    ],
    href: "/healthmate",
    linkLabel: "Explore MENNIE",
    hudStat: { value: 4, label: "layers of continuous care" }
  },
  {
    code: "04 / REGULATED GALAXY",
    title: "Pharma quality signals crystallise",
    body: "Inspection observations, CAPA reasoning, SOP gaps and data integrity signals lock into a navigable regulatory intelligence framework.",
    tags: ["Pharma AI", "CAPA", "GMP"],
    manifest: [
      { index: "FDA-483", label: "Observation analytics" },
      { index: "CAPA", label: "Root-cause reasoning" },
      { index: "GMP", label: "Documentation intelligence" },
      { index: "ALCOA+", label: "Data integrity review" }
    ],
    href: "/pharma",
    linkLabel: "Full pharma AI suite",
    hudStat: { value: 8, label: "regulatory modules" }
  },
  {
    code: "05 / FRONTIER DEPLOYMENT",
    title: "Research ignites into deployed systems",
    body: "The frontier ignites: a rocket of production-grade AI lifts off carrying robotics, federated learning, AIoT, biochip research and photonics.",
    tags: ["Robotics", "Federated AI", "Frontier Lab"],
    manifest: [
      { index: "01", label: "Humanoid Robotics & Physical AI" },
      { index: "02", label: "Biochip 2027" },
      { index: "03", label: "Photonics 2027" },
      { index: "04", label: "Federated & Secure AI" }
    ],
    href: "/research",
    linkLabel: "Open the Frontier Lab",
    hudStat: { value: 3, label: "frontier programmes active" }
  }
];

const ACCENTS = ["#06b6d4", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

const DISK_CFG = [
  { rMin: 1.8, rMax: 3.2, tilt: 0.0, speed: 0.8, color: [0.14, 0.55, 1.0] },
  { rMin: 2.0, rMax: 5.5, tilt: 0.35, speed: 0.6, color: [0.06, 0.72, 0.94] },
  { rMin: 1.4, rMax: 3.0, tilt: 0.62, speed: 1.1, color: [0.08, 0.85, 0.58] },
  { rMin: 2.8, rMax: 7.0, tilt: 0.12, speed: 0.5, color: [0.58, 0.35, 1.0] },
  { rMin: 1.5, rMax: 8.5, tilt: 0.48, speed: 1.45, color: [1.0, 0.72, 0.2] }
] as const;

const CAM_POS = [
  { x: 0, y: 14, z: 2 },
  { x: 12, y: 3.5, z: 6 },
  { x: 5, y: 7, z: 9 },
  { x: -8, y: 9, z: 7 },
  { x: 3, y: -2, z: 11 }
] as const;

export interface SpaceTourEngineRefs {
  canvas: HTMLCanvasElement;
  scrollEl: HTMLElement;
  bgNum: HTMLElement;
  kicker: HTMLElement;
  title: HTMLElement;
  body: HTMLElement;
  tags: HTMLElement;
  manifest: HTMLElement;
  link: HTMLAnchorElement;
  vProgress: HTMLElement;
  coord: HTMLElement;
  dots: HTMLElement[];
  hud?: HTMLElement;
  onStepChange?: (index: number) => void;
}

/* Shared GLSL */
const PT_V = `attribute float aSize;uniform float uTime;
  void main(){
    float p=0.97+0.03*sin(uTime*1.6+position.x*2.1+position.z*1.9);
    vec4 mv=modelViewMatrix*vec4(position,1.0);
    gl_PointSize=clamp(aSize*p*(310.0/-mv.z),0.4,28.0);
    gl_Position=projectionMatrix*mv;
  }`;
const PT_F = `uniform vec3 uColor;
  void main(){
    vec2 uv=gl_PointCoord-.5;float r=length(uv)*2.0;if(r>1.0)discard;
    float core=1.0-smoothstep(0.0,0.05,r);
    float aura=smoothstep(0.68,0.10,r)*(1.0-core)*0.20;
    float glow=pow(1.0-r,7.0)*0.08;
    gl_FragColor=vec4(clamp(uColor+core*0.14,0.0,1.0),(core*0.99+aura+glow)*0.94);
  }`;
const CP_V = `attribute float aSize;attribute vec3 aColor;varying vec3 vColor;
  void main(){vColor=aColor;vec4 mv=modelViewMatrix*vec4(position,1.0);
    gl_PointSize=clamp(aSize*(280.0/-mv.z),0.4,300.0);gl_Position=projectionMatrix*mv;}`;
const OPV = `attribute float aSize;attribute vec3 aColor;varying vec3 vColor;
  void main(){vColor=aColor;vec4 mv=modelViewMatrix*vec4(position,1.);
    gl_PointSize=clamp(aSize*(260.0/-mv.z),0.5,32.0);gl_Position=projectionMatrix*mv;}`;
const OPF = `varying vec3 vColor;uniform float uOpacity;
  void main(){vec2 uv=gl_PointCoord-.5;float r=length(uv)*2.;if(r>1.)discard;
    float core=1.-smoothstep(0.0,0.14,r);
    float glow=pow(1.-r,6.0)*0.25;
    gl_FragColor=vec4(vColor,(core*0.97+glow)*uOpacity);}`;
const STAR_F = `varying vec3 vColor;
  void main(){vec2 uv=gl_PointCoord-.5;float r=length(uv)*2.;if(r>1.)discard;
    float core=1.-smoothstep(0.0,0.26,r);
    float spike=pow(1.-r,10.0)*0.5;
    gl_FragColor=vec4(vColor,(core*0.94+spike)*0.99);}`;
const NEB_F = `varying vec3 vColor;
  void main(){vec2 uv=gl_PointCoord-.5;float r=length(uv)*2.;if(r>1.)discard;
    gl_FragColor=vec4(vColor,pow(1.0-r,5.5)*0.032);}`;
const JET_F = `varying vec3 vColor;uniform float uOpacity;
  void main(){vec2 uv=gl_PointCoord-.5;float r=length(uv)*2.;if(r>1.)discard;
    float core=1.-smoothstep(0.,0.17,r);
    float glow=pow(1.-r,5.0)*0.30;
    gl_FragColor=vec4(vColor,(core*0.93+glow)*0.92*uOpacity);}`;
const RIM_V = `varying vec3 vN,vV;
  void main(){vN=normalize(normalMatrix*normal);
    vec4 mv=modelViewMatrix*vec4(position,1.0);vV=normalize(-mv.xyz);
    gl_Position=projectionMatrix*mv;}`;
const RIM_F = `varying vec3 vN,vV;uniform vec3 uColor;
  void main(){float rim=pow(1.0-abs(dot(vN,vV)),4.5);gl_FragColor=vec4(uColor,rim*0.52);}`;
const GLW_V = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const GLW_F = `varying vec2 vUv;
  void main(){float r=length(vUv-.5)*2.0;
    vec3 col=mix(vec3(1.0,.78,.42),vec3(.9,.22,.04),r*r);
    gl_FragColor=vec4(col,(1.0-smoothstep(.06,1.0,r))*0.13);}`;

const NV_V = `attribute float aSize;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);
  gl_PointSize=clamp(aSize*(320./-mv.z),.5,26.);gl_Position=projectionMatrix*mv;}`;
const NV_F = `uniform float uOpacity;uniform float uPulse;
  void main(){vec2 uv=gl_PointCoord-.5;float r=length(uv)*2.;if(r>1.)discard;
    float core=1.-smoothstep(0.,.15,r);
    float glow=pow(1.-r,5.5)*0.28;
    gl_FragColor=vec4(.58,.38,.98,(core*0.98+glow)*uOpacity*uPulse);}`;

const SQ_V = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`;
const LENS_F = `
  uniform sampler2D tScene;uniform vec2 uBHPos;uniform float uStrength;varying vec2 vUv;
  void main(){
    vec2 d=vUv-uBHPos;float dist=length(d);
    float warp=uStrength*0.005/(dist*dist+0.0018);
    vec2 wUV=vUv-normalize(d)*warp*smoothstep(0.0,0.42,dist);
    gl_FragColor=texture2D(tScene,clamp(wUV,0.001,0.999));
  }`;
const THRESH_F = `
  uniform sampler2D tScene;uniform float uThresh;varying vec2 vUv;
  void main(){
    vec3 col=texture2D(tScene,vUv).rgb;
    float lum=dot(col,vec3(0.2126,0.7152,0.0722));
    float b=max(0.0,lum-uThresh);
    gl_FragColor=vec4(col*(b/max(lum,0.0001)),1.0);
  }`;
const BLUR_F = `
  uniform sampler2D tInput;uniform vec2 uDir;uniform vec2 uRes;varying vec2 vUv;
  void main(){
    vec2 st=uDir/uRes;
    vec3 c= texture2D(tInput,vUv+st*(-4.0)).rgb*0.0013
          + texture2D(tInput,vUv+st*(-3.0)).rgb*0.0133
          + texture2D(tInput,vUv+st*(-2.0)).rgb*0.0797
          + texture2D(tInput,vUv+st*(-1.0)).rgb*0.2827
          + texture2D(tInput,vUv           ).rgb*0.4460
          + texture2D(tInput,vUv+st*( 1.0)).rgb*0.2827
          + texture2D(tInput,vUv+st*( 2.0)).rgb*0.0797
          + texture2D(tInput,vUv+st*( 3.0)).rgb*0.0133
          + texture2D(tInput,vUv+st*( 4.0)).rgb*0.0013;
    gl_FragColor=vec4(c,1.0);
  }`;
const COMP_F = `
  uniform sampler2D tScene;uniform sampler2D tBloom;uniform float uStrength;varying vec2 vUv;
  void main(){
    vec3 scene=texture2D(tScene,vUv).rgb;
    vec3 bloom=texture2D(tBloom,vUv).rgb;
    gl_FragColor=vec4(scene+bloom*uStrength,1.0);
  }`;

interface CometDatum {
  r: number;
  ang: number;
  inc: number;
  L: number;
}

interface OrbitDef {
  r: number;
  tilt: number;
  spd: number;
  col: [number, number, number];
}

export class SpaceTourEngine {
  private refs: SpaceTourEngineRefs;
  private reducedMotion: boolean;

  private animId: number | null = null;
  private cleanupFns: Array<() => void> = [];
  private t = 0;
  private step = -1;
  private prog = 0;
  private progTarget = 0;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private camTarget = { x: 0, y: 14, z: 1 };
  private curDisk = { rMin: 1.8, rMax: 3.2, tilt: 0.0, speed: 0.8 };

  private diskGroup!: THREE.Group;
  private diskPos!: Float32Array;
  private diskGeo!: THREE.BufferGeometry;
  private diskMat!: THREE.ShaderMaterial;
  private phase!: Float32Array;
  private bRadius!: Float32Array;
  private dSpeed!: Float32Array;
  private rOff!: Float32Array;
  private diskCount = 0;

  private photonRing!: THREE.Mesh;
  private glowRing!: THREE.Mesh;
  private rimMat!: THREE.ShaderMaterial;

  private jetGeo!: THREE.BufferGeometry;
  private jetPos!: Float32Array;
  private jetMat!: THREE.ShaderMaterial;
  private jetPhase!: Float32Array;
  private jetCount = 0;

  private starPoints!: THREE.Points;

  private cometData: CometDatum[] = [];
  private cometGeo!: THREE.BufferGeometry;
  private cometPos!: Float32Array;
  private cometCol!: Float32Array;
  private cometMat!: THREE.LineBasicMaterial;
  private cometCount = 0;

  private orbitLineMats: THREE.LineBasicMaterial[] = [];
  private orbitDefs: OrbitDef[] = [];
  private orbitGeo!: THREE.BufferGeometry;
  private orbitPos!: Float32Array;
  private orbitMat!: THREE.ShaderMaterial;

  private helixGeo!: THREE.BufferGeometry;
  private helixPos!: Float32Array;
  private helixMat!: THREE.ShaderMaterial;
  private helixCount = 0;

  private cage!: THREE.LineSegments;
  private cageMat!: THREE.LineBasicMaterial;
  private nodeVertMat!: THREE.ShaderMaterial;

  private rocketPos!: Float32Array;
  private rocketGeo!: THREE.BufferGeometry;
  private rocketMat!: THREE.PointsMaterial;
  private exhaustPos!: Float32Array;
  private exhaustCol!: Float32Array;
  private exhaustGeo!: THREE.BufferGeometry;
  private exhaustMat!: THREE.ShaderMaterial;
  private exhaustPhase!: Float32Array;
  private exhaustRadius!: Float32Array;
  private exhaustCount = 0;
  private rocketT = 0;

  private blRender: (() => void) | null = null;
  private blSetSize: ((w: number, h: number) => void) | null = null;
  private lensMat: THREE.ShaderMaterial | null = null;

  private mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  private mounted = false;

  constructor(refs: SpaceTourEngineRefs, reducedMotion: boolean) {
    this.refs = refs;
    this.reducedMotion = reducedMotion;
  }

  mount(): void {
    if (this.mounted) return;
    this.mounted = true;
    this.initThree();
    this.initScroll();
    this.show(0, true);
  }

  destroy(): void {
    this.mounted = false;
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    const cv = this.refs.canvas;
    const W = cv.clientWidth || window.innerWidth;
    const H = cv.clientHeight || window.innerHeight;
    const mob = W < 760;
    const addB = THREE.AdditiveBlending;

    const rend = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, powerPreference: "high-performance" });
    rend.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    rend.setSize(W, H);
    rend.setClearColor(0x020510, 1);
    this.renderer = rend;

    const sc = new THREE.Scene();
    sc.fog = new THREE.FogExp2(0x020510, 0.004);
    const cam = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    cam.position.set(0, 14, 2);
    cam.lookAt(0, 0, 0);
    this.camera = cam;

    /* Disk */
    const diskGroup = new THREE.Group();
    sc.add(diskGroup);
    this.diskGroup = diskGroup;
    const N = mob ? 2000 : 6000;
    this.diskCount = N;
    const dPos = new Float32Array(N * 3);
    const dSz = new Float32Array(N);
    this.diskPos = dPos;
    this.phase = new Float32Array(N);
    this.bRadius = new Float32Array(N);
    this.dSpeed = new Float32Array(N);
    this.rOff = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const rA = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const rB = Math.abs(Math.sin(i * 78.233) * 24634.6345) % 1;
      this.phase[i] = rA * Math.PI * 2;
      this.bRadius[i] = Math.pow(rB, 0.55);
      this.dSpeed[i] = 0.4 + rA * 0.8;
      this.rOff[i] = rA;
      dSz[i] = 0.55 + rA * 1.95;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    ptGeo.setAttribute("aSize", new THREE.BufferAttribute(dSz, 1));
    const ptMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0.14, 0.55, 1) }, uTime: { value: 0 } },
      vertexShader: PT_V,
      fragmentShader: PT_F,
      transparent: true,
      blending: addB,
      depthWrite: false
    });
    diskGroup.add(new THREE.Points(ptGeo, ptMat));
    this.diskGeo = ptGeo;
    this.diskMat = ptMat;

    const igMat = new THREE.ShaderMaterial({
      vertexShader: GLW_V,
      fragmentShader: GLW_F,
      transparent: true,
      blending: addB,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const ig = new THREE.Mesh(new THREE.CircleGeometry(2.4, 128), igMat);
    ig.rotation.x = Math.PI / 2;
    diskGroup.add(ig);

    /* Event horizon */
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(1.05, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 })));

    /* Photon ring */
    const prMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const photonRing = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.015, 16, 256), prMat);
    photonRing.rotation.x = Math.PI / 2;
    sc.add(photonRing);
    const grMat = new THREE.MeshBasicMaterial({ color: 0x3388ff, transparent: true, opacity: 0.014, blending: addB, depthWrite: false });
    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.15, 8, 80), grMat);
    glowRing.rotation.x = Math.PI / 2;
    sc.add(glowRing);
    this.photonRing = photonRing;
    this.glowRing = glowRing;

    /* Rim glow */
    const rimMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0.14, 0.55, 1) } },
      vertexShader: RIM_V,
      fragmentShader: RIM_F,
      transparent: true,
      blending: addB,
      depthWrite: false,
      side: THREE.BackSide
    });
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(1.14, 64, 64), rimMat));
    this.rimMat = rimMat;

    /* Polar jets */
    const J = mob ? 200 : 720;
    const halfJ = Math.floor(J / 2);
    this.jetCount = J;
    const jPos = new Float32Array(J * 3);
    const jCol = new Float32Array(J * 3);
    const jSz = new Float32Array(J);
    this.jetPos = jPos;
    this.jetPhase = new Float32Array(J);
    for (let i = 0; i < J; i++) {
      const rA = Math.abs(Math.sin(i * 91.234) * 12345.678) % 1;
      const frac = (i % halfJ) / halfJ;
      this.jetPhase[i] = rA * Math.PI * 2;
      jSz[i] = 0.28 + rA * 0.7;
      jCol[i * 3] = 0.72 - frac * 0.38;
      jCol[i * 3 + 1] = 0.88 - frac * 0.18;
      jCol[i * 3 + 2] = 1.0;
    }
    const jGeo = new THREE.BufferGeometry();
    jGeo.setAttribute("position", new THREE.BufferAttribute(jPos, 3));
    jGeo.setAttribute("aColor", new THREE.BufferAttribute(jCol, 3));
    jGeo.setAttribute("aSize", new THREE.BufferAttribute(jSz, 1));
    const jetMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: CP_V,
      fragmentShader: JET_F,
      transparent: true,
      blending: addB,
      depthWrite: false
    });
    sc.add(new THREE.Points(jGeo, jetMat));
    this.jetGeo = jGeo;
    this.jetMat = jetMat;

    /* Background stars */
    const SC = mob ? 700 : 2000;
    const sPos = new Float32Array(SC * 3);
    const sCol = new Float32Array(SC * 3);
    const sSz = new Float32Array(SC);
    for (let i = 0; i < SC; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 100;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      sPos[i * 3 + 2] = -20 - Math.random() * 80;
      const ty = Math.random();
      if (ty < 0.6) {
        sCol[i * 3] = 0.78 + Math.random() * 0.22;
        sCol[i * 3 + 1] = 0.88 + Math.random() * 0.12;
        sCol[i * 3 + 2] = 1;
      } else if (ty < 0.85) {
        sCol[i * 3] = 1;
        sCol[i * 3 + 1] = 0.92 + Math.random() * 0.08;
        sCol[i * 3 + 2] = 0.62 + Math.random() * 0.28;
      } else {
        sCol[i * 3] = 1;
        sCol[i * 3 + 1] = 0.48 + Math.random() * 0.28;
        sCol[i * 3 + 2] = 0.18 + Math.random() * 0.24;
      }
      sSz[i] = 0.14 + Math.random() * 0.7;
    }
    const stGeo = new THREE.BufferGeometry();
    stGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    stGeo.setAttribute("aColor", new THREE.BufferAttribute(sCol, 3));
    stGeo.setAttribute("aSize", new THREE.BufferAttribute(sSz, 1));
    const stPts = new THREE.Points(
      stGeo,
      new THREE.ShaderMaterial({ uniforms: {}, vertexShader: CP_V, fragmentShader: STAR_F, transparent: true, blending: addB, depthWrite: false })
    );
    sc.add(stPts);
    this.starPoints = stPts;

    /* Nebula */
    const NE = 22;
    const nPos = new Float32Array(NE * 3);
    const nCol = new Float32Array(NE * 3);
    const nSz = new Float32Array(NE);
    const nPal = [
      [0.12, 0.22, 0.88],
      [0.42, 0.08, 0.72],
      [0.04, 0.38, 0.72],
      [0.14, 0.04, 0.52],
      [0.55, 0.15, 0.88]
    ];
    for (let i = 0; i < NE; i++) {
      nPos[i * 3] = (Math.random() - 0.5) * 44;
      nPos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      nPos[i * 3 + 2] = -22 - Math.random() * 50;
      const c = nPal[i % nPal.length];
      nCol[i * 3] = c[0];
      nCol[i * 3 + 1] = c[1];
      nCol[i * 3 + 2] = c[2];
      nSz[i] = 18 + Math.random() * 34;
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
    nebGeo.setAttribute("aColor", new THREE.BufferAttribute(nCol, 3));
    nebGeo.setAttribute("aSize", new THREE.BufferAttribute(nSz, 1));
    sc.add(
      new THREE.Points(
        nebGeo,
        new THREE.ShaderMaterial({ uniforms: {}, vertexShader: CP_V, fragmentShader: NEB_F, transparent: true, blending: addB, depthWrite: false })
      )
    );

    this.initComets(sc, addB, mob);
    this.initOrbits(sc, addB);
    this.initHelix(sc, addB, mob);
    this.initCage(sc, addB);
    this.initRocket(sc, addB, mob);

    /* Mouse parallax (within the takeover only) */
    const onMM = (e: PointerEvent) => {
      this.mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      this.mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("pointermove", onMM, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener("pointermove", onMM));

    /* Resize */
    const onR = () => {
      const w = cv.clientWidth || window.innerWidth;
      const h = cv.clientHeight || window.innerHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      rend.setSize(w, h);
      if (this.blSetSize) this.blSetSize(w, h);
    };
    window.addEventListener("resize", onR, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener("resize", onR));

    this.initBloom(sc, cam, rend, W, H);

    const clk = new THREE.Clock();
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      const dt = clk.getDelta();
      this.t += dt;
      const t = this.t;
      this.prog += (this.progTarget - this.prog) * (this.reducedMotion ? 1 : 0.072);
      this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.04;
      this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.04;

      this.updateDisk(t, dt);
      ptMat.uniforms.uTime.value = t;
      const tilt = this.curDisk.tilt;
      photonRing.rotation.x = Math.PI / 2 + tilt;
      glowRing.rotation.x = photonRing.rotation.x;
      rimMat.uniforms.uColor.value.copy(ptMat.uniforms.uColor.value as THREE.Color);
      this.updateJets(t, this.prog);
      stPts.rotation.y = t * 0.0018;

      this.updateComets(t, this.prog, dt);
      this.updateOrbits(t, this.prog);
      this.updateHelix(t, this.prog);
      this.updateCage(t, this.prog);
      this.updateRocket(t, this.prog, dt);

      const ct = this.camTarget;
      cam.position.x += (ct.x + this.mouse.x * 0.9 - cam.position.x) * 0.028;
      cam.position.y += (ct.y - this.mouse.y * 0.5 - cam.position.y) * 0.028;
      cam.position.z += (ct.z - cam.position.z) * 0.028;
      cam.lookAt(this.mouse.x * 0.18, -this.mouse.y * 0.08, 0);

      if (this.lensMat) {
        const bhNDC = new THREE.Vector3(0, 0, 0).project(cam);
        (this.lensMat.uniforms.uBHPos.value as THREE.Vector2).set(bhNDC.x * 0.5 + 0.5, bhNDC.y * 0.5 + 0.5);
      }

      if (this.refs.coord) {
        const lat = (cam.position.y * 5.8).toFixed(1);
        const lon = ((t * 2.2) % 360).toFixed(1);
        this.refs.coord.textContent = `LAT ${parseFloat(lat) >= 0 ? "+" : ""}${lat}° · LON ${lon}°`;
      }

      if (this.blRender) this.blRender();
      else rend.render(sc, cam);
    };
    loop();
  }

  private updateDisk(t: number, dt: number): void {
    const cfg = DISK_CFG;
    const s = Math.min(0.9999, this.prog) * 4;
    const fi = Math.floor(s);
    const ti = Math.min(4, fi + 1);
    const v = s - fi;
    const mix = v * v * (3 - 2 * v);
    const A = cfg[fi];
    const B = cfg[ti];
    const cur = this.curDisk;
    cur.rMin = A.rMin + (B.rMin - A.rMin) * mix;
    cur.rMax = A.rMax + (B.rMax - A.rMax) * mix;
    cur.tilt = A.tilt + (B.tilt - A.tilt) * mix;
    cur.speed = A.speed + (B.speed - A.speed) * mix;
    const pos = this.diskPos;
    const N = this.diskCount;
    const rRange = cur.rMax - cur.rMin;
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      this.phase[i] += dt * cur.speed * this.dSpeed[i];
      const phi = this.phase[i];
      const r = cur.rMin + this.bRadius[i] * rRange;
      const rp = r * (1 + 0.035 * Math.sin(t * 2.3 + this.rOff[i] * 9.7));
      const ch = this.rOff[i] * 6.283;
      const cY = this.reducedMotion ? 0 : (Math.sin(phi * 3.1 + t * 1.6 + ch) * 0.5 + Math.sin(r * 2.4 - t * 0.9 + ch) * 0.5) * (0.045 + r * 0.012);
      const cR = this.reducedMotion ? 1 : 1 + (Math.sin(phi * 2.2 - t * 1.1 + ch) * 0.5 + Math.sin(phi * 5.3 + t * 0.7) * 0.5) * 0.05;
      const rc = rp * cR;
      pos[k] = rc * Math.cos(phi);
      pos[k + 1] = (this.rOff[i] - 0.5) * 0.11 + cY;
      pos[k + 2] = rc * Math.sin(phi);
    }
    this.diskGeo.attributes.position.needsUpdate = true;
    this.diskGroup.rotation.x = cur.tilt;
    const [rA, gA, bA] = A.color;
    const [rB, gB, bB] = B.color;
    const col = this.diskMat.uniforms.uColor.value as THREE.Color;
    col.r = rA + (rB - rA) * mix;
    col.g = gA + (gB - gA) * mix;
    col.b = bA + (bB - bA) * mix;
  }

  private updateJets(t: number, p: number): void {
    const jp = Math.max(0, (p - 0.15) / 0.85);
    this.jetMat.uniforms.uOpacity.value = jp * 0.88;
    if (jp <= 0) return;
    const J = this.jetCount;
    const halfJ = Math.floor(J / 2);
    const pos = this.jetPos;
    for (let i = 0; i < J; i++) {
      const k = i * 3;
      const isUp = i < halfJ;
      const li = i % halfJ;
      const frac = li / halfJ;
      const phi = this.jetPhase[i] + t * (0.7 + frac * 0.5);
      const yAbs = 1.15 + frac * 8.5 * jp;
      const helR = Math.max(0, (0.9 - frac * 0.85) * 0.55 * Math.sin(frac * Math.PI * 5 + t * 1.2) * jp);
      pos[k] = helR * Math.cos(phi);
      pos[k + 1] = isUp ? yAbs : -yAbs;
      pos[k + 2] = helR * Math.sin(phi);
    }
    this.jetGeo.attributes.position.needsUpdate = true;
  }

  private sectionOpacity(p: number, idx: number): number {
    const center = (idx + 0.5) / 5;
    const dist = Math.abs(p - center);
    return Math.max(0, 1 - dist / 0.24);
  }

  private initComets(sc: THREE.Scene, addB: THREE.Blending, mob: boolean): void {
    const NC = mob ? 14 : 28;
    this.cometCount = NC;
    const cData: CometDatum[] = [];
    for (let i = 0; i < NC; i++) {
      const rA = Math.abs(Math.sin(i * 54.321) * 87654) % 1;
      const rB = Math.abs(Math.sin(i * 23.456) * 43210) % 1;
      cData.push({ r: 5 + rA * 7, ang: rB * Math.PI * 2, inc: (rA - 0.5) * 1.1, L: 1.8 + rA * 0.9 });
    }
    const cPos = new Float32Array(NC * 6);
    const cCol = new Float32Array(NC * 6);
    const cGeo = new THREE.BufferGeometry();
    cGeo.setAttribute("position", new THREE.BufferAttribute(cPos, 3));
    cGeo.setAttribute("color", new THREE.BufferAttribute(cCol, 3));
    const cMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, blending: addB, depthWrite: false });
    sc.add(new THREE.LineSegments(cGeo, cMat));
    this.cometData = cData;
    this.cometGeo = cGeo;
    this.cometPos = cPos;
    this.cometCol = cCol;
    this.cometMat = cMat;
  }

  private updateComets(t: number, p: number, dt: number): void {
    const op = this.sectionOpacity(p, 0);
    this.cometMat.opacity = op * 0.92;
    if (op < 0.01) return;
    const pos = this.cometPos;
    const col = this.cometCol;
    for (let i = 0; i < this.cometCount; i++) {
      const d = this.cometData[i];
      const gf = 1 / (d.r * d.r + 0.5);
      d.ang += dt * ((d.L / (d.r + 0.1)) * 2.5);
      d.r -= dt * (gf * 2.8 + 0.06);
      if (d.r < 1.3) {
        const rA = Math.abs(Math.sin(i * 54.321 + t) * 87654) % 1;
        const rB = Math.abs(Math.sin(i * 23.456 + t) * 43210) % 1;
        d.r = 5 + rA * 7;
        d.ang = rB * Math.PI * 2;
      }
      const ci = Math.cos(d.inc);
      const si = Math.sin(d.inc);
      const x = d.r * Math.cos(d.ang);
      const z0 = d.r * Math.sin(d.ang);
      const y = z0 * si;
      const z = z0 * ci;
      const ra = d.ang - 0.2;
      const rt = Math.min(d.r + 0.35, 13);
      const tx = rt * Math.cos(ra);
      const tz0 = rt * Math.sin(ra);
      const ty = tz0 * si;
      const tz = tz0 * ci;
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = tx;
      pos[i * 6 + 4] = ty;
      pos[i * 6 + 5] = tz;
      const br = Math.min(1, (d.r - 1.3) / 5);
      col[i * 6] = 0.7 + br * 0.3;
      col[i * 6 + 1] = 0.86 + br * 0.14;
      col[i * 6 + 2] = 1;
      col[i * 6 + 3] = 0.06;
      col[i * 6 + 4] = 0.09;
      col[i * 6 + 5] = 0.14;
    }
    this.cometGeo.attributes.position.needsUpdate = true;
    this.cometGeo.attributes.color.needsUpdate = true;
  }

  private initOrbits(sc: THREE.Scene, addB: THREE.Blending): void {
    const defs: OrbitDef[] = [
      { r: 2.6, tilt: 0.0, spd: 1.3, col: [0.3, 0.8, 1.0] },
      { r: 3.8, tilt: 0.4, spd: 0.9, col: [0.4, 0.5, 1.0] },
      { r: 5.0, tilt: 0.7, spd: 0.6, col: [0.7, 0.3, 1.0] },
      { r: 6.4, tilt: 0.18, spd: 0.4, col: [0.0, 0.8, 0.6] },
      { r: 4.4, tilt: -0.5, spd: 0.75, col: [1.0, 0.72, 0.22] }
    ];
    this.orbitDefs = defs;
    this.orbitLineMats = [];
    defs.forEach((ag) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * ag.r, 0, Math.sin(a) * ag.r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(ag.col[0], ag.col[1], ag.col[2]),
        transparent: true,
        opacity: 0,
        blending: addB,
        depthWrite: false
      });
      const l = new THREE.Line(geo, mat);
      l.rotation.x = ag.tilt;
      sc.add(l);
      this.orbitLineMats.push(mat);
    });
    const AP = 5;
    const aPos = new Float32Array(AP * 3);
    const aCol = new Float32Array(AP * 3);
    const aSz = new Float32Array(AP);
    defs.forEach((ag, i) => {
      aCol[i * 3] = ag.col[0];
      aCol[i * 3 + 1] = ag.col[1];
      aCol[i * 3 + 2] = ag.col[2];
      aSz[i] = 4.0;
    });
    const aGeo = new THREE.BufferGeometry();
    aGeo.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
    aGeo.setAttribute("aColor", new THREE.BufferAttribute(aCol, 3));
    aGeo.setAttribute("aSize", new THREE.BufferAttribute(aSz, 1));
    const aMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: OPV,
      fragmentShader: OPF,
      transparent: true,
      blending: addB,
      depthWrite: false
    });
    sc.add(new THREE.Points(aGeo, aMat));
    this.orbitGeo = aGeo;
    this.orbitPos = aPos;
    this.orbitMat = aMat;
  }

  private updateOrbits(t: number, p: number): void {
    const op = this.sectionOpacity(p, 1);
    this.orbitMat.uniforms.uOpacity.value = op;
    this.orbitLineMats.forEach((m) => {
      m.opacity = op * 0.18;
    });
    if (op < 0.01) return;
    const pos = this.orbitPos;
    this.orbitDefs.forEach((d, i) => {
      const ang = t * d.spd + i * 1.257;
      const ct = Math.cos(d.tilt);
      const st = Math.sin(d.tilt);
      const lz = d.r * Math.sin(ang);
      pos[i * 3] = d.r * Math.cos(ang);
      pos[i * 3 + 1] = lz * st;
      pos[i * 3 + 2] = lz * ct;
    });
    this.orbitGeo.attributes.position.needsUpdate = true;
  }

  private initHelix(sc: THREE.Scene, addB: THREE.Blending, mob: boolean): void {
    const NH = mob ? 280 : 640;
    const half = NH / 2;
    this.helixCount = NH;
    const hPos = new Float32Array(NH * 3);
    const hCol = new Float32Array(NH * 3);
    const hSz = new Float32Array(NH);
    for (let i = 0; i < NH; i++) {
      const f = (i % half) / half;
      hCol[i * 3] = f * 0.12;
      hCol[i * 3 + 1] = 0.68 + f * 0.22;
      hCol[i * 3 + 2] = 0.55 + f * 0.3;
      hSz[i] = 0.75;
    }
    const hGeo = new THREE.BufferGeometry();
    hGeo.setAttribute("position", new THREE.BufferAttribute(hPos, 3));
    hGeo.setAttribute("aColor", new THREE.BufferAttribute(hCol, 3));
    hGeo.setAttribute("aSize", new THREE.BufferAttribute(hSz, 1));
    const hMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: OPV,
      fragmentShader: OPF,
      transparent: true,
      blending: addB,
      depthWrite: false
    });
    sc.add(new THREE.Points(hGeo, hMat));
    this.helixGeo = hGeo;
    this.helixPos = hPos;
    this.helixMat = hMat;
  }

  private updateHelix(t: number, p: number): void {
    const op = this.sectionOpacity(p, 2);
    this.helixMat.uniforms.uOpacity.value = op;
    if (op < 0.01) return;
    const pos = this.helixPos;
    const NH = this.helixCount;
    const half = NH / 2;
    for (let i = 0; i < NH; i++) {
      const arm = i < half ? 0 : 1;
      const j = i % half;
      const frac = j / (half - 1);
      const ang = frac * Math.PI * 8 + arm * Math.PI + t * 0.55;
      const y = (frac - 0.5) * 13;
      pos[i * 3] = 1.55 * Math.cos(ang);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 1.55 * Math.sin(ang);
    }
    this.helixGeo.attributes.position.needsUpdate = true;
  }

  private initCage(sc: THREE.Scene, addB: THREE.Blending): void {
    const icoBase = new THREE.IcosahedronGeometry(7, 0);
    const edges = new THREE.EdgesGeometry(icoBase);
    const cageMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0, blending: addB, depthWrite: false });
    const cage = new THREE.LineSegments(edges, cageMat);
    sc.add(cage);
    icoBase.dispose();
    this.cage = cage;
    this.cageMat = cageMat;

    const phi = (1 + Math.sqrt(5)) / 2;
    const sc7 = 7 / Math.sqrt(1 + phi * phi);
    const iVerts: Array<[number, number, number]> = [
      [0, sc7, phi * sc7],
      [0, -sc7, phi * sc7],
      [0, sc7, -phi * sc7],
      [0, -sc7, -phi * sc7],
      [sc7, phi * sc7, 0],
      [-sc7, phi * sc7, 0],
      [sc7, -phi * sc7, 0],
      [-sc7, -phi * sc7, 0],
      [phi * sc7, 0, sc7],
      [-phi * sc7, 0, sc7],
      [phi * sc7, 0, -sc7],
      [-phi * sc7, 0, -sc7]
    ];
    const NV = iVerts.length;
    const nvPos = new Float32Array(NV * 3);
    const nvSz = new Float32Array(NV);
    iVerts.forEach((v, i) => {
      nvPos[i * 3] = v[0];
      nvPos[i * 3 + 1] = v[1];
      nvPos[i * 3 + 2] = v[2];
      nvSz[i] = 2.8;
    });
    const nvGeo = new THREE.BufferGeometry();
    nvGeo.setAttribute("position", new THREE.BufferAttribute(nvPos, 3));
    nvGeo.setAttribute("aSize", new THREE.BufferAttribute(nvSz, 1));
    const nvMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 }, uPulse: { value: 1 } },
      vertexShader: NV_V,
      fragmentShader: NV_F,
      transparent: true,
      blending: addB,
      depthWrite: false
    });
    sc.add(new THREE.Points(nvGeo, nvMat));
    this.nodeVertMat = nvMat;
  }

  private updateCage(t: number, p: number): void {
    const op = this.sectionOpacity(p, 3);
    this.cageMat.opacity = op * 0.52;
    this.nodeVertMat.uniforms.uOpacity.value = op;
    this.nodeVertMat.uniforms.uPulse.value = 0.6 + Math.sin(t * 2.4) * 0.4;
    if (this.cage) {
      this.cage.rotation.y = t * 0.048;
      this.cage.rotation.x = Math.sin(t * 0.031) * 0.12;
    }
  }

  private initRocket(sc: THREE.Scene, addB: THREE.Blending, mob: boolean): void {
    const rPos = new Float32Array(3);
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));
    const rMat = new THREE.PointsMaterial({ color: 0xffeebb, size: 0.45, sizeAttenuation: true, transparent: true, blending: addB, depthWrite: false });
    sc.add(new THREE.Points(rGeo, rMat));
    this.rocketPos = rPos;
    this.rocketGeo = rGeo;
    this.rocketMat = rMat;

    const EN = mob ? 80 : 160;
    this.exhaustCount = EN;
    const ePos = new Float32Array(EN * 3);
    const eCol = new Float32Array(EN * 3);
    const eSz = new Float32Array(EN);
    const ePh = new Float32Array(EN);
    const eRd = new Float32Array(EN);
    for (let i = 0; i < EN; i++) {
      ePh[i] = Math.random() * Math.PI * 2;
      eRd[i] = Math.random();
      eSz[i] = 0.5 + Math.random() * 0.9;
    }
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
    eGeo.setAttribute("aColor", new THREE.BufferAttribute(eCol, 3));
    eGeo.setAttribute("aSize", new THREE.BufferAttribute(eSz, 1));
    const eMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: OPV,
      fragmentShader: OPF,
      transparent: true,
      blending: addB,
      depthWrite: false
    });
    sc.add(new THREE.Points(eGeo, eMat));
    this.exhaustPos = ePos;
    this.exhaustCol = eCol;
    this.exhaustGeo = eGeo;
    this.exhaustMat = eMat;
    this.exhaustPhase = ePh;
    this.exhaustRadius = eRd;
    this.rocketT = 0;
  }

  private updateRocket(t: number, p: number, dt: number): void {
    const op = this.sectionOpacity(p, 4);
    this.rocketMat.opacity = op;
    this.exhaustMat.uniforms.uOpacity.value = op * 0.92;
    if (op < 0.01) {
      this.rocketPos[1] = 999;
      this.rocketGeo.attributes.position.needsUpdate = true;
      return;
    }
    this.rocketT += dt / 5.5;
    if (this.rocketT > 1) this.rocketT = 0;
    const ry = -3 + Math.pow(this.rocketT, 1.7) * 24;
    this.rocketPos[0] = 0.25;
    this.rocketPos[1] = ry;
    this.rocketPos[2] = 0.15;
    this.rocketGeo.attributes.position.needsUpdate = true;
    const trailLen = 1.4 + this.rocketT * 2.2;
    const pos = this.exhaustPos;
    const col = this.exhaustCol;
    const EN = this.exhaustCount;
    for (let i = 0; i < EN; i++) {
      const frac = i / EN;
      const dy = -frac * trailLen;
      const ang = this.exhaustPhase[i] + t * 4.8;
      const spread = frac * 0.85 * this.exhaustRadius[i];
      pos[i * 3] = 0.25 + Math.cos(ang) * spread;
      pos[i * 3 + 1] = ry + dy;
      pos[i * 3 + 2] = 0.15 + Math.sin(ang) * spread;
      const heat = 1 - frac * 0.85;
      col[i * 3] = 1.0;
      col[i * 3 + 1] = heat * 0.52;
      col[i * 3 + 2] = heat * 0.08;
    }
    this.exhaustGeo.attributes.position.needsUpdate = true;
  }

  private initBloom(sc: THREE.Scene, cam: THREE.PerspectiveCamera, rend: THREE.WebGLRenderer, W: number, H: number): void {
    try {
      const HW = Math.floor(W * 0.8);
      const HH = Math.floor(H * 0.8);
      const rtO: THREE.RenderTargetOptions = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
      const rtScene = new THREE.WebGLRenderTarget(W, H, rtO);
      const rtLensed = new THREE.WebGLRenderTarget(W, H, rtO);
      const rtBright = new THREE.WebGLRenderTarget(HW, HH, rtO);
      const rtBlurH = new THREE.WebGLRenderTarget(HW, HH, rtO);
      const rtBlurV = new THREE.WebGLRenderTarget(HW, HH, rtO);
      this.cleanupFns.push(() => {
        [rtScene, rtLensed, rtBright, rtBlurH, rtBlurV].forEach((r) => r.dispose());
      });

      const sqGeo = new THREE.PlaneGeometry(2, 2);
      const sqCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const mkSc = (mat: THREE.ShaderMaterial) => {
        const s = new THREE.Scene();
        s.add(new THREE.Mesh(sqGeo, mat));
        return s;
      };

      const lensMat = new THREE.ShaderMaterial({
        uniforms: { tScene: { value: rtScene.texture }, uBHPos: { value: new THREE.Vector2(0.5, 0.5) }, uStrength: { value: 1.0 } },
        vertexShader: SQ_V,
        fragmentShader: LENS_F,
        depthTest: false,
        depthWrite: false
      });
      const threshMat = new THREE.ShaderMaterial({
        uniforms: { tScene: { value: rtLensed.texture }, uThresh: { value: 0.83 } },
        vertexShader: SQ_V,
        fragmentShader: THRESH_F,
        depthTest: false,
        depthWrite: false
      });
      const blurHMat = new THREE.ShaderMaterial({
        uniforms: { tInput: { value: rtBright.texture }, uDir: { value: new THREE.Vector2(1, 0) }, uRes: { value: new THREE.Vector2(HW, HH) } },
        vertexShader: SQ_V,
        fragmentShader: BLUR_F,
        depthTest: false,
        depthWrite: false
      });
      const blurVMat = new THREE.ShaderMaterial({
        uniforms: { tInput: { value: rtBlurH.texture }, uDir: { value: new THREE.Vector2(0, 1) }, uRes: { value: new THREE.Vector2(HW, HH) } },
        vertexShader: SQ_V,
        fragmentShader: BLUR_F,
        depthTest: false,
        depthWrite: false
      });
      const compMat = new THREE.ShaderMaterial({
        uniforms: { tScene: { value: rtLensed.texture }, tBloom: { value: rtBlurV.texture }, uStrength: { value: 0.44 } },
        vertexShader: SQ_V,
        fragmentShader: COMP_F,
        depthTest: false,
        depthWrite: false
      });

      const scLens = mkSc(lensMat);
      const scTh = mkSc(threshMat);
      const scBH = mkSc(blurHMat);
      const scBV = mkSc(blurVMat);
      const scCo = mkSc(compMat);
      this.lensMat = lensMat;

      this.blRender = () => {
        rend.setRenderTarget(rtScene);
        rend.render(sc, cam);
        rend.setRenderTarget(rtLensed);
        rend.render(scLens, sqCam);
        rend.setRenderTarget(rtBright);
        rend.render(scTh, sqCam);
        rend.setRenderTarget(rtBlurH);
        rend.render(scBH, sqCam);
        rend.setRenderTarget(rtBlurV);
        rend.render(scBV, sqCam);
        rend.setRenderTarget(null);
        rend.render(scCo, sqCam);
      };
      this.blSetSize = (w: number, h: number) => {
        const hw = Math.floor(w / 2);
        const hh = Math.floor(h / 2);
        rtScene.setSize(w, h);
        rtLensed.setSize(w, h);
        rtBright.setSize(hw, hh);
        rtBlurH.setSize(hw, hh);
        rtBlurV.setSize(hw, hh);
        (blurHMat.uniforms.uRes.value as THREE.Vector2).set(hw, hh);
        (blurVMat.uniforms.uRes.value as THREE.Vector2).set(hw, hh);
      };
    } catch (e) {
      console.warn("Space Tour bloom/lensing init failed:", e);
      this.blRender = null;
      this.lensMat = null;
    }
  }

  private initScroll(): void {
    const el = this.refs.scrollEl;
    const fn = () => {
      const tot = el.scrollHeight - el.clientHeight;
      if (tot <= 0) return;
      const p = Math.min(1, Math.max(0, el.scrollTop / tot));
      this.progTarget = p;
      if (this.refs.vProgress) this.refs.vProgress.style.height = `${p * 100}%`;
      const si = Math.min(4, Math.floor(p * 5));
      if (si !== this.step) {
        this.step = si;
        this.show(si, false);
      }
    };
    el.addEventListener("scroll", fn, { passive: true });
    this.cleanupFns.push(() => el.removeEventListener("scroll", fn));
    this.refs.dots.forEach((dot, i) => {
      const onClick = () => {
        const tot = el.scrollHeight - el.clientHeight;
        el.scrollTo({ top: (i / 5) * tot, behavior: "smooth" });
      };
      dot.addEventListener("click", onClick);
      this.cleanupFns.push(() => dot.removeEventListener("click", onClick));
    });
  }

  private show(idx: number, first: boolean): void {
    const s = SPACE_TOUR_STEPS[idx];
    if (!s) return;
    const ac = ACCENTS[idx];
    const { kicker, title, body, tags, manifest, link, bgNum, dots } = this.refs;
    if (kicker) {
      kicker.textContent = s.code;
      kicker.style.color = ac;
    }
    if (title) title.textContent = s.title;
    if (body) body.textContent = s.body;
    if (bgNum) bgNum.textContent = String(idx + 1).padStart(2, "0");
    if (tags) {
      tags.innerHTML = s.tags
        .map(
          (tg) =>
            `<span style="font-family:var(--font-m);font-size:10px;letter-spacing:.08em;color:${ac};padding:6px 12px;border-radius:100px;background:${ac}14;white-space:nowrap">${tg}</span>`
        )
        .join("");
    }
    if (manifest) {
      manifest.innerHTML = `<span class="space-tour-manifest-label" style="color:${ac}">On this page</span><ul>${s.manifest
        .map(
          (m) =>
            `<li><span class="space-tour-manifest-index" style="color:${ac}">${m.index}</span><span class="space-tour-manifest-text">${m.label}</span></li>`
        )
        .join("")}</ul>`;
    }
    if (link) {
      link.href = s.href;
      link.textContent = `${s.linkLabel} →`;
      link.style.background = ac;
    }
    dots.forEach((d, i) => {
      const pip = d.querySelector<HTMLElement>(".stp-pip");
      if (pip) {
        pip.style.background = i === idx ? ac : "rgba(100,185,255,.15)";
        pip.style.boxShadow = i === idx ? `0 0 12px ${ac}66` : "none";
      } else {
        d.style.width = i === idx ? "60px" : "24px";
        d.style.background = i === idx ? ac : "rgba(100,185,255,.18)";
      }
      if (i === idx) d.classList.add("active");
      else d.classList.remove("active");
      d.setAttribute("aria-selected", i === idx ? "true" : "false");
    });

    /* HUD counter */
    const hud = this.refs.hud;
    if (hud) {
      gsap.killTweensOf(hud);
      const stat = s.hudStat;
      const counter = { n: 0 };
      gsap.to(counter, {
        n: stat.value,
        duration: 1.4,
        ease: "power2.out",
        delay: first ? 0.6 : 0.3,
        onUpdate: () => {
          hud.innerHTML = `<span class="st-hud-num" style="color:${ac}">${stat.prefix ?? ""}${Math.round(counter.n)}${stat.suffix ?? ""}</span><span class="st-hud-label">${stat.label}</span>`;
        }
      });
    }
    const cp = CAM_POS[idx];
    this.camTarget.x = cp.x;
    this.camTarget.y = cp.y;
    this.camTarget.z = cp.z;

    if (this.refs.onStepChange) this.refs.onStepChange(idx);

    if (this.reducedMotion) {
      [kicker, title, body, tags, manifest, link].forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      return;
    }

    /* Ghost chapter number: flash in bright on chapter change, then fade to near-invisible */
    if (bgNum) {
      gsap.killTweensOf(bgNum);
      if (first) {
        gsap.fromTo(bgNum, { opacity: 0 }, { opacity: 0.024, duration: 1.2, ease: "power2.out" });
      } else {
        gsap.fromTo(bgNum, { opacity: 0.16, scale: 1.05 }, { opacity: 0.024, scale: 1, duration: 0.85, ease: "expo.out" });
      }
    }

    gsap.killTweensOf([kicker, title, body, tags, manifest, link]);
    gsap.fromTo(kicker, { opacity: 0 }, { opacity: 1, duration: 0.22, delay: first ? 0.3 : 0.0, ease: "power2.out" });
    gsap.fromTo(
      title,
      { clipPath: "inset(0 100% 0 0)", opacity: 1, scale: 0.98 },
      { clipPath: "inset(0 0% 0 0)", opacity: 1, scale: 1, duration: first ? 0.68 : 0.5, delay: first ? 0.42 : 0.08, ease: "power3.inOut" }
    );
    gsap.fromTo(
      [body, tags, link],
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: first ? 0.55 : 0.4, stagger: 0.07, delay: first ? 0.58 : 0.2, ease: "power2.out" }
    );
    gsap.fromTo(
      manifest.querySelectorAll("li"),
      { x: 12, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.42, stagger: 0.055, delay: first ? 0.66 : 0.28, ease: "power2.out" }
    );
    gsap.fromTo(manifest, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: first ? 0.6 : 0.24, ease: "power2.out" });
  }
}
