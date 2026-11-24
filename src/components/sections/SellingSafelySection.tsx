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

/** Green band: the three safety points, the call button, the guidance link. */
export function SellingSafelySection() {
  return (
    <section
      className="on-band on-band-green section-y-tight bg-accent text-on-dark-hi"
      aria-labelledby="selling-safely-heading"
    >
      <div className="site-container text-center">
        <h2 id="selling-safely-heading" className="type-h2 text-on-dark-hi">
          Selling safely with Caraway
        </h2>

        <ul className="list-ticks mx-auto mt-7 grid max-w-4xl grid-cols-1 justify-items-start gap-x-8 gap-y-4 !space-y-0 text-left sm:grid-cols-3 sm:justify-items-center">
          {trustPoints.map(({ title }) => (
            <li key={title}>
              <h3 className="text-xl font-bold leading-snug text-on-dark-hi">{title}</h3>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-4">
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="selling_safely"
            className={cn(buttonVariants({ size: "lg" }), "ring-offset-accent")}
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
          <p className="text-[1.0625rem] leading-relaxed text-on-dark-hi">
            Keep your own records and follow the{" "}
            <a
              href={QLD_SELLING_GUIDANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-on-dark-hi underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
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
