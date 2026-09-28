import { blogPosts } from "@/data/blog-posts";

/** Archive pages beyond this limit are retired Search Console aliases. */
export const BLOG_ARCHIVE_PAGE_LIMIT = 3;

/** Grid posts per page; the newest article is featured separately on page 1.
 *  Archive capacity is 1 + BLOG_ARCHIVE_PAGE_LIMIT * BLOG_PAGE_SIZE, because
 *  archive pages past the limit permanently redirect to the blog index. Raise
 *  this rather than the page limit when new posts outgrow the archive. */
export const BLOG_PAGE_SIZE = 25;

export function blogPageCount(): number {
  return Math.max(1, Math.ceil((blogPosts.length - 1) / BLOG_PAGE_SIZE));
}
