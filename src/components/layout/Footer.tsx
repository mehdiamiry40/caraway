import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

const serviceLinks = [
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
  "text-primary-foreground/80 hover:text-accent transition-colors duration-200 text-sm inline-flex items-center min-h-[44px] py-2 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none touch-manipulation";

const columnHeadingClasses = "font-display font-semibold text-sm text-primary-foreground mb-3";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-primary-foreground border-t border-primary-foreground/10 pl-safe pr-safe [background:var(--footer-wash)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">

          {/* Brand + contact */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label="Caraway — Home"
              className="font-display font-bold text-2xl tracking-tight text-primary lowercase inline-block transition-opacity duration-200 hover:opacity-80"
            >
              caraway<span className="text-accent">.</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/80 leading-relaxed">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <TrackedPhoneLink
                href={BUSINESS.phoneHref}
                location="footer"
                className="inline-flex items-center gap-2 font-semibold text-primary-foreground hover:text-accent transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                ariaLabel={`Call ${BUSINESS.phoneFriendly}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-accent" />
                <span>{BUSINESS.phoneFriendly}</span>
              </TrackedPhoneLink>
              <a
                href={BUSINESS.emailHref}
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                <span>{BUSINESS.email}</span>
              </a>
              <p className="text-primary-foreground/80">
                <span className="font-medium text-primary-foreground">{BUSINESS.hours}</span> · seven days
              </p>
              <address className="not-italic text-primary-foreground/80 leading-snug">
                {BUSINESS.addressFormatted}
              </address>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-3">
            <h3 className={columnHeadingClasses}>Services</h3>
            <ul className="space-y-0.5">
              {serviceLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations */}
          <nav aria-label="Locations" className="lg:col-span-3">
            <h3 className={columnHeadingClasses}>Locations</h3>
            <ul className="space-y-0.5">
              {locationLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="sm:col-span-2 lg:col-span-2">
            <h3 className={columnHeadingClasses}>Company</h3>
            <ul className="space-y-0.5">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Official references — compact replacement for the old resources block */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-primary-foreground/60">
          <span className="font-medium text-primary-foreground">Official references:</span>
          {AUTHORITY_OUTBOUND_LINKS.map(item => (
            <TrackedOutboundLink
              key={item.href}
              href={item.href}
              label={item.label}
              location="footer_references"
              className="hover:text-accent transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
            >
              {item.label}
            </TrackedOutboundLink>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-primary-foreground/10 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <p>&copy; {year} {BUSINESS.legalName} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {legalLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation"
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
