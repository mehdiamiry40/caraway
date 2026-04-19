import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/motion";

export function ServiceAreas() {
  return (
    <section
      className="section-y bg-secondary/50 border-t border-b border-border/60"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <Reveal className="max-w-2xl mb-10 md:mb-12">
          <p className="eyebrow mb-5">Service areas</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
            Free pickup across
            <br />
            Greater Brisbane.
          </h2>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_20px_hsl(var(--shadow-color)/0.06)]">
            <iframe
              title="Caraway cash for cars service area — Greater Brisbane"
              src="https://www.google.com/maps?q=Brisbane+Queensland+Australia&z=9&output=embed"
              className="block h-[320px] w-full sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Map of Greater Brisbane showing Caraway's cash for cars service area"
            />
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-8 max-w-3xl text-muted-foreground leading-relaxed text-base sm:text-lg">
            Free pickup across Greater Brisbane — north to Caboolture, south to
            Beenleigh, east to Cleveland, west to Ipswich. Not listed? Call us
            — we usually make it work.
          </p>

          <div className="mt-6">
            <Link
              href="/locations"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary link-underline"
            >
              View every suburb we cover
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
