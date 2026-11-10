import type { Metadata } from "next";
import { brief } from "@/lib/answers";
import { pageMeta } from "@/lib/seo";
import { PrismMark } from "@/components/pv/LineVisuals";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Verify } from "@/components/ui/Verify";
import { Card, Grid, PageHero, Section, SectionHead } from "@/components/pv/kit";
import { company } from "@/content/company";
import { locations, site, whatsappHref } from "@/content/site";
import "./contact.css";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Talk to Praverse Tech about enterprise AI, pharma AI, MENNIE or photonics. A written plan within two business days.",
  path: '/contact',
  og: 'contact'
});

export default function ContactPage() {
  return (
    <>
      <PageJsonLd path="/contact" />

      <PageHero
        accent="white"
        visual={<PrismMark />}
        eyebrow={brief("/contact").lead}
        title={
          <>
            Start a <em>conversation</em>.
          </>
        }
        lede="Enterprise AI, pharma AI, MENNIE or photonics. Describe the problem in plain language. What comes back is a written plan, not a pitch deck."
        meta={["Written plan in two business days", locations.hq, company.markets]}
      />

      {/* ----------------------------------------------------- form + details */}
      <Section accent="white">
        <div className="ct-split">
          <div className="ct-a-head">
            <SectionHead
              index="01"
              eyebrow="Write to us"
              title={
                <>
                  Tell us what you are <em>trying to solve</em>.
                </>
              }
            />
            <div className="ct-promise">
              <span className="ct-promise-v">
                Two <em>business days</em>.
              </span>
              <span className="ct-promise-n">{company.promise}</span>
            </div>

          </div>
          <div className="ct-a-details">
            <dl className="ct-details">
              <div>
                <dt>Enquiries</dt>
                <dd>
                  <a href={`mailto:${site.enquiryEmail}`}>{site.enquiryEmail}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp
                  </a>
                </dd>
              </div>
              <div>
                <dt>Careers</dt>
                <dd>
                  <a href={`mailto:${site.careersEmail}`}>{site.careersEmail}</a>
                </dd>
              </div>
              <div>
                <dt>Registered office</dt>
                <dd>
                  <Verify id="registered-address" />
                </dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>
                  {locations.hq}
                  <span>Team members in {locations.cities.join(", ")}</span>
                </dd>
              </div>
              <div>
                <dt>Markets</dt>
                <dd>{locations.markets}</dd>
              </div>
            </dl>
          </div>

          <div className="ct-panel">
            <p className="ct-panel-h">
              <strong>Enquiry</strong>
              <span>Fields marked * are required</span>
            </p>
            <EnquiryForm
              subject="Enquiry from praversetech.com"
              submitLabel="Send enquiry"
              fields={[
                { name: "name", label: "Name", required: true, autoComplete: "name" },
                { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
                { name: "org", label: "Organisation", autoComplete: "organization" },
                {
                  name: "area",
                  label: "Area",
                  type: "select",
                  options: ["Enterprise AI", "Pharma AI", "MENNIE / Healthcare", "Photonics", "Something else"]
                },
                {
                  name: "message",
                  label: "What are you trying to solve?",
                  type: "textarea",
                  required: true,
                  placeholder: "The workflow, who it affects, and what good would look like."
                }
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ other routes */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="02"
          eyebrow="Other ways in"
          title={
            <>
              If you already know <em>what you need</em>.
            </>
          }
        />
        <Grid cols={3}>
          <Card
            n="01"
            title="Start a project"
            href="/start-a-project"
            cta="Send a brief"
            accent="white"
          >
            <p>
              A structured brief: the problem, and the constraints it has to live inside. You get a
              written plan back within two business days.
            </p>
          </Card>
          <Card n="02" title="Security review" href="/trust" cta="Read the trust page" accent="white">
            <p>
              Where data goes, who processes it, and what this website does and does not collect —
              written for the person who has to sign off.
            </p>
          </Card>
          <Card n="03" title="Careers" href="/careers" cta="See open roles" accent="white">
            <p>
              Open roles in {locations.hq}, and how to apply. A person reads every application.
            </p>
          </Card>
        </Grid>
      </Section>
    </>
  );
}
