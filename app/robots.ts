import type { MetadataRoute } from "next";
import { company } from "@/content/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No crawl value, and it would show up as soft-404s in Search Console.
        disallow: ["/api/"]
      }
    ],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url
  };
}
