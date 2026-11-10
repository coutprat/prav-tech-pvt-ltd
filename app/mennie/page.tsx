import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import Link from "next/link";
import { BigSteps, CapWall, Statement, wallFromWeDo } from "@/components/pv/kit3";
import { MennieVisual } from "@/components/pv/LineVisuals";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { MennieFilm } from "@/components/sections/MennieFilm";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { mennie } from "@/content/company";
import { thesis } from "@/content/thesis";
import { CtaBand, Figure, Note, PageHero, Section, SectionHead } from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";
import "./mennie.css";

export const metadata: Metadata = pageMeta({
  title: "MENNIE — voice-first patient assistant",
  description:
    "MENNIE meets patients at the door, the kiosk or on their phone, and hands clinicians a structured picture. In research and development.",
  path: "/mennie",
  og: "mennie",
});

const A = "var(--acc-men-ink)";
const MEN = "var(--acc-men)";
const [intake, matching, reminders, summaries] = mennie.features;
const [kiosk, phone, clinicianCard] = mennie.surfaces;

export default function MenniePage() {
  return (
    <div data-acc="mennie">
      <PageJsonLd path="/mennie" />
      <PageHero
        eyebrow="Healthcare AI · Private beta"
        accent="men"
        title={
          <>
            She meets patients <em>at the door</em>.
          </>
        }
        lede={mennie.summary}
        actions={
          <>
            <a className="btn-p" href="#waitlist">
              Join the waitlist <span aria-hidden="true">→</span>
            </a>
            <Link className="btn-g" href="/start-a-project">
              Talk to the team
            </Link>
          </>
        }
        meta={["Voice-first intake", "Clinician decides", "Designed around DPDP 2023"]}
        visual={<MennieVisual />}
      />
      <MennieFilm />

      {/* ------------------------------------------------------ one visit */}
      <Section accent="men">
        <Statement
          eyebrow="01 · The principle"
          lead="She prepares the picture. The clinician decides."
          rest={
            <>
              MENNIE stands for {mennie.expansion}. {thesis.closing.note}
            </>
          }
        />
        <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }} />
        <Figure
          n="01"
          title="One visit, as MENNIE is designed to handle it"
          caption="How the design works, not a report from a deployment: MENNIE is in private beta. She prepares the picture; the clinician reads it and decides. She does not diagnose, treat or replace medical professionals."
        >
          <Flow
            accent={A}
            nodes={[
              {
                k: "Intake",
                title: intake.title,
                body: intake.body,
                tags: [kiosk.title],
              },
              {
                k: "Route",
                title: matching.title,
                body: matching.body,
              },
              {
                k: "Summary",
                title: summaries.title,
                body: summaries.body,
                tags: [clinicianCard.title],
              },
              {
                k: "Clinician",
                title: "Reads it and decides",
                body: "Care stays under clinical oversight.",
                gate: true,
                wait: "With the clinician",
                ok: "Reviewed",
              },
              {
                k: "Follow-up",
                title: reminders.title,
                body: reminders.body,
                tags: [phone.title],
              },
            ]}
          />
        </Figure>
      </Section>

      {/* ---------------------------------------------------------- features */}
      <Section tone="raised" accent="men">
        <SectionHead
          index="02"
          eyebrow="What she does"
          title={
            <>
              Four jobs, three surfaces, <em>one conversation</em>.
            </>
          }
          lede="Privacy is built into the architecture rather than added as a policy."
        />
        <CapWall
          items={[
            ...mennie.features.map((f) => ({ title: f.title, body: f.body, kicker: "Job", colour: MEN })),
            ...mennie.surfaces.map((x) => ({ title: x.title, body: x.body, kicker: "Surface", colour: MEN })),
            {
              title: "Federated & edge",
              body: "Federated learning and edge inference, designed around the DPDP Act 2023 — patient data does not have to leave the building to be useful.",
              kicker: "Architecture",
              colour: MEN,
            },
            {
              title: "Assistive robot — R&D",
              body: "The physical assistive robot is research and development only, tested in digital-twin simulation. It is not a product.",
              kicker: "Research",
              colour: MEN,
            },
          ]}
        />
        <Note>{mennie.disclaimer}</Note>
      </Section>

      {/* -------------------------------------------------------- deployment */}
      <Section accent="men">
        <SectionHead
          index="03"
          eyebrow="Deployment"
          title={
            <>
              Staged, <em>not switched on</em>.
            </>
          }
          lede="MENNIE is launching soon, and opens in three stages rather than all at once."
        />
        <BigSteps items={mennie.deployment.map((d) => ({ title: d.title, body: d.phase, tag: d.status }))} />
      </Section>

      {/* ---------------------------------------------------------- waitlist */}
      <Section accent="men" id="waitlist">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="04"
              eyebrow="Private beta"
              title={
                <>
                  Join the <em>waitlist</em>.
                </>
              }
              lede="Tell us where you work and what the queue looks like. We will write to you personally before MENNIE opens to new hospitals."
            />
          </div>
          <div className="men-form">
            <WaitlistForm />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- we build */}
      <Section tone="raised" accent="men">
        <SectionHead
          index="05"
          eyebrow="What we build"
          title={
            <>
              Healthcare AI that <em>hands the clinician</em> a clear picture.
            </>
          }
          lede="Specific systems our engineers have built or are building now. Client work is described without names; the tag shows where each one stands today."
        />
        <CapWall items={wallFromWeDo(weDo.men, MEN)} />
      </Section>

      <CtaBand
        title={
          <>
            Want MENNIE <em>in your lobby</em>?
          </>
        }
        body="Tell us the workflow. You get a written plan within two business days."
      />
    </div>
  );
}
