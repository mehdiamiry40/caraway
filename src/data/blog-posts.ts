import { rawBlogPosts } from "@/content/blog/posts";
import type { BlogPost, RawBlogPostEntry } from "@/content/blog/types";
import { createBlogPost } from "@/lib/blog-post-template";

export type { BlogPost };

/** Get related posts by matching category, excluding the current post. */
export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const sameCategory = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.isIndexable && p.category === current.category
  );
  const others = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.isIndexable && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

const noindexPostSlugs = new Set([
  "cash-for-cars-sunshine-coast",
  "cash-for-cars-toowoomba",
  "cash-for-cars-gold-coast",
  "cash-for-cars-redcliffe-brisbane",
  "cash-for-cars-ipswich-brisbane",
  "cash-for-cars-logan-brisbane",
]);

function materializePost(post: RawBlogPostEntry): BlogPost {
  return createBlogPost(post, { isIndexable: !noindexPostSlugs.has(post.slug) });
}

export const blogPosts: BlogPost[] = rawBlogPosts.map(materializePost);

export const indexableBlogPosts = blogPosts.filter((post) => post.isIndexable);

/** Convert a category label to a URL-safe slug. */
export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/** Map of slug → display label for all categories with indexable posts. */
export const categoryMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const post of indexableBlogPosts) {
    const slug = categorySlug(post.category);
    if (!map[slug]) map[slug] = post.category;
  }
  return map;
})();

/** Get all indexable posts in a given category (by slug). */
export function getPostsByCategory(slug: string): BlogPost[] {
  return indexableBlogPosts.filter((p) => categorySlug(p.category) === slug);
}

/** Indexable posts whose relatedServices include the given service slug,
 *  sorted by most recently updated. Used to cross-link service pages to
 *  the blog for internal linking / topical clustering. */
export function getPostsForService(serviceSlug: string, limit = 3): BlogPost[] {
  return indexableBlogPosts
    .filter((p) => p.relatedServices.includes(serviceSlug))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limit);
}

/** Indexable posts whose relatedSuburbs include the given suburb slug,
 *  sorted by most recently updated. */
export function getPostsForSuburb(suburbSlug: string, limit = 3): BlogPost[] {
  return indexableBlogPosts
    .filter((p) => p.relatedSuburbs.includes(suburbSlug))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limit);
}
