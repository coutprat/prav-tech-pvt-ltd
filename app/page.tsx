import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { HomeHero } from "@/components/sections/HomeHero";
import { Aurora, allLineBlobs } from "@/components/ui/Aurora";
import { ScrollTint } from "@/components/ui/ScrollTint";
import { Reveal } from "@/components/ui/Reveal";
import { Headline } from "@/components/ui/Headline";
import { ProofBar } from "@/components/ui/ProofBar";
import { BusinessLineCard } from "@/components/ui/BusinessLineCard";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { homeFrames } from "@/content/media";
import { businessLines, company, howWeWork, pillars } from "@/content/company";

/** Accent per line, in the same order as content/company.ts businessLines. */
const LINE_ACCENTS = ["--acc-ent", "--acc-pha", "--acc-men", "--acc-pho"];
const LINE_GLOWS = ["#7C5CFF", "#10B981", "#38BDF8", "#F59E0B"];

export const metadata: Metadata = pageMeta({
  title: "Praverse Tech — Intelligence, engineered for industry.",
  description: "Enterprise AI for healthcare, pharma and regulated industries, and the high-speed interconnect for India's sovereign AI data centres.",
  path: '/',
  og: 'home'
});

export default function HomePage() {
  return (
    <>
      {/* The hero's first frame is the LCP element — preload it so it is not
          queued behind the JS bundles. */}
      <link
        rel="preload"
        as="image"
        href={`${homeFrames.desktop.dir}/frame-0001.webp`}
        fetchPriority="high"
      />

      {/* ---------------------------------------------------------- hero */}
      <HomeHero frames={homeFrames} />

      <ScrollTint
        sections={businessLines.map((l, i) => ({
          id: `line-${l.id}`,
          color: LINE_GLOWS[i]
        }))}
      />

      {/* ------------------------------------------------------ statement */}
      <section className="section" style={{ position: "relative" }}>
        <Aurora blobs={allLineBlobs} />
        <div className="wrap">
          <Headline as="h1" className="display">
            Intelligence, engineered for industry.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            {company.oneLiner}
          </p>
        </div>
      </section>

      <ProofBar
        items={[
          `Idea ${company.ideaFrom} · incorporated ${company.founded}`,
          "Vadodara, India",
          <Verify key="pubs" id="publications-count" />,
          <Verify key="infraeo" id="infraeo-consent" />,
          "Pharma advisory: SWATI Spentose (V-Group, est. 1952)"
        ]}
      />

      {/* -------------------------------------------------- business lines */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Four lines</SectionLabel>
          <Headline onScroll>Where the work lands.</Headline>

          <div className="line-grid">
            {businessLines.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.08}>
                <div id={`line-${l.id}`}>
                  <BusinessLineCard
                    n={l.n}
                    href={l.href}
                    title={l.title}
                    blurb={l.blurb}
                    tags={l.tags}
                    motif={l.motif}
                    accent={LINE_ACCENTS[i]}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- operating principle */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="teal">Operating principle</SectionLabel>
          <Headline onScroll>The system drafts. Your experts decide.</Headline>
          <p className="lede" style={{ marginTop: 28 }}>
            {company.principle}
          </p>

          <div className="pillar-grid">
            {pillars.map((p) => (
              <div key={p.title}>
                <h3 className="h3">{p.title}</h3>
                <p className="body-2" style={{ marginTop: 12 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- how we work */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>How we work</SectionLabel>
          <Headline onScroll>Four steps, no mystery.</Headline>

          <ol className="steps">
            {howWeWork.map((s, i) => (
              <Reveal key={s.step} as="li" delay={i * 0.07}>
                <span className="steps-n num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{s.step}</h3>
                <p className="body-2">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Tell us the problem."
        body={company.promise}
        primary={{ href: "/start-a-project", label: "Start a project" }}
        secondary={{ href: "/contact", label: "Contact" }}
      />
    </>
  );
}
