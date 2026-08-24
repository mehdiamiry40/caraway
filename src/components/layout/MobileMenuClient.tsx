import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DisclosureAutoClose } from "./DisclosureAutoClose";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

type ServiceLink = { label: string; href: string };

interface Props {
  serviceLinks: ServiceLink[];
}

export function MobileMenuClient({ serviceLinks }: Props) {
  return (
    <div className="lg:hidden flex items-center gap-1">
      <a
        href={BUSINESS.phoneTel}
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Call ${BUSINESS.phoneDisplay}`}
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>

      <DisclosureAutoClose className="group">
        <summary
          className="-mr-1 inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center text-primary transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
          aria-label="Menu"
        >
          <Menu aria-hidden="true" className="h-6 w-6 group-open:hidden" />
          <X aria-hidden="true" className="hidden h-6 w-6 group-open:block" />
        </summary>

        <div className="fixed inset-0 top-[var(--header-h)] z-[100] overflow-y-auto overscroll-contain border-t border-[hsl(var(--on-dark-hi)/0.18)] bg-ink-deep px-5 py-5 text-on-dark-hi shadow-lg sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile primary navigation">
            <details className="group/services">
              <summary className="-mx-2 flex min-h-[56px] cursor-pointer list-none items-center justify-between border-b border-[hsl(var(--on-dark-hi)/0.18)] px-2 py-3.5 font-display text-base text-on-dark-hi transition-colors duration-200 hover:bg-[hsl(var(--on-dark-hi)/0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-inset sm:text-lg [&::-webkit-details-marker]:hidden">
                <span>Services</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 ease-out group-open/services:rotate-180"
                />
              </summary>
              <ul className="flex list-none flex-col pl-3">
                {serviceLinks.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="-mx-2 flex min-h-11 items-center border-l border-[hsl(var(--on-dark-hi)/0.18)] px-4 py-2.5 text-sm font-medium text-on-dark-hi/68 transition-colors duration-200 hover:bg-[hsl(var(--on-dark-hi)/0.06)] hover:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-inset sm:text-base"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/services"
                    className="-mx-2 flex min-h-11 items-center border-l border-cta px-4 py-2.5 text-sm font-semibold text-cta-bright transition-colors duration-200 hover:bg-[hsl(var(--on-dark-hi)/0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-inset sm:text-base"
                  >
                    All services
                  </Link>
                </li>
              </ul>
            </details>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="-mx-2 flex min-h-[56px] items-center border-b border-[hsl(var(--on-dark-hi)/0.18)] px-2 py-3.5 font-display text-base text-on-dark-hi/88 transition-colors duration-200 hover:bg-[hsl(var(--on-dark-hi)/0.06)] hover:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-inset sm:text-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3 border-t border-[hsl(var(--on-dark-hi)/0.18)] pt-6">
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex h-14 w-full items-center justify-center gap-2 border border-on-dark-hi/70 text-base text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep sm:text-lg"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {BUSINESS.phoneDisplay}
            </a>
            <Link
              href="/#quote-form"
              prefetch={false}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 w-full text-base sm:text-lg",
              )}
            >
              Get my quote
            </Link>
          </div>
        </div>
      </DisclosureAutoClose>
    </div>
  );
}
