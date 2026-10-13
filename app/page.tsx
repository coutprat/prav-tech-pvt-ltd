import Link from "next/link";
import Image from "next/image";
import { ScrollSequence } from "@/components/motion/ScrollSequence";
import { Headline } from "@/components/ui/Headline";
import { ProofBar } from "@/components/ui/ProofBar";
import { BusinessLineCard } from "@/components/ui/BusinessLineCard";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { homeFrames } from "@/content/media";
import { businessLines, company, howWeWork, people, pillars } from "@/content/company";

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <ScrollSequence
        desktop={homeFrames.desktop}
        mobile={homeFrames.mobile}
        poster={homeFrames.poster}
        alt="A white ceramic core on a plinth. An orbital ring draws around it and four modules dock onto the ring in turn, each lighting its teal seams: Enterprise AI, Pharma AI, Healthcare AI, Photonics."
        scrollLength={420}
        chapters={[
          {
            title: "One core.",
            body: "A single engineering practice underneath everything we ship.",
            from: 0,
            to: 0.2
          },
          {
            title: "Enterprise AI & Agents",
            body: "Agents and copilots inside the workflows your teams already run.",
            from: 0.2,
            to: 0.38
          },
          {
            title: "Pharma & Regulatory AI",
            body: "483 responses, CAPA and inspection readiness — expert-reviewed.",
            from: 0.38,
            to: 0.56
          },
          {
            title: "Healthcare AI",
            body: "MENNIE meets patients at the door and hands clinicians a structured picture.",
            from: 0.56,
            to: 0.74
          },
          {
            title: "Photonics & AI Data Centres",
            body: "The interconnect layer for India's sovereign AI data centres.",
            from: 0.74,
            to: 1.01
          }
        ]}
      />

      {/* ------------------------------------------------------ statement */}
      <section className="section">
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
          `Founded ${company.founded}`,
          "Vadodara, India",
          <Verify key="pubs" id="publications-count" />,
          <Verify key="patent" id="mennie-patent" />,
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
            {businessLines.map((l) => (
              <BusinessLineCard
                key={l.id}
                n={l.n}
                href={l.href}
                title={l.title}
                blurb={l.blurb}
                tags={l.tags}
                motif={l.motif}
              />
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

      {/* ------------------------------------------------------ leadership */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Who you work with</SectionLabel>
          <div className="leader-head">
            <Headline onScroll>Small team. Long résumés.</Headline>
            <Link className="btn btn-ghost" href="/company">
              Meet the team
            </Link>
          </div>

          <ul className="leader-strip">
            {people.map((p) => (
              <li key={p.slug}>
                <Link href="/company">
                  <Image
                    src={`/team/${p.slug}-mono.webp`}
                    alt={`Portrait of ${p.name}`}
                    width={800}
                    height={1000}
                    sizes="(min-width: 900px) 30vw, 90vw"
                  />
                  <p className="person-name" style={{ fontSize: 19 }}>
                    {p.name}
                  </p>
                  <p className="person-role">{p.role}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------- how we work */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>How we work</SectionLabel>
          <Headline onScroll>Four steps, no mystery.</Headline>

          <ol className="steps">
            {howWeWork.map((s, i) => (
              <li key={s.step}>
                <span className="steps-n num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{s.step}</h3>
                <p className="body-2">{s.body}</p>
              </li>
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
