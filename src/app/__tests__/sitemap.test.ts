import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { blogPosts, indexableBlogPosts } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/site";

const entries = sitemap();
const urls = new Set(entries.map((e) => e.url));

const indexablePost = blogPosts.find((p) => p.isIndexable);
const noindexPost = blogPosts.find((p) => !p.isIndexable);

describe("sitemap.ts — blog post inclusion", () => {
  it("includes every indexable blog post exactly once", () => {
    expect(indexableBlogPosts.length).toBeGreaterThan(0);
    for (const post of indexableBlogPosts) {
      const url = `${SITE_URL}/blog/${post.slug}`;
      expect(urls.has(url)).toBe(true);
    }
    // No duplicate blog URLs — urls is a Set built from entries, so length
    // mismatch would indicate a duplicate was silently deduped.
    const blogUrlsRaw = entries
      .map((e) => e.url)
      .filter((u) => u.startsWith(`${SITE_URL}/blog/`) && !u.includes("/category/"));
    const blogUrlsUnique = new Set(blogUrlsRaw);
    expect(blogUrlsRaw.length).toBe(blogUrlsUnique.size);
  });

  it("excludes noindex blog posts", () => {
    // If the data ever stops containing any noindex posts this assertion
    // is a no-op by construction — prefer a hard guard so we notice.
    expect(noindexPost).toBeDefined();
    const noindexUrl = `${SITE_URL}/blog/${noindexPost!.slug}`;
    expect(urls.has(noindexUrl)).toBe(false);

    // Belt and braces: assert every noindex post in the data set is missing
    // from the sitemap, not just the first one.
    const noindexPosts = blogPosts.filter((p) => !p.isIndexable);
    for (const p of noindexPosts) {
      expect(urls.has(`${SITE_URL}/blog/${p.slug}`)).toBe(false);
    }
  });

  it("uses the post's date as lastModified on blog entries", () => {
    expect(indexablePost).toBeDefined();
    const entry = entries.find(
      (e) => e.url === `${SITE_URL}/blog/${indexablePost!.slug}`,
    );
    expect(entry).toBeDefined();
    expect(entry?.lastModified).toBe(indexablePost!.date);
  });

  it("includes the core static pages (sanity: sitemap isn't empty/broken)", () => {
    expect(urls.has(SITE_URL)).toBe(true);
    expect(urls.has(`${SITE_URL}/blog`)).toBe(true);
  });
});
