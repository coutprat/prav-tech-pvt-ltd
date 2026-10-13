import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Headline } from "@/components/ui/Headline";
import { PersonCard } from "@/components/ui/PersonCard";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { company, ecosystem, founderStory, people } from "@/content/company";
import { locations, site } from "@/content/site";
import { Footprint } from "@/components/sections/Footprint";
import { TeamGrid } from "@/components/sections/TeamGrid";

export const metadata: Metadata = pageMeta({
  title: "Company",
  description: "Praverse Tech Pvt Ltd — the idea began in 2023, incorporated 2026, headquartered in Vadodara, Gujarat. Leadership and advisors.",
  path: '/company',
  og: 'company'
});

export default function CompanyPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <SectionLabel accent="teal">Company</SectionLabel>
          <Headline as="h1" className="display">
            Built by people who have done the work.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            {company.originLine} {locations.line} {locations.markets}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- leadership */}
      <section className="section-tight">
        <div className="wrap">
          <SectionLabel>Leadership &amp; advisors</SectionLabel>
          <div className="person-grid">
            {people.map((p, i) => (
              <PersonCard key={p.slug} person={p} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- founder story */}
      <section className="section section-alt">
        <div className="wrap-narrow" style={{ paddingInline: 0 }}>
          <SectionLabel>Origin</SectionLabel>
          <Headline onScroll>Why this company exists.</Headline>
          <div className="prose">
            {founderStory.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <TeamGrid />

      {/* --------------------------------------------------------- footprint */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Where we work</SectionLabel>
          <Headline onScroll>People, not pins on a map.</Headline>
          <p className="body-2" style={{ marginTop: 18, maxWidth: "62ch" }}>
            We have one registered office, in Vadodara. Everywhere else on this
            list is a person, not a branch — which is the honest version, and
            also the useful one, because those people are in the cities where
            India&rsquo;s AI infrastructure is actually being built.
          </p>
          <Footprint />
        </div>
      </section>

      {/* --------------------------------------------------------- ecosystem */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>The group</SectionLabel>
          <Headline onScroll>More than one kind of expertise.</Headline>
          <p className="body-2" style={{ marginTop: 18 }}>
            Buying AI for a regulated business usually means hiring the
            engineers and the compliance people separately, and hoping they
            understand each other. Here they already do.
          </p>

          <div className="grid-4">
            {ecosystem.map((e) => (
              <article className="card" key={e.name}>
                <p className="line-card-n">{e.role}</p>
                <h3 className="h3" style={{ fontSize: 19, marginTop: 12 }}>
                  {e.name}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 14 }}>
                  {e.body}
                </p>
              </article>
            ))}
          </div>
          <p className="body-2" style={{ marginTop: 24, fontSize: 14 }}>
            Named in text only. We do not display a partner&rsquo;s logo without
            written permission.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- where */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Where we are</SectionLabel>
          <Headline onScroll>{company.hq}</Headline>
          <p className="lede" style={{ marginTop: 24 }}>
            Engineering, qualification and support sit in India, on the same
            clock as the teams we build for.
          </p>
          <p className="body-2" style={{ marginTop: 24 }}>
            <a className="link" href={`mailto:${site.enquiryEmail}`}>
              {site.enquiryEmail}
            </a>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionLabel>Careers</SectionLabel>
          <Headline onScroll>We are hiring one engineer.</Headline>
          <p className="lede" style={{ marginTop: 24 }}>
            A Full Stack Engineer in {company.hq}. Skilled interns welcome.
          </p>
          <p style={{ marginTop: 28 }}>
            <Link className="btn btn-ghost" href="/careers">
              See the role
            </Link>
          </p>
        </div>
      </section>

      <CTASection
        title="Tell us the problem."
        body={company.promise}
      />
    </>
  );
}
