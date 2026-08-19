import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI / scraper bots to block from crawling site content.
 *
 * Policy: block *training* crawlers, allow *live retrieval* crawlers that
 * surface content to users in AI search (ChatGPT Search, Google SGE / AI
 * Overviews, Perplexity, Apple Intelligence). Blocking both cuts off a
 * growing source of referral traffic.
 *
 * Allowed (intentionally removed from this list):
 *   - ChatGPT-User        — live fetch when a ChatGPT user asks
 *   - Google-Extended     — Google generative AI surfaces (SGE / AI Overviews)
 *   - PerplexityBot       — Perplexity live retrieval
 *   - Applebot-Extended   — Apple Intelligence
 */
const BLOCKED_BOTS = [
  "GPTBot",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Bytespider",
  "FacebookBot",
  "Amazonbot",
  "Cohere-ai",
  "Meta-ExternalAgent",
  "Omgilibot",
  "Diffbot",
  "ImagesiftBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Google needs Next build assets (fonts/CSS/JS under /_next/static)
        // to render pages accurately.
        disallow: ["/admin/", "/api/", "/private/"],
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
