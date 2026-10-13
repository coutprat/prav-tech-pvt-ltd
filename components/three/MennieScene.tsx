"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";

const SKY = "#38BDF8";

/** Plate aspect: the supplied still is 1086x1448. */
const PLANE_W = 3;
const PLANE_H = PLANE_W * (1448 / 1086);

/**
 * The still, displaced by its depth map, so the camera dolly produces real
 * parallax between the figure and the atrium behind her rather than a flat
 * pan across a photograph.
 *
 * Displacement is deliberately shallow (0.34 units over a 4-unit plane). Push
 * it further and the triangles spanning her silhouette stretch into visible
 * spikes — the depth map's edge is softened in depth.py for the same reason.
 */
function Plate({ pointer }: { pointer: React.RefObject<THREE.Vector2> }) {
  const [colour, depth, spine] = useLoader(THREE.TextureLoader, [
    "/media/mennie/still.webp",
    "/media/mennie/depth.png",
    "/media/mennie/spine-mask.png"
  ]);

  const group = useRef<THREE.Group>(null);
  const spineMat = useRef<THREE.MeshStandardMaterial>(null);

  useMemo(() => {
    [colour, depth, spine].forEach((t) => {
      t.colorSpace = t === colour ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
  }, [colour, depth, spine]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // Mouse parallax, damped so it glides rather than snaps.
    const tx = pointer.current.x * 0.16;
    const ty = pointer.current.y * 0.1;
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -tx * 0.12, 3, delta);

    // One slow pulse down the spine seams.
    if (spineMat.current) {
      const t = state.clock.elapsedTime;
      spineMat.current.emissiveIntensity = 1.1 + 1.9 * (0.5 + 0.5 * Math.sin(t * 1.1));
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[PLANE_W, PLANE_H, 220, 280]} />
        <meshStandardMaterial
          map={colour}
          displacementMap={depth}
          displacementScale={0.34}
          displacementBias={-0.17}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* emissive seam overlay, same displacement so it sits on her back */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[PLANE_W, PLANE_H, 220, 280]} />
        {/* MeshBasicMaterial cannot displace, so the seam overlay is a
            standard material lit purely by its own emissive. */}
        <meshStandardMaterial
          ref={spineMat}
          alphaMap={spine}
          emissiveMap={spine}
          emissive={SKY}
          emissiveIntensity={2}
          color="#000000"
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          displacementMap={depth}
          displacementScale={0.34}
          displacementBias={-0.17}
        />
      </mesh>
    </group>
  );
}

/**
 * Volumetric shafts from the atrium roof.
 *
 * A single additive quad with a cheap procedural shader — far lighter than
 * real volumetrics, and at this scale indistinguishable.
 */
function LightRays() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(SKY) } }),
    []
  );

  return (
    <mesh position={[0, 0.5, 0.9]}>
      <planeGeometry args={[PLANE_W * 1.4, PLANE_H * 1.1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;

          void main() {
            // shafts leaning in from the top, drifting very slowly
            float x = vUv.x * 7.0 - vUv.y * 2.2 + uTime * 0.045;
            float shaft = pow(abs(sin(x)), 14.0);
            shaft += pow(abs(sin(x * 0.47 + 1.7)), 22.0) * 0.7;

            // fade out toward the floor and the edges
            float down = smoothstep(0.0, 0.85, 1.0 - vUv.y);
            float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);

            float a = shaft * down * edge * 0.16;
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </mesh>
  );
}

/** Dust at several depths, so the parallax has something to read against. */
function Motes({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  // Seeded, so the layout is identical every render and on every machine —
  // Math.random() during render is impure and would reshuffle the dust.
  const { positions, speeds } = useMemo(() => {
    let seed = 0x9e3779b9;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * PLANE_W * 1.5;
      positions[i * 3 + 1] = (rand() - 0.5) * PLANE_H;
      positions[i * 3 + 2] = rand() * 1.6 - 0.2;
      speeds[i] = 0.01 + rand() * 0.03;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > PLANE_H / 2) arr[i * 3 + 1] = -PLANE_H / 2;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const pointer = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    pointer.current.set(state.pointer.x, state.pointer.y);
    // Dolly in over her shoulder across the film.
    const z = THREE.MathUtils.lerp(4.2, 2.5, progress);
    const y = THREE.MathUtils.lerp(0.1, 0.42, progress);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3.5, delta);
    camera.lookAt(0, y * 0.4, 0);
  });

  return <Plate pointer={pointer} />;
}

export function MennieScene({ progress }: { progress: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 4.2], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#070a12"]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[2, 4, 3]} intensity={0.5} />

      <Rig progress={progress} />
      <LightRays />
      <Motes />

      <EffectComposer>
        <DepthOfField focusDistance={0.012} focalLength={0.045} bokehScale={3.2} />
        <Bloom intensity={0.6} luminanceThreshold={0.72} mipmapBlur />
        <Noise opacity={0.035} />
        <Vignette eskil={false} offset={0.22} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}

export default MennieScene;
