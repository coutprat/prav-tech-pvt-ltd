import type { Metadata } from "next";
import { ScrollSequence } from "@/components/motion/ScrollSequence";
import { Headline } from "@/components/ui/Headline";
import { ReachChart } from "@/components/sections/ReachChart";
import { CapacityChart } from "@/components/sections/CapacityChart";
import {
  SectionLabel,
  MilestoneTracker,
  CTASection
} from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { photonicsFrames } from "@/content/media";
import {
  formFactors,
  photonicsMilestones,
  portfolio,
  speedRoadmap,
  whySovereign
} from "@/content/company";

export const metadata: Metadata = {
  title: "Photonics & AI Data Centres",
  description:
    "High-speed copper and optical interconnect for India's sovereign AI data centres — architecture, design-in, qualification and support."
};

export default function PhotonicsPage() {
  return (
    <>
      {/* The hero's first frame is the LCP element — preload it so it is not
          queued behind the JS bundles. */}
      <link
        rel="preload"
        as="image"
        href={`${photonicsFrames.desktop.dir}/frame-0001.webp`}
        fetchPriority="high"
      />

      <ScrollSequence
        desktop={photonicsFrames.desktop}
        mobile={photonicsFrames.mobile}
        poster={photonicsFrames.poster}
        alt="An empty data-hall floor. Rows of racks rise, amber copper links light inside each rack, teal optical fibres race across the rows to the spine switches, and the camera lifts to a top view of the hall."
        scrollLength={420}
        chapters={[
          {
            title: "Copper inside the rack.",
            body: "Passive and active copper where the distance is short and the budget is power.",
            from: 0,
            to: 0.45
          },
          {
            title: "Optics across the hall.",
            body: "Fibre from the row to the spine, where copper runs out of reach.",
            from: 0.45,
            to: 0.74
          },
          {
            title: "400G → 800G → 1.6T.",
            body: "800G is mainstream for AI clusters today. 1.6T is ramping.",
            from: 0.74,
            to: 1.01
          }
        ]}
      />

      <section className="section">
        <div className="wrap">
          <SectionLabel accent="amber">Photonics &amp; AI data centres</SectionLabel>
          <Headline as="h1" className="display">
            The layer every AI cluster runs on.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            An AI cluster is only as fast as the links between its GPUs. We supply
            and design in the copper and optical interconnect that carries that
            traffic — with the architecture, qualification and support done in India.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ reach chart */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="amber">Reach</SectionLabel>
          <Headline onScroll>Copper is cheaper. Optics goes further.</Headline>
          <p className="body-2" style={{ marginTop: 20 }}>
            Typical maximum reach by media type. Indicative figures — actual reach
            depends on speed, cable construction and the link budget you design to.
          </p>
          <ReachChart />
        </div>
      </section>

      {/* -------------------------------------------------------- portfolio */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="amber">Portfolio</SectionLabel>
          <Headline onScroll>Six families, one supply chain.</Headline>
          <p className="body-2" style={{ marginTop: 20 }}>
            Supplied through <Verify id="infraeo-consent">our US technology partner</Verify>.
          </p>

          <div className="grid-3">
            {portfolio.map((p) => (
              <article className="card" key={p.title}>
                <p className="line-card-n">{p.sub}</p>
                <h3 className="h3" style={{ marginTop: 12 }}>
                  {p.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {p.body}
                </p>
                <p className="mono" style={{ marginTop: 18, color: "var(--amber-ink)" }}>
                  {p.title === "AEC" ? (
                    <Verify id="aec-reach" />
                  ) : (
                    p.speeds
                  )}
                </p>
              </article>
            ))}
          </div>

          <div className="spec-pair">
            <div>
              <h3 className="mono" style={{ color: "var(--ink-2)" }}>
                Form factors
              </h3>
              <ul className="chip-list">
                {formFactors.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="body-2" style={{ marginTop: 16, fontSize: 15 }}>
                Ethernet and InfiniBand.
              </p>
            </div>
            <div>
              <h3 className="mono" style={{ color: "var(--ink-2)" }}>
                Speeds
              </h3>
              <ul className="speed-list">
                {speedRoadmap.map((s) => (
                  <li key={s.speed}>
                    <b className="num">{s.speed}</b>
                    <span>{s.status}</span>
                  </li>
                ))}
              </ul>
              <p className="body-2" style={{ marginTop: 16, fontSize: 15 }}>
                Indicative direction, not dated commitments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- india market */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="amber">India</SectionLabel>
          <Headline onScroll>The capacity is being built now.</Headline>
          <CapacityChart />
        </div>
      </section>

      {/* ------------------------------------------------------- our model */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="amber">Our model</SectionLabel>
          <Headline onScroll>What we actually do.</Headline>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <p className="lede">
                <Verify id="infraeo-consent">Our US technology partner</Verify> builds
                the interconnect. Praverse does the Indian architecture, design-in,
                integration, qualification and support, for sovereign AI data centres.
              </p>
              <p className="body-2" style={{ marginTop: 24 }}>
                <strong>We do not manufacture in India today.</strong> Local testing
                and qualification come first; assembly follows when volumes justify
                it. We would rather say that plainly than imply a factory we do not
                have.
              </p>
            </div>

            <ul className="why-list">
              {whySovereign.map((w) => (
                <li key={w.title}>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ milestones */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="amber">Roadmap</SectionLabel>
          <Headline onScroll>Where this goes.</Headline>
          <div style={{ marginTop: 48 }}>
            <MilestoneTracker items={photonicsMilestones} />
          </div>
        </div>
      </section>

      <CTASection
        title="Designing a cluster?"
        body="Send us the topology and the distances. You get a written plan within two business days."
      />
    </>
  );
}
