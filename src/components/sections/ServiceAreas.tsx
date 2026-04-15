import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { suburbs } from "@/data/suburbs";

export function ServiceAreas() {
  return (
    <section
      className="section-y bg-muted"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Service areas
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display font-bold text-primary leading-[1.08] tracking-[-0.02em] text-balance">
            Free pickup across Greater Brisbane.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
            Brisbane, Ipswich, Logan, Redland Bay, and the Moreton Bay region.
            If you&apos;re a bit further out, ask — we usually make it work.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-border/60">
          {suburbs.map((suburb) => (
            <li key={suburb.slug} className="border-b border-border/60">
              <Link
                href={`/locations/${suburb.slug}`}
                className="group flex items-center justify-between gap-3 py-4 px-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors min-h-[44px]"
              >
                <span className="tracking-tight">
                  {suburb.h1.replace("Cash for Cars ", "")}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            View all locations
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
