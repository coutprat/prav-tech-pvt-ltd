import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { Verify } from "@/components/ui/Verify";
import { PageHero, Section } from "@/components/pv/kit";
import { company } from "@/content/company";
import "../privacy/legal.css";

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description: "Terms of use for the Praverse Tech website.",
  path: '/terms'
});

/** Section ids and headings, shared by the contents list and the text. */
const TOC = [
  { id: "who", title: "Who we are" },
  { id: "site", title: "What this site is" },
  { id: "development", title: "Products in development" },
  { id: "figures", title: "Technical figures" },
  { id: "third-parties", title: "Third parties" },
  { id: "content", title: "Our content" },
  { id: "liability", title: "Liability" },
  { id: "law", title: "Governing law" },
  { id: "contact", title: "Contact" }
] as const;

type Id = (typeof TOC)[number]["id"];

function Part({ id, children }: { id: Id; children: ReactNode }) {
  const i = TOC.findIndex((t) => t.id === id);
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>
        <span className="lg-n" aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
        {TOC[i].title}
      </h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <PageJsonLd path="/terms" />

      <PageHero
        accent="white"
        eyebrow="Legal"
        title="Terms of use"
        lede="These terms govern your use of praversetech.com. They do not govern any engagement with us — that is covered by the contract we sign."
      />

      <Section accent="white">
        <div className="lg-layout">
          <nav className="lg-toc" aria-label="Contents">
            <p className="lg-toc-h">Contents</p>
            <ol>
              {TOC.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="lg-doc">
            <Part id="who">
              <p>
                {company.legalName}, a company registered in India,{" "}
                <Verify id="registered-address" />. <Verify id="cin" />.
              </p>
            </Part>

            <Part id="site">
              <p>
                This website describes what we build and the markets we build it
                for. It is information, not an offer, a quotation, or professional
                advice. Nothing here creates a contract or a commitment to supply.
              </p>
            </Part>

            <Part id="development">
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
            </Part>

            <Part id="figures">
              <p>
                Speeds, reach distances, form factors and market forecasts shown here
                are indicative and drawn from the sources cited on the relevant page.
                They are not committed specifications or dated roadmaps. Confirm the
                specification for your design with us in writing before you rely on
                it.
              </p>
            </Part>

            <Part id="third-parties">
              <p>
                We name partners and advisors in text where we are entitled to. Those
                names remain the property of their owners, and nothing here implies
                their endorsement of you or of your use of this site.
              </p>
            </Part>

            <Part id="content">
              <p>
                The text, design, code and imagery on this site belong to {company.legalName}{" "}
                unless stated otherwise. You may read, link to and quote it with
                attribution. You may not republish it wholesale or present it as your
                own.
              </p>
            </Part>

            <Part id="liability">
              <p>
                We keep this site accurate but make no warranty that it is complete,
                current or error-free. To the extent the law allows, we are not
                liable for loss arising from reliance on it. Nothing here excludes
                liability that cannot lawfully be excluded.
              </p>
            </Part>

            <Part id="law">
              <p>
                These terms are governed by the laws of India, and the courts of
                Gujarat have jurisdiction — without affecting any mandatory
                protection you have as a consumer where you live.
              </p>
            </Part>

            <Part id="contact">
              <p>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </p>
            </Part>
          </article>
        </div>
      </Section>
    </>
  );
}
