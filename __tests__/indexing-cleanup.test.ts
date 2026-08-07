import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig, {
  legacyIndexingRedirects,
  retiredLocationRedirects,
  retiredServiceRedirects,
} from "../next.config";
import sitemap from "@/app/sitemap";
import { generateStaticParams as generateServiceStaticParams } from "@/app/[slug]/page";
import { generateStaticParams as generateBlogStaticParams } from "@/app/blog/[slug]/metadata";
import { blogPosts } from "@/data/blog-posts";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { RETIRED_SERVICE_DESTINATIONS } from "@/lib/service-consolidation";
import { SITE_URL } from "@/lib/site";

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

type RedirectRule = {
  source: string;
  destination: string;
  permanent?: boolean;
  has?: Array<{ type: string; value?: string }>;
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

function findPathRedirect(
  redirects: RedirectRule[],
  source: string,
): RedirectRule | undefined {
  return redirects.find((rule) => rule.source === source && !rule.has);
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

function cspDirective(csp: string, directiveName: string): string {
  return (
    csp
      .split(";")
      .map((directive) => directive.trim())
      .find((directive) => directive.startsWith(`${directiveName} `)) ?? ""
  );
}

describe("Search Console indexing cleanup", () => {
  it("keeps the known stale URLs on permanent redirects to live canonical targets", async () => {
    const redirects = await getRedirectRules();
    const sitemapUrls = new Set(sitemap().map((entry) => entry.url));

    for (const legacy of legacyIndexingRedirects) {
      const redirect = findPathRedirect(redirects, legacy.source);
      expect(redirect).toMatchObject({
        destination: legacy.destination,
        permanent: true,
      });

      expect(sitemapUrls.has(`${SITE_URL}${legacy.source}`)).toBe(false);
      expect(sitemapUrls.has(`${SITE_URL}${liveTargetPath(legacy.destination)}`)).toBe(true);
    }
  });

  it("consolidates retired location articles instead of serving noindex pages", async () => {
    const redirects = await getRedirectRules();
    const staticSlugs = new Set(
      (await generateBlogStaticParams()).map(({ slug }) => slug),
    );
    const liveSlugs = new Set(blogPosts.map(({ slug }) => slug));
    const expected = new Map([
      ["/blog/cash-for-cars-redcliffe-brisbane", "/locations/redcliffe"],
      ["/blog/cash-for-cars-ipswich-brisbane", "/locations"],
      ["/blog/cash-for-cars-logan-brisbane", "/locations/logan"],
      ["/blog/cash-for-cars-sunshine-coast", "/cash-for-cars-brisbane"],
      ["/blog/cash-for-cars-toowoomba", "/cash-for-cars-brisbane"],
      ["/blog/cash-for-cars-gold-coast", "/cash-for-cars-brisbane"],
    ]);

    for (const [source, destination] of expected) {
      expect(findPathRedirect(redirects, source)).toMatchObject({
        destination,
        permanent: true,
      });

      const slug = source.replace("/blog/", "");
      expect(liveSlugs.has(slug)).toBe(false);
      expect(staticSlugs.has(slug)).toBe(false);
    }
  });

  it("keeps only GSC-supported location pages and redirects retired URLs directly", async () => {
    const redirects = await getRedirectRules();
    const sitemapUrls = new Set(sitemap().map((entry) => entry.url));
    const liveLocationSlugs = new Set(suburbs.map((suburb) => suburb.slug));
    const redirectSources = new Set(redirects.map((redirect) => redirect.source));

    expect([...liveLocationSlugs].sort()).toEqual([
      "beenleigh",
      "capalaba",
      "kenmore",
      "logan",
      "moorooka",
      "redcliffe",
      "springwood",
      "toowong",
    ]);
    expect(retiredLocationRedirects).toHaveLength(26);

    for (const suburb of suburbs) {
      expect(suburb.title).not.toMatch(/\| Caraway$/);
    }

    for (const retired of retiredLocationRedirects) {
      expect(liveLocationSlugs.has(retired.source.replace("/locations/", ""))).toBe(false);
      expect(findPathRedirect(redirects, retired.source)).toMatchObject({
        destination: retired.destination,
        permanent: true,
      });
      expect(sitemapUrls.has(`${SITE_URL}${retired.source}`)).toBe(false);
      expect(sitemapUrls.has(`${SITE_URL}${liveTargetPath(retired.destination)}`)).toBe(true);
      expect(redirectSources.has(retired.destination)).toBe(false);
    }
  });

  it("consolidates low-value service pages into eight distinct live intents", async () => {
    const redirects = await getRedirectRules();
    const sitemapUrls = new Set(sitemap().map((entry) => entry.url));
    const staticSlugs = new Set(
      (await generateServiceStaticParams()).map(({ slug }) => slug),
    );
    const liveServiceSlugs = new Set(services.map((service) => service.slug));
    const redirectSources = new Set(redirects.map((redirect) => redirect.source));

    expect(services).toHaveLength(8);
    expect(liveServiceSlugs.size).toBe(services.length);
    expect([...liveServiceSlugs].sort()).toEqual([
      "car-removal-brisbane",
      "cash-for-cars-brisbane",
      "damaged-cars-brisbane",
      "hail-damaged-cars-brisbane",
      "scrap-car-removal-brisbane",
      "sell-my-car-brisbane",
      "sell-toyota-hilux-brisbane",
      "unregistered-cars-brisbane",
    ]);
    expect(retiredServiceRedirects).toHaveLength(11);

    for (const [slug, destination] of Object.entries(
      RETIRED_SERVICE_DESTINATIONS,
    )) {
      const source = `/${slug}`;
      expect(liveServiceSlugs.has(slug)).toBe(false);
      expect(staticSlugs.has(slug)).toBe(false);
      expect(findPathRedirect(redirects, source)).toMatchObject({
        destination,
        permanent: true,
      });
      expect(
        redirects.find(
          (rule) =>
            rule.source === source &&
            rule.has?.some(
              (condition) =>
                condition.type === "host" &&
                condition.value === "www.caraway.au",
            ),
        ),
      ).toMatchObject({
        destination: `${SITE_URL}${destination}`,
        permanent: true,
      });
      expect(
        redirects.find(
          (rule) =>
            rule.source === `${source}/` &&
            rule.has?.some(
              (condition) =>
                condition.type === "host" &&
                condition.value === "www.caraway.au",
            ),
        ),
      ).toMatchObject({
        destination: `${SITE_URL}${destination}`,
        permanent: true,
      });
      expect(
        redirects.find(
          (rule) => rule.source === `${source}/` && !rule.has,
        ),
      ).toMatchObject({ destination, permanent: true });
      expect(sitemapUrls.has(`${SITE_URL}${source}`)).toBe(false);
      expect(sitemapUrls.has(`${SITE_URL}${destination}`)).toBe(true);
      expect(redirectSources.has(destination)).toBe(false);
    }
  });

  it("does not reference retired services outside their redirect contract", () => {
    const sourceFiles = walkSourceFiles(path.join(process.cwd(), "src")).filter(
      (file) => !file.endsWith("service-consolidation.ts"),
    );

    for (const slug of Object.keys(RETIRED_SERVICE_DESTINATIONS)) {
      const matches = sourceFiles.filter((file) =>
        fs.readFileSync(file, "utf8").includes(slug),
      );
      expect(matches, slug).toEqual([]);
    }
  });

  it("keeps every legacy redirect on a final destination rather than a chain", async () => {
    const redirects = await getRedirectRules();
    const redirectSources = new Set(redirects.map((redirect) => redirect.source));

    for (const legacy of legacyIndexingRedirects) {
      expect(redirectSources.has(legacy.destination)).toBe(false);
    }
  });

  it("does not attach noindex headers to permanent redirects", async () => {
    const headers = await getHeaderRules();

    for (const legacy of legacyIndexingRedirects) {
      const redirectHeaders = headers
        .filter((entry) => entry.source === legacy.source)
        .flatMap((entry) => entry.headers);
      expect(
        redirectHeaders.some(
          (header) => header.key.toLowerCase() === "x-robots-tag",
        ),
      ).toBe(false);
    }
  });

  it("keeps Google Ads conversion endpoints out of the production CSP", async () => {
    const headers = await getHeaderRules();
    const csp = headers
      .find((entry) => entry.source === "/(.*)")
      ?.headers.find((header) => header.key === "Content-Security-Policy")
      ?.value;

    expect(csp).toBeDefined();
    const disallowedHosts = [
      "https://www.googletagmanager.com",
      "https://www.googleadservices.com",
      "https://googleads.g.doubleclick.net",
      "https://ad.doubleclick.net",
    ];

    for (const host of disallowedHosts) {
      expect(cspDirective(csp!, "script-src")).not.toContain(host);
      expect(cspDirective(csp!, "connect-src")).not.toContain(host);
      expect(cspDirective(csp!, "img-src")).not.toContain(host);
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

  it("uses the canonical location prefix for links inside blog content", () => {
    const staleSuburbLinks = blogPosts.flatMap((post) =>
      post.content.flatMap((block) =>
        [...block.matchAll(/\]\((\/suburbs\/[^)]+)\)/g)].map(
          (match) => `${post.slug}: ${match[1]}`,
        ),
      ),
    );

    expect(staleSuburbLinks).toEqual([]);
  });

  it("keeps blog posts free of images, in the sitemap and in the content", () => {
    const blogEntries = sitemap().filter((entry) =>
      entry.url.startsWith(`${SITE_URL}/blog`),
    );

    expect(blogEntries.length).toBeGreaterThan(0);
    for (const entry of blogEntries) {
      expect(entry.images ?? [], entry.url).toEqual([]);
    }

    const contentImages = blogPosts.flatMap((post) =>
      post.content
        .filter((block) => /!\[[^\]]*\]\([^)]+\)/.test(block))
        .map((block) => `${post.slug}: ${block.slice(0, 60)}`),
    );

    expect(contentImages).toEqual([]);
  });
});
