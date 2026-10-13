import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Headline } from "@/components/ui/Headline";
import { Aurora } from "@/components/ui/Aurora";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { company } from "@/content/company";
import { site } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Careers",
  description: "Work at Praverse Tech in Vadodara. Open role: Full Stack Engineer. Some experience preferred; skilled interns welcome.",
  path: '/careers',
  og: 'careers'
});

export default function CareersPage() {
  return (
    <>
      <section className="page-head" style={{ position: "relative" }}>
        <Aurora
          blobs={[
            { color: "var(--acc-ent)", x: 16, y: 30, size: 480 },
            { color: "var(--acc-men)", x: 82, y: 56, size: 420 }
          ]}
        />
        <div className="wrap">
          <SectionLabel>Careers</SectionLabel>
          <Headline as="h1" className="display">
            Build things that get used.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            We are a small team in {company.hq} building enterprise AI for
            healthcare, pharma and regulated industries — and the interconnect
            layer underneath India&rsquo;s sovereign AI data centres.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="grid-3">
            <article className="card">
              <h2 className="h3" style={{ fontSize: 20 }}>
                The work is real
              </h2>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                Systems that live inside somebody&rsquo;s actual workflow, where
                being wrong has consequences. Not demos.
              </p>
            </article>
            <article className="card">
              <h2 className="h3" style={{ fontSize: 20 }}>
                Experts stay in the loop
              </h2>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                {company.principle}
              </p>
            </article>
            <article className="card">
              <h2 className="h3" style={{ fontSize: 20 }}>
                Small team, wide surface
              </h2>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                Founded {company.founded}. You will not be handed one narrow
                corner of one service.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Open role</SectionLabel>
          <Headline onScroll>Full Stack Engineer</Headline>

          <div className="role">
            <dl className="role-meta">
              <div>
                <dt>Location</dt>
                <dd>{company.hq}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>Some experience preferred; skilled interns welcome</dd>
              </div>
              <div>
                <dt>Compensation</dt>
                <dd>
                  <Verify id="careers-compensation" />
                </dd>
              </div>
            </dl>

            <div className="role-body">
              <p className="body-2">
                We are looking for one full stack engineer to work across the
                products described on this site. If you have shipped something
                end to end and can explain the decisions you made, we want to
                talk — whether that was at a job, a lab or on your own.
              </p>
              <p className="body-2" style={{ marginTop: 18 }}>
                Send a CV to{" "}
                <a className="link" href={`mailto:${site.careersEmail}?subject=${encodeURIComponent("Full Stack Engineer — application")}`}>
                  {site.careersEmail}
                </a>
                . A link to something you built helps more than a cover letter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap-narrow" style={{ paddingInline: 0, textAlign: "center" }}>
          <h2 className="h2">Don&rsquo;t see your role?</h2>
          <p className="lede" style={{ marginTop: 18, marginInline: "auto" }}>
            Write to{" "}
            <a className="link" href={`mailto:${site.careersEmail}`}>
              {site.careersEmail}
            </a>
            .
          </p>
        </div>
      </section>

      <CTASection
        title="Rather talk about a project?"
        body={company.promise}
        primary={{ href: "/start-a-project", label: "Start a project" }}
        secondary={{ href: "/contact", label: "Contact" }}
      />
    </>
  );
}
