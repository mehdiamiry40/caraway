export interface BlogSource {
  title: string;
  url: string;
}

/**
 * Blog posts are text-only: no hero artwork, no per-post thumbnails, and no
 * images inside `content`. Social previews and Article structured data use the
 * site-wide card in `blog-post-template.ts`, so new posts need no image fields.
 */
export interface RawBlogPostEntry {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  author?: string;
  content: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  date: string;
  updatedAt?: string;
  /** Date regulated or time-sensitive claims were reviewed against sources. */
  reviewedAt?: string;
  /** Primary sources used for regulated or time-sensitive claims. */
  sources?: BlogSource[];
  category: string;
  relatedServices: string[];
  relatedSuburbs: string[];
}

export interface BlogPost extends RawBlogPostEntry {
  /** Last-updated date (ISO 8601). Defaults to `date` when not overridden. */
  updatedAt: string;
  /** Fully-qualified, self-canonical URL for the post. */
  canonicalUrl: string;
  readTime: string;
}
