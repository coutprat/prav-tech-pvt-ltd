import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import { WeDoList } from "@/components/pv/WeDoList";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";
import { agentTypes, capabilities } from "@/content/company";
import { thesis } from "@/content/thesis";
import { industries } from "@/content/industries";
import { offers } from "@/content/offers";
import {
  Card,
  CtaBand,
  Figure,
  Grid,
  Rows,
  Section,
  SectionHead,
} from "@/components/pv/kit";
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
const nn = (i: number) => String(i + 1).padStart(2, "0");

export default function EnterpriseAIPage() {
  return (
    <div data-acc="enterprise">
      <PageJsonLd path="/enterprise-ai" />
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
        <SectionHead
          as="h1"
          index="01"
          eyebrow="Enterprise AI & agents"
          title={
            <>
              The gate is the <em>architecture</em>.
            </>
          }
          lede="An agent that can act without review is a liability in any regulated business. Ours stop at a person by design, and write down who asked, what was surfaced and who decided — so the answer to “how was this decided?” exists before anybody asks."
        />
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
      <Section tone="raised" accent="ent">
        <SectionHead
          index="02"
          eyebrow="Capabilities"
          title={
            <>
              Six things we build, <em>and what they change</em>.
            </>
          }
          lede="Each is described twice: what we build, and what it means for the people who live with it afterwards."
        />
        <Grid cols={3}>
          {capabilities.map((c, i) => (
            <Card key={c.title} n={nn(i)} title={c.title} accent="ent">
              <p>{c.body}</p>
              <p className="pv-means">{c.means}</p>
            </Card>
          ))}
        </Grid>
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
          lede="Four scoped ways in. Each runs on your documents or data rather than a demo set, and ends in something you can test — with an honest account of where it does not work yet."
        />
        <Rows
          items={offers.map((o, i) => ({
            k: nn(i),
            title: o.title,
            body: (
              <>
                <p>{o.body}</p>
                <p className="pv-means">{o.gets}</p>
              </>
            ),
          }))}
        />
      </Section>

      {/* ------------------------------------------------------ agent types */}
      <Section accent="ent">
        <SectionHead
          index="05"
          eyebrow="Agents"
          title={
            <>
              Four agents that <em>earn their keep</em>.
            </>
          }
        />
        <Grid cols={4}>
          {agentTypes.map((a, i) => (
            <Card key={a.title} n={nn(i)} title={a.title} accent="ent">
              <p>{a.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ------------------------------------------------------ industries */}
      <Section tone="raised" accent="ent">
        <SectionHead
          index="06"
          eyebrow="Industries"
          title={
            <>
              Any industry that runs on <em>documents and decisions</em>.
            </>
          }
        />
        <ul className="pv-index">
          {industries.map((ind) => (
            <li key={ind.name} className="pv-rise">
              <h3>{ind.name}</h3>
              <p>{ind.use}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------- we build */}
      <Section accent="ent">
        <SectionHead
          index="07"
          eyebrow="What we build"
          title={
            <>
              Six systems we <em>ship</em>.
            </>
          }
          lede="Specific systems our engineers have built or are building now. Client work is described without names; the tag shows where each one stands today."
        />
        <WeDoList items={weDo.ent} />
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
