import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { blogPosts, categoryMap } from "@/data/blog-posts";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import {
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_MAP_CONTENT_UPDATED,
  SITE_URL,
} from "@/lib/site";
import { blogPageCount } from "@/lib/blog-pagination";
import { VEHICLE_DATA_ROUTE } from "@/data/queensland-vehicle-data";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse public pages on caraway.au — services, Brisbane coverage, practical guides, and company information in one place.",
  alternates: { canonical: "/site-map" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/site-map",
    title: "Sitemap",
    description: "Browse public pages on caraway.au — services, Brisbane coverage, practical guides, and company information in one place.",
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
    title: "Sitemap",
    description: "Browse public pages on caraway.au — services, Brisbane coverage, practical guides, and company information in one place.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
  },
};

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Sitemap" },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "All Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "All locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

const linkCls = "text-muted-foreground hover:text-primary transition-colors duration-200 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none inline-flex py-1.5 min-h-[44px] items-center";

const canonical = `${SITE_URL}/site-map`;

export default function SiteMapPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema(breadcrumbs, canonical),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": canonical,
            url: canonical,
            name: "Sitemap | Caraway",
            description:
              "Browse public pages on caraway.au — services, Brisbane coverage, practical guides, and company information in one place.",
            inLanguage: "en-AU",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            publisher: { "@id": `${SITE_URL}/#organization` },
            dateModified: SITE_MAP_CONTENT_UPDATED,
          },
        ]}
      />
      <PageShell
        breadcrumbs={breadcrumbs}
        title="Sitemap"
        subtitle={<p>Browse public pages on caraway.au and jump to the section you need.</p>}
      >
      <div className="site-container py-12 sm:py-16 lg:py-20 space-y-12">
        <section>
          <h2 className="text-xl sm:text-2xl font-display text-primary mb-5">Services</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className={linkCls}>
                  {s.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-display text-primary mb-5">Locations</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
            {suburbs.map((s) => (
              <li key={s.slug}>
                <Link href={`/locations/${s.slug}`} className={linkCls}>
                  {s.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-display text-primary mb-5">Resources</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <li>
              <Link href={VEHICLE_DATA_ROUTE} className={linkCls}>
                Queensland vehicle fuel trends and Brisbane suburb snapshot
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-display text-primary mb-5">Blog &amp; Guides</h2>
          <ul className="mb-5 flex flex-wrap gap-x-6 gap-y-1">
            {Object.entries(categoryMap).map(([slug, label]) => (
              <li key={slug}>
                <Link href={`/blog/category/${slug}`} className={linkCls}>{label}</Link>
              </li>
            ))}
            {Array.from({ length: Math.max(0, blogPageCount() - 1) }, (_, index) => (
              <li key={index}>
                <Link href={`/blog/page/${index + 2}`} className={linkCls}>Blog page {index + 2}</Link>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {blogPosts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className={linkCls}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-display text-primary mb-5">Company</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkCls}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      </PageShell>
    </>
  );
}
