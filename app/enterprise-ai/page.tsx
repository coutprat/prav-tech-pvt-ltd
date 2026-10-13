import type { Metadata } from "next";
import { Checkpoint } from "@/components/sections/Checkpoint";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { agentFlow, agentTypes, capabilities } from "@/content/company";

export const metadata: Metadata = {
  title: "Enterprise AI & Agents",
  description:
    "Agents, copilots, RAG search and production ML inside real workflows — with a human gate and an audit trail in the architecture."
};

export default function EnterpriseAIPage() {
  return (
    <div data-acc="enterprise">
      <Checkpoint />

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
