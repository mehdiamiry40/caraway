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
