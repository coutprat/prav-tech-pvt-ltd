"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Screen-space tracks exported by the Blender scenes alongside the frames.
 * Positions are 0..1 from the top-left of the rendered image. Points behind
 * the camera come back as (-9, -9).
 */
export type Tracks = {
  frames: number;
  resolution: [number, number];
  tracks: Record<string, Point[] | Point[][]>;
};
export type Point = [number, number];

export type Packet = {
  /** Track key, or a pair of keys to travel between. */
  path: string;
  color: string;
  /** 0..1 along the path. */
  t: number;
  speed: number;
  size: number;
};

const offScreen = (p: Point | undefined) => !p || p[0] < -1;

/**
 * Draws moving light particles on top of a <ScrollSequence>, using the
 * per-frame screen positions the render exported.
 *
 * This is what makes the overlay sit *exactly* on the render rather than
 * approximating it: the Blender camera flies, and these tracks fly with it.
 *
 * The canvas matches the sequence canvas's own contain-fit box, so the two
 * stay aligned at any viewport size.
 */
export function SequenceOverlay({
  tracksUrl,
  frameRef,
  frameCount,
  draw,
  active
}: {
  tracksUrl: string;
  /**
   * Live sequence frame, written by ScrollSequence on every scrub tick.
   * A ref rather than a prop: the frame changes dozens of times a second and
   * re-rendering React that often would cost far more than the overlay does.
   */
  frameRef: RefObject<number>;
  frameCount: number;
  /** Per-frame painter, given resolved track positions in canvas pixels. */
  draw: (
    ctx: CanvasRenderingContext2D,
    get: (key: string) => Point | Point[] | undefined,
    t: number,
    size: { w: number; h: number }
  ) => void;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tracksRef = useRef<Tracks | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Fetched after the first paint, and only when the overlay is wanted —
    // it is data for an enhancement, never required to show the hero.
    if (!active) return;
    fetch(tracksUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled) tracksRef.current = j;
      })
      .catch(() => {
        /* overlay is decorative; the sequence stands on its own */
      });
    return () => {
      cancelled = true;
    };
  }, [tracksUrl, active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      const data = tracksRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!data) return;

      const [rw, rh] = data.resolution;
      // The sequence canvas draws its frames "contain"-fitted; match that box
      // so overlay coordinates land on the same pixels.
      const scale = Math.min(canvas.width / rw, canvas.height / rh);
      const w = rw * scale;
      const h = rh * scale;
      const ox = (canvas.width - w) / 2;
      const oy = (canvas.height - h) / 2;

      const f = Math.max(
        0,
        Math.min(frameCount - 1, Math.round(frameRef.current ?? 0))
      );

      const get = (key: string): Point | Point[] | undefined => {
        const track = data.tracks[key];
        if (!track) return undefined;
        const at = track[Math.min(f, track.length - 1)];
        if (!at) return undefined;
        if (Array.isArray(at[0])) {
          return (at as Point[]).map(
            (p) => [ox + p[0] * w, oy + p[1] * h] as Point
          );
        }
        const p = at as Point;
        if (offScreen(p)) return undefined;
        return [ox + p[0] * w, oy + p[1] * h] as Point;
      };

      draw(ctx, get, performance.now() / 1000, { w: canvas.width, h: canvas.height });
    };

    raf = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [draw, frameCount, active, frameRef]);

  if (!active) return null;

  return <canvas className="sequence-overlay" ref={canvasRef} aria-hidden="true" />;
}

/** Draw a glowing dot. Shared by the Home and Photonics overlays. */
export function glowDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 1
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Point at fraction `t` along a polyline, plus the local direction. */
export function alongPath(points: Point[], t: number): Point {
  if (points.length < 2) return points[0] ?? [0, 0];
  const clamped = Math.max(0, Math.min(0.9999, t));
  const seg = clamped * (points.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const a = points[i];
  const b = points[i + 1] ?? a;
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
