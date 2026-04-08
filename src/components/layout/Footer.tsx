import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/site";

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
  { label: "All Locations", href: "/locations" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/#quote-section" },
];

const linkClasses = "text-white/55 hover:text-white hover:translate-x-0.5 transition-all duration-200 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none inline-block py-1.5 min-h-[44px] flex items-center touch-manipulation";

export function Footer() {
  return (
    <footer className="bg-primary text-white pl-safe pr-safe">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-8 lg:gap-12">

          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-white mb-4 block lowercase group">
              <span className="transition-opacity duration-200 group-hover:opacity-90">caraway<span className="text-accent">.</span></span>
            </Link>
            <p className="text-white/50 max-w-sm mt-3 leading-relaxed text-sm">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered. Call or send the form.
            </p>
            <div className="mt-8 space-y-3.5">
              <a href={BUSINESS.phoneHref} className="flex items-center gap-3.5 text-white/70 hover:text-white transition-all duration-200 group text-sm">
                <span className="flex h-10 w-10 rounded-xl bg-white/[0.06] items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all duration-200">
                  <Phone className="h-4 w-4 text-accent" />
                </span>
                <span className="font-medium">{BUSINESS.phone}</span>
              </a>
              <a href={BUSINESS.emailHref} className="flex items-center gap-3.5 text-white/70 hover:text-white transition-all duration-200 group text-sm">
                <span className="flex h-10 w-10 rounded-xl bg-white/[0.06] items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all duration-200">
                  <Mail className="h-4 w-4 text-accent" />
                </span>
                <span>{BUSINESS.email}</span>
              </a>
              <div className="flex items-center gap-3.5 text-white/50 text-sm">
                <span className="flex h-10 w-10 rounded-xl bg-white/[0.06] items-center justify-center">
                  <MapPin className="h-4 w-4 text-white/40" />
                </span>
                <span>{BUSINESS.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white/40 mb-5 pb-2 border-b border-white/[0.06]">Services</h4>
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
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white/40 mb-5 pb-2 border-b border-white/[0.06]">Locations</h4>
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
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white/40 mb-5 pb-2 border-b border-white/[0.06]">Company</h4>
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

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08] pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Caraway. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-white/70 transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-2 px-1">Privacy Policy</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link href="/terms" className="hover:text-white/70 transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-2 px-1">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
