import type { Metadata } from "next";
import { MailForm } from "@/components/sections/MailForm";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/primitives";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Praverse Tech about enterprise AI, pharma AI, MENNIE or photonics."
};

export default function ContactPage() {
  return (
    <section className="page-head">
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
                  <a className="link" href={`mailto:${company.email}`}>
                    {company.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a className="link" href={`tel:${company.tel}`}>
                    {company.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Office</dt>
                <dd>{company.hq}</dd>
              </div>
              <div>
                <dt>Markets</dt>
                <dd>{company.markets}</dd>
              </div>
            </dl>
          </div>

          <div>
            <MailForm
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
