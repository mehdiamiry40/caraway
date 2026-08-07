import type { NextConfig } from "next";
import path from "node:path";
import { RETIRED_BLOG_DESTINATIONS } from "./src/lib/blog-consolidation";
import { RETIRED_LOCATION_DESTINATIONS } from "./src/lib/location-consolidation";
import { RETIRED_SERVICE_DESTINATIONS } from "./src/lib/service-consolidation";

const isDev = process.env.NODE_ENV !== "production";

export const retiredLocationRedirects = Object.entries(
  RETIRED_LOCATION_DESTINATIONS,
).map(([slug, destination]) => ({
  source: `/locations/${slug}`,
  destination,
}));

export const retiredServiceRedirects = Object.entries(
  RETIRED_SERVICE_DESTINATIONS,
).map(([slug, destination]) => ({
  source: `/${slug}`,
  destination,
}));

export const retiredBlogRedirects = Object.entries(
  RETIRED_BLOG_DESTINATIONS,
).map(([slug, destination]) => ({
  source: `/blog/${slug}`,
  destination,
}));

export const legacyIndexingRedirects = [
  {
    source: "/privacy-policy.html",
    destination: "/privacy",
  },
  {
    source: "/vehicles-we-buy/utes-vans",
    destination: "/cash-for-cars-brisbane",
  },
  // July 2026 consolidation: the "Car Selling Guides" blog category duplicated
  // the "Guides" category; its posts now live under /blog/category/guides.
  {
    source: "/blog/category/car-selling-guides",
    destination: "/blog/category/guides",
  },
  // Content consolidation reduced the archive from six paginated pages to
  // three. Preserve former archive pages as one-hop redirects instead of 404s.
  {
    source: "/blog/page/6",
    destination: "/blog",
  },
  {
    source: "/blog/page/5",
    destination: "/blog",
  },
  {
    source: "/blog/page/4",
    destination: "/blog",
  },
  // Legacy URLs surfaced by Search Console as 404s or alternative canonicals.
  // These pages have moved permanently, so redirect them instead of serving
  // duplicate 200 responses through rewrites. That gives crawlers one clear
  // canonical URL and lets link equity consolidate onto the live page.
  {
    source: "/index.html",
    destination: "/",
  },
  {
    source: "/cash-for-cars-sunnybank.html",
    destination: "/locations/moorooka",
  },
  {
    source: "/blog/old-car-running-costs.html",
    destination: "/blog/repair-or-sell-your-car-brisbane",
  },
  {
    source: "/blog/cash-for-cars-vs-dealer-trade-in.html",
    destination: "/blog/how-to-sell-your-car-for-cash-brisbane",
  },
  {
    source: "/english-privacy-policy",
    destination: "/privacy",
  },
  {
    source: "/book-online",
    destination: "/contact",
  },
  {
    source: "/service-page/home-visit",
    destination: "/car-removal-brisbane",
  },
  {
    source: "/blog/sell-damaged-car-brisbane.html",
    destination: "/damaged-cars-brisbane",
  },
] as const;

const indexingRedirects = [
  ...retiredServiceRedirects,
  ...retiredLocationRedirects,
  ...retiredBlogRedirects,
  ...legacyIndexingRedirects,
] as const;

const wwwHost = [{ type: "host" as const, value: "www.caraway.au" }];

const canonicalHostIndexingRedirects = indexingRedirects.flatMap(
  ({ source, destination }) => [
    {
      source: `${source}/`,
      has: wwwHost,
      destination: `https://caraway.au${destination}`,
      permanent: true,
    },
    {
      source,
      has: wwwHost,
      destination: `https://caraway.au${destination}`,
      permanent: true,
    },
  ],
);

const directIndexingRedirects = indexingRedirects.flatMap(
  ({ source, destination }) => [
    { source: `${source}/`, destination, permanent: true },
    { source, destination, permanent: true },
  ],
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  // Custom slash rules let retired URLs on either canonical host resolve to
  // their final destination in one hop instead of normalizing first.
  skipTrailingSlashRedirect: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    // optimizeCss removed: critters is abandoned upstream and breaks builds.
    optimizePackageImports: ["lucide-react"],
  },
  redirects: async () => [
    // Retired URLs on the old www host go straight to their final apex URL,
    // including requests that carry a trailing slash.
    ...canonicalHostIndexingRedirects,
    // Force canonical host: www.caraway.au → caraway.au with a permanent 308.
    // Vercel now uses the apex domain as the production target, so keeping the
    // old app-level apex → www redirect creates a redirect loop.
    {
      source: "/:path+/",
      has: wwwHost,
      destination: "https://caraway.au/:path+",
      permanent: true,
    },
    {
      source: "/:path*",
      has: wwwHost,
      destination: "https://caraway.au/:path*",
      permanent: true,
    },
    // URLs GSC has tracked under indexing exclusions:
    // - the `.html` URLs are legacy paths from an older site version.
    // - retired vehicle/category paths now consolidate into live service
    //   pages, including old "vehicles we buy" group pages.
    // - retired location articles either duplicated live Greater Brisbane
    //   landing pages or claimed service in markets Caraway does not cover.
    // Map each to its closest live equivalent so Google consolidates signals
    // onto a canonical page rather than keeping stale URLs in the crawl queue.
    ...directIndexingRedirects,
    // Preserve the site's no-trailing-slash policy after disabling Next's
    // higher-priority automatic redirect above.
    {
      source: "/:path+/",
      destination: "/:path+",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          // NOTE: script-src intentionally keeps 'unsafe-inline' because
          // Next.js App Router hydration injects inline bootstrap scripts
          // and we do not currently emit per-request nonces. Revisit once
          // we adopt nonce-based CSP (requires a custom middleware/layout
          // integration). object-src 'none' is added as defence in depth
          // so plugins/applets cannot be embedded even if an injection
          // were to occur.
          // In development, 'unsafe-eval' is needed for Next.js source maps
          // and frame-ancestors is relaxed for the Replit preview pane.
          value: [
            "default-src 'self'",
            isDev
              ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
              : "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data: blob:",
            "connect-src 'self'",
            "object-src 'none'",
            isDev ? "frame-ancestors *" : "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            ...(isDev ? [] : ["upgrade-insecure-requests"]),
          ].join("; "),
        },
        ...(isDev ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        ...(isDev ? [] : [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ]),
      ],
    },
    // Image assets are versioned through deploys. Use long browser caching for
    // PageSpeed and change filenames when replacing visual assets.
    {
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/favicon.svg",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
      ],
    },
  ],
};

export default nextConfig;
