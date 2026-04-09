import type { Metadata } from "next";
import Terms from "@/views/Terms";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service for Caraway's website and our vehicle purchase and removal services in Queensland, Australia. Updated March 2026.",
  alternates: { canonical: "/terms" },
  openGraph: {
    url: "/terms",
    title: "Terms of Service | Caraway",
    description:
      "Terms governing use of the Caraway website and our vehicle purchase and removal services in Queensland, Australia.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function TermsPage() {
  return <Terms />;
}
