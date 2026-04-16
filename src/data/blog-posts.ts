import { rawBlogPosts } from "@/content/blog/posts";
import type { RawBlogPostEntry } from "@/content/blog/types";

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string[];
  /** Original publication date (ISO 8601). */
  date: string;
  /** Last-updated date (ISO 8601). Defaults to `date` when not overridden. */
  updatedAt: string;
  readTime: string;
  category: string;
  /** Service page slugs to link to from blog posts for internal linking. */
  relatedServices: string[];
  /** Suburb page slugs to link to from blog posts for internal linking. */
  relatedSuburbs: string[];
  /** Whether this post should be listed and indexed for organic search surfaces. */
  isIndexable: boolean;
}

/** Count words in a plain-text string by splitting on whitespace. */
export function calcWordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

/** Calculate reading time from content paragraphs (~200 WPM average). */
function calcReadTime(content: string[]): string {
  const words = calcWordCount(content.join(" "));
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

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
  return {
    ...post,
    updatedAt: post.updatedAt ?? post.date,
    readTime: calcReadTime(post.content),
    isIndexable: !noindexPostSlugs.has(post.slug),
  };
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
