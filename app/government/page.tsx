import type { Metadata } from "next";
import { brief } from "@/lib/answers";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { govFaq, govOffers, govPrinciples } from "@/content/government";
import { Verify, isWithheld } from "@/components/ui/Verify";
import { CtaBand, Faq, Figure, PageHero, Section, SectionHead } from "@/components/pv/kit";
import { BigSteps, CapWall, Statement } from "@/components/pv/kit3";
import { GovVisual } from "@/components/pv/LineVisuals";
import { Flow } from "@/components/pv/Flow";
import type { VerifyId } from "@/content/verify";

export const metadata: Metadata = pageMeta({
  title: "AI for Government & Public Sector",
  description:
    "Sovereign and air-gapped AI, inspection and audit intelligence, public-health platforms and e-governance document automation for departments, regulators and PSUs.",
  path: "/government",
  og: "government",
});

const CAPABILITY = `mailto:${site.enquiryEmail}?subject=${encodeURIComponent("Capability statement request")}`;
const RFP = `mailto:${site.enquiryEmail}?subject=${encodeURIComponent("RFP / EOI for Praverse Tech")}`;

/** Credentials shown only once confirmed in content/verify.ts. */
const CREDENTIALS: { id: VerifyId; label: string }[] = [
  { id: "cin", label: "Company registration" },
  { id: "gstin", label: "GST registration" },
  { id: "registered-address", label: "Registered office" },
  { id: "dpiit-startup", label: "Startup India" },
  { id: "udyam-msme", label: "MSME" },
  { id: "gem-seller", label: "GeM" },
  { id: "iso-27001", label: "Information security" },
  { id: "cert-in-audit", label: "Security audit" },
];

export default function GovernmentPage() {
  const shown = CREDENTIALS.filter(
    (c) => process.env.NODE_ENV === "development" || !isWithheld(c.id),
  );
  return (
    <>
      <PageJsonLd path="/government" />
      <PageHero
        eyebrow={brief("/government").lead}
        title={
          <>
            AI that a public office can <em>answer for</em>.
          </>
        }
        lede="Sovereign deployments, inspection intelligence, public-health platforms and document automation for departments, regulators and public-sector undertakings — engineered so that a named officer decides, the record is complete, and citizen data stays on the department's own infrastructure."
        actions={
          <>
            <a className="btn-p" href={CAPABILITY}>
              Request a capability statement <span aria-hidden="true">→</span>
            </a>
            <a className="btn-g" href={RFP}>
              Send us an RFP
            </a>
          </>
        }
        meta={[
          "On-premise & air-gapped",
          "Human approval by design",
          `Built in ${company.hq}`,
        ]}
        visual={<GovVisual />}
      />

      {/* ---------------------------------------------------------- offers */}
      <Section>
        <SectionHead
          index="01"
          eyebrow="What we deliver"
          title={
            <>
              Programme-scale work across <em>all five lines</em>.
            </>
          }
          lede="Government is not a separate product line. It is where every line we run — enterprise AI, regulatory AI, healthcare AI, interconnect and sovereign compute — meets the strictest requirements on accountability and data."
        />
        <CapWall
          items={govOffers.map((o) => ({
            title: o.title,
            body: o.body,
            kicker: "Programme",
            colour: "var(--gold)",
            extra: (
              <Link className="pv-link" href={o.line.href}>
                {o.line.label} <span aria-hidden="true">→</span>
              </Link>
            ),
          }))}
        />
      </Section>

      {/* ------------------------------------------------------- programme */}
      <Section tone="raised">
        <Statement
          eyebrow="The principle"
          lead="Public money deserves evidence before rollout."
          rest="One workflow, the department’s own data, and criteria agreed in writing — then scale."
        />
        <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }} />
        <SectionHead
          index="02"
          eyebrow="How a programme runs"
          title={
            <>
              Pilot, evaluate, <em>then</em> scale.
            </>
          }
          lede="Public money deserves evidence before rollout. Every programme starts on one workflow and the department's own data, and only scales after it has passed criteria agreed in writing."
        />
        <Figure
          n="01"
          title="From pilot to statewide rollout"
          caption="The gate is the evaluation: nothing scales until the department's own reviewers have signed off the pilot against agreed criteria. The record of that decision travels with the programme."
        >
          <Flow
            accent="rgba(255,255,255,0.92)"
            nodes={[
              {
                k: "Scope",
                title: "One workflow, written down",
                body: "Problem, data, success criteria and risks — agreed before any build.",
                tags: ["Plan", "Criteria"],
              },
              {
                k: "Pilot",
                title: "Built on your data",
                body: "On your premises or an approved environment.",
              },
              {
                k: "Evaluate",
                title: "Department sign-off",
                body: "Tested against the agreed criteria.",
                gate: true,
                wait: "Under evaluation",
                ok: "Approved to scale",
              },
              {
                k: "Scale",
                title: "Phased rollout",
                body: "Office by office, with training and handover.",
              },
              {
                k: "Operate",
                title: "Supported and audited",
                body: "Every decision on the record.",
              },
            ]}
          />
        </Figure>
      </Section>

      {/* ------------------------------------------------------- principles */}
      <Section>
        <SectionHead
          index="03"
          eyebrow="Non-negotiables"
          title={
            <>
              Four things every public deployment <em>gets</em>.
            </>
          }
        />
        <BigSteps items={govPrinciples.map((p) => ({ title: p.title, body: p.body }))} />
      </Section>

      {/* ------------------------------------------------------ credentials */}
      <Section tone="raised">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="04"
              eyebrow="For procurement"
              title={
                <>
                  The details your <em>vendor form</em> asks for.
                </>
              }
              lede="Registration details are below. For a capability statement, security questionnaire or RFP response, write to us and you will hear back within two business days."
            />
          </div>
          <div>
            <dl className="gov-creds">
              <div>
                <dt>Legal name</dt>
                <dd>{company.legalName}</dd>
              </div>
              {shown.map((c) => (
                <div key={c.id}>
                  <dt>{c.label}</dt>
                  <dd>
                    <Verify id={c.id} />
                  </dd>
                </div>
              ))}
              <div>
                <dt>Procurement contact</dt>
                <dd>
                  <a className="pv-link" href={RFP}>
                    {site.enquiryEmail}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="pv-body" style={{ marginTop: 28 }}>
              We do not claim empanelments, certifications or public-sector
              references we cannot show you. Our{" "}
              <Link className="pv-link" href="/trust">
                trust page
              </Link>{" "}
              sets out how we handle data and decisions today.
            </p>
            <div className="pv-actions" style={{ marginTop: 28 }}>
              <a className="btn-p" href={CAPABILITY}>
                Request a capability statement <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------- FAQ */}
      <Section>
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="05"
              eyebrow="Questions"
              title={
                <>
                  Asked by <em>public buyers</em>.
                </>
              }
            />
          </div>
          <Faq items={govFaq} />
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Have a tender or a <em>programme</em> in mind?
          </>
        }
        body="Send the RFP, the expression of interest or just the problem. You get a written response within two business days."
        primary={{ href: "/start-a-project", label: "Start a project" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
