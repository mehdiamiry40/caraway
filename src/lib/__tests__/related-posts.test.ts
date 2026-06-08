import { describe, expect, it } from "vitest";
import { getSmartRelatedPosts } from "@/lib/related-posts";
import { blogPosts } from "@/data/blog-posts";

const RETIRED_SLUGS = [
  "cash-for-cars-sunshine-coast",
  "cash-for-cars-toowoomba",
  "cash-for-cars-gold-coast",
  "cash-for-cars-redcliffe-brisbane",
  "cash-for-cars-ipswich-brisbane",
  "cash-for-cars-logan-brisbane",
];

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
    for (const retired of RETIRED_SLUGS) {
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
    for (const retired of RETIRED_SLUGS) {
      expect(result.find((p) => p.slug === retired)).toBeUndefined();
    }
  });
});
