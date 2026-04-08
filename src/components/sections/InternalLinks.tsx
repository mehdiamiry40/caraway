import Link from "next/link";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";

interface InternalLinksProps {
  currentSlug?: string;
}

export function InternalLinks({ currentSlug }: InternalLinksProps) {
  const topServices = services.filter(s => s.slug !== currentSlug).slice(0, 6);
  const topSuburbs = suburbs.filter(s => s.slug !== currentSlug).slice(0, 8);

  return (
    <section className="section-y bg-gradient-to-b from-muted/60 to-muted/30 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <div>
            <h2 className="text-sm font-display font-bold text-primary/70 uppercase tracking-wider mb-4 sm:mb-5">Our Services</h2>
            <ul className="space-y-0.5">
              {topServices.map(s => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none group break-words"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors shrink-0" />
                    {s.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-primary/70 uppercase tracking-wider mb-4 sm:mb-5">Areas We Service</h2>
            <ul className="space-y-0.5">
              {topSuburbs.map(s => (
                <li key={s.slug}>
                  <Link
                    href={`/locations/${s.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none group break-words"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors shrink-0" />
                    {s.h1}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline underline-offset-2 min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  View all locations
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
