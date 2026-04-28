import type { BlogPost, RawBlogPostEntry } from "@/content/blog/types";
import { SITE_URL } from "@/lib/site";

type BlogPostOptions = {
  isIndexable?: boolean;
};

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

export function blogPostCanonicalUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

export function createBlogPost(
  post: RawBlogPostEntry,
  options: BlogPostOptions = {},
): BlogPost {
  return {
    ...post,
    updatedAt: post.updatedAt ?? post.date,
    canonicalUrl: blogPostCanonicalUrl(post.slug),
    readTime: calcReadTime(post.content),
    isIndexable: options.isIndexable ?? true,
  };
}
