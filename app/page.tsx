import type { Metadata } from "next";
import { brief } from "@/lib/answers";
import { pageMeta } from "@/lib/seo";
import { PrismHero } from "@/components/hero/PrismHero";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/content/faq";
import { company, howWeWork, pillars } from "@/content/company";
import { locations, site } from "@/content/site";
import Link from "next/link";
import { weDo } from "@/content/wedo";
import { IndustriesBento, bentoItems } from "@/components/pv/IndustriesBento";
import { BigSteps, CapWall, FeatureBand, Statement, wallFromWeDo } from "@/components/pv/kit3";
import { GovVisual } from "@/components/pv/LineVisuals";
import { SectorIcon } from "@/components/pv/SectorIcon";
import { sectors } from "@/content/sectors";
import { LineSpectrum } from "@/components/pv/LineSpectrum";
import {
  CtaBand,
  Faq,
  Figure,
  LogoRow,
  Section,
  SectionHead,
} from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";
import { ProblemFinder, type Problem } from "@/components/pv/ProblemFinder";
import { offers } from "@/content/offers";
import { getVerifyItem } from "@/content/verify";

/**
 * Who already trusts us. Only shown while the owner-confirmed engagement note
 * in content/verify.ts stands, and written as descriptions: no client is
 * named on this site.
 */
const ENGAGED = getVerifyItem("pharma-engagements").confirmed;

const FIRST = "A written plan within two business days, then a pilot on your own data.";

/** Problems in the visitor's words, answered with copy the site already makes. */
const PROBLEMS: Problem[] = [
  {
    id: "documents",
    say: "My team is buried in documents.",
    line: "Enterprise AI",
    colour: "var(--acc-ent)",
    title: "Answers from your own records, with the source attached.",
    body: offers[0].body,
    first: offers[0].gets,
    href: "/enterprise-ai",
    topic: "enterprise",
  },
  {
    id: "workflow",
    say: "The same manual workflow eats hours every week.",
    line: "Enterprise AI · Agents",
    colour: "var(--acc-ent)",
    title: "One workflow, handled end to end, with a person approving.",
    body: offers[1].body,
    first: offers[1].gets,
    href: "/enterprise-ai",
    topic: "enterprise",
  },
  {
    id: "inspection",
    say: "An inspection or an audit is coming.",
    line: "Pharma & Regulatory AI",
    colour: "var(--acc-pha)",
    title: "Drafts your quality team can verify, line by line.",
    body: "FDA 483 responses, CAPA reasoning, data-integrity review and inspection readiness. Every output is a draft that a qualified person signs.",
    first: FIRST,
    proof: ENGAGED
      ? "A US-headquartered global generics manufacturer and two Indian pharmaceutical groups."
      : undefined,
    href: "/pharma",
    topic: "pharma",
  },
  {
    id: "forecast",
    say: "We cannot see what demand, churn or failures will do next.",
    line: "Enterprise AI · Machine learning",
    colour: "var(--acc-ent)",
    title: "Predictions that show their evidence.",
    body: offers[2].body,
    first: offers[2].gets,
    href: "/enterprise-ai",
    topic: "enterprise",
  },
  {
    id: "patients",
    say: "Patients wait too long before anyone listens.",
    line: "Healthcare AI · MENNIE",
    colour: "var(--acc-men)",
    title: "A voice-first assistant that prepares the clinician.",
    body: "MENNIE meets people at the door, at the kiosk or on their phone, and hands the clinician a structured picture before the consultation starts.",
    first: FIRST,
    href: "/mennie",
    topic: "mennie",
  },
  {
    id: "sovereign",
    say: "Our data cannot leave our building.",
    line: "Government & sovereign AI",
    colour: "var(--gold)",
    title: "AI that runs where your data already lives.",
    body: "Air-gapped and on-premise deployments on your own servers or private cloud. One office pilots, a named officer signs off, and only then does it scale.",
    first: FIRST,
    href: "/government",
    topic: "government",
  },
  {
    id: "interconnect",
    say: "Our AI cluster is waiting on its interconnect.",
    line: "Photonics & AI data centres",
    colour: "var(--acc-pho)",
    title: "The copper and optical links between your GPUs.",
    body: "DAC, ACC, AEC and AOC cables and pluggable optics at 800G and 1.6T, supplied with our US technology partner and planned around your cluster.",
    first: FIRST,
    href: "/photonics",
    topic: "photonics",
  },
];

/** A cross-section of real work across the five lines, coloured by line. */
const HOME_WALL = [
  ...wallFromWeDo(weDo.ent.slice(0, 4), "var(--acc-ent)", "Enterprise AI"),
  ...wallFromWeDo(weDo.pha.slice(0, 3), "var(--acc-pha)", "Pharma AI"),
  ...wallFromWeDo(weDo.men.slice(0, 2), "var(--acc-men)", "Healthcare AI"),
  ...wallFromWeDo(weDo.sov.slice(0, 1), "var(--acc-pho)", "Sovereign AI"),
  ...wallFromWeDo(weDo.pho.slice(0, 2), "var(--acc-pho)", "Photonics"),
];

const HOME_TITLE = "Praverse Tech | AI & ML Development Company, Vadodara, India";

export const metadata: Metadata = {
  ...pageMeta({
    title: HOME_TITLE,
    description:
      "AI and ML development company in Vadodara, Gujarat: custom AI agents, LLM apps, machine learning and computer vision for any industry, plus 800G/1.6T interconnect.",
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
    colour: "#9b7bff",
    we: weDo.ent.slice(0, 3).map((w) => w.title),
    href: "/enterprise-ai",
    title: "Enterprise AI & Agents",
    body: "Agents, copilots, document intelligence and production ML that work inside the systems your teams already use — and stop for a named reviewer before anything is sent, filed or changed.",
    tags: ["Agents", "RAG", "Vision", "MLOps"],
  },
  {
    n: "02",
    colour: "#22c98f",
    we: weDo.pha.slice(0, 3).map((w) => w.title),
    href: "/pharma",
    title: "Pharma & Regulatory AI",
    body: "FDA 483 responses, CAPA reasoning, data-integrity review and inspection readiness, built alongside people who stand in front of inspectors for a living. Every output is a draft a qualified person signs.",
    tags: ["21 CFR 211", "ICH Q9 / Q10", "ALCOA+"],
  },
  {
    n: "03",
    colour: "#45bdf5",
    we: weDo.men.slice(0, 3).map((w) => w.title),
    href: "/mennie",
    title: "Healthcare AI · MENNIE",
    body: "MENNIE, a voice-first patient assistant that meets people at the door, the kiosk or on their phone and hands the clinician a structured picture — plus imaging and screening support at the edge.",
    tags: ["Voice-first", "Imaging", "Edge AI"],
  },
  {
    n: "04",
    colour: "#f5a524",
    we: weDo.pho.slice(0, 3).map((w) => w.title),
    href: "/photonics",
    title: "Photonics & AI Data Centres",
    body: "The copper and optical interconnect that AI clusters are built on — DAC, ACC, AEC, AOC and pluggable optics at 800G and 1.6T — designed in and qualified in India with our US technology partner.",
    tags: ["800G", "1.6T", "Copper + optics"],
  },
];

export default function HomePage() {
  return (
    <>
      <PrismHero lead={brief("/").lead} />

      {/* ------------------------------------------------------- the facts */}
      <Section tight>
        <dl className="pv-bignums">
          {[
            { v: "04", l: "Lines of work", n: "One engineering core" },
            { v: String(bentoItems.length), l: "Sectors we build for", n: "Three flagship lines" },
            { v: "03", l: "Markets", n: "India · US · Europe" },
            { v: String(company.ideaFrom), l: "Building since", n: `${locations.cities.length} cities · HQ Vadodara` },
          ].map((x) => (
            <div className="pv-bignum" key={x.l}>
              <dt className="pv-bignum-l">{x.l}</dt>
              <dd>
                <span className="pv-bignum-v" data-count={x.v}>
                  {x.v}
                </span>
                <span className="pv-bignum-n">{x.n}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ------------------------------------------------- your problem */}
      <Section id="problem">
        <SectionHead
          eyebrow="Start here"
          title={
            <>
              What is the <em>problem</em> on your desk?
            </>
          }
          lede="Pick the one that sounds like yours. This is what we would build for it, and what you would have in your hands first."
        />
        <ProblemFinder items={PROBLEMS} />
      </Section>

      {/* ------------------------------------------------ already trusted */}
      {ENGAGED ? (
        <Section tone="raised">
          <Statement
            eyebrow="Already at work"
            lead={
              <>
                Already working with <em>global and Indian</em> pharmaceutical companies.
              </>
            }
            rest="Described here, never named."
          />
          <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }} />
          <CapWall
            kicker="Engagement"
            items={[
              {
                title: "A global generics manufacturer",
                body: "Headquartered in the United States, with manufacturing plants in India.",
                colour: "var(--acc-pha)",
              },
              {
                title: "Two Indian pharmaceutical groups",
                body: "Pharmaceutical groups in India that we work with directly.",
                colour: "var(--acc-pha)",
              },
              {
                title: "A pharma regulatory-technology company",
                body: "An FDA 483 intelligence platform, built under contract.",
                wide: true,
                colour: "var(--acc-pha)",
                tag: "Built",
              },
            ]}
          />
          <p className="pv-proof-note">
            Client names are kept confidential. We describe the work, never the client.
          </p>
        </Section>
      ) : null}

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
        <LineSpectrum
          lines={LINES.map(({ n, colour, href, title, body, tags, we }) => ({ n, colour, href, title, body, tags, we }))}
        />
      </Section>

      {/* ------------------------------------------- operating principle */}
      <Section tone="raised">
        <Statement
          eyebrow="02 · Operating principle"
          lead={
            <>
              The system drafts. <em>Your experts</em> decide.
            </>
          }
          rest="The review gate is part of the architecture, not a setting."
          foot={pillars.map((p) => ({ title: p.title, body: p.body }))}
        />
        <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
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
                { t: "09:41", k: "Asked by", v: "Quality lead, via the team inbox" },
                { t: "09:42", k: "Surfaced", v: "Three SOP sections and four batch records, each linked" },
                { t: "10:05", k: "Decided by", v: "Named reviewer — draft edited, then approved" },
              ]}
            />
          </Figure>
        </div>
      </Section>

      {/* ------------------------------------------------ capabilities wall */}
      <Section>
        <SectionHead
          index="03"
          eyebrow="Capabilities"
          title={
            <>
              Specific systems, <em>not slideware</em>.
            </>
          }
          lede="Built or being built by our engineers, across every line we run. Client work is described without names; the tag shows where each one stands."
        />
        <CapWall items={HOME_WALL} />
      </Section>

      {/* ------------------------------------------------------ industries */}
      <Section tone="raised">
        <SectionHead
          index="04"
          eyebrow="Industries"
          title={
            <>
              Three lines in depth. <em>Every sector</em> in reach.
            </>
          }
          lede="Pharma, healthcare and government are where we go deepest. The same engineering carries wherever a qualified person has to read a lot, decide well and show their working."
        />
        <IndustriesBento flagshipOnly exclude="government" />
        <ul className="sx" aria-label="Every sector we build for">
          {sectors.map((x) => (
            <li key={x.slug}>
              <Link href={`/industries/${x.slug}`}>
                <SectorIcon name={x.icon} size={16} />
                {x.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------ government */}
      <Section>
        <FeatureBand
          eyebrow="05 · Government & public sector"
          title={
            <>
              Sovereign AI for the <em>public sector</em>.
            </>
          }
          lede="Air-gapped and on-premise deployments, inspection intelligence for regulators, public-health platforms and e-governance automation. One office pilots, a named officer signs off, and only then does it scale."
          actions={
            <>
              <Link className="btn-p" href="/government">
                Government & public sector <span aria-hidden="true">→</span>
              </Link>
              <a
                className="btn-g"
                href={`mailto:${site.enquiryEmail}?subject=${encodeURIComponent("Capability statement request")}`}
              >
                Request a capability statement
              </a>
            </>
          }
          visual={<GovVisual />}
        />
      </Section>

      {/* ---------------------------------------------------- engagement */}
      <Section tone="raised">
        <SectionHead
          index="06"
          eyebrow="How an engagement runs"
          title={
            <>
              Problem to <em>production</em>, in four steps.
            </>
          }
          lede={`${company.promise} Each step ends in something you can read, test or run.`}
        />
        <BigSteps
          items={howWeWork.map((h, i) => ({
            title: h.step,
            body: h.body,
            tag: ["Workflow map", "Written plan", "Working system", "Live and measured"][i],
          }))}
        />
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
