"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/lib/useMediaQuery";

type Blob = {
  /** Any CSS colour — pass the line's --acc-* glow token. */
  color: string;
  /** Percentages within the container. */
  x: number;
  y: number;
  size: number;
  /** How far this blob moves with the cursor, in px. Depth, basically. */
  parallax?: number;
};

/**
 * Soft coloured light behind a hero: blurred radial washes in the business
 * line colours, slowly drifting, and leaning toward the cursor on desktop.
 *
 * Deliberately light rather than paint — it sits at 13% opacity underneath
 * everything, so body copy never ends up on a saturated field.
 *
 * Pointer tracking is skipped on touch (no cursor to follow) and under
 * reduced motion, where the blobs are simply static.
 */
const SOFTEN = 80;

export function Aurora({ blobs }: { blobs: Blob[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // -0.5 .. 0.5 from the centre
    el.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  }

  return (
    <div
      ref={ref}
      className={`aurora${reduced ? "" : " aurora-drift"}`}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {blobs.map((b, i) => (
        <span
          key={i}
          style={{
            // The soft edge the old blur(70px) gave, as a gradient: grown by
            // the blur radius each side, solid core, fading out to the rim.
            background: `radial-gradient(closest-side, ${b.color} 30%, transparent)`,
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size + SOFTEN * 2}px`,
            height: `${b.size + SOFTEN * 2}px`,
            marginLeft: `${-b.size / 2 - SOFTEN}px`,
            marginTop: `${-b.size / 2 - SOFTEN}px`,
            // Alternating sign gives the layers opposite drift, which reads
            // as depth rather than the whole field sliding together.
            ["--px" as string]: `${(b.parallax ?? 24) * (i % 2 ? -1 : 1)}px`,
            ["--py" as string]: `${(b.parallax ?? 24) * (i % 2 ? 1 : -1)}px`
          }}
        />
      ))}
    </div>
  );
}

/** The four line colours, for heroes that want the whole palette. */
export const allLineBlobs: Blob[] = [
  { color: "var(--acc-ent)", x: 12, y: 24, size: 520, parallax: 30 },
  { color: "var(--acc-pha)", x: 78, y: 18, size: 460, parallax: 22 },
  { color: "var(--acc-men)", x: 30, y: 82, size: 500, parallax: 26 },
  { color: "var(--acc-pho)", x: 88, y: 74, size: 440, parallax: 18 }
];
