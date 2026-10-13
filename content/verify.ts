/**
 * Registry of every unverified claim on the site.
 *
 * Nothing in here is treated as fact. Each entry carries the text we would
 * *like* to show once it is confirmed (`claim`) and the text that actually
 * ships until then (`fallback`). <Verify> renders `fallback` in production and
 * outlines it in yellow in development so it is impossible to miss.
 *
 * Flip `confirmed: true` (and fill in the real value) only with a source.
 */

export type VerifyItem = {
  /** Stable key, used as the <Verify id>. */
  id: string;
  /** Where it appears, for the open-items report. */
  where: string;
  /** What we want to say once confirmed. */
  claim: string;
  /** What ships until someone confirms it. */
  fallback: string;
  /** What exactly needs checking. */
  needs: string;
  confirmed: boolean;
};

export const verifyItems = [
  {
    id: "cin",
    where: "Footer — company identity",
    claim: "CIN U62020GJ2026PTC175386",
    fallback: "CIN available on request",
    needs: "Confirm the CIN and that it is correct to publish.",
    confirmed: false
  },
  {
    id: "registered-address",
    where: "Footer — company identity",
    claim: "Registered address, Vadodara, Gujarat",
    fallback: "Vadodara, Gujarat, India",
    needs: "Full registered address as filed.",
    confirmed: false
  },
  {
    id: "publications-count",
    where: "Home ProofBar · Research",
    claim: "Peer-reviewed publications",
    fallback: "Peer-reviewed publications",
    needs: "Exact count plus links/DOIs for each venue.",
    confirmed: false
  },
  {
    id: "mennie-patent",
    where: "Home ProofBar · MENNIE",
    claim: "MENNIE patent-pending",
    fallback: "MENNIE patent-pending",
    needs: "Patent application number and filing jurisdiction.",
    confirmed: false
  },
  {
    id: "infraeo-consent",
    where: "Home ProofBar · Photonics · Company",
    claim: "Technology partner: Infraeo Inc. (USA)",
    fallback: "Technology partner: our US technology partner",
    needs:
      "Written consent to name Infraeo Inc. publicly, and the formal status of the partnership (authorised India partner?).",
    confirmed: false
  },
  {
    id: "aec-reach",
    where: "Photonics — portfolio",
    claim: "AEC: up to 9 m at 800G (Infraeo)",
    fallback: "AEC: up to 9 m at 800G (partner specification)",
    needs: "Confirm the 9 m figure against the partner datasheet.",
    confirmed: false
  },
  {
    id: "dme-accuracy",
    where: "Research — track record",
    claim: "Reported 98% accuracy",
    fallback: "Results reported in the published paper",
    needs: "Check the 98% figure against the paper, including the dataset it refers to.",
    confirmed: false
  },
  {
    id: "netra-sakhi-scopus",
    where: "Research — track record",
    claim: "Scopus-indexed",
    fallback: "Published at a peer-reviewed conference",
    needs: "Confirm Scopus indexing and supply the link.",
    confirmed: false
  },
  {
    id: "intel-collaboration",
    where: "Company — Pratham",
    claim: "Intel collaboration",
    fallback: "",
    needs:
      "Exact nature of the Intel relationship: programme, partnership, or use of tools? Omitted entirely until confirmed.",
    confirmed: false
  },
  {
    id: "pps-cost",
    where: "Company — Vishal",
    claim: "PPS cost reduced from USD 25,000 to USD 1,200",
    fallback: "",
    needs: "Primary source for the cost figures. Omitted entirely until confirmed.",
    confirmed: false
  },
  {
    id: "ashwani-title",
    where: "Company — Ashwani",
    claim: "Advisor, Praverse Tech",
    fallback: "Managing Director, Nexgen Pharma Solutions Pvt Ltd",
    needs: "Confirm what title Ashwani should carry on this site.",
    confirmed: false
  },
  {
    id: "linkedin-people",
    where: "Company — PersonCard links",
    claim: "Individual LinkedIn profile URLs",
    fallback: "",
    needs: "LinkedIn URLs for all three people. Links omitted until supplied.",
    confirmed: false
  },
  {
    id: "linkedin-company",
    where: "Footer",
    claim: "Company LinkedIn page",
    fallback: "",
    needs: "Confirm the company LinkedIn URL.",
    confirmed: false
  }
] as const satisfies readonly VerifyItem[];

export type VerifyId = (typeof verifyItems)[number]["id"];

const byId = new Map(verifyItems.map((i) => [i.id, i as VerifyItem]));

export function getVerifyItem(id: VerifyId): VerifyItem {
  const item = byId.get(id);
  if (!item) throw new Error(`Unknown verify id: ${id}`);
  return item;
}

export const openVerifyItems = verifyItems.filter((i) => !i.confirmed);
