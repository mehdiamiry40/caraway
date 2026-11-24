import { Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QLD_SELLING_GUIDANCE_URL } from "@/data/resource-links";

/* Only what this section uniquely owns: paperwork and records. Pricing and
   payment promises belong to WhyUs. */
const trustPoints = [
  { title: "QLD paperwork help" },
  { title: "Buyer details for your records" },
  { title: "Pickup included when we buy" },
] as const;

export function SellingSafelySection() {
  return (
    <section className="section-y-tight border-t border-border bg-background" aria-labelledby="selling-safely-heading">
      <div className="site-container grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
        <h2 id="selling-safely-heading" className="type-h2 max-w-[14ch] lg:col-span-4">
          Selling safely with Caraway
        </h2>

        <div className="lg:col-span-8">
          <ul className="list-ticks grid grid-cols-1 gap-x-8 gap-y-3 !space-y-0 sm:grid-cols-3">
            {trustPoints.map(({ title }) => (
              <li key={title}>
                <h3 className="text-[1.0625rem] font-semibold leading-snug text-foreground">{title}</h3>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col items-start gap-x-7 gap-y-4 border-t border-border pt-6 sm:flex-row sm:items-center">
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="selling_safely"
              className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
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
      </div>
    </section>
  );
}
