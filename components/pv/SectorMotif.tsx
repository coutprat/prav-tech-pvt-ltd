import type { SectorIcon } from "@/content/sectors";

/**
 * One drawing per sector, in the prism's language: the subject drawn in
 * hairlines of light, one champagne trace that lights up on hover (.mo-hot),
 * and a single spectral glint (.mo-glint) in the colour of the line the
 * sector draws on. All 240 x 150, all hand-placed so each sector reads as
 * itself rather than as a reskinned icon.
 *
 * Decorative: the card already names the sector.
 */

type Shape = {
  base?: string[]; // structure
  soft?: string[]; // background structure
  dots?: [number, number, number?][];
  hot: string; // the trace that lights (pathLength-normalised)
  glint: [number, number];
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const poly = (pts: [number, number][]) => "M" + pts.map((p) => p.join(" ")).join(" L");

const SHAPES: Record<SectorIcon, Shape> = {
  // ledger columns rising, a trend line read across them
  bank: {
    soft: range(7).map((i) => `M${30 + i * 30} 128 V20`),
    base: [
      "M18 128 H222",
      ...[46, 62, 54, 80, 72, 98, 112].map((h, i) => `M${30 + i * 30} 128 V${128 - h}`),
    ],
    dots: [46, 62, 54, 80, 72, 98, 112].map((h, i) => [30 + i * 30, 128 - h, 2.4]),
    hot: poly([
      [30, 82],
      [60, 66],
      [90, 74],
      [120, 48],
      [150, 56],
      [180, 30],
      [210, 16],
    ]),
    glint: [210, 16],
  },
  // a line of stations; a gear turning the belt
  factory: {
    base: [
      "M14 108 H226",
      "M14 118 H226",
      ...range(5).map((i) => `M${40 + i * 40} 108 V74 H${64 + i * 40} V108`),
      "M196 40 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0",
      ...range(8).map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return `M${196 + Math.cos(a) * 22} ${40 + Math.sin(a) * 22} L${196 + Math.cos(a) * 30} ${40 + Math.sin(a) * 30}`;
      }),
    ],
    soft: ["M196 40 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0"],
    dots: range(5).map((i) => [52 + i * 40, 92, 2.4]),
    hot: "M14 113 H226",
    glint: [52 + 4 * 40, 92],
  },
  // a catalogue grid; recommendations arc between items
  cart: {
    base: range(12).map((i) => {
      const x = 22 + (i % 6) * 34;
      const y = 30 + Math.floor(i / 6) * 50;
      return `M${x} ${y} h24 v24 h-24 Z`;
    }),
    soft: ["M14 118 H226"],
    hot: "M34 54 Q 85 -10 136 30 Q 170 60 204 104",
    dots: [
      [34, 42, 3],
      [136, 42, 3],
      [204, 92, 3],
    ],
    glint: [204, 92],
  },
  // a route network; the chosen route lights
  truck: {
    soft: [
      "M20 40 L80 24 L150 46 L220 30",
      "M20 120 L90 128 L160 108 L222 124",
      "M80 24 L90 128",
      "M150 46 L160 108",
    ],
    base: ["M20 40 L60 84 L90 128", "M60 84 L150 46", "M60 84 L160 108 L222 124", "M150 46 L196 80 L222 124"],
    dots: [
      [20, 40, 3],
      [60, 84, 3.2],
      [150, 46, 3],
      [196, 80, 3],
      [222, 124, 3.4],
      [80, 24, 2],
      [90, 128, 2],
      [160, 108, 2],
      [220, 30, 2],
    ],
    hot: "M20 40 L60 84 L150 46 L196 80 L222 124",
    glint: [222, 124],
  },
  // a grid waveform under transmission towers
  bolt: {
    base: [
      "M40 128 L56 34 L72 128 M46 92 H66 M50 66 H62 M44 46 H68",
      "M160 128 L176 34 L192 128 M166 92 H186 M170 66 H182 M164 46 H188",
      "M44 46 Q 116 74 164 46",
      "M68 46 Q 128 70 188 46",
    ],
    soft: ["M10 128 H230"],
    hot: poly(
      range(41).map((i) => [10 + i * 5.5, 108 - Math.sin(i / 2.6) * 10] as [number, number]),
    ),
    glint: [230, 108 - Math.sin(40 / 2.6) * 10],
  },
  // field rows to the horizon; a sensor reading the crop
  leaf: {
    base: range(6).map((i) => `M${-10 + i * 22} 136 Q ${100 + i * 4} 70 ${120 + i * 14} 44`),
    soft: ["M0 44 H240", "M176 64 m-26 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0"],
    dots: [[176, 64, 3]],
    hot: "M176 64 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0",
    glint: [176, 64],
  },
  // a knowledge tree branching from one lesson
  cap: {
    base: [
      "M30 75 L90 40 M30 75 L90 75 M30 75 L90 110",
      "M90 40 L150 24 M90 40 L150 52 M90 110 L150 98 M90 110 L150 126 M90 75 L150 75",
      "M150 75 L210 64 M150 75 L210 88",
    ],
    dots: [
      [30, 75, 3.4],
      [90, 40, 2.6],
      [90, 75, 2.6],
      [90, 110, 2.6],
      [150, 24, 2],
      [150, 52, 2],
      [150, 75, 2.6],
      [150, 98, 2],
      [150, 126, 2],
      [210, 64, 2],
      [210, 88, 2],
    ],
    hot: "M30 75 L90 75 L150 75 L210 64",
    glint: [210, 64],
  },
  // two documents; a clause in one linked to the other
  scale: {
    base: [
      "M24 20 h76 v112 h-76 Z",
      "M140 20 h76 v112 h-76 Z",
      ...range(7).map((i) => `M34 ${36 + i * 13} h${i === 3 ? 40 : 56}`),
      ...range(7).map((i) => `M150 ${36 + i * 13} h${i === 5 ? 34 : 56}`),
    ],
    hot: "M90 75 C 116 75 124 101 150 101",
    dots: [
      [90, 75, 3],
      [150, 101, 3],
    ],
    glint: [150, 101],
  },
  // a structure drawn in plan and elevation
  crane: {
    base: [
      "M60 132 V54 L120 30 L180 54 V132",
      "M60 54 L120 78 L180 54 M120 78 V132",
      ...range(4).map((i) => `M60 ${74 + i * 16} L120 ${98 + i * 16} L180 ${74 + i * 16}`),
    ],
    soft: ["M20 132 H220", "M200 132 V14 H120 M200 14 L220 30", "M150 14 V40"],
    dots: [[150, 40, 2.6]],
    hot: "M60 54 L120 30 L180 54 L120 78 Z",
    glint: [120, 30],
  },
  // a mast and its coverage
  tower: {
    base: ["M120 132 L104 66 H136 Z", "M108 84 H132 M112 104 H128 M120 66 V40"],
    soft: range(3).map((i) => {
      const r = 34 + i * 26;
      return `M${120 - r} 40 A ${r} ${r} 0 0 1 ${120 + r} 40`;
    }),
    dots: [[120, 40, 3.4]],
    hot: "M60 40 A 60 60 0 0 1 180 40",
    glint: [180, 40],
  },
  // one idea bursting into formats
  spark: {
    base: range(12).map((i) => {
      const a = (i / 12) * Math.PI * 2;
      const r1 = 18;
      const r2 = i % 2 ? 46 : 62;
      return `M${120 + Math.cos(a) * r1} ${75 + Math.sin(a) * r1} L${120 + Math.cos(a) * r2} ${75 + Math.sin(a) * r2}`;
    }),
    soft: ["M120 75 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0"],
    dots: range(6).map((i) => {
      const a = (i / 6) * Math.PI * 2;
      return [120 + Math.cos(a) * 62, 75 + Math.sin(a) * 62, 2.4] as [number, number, number];
    }),
    hot: poly(range(41).map((i) => [20 + i * 5, 140 - Math.abs(Math.sin(i / 3)) * (8 + (i % 5) * 2)] as [number, number])),
    glint: [220, 140 - Math.abs(Math.sin(40 / 3)) * 8],
  },
  // a booking calendar; occupancy as a curve
  bed: {
    base: range(5).flatMap((r) => range(7).map((c) => `M${30 + c * 26} ${22 + r * 18} h20 v12 h-20 Z`)),
    soft: [],
    dots: [
      [40, 28, 2],
      [92, 46, 2],
      [144, 64, 2],
      [170, 82, 2],
      [66, 100, 2],
    ],
    hot: "M24 134 C 70 120 90 140 130 120 S 190 104 216 112",
    glint: [216, 112],
  },
  // a heartbeat becoming a voice
  cross: {
    soft: range(5).map((i) => `M10 ${35 + i * 20} H230`),
    base: range(20).map((i) => {
      const h = [6, 14, 24, 10, 30, 18, 8, 22, 34, 16, 12, 26, 8, 20, 30, 12, 18, 10, 6, 4][i];
      const x = 128 + i * 5.2;
      return `M${x} ${75 - h} V${75 + h}`;
    }),
    hot: "M10 75 H50 L58 60 L66 92 L76 30 L86 112 L94 75 H124",
    glint: [124, 75],
  },
  // a molecule: rings and bonds
  flask: {
    base: [
      hex(80, 75, 26),
      hex(125, 49, 26),
      hex(170, 75, 26),
      "M170 75 m22.5 13 L218 104",
      "M80 75 m-22.5 -13 L34 48",
      "M125 49 m0 -26 L125 10",
    ],
    dots: [
      [218, 104, 3.4],
      [34, 48, 3.4],
      [125, 10, 3],
    ],
    hot: hex(125, 49, 26),
    glint: [125, 10],
  },
  // a portico and a seal
  pillar: {
    base: [
      "M30 46 L120 14 L210 46 Z",
      "M34 132 H206 M40 122 H200",
      ...range(5).map((i) => `M${52 + i * 34} 54 V118 M${62 + i * 34} 54 V118`),
    ],
    soft: ["M30 52 H210"],
    hot: "M30 46 L120 14 L210 46",
    dots: [[120, 14, 3]],
    glint: [120, 14],
  },
};

function hex(cx: number, cy: number, r: number) {
  const pts = range(6).map((i) => {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
  return poly(pts) + " Z";
}

export function SectorMotif({ icon, id }: { icon: SectorIcon; id: string }) {
  const s = SHAPES[icon];
  const gid = `mo-gold-${id}`;
  return (
    <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9c8152" />
          <stop offset="0.6" stopColor="#e8d5ab" />
          <stop offset="1" stopColor="#fbf6ea" />
        </linearGradient>
      </defs>
      {s.soft?.map((d, i) => <path key={`s${i}`} className="mo-soft" d={d} />)}
      {s.base?.map((d, i) => <path key={`b${i}`} className="mo-base" d={d} />)}
      {s.dots?.map(([x, y, r = 2], i) => <circle key={`d${i}`} className="mo-dot" cx={x} cy={y} r={r} />)}
      <path className="mo-hot" d={s.hot} pathLength={1} style={{ stroke: `url(#${gid})` }} />
      <circle className="mo-halo" cx={s.glint[0]} cy={s.glint[1]} r={8} />
      <circle className="mo-glint" cx={s.glint[0]} cy={s.glint[1]} r={3.2} />
    </svg>
  );
}
