import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV !== "production";

export const legacyIndexingRedirects = [
  {
    source: "/privacy-policy.html",
    destination: "/privacy",
  },
  {
    source: "/vehicles-we-buy/utes-vans",
    destination: "/cash-for-cars-brisbane",
  },
  {
    source: "/blog/cash-for-cars-redcliffe-brisbane",
    destination: "/locations/redcliffe",
  },
  {
    source: "/blog/cash-for-cars-ipswich-brisbane",
    destination: "/locations/ipswich",
  },
  {
    source: "/blog/cash-for-cars-logan-brisbane",
    destination: "/locations/logan",
  },
  {
    source: "/blog/cash-for-cars-sunshine-coast",
    destination: "/cash-for-cars-brisbane",
  },
  {
    source: "/blog/cash-for-cars-toowoomba",
    destination: "/cash-for-cars-brisbane",
  },
  {
    source: "/blog/cash-for-cars-gold-coast",
    destination: "/cash-for-cars-brisbane",
  },
  // July 2026 consolidation: suburb-level "cash for cars {suburb}" posts
  // competed with the /locations/{suburb} landing pages for identical
  // queries (keyword cannibalization). Each post now 301s to its location
  // page so Google consolidates ranking signals onto the money page.
  {
    source: "/blog/cash-for-cars-beenleigh",
    destination: "/locations/beenleigh",
  },
  {
    source: "/blog/cash-for-cars-bulimba",
    destination: "/locations/bulimba",
  },
  {
    source: "/blog/cash-for-cars-browns-plains",
    destination: "/locations/browns-plains",
  },
  {
    source: "/blog/cash-for-cars-caboolture-brisbane",
    destination: "/locations/caboolture",
  },
  {
    source: "/blog/cash-for-cars-capalaba",
    destination: "/locations/capalaba",
  },
  {
    source: "/blog/cash-for-cars-carindale",
    destination: "/locations/carindale",
  },
  {
    source: "/blog/cash-for-cars-chermside",
    destination: "/locations/chermside",
  },
  {
    source: "/blog/cash-for-cars-indooroopilly",
    destination: "/locations/indooroopilly",
  },
  {
    source: "/blog/cash-for-cars-ipswich",
    destination: "/locations/ipswich",
  },
  {
    source: "/blog/cash-for-cars-kenmore",
    destination: "/locations/kenmore",
  },
  {
    source: "/blog/cash-for-cars-logan",
    destination: "/locations/logan",
  },
  {
    source: "/blog/cash-for-cars-moorooka",
    destination: "/locations/moorooka",
  },
  {
    source: "/blog/cash-for-cars-mount-gravatt",
    destination: "/locations/mount-gravatt",
  },
  {
    source: "/blog/cash-for-cars-north-lakes",
    destination: "/locations/north-lakes",
  },
  {
    source: "/blog/cash-for-cars-nundah",
    destination: "/locations/nundah",
  },
  {
    source: "/blog/cash-for-cars-redcliffe",
    destination: "/locations/redcliffe",
  },
  {
    source: "/blog/cash-for-cars-springwood",
    destination: "/locations/springwood",
  },
  {
    source: "/blog/cash-for-cars-stafford",
    destination: "/locations/stafford",
  },
  {
    source: "/blog/cash-for-cars-sunnybank",
    destination: "/locations/sunnybank",
  },
  {
    source: "/blog/cash-for-cars-toowong",
    destination: "/locations/toowong",
  },
  {
    source: "/blog/cash-for-cars-wynnum",
    destination: "/locations/wynnum",
  },
  // July 2026 consolidation: two posts answered the identical "how much is a
  // scrap car worth in Brisbane" query. The older, thinner post 301s into the
  // newer guide so Google consolidates ranking signals onto one URL.
  {
    source: "/blog/how-much-is-my-car-worth-for-scrap-brisbane",
    destination: "/blog/how-much-is-scrap-car-worth-brisbane",
  },
  // July 2026 consolidation: the "Car Selling Guides" blog category duplicated
  // the "Guides" category; its posts now live under /blog/category/guides.
  {
    source: "/blog/category/car-selling-guides",
    destination: "/blog/category/guides",
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
    destination: "/locations/sunnybank",
  },
  {
    source: "/blog/old-car-running-costs.html",
    destination: "/blog/repair-or-sell-your-car-brisbane",
  },
  {
    source: "/blog/cash-for-cars-vs-dealer-trade-in.html",
    destination: "/blog/trade-in-vs-cash-for-cars-brisbane",
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
    destination: "/blog/sell-damaged-car-brisbane",
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
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
    // Force canonical host: www.caraway.au → caraway.au with a permanent 308.
    // Vercel now uses the apex domain as the production target, so keeping the
    // old app-level apex → www redirect creates a redirect loop.
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.caraway.au" }],
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
    ...legacyIndexingRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    })),
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
