import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { indexableBlogPosts, categoryMap } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_IMAGES = [
    `${SITE_URL}/images/tow-truck-hero.webp`,
    `${SITE_URL}/images/logo.webp`,
  ];

  // Dynamic: always advertise today as the site-wide last-modified baseline so
  // crawlers re-check on each fetch. Per-page dates (blog posts) still win.
  const SITE_LAST_MODIFIED = new Date().toISOString().split("T")[0];

  const latestBlogDate = indexableBlogPosts.reduce(
    (latest, post) => {
      const stamp = post.updatedAt || post.date;
      return stamp > latest ? stamp : latest;
    },
    "2025-01-01"
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: SITE_LAST_MODIFIED, changeFrequency: "weekly", priority: 1.0, images: SITE_IMAGES },
    { url: `${SITE_URL}/about`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6, images: SITE_IMAGES },
    { url: `${SITE_URL}/contact`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7, images: SITE_IMAGES },
    { url: `${SITE_URL}/faq`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7, images: SITE_IMAGES },
    { url: `${SITE_URL}/locations`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8, images: SITE_IMAGES },
    { url: `${SITE_URL}/blog`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.7, images: SITE_IMAGES },
    { url: `${SITE_URL}/privacy`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3, images: SITE_IMAGES },
    { url: `${SITE_URL}/terms`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3, images: SITE_IMAGES },
    { url: `${SITE_URL}/accessibility`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.5, images: SITE_IMAGES },
    { url: `${SITE_URL}/site-map`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.4, images: SITE_IMAGES },
    { url: `${SITE_URL}/author/sam-williams`, lastModified: SITE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.4, images: SITE_IMAGES },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: s.slug === "cash-for-cars-brisbane" ? 0.95 : 0.8,
    images: SITE_IMAGES,
  }));

  const suburbPages: MetadataRoute.Sitemap = suburbs.map((s) => ({
    url: `${SITE_URL}/locations/${s.slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.6,
    images: SITE_IMAGES,
  }));

  const blogPages: MetadataRoute.Sitemap = indexableBlogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.date,
    changeFrequency: "monthly",
    priority: 0.7,
    images: SITE_IMAGES,
  }));

  const categoryPages: MetadataRoute.Sitemap = Object.keys(categoryMap).map((slug) => ({
    url: `${SITE_URL}/blog/category/${slug}`,
    lastModified: latestBlogDate,
    changeFrequency: "monthly",
    priority: 0.5,
    images: SITE_IMAGES,
  }));

  return [...staticPages, ...servicePages, ...suburbPages, ...blogPages, ...categoryPages];
}
