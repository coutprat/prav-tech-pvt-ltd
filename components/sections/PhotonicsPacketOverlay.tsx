"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  SequenceOverlay,
  strokeSegment,
  type Resolver
} from "@/components/motion/SequenceOverlay";

const TEAL = "75, 214, 196";

/** How many fibre runs carry a pulse. */
const ROWS = 4;
const FIBRE_POINTS = 24;

/** The optical layer comes up after the hall is established. */
const FIBRE_FROM = 0.42;

/** Lit length of each run, as a fraction of the whole path. */
const PULSE = 0.17;

/**
 * Light moving down the fibre, over the Photonics hero.
 *
 * Rewritten. The first version drew about a hundred independent particles —
 * two per rack on copper, two per fibre run, one per port, all breathing on
 * their own cycles. It was fast (no dropped frames at 4x CPU throttle), and it
 * still looked like a mess: a hundred unrelated dots twitching over a rendered
 * hall reads as noise, not as signal, and the faster you scroll the more it
 * looks like static.
 *
 * The problem was never the frame budget, it was the picture. So this draws
 * what is actually happening instead: a pulse of light travelling down each
 * fibre run — a lit *length* of the path, bright at the head and fading behind
 * it, which is what a signal in a fibre looks like. Four pulses instead of a
 * hundred dots, and the page says the same thing more clearly.
 *
 * The copper hops and the port blinks are gone entirely. They were the bulk of
 * the particle count and the least legible part of it; the rendered frames
 * already show the racks and their ports lit.
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
  const wideEnough = useMediaQuery("(min-width: 900px)");
  const velocity = useRef(0);

  /** Scratch reused across frames; created on first draw, not during render. */
  const buffersRef = useRef<{ fibre: Float32Array } | null>(null);

  useEffect(() => {
    if (!active || !wideEnough) return;
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = window.scrollY;
      const delta = Math.abs(now - last);
      last = now;
      velocity.current += (Math.min(delta, 90) - velocity.current) * 0.12;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, wideEnough]);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      resolve: Resolver,
      t: number,
      size: { w: number; h: number }
    ) => {
      const buffers = (buffersRef.current ??= {
        fibre: new Float32Array(FIBRE_POINTS * 2)
      });

      const progress = (frameRef.current ?? 0) / Math.max(1, frameCount - 1);
      if (progress < FIBRE_FROM) return;

      const u = size.w / 620;
      const strength = Math.min(1, (progress - FIBRE_FROM) / 0.18);
      // Scroll speeds the pulses up, but far more gently than before: at pace
      // the old particles blurred into static.
      const surge = 1 + velocity.current * 0.018;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let row = 0; row < ROWS; row++) {
        const n = resolve.path(`fibre${row}`, buffers.fibre);
        if (n < 4) continue;

        // the run itself, barely there
        ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(${TEAL},${0.1 * strength})`;
        ctx.lineWidth = Math.max(1, u * 0.8);
        strokeSegment(ctx, buffers.fibre, n, 0, 1);

        // the pulse: a lit length, brightest at its head
        const head = (t * 0.17 * surge + row * 0.26) % 1.3 - 0.15;

        // tail — long, dim
        ctx.strokeStyle = `rgba(${TEAL},${0.2 * strength})`;
        ctx.lineWidth = Math.max(1.5, u * 1.5);
        strokeSegment(ctx, buffers.fibre, n, head - PULSE, head);

        // body
        ctx.strokeStyle = `rgba(${TEAL},${0.45 * strength})`;
        ctx.lineWidth = Math.max(2, u * 2.1);
        strokeSegment(ctx, buffers.fibre, n, head - PULSE * 0.45, head);

        // head — short, bright, with the glow doing the work
        ctx.shadowColor = `rgba(${TEAL},${0.9 * strength})`;
        ctx.shadowBlur = 14 * u;
        ctx.strokeStyle = `rgba(220, 255, 250,${0.9 * strength})`;
        ctx.lineWidth = Math.max(2, u * 2.3);
        strokeSegment(ctx, buffers.fibre, n, head - PULSE * 0.12, head);
        ctx.shadowBlur = 0;
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
      active={active && wideEnough}
    />
  );
}
