import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PhotonicsHero } from "@/components/sections/PhotonicsHero";
import { ModuleSection } from "@/components/sections/ModuleSection";
import { ReachRace } from "@/components/sections/ReachRace";
import { CapacityHubs } from "@/components/sections/CapacityHubs";
import { Aurora } from "@/components/ui/Aurora";
import { Headline } from "@/components/ui/Headline";
import { CapacityChart } from "@/components/sections/CapacityChart";
import {
  SectionLabel,
  MilestoneTracker,
  CTASection
} from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { locations } from "@/content/site";
import { photonicsFrames } from "@/content/media";
import {
  formFactors,
  photonicsPhases,
  portfolio,
  speedRoadmap,
  whySovereign
} from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Photonics & AI Data Centres",
  description: "India's partner for high-speed AI interconnect: supply and design-in today, Indian manufacturing on a staged roadmap.",
  path: '/photonics',
  og: 'photonics'
});

export default function PhotonicsPage() {
  return (
    <div data-acc="photonics">
      {/* The hero's first frame is the LCP element — preload it so it is not
          queued behind the JS bundles. */}
      <link
        rel="preload"
        as="image"
        href={`${photonicsFrames.desktop.dir}/frame-0001.webp`}
        fetchPriority="high"
      />

      <PhotonicsHero frames={photonicsFrames} />

      <section className="section" style={{ position: "relative" }}>
        <Aurora
          blobs={[
            { color: "var(--acc-pho)", x: 18, y: 32, size: 520 },
            { color: "var(--acc-pho-2)", x: 80, y: 62, size: 480 }
          ]}
        />
        <div className="wrap">
          <SectionLabel accent="line">Photonics &amp; AI data centres</SectionLabel>
          <Headline as="h1" className="display">
            The layer every AI cluster runs on.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            An AI cluster is only as fast as the links between its GPUs. We are
            India&rsquo;s partner for the copper and optical interconnect that
            carries that traffic — supplying and designing it in today, and
            building the capability to manufacture it here.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ reach chart */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel accent="line">Reach</SectionLabel>
          <Headline onScroll>Copper is cheaper. Optics goes further.</Headline>
          <p className="body-2" style={{ marginTop: 20 }}>
            Typical maximum reach by media type. Indicative figures — actual reach
            depends on speed, cable construction and the link budget you design to.
          </p>
          <ReachRace />
        </div>
      </section>

      <ModuleSection />

      {/* -------------------------------------------------------- portfolio */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">Portfolio</SectionLabel>
          <Headline onScroll>Six families, one supply chain.</Headline>
          <p className="body-2" style={{ marginTop: 20 }}>
            Supplied through <Verify id="infraeo-consent">our US technology partner</Verify>.
          </p>

          <div className="grid-3">
            {portfolio.map((p) => (
              <article className="card port-card" key={p.title}>
                <p className="line-card-n">{p.sub}</p>
                <h3 className="h3" style={{ marginTop: 12 }}>
                  {p.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {p.body}
                </p>
                <p className="mono" style={{ marginTop: 18, color: "var(--acc-pho-ink)" }}>
                  {p.title === "AEC" ? <Verify id="aec-reach" /> : p.speeds}
                </p>
                <div className="port" aria-hidden="true">
                  <span className="port-cable" />
                  <span className="port-body" />
                  <span className="port-led" />
                </div>
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
          <SectionLabel accent="line">India</SectionLabel>
          <Headline onScroll>The capacity is being built now.</Headline>
          <CapacityChart />
          <CapacityHubs />
          <p className="body-2" style={{ marginTop: 26, maxWidth: "62ch" }}>
            Interconnect is a local business: someone has to be on site when a
            cluster is qualified, and on the phone in the same time zone when it
            is not. Four of those five markets are cities where we have team
            members.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- our model */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">Our model</SectionLabel>
          <Headline onScroll>
            Building India&rsquo;s AI interconnect capability — in three phases.
          </Headline>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <p className="lede">
                <Verify id="infraeo-consent">Our US technology partner</Verify> builds
                the interconnect. Praverse does the Indian architecture, design-in,
                integration, qualification and support, for sovereign AI data centres.
              </p>
              <p className="body-2" style={{ marginTop: 24 }}>
                Each phase is unlocked by customer demand, so capacity arrives
                when India&rsquo;s AI build-out needs it — not before.
              </p>
              <p className="body-2" style={{ marginTop: 16, fontSize: 15 }}>
                Our team works from the cities that hold most of India&rsquo;s
                data-centre capacity, close to where deployments happen.
                Vadodara to Mumbai is about {locations.hqToMumbaiKm} km.
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
          <SectionLabel accent="line">Roadmap</SectionLabel>
          <Headline onScroll>Where this goes.</Headline>
          <div style={{ marginTop: 48 }}>
            <MilestoneTracker items={photonicsPhases} />
          </div>
          <p className="body-2" style={{ marginTop: 28, fontSize: 15 }}>
            Phases 2 and 3 are plans, not facilities. We will not show you a
            factory we do not have, and we will not quote a location, a
            capacity or a date until one is signed.
          </p>
        </div>
      </section>

      <CTASection
        title="Designing a cluster?"
        body="Send us the topology and the distances. You get a written plan within two business days."
      />
    </div>
  );
}
