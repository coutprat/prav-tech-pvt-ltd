import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { PageHero, Rows, Section, SectionHead } from "@/components/pv/kit";
import { company, howWeWork } from "@/content/company";
import { site, whatsappHref } from "@/content/site";
import "../contact/contact.css";

export const metadata: Metadata = pageMeta({
  title: "Start a project",
  description: "Tell us the problem. You get a written plan within two business days — no pitch deck, no discovery retainer.",
  path: '/start-a-project',
  og: 'start-a-project'
});

const nn = (i: number) => String(i + 1).padStart(2, "0");

export default function StartAProjectPage() {
  return (
    <>
      <PageJsonLd path="/start-a-project" />

      <PageHero
        accent="white"
        eyebrow="Start a project"
        title={
          <>
            Tell us the <em>problem</em>.
          </>
        }
        lede={`${company.promise} No pitch deck, no discovery retainer — a written plan you can take to your team and act on, whoever builds it.`}
        meta={["Written plan in two business days", "No pitch deck", "No discovery retainer"]}
      />

      {/* -------------------------------------------------------- the brief */}
      <Section accent="white">
        <div className="ct-split">
          <div className="ct-a-head">
            <SectionHead
              index="01"
              eyebrow="The brief"
              title={
                <>
                  Three answers are <em>enough to start</em>.
                </>
              }
              lede="What happens today, who it slows down, and what it has to live inside. Rough is fine — the plan is where it gets precise."
            />
            <div className="ct-promise">
              <span className="ct-promise-v">
                Two <em>business days</em>.
              </span>
              <span className="ct-promise-n">
                From your brief to a written plan in your inbox.
              </span>
            </div>
          </div>
          <div className="ct-a-details">
            <dl className="ct-details">
              <div>
                <dt>Prefer email</dt>
                <dd>
                  <a href={`mailto:${site.enquiryEmail}`}>{site.enquiryEmail}</a>
                </dd>
              </div>
              <div>
                <dt>Or WhatsApp</dt>
                <dd>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="ct-panel">
            <p className="ct-panel-h">
              <strong>Project brief</strong>
              <span>Fields marked * are required</span>
            </p>
            <EnquiryForm
              subject="New project enquiry"
              submitLabel="Send the brief"
              fields={[
                { name: "name", label: "Name", required: true, autoComplete: "name" },
                { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
                { name: "org", label: "Organisation", required: true, autoComplete: "organization" },
                {
                  name: "area",
                  label: "Which line",
                  type: "select",
                  options: ["Enterprise AI", "Pharma AI", "MENNIE / Healthcare", "Photonics", "Not sure yet"]
                },
                {
                  name: "problem",
                  label: "The problem",
                  type: "textarea",
                  required: true,
                  placeholder: "What happens today, who it slows down, and what it costs you."
                },
                {
                  name: "constraints",
                  label: "Constraints",
                  type: "textarea",
                  placeholder: "Data residency, validation, timelines, systems it must live inside."
                }
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------- what happens next */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="02"
          eyebrow="What happens next"
          title={
            <>
              If the plan makes sense, <em>this is the work</em>.
            </>
          }
          lede="Four stages, in this order. Review gates are part of the build, not something added at the end."
        />
        <Rows
          items={howWeWork.map((s, i) => ({
            k: nn(i),
            title: s.step,
            body: <p>{s.body}</p>
          }))}
        />
      </Section>
    </>
  );
}
