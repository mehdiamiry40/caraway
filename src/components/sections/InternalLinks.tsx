"use client";

import Link from "next/link";
import { services, type ServicePage } from "@/data/services";
import { suburbs, type SuburbPage } from "@/data/suburbs";
import { trackEvent } from "@/lib/analytics";

type InternalLinksPost = {
  relatedServices: string[];
  relatedSuburbs: string[];
};

interface InternalLinksProps {
  currentSlug?: string;
  post?: InternalLinksPost;
}

const CONTEXTUAL_TARGET = 6;

function pickContextual<T extends { slug: string }>(
  all: T[],
  preferredSlugs: string[],
  currentSlug: string | undefined,
  target: number,
): T[] {
  const available = all.filter((item) => item.slug !== currentSlug);
  const preferredSet = new Set(preferredSlugs);
  const preferred = available.filter((item) => preferredSet.has(item.slug));
  const seen = new Set(preferred.map((item) => item.slug));
  const fillers = available.filter((item) => !seen.has(item.slug));
  return [...preferred, ...fillers].slice(0, target);
}

export function InternalLinks({ currentSlug, post }: InternalLinksProps) {
  const isContextual = Boolean(post);

  const servicesToShow: ServicePage[] = isContextual
    ? pickContextual(services, post!.relatedServices, currentSlug, CONTEXTUAL_TARGET)
    : services.filter((s) => s.slug !== currentSlug);

  const suburbsToShow: SuburbPage[] = isContextual
    ? pickContextual(suburbs, post!.relatedSuburbs, currentSlug, CONTEXTUAL_TARGET)
    : suburbs.filter((s) => s.slug !== currentSlug);

  const variant: "contextual" | "exhaustive" = isContextual ? "contextual" : "exhaustive";

  const servicesHeading = isContextual ? "Related Services" : "Our Services";
  const suburbsHeading = isContextual ? "Related Areas We Service" : "Areas We Service";

  return (
    <section className="section-y bg-muted border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <div>
            <h2 className="text-sm font-display font-bold text-primary uppercase tracking-wider mb-4 sm:mb-5">{servicesHeading}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
              {servicesToShow.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    onClick={() => trackEvent("internal_link_click", { href: `/${s.slug}`, label: s.h1, variant })}
                    className="inline-flex items-center text-sm text-foreground/80 hover:text-accent transition-colors min-h-[44px] py-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none break-words"
                  >
                    {s.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-primary uppercase tracking-wider mb-4 sm:mb-5">{suburbsHeading}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
              {suburbsToShow.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/locations/${s.slug}`}
                    onClick={() => trackEvent("internal_link_click", { href: `/locations/${s.slug}`, label: s.h1, variant })}
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
