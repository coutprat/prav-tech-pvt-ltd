import type { CSSProperties, ReactNode } from "react";

/**
 * A process figure: nodes joined by links that carry packets in the direction
 * the work moves. One node may be a gate — the point where a named person has
 * to approve — and the link after it only carries packets once the gate has
 * shown "approved", so the figure states the rule rather than decorating it.
 *
 * Optional ledger rows underneath record what the system wrote down.
 *
 * HTML, not SVG, so the text stays legible at phone width: the row turns into
 * a column under 900px and the links turn vertical with it. Motion is CSS,
 * started when ScrollMotion adds .is-in to the enclosing .pv-fig; with reduced
 * motion the figure is simply its finished state.
 */
export type FlowNode = {
  k: string;
  title: string;
  body?: ReactNode;
  gate?: boolean;
  /** For a gate: what it shows while waiting, and once approved. */
  wait?: string;
  ok?: string;
  /** Short tags under the node, e.g. source documents. */
  tags?: string[];
};

export function Flow({
  nodes,
  ledger,
  accent = "rgba(255,255,255,0.92)",
  cycle = 7,
}: {
  nodes: FlowNode[];
  ledger?: { t: string; k: string; v: string }[];
  accent?: string;
  /** Seconds per loop of the gate animation. */
  cycle?: number;
}) {
  const gateAt = nodes.findIndex((n) => n.gate);
  return (
    <div
      className="pv-flow"
      style={{ "--a": accent, "--cy": `${cycle}s` } as CSSProperties}
      data-gated={gateAt >= 0 || undefined}
    >
      <ol className="pv-flow-row">
        {nodes.map((n, i) => (
          <li
            key={n.k}
            className="pv-flow-step"
            data-gate={n.gate || undefined}
            data-after-gate={gateAt >= 0 && i > gateAt ? "" : undefined}
            style={{ "--i": i } as CSSProperties}
          >
            {i > 0 ? (
              <span
                className="pv-flow-link"
                aria-hidden="true"
                data-post={gateAt >= 0 && i > gateAt ? "" : undefined}
              >
                <i />
                <i />
                <i />
              </span>
            ) : null}
            <div className="pv-flow-node">
              <span className="pv-flow-k">{n.k}</span>
              <span className="pv-flow-t">{n.title}</span>
              {n.body ? <span className="pv-flow-b">{n.body}</span> : null}
              {n.gate ? (
                <span className="pv-flow-gate" aria-hidden="true">
                  <span className="pv-flow-wait">
                    {n.wait ?? "Waiting for approval"}
                  </span>
                  <span className="pv-flow-ok">{n.ok ?? "Approved"}</span>
                </span>
              ) : null}
              {n.tags ? (
                <span className="pv-flow-tags">
                  {n.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {ledger ? (
        <div className="pv-ledger">
          <p className="pv-ledger-h mono">Audit trail · written as it runs</p>
          <ul>
            {ledger.map((r, i) => (
              <li key={r.k} style={{ "--i": i } as CSSProperties}>
                <span className="mono">{r.t}</span>
                <span className="pv-ledger-k">{r.k}</span>
                <span className="pv-ledger-v">{r.v}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
