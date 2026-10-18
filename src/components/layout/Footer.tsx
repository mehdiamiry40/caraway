import Link from "next/link";
import { Mail, Phone, Star } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Cash for Cars Brisbane", href: "/" },
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
  { label: "Get a quote", href: "/#quote-form" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const navLinkClasses = `text-muted-foreground hover:text-foreground transition-colors duration-200 text-base inline-flex items-center min-h-[44px] py-2 bg-background pr-2 touch-manipulation ${focusClasses}`;

const columnHeadingClasses =
  "inline-block bg-background pr-2 font-sans text-sm text-foreground mb-3 font-semibold";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grid-paper relative text-foreground pl-safe pr-safe">
      <div className="site-container py-16 sm:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10">
          {/* Brand + contact */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Link
              href="/"
              prefetch={false}
              className="inline-block bg-background pr-2 font-sans text-2xl font-semibold text-foreground transition-opacity duration-200 hover:opacity-75"
            >
              Caraway
            </Link>
            <p className="mt-4 max-w-sm bg-background text-[0.9375rem] text-muted-foreground leading-relaxed">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered.
            </p>

            <div className="mt-6 inline-flex flex-col gap-0.5 bg-background pr-3 text-[0.9375rem]">
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="footer"
                className={`inline-flex min-h-11 items-center gap-2 font-semibold text-foreground hover:opacity-75 transition-opacity duration-200 ${focusClasses}`}
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                <span>{BUSINESS.phoneDisplay}</span>
              </TrackedPhoneLink>
              <a
                href={BUSINESS.emailHref}
                className={`flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 ${focusClasses}`}
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                <span>{BUSINESS.email}</span>
              </a>
              <p className="text-muted-foreground">
                Collection timing is confirmed for each accepted job.
              </p>
              <address className="not-italic text-muted-foreground leading-snug">
                {BUSINESS.addressFormatted}
              </address>
              <TrackedOutboundLink
                href={BUSINESS.googleBusinessUrl}
                label="Caraway on Google"
                location="footer"
                className={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-11 ${focusClasses}`}
              >
                <Star aria-hidden="true" className="h-4 w-4" />
                <span>View Caraway on Google</span>
              </TrackedOutboundLink>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="md:col-span-1 lg:col-span-3">
            <p className={columnHeadingClasses}>Services</p>
            <ul className="flex flex-col items-start">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations */}
          <nav aria-label="Locations" className="md:col-span-1 lg:col-span-3">
            <p className={columnHeadingClasses}>Locations</p>
            <ul className="flex flex-col items-start">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="sm:col-span-2 md:col-span-1 lg:col-span-2">
            <p className={columnHeadingClasses}>Company</p>
            <ul className="flex flex-col items-start">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Official references */}
        <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="bg-background pr-1 font-semibold text-foreground">Official references:</span>
          {AUTHORITY_OUTBOUND_LINKS.map((item) => (
            <TrackedOutboundLink
              key={item.href}
              href={item.href}
              label={item.label}
              location="footer_references"
              className={`inline-flex items-center min-h-11 bg-background px-1 hover:text-foreground transition-colors duration-200 ${focusClasses}`}
            >
              {item.label}
            </TrackedOutboundLink>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      <div className="pb-safe">
        <div className="site-container pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-foreground/80">
          <p className="bg-background pr-2">Copyright &copy; {year}, {BUSINESS.name} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-1 bg-background px-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`underline underline-offset-[3px] hover:text-foreground transition-colors duration-200 min-h-[44px] min-w-[44px] inline-flex items-center justify-center py-2.5 px-2 -mx-1 touch-manipulation ${focusClasses}`}
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
