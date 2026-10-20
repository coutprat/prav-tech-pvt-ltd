import type { ReactNode } from "react";
import Link from "next/link";

/* -------------------------------------------------------------- SectionLabel */

/**
 * Horizontal mono section label.
 * Replaces the old letter-per-line vertical labels, which screen readers
 * announce one character at a time.
 */
export function SectionLabel({
  children,
  accent,
  id
}: {
  children: ReactNode;
  /** "line" follows the page's --acc, set by data-acc on an ancestor. */
  accent?: "teal" | "amber" | "line";
  id?: string;
}) {
  return (
    <p className="section-label" data-accent={accent} id={id}>
      {children}
    </p>
  );
}

/* ----------------------------------------------------------------- StatBlock */

export function StatBlock({
  value,
  label,
  note
}: {
  value: ReactNode;
  label: string;
  note?: string;
}) {
  return (
    <div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
      {note ? <p className="stat-note">{note}</p> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- SpecTable */

export type SpecColumn = { key: string; head: string };
export type SpecRow = { head: string; cells: ReactNode[] };

export function SpecTable({
  caption,
  columns,
  rows
}: {
  caption?: string;
  columns: SpecColumn[];
  rows: SpecRow[];
}) {
  // A horizontally scrollable region has to be reachable by keyboard, so it
  // takes a tab stop and an accessible name (WCAG 2.2 AA).
  return (
    <div
      className="spec-wrap"
      tabIndex={0}
      role="region"
      aria-label={caption ?? "Comparison table"}
    >
      <table className="spec-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col" />
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.head}>
              <th scope="row">{r.head}</th>
              {r.cells.map((cell, i) => (
                <td key={columns[i]?.key ?? i} data-label={columns[i]?.head ?? ""}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------- MilestoneTracker */

export function MilestoneTracker({
  items
}: {
  items: readonly { stage: string; title: string; body: string }[];
}) {
  return (
    <ol className="milestones">
      {items.map((m) => (
        <li className="milestone" key={m.stage} data-stage={m.stage}>
          <p className="milestone-stage">{m.stage}</p>
          <h3>{m.title}</h3>
          <p>{m.body}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- Disclaimer */

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="disclaimer">
      <span className="disclaimer-mark" aria-hidden="true">
        Note
      </span>
      <span>{children}</span>
    </p>
  );
}

/* ---------------------------------------------------------------- CTASection */

export function CTASection({
  title,
  body,
  primary = { href: "/start-a-project", label: "Start a project" },
  secondary
}: {
  title: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta">
          <h2 className="h2">{title}</h2>
          {body ? <p>{body}</p> : null}
          <div className="cta-actions">
            <Link className="btn btn-on-dark" href={primary.href}>
              {primary.label}
            </Link>
            {secondary ? (
              <Link className="btn btn-outline-on-dark" href={secondary.href}>
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
