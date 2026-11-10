import Link from "next/link";
import type { CSSProperties } from "react";
import { flagshipSectors, sectors, type SectorIcon } from "@/content/sectors";
import { SectorMotif } from "@/components/pv/SectorMotif";

/** The glint in each drawing takes the colour of the line the sector draws on. */
const LINE_COLOUR: Record<string, string> = {
  "/enterprise-ai": "var(--acc-ent)",
  "/pharma": "var(--acc-pha)",
  "/mennie": "var(--acc-men)",
  "/photonics": "var(--acc-pho)",
  "/sovereign-ai-data-centres": "var(--acc-pho)",
  "/government": "var(--gold)",
};

export type BentoItem = {
  id: string;
  href: string;
  name: string;
  icon: SectorIcon;
  short: string;
  card: string[];
  colour: string;
  flagship: boolean;
};

export const bentoItems: BentoItem[] = [
  ...flagshipSectors.map((f) => ({
    id: f.href.slice(1),
    href: f.href,
    name: f.name,
    icon: f.icon,
    short: f.short,
    card: f.card,
    colour: LINE_COLOUR[f.href] ?? "var(--gold)",
    flagship: true,
  })),
  ...sectors.map((s) => ({
    id: s.slug,
    href: `/industries/${s.slug}`,
    name: s.name,
    icon: s.icon,
    short: s.short,
    card: s.card,
    colour: LINE_COLOUR[s.lines[0]?.href] ?? "var(--gold)",
    flagship: false,
  })),
];

/** Pharma leads; healthcare beside it; government spans the row beneath. */
const FEATURE_SPAN: Record<string, string> = { pharma: "7", mennie: "5", government: "12" };

export function IndustriesBento({ exclude }: { exclude?: string } = {}) {
  const flag = bentoItems.filter((b) => b.flagship);
  const ordered = [flag[1], flag[0], flag[2]].filter(Boolean);
  const rest = bentoItems.filter((b) => !b.flagship && b.id !== exclude);
  return (
    <div className="bento">
      <p className="bento-label">
        <span>Where we go deepest</span>
        <span>03 flagship lines</span>
      </p>
      {ordered.map((b) => (
        <Tile key={b.id} b={b} span={FEATURE_SPAN[b.id]} />
      ))}
      <p className="bento-label">
        <span>Every sector we build for</span>
        <span>{String(rest.length).padStart(2, "0")} sectors</span>
      </p>
      {rest.map((b, i) => (
        <Tile key={b.id} b={b} n={i + 1} />
      ))}
    </div>
  );
}

function Tile({ b, span, n }: { b: BentoItem; span?: string; n?: number }) {
  const feature = b.flagship;
  return (
    <Link
      id={`s-${b.id}`}
      href={b.href}
      className="bt"
      data-feature={feature || undefined}
      data-span={span}
      style={{ "--c": b.colour } as CSSProperties}
    >
      <span className="bt-top">
        <span className="bt-k">{feature ? "Flagship" : `Sector ${String(n).padStart(2, "0")}`}</span>
        {feature ? <span className="bt-tag">Dedicated line</span> : null}
      </span>
      <span className="bt-art">
        <SectorMotif icon={b.icon} id={b.id} />
      </span>
      <span className="bt-name">{b.name}</span>
      <span className="bt-short">{b.short}</span>
      <ul className="bt-we" aria-label={`What we build for ${b.name}`}>
        {b.card.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <span className="bt-go">
        {feature ? "See the line" : "Explore the sector"} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
