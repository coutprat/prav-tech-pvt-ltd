/**
 * The Trust page's facts.
 *
 * Scope note, and it matters: everything in `siteFacts` and `subProcessors`
 * below is about *this website* — things verifiable from the repository, the
 * headers it serves and the services it calls. They are safe to publish
 * because they can be checked.
 *
 * Anything about how Praverse handles data inside a client engagement is a
 * policy commitment, not a fact about a website, and the owner has to confirm
 * each one before it goes up. Those live in content/verify.ts and render
 * through <Verify>, so an unconfirmed commitment is withheld rather than
 * guessed at. A trust page that overstates is worse than no trust page: it is
 * the one page a buyer's security team reads closely.
 */

export type SubProcessor = {
  name: string;
  purpose: string;
  /** Where the data physically sits, as far as we have configured it. */
  region: string;
  /** What actually reaches them. */
  data: string;
};

export const subProcessors: SubProcessor[] = [
  {
    name: "Vercel",
    purpose: "Hosting, CDN and TLS for praversetech.com",
    region: "Global edge network; functions run in the configured region",
    data: "Standard request data — IP address and user agent at the network layer, as any web host receives. Not retained by us."
  },
  {
    name: "Zoho Mail",
    purpose: "Our mailboxes, and delivery of anything you send through a form",
    region: "India (smtp.zoho.in / mx.zoho.in)",
    data: "Whatever you typed into the form, plus any CV you attached to an application."
  },
  {
    name: "Anthropic",
    purpose: "The assistant in the corner of this site, if you choose to use it",
    region: "Anthropic infrastructure",
    data: "Only what you type into the assistant, plus the published page text it answers from. It is not used to train models, we keep no transcript, and the assistant is never required — every page can be read without it."
  },
  {
    name: "Vercel Speed Insights & Web Analytics",
    purpose: "Page performance and page-view counts",
    region: "Vercel infrastructure",
    data: "Route, referrer, and coarse context such as country, browser and device type. Cookieless, no identifier, no IP address recorded."
  }
];

/** Checkable statements about this website. Each one can be verified from outside. */
export const siteFacts = [
  {
    head: "No cookies, and no consent banner to click",
    body: "This site sets no cookies at all. Both measurement tools are cookieless and set no identifier on your device, which is why there is nothing to consent to."
  },
  {
    head: "Nothing you send is stored here",
    body: "Enquiries and job applications are validated, emailed, and dropped. No database, no file storage. A CV is held in memory just long enough to attach it to one email — the safest store is the one that does not exist. Assistant conversations are not logged either."
  },
  {
    head: "The assistant only knows what you can read",
    body: "Its entire knowledge is an index built by crawling these published pages. It cannot tell you anything the site does not state, it shows which page each answer came from, and it is built to refuse pricing, clinical, regulatory and legal questions outright rather than guess at them."
  },
  {
    head: "Served over TLS, with the headers to match",
    body: "HSTS with a two-year max-age and preload, a content security policy that permits no foreign script origins, X-Frame-Options DENY, nosniff, a strict referrer policy, and a permissions policy that denies camera, microphone and location outright."
  },
  {
    head: "Fonts and media are served from our own domain",
    body: "Loading a page calls no third-party font or asset service, so reading this site does not announce you to anyone else."
  },
  {
    head: "Accessible by design, and measured",
    body: "Every page scores 100 on the Lighthouse accessibility audit in both light and dark themes, with zero axe violations — checked on every change, not once at launch."
  }
];
