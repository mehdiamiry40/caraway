import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Training-use controls and scraper bots excluded by site policy.
 *
 * Keep search retrieval available through Googlebot, Applebot,
 * OAI-SearchBot, ChatGPT-User and PerplexityBot under the public rule.
 *
 * Google-Extended controls Gemini training AND grounding in Gemini Apps
 * and Vertex AI. Blocking it also opts out of that grounding; Google says
 * it does not affect Google Search inclusion or ranking.
 * https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended
 *
 * Applebot-Extended controls foundation-model training, not search crawling.
 * Applebot remains allowed so Apple search can still discover these pages.
 * https://support.apple.com/en-au/119829
 */
const BLOCKED_BOTS = [
  "GPTBot",
  "Google-Extended",
  "Applebot-Extended",
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
        disallow: ["/api/", "/private/"],
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
