import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { blogPosts } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/locations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    changeFrequency: "monthly",
    priority: s.slug === "cash-for-cars-brisbane" ? 0.95 : 0.8,
  }));

  const suburbPages: MetadataRoute.Sitemap = suburbs.map((s) => ({
    url: `${SITE_URL}/locations/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...suburbPages, ...blogPages];
}
