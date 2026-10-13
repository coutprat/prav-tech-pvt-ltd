/**
 * Operational contact configuration.
 *
 * Kept separate from content/company.ts (which holds the *facts* about the
 * business) because these are switches someone will need to flip without
 * reading anything else: where mail goes, which WhatsApp number answers.
 */

export const site = {
  /** Enquiries from the contact and project forms. */
  enquiryEmail: "inquiry@praversetech.com",
  /** CVs and hiring questions. */
  careersEmail: "careers@praversetech.com",

  /**
   * WhatsApp number in international format, digits only, no + or spaces.
   *
   * TEMPORARY — replace with the business WhatsApp number.
   * This is the only place it appears; changing it here changes it everywhere.
   */
  whatsappNumber: "919313247264",

  whatsappMessage: "Hello Praverse Tech, I'd like to discuss a project."
} as const;

/**
 * Where the team sits.
 *
 * These are **team members**, not offices. Saying "office" implies a
 * registered place of business, which is a claim a US or EU buyer may check.
 */
export const locations = {
  hq: "Vadodara, Gujarat",
  cities: ["Mumbai", "Chennai", "Bengaluru", "Delhi NCR"],
  line: "Headquartered in Vadodara, Gujarat, with team members in Mumbai, Chennai, Bengaluru and Delhi NCR.",
  /** Vadodara to Mumbai, from the company profile deck. */
  hqToMumbaiKm: 400,
  markets: "We work with organisations in India, the US, Europe, Australia and Asia."
} as const;

/**
 * Core team, beyond the leadership already on the Company page.
 *
 * Deliberately empty: nobody's name or photo is published without their
 * consent. Fill in an entry and it appears; leave the array empty and the
 * section does not render at all.
 */
export type TeamMember = {
  name: string;
  role: string;
  city: string;
  /** File in /public/team, without extension. Omit for an initials tile. */
  photo?: string;
  linkedIn?: string;
};

export const team: TeamMember[] = [];


/** Ready-to-use wa.me link with the prefilled message. */
export const whatsappHref = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage
)}`;
