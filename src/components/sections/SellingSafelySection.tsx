import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { QLD_SELLING_GUIDANCE_URL } from "@/data/resource-links";

/* Only what this section uniquely owns. "Price confirmed before pickup" and
   "Paid before the vehicle leaves" were the same two promises WhyUs already
   makes, one section up — pricing and payment are its job, paperwork and
   records are this one's. */
const trustPoints = [
  {
    title: "QLD paperwork support",
    description: "We help with the transfer details a Queensland sale needs.",
  },
  {
    title: "Buyer details for your records",
    description: "You keep the buyer and sale details after pickup.",
  },
] as const;

export function SellingSafelySection() {
  return (
    <section className="section-y border-t border-border" aria-labelledby="selling-safely-heading">
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-4">Trust and safety</p>
          <h2
            id="selling-safely-heading"
            className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-foreground text-balance"
          >
            Selling safely with Caraway
          </h2>
        </div>

        <div className="lg:col-span-8">
          <ul className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {trustPoints.map(({ title, description }) => (
              <li key={title} className="border-t border-border pt-5">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-[65ch] text-sm text-muted-foreground">
            Requirements vary. See the current{" "}
            <a
              href={QLD_SELLING_GUIDANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
            >
              Queensland vehicle-selling guidance
            </a>
            . Questions?{" "}
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="selling_safely"
              className="rounded-sm text-foreground tabular-nums underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
