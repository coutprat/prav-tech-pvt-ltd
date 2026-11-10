"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LINES, prismLayout, type Pt } from "@/lib/prism-layout";

/**
 * The home hero: a dispersion prism.
 *
 * One beam of white light — the engineering practice — enters a glass prism
 * and leaves as four, one per business line. Pulses travel along every beam in
 * the direction the light goes, so the figure also reads as data flowing out
 * of one core into four disciplines.
 *
 * Everything is procedural and cheap: one extruded triangle with a fresnel
 * shader, a handful of additive quads for the beams, and a point cloud for
 * dust. No postprocessing, no transmission pass, no textures, no model files.
 * Every per-frame animation runs in the shaders; the CPU only updates a few
 * uniforms and four label positions.
 */

export type PrismSceneProps = {
  active: boolean;
  lite: boolean;
  /** Index into LINES of the hovered label, or -1. */
  hover: RefObject<number>;
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  scroll: RefObject<number>;
  /** Normalised pointer, -1..1 both axes. */
  pointer: RefObject<{ x: number; y: number }>;
  /** The four DOM labels, positioned from the beam ends each frame. */
  labels: RefObject<(HTMLElement | null)[]>;
  onReady: () => void;
};

const FOV = 32;
const CAM_Z = 14;

/* ---------------------------------------------------------------- shaders */

const beamVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uGrow;
  uniform float uIntensity;
  uniform float uLen;
  uniform float uW0;
  uniform float uW1;
  uniform float uSpeed;
  uniform float uSeed;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    float x = vUv.x;
    if (x > uGrow) discard;
    float y = (vUv.y - 0.5) * 2.0;
    float w = mix(uW0, uW1, x);
    float core = exp(-pow(y / (w * 0.16), 2.0));
    float glow = exp(-pow(y / w, 2.0)) * 0.32;

    // Packets travelling with the light, one every ~2.6 world units.
    float ph = fract(x * uLen / 2.6 - uTime * uSpeed + uSeed);
    float packet = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));

    // A bright leading edge while the beam is still drawing on.
    float tip = smoothstep(uGrow - 0.05, uGrow, x) * (1.0 - step(0.999, uGrow));

    float fade = smoothstep(0.0, 0.04, x) * (1.0 - 0.55 * smoothstep(0.86, 1.0, x));
    float a = (core * (1.0 + packet * uPulse * 1.8 + tip * 2.5) + glow) * fade * uIntensity;
    vec3 c = uColor * a;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

const glassVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    vP = position;
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const glassFrag = /* glsl */ `
  uniform float uTime;
  uniform float uS;
  uniform float uLight;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;

  vec3 spectral(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    float f = pow(1.0 - abs(dot(n, normalize(vV))), 2.0);
    vec3 base = vec3(0.045, 0.05, 0.07);
    vec3 iri = spectral(f * 0.7 + vP.y / uS * 0.22 + uTime * 0.025);
    // The light passing through: a soft horizontal band at beam height.
    float band = exp(-pow((vP.y + 0.08 * uS) / (0.42 * uS), 2.0));
    vec3 col = base
      + iri * f * 0.55
      + vec3(1.0) * pow(f, 5.0) * 0.9
      + vec3(0.85, 0.92, 1.0) * band * 0.16 * uLight;
    float a = 0.32 + f * 0.55;
    gl_FragColor = vec4(col, a);
  }
`;

const fanVert = /* glsl */ `
  attribute vec3 color;
  attribute float along;
  varying vec3 vColor;
  varying float vAlong;
  void main() {
    vColor = color;
    vAlong = along;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fanFrag = /* glsl */ `
  uniform float uOpen;
  uniform float uIntensity;
  varying vec3 vColor;
  varying float vAlong;
  void main() {
    if (vAlong > uOpen) discard;
    float a = (1.0 - vAlong) * 0.11 * uIntensity * smoothstep(0.0, 0.08, vAlong);
    vec3 c = vColor * a;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

const glowFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = exp(-d * d * 4.0) * uIntensity;
    vec3 c = uColor * a;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

const dustVert = /* glsl */ `
  uniform float uTime;
  uniform float uPx;
  attribute float seed;
  varying float vA;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.05 + seed * 6.0) * 0.6;
    p.y += cos(uTime * 0.07 + seed * 4.0) * 0.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPx * (1.0 + seed * 1.6) * (14.0 / -mv.z);
    vA = 0.18 + 0.32 * (0.5 + 0.5 * sin(uTime * 0.6 + seed * 30.0));
  }
`;

const dustFrag = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d) * vA;
    vec3 c = vec3(0.8, 0.86, 1.0) * a;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

/* ---------------------------------------------------------------- helpers */

/**
 * Light: colour adds, and alpha adds by the brightness of what was drawn.
 * The canvas is composited premultiplied, so alpha has to be at least the
 * brightest channel or the browser clamps the colour away; AdditiveBlending
 * instead writes alpha 1 under every quad and leaves black rectangles.
 */
const additive = {
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.OneFactor,
  blendDstAlpha: THREE.OneFactor
} as const;

function beamMaterial(color: string, seed: number) {
  return new THREE.ShaderMaterial({
    vertexShader: beamVert,
    fragmentShader: beamFrag,
    ...additive,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uGrow: { value: 0 },
      uIntensity: { value: 1 },
      uLen: { value: 1 },
      uW0: { value: 0.5 },
      uW1: { value: 0.5 },
      uSpeed: { value: 0.55 },
      uSeed: { value: seed },
      uPulse: { value: 1 }
    }
  });
}

function glowMaterial(color: string, intensity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: beamVert,
    fragmentShader: glowFrag,
    ...additive,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity }
    }
  });
}

/** Stretch a unit plane between two points in the z=0 plane. */
function place(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, width: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  mesh.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, 0);
  mesh.rotation.set(0, 0, Math.atan2(dy, dx));
  mesh.scale.set(len, width, 1);
  return len;
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/* ------------------------------------------------------------------ scene */

function Prism({
  lite,
  hover,
  scroll,
  pointer,
  labels,
  onReady
}: Omit<PrismSceneProps, "active">) {
  const { size, camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const prism = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const lastLabel = useRef<string[]>([]);

  const L = useMemo(() => prismLayout(size.width, size.height), [size.width, size.height]);

  /** Pixels to world units on the z=0 plane. */
  const k = useMemo(() => {
    const visH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    return visH / size.height;
  }, [size.height]);

  const toW = useMemo(
    () => (p: Pt) => new THREE.Vector3((p.x - L.w / 2) * k, -(p.y - L.h / 2) * k, 0),
    [L, k]
  );

  const built = useMemo(() => {
    const plane = new THREE.PlaneGeometry(1, 1);
    const S = L.size * k;
    const centre = toW(L.centre);

    // --- glass
    const shape = new THREE.Shape();
    L.tri.forEach((p, i) => {
      const v = toW(p).sub(centre);
      if (i === 0) shape.moveTo(v.x, v.y);
      else shape.lineTo(v.x, v.y);
    });
    shape.closePath();
    const glassGeo = new THREE.ExtrudeGeometry(shape, {
      depth: S * 1.05,
      bevelEnabled: true,
      bevelSize: S * 0.035,
      bevelThickness: S * 0.035,
      bevelSegments: 2,
      steps: 1
    });
    glassGeo.translate(0, 0, -S * 0.525);
    const glassUniforms = {
      uTime: { value: 0 },
      uS: { value: S },
      uLight: { value: 0 }
    };
    const glassBack = new THREE.ShaderMaterial({
      vertexShader: glassVert,
      fragmentShader: glassFrag,
      uniforms: glassUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide
    });
    const glassFront = glassBack.clone();
    glassFront.side = THREE.FrontSide;
    glassFront.uniforms = glassUniforms;
    const edges = new THREE.EdgesGeometry(glassGeo, 25);
    const edgeMat = new THREE.LineBasicMaterial({
      color: "#f5f2ec",
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });

    // --- beams
    const px = k; // one pixel in world units
    const inBeam = new THREE.Mesh(plane, beamMaterial("#f7f4ee", 0.0));
    const inLen = place(inBeam, toW(L.source), toW(L.entry), px * (L.compact ? 30 : 46));
    const inMat = inBeam.material as THREE.ShaderMaterial;
    inMat.uniforms.uLen.value = inLen;
    inMat.uniforms.uW0.value = 0.42;
    inMat.uniforms.uW1.value = 0.42;

    const exitMid = toW(L.exits[0]).add(toW(L.exits[3])).multiplyScalar(0.5);
    const inner = new THREE.Mesh(plane, beamMaterial("#ffffff", 0.3));
    const innerLen = place(inner, toW(L.entry), exitMid, px * 34);
    const innerMat = inner.material as THREE.ShaderMaterial;
    innerMat.uniforms.uLen.value = innerLen;
    innerMat.uniforms.uW0.value = 0.35;
    innerMat.uniforms.uW1.value = 0.6;
    innerMat.uniforms.uPulse.value = 0;

    const fan = LINES.map((line, i) => {
      const m = new THREE.Mesh(plane, beamMaterial(line.color, i * 0.23));
      const len = place(m, toW(L.exits[i]), toW(L.ends[i]), px * (L.compact ? 34 : 56));
      const mat = m.material as THREE.ShaderMaterial;
      mat.uniforms.uLen.value = len;
      mat.uniforms.uW0.value = 0.22;
      mat.uniforms.uW1.value = 0.5;
      return m;
    });

    // --- the spectrum between the beams
    const fanGeo = new THREE.BufferGeometry();
    const pos: number[] = [];
    const col: number[] = [];
    const along: number[] = [];
    const cols = LINES.map((l) => new THREE.Color(l.color));
    for (let i = 0; i < LINES.length - 1; i++) {
      const a0 = toW(L.exits[i]);
      const b0 = toW(L.exits[i + 1]);
      const a1 = toW(L.ends[i]);
      const b1 = toW(L.ends[i + 1]);
      const quad = [
        [a0, cols[i], 0],
        [a1, cols[i], 1],
        [b1, cols[i + 1], 1],
        [a0, cols[i], 0],
        [b1, cols[i + 1], 1],
        [b0, cols[i + 1], 0]
      ] as const;
      for (const [p, c, t] of quad) {
        pos.push(p.x, p.y, -0.01);
        col.push(c.r, c.g, c.b);
        along.push(t);
      }
    }
    fanGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    fanGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    fanGeo.setAttribute("along", new THREE.Float32BufferAttribute(along, 1));
    const fanMat = new THREE.ShaderMaterial({
      vertexShader: fanVert,
      fragmentShader: fanFrag,
      ...additive,
      uniforms: { uOpen: { value: 0 }, uIntensity: { value: 1 } }
    });
    const spectrum = new THREE.Mesh(fanGeo, fanMat);

    // --- end nodes
    const nodes = LINES.map((line, i) => {
      const g = new THREE.Mesh(plane, glowMaterial(line.color, 0));
      const p = toW(L.ends[i]);
      g.position.copy(p);
      const r = px * (L.compact ? 46 : 70);
      g.scale.set(r, r, 1);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(px * 4.5, px * 6, 40),
        new THREE.MeshBasicMaterial({
          color: line.color,
          transparent: true,
          opacity: 0,
          depthWrite: false
        })
      );
      ring.position.copy(p);
      return { glow: g, ring };
    });

    // --- halo behind the glass
    const halo = new THREE.Mesh(plane, glowMaterial("#f2ede4", 0));
    halo.position.copy(centre).setZ(-1.2);
    halo.scale.set(S * 7, S * 7, 1);

    // --- dust
    const count = lite ? 70 : 150;
    const dGeo = new THREE.BufferGeometry();
    const dp = new Float32Array(count * 3);
    const ds = new Float32Array(count);
    const W = L.w * k;
    const H = L.h * k;
    for (let i = 0; i < count; i++) {
      dp[i * 3] = (Math.random() - 0.5) * W * 1.1;
      dp[i * 3 + 1] = (Math.random() - 0.5) * H * 1.1;
      dp[i * 3 + 2] = -4 + Math.random() * 6;
      ds[i] = Math.random();
    }
    dGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    dGeo.setAttribute("seed", new THREE.BufferAttribute(ds, 1));
    const dMat = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      ...additive,
      uniforms: { uTime: { value: 0 }, uPx: { value: lite ? 2.0 : 2.6 } }
    });
    const dust = new THREE.Points(dGeo, dMat);

    return {
      centre,
      glassGeo,
      glassBack,
      glassFront,
      glassUniforms,
      edges,
      edgeMat,
      inBeam,
      inner,
      fan,
      spectrum,
      nodes,
      halo,
      dust,
      ends: L.ends.map(toW)
    };
  }, [L, k, toW, lite]);

  // Free GPU memory when the layout changes or the hero unmounts.
  useEffect(() => {
    return () => {
      built.glassGeo.dispose();
      built.glassBack.dispose();
      built.glassFront.dispose();
      built.edges.dispose();
      built.edgeMat.dispose();
      built.spectrum.geometry.dispose();
      (built.spectrum.material as THREE.Material).dispose();
      built.dust.geometry.dispose();
      (built.dust.material as THREE.Material).dispose();
      [built.inBeam, built.inner, built.halo, ...built.fan].forEach((m) =>
        (m.material as THREE.Material).dispose()
      );
      built.nodes.forEach(({ glow, ring }) => {
        (glow.material as THREE.Material).dispose();
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
    };
  }, [built]);

  const readied = useRef(false);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (start.current === null) start.current = now;
    const t = now - start.current;

    if (!readied.current) {
      readied.current = true;
      onReady();
    }

    // Intro: the white beam draws in, the glass lights, the fan opens.
    const gIn = ease(t / 0.9);
    const gInner = ease((t - 0.85) / 0.25);
    const light = ease((t - 0.85) / 0.6);
    const hv = hover.current ?? -1;
    const sc = scroll.current ?? 0;

    const inMat = built.inBeam.material as THREE.ShaderMaterial;
    inMat.uniforms.uTime.value = now;
    inMat.uniforms.uGrow.value = gIn;
    const innerMat = built.inner.material as THREE.ShaderMaterial;
    innerMat.uniforms.uTime.value = now;
    innerMat.uniforms.uGrow.value = gInner;
    innerMat.uniforms.uIntensity.value = 0.9;

    built.glassUniforms.uTime.value = now;
    built.glassUniforms.uLight.value = light;
    (built.halo.material as THREE.ShaderMaterial).uniforms.uIntensity.value = 0.12 * light;

    built.fan.forEach((m, i) => {
      const mat = m.material as THREE.ShaderMaterial;
      const g = ease((t - 1.05 - i * 0.07) / 0.95);
      mat.uniforms.uTime.value = now;
      mat.uniforms.uGrow.value = g;
      const target = hv < 0 ? 1 : hv === i ? 1.55 : 0.4;
      mat.uniforms.uIntensity.value += (target - mat.uniforms.uIntensity.value) * 0.12;

      const node = built.nodes[i];
      const arrived = ease((t - 1.75 - i * 0.07) / 0.4);
      const breathe = 0.85 + 0.15 * Math.sin(now * 1.6 + i);
      const gm = node.glow.material as THREE.ShaderMaterial;
      gm.uniforms.uIntensity.value =
        arrived * breathe * (hv === i ? 0.9 : hv < 0 ? 0.42 : 0.18);
      (node.ring.material as THREE.MeshBasicMaterial).opacity =
        arrived * (hv < 0 || hv === i ? 0.95 : 0.35);
    });

    const fm = built.spectrum.material as THREE.ShaderMaterial;
    fm.uniforms.uOpen.value = ease((t - 1.05) / 1.0);
    fm.uniforms.uIntensity.value = hv < 0 ? 1 : 0.5;

    (built.dust.material as THREE.ShaderMaterial).uniforms.uTime.value = now;

    // The glass turns slowly so it reads as a solid, not a drawing.
    if (prism.current) {
      prism.current.rotation.x = 0.34 + sc * 0.5;
      prism.current.rotation.y = Math.sin(now * 0.22) * 0.32 + sc * 0.9;
      prism.current.rotation.z = Math.sin(now * 0.17) * 0.025;
    }

    // Pointer parallax tilts the whole figure; scrolling lifts it away.
    const p = pointer.current ?? { x: 0, y: 0 };
    if (group.current) {
      const g = group.current;
      g.rotation.y += (p.x * 0.07 - g.rotation.y) * 0.05;
      g.rotation.x += (-p.y * 0.045 - g.rotation.x) * 0.05;
      g.position.y = sc * L.h * k * 0.18;
    }
    camera.position.z = CAM_Z - sc * 1.6;

    // Labels follow the beam ends, in CSS pixels.
    const els = labels.current;
    if (els && group.current) {
      group.current.updateMatrixWorld();
      for (let i = 0; i < built.ends.length; i++) {
        const el = els[i];
        if (!el) continue;
        tmp.copy(built.ends[i]).applyMatrix4(group.current.matrixWorld).project(camera);
        const x = ((tmp.x + 1) / 2) * size.width;
        const y = ((1 - tmp.y) / 2) * size.height;
        const v = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        if (lastLabel.current[i] !== v) {
          el.style.transform = v;
          lastLabel.current[i] = v;
        }
      }
    }
  });

  return (
    <group ref={group}>
      <primitive object={built.dust} />
      <primitive object={built.halo} />
      <primitive object={built.spectrum} />
      <primitive object={built.inBeam} />
      {built.fan.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
      {built.nodes.map((n, i) => (
        <group key={i}>
          <primitive object={n.glow} />
          <primitive object={n.ring} />
        </group>
      ))}
      <group ref={prism} position={built.centre}>
        <mesh geometry={built.glassGeo} material={built.glassBack} renderOrder={1} />
        <mesh geometry={built.glassGeo} material={built.glassFront} renderOrder={2} />
        <lineSegments geometry={built.edges} material={built.edgeMat} renderOrder={3} />
      </group>
      <primitive object={built.inner} renderOrder={4} />
    </group>
  );
}

export default function PrismScene(props: PrismSceneProps) {
  const { active, lite, ...rest } = props;
  return (
    <Canvas
      className="ph-canvas"
      frameloop={active ? "always" : "never"}
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      gl={{
        antialias: !lite,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false
      }}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 60 }}
      aria-hidden="true"
    >
      <Prism lite={lite} {...rest} />
    </Canvas>
  );
}
