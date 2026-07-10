import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "Pharma & Regulatory AI - Praverse Tech",
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>Pharma &amp; Regulatory Intelligence</div>
  <h1 class="rv">Quality, with a<br><span class="grad-text">second brain.</span></h1>
  <p class="sub rv">AI-assisted regulatory intelligence designed to support expert quality judgment — not replace it. Built for inspection readiness, documentation intelligence, and high-stakes quality systems.</p>
</header>

<section class="page-story sec-pad-sm">
  <div class="wrap">
    <div class="story-inner rv">
      <span class="story-kicker">Field Note · Regulatory Intelligence in Practice</span>
      <h2 class="story-pullquote">The FDA-483 observation arrived at 6 PM on a Friday. <em>By Monday morning, the quality team had a fully structured, evidence-grounded response ready for expert review.</em></h2>
      <p class="story-body">Regulatory compliance in pharmaceuticals isn't just about passing an audit. It's about building a quality system that holds up every day, for every batch, under any scrutiny. Praverse's pharma intelligence platform was designed around a single non-negotiable constraint: in a GMP environment, a wrong answer from an AI system is worse than no answer at all. Every observation is mapped to evidence. Every CAPA draft traces back to its source document. Every output is a starting point for qualified expert judgment — never a substitute for it. The system drafts. Your team decides. That hierarchy is not a policy layered on top of the architecture. It is the architecture.</p>
      <div class="story-meta">Praverse Tech · Pharma &amp; Regulatory AI · Aligned with USFDA 21 CFR Part 211 · ICH Q9 · ICH Q10</div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">How It Works</span>
      <h2>Five stages. <span class="grad-text">Zero guesswork.</span></h2>
      <p>Every AI interaction in a regulated environment follows a structured, traceable pipeline — from document ingestion to expert-approved archive.</p>
    </div>
    <div class="process-strip rv">
      <div class="process-step"><span class="step-num">01</span><b>Ingest</b><p>Documents, observations, and records enter the system with full provenance tracking.</p></div>
      <div class="process-arrow" aria-hidden="true">→</div>
      <div class="process-step"><span class="step-num">02</span><b>Analyze</b><p>AI identifies patterns, flags deviations, and maps observations to regulatory frameworks.</p></div>
      <div class="process-arrow" aria-hidden="true">→</div>
      <div class="process-step"><span class="step-num">03</span><b>Draft</b><p>Evidence-grounded draft responses, CAPA plans, or SOP content generated for expert review.</p></div>
      <div class="process-arrow" aria-hidden="true">→</div>
      <div class="process-step"><span class="step-num">04</span><b>Review</b><p>Qualified personnel review, edit, and approve every AI-generated output before use.</p></div>
      <div class="process-arrow" aria-hidden="true">→</div>
      <div class="process-step"><span class="step-num">05</span><b>Archive</b><p>Approved outputs are stored with a full audit trail — who asked, what was surfaced, what was decided.</p></div>
    </div>
    <div class="safe-note rv" style="margin-top:24px"><span class="shield" data-icon="SAFE"></span><span>Aligned with <b>USFDA 21 CFR Part 211</b>, <b>ICH Q9</b>, and <b>ICH Q10</b> guidelines. All AI-generated outputs are drafts and require final review by qualified personnel.</span></div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="pharma-grid">
      <div class="pharma-cell rv"><span class="code">FDA-483</span><h4>FDA 483 Response Assist</h4><p>Reduces drafting time for FDA observation responses — pattern intelligence across enforcement trends with evidence-grounded drafting support.</p></div>
      <div class="pharma-cell rv"><span class="code">OOS/OOT</span><h4>OOS/OOT Analysis Aid</h4><p>Accelerates root cause analysis for out-of-specification and out-of-trend specification discrepancies with structured investigation support.</p></div>
      <div class="pharma-cell rv"><span class="code">DI</span><h4>DI Assessment Helpers</h4><p>Flags potential anomalies in Data Integrity audits — AI-assisted review of records against ALCOA+ data-integrity principles.</p></div>
      <div class="pharma-cell rv"><span class="code">SOP</span><h4>SOP Automation</h4><p>Generates and manages Standard Operating Procedures — search, gap detection, and inspection-readiness across your quality system.</p></div>
      <div class="pharma-cell rv"><span class="code">CAPA</span><h4>CAPA Reasoning</h4><p>Structured root-cause support and corrective action drafting with evidence trails linking every suggestion to source documentation.</p></div>
      <div class="pharma-cell rv"><span class="code">QRM</span><h4>Quality Risk Management</h4><p>Risk signal aggregation across deviations, OOS, OOT, complaints, and recalls — continuous readiness scoring so audits become routine.</p></div>
      <div class="pharma-cell rv"><span class="code">RCA</span><h4>Human Error Investigation</h4><p>Investigation support that distinguishes systemic causes from individual ones — designed for fair, thorough RCA under regulatory scrutiny.</p></div>
      <div class="pharma-cell rv"><span class="code">AUDIT</span><h4>Inspection Readiness</h4><p>Continuous readiness scoring and inspection-preparation support so your next audit is a routine event, not a crisis.</p></div>
    </div>
    <div class="safe-note rv"><span class="shield" data-icon="SAFE"></span><span>Every output is <b>traceable, reviewable, and evidence-grounded.</b> Praverse systems are designed for environments where a wrong answer has consequences — so humans always hold final judgment.</span></div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Why It Matters</span>
      <h2>Regulated industries need <span class="grad-text">different AI.</span></h2>
    </div>
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="EV"></div><h3>Evidence-Based Review</h3><p>Every AI suggestion links back to the source document, observation, or record it came from. No hallucinated compliance.</p></div>
      <div class="card rv"><div class="ico" data-icon="AU"></div><h3>Audit Trails by Default</h3><p>Who asked, what the system surfaced, what the expert decided — captured automatically for every interaction.</p></div>
      <div class="card rv"><div class="ico" data-icon="HJ"></div><h3>Expert Judgment First</h3><p>The system drafts, analyzes, and flags. Your quality professionals decide. That hierarchy is built into the architecture.</p></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Make your next inspection routine.</h2>
      <p>Talk to us about AI-assisted quality intelligence for your GMP environment.</p>
      <div class="cta-row">
        <a href="mailto:pratham@praversetech.com?subject=Pharma%20AI" class="btn btn-white">Request a Walkthrough →</a>
        <a href="/domains" class="btn btn-outline">All Domains</a>
      </div>
    </div>
  </div>
</section>`;

export default function PharmaPage() {
  return <StaticPageContent html={html} />;
}
