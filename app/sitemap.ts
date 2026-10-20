import type { MetadataRoute } from "next";
import { company } from "@/content/company";
import { ROUTES } from "@/lib/routes";

/** Canonical routes only, from lib/routes.ts. The 308s handle every old URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${company.url}${r.path}`,
    lastModified: r.updated,
    changeFrequency: r.freq,
    priority: r.priority
  }));
}
