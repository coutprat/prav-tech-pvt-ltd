import type { MetadataRoute } from "next";
import { company } from "@/content/company";

/**
 * AI search and answer engines are named explicitly. `*` already allows them,
 * but listing each one makes the intent unambiguous to anyone auditing the
 * file, and survives a future tightening of the wildcard rule.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Googlebot",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "YouBot"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No crawl value, and it would show up as soft-404s in Search Console.
        disallow: ["/api/"]
      },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/api/"] }
    ],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url
  };
}
