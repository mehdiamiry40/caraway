import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  "Human-reviewed vehicle assessment",
  "Pickup included when we buy",
  "Payment confirmed at pickup",
];

/**
 * Home hero. Plain type on the stone band with the quote form beside it: no
 * photograph sits behind the words, so the headline and the form never fight
 * a picture for contrast.
 */
export function Hero() {
  return (
    // The hero carries the quote form, so the whole block is one suppress
    // region: the sticky mobile CTA and chat launcher stay hidden until the
    // form is off screen.
    <div data-chat-launcher-suppress="true" data-sticky-cta-suppress="true">
      <section
        className="relative w-full border-b border-border bg-secondary"
        aria-labelledby="hero-heading"
      >
        <div className="mt-header-safe site-container grid grid-cols-1 items-start gap-10 pb-12 pt-9 sm:pb-16 sm:pt-12 lg:grid-cols-12 lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="lg:col-span-7 lg:pt-6">
            <p className="eyebrow">Brisbane-based car buyer</p>

            {/* "Cash for Cars Brisbane" stays one unbroken run of text for
                search. The second line is the deck: smaller, with the one
                gold rule in the hero. */}
            <h1 id="hero-heading" className="type-display mt-4 text-primary">
              <span className="block max-w-[12ch]">Cash for Cars Brisbane,</span>{" "}
              <span className="mt-4 block text-[0.5em] font-medium leading-[1.25] tracking-[-0.012em]">
                <span className="underline decoration-cta decoration-[0.12em] underline-offset-[0.22em]">
                  without the runaround.
                </span>
              </span>
            </h1>

            <p className="type-lead mt-7 max-w-[34rem] text-foreground/80">
              Request an assessment in minutes. Caraway is a Brisbane-based car
              buyer: you get a written offer before anything is booked, pickup
              is included when we buy, and payment is confirmed at collection.
            </p>

            <ul className="list-ticks mt-6 text-base font-medium text-foreground">
              {promises.map((promise) => (
                <li key={promise}>{promise}</li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* On wide screens the form sits beside this copy, so the jump
                  link is only needed where the form is further down. */}
              <Link
                href="#quote-form"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto lg:hidden")}
              >
                Get my quote
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>

              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="hero"
                className="group inline-flex min-h-12 items-baseline gap-2.5 rounded-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
                ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
              >
                <span className="text-base text-foreground/80">or call</span>
                <span className="text-[1.625rem] font-bold leading-none tabular-nums tracking-[-0.01em] underline decoration-primary/30 decoration-2 underline-offset-[6px] group-hover:decoration-primary">
                  {BUSINESS.phoneDisplay}
                </span>
              </TrackedPhoneLink>

              <Link href="/how-it-works" className="link-arrow text-base ring-offset-secondary">
                How it works
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* The quote card is the home page's only quote surface: it is
              server-rendered with the page, so the primary conversion path and
              the #quote-form deep link still work for crawlers and JS-off
              users. */}
          <div className="lg:col-span-5">
            <div
              id="quote-form"
              className="relative mx-auto w-full max-w-[32rem] scroll-mt-header rounded-xl border border-border border-t-4 border-t-primary bg-card text-card-foreground shadow-xl lg:ml-auto lg:mr-0"
            >
              <div className="px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
                <HeroQuoteForm />
                <p className="mt-5 border-t border-border pt-4 text-center text-[0.8125rem] text-muted-foreground">
                  Brisbane-based · ABN {BUSINESS.abn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
