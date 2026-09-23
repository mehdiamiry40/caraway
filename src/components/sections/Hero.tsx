import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";
import { BUSINESS } from "@/lib/site";

export function Hero() {
  return (
    <section
      data-chat-launcher-suppress="true"
      data-sticky-cta-suppress="true"
      className="w-full"
      aria-labelledby="hero-heading"
    >
      <div className="site-container mt-header-safe grid grid-cols-1 gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-6 lg:pt-4">
          <h1
            id="hero-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground text-pretty sm:text-5xl"
          >
            A clearer way to sell your car.{" "}
            <span className="text-muted-foreground">Request an assessment in minutes.</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-lg text-muted-foreground">
            Human-reviewed vehicle assessment and pickup across Greater Brisbane.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Prefer to talk?{" "}
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="hero"
              className="rounded-sm text-foreground tabular-nums underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
          </p>
        </div>

        {/* The hero form is the primary call to action and carries the
            #quote-form id, so every "get a quote" link lands on it. */}
        <div id="quote-form" className="scroll-mt-header lg:col-span-6">
          <HeroQuoteForm />
        </div>
      </div>
    </section>
  );
}
