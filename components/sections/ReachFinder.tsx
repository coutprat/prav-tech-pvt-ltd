"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  finderMedia,
  finderPresets,
  type FinderPriority,
  type FinderSpeed
} from "@/content/interconnect";

/** The slider runs on a log scale: 0.5 m to 2 km in even-feeling steps. */
const MIN_M = 0.5;
const MAX_M = 2000;
const toSlider = (m: number) => (Math.log(m / MIN_M) / Math.log(MAX_M / MIN_M)) * 1000;
const fromSlider = (v: number) => MIN_M * Math.pow(MAX_M / MIN_M, v / 1000);

function fmt(m: number) {
  if (m >= 1000) return `${(m / 1000).toFixed(m >= 1950 ? 0 : 1)} km`;
  if (m >= 10) return `${Math.round(m)} m`;
  return `${m.toFixed(1).replace(/\.0$/, "")} m`;
}

const PRIORITIES: { id: FinderPriority; label: string }[] = [
  { id: "power", label: "Lowest power" },
  { id: "cost", label: "Lowest cost" },
  { id: "latency", label: "Lowest latency" }
];

/**
 * "How far, how fast" → the medium we would start from.
 *
 * Every figure comes from content/interconnect.ts, which carries the
 * partner's published reach. It is a starting point for the conversation,
 * not a design: the page says so, and the button hands the inputs over.
 */
export function ReachFinder() {
  const uid = useId();
  const [metres, setMetres] = useState(5);
  const [speed, setSpeed] = useState<FinderSpeed>("800G");
  const [priority, setPriority] = useState<FinderPriority>("power");

  const { pick, others } = useMemo(() => {
    const fits = finderMedia
      .filter((m) => m.reach[speed] >= metres)
      .sort((a, b) => a.rank[priority] - b.rank[priority]);
    return { pick: fits[0], others: fits.slice(1, 4) };
  }, [metres, speed, priority]);

  const pct = (m: number) => `${Math.min(100, toSlider(Math.max(MIN_M, m)) / 10)}%`;
  const ask = `Link plan: ${fmt(metres)} at ${speed}, priority ${priority}${pick ? `, starting from ${pick.name}` : ""}.`;

  return (
    <div className="finder">
      <div className="finder-controls">
        <div className="finder-field">
          <label className="finder-label mono" htmlFor={`${uid}-d`}>
            Link distance <b className="finder-value">{fmt(metres)}</b>
          </label>
          <input
            id={`${uid}-d`}
            className="finder-range"
            type="range"
            min={0}
            max={1000}
            step={1}
            value={toSlider(metres)}
            onChange={(e) => setMetres(Number(fromSlider(Number(e.target.value)).toPrecision(2)))}
            aria-valuetext={fmt(metres)}
          />
          <ul className="finder-presets">
            {finderPresets.map((p) => (
              <li key={p.label}>
                <button
                  type="button"
                  className="finder-chip"
                  data-on={metres === p.m}
                  onClick={() => setMetres(p.m)}
                >
                  {p.label}
                  <span>{fmt(p.m)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="finder-row">
          <fieldset className="finder-seg">
            <legend className="finder-label mono">Speed</legend>
            {(["800G", "1.6T"] as const).map((s) => (
              <label key={s} data-on={speed === s}>
                <input
                  type="radio"
                  name={`${uid}-s`}
                  checked={speed === s}
                  onChange={() => setSpeed(s)}
                />
                {s}
              </label>
            ))}
          </fieldset>
          <fieldset className="finder-seg">
            <legend className="finder-label mono">Optimise for</legend>
            {PRIORITIES.map((p) => (
              <label key={p.id} data-on={priority === p.id}>
                <input
                  type="radio"
                  name={`${uid}-p`}
                  checked={priority === p.id}
                  onChange={() => setPriority(p.id)}
                />
                {p.label}
              </label>
            ))}
          </fieldset>
        </div>
      </div>

      {/* reach map: every medium's span on the same log axis, distance marked */}
      <div className="finder-map" aria-hidden="true">
        {finderMedia
          .filter((m) => m.reach[speed] > 0)
          .map((m) => (
            <div
              key={m.id}
              className="finder-bar"
              data-fit={m.reach[speed] >= metres}
              data-pick={pick?.id === m.id}
            >
              <span className="finder-bar-name mono">{m.name}</span>
              <span className="finder-bar-track">
                <span className="finder-bar-fill" style={{ width: pct(m.reach[speed]) }} />
              </span>
              <span className="finder-bar-reach mono">{fmt(m.reach[speed])}</span>
            </div>
          ))}
        <span className="finder-lane">
          <span className="finder-marker" style={{ left: pct(metres) }} />
        </span>
      </div>

      <div className="finder-result" aria-live="polite">
        {pick ? (
          <>
            <p className="finder-label mono">Start from</p>
            <h3 className="finder-pick">
              {pick.name} <span>{pick.long}</span>
            </h3>
            <p className="finder-why">{pick.why}</p>
            {others.length ? (
              <p className="finder-alt">
                Also reaches {fmt(metres)}: {others.map((o) => o.name).join(" · ")}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="finder-label mono">Beyond published reach</p>
            <h3 className="finder-pick">Coherent optics</h3>
            <p className="finder-why">
              Past {fmt(2000)} at {speed} you are into coherent optics, which are on the way. Talk to
              us about the route today.
            </p>
          </>
        )}
        <Link
          className="btn btn-primary"
          href={`/start-a-project?topic=photonics&note=${encodeURIComponent(ask)}`}
        >
          Get a written link plan
        </Link>
        <p className="finder-note">
          Indicative, from published maximum reach. Your link budget, cable build and thermals
          decide the final answer.
        </p>
      </div>
    </div>
  );
}
