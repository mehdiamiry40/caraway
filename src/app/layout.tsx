import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/json-ld-schemas";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans-body",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-display-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://caraway.au"),
  title: "Cash for Cars Brisbane | Caraway — Same-Day Cash & Free Towing",
  description:
    "Cash for cars Brisbane: fair quotes, free removal, and payment on pickup. Caraway buys any make or condition — up to $9,999. Greater Brisbane, 7 days. Call 1800 227 293 for a free quote.",
  manifest: "/site.webmanifest",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/icon-192.png" },
  ],
  keywords: [
    "cash for cars Brisbane",
    "cash for cars brisbane today",
    "sell car for cash Brisbane",
    "car removal Brisbane",
    "sell my car Brisbane",
    "scrap car buyers Brisbane",
    "cash for cars",
    "car buyers Brisbane",
    "junk car removal Brisbane",
    "free car removal Brisbane",
    "unwanted car removal Brisbane",
    "cash for old cars Brisbane",
    "cash for damaged cars Brisbane",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Caraway",
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
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-2 focus:left-2 focus:rounded-lg focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <JsonLd
          data={[localBusinessSchema, organizationSchema, websiteSchema]}
        />
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
