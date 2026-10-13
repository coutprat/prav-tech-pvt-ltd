import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";

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
    sub: "“Is sampling witnessed for Q3 batches?” — the kind of question that costs an afternoon and gets asked again next quarter."
  },
  {
    kind: "beats",
    at: [0.17, 0.47],
    beats: [
      { label: "Reads", text: "214 pages of the SOP, and finds the three sections that matter" },
      { label: "Checks", text: "1,204 batch records against them, and flags four" },
      { label: "Drafts", text: "a reply, with every claim carrying the source it came from" }
    ]
  },
  {
    kind: "statement",
    at: [0.47, 0.68],
    text: "Then it stops.",
    sub: "Nothing is sent, filed or actioned until a named reviewer approves it. That is the architecture, not a setting you can switch off."
  },
  {
    kind: "beats",
    at: [0.68, 0.88],
    beats: [
      { label: "Recorded", text: "who asked" },
      { label: "Recorded", text: "what the system surfaced" },
      { label: "Recorded", text: "who decided, and when" }
    ]
  },
  {
    kind: "statement",
    at: [0.88, 1.01],
    text: "The system drafts. Your team decides.",
    sub: "Two years later, somebody will ask how that decision was made. The answer is already written down."
  }
];

import { Headline } from "@/components/ui/Headline";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { agentFlow, agentTypes, capabilities } from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Enterprise AI & Agents",
  description: "Agents, copilots, RAG search and production ML inside real workflows — with a human gate and an audit trail in the architecture.",
  path: '/enterprise-ai',
  og: 'enterprise-ai'
});

export default function EnterpriseAIPage() {
  return (
    <div data-acc="enterprise">
      <FilmSection
        id="ea-film"
        video={signatureVideo.enterpriseAi}
        chapters={EA_CHAPTERS}
        accent="var(--acc-ent-bright)"
        label="An agent run: what it reads, that it stops at a human reviewer, and what is recorded"
        caption="Illustrative run. Documents, counts and timings are generic examples."
      />

      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">Enterprise AI &amp; agents</SectionLabel>
          <Headline as="h1" className="display">
            The gate is the architecture.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            An agent that can act without review is a liability in any regulated
            business. Ours stop at a person by design — and write down who asked,
            what was surfaced, and who decided.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------- capabilities */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Capabilities</SectionLabel>
          <Headline onScroll>Six things we build.</Headline>
          <div className="grid-3">
            {capabilities.map((c) => (
              <article className="card" key={c.title}>
                <h3 className="h3" style={{ fontSize: 20 }}>
                  {c.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {c.body}
                </p>
                <p className="card-means">{c.means}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ agent types */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Agents</SectionLabel>
          <Headline onScroll>Four that earn their keep.</Headline>
          <div className="grid-4">
            {agentTypes.map((a, i) => (
              <article className="card" key={a.title}>
                <p className="line-card-n">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="h3" style={{ fontSize: 20, marginTop: 12 }}>
                  {a.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {a.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mono" style={{ marginTop: 64, color: "var(--ink-2)" }}>
            How a request moves
          </p>
          <ol className="flow">
            {agentFlow.map((f) => (
              <li key={f} data-accent={f === "Expert review"}>
                {f}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Have a workflow in mind?"
        body="Describe it in plain language. You get a written plan within two business days."
      />
    </div>
  );
}
