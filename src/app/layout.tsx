import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Barlow, Open_Sans } from "next/font/google";

import { AnalyticsListener } from "@/components/AnalyticsListener";
import { CarawayChatLoader } from "@/components/CarawayChatLoader";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/json-ld-schemas";
import { BUSINESS, SHARED_PICKUP_IMAGE_ALT, SITE_URL } from "@/lib/site";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Caraway | Brisbane Vehicle Buyer",
    template: "%s | Caraway",
  },
  description: `Sell your vehicle to Caraway, a Brisbane-based buyer. Get an estimate, a confirmed offer, and pickup included when we buy. Call ${BUSINESS.phoneDisplay}.`,
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
      "Get a vehicle estimate, a confirmed offer, and pickup included when Caraway buys across Greater Brisbane.",
    images: [
      {
        url: "/og.png",
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
      "Get a vehicle estimate, a confirmed offer, and pickup included when Caraway buys across Greater Brisbane.",
    images: [
      {
        url: "/og.png",
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
  themeColor: "#0A2F68",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${openSans.variable} ${barlow.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[300] focus:top-3 focus:left-3 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:rounded-md focus:shadow-[0_8px_24px_hsl(var(--shadow-color)/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Skip to main content
        </a>
        <div aria-hidden="true" className="site-frame" />
        {children}
        <CarawayChatLoader />
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <Analytics />
        <AnalyticsListener />
      </body>
    </html>
  );
}
