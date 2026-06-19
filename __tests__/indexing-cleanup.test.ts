import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig, { legacyIndexingRedirects } from "../next.config";
import sitemap from "@/app/sitemap";
import { generateStaticParams as generateBlogStaticParams } from "@/app/blog/[slug]/metadata";
import { blogPosts } from "@/data/blog-posts";
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
      const redirect = redirects.find((rule) => rule.source === legacy.source);
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
      ["/blog/cash-for-cars-ipswich-brisbane", "/locations/ipswich"],
      ["/blog/cash-for-cars-logan-brisbane", "/locations/logan"],
      ["/blog/cash-for-cars-sunshine-coast", "/cash-for-cars-brisbane"],
      ["/blog/cash-for-cars-toowoomba", "/cash-for-cars-brisbane"],
      ["/blog/cash-for-cars-gold-coast", "/cash-for-cars-brisbane"],
    ]);

    for (const [source, destination] of expected) {
      expect(redirects.find((rule) => rule.source === source)).toMatchObject({
        destination,
        permanent: true,
      });

      const slug = source.replace("/blog/", "");
      expect(liveSlugs.has(slug)).toBe(false);
      expect(staticSlugs.has(slug)).toBe(false);
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
});
