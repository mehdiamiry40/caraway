import { describe, expect, it } from "vitest";
import { getSmartRelatedPosts } from "@/lib/related-posts";
import { blogPosts, getPostsForService } from "@/data/blog-posts";
import { RETIRED_BLOG_SLUGS } from "@/lib/blog-post-template";

describe("getPostsForService", () => {
  it("returns the cash-for-cars cornerstone guides in their curated order", () => {
    expect(
      getPostsForService("cash-for-cars-brisbane").map((post) => post.slug),
    ).toEqual([
      "how-to-sell-your-car-for-cash-brisbane",
      "how-to-get-the-best-cash-for-cars-price-brisbane",
      "how-much-is-my-car-worth-brisbane",
    ]);
  });

  it("returns the car-removal cornerstone guides in their curated order", () => {
    expect(
      getPostsForService("car-removal-brisbane").map((post) => post.slug),
    ).toEqual([
      "tow-truck-cost-brisbane",
      "preparing-your-car-for-pickup",
      "sell-non-running-car-brisbane",
    ]);
  });

  it("keeps recency ordering as the fallback for other services", () => {
    const serviceSlug = "sell-my-car-brisbane";
    const expectedSlugs = blogPosts
      .filter((post) => post.relatedServices.includes(serviceSlug))
      .slice(0, 3)
      .map((post) => post.slug);

    expect(getPostsForService(serviceSlug).map((post) => post.slug)).toEqual(
      expectedSlugs,
    );
  });

  it("gives the retained HiLux page a contextual supporting guide", () => {
    expect(
      getPostsForService("sell-toyota-hilux-brisbane").map(
        (post) => post.slug,
      ),
    ).toContain("sell-non-running-car-brisbane");
  });

  it("does not return retired blog slugs from curated or fallback results", () => {
    for (const serviceSlug of [
      "cash-for-cars-brisbane",
      "car-removal-brisbane",
      "sell-my-car-brisbane",
    ]) {
      const resultSlugs = new Set(
        getPostsForService(serviceSlug, 100).map((post) => post.slug),
      );

      for (const retiredSlug of RETIRED_BLOG_SLUGS) {
        expect(resultSlugs.has(retiredSlug)).toBe(false);
      }
    }
  });
});

describe("getSmartRelatedPosts", () => {
  it("returns at most `limit` posts and defaults to 3", () => {
    const defaultResult = getSmartRelatedPosts("trade-in-vs-cash-for-cars-brisbane");
    expect(defaultResult.length).toBeLessThanOrEqual(3);
    expect(defaultResult.length).toBeGreaterThan(0);

    const customResult = getSmartRelatedPosts("trade-in-vs-cash-for-cars-brisbane", 5);
    expect(customResult.length).toBeLessThanOrEqual(5);
    expect(customResult.length).toBeGreaterThanOrEqual(defaultResult.length);
  });

  it("never includes the current post", () => {
    const slug = "sell-flood-damaged-car-brisbane";
    const result = getSmartRelatedPosts(slug, 10);
    expect(result.find((p) => p.slug === slug)).toBeUndefined();
  });

  it("never includes retired posts", () => {
    const result = getSmartRelatedPosts("trade-in-vs-cash-for-cars-brisbane", 50);
    for (const retired of RETIRED_BLOG_SLUGS) {
      expect(result.find((p) => p.slug === retired)).toBeUndefined();
      expect(blogPosts.find((p) => p.slug === retired)).toBeUndefined();
    }
  });

  it("ranks same-category posts ahead of different-category posts", () => {
    const currentSlug = "sell-flood-damaged-car-brisbane";
    const current = blogPosts.find((p) => p.slug === currentSlug);
    expect(current).toBeDefined();

    const result = getSmartRelatedPosts(currentSlug, 4);
    expect(result.length).toBeGreaterThan(0);

    const sameCategoryCount = blogPosts.filter(
      (p) => p.slug !== currentSlug && p.category === current!.category,
    ).length;
    const expectedSameInTop = Math.min(sameCategoryCount, result.length);

    const sameInTop = result
      .slice(0, expectedSameInTop)
      .filter((p) => p.category === current!.category).length;

    expect(sameInTop).toBe(expectedSameInTop);
  });

  it("returns top-ranked posts safely for an unknown current slug", () => {
    const result = getSmartRelatedPosts("totally-unknown-slug-that-does-not-exist", 3);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    for (const retired of RETIRED_BLOG_SLUGS) {
      expect(result.find((p) => p.slug === retired)).toBeUndefined();
    }
  });
});
