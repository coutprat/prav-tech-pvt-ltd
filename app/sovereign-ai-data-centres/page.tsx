import type { Metadata } from "next";
import { brief } from "@/lib/answers";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import { BigSteps, CapWall, Statement, wallFromWeDo } from "@/components/pv/kit3";
import { SovereignVisual } from "@/components/pv/LineVisuals";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { Footprint } from "@/components/sections/Footprint";
import { CapacityChart } from "@/components/sections/CapacityChart";
import { stories, sovereignTests } from "@/content/sovereign";
import { photonicsPhases } from "@/content/company";
import {
  fabricScales,
  interconnectGap,
  nextLaneRate,
  nicConfigs,
  workloads,
} from "@/content/interconnect";
import { FilmSection, type Chapter } from "@/components/sections/FilmSection";
import { signatureVideo } from "@/content/media";
import { Card, CtaBand, Faq, Figure, Grid, Note, PageHero, Section, SectionHead } from "@/components/pv/kit";
import "../photonics/photonics.css";

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
    sub: "The GPUs get the budget and the headlines. What decides whether they reach their benchmark is the metre of copper or glass between them.",
  },
  {
    kind: "beats",
    at: [0.2, 0.52],
    beats: [
      {
        label: "At 400G and above",
        text: "the margin between a link that works and one that retrains under load is small",
      },
      {
        label: "And it is set by",
        text: "insertion loss, the reach of the optics actually fitted, the temperature at the top of the rack at 3am",
      },
      { label: "None of which", text: "appears in the bill of materials" },
    ],
  },
  {
    kind: "statement",
    at: [0.52, 0.76],
    text: "Sovereign is a supply chain, not a sticker.",
    sub: "If every spare optic is a six-week import and every fault needs an engineer in another time zone, the operator is holding risk that was supposed to be designed out.",
  },
  {
    kind: "statement",
    at: [0.76, 1.01],
    text: "We do the India side.",
    sub: "Architecture, design-in, integration, qualification and support — on local time, close to the clusters being built.",
  },
];

export const metadata: Metadata = pageMeta({
  title: "Sovereign AI data centres",
  description:
    "What sovereignty actually requires of an AI cluster built in India, and where the interconnect decides whether it holds. Architecture, design-in, qualification and support from Praverse Tech.",
  path: "/sovereign-ai-data-centres",
  og: "sovereign-ai-data-centres",
});

const nn = (i: number) => String(i + 1).padStart(2, "0");
const PHO = "var(--acc-pho)";

/* ------------------------------------------- 800G switch port to ConnectX-8 */

/**
 * The drawing for each row of nicConfigs, in the same order: how many cable
 * legs leave the switch port, how many NICs they land on, and what each NIC
 * end is. Text comes from the content row; only the geometry lives here.
 */
const NIC_SHAPES = [
  { legs: 1, nics: [{ m: "CX8 C8180", s: "OSFP-RHS" }] },
  {
    legs: 2,
    nics: [
      { m: "CX8 C8180", s: "400G mode" },
      { m: "CX8 C8180", s: "400G mode" },
    ],
  },
  { legs: 2, nics: [{ m: "CX8 C8240", s: "2 × QSFP112" }] },
  {
    legs: 2,
    nics: [
      { m: "CX8 C8240", s: "1 × QSFP112 · 400G" },
      { m: "CX8 C8240", s: "1 × QSFP112 · 400G" },
    ],
  },
] as const;

function wires(legs: number, nics: number) {
  // one NIC: one leg straight across, or two legs landing on its two cages
  const ends = nics === 2 ? [25, 75] : legs === 2 ? [38, 62] : [50];
  return ends.map((y) => `M0,50 C45,50 55,${y} 100,${y}`);
}

function NicFigure() {
  return (
    <ul className="pho-nic">
      {nicConfigs.map((c, i) => {
        const shape = NIC_SHAPES[i];
        return (
          <li key={c.head}>
            <p className="pho-nic-h">{c.head}</p>
            <div className="pho-nic-d" aria-hidden="true">
              <span className="pho-nic-box" data-sw>
                Switch port
                <small>800G OSFP</small>
              </span>
              <span className="pho-nic-wires">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  {wires(shape.legs, shape.nics.length).map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </span>
              <span className="pho-nic-ends">
                {shape.nics.map((n, j) => (
                  <span className="pho-nic-box" key={j}>
                    {n.m}
                    <small>{n.s}</small>
                  </span>
                ))}
              </span>
            </div>
            <p className="pho-nic-r">
              <b>{c.cells[0]}.</b> {c.cells[1]}.
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export default function SovereignPage() {
  return (
    <div data-acc="photonics">
      <PageJsonLd path="/sovereign-ai-data-centres" />
      <PageHero
        eyebrow={brief("/sovereign-ai-data-centres").lead}
        accent="pho"
        title={
          <>
            Sovereignty is decided in the <em>cable plant</em>.
          </>
        }
        lede="A sovereign AI cluster means the compute, the data and the operator sit under Indian jurisdiction. That is a procurement and engineering problem long before it is a legal one — and most of it lands on the links between the GPUs."
        actions={
          <>
            <Link className="btn-p" href="/start-a-project">
              Send us the topology <span aria-hidden="true">→</span>
            </Link>
            <a className="btn-g" href="#test">
              The four questions
            </a>
          </>
        }
        meta={["Architecture and design-in", "Qualification on site", "Support on local time"]}
        visual={<SovereignVisual />}
      />

      <FilmSection
        id="sov-film"
        video={signatureVideo.sovereign}
        chapters={SOV_CHAPTERS}
        accent="var(--acc-pho)"
        label="Why the interconnect decides whether a sovereign AI cluster holds"
        caption="Illustrative visualisation. Not a Praverse facility — we supply and design in the interconnect, we do not operate data centres."
      />

      {/* ----------------------------------------------------------- opener */}
      <Section accent="pho" id="test">
        <Statement
          eyebrow="01 · The test"
          lead="“Sovereign” is easy to claim and hard to prove."
          rest="Four questions show whether a cluster is sovereign in practice, not only in name."
        />
        <div style={{ marginTop: "clamp(40px, 5vw, 72px)" }} />
        <BigSteps items={sovereignTests.map((t) => ({ title: t.head, body: t.body }))} />
      </Section>

      {/* ----------------------------------------------------------- fabric */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="02"
          eyebrow="The fabric"
          title={
            <>
              Your GPUs are ready. Is <em>the interconnect</em>?
            </>
          }
          lede="As clusters scale, the hardest decisions move to the links between everything: GPUs, NICs, switches, servers, the whole rack. Get them wrong and you rebuild, burn power, or watch a deployment window close. Get them right and everything downstream gets easier."
        />
        <CapWall
          items={fabricScales.map((f) => ({
            title: f.title,
            body: f.body,
            kicker: f.where,
            tag: f.media,
            colour: PHO,
          }))}
        />
        <div className="pho-gap">
          <CapWall items={interconnectGap.map((g) => ({ title: g.title, body: g.body, kicker: "The gap", colour: PHO }))} />
        </div>
        <p className="pho-small">
          <Link className="pv-link" href="/photonics">
            Reach by medium, at 800G and 1.6T <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      {/* ----------------------------------------------------------- market */}
      <Section accent="pho">
        <SectionHead
          index="03"
          eyebrow="The market"
          title={
            <>
              The capacity is <em>being built</em> now.
            </>
          }
          lede="India’s operational data-centre capacity is concentrated in a handful of markets, and our people are in four of the five largest. That matters, because interconnect is a job somebody has to do on site."
        />
        <div className="pho-figs" data-pair>
          <Figure
            n="01"
            title="Operational capacity by market, and where our team is"
            caption="Third-party market data about India, not a claim about Praverse. Four of the five largest markets are cities where we have people; the headquarters in Vadodara is not a capacity market. Sources are printed with the figure."
          >
            <Footprint />
          </Figure>
          <Figure
            n="02"
            title="National capacity, actual and forecast"
            caption="2020 and 2025 are actuals. The three 2030 forecasts disagree by a factor of three, so each is drawn and attributed separately rather than averaged. Treat 2030 as a range."
          >
            <CapacityChart />
          </Figure>
        </div>
      </Section>

      {/* ---------------------------------------------------------- stories */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="04"
          eyebrow="Where it bites"
          title={
            <>
              Three situations <em>we are built for</em>.
            </>
          }
          lede="Written as the shape of a real decision rather than as case studies: the question that gets asked, the constraint that turns out to be the real one, and what changes."
        />
        <Grid cols={3}>
          {stories.map((s, i) => (
            <Card key={s.id} n={nn(i)} title={s.title} accent="pho">
              <p className="pho-story-k">
                {s.kind === "scenario" ? "Illustrative scenario" : "Deployment"}
              </p>
              <p className="pho-setting">{s.setting}</p>
              <dl className="pho-qa">
                <dt>The question</dt>
                <dd>{s.question}</dd>
                <dt>What actually bites</dt>
                <dd>{s.constraint}</dd>
                <dt>What we do</dt>
                <dd>{s.answer}</dd>
              </dl>
            </Card>
          ))}
        </Grid>
        <Note>
          These are illustrative scenarios, not customers. We do not publish a
          client&rsquo;s deployment without their written permission, and we
          will not dress a hypothetical up as a reference.
        </Note>
      </Section>

      {/* -------------------------------------------------------- workloads */}
      <Section accent="pho">
        <SectionHead
          index="05"
          eyebrow="By workload"
          title={
            <>
              Design around the cluster, <em>not the cable</em>.
            </>
          }
        />
        <CapWall
          items={workloads.map((w) => ({
            title: w.title,
            body: `${w.body} ${w.foot}`,
            kicker: "Workload",
            extra: w.points.join(" · "),
            colour: PHO,
          }))}
        />
      </Section>

      {/* -------------------------------------------------------- 800G NICs */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="06"
          eyebrow="800G in practice"
          title={
            <>
              Every way a switch port meets <em>a ConnectX-8</em>.
            </>
          }
          lede="The ConnectX-8 SuperNIC brings 800G to the server on PCIe Gen6, in a single-OSFP card (C8180) and a dual-QSFP112 card (C8240). Against an 800G switch such as the Spectrum SN5600 there are four Ethernet configurations, and a DAC, ACC, AEC, AOC or LPO optic for each, chosen by the distance."
        />
        <Figure
          n="03"
          title="800G Ethernet: one switch port to ConnectX-8"
          caption="The four configurations, drawn as cabled. A breakout splits one 800G port into two 400G legs; whether those land on one NIC or two decides whether each server sees 800G or 400G. The cable type for each leg is then chosen by distance."
        >
          <NicFigure />
        </Figure>
        <div className="pho-pair">
          <h3 className="pv-h3">{nextLaneRate.title}</h3>
          <p className="pv-body">{nextLaneRate.body}</p>
        </div>
      </Section>

      {/* --------------------------------------------------- what we supply */}
      <Section accent="pho">
        <SectionHead
          index="07"
          eyebrow="What we supply"
          title={
            <>
              The layer <em>underneath</em>.
            </>
          }
          lede="High-speed copper and optical interconnect for AI clusters. Our US technology partner builds the technology; Praverse does the Indian architecture, design-in, integration, qualification and support."
        />
        <BigSteps items={photonicsPhases.map((p) => ({ title: p.title, body: p.body, tag: p.stage }))} />
        <Note>
          <strong>We do not manufacture in India today.</strong> Local testing
          and qualification come first; assembly follows when volumes justify
          it. Phases 2 and 3 are plans, not facilities.
        </Note>
        <p className="pho-small">
          <Link className="pv-link" href="/photonics">
            The full photonics capability <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      {/* ------------------------------------------------------- we build */}
      <Section tone="raised" accent="pho">
        <SectionHead
          index="08"
          eyebrow="What we build"
          title={
            <>
              Sovereign compute, <em>end to end</em>.
            </>
          }
          lede="What we deliver on this line today. Interconnect is supplied and designed in with our US technology partner; the software and planning work is ours."
        />
        <CapWall items={wallFromWeDo(weDo.sov, PHO)} />
      </Section>

      {/* ------------------------------------------------------------- FAQ */}
      <Section accent="pho">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="09"
              eyebrow="Questions"
              title={
                <>
                  Asked <em>before the first call</em>.
                </>
              }
            />
          </div>
          <Faq items={brief("/sovereign-ai-data-centres").faq ?? []} />
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Building <em>one</em>?
          </>
        }
        body="Send us the topology and the distances. You get a written plan within two business days: link budgets, breakout plan, and a parts list that still makes sense at the tenth pod."
      />
    </div>
  );
}
