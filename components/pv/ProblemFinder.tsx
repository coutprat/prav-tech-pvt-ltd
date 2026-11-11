"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

/**
 * "What is the problem on your desk?"
 *
 * The visitor picks the sentence that sounds like theirs and sees, at once,
 * what we would build for it and what they would hold first. The call to
 * action carries the problem into the project form (?topic & ?note), so the
 * first message is already half written.
 *
 * Every answer is assembled from copy the site already stands behind (offers,
 * line descriptions, the verified engagement note). Nothing here is a new
 * claim, and no client is named.
 */

export type Problem = {
  id: string;
  /** The problem, in the visitor's words. */
  say: string;
  line: string;
  colour: string;
  title: string;
  body: string;
  /** What they hold first. */
  first: string;
  /** Anonymised, verified proof. Omitted when there is none to state. */
  proof?: string;
  href: string;
  /** Matches an option in the project form's select. */
  topic: string;
};

export function ProblemFinder({ items }: { items: Problem[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const p = items[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  // A few degrees of tilt toward the pointer: the card has depth, not drama.
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = panel.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 3.2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = panel.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="pq"style={{ "--c": p.colour } as CSSProperties}>
      <div className="pq-list" role="tablist" aria-label="Problems we solve" aria-orientation="vertical">
        {items.map((it, i) => (
          <button
            key={it.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`pq-tab-${it.id}`}
            aria-selected={i === active}
            aria-controls="pq-panel"
            tabIndex={i === active ? 0 : -1}
            className="pq-tab"
            style={{ "--c": it.colour } as CSSProperties}
            onClick={() => {
              setActive(i);
              // On a phone the answer sits below the list: bring it into view.
              const el = panel.current;
              if (el && window.matchMedia("(max-width: 999px)").matches) {
                type Scroller = { scrollTo: (t: HTMLElement, o: { offset: number }) => void };
                const lenis = (window as Window & { __lenis?: Scroller }).__lenis;
                if (lenis) lenis.scrollTo(el, { offset: -96 });
                else el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setActive(i);
            }}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="pq-tab-n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pq-tab-t">&ldquo;{it.say}&rdquo;</span>
          </button>
        ))}
      </div>

      <div className="pq-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div
          ref={panel}
          className="pq-panel"
          id="pq-panel"
          role="tabpanel"
          aria-labelledby={`pq-tab-${p.id}`}
        >
          <div className="pq-glare" aria-hidden="true" />
          {/* key: replay the entrance each time the problem changes */}
          <div className="pq-in" key={p.id}>
            <p className="pq-k">
              <i aria-hidden="true" />
              {p.line}
            </p>
            <h3 className="pq-title">{p.title}</h3>
            <p className="pq-body">{p.body}</p>

            <dl className="pq-facts">
              <div>
                <dt>What you hold first</dt>
                <dd>{p.first}</dd>
              </div>
              {p.proof ? (
                <div>
                  <dt>Already working with</dt>
                  <dd>{p.proof}</dd>
                </div>
              ) : null}
            </dl>

            <div className="pq-actions">
              <Link
                className="btn-p"
                href={`/start-a-project?topic=${p.topic}&note=${encodeURIComponent(p.say)}`}
              >
                Start with this problem <span aria-hidden="true">→</span>
              </Link>
              <Link className="pv-link" href={p.href}>
                See how it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
