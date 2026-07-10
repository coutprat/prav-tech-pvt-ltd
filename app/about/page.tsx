import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "About - Praverse Tech Pvt Ltd",
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>Praverse Tech Pvt Ltd · Vadodara, Gujarat, India</div>
  <h1 class="rv">AI should <span class="grad-text">amplify</span><br>human capability.</h1>
  <p class="sub rv">Not replace it. That philosophy shapes everything we build — fusing deep learning, robotics, and ethical intelligence to bring validated innovations to market with precision and trust.</p>
</header>

<section class="page-story sec-pad-sm">
  <div class="wrap">
    <div class="story-inner rv">
      <span class="story-kicker">How It Started · Vadodara, 2023</span>
      <h2 class="story-pullquote">Two engineers. One published paper. One conviction: <em>the hardest AI problems are not in the benchmarks.</em></h2>
      <p class="story-body">Praverse didn't start with a pitch deck. It started with a question — why are the AI systems that matter most in healthcare and pharma so difficult to actually deploy? The answer, it turned out, wasn't about model performance. It was about domain understanding, evidence requirements, human oversight, and the stubborn gap between a research benchmark and a hospital floor. We built Praverse to close that gap: one deployed system at a time, grounded in peer-reviewed research, responsible design, and the conviction that India has every capability needed to build AI that the world will trust. We started in Vadodara. The problems we are solving are global.</p>
      <div class="story-meta">Praverse Tech Pvt Ltd · Founded 2023 · Vadodara, Gujarat, India</div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="MS"></div><h3>Mission</h3><p>Bringing validated innovations to market with precision and trust — enterprise AI that holds up in the real world, not just the demo.</p></div>
      <div class="card rv"><div class="ico" data-icon="HC"></div><h3>Philosophy</h3><p>Human-centered by design. Every system we ship keeps experts in the loop, decisions traceable, and people in control.</p></div>
      <div class="card rv"><div class="ico" data-icon="CV"></div><h3>Vision</h3><p>A cognitive AI ecosystem by 2027 — where research, products, and platforms work as one intelligence fabric across industries.</p></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">What Defines Us</span>
      <h2>Core values, <span class="grad-text">every project.</span></h2>
    </div>
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="CO"></div><h3>Customer Obsession</h3><p>Our success depends on customer success. We embed deeply into domain problems and solve what actually matters — not what's convenient to demo.</p></div>
      <div class="card rv"><div class="ico" data-icon="TR"></div><h3>Expertise &amp; Trust</h3><p>Transparency, security, and accountability are non-negotiable. We build for industries where a wrong answer has consequences.</p></div>
      <div class="card rv"><div class="ico" data-icon="IN"></div><h3>India-First, Global Outlook</h3><p>Developing local talent while building for global challenges — India-rooted, globally deployable.</p></div>
      <div class="card rv"><div class="ico" data-icon="VP"></div><h3>Visionary Pragmatism</h3><p>We balance ambitious AI futures with practical, immediate customer value. Ideas that can't ship aren't finished yet.</p></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Innovation Timeline</span>
      <h2>From research to <span class="grad-text">market.</span></h2>
    </div>
    <div class="timeline">
      <div class="tl-item rv"><span class="year">2023</span><div class="tl-card"><h4>Netra Sakhi: Virtual Eye-Care Assistant</h4><p>Launched an NLP + Twilio powered assistant for ophthalmic screening. Published as a Scopus-indexed edge AI system for low-resource healthcare settings.</p></div></div>
      <div class="tl-item rv"><span class="year">2024</span><div class="tl-card"><h4>PCOS Detection Pipeline</h4><p>Developed a novel computer vision model using ultrasound and EHR data for early PCOS detection. Research published in peer-reviewed venues.</p></div></div>
      <div class="tl-item rv"><span class="year">2025</span><div class="tl-card"><h4>HealthMate &amp; Intel Collaboration</h4><p>Filed key patents for our AI Hospital Robot and began a strategic collaboration with Intel on AIoT and industrial intelligence.</p></div></div>
      <div class="tl-item rv"><span class="year">2026</span><div class="tl-card"><h4>Biochip Intelligence Research</h4><p>Initiated R&amp;D for a new class of diagnostic biochips with smart biosensing capabilities — long-term bio-intelligence incubation.</p></div></div>
      <div class="tl-item rv"><span class="year">2027</span><div class="tl-card"><h4>Cognitive AI Ecosystem Launch</h4><p>Projected unification of research, products, and platforms — working as one intelligence fabric across industrial and healthcare AI.</p></div></div>
    </div>
  </div>
</section>

<section id="legal" class="sec-pad-sm">
  <div class="wrap">
    <div class="safe-note rv"><span class="shield" data-icon="SAFE"></span><span><b>Legal:</b> Terms of Service, Privacy Policy, and HealthMate Terms are available on request and will be published alongside product launches. HealthMate is patent-pending and proprietary to Praverse Tech Pvt Ltd.</span></div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>The future is human-centered.</h2>
      <p>Join us in building intelligence that amplifies people — across healthcare, pharma, robotics, and beyond.</p>
      <div class="cta-row">
        <a href="/contact" class="btn btn-white">Get in Touch →</a>
        <a href="/" class="btn btn-outline">Back to Home</a>
      </div>
    </div>
  </div>
</section>`;

export default function AboutPage() {
  return <StaticPageContent html={html} />;
}
