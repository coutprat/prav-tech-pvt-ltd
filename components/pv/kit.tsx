import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/**
 * The 2026 section kit. Server components only: everything here is markup
 * and CSS (app/premium.css, `pv-` prefix). Motion comes from ScrollMotion,
 * which lifts .pv-card / .pv-rise in batches and adds .is-in to .pv-fig.
 */

type Accent = "ent" | "pha" | "men" | "pho" | "white";
const accentVar = (a?: Accent) =>
  a && a !== "white" ? `var(--acc-${a})` : "rgba(255,255,255,0.9)";

export function Section({
  id,
  children,
  tone,
  tight,
  className = "",
  accent,
}: {
  id?: string;
  children: ReactNode;
  tone?: "raised" | "deep";
  tight?: boolean;
  className?: string;
  accent?: Accent;
}) {
  return (
    <section
      id={id}
      className={`pv-section ${className}`}
      data-tone={tone}
      data-tight={tight || undefined}
      style={
        accent ? ({ "--a": accentVar(accent) } as CSSProperties) : undefined
      }
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Index + eyebrow on the left rail, the title and lede on the right. */
export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  as: H = "h2",
  aside,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
  aside?: ReactNode;
}) {
  return (
    <header className="pv-head">
      <div className="pv-head-rail">
        {index ? <span className="pv-head-i">{index}</span> : null}
        <span className="pv-eyebrow" data-plain>
          {eyebrow}
        </span>
      </div>
      <div className="pv-head-main">
        <H className="pv-h2">{title}</H>
        {lede ? <p className="pv-lede">{lede}</p> : null}
        {aside}
      </div>
    </header>
  );
}

/** Inner-page opener for pages without a film. */
export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  accent,
  children,
  meta,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  accent?: Accent;
  children?: ReactNode;
  /** Small facts under the lede, e.g. "Response in two business days". */
  meta?: string[];
}) {
  return (
    <section
      className="pv-hero"
      style={{ "--a": accentVar(accent) } as CSSProperties}
    >
      <div className="pv-hero-light" aria-hidden="true" />
      <div className="wrap pv-hero-in">
        <p className="pv-eyebrow">{eyebrow}</p>
        <h1 className="pv-h1">{title}</h1>
        {lede ? <p className="pv-lede pv-hero-lede">{lede}</p> : null}
        {actions ? <div className="pv-actions">{actions}</div> : null}
        {meta ? (
          <ul className="pv-meta">
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** A diagram frame. The caption says what the figure proves. */
export function Figure({
  n,
  title,
  caption,
  children,
  className = "",
  wide,
}: {
  n: string;
  title: string;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <figure className={`pv-fig ${className}`} data-wide={wide || undefined}>
      <div className="pv-fig-bar">
        <span className="pv-fig-n">Fig. {n}</span>
        <span className="pv-fig-t">{title}</span>
      </div>
      <div className="pv-fig-body">{children}</div>
      {caption ? (
        <figcaption className="pv-fig-cap">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function Card({
  n,
  title,
  children,
  href,
  meta,
  accent,
  cta = "Explore",
}: {
  n?: string;
  title: ReactNode;
  children?: ReactNode;
  href?: string;
  meta?: ReactNode;
  accent?: Accent;
  cta?: string;
}) {
  const body = (
    <>
      <span className="pv-card-light" aria-hidden="true" />
      {n ? <span className="pv-card-n">{n}</span> : null}
      <h3 className="pv-h3">{title}</h3>
      {children ? <div className="pv-card-body">{children}</div> : null}
      {meta ? <div className="pv-card-meta">{meta}</div> : null}
      {href ? (
        <span className="pv-card-go">
          {cta} <span aria-hidden="true">→</span>
        </span>
      ) : null}
    </>
  );
  const style = accent
    ? ({ "--a": accentVar(accent) } as CSSProperties)
    : undefined;
  return href ? (
    <Link href={href} className="pv-card" data-link style={style}>
      {body}
    </Link>
  ) : (
    <div className="pv-card" style={style}>
      {body}
    </div>
  );
}

export function Grid({
  cols = 3,
  children,
  className = "",
}: {
  cols?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`pv-grid ${className}`} data-cols={cols}>
      {children}
    </div>
  );
}

export function Stats({
  items,
}: {
  items: { value: ReactNode; label: string; note?: string }[];
}) {
  return (
    <dl className="pv-stats">
      {items.map((s) => (
        <div className="pv-stat" key={s.label}>
          <dt>{s.label}</dt>
          <dd>
            <span className="pv-stat-v">{s.value}</span>
            {s.note ? <span className="pv-stat-n">{s.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Numbered list with a hairline between rows. */
export function Rows({
  items,
}: {
  items: { k: string; title: ReactNode; body: ReactNode; aside?: ReactNode }[];
}) {
  return (
    <ol className="pv-rows">
      {items.map((r) => (
        <li key={r.k} className="pv-rise">
          <span className="pv-rows-k">{r.k}</span>
          <h3 className="pv-h3">{r.title}</h3>
          <div className="pv-rows-b">{r.body}</div>
          {r.aside ? <div className="pv-rows-a">{r.aside}</div> : null}
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="pv-faq">
      {items.map((f) => (
        <details key={f.q} className="pv-faq-i">
          <summary>
            <span>{f.q}</span>
            <span className="pv-faq-x" aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="pv-note">{children}</p>;
}

export function CtaBand({
  title,
  body,
  primary = { href: "/start-a-project", label: "Start a project" },
  secondary = { href: "/contact", label: "Talk to us" },
}: {
  title: ReactNode;
  body?: ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="pv-cta">
      <div className="pv-cta-light" aria-hidden="true" />
      <div className="wrap pv-cta-in pv-center">
        <h2 className="pv-h2">{title}</h2>
        {body ? <p className="pv-lede">{body}</p> : null}
        <div className="pv-actions">
          <Link className="btn-p" href={primary.href}>
            {primary.label} <span aria-hidden="true">→</span>
          </Link>
          {secondary ? (
            <Link className="btn-g" href={secondary.href}>
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Partner and group marks on the obsidian surface. */
export function LogoRow({
  items,
}: {
  items: { name: string; src?: string; role: string; w?: number; h?: number }[];
}) {
  return (
    <ul className="pv-logos">
      {items.map((l) => (
        <li key={l.name}>
          {l.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={l.src}
              alt={l.name}
              width={l.w ?? 160}
              height={l.h ?? 48}
              style={l.h ? { height: l.h } : undefined}
              loading="lazy"
            />
          ) : (
            <span className="pv-logos-word">{l.name}</span>
          )}
          <span className="pv-logos-r">{l.role}</span>
        </li>
      ))}
    </ul>
  );
}
