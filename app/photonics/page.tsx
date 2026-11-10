import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import { WeDoList } from "@/components/pv/WeDoList";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { PhotonicsHero } from "@/components/sections/PhotonicsHero";
import { ModuleSection } from "@/components/sections/ModuleSection";
import { ReachFinder } from "@/components/sections/ReachFinder";
import { CapacityHubs } from "@/components/sections/CapacityHubs";
import { CapacityChart } from "@/components/sections/CapacityChart";
import { SpecTable } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { locations } from "@/content/site";
import { photonicsFrames } from "@/content/media";
import {
  formFactors,
  photonicsPhases,
  portfolio,
  speedRoadmap,
  whySovereign,
} from "@/content/company";
import {
  deliverySteps,
  engineeringDepth,
  fabricScales,
  finderMedia,
  interconnectProof,
  interop,
  lpoPoints,
  manufacturing,
  reachLadder,
  standards,
  testTools,
  transceiverFacts,
} from "@/content/interconnect";
import {
  Card,
  CtaBand,
  Figure,
  Grid,
  Note,
  Rows,
  Section,
  SectionHead,
  Stats,
} from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";
import "./photonics.css";

export const metadata: Metadata = pageMeta({
  title: "Photonics & AI Data Centres",
  description:
    "India's partner for high-speed AI interconnect: supply and design-in today, Indian manufacturing on a staged roadmap.",
  path: "/photonics",
  og: "photonics",
});

const A = "var(--acc-pho-ink)";
const nn = (i: number) => String(i + 1).padStart(2, "0");

/** Short node titles for the delivery figure; the body is the content text. */
const STEP_TITLE: Record<string, string> = {
  Choose: "A proven design",
  Guarantee: "Stood behind",
  Prove: "In your environment",
  Scale: "In volume",
};

/* ------------------------------------------------ reach at two lane rates */

/** Log axis, 0.5 m to 2 km, so 1 m and 2 km can share one track. */
const LOG_MIN = 0.5;
const LOG_MAX = 2000;
const at = (m: number) =>
  (Math.log(m / LOG_MIN) / Math.log(LOG_MAX / LOG_MIN)) * 100;
const metres = (m: number) => (m >= 1000 ? `${m / 1000} km` : `${m} m`);
const TICKS = [1, 10, 100, 1000];

/**
 * The same media at 800G and at 1.6T, side by side.
 *
 * What it shows is the one thing a buyer has to plan around: doubling the
 * lane rate shortens copper, and leaves single-mode optics where they were.
 * Every figure is the partner's published maximum, via finderMedia.
 */
function LaneReach() {
  return (
    <div className="pho-lr">
      <div className="pho-lr-key" aria-hidden="true">
        <span data-s="800">800G</span>
        <span data-s="1600">1.6T · twice the rate per lane</span>
      </div>
      <ul className="pho-lr-rows">
        {finderMedia.map((m) => {
          const a = m.reach["800G"];
          const b = m.reach["1.6T"];
          const copper = m.id === "dac" || m.id === "acc" || m.id === "aec";
          return (
            <li key={m.id} data-copper={copper || undefined}>
              <span className="pho-lr-name">
                {m.name}
                <small>{m.long}</small>
              </span>
              <span className="pho-lr-track" aria-hidden="true">
                {TICKS.map((t) => (
                  <i key={t} style={{ left: `${at(t)}%` }} />
                ))}
                <span
                  className="pho-lr-bar"
                  data-s="800"
                  style={{ "--w": `${at(a)}%` } as CSSProperties}
                />
                {b > 0 ? (
                  <span
                    className="pho-lr-bar"
                    data-s="1600"
                    style={{ "--w": `${at(b)}%` } as CSSProperties}
                  />
                ) : null}
              </span>
              <span className="pho-lr-v num">
                {metres(a)}
                <span aria-hidden="true"> → </span>
                <span className="sr-only"> at 800G, </span>
                {b > 0 ? metres(b) : <em>not published</em>}
                <span className="sr-only"> at 1.6T</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="pho-lr-axis" aria-hidden="true">
        <span />
        <span className="pho-lr-axis-t">
          {TICKS.map((t) => (
            <b key={t} style={{ left: `${at(t)}%` }}>
              {metres(t)}
            </b>
          ))}
        </span>
        <span />
      </div>
    </div>
  );
}

export default function PhotonicsPage() {
  return (
    <div data-acc="photonics">
      <PageJsonLd path="/photonics" />
      {/* The hero's first frame is the LCP element — preload it so it is not
          queued behind the JS bundles. */}
      <link
        rel="preload"
        as="image"
        href={`${photonicsFrames.desktop.dir}/frame-0001.webp`}
        fetchPriority="high"
      />

      <PhotonicsHero frames={photonicsFrames} />

      {/* ----------------------------------------------------------- opener */}
      <Section accent="pho">
        <SectionHead
          as="h1"
          index="01"
          eyebrow="Photonics & AI data centres"
          title={
            <>
              The layer every AI cluster <em>runs on</em>.
            </>
          }
          lede="An AI cluster is only as fast as the links between its GPUs. We are India’s partner for the copper and optical interconnect that carries that traffic: supplied and designed in today with our US technology partner, with the capability to manufacture it here built in stages."
        />
        <Stats
          items={interconnectProof.map((p) => ({
            value: p.value,
            label: p.label,
            note: p.note,
          }))}
        />
      </Section>

      {/* ------------------------------------------------------------ reach */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="02"
          eyebrow="Reach"
          title={
            <>
              Copper where it wins. <em>Optics</em> where it counts.
            </>
          }
          lede="Scale-up inside the rack, scale-out between racks, scale-across the fabric. Every link gets the medium its distance and power budget call for, and nothing it does not."
        />
        <Grid cols={3}>
          {fabricScales.map((f, i) => (
            <Card
              key={f.title}
              n={`${nn(i)} · ${f.where}`}
              title={f.title}
              accent="pho"
              meta={f.media.split(" · ").map((m) => (
                <span key={m}>{m}</span>
              ))}
            >
              <p>{f.body}</p>
            </Card>
          ))}
        </Grid>

        <div className="pho-figs">
          <Figure
            n="01"
            title="What moving from 800G to 1.6T does to reach"
            caption="For an eight-lane link, 1.6T means 200G per lane instead of 100G. Copper pays for that in distance (DAC falls from 4 m to 1 m, AEC from 9 m to 4 m) while single-mode DR and FR optics hold 500 m and 2 km. That is why the point where copper ends keeps moving, and why it is measured per build. Partner-published maxima, log scale."
          >
            <LaneReach />
          </Figure>
        </div>

        <div className="pho-gap">
          <h3 className="pv-h3">
            How far, how fast? Find your starting point.
          </h3>
          <p className="pv-body pho-intro">
            Pick a distance, a speed and what you are optimising for. The answer
            comes from the same published reach figures; it is the start of a
            conversation, not a design.
          </p>
          <ReachFinder />
        </div>

        <div className="pho-table">
          <SpecTable
            caption="Maximum reach by medium — partner specification"
            columns={[
              { key: "built", head: "Built on" },
              { key: "800", head: "800G" },
              { key: "1600", head: "1.6T" },
              { key: "use", head: "Where it goes" },
            ]}
            rows={reachLadder.map((l) => ({
              head: l.medium,
              cells: [l.builtOn, l.r800, l.r1600, l.use],
            }))}
          />
        </div>
      </Section>

      <ModuleSection />

      {/* -------------------------------------------------------- portfolio */}
      <Section accent="pho">
        <SectionHead
          index="03"
          eyebrow="Portfolio"
          title={
            <>
              Six families, <em>one supply chain</em>.
            </>
          }
          lede="Copper and optical interconnect from one source, supplied through our US technology partner, so the choice at each hop is made on reach and power rather than on who happens to stock it."
        />
        <Grid cols={3}>
          {portfolio.map((p, i) => (
            <Card
              key={p.title}
              n={`${nn(i)} · ${p.sub}`}
              title={p.title}
              accent="pho"
              meta={
                <span>
                  {p.title === "AEC" ? <Verify id="aec-reach" /> : p.speeds}
                </span>
              }
            >
              <p>{p.body}</p>
            </Card>
          ))}
        </Grid>

        <div className="pho-pair">
          <div>
            <h3 className="pho-k">Form factors</h3>
            <ul className="pv-chips">
              {formFactors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="pho-small">Ethernet and InfiniBand.</p>
          </div>
          <div>
            <h3 className="pho-k">Speeds</h3>
            <ol className="pho-speeds">
              {speedRoadmap.map((s) => (
                <li key={s.speed}>
                  <b className="num">{s.speed}</b>
                  <span>{s.status}</span>
                </li>
              ))}
            </ol>
            <p className="pho-small">
              Indicative direction, not dated commitments.
            </p>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- LPO */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="04"
          eyebrow="Linear pluggable optics"
          title={
            <>
              Take the DSP out, and <em>the watts</em> go with it.
            </>
          }
        />
        <Grid cols={3}>
          {lpoPoints.map((p, i) => (
            <Card key={p.title} n={nn(i)} title={p.title} accent="pho">
              <p>{p.body}</p>
            </Card>
          ))}
        </Grid>

        <div className="pho-table">
          <SpecTable
            caption="The optical catalogue"
            columns={[{ key: "v", head: "" }]}
            rows={transceiverFacts.map((f) => ({
              head: f.head,
              cells: [...f.cells],
            }))}
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------- interop */}
      <Section accent="pho">
        <SectionHead
          index="05"
          eyebrow="Interoperability"
          title={
            <>
              Proven on the platforms <em>your fabric</em> runs on.
            </>
          }
          lede="A specification is only as good as the ecosystem around it. Every design is qualified on current test systems and for interoperability on production switches, by third parties as well as in the lab."
        />
        <Grid cols={4}>
          {interop.map((w, i) => (
            <Card key={w.title} n={nn(i)} title={w.title} accent="pho">
              <p>{w.body}</p>
            </Card>
          ))}
        </Grid>

        <div className="pho-pair">
          <div>
            <h3 className="pho-k">Standards</h3>
            <ul className="pv-chips">
              {standards.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="pho-k">{testTools.title}</h3>
            <p className="pv-body">{testTools.body}</p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------- design to volume */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="06"
          eyebrow="Design to volume"
          title={
            <>
              Proven designs, made to work <em>in your environment</em>.
            </>
          }
          lede="Design is part of the work, but it is not the point. The point is everything that turns a design into a qualified product running in your cluster, and the capacity to deliver it in volume."
        />
        <Figure
          n="02"
          title="From a proven design to volume"
          caption="Nothing is built in volume until it has been proven on your switches: signal integrity, link margin, thermals and interop. Custom work happens only where a build genuinely needs it."
        >
          <Flow
            accent={A}
            nodes={deliverySteps.map((s) => ({
              k: `${s.n} · ${s.title}`,
              title: STEP_TITLE[s.title] ?? s.title,
              body: s.body,
              ...(s.title === "Prove"
                ? { gate: true, wait: "Qualifying", ok: "Qualified" }
                : {}),
            }))}
          />
        </Figure>

        <div className="pho-gap">
          <Grid cols={3}>
            {manufacturing.map((m, i) => (
              <Card key={m.title} n={nn(i)} title={m.title} accent="pho">
                <p>{m.body}</p>
              </Card>
            ))}
          </Grid>
        </div>

        <div className="pho-gap">
          <h3 className="pho-k">Engineering behind the link</h3>
          <ul className="pv-chips">
            {engineeringDepth.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------------------------------------------------------- India */}
      <Section accent="pho">
        <SectionHead
          index="07"
          eyebrow="India"
          title={
            <>
              The capacity is <em>being built</em> now.
            </>
          }
          lede="Interconnect is a local business: someone has to be on site when a cluster is qualified, and on the phone in the same time zone when it is not. Four of the five largest markets are cities where we have team members."
        />
        <div className="pho-figs" data-pair>
          <Figure
            n="03"
            title="India’s data-centre capacity, actual and forecast"
            caption="2020 and 2025 are actuals. The three 2030 forecasts disagree by a factor of three, so they are drawn separately and attributed rather than averaged into one number. Treat 2030 as a range."
          >
            <CapacityChart />
          </Figure>
          <Figure
            n="04"
            title="Where operational capacity sits, and where our team is"
            caption="Circle area is proportional to operational capacity. Positions are schematic, not a map. Sources are printed with the figure."
          >
            <CapacityHubs />
          </Figure>
        </div>
      </Section>

      {/* ------------------------------------------------------- our model */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="08"
          eyebrow="Our model"
          title={
            <>
              India’s interconnect capability, <em>in three phases</em>.
            </>
          }
          lede="Our US technology partner builds the interconnect. Praverse does the Indian architecture, design-in, integration, qualification and support for sovereign AI data centres. Each phase is unlocked by customer demand, so capacity arrives when India’s build-out needs it, not before."
        />
        <Rows
          items={photonicsPhases.map((p, i) => ({
            k: nn(i),
            title: p.title,
            body: (
              <>
                <p className="pho-stage mono">{p.stage}</p>
                <p>{p.body}</p>
              </>
            ),
          }))}
        />
        <Note>
          Phases 2 and 3 are plans, not facilities. We will not show you a
          factory we do not have, and we will not quote a location, a capacity
          or a date until one is signed.
        </Note>

        <div className="pho-gap">
          <Grid cols={3}>
            {whySovereign.map((w, i) => (
              <Card key={w.title} n={nn(i)} title={w.title} accent="pho">
                <p>{w.body}</p>
              </Card>
            ))}
          </Grid>
          <p className="pho-small">
            Our team works from the cities that hold most of India’s data-centre
            capacity, close to where deployments happen. Vadodara to Mumbai is
            about {locations.hqToMumbaiKm} km.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------- we build */}
      <Section accent="pho">
        <SectionHead
          index="09"
          eyebrow="What we build"
          title={
            <>
              Interconnect, <em>planned per link</em>.
            </>
          }
          lede="What we deliver on this line today. Interconnect is supplied and designed in with our US technology partner; the software and planning work is ours."
        />
        <WeDoList items={weDo.pho} />
      </Section>

      <CtaBand
        title={
          <>
            Designing a <em>cluster</em>?
          </>
        }
        body="Send us the topology and the distances. You get a written plan within two business days."
      />
    </div>
  );
}
