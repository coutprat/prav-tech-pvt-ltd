"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { signatureVideo } from "@/content/media";
import {
  FilePdf,
  Database,
  ChatsCircle,
  PencilSimpleLine,
  CheckCircle,
  XCircle,
  PencilSimple,
  ShieldCheck,
  Clock
} from "@phosphor-icons/react";

/**
 * Enterprise AI signature — an agent run, in the console you would watch it in.
 *
 * Not a flow diagram. Buyers at this level have seen enough boxes and arrows to
 * distrust them; what they have not seen is what the thing looks like while it
 * is running against their own stack. So this is the trace: a real trigger, the
 * tools the agent reached for, what each returned, how long each took — and
 * then the part that matters. It stops. Nothing is sent until a named person
 * clicks Approve, and the run is written to an audit log either way.
 *
 * The pivot is deliberate and visual: everything in the left column is the
 * machine working, everything in the right needed a human. That is the
 * architecture rather than a setting, and it is the argument of this whole page
 * in one screen.
 *
 * Every name, number and document here is illustrative and plainly generic.
 */
type Step = {
  verb: string;
  Icon: typeof FilePdf;
  target: string;
  result: string;
  ms: number;
};

const STEPS: Step[] = [
  {
    verb: "read",
    Icon: FilePdf,
    target: "SOP-QA-014.pdf",
    result: "214 pages · 3 relevant sections",
    ms: 2140
  },
  {
    verb: "query",
    Icon: Database,
    target: "batch_records",
    result: "1,204 rows · 4 flagged",
    ms: 310
  },
  {
    verb: "search",
    Icon: ChatsCircle,
    target: "support history",
    result: "7 similar tickets · 2 resolved this way",
    ms: 480
  },
  {
    verb: "draft",
    Icon: PencilSimpleLine,
    target: "response",
    result: "412 words · 3 citations attached",
    ms: 3620
  }
];

const LEDGER = [
  ["09:41:02", "k.rao@", "opened", "Ticket #4821"],
  ["09:41:04", "agent", "ran", "4 tools · 6.55s"],
  ["09:43:17", "s.mehta@", "approved", "Response sent"]
];

export function AgentConsole() {
  const root = useRef<HTMLDivElement>(null);
  /** 0..1 through the optional background clip; written on the ticker. */
  const clipRef = useRef(0);
  const film = signatureVideo.enterpriseAi;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        gsap.set([q(".ac-step"), q(".ac-row"), q(".ac-gate")], { opacity: 1, y: 0 });
        gsap.set(q(".ac-step"), { "--done": 1 });
        gsap.set(q(".ac-bar-fill"), { scaleX: 1 });
        gsap.set(q(".ac-approve"), {
          backgroundColor: "var(--acc-ent-bright)",
          color: "#0b1020"
        });
        gsap.set(q(".ac-cursor"), { opacity: 0 });
        return;
      }

      gsap.set([q(".ac-step"), q(".ac-row")], { opacity: 0, y: 10 });
      gsap.set(q(".ac-gate"), { opacity: 0, y: 16 });
      gsap.set(q(".ac-cursor"), { opacity: 0 });
      gsap.set(q(".ac-bar-fill"), { scaleX: 0, transformOrigin: "left center" });

      let tl: gsap.core.Timeline | null = null;
      const cancel = afterPaint(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=340%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // The optional background clip is scrubbed by this same scroll, so
            // the footage and the interface can never drift apart.
            onUpdate: (self) => {
              clipRef.current = self.progress;
            }
          }
        });

        // the agent works, one tool at a time
        STEPS.forEach((_, i) => {
          tl!
            .to(q(`.ac-step-${i}`), { opacity: 1, y: 0, duration: 0.4 }, "+=0.12")
            .to(q(`.ac-step-${i} .ac-bar-fill`), { scaleX: 1, duration: 0.5 }, "<")
            .to(q(`.ac-step-${i}`), { "--done": 1, duration: 0.3 });
        });

        // then it stops
        tl.to(q(".ac-gate"), { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
          .to(q(".ac-cursor"), { opacity: 1, duration: 0.2 })
          .to(q(".ac-approve"), { scale: 0.96, duration: 0.12 }, "+=0.3")
          .to(q(".ac-approve"), {
            scale: 1,
            backgroundColor: "var(--acc-ent-bright)",
            color: "#0b1020",
            duration: 0.25
          })
          .to(q(".ac-cursor"), { opacity: 0, duration: 0.25 }, "<")
          .to(q(".ac-gate"), { borderColor: "var(--acc-ent-bright)", duration: 0.3 }, "<");

        // and the log records what happened
        tl.to(q(".ac-row"), { opacity: 1, y: 0, duration: 0.3, stagger: 0.35 }, "+=0.1");
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
      className="ac"
      ref={root}
      aria-label="An agent run: four tool calls, a human approval gate, and the audit entry"
    >
      {film ? (
        <div className="ac-film" aria-hidden="true">
          <ScrubVideo
            className="ac-film-video"
            src={film.src}
            srcMobile={film.srcMobile}
            poster={film.poster}
            progressRef={clipRef}
            alt={film.alt}
          />
          <span className="ac-film-scrim" />
        </div>
      ) : null}

      <div className="ac-stage">
        <div className="ac-shell">
          {/* ------------------------------------------------- title bar */}
          <div className="ac-bar" aria-hidden="true">
            <span className="ac-dots">
              <i />
              <i />
              <i />
            </span>
            <p className="mono">praverse · agent run</p>
            <span className="ac-live">
              <i />
              live
            </span>
          </div>

          <div className="ac-body">
            {/* ----------------------------------------------- the run */}
            <div className="ac-run">
              <div className="ac-trigger">
                <p className="mono ac-eyebrow">Trigger</p>
                <p className="ac-trigger-main">
                  Ticket #4821 —{" "}
                  <span>&ldquo;Is sampling witnessed for Q3 batches?&rdquo;</span>
                </p>
                <p className="mono ac-trigger-meta">
                  queue: quality · opened by k.rao@ · 09:41
                </p>
              </div>

              <ol className="ac-steps">
                {STEPS.map((s, i) => (
                  <li className={`ac-step ac-step-${i}`} key={s.target}>
                    <span className="ac-step-icon" aria-hidden="true">
                      <s.Icon size={16} weight="duotone" />
                    </span>
                    <span className="ac-step-main">
                      <span className="ac-step-head">
                        <b className="mono">{s.verb}</b>
                        <code>{s.target}</code>
                        <span className="mono ac-step-ms">
                          <Clock size={11} weight="bold" />
                          {(s.ms / 1000).toFixed(2)}s
                        </span>
                      </span>
                      <span className="ac-bar-track" aria-hidden="true">
                        <span className="ac-bar-fill" />
                      </span>
                      <span className="ac-step-result">{s.result}</span>
                    </span>
                    <CheckCircle
                      size={16}
                      weight="fill"
                      className="ac-step-tick"
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ol>
            </div>

            {/* ---------------------------------------------- the gate */}
            <aside className="ac-side">
              <div className="ac-gate">
                <p className="mono ac-eyebrow">
                  <ShieldCheck size={13} weight="duotone" /> Approval required
                </p>
                <p className="ac-gate-line">
                  The agent has drafted a response. It is not sent until a
                  reviewer approves it.
                </p>
                <div className="ac-reviewer">
                  <span className="ac-avatar" aria-hidden="true">
                    SM
                  </span>
                  <span>
                    <b>QA reviewer</b>
                    <small>Named approver for this queue</small>
                  </span>
                </div>
                <div className="ac-actions">
                  <button type="button" className="ac-approve" tabIndex={-1}>
                    <CheckCircle size={14} weight="fill" /> Approve
                  </button>
                  <button type="button" className="ac-btn" tabIndex={-1}>
                    <PencilSimple size={14} weight="duotone" /> Edit
                  </button>
                  <button type="button" className="ac-btn" tabIndex={-1}>
                    <XCircle size={14} weight="duotone" /> Reject
                  </button>
                </div>
                <span className="ac-cursor" aria-hidden="true" />
              </div>

              <div className="ac-ledger">
                <p className="mono ac-eyebrow">Audit log</p>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Time</th>
                      <th scope="col">Who</th>
                      <th scope="col">Action</th>
                      <th scope="col">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEDGER.map((r) => (
                      <tr className="ac-row" key={r.join()}>
                        <td className="mono">{r[0]}</td>
                        <td className="mono">{r[1]}</td>
                        <td>{r[2]}</td>
                        <td>{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </aside>
          </div>
        </div>

        <p className="ac-note mono">
          Illustrative run. Names, documents and timings are generic examples.
        </p>
      </div>
    </section>
  );
}
