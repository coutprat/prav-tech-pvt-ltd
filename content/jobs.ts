/**
 * Open roles.
 *
 * This is the whole job board. Add an entry and the role appears on /careers
 * with its own anchor, its own apply button and its own JSON-LD JobPosting;
 * set `open: false` and it stops being listed and stops being indexed, without
 * breaking a link anyone has already shared.
 *
 * Deliberately a file rather than a CMS. A company hiring one or two people at
 * a time does not need an admin panel, and a file is reviewable in a pull
 * request — which matters, because a job advert is a legal document in most of
 * the markets this site is read in.
 *
 * On compensation: say a range or say nothing. "Competitive" is noise, and in
 * several US states and across the EU pay-transparency rules, an advert that
 * reaches a candidate there without a range is a problem. `salary` is optional
 * for exactly that reason — leave it out rather than inventing one.
 */
export type Job = {
  /** URL fragment and JSON-LD identifier. Never change one after posting. */
  id: string;
  title: string;
  /** Shown as a chip: "Full-time", "Internship", "Contract". */
  type: string;
  location: string;
  /** "On-site", "Hybrid" or "Remote" — candidates filter on this first. */
  workplace: string;
  /** One sentence. What this person owns. */
  summary: string;
  /** ISO date. Used for JSON-LD datePosted and to sort. */
  posted: string;
  /** Optional salary range. Omit entirely rather than writing "competitive". */
  salary?: { min: number; max: number; currency: string; period: "YEAR" | "MONTH" };
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  /** Set false to close a role without deleting its history. */
  open: boolean;
};

export const jobs: Job[] = [
  {
    id: "full-stack-engineer",
    title: "Full Stack Engineer",
    type: "Full-time",
    location: "Vadodara, Gujarat, India",
    workplace: "On-site",
    posted: "2026-10-01",
    summary:
      "Own features end to end on systems that run inside regulated workflows — from the data model to the screen a reviewer actually signs off on.",
    responsibilities: [
      "Build and ship full-stack features: API, data model, and the interface people use them through.",
      "Work directly with the people who will use what you build — quality teams, clinicians, data-centre engineers.",
      "Write the boring half properly: audit trails, permissions, migrations, error states.",
      "Take something from a working prototype to something that survives a year in production."
    ],
    requirements: [
      "Comfortable across a modern stack — TypeScript and React on the front, a real database and a real API on the back.",
      "You have shipped something people used, and maintained it afterwards.",
      "You can read a requirement, find the hole in it, and ask the question before writing the code."
    ],
    niceToHave: [
      "Exposure to regulated software — GxP, clinical, financial, anything with an auditor attached.",
      "Python for data and ML work.",
      "An eye for interface detail. We care about this more than most."
    ],
    open: true
  },
  {
    id: "engineering-intern",
    title: "Engineering Intern",
    type: "Internship",
    location: "Vadodara, Gujarat, India",
    workplace: "On-site",
    posted: "2026-10-01",
    summary:
      "A real project with a real deadline and a named reviewer. Not a shadowing exercise.",
    responsibilities: [
      "Own a defined piece of work for the length of the internship, with weekly review.",
      "Write code that goes through the same review as everyone else's."
    ],
    requirements: [
      "You can show us something you built, finished and would defend. Coursework counts; a side project counts more.",
      "Available in Vadodara for the duration."
    ],
    open: true
  }
];

export const openJobs = jobs.filter((j) => j.open);
