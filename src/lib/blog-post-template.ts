import type { Metadata } from "next";
import type { BlogPost, RawBlogPostEntry } from "@/content/blog/types";
import { publisherSchema } from "@/lib/json-ld-schemas";
import { SITE_URL } from "@/lib/site";

const BLOG_AUTHOR = {
  name: "Sam Williams",
  url: `${SITE_URL}/author/sam-williams`,
} as const;

const BLOG_IMAGE = {
  path: "/images/tow-truck-hero.webp",
  url: `${SITE_URL}/images/tow-truck-hero.webp`,
  width: 1200,
  height: 800,
  alt: "Caraway cash for cars Brisbane",
} as const;

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
    robots: post.isIndexable ? undefined : { index: false, follow: true },
    openGraph: {
      url: post.canonicalUrl,
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [BLOG_AUTHOR.name],
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
      "article:author": BLOG_AUTHOR.name,
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
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR.name,
      url: BLOG_AUTHOR.url,
    },
    publisher: {
      "@type": "Organization",
      name: publisherSchema.name,
      url: publisherSchema.url,
      logo: {
        "@type": "ImageObject",
        url: (publisherSchema.logo as { url: string }).url,
      },
    },
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

  if (!post.category.trim()) {
    errors.push("category is required");
  }

  if (!Array.isArray(post.content) || post.content.filter(Boolean).length < 2) {
    errors.push("content must include multiple non-empty blocks");
  }

  return errors;
}
