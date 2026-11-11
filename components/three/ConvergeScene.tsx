"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The closing figure: the hero prism run backwards.
 *
 * On the home hero one white beam enters the glass and leaves as four, one per
 * business line. Here the four coloured beams come back in from the edges of
 * the band, meet in a cut-glass gem, and leave as a single column of white
 * light that rises behind the call to action — four disciplines, one answer.
 *
 * Same budget as the hero: procedural geometry, additive quads, one point
 * cloud. No postprocessing, no textures, no model files. Animation runs in the
 * shaders; the CPU only writes a few uniforms.
 */

export type ConvergeSceneProps = {
  active: boolean;
  lite: boolean;
  onReady: () => void;
};

/** Enterprise, Pharma, Healthcare, Photonics — the hero's four beams. */
const COLOURS = ["#9b7bff", "#22c98f", "#45bdf5", "#f5a524"];

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
  uniform float uSeed;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    float x = vUv.x;
    if (x > uGrow) discard;
    float y = (vUv.y - 0.5) * 2.0;
    // Beams narrow as they reach the glass.
    float w = mix(1.0, 0.42, x);
    float core = exp(-pow(y / (w * 0.15), 2.0));
    float glow = exp(-pow(y / w, 2.0)) * 0.3;

    // Packets travelling with the light, toward the gem.
    float ph = fract(x * uLen / 2.8 - uTime * 0.42 + uSeed);
    float packet = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.15, ph));

    float fade = smoothstep(0.0, 0.22, x) * (1.0 - 0.35 * smoothstep(0.9, 1.0, x));
    float a = (core * (1.0 + packet * uPulse * 1.9) + glow) * fade * uIntensity;
    vec3 c = uColor * a;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

const gemVert = /* glsl */ `
  varying vec3 vView;
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const gemFrag = /* glsl */ `
  uniform float uTime;
  uniform float uLight;
  varying vec3 vView;
  varying vec3 vLocal;

  vec3 spectral(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    // Flat facets from screen-space derivatives: a cut stone, not a ball.
    vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
    vec3 v = normalize(-vView);
    float ndv = abs(dot(n, v));
    float f = pow(1.0 - ndv, 2.0);

    vec3 base = vec3(0.05, 0.052, 0.07);
    vec3 iri = spectral(f * 0.8 + vLocal.y * 0.35 + n.x * 0.4 + uTime * 0.03);
    // Each facet catches the light at a different moment as the gem turns.
    float glint = pow(max(dot(n, normalize(vec3(0.35, 0.6, 0.72))), 0.0), 18.0);

    vec3 col = base
      + iri * (0.06 + f * 0.5) * uLight
      + vec3(1.0, 0.97, 0.9) * glint * 1.1 * uLight
      + vec3(1.0) * pow(f, 4.0) * 0.55;
    float alpha = 0.5 + f * 0.5 + glint * 0.4;
    gl_FragColor = vec4(col, min(1.0, alpha));
  }
`;

const dustVert = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uSpan;
  varying float vA;
  void main() {
    vec3 p = position;
    // Dust is drawn up the column of white light.
    p.y = mod(p.y + uTime * (0.12 + aSeed * 0.2), uSpan) - uSpan * 0.5;
    p.x += sin(uTime * 0.4 + aSeed * 40.0) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.5 + aSeed) * (10.0 / -mv.z);
    vA = (0.25 + 0.75 * aSeed) * smoothstep(0.0, 0.2, 1.0 - abs(p.y) / (uSpan * 0.5));
    gl_Position = projectionMatrix * mv;
  }
`;

const dustFrag = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA * 0.5;
    gl_FragColor = vec4(vec3(1.0, 0.95, 0.85) * a, a);
  }
`;

function makeBeam(colour: string, seed: number) {
  return new THREE.ShaderMaterial({
    vertexShader: beamVert,
    fragmentShader: beamFrag,
    uniforms: {
      uColor: { value: new THREE.Color(colour) },
      uTime: { value: 0 },
      uGrow: { value: 0 },
      uIntensity: { value: 1 },
      uLen: { value: 10 },
      uSeed: { value: seed },
      uPulse: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

/** Lay a unit plane from a to b: x runs along the beam, y is its width. */
function place(mesh: THREE.Mesh, ax: number, ay: number, bx: number, by: number, width: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  mesh.position.set(ax + dx / 2, ay + dy / 2, 0);
  mesh.rotation.z = Math.atan2(dy, dx);
  mesh.scale.set(len, width, 1);
  (mesh.material as THREE.ShaderMaterial).uniforms.uLen.value = len;
}

function Figure({ active, lite, onReady }: ConvergeSceneProps) {
  const { viewport, invalidate } = useThree();
  const gem = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const beams = useRef<(THREE.Mesh | null)[]>([]);
  const column = useRef<THREE.Mesh>(null);
  const start = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const announced = useRef(false);

  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const beamMats = useMemo(() => COLOURS.map((c, i) => makeBeam(c, i * 0.27)), []);
  const columnMat = useMemo(() => {
    const m = makeBeam("#fff6e2", 0.5);
    m.uniforms.uPulse.value = 0.5;
    return m;
  }, []);
  const gemMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: gemVert,
        fragmentShader: gemFrag,
        uniforms: { uTime: { value: 0 }, uLight: { value: 0 } },
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: beamVert,
        fragmentShader: /* glsl */ `
          uniform float uLight;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float a = exp(-d * d * 5.0) * 0.5 * uLight;
            gl_FragColor = vec4(vec3(1.0, 0.95, 0.86) * a, a);
          }
        `,
        uniforms: { uLight: { value: 0 } },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const dust = useMemo(() => {
    const n = lite ? 60 : 150;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // Deterministic scatter; denser near the column.
      const r = Math.sin(i * 12.9898) * 43758.5453;
      const r2 = Math.sin(i * 78.233) * 12543.123;
      const u = r - Math.floor(r);
      const v = r2 - Math.floor(r2);
      pos[i * 3] = (u - 0.5) * (u - 0.5) * Math.sign(u - 0.5) * 22;
      pos[i * 3 + 1] = (v - 0.5) * 12;
      pos[i * 3 + 2] = -1 - u * 2;
      seed[i] = v;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      uniforms: { uTime: { value: 0 }, uSize: { value: lite ? 5 : 7 }, uSpan: { value: 12 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { g, m };
  }, [lite]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // The canvas mounts paused (the band is still below the fold). Kick the
  // loop when it scrolls into view, or the first frame never gets drawn.
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  useEffect(
    () => () => {
      plane.dispose();
      beamMats.forEach((m) => m.dispose());
      columnMat.dispose();
      gemMat.dispose();
      haloMat.dispose();
      dust.g.dispose();
      dust.m.dispose();
    },
    [plane, beamMats, columnMat, gemMat, haloMat, dust]
  );

  // Re-lay the figure whenever the band changes shape.
  const W = viewport.width;
  const H = viewport.height;
  const narrow = W < H * 1.15;
  // The gem lives in the strip below the buttons, so it never sits on the copy.
  const size = Math.min(0.8, Math.max(0.42, H * 0.082));
  const gy = -H / 2 + H * 0.145;

  useEffect(() => {
    const edge = W / 2 + 1;
    // Two beams from each side, at two heights, all ending on the gem.
    const rise = narrow ? [H * 0.24, H * 0.1] : [H * 0.2, H * 0.05];
    const from = [
      [-edge, gy + rise[0]],
      [-edge, gy + rise[1]],
      [edge, gy + rise[1]],
      [edge, gy + rise[0]],
    ];
    from.forEach(([x, y], i) => {
      const m = beams.current[i];
      if (m) place(m, x, y, Math.sign(x) * size * 0.3, gy, narrow ? 0.26 : 0.34);
    });
    if (column.current) place(column.current, 0, gy + size * 0.4, 0, H / 2 + 0.5, narrow ? 1.3 : 1.9);
    if (gem.current) gem.current.position.set(0, gy, 0);
    if (halo.current) {
      halo.current.position.set(0, gy, -0.2);
      halo.current.scale.setScalar(size * 6.5);
    }
    dust.m.uniforms.uSpan.value = H + 2;
    invalidate();
  }, [W, H, gy, size, narrow, dust, invalidate]);

  useFrame((state, delta) => {
    if (!announced.current) {
      announced.current = true;
      onReady();
    }
    if (!active) return;
    const now = state.clock.elapsedTime;
    if (start.current === null) start.current = now;
    const t = now - start.current;

    // Intro: the four beams draw in, the gem lights, the white column rises.
    beamMats.forEach((m, i) => {
      m.uniforms.uTime.value = now;
      m.uniforms.uGrow.value = THREE.MathUtils.smoothstep(t, 0.15 + i * 0.14, 1.5 + i * 0.14);
    });
    const lit = THREE.MathUtils.smoothstep(t, 1.3, 2.4);
    gemMat.uniforms.uTime.value = now;
    gemMat.uniforms.uLight.value = 0.25 + lit * 0.75;
    haloMat.uniforms.uLight.value = lit * (0.85 + Math.sin(now * 1.3) * 0.15);
    columnMat.uniforms.uTime.value = now;
    columnMat.uniforms.uGrow.value = THREE.MathUtils.smoothstep(t, 1.9, 3.4);
    columnMat.uniforms.uIntensity.value = 0.2;
    dust.m.uniforms.uTime.value = now;

    if (gem.current) {
      gem.current.rotation.y += delta * 0.32;
      gem.current.rotation.x = THREE.MathUtils.lerp(
        gem.current.rotation.x,
        0.28 + pointer.current.y * 0.25,
        Math.min(1, delta * 3)
      );
      gem.current.rotation.z = THREE.MathUtils.lerp(
        gem.current.rotation.z,
        -pointer.current.x * 0.3,
        Math.min(1, delta * 3)
      );
    }
  });

  return (
    <>
      <points geometry={dust.g} material={dust.m} frustumCulled={false} />
      <mesh ref={column} geometry={plane} material={columnMat} renderOrder={1} />
      {beamMats.map((m, i) => (
        <mesh
          key={COLOURS[i]}
          ref={(el) => {
            beams.current[i] = el;
          }}
          geometry={plane}
          material={m}
          renderOrder={2}
        />
      ))}
      <mesh ref={halo} geometry={plane} material={haloMat} renderOrder={3} />
      <mesh ref={gem} material={gemMat} scale={[size, size * 1.28, size]} renderOrder={4}>
        <octahedronGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}

export default function ConvergeScene(props: ConvergeSceneProps) {
  return (
    <Canvas
      className="pv-cta-canvas"
      dpr={[1, props.lite ? 1.5 : 2]}
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={props.active ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      <Figure {...props} />
    </Canvas>
  );
}
