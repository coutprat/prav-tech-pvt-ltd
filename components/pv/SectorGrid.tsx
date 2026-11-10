import Link from "next/link";
import { flagshipSectors, sectors } from "@/content/sectors";
import { SectorIcon } from "@/components/pv/SectorIcon";

/**
 * Sector cards: icon, one-line summary, two or three "we build" services and
 * a link to the sector's page (or its flagship page for healthcare, pharma and
 * government). Used on the home page and the /industries hub.
 */
export function SectorGrid({
  withFlagships = true,
  exclude,
}: {
  withFlagships?: boolean;
  exclude?: string;
}) {
  const items = [
    ...(withFlagships
      ? flagshipSectors.map((f) => ({
          key: f.href,
          href: f.href,
          name: f.name,
          icon: f.icon,
          short: f.short,
          card: f.card,
          flagship: true,
        }))
      : []),
    ...sectors
      .filter((s) => s.slug !== exclude)
      .map((s) => ({
        key: s.slug,
        href: `/industries/${s.slug}`,
        name: s.name,
        icon: s.icon,
        short: s.short,
        card: s.card,
        flagship: false,
      })),
  ];
  return (
    <ul className="pv-sectors">
      {items.map((s) => (
        <li key={s.key}>
          <Link href={s.href} className="pv-card pv-sector" data-link>
            <span className="pv-card-light" aria-hidden="true" />
            <span className="pv-sector-top">
              <span className="pv-sector-ic">
                <SectorIcon name={s.icon} />
              </span>
              {s.flagship ? (
                <span className="pv-sector-tag mono">Flagship</span>
              ) : null}
            </span>
            <h3 className="pv-h3">{s.name}</h3>
            <p className="pv-sector-short">{s.short}</p>
            <ul className="pv-sector-we">
              {s.card.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <span className="pv-card-go">
              {s.flagship ? "See the line" : "Explore the sector"}{" "}
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
