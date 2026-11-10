import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import { BigSteps, CapWall, Statement, wallFromWeDo } from "@/components/pv/kit3";
import { AgentVisual } from "@/components/pv/LineVisuals";
import { IndustriesBento } from "@/components/pv/IndustriesBento";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";
import { agentTypes, capabilities } from "@/content/company";
import { thesis } from "@/content/thesis";
import { offers } from "@/content/offers";
import { CtaBand, Figure, PageHero, Section, SectionHead } from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";

/**
 * The signature, as film rather than as a console mockup.
 *
 * Every beat the old interface showed is still here: what the agent read, that
 * it stops, who approves, that it is logged. It is told in type over the room
 * the work happens in instead of in a table, because at this stage of a sale a
 * reader will feel a room and will not study a screenshot.
 */
const EA_CHAPTERS: Chapter[] = [
  {
    kind: "statement",
    at: [0, 0.17],
    text: "A question lands in someone’s queue.",
    sub: "“Is sampling witnessed for Q3 batches?” — the kind of question that costs an afternoon and gets asked again next quarter.",
  },
  {
    kind: "beats",
    at: [0.17, 0.47],
    beats: [
      {
        label: "Reads",
        text: "214 pages of the SOP, and finds the three sections that matter",
      },
      {
        label: "Checks",
        text: "1,204 batch records against them, and flags four",
      },
      {
        label: "Drafts",
        text: "a reply, with every claim carrying the source it came from",
      },
    ],
  },
  {
    kind: "statement",
    at: [0.47, 0.68],
    text: "Then it stops.",
    sub: "Nothing is sent, filed or actioned until a named reviewer approves it. That is the architecture, not a setting you can switch off.",
  },
  {
    kind: "beats",
    at: [0.68, 0.88],
    beats: [
      { label: "Recorded", text: "who asked" },
      { label: "Recorded", text: "what the system surfaced" },
      { label: "Recorded", text: "who decided, and when" },
    ],
  },
  {
    kind: "statement",
    at: [0.88, 1.01],
    text: "The system drafts. Your team decides.",
    sub: "Two years later, somebody will ask how that decision was made. The answer is already written down.",
  },
];

export const metadata: Metadata = pageMeta({
  title: "Enterprise AI & Agents for Any Industry",
  description:
    "Custom AI agents, copilots, RAG search and production ML for manufacturing, finance, retail, healthcare, logistics and more — with a human gate and audit trail.",
  path: "/enterprise-ai",
  og: "enterprise-ai",
});

const A = "var(--acc-ent-bright)";
const ENT = "var(--acc-ent)";

export default function EnterpriseAIPage() {
  return (
    <div data-acc="enterprise">
      <PageJsonLd path="/enterprise-ai" />
      <PageHero
        eyebrow="Enterprise AI & agents"
        accent="ent"
        title={
          <>
            The gate is the <em>architecture</em>.
          </>
        }
        lede="Agents, copilots, search and production ML for any business that runs on documents and decisions. Ours read, check and draft — then stop at a named person, and write down who decided."
        actions={
          <>
            <Link className="btn-p" href="/start-a-project">
              Scope a pilot <span aria-hidden="true">→</span>
            </Link>
            <a className="btn-g" href="#build">
              What we build
            </a>
          </>
        }
        meta={["Human gate by design", "Cited to the source", "Every decision logged"]}
        visual={<AgentVisual />}
      />
      <FilmSection
        id="ea-film"
        video={signatureVideo.enterpriseAi}
        chapters={EA_CHAPTERS}
        accent="var(--acc-ent-bright)"
        label="An agent run: what it reads, that it stops at a human reviewer, and what is recorded"
        caption="Illustrative run. Documents, counts and timings are generic examples."
      />

      {/* --------------------------------------------------- architecture */}
      <Section accent="ent">
        <Statement
          eyebrow="01 · The principle"
          lead="An agent that can act without review is a liability."
          rest="Ours stop at a person, so the answer to “how was this decided?” exists before anybody asks."
        />
        <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }} />
        <Figure
          n="01"
          title="Anatomy of an agent we deploy"
          caption="Reference architecture, simplified. Access rules travel with documents into the index, so the agent can only read what the person asking could read. Every drafted sentence links to its source. Nothing reaches a system of record before the gate."
        >
          <Flow
            accent={A}
            nodes={[
              {
                k: "Sources",
                title: "Where knowledge lives",
                body: "Drives, wikis, tickets, ERP and email — connected where they are.",
                tags: ["Drive", "Wiki", "ERP", "Tickets"],
              },
              {
                k: "Index",
                title: "Retrieval with permissions",
                body: "Each passage keeps its source and its access rules.",
              },
              {
                k: "Agent",
                title: "Plans, uses tools, drafts",
                body: "Every answer cites the passage it came from.",
              },
              {
                k: "Gate",
                title: "Named reviewer",
                body: "Approves, edits or rejects.",
                gate: true,
                wait: "Awaiting review",
                ok: "Approved",
              },
              {
                k: "Systems",
                title: "Recorded, then actioned",
                body: "Filed, sent or updated — and logged.",
              },
            ]}
            ledger={[
              {
                t: "14:02",
                k: "Asked by",
                v: "Operations analyst — a question in plain English",
              },
              {
                t: "14:02",
                k: "Read",
                v: "Two policies, one contract, eleven tickets — each linked",
              },
              {
                t: "14:31",
                k: "Decided by",
                v: "Team lead — approved with one edit",
              },
            ]}
          />
        </Figure>
      </Section>

      {/* ----------------------------------------------------- capabilities */}
      <Section tone="raised" accent="ent" id="build">
        <SectionHead
          index="02"
          eyebrow="Capabilities"
          title={
            <>
              What we build, <em>and what it changes</em>.
            </>
          }
          lede="Six capabilities and four agents. Each one says what it does and what it means for the people who live with it afterwards."
        />
        <CapWall
          items={[
            ...capabilities.map((c, i) => ({
              title: c.title,
              body: `${c.body} ${c.means}`,
              kicker: `Capability ${String(i + 1).padStart(2, "0")}`,
              colour: ENT,
            })),
            ...agentTypes.map((a) => ({ title: a.title, body: a.body, kicker: "Agent", colour: ENT })),
          ]}
        />
      </Section>

      {/* ------------------------------------------------------- our view */}
      <Section accent="ent">
        <SectionHead
          index="03"
          eyebrow={thesis.label}
          title={thesis.headline}
          lede={thesis.lede}
        />
        <Figure
          n="02"
          title="Several models, one answer, one person"
          caption="Each model has one job. Where they disagree, the disagreement is written down and handed to the reviewer instead of being smoothed into a confident paragraph."
        >
          <Flow
            accent={A}
            cycle={8}
            nodes={[
              ...thesis.roles.map((r) => ({ k: r.name, title: r.body })),
              {
                k: "Person",
                title: "A qualified reviewer decides",
                gate: true,
                wait: "With the reviewer",
                ok: "Decided",
              },
            ]}
          />
        </Figure>
        <div className="pv-offset">
          <div>
            {thesis.body.map((para) => (
              <p className="pv-body pv-thesis-p" key={para.slice(0, 32)}>
                {para}
              </p>
            ))}
            <p className="pv-body pv-ink pv-thesis-p">
              {thesis.closing.text}{" "}
              <span className="pv-serif">{thesis.closing.note}</span>
            </p>
            <p className="pv-thesis-p">
              <Link className="pv-link" href={thesis.closing.href}>
                {thesis.closing.cta} <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- start small */}
      <Section tone="raised" accent="ent">
        <SectionHead
          index="04"
          eyebrow="Start small"
          title={
            <>
              Begin with <em>one pilot</em>, on your own data.
            </>
          }
          lede="Four scoped ways in. Each runs on your documents or data, not a demo set, and ends in something you can test."
        />
        <BigSteps items={offers.map((o) => ({ title: o.title, body: `${o.body} ${o.gets}` }))} />
      </Section>

      {/* ------------------------------------------------------ industries */}
      <Section accent="ent">
        <SectionHead
          index="05"
          eyebrow="Industries"
          title={
            <>
              Any industry that runs on <em>documents and decisions</em>.
            </>
          }
        />
        <IndustriesBento />
      </Section>

      {/* ------------------------------------------------------- we build */}
      <Section tone="raised" accent="ent">
        <SectionHead
          index="06"
          eyebrow="What we build"
          title={
            <>
              Systems we <em>ship</em>.
            </>
          }
          lede="Specific systems our engineers have built or are building now. Client work is described without names; the tag shows where each one stands today."
        />
        <CapWall items={wallFromWeDo(weDo.ent, ENT)} />
      </Section>

      <CtaBand
        title={
          <>
            Have a workflow <em>in mind</em>?
          </>
        }
        body="Describe it in plain language. You get a written plan within two business days."
      />
    </div>
  );
}
