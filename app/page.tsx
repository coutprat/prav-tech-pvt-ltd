import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PrismHero } from "@/components/hero/PrismHero";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/content/faq";
import { company, howWeWork, pillars } from "@/content/company";
import { locations, site } from "@/content/site";
import Link from "next/link";
import { weDo } from "@/content/wedo";
import { WeDoList } from "@/components/pv/WeDoList";
import { SectorGrid } from "@/components/pv/SectorGrid";
import {
  Card,
  CtaBand,
  Faq,
  Figure,
  Grid,
  LogoRow,
  Section,
  SectionHead,
  Stats,
} from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";

/** A cross-section of real work, one or two per line. */
const HOME_WEDO = [
  weDo.ent[0],
  weDo.pha[0],
  weDo.pha[3],
  weDo.men[0],
  weDo.ent[2],
  weDo.ent[3],
  weDo.sov[0],
  weDo.pho[0],
];

const HOME_TITLE = "Praverse Tech | Custom AI & Agents for Any Industry, India";

export const metadata: Metadata = {
  ...pageMeta({
    title: HOME_TITLE,
    description:
      "AI development company in Vadodara, Gujarat: custom AI agents and copilots for any industry and government, plus 800G/1.6T interconnect for India's AI data centres.",
    path: "/",
    og: "home",
  }),
  // Absolute: the layout's "· Praverse Tech" suffix would repeat the name.
  title: { absolute: HOME_TITLE },
};

/** Same order and colours as the prism in the hero, so the beams land here. */
const LINES = [
  {
    n: "01",
    accent: "ent" as const,
    href: "/enterprise-ai",
    title: "Enterprise AI & Agents",
    body: "Agents, copilots, document intelligence and production ML that work inside the systems your teams already use — and stop for a named reviewer before anything is sent, filed or changed.",
    tags: ["Agents", "RAG", "Vision", "MLOps"],
  },
  {
    n: "02",
    accent: "pha" as const,
    href: "/pharma",
    title: "Pharma & Regulatory AI",
    body: "FDA 483 responses, CAPA reasoning, data-integrity review and inspection readiness, built alongside people who stand in front of inspectors for a living. Every output is a draft a qualified person signs.",
    tags: ["21 CFR 211", "ICH Q9 / Q10", "ALCOA+"],
  },
  {
    n: "03",
    accent: "men" as const,
    href: "/mennie",
    title: "Healthcare AI · MENNIE",
    body: "MENNIE, a voice-first patient assistant that meets people at the door, the kiosk or on their phone and hands the clinician a structured picture — plus imaging and screening support at the edge.",
    tags: ["Voice-first", "Imaging", "Edge AI"],
  },
  {
    n: "04",
    accent: "pho" as const,
    href: "/photonics",
    title: "Photonics & AI Data Centres",
    body: "The copper and optical interconnect that AI clusters are built on — DAC, ACC, AEC, AOC and pluggable optics at 800G and 1.6T — designed in and qualified in India with our US technology partner.",
    tags: ["800G", "1.6T", "Copper + optics"],
  },
];

export default function HomePage() {
  return (
    <>
      <PrismHero />

      {/* ------------------------------------------------------- the facts */}
      <Section tight>
        <Stats
          items={[
            {
              label: "Founded",
              value: company.ideaFrom,
              note: `Incorporated ${company.founded}`,
            },
            {
              label: "Headquarters",
              value: "Vadodara",
              note: "Gujarat, India",
            },
            {
              label: "Team in",
              value: "4 cities",
              note: locations.cities.join(" · "),
            },
            {
              label: "Markets",
              value: "3",
              note: "India · United States · Europe",
            },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------ four lines */}
      <Section id="lines">
        <SectionHead
          index="01"
          eyebrow="Four lines"
          title={
            <>
              One practice. <em>Four</em> disciplines.
            </>
          }
          lede="The same engineers, the same review discipline and the same audit trail sit under every line. What changes is the domain expertise we build alongside — and the regulation the work has to survive."
        />
        <div className="pv-lines">
          {LINES.map((l) => (
            <Card
              key={l.n}
              n={l.n}
              title={l.title}
              href={l.href}
              accent={l.accent}
              meta={l.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            >
              <p>{l.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------- operating principle */}
      <Section tone="raised">
        <SectionHead
          index="02"
          eyebrow="Operating principle"
          title={
            <>
              The system drafts. <em>Your experts</em> decide.
            </>
          }
          lede={
            company.principle.replace(
              " The system drafts. Your team decides.",
              "",
            ) +
            " So the review gate is part of the architecture, not a setting — and every step is recorded while it happens, not reconstructed afterwards."
          }
        />
        <Figure
          n="02"
          title="Where a person sits in every system we ship"
          caption="Illustrative run. The agent may read, check and draft as fast as it likes; nothing leaves the gate until a named reviewer approves it, and the ledger is written as it goes."
        >
          <Flow
            accent="var(--acc-pha)"
            nodes={[
              {
                k: "Input",
                title: "Your documents & data",
                body: "SOPs, records, tickets, images — where they already live.",
                tags: ["SOP", "Records", "Email"],
              },
              {
                k: "Agent",
                title: "Reads, checks, drafts",
                body: "Every claim carries the source it came from.",
              },
              {
                k: "Gate",
                title: "Named reviewer",
                body: "Approves, edits or rejects the draft.",
                gate: true,
                wait: "Awaiting review",
                ok: "Approved",
              },
              {
                k: "Action",
                title: "Sent, filed, actioned",
                body: "Only now does anything change in your systems.",
              },
            ]}
            ledger={[
              {
                t: "09:41",
                k: "Asked by",
                v: "Quality lead, via the team inbox",
              },
              {
                t: "09:42",
                k: "Surfaced",
                v: "Three SOP sections and four batch records, each linked",
              },
              {
                t: "10:05",
                k: "Decided by",
                v: "Named reviewer — draft edited, then approved",
              },
            ]}
          />
        </Figure>
        <div style={{ marginTop: 24 }}>
          <Grid cols={3}>
            {pillars.map((p, i) => (
              <Card key={p.title} n={`0${i + 1}`} title={p.title}>
                <p>{p.body}</p>
              </Card>
            ))}
          </Grid>
        </div>
      </Section>

      {/* ---------------------------------------------------- what we build */}
      <Section>
        <SectionHead
          index="03"
          eyebrow="What we build"
          title={
            <>
              Specific systems, <em>not slideware</em>.
            </>
          }
          lede="A selection of what our engineers have built or are building now — described without client names, because most of it is client work. Each line page lists the rest."
        />
        <WeDoList items={HOME_WEDO} />
        <p style={{ marginTop: 28 }}>
          <Link className="pv-link" href="/enterprise-ai">
            See every capability by line <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      {/* ------------------------------------------------------ industries */}
      <Section tone="raised">
        <SectionHead
          index="04"
          eyebrow="Industries"
          title={
            <>
              Built for any work that runs on <em>documents, data</em> and
              decisions.
            </>
          }
          lede="Pharma, healthcare and government are where we go deepest. The same engineering applies wherever a qualified person has to read a lot, decide well and show their working."
        />
        <SectorGrid />
        <p style={{ marginTop: 28 }}>
          <Link className="pv-link" href="/industries">
            All industries <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      {/* ------------------------------------------------------ government */}
      <Section>
        <div className="home-gov">
          <SectionHead
            index="05"
            eyebrow="Government & public sector"
            title={
              <>
                Sovereign AI for the <em>public sector</em>.
              </>
            }
            lede="Air-gapped and on-premise deployments, inspection and audit intelligence for regulators, public-health platforms and e-governance document automation — with a named officer deciding and the record written as the work happens."
            aside={
              <div className="pv-actions" style={{ marginTop: 28 }}>
                <Link className="btn-p" href="/government">
                  Government & public sector <span aria-hidden="true">→</span>
                </Link>
                <a
                  className="btn-g"
                  href={`mailto:${site.enquiryEmail}?subject=${encodeURIComponent("Capability statement request")}`}
                >
                  Request a capability statement
                </a>
              </div>
            }
          />
        </div>
      </Section>

      {/* ---------------------------------------------------- engagement */}
      <Section tone="raised">
        <SectionHead
          index="06"
          eyebrow="How an engagement runs"
          title={
            <>
              From the problem to <em>production</em>, in four steps.
            </>
          }
          lede={`${company.promise} No mystery after that: each step ends in something you can read, test or run.`}
        />
        <Figure
          n="03"
          title="An engagement, start to finish"
          caption="Every step hands over a concrete artefact. The plan is written before a line of production code, and the review gates are designed into the build, not bolted on at the end."
        >
          <Flow
            accent="rgba(255,255,255,0.9)"
            nodes={howWeWork.map((s, i) => ({
              k: `Step ${i + 1}`,
              title: s.step,
              body: s.body,
              tags: [
                ["Workflow map"],
                ["Written plan", "Scope"],
                ["Working system", "Review gates"],
                ["Live", "Measured"],
              ][i],
            }))}
          />
        </Figure>
      </Section>

      {/* ------------------------------------------------------- the group */}
      <Section>
        <SectionHead
          index="07"
          eyebrow="Who we build with"
          title={
            <>
              Domain depth from people who <em>do the work</em>.
            </>
          }
          lede="Our pharma AI is built alongside a quality and regulatory consultancy and advised by a specialty-pharma group with seven decades of approvals. Our interconnect is supplied with a US technology partner."
        />
        <LogoRow
          items={[
            {
              name: "Nexgen Pharma Solutions",
              src: "/partners/nexgen-on-dark.webp",
              role: "Quality & regulatory",
              w: 734,
              h: 72,
            },
            {
              name: "SWATI Spentose",
              src: "/partners/swati-on-dark.webp",
              role: "Pharma advisory · est. 1952",
              w: 143,
            },
            {
              name: "Our USA technology partner",
              role: "Interconnect technology",
            },
            {
              name: "Praverse Tech Pvt Ltd",
              role: "AI & photonics · Vadodara",
            },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------- FAQ */}
      <FaqJsonLd />
      <Section tone="raised">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="08"
              eyebrow="Questions"
              title={
                <>
                  Straight <em>answers</em>.
                </>
              }
            />
          </div>
          <Faq items={faqs} />
        </div>
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
