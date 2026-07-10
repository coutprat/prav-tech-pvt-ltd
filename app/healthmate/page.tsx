import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "MENNIE — Medical Empowerment and Neural Navigation Intelligence Engine",
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>MENNIE · Patent-Pending · Coming Soon</div>
  <h1 class="rv">Healthcare that <span class="grad-text">listens.</span></h1>
  <p class="sub rv">MENNIE — the Medical Empowerment and Neural Navigation Intelligence Engine — is an intelligent assistive platform for healthcare and education, designed to support patients, clinicians, and hospital workflows under expert oversight.</p>
  <div class="cta-row rv" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:36px">
    <a href="mailto:pratham@praversetech.com?subject=MENNIE%20Waitlist" class="btn btn-grad">Join the Waitlist →</a>
    <a href="#mennie-detail" class="btn btn-ghost">How It Works</a>
  </div>
</header>

<section class="page-story sec-pad-sm">
  <div class="wrap">
    <div class="story-inner rv">
      <span class="story-kicker">Origin Story · How MENNIE Was Born</span>
      <h2 class="story-pullquote">Built from the ground up for <em>real hospital environments.</em></h2>
      <p class="story-body">In 2023, Praverse's founding team made a deliberate choice: before writing a single line of code, they would spend time inside real hospital environments. Not as observers with clipboards, but as people trying to understand what it actually feels like to navigate a healthcare system under stress. What they found wasn't a technology problem. It was a deeply human coordination problem — playing out in slow motion, every single day, in every corridor.</p>
      <p class="story-body" style="margin-top:18px">Patients arrived and didn't know where to register. They waited in the wrong queue. Nobody told them which specialist to see, or whether their paperwork had been received. Clinicians walked into consultations cold — no structured intake, no history of what the patient had already described to three other people that morning. Follow-up care was handed off through phone calls that didn't happen and reminders that were never set. The system wasn't broken. It was simply built without a voice that could hold all of it together.</p>
      <p class="story-body" style="margin-top:18px">MENNIE is the answer to that gap. A voice-first AI companion designed to meet patients exactly where they are — at the door, at the kiosk, on their phone — and walk with them through every step of care. It listens before it acts. It guides without replacing. And it hands every clinician a clear, structured picture of the patient standing before them: what they said, what they need, what comes next. Not a replacement for human judgment. A foundation for it — so that the four hours nobody explained become four minutes that somebody understood.</p>
      <div class="story-meta">Praverse Tech · Healthcare AI Division · 2023–Present · Patent-Pending</div>
    </div>
  </div>
</section>

<section id="mennie" class="sec-pad" style="margin-top:30px">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kicker">The Platform</span>
      <h2>One companion.<br>Every step of care.</h2>
      <p>MENNIE meets patients at the door, guides them through the hospital, and hands clinicians a clear, structured picture — so human attention goes where it matters most.</p>
      <div class="hm-badges"><span>Patent-Pending</span><span>Human-Centered AI</span><span>Proprietary</span></div>
    </div>
    <div class="hm-layout">
      <div class="hm-visual rv">
        <div class="hm-orb"></div>
        <div class="hm-chip" style="top:8%;left:4%" data-icon="VX" data-hmfloat>Voice-first symptom intake</div>
        <div class="hm-chip" style="top:26%;right:0" data-icon="AP" data-hmfloat>Appointment assistance</div>
        <div class="hm-chip" style="bottom:24%;left:0" data-icon="NAV" data-hmfloat>Hospital navigation</div>
        <div class="hm-chip" style="bottom:6%;right:6%" data-icon="SUM" data-hmfloat>Clinician-ready summaries</div>
      </div>
      <div class="rv">
        <h3 style="font-size:clamp(24px,2.6vw,32px);font-weight:700;line-height:1.25;color:#fff">Built human-centered,<br>from the first interaction.</h3>
        <div class="hm-points">
          <div><b>Patient Interaction</b>Conversational intake that meets people where they are — voice, kiosk, or mobile.</div>
          <div><b>Doctor Matching Support</b>Helps route patients toward the right specialty and the right appointment.</div>
          <div><b>Smart Reminders</b>Medication and follow-up nudges that keep care plans on track.</div>
          <div><b>Education Mode</b>Assistive intelligence for learning environments — patient education and beyond.</div>
        </div>
        <p class="hm-disclaimer">MENNIE is designed to support healthcare workflows under expert oversight. It does not diagnose, treat, provide emergency guarantees, or replace medical professionals.</p>
      </div>
    </div>
  </div>
</section>

<section id="mennie-detail" class="sec-pad">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Beyond the Screen</span>
      <h2>From kiosk to <span class="grad-text">humanoid.</span></h2>
      <p>MENNIE is exploring how AI can move from digital interfaces into real-world environments — under careful, staged development with digital-twin simulation at every step.</p>
    </div>
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="KX"></div><h3>Kiosk Workflows</h3><p>Self-service intake and navigation stations for hospital lobbies — privacy-conscious, voice-first, multilingual by design.</p></div>
      <div class="card rv"><div class="ico" data-icon="HR"></div><h3>Humanoid Assistance</h3><p>An intelligent assistive robot for healthcare and education — patent-pending, developed with digital-twin simulation before any physical deployment.</p></div>
      <div class="card rv"><div class="ico" data-icon="FL"></div><h3>Privacy by Architecture</h3><p>Federated learning and edge inference keep sensitive health data where it belongs — on-site, encrypted, auditable.</p></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Roadmap</span>
      <h2>Private beta to <span class="grad-text">deployment.</span></h2>
    </div>
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="Q1"></div><h3>Q1 2026</h3><p>Private beta expansion with select healthcare partners — real-world workflow testing under close clinical supervision.</p><span class="stage">Active</span></div>
      <div class="card rv"><div class="ico" data-icon="Q2"></div><h3>Q2 2026</h3><p>Pilot workflows focused on assistive communication and care support — intake, routing, and clinician handoff pipelines.</p><span class="stage">Upcoming</span></div>
      <div class="card rv"><div class="ico" data-icon="Q3"></div><h3>Q3 2026</h3><p>Operational readiness for broader institutional onboarding — kiosk deployment, edge inference, and multilingual support.</p><span class="stage">Planned</span></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Press &amp; strategic partners welcome.</h2>
      <p>We are actively seeking press and strategic partners to join us on our journey. Whether you want the media kit or a direct conversation — reach out.</p>
      <div class="cta-row">
        <a href="mailto:pratham@praversetech.com?subject=MENNIE%20Media%20Kit" class="btn btn-white">Request Media Kit →</a>
        <a href="mailto:pratham@praversetech.com?subject=MENNIE%20Partnership" class="btn btn-outline">Discuss Partnership</a>
      </div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Be first in line.</h2>
      <p>MENNIE is coming soon. Join the waitlist for early access, pilot programs, and collaboration opportunities.</p>
      <div class="cta-row">
        <a href="mailto:pratham@praversetech.com?subject=MENNIE%20Waitlist" class="btn btn-white">Join the Waitlist →</a>
        <a href="/contact" class="btn btn-outline">Partner With Us</a>
      </div>
    </div>
  </div>
</section>`;

export default function MenniePage() {
  return <StaticPageContent html={html} />;
}
