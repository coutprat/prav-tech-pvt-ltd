import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PrismMark } from "@/components/pv/LineVisuals";
import { PageJsonLd } from "@/components/seo/JsonLd";
import Image from "next/image";
import { PersonCard } from "@/components/ui/PersonCard";
import { company, ecosystem, founderStory, people } from "@/content/company";
import { PraverseLockup } from "@/components/ui/PraverseLockup";
import { Downloads } from "@/components/sections/Downloads";
import { locations, site } from "@/content/site";
import { openJobs } from "@/content/jobs";
import { Footprint } from "@/components/sections/Footprint";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { OriginFilm } from "@/components/sections/OriginFilm";
import {
  Card,
  CtaBand,
  Figure,
  Grid,
  Note,
  PageHero,
  Section,
  SectionHead
} from "@/components/pv/kit";
import "./company.css";

export const metadata: Metadata = pageMeta({
  title: "Company",
  description: "Praverse Tech Pvt Ltd — the idea began in 2023, incorporated 2026, headquartered in Vadodara, Gujarat. Leadership and advisors.",
  path: '/company',
  og: 'company'
});


export default function CompanyPage() {
  return (
    <>
      <PageJsonLd path="/company" />
      <PageHero
        accent="white"
        visual={<PrismMark />}
        eyebrow="Company"
        title={
          <>
            Built by people who have <em>done the work</em>.
          </>
        }
        lede={`${company.originLine} ${locations.line} ${locations.markets}`}
        meta={[
          `Work began ${company.ideaFrom}`,
          `Incorporated ${company.founded}`,
          locations.hq,
          "India · US · Europe"
        ]}
      />

      {/* -------------------------------------------------------- leadership */}
      <Section accent="white">
        <SectionHead
          index="01"
          eyebrow="Leadership & advisors"
          title={
            <>
              The people who <em>answer for it</em>.
            </>
          }
          lede="A founder who came from the research, and two advisors who have spent their careers in pharma quality and regulation."
        />
        <div className="person-grid co-people">
          {people.map((p, i) => (
            <PersonCard key={p.slug} person={p} priority={i === 0} />
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------- founder story */}
      <Section tone="raised" accent="white" className="origin co-origin">
        <OriginFilm />
        <div className="origin-body">
          <SectionHead
            index="02"
            eyebrow="Origin"
            title={
              <>
                Why this company <em>exists</em>.
              </>
            }
          />
          <div className="pv-offset">
            <div>
              {founderStory.map((p) => (
                <p className="pv-body co-p" key={p.slice(0, 40)}>
                  {p}
                </p>
              ))}
              <p className="pv-body pv-ink co-p">
                {company.principle}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <TeamGrid />

      {/* --------------------------------------------------------- footprint */}
      <Section accent="white">
        <SectionHead
          index="03"
          eyebrow="Where we work"
          title={
            <>
              People, not <em>pins on a map</em>.
            </>
          }
          lede="We have one registered office, in Vadodara. Everywhere else on this list is a person, not a branch — which is the honest version, and also the useful one, because those people are in the cities where India’s AI infrastructure is actually being built."
        />
        <Figure
          n="01"
          title="Operational data-centre capacity, and where our people are"
          caption="Third-party market data about India, not a claim about Praverse; sources are printed with the chart. Four of the five largest capacity markets are cities where Praverse has team members."
        >
          <Footprint />
        </Figure>
      </Section>

      {/* --------------------------------------------------------- ecosystem */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="04"
          eyebrow="The group"
          title={
            <>
              More than one kind of <em>expertise</em>.
            </>
          }
          lede="Buying AI for a regulated business usually means hiring the engineers and the compliance people separately, and hoping they understand each other. Here they already do."
        />
        <Grid cols={4} className="co-eco">
          {ecosystem.map((e) => (
            <Card
              key={e.name}
              n={e.role}
              title={e.name}
              accent="white"
              meta={
                "lockup" in e && e.lockup ? (
                  <span className="eco-logo co-logo">
                    <PraverseLockup />
                  </span>
                ) : "logo" in e && e.logo ? (
                  <span className="eco-logo co-logo">
                    <Image
                      src={e.logo}
                      alt={`${e.name} logo`}
                      width={640}
                      height={296}
                      sizes="(min-width: 1100px) 260px, (min-width: 680px) 44vw, 88vw"
                      unoptimized
                    />
                  </span>
                ) : undefined
              }
            >
              <p>{e.body}</p>
            </Card>
          ))}
        </Grid>
        <Note>
          Logos are shown only where we have been given them to use. Where a
          partner is named in text alone, that is deliberate.
        </Note>
      </Section>

      {/* ------------------------------------------------- where + careers */}
      <Section accent="white">
        <SectionHead
          index="05"
          eyebrow="Where we are"
          title={
            <>
              One office, <em>on your clock</em>.
            </>
          }
          lede="Engineering, qualification and support sit in India, on the same clock as the teams we build for."
        />
        <Grid cols={2}>
          <Card n="Headquarters" title={company.hq} accent="white">
            <p>
              <a className="pv-link" href={`mailto:${site.enquiryEmail}`}>
                {site.enquiryEmail}
              </a>
            </p>
          </Card>
          <Card
            n="Careers"
            title={`Hiring in ${locations.hq}`}
            accent="white"
            href="/careers"
            cta="See the roles"
            meta={openJobs.map((j) => (
              <span key={j.id}>
                {j.title} · {j.type}
              </span>
            ))}
          >
            <p>A Full Stack Engineer in {company.hq}. Skilled interns welcome.</p>
          </Card>
        </Grid>
      </Section>

      {/* ---------------------------------------------------------- downloads */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="06"
          eyebrow="Take it with you"
          title={
            <>
              The same argument, <em>on paper</em>.
            </>
          }
          lede="Both decks say what this site says and stop where it stops. If a claim is not on these pages, it is not in there either."
        />
        <Downloads />
      </Section>

      <CtaBand
        title={
          <>
            Tell us the <em>problem</em>.
          </>
        }
        body={company.promise}
      />
    </>
  );
}
