import type { Metadata } from "next";
import Image from "next/image";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "Research & Labs - Praverse Tech",
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>Research → Market</div>
  <h1 class="rv">Research that <span class="grad-text">ships.</span></h1>
  <p class="sub rv">Praverse is research-backed and product-oriented. We don't publish for its own sake — every research track exists to feed a domain, and every domain exists to put research into the market.</p>
</header>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kicker">Active Labs</span>
      <h2>Four labs.<br><span class="grad-text">One direction.</span></h2>
    </div>
    <div class="cap-grid two">
      <div class="card rv"><div class="ico" data-icon="CV"></div><h3>Medical Imaging Lab</h3><p>Deep learning for healthcare imaging — screening-support pipelines for ophthalmology, women's health, and diagnostic imaging, designed to assist (not replace) expert review.</p><div class="tags"><i>Imaging</i><i>Screening Support</i><i>Deep Learning</i></div></div>
      <div class="card rv"><div class="ico" data-icon="REG"></div><h3>Regulatory AI Lab</h3><p>FDA 483 response generation, observation analytics, and document intelligence for GMP environments — evidence-grounded by design.</p><div class="tags"><i>FDA-483</i><i>NLP</i><i>RAG</i></div></div>
      <div class="card rv"><div class="ico" data-icon="FL"></div><h3>Edge &amp; Federated AI Lab</h3><p>Real-time inference on constrained hardware and privacy-preserving distributed training — the foundation for kiosks, wearables, and on-site AI.</p><div class="tags"><i>Edge AI</i><i>Federated</i><i>AIoT</i></div></div>
      <div class="card rv"><div class="ico" data-icon="HR"></div><h3>Humanoid Simulation Lab</h3><p>Digital twins and simulation environments for assistive robotics — testing behavior safely before it ever touches the physical world.</p><div class="tags"><i>Digital Twins</i><i>Simulation</i><i>Robotics</i></div></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Publications</span>
      <h2>Peer-reviewed research <span class="grad-text">in the wild.</span></h2>
      <p>Our applied work is anchored in published science — IEEE, Scopus-indexed conferences, and international journals.</p>
    </div>
    <div class="pub-grid">
      <article class="pub-card rv">
        <div class="venue">IEEE Transactions on Medical Imaging · 2023</div>
        <h4>Deep Learning for Diabetic Macular Edema (DME) Detection from Fundus Images</h4>
        <p>A novel convolutional neural network architecture for the automated detection and grading of DME, achieving 98% accuracy. Designed as a screening-support tool to assist ophthalmologists — not replace them.</p>
        <div class="yr">2023 · Medical Imaging Lab</div>
      </article>
      <article class="pub-card rv">
        <div class="venue">Scopus Indexed Conference · 2023</div>
        <h4>Netra Sakhi: An Edge AI System for Ophthalmic Screening in Low-Resource Settings</h4>
        <p>A lightweight, deployable edge AI system for screening multiple eye diseases, designed for rural healthcare camps. NLP + Twilio-powered assistant for ophthalmic screening under constrained hardware and limited connectivity.</p>
        <div class="yr">2023 · Edge AI / Healthcare</div>
      </article>
      <article class="pub-card rv">
        <div class="venue">International Journal of Robotics &amp; Automation · 2024</div>
        <h4>Autonomous Driving Simulation using Neuroevolution of Augmenting Topologies (NEAT)</h4>
        <p>Demonstrates the effectiveness of the NEAT algorithm for training agents in complex, multi-objective autonomous driving scenarios in simulation — a foundation for humanoid navigation research.</p>
        <div class="yr">2024 · Humanoid Simulation Lab</div>
      </article>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Research → Market</span>
      <h2>Every research track <span class="grad-text">feeds a domain.</span></h2>
      <p>We organize research by domain, not by project — each track matures from early-stage research into an applied, deployable system.</p>
    </div>
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="CV"></div><h3>Vision &amp; Medical Imaging</h3><p>Computer vision research for healthcare screening and industrial inspection.</p><span class="stage">Published Research</span></div>
      <div class="card rv"><div class="ico" data-icon="REG"></div><h3>AI for Pharma &amp; Regulatory</h3><p>Compliance automation and document intelligence for regulated industries.</p><span class="stage">In Deployment</span></div>
      <div class="card rv"><div class="ico" data-icon="FL"></div><h3>Federated Learning &amp; Edge AI</h3><p>Privacy-preserving distributed training and real-time edge inference.</p><span class="stage">Applied Research</span></div>
      <div class="card rv"><div class="ico" data-icon="HR"></div><h3>Humanoid Robotics</h3><p>Assistive robotics research — digital twins, simulation, human-machine interaction.</p><span class="stage">Patent-Pending</span></div>
      <div class="card rv"><div class="ico" data-icon="IOT"></div><h3>AIoT &amp; Industrial Intelligence</h3><p>Connected sensing and real-time decision systems for industrial environments.</p><span class="stage">Active</span></div>
      <div class="card rv"><div class="ico" data-icon="DI"></div><h3>Finance Management AI</h3><p>Audit-ready financial automation and decision-support research.</p><span class="stage">Active</span></div>
      <div class="card rv"><div class="ico" data-icon="BIO"></div><h3>Biochip 2027</h3><p>Early-stage research into biochips and biological signal intelligence.</p><span class="stage">Early-Stage Research</span></div>
      <div class="card rv"><div class="ico" data-icon="PH"></div><h3>Photonics 2027</h3><p>Photonic sensing and optical intelligence for next-generation compute.</p><span class="stage">Early-Stage Research</span></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Roadmap</span>
      <h2>The road to <span class="grad-text">2027.</span></h2>
    </div>
    <div class="timeline">
      <div class="tl-item rv"><span class="year">2023</span><div class="tl-card"><h4>Foundational Research</h4><p>Peer-reviewed work in healthcare imaging and edge AI lays the groundwork for applied systems.</p></div></div>
      <div class="tl-item rv"><span class="year">2024</span><div class="tl-card"><h4>Applied Pipelines</h4><p>Imaging and screening-support research matures into deployable lab prototypes.</p></div></div>
      <div class="tl-item rv"><span class="year">2025</span><div class="tl-card"><h4>Platform Development</h4><p>HealthMate and pharma regulatory AI move from research into active product development.</p></div></div>
      <div class="tl-item rv"><span class="year">2026</span><div class="tl-card"><h4>Frontier Tracks Open</h4><p>Biochip research and expanded federated-AI tracks begin incubation.</p></div></div>
      <div class="tl-item rv"><span class="year">2027</span><div class="tl-card"><h4>Cognitive AI Ecosystem</h4><p>Projected unification — research, products, and platforms working as one intelligence fabric. Photonics research track opens.</p></div></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Have an idea worth building?</h2>
      <p>We welcome collaboration, mentorship, and innovation submissions. If it advances human-centered intelligence, we want to hear it.</p>
      <div class="cta-row">
        <a href="/innovate" class="btn btn-white">Submit an Idea →</a>
        <a href="/contact" class="btn btn-outline">Collaborate With Us</a>
      </div>
    </div>
  </div>
</section>`;

export default function ResearchPage() {
  return (
    <>
      <StaticPageContent html={html} />
      <section className="image-band image-band-research">
        <div className="wrap">
          <div className="cinematic-image-card cinematic-image-card-split rv">
            <Image
              src="/images/praverse-frontier-lab.png"
              alt="Futuristic AI infrastructure lab with robotic systems, holographic interfaces, and blue data light"
              width={1536}
              height={1024}
            />
            <div className="image-caption">
              <span>Frontier Lab</span>
              <b>Research tracks for robotics, edge intelligence, photonics, and secure AI infrastructure.</b>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
