import type { Metadata } from "next";
import { MennieFilm } from "@/components/sections/MennieFilm";
import { Aurora } from "@/components/ui/Aurora";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { Headline } from "@/components/ui/Headline";
import {
  SectionLabel,
  MilestoneTracker,
  Disclaimer,
  CTASection
} from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { mennie } from "@/content/company";

export const metadata: Metadata = {
  title: "MENNIE",
  description:
    "MENNIE — a voice-first patient assistant that meets patients at the door, the kiosk or on their phone, and hands clinicians a structured picture."
};

export default function MenniePage() {
  return (
    <div data-acc="mennie">
      <MennieFilm />

      <section className="section" style={{ position: "relative" }}>
        <Aurora
          blobs={[
            { color: "var(--acc-men)", x: 16, y: 34, size: 520 },
            { color: "var(--acc-ent)", x: 82, y: 64, size: 420 }
          ]}
        />
        <div className="wrap">
          <SectionLabel accent="line">Healthcare AI</SectionLabel>
          <Headline as="h1" className="display">
            She meets patients at the door.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            {mennie.summary}
          </p>
          <p className="body-2" style={{ marginTop: 24 }}>
            MENNIE stands for <strong>{mennie.expansion}</strong>.{" "}
            <Verify id="mennie-patent" />.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- features */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>What she does</SectionLabel>
          <Headline onScroll>Four jobs, done well.</Headline>
          <div className="grid-4">
            {mennie.features.map((f) => (
              <article className="card" key={f.title}>
                <h3 className="h3" style={{ fontSize: 20 }}>
                  {f.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- surfaces */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Three surfaces</SectionLabel>
          <Headline onScroll>One conversation, wherever it happens.</Headline>
          <div className="grid-3">
            {mennie.surfaces.map((s) => (
              <article className="card" key={s.title}>
                <h3 className="h3" style={{ fontSize: 20 }}>
                  {s.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- deployment */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Deployment</SectionLabel>
          <Headline onScroll>Staged, not switched on.</Headline>
          <div style={{ marginTop: 48 }}>
            <MilestoneTracker
              items={mennie.deployment.map((d) => ({
                stage: d.status.toUpperCase(),
                title: d.title,
                body: `${d.phase} — ${d.title.toLowerCase()}.`
              }))}
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- how it's built */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">How it is built</SectionLabel>
          <Headline onScroll>Privacy by architecture.</Headline>

          <div className="grid-3">
            <article className="card">
              <h3 className="h3" style={{ fontSize: 20 }}>
                Kiosk workflows
              </h3>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                Intake runs on the kiosk in the lobby, where the queue actually forms.
              </p>
            </article>
            <article className="card">
              <h3 className="h3" style={{ fontSize: 20 }}>
                Privacy by architecture
              </h3>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                Federated learning and edge inference, designed around the DPDP Act
                2023 — patient data does not have to leave the building to be useful.
              </p>
            </article>
            <article className="card">
              <h3 className="h3" style={{ fontSize: 20 }}>
                Assistive robot — R&amp;D
              </h3>
              <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                The physical assistive robot is research and development only,
                tested in digital-twin simulation. It is not a product.
              </p>
            </article>
          </div>

          <div style={{ marginTop: 40 }}>
            <Disclaimer>{mennie.disclaimer}</Disclaimer>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- waitlist */}
      <section className="section section-alt">
        <div className="wrap-narrow">
          <SectionLabel>Private beta</SectionLabel>
          <Headline onScroll>Join the waitlist.</Headline>
          <p className="body-2" style={{ marginTop: 18 }}>
            Tell us where you work and what the queue looks like. We are selecting
            pilot sites now.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <CTASection
        title="Want MENNIE in your lobby?"
        body="Tell us the workflow. You get a written plan within two business days."
      />
    </div>
  );
}
