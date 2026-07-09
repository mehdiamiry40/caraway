import type { BlogImage, BlogPost, RawBlogPostEntry } from "@/content/blog/types";
import { SITE_URL } from "@/lib/site";

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

function isIsoDate(value: string | undefined): value is string {
  return (
    !!value &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

export function blogPostCanonicalUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

function cleanTitleForAlt(title: string): string {
  return title
    .replace(/\s*\|\s*/g, " ")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blogPostImage(slug: string, title: string, image?: BlogImage): BlogImage {
  const defaultImage = {
    src: `/images/blog/${slug}.webp`,
    alt: `Ultra-realistic Brisbane car-selling scene for ${cleanTitleForAlt(title)}`,
    width: 1600,
    height: 900,
  };

  return {
    ...defaultImage,
    ...image,
    src: image?.src?.trim() || defaultImage.src,
    alt: image?.alt?.trim() || defaultImage.alt,
  };
}

export function createBlogPost(
  post: RawBlogPostEntry,
): BlogPost {
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug ?? "")
    ? post.slug
    : "caraway-car-selling-guide";
  const content = Array.isArray(post.content)
    ? post.content.filter(
        (block): block is string =>
          typeof block === "string" && block.trim().length > 0,
      )
    : [];
  const date = isIsoDate(post.date) ? post.date : "2025-01-01";
  const updatedAt = isIsoDate(post.updatedAt) ? post.updatedAt : date;
  const title = post.title?.trim() || "Caraway car selling guide";

  return {
    ...post,
    slug,
    title,
    metaDescription:
      post.metaDescription?.trim() ||
      "Practical guidance from Caraway about selling unwanted, damaged, scrap, or unregistered cars in Brisbane.",
    excerpt:
      post.excerpt?.trim() ||
      "Practical guidance from Caraway about selling unwanted, damaged, scrap, or unregistered cars in Brisbane.",
    content,
    date,
    updatedAt,
    category: post.category?.trim() || "Guides",
    relatedServices: Array.isArray(post.relatedServices)
      ? post.relatedServices.filter(Boolean)
      : [],
    relatedSuburbs: Array.isArray(post.relatedSuburbs)
      ? post.relatedSuburbs.filter(Boolean)
      : [],
    image: blogPostImage(slug, title, post.image),
    canonicalUrl: blogPostCanonicalUrl(slug),
    readTime: calcReadTime(content),
  };
}
