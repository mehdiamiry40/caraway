import { rawBlogPosts } from "@/content/blog/posts";
import type { BlogPost, RawBlogPostEntry } from "@/content/blog/types";
import { createBlogPost } from "@/lib/blog-post";

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

export const blogPosts: BlogPost[] = rawBlogPosts.map(materializePost).sort(sortByNewest);

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

/** Live posts whose relatedServices include the given service slug,
 *  sorted by most recently updated. Used to cross-link service pages to
 *  the blog for internal linking / topical clustering. */
export function getPostsForService(serviceSlug: string, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.relatedServices.includes(serviceSlug))
    .sort((a, b) => dateTime(b) - dateTime(a))
    .slice(0, limit);
}

/** Live posts whose relatedSuburbs include the given suburb slug,
 *  sorted by most recently updated. */
export function getPostsForSuburb(suburbSlug: string, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.relatedSuburbs.includes(suburbSlug))
    .sort((a, b) => dateTime(b) - dateTime(a))
    .slice(0, limit);
}
