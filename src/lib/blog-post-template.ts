import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog/types";
import { blogPostCanonicalUrl, calcWordCount } from "@/lib/blog-post";
import { publisherSchema } from "@/lib/json-ld-schemas";
import { SITE_URL } from "@/lib/site";

export { blogPostCanonicalUrl, calcWordCount, createBlogPost } from "@/lib/blog-post";

const BLOG_AUTHOR = {
  name: "Caraway",
  url: SITE_URL,
} as const;

const BLOG_IMAGE = {
  path: "/images/og-card.jpg",
  url: `${SITE_URL}/images/og-card.jpg`,
  width: 1200,
  height: 630,
  alt: "Caraway cash for cars Brisbane",
} as const;

export const RETIRED_BLOG_SLUGS = [
  "cash-for-cars-gold-coast",
  "cash-for-cars-ipswich-brisbane",
  "cash-for-cars-logan-brisbane",
  "cash-for-cars-redcliffe-brisbane",
  "cash-for-cars-sunshine-coast",
  "cash-for-cars-toowoomba",
] as const;

const retiredBlogSlugSet = new Set<string>(RETIRED_BLOG_SLUGS);

export function buildMissingBlogPostMetadata(): Metadata {
  return {
    title: { absolute: "Post not found — Caraway" },
    robots: { index: false, follow: false },
    openGraph: null,
    twitter: null,
  };
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const authorName = post.author ?? BLOG_AUTHOR.name;
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
      authors: [authorName],
      tags: [post.category],
      locale: "en_AU",
      siteName: "Caraway",
      images: [
        {
          url: BLOG_IMAGE.path,
          width: BLOG_IMAGE.width,
          height: BLOG_IMAGE.height,
          alt: BLOG_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [
        {
          url: BLOG_IMAGE.path,
          width: BLOG_IMAGE.width,
          height: BLOG_IMAGE.height,
          alt: BLOG_IMAGE.alt,
        },
      ],
    },
    other: {
      "article:section": post.category,
      "article:tag": post.category,
      "article:published_time": post.date,
      "article:modified_time": post.updatedAt,
      "article:author": authorName,
    },
  };
}

export function plainBlogPostContent(post: BlogPost): string {
  return post.content
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
    url: post.canonicalUrl,
    mainEntityOfPage: post.canonicalUrl,
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.updatedAt,
    image: BLOG_IMAGE.url,
    wordCount,
    author: authorSchema,
    publisher: {
      "@type": "Organization",
      name: publisherSchema.name,
      url: publisherSchema.url,
      logo: {
        "@type": "ImageObject",
        url: (publisherSchema.logo as { url: string }).url,
      },
    },
    ...(post.sources?.length
      ? { citation: post.sources.map((source) => source.url) }
      : {}),
    isAccessibleForFree: true,
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const breadcrumbItems = [
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Blog", item: `${SITE_URL}/blog` },
    { name: post.title, item: post.canonicalUrl },
  ];

  return { articleSchema, faqSchema, breadcrumbItems, wordCount, plainContent };
}

export function validateBlogPostSeo(post: BlogPost): string[] {
  const errors: string[] = [];
  const expectedCanonical = blogPostCanonicalUrl(post.slug);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    errors.push("slug must be lowercase kebab-case without slashes");
  }

  if (retiredBlogSlugSet.has(post.slug)) {
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

  if (post.reviewedAt && Date.parse(post.reviewedAt) < Date.parse(post.updatedAt)) {
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
