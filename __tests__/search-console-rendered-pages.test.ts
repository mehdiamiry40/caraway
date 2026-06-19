import { describe, expect, it } from "vitest";
import nextConfig, {
  legacyIndexingRedirects,
  legacyRenderedRewrites,
} from "../next.config";
import { metadata as howItWorksMetadata } from "@/app/how-it-works/page";
import { metadata as servicesMetadata } from "@/app/services/page";

async function getRedirectSources(): Promise<Set<string>> {
  const redirects = nextConfig.redirects;
  if (typeof redirects !== "function") return new Set();
  return new Set((await redirects()).map((rule) => rule.source));
}

async function getBeforeFilesRewrites(): Promise<Array<{ source: string; destination: string }>> {
  const rewrites = nextConfig.rewrites;
  if (typeof rewrites !== "function") return [];
  const result = await rewrites();
  return Array.isArray(result) ? result : result.beforeFiles ?? [];
}

describe("Search Console rendered-page cleanup", () => {
  it("serves /how-it-works as a canonical page instead of a redirect", async () => {
    const redirectSources = await getRedirectSources();

    expect(redirectSources.has("/how-it-works")).toBe(false);
    expect(howItWorksMetadata.alternates?.canonical).toBe("/how-it-works");
  });

  it("serves the legacy damaged-car HTML URL without keeping it in the redirect contract", async () => {
    const redirectSources = await getRedirectSources();
    const rewrites = await getBeforeFilesRewrites();

    expect(redirectSources.has("/blog/sell-damaged-car-brisbane.html")).toBe(false);
    expect(legacyIndexingRedirects.map((rule) => rule.source)).not.toContain(
      "/blog/sell-damaged-car-brisbane.html",
    );
    expect(rewrites).toContainEqual({
      source: "/blog/sell-damaged-car-brisbane.html",
      destination: "/damaged-cars-brisbane",
    });
  });

  it("serves Search Console 404 examples through rendered pages or internal rewrites", async () => {
    const redirectSources = await getRedirectSources();
    const rewrites = await getBeforeFilesRewrites();

    for (const rewrite of legacyRenderedRewrites) {
      expect(redirectSources.has(rewrite.source)).toBe(false);
      expect(rewrites).toContainEqual(rewrite);
    }

    expect(servicesMetadata.alternates?.canonical).toBe("/services");
  });
});
