import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PrismMark } from "@/components/pv/LineVisuals";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { PageHero, Section, SectionHead } from "@/components/pv/kit";
import { CapWall } from "@/components/pv/kit3";
import { ApplyForm } from "@/components/sections/ApplyForm";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { openJobs } from "@/content/jobs";
import "./careers.css";

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

const roleCount = (n: number) => (n === 1 ? "One role" : `${n} roles`);
/** Workplace and location facts for the hero, straight from content/jobs.ts. */
const heroMeta = () => {
  if (openJobs.length === 0) return [company.hq];
  const uniq = (xs: string[]) => [...new Set(xs)];
  return [
    `${roleCount(openJobs.length)} open`,
    ...uniq(openJobs.map((j) => j.workplace)),
    ...uniq(openJobs.map((j) => j.location))
  ];
};

export default function CareersPage() {
  return (
    <>
      <PageJsonLd path="/careers" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd()) }}
      />

      <PageHero
        accent="white"
        visual={<PrismMark />}
        eyebrow="Careers"
        title={
          <>
            Build things that <em>get used</em>.
          </>
        }
        lede={
          <>
            We build enterprise AI for healthcare, pharma and regulated industries — and the
            interconnect layer underneath India&rsquo;s sovereign AI data centres.{" "}
            {openJobs.length === 0
              ? "Nothing is open today."
              : `${roleCount(openJobs.length)} open right now, in ${company.hq}.`}
          </>
        }
        actions={
          openJobs.length > 0 ? (
            <>
              <a className="btn-p" href="#roles">
                See open roles <span aria-hidden="true">→</span>
              </a>
              <a className="btn-g" href="#apply">
                Apply
              </a>
            </>
          ) : undefined
        }
        meta={heroMeta()}
      />

      {/* ------------------------------------------------------- open roles */}
      <Section id="roles" accent="white">
        <SectionHead
          index="01"
          eyebrow="Open roles"
          title={
            openJobs.length === 0 ? (
              <>
                Nothing open <em>today</em>.
              </>
            ) : (
              <>
                What we are <em>hiring for</em>.
              </>
            )
          }
        />

        {openJobs.length === 0 ? (
          <p className="pv-lede cr-empty">
            No roles are open at the moment. If you think we should make one for you, write to{" "}
            <a className="pv-link" href={`mailto:${site.careersEmail}`}>
              {site.careersEmail}
            </a>{" "}
            and tell us what you would build.
          </p>
        ) : (
          <ul className="cr-jobs">
            {openJobs.map((j) => (
              <li className="cr-job pv-rise" id={j.id} key={j.id}>
                <div className="cr-job-head">
                  <div>
                    <h3 className="cr-job-title">{j.title}</h3>
                    <ul className="pv-chips" aria-label="Role details">
                      <li>{j.type}</li>
                      <li>{j.workplace}</li>
                      <li>{j.location}</li>
                    </ul>
                  </div>
                  <a className="btn-g" href="#apply">
                    Apply
                  </a>
                </div>

                <p className="cr-job-summary">{j.summary}</p>

                <div className="cr-job-cols">
                  <div>
                    <h4 className="cr-job-sub">What you will do</h4>
                    <ul>
                      {j.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="cr-job-sub">What we are looking for</h4>
                    <ul>
                      {j.requirements.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    {j.niceToHave ? (
                      <>
                        <h4 className="cr-job-sub">Nice to have</h4>
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
      </Section>

      {/* --------------------------------------------------- what it is like */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="02"
          eyebrow="What it is like"
          title={
            <>
              Small enough that <em>it is yours</em>.
            </>
          }
        />
        <CapWall
          items={[
            {
              title: "The work is real",
              body: "Systems that live inside somebody’s actual workflow, where being wrong has consequences. Not demos.",
              kicker: "01",
            },
            { title: "Experts stay in the loop", body: company.principle, kicker: "02" },
            {
              title: "Wide surface",
              body: `Incorporated ${company.founded}. You will not be handed one narrow corner of one service and left there.`,
              kicker: "03",
            },
          ]}
        />
      </Section>

      {/* ----------------------------------------------------------- apply */}
      <Section id="apply" accent="white">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="03"
              eyebrow="Apply"
              title={
                <>
                  Tell us what you <em>have built</em>.
                </>
              }
              lede="A person reads every application. If none of the roles above fit but you think you should be here, pick the closest one and say so in the last box."
            />
            <p className="cr-aside">
              Questions about a role first? Write to{" "}
              <a href={`mailto:${site.careersEmail}`}>{site.careersEmail}</a>.
            </p>
          </div>
          <div className="cr-panel">
            <ApplyForm defaultRole={openJobs[0]?.id} />
          </div>
        </div>
      </Section>
    </>
  );
}
