import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { Headline } from "@/components/ui/Headline";
import { Aurora } from "@/components/ui/Aurora";
import { SectionLabel } from "@/components/ui/primitives";
import { ApplyForm } from "@/components/sections/ApplyForm";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { openJobs } from "@/content/jobs";

export const metadata: Metadata = pageMeta({
  title: "Careers",
  description:
    "Open roles at Praverse Tech in Vadodara, Gujarat. Engineering on AI systems that run inside regulated workflows. Apply directly.",
  path: "/careers",
  og: "careers"
});

/**
 * JobPosting structured data, one per open role.
 *
 * This is what puts a role into Google Jobs and the aggregators candidates
 * actually search. It is generated from the same content/jobs.ts entries the
 * page renders, so a closed role disappears from both at once and the two can
 * never disagree.
 */
function jobLd() {
  return openJobs.map((j) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: [
      j.summary,
      "",
      "What you will do: " + j.responsibilities.join(" "),
      "What we are looking for: " + j.requirements.join(" ")
    ].join("\n"),
    datePosted: j.posted,
    employmentType: j.type.toUpperCase().replace(/[^A-Z]/g, "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: company.legalName,
      sameAs: company.url
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vadodara",
        addressRegion: "Gujarat",
        addressCountry: "IN"
      }
    },
    ...(j.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: j.salary.currency,
            value: {
              "@type": "QuantitativeValue",
              minValue: j.salary.min,
              maxValue: j.salary.max,
              unitText: j.salary.period
            }
          }
        }
      : {}),
    directApply: true
  }));
}

export default function CareersPage() {
  return (
    <>
      <PageJsonLd path="/careers" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd()) }}
      />

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
            We build enterprise AI for healthcare, pharma and regulated
            industries — and the interconnect layer underneath India&rsquo;s
            sovereign AI data centres. {openJobs.length === 1 ? "One role" : `${openJobs.length} roles`} open
            right now, in {company.hq}.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- open roles */}
      <section className="section-tight">
        <div className="wrap">
          <SectionLabel accent="line">Open roles</SectionLabel>
          <Headline onScroll>
            {openJobs.length === 0 ? "Nothing open today." : "What we are hiring for."}
          </Headline>

          {openJobs.length === 0 ? (
            <p className="lede" style={{ marginTop: 24 }}>
              No roles are open at the moment. If you think we should make one
              for you, write to{" "}
              <a className="link" href={`mailto:${site.careersEmail}`}>
                {site.careersEmail}
              </a>{" "}
              and tell us what you would build.
            </p>
          ) : (
            <ul className="jobs">
              {openJobs.map((j) => (
                <li className="job" id={j.id} key={j.id}>
                  <div className="job-head">
                    <div>
                      <h2 className="job-title">{j.title}</h2>
                      <p className="job-meta mono">
                        <span>{j.type}</span>
                        <span>{j.workplace}</span>
                        <span>{j.location}</span>
                      </p>
                    </div>
                    <a className="btn btn-ghost job-apply" href="#apply">
                      Apply
                    </a>
                  </div>

                  <p className="job-summary">{j.summary}</p>

                  <div className="job-cols">
                    <div>
                      <h3 className="job-sub">What you will do</h3>
                      <ul>
                        {j.responsibilities.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="job-sub">What we are looking for</h3>
                      <ul>
                        {j.requirements.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                      {j.niceToHave ? (
                        <>
                          <h3 className="job-sub" style={{ marginTop: 20 }}>
                            Nice to have
                          </h3>
                          <ul>
                            {j.niceToHave.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ what it is like */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>What it is like</SectionLabel>
          <Headline onScroll>Small enough that it is yours.</Headline>
          <div className="grid-3" style={{ marginTop: 40 }}>
            <article className="card">
              <h3 className="h3" style={{ fontSize: 20 }}>
                The work is real
              </h3>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                Systems that live inside somebody&rsquo;s actual workflow, where
                being wrong has consequences. Not demos.
              </p>
            </article>
            <article className="card">
              <h3 className="h3" style={{ fontSize: 20 }}>
                Experts stay in the loop
              </h3>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                {company.principle}
              </p>
            </article>
            <article className="card">
              <h3 className="h3" style={{ fontSize: 20 }}>
                Wide surface
              </h3>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                Incorporated {company.founded}. You will not be handed one
                narrow corner of one service and left there.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- apply */}
      <section className="section" id="apply">
        <div className="wrap-narrow">
          <SectionLabel accent="line">Apply</SectionLabel>
          <Headline onScroll>Tell us what you have built.</Headline>
          <p className="body-2" style={{ marginTop: 18, marginBottom: 36 }}>
            A person reads every application. If none of the roles above fit but
            you think you should be here, pick the closest one and say so in the
            last box.
          </p>
          <ApplyForm defaultRole={openJobs[0]?.id} />
        </div>
      </section>
    </>
  );
}
