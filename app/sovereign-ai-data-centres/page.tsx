import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Headline } from "@/components/ui/Headline";
import { Aurora } from "@/components/ui/Aurora";
import { SectionLabel, CTASection, Disclaimer } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { Footprint } from "@/components/sections/Footprint";
import { stories, sovereignTests } from "@/content/sovereign";
import { photonicsPhases } from "@/content/company";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";

/**
 * The hall, and the argument over it.
 *
 * The footage is generated and shows no real facility — Praverse does not
 * operate a data centre, and the caption says so rather than letting a
 * handsome shot imply otherwise.
 */
const SOV_CHAPTERS: Chapter[] = [
  {
    kind: "statement",
    at: [0, 0.2],
    text: "A hall like this is mostly cable.",
    sub: "The GPUs get the budget and the headlines. What decides whether they reach their benchmark is the metre of copper or glass between them."
  },
  {
    kind: "beats",
    at: [0.2, 0.52],
    beats: [
      { label: "At 400G and above", text: "the margin between a link that works and one that retrains under load is small" },
      { label: "And it is set by", text: "insertion loss, the reach of the optics actually fitted, the temperature at the top of the rack at 3am" },
      { label: "None of which", text: "appears in the bill of materials" }
    ]
  },
  {
    kind: "statement",
    at: [0.52, 0.76],
    text: "Sovereign is a supply chain, not a sticker.",
    sub: "If every spare optic is a six-week import and every fault needs an engineer in another time zone, the operator is holding risk that was supposed to be designed out."
  },
  {
    kind: "statement",
    at: [0.76, 1.01],
    text: "We do the India side.",
    sub: "Architecture, design-in, integration, qualification and support — on local time, close to the clusters being built."
  }
];


export const metadata: Metadata = pageMeta({
  title: "Sovereign AI data centres",
  description:
    "What sovereignty actually requires of an AI cluster built in India, and where the interconnect decides whether it holds. Architecture, design-in, qualification and support from Praverse Tech.",
  path: "/sovereign-ai-data-centres",
  og: "photonics"
});

export default function SovereignPage() {
  return (
    <>
      <section className="page-head" style={{ position: "relative" }}>
        <Aurora
          blobs={[
            { color: "var(--acc-pho)", x: 18, y: 32, size: 520 },
            { color: "var(--acc-ent)", x: 80, y: 60, size: 420 }
          ]}
        />
        <div className="wrap">
          <SectionLabel accent="line">Sovereign AI data centres</SectionLabel>
          <Headline as="h1" className="display">
            Sovereignty is decided in the cable plant.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            A sovereign AI cluster means the compute, the data and the operator
            sit under Indian jurisdiction — so a regulated Indian business can
            train and run models without its data leaving the country&rsquo;s
            legal reach. That is a procurement and engineering problem long
            before it is a legal one, and most of it lands on the links between
            the GPUs.
          </p>
        </div>
      </section>

      <FilmSection
        id="sov-film"
        video={signatureVideo.sovereign}
        chapters={SOV_CHAPTERS}
        accent="var(--acc-pho)"
        label="Why the interconnect decides whether a sovereign AI cluster holds"
        caption="Illustrative visualisation. Not a Praverse facility — we supply and design in the interconnect, we do not operate data centres."
      />

      {/* --------------------------------------------------- what it requires */}
      <section className="section-tight">
        <div className="wrap">
          <SectionLabel>The test</SectionLabel>
          <Headline onScroll>Four questions an operator should be able to answer.</Headline>
          <p className="body-2" style={{ marginTop: 18, maxWidth: "64ch" }}>
            &ldquo;Sovereign&rdquo; is doing a lot of marketing work at the
            moment. These are the questions that separate the ones who mean it
            from the ones who have put an Indian flag on a slide.
          </p>
          <ol className="sov-tests">
            {sovereignTests.map((t, i) => (
              <li key={t.head}>
                <span className="sov-n mono">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{t.head}</h3>
                  <p>{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ market */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="line">The market</SectionLabel>
          <Headline onScroll>The capacity is being built now.</Headline>
          <p className="body-2" style={{ marginTop: 18, maxWidth: "64ch" }}>
            India&rsquo;s operational data-centre capacity is concentrated in a
            handful of markets, and our people are in four of the five largest —
            which matters, because interconnect is a job somebody has to do on
            site.
          </p>
          <Footprint />
        </div>
      </section>

      {/* ----------------------------------------------------------- stories */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Where it bites</SectionLabel>
          <Headline onScroll>Three situations we are built for.</Headline>
          <p className="body-2" style={{ marginTop: 18, maxWidth: "64ch" }}>
            Written as the shape of a real decision rather than as case studies:
            the question that gets asked, the constraint that turns out to be
            the real one, and what changes.
          </p>

          <ul className="sov-stories">
            {stories.map((s) => (
              <li className="sov-story" key={s.id}>
                <p className="sov-kind mono">
                  {s.kind === "scenario" ? "Illustrative scenario" : "Deployment"}
                </p>
                <h3>{s.title}</h3>
                <p className="sov-setting">{s.setting}</p>

                <dl className="sov-qa">
                  <dt>The question</dt>
                  <dd>{s.question}</dd>
                  <dt>What actually bites</dt>
                  <dd>{s.constraint}</dd>
                  <dt>What we do</dt>
                  <dd>{s.answer}</dd>
                </dl>
              </li>
            ))}
          </ul>

          <Disclaimer>
            These are illustrative scenarios, not customers. We do not publish a
            client&rsquo;s deployment without their written permission, and we
            will not dress a hypothetical up as a reference.
          </Disclaimer>
        </div>
      </section>

      {/* ------------------------------------------------------ what we supply */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="line">What we supply</SectionLabel>
          <Headline onScroll>The layer underneath.</Headline>

          <div className="grid-2" style={{ alignItems: "start", marginTop: 32 }}>
            <div>
              <p className="lede">
                High-speed copper and optical interconnect for AI clusters, with{" "}
                <Verify id="infraeo-consent">our US technology partner</Verify>{" "}
                building the technology and Praverse doing the Indian
                architecture, design-in, integration, qualification and support.
              </p>
              <p className="body-2" style={{ marginTop: 24 }}>
                <strong>We do not manufacture in India today.</strong> Local
                testing and qualification come first; assembly follows when
                volumes justify it. Phases 2 and 3 below are plans, not
                facilities.
              </p>
              <p style={{ marginTop: 28 }}>
                <Link className="link" href="/photonics">
                  The full photonics capability →
                </Link>
              </p>
            </div>

            <ol className="sov-phases">
              {photonicsPhases.map((p) => (
                <li key={p.stage}>
                  <p className="mono">{p.stage}</p>
                  <h3>{p.title}</h3>
                  <p className="sov-phase-body">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CTASection
        title="Building one?"
        body="Send us the topology and the distances. You get a written plan within two business days — link budgets, breakout plan, and a parts list that still makes sense at the tenth pod."
      />
    </>
  );
}
