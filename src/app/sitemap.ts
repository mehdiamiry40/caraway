import type { MetadataRoute } from "next";
import { getServicePreferredImage, services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import {
  blogPosts,
  categoryMap,
  getPostsByCategory,
} from "@/data/blog-posts";
import {
  SITE_URL,
  LEGAL_DATE_ISO,
  CONTENT_DEPLOY_DATE,
  ABOUT_CONTENT_UPDATED,
  FAQ_CONTENT_UPDATED,
  HOME_CONTENT_UPDATED,
  HOW_IT_WORKS_CONTENT_UPDATED,
  SERVICES_CONTENT_UPDATED,
} from "@/lib/site";
import { blogPageCount } from "@/lib/blog-pagination";

export const revalidate = 3600;

/* ---------------------------------------------------------------------------
 * Image constant — only the hero image is relevant for Google Image search.
 * The logo is decorative and adds no crawl value.
 * -------------------------------------------------------------------------*/
const HERO_IMAGE = [`${SITE_URL}/images/tow-truck-hero.webp`];

/* ---------------------------------------------------------------------------
 * Date helpers — honest lastModified dates build crawler trust.  Using
 * "today" for pages that haven't changed erodes crawl budget over time.
 * -------------------------------------------------------------------------*/

function validIsoDate(value: string | undefined, fallback = CONTENT_DEPLOY_DATE): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value))) {
    return value;
  }
  return fallback;
}

function newestDate<T>(
  items: T[],
  getDate: (item: T) => string | undefined,
  fallback = CONTENT_DEPLOY_DATE,
): string {
  // Compute the actual maximum of valid item dates.  Seeding the reducer with
  // `fallback` would mask older content (a category whose newest post is from
  // 2025-02 would otherwise appear in the sitemap with the deploy date).
  let latest: string | null = null;
  for (const item of items) {
    const raw = getDate(item);
    if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw) || !Number.isFinite(Date.parse(raw))) continue;
    if (latest === null || raw > latest) latest = raw;
  }
  return latest ?? fallback;
}

/** Pick a changeFrequency hint based on content age. */
function changeFreqByAge(
  isoDate: string,
): "daily" | "weekly" | "monthly" | "yearly" {
  const ageMs = Date.now() - new Date(validIsoDate(isoDate)).getTime();
  const ageDays = ageMs / 86_400_000;
  if (ageDays < 14) return "weekly";
  if (ageDays < 180) return "monthly";
  return "yearly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  /* ---- Latest blog date (for the /blog index page) ---- */
  const latestBlogDate = newestDate(blogPosts, (post) => post.updatedAt || post.date);

  /* -----------------------------------------------------------------------
   * 1. Static pages — use honest, fixed dates
   * ---------------------------------------------------------------------*/
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: HOME_CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0,
      images: HERO_IMAGE,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: ABOUT_CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: CONTENT_DEPLOY_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: FAQ_CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: HOW_IT_WORKS_CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: SERVICES_CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: CONTENT_DEPLOY_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
      images: HERO_IMAGE,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LEGAL_DATE_ISO.privacyLastUpdated,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LEGAL_DATE_ISO.termsLastUpdated,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/accessibility`,
      lastModified: CONTENT_DEPLOY_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/site-map`,
      lastModified: CONTENT_DEPLOY_DATE,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  /* -----------------------------------------------------------------------
   * 2. Service pages — money pages get the highest non-homepage priority
   * ---------------------------------------------------------------------*/
  const PRIMARY_SERVICE_SLUGS = new Set([
    "cash-for-cars-brisbane",
    "car-removal-brisbane",
    "sell-my-car-brisbane",
  ]);

  const servicePages: MetadataRoute.Sitemap = services
    .filter((s) => s.slug)
    .map((s) => {
      const preferredImage = getServicePreferredImage(s);
      return {
        url: `${SITE_URL}/${s.slug}`,
        lastModified: s.updatedAt ?? CONTENT_DEPLOY_DATE,
        changeFrequency: "monthly" as const,
        priority: PRIMARY_SERVICE_SLUGS.has(s.slug) ? 0.9 : 0.8,
        ...(preferredImage
          ? { images: [`${SITE_URL}${preferredImage.src}`] }
          : {}),
      };
    });

  /* -----------------------------------------------------------------------
   * 3. Location (suburb) pages
   * ---------------------------------------------------------------------*/
  const suburbPages: MetadataRoute.Sitemap = suburbs.filter((s) => s.slug).map((s) => ({
    url: `${SITE_URL}/locations/${s.slug}`,
    lastModified: CONTENT_DEPLOY_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* -----------------------------------------------------------------------
   * 4. Blog posts — dynamic changeFrequency based on content age
   * ---------------------------------------------------------------------*/
  const CORNERSTONE_SLUGS = new Set([
    "how-to-sell-your-car-for-cash-brisbane",
    "what-paperwork-to-sell-a-car-qld",
    "how-to-cancel-car-rego-qld",
    "how-to-transfer-car-ownership-qld",
    "wovr-written-off-vehicle-register-qld-guide",
    "how-much-is-scrap-car-worth-brisbane",
  ]);

  const blogPages: MetadataRoute.Sitemap = blogPosts.filter((p) => p.slug).map((p) => {
    const modified = validIsoDate(p.updatedAt || p.date);
    return {
      url: p.canonicalUrl,
      lastModified: modified,
      changeFrequency: changeFreqByAge(modified),
      priority: CORNERSTONE_SLUGS.has(p.slug) ? 0.8 : 0.6,
    };
  });

  /* -----------------------------------------------------------------------
   * 5. Blog category pages — per-category lastModified date
   * ---------------------------------------------------------------------*/
  const categoryPages: MetadataRoute.Sitemap = Object.keys(categoryMap).map(
    (slug) => {
      const postsInCategory = getPostsByCategory(slug);
      const latestInCategory = newestDate(postsInCategory, (p) => p.updatedAt || p.date);
      return {
        url: `${SITE_URL}/blog/category/${slug}`,
        lastModified: latestInCategory,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      };
    },
  );

  const paginationPages: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, blogPageCount() - 1) },
    (_, index) => ({
      url: `${SITE_URL}/blog/page/${index + 2}`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }),
  );

  const entries = [
    ...staticPages,
    ...servicePages,
    ...suburbPages,
    ...blogPages,
    ...categoryPages,
    ...paginationPages,
  ];

  return Array.from(new Map(entries.filter((entry) => entry.url.startsWith(SITE_URL)).map((entry) => [entry.url, entry])).values());
}
