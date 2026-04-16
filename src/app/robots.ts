import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI / scraper bots to block from crawling site content.
 * Kept as a flat list so each gets its own User-agent + Disallow block,
 * which is the format most bots actually respect.
 */
const BLOCKED_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Bytespider",
  "Applebot-Extended",
  "FacebookBot",
  "PerplexityBot",
  "Amazonbot",
  "Cohere-ai",
  "Meta-ExternalAgent",
  "Omgilibot",
  "Diffbot",
  "ImagesiftBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: [],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/_next/"],
      },
      ...BLOCKED_BOTS.map((bot) => ({
        userAgent: bot,
        disallow: ["/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
