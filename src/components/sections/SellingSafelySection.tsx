import {
  BadgeDollarSign,
  ClipboardCheck,
  FileCheck2,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const trustPoints = [
  {
    icon: BadgeDollarSign,
    title: "Price confirmed before pickup",
    description:
      "We confirm your price before the truck is booked, so there are no surprise deductions after arrival.",
  },
  {
    icon: ShieldCheck,
    title: "Paid before the vehicle leaves",
    description:
      "Your agreed payment is handled before your keys and vehicle leave your property.",
  },
  {
    icon: FileCheck2,
    title: "QLD paperwork support",
    description:
      "We help with the transfer details needed for a Queensland vehicle sale and keep the process clear.",
  },
  {
    icon: ClipboardCheck,
    title: "Buyer details for your records",
    description:
      "You receive buyer details and sale information so you can keep your own records after pickup.",
  },
  {
    icon: Truck,
    title: "Free towing included",
    description:
      "Pickup is included in the offer. We do not add hidden towing or call-out fees after arrival.",
  },
] as const;

export function SellingSafelySection() {
  return (
    <section className="section-y-tight bg-background border-t border-border/70" aria-labelledby="selling-safely-heading">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))]">
            <p className="eyebrow mb-4">Trust and safety</p>
            <h2
              id="selling-safely-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.08] text-foreground mb-5"
              style={{ letterSpacing: "var(--tracking-tight)" }}
            >
              Selling safely with Caraway
            </h2>
            <p className="text-foreground/80 text-base sm:text-lg leading-relaxed">
              We make the car selling process clear from quote to pickup, so you know what to expect before your vehicle leaves.
            </p>

            <div className="mt-7 border border-border bg-secondary p-5 sm:p-6">
              <p className="text-sm font-medium text-foreground">Questions before you book?</p>
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="selling_safely"
                className={cn(buttonVariants({ variant: "primary" }), "mt-3")}
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {trustPoints.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 border border-border bg-card p-4 sm:block sm:p-5"
                >
                  <div className="row-span-2 flex h-10 w-10 items-center justify-center bg-cta/15 text-cta sm:mb-4 sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <h3 className="mb-1 font-display text-base leading-snug text-primary sm:mb-2 sm:text-lg">{title}</h3>
                  <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-5 border border-border bg-muted px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              Vehicle transfer requirements can vary depending on the situation. Always keep your own sale records and follow current QLD Transport guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
