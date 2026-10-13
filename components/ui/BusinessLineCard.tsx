import Link from "next/link";

export type Motif = "gate" | "thread" | "wave" | "pulse";

/**
 * Each card carries a small looping motif that says what the line does:
 *   gate   — documents meet a human checkpoint before they pass
 *   thread — a claim traced back to its source
 *   wave   — a voice being heard
 *   pulse  — light crossing the hall
 * All four stop under prefers-reduced-motion and read as a static diagram.
 */
export function BusinessLineCard({
  n,
  href,
  title,
  blurb,
  tags,
  motif
}: {
  n: string;
  href: string;
  title: string;
  blurb: string;
  tags: readonly string[];
  motif: Motif;
}) {
  return (
    <Link className="line-card" href={href}>
      <p className="line-card-n">{n}</p>
      <h3>{title}</h3>
      <p>{blurb}</p>

      <div className="line-card-art" aria-hidden="true">
        <Motifs motif={motif} />
      </div>

      <div className="line-card-tags">
        {tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <span className="line-card-cta">
        Explore
        <span className="arrow" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}

function Motifs({ motif }: { motif: Motif }) {
  if (motif === "gate") {
    return (
      <svg className="motif motif-gate" viewBox="0 0 200 72" fill="none">
        {/* documents streaming toward a gate */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            className={`m-doc m-doc-${i}`}
            x="4"
            y="30"
            width="10"
            height="13"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        <line
          x1="104"
          y1="14"
          x2="104"
          y2="58"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.5"
        />
        <circle
          className="m-gate-node"
          cx="104"
          cy="36"
          r="9"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          className="m-check"
          d="M100 36.5l3 3 5.5-6"
          stroke="var(--teal-ink)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          className="m-ledger"
          x1="124"
          y1="36"
          x2="192"
          y2="36"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (motif === "thread") {
    return (
      <svg className="motif motif-thread" viewBox="0 0 200 72" fill="none">
        <rect
          x="4"
          y="14"
          width="54"
          height="44"
          rx="3"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1="12" y1="26" x2="44" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line
          className="m-highlight"
          x1="12"
          y1="36"
          x2="40"
          y2="36"
          stroke="var(--teal-ink)"
          strokeWidth="2"
        />
        <line x1="12" y1="46" x2="48" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        {[22, 36, 50].map((y, i) => (
          <path
            key={y}
            className={`m-thread m-thread-${i}`}
            d={`M58 36 C 96 36, 110 ${y}, 148 ${y}`}
            stroke="var(--teal-ink)"
            strokeWidth="1"
            fill="none"
          />
        ))}
        {[22, 36, 50].map((y) => (
          <rect
            key={y}
            x="150"
            y={y - 6}
            width="44"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.65"
          />
        ))}
      </svg>
    );
  }

  if (motif === "wave") {
    return (
      <svg className="motif motif-wave" viewBox="0 0 200 72" fill="none">
        {Array.from({ length: 26 }, (_, i) => (
          <rect
            key={i}
            className="m-bar"
            x={6 + i * 7.4}
            y="30"
            width="2.4"
            height="12"
            rx="1.2"
            fill="currentColor"
            style={{ ["--i" as string]: String(i) }}
          />
        ))}
      </svg>
    );
  }

  // pulse
  return (
    <svg className="motif motif-pulse" viewBox="0 0 200 72" fill="none">
      {[22, 36, 50].map((y) => (
        <line
          key={y}
          x1="4"
          y1={y}
          x2="196"
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
      ))}
      {[22, 36, 50].map((y, i) => (
        <circle
          key={y}
          className={`m-pulse m-pulse-${i}`}
          cx="4"
          cy={y}
          r="2.6"
          fill="var(--teal-ink)"
        />
      ))}
    </svg>
  );
}
