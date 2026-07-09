import { blogPosts, type BlogPost } from "@/data/blog-posts";

/** Posts per blog index page. Page 1 renders its first post as the featured
 *  card; 25 keeps the remaining 24 evenly divisible across the 2- and
 *  3-column card grids. */
export const BLOG_PAGE_SIZE = 25;

export function blogTotalPages(): number {
  return Math.max(1, Math.ceil(blogPosts.length / BLOG_PAGE_SIZE));
}

/** Newest-first slice of posts for a 1-indexed blog page. */
export function blogPagePosts(page: number): BlogPost[] {
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return blogPosts.slice(start, start + BLOG_PAGE_SIZE);
}

/** Canonical path for a blog index page — page 1 lives at /blog itself. */
export function blogPageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}
