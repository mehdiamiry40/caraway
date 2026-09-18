import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog/types";
import { isRetiredBlogSlug } from "@/lib/blog-consolidation";
import {
  BLOG_FAQ_ROLLOUT_DATE,
  getRenderableBlogFaqs,
  getRenderableBlogFaqTextBlocks,
} from "@/lib/blog-faqs";
import { blogPostCanonicalUrl, calcWordCount } from "@/lib/blog-post";
import { publisherSchema } from "@/lib/json-ld-schemas";
import { SITE_URL } from "@/lib/site";

export { blogPostCanonicalUrl, calcWordCount, createBlogPost } from "@/lib/blog-post";

const BLOG_AUTHOR = {
  name: "Caraway",
  url: SITE_URL,
} as const;

export function buildMissingBlogPostMetadata(): Metadata {
  return {
    title: { absolute: "Post not found — Caraway" },
    robots: { index: false, follow: false },
    openGraph: null,
    twitter: null,
  };
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: post.canonicalUrl,
      languages: {
        "en-AU": post.canonicalUrl,
      },
    },
    openGraph: {
      url: post.canonicalUrl,
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [`${SITE_URL}/about`],
      section: post.category,
      tags: [post.category],
      locale: "en_AU",
      siteName: "Caraway",
      // No images: posts are text-only, so shared links preview as text.
      // Declaring openGraph here also stops the root layout's card being
      // inherited — Next replaces the parent object rather than merging it.
    },
    twitter: {
      // "summary", not "summary_large_image": there is no image to feature.
      card: "summary",
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export function plainBlogPostContent(post: BlogPost): string {
  return [
    ...post.content,
    ...getRenderableBlogFaqTextBlocks(post),
  ]
    .map((p) => p.replace(/^#{1,6}\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildBlogPostSeoProps(post: BlogPost) {
  const plainContent = plainBlogPostContent(post);
  const wordCount = calcWordCount(plainContent);
  const authorName = post.author ?? BLOG_AUTHOR.name;
  const authorSchema =
    authorName === publisherSchema.name || authorName === "Caraway"
      ? {
          "@type": "Organization",
          "@id": publisherSchema["@id"],
          name: authorName,
          url: SITE_URL,
        }
      : {
          "@type": "Person",
          name: authorName,
          url: BLOG_AUTHOR.url,
        };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${post.canonicalUrl}#article`,
    url: post.canonicalUrl,
    mainEntityOfPage: post.canonicalUrl,
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.updatedAt,
    wordCount,
    author: authorSchema,
    publisher: publisherSchema,
    ...(post.sources?.length
      ? { citation: post.sources.map((source) => source.url) }
      : {}),
    isAccessibleForFree: true,
  };

  const breadcrumbItems = [
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Blog", item: `${SITE_URL}/blog` },
    { name: post.title, item: post.canonicalUrl },
  ];

  return { articleSchema, breadcrumbItems, wordCount, plainContent };
}

export function validateBlogPostSeo(post: BlogPost): string[] {
  const errors: string[] = [];
  const expectedCanonical = blogPostCanonicalUrl(post.slug);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    errors.push("slug must be lowercase kebab-case without slashes");
  }

  if (isRetiredBlogSlug(post.slug)) {
    errors.push("slug is retired and must stay redirected, not republished");
  }

  if (post.canonicalUrl !== expectedCanonical) {
    errors.push(`canonicalUrl must be ${expectedCanonical}`);
  }

  if (post.title.trim() !== post.title || post.title.length < 20 || post.title.length > 70) {
    errors.push("title must be trimmed and between 20 and 70 characters");
  }

  if (
    post.metaDescription.trim() !== post.metaDescription ||
    post.metaDescription.length < 100 ||
    post.metaDescription.length > 185
  ) {
    errors.push("metaDescription must be trimmed and between 100 and 185 characters");
  }

  if (post.excerpt.trim() !== post.excerpt || post.excerpt.length < 80) {
    errors.push("excerpt must be trimmed and at least 80 characters");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
    errors.push("date must be ISO yyyy-mm-dd");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.updatedAt)) {
    errors.push("updatedAt must be ISO yyyy-mm-dd");
  }

  if (Date.parse(post.updatedAt) < Date.parse(post.date)) {
    errors.push("updatedAt must not be earlier than date");
  }

  if (post.reviewedAt && !/^\d{4}-\d{2}-\d{2}$/.test(post.reviewedAt)) {
    errors.push("reviewedAt must be ISO yyyy-mm-dd");
  }

  const reviewDoesNotPredatePublication =
    !post.reviewedAt || Date.parse(post.reviewedAt) >= Date.parse(post.date);
  const isFaqVisibilityRollout =
    post.updatedAt === BLOG_FAQ_ROLLOUT_DATE &&
    getRenderableBlogFaqs(post).length > 0 &&
    reviewDoesNotPredatePublication;
  if (
    post.reviewedAt &&
    Date.parse(post.reviewedAt) < Date.parse(post.updatedAt) &&
    !isFaqVisibilityRollout
  ) {
    errors.push("reviewedAt must not be earlier than updatedAt");
  }

  if (post.sources?.length && !post.reviewedAt) {
    errors.push("reviewedAt is required when sources are provided");
  }

  if (post.reviewedAt && !post.sources?.length) {
    errors.push("sources are required when reviewedAt is provided");
  }

  for (const source of post.sources ?? []) {
    if (!source.title.trim()) errors.push("source title is required");
    try {
      const url = new URL(source.url);
      if (url.protocol !== "https:") {
        errors.push("source URLs must use HTTPS");
      }
    } catch {
      errors.push("source URL must be valid");
    }
  }

  if (!post.category.trim()) {
    errors.push("category is required");
  }

  if (!Array.isArray(post.content) || post.content.filter(Boolean).length < 2) {
    errors.push("content must include multiple non-empty blocks");
  }

  return errors;
}
