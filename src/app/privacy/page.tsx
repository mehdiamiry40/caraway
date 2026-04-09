import type { Metadata } from "next";
import Privacy from "@/views/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Caraway collects, uses, and protects your personal information. Read our privacy policy for our Brisbane cash for cars and vehicle removal services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    url: "/privacy",
    title: "Privacy Policy | Caraway",
    description:
      "Learn how Caraway collects, uses, and protects your personal information for our Brisbane cash for cars services.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function PrivacyPage() {
  return <Privacy />;
}
