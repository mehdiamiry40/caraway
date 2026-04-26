import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import {
  indexableBlogPosts,
  categoryMap,
  getPostsByCategory,
} from "@/data/blog-posts";
import { SITE_URL, LEGAL_DATES, CONTENT_DEPLOY_DATE } from "@/lib/site";

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

/** Resolve a "Month YYYY" string (e.g. "April 2026") to an ISO date. */
function monthYearToISO(label: string): string {
  const [monthLabel, year] = label.trim().split(/\s+/);
  const monthNumber = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  }[monthLabel];

  if (!monthNumber || !/^\d{4}$/.test(year ?? "")) return CONTENT_DEPLOY_DATE;

  return `${year}-${monthNumber}-01`;
}

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
  return items.reduce((latest, item) => {
    const stamp = validIsoDate(getDate(item), fallback);
    return stamp > latest ? stamp : latest;
  }, fallback);
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
  const latestBlogDate = newestDate(indexableBlogPosts, (post) => post.updatedAt || post.date);

  /* -----------------------------------------------------------------------
   * 1. Static pages — use honest, fixed dates
   * ---------------------------------------------------------------------*/
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: CONTENT_DEPLOY_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
      images: HERO_IMAGE,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: CONTENT_DEPLOY_DATE,
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
      lastModified: CONTENT_DEPLOY_DATE,
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
      lastModified: monthYearToISO(LEGAL_DATES.privacyLastUpdated),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: monthYearToISO(LEGAL_DATES.termsLastUpdated),
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
    {
      url: `${SITE_URL}/author/sam-williams`,
      lastModified: latestBlogDate,
      changeFrequency: "monthly",
      priority: 0.4,
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

  const servicePages: MetadataRoute.Sitemap = services.filter((s) => s.slug).map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    lastModified: CONTENT_DEPLOY_DATE,
    changeFrequency: "monthly" as const,
    priority: PRIMARY_SERVICE_SLUGS.has(s.slug) ? 0.9 : 0.8,
    images: HERO_IMAGE,
  }));

  /* -----------------------------------------------------------------------
   * 3. Location (suburb) pages
   * ---------------------------------------------------------------------*/
  const suburbPages: MetadataRoute.Sitemap = suburbs.filter((s) => s.slug).map((s) => ({
    url: `${SITE_URL}/locations/${s.slug}`,
    lastModified: CONTENT_DEPLOY_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: HERO_IMAGE,
  }));

  /* -----------------------------------------------------------------------
   * 4. Blog posts — dynamic changeFrequency based on content age
   * ---------------------------------------------------------------------*/
  const CORNERSTONE_SLUGS = new Set([
    "how-to-sell-your-car-for-cash-brisbane",
    "how-to-sell-a-car-without-rego-brisbane",
    "how-to-cancel-car-rego-qld",
    "how-to-transfer-car-ownership-qld",
    "wovr-written-off-vehicle-register-qld-guide",
    "scrap-metal-prices-brisbane-2026",
  ]);

  const blogPages: MetadataRoute.Sitemap = indexableBlogPosts.filter((p) => p.slug).map((p) => {
    const modified = validIsoDate(p.updatedAt || p.date);
    return {
      url: p.canonicalUrl,
      lastModified: modified,
      changeFrequency: changeFreqByAge(modified),
      priority: CORNERSTONE_SLUGS.has(p.slug) ? 0.8 : 0.6,
      images: HERO_IMAGE,
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

  const entries = [
    ...staticPages,
    ...servicePages,
    ...suburbPages,
    ...blogPages,
    ...categoryPages,
  ];

  return Array.from(new Map(entries.filter((entry) => entry.url.startsWith(SITE_URL)).map((entry) => [entry.url, entry])).values());
}
