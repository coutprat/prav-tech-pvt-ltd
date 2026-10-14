import type { Metadata } from "next";
import { company } from "@/content/company";

/**
 * Per-page metadata.
 *
 * Titles are kept to ~60 characters and descriptions to ~155, which is what
 * Google actually renders before truncating. Each page gets its own OG card
 * built from that page's hero, so a shared link previews the page it opens.
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
  /** Basename in /public/og, without extension. */
  og?: string;
}): Metadata {
  const url = `${company.url}${path}`;
  const image = og ? `${company.url}/og/${og}.jpg` : undefined;

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
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {})
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {})
    }
  };
}
