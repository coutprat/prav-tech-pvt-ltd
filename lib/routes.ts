import type { MetadataRoute } from "next";

/**
 * Canonical routes, shared by the sitemap and the breadcrumb markup so the two
 * can never list a page differently. The 308s in next.config handle every old
 * URL; nothing here should be a redirect source.
 *
 * `updated` is the date the page's content last changed, not the build date.
 * A sitemap that says every page changed on every deploy teaches Google to
 * ignore its lastmod, so bump a date when that page's words or facts change.
 */
export type Route = {
  path: string;
  /** Breadcrumb label: the page's nav name. */
  name: string;
  priority: number;
  freq: MetadataRoute.Sitemap[number]["changeFrequency"];
  updated: string;
};

export const ROUTES: readonly Route[] = [
  { path: "/", name: "Home", priority: 1, freq: "monthly", updated: "2026-10-20" },
  { path: "/enterprise-ai", name: "Enterprise AI & Agents", priority: 0.9, freq: "monthly", updated: "2026-10-16" },
  { path: "/pharma", name: "Pharma & Regulatory AI", priority: 0.9, freq: "monthly", updated: "2026-10-14" },
  { path: "/mennie", name: "MENNIE", priority: 0.9, freq: "monthly", updated: "2026-10-14" },
  { path: "/photonics", name: "Photonics & AI Data Centres", priority: 0.9, freq: "monthly", updated: "2026-10-20" },
  {
    path: "/sovereign-ai-data-centres",
    name: "Sovereign AI data centres",
    priority: 0.8,
    freq: "monthly",
    updated: "2026-10-20"
  },
  { path: "/company", name: "Company", priority: 0.7, freq: "monthly", updated: "2026-10-20" },
  { path: "/careers", name: "Careers", priority: 0.6, freq: "weekly", updated: "2026-10-14" },
  { path: "/contact", name: "Contact", priority: 0.6, freq: "yearly", updated: "2026-10-14" },
  { path: "/start-a-project", name: "Start a project", priority: 0.6, freq: "yearly", updated: "2026-10-13" },
  { path: "/trust", name: "Trust", priority: 0.6, freq: "yearly", updated: "2026-10-14" },
  { path: "/privacy", name: "Privacy", priority: 0.2, freq: "yearly", updated: "2026-10-14" },
  { path: "/terms", name: "Terms", priority: 0.2, freq: "yearly", updated: "2026-10-13" }
];

export function getRoute(path: string): Route {
  const r = ROUTES.find((x) => x.path === path);
  if (!r) throw new Error(`Unknown route: ${path}`);
  return r;
}
