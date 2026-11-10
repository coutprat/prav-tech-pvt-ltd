import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { company } from "@/content/company";
import { sectors } from "@/content/sectors";
import { CtaBand, PageHero, Section, SectionHead } from "@/components/pv/kit";
import { SectorGrid } from "@/components/pv/SectorGrid";

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
      <PageHero
        eyebrow="Industries"
        title={
          <>
            One engineering practice, <em>{sectors.length + 3} sectors</em>.
          </>
        }
        lede="Healthcare, pharma and government are where we go deepest. The same engineers, review gates and audit trail apply wherever a team has to read a lot, decide well and show its working — so here is what we build, sector by sector."
        meta={[
          "Human approval by design",
          "On-premise or cloud",
          `From ${company.hq}`,
        ]}
      />
      <Section>
        <SectionHead
          index="01"
          eyebrow="Sector by sector"
          title={
            <>
              Pick your sector. See <em>what we build</em> for it.
            </>
          }
          lede="Each card lists services we deliver in that sector. Every one starts the same way: one workflow, your own data, and a written plan within two business days."
        />
        <SectorGrid />
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
