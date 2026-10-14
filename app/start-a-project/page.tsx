import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/primitives";
import { company, howWeWork } from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Start a project",
  description: "Tell us the problem. You get a written plan within two business days — no pitch deck, no discovery retainer.",
  path: '/start-a-project'
});

export default function StartAProjectPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap-narrow" style={{ paddingInline: 0 }}>
          <SectionLabel accent="teal">Start a project</SectionLabel>
          <Headline as="h1" className="display">
            Tell us the problem.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            {company.promise} No pitch deck, no discovery retainer — a written
            plan you can take to your team and act on, whoever builds it.
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
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>What happens next</SectionLabel>
          <ol className="steps">
            {howWeWork.map((s, i) => (
              <li key={s.step}>
                <span className="steps-n num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{s.step}</h3>
                <p className="body-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
