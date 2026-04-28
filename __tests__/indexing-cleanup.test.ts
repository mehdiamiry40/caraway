import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig, { legacyIndexingRedirects } from "../next.config";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

type RedirectRule = {
  source: string;
  destination: string;
  permanent?: boolean;
};

async function getRedirectRules(): Promise<RedirectRule[]> {
  const redirects = nextConfig.redirects;
  if (typeof redirects !== "function") return [];
  return (await redirects()) as RedirectRule[];
}

async function getHeaderRules(): Promise<HeaderRule[]> {
  const headers = nextConfig.headers;
  if (typeof headers !== "function") return [];
  return (await headers()) as HeaderRule[];
}

function liveTargetPath(destination: string): string {
  const pathOnly = destination.split("#")[0] || "/";
  return pathOnly === "/" ? "/" : pathOnly.replace(/\/$/, "");
}

function walkSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkSourceFiles(fullPath);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    return [fullPath];
  });
}

describe("Crawled - currently not indexed cleanup", () => {
  it("keeps the known stale URLs on permanent redirects to live canonical targets", async () => {
    const redirects = await getRedirectRules();
    const sitemapUrls = new Set(sitemap().map((entry) => entry.url));

    for (const legacy of legacyIndexingRedirects) {
      const redirect = redirects.find((rule) => rule.source === legacy.source);
      expect(redirect).toMatchObject({
        destination: legacy.destination,
        permanent: true,
      });

      expect(sitemapUrls.has(`${SITE_URL}${legacy.source}`)).toBe(false);
      expect(sitemapUrls.has(`${SITE_URL}${liveTargetPath(legacy.destination)}`)).toBe(true);
    }
  });

  it("adds crawler and cache headers to the stale redirect URLs", async () => {
    const headers = await getHeaderRules();

    for (const legacy of legacyIndexingRedirects) {
      const rule = headers.find((entry) => entry.source === legacy.source);
      expect(rule).toBeDefined();

      const headerMap = new Map(
        rule!.headers.map((header) => [header.key.toLowerCase(), header.value]),
      );
      expect(headerMap.get("x-robots-tag")).toBe("noindex, follow");
      expect(headerMap.get("cache-control")).toContain("max-age=86400");
      expect(headerMap.get("cache-control")).toContain("stale-while-revalidate=604800");
    }
  });

  it("does not internally link to the stale URLs outside the redirect contract", () => {
    const sourceFiles = walkSourceFiles(path.join(process.cwd(), "src"));

    for (const legacy of legacyIndexingRedirects) {
      const matches = sourceFiles.filter((file) =>
        fs.readFileSync(file, "utf8").includes(legacy.source),
      );
      expect(matches).toEqual([]);
    }
  });
});
