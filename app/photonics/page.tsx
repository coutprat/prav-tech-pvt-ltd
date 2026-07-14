import type { Metadata } from "next";
import { StaticPageContent } from "@/components/layout/StaticPageContent";

export const metadata: Metadata = {
  title: "Photonics — High-Speed Connectivity Manufacturing | Praverse Tech",
  description:
    "Building India's advanced manufacturing platform for high-speed electronic and optical connectivity products — the physical layer AI infrastructure runs on.",
};

const html = `<header class="page-hero">
  <div class="eyebrow rv"><span class="pulse"></span>Advanced Manufacturing · Made in India · Built for the World</div>
  <h1 class="rv">The physical layer <span class="grad-text">AI runs on.</span></h1>
  <p class="sub rv">Building India's advanced manufacturing platform for high-speed electronic and optical connectivity — the cables, boards, and assemblies that allow artificial intelligence, cloud computing, and supercomputing systems to operate at their full potential.</p>
  <div class="cta-row rv" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:36px">
    <a href="mailto:pratham@praversetech.com?subject=Photonics%20Inquiry" class="btn btn-grad">Discuss Your Requirements →</a>
    <a href="#photonics-products" class="btn btn-ghost">Our Products</a>
  </div>
</header>

<section class="page-story sec-pad-sm">
  <div class="wrap">
    <div class="story-inner rv">
      <span class="story-kicker">The Infrastructure Imperative · Made in India</span>
      <h2 class="story-pullquote">The AI cluster trained in 21 days instead of 34. <em>The only difference was the cable connecting its GPUs.</em></h2>
      <p class="story-body">Behind every large language model, every medical imaging system, every real-time AI platform, there is a physical layer doing invisible work. Copper cables transmitting gradient data between thousands of GPUs. Optical fibres moving petabytes between servers in microseconds. PCB assemblies maintaining signal integrity at 800G and beyond. These are not commodity components — they are precision instruments engineered for speed, thermal stability, and signal integrity at extraordinary data rates. And until now, they have almost entirely been manufactured outside India. We are building the manufacturing platform that changes that: high-speed electronic and optical connectivity products, designed for the AI era, assembled in India, supplied to the world.</p>
      <div class="story-meta">Praverse Photonics · Advanced Manufacturing Division · Engineered for Speed · Manufactured for Reliability</div>
    </div>
  </div>
</section>

<section id="photonics-products" class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Manufacturing Portfolio</span>
      <h2>What we <span class="grad-text">manufacture.</span></h2>
      <p>Our planned portfolio covers the complete spectrum of high-speed connectivity products — from passive copper to advanced optical assemblies — for AI infrastructure, cloud computing, and hyperscale data centres.</p>
    </div>

    <div class="ph-showcase rv">

      <!-- DAC -->
      <div class="ph-card" data-accent="orange">
        <div class="ph-img">
          <img src="/images/dac-direct-attach-cable.png" alt="Direct Attach Copper Cable" loading="eager" />
        </div>
        <div class="ph-content">
          <span class="ph-code">DAC</span>
          <h3 class="ph-card-title">Direct Attach Copper</h3>
          <p class="ph-desc">Passive copper cables for low-cost, ultra-low-latency rack-to-rack and switch-to-server connectivity. No active components — pure signal, minimum power.</p>
          <div class="ph-tiers">
            <div class="ph-tier">
              <span class="ph-tier-badge">100G – 400G</span>
              <span class="ph-tier-forms">SFP / QSFP / SFPDD / DSFP / OSFP / QSFP-DD</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">800G</span>
              <span class="ph-tier-forms">SFP112 / SFP-DD112 / QSFP112 / QSFP-DD800 / OSFP</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">1.6T</span>
              <span class="ph-tier-forms">OSFP-XD / OSFP1600</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ACC -->
      <div class="ph-card" data-accent="amber">
        <div class="ph-img">
          <img src="/images/acc-active-copper-cable.png" alt="Active Copper Cable" loading="eager" />
        </div>
        <div class="ph-content">
          <span class="ph-code">ACC · Linear Redriver</span>
          <h3 class="ph-card-title">Active Copper Cables</h3>
          <p class="ph-desc">Signal-conditioned copper cables with linear redriver ICs for extended reach over DAC. Low latency, low power, no retiming overhead.</p>
          <div class="ph-tiers">
            <div class="ph-tier">
              <span class="ph-tier-badge">100G – 400G</span>
              <span class="ph-tier-forms">QSFP / DSFP / QSFP-DD / OSFP</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">800G</span>
              <span class="ph-tier-forms">QSFP112 / OSFP800 / QSFP-DD800</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">1.6T</span>
              <span class="ph-tier-forms">OSFP1600 / OSFP-XD / QSFP-DD1600</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AEC -->
      <div class="ph-card" data-accent="cyan">
        <div class="ph-img">
          <img src="/images/aec-active-electrical-cable.png" alt="Active Electrical Cable" loading="eager" />
        </div>
        <div class="ph-content">
          <span class="ph-code">AEC · Retimer / DSP</span>
          <h3 class="ph-card-title">Active Electrical Cables</h3>
          <p class="ph-desc">Retimer-based copper cables for reach beyond DAC — up to 7m+. Full signal regeneration via CDR/DSP chips for maximum signal integrity at longer distances.</p>
          <div class="ph-tiers">
            <div class="ph-tier">
              <span class="ph-tier-badge">100G – 400G</span>
              <span class="ph-tier-forms">QSFP / OSFP / QSFP-DD</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">800G</span>
              <span class="ph-tier-forms">QSFP112 / OSFP / QSFP-DD</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">1.6T</span>
              <span class="ph-tier-forms">OSFP1600 / OSFP-XD / QSFP-DD1600</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AOC / SR -->
      <div class="ph-card" data-accent="blue">
        <div class="ph-img">
          <img src="/images/aoc-active-optical-cable.png" alt="Active Optical Cable" loading="eager" />
        </div>
        <div class="ph-content">
          <span class="ph-code">AOC / SR · DSP &amp; LPO</span>
          <h3 class="ph-card-title">Multi-mode Active Optical</h3>
          <p class="ph-desc">Lightweight optical cables with integrated transceivers for high-density, long-distance data-centre interconnects. DSP and LPO variants for power-optimised deployments.</p>
          <div class="ph-tiers">
            <div class="ph-tier">
              <span class="ph-tier-badge">100G – 400G</span>
              <span class="ph-tier-forms">QSFP56 / QSFP-DD Gearbox / OSFP</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">800G</span>
              <span class="ph-tier-forms">OSFP / QSFP-DD / QSFP112</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">1.6T</span>
              <span class="ph-tier-forms">OSFP1600 / QSFP-DD1600 LPO / LRO / SiPh AOC</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Single-mode -->
      <div class="ph-card" data-accent="violet">
        <div class="ph-img">
          <img src="/images/hst-high-speed-transceiver.png" alt="Single-mode Transceiver" loading="eager" />
        </div>
        <div class="ph-content">
          <span class="ph-code">Single-mode · DSP &amp; LPO</span>
          <h3 class="ph-card-title">Single-mode Transceivers</h3>
          <p class="ph-desc">Pluggable optical modules for long-reach, single-mode fibre links. EML-DSP and SiPh-LPO optical engines for maximum reach with minimum power at 400G to 1.6T.</p>
          <div class="ph-tiers">
            <div class="ph-tier">
              <span class="ph-tier-badge">100G – 400G</span>
              <span class="ph-tier-forms">QSFP28 LR/ER Bidi / QSFP-DD DR4 / QSFP28 DR1</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">400G – 800G</span>
              <span class="ph-tier-forms">OSFP / QSFP-DD800 / QSFP112 DR4 SiPh / SiPh-LPO</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">1.6T</span>
              <span class="ph-tier-forms">OSFP1600 EML(DSP) / OSFP1600 DR8 SiPh-LPO</span>
            </div>
          </div>
        </div>
      </div>

      <!-- OCA -->
      <div class="ph-card" data-accent="green">
        <div class="ph-img">
          <img src="/images/oca-optical-cable-assembly.png" alt="Optical Cable Assembly" loading="eager" />
        </div>
        <div class="ph-content">
          <span class="ph-code">OCA</span>
          <h3 class="ph-card-title">Optical Cable Assemblies</h3>
          <p class="ph-desc">Precision-terminated fibre assemblies — patch cords, trunk cables, and high-density breakout solutions for data centres, telecom infrastructure, and HPC environments.</p>
          <div class="ph-tiers">
            <div class="ph-tier">
              <span class="ph-tier-badge">Patch &amp; Trunk</span>
              <span class="ph-tier-forms">Cords and trunks for transceiver applications</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">High Density</span>
              <span class="ph-tier-forms">Up to 6912F custom assemblies</span>
            </div>
            <div class="ph-tier">
              <span class="ph-tier-badge">Compliance</span>
              <span class="ph-tier-forms">UL / ETL flame ratings · robust supply capacity</span>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /ph-showcase -->

    <p class="safe-note rv" style="margin-top:28px"><span class="shield" data-icon="MFG"></span><span>Custom cable, connector, transceiver, and communication assemblies available for customer-specific architectures. Compliance with relevant technical and quality requirements is built into our manufacturing process.</span></p>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Technology Roadmap</span>
      <h2>From 400G to <span class="grad-text">1.6T and beyond.</span></h2>
      <p>As network speeds advance, conventional connectivity architectures face increasing challenges in power consumption, heat generation, signal loss, and latency. We are building our manufacturing platform around these emerging requirements.</p>
    </div>
    <div class="photonics-bandwidth-track rv">
      <div class="photonics-bw-cell">
        <div class="bw-speed">400G</div>
        <span class="bw-era">Current Deployment</span>
        <p>Standard for today's AI training clusters and hyperscale data centres. Our manufacturing baseline — proven technology, Indian-made.</p>
      </div>
      <div class="photonics-bw-cell">
        <div class="bw-speed">800G</div>
        <span class="bw-era">Active Transition</span>
        <p>The primary focus of next-generation AI infrastructure deployments. AEC and AOC products engineered for 800G signal integrity are at the centre of our portfolio.</p>
      </div>
      <div class="photonics-bw-cell">
        <div class="bw-speed">1.6T</div>
        <span class="bw-era">Emerging Frontier</span>
        <p>The horizon for large-scale AI clusters and future hyperscale networks. Our manufacturing platform is being designed to scale into 1.6T requirements from day one.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Our Approach</span>
      <h2>Not just assembly. <span class="grad-text">Complete capability.</span></h2>
      <p>Modern data-centre networks require much more than individual cables. Our objective is to build capability across the entire value chain — from design and engineering to system integration and quality control.</p>
    </div>
    <div class="value-chain rv">
      <div class="value-chain-step">
        <span class="vc-num">01</span>
        <h4>Design &amp; Engineering</h4>
        <p>Product architecture, PCB design support, signal-integrity analysis, component selection, connector engineering, and manufacturability assessment.</p>
      </div>
      <div class="value-chain-step">
        <span class="vc-num">02</span>
        <h4>Precision Manufacturing</h4>
        <p>Controlled assembly of copper and optical interconnect products using defined processes, specialised equipment, trained personnel, and scalable production systems.</p>
      </div>
      <div class="value-chain-step">
        <span class="vc-num">03</span>
        <h4>Testing &amp; Validation</h4>
        <p>Electrical, optical, mechanical, and functional testing designed to verify performance, reliability, and manufacturing consistency at every stage.</p>
      </div>
      <div class="value-chain-step">
        <span class="vc-num">04</span>
        <h4>System Integration</h4>
        <p>Integration of PCBs, cables, connectors, optical components, and electronic control systems into application-specific connectivity solutions.</p>
      </div>
      <div class="value-chain-step">
        <span class="vc-num">05</span>
        <h4>Made-in-India Capability</h4>
        <p>Domestic manufacturing capacity for products currently critical to AI data centres, cloud infrastructure, supercomputing, and advanced communication networks.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Supporting India's Ecosystem</span>
      <h2>For India's <span class="grad-text">computing ambitions.</span></h2>
      <p>India is rapidly expanding capabilities in supercomputing, artificial intelligence, semiconductor systems, and indigenous electronics manufacturing. Institutions such as C-DAC are building high-performance computing and advanced digital infrastructure — creating a growing requirement for a reliable domestic ecosystem of high-speed connectivity products.</p>
    </div>
    <div class="cap-grid">
      <div class="card rv"><div class="ico" data-icon="AI"></div><h3>AI Data Centres</h3><p>High-speed interconnects for GPU clusters, AI training infrastructure, and hyperscale data centres deploying large models at scale.</p></div>
      <div class="card rv"><div class="ico" data-icon="HPC"></div><h3>High-Performance Computing</h3><p>Connectivity assemblies supporting India's supercomputing programmes — C-DAC and beyond — requiring domestic supply reliability.</p></div>
      <div class="card rv"><div class="ico" data-icon="TEL"></div><h3>Telecom Networks</h3><p>Optical cable assemblies and interconnect solutions for next-generation telecom infrastructure across India and international markets.</p></div>
      <div class="card rv"><div class="ico" data-icon="MFG"></div><h3>Global Supply</h3><p>Indian-manufactured connectivity products built to global quality standards — for domestic customers and international export.</p></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="sec-head center rv">
      <span class="kicker">Design Priorities</span>
      <h2>Engineered for what <span class="grad-text">AI demands.</span></h2>
    </div>
    <div class="cap-grid two">
      <div class="card rv"><div class="ico" data-icon="BW"></div><h3>High Bandwidth</h3><p>Products designed for 400G, 800G, and 1.6T data rates — meeting the bandwidth requirements of next-generation AI clusters and cloud infrastructure.</p></div>
      <div class="card rv"><div class="ico" data-icon="LAT"></div><h3>Low Latency</h3><p>Signal paths engineered to minimise latency — critical for synchronised AI training, distributed computing, and real-time inference workloads.</p></div>
      <div class="card rv"><div class="ico" data-icon="PWR"></div><h3>Power Efficiency</h3><p>Lower power consumption per bit — essential for large-scale AI clusters where electricity and cooling costs define operational economics.</p></div>
      <div class="card rv"><div class="ico" data-icon="SIG"></div><h3>Signal Integrity</h3><p>Precision manufacturing and testing processes to ensure consistent signal quality across every assembly at extreme data rates.</p></div>
      <div class="card rv"><div class="ico" data-icon="TH"></div><h3>Thermal Efficiency</h3><p>Materials and assembly methods designed for thermal stability in dense, high-power data-centre environments.</p></div>
      <div class="card rv"><div class="ico" data-icon="SC"></div><h3>Scalable Manufacturing</h3><p>Production systems designed for reliable large-scale output — consistent quality across high volumes for Indian and global customers.</p></div>
    </div>
  </div>
</section>

<section class="sec-pad-sm">
  <div class="wrap">
    <div class="cta-box rv">
      <h2>Engineered for speed.<br>Manufactured for reliability.<br><span class="grad-text">Built in India for the world.</span></h2>
      <p>We are developing our manufacturing platform and actively seeking technology partners, customers, and institutional collaborators. If your infrastructure depends on high-speed connectivity, let's talk.</p>
      <div class="cta-row">
        <a href="mailto:pratham@praversetech.com?subject=Photonics%20Partnership" class="btn btn-white">Start a Conversation →</a>
        <a href="/contact" class="btn btn-outline">Contact Us</a>
      </div>
    </div>
  </div>
</section>`;

export default function PhotonicsPage() {
  return <StaticPageContent html={html} />;
}
