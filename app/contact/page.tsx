import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/primitives";
import { Aurora } from "@/components/ui/Aurora";
import { company } from "@/content/company";
import { site } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Talk to Praverse Tech about enterprise AI, pharma AI, MENNIE or photonics. A written plan within two business days.",
  path: '/contact',
  og: 'contact'
});

export default function ContactPage() {
  return (
    <section className="page-head" style={{ position: "relative" }}>
      <PageJsonLd path="/contact" />
      <Aurora
        blobs={[
          { color: "var(--acc-ent)", x: 14, y: 26, size: 460 },
          { color: "var(--teal)", x: 86, y: 62, size: 420 }
        ]}
      />
      <div className="wrap">
        <SectionLabel accent="teal">Contact</SectionLabel>
        <Headline as="h1" className="display">
          Start a conversation.
        </Headline>

        <div className="contact-grid">
          <div>
            <p className="lede">{company.promise}</p>
            <dl className="contact-details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a className="link" href={`mailto:${site.enquiryEmail}`}>
                    {site.enquiryEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Careers</dt>
                <dd>
                  <a className="link" href={`mailto:${site.careersEmail}`}>
                    {site.careersEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Registered office</dt>
                <dd>{company.hq}</dd>
              </div>
              <div>
                <dt>Markets</dt>
                <dd>{company.markets}</dd>
              </div>
            </dl>
          </div>

          <div>
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
      </div>
    </section>
  );
}
