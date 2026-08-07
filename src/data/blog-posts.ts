import { rawBlogPosts } from "@/content/blog/posts";
import type { BlogPost, RawBlogPostEntry } from "@/content/blog/types";
import { isRetiredBlogSlug } from "@/lib/blog-consolidation";
import { createBlogPost } from "@/lib/blog-post";
import { canonicalServiceSlug } from "@/lib/service-consolidation";

export type { BlogPost };

/** Get related posts by matching category, excluding the current post. */
export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const sameCategory = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  );
  const others = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

function materializePost(post: RawBlogPostEntry): BlogPost {
  return createBlogPost(post);
}

function dateTime(post: BlogPost): number {
  const parsed = Date.parse(post.updatedAt || post.date);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortByNewest(a: BlogPost, b: BlogPost): number {
  return dateTime(b) - dateTime(a);
}

const accidentallyRepublishedPost = rawBlogPosts.find((post) =>
  isRetiredBlogSlug(post.slug),
);

if (accidentallyRepublishedPost) {
  throw new Error(
    `Retired blog post must stay redirected: ${accidentallyRepublishedPost.slug}`,
  );
}

export const blogPosts: BlogPost[] = rawBlogPosts
  .map(materializePost)
  .sort(sortByNewest);

const serviceCornerstoneSlugs: Readonly<
  Partial<Record<string, readonly string[]>>
> = {
  "cash-for-cars-brisbane": [
    "how-to-sell-your-car-for-cash-brisbane",
    "how-to-get-the-best-cash-for-cars-price-brisbane",
    "how-much-is-my-car-worth-brisbane",
  ],
  "car-removal-brisbane": [
    "tow-truck-cost-brisbane",
    "preparing-your-car-for-pickup",
    "sell-non-running-car-brisbane",
  ],
};

/** Convert a category label to a URL-safe slug. */
export function categorySlug(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Map of slug → display label for all categories with live posts. */
export const categoryMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const post of blogPosts) {
    const slug = categorySlug(post.category);
    if (!map[slug]) map[slug] = post.category;
  }
  return map;
})();

/** Get all live posts in a given category (by slug). */
export function getPostsByCategory(slug: string): BlogPost[] {
  return blogPosts.filter((p) => categorySlug(p.category) === slug);
}

/** Live posts whose relatedServices include the given service slug.
 *  Primary Brisbane service pages lead with stable cornerstone guides;
 *  other services retain the most-recently-updated fallback. */
export function getPostsForService(serviceSlug: string, limit = 3): BlogPost[] {
  const recentPosts = blogPosts
    .filter((p) =>
      p.relatedServices.map(canonicalServiceSlug).includes(serviceSlug),
    )
    .sort((a, b) => dateTime(b) - dateTime(a));
  const cornerstoneSlugs = serviceCornerstoneSlugs[serviceSlug];

  if (!cornerstoneSlugs) return recentPosts.slice(0, limit);

  const cornerstonePosts = cornerstoneSlugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter(
      (post): post is BlogPost =>
        post !== undefined &&
        post.relatedServices.map(canonicalServiceSlug).includes(serviceSlug),
    );
  const cornerstoneSet = new Set(cornerstonePosts.map((post) => post.slug));

  return [
    ...cornerstonePosts,
    ...recentPosts.filter((post) => !cornerstoneSet.has(post.slug)),
  ].slice(0, limit);
}

/** Live posts whose relatedSuburbs include the given suburb slug,
 *  sorted by most recently updated. */
export function getPostsForSuburb(suburbSlug: string, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.relatedSuburbs.includes(suburbSlug))
    .sort((a, b) => dateTime(b) - dateTime(a))
    .slice(0, limit);
}
