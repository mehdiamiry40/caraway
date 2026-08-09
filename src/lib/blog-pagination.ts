import { blogPosts } from "@/data/blog-posts";

/** Grid posts per page; the newest article is featured separately on page 1. */
export const BLOG_PAGE_SIZE = 14;

export function blogPageCount(): number {
  return Math.max(1, Math.ceil((blogPosts.length - 1) / BLOG_PAGE_SIZE));
}
