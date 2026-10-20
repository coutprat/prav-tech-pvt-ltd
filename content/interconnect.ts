/**
 * Interconnect detail from our US technology partner, restated for an Indian
 * buyer. The partner is unnamed on the site for now, so nothing here may carry
 * their name, logo, people, address or trade dress.
 *
 * Where the partner's own pages disagree with each other, the figure from
 * their reach ladder and category tables is used, not the marketing copy.
 */

/* ------------------------------------------------------------- reach ladder */

export const reachLadder = [
  {
    medium: "DAC",
    builtOn: "Passive copper",
    r800: "4 m",
    r1600: "1 m",
    use: "In-rack, GPU to switch. Lowest power and cost per link, no added latency."
  },
  {
    medium: "ACC",
    builtOn: "Linear redriver",
    r800: "5 m",
    r1600: "3 m",
    use: "Adjacent racks and xPU-to-xPU, keeping copper's cost and power."
  },
  {
    medium: "AEC",
    builtOn: "Retimer / DSP",
    r800: "9 m",
    r1600: "4 m",
    use: "Row-level copper. The reach that keeps a rebuild out of the plan."
  },
  {
    medium: "AOC",
    builtOn: "VCSEL optics, LPO or retimed",
    r800: "SR 100 m",
    r1600: "—",
    use: "Rack-to-rack and across the row, where copper should stop."
  },
  {
    medium: "Pluggable optics",
    builtOn: "Multimode and single-mode",
    r800: "SR 100 m · DR 500 m · FR 2 km",
    r1600: "DR8 500 m · FR8 2 km",
    use: "Leaf to spine and across the hall. Reconfigurable."
  },
  {
    medium: "Coherent",
    builtOn: "Coherent optics",
    r800: "Coming",
    r1600: "Coming",
    use: "Longest reach, between halls and buildings."
  }
] as const;

/* --------------------------------------------------------------- headlines */

export const interconnectProof = [
  {
    value: "< 5 W",
    label: "800G multimode LPO, per end",
    note: "Linear pluggable optics, no DSP. In mass production."
  },
  {
    value: "9 m",
    label: "800G on copper",
    note: "Retimed AEC. Up to 4 m at 1.6T."
  },
  {
    value: "1.6T",
    label: "2×DR4 / DR8 LPO",
    note: "Silicon photonics, 500 m single-mode."
  },
  {
    value: "1M+",
    label: "Units shipped in 2024",
    note: "Automated lines, 150 units an hour at over 98% yield."
  }
] as const;

/* ----------------------------------------------------------------- LPO */

export const lpoPoints = [
  {
    title: "Why linear optics",
    body: "An LPO module drives the laser straight from the switch SerDes, with no DSP or CDR in the module. That takes out the part that burns the most power and adds the most latency, and lowers the cost per port."
  },
  {
    title: "What it draws",
    body: "Under 5 W per end at 800G multimode and about 3 W at 400G. Across a few thousand ports, the watts a DSP would have burned go back to the GPUs."
  },
  {
    title: "When to use retimed instead",
    body: "Full-retimed (DSP) optics stay the safer choice where the host SerDes is marginal or the link budget is tight. The catalogue carries both, so the choice is made per link rather than per vendor."
  }
] as const;

/* --------------------------------------------------------- transceivers */

export const transceiverFacts = [
  { head: "Models", cells: ["67 pluggable transceivers · 16 AOCs · 27 each of DAC, ACC, AEC"] },
  { head: "Data rates", cells: ["400G · 800G · 2×400G · 1.6T"] },
  { head: "Lane rates", cells: ["50G, 100G and 200G per lane (PAM4)"] },
  { head: "Architectures", cells: ["Full-retimed (DSP) and linear pluggable (LPO)"] },
  {
    head: "Reach classes",
    cells: ["SR4 / SR8 to 100 m · DR4 / DR8 to 500 m · FR4 / FR8 to 2 km"]
  },
  {
    head: "Form factors",
    cells: ["OSFP (flat-top, RHS, closed-top) · QSFP-DD · QSFP112 · QSFP56 · breakouts"]
  },
  {
    head: "Cooling",
    cells: ["Air, liquid and immersion, single- and two-phase coolant"]
  },
  {
    head: "Management",
    cells: ["CMIS 4.0 and 5.x · Class 1 laser"]
  }
] as const;

export const standards = [
  "IEEE 802.3dj",
  "IEEE 802.3ck",
  "IEEE 802.3cd",
  "OSFP MSA",
  "QSFP-DD MSA",
  "CMIS 5.x",
  "InfiniBand NDR · HDR · XDR",
  "Ethernet 400G / 800G",
  "OCP",
  "RoHS · REACH"
] as const;

export const interop = [
  {
    title: "Switches",
    body: "Broadcom Tomahawk 6 platforms, NVIDIA Spectrum Ethernet and Quantum InfiniBand switches."
  },
  {
    title: "NICs and DPUs",
    body: "NVIDIA ConnectX-8 800G SuperNIC, ConnectX-9 and BlueField-4, in Ethernet and InfiniBand."
  },
  {
    title: "Multi-vendor plugfests",
    body: "Passed CMIS 5.3 compliance and interop at the 43rd InfiniBand and RoCE Plugfest (IBTA / UNH-IOL), at 800G and 1.6T."
  },
  {
    title: "Test equipment",
    body: "Links proven on Keysight and VIAVI test systems — 800G copper at 9 m holding pre-FEC BER better than 1E-8."
  }
] as const;

/* ----------------------------------------------------- loopback / test */

export const testTools = {
  title: "Loopback testers",
  body: "31 loopback modules from 25G to 1.6T, SFP56 through OSFP-XD — passive at 0 W, or active up to 60 W to load a port thermally the way a real module does. The fastest way to qualify a switch before the optics arrive."
} as const;

/* ------------------------------------------------- how a link is delivered */

export const deliverySteps = [
  {
    n: "01",
    title: "Choose",
    body: "Start from a proven design on leading silicon, matched to the reach, power and timeline of your cluster — not a catalogue to sort through."
  },
  {
    n: "02",
    title: "Guarantee",
    body: "The design is stood behind. When a build genuinely needs something custom, the engineers design and qualify it."
  },
  {
    n: "03",
    title: "Prove",
    body: "Make it work in your environment before deployment: signal integrity, link margin, thermals and interop, on your switches."
  },
  {
    n: "04",
    title: "Scale",
    body: "Once qualified, it is manufactured in volume — from ten units to the millions — on your timeline."
  }
] as const;

export const engineeringDepth = [
  "Signal integrity",
  "Power integrity",
  "Thermal integrity",
  "Optical design",
  "Optoelectronics packaging",
  "High-speed twinax",
  "Advanced firmware",
  "Testing at 800G · 1.6T · 3.2T"
] as const;

export const manufacturing = [
  {
    title: "Automated",
    body: "AI-driven production and test lines. 150 units an hour at over 98% yield on the copper lines."
  },
  {
    title: "Elastic",
    body: "From ten units to the millions the largest deployments need, with capacity stood up in weeks rather than quarters."
  },
  {
    title: "Geodiverse",
    body: "Production replicated across North America and Asia, so no single region is the one your supply depends on — and country-of-origin requirements can be met without re-engineering."
  }
] as const;

/* --------------------------------------------- sovereign AI: the fabric */

export const fabricScales = [
  {
    title: "Scale-up",
    where: "Inside the rack",
    body: "GPUs and switches within the rack. Passive DAC where the run is short; ACC and AEC when the rack gets dense or the run gets long.",
    media: "DAC · ACC · AEC"
  },
  {
    title: "Scale-out",
    where: "Between racks",
    body: "Rack to rack and row to spine. Retimed copper to about 9 m, then AOCs and pluggable optics, with LPO where power matters.",
    media: "AEC · AOC · SR / DR optics"
  },
  {
    title: "Scale-across",
    where: "Across the fabric",
    body: "Between pods, halls and buildings. Single-mode DR and FR optics to 2 km, with coherent optics for the longest links.",
    media: "DR / FR optics · coherent"
  }
] as const;

export const interconnectGap = [
  {
    title: "Reach",
    body: "Match the medium to the distance at every hop. Over-engineering every link wastes money; under-engineering one link means a rebuild."
  },
  {
    title: "Power",
    body: "Every watt moving data is a watt not spent on compute. Copper where reach is short; low-power LPO optics where distance demands glass."
  },
  {
    title: "Qualification",
    body: "Weeks spent validating links are weeks closer to a missed deployment window. Retimed copper with proven link stability shortens bring-up."
  }
] as const;

export const workloads = [
  {
    title: "Training clusters",
    body: "Reach, power and density hit their limits at once. The fabric is designed around the GPUs before the rack is built, and today's choices are made with the next generation in view.",
    points: ["Reach", "Power", "Density", "Interoperability"],
    foot: "1.6T today. 3.2T on the roadmap."
  },
  {
    title: "Inference",
    body: "Little room for wasted power or latency. Link distance, data rate, latency, power budget, port density, thermals and the deployment environment are all sized before a part is chosen.",
    points: ["Power", "Latency", "Reach", "Density"],
    foot: "Keep the power on compute."
  },
  {
    title: "At national scale",
    body: "A great design is only the beginning. The interconnect has to qualify, repeat, ship and perform the same way across thousands of units — through architecture, design-in, production and delivery.",
    points: ["Qualification", "Yield", "Supply", "Responsiveness"],
    foot: "Same-day answers, not same-quarter."
  }
] as const;

/** The four Ethernet ways an 800G switch port meets an NVIDIA ConnectX-8 NIC. */
export const nicConfigs = [
  {
    head: "Switch → 1 × CX8 C8180",
    cells: ["800G OSFP to OSFP-RHS", "One 800G link, or 2 × 400G"]
  },
  {
    head: "Switch → 2 × CX8 C8180",
    cells: ["800G OSFP broken out to 2 × 400G", "Each leg to its own NIC in 400G mode"]
  },
  {
    head: "Switch → 1 × CX8 C8240",
    cells: ["800G OSFP to 2 × QSFP112", "Both cages on one NIC, full 800G"]
  },
  {
    head: "Switch → 2 × CX8 C8240",
    cells: ["800G OSFP to 2 × QSFP112", "One 400G cage per NIC"]
  }
] as const;

export const nextLaneRate = {
  title: "From 224G to 448G per lane",
  body: "Doubling the lane rate means new signalling, stronger error correction and moving the connection closer to the silicon. Copper keeps up — retimed 1.6T copper already runs 3 m at 18–20 W per end, against about 22 W for a 1.6T optic over 500 m — but where copper ends and optics begins keeps moving. The job is to measure that boundary for each build, not argue where it should be."
} as const;
