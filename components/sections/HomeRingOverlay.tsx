"use client";

import { useCallback, useRef, type RefObject } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  SequenceOverlay,
  glowDot,
  alongPath,
  type Point,
  type Resolver
} from "@/components/motion/SequenceOverlay";

/** Matches MODULES in scripts/blender/home_core.py — docking order and colour. */
const MODULES = [
  { key: "module0", colour: "#7C5CFF", litAt: 0.3435 },
  { key: "module1", colour: "#10B981", litAt: 0.5185 },
  { key: "module2", colour: "#38BDF8", litAt: 0.6935 },
  { key: "module3", colour: "#F59E0B", litAt: 0.8685 }
];

const RING_DRAWN_BY = 0.2;
const RING_POINTS = 72;

/**
 * Light particles travelling the ring, and running between each docked module
 * and the core, in that module's colour.
 *
 * The ring's screen-space samples come from positions.json, so the particles
 * follow the real projected ellipse as the camera pushes in. Particles flow
 * module → core → module: one platform, shared intelligence.
 *
 * Allocation-free: every buffer is created once and reused, because this runs
 * on every frame of a pinned scroll.
 */
export function HomeRingOverlay({
  frameRef,
  frameCount,
  active
}: {
  frameRef: RefObject<number>;
  frameCount: number;
  active: boolean;
}) {
  // positions.json is 144 KB; worth it on a large screen, not on a phone.
  const wideEnough = useMediaQuery("(min-width: 900px)");

  /**
   * Scratch reused across frames, created on first draw rather than during
   * render: these are deliberately mutable buffers for a 60fps canvas loop,
   * and React's immutability rules rightly apply to render-created values.
   */
  const buffersRef = useRef<{
    ring: Float32Array;
    p: Point;
    anchor: Point;
    core: Point;
  } | null>(null);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      resolve: Resolver,
      t: number,
      size: { w: number; h: number }
    ) => {
      const buffers = (buffersRef.current ??= {
        ring: new Float32Array(RING_POINTS * 2),
        p: [0, 0],
        anchor: [0, 0],
        core: [0, 0]
      });

      const u = size.w / 620;
      const n = resolve.path("ring", buffers.ring);
      if (n < 8) return;

      const progress = (frameRef.current ?? 0) / Math.max(1, frameCount - 1);
      if (progress < RING_DRAWN_BY) return;

      // The core sits at the centroid of the ring, which is where the
      // particles are heading.
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < n; i++) {
        cx += buffers.ring[i * 2];
        cy += buffers.ring[i * 2 + 1];
      }
      buffers.core[0] = cx / n;
      buffers.core[1] = cy / n;

      // Faint trace of the drawn ring so particles read as travelling along
      // something rather than floating.
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(buffers.ring[0], buffers.ring[1]);
      for (let i = 1; i < n; i++) {
        ctx.lineTo(buffers.ring[i * 2], buffers.ring[i * 2 + 1]);
      }
      ctx.strokeStyle = "rgba(130,150,190,0.16)";
      ctx.lineWidth = Math.max(1, u);
      ctx.stroke();

      for (let m = 0; m < MODULES.length; m++) {
        const mod = MODULES[m];
        if (progress < mod.litAt) continue;
        const strength = Math.min(1, (progress - mod.litAt) / 0.08);

        // steady pulse at the module
        const anchor = resolve.point(mod.key, buffers.anchor);
        if (anchor) {
          const breathe = 0.55 + 0.45 * Math.sin(t * 1.6 + m);
          glowDot(ctx, anchor[0], anchor[1], 2.9 * u, mod.colour, 0.6 * strength * breathe);

          // packets running module -> core -> module
          for (let k = 0; k < 2; k++) {
            const phase = (t * 0.33 + m * 0.21 + k * 0.5) % 1;
            // 0..0.5 inbound, 0.5..1 back out
            const leg = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
            const x = anchor[0] + (buffers.core[0] - anchor[0]) * leg;
            const y = anchor[1] + (buffers.core[1] - anchor[1]) * leg;
            const fade = Math.sin(leg * Math.PI) * 0.9 + 0.1;
            glowDot(ctx, x, y, 2.0 * u, mod.colour, 0.8 * strength * fade);
          }
        }

        // three packets circulating the ring
        for (let k = 0; k < 3; k++) {
          const phase = (t * 0.055 + m * 0.25 + k / 3) % 1;
          alongPath(buffers.ring, n, phase, buffers.p);
          const fade = 0.35 + 0.65 * Math.sin(phase * Math.PI);
          glowDot(ctx, buffers.p[0], buffers.p[1], 2.3 * u, mod.colour, 0.9 * strength * fade);
        }
      }
    },
    [frameRef, frameCount]
  );

  return (
    <SequenceOverlay
      tracksUrl="/media/home/desktop/positions.json"
      frameRef={frameRef}
      frameCount={frameCount}
      draw={draw}
      active={active && wideEnough}
    />
  );
}
