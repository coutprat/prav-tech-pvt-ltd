import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "Insights - Praverse Tech",
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>Insights &amp; Notes</div>
  <h1 class="rv">Notes from the <span class="grad-text">frontier.</span></h1>
  <p class="sub rv">Writeups on what we've shipped, what we're building, and how we think about AI in healthcare, pharma, and beyond.</p>
</header>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="pub-grid">
      <article class="pub-card rv">
        <div class="venue">Founder's Insight · July 2024 · 5 min read</div>
        <h4>The Future of AI in Healthcare: Key Findings From My Journey as a Technologist &amp; Founder</h4>
        <p>AI is no longer a distant promise for healthcare — it is becoming the backbone of a new global health ecosystem. Drawing on hands-on work across medical imaging, assistive robotics, and pharma compliance, this piece covers the biggest insights shaping the field: from why edge AI matters more than cloud AI in clinical settings, to why human oversight isn't a constraint on AI ambition but the foundation of it. Written by our founder after years of building in this space.</p>
        <div class="yr">July 29, 2024 · Founder's Perspective</div>
      </article>
      <article class="pub-card rv">
        <div class="venue">Case Study · Edge AI</div>
        <h4>Netra Sakhi: building an eye-care assistant for the edge</h4>
        <p>Netra Sakhi is a virtual eye-care assistant we designed to run as a real-time edge AI system — bringing vision-screening support to places where specialist access is limited. Published as a Scopus-indexed system in 2023, it became the first deployed proof that Praverse's healthcare AI could work outside the lab: low-latency inference on constrained hardware, a conversational front-end, and a screening pipeline tuned for accessibility rather than a research benchmark. The lessons from Netra Sakhi — privacy-first design, edge inference, and a human-in-the-loop screening flow — now run through everything HealthMate does.</p>
        <div class="yr">2023 · Edge AI / Healthcare</div>
      </article>
      <article class="pub-card rv">
        <div class="venue">Vision · HealthMate</div>
        <h4>Why HealthMate listens before it answers</h4>
        <p>HealthMate started from a simple observation: most patients don't need a diagnosis at the front door — they need someone to listen, route them to the right place, and hand clinicians a clear picture of what's going on. HealthMate is built as a voice-first companion for intake, hospital navigation, appointment assistance, and clinician-ready summaries, with humanoid and kiosk deployment explored through digital-twin simulation before anything touches the physical world. It is patent-pending, and designed to support — never replace — medical professionals.</p>
        <div class="yr">2025 · Patent-Pending · Coming Soon</div>
      </article>
      <article class="pub-card rv">
        <div class="venue">Explainer · Pharma AI</div>
        <h4>What "AI-assisted" actually means in a GMP environment</h4>
        <p>In regulated industries, an AI system that hallucinates a compliance answer is worse than no AI at all. That's why Praverse's pharma and regulatory intelligence systems are built around evidence: every FDA-483 observation, CAPA suggestion, or data-integrity flag links back to the source document it came from, with a full audit trail of what the system surfaced and what the expert decided. The AI drafts, analyzes, and flags — quality professionals decide. That hierarchy isn't a policy on top of the system; it's built into the architecture itself.</p>
        <div class="yr">Ongoing · Regulatory Intelligence</div>
      </article>
      <article class="pub-card rv">
        <div class="venue">Research Note · Imaging</div>
        <h4>From DME detection to PCOS screening: one imaging pipeline, two problems</h4>
        <p>Our published work on Diabetic Macular Edema (DME) detection (IEEE Transactions on Medical Imaging, 2023) and the PCOS detection pipeline (2024) share a common foundation — deep learning models trained for diagnostic-support, not diagnosis. Both pipelines are designed to flag patterns for expert review rather than issue verdicts, and both feed directly into the Medical Imaging Lab's ongoing work on fundus and ultrasound screening tools that can run at the edge.</p>
        <div class="yr">2023–2024 · Medical Imaging Lab</div>
      </article>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Got a question about our research?</h2>
      <p>Reach out — we're happy to talk through any of the work above, or hear what you're building.</p>
      <div class="cta-row">
        <a href="mailto:pratham@praversetech.com" class="btn btn-white">Email Praverse →</a>
        <a href="/research" class="btn btn-outline">See Our Labs</a>
      </div>
    </div>
  </div>
</section>`;

export default function InsightsPage() {
  return <StaticPageContent html={html} />;
}
