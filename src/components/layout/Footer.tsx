import Link from "next/link";
import { Mail, Phone, Star } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { Logo } from "@/components/layout/Logo";

const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Cash for Cars Brisbane", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal Brisbane", href: "/car-removal-brisbane" },
  { label: "Sell My Car Brisbane", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

const locationLinks = [
  { label: "Toowong", href: "/locations/toowong" },
  { label: "Logan", href: "/locations/logan" },
  { label: "Redcliffe", href: "/locations/redcliffe" },
  { label: "Moorooka", href: "/locations/moorooka" },
  { label: "Capalaba", href: "/locations/capalaba" },
  { label: "All locations", href: "/locations" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Vehicle data", href: "/resources/queensland-vehicle-data" },
  { label: "Get a quote", href: "/#price-estimator" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const navLinkClasses =
  "text-on-dark-hi/90 hover:text-cta-bright transition-colors duration-200 text-sm font-medium inline-flex items-center min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised focus-visible:outline-none touch-manipulation";

const columnHeadingClasses =
  "mb-4 border-b border-accent pb-3 font-display text-lg text-on-dark-hi";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink-raised text-on-dark pl-safe pr-safe">
      <div className="site-container py-16 sm:py-20">
        {/* Brand + contact, centred */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            prefetch={false}
            aria-label="Caraway home"
            className="rounded-sm transition-opacity duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised"
          >
            <Logo tone="light" size="lg" />
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-on-dark-hi/85">
            Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered.
          </p>

          <div className="mt-8 flex flex-col items-center gap-1 text-[0.9375rem]">
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="footer"
              className="inline-flex min-h-11 items-center gap-2 text-on-dark-hi hover:text-cta-bright transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
              <span>{BUSINESS.phoneDisplay}</span>
            </TrackedPhoneLink>
            <a
              href={BUSINESS.emailHref}
              className="flex min-h-11 items-center gap-2 text-on-dark-hi/90 hover:text-cta-bright transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised"
            >
              <Mail aria-hidden="true" className="h-4 w-4 text-cta-bright" />
              <span>{BUSINESS.email}</span>
            </a>
            <address className="mt-2 not-italic text-on-dark-hi/85 leading-snug">
              {BUSINESS.addressFormatted}
            </address>
            <p className="mt-1 text-sm text-on-dark-hi/70">
              Collection timing is confirmed for each accepted job.
            </p>
            <TrackedOutboundLink
              href={BUSINESS.googleBusinessUrl}
              label="Caraway on Google"
              location="footer"
              className="mt-2 inline-flex items-center gap-2 text-on-dark-hi/90 hover:text-cta-bright transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised min-h-11"
            >
              <Star aria-hidden="true" className="h-4 w-4 text-cta-bright" />
              <span>View Caraway on Google</span>
            </TrackedOutboundLink>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-[hsl(var(--on-dark-hi)/0.2)] pt-12 sm:grid-cols-3">
          {/* Services */}
          <nav aria-label="Services">
            <h3 className={columnHeadingClasses}>Services</h3>
            <ul className="space-y-0.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations */}
          <nav aria-label="Locations">
            <h3 className={columnHeadingClasses}>Locations</h3>
            <ul className="space-y-0.5">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className={columnHeadingClasses}>Company</h3>
            <ul className="space-y-0.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Official references */}
        <div className="mt-14 pt-6 border-t border-[hsl(var(--on-dark-hi)/0.2)] flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-on-dark-hi/80">
          <span className="font-medium text-on-dark-hi">Official references:</span>
          {AUTHORITY_OUTBOUND_LINKS.map((item) => (
            <TrackedOutboundLink
              key={item.href}
              href={item.href}
              label={item.label}
              location="footer_references"
              className="inline-flex items-center min-h-11 hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised focus-visible:outline-none"
            >
              {item.label}
            </TrackedOutboundLink>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-[hsl(var(--on-dark-hi)/0.2)] pb-safe">
        <div className="site-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-dark-hi/80 font-medium">
          <p>&copy; {year} {BUSINESS.name} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised focus-visible:outline-none min-h-[44px] min-w-[44px] inline-flex items-center justify-center py-2.5 px-2 -mx-1 touch-manipulation"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
