import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  blogPosts,
  categoryMap,
  getPostsByCategory,
} from "@/data/blog-posts";
import { getServicePreferredImage, services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { RETIRED_BLOG_SLUGS } from "@/lib/blog-consolidation";
import {
  ABOUT_CONTENT_UPDATED,
  FAQ_CONTENT_UPDATED,
  HOME_CONTENT_UPDATED,
  LEGAL_DATE_ISO,
  SERVICES_CONTENT_UPDATED,
  SITE_URL,
} from "@/lib/site";

const entries = sitemap();
const urls = new Set(entries.map((e) => e.url));

const examplePost = blogPosts[0];

/* -----------------------------------------------------------------------
 * Blog post inclusion
 * ---------------------------------------------------------------------*/
describe("sitemap.ts — blog post inclusion", () => {
  it("includes every live blog post exactly once", () => {
    expect(blogPosts.length).toBeGreaterThan(0);
    for (const post of blogPosts) {
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

  it("excludes retired blog URLs that now consolidate elsewhere", () => {
    for (const slug of RETIRED_BLOG_SLUGS) {
      expect(urls.has(`${SITE_URL}/blog/${slug}`)).toBe(false);
    }
  });

  it("uses updatedAt (falling back to date) as lastModified on blog entries", () => {
    expect(examplePost).toBeDefined();
    const entry = entries.find(
      (e) => e.url === examplePost!.canonicalUrl,
    );
    expect(entry).toBeDefined();
    expect(entry?.lastModified).toBe(
      examplePost!.updatedAt || examplePost!.date,
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
  it("uses the deployed apex host for canonical sitemap URLs", () => {
    expect(SITE_URL).toBe("https://caraway.au");
  });

  it("includes the core static pages", () => {
    const corePaths = [
      "/",
      "/about",
      "/contact",
      "/faq",
      "/how-it-works",
      "/services",
      "/locations",
      "/blog",
      "/privacy",
      "/terms",
    ];
    for (const path of corePaths) {
      expect(urls.has(`${SITE_URL}${path}`)).toBe(true);
    }
  });

  it("uses the homepage's material rewrite date", () => {
    expect(
      entries.find((entry) => entry.url === `${SITE_URL}/`)?.lastModified,
    ).toBe(HOME_CONTENT_UPDATED);
  });

  it("uses the service hub's material consolidation date", () => {
    expect(
      entries.find((entry) => entry.url === `${SITE_URL}/services`)
        ?.lastModified,
    ).toBe(SERVICES_CONTENT_UPDATED);
  });

  it("includes every service page", () => {
    for (const s of services) {
      expect(urls.has(`${SITE_URL}/${s.slug}`)).toBe(true);
    }
  });

  it("uses page-specific lastModified dates for rewritten services", () => {
    for (const service of services.filter((item) => item.updatedAt)) {
      const entry = entries.find(
        (item) => item.url === `${SITE_URL}/${service.slug}`,
      );
      expect(entry?.lastModified).toBe(service.updatedAt);
    }
  });

  it("publishes each primary target's visible preferred image", () => {
    for (const slug of [
      "cash-for-cars-brisbane",
      "car-removal-brisbane",
    ]) {
      const service = services.find((item) => item.slug === slug);
      expect(service).toBeDefined();
      if (!service) continue;

      const image = getServicePreferredImage(service);
      expect(image).toBeDefined();
      expect(
        entries.find((item) => item.url === `${SITE_URL}/${slug}`)?.images,
      ).toEqual(image ? [`${SITE_URL}${image.src}`] : undefined);
    }
  });

  it("includes every suburb page", () => {
    for (const s of suburbs) {
      expect(urls.has(`${SITE_URL}/locations/${s.slug}`)).toBe(true);
    }
  });

  it("uses the declared material-update date for the About page", () => {
    const staticEntry = entries.find((e) => e.url === `${SITE_URL}/about`);
    expect(staticEntry).toBeDefined();
    expect(staticEntry?.lastModified).toBe(ABOUT_CONTENT_UPDATED);
  });

  it("uses the declared material-update date for the FAQ page", () => {
    const staticEntry = entries.find((e) => e.url === `${SITE_URL}/faq`);
    expect(staticEntry).toBeDefined();
    expect(staticEntry?.lastModified).toBe(FAQ_CONTENT_UPDATED);
  });

  it("uses the stated legal-update dates for legal-page lastModified", () => {
    const privacyEntry = entries.find((e) => e.url === `${SITE_URL}/privacy`);
    const termsEntry = entries.find((e) => e.url === `${SITE_URL}/terms`);

    expect(privacyEntry?.lastModified).toBe(LEGAL_DATE_ISO.privacyLastUpdated);
    expect(termsEntry?.lastModified).toBe(LEGAL_DATE_ISO.termsLastUpdated);
  });
});
