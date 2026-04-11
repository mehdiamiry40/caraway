import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { indexableBlogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse every page on caraway.au — services, locations, guides, and company info.",
  alternates: { canonical: "/site-map" },
};

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Sitemap" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

const linkCls = "text-muted-foreground hover:text-primary transition-colors duration-200 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none inline-flex py-1.5 min-h-[44px] items-center";

export default function SiteMapPage() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Sitemap"
      subtitle={<p>Every page on caraway.au — use this to quickly jump to any section.</p>}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-12">
        <section>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-5">Services</h2>
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
          <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-5">Locations</h2>
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
          <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-5">Blog &amp; Guides</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {indexableBlogPosts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className={linkCls}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-5">Company</h2>
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

      <InternalLinks />
    </PageShell>
  );
}
