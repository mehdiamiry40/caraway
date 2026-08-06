import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { DisclosureAutoClose } from "./DisclosureAutoClose";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenuClient() {
  return (
    <div className="flex items-center gap-1 lg:hidden">
      <a
        href={BUSINESS.phoneTel}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-primary hover:bg-secondary"
        aria-label={`Call ${BUSINESS.phoneDisplay}`}
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>

      <DisclosureAutoClose className="group">
        <summary
          className="inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6 group-open:hidden" aria-hidden="true" />
          <X className="hidden h-6 w-6 group-open:block" aria-hidden="true" />
        </summary>

        <div className="fixed inset-0 top-[var(--header-h)] z-[100] overflow-y-auto border-t border-border bg-background px-5 py-6 sm:px-6 lg:hidden">
          <nav aria-label="Mobile primary navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[54px] items-center border-b border-border/70 font-display text-lg font-semibold text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <Link
              href="/#price-estimator"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 w-full rounded-full text-base",
              )}
            >
              Get my quote
            </Link>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </DisclosureAutoClose>
    </div>
  );
}
