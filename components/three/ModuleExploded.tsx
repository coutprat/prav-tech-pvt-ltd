"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer } from "@react-three/drei";
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
  labels,
  onHover,
  children
}: {
  part: Part;
  explode: RefObject<number>;
  labels: boolean;
  onHover: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const [x, y, z] = part.offset;
    const e = explode.current ?? 0;
    // ease toward the exploded offset
    g.position.lerp(target.set(x * e, y * e, z * e), 0.12);
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
      {labels ? (
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
function CameraRig({ explode: ref }: { explode: RefObject<number> }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const explode = ref.current ?? 0;
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

function Module({ explode, labels }: { explode: RefObject<number>; labels: boolean }) {
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
      <PartGroup part={PARTS[1]} explode={explode} labels={labels} onHover={setHover}>
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

      <PartGroup part={PARTS[0]} explode={explode} labels={labels} onHover={setHover}>
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

      <PartGroup part={PARTS[2]} explode={explode} labels={labels} onHover={setHover}>
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

      <PartGroup part={PARTS[3]} explode={explode} labels={labels} onHover={setHover}>
        <mesh position={[0, 0.12, 0.25]} material={m.chip}>
          <boxGeometry args={[0.8, 0.16, 0.8]} />
        </mesh>
        <mesh position={[0, 0.21, 0.25]} material={m.gold}>
          <boxGeometry args={[0.55, 0.02, 0.55]} />
        </mesh>
      </PartGroup>

      <PartGroup part={PARTS[4]} explode={explode} labels={labels} onHover={setHover}>
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

      <PartGroup part={PARTS[5]} explode={explode} labels={labels} onHover={setHover}>
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

/**
 * Draws one frame on mount, even with the render loop stopped.
 *
 * The scene mounts a screen before it is visible, but with frameloop "never"
 * nothing would be drawn until it arrived, so the shader compile, the
 * environment bake and the composer's targets all landed on the first frame
 * the visitor could see. This pays for them while it is still off screen.
 */
function Warmup() {
  const advance = useThree((s) => s.advance);
  const width = useThree((s) => s.size.width);
  const done = useRef(false);
  useEffect(() => {
    // wait for the canvas to be measured, or the frame is drawn at 0×0
    if (done.current || width === 0) return;
    done.current = true;
    advance(performance.now());
  }, [advance, width]);
  return null;
}

/**
 * `explode` is a ref, read inside useFrame, so scrolling does not re-render
 * the scene graph through React on every frame. `labels` is the only part of
 * it React needs to know about. `active` stops the render loop entirely while
 * the section is off screen; R3F otherwise renders at 60fps for the whole
 * visit, bloom pass included, whether or not anyone can see it.
 *
 * Antialiasing is the composer's job (multisampling below): with
 * postprocessing on, a default-framebuffer MSAA buffer is paid for and never
 * shown. 1.5 DPR is visually indistinguishable here, and ~25% fewer pixels
 * than 1.75 through every pass.
 */
export function ModuleExploded({
  explode,
  labels,
  active
}: {
  explode: RefObject<number>;
  labels: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [4.6, 2.4, 5.4], fov: 38 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0b0e18"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 7, 4]} intensity={2.1} />
      <directionalLight position={[-5, 2, -4]} intensity={0.7} color={TEAL} />
      {/*
        The studio environment is built here, not downloaded.

        <Environment preset="studio" /> fetches an HDRI from raw.githack.com.
        Our CSP allows no foreign connect-src, so the browser refused the
        request, drei's loader threw, and the whole of /photonics fell into the
        error boundary — the module did not degrade quietly, it took the page
        down with it.

        Widening the CSP for a git CDN would have been the wrong trade twice
        over: it is a third-party origin contacted on every visit to the page,
        and /trust tells readers that loading a page calls no third-party asset
        service. Passing children instead makes <Environment> render them into
        a cube target, which costs one 256px bake at mount and nothing on the
        network.

        Every surface in this module sits at metalness 1 with roughness under
        0.5, so there is nothing to see unless there is something to reflect.
        These panels are what it reflects: a broad key above, a cool rim down
        one side, the brand teal down the other, and a dim bounce underneath so
        the undersides are not solid black.
      */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#ffffff"
          position={[0, 6, 1]}
          scale={[12, 12, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#cfe0f5"
          position={[-7, 1.5, -2]}
          scale={[7, 5, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color={TEAL}
          position={[6.5, 1, 3]}
          scale={[7, 4, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.45}
          color="#7e93b5"
          position={[0, -5, 0]}
          scale={[10, 10, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
      <CameraRig explode={explode} />
      <Module explode={explode} labels={labels} />
      <EffectComposer multisampling={4}>
        <Bloom intensity={0.55} luminanceThreshold={0.82} mipmapBlur />
      </EffectComposer>
      <Warmup />
    </Canvas>
  );
}

export default ModuleExploded;
