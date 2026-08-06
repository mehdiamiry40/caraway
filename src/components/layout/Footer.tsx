import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";

const exploreLinks = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const footerLinkClasses =
  "inline-flex min-h-11 items-center text-sm font-medium text-on-dark-hi/80 transition-colors hover:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-on-dark pl-safe pr-safe">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-6">
            <Link
              href="/"
              prefetch={false}
              className="font-display text-2xl font-bold tracking-[0.08em] text-on-dark-hi"
            >
              CARAWAY
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-on-dark-hi/75">
              Straightforward car buying and pickup across Greater Brisbane.
            </p>
            <div className="mt-6 flex flex-col items-start gap-1 sm:flex-row sm:gap-6">
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="footer"
                className={footerLinkClasses}
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
              <a href={BUSINESS.emailHref} className={footerLinkClasses}>
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                {BUSINESS.email}
              </a>
            </div>
          </div>

          <nav aria-label="Explore" className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold text-on-dark-hi">Explore</h2>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={footerLinkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold text-on-dark-hi">Details</h2>
            <p className="text-sm leading-7 text-on-dark-hi/75">
              {BUSINESS.hours} · seven days
              <br />
              {BUSINESS.addressFormatted}
              <br />
              ABN {BUSINESS.abn}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-on-dark-hi/15 pb-safe">
        <div className="site-container flex flex-col gap-3 py-5 text-xs text-on-dark-hi/65 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {BUSINESS.name}</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={footerLinkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
