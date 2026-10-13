"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import { PARTS, type Part } from "./module-parts";

export { PARTS, type Part };

/**
 * "Inside an 800G module" — an illustrative pluggable transceiver that comes
 * apart as you scroll.
 *
 * Entirely procedural: no downloaded model, no vendor geometry. It is a
 * teaching diagram with real materials, not a product render, and the caption
 * says so.
 */

const AMBER = "#F59E0B";
const TEAL = "#4BD6C4";



function useMaterials() {
  return useMemo(
    () => ({
      metal: new THREE.MeshStandardMaterial({
        color: "#b9bcc2",
        metalness: 1,
        roughness: 0.32
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: "#8a8f98",
        metalness: 1,
        roughness: 0.45
      }),
      pcb: new THREE.MeshStandardMaterial({
        color: "#0f7a52",
        metalness: 0.1,
        roughness: 0.6
      }),
      chip: new THREE.MeshStandardMaterial({
        color: "#1b1f2a",
        metalness: 0.4,
        roughness: 0.45
      }),
      gold: new THREE.MeshStandardMaterial({
        color: AMBER,
        metalness: 1,
        roughness: 0.28
      }),
      laser: new THREE.MeshStandardMaterial({
        color: TEAL,
        emissive: new THREE.Color(TEAL),
        emissiveIntensity: 2.4,
        roughness: 0.3
      }),
      fibre: new THREE.MeshStandardMaterial({
        color: TEAL,
        emissive: new THREE.Color(TEAL),
        emissiveIntensity: 1.1,
        roughness: 0.4
      })
    }),
    []
  );
}

function PartGroup({
  part,
  explode,
  onHover,
  children
}: {
  part: Part;
  explode: number;
  onHover: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const [x, y, z] = part.offset;
    // ease toward the exploded offset
    g.position.lerp(
      new THREE.Vector3(x * explode, y * explode, z * explode),
      0.12
    );
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(part.id);
      }}
      onPointerOut={() => onHover(null)}
    >
      {children}
      {explode > 0.62 ? (
        <Html
          position={part.labelAt}
          center
          distanceFactor={7.5}
          zIndexRange={[5, 0]}
        >
          <div className="mod-label">
            <b>{part.label}</b>
            <span>{part.blurb}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

/** Dollies back and tilts down as the stack spreads, keeping it all framed. */
function CameraRig({ explode }: { explode: number }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const z = THREE.MathUtils.lerp(5.4, 7.9, explode);
    const x = THREE.MathUtils.lerp(4.6, 5.2, explode);
    const y = THREE.MathUtils.lerp(2.4, 2.1, explode);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, delta);
    // Subject sits right of centre so left-hand labels clear the copy column.
    camera.lookAt(THREE.MathUtils.lerp(0, -0.75, explode), THREE.MathUtils.lerp(0, -0.25, explode), 0);
  });
  return null;
}

function Module({ explode }: { explode: number }) {
  const m = useMaterials();
  const [, setHover] = useState<string | null>(null);
  const root = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = root.current;
    if (!g) return;
    // slow idle turn, plus a gentle lean toward the pointer
    g.rotation.y = state.clock.elapsedTime * 0.12 + state.pointer.x * 0.25;
    g.rotation.x = -0.12 + state.pointer.y * 0.1;
  });

  return (
    <group ref={root} scale={0.78}>
      <PartGroup part={PARTS[1]} explode={explode} onHover={setHover}>
        {/* heat sink: a finned block */}
        <group position={[0, 0.52, 0]}>
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} position={[0, 0.16, -1.1 + i * 0.26]} material={m.metal}>
              <boxGeometry args={[2.1, 0.42, 0.075]} />
            </mesh>
          ))}
          <mesh material={m.metal}>
            <boxGeometry args={[2.1, 0.09, 2.45]} />
          </mesh>
        </group>
      </PartGroup>

      <PartGroup part={PARTS[0]} explode={explode} onHover={setHover}>
        {/* housing: open shell */}
        <mesh position={[0, 0.2, 0]} material={m.darkMetal}>
          <boxGeometry args={[2.2, 0.1, 2.6]} />
        </mesh>
        <mesh position={[1.1, -0.05, 0]} material={m.darkMetal}>
          <boxGeometry args={[0.08, 0.6, 2.6]} />
        </mesh>
        <mesh position={[-1.1, -0.05, 0]} material={m.darkMetal}>
          <boxGeometry args={[0.08, 0.6, 2.6]} />
        </mesh>
        <mesh position={[0, -0.05, -1.3]} material={m.darkMetal}>
          <boxGeometry args={[2.2, 0.6, 0.08]} />
        </mesh>
      </PartGroup>

      <PartGroup part={PARTS[2]} explode={explode} onHover={setHover}>
        <mesh material={m.pcb}>
          <boxGeometry args={[2.0, 0.07, 2.4]} />
        </mesh>
        {/* gold edge fingers — the electrical contact */}
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[-0.85 + i * 0.13, 0.045, 1.14]} material={m.gold}>
            <boxGeometry args={[0.07, 0.015, 0.3]} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup part={PARTS[3]} explode={explode} onHover={setHover}>
        <mesh position={[0, 0.12, 0.25]} material={m.chip}>
          <boxGeometry args={[0.8, 0.16, 0.8]} />
        </mesh>
        <mesh position={[0, 0.21, 0.25]} material={m.gold}>
          <boxGeometry args={[0.55, 0.02, 0.55]} />
        </mesh>
      </PartGroup>

      <PartGroup part={PARTS[4]} explode={explode} onHover={setHover}>
        <mesh position={[0, 0.1, -0.75]} material={m.chip}>
          <boxGeometry args={[1.2, 0.13, 0.5]} />
        </mesh>
        {Array.from({ length: 4 }, (_, i) => (
          <mesh
            key={i}
            position={[-0.42 + i * 0.28, 0.2, -0.75]}
            material={m.laser}
          >
            <cylinderGeometry args={[0.055, 0.055, 0.1, 16]} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup part={PARTS[5]} explode={explode} onHover={setHover}>
        <mesh position={[0, 0.16, -1.75]} rotation={[Math.PI / 2, 0, 0]} material={m.fibre}>
          <cylinderGeometry args={[0.035, 0.035, 1.6, 12]} />
        </mesh>
        <mesh position={[0, 0.16, -1.2]} material={m.darkMetal}>
          <boxGeometry args={[0.42, 0.18, 0.3]} />
        </mesh>
      </PartGroup>
    </group>
  );
}

export function ModuleExploded({ explode }: { explode: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [4.6, 2.4, 5.4], fov: 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0b0e18"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 7, 4]} intensity={2.1} />
      <directionalLight position={[-5, 2, -4]} intensity={0.7} color={TEAL} />
      <Environment preset="studio" />
      <CameraRig explode={explode} />
      <Module explode={explode} />
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.82} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default ModuleExploded;
