import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { company } from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description: "Terms of use for the Praverse Tech website.",
  path: '/terms'
});

export default function TermsPage() {
  return (
    <section className="page-head">
      <PageJsonLd path="/terms" />
      <div className="wrap-narrow" style={{ paddingInline: 0 }}>
        <SectionLabel>Legal</SectionLabel>
        <Headline as="h1" className="h2">
          Terms of use
        </Headline>

        <div className="prose">
          <p className="lede">
            These terms govern your use of praversetech.com. They do not govern
            any engagement with us — that is covered by the contract we sign.
          </p>

          <h2>Who we are</h2>
          <p>
            {company.legalName}, a company registered in India,{" "}
            <Verify id="registered-address" />. <Verify id="cin" />.
          </p>

          <h2>What this site is</h2>
          <p>
            This website describes what we build and the markets we build it
            for. It is information, not an offer, a quotation, or professional
            advice. Nothing here creates a contract or a commitment to supply.
          </p>

          <h2>Products in development</h2>
          <p>
            Some things described here are in research and development rather
            than general availability, and are labelled as such on the page.
            MENNIE supports care workflows under clinical oversight; it does not
            diagnose, treat or replace medical professionals. Our pharma and
            regulatory tools produce drafts that require review by qualified
            personnel; we make no guarantee of regulatory compliance and imply no
            automated decision-making.
          </p>
          <p>
            Where this site describes architecture as &ldquo;designed to
            support&rdquo; a regulation or standard, that is a description of how
            the system is built. It is not a certification, an audit result, or a
            warranty of compliance. Validation and qualification in your
            environment remain your responsibility.
          </p>

          <h2>Technical figures</h2>
          <p>
            Speeds, reach distances, form factors and market forecasts shown here
            are indicative and drawn from the sources cited on the relevant page.
            They are not committed specifications or dated roadmaps. Confirm the
            specification for your design with us in writing before you rely on
            it.
          </p>

          <h2>Third parties</h2>
          <p>
            We name partners and advisors in text where we are entitled to. Those
            names remain the property of their owners, and nothing here implies
            their endorsement of you or of your use of this site.
          </p>

          <h2>Our content</h2>
          <p>
            The text, design, code and imagery on this site belong to {company.legalName}{" "}
            unless stated otherwise. You may read, link to and quote it with
            attribution. You may not republish it wholesale or present it as your
            own.
          </p>

          <h2>Liability</h2>
          <p>
            We keep this site accurate but make no warranty that it is complete,
            current or error-free. To the extent the law allows, we are not
            liable for loss arising from reliance on it. Nothing here excludes
            liability that cannot lawfully be excluded.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India, and the courts of
            Gujarat have jurisdiction — without affecting any mandatory
            protection you have as a consumer where you live.
          </p>

          <h2>Contact</h2>
          <p>
            <a className="link" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
