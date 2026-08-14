import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";

/**
 * Posts whose published modification date currently outruns the date their
 * regulated claims were last checked against primary sources.
 *
 * `applyBlogFaqRolloutDate` moved these posts' effective `updatedAt` to the FAQ
 * visibility rollout date, and `validateBlogPostSeo` exempts exactly that case
 * from the rule that a review must cover the modification it describes. The
 * exemption is defensible — the FAQ answers were authored and reviewed earlier
 * and only became visible — but it is an exception to the repo's own content
 * governance, applied in bulk to Queensland legal guidance.
 *
 * This list makes that debt explicit and ratchets it in one direction. Clearing
 * an entry means genuinely rechecking the post's sources and advancing its
 * `reviewedAt`, then deleting the slug here. Nothing may be added: a new post
 * in this state is a governance regression, not a rollout artefact.
 */
const KNOWN_REVIEW_DEBT = [
  "cancel-car-insurance-after-selling-car-qld",
  "car-defect-notice-qld",
  "cash-for-cars-vs-wreckers-brisbane",
  "delete-personal-data-from-car-before-selling",
  "how-much-is-my-car-worth-brisbane",
  "how-to-avoid-cash-for-cars-scams-brisbane",
  "how-to-get-the-best-cash-for-cars-price-brisbane",
  "how-to-sell-a-car-with-finance-owing-qld",
  "park-unregistered-car-street-qld",
  "sell-4wd-brisbane",
  "sell-car-for-parts-brisbane",
  "sell-deceased-estate-car-qld",
  "sell-high-kilometre-car-brisbane",
  "sell-interstate-registered-car-brisbane",
  "sell-motorbike-brisbane",
  "sell-van-brisbane",
  "take-car-to-tip-brisbane",
  "tow-truck-cost-brisbane",
  "unpaid-tolls-selling-car-qld",
] as const;

/** Slugs whose published modification date is newer than their last review. */
function postsWithReviewDebt(): string[] {
  return blogPosts
    .filter((post) => {
      const updatedAt = post.updatedAt ?? post.date;
      return Boolean(post.reviewedAt) && post.reviewedAt! < updatedAt;
    })
    .map((post) => post.slug)
    .sort();
}

describe("regulated-claim review debt", () => {
  it("does not let a new post publish a modification date its review does not cover", () => {
    const unexpected = postsWithReviewDebt().filter(
      (slug) => !KNOWN_REVIEW_DEBT.includes(slug as never),
    );

    expect(
      unexpected,
      `These posts advertise a dateModified newer than their reviewedAt without ` +
        `being part of the recorded FAQ-rollout debt. Recheck the post's primary ` +
        `sources and advance reviewedAt rather than widening the exemption.`,
    ).toEqual([]);
  });

  it("keeps the recorded debt list free of entries that are already resolved", () => {
    const outstanding = new Set(postsWithReviewDebt());
    const stale = KNOWN_REVIEW_DEBT.filter((slug) => !outstanding.has(slug));

    expect(
      stale,
      `These slugs no longer carry review debt. Delete them from ` +
        `KNOWN_REVIEW_DEBT so the list keeps shrinking and stays meaningful.`,
    ).toEqual([]);
  });

  it("still requires every post carrying sources to record a review date", () => {
    const missing = blogPosts
      .filter((post) => post.sources?.length && !post.reviewedAt)
      .map((post) => post.slug);

    expect(missing).toEqual([]);
  });
});
