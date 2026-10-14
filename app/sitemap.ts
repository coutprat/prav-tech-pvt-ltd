import type { MetadataRoute } from "next";
import { company } from "@/content/company";

/** Canonical routes only. The 308s handle every old URL. */
const ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "monthly" },
  { path: "/enterprise-ai", priority: 0.9, freq: "monthly" },
  { path: "/pharma", priority: 0.9, freq: "monthly" },
  { path: "/mennie", priority: 0.9, freq: "monthly" },
  { path: "/photonics", priority: 0.9, freq: "monthly" },
  { path: "/sovereign-ai-data-centres", priority: 0.8, freq: "monthly" },
  { path: "/company", priority: 0.7, freq: "monthly" },
  { path: "/careers", priority: 0.6, freq: "weekly" },
  { path: "/contact", priority: 0.6, freq: "yearly" },
  { path: "/start-a-project", priority: 0.6, freq: "yearly" },
  { path: "/trust", priority: 0.6, freq: "yearly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
  { path: "/terms", priority: 0.2, freq: "yearly" }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${company.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority
  }));
}
