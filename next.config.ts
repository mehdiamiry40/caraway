import type { NextConfig } from "next";
import path from "node:path";

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
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
          ].join("; "),
        },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
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
      source: "/favicon.svg",
      headers: [
        { key: "Cache-Control", value: "public, max-age=604800, immutable" },
      ],
    },
  ],
};

// Conditionally wrap with Sentry config when the package is installed.
// If @sentry/nextjs is not yet installed this falls through to exporting the
// base Next config so the build is not blocked.
// TODO: configure SENTRY_DSN / SENTRY_AUTH_TOKEN secrets in Vercel before enabling upload.
let exported: NextConfig = nextConfig;
try {
  // Use dynamic resolution so eslint doesn't flag require() — this file is CJS-safe for next.
  const sentryModule = eval("require")("@sentry/nextjs") as {
    withSentryConfig: (cfg: NextConfig, opts: Record<string, unknown>) => NextConfig;
  };
  exported = sentryModule.withSentryConfig(nextConfig, {
    org: "caraway",
    project: "caraway-web",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    tunnelRoute: "/monitoring",
  });
} catch {
  // @sentry/nextjs not installed — fall back to the base config.
}

export default exported;
