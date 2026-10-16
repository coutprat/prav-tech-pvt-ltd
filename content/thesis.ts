/**
 * The founder's argument about where the gain in AI actually is now.
 *
 * This is a point of view, not a capability list, and it is written to read
 * like one: first person plural, short sentences, a claim it is willing to be
 * wrong about. It earns its place on the Enterprise AI page because it is the
 * reason the rest of that page is shaped the way it is — agents that confer
 * and cross-check are only worth building if something still stops at a
 * person, which is the argument the whole site makes.
 *
 * Deliberately claims nothing about benchmarks, nobody else's models, or what
 * anyone has deployed. It is an opinion about architecture, and it says so.
 */
export const thesis = {
  label: "Our view",
  headline: "The next gain is not a cleverer model.",

  lede:
    "Most of the last few years went into making one model think harder. We think the bigger win now is several of them working the same problem, talking to each other, and settling it between themselves before anyone shows you an answer.",

  // The four roles are set out in `roles` below; a paragraph restating them in
  // prose read as padding when the two sat together on the page.
  body: [
    "What reaches you is a single result that has already survived all of that — not a confident paragraph from one model, but one answer with the arguing done, the sources attached, and the places they could not agree written down rather than smoothed over.",
    "None of this takes the person out. It raises what the person is handed. A qualified reviewer should be spending their judgement on a hard decision, not refereeing a machine that sounded sure of itself."
  ],

  /** The four roles, as a line of text rather than a row of boxes. */
  roles: [
    { name: "Draft", body: "One model writes the first answer." },
    { name: "Check", body: "Another holds it against the source record, line by line." },
    { name: "Challenge", body: "A third argues the opposite case, on purpose." },
    { name: "Reconcile", body: "A fourth settles it, and records what stayed unsettled." }
  ],

  closing: {
    text: "MENNIE is the first product we are building this way.",
    /** The owner's own framing. No date is given anywhere, and none is implied. */
    note: "Launching soon.",
    href: "/mennie",
    cta: "What MENNIE does"
  }
} as const;
