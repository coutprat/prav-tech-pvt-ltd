import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";

/**
 * The signature, as film rather than as a document-workspace mockup.
 *
 * The observation text is invented and deliberately generic: it is not from
 * any real 483, and it names no real company, site or product.
 */
const PH_CHAPTERS: Chapter[] = [
  {
    kind: "statement",
    at: [0, 0.16],
    text: "An inspector writes one paragraph.",
    sub: "Answering it will take your quality team three weeks, and the answer has to survive being read back to you."
  },
  {
    kind: "marked",
    at: [0.16, 0.44],
    label: "Observation — illustrative",
    parts: [
      { text: "Written procedures for sampling are not " },
      { text: "consistently followed", mark: true },
      { text: ", and the records do not show the step was " },
      { text: "witnessed", mark: true },
      { text: " by a second analyst." }
    ],
    note: "Fictional text. Not from any real inspection, company or product."
  },
  {
    kind: "beats",
    at: [0.44, 0.76],
    beats: [
      { label: "Root cause · BR-2291", text: "The step was performed but not witnessed — the batch record has no field for it" },
      { label: "Correction · SOP-QC-014", text: "Analysts re-trained, the four Q3 batches re-reviewed" },
      { label: "Preventive · DEV-0471", text: "A witness signature field added, and tracked in the deviation log" }
    ]
  },
  {
    kind: "statement",
    at: [0.76, 0.9],
    text: "Every paragraph carries the record it rests on.",
    sub: "Not a model's recollection of a document. The document."
  },
  {
    kind: "statement",
    at: [0.9, 1.01],
    text: "Nothing is filed until QA signs.",
    sub: "In a GMP environment a wrong answer is worse than no answer, so the system drafts and a qualified person decides."
  }
];

import { Headline } from "@/components/ui/Headline";
import {
  SectionLabel,
  SpecTable,
  Disclaimer,
  CTASection
} from "@/components/ui/primitives";
import {
  pharmaDisclaimer,
  pharmaModules,
  pharmaPipeline,
  pharmaStandards,
  regulatedMarkets
} from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Pharma & Regulatory AI",
  description: "FDA 483 responses, CAPA, data integrity and inspection readiness. AI-drafted, expert-reviewed, and traceable to the evidence.",
  path: '/pharma',
  og: 'pharma'
});

export default function PharmaPage() {
  return (
    <div data-acc="pharma">
      <FilmSection
        id="ph-film"
        video={signatureVideo.pharma}
        chapters={PH_CHAPTERS}
        accent="var(--acc-pha)"
        label="An inspection observation becoming a response, with every paragraph linked to the record it rests on"
        caption="Illustrative. The observation is fictional and names no real inspection, company or product."
      />

      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">Pharma &amp; regulatory AI</SectionLabel>
          <Headline as="h1" className="display">
            Every line traces back to evidence.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            Quality teams do not need a model with opinions. They need a draft
            that shows its working, points at the record it came from, and waits
            for a qualified person to sign it.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- nexgen */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">Why us</SectionLabel>
          <Headline onScroll>AI built with the people who face the inspectors.</Headline>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <p className="lede">
                Praverse builds the AI. Nexgen Pharma Solutions brings
                inspection-floor practice — QMS, QA and QC, DMF filings in eCTD
                format, audit readiness, and inspection support across USFDA,
                EU-GMP, WHO-GMP, EDQM, ANVISA and MFDS (Korea).
              </p>
              <p className="body-2" style={{ marginTop: 24 }}>
                It is led by Ashwani Shrivastav, who also advises Praverse on
                quality systems. One engagement can cover audit readiness and
                the systems that keep you ready, without two vendors blaming
                each other.
              </p>
            </div>
            <ul className="why-list">
              <li>
                <h3>The draft is written by people who know the finding</h3>
                <p>
                  Not a general-purpose model guessing at what an investigator
                  wanted to see.
                </p>
              </li>
              <li>
                <h3>Review is done by the same practice</h3>
                <p>
                  The consultants who would sit with you in an inspection also
                  shape what the system drafts.
                </p>
              </li>
              <li>
                <h3>One accountable engagement</h3>
                <p>The software and the quality advice answer to each other.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- modules */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>The suite</SectionLabel>
          <Headline onScroll>Eight modules.</Headline>
          <p className="body-2" style={{ marginTop: 18 }}>
            Most teams start with 483 responses or inspection readiness, then add
            the rest as trust builds.
          </p>

          <ul className="tile-list">
            {pharmaModules.map((m) => (
              <li key={m.title} data-entry={m.entry}>
                {m.title}
                {m.entry ? <span className="tile-note">Usual entry point</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- pipeline */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Pipeline</SectionLabel>
          <Headline onScroll>Ingest to archive.</Headline>
          <ol className="flow">
            {pharmaPipeline.map((p) => (
              <li key={p} data-accent={p === "Review"}>
                {p}
              </li>
            ))}
          </ol>
          <p className="body-2" style={{ marginTop: 28 }}>
            Review is a stage, not a setting. Nothing leaves the pipeline without
            passing through it.
          </p>

          <p className="mono" style={{ marginTop: 48, color: "var(--ink-2)" }}>
            Designed around
          </p>
          <ul className="chip-list" style={{ marginTop: 14 }}>
            {pharmaStandards.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <div style={{ marginTop: 40 }}>
            <Disclaimer>{pharmaDisclaimer}</Disclaimer>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ regulated markets */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Built for regulated markets</SectionLabel>
          <Headline onScroll>Architecture, mapped to the rules.</Headline>
          <p className="body-2" style={{ marginTop: 18, marginBottom: 40 }}>
            Which architectural feature is designed to support which regime.
            This is a description of how the system is built — <strong>not</strong>{" "}
            a certification, an audit result, or a claim of compliance. Your
            qualification remains yours.
          </p>

          <SpecTable
            caption="Feature → regime it is designed to support"
            columns={regulatedMarkets.frameworks.map((f) => ({ key: f, head: f }))}
            rows={regulatedMarkets.rows.map((r) => ({
              head: r.feature,
              cells: r.support.map((yes, i) =>
                yes ? (
                  <span className="yes" key={i}>
                    <span aria-hidden="true">●</span>
                    <span className="sr-only">
                      Designed to support {regulatedMarkets.frameworks[i]}
                    </span>
                  </span>
                ) : (
                  <span key={i} aria-hidden="true" style={{ opacity: 0.35 }}>
                    —
                  </span>
                )
              )
            }))}
          />
        </div>
      </section>

      <CTASection
        title="Inspection coming?"
        body="Send us the scope. You get a written plan within two business days."
      />
    </div>
  );
}
