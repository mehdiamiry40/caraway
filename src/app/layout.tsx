import type { Metadata, Viewport } from "next";
import { Ubuntu, Exo } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/json-ld-schemas";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans-body",
  display: "swap",
});

// Exo loads 500/600/700 to cover font-display paired with
// font-medium/font-semibold/font-bold used throughout the app.
const exo = Exo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Caraway — Cash for Cars Brisbane",
    template: "%s | Caraway",
  },
  description:
    "Sell your car for cash in Brisbane today. Caraway pays up to $9,999 with free towing and same- or next-day pickup. Any make, any condition. Call 0481 438 444.",
  manifest: "/site.webmanifest",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/icon-192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
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
      "Sell your car for cash in Brisbane today. Caraway pays up to $9,999 with free towing and same- or next-day pickup. Any make, any condition. Call 0481 438 444.",
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
      "Sell your car for cash in Brisbane today. Caraway pays up to $9,999 with free towing and same- or next-day pickup. Any make, any condition. Call 0481 438 444.",
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
    process.env.VERCEL_ENV !== "production"
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
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${ubuntu.variable} ${exo.variable}`}
    >
      <head>
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
      </head>
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
