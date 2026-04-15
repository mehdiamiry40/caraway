import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS, FOOTER_INTERNAL_RESOURCES } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedFooterResourceLink } from "@/components/layout/TrackedFooterResourceLink";
import { TrackedGoogleBusinessLink } from "@/components/layout/TrackedGoogleBusinessLink";
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
  { label: "Bayside Brisbane", href: "/locations/bayside-brisbane" },
  { label: "North Lakes", href: "/locations/north-lakes" },
  { label: "All Locations", href: "/locations" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/#price-estimator" },
];

const linkClasses = "text-muted-foreground hover:text-primary hover:translate-x-0.5 transition-all duration-200 text-[15px] rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none inline-flex py-2 min-h-[44px] items-center touch-manipulation motion-reduce:hover:translate-x-0";

export function Footer() {
  return (
    <footer className="bg-muted text-foreground pl-safe pr-safe border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <nav aria-label="Footer navigation" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-8 lg:gap-12">

          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" aria-label="Caraway — Home" className="font-display font-bold text-2xl tracking-tight text-primary mb-4 block lowercase group">
              <span className="transition-opacity duration-200 group-hover:opacity-80">caraway<span className="text-accent">.</span></span>
            </Link>
            <p className="text-muted-foreground max-w-sm mt-3 leading-relaxed text-sm">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered. Use our online price estimator.
            </p>
            <div className="mt-8 space-y-3.5">
              <TrackedPhoneLink
                href={BUSINESS.phoneHref}
                location="footer"
                className="flex items-center gap-3.5 text-foreground hover:text-primary transition-all duration-200 group text-sm font-semibold"
                ariaLabel={`Call ${BUSINESS.phoneFriendly}`}
              >
                <span className="flex h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center group-hover:bg-primary/15 transition-all duration-200">
                  <Phone aria-hidden="true" className="h-4 w-4 text-primary" />
                </span>
                <span>{BUSINESS.phoneFriendly}</span>
              </TrackedPhoneLink>
              <a href={BUSINESS.emailHref} className="flex items-center gap-3.5 text-muted-foreground hover:text-primary transition-all duration-200 text-sm">
                <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{BUSINESS.email}</span>
              </a>
              <div className="flex items-start gap-3.5 text-muted-foreground text-sm">
                <Clock aria-hidden="true" className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <span className="font-medium text-foreground">{BUSINESS.hours}</span>
                  <span className="text-muted-foreground"> · </span>
                  {BUSINESS.hoursDetail}
                </span>
              </div>
              <div className="flex items-start gap-3.5 text-muted-foreground text-sm">
                <MapPin aria-hidden="true" className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <address className="not-italic leading-snug">
                    {BUSINESS.streetAddress}
                    <br />
                    {BUSINESS.addressSuburb} {BUSINESS.addressState} {BUSINESS.postalCode}
                  </address>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                    Registered address — not a public yard. We collect from you.
                  </p>
                </div>
              </div>
              <TrackedGoogleBusinessLink
                location="footer"
                className="flex items-center gap-3.5 text-muted-foreground hover:text-primary transition-all duration-200 text-sm"
              >
                <ExternalLink aria-hidden="true" className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Google Business profile</span>
              </TrackedGoogleBusinessLink>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-[13px] sm:text-xs uppercase tracking-[0.14em] text-primary mb-5 pb-2 border-b border-border/60">Services</h3>
            <ul className="space-y-1">
              {serviceLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-[13px] sm:text-xs uppercase tracking-[0.14em] text-primary mb-5 pb-2 border-b border-border/60">Locations</h3>
            <ul className="space-y-1">
              {locationLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-[13px] sm:text-xs uppercase tracking-[0.14em] text-primary mb-5 pb-2 border-b border-border/60">Company</h3>
            <ul className="space-y-1">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </nav>

        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-border/60">
          <h2 className="font-display font-bold text-[13px] sm:text-xs uppercase tracking-[0.14em] text-primary mb-5">
            Helpful resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">On this site</h3>
              <ul className="space-y-1">
                {FOOTER_INTERNAL_RESOURCES.map((item) => (
                  <li key={item.href}>
                    <TrackedFooterResourceLink href={item.href} label={item.label} className={linkClasses}>
                      {item.label}
                    </TrackedFooterResourceLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Official sources</h3>
              <ul className="space-y-1">
                {AUTHORITY_OUTBOUND_LINKS.map((item) => (
                  <li key={item.href}>
                    <TrackedOutboundLink
                      href={item.href}
                      label={item.label}
                      location="footer_resources"
                      className={`${linkClasses} gap-2 items-start`}
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 text-primary/50" aria-hidden="true" />
                      <span>{item.label}</span>
                    </TrackedOutboundLink>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground leading-snug">
                External links open in a new tab. Caraway is not affiliated with these government sites — they are provided for your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {BUSINESS.legalName} · ABN {BUSINESS.abn}</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center md:justify-end">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-3 px-2">Privacy Policy</Link>
            <span aria-hidden="true" className="w-px h-3 bg-border" />
            <Link href="/terms" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-3 px-2">Terms of Service</Link>
            <span aria-hidden="true" className="w-px h-3 bg-border" />
            <Link href="/accessibility" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-3 px-2">Accessibility</Link>
            <span aria-hidden="true" className="w-px h-3 bg-border" />
            <Link href="/site-map" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-3 px-2">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
