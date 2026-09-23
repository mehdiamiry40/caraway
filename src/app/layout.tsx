import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { AnalyticsListener } from "@/components/AnalyticsListener";
import { CarawayChatLoader } from "@/components/CarawayChatLoader";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/json-ld-schemas";
import { BUSINESS, SHARED_PICKUP_IMAGE_ALT, SITE_URL } from "@/lib/site";
import { Inter } from "next/font/google";
import "./globals.css";

// One family, two weights. Self-hosted by next/font at build time, so there is
// no runtime request to Google and no layout shift from a late swap.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Caraway | Brisbane Vehicle Buyer",
    template: "%s | Caraway",
  },
  description: `Sell your vehicle to Caraway, a Brisbane-based buyer. Request a human-reviewed assessment, receive a confirmed offer, and arrange pickup when we buy. Call ${BUSINESS.phoneDisplay}.`,
  manifest: "/site.webmanifest",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/icon-192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  applicationName: "Caraway",
  category: "Automotive Services",
  creator: "Caraway",
  publisher: BUSINESS.name,
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Caraway",
    title: "Caraway | Brisbane Vehicle Buyer",
    description:
      "Request a human-reviewed vehicle assessment, receive a confirmed offer, and arrange pickup when Caraway buys across Greater Brisbane.",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caraway | Brisbane Vehicle Buyer",
    description:
      "Request a human-reviewed vehicle assessment, receive a confirmed offer, and arrange pickup when Caraway buys across Greater Brisbane.",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
  },
  // Static artifacts remain safely promotable: the request proxy adds an
  // X-Robots-Tag noindex directive on every non-canonical request host.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FAFAF9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[300] focus:top-3 focus:left-3 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Skip to main content
        </a>
        <div aria-hidden="true" className="site-frame" />
        {children}
        <CarawayChatLoader />
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <Analytics />
        <SpeedInsights />
        <AnalyticsListener />
      </body>
    </html>
  );
}
