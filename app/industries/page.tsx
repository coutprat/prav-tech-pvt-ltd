import type { Metadata } from "next";
import { brief } from "@/lib/answers";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { company } from "@/content/company";
import { CtaBand, Section } from "@/components/pv/kit";
import { IndustriesBento, bentoItems } from "@/components/pv/IndustriesBento";
import { SectorPrism } from "@/components/pv/SectorPrism";

export const metadata: Metadata = pageMeta({
  title: "AI Solutions by Industry, India",
  description:
    "AI development for banking, manufacturing, retail, logistics, energy, agritech, education, legal, real estate, telecom, media and hospitality — from Vadodara, India.",
  path: "/industries",
  og: "industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageJsonLd path="/industries" />
      <section className="ind-hero">
        <div className="wrap ind-hero-grid">
          <div>
            <h1 className="pv-h1-group">
              <span className="pv-eyebrow">{brief("/industries").lead}</span>
              <span className="pv-h1">
                One beam of engineering. <em>{bentoItems.length} sectors</em>.
              </span>
            </h1>
            <p className="pv-lede">
              Healthcare, pharma and government are where we go deepest. The same engineers, review gates and
              audit trail carry into every sector where a team has to read a lot, decide well and show its working.
            </p>
            <div className="pv-actions" style={{ marginTop: 34 }}>
              <Link className="btn-p" href="/start-a-project">
                Start a project <span aria-hidden="true">→</span>
              </Link>
              <a className="btn-g" href="#sectors">
                Browse sectors
              </a>
            </div>
            <ul className="pv-meta" style={{ marginTop: 34 }}>
              <li>Human approval by design</li>
              <li>On-premise or cloud</li>
              <li>From {company.hq}</li>
            </ul>
          </div>
          <SectorPrism items={bentoItems} />
        </div>
      </section>
      <Section id="sectors">
        <IndustriesBento />
      </Section>
      <CtaBand
        title={
          <>
            Not on the list? <em>Tell us</em> anyway.
          </>
        }
        body="If your work runs on documents, data and decisions, the engineering transfers. Describe the problem and you get a written plan within two business days."
      />
    </>
  );
}
