import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { weDo } from "@/content/wedo";
import { WeDoList } from "@/components/pv/WeDoList";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { MennieFilm } from "@/components/sections/MennieFilm";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { mennie } from "@/content/company";
import { thesis } from "@/content/thesis";
import {
  Card,
  CtaBand,
  Figure,
  Grid,
  Note,
  Rows,
  Section,
  SectionHead,
} from "@/components/pv/kit";
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
const nn = (i: number) => String(i + 1).padStart(2, "0");
const [intake, matching, reminders, summaries] = mennie.features;
const [kiosk, phone, clinicianCard] = mennie.surfaces;

export default function MenniePage() {
  return (
    <div data-acc="mennie">
      <PageJsonLd path="/mennie" />
      <MennieFilm />

      {/* ------------------------------------------------------ one visit */}
      <Section accent="men">
        <SectionHead
          as="h1"
          index="01"
          eyebrow="Healthcare AI"
          title={
            <>
              She meets patients <em>at the door</em>.
            </>
          }
          lede={mennie.summary}
          aside={
            <p className="men-expansion">
              MENNIE stands for <strong>{mennie.expansion}</strong>.{" "}
              <span className="pv-serif">{thesis.closing.note}</span>
            </p>
          }
        />
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
              Four jobs, <em>done well</em>.
            </>
          }
        />
        <Grid cols={4}>
          {mennie.features.map((f, i) => (
            <Card key={f.title} n={nn(i)} title={f.title} accent="men">
              <p>{f.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ---------------------------------------------------------- surfaces */}
      <Section accent="men">
        <SectionHead
          index="03"
          eyebrow="Three surfaces"
          title={
            <>
              One conversation, <em>wherever it happens</em>.
            </>
          }
        />
        <Grid cols={3}>
          {mennie.surfaces.map((s, i) => (
            <Card key={s.title} n={nn(i)} title={s.title} accent="men">
              <p>{s.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* -------------------------------------------------------- deployment */}
      <Section tone="raised" accent="men">
        <SectionHead
          index="04"
          eyebrow="Deployment"
          title={
            <>
              Staged, <em>not switched on</em>.
            </>
          }
          lede="MENNIE is launching soon, and opens in three stages rather than all at once."
        />
        <Rows
          items={mennie.deployment.map((d, i) => ({
            k: nn(i),
            title: d.title,
            body: (
              <p className="men-phase">
                <span>{d.phase}</span>
                <span
                  className="men-status"
                  data-now={d.status === "Now" || undefined}
                >
                  {d.status}
                </span>
              </p>
            ),
          }))}
        />
      </Section>

      {/* ----------------------------------------------------- how it's built */}
      <Section accent="men">
        <SectionHead
          index="05"
          eyebrow="How it is built"
          title={
            <>
              Privacy by <em>architecture</em>.
            </>
          }
        />
        <Grid cols={3}>
          <Card n="01" title="Kiosk workflows" accent="men">
            <p>
              Intake runs on the kiosk in the lobby, where the queue actually
              forms.
            </p>
          </Card>
          <Card n="02" title="Federated & edge" accent="men">
            <p>
              Federated learning and edge inference, designed around the DPDP
              Act 2023 — patient data does not have to leave the building to be
              useful.
            </p>
          </Card>
          <Card n="03" title="Assistive robot — R&D" accent="men">
            <p>
              The physical assistive robot is research and development only,
              tested in digital-twin simulation. It is not a product.
            </p>
          </Card>
        </Grid>
        <Note>{mennie.disclaimer}</Note>
      </Section>

      {/* ---------------------------------------------------------- waitlist */}
      <Section tone="raised" accent="men" id="waitlist">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="06"
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
      <Section accent="men">
        <SectionHead
          index="07"
          eyebrow="What we build"
          title={
            <>
              Healthcare AI that <em>hands the clinician</em> a clear picture.
            </>
          }
          lede="Specific systems our engineers have built or are building now. Client work is described without names; the tag shows where each one stands today."
        />
        <WeDoList items={weDo.men} />
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
