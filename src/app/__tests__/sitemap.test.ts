import { describe, expect, it } from "vitest";
import sitemap, {
  buildPagesSitemap,
  buildLocationsSitemap,
  buildBlogSitemap,
} from "@/app/sitemap";
import {
  blogPosts,
  indexableBlogPosts,
  categoryMap,
  getPostsByCategory,
} from "@/data/blog-posts";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { SITE_URL } from "@/lib/site";

/* Collect all entries across every sub-sitemap for coverage checks. */
const pagesEntries = buildPagesSitemap();
const locationsEntries = buildLocationsSitemap();
const blogEntries = buildBlogSitemap();
const allEntries = [...pagesEntries, ...locationsEntries, ...blogEntries];
const allUrls = new Set(allEntries.map((e) => e.url));

const indexablePost = blogPosts.find((p) => p.isIndexable);
const noindexPost = blogPosts.find((p) => !p.isIndexable);

/* -----------------------------------------------------------------------
 * Sitemap index — generateSitemaps produces the right IDs
 * ---------------------------------------------------------------------*/
describe("sitemap index", () => {
  it("routes id 0 to pages sitemap", () => {
    const entries = sitemap({ id: 0 });
    expect(entries.length).toBe(pagesEntries.length);
    expect(entries[0].url).toBe(SITE_URL);
  });

  it("routes id 1 to locations sitemap", () => {
    const entries = sitemap({ id: 1 });
    expect(entries.length).toBe(locationsEntries.length);
    expect(entries[0].url).toContain("/locations/");
  });

  it("routes id 2 to blog sitemap", () => {
    const entries = sitemap({ id: 2 });
    expect(entries.length).toBe(blogEntries.length);
    expect(entries[0].url).toContain("/blog/");
  });

  it("returns empty for unknown id", () => {
    expect(sitemap({ id: 99 })).toEqual([]);
  });
});

/* -----------------------------------------------------------------------
 * Pages sitemap (id 0) — static pages + service pages
 * ---------------------------------------------------------------------*/
describe("sitemap/0 — pages", () => {
  it("includes the core static pages", () => {
    const pageUrls = new Set(pagesEntries.map((e) => e.url));
    const corePaths = [
      "",
      "/about",
      "/contact",
      "/faq",
      "/locations",
      "/blog",
      "/privacy",
      "/terms",
    ];
    for (const path of corePaths) {
      expect(pageUrls.has(`${SITE_URL}${path}`)).toBe(true);
    }
  });

  it("includes every service page", () => {
    const pageUrls = new Set(pagesEntries.map((e) => e.url));
    for (const s of services) {
      expect(pageUrls.has(`${SITE_URL}/${s.slug}`)).toBe(true);
    }
  });

  it("does not use today as lastModified for static pages", () => {
    const today = new Date().toISOString().split("T")[0];
    const staticEntry = pagesEntries.find(
      (e) => e.url === `${SITE_URL}/about`,
    );
    expect(staticEntry).toBeDefined();
    expect(staticEntry?.lastModified).not.toBe(today);
  });

  it("does not contain blog post or location URLs", () => {
    for (const e of pagesEntries) {
      expect(e.url).not.toMatch(/\/locations\/[^/]+$/);
      expect(e.url).not.toMatch(/\/blog\/[^/]+$/);
    }
  });
});

/* -----------------------------------------------------------------------
 * Locations sitemap (id 1) — suburb pages
 * ---------------------------------------------------------------------*/
describe("sitemap/1 — locations", () => {
  it("includes every suburb page", () => {
    const locUrls = new Set(locationsEntries.map((e) => e.url));
    for (const s of suburbs) {
      expect(locUrls.has(`${SITE_URL}/locations/${s.slug}`)).toBe(true);
    }
  });

  it("contains only location URLs", () => {
    for (const e of locationsEntries) {
      expect(e.url).toContain("/locations/");
    }
  });
});

/* -----------------------------------------------------------------------
 * Blog sitemap (id 2) — blog posts + category pages
 * ---------------------------------------------------------------------*/
describe("sitemap/2 — blog", () => {
  it("includes every indexable blog post exactly once", () => {
    expect(indexableBlogPosts.length).toBeGreaterThan(0);
    const blogUrls = blogEntries.map((e) => e.url);
    for (const post of indexableBlogPosts) {
      const url = `${SITE_URL}/blog/${post.slug}`;
      expect(blogUrls).toContain(url);
    }
    const postUrls = blogUrls.filter(
      (u) => u.startsWith(`${SITE_URL}/blog/`) && !u.includes("/category/"),
    );
    expect(postUrls.length).toBe(new Set(postUrls).size);
  });

  it("excludes noindex blog posts", () => {
    expect(noindexPost).toBeDefined();
    const blogUrls = new Set(blogEntries.map((e) => e.url));
    const noindexPosts = blogPosts.filter((p) => !p.isIndexable);
    for (const p of noindexPosts) {
      expect(blogUrls.has(`${SITE_URL}/blog/${p.slug}`)).toBe(false);
    }
  });

  it("uses updatedAt (falling back to date) as lastModified on blog entries", () => {
    expect(indexablePost).toBeDefined();
    const entry = blogEntries.find(
      (e) => e.url === `${SITE_URL}/blog/${indexablePost!.slug}`,
    );
    expect(entry).toBeDefined();
    expect(entry?.lastModified).toBe(
      indexablePost!.updatedAt || indexablePost!.date,
    );
  });

  it("has a category entry for every category with indexable posts", () => {
    const blogUrls = new Set(blogEntries.map((e) => e.url));
    const categorySlugs = Object.keys(categoryMap);
    expect(categorySlugs.length).toBeGreaterThan(0);
    for (const slug of categorySlugs) {
      expect(blogUrls.has(`${SITE_URL}/blog/category/${slug}`)).toBe(true);
    }
  });

  it("uses per-category latest date, not a global date", () => {
    const categorySlugs = Object.keys(categoryMap);
    for (const slug of categorySlugs) {
      const postsInCat = getPostsByCategory(slug);
      const expectedDate = postsInCat.reduce(
        (latest, p) => {
          const stamp = p.updatedAt || p.date;
          return stamp > latest ? stamp : latest;
        },
        "2025-01-01",
      );
      const entry = blogEntries.find(
        (e) => e.url === `${SITE_URL}/blog/category/${slug}`,
      );
      expect(entry).toBeDefined();
      expect(entry?.lastModified).toBe(expectedDate);
    }
  });
});

/* -----------------------------------------------------------------------
 * Cross-sitemap — no URL appears in more than one sub-sitemap
 * ---------------------------------------------------------------------*/
describe("sitemap — cross-sitemap integrity", () => {
  it("has no duplicate URLs across sub-sitemaps", () => {
    const allUrlsList = allEntries.map((e) => e.url);
    expect(allUrlsList.length).toBe(allUrls.size);
  });

  it("covers all expected content", () => {
    expect(allUrls.has(SITE_URL)).toBe(true);
    expect(allUrls.has(`${SITE_URL}/blog`)).toBe(true);
    expect(allUrls.has(`${SITE_URL}/locations`)).toBe(true);
  });
});
