import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "Praverse at CPHI Milan 2026 - AI for GMP Quality Systems",
  description:
    "Praverse Tech is at CPHI Milan, 6-8 October 2026, walking the AI & Tech zone. AI-assisted regulatory intelligence for pharma quality teams, built around expert judgment and draft EU GMP Annex 22.",
  openGraph: {
    title: "Praverse at CPHI Milan 2026",
    description:
      "AI-assisted regulatory intelligence for GMP quality systems. Meet us on the floor, 6-8 October, Fiera Milano.",
  },
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>CPHI Milan &middot; 6&ndash;8 October 2026</div>
  <h1 class="rv">Europe is writing<br>the rules for AI in GMP.</h1>
  <p class="sub rv">We designed as though they already existed. Praverse is at CPHI Milan this October, walking the AI &amp; Tech zone and the manufacturing halls. If you are building or buying AI for a regulated quality system, that is the conversation we came for.</p>
  <div class="cphi-facts rv">
    <span><b>Fiera Milano</b></span>
    <span><b>AI &amp; Tech Zone</b></span>
    <span>67,000+ attendees</span>
    <span>166+ countries</span>
  </div>
</header>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kicker">Where We Fit</span>
      <h2>Four focus areas. We do one of them properly.</h2>
      <p>CPHI splits the AI &amp; Tech zone into four categories. Most vendors on the floor will tell you they cover all four. Here is where Praverse actually sits, and where it does not.</p>
    </div>
    <div class="cphi-fit rv">

      <div class="cphi-fit-row">
        <span class="cphi-tag is-core">Core</span>
        <div>
          <h3>Quality &amp; Compliance</h3>
          <p class="cphi-src">CPHI: &ldquo;QMS, LIMS, and regulatory platforms ensuring data integrity, GMP alignment, and audit readiness.&rdquo;</p>
          <p class="cphi-pos">This is the entire product. FDA 483 response drafting, OOS and OOT investigation support, CAPA reasoning with evidence trails, data integrity review against ALCOA+, SOP gap detection, and continuous inspection readiness. Every output is a draft that a qualified person approves before it reaches a quality record.</p>
        </div>
      </div>

      <div class="cphi-fit-row">
        <span class="cphi-tag is-partial">Partial</span>
        <div>
          <h3>Digital Transformation</h3>
          <p class="cphi-src">CPHI: &ldquo;Automation, compliance, predictive analytics, and digital solutions across the pharma value chain.&rdquo;</p>
          <p class="cphi-pos">We automate the document-heavy end of quality: investigation write-ups, response drafting, SOP maintenance. We do not run enterprise transformation programmes, and we are not a consultancy.</p>
        </div>
      </div>

      <div class="cphi-fit-row">
        <span class="cphi-tag is-adjacent">Adjacent</span>
        <div>
          <h3>Manufacturing Optimisation</h3>
          <p class="cphi-src">CPHI: &ldquo;MES, ERP, digital twins, predictive maintenance, and SaaS integrations that streamline production and scale-up.&rdquo;</p>
          <p class="cphi-pos">We read from these systems rather than replace them. Deviation, OOS and OOT signals from your MES or LIMS feed risk aggregation and readiness scoring. If you sell MES or LIMS, we are a complement, not a competitor.</p>
        </div>
      </div>

      <div class="cphi-fit-row is-quiet">
        <span class="cphi-tag is-none">Not us</span>
        <div>
          <h3>Commercialisation &amp; Market Intelligence</h3>
          <p class="cphi-src">CPHI: &ldquo;CRM, RWE, sales analytics, and marketing platforms that enable smarter launch strategies and customer engagement.&rdquo;</p>
          <p class="cphi-pos">Not our domain. We would rather say so than pad a capability list.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kicker">What Europe Is About To Require</span>
      <h2>Annex 22, and why it does not change our architecture.</h2>
      <p>The European Commission, the EMA and the PIC/S inspectors working group opened consultation on a new GMP annex for artificial intelligence on 7 July 2025. It closed that October with roughly 1,300 comments. A final Annex 22 is expected before the end of 2026.</p>
    </div>
    <div class="cphi-reg rv">
      <div class="cphi-reg-item">
        <span class="ref">Intended use</span>
        <p>The draft expects the intended use of a model to be defined in writing, including exactly which decisions it is permitted to touch and where that boundary sits.</p>
      </div>
      <div class="cphi-reg-item">
        <span class="ref">Human oversight</span>
        <p>A model that flags something for review is treated differently from one that decides on its own. Praverse only ever does the first.</p>
      </div>
      <div class="cphi-reg-item">
        <span class="ref">Generative AI</span>
        <p>The draft states that generative models and LLMs should not be used in critical GMP applications. Our outputs are drafts prepared for expert review. They are never autonomous decisions, and never the final record.</p>
      </div>
      <div class="cphi-reg-item">
        <span class="ref">Validation</span>
        <p>Predefined performance metrics, representative and independent test data, explainability, change control and ongoing monitoring.</p>
      </div>
      <div class="cphi-reg-item">
        <span class="ref">EU AI Act</span>
        <p>Separate from GMP, the AI Act's obligations for high-risk systems phase in through August 2026 and August 2027, with requirements covering risk management, data quality, transparency, human oversight and record keeping.</p>
      </div>
    </div>
    <div class="cphi-note rv">
      <span class="cphi-note-label">Where we are careful</span>
      <p>Annex 22 is still a draft. We do not claim compliance with a document that is not final, and we will not tell you we are certified against something that does not yet exist.</p>
      <p>What we can say is that the architecture was built around expert judgment from the start. The system drafts, evidences and flags. Qualified personnel decide. That hierarchy is not a policy layered on top of the architecture. It is the architecture.</p>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Find us in Milan.</h2>
      <p>Pratham Shrivastav is on the floor from 6 to 8 October. Praverse is attending rather than exhibiting, so there is no stand number, just a calendar with room in it.</p>
      <div class="cta-row">
        <a href="mailto:pratham@praversetech.com?subject=CPHI%20Milan%20%E2%80%93%20meeting%20request" class="btn btn-white">Book 20 Minutes &rarr;</a>
        <a href="/pharma" class="btn btn-outline">See the Platform</a>
      </div>
    </div>
  </div>
</section>`;

export default function CphiPage() {
  return <StaticPageContent html={html} />;
}
