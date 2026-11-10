import { useId } from "react";

/**
 * The Praverse mark: a P inside an orbit, with a tilted inner orbit passing
 * behind it and three nodes on the outer ring.
 *
 * Inlined rather than an <img src="/logo.svg"> so it never flashes in after
 * first paint in the header, and so the pale half of the outer orbit can take
 * currentColor and hold up on light and dark surfaces alike. The same
 * geometry is in public/logo.svg (for JSON-LD and link previews) and
 * public/favicon.svg; it is drawn on a 1000-unit grid from plain arcs and
 * lines, so edit all three together.
 *
 * Below 48px the satellites and the dotted lower orbit would turn to grit, so
 * the small mark drops them, thickens what is left, and crops the empty lower
 * half of the ring so it sits level with the text beside it.
 *
 * With `tile` the mark sits on a plate in the card colours, with the same
 * faint hairline edge as the cards: the pale half of the ring is fixed to a
 * near-white, and the dotted lower orbit comes back, drawn heavier so it
 * survives header size.
 */

const P =
  "M244,236 H552 A180.5,180.5 0 0 1 552,597 H435 V773 H375 A30,30 0 0 1 345,743 V351 Z " +
  "M435,312 H552 A104.5,104.5 0 0 1 552,521 H435 Z";

export function Mark({ size = 28, tile = false }: { size?: number; tile?: boolean }) {
  const id = useId();
  const g = `${id}p`;
  const l = `${id}l`;
  const d = `${id}d`;
  const b = `${id}b`;
  const detailed = size >= 48;
  const ring = detailed ? 10 : 26;
  const pale = tile ? "#E6EAF0" : "currentColor";
  const viewBox = tile
    ? "-120 -120 1240 1240"
    : detailed
      ? "0 0 1000 1000"
      : "0 -5 1000 800";

  return (
    <svg
      width={size}
      height={detailed || tile ? size : size * 0.8}
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className="mark"
    >
      <defs>
        <linearGradient id={g} gradientUnits="userSpaceOnUse" x1="700" y1="250" x2="350" y2="780">
          <stop offset="0" stopColor="#5FE0C8" />
          <stop offset=".5" stopColor="#47B4C2" />
          <stop offset="1" stopColor="#3A80CF" />
        </linearGradient>
        <linearGradient id={l} gradientUnits="userSpaceOnUse" x1="60" y1="500" x2="500" y2="60">
          <stop offset="0" stopColor="#4A8FD0" />
          <stop offset="1" stopColor="#4CC8B8" />
        </linearGradient>
        <linearGradient id={d} gradientUnits="userSpaceOnUse" x1="940" y1="0" x2="60" y2="0">
          <stop offset="0" stopColor="#4CC8B8" />
          <stop offset="1" stopColor="#4A8FD0" />
        </linearGradient>
        {tile && (
          // The card surface, read from the theme tokens so the tile always
          // matches the cards around it rather than a fixed navy.
          <linearGradient id={b} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--paper-3)" }} />
            <stop offset="1" style={{ stopColor: "var(--paper-2)" }} />
          </linearGradient>
        )}
      </defs>

      {tile && (
        <rect
          x="-105"
          y="-105"
          width="1210"
          height="1210"
          rx="250"
          fill={`url(#${b})`}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="30"
        />
      )}

      <g fill="none" strokeLinecap="round">
        <path stroke={`url(#${l})`} strokeWidth={ring} d="M62.4,454 A440,440 0 0 1 454,62.4" />
        <path
          stroke={pale}
          strokeWidth={ring}
          opacity={tile ? 1 : 0.7}
          d="M546,62.4 A440,440 0 0 1 937.6,454"
        />
        {(detailed || tile) && (
          <path
            stroke={`url(#${d})`}
            strokeWidth={detailed ? 11 : 24}
            strokeDasharray={detailed ? "0 34" : "0 62"}
            opacity=".8"
            d="M937.6,546 A440,440 0 0 1 62.4,546"
          />
        )}
        <path
          stroke="#45C2B4"
          strokeWidth={detailed ? 8 : 22}
          d="M720,381.8 A361,194 0 1 1 350,355"
        />
      </g>

      <path fill={`url(#${g})`} fillRule="evenodd" d={P} />

      <circle cx="500" cy="60" r={detailed ? 32 : 46} fill="#4FD2BE" />
      <circle cx="60" cy="500" r={detailed ? 28 : 42} fill="#4A8FD0" />
      <circle cx="940" cy="500" r={detailed ? 28 : 42} fill="#4FD2BE" />

      {detailed && (
        <g>
          <circle cx="500" cy="168" r="8" fill="#4FD2BE" />
          <circle cx="493" cy="440" r="8" fill="#4FD2BE" />
          <circle cx="770" cy="478" r="8" fill="#4FD2BE" />
          <g fill={pale} opacity={tile ? 1 : 0.7}>
            <circle cx="290" cy="480" r="8" />
            <circle cx="205" cy="566" r="7" />
            <circle cx="500" cy="840" r="8" />
          </g>
        </g>
      )}
    </svg>
  );
}
