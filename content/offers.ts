/**
 * Ways to start with Praverse Tech: one small, scoped piece of work on the
 * buyer's own data before any larger build.
 *
 * Deliberately no prices, durations or client names: none of those is
 * confirmed, and the site only states what it can stand behind. The same list
 * renders on the Enterprise AI page and feeds llms.txt.
 */
export const offers = [
  {
    title: "Ask your documents",
    body: "Search and extraction across contracts, SOPs, reports and records, with every answer pointing back to its source.",
    gets: "A working prototype on your own documents, and a written plan to take it live."
  },
  {
    title: "One workflow, automated",
    body: "An agent that handles a single repetitive workflow end to end, with a person approving before anything is sent or changed.",
    gets: "The agent running on a real case, with an audit trail of what it did."
  },
  {
    title: "Predict what happens next",
    body: "Forecasting, churn, demand or maintenance models built on your data, with an explanation of what drives each result.",
    gets: "A tested model, the evidence behind it, and an honest view of how far to trust it."
  },
  {
    title: "See what people miss",
    body: "Computer vision for inspection, counting and quality checks from the images you already capture.",
    gets: "A model run on your sample images, with where it works and where it does not."
  }
] as const;
