/**
 * Sovereign AI data centres — the page that connects the market to what we
 * actually supply.
 *
 * On the word "sovereign": it means the compute, the data and the operator sit
 * under Indian jurisdiction, so that a regulated Indian business can train and
 * run models without its data leaving the country’s legal reach. It is not a
 * synonym for "Indian-owned", and this page does not use it as one.
 *
 * On the stories: every one below is an illustrative scenario, not a customer.
 * They are written as the shape of a real deployment decision — the question
 * that gets asked, the constraint that bites, what it changes — because that is
 * what a data-centre engineer recognises, and because we have no client
 * consent to publish anything else. `kind: "scenario"` renders the label that
 * says so. When a real deployment can be named with written permission, add it
 * with `kind: "deployment"` and the label changes. Nothing else needs to.
 */

export type Story = {
  id: string;
  kind: "scenario" | "deployment";
  /** Short, concrete, no company names. */
  title: string;
  /** Where and how big, in the terms the industry uses. */
  setting: string;
  /** The question that actually gets asked in the room. */
  question: string;
  /** What the constraint turns out to be. */
  constraint: string;
  /** What we supply or do about it. Links to /photonics. */
  answer: string;
};

export const stories: Story[] = [
  {
    id: "training-hall",
    kind: "scenario",
    title: "A training hall that is only as fast as its slowest link",
    setting: "A multi-megawatt GPU hall in a western India colocation facility.",
    question:
      "The cluster benchmarks beautifully on a single node and badly across the fabric. Where is the time going?",
    constraint:
      "At 400G and above, the margin between a link that works and a link that retrains under load is small, and it is set by things nobody put in the bill of materials: insertion loss across the patch panels, the reach of the optics actually fitted, the temperature at the top of the rack at 3am.",
    answer:
      "We qualify the interconnect against the topology it is going into rather than against a datasheet, and supply the copper and optical links that hold the margin at the distances that site really has."
  },
  {
    id: "inference-row",
    kind: "scenario",
    title: "An inference row that has to stay inside the country",
    setting: "A few hundred kilowatts of inference capacity for a regulated Indian business.",
    question:
      "The workload cannot leave Indian jurisdiction. What does that change about the build?",
    constraint:
      "Sovereignty is a supply-chain question long before it is a legal one. If every spare optic is a six-week import and every fault needs an engineer in another time zone, the operator ends up holding risk that was supposed to be designed out.",
    answer:
      "Programming, testing, labelling and qualification happen on the India side, and support answers on local time. The compute staying in India is worth less if the parts keeping it running do not."
  },
  {
    id: "scaling-step",
    kind: "scenario",
    title: "The step from one pod to ten",
    setting: "A build that worked at pilot scale and is now being multiplied.",
    question:
      "Everything was fine with one pod. Why is the second one harder than the first?",
    constraint:
      "Pilots hide the cable plant. At ten pods the structured cabling, the breakout topology and the optics budget stop being procurement details and start being the thing that decides whether the cluster scales linearly.",
    answer:
      "We do the architecture and design-in before the order, not after it — link budgets, breakout plan, and a parts list that still makes sense at the tenth pod."
  }
];

/**
 * What "sovereign" actually requires, as distinct from what it is marketed as.
 * Deliberately framed as questions an operator should be able to answer, not
 * as claims about Praverse.
 */
export const sovereignTests = [
  {
    head: "Where does the data physically sit",
    body: "Not where the contract is signed — which racks, in which building, under whose operating licence."
  },
  {
    head: "Who can be compelled to hand it over",
    body: "The operator’s jurisdiction decides this, and it is not always the same as the customer’s."
  },
  {
    head: "How long is the supply chain",
    body: "A cluster that cannot be repaired without a six-week import is sovereign on paper and fragile in practice."
  },
  {
    head: "Who answers at 3am",
    body: "Support in the same time zone is not a nicety at this scale; it is part of the availability figure."
  }
];
