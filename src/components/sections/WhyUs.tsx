import Link from "next/link";
import { Starburst } from "@/components/decor/Starburst";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

interface Reason {
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    title: "One quoted price, locked in writing",
    description:
      "Confirmed before the truck is booked. If the vehicle matches the details you gave, nothing is deducted on the day.",
  },
  {
    title: "Paid when we pick up",
    description:
      "We don't drive away with your keys until you've been paid the agreed amount.",
  },
  {
    title: "Rough to written off",
    description:
      "Old daily drivers, damaged, unregistered, scrap, fleet. If it's not a fit, we'll say so upfront.",
  },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="scroll-mt-header bg-secondary"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container grid grid-cols-1 items-center gap-10 pt-16 pb-12 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pt-24 lg:pb-16">
        <div className="order-2 lg:order-1">
          <h2
            id="why-us-heading"
            className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] text-primary"
          >
            One price. One pickup. Done.
          </h2>
          <div className="mt-7 max-w-[30rem] space-y-4 text-[0.9375rem] leading-relaxed text-primary">
            <p>Private buyers flake. Dealers lowball. We&apos;re a buyer, not an auction.</p>
            <p>
              Caraway buys vehicles across Greater Brisbane, from daily drivers to
              cars that haven&apos;t moved in years. You get an estimate from a few
              details, then a confirmed offer in writing before any pickup is booked.
            </p>
            <p>
              Brisbane-based, ABN {BUSINESS.abn}.{" "}
              <Link
                href="/about"
                className="underline decoration-accent underline-offset-4 transition-colors hover:text-accent-ink"
              >
                More about Caraway
              </Link>
              .
            </p>
          </div>
        </div>
        <Starburst className="order-1 mx-auto w-[min(72%,20rem)] lg:order-2 lg:mr-0 lg:w-full lg:max-w-[34rem]" />
      </div>

      <div className="site-container pb-16 sm:pb-20 lg:pb-28">
        <div className="bg-primary px-6 py-12 text-on-dark-hi sm:px-12 sm:py-16 lg:px-20 lg:py-20">
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:gap-16">
            {reasons.map((reason) => (
              <li key={reason.title}>
                <h3 className="border-b border-accent pb-5 font-display text-[1.4rem] leading-snug text-on-dark-hi md:min-h-[4.6em]">
                  {reason.title}
                </h3>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-on-dark-hi/90">
                  {reason.description}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/#price-estimator"
            prefetch={false}
            className={cn(
              buttonVariants(),
              "mt-12 border-card bg-card font-normal text-cta-ink hover:border-cta hover:bg-cta hover:text-cta-foreground lg:mt-16",
            )}
          >
            Get my quote
          </Link>
        </div>
      </div>
    </section>
  );
}
