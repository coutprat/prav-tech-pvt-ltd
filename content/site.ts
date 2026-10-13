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

/** Ready-to-use wa.me link with the prefilled message. */
export const whatsappHref = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage
)}`;
