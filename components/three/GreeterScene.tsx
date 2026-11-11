"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * The greeter: an android bust in obsidian ceramic, brushed titanium and
 * champagne gold.
 *
 * It is meant to feel present rather than animated, so the motion follows how
 * a person actually looks at someone:
 *   - the eyes move first and the head follows a beat later;
 *   - the gaze makes small, irregular jumps instead of gliding;
 *   - the irises tighten and relax, and it blinks on an uneven rhythm,
 *     sometimes twice;
 *   - the chest rises and falls, and the head is never perfectly still;
 *   - when it first sees you it tilts its head, then nods.
 *
 * Everything is procedural: no model file, no textures, no HDR download. The
 * head is a sphere reshaped in code into a tapered helmet, so the visor, jaw
 * plate and seams all follow one silhouette. Reflections come from a small
 * studio of light panels rendered once into an environment map. The four
 * lights on the collar are the four beams of the hero prism, and the triangle
 * on the chest is the prism itself.
 */

export type GreeterSceneProps = {
  onReady: () => void;
  /** Draw frames only while true (on screen, tab visible). Defaults to true. */
  active?: boolean;
};

const BEAMS = ["#9b7bff", "#22c98f", "#45bdf5", "#f5a524"];
const GOLD = "#d9c08e";
const EYE = "#fff1d0";

/** Head proportions, shared by every part that sits on the head. */
const HX = 0.86;
const HY = 1.08;
const HZ = 0.93;
/** Narrowing toward the chin (y < 0) and very slightly toward the crown. */
const taperAt = (y: number) => (y < 0 ? 1 - 0.24 * Math.pow(-y, 1.5) : 1 - 0.05 * y * y);

/** Reshape a unit-sphere geometry (or a segment of one) into the helmet. */
function helmet(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const r = Math.hypot(x, y, z) || 1;
    const d = taperAt(y / r);
    p.setXYZ(i, x * HX * d, y * HY, z * HZ * d);
  }
  p.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** Deterministic pseudo-random in 0..1, so timing is irregular but stable. */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

function Android({ onReady }: GreeterSceneProps) {
  const body = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const gaze = useRef<THREE.Group>(null);
  const lids = useRef<(THREE.Group | null)[]>([]);
  const irises = useRef<(THREE.Mesh | null)[]>([]);
  const collar = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const emblem = useRef<THREE.MeshStandardMaterial>(null);

  const pointer = useRef({ x: 0, y: 0, at: -10 });
  const yaw = useRef(0);
  const pitch = useRef(0);
  const announced = useRef(false);

  const mats = useMemo(
    () => ({
      obsidian: new THREE.MeshPhysicalMaterial({
        color: "#101014",
        metalness: 0.5,
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        envMapIntensity: 1.5,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#020203",
        metalness: 0.9,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2,
      }),
      titanium: new THREE.MeshStandardMaterial({
        color: "#4a4844",
        metalness: 0.95,
        roughness: 0.36,
        envMapIntensity: 1.3,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.22,
        envMapIntensity: 1.5,
      }),
      graphite: new THREE.MeshStandardMaterial({
        color: "#1c1c20",
        metalness: 0.85,
        roughness: 0.4,
      }),
      lens: new THREE.MeshPhysicalMaterial({
        color: "#050608",
        metalness: 0.6,
        roughness: 0.08,
        clearcoat: 1,
        envMapIntensity: 1.6,
      }),
    }),
    []
  );

  const geos = useMemo(() => {
    const lathe = (pts: number[][]) =>
      new THREE.LatheGeometry(
        pts.map(([r, y]) => new THREE.Vector2(r, y)),
        80
      );
    return {
      skull: helmet(new THREE.SphereGeometry(1, 96, 72)),
      // A band of black glass across the face.
      visor: helmet(new THREE.SphereGeometry(1.014, 96, 28, 0.44, 2.26, 1.1, 0.62)),
      // The jaw plate: machined titanium under the visor.
      jaw: helmet(new THREE.SphereGeometry(1.02, 72, 24, 0.72, 1.7, 1.86, 0.74)),
      // Shoulders: a lathe profile, flattened front to back.
      bust: lathe([
        [0.0, -0.4],
        [0.4, -0.4],
        [0.5, -0.46],
        [0.72, -0.6],
        [1.2, -0.82],
        [1.52, -1.12],
        [1.64, -1.6],
        [1.6, -2.3],
        [1.48, -3.0],
      ]),
      // A raised yoke over the collarbones, so the bust is not one plain shape.
      yoke: lathe([
        [0.5, -0.44],
        [0.74, -0.575],
        [1.0, -0.69],
        [1.12, -0.77],
        [1.08, -0.8],
        [0.5, -0.5],
      ]),
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current.at = performance.now() / 1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(geos).forEach((g) => g.dispose());
    },
    [mats, geos]
  );

  useFrame((state, delta) => {
    if (!announced.current) {
      announced.current = true;
      onReady();
    }
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // --- where it wants to look ------------------------------------------
    // The pointer if it moved recently; otherwise it looks around on its own.
    const idle = performance.now() / 1000 - pointer.current.at > 2.5;
    let tx = idle ? Math.sin(t * 0.45) * 0.45 + Math.sin(t * 0.17) * 0.2 : pointer.current.x;
    let ty = idle ? Math.sin(t * 0.33 + 1.2) * 0.25 : pointer.current.y;

    // Small irregular gaze jumps: a new offset roughly every second.
    const slot = Math.floor(t / 1.1);
    tx += (hash(slot) - 0.5) * 0.16;
    ty += (hash(slot + 50) - 0.5) * 0.1;

    // --- the head follows, slower than the eyes --------------------------
    const headK = 1 - Math.exp(-dt * 3.2);
    yaw.current += (tx * 0.5 - yaw.current) * headK;
    pitch.current += (ty * 0.24 - pitch.current) * headK;

    // First contact: a curious tilt, then one nod.
    const tilt = Math.sin(Math.min(1, Math.max(0, (t - 0.25) / 1.1)) * Math.PI) * 0.15;
    const nod = Math.sin(Math.min(1, Math.max(0, (t - 1.25) / 0.7)) * Math.PI) * 0.18;

    if (head.current) {
      head.current.rotation.y = yaw.current + Math.sin(t * 0.7) * 0.012;
      head.current.rotation.x = pitch.current + nod + Math.sin(t * 0.9 + 0.4) * 0.01;
      head.current.rotation.z = -yaw.current * 0.12 + tilt + Math.sin(t * 0.5) * 0.008;
      head.current.position.y = 0.7 + Math.sin(t * 1.15) * 0.012;
    }

    // --- the eyes lead ----------------------------------------------------
    if (gaze.current) {
      const eyeK = 1 - Math.exp(-dt * 16);
      const gx = THREE.MathUtils.clamp((tx * 0.5 - yaw.current) * 0.9, -0.16, 0.16);
      const gy = THREE.MathUtils.clamp((ty * 0.24 - pitch.current) * 0.9, -0.08, 0.08);
      gaze.current.rotation.y += (gx - gaze.current.rotation.y) * eyeK;
      gaze.current.rotation.x += (gy - gaze.current.rotation.x) * eyeK;
    }

    // --- blinking: uneven rhythm, sometimes a double ---------------------
    const period = 3.4;
    const cycle = Math.floor(t / period);
    const local = t - cycle * period - hash(cycle + 9) * 1.6;
    const blinkAt = (x: number) => (x > 0 && x < 0.15 ? Math.sin((x / 0.15) * Math.PI) : 0);
    const double = hash(cycle + 31) > 0.62 ? blinkAt(local - 0.3) : 0;
    const closed = Math.max(blinkAt(local), double);
    // A slight squint while nodding reads as a smile.
    const open = (1 - closed * 0.95) * (1 - nod * 1.3);
    lids.current.forEach((g) => {
      if (g) g.scale.y = Math.max(0.05, open);
    });
    // Irises open as it wakes, then tighten and relax like a lens focusing.
    const wake = THREE.MathUtils.smoothstep(t, 0.05, 0.7);
    const focus = 1 + Math.sin(t * 0.8) * 0.05 + (hash(slot + 7) - 0.5) * 0.08;
    irises.current.forEach((m) => {
      if (m) m.scale.setScalar(Math.max(0.01, wake * focus));
    });

    // --- breathing --------------------------------------------------------
    const breath = Math.sin(t * 1.15);
    if (chest.current) {
      chest.current.scale.set(1 + breath * 0.008, 1 + breath * 0.012, 1 + breath * 0.02);
      chest.current.position.y = breath * 0.012;
    }
    if (body.current) body.current.rotation.y = yaw.current * 0.22;

    // The collar lights come on one after another, then idle like a pulse.
    collar.current.forEach((m, i) => {
      if (!m) return;
      const on = THREE.MathUtils.smoothstep(t, 0.35 + i * 0.16, 0.75 + i * 0.16);
      m.emissiveIntensity = on * (1.5 + Math.sin(t * 2.2 - i * 0.9) * 0.6);
    });
    if (emblem.current) emblem.current.emissiveIntensity = 0.9 + breath * 0.5;
  });

  /** A gold line around the head at polar angle theta, over `arc` radians. */
  const seam = (theta: number, arc: number, key: string, r = 1.018) => {
    const y0 = Math.cos(theta);
    const d = taperAt(y0);
    return (
      <group key={key} position={[0, y0 * HY * r, 0]} rotation={[0, -(Math.PI / 2 - arc / 2), 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[HX * d, HZ * d, 1]} material={mats.gold}>
          <torusGeometry args={[Math.sin(theta) * r, 0.0075, 8, 120, arc]} />
        </mesh>
      </group>
    );
  };

  // Eye placement: angle from straight ahead, on the visor surface.
  const eyeAngle = 0.34;
  const eyeY0 = 0.13;
  const eyeRad = Math.sqrt(1 - eyeY0 * eyeY0) * 1.03;

  return (
    <group ref={body} position={[0, -0.2, 0]}>
      {/* ------------------------------------------------------- shoulders */}
      <group ref={chest}>
        <mesh geometry={geos.bust} material={mats.obsidian} scale={[1, 1, 0.6]} />
        <mesh geometry={geos.yoke} material={mats.titanium} scale={[1.012, 1, 0.612]} />
        {/* gold seam where the bust meets the neck */}
        <mesh position={[0, -0.41, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.6, 1]} material={mats.gold}>
          <torusGeometry args={[0.43, 0.012, 12, 96]} />
        </mesh>
        {/* gold line along the edge of the yoke */}
        <mesh position={[0, -0.785, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.012, 0.612, 1]} material={mats.gold}>
          <torusGeometry args={[1.11, 0.008, 8, 160]} />
        </mesh>
        {/* the prism, worn on the chest */}
        <mesh position={[0, -1.36, 0.972]} rotation={[-0.1, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.011, 8, 3]} />
          <meshStandardMaterial
            ref={emblem}
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={1}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ------------------------------------------------------------ neck */}
      <mesh position={[0, -0.14, 0]} material={mats.graphite}>
        <cylinderGeometry args={[0.28, 0.36, 0.6, 48]} />
      </mesh>
      {[-0.3, -0.16, -0.02].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.titanium}>
          <torusGeometry args={[0.345 - (y + 0.3) * 0.14, 0.04, 16, 64]} />
        </mesh>
      ))}
      {/* collar: four lights, one per line of work */}
      {BEAMS.map((c, i) => (
        <group key={c} position={[0, -0.385, 0]} rotation={[0, -(Math.PI / 2 - 1.04) - i * 0.56, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.6, 1]}>
            <torusGeometry args={[0.47, 0.014, 8, 24, 0.4]} />
            <meshStandardMaterial
              ref={(m) => {
                collar.current[i] = m;
              }}
              color={c}
              emissive={c}
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* ------------------------------------------------------------ head */}
      <group ref={head} position={[0, 0.7, 0]}>
        <mesh geometry={geos.skull} material={mats.obsidian} />
        <mesh geometry={geos.visor} material={mats.glass} />
        <mesh geometry={geos.jaw} material={mats.titanium} />
        {seam(1.1, 2.26, "visor-top")}
        {seam(1.72, 2.26, "visor-bottom")}
        {seam(0.46, Math.PI * 2, "crown", 1.006)}
        {/* a short vertical seam down the chin */}
        <mesh position={[0, -0.86, HZ * taperAt(-0.8) * 0.62 + 0.005]} rotation={[0.72, 0, 0]} material={mats.gold}>
          <boxGeometry args={[0.012, 0.3, 0.012]} />
        </mesh>

        {/* eyes: camera irises behind the glass, moved by the gaze */}
        <group ref={gaze}>
          {[-1, 1].map((side, i) => (
            <group
              key={side}
              position={[
                Math.sin(eyeAngle * side) * eyeRad * HX,
                eyeY0 * HY,
                Math.cos(eyeAngle * side) * eyeRad * HZ,
              ]}
              rotation={[0, eyeAngle * side * 1.05, 0]}
            >
              <group
                ref={(g) => {
                  lids.current[i] = g;
                }}
              >
                {/* the lens housing */}
                <mesh material={mats.lens}>
                  <circleGeometry args={[0.15, 48]} />
                </mesh>
                <mesh position={[0, 0, 0.001]} material={mats.gold}>
                  <ringGeometry args={[0.146, 0.156, 64]} />
                </mesh>
                {/* the iris: a ring of warm light around a bright pupil */}
                <mesh
                  ref={(m) => {
                    irises.current[i] = m;
                  }}
                  position={[0, 0, 0.002]}
                >
                  <ringGeometry args={[0.062, 0.108, 64]} />
                  <meshBasicMaterial color={EYE} toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, 0.003]}>
                  <circleGeometry args={[0.03, 32]} />
                  <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>
                {/* a catch-light, which is most of what makes an eye look wet */}
                <mesh position={[-0.05, 0.06, 0.004]}>
                  <circleGeometry args={[0.014, 16]} />
                  <meshBasicMaterial color="#ffffff" transparent opacity={0.85} toneMapped={false} />
                </mesh>
                {/* soft spill of light onto the glass */}
                <mesh position={[0, 0, -0.001]}>
                  <circleGeometry args={[0.26, 40]} />
                  <meshBasicMaterial
                    color={GOLD}
                    transparent
                    opacity={0.07}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            </group>
          ))}
        </group>

        {/* ears: a turned disc, a gold ring, a small light */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * HX * 0.985, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh material={mats.titanium}>
              <cylinderGeometry args={[0.2, 0.23, 0.1, 48]} />
            </mesh>
            <mesh position={[0, -side * 0.052, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.gold}>
              <torusGeometry args={[0.15, 0.008, 8, 64]} />
            </mesh>
            <mesh position={[0, -side * 0.054, 0]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color={EYE} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** A small studio: light panels rendered once into the reflections. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#0a0a0b"]} />
      {/* key, high and to the left, warm */}
      <Lightformer form="rect" intensity={6} color="#fff1dc" position={[-4, 4, 4]} scale={[5, 5, 1]} />
      {/* long champagne strip, for the line that travels over the skull */}
      <Lightformer form="rect" intensity={8} color="#e8d5ab" position={[0, 6, -1]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 1.2, 1]} />
      {/* cool rim from the right */}
      <Lightformer form="rect" intensity={5} color="#9fc8ff" position={[6, 1, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
      {/* warm rim from the left, so both shoulders have an edge */}
      <Lightformer form="rect" intensity={4} color="#f0d9a8" position={[-6, 0, -2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
      {/* violet kick from low left, one of the four beams */}
      <Lightformer form="circle" intensity={2.5} color="#9b7bff" position={[-5, -3, 2]} scale={3} />
      {/* soft fill in front so the visor is never a black hole */}
      <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, -1, 7]} scale={[9, 5, 1]} />
    </Environment>
  );
}

export default function GreeterScene({ onReady, active = true }: GreeterSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0.1, 7.6], fov: 30, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 4, 5]} intensity={2.2} color="#fff1dc" />
      {/* rim lights behind each shoulder */}
      <directionalLight position={[5, 2, -4]} intensity={3.2} color="#9fc8ff" />
      <directionalLight position={[-5, 1.5, -4]} intensity={2.6} color="#f0d9a8" />
      <pointLight position={[0, -1.2, 3.5]} intensity={10} color="#e8d5ab" distance={9} />
      <Studio />
      <Android onReady={onReady} />
    </Canvas>
  );
}
