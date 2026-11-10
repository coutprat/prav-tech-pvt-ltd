import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { WeDo } from "@/content/wedo";

/**
 * V3 section pieces (styles in app/v3-pages.css). Server components.
 */

export type WallItem = {
  title: string;
  body?: string;
  tag?: string;
  kicker?: string;
  colour?: string;
  wide?: boolean;
  /** Anything richer than text, under the body (a gated figure, chips). */
  extra?: ReactNode;
};

/** Big figures in a hairline row (no count-up: values here are not plain integers). */
export function BigNums({ items }: { items: { value: string; label: string; note?: string }[] }) {
  return (
    <dl className="pv-bignums">
      {items.map((x) => (
        <div className="pv-bignum" key={x.label}>
          <dt className="pv-bignum-l">{x.label}</dt>
          <dd>
            <span className="pv-bignum-v">{x.value}</span>
            {x.note ? <span className="pv-bignum-n">{x.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The capability wall: a hairline grid of specific things we build. */
export function CapWall({ items, kicker = "We build" }: { items: WallItem[]; kicker?: string }) {
  return (
    <ul className="cw">
      {items.map((it) => (
        <li
          key={it.title}
          data-wide={it.wide || undefined}
          style={it.colour ? ({ "--c": it.colour } as CSSProperties) : undefined}
        >
          <span className="cw-k">
            <i aria-hidden="true" />
            {it.kicker ?? kicker}
          </span>
          <h3 className="cw-t">{it.title}</h3>
          {it.body ? <p className="cw-b">{it.body}</p> : null}
          {it.extra ? <div className="cw-x">{it.extra}</div> : null}
          {it.tag ? (
            <span className="cw-tag" data-t={it.tag}>
              {it.tag}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** WeDo offers as wall items. */
export const wallFromWeDo = (xs: readonly WeDo[], colour?: string, kicker?: string): WallItem[] =>
  xs.map((w) => ({ title: w.title, body: w.body, tag: w.backed, colour, kicker }));

/** One big sentence, the second clause stepped back. */
export function Statement({
  eyebrow,
  lead,
  rest,
  foot,
}: {
  eyebrow?: string;
  lead: ReactNode;
  rest?: ReactNode;
  foot?: { title: string; body: string }[];
}) {
  return (
    <div>
      {eyebrow ? <p className="pv-eyebrow pv-statement-k">{eyebrow}</p> : null}
      <p className="pv-statement">
        {lead}
        {rest ? <span className="pv-dim"> {rest}</span> : null}
      </p>
      {foot ? (
        <div className="pv-statement-foot">
          {foot.map((f) => (
            <div key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Numbered steps with very large numerals. */
export function BigSteps({ items }: { items: { title: string; body: string; tag?: string }[] }) {
  return (
    <ol className="bs">
      {items.map((s, i) => (
        <li key={s.title} className="pv-rise">
          <span className="bs-n">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="bs-t">{s.title}</h3>
          <p className="bs-b">{s.body}</p>
          {s.tag ? <span className="bs-tag">{s.tag}</span> : null}
        </li>
      ))}
    </ol>
  );
}

/** Copy on one side, a visual on the other. */
export function FeatureBand({
  eyebrow,
  title,
  lede,
  actions,
  visual,
  flip,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  visual: ReactNode;
  flip?: boolean;
}) {
  const copy = (
    <div>
      <p className="pv-eyebrow">{eyebrow}</p>
      <h2 className="pv-h2">{title}</h2>
      {lede ? <p className="pv-lede">{lede}</p> : null}
      {actions ? <div className="pv-actions">{actions}</div> : null}
    </div>
  );
  return (
    <div className="fband">
      {flip ? (
        <>
          <div>{visual}</div>
          {copy}
        </>
      ) : (
        <>
          {copy}
          <div>{visual}</div>
        </>
      )}
    </div>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="pv-link" href={href}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
