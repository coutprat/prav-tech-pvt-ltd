import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import { WeDoList } from "@/components/pv/WeDoList";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";
import {
  pharmaDisclaimer,
  pharmaModules,
  pharmaStandards,
  regulatedMarkets,
} from "@/content/company";
import {
  Card,
  CtaBand,
  Figure,
  Grid,
  LogoRow,
  Note,
  Section,
  SectionHead,
} from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";
import "./pharma.css";

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
    sub: "Answering it will take your quality team three weeks, and the answer has to survive being read back to you.",
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
      { text: " by a second analyst." },
    ],
    note: "Fictional text. Not from any real inspection, company or product.",
  },
  {
    kind: "beats",
    at: [0.44, 0.76],
    beats: [
      {
        label: "Root cause · BR-2291",
        text: "The step was performed but not witnessed — the batch record has no field for it",
      },
      {
        label: "Correction · SOP-QC-014",
        text: "Analysts re-trained, the four Q3 batches re-reviewed",
      },
      {
        label: "Preventive · DEV-0471",
        text: "A witness signature field added, and tracked in the deviation log",
      },
    ],
  },
  {
    kind: "statement",
    at: [0.76, 0.9],
    text: "Every paragraph carries the record it rests on.",
    sub: "Not a model's recollection of a document. The document.",
  },
  {
    kind: "statement",
    at: [0.9, 1.01],
    text: "Nothing is filed until QA signs.",
    sub: "In a GMP environment a wrong answer is worse than no answer, so the system drafts and a qualified person decides.",
  },
];

export const metadata: Metadata = pageMeta({
  title: "Pharma & Regulatory AI",
  description:
    "FDA 483 responses, CAPA, data integrity and inspection readiness. AI-drafted, expert-reviewed, and traceable to the evidence.",
  path: "/pharma",
  og: "pharma",
});

const A = "var(--acc-pha-ink)";
const nn = (i: number) => String(i + 1).padStart(2, "0");

export default function PharmaPage() {
  return (
    <div data-acc="pharma">
      <PageJsonLd path="/pharma" />
      <FilmSection
        id="ph-film"
        video={signatureVideo.pharma}
        chapters={PH_CHAPTERS}
        accent="var(--acc-pha)"
        label="An inspection observation becoming a response, with every paragraph linked to the record it rests on"
        caption="Illustrative. The observation is fictional and names no real inspection, company or product."
      />

      {/* ------------------------------------------------------- the response */}
      <Section accent="pha">
        <SectionHead
          as="h1"
          index="01"
          eyebrow="Pharma & regulatory AI"
          title={
            <>
              Every line traces back to <em>evidence</em>.
            </>
          }
          lede="Quality teams do not need a model with opinions. They need a draft that shows its working, points at the record it came from, and waits for a qualified person to sign it."
        />
        <Figure
          n="01"
          title="A 483 response, from observation to signature"
          caption="The pipeline every module runs through, shown on the illustrative observation from the film above. Root cause, correction and preventive action are each tied to a named record. Review is a stage, not a setting: nothing is filed until a qualified person signs."
        >
          <Flow
            accent={A}
            nodes={[
              {
                k: "Ingest",
                title: "The observation and its records",
                body: "The finding, read alongside the documents it touches.",
                tags: ["Batch record", "SOP", "Deviation log"],
              },
              {
                k: "Analyse",
                title: "Root cause, correction, prevention",
                body: "Each one tied to the record that supports it.",
              },
              {
                k: "Draft",
                title: "A response that cites",
                body: "Every paragraph carries the record it rests on.",
              },
              {
                k: "Review",
                title: "A qualified person signs",
                body: "QA approves, edits or rejects the draft.",
                gate: true,
                wait: "With QA",
                ok: "Signed",
              },
              {
                k: "Archive",
                title: "Filed, with its trail",
                body: "Who drafted, who reviewed, who signed — kept.",
              },
            ]}
            ledger={[
              {
                t: "Obs. 1",
                k: "Observation",
                v: "Sampling not witnessed by a second analyst — illustrative",
              },
              {
                t: "BR-2291",
                k: "Linked",
                v: "Root cause, correction and preventive action, each to its record",
              },
              {
                t: "QA",
                k: "Signed by",
                v: "A qualified person, before anything is filed",
              },
            ]}
          />
        </Figure>
        <div className="pv-offset">
          <div>
            <p className="pv-body">
              The same five stages sit under every module, from a 483 response
              to an OOS investigation. What changes is what is read; what does
              not change is that a person signs before it counts.
            </p>
            <p className="pha-k">Designed around</p>
            <ul className="pv-chips">
              {pharmaStandards.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <Note>{pharmaDisclaimer}</Note>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ nexgen */}
      <Section tone="raised" accent="pha">
        <SectionHead
          index="02"
          eyebrow="Why us"
          title={
            <>
              Built with the people who <em>face the inspectors</em>.
            </>
          }
          lede="Praverse builds the AI. Nexgen Pharma Solutions brings inspection-floor practice — QMS, QA and QC, DMF filings in eCTD format, audit readiness, and inspection support across USFDA, EU-GMP, WHO-GMP, EDQM, ANVISA and MFDS (Korea). It is led by Ashwani Shrivastav, who also advises Praverse on quality systems."
        />
        <Grid cols={3}>
          <Card
            n="01"
            title="Drafted by people who know the finding"
            accent="pha"
          >
            <p>
              Not a general-purpose model guessing at what an investigator
              wanted to see.
            </p>
          </Card>
          <Card n="02" title="Reviewed by the same practice" accent="pha">
            <p>
              The consultants who would sit with you in an inspection also shape
              what the system drafts.
            </p>
          </Card>
          <Card n="03" title="One accountable engagement" accent="pha">
            <p>
              Audit readiness and the systems that keep you ready, from one
              engagement — the software and the quality advice answer to each
              other.
            </p>
          </Card>
        </Grid>
        <div className="pha-logos">
          <LogoRow
            items={[
              {
                name: "Nexgen Pharma Solutions",
                src: "/partners/nexgen-on-dark.webp",
                role: "Quality & regulatory consulting",
                w: 734,
                h: 72,
              },
              {
                name: "SWATI Spentose",
                src: "/partners/swati-on-dark.webp",
                role: "Pharma advisory · V-Group, est. 1952",
                w: 143,
              },
            ]}
          />
        </div>
      </Section>

      {/* ----------------------------------------------------------- modules */}
      <Section accent="pha">
        <SectionHead
          index="03"
          eyebrow="The suite"
          title={
            <>
              Eight modules, <em>one review stage</em>.
            </>
          }
          lede="Most teams start with 483 responses or inspection readiness, then add the rest as trust builds."
        />
        <Grid cols={4}>
          {pharmaModules.map((m, i) => (
            <Card
              key={m.title}
              n={nn(i)}
              title={m.title}
              accent="pha"
              meta={m.entry ? <span>Usual entry point</span> : undefined}
            />
          ))}
        </Grid>
      </Section>

      {/* ------------------------------------------------- regulated markets */}
      <Section tone="raised" accent="pha">
        <SectionHead
          index="04"
          eyebrow="Built for regulated markets"
          title={
            <>
              Architecture, <em>mapped to the rules</em>.
            </>
          }
          lede="Which architectural feature is designed to support which regime. This describes how the system is built — not a certification, an audit result, or a claim of compliance. Your qualification remains yours."
        />
        <Figure
          n="02"
          title="Feature → regime it is designed to support"
          caption="A filled mark means the feature is designed to support that regime; a dash means it is not claimed. “Designed to support” is the whole claim — qualification and validation remain with you."
        >
          <div className="pha-matrix-wrap">
            <table className="pha-matrix">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {regulatedMarkets.frameworks.map((f) => (
                    <th scope="col" key={f}>
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regulatedMarkets.rows.map((r) => (
                  <tr key={r.feature}>
                    <th scope="row">{r.feature}</th>
                    {r.support.map((yes, i) => (
                      <td key={regulatedMarkets.frameworks[i]}>
                        {yes ? (
                          <span className="pha-yes">
                            <span aria-hidden="true">●</span>
                            <span className="sr-only">
                              Designed to support{" "}
                              {regulatedMarkets.frameworks[i]}
                            </span>
                          </span>
                        ) : (
                          <span className="pha-no">
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">Not claimed</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone width: the same data, one feature per row. */}
          <ul className="pha-matrix-list">
            {regulatedMarkets.rows.map((r) => (
              <li key={r.feature}>
                <h3>{r.feature}</h3>
                <ul className="pv-chips">
                  {regulatedMarkets.frameworks
                    .filter((_, i) => r.support[i])
                    .map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </Figure>
      </Section>

      {/* ------------------------------------------------------- we build */}
      <Section accent="pha">
        <SectionHead
          index="05"
          eyebrow="What we build"
          title={
            <>
              Regulatory AI, <em>built for the inspection</em>.
            </>
          }
          lede="Specific systems our engineers have built or are building now. Client work is described without names; the tag shows where each one stands today."
        />
        <WeDoList items={weDo.pha} />
      </Section>

      <CtaBand
        title={
          <>
            Inspection <em>coming</em>?
          </>
        }
        body="Send us the scope. You get a written plan within two business days."
      />
    </div>
  );
}
