import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV !== "production";

const noopPolyfill = path.join(__dirname, "scripts/noop-polyfill.js");

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
  },
  experimental: {
    // optimizeCss removed: critters is abandoned upstream and breaks builds.
    optimizePackageImports: ["lucide-react"],
  },
  // Keep Turbopack aligned with the webpack hooks below so `next dev --turbopack`
  // does not warn and client resolution matches production intent.
  turbopack: {
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": noopPolyfill,
      "next/dist/build/polyfills/polyfill-module.js": noopPolyfill,
    },
  },
  // Replace Next.js's polyfill-module with an empty shim in client builds.
  // It patches Array.prototype.at/flat/flatMap, Object.fromEntries/hasOwn,
  // String.prototype.trimStart/trimEnd, Promise.prototype.finally, and
  // URL.canParse — all natively supported by every browser in our
  // browserslist target (last 2 Chrome/Firefox/Safari/Edge). Next.js loads
  // the polyfill via a relative `require`, so resolve.alias on the package
  // path doesn't match; NormalModuleReplacementPlugin matches on the
  // resolved path instead. Shaves the ~12 KiB of "Legacy JavaScript" that
  // Lighthouse flagged.
  webpack: (config, { isServer, dev, webpack }) => {
    if (!isServer) {
      const noop = path.resolve(__dirname, "scripts/noop-polyfill.js");
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/]build[\\/]polyfills[\\/]polyfill-module/,
          noop,
        ),
      );
      // Strip Next.js dev-overlay from production client chunks. Next.js's
      // app-globals.js and app-index.js both `require('../next-devtools/
      // userspace/app/...')` inside `if (process.env.NODE_ENV !==
      // 'production')` guards — but webpack still bundles CommonJS
      // `require()` calls even in dead branches, dragging in DevOverlay,
      // segmentExplorer, anser, strip-ansi, stacktrace-parser and the
      // /__nextjs_* dev endpoints (~800 KB uncompressed in ed9f2dc4-*.js,
      // ~210 KB gzipped). Matches both next/dist/next-devtools/ and
      // next/dist/esm/next-devtools/ (Next.js aliases dist→esm on the
      // client) plus the pre-bundled next/dist/compiled/next-devtools/.
      // Guarded by !dev so local dev keeps the overlay.
      if (!dev) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /next[\\/]dist[\\/](esm[\\/])?next-devtools[\\/]/,
            noop,
          ),
          new webpack.NormalModuleReplacementPlugin(
            /next[\\/]dist[\\/]compiled[\\/]next-devtools[\\/]/,
            noop,
          ),
        );
      }
    }
    return config;
  },
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
              ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com"
              : "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
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
    // Long-lived cache for immutable static assets
    {
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/_next/image",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/favicon.svg",
      headers: [
        { key: "Cache-Control", value: "public, max-age=604800, immutable" },
      ],
    },
  ],
};

export default nextConfig;
