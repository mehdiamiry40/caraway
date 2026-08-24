import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeIntro() {
  return (
    <section className="section-y border-b border-border bg-background" aria-labelledby="home-intro-heading">
      <div className="site-container">
        <p className="eyebrow">Welcome to Caraway</p>
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <h2
            id="home-intro-heading"
            className="max-w-4xl font-display text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-display text-foreground lg:col-span-8"
          >
            A Brisbane buyer.<br />Not a broker.
          </h2>
          <div className="max-w-xl lg:col-span-4">
            <p className="text-base leading-relaxed text-foreground/78 sm:text-lg">
              We assess your vehicle, confirm the offer in writing, and arrange pickup when we buy—without listing it or sending you through an auction.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold">
              <Link href="/about" className="group inline-flex min-h-11 items-center gap-2 border-b border-border text-primary transition-colors hover:border-primary">
                Our approach
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="/how-it-works" className="group inline-flex min-h-11 items-center gap-2 border-b border-border text-primary transition-colors hover:border-primary">
                How it works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
