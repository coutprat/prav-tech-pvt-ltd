import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { EvidenceThread } from "@/components/sections/EvidenceThread";
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
      <EvidenceThread />

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
