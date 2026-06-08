import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";
import {
  blogPostCanonicalUrl,
  buildBlogPostMetadata,
  buildBlogPostSeoProps,
  createBlogPost,
  validateBlogPostSeo,
} from "@/lib/blog-post-template";
import { SITE_URL } from "@/lib/site";

describe("blog post template", () => {
  it("defaults new posts to self-canonical, indexable metadata", () => {
    const post = createBlogPost({
      slug: "example-seo-safe-post",
      title: "Example SEO Safe Blog Post Title",
      metaDescription:
        "This is a realistic meta description for a new Caraway blog post that should be indexable and self canonical by default.",
      excerpt:
        "This is a realistic excerpt for a new Caraway blog post that gives readers enough context before they click through.",
      content: ["Opening paragraph for the post.", "## Section heading"],
      date: "2026-04-24",
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    const metadata = buildBlogPostMetadata(post);

    expect(post.canonicalUrl).toBe(`${SITE_URL}/blog/example-seo-safe-post`);
    expect(metadata.alternates?.canonical).toBe(post.canonicalUrl);
    expect(metadata.robots).toBeUndefined();
  });

  it("keeps every real post inside the shared SEO contract", () => {
    expect(blogPosts.length).toBeGreaterThan(0);

    const failures = blogPosts
      .map((post) => ({
        slug: post.slug,
        errors: validateBlogPostSeo(post),
      }))
      .filter(({ errors }) => errors.length > 0);

    expect(failures).toEqual([]);
  });

  it("keeps materialized posts sorted from newest to oldest", () => {
    const timestamps = blogPosts.map((post) => Date.parse(post.updatedAt || post.date));
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });

  it("emits matching canonical URLs across metadata and BlogPosting schema", () => {
    for (const post of blogPosts) {
      const metadata = buildBlogPostMetadata(post);
      const { articleSchema, breadcrumbItems } = buildBlogPostSeoProps(post);

      expect(post.canonicalUrl).toBe(blogPostCanonicalUrl(post.slug));
      expect(metadata.alternates?.canonical).toBe(post.canonicalUrl);
      expect(metadata.openGraph?.url).toBe(post.canonicalUrl);
      expect(articleSchema.url).toBe(post.canonicalUrl);
      expect(articleSchema.mainEntityOfPage).toBe(post.canonicalUrl);
      expect(breadcrumbItems.at(-1)?.item).toBe(post.canonicalUrl);
    }
  });

  it("does not emit noindex metadata for any live blog post", () => {
    for (const post of blogPosts) {
      const metadata = buildBlogPostMetadata(post);
      expect(metadata.robots).toBeUndefined();
    }
  });
});
