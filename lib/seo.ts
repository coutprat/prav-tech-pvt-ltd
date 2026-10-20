import type { Metadata } from "next";
import { company } from "@/content/company";

/**
 * Per-page metadata.
 *
 * Titles are kept to ~60 characters and descriptions to ~155, which is what
 * Google actually renders before truncating. Each page gets its own OG card
 * (scripts/media/og.py builds them all in the graphite theme); a page without
 * one of its own falls back to the home card rather than to no image, so every
 * link unfurls as a large card.
 */
export function pageMeta({
  title,
  description,
  path,
  og
}: {
  /** Without the site suffix; the layout template appends it. */
  title: string;
  description: string;
  path: string;
  /** Basename in /public/og, without extension. Defaults to the home card. */
  og?: string;
}): Metadata {
  const url = `${company.url}${path}`;
  const image = `${company.url}/og/${og ?? "home"}.jpg`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: company.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      // The cards are 1200x630, which is exactly what the large card is for.
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}
