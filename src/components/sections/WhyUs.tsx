import Link from "next/link";
import { ArrowRight, Lock, Handshake, Wallet, CarFront } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

const reasons = [
  {
    icon: Lock,
    title: "Quoted price guarantee",
    description:
      "The number we quote is the number you're paid — in writing before pickup, with no last-minute deductions at the door.",
  },
  {
    icon: Handshake,
    title: "Fully insured collections",
    description:
      "Public liability and goods-in-transit cover. If anything goes wrong loading the vehicle, we wear it — not you.",
  },
  {
    icon: Wallet,
    title: "Paid the moment we collect",
    description:
      "Cash or instant bank transfer before the truck moves. We never take the keys until the funds have landed.",
  },
  {
    icon: CarFront,
    title: "Any car, any condition",
    description:
      "Running, damaged, unregistered, written-off or fleet. If we're not the right fit, we'll tell you upfront.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="section-y bg-secondary">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="eyebrow mb-4">Why Caraway</p>
            <h2 className="text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
              A firm price. A clean pickup. Payment in hand.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg max-w-md">
              Private buyers flake, auctions lowball, dealers take weeks. We're
              a direct buyer — one offer, one pickup, paid before we drive away.
            </p>
            <Link
              href="/#price-estimator"
              className="mt-7 inline-flex items-center gap-1.5 font-semibold text-primary link-underline"
            >
              Get your firm offer
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
          </Reveal>

          <RevealGroup className="lg:col-span-7">
            <ul className="grid gap-5">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <RevealItem
                    key={reason.title}
                    as="li"
                    className="group relative rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_2px_6px_hsl(var(--shadow-color)/0.06),0_18px_40px_-14px_hsl(var(--shadow-color)/0.18)] hover:border-border-strong"
                  >
                    <div className="flex items-start gap-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.06] text-primary ring-1 ring-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[1.0625rem] sm:text-lg font-display font-semibold text-foreground">
                          {reason.title}
                        </h3>
                        <p className="mt-1.5 text-muted-foreground text-[0.9375rem] sm:text-base leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </ul>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
