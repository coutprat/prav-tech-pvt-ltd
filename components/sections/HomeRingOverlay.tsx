"use client";

import { useCallback, type RefObject } from "react";
import {
  SequenceOverlay,
  glowDot,
  alongPath,
  type Point
} from "@/components/motion/SequenceOverlay";

/** Matches MODULES in scripts/blender/home_core.py — docking order and colour. */
const MODULES = [
  { key: "module0", colour: "#7C5CFF", litAt: 0.3435 },
  { key: "module1", colour: "#10B981", litAt: 0.5185 },
  { key: "module2", colour: "#38BDF8", litAt: 0.6935 },
  { key: "module3", colour: "#F59E0B", litAt: 0.8685 }
];

const RING_DRAWN_BY = 0.2;

/**
 * Light particles travelling the ring between docked modules, in each line's
 * colour, tracking the Blender render frame by frame.
 *
 * The ring's 72 screen-space sample points come from positions.json, so the
 * particles follow the real projected ellipse as the camera pushes in —
 * nothing here is an approximation of where the ring "probably" is.
 *
 * A segment only carries traffic once the module ahead of it has locked in,
 * which is the whole point: the core is not connected until the line docks.
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
  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      get: (key: string) => Point | Point[] | undefined,
      t: number,
      size: { w: number; h: number }
    ) => {
      // Scale with the canvas so particles read the same on a phone and a
      // 4K display rather than shrinking to nothing.
      const u = size.w / 620;
      const ring = get("ring") as Point[] | undefined;
      if (!ring || ring.length < 8) return;

      const progress = (frameRef.current ?? 0) / Math.max(1, frameCount - 1);
      if (progress < RING_DRAWN_BY) return;

      // Faint trace of the drawn ring, so particles read as travelling along
      // something rather than floating.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      ring.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.strokeStyle = "rgba(120,140,180,0.16)";
      ctx.lineWidth = Math.max(1, u);
      ctx.stroke();
      ctx.restore();

      const lit = MODULES.filter((m) => progress >= m.litAt);
      if (!lit.length) return;

      // Each docked module feeds packets forward around the ring.
      lit.forEach((m, i) => {
        const anchor = get(m.key) as Point | undefined;
        const strength = Math.min(1, (progress - m.litAt) / 0.08);

        if (anchor) {
          // a steady pulse at the module itself
          const breathe = 0.55 + 0.45 * Math.sin(t * 1.6 + i);
          glowDot(ctx, anchor[0], anchor[1], 2.9 * u, m.colour, 0.6 * strength * breathe);
        }

        // three packets per docked line, spaced along the ring
        for (let k = 0; k < 3; k++) {
          const speed = 0.055;
          const phase = (t * speed + i * 0.25 + k / 3) % 1;
          const p = alongPath(ring, phase);
          const fade = 0.35 + 0.65 * Math.sin(phase * Math.PI);
          glowDot(ctx, p[0], p[1], 2.3 * u, m.colour, 0.9 * strength * fade);
        }
      });
    },
    [frameRef, frameCount]
  );

  return (
    <SequenceOverlay
      tracksUrl="/media/home/desktop/positions.json"
      frameRef={frameRef}
      frameCount={frameCount}
      draw={draw}
      active={active}
    />
  );
}
