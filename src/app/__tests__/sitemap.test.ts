import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  blogPosts,
  indexableBlogPosts,
  categoryMap,
  getPostsByCategory,
} from "@/data/blog-posts";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { SITE_URL } from "@/lib/site";

const entries = sitemap();
const urls = new Set(entries.map((e) => e.url));

const indexablePost = blogPosts.find((p) => p.isIndexable);
const noindexPost = blogPosts.find((p) => !p.isIndexable);

/* -----------------------------------------------------------------------
 * Blog post inclusion
 * ---------------------------------------------------------------------*/
describe("sitemap.ts — blog post inclusion", () => {
  it("includes every indexable blog post exactly once", () => {
    expect(indexableBlogPosts.length).toBeGreaterThan(0);
    for (const post of indexableBlogPosts) {
      expect(urls.has(post.canonicalUrl)).toBe(true);
    }
    const blogUrlsRaw = entries
      .map((e) => e.url)
      .filter(
        (u) =>
          u.startsWith(`${SITE_URL}/blog/`) && !u.includes("/category/"),
      );
    const blogUrlsUnique = new Set(blogUrlsRaw);
    expect(blogUrlsRaw.length).toBe(blogUrlsUnique.size);
  });

  it("excludes noindex blog posts", () => {
    expect(noindexPost).toBeDefined();
    expect(urls.has(noindexPost!.canonicalUrl)).toBe(false);

    const noindexPosts = blogPosts.filter((p) => !p.isIndexable);
    for (const p of noindexPosts) {
      expect(urls.has(p.canonicalUrl)).toBe(false);
    }
  });

  it("uses updatedAt (falling back to date) as lastModified on blog entries", () => {
    expect(indexablePost).toBeDefined();
    const entry = entries.find(
      (e) => e.url === indexablePost!.canonicalUrl,
    );
    expect(entry).toBeDefined();
    expect(entry?.lastModified).toBe(
      indexablePost!.updatedAt || indexablePost!.date,
    );
  });
});

/* -----------------------------------------------------------------------
 * Category page accuracy
 * ---------------------------------------------------------------------*/
describe("sitemap.ts — category pages", () => {
  it("has a category entry for every category with indexable posts", () => {
    const categorySlugs = Object.keys(categoryMap);
    expect(categorySlugs.length).toBeGreaterThan(0);
    for (const slug of categorySlugs) {
      expect(urls.has(`${SITE_URL}/blog/category/${slug}`)).toBe(true);
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
      const entry = entries.find(
        (e) => e.url === `${SITE_URL}/blog/category/${slug}`,
      );
      expect(entry).toBeDefined();
      expect(entry?.lastModified).toBe(expectedDate);
    }
  });
});

/* -----------------------------------------------------------------------
 * Page coverage — every route type is represented
 * ---------------------------------------------------------------------*/
describe("sitemap.ts — page coverage", () => {
  it("uses the deployed www host for canonical sitemap URLs", () => {
    expect(SITE_URL).toBe("https://www.caraway.au");
  });

  it("includes the core static pages", () => {
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
      expect(urls.has(`${SITE_URL}${path}`)).toBe(true);
    }
  });

  it("includes every service page", () => {
    for (const s of services) {
      expect(urls.has(`${SITE_URL}/${s.slug}`)).toBe(true);
    }
  });

  it("includes every suburb page", () => {
    for (const s of suburbs) {
      expect(urls.has(`${SITE_URL}/locations/${s.slug}`)).toBe(true);
    }
  });

  it("does not use today as lastModified for static pages", () => {
    const today = new Date().toISOString().split("T")[0];
    const staticEntry = entries.find((e) => e.url === `${SITE_URL}/about`);
    expect(staticEntry).toBeDefined();
    expect(staticEntry?.lastModified).not.toBe(today);
  });

  it("uses the first day of the stated month for legal-page lastModified dates", () => {
    const privacyEntry = entries.find((e) => e.url === `${SITE_URL}/privacy`);
    const termsEntry = entries.find((e) => e.url === `${SITE_URL}/terms`);

    expect(privacyEntry?.lastModified).toBe("2026-04-01");
    expect(termsEntry?.lastModified).toBe("2026-03-01");
  });
});
