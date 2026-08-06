import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DisclosureAutoClose } from "./DisclosureAutoClose";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function MobileMenuClient() {
  return (
    <div className="flex items-center lg:hidden">
      <DisclosureAutoClose className="group">
        <summary
          className="-mr-1 inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center text-primary transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6 group-open:hidden" aria-hidden="true" />
          <X className="hidden h-6 w-6 group-open:block" aria-hidden="true" />
        </summary>

        <div className="fixed inset-0 top-[var(--header-h)] z-[100] overflow-y-auto border-t border-border bg-background px-5 py-6 sm:px-6 lg:hidden">
          <nav aria-label="Mobile primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[54px] items-center border-b border-border text-lg font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                "h-14 w-full text-base",
              )}
            >
              Get my quote
            </Link>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
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
