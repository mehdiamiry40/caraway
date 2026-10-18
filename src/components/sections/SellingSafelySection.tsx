import { ClipboardCheck, FileCheck2, Phone, ShieldCheck, Truck } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QLD_SELLING_GUIDANCE_URL } from "@/data/resource-links";

/* Only what this section uniquely owns: paperwork and records. Pricing and
   payment promises belong to WhyUs. */
const trustPoints = [
  { icon: FileCheck2, title: "QLD paperwork help" },
  { icon: ClipboardCheck, title: "Buyer details for your records" },
  { icon: Truck, title: "Pickup included when we buy" },
] as const;

export function SellingSafelySection() {
  return (
    <section className="section-y-tight bg-background border-t border-border" aria-labelledby="selling-safely-heading">
      <div className="site-container">
        <div className="flex flex-col items-center text-center">
          <ShieldCheck className="h-10 w-10 text-foreground" strokeWidth={1.25} aria-hidden="true" />
          <h2
            id="selling-safely-heading"
            className="mt-4 font-display text-[2rem] font-medium leading-[1.15] text-foreground sm:text-[2.5rem]"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            Selling safely with Caraway
          </h2>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {trustPoints.map(({ icon: Icon, title }) => (
            <li
              key={title}
              className="flex items-center gap-3 bg-secondary/60 p-4 sm:flex-col sm:gap-3 sm:p-6 sm:text-center"
            >
              <Icon className="h-7 w-7 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-display text-lg font-medium leading-snug text-foreground">{title}</h3>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-4">
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="selling_safely"
            className={cn(buttonVariants({ variant: "primary" }))}
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
          <p className="text-xs text-muted-foreground">
            Keep your own records and follow the{" "}
            <a
              href={QLD_SELLING_GUIDANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-ink underline underline-offset-4"
            >
              Queensland vehicle-selling guidance
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
