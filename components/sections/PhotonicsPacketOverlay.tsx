"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import {
  SequenceOverlay,
  glowDot,
  alongPath,
  type Point
} from "@/components/motion/SequenceOverlay";

const AMBER = "#F59E0B";
const TEAL = "#4BD6C4";

const ROWS = 4;
const PER_ROW = 7;
const RACKS = ROWS * PER_ROW;

const COPPER_LIT_FROM = 0.24;
const FIBRE_FROM = 0.48;

/**
 * Light packets over the Photonics hero.
 *
 * Amber packets make short hops inside each rack — that is what copper is for.
 * Teal packets run the long fibre paths across the hall to the spine. The two
 * speeds and distances are the page's actual argument, drawn rather than said.
 *
 * Packet speed is tied to scroll velocity, so the hall visibly surges as you
 * move and settles to an idle drift when you stop.
 */
export function PhotonicsPacketOverlay({
  frameRef,
  frameCount,
  active
}: {
  frameRef: RefObject<number>;
  frameCount: number;
  active: boolean;
}) {
  const velocity = useRef(0);

  useEffect(() => {
    if (!active) return;
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = window.scrollY;
      const delta = Math.abs(now - last);
      last = now;
      // Smoothed so the surge eases in and out instead of strobing.
      velocity.current += (Math.min(delta, 90) - velocity.current) * 0.12;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      get: (key: string) => Point | Point[] | undefined,
      t: number,
      size: { w: number; h: number }
    ) => {
      const u = size.w / 620;
      const progress = (frameRef.current ?? 0) / Math.max(1, frameCount - 1);
      const surge = 1 + velocity.current * 0.05;

      // --- copper: short hops inside each rack --------------------------
      if (progress >= COPPER_LIT_FROM) {
        const strength = Math.min(1, (progress - COPPER_LIT_FROM) / 0.12);
        for (let i = 0; i < RACKS; i++) {
          const a = get(`cu${i}a`) as Point | undefined;
          const b = get(`cu${i}b`) as Point | undefined;
          if (!a || !b) continue;
          // two packets per rack, offset so the hall does not pulse in unison
          for (let k = 0; k < 2; k++) {
            const phase = (t * 0.55 * surge + i * 0.137 + k * 0.5) % 1;
            const x = a[0] + (b[0] - a[0]) * phase;
            const y = a[1] + (b[1] - a[1]) * phase;
            const fade = Math.sin(phase * Math.PI);
            glowDot(ctx, x, y, 1.4 * u, AMBER, 0.7 * strength * fade);
          }
        }
      }

      // --- fibre: long runs across the hall to the spine -----------------
      if (progress >= FIBRE_FROM) {
        const strength = Math.min(1, (progress - FIBRE_FROM) / 0.16);
        for (let row = 0; row < ROWS; row++) {
          const path = get(`fibre${row}`) as Point[] | undefined;
          if (!path || path.length < 4) continue;

          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.beginPath();
          path.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.strokeStyle = `rgba(75,214,196,${0.1 * strength})`;
          ctx.lineWidth = Math.max(1, u * 0.9);
          ctx.stroke();
          ctx.restore();

          for (let k = 0; k < 2; k++) {
            // Slower than copper in cycles-per-second, but covering far more
            // distance — the reach difference, shown.
            const phase = (t * 0.22 * surge + row * 0.2 + k * 0.5) % 1;
            const p = alongPath(path, phase);
            const fade = 0.4 + 0.6 * Math.sin(phase * Math.PI);
            glowDot(ctx, p[0], p[1], 2.1 * u, TEAL, 0.95 * strength * fade);

            // short trail behind the packet
            const trail = alongPath(path, Math.max(0, phase - 0.03));
            glowDot(ctx, trail[0], trail[1], 1.3 * u, TEAL, 0.35 * strength * fade);
          }
        }
      }

      // --- ports light as the optical layer comes up ---------------------
      if (progress >= FIBRE_FROM) {
        const strength = Math.min(1, (progress - FIBRE_FROM) / 0.2);
        for (let i = 0; i < RACKS; i++) {
          const p = get(`port${i}`) as Point | undefined;
          if (!p) continue;
          const breathe = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.4);
          glowDot(ctx, p[0], p[1], 1.1 * u, TEAL, 0.4 * strength * breathe);
        }
      }
    },
    [frameRef, frameCount]
  );

  return (
    <SequenceOverlay
      tracksUrl="/media/photonics/desktop/positions.json"
      frameRef={frameRef}
      frameCount={frameCount}
      draw={draw}
      active={active}
    />
  );
}
