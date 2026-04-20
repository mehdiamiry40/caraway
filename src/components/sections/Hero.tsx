import { Star, CheckCircle2, ShieldCheck } from "lucide-react";
import { HeroCTAs } from "./HeroCTAs";
import { HeroImage } from "./HeroImage";

const valueProps = [
  "Firm cash offers up to $9,999",
  "Free pickup across Greater Brisbane",
  "Paid on the spot — cash or bank transfer",
  "Any make, any model, any condition",
  "Same- or next-day removal, seven days",
];

export function Hero() {
  return (
    <section
      className="relative w-full mt-header-safe aurora-surface"
      aria-labelledby="hero-heading"
    >
      <div className="site-container pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Copy */}
          <div className="relative lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border pl-1.5 pr-4 py-1 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.05)]">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2 py-0.5 text-[0.75rem] font-semibold">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                4.9
              </span>
              <span className="text-[0.8125rem] text-muted-foreground">
                Rated by 300+ Brisbane sellers on Google
              </span>
            </div>

            <h1
              id="hero-heading"
              className="mt-6 font-display font-bold text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] tracking-[var(--tracking-display)] text-foreground text-balance"
            >
              Honest{" "}
              <span className="text-gradient">cash for cars</span>
              <br />
              across Brisbane.
            </h1>

            <p className="mt-6 max-w-xl text-[1.0625rem] sm:text-lg leading-relaxed text-muted-foreground">
              A fair, written offer in minutes — then a free pickup at a time
              that suits you. We pay on the spot, any condition, any make.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 max-w-xl">
              {valueProps.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.9375rem] text-foreground"
                >
                  <CheckCircle2
                    className="h-[18px] w-[18px] shrink-0 text-success mt-[3px]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <HeroCTAs />
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2} aria-hidden="true" />
              Licensed, insured & ABN registered — no obligation to accept.
            </p>
          </div>

          {/* Product shot */}
          <div className="relative lg:col-span-5">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}
