/**
 * Where everything in the home hero sits, in CSS pixels.
 *
 * The 3D scene and the SVG fallback both draw from this one function, so the
 * diagram says the same thing — and the line labels land in the same place —
 * whichever of the two a visitor ends up seeing.
 *
 * The figure is a dispersion prism. One white beam enters; the glass splits it
 * by wavelength into four. The order of the four is physically honest: with
 * the apex up, longer wavelengths bend least and leave at the top, so amber
 * sits above emerald, emerald above sky, sky above violet.
 */

export type Pt = { x: number; y: number };

export type Line = {
  id: "photonics" | "pharma" | "mennie" | "enterprise-ai";
  n: string;
  href: string;
  title: string;
  short: string;
  note: string;
  color: string;
};

/** Top to bottom, as they leave the prism (longest wavelength first). */
export const LINES: Line[] = [
  {
    id: "photonics",
    n: "04",
    href: "/photonics",
    title: "Photonics & AI Data Centres",
    short: "Photonics",
    note: "800G and 1.6T copper and optical interconnect",
    color: "#f5a524"
  },
  {
    id: "pharma",
    n: "02",
    href: "/pharma",
    title: "Pharma & Regulatory AI",
    short: "Pharma AI",
    note: "483 responses, CAPA and inspection readiness",
    color: "#22c98f"
  },
  {
    id: "mennie",
    n: "03",
    href: "/mennie",
    title: "Healthcare AI · MENNIE",
    short: "Healthcare AI",
    note: "Voice-first patient intake, clinician-ready summaries",
    color: "#45bdf5"
  },
  {
    id: "enterprise-ai",
    n: "01",
    href: "/enterprise-ai",
    title: "Enterprise AI & Agents",
    short: "Enterprise AI",
    note: "Agents and copilots with a human gate",
    color: "#9b7bff"
  }
];

export type PrismLayout = {
  w: number;
  h: number;
  compact: boolean;
  /** Circumradius of the triangular face, px. */
  size: number;
  centre: Pt;
  /** Triangle corners: apex, bottom-right, bottom-left. */
  tri: [Pt, Pt, Pt];
  source: Pt;
  entry: Pt;
  exits: Pt[];
  ends: Pt[];
};

export function prismLayout(w: number, h: number): PrismLayout {
  const compact = w < 900;

  // On a phone the copy takes the top half and the figure the bottom; on a
  // wide screen the copy holds the left and the figure the right.
  // On a phone the figure has its own band under the copy, so `h` is the
  // band's height there, not the screen's.
  const centre: Pt = compact
    ? { x: w * 0.27, y: h * 0.5 }
    : { x: w * 0.585, y: h * 0.58 };
  const size = compact
    ? Math.min(w * 0.13, h * 0.17, 60)
    : Math.min(h * 0.155, w * 0.1, 150);

  const s = size;
  const apex = { x: centre.x, y: centre.y - s };
  const br = { x: centre.x + s * 0.866, y: centre.y + s * 0.5 };
  const bl = { x: centre.x - s * 0.866, y: centre.y + s * 0.5 };

  // Along the left face from its bottom corner toward the apex.
  const onLeft = (t: number): Pt => ({
    x: bl.x + (apex.x - bl.x) * t,
    y: bl.y + (apex.y - bl.y) * t
  });
  const onRight = (t: number): Pt => ({
    x: br.x + (apex.x - br.x) * t,
    y: br.y + (apex.y - br.y) * t
  });

  const entry = onLeft(0.42);
  // Narrow exit band on the right face; amber leaves highest.
  const exits = [0.5, 0.45, 0.4, 0.35].map(onRight);

  // The light rises from below the fold, under the copy rather than through
  // it. Leaving the prism, the beams are bent toward its base — which is
  // what a real prism does to a rising beam.
  const source: Pt = compact
    ? { x: -w * 0.04, y: h * 0.98 }
    : { x: w * 0.1, y: h * 1.04 };

  const endX = compact ? w * 0.56 : Math.min(w * 0.76, w - 350);
  const spread = compact ? h * 0.17 : h * 0.135;
  const mid = exits[1].y + (compact ? h * 0.04 : h * 0.035);
  const ends = [-1.5, -0.5, 0.5, 1.5].map((k) => ({
    x: endX,
    y: mid + k * spread
  }));

  return { w, h, compact, size, centre, tri: [apex, br, bl], source, entry, exits, ends };
}
