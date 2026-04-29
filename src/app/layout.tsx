import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/json-ld-schemas";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BUSINESS, SITE_URL } from "@/lib/site";
import { shouldNoindexSite } from "@/lib/noindex";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Caraway — Cash for Cars Brisbane",
    template: "%s | Caraway",
  },
  description: `Cash for cars Brisbane — get a fair cash offer for your unwanted car. Free car removal, same-day pickup, and payment on pickup. Call ${BUSINESS.phoneDisplay}.`,
  manifest: "/site.webmanifest",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/icon-192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  keywords: [
    "cash for cars Brisbane",
    "sell car for cash Brisbane",
    "sell my car online Brisbane",
    "instant cash for cars Brisbane",
    "car removal Brisbane",
    "sell my car Brisbane",
    "scrap car buyers Brisbane",
    "car buyers Brisbane",
    "free car removal Brisbane",
    "cash for old cars Brisbane",
    "cash for damaged cars Brisbane",
  ],
  applicationName: "Caraway",
  category: "Automotive Services",
  creator: "Caraway",
  publisher: "Caraway Pty Ltd",
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Caraway",
    title: "Caraway — Cash for Cars Brisbane",
    description:
      "Cash for cars Brisbane — get a fair cash offer for your unwanted car. Free car removal, same-day pickup, and payment on pickup.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: "Caraway tow truck — cash for cars Brisbane",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caraway — Cash for Cars Brisbane",
    description:
      "Cash for cars Brisbane — get a fair cash offer for your unwanted car. Free car removal, same-day pickup, and payment on pickup.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: "Caraway tow truck — cash for cars Brisbane",
      },
    ],
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
  },
  robots:
    shouldNoindexSite()
      ? { index: false, follow: false }
      : {
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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[300] focus:top-3 focus:left-3 focus:bg-foreground focus:text-background focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        <JsonLd data={[localBusinessSchema, organizationSchema, websiteSchema]} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
