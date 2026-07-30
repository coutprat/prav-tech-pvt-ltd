import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "Team — Praverse Tech",
  description: "The people behind Praverse: thirty years of specialty pharma expertise meeting next-generation AI engineering.",
};

const html = `
<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>The People</div>
  <h1 class="rv">Industry depth.<br>Engineering velocity.</h1>
  <p class="sub rv">
    Praverse stands at the junction of three decades of specialty pharmaceutical leadership
    and next-generation AI engineering — because the problems worth solving in healthcare
    don't yield to algorithms alone.
  </p>
</header>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="tm-origin rv">
      <span class="kicker">The Origin</span>
      <h2 class="tm-origin-h">How a pharma veteran and an AI engineer<br>decided to build the same thing.</h2>
      <p class="tm-origin-p">
        Pratham Shrivastav didn't set out to build technology for its own sake. He set out to
        find the problems most AI teams walk past — the kind that take decades of domain
        immersion to even see clearly. Vishal Jajodia had spent those decades. At SWATI, he
        shaped the development of specialty pharmaceutical portfolios, from Pentosan Polysulfate
        Sodium to women's health formulations, from GMP floors in Mumbai to panels in Rome.
        His conviction, formed across thirty years: intelligence in healthcare only earns trust
        when it's accountable to science. That conviction became Praverse's first principle.
      </p>
    </div>
  </div>
</section>

<section class="sec-pad-sm tm-section-border">
  <div class="wrap">
    <div class="tm-row rv">
      <div class="tm-portrait-col">
        <div class="tm-avatar tm-avatar-vj">VJ</div>
        <div class="tm-stat-card">
          <span class="tm-stat-n">30+</span>
          <span class="tm-stat-l">Years in Specialty Pharma</span>
        </div>
        <a
          href="https://www.linkedin.com/in/vishal-jajodia-31a34211/"
          target="_blank"
          rel="noopener noreferrer"
          class="tm-link"
        >↗ LinkedIn Profile</a>
      </div>
      <div class="tm-bio-col">
        <span class="tm-num">01 / Strategic Advisor</span>
        <h2 class="tm-name">Vishal Jajodia</h2>
        <p class="tm-role-label">Managing Director of SWATI Spentose</p>
        <div class="tm-group-pill rv">
          <span class="tm-group-dot"></span>
          Part of the SWATI Group — a 70-year legacy in specialty pharmaceuticals
        </div>
        <p class="tm-excerpt">
          Three decades across the full arc of specialty pharma: from lab-grade formulation to
          global regulatory strategy. As MD of SWATI Spentose, Vishal leads a division built on
          one of the most enduring pharmaceutical legacies in India. He drove the development
          and commercialization of Pentosan Polysulfate Sodium (Intravesical Instillation),
          recognized with the IDMA-APTAR Innovation of the Year Award in 2022. His advisory to
          Praverse is grounded in lived experience: AI in healthcare doesn't work unless the
          people building it understand what clinicians actually need, and why the industry is
          structured the way it is.
        </p>
        <ul class="tm-creds">
          <li>Managing Director, SWATI Spentose — part of the 70-year SWATI Group, Mumbai</li>
          <li>IDMA-APTAR Innovation of the Year Award 2022 — Pentosan Polysulfate Sodium</li>
          <li>Keynote: PHARMEET 2013 · GREEN VOICE 2016 · ESSIC 2015, Rome Catholic University</li>
          <li>Guest Speaker: SVKM's NMIMS SPPSPTM, Mumbai</li>
          <li>Domain focus: Women's Health, Urology, Specialty Formulation, GMP Strategy</li>
        </ul>
        <div class="tm-tags">
          <span class="tm-tag">Specialty Pharma</span>
          <span class="tm-tag">Women's Health</span>
          <span class="tm-tag">Urology</span>
          <span class="tm-tag">GMP</span>
          <span class="tm-tag">Regulatory Strategy</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec-pad-sm tm-section-border">
  <div class="wrap">
    <div class="tm-row tm-row-flip rv">
      <div class="tm-portrait-col">
        <div class="tm-avatar tm-avatar-ps">PS</div>
        <div class="tm-stat-card">
          <span class="tm-stat-n">5</span>
          <span class="tm-stat-l">AI Systems in Production</span>
        </div>
        <a
          href="https://www.linkedin.com/in/pratham-shrivastav-b81180251/"
          target="_blank"
          rel="noopener noreferrer"
          class="tm-link"
        >↗ LinkedIn Profile</a>
      </div>
      <div class="tm-bio-col">
        <span class="tm-num">02 / Founder</span>
        <h2 class="tm-name">Pratham Shrivastav</h2>
        <p class="tm-role-label">Founder &amp; CEO · Praverse Tech</p>
        <p class="tm-excerpt">
          Pratham built Praverse around a single belief: AI systems for high-stakes, regulated
          domains must be engineered with the same rigor as the science they serve. Starting from
          published research in medical imaging and edge AI at IEEE and Scopus-indexed conferences,
          he leads the design of Praverse's intelligence stack: from MENNIE (ophthalmology) and
          HealthMate (clinical AI) to Pharma AI (regulatory intelligence) and the Foundry.
          Based in Vadodara, Gujarat. Building globally.
        </p>
        <ul class="tm-creds">
          <li>IEEE Transactions on Medical Imaging — DME Detection, 98% accuracy</li>
          <li>Scopus-indexed: Netra Sakhi · Edge AI ophthalmic screening for low-resource settings</li>
          <li>Architect of MENNIE, HealthMate, Pharma AI, Photonics, Praverse Foundry</li>
          <li>Domain focus: Healthcare AI, Regulatory Intelligence, Edge AI, Assistive Robotics</li>
        </ul>
        <div class="tm-tags">
          <span class="tm-tag">Medical Imaging</span>
          <span class="tm-tag">Healthcare AI</span>
          <span class="tm-tag">FDA-483</span>
          <span class="tm-tag">Edge AI</span>
          <span class="tm-tag">Robotics</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="tm-conviction rv">
      <span class="kicker">Shared Conviction</span>
      <p class="tm-quote">
        Intelligence in healthcare earns trust only when it is accountable to science —
        and built by people who have been in the room long enough to know the difference.
      </p>
      <p class="tm-conviction-sub">This is the principle SWATI's domain depth and Praverse's engineering share.</p>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Want to work with this team?</h2>
      <p>Reach out with a project, a partnership, or an idea worth exploring together.</p>
      <div class="cta-row">
        <a href="/contact" class="btn btn-white">Get in Touch →</a>
        <a href="/start-a-project" class="btn btn-outline">Start a Project →</a>
      </div>
    </div>
  </div>
</section>
`;

export default function TeamPage() {
  return <StaticPageContent html={html} />;
}
