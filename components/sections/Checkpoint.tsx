"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import {
  FilePdf,
  Table,
  ChatCircleText,
  CheckCircle,
  CircleNotch,
  Quotes,
  PencilSimple,
  XCircle
} from "@phosphor-icons/react";

/**
 * Enterprise AI signature — "the checkpoint", as product UI.
 *
 * Icon flowcharts say nothing about what a system is actually like to use.
 * This is a stylised version of the real thing: named source documents, an
 * agent panel whose steps tick over with citation chips, a reviewer card with
 * Approve / Edit / Reject, and an audit log that types itself.
 *
 * Meaning: human-in-the-loop is the architecture, not a setting. Nothing
 * passes the gate until a person clicks Approve, and the ledger records it.
 *
 * All names and numbers here are illustrative and clearly generic.
 */
const SOURCES = [
  { id: "sop", name: "SOP-QA-014.pdf", meta: "214 pages", kind: "pdf" as const },
  { id: "ticket", name: "Ticket #4821", meta: "Support thread", kind: "ticket" as const },
  { id: "sheet", name: "Batch log Q3.xlsx", meta: "1,204 rows", kind: "sheet" as const }
];

const STEPS = [
  { label: "Reading 214 pages", cite: "SOP-QA-014" },
  { label: "Cross-checking 3 sources", cite: "Ticket #4821" },
  { label: "Drafting summary", cite: "Batch log Q3" }
];

const LEDGER = [
  ["09:41", "k.rao@", "asked", "Is sampling witnessed for Q3 batches?"],
  ["09:41", "agent", "surfaced", "4 records, 2 flagged"],
  ["09:43", "s.mehta@", "approved", "Draft sent to QA review"]
];

function SourceIcon({ kind }: { kind: "pdf" | "ticket" | "sheet" }) {
  const common = { size: 18, weight: "duotone" as const };
  if (kind === "pdf") return <FilePdf {...common} />;
  if (kind === "sheet") return <Table {...common} />;
  return <ChatCircleText {...common} />;
}

export function Checkpoint() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        gsap.set([q(".cp-step"), q(".cp-row"), q(".cp-chip")], { opacity: 1, y: 0 });
        gsap.set(q(".cp-step"), { "--done": 1 });
        gsap.set(q(".cp-cursor"), { opacity: 0 });
        gsap.set(q(".cp-gate"), { borderColor: "var(--acc-ent-ink)" });
        gsap.set(q(".cp-approve"), { backgroundColor: "var(--acc-ent-ink)", color: "#fff" });
        return;
      }

      gsap.set([q(".cp-step"), q(".cp-row"), q(".cp-chip")], { opacity: 0, y: 8 });
      gsap.set(q(".cp-cursor"), { opacity: 0, x: 0, y: 0 });

      let tl: gsap.core.Timeline | null = null;
      const cancel = afterPaint(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // sources arrive
        tl.to(q(".cp-source"), { opacity: 1, y: 0, duration: 0.5, stagger: 0.25 });

        // the agent works through its steps, citing as it goes
        STEPS.forEach((_, i) => {
          tl!
            .to(q(`.cp-step-${i}`), { opacity: 1, y: 0, duration: 0.4 }, "+=0.15")
            .to(q(`.cp-step-${i}`), { "--done": 1, duration: 0.4 }, "+=0.5")
            .to(q(`.cp-chip-${i}`), { opacity: 1, y: 0, duration: 0.3 }, "<");
        });

        // the cursor moves to Approve and clicks — nothing passes before this
        tl.to(q(".cp-cursor"), { opacity: 1, duration: 0.2 }, "+=0.2")
          .to(q(".cp-cursor"), { x: 0, y: 0, duration: 0.6, ease: "power2.inOut" })
          .to(q(".cp-approve"), { scale: 0.96, duration: 0.12 })
          .to(q(".cp-approve"), {
            scale: 1,
            backgroundColor: "var(--acc-ent-ink)",
            color: "#ffffff",
            duration: 0.25
          })
          .to(q(".cp-gate"), { borderColor: "var(--acc-ent-ink)", duration: 0.3 }, "<")
          .to(q(".cp-cursor"), { opacity: 0, duration: 0.3 });

        // the ledger types itself
        tl.to(q(".cp-row"), { opacity: 1, y: 0, duration: 0.35, stagger: 0.4 }, "+=0.1");
      });

      return () => {
        cancel();
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    },
    { scope: root }
  );

  return (
    <section
      className="cp"
      ref={root}
      aria-label="Documents reach an agent, stop at a human reviewer, and are recorded in an audit log"
    >
      <div className="cp-stage wrap">
        <div className="cp-ui">
          {/* --- sources ------------------------------------------------ */}
          <div className="cp-col">
            <p className="cp-col-head mono">Your documents</p>
            {SOURCES.map((s) => (
              <div className="cp-source" key={s.id}>
                <span className="cp-source-icon" data-kind={s.kind}>
                  <SourceIcon kind={s.kind} />
                </span>
                <span>
                  <b>{s.name}</b>
                  <small>{s.meta}</small>
                </span>
              </div>
            ))}
          </div>

          {/* --- agent panel -------------------------------------------- */}
          <div className="cp-panel">
            <div className="cp-panel-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p className="mono">Praverse agent</p>
            </div>
            <div className="cp-panel-body">
              {STEPS.map((s, i) => (
                <div className={`cp-step cp-step-${i}`} key={s.label}>
                  <span className="cp-step-mark" aria-hidden="true">
                    <CircleNotch size={15} weight="duotone" className="cp-spin" />
                    <CheckCircle size={15} weight="fill" className="cp-tick" />
                  </span>
                  <span className="cp-step-label">{s.label}</span>
                  <span className={`cp-chip cp-chip-${i}`}>
                    <Quotes size={11} weight="fill" />
                    {s.cite}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* --- human gate --------------------------------------------- */}
          <div className="cp-gate">
            <p className="cp-col-head mono">Human review</p>
            <div className="cp-reviewer">
              <span className="cp-avatar" aria-hidden="true">
                SM
              </span>
              <span>
                <b>QA reviewer</b>
                <small>Must approve before anything is sent</small>
              </span>
            </div>
            <div className="cp-actions">
              <button type="button" className="cp-approve" tabIndex={-1}>
                <CheckCircle size={14} weight="fill" /> Approve
              </button>
              <button type="button" className="cp-btn" tabIndex={-1}>
                <PencilSimple size={14} weight="duotone" /> Edit
              </button>
              <button type="button" className="cp-btn" tabIndex={-1}>
                <XCircle size={14} weight="duotone" /> Reject
              </button>
            </div>
            <span className="cp-cursor" aria-hidden="true" />
          </div>
        </div>

        {/* --- audit log ------------------------------------------------ */}
        <div className="cp-ledger">
          <p className="mono cp-ledger-head">Audit log</p>
          <table>
            <tbody>
              {LEDGER.map((r) => (
                <tr className="cp-row" key={r.join()}>
                  <td className="num">{r[0]}</td>
                  <td className="num">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
