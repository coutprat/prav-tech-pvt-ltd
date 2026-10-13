"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { FileText, Table, Warning, SealCheck, Quotes } from "@phosphor-icons/react";

/**
 * Pharma signature — a 483 observation becoming a defensible response.
 *
 * Deliberately the opposite visual language to the Enterprise AI console. That
 * page shows a dark machine running; this one shows paper, because that is what
 * this buyer lives in. A QA head preparing for an inspection is not thinking
 * about agents and tool calls — they are thinking about whether every sentence
 * they are about to file can be stood up in a room.
 *
 * So the screen is a response workspace: the observation on the left, the
 * response assembling on the right, and each paragraph arriving with the record
 * it rests on. The evidence rail underneath lights up as each record is cited,
 * and nothing is filed until QA signs.
 *
 * The observation is invented and deliberately generic. It is not from any real
 * 483, and it names no real company, site or product.
 */
type Record_ = {
  id: string;
  label: string;
  sub: string;
  Icon: typeof FileText;
};

const RECORDS: Record_[] = [
  { id: "sop", label: "SOP-QC-014", sub: "Sampling procedure · §4.2", Icon: FileText },
  { id: "br", label: "BR-2291", sub: "Batch record · Q3", Icon: Table },
  { id: "dev", label: "DEV-0471", sub: "Deviation log", Icon: Warning }
];

/** Each response paragraph names the record it rests on. */
const RESPONSE = [
  {
    head: "Root cause",
    body: "The sampling step was performed but not witnessed, because the batch record template carries no witness field for this operation.",
    cite: "br"
  },
  {
    head: "Correction",
    body: "Shift analysts re-trained against SOP-QC-014 §4.2; the four Q3 batches identified have been re-reviewed.",
    cite: "sop"
  },
  {
    head: "Preventive action",
    body: "A witness signature field is added to the batch record template, and the deviation log is amended to track it.",
    cite: "dev"
  }
];

export function ResponseBuilder() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        gsap.set(q(".rb-mark"), { backgroundSize: "100% 100%" });
        gsap.set([q(".rb-para"), q(".rb-sign")], { opacity: 1, y: 0 });
        gsap.set(q(".rb-record"), { "--lit": 1 });
        return;
      }

      gsap.set(q(".rb-mark"), { backgroundSize: "0% 100%" });
      gsap.set([q(".rb-para"), q(".rb-sign")], { opacity: 0, y: 12 });
      gsap.set(q(".rb-record"), { "--lit": 0 });

      let tl: gsap.core.Timeline | null = null;
      const cancel = afterPaint(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=360%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // the inspector's words land first
        tl.to(q(".rb-mark"), {
          backgroundSize: "100% 100%",
          duration: 0.5,
          stagger: 0.22,
          ease: "power2.out"
        });

        // then the response assembles, each paragraph lighting its record
        RESPONSE.forEach((r, i) => {
          tl!
            .to(q(`.rb-para-${i}`), { opacity: 1, y: 0, duration: 0.45 }, "+=0.25")
            .to(q(`.rb-record-${r.cite}`), { "--lit": 1, duration: 0.35 }, "<");
        });

        // and QA signs it
        tl.to(q(".rb-sign"), { opacity: 1, y: 0, duration: 0.5 }, "+=0.3");
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
      className="rb"
      ref={root}
      aria-label="An inspection observation becoming a response, with every paragraph linked to the record it rests on"
    >
      <div className="rb-stage">
        <div className="rb-grid">
          {/* ------------------------------------------- the observation */}
          <article className="rb-doc rb-doc-obs">
            <p className="mono rb-eyebrow">
              <Quotes size={12} weight="fill" /> Observation — illustrative
            </p>
            <p className="rb-obs-text">
              Written procedures for sampling are not{" "}
              <mark className="rb-mark">consistently followed</mark>, and the
              associated records do not show that the step was{" "}
              <mark className="rb-mark">witnessed</mark> by a second analyst for
              the <mark className="rb-mark">batches reviewed</mark>.
            </p>
            <p className="mono rb-fine">
              Fictional text. Not from any real inspection, company or product.
            </p>
          </article>

          {/* ---------------------------------------------- the response */}
          <article className="rb-doc rb-doc-res">
            <p className="mono rb-eyebrow">Response — drafted, awaiting QA</p>
            <ol className="rb-paras">
              {RESPONSE.map((r, i) => (
                <li className={`rb-para rb-para-${i}`} key={r.head}>
                  <h3>{r.head}</h3>
                  <p>{r.body}</p>
                  <span className="rb-cite mono">
                    <Quotes size={10} weight="fill" />
                    {RECORDS.find((x) => x.id === r.cite)?.label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="rb-sign">
              <SealCheck size={20} weight="duotone" aria-hidden="true" />
              <span>
                <b>Approved by QA</b>
                <small>
                  Every paragraph above carries the record it rests on. Nothing
                  is filed until a qualified person signs.
                </small>
              </span>
            </div>
          </article>
        </div>

        {/* ------------------------------------------------ evidence rail */}
        <div className="rb-rail">
          <p className="mono rb-eyebrow">Evidence cited</p>
          <ul>
            {RECORDS.map((r) => (
              <li className={`rb-record rb-record-${r.id}`} key={r.id}>
                <span className="rb-record-icon" aria-hidden="true">
                  <r.Icon size={17} weight="duotone" />
                </span>
                <span>
                  <b className="mono">{r.label}</b>
                  <small>{r.sub}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
