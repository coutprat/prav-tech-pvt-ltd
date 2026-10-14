/**
 * The decks we publish for download.
 *
 * These are the owner's own slides, edited to say exactly what this site says
 * and nothing more. Several claims in the originals had to go: a 2023 founding
 * date (the idea began in 2023; the company was incorporated in 2026), a
 * patent-pending MENNIE, a named US partner, a publication count, an accuracy
 * figure and a cost claim — each of which is either unconfirmed in
 * content/verify.ts or something the owner asked not to print.
 *
 * A deck travels further than a web page and is harder to correct once it is
 * in someone's inbox, so it has to clear the same bar as the site, not a lower
 * one. If a claim changes here, change it there in the same breath.
 *
 * `updated` is shown to the reader: a profile with no date is a profile nobody
 * can tell is current.
 */
export type Download = {
  title: string;
  /** What this one is for, so a visitor picks the right file first time. */
  body: string;
  pdf: string;
  pptx: string;
  /** Rendered as-is; measured from the published files. */
  pdfSize: string;
  pptxSize: string;
  pages: string;
  updated: string;
};

export const downloads: Download[] = [
  {
    title: "Company profile",
    body: "The full picture: how we build for regulated work, the pharma and healthcare suites, the interconnect line, and who stands behind each one.",
    pdf: "/docs/praverse-tech-company-profile.pdf",
    pptx: "/docs/praverse-tech-company-profile.pptx",
    pdfSize: "1.9 MB",
    pptxSize: "8.0 MB",
    pages: "24 slides",
    updated: "October 2026"
  },
  {
    title: "Introduction",
    body: "The short version, made to be read before a first meeting. Who we are, the four lines of work, and the one rule underneath all of them.",
    pdf: "/docs/praverse-tech-introduction.pdf",
    pptx: "/docs/praverse-tech-introduction.pptx",
    pdfSize: "1.2 MB",
    pptxSize: "6.8 MB",
    pages: "8 slides",
    updated: "October 2026"
  }
];
