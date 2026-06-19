import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Cash for Cars Brisbane", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal Brisbane", href: "/car-removal-brisbane" },
  { label: "Sell My Car Brisbane", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Unwanted Cars", href: "/unwanted-cars-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

const locationLinks = [
  { label: "North Brisbane", href: "/locations/north-brisbane" },
  { label: "South Brisbane", href: "/locations/south-brisbane" },
  { label: "Logan", href: "/locations/logan" },
  { label: "Ipswich", href: "/locations/ipswich" },
  { label: "Redcliffe", href: "/locations/redcliffe" },
  { label: "Caboolture", href: "/locations/caboolture" },
  { label: "All locations", href: "/locations" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Get a quote", href: "/#price-estimator" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const navLinkClasses =
  "text-on-dark-hi/90 hover:text-on-dark-hi transition-colors duration-200 text-sm font-medium inline-flex items-center min-h-[44px] py-3 rounded-sm focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none touch-manipulation";

const columnHeadingClasses =
  "font-display text-xs text-on-dark-hi mb-5 tracking-[0.12em] uppercase font-bold flex items-center gap-2 before:content-[''] before:inline-block before:w-6 before:h-0.5 before:bg-cta";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-on-dark pl-safe pr-safe">
      <div className="h-1 bg-gradient-to-r from-cta via-accent to-white" aria-hidden="true" />
      <div className="site-container py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10">
          {/* Brand + contact */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Link
              href="/"
              className="font-display font-bold text-2xl tracking-[0.08em] uppercase inline-block transition-opacity duration-200 hover:opacity-80"
            >
              <span className="text-on-dark-hi">Caraway</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-on-dark-hi/85 leading-relaxed">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="footer"
                className="inline-flex items-center gap-2 text-on-dark-hi hover:opacity-90 transition-opacity duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-accent" />
                <span>{BUSINESS.phoneDisplay}</span>
              </TrackedPhoneLink>
              <a
                href={BUSINESS.emailHref}
                className="flex items-center gap-2 text-on-dark-hi/85 hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink font-medium"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                <span>{BUSINESS.email}</span>
              </a>
              <p className="text-on-dark-hi/85">
                <span className="font-medium text-on-dark-hi">{BUSINESS.hours}</span> · seven days
              </p>
              <address className="not-italic text-on-dark-hi/85 leading-snug">
                {BUSINESS.addressFormatted}
              </address>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="md:col-span-1 lg:col-span-3">
            <h3 className={columnHeadingClasses}>Services</h3>
            <ul className="space-y-0.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations */}
          <nav aria-label="Locations" className="md:col-span-1 lg:col-span-3">
            <h3 className={columnHeadingClasses}>Locations</h3>
            <ul className="space-y-0.5">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="sm:col-span-2 md:col-span-1 lg:col-span-2">
            <h3 className={columnHeadingClasses}>Company</h3>
            <ul className="space-y-0.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
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
              className="inline-flex items-center min-h-11 hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
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
                className="hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none min-h-[44px] inline-flex items-center py-2.5 px-1 -mx-1 touch-manipulation"
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
