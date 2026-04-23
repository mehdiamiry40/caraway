export interface RawBlogPostEntry {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string[];
  date: string;
  updatedAt?: string;
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
  /** Whether this post should be listed and indexed for organic search surfaces. */
  isIndexable: boolean;
}
