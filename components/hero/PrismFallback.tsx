import { LINES, type PrismLayout } from "@/lib/prism-layout";

/**
 * The same figure as the 3D scene, drawn as SVG from the same layout.
 *
 * Painted first on every device — it is in the server HTML, so the hero is
 * complete before any JavaScript arrives — and it is what stays on screen
 * for reduced motion, software-rendered WebGL and low-power phones.
 */
export function PrismFallback({ L, still }: { L: PrismLayout; still: boolean }) {
  const [apex, br, bl] = L.tri;
  const exitMid = {
    x: (L.exits[0].x + L.exits[3].x) / 2,
    y: (L.exits[0].y + L.exits[3].y) / 2
  };
  const tri = `${apex.x},${apex.y} ${br.x},${br.y} ${bl.x},${bl.y}`;

  return (
    <svg
      className="ph-svg"
      data-still={still}
      viewBox={`0 0 ${L.w} ${L.h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ph-in" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="ph-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#201f1d" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#10100f" stopOpacity="0.75" />
          <stop offset="1" stopColor="#2d2c29" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="ph-halo">
          <stop offset="0" stopColor="#f2ede4" stopOpacity="0.16" />
          <stop offset="1" stopColor="#f2ede4" stopOpacity="0" />
        </radialGradient>
        {LINES.map((l) => (
          <linearGradient key={l.id} id={`ph-${l.id}`} x1="0" x2="1">
            <stop offset="0" stopColor={l.color} stopOpacity="0.9" />
            <stop offset="1" stopColor={l.color} stopOpacity="0.55" />
          </linearGradient>
        ))}
      </defs>

      <circle cx={L.centre.x} cy={L.centre.y} r={L.size * 3.2} fill="url(#ph-halo)" />

      {/* the spectrum between the beams */}
      {LINES.slice(0, -1).map((l, i) => (
        <polygon
          key={l.id}
          points={`${L.exits[i].x},${L.exits[i].y} ${L.ends[i].x},${L.ends[i].y} ${L.ends[i + 1].x},${L.ends[i + 1].y} ${L.exits[i + 1].x},${L.exits[i + 1].y}`}
          fill={l.color}
          opacity="0.07"
        />
      ))}

      {/* incoming white light */}
      <line
        x1={L.source.x}
        y1={L.source.y}
        x2={L.entry.x}
        y2={L.entry.y}
        stroke="#fff"
        strokeOpacity="0.12"
        strokeWidth={L.compact ? 9 : 14}
        strokeLinecap="round"
      />
      <line
        x1={L.source.x}
        y1={L.source.y}
        x2={L.entry.x}
        y2={L.entry.y}
        stroke="url(#ph-in)"
        strokeWidth="2"
      />
      <line
        className="ph-flow"
        x1={L.source.x}
        y1={L.source.y}
        x2={L.entry.x}
        y2={L.entry.y}
        stroke="#fff"
        strokeWidth="3"
      />

      {/* four beams out */}
      {LINES.map((l, i) => (
        <g key={l.id}>
          <line
            x1={L.exits[i].x}
            y1={L.exits[i].y}
            x2={L.ends[i].x}
            y2={L.ends[i].y}
            stroke={l.color}
            strokeOpacity="0.16"
            strokeWidth={L.compact ? 8 : 12}
            strokeLinecap="round"
          />
          <line
            x1={L.exits[i].x}
            y1={L.exits[i].y}
            x2={L.ends[i].x}
            y2={L.ends[i].y}
            stroke={`url(#ph-${l.id})`}
            strokeWidth="1.6"
          />
          <line
            className="ph-flow"
            style={{ animationDelay: `${i * -0.35}s` }}
            x1={L.exits[i].x}
            y1={L.exits[i].y}
            x2={L.ends[i].x}
            y2={L.ends[i].y}
            stroke={l.color}
            strokeWidth="2.6"
          />
          <circle cx={L.ends[i].x} cy={L.ends[i].y} r="5.5" fill="none" stroke={l.color} strokeWidth="1.5" />
          <circle cx={L.ends[i].x} cy={L.ends[i].y} r="14" fill={l.color} opacity="0.14" />
        </g>
      ))}

      {/* the glass */}
      <polygon points={tri} fill="url(#ph-glass)" stroke="#f5f2ec" strokeOpacity="0.55" strokeWidth="1.2" />
      <line
        x1={L.entry.x}
        y1={L.entry.y}
        x2={exitMid.x}
        y2={exitMid.y}
        stroke="#fff"
        strokeOpacity="0.75"
        strokeWidth="2"
      />
    </svg>
  );
}
