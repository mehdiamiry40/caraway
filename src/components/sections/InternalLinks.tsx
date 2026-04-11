import Link from "next/link";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";

interface InternalLinksProps {
  currentSlug?: string;
}

export function InternalLinks({ currentSlug }: InternalLinksProps) {
  // Show ALL services and suburbs (minus the current page) so every
  // internal page receives link equity from every other page.
  const allServices = services.filter(s => s.slug !== currentSlug);
  const allSuburbs = suburbs.filter(s => s.slug !== currentSlug);

  return (
    <section className="section-y bg-muted border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <div>
            <h2 className="text-sm font-display font-bold text-primary uppercase tracking-wider mb-4 sm:mb-5">Our Services</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
              {allServices.map(s => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    className="inline-flex items-center text-sm text-foreground/80 hover:text-accent transition-colors min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none break-words"
                  >
                    {s.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-primary uppercase tracking-wider mb-4 sm:mb-5">Areas We Service</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
              {allSuburbs.map(s => (
                <li key={s.slug}>
                  <Link
                    href={`/locations/${s.slug}`}
                    className="inline-flex items-center text-sm text-foreground/80 hover:text-accent transition-colors min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none break-words"
                  >
                    {s.h1}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-3">
              <Link
                href="/locations"
                className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline underline-offset-2 min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                View all locations
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
