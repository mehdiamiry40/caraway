import Link from "next/link";
import { Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { LocationsFilter } from "@/components/sections/LocationsFilter";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" }
];

const coverageRegions = [
  {
    title: "Inner west and western Brisbane",
    description:
      "Use the Toowong guide for Auchenflower, Taringa, St Lucia, Indooroopilly, and Paddington. Use Kenmore for Chapel Hill, Fig Tree Pocket, Brookfield, Bellbowrie, and The Gap. Ipswich-corridor enquiries are checked against availability for the exact address.",
    links: [
      { label: "Toowong and inner west", href: "/locations/toowong" },
      { label: "Kenmore and western Brisbane", href: "/locations/kenmore" },
    ],
  },
  {
    title: "South Brisbane and south-west",
    description:
      "The Moorooka guide covers southside enquiries from Annerley and Rocklea through Sunnybank and Mount Gravatt, including workshop, industrial, residential, and flood-affected vehicle access questions.",
    links: [
      { label: "Moorooka and South Brisbane", href: "/locations/moorooka" },
    ],
  },
  {
    title: "Logan corridor",
    description:
      "Use the Logan, Springwood, and Beenleigh guides for central, north-east, and southern Logan enquiries, including larger blocks and workshop sites.",
    links: [
      { label: "Logan", href: "/locations/logan" },
      { label: "Springwood", href: "/locations/springwood" },
      { label: "Beenleigh", href: "/locations/beenleigh" },
    ],
  },
  {
    title: "North Brisbane and Moreton Bay",
    description:
      "North Brisbane enquiries include Chermside, Nundah, Stafford, Everton Park, Ascot, Clayfield, New Farm, and Newstead. The Redcliffe guide also covers peninsula and wider Moreton Bay addresses such as North Lakes and Caboolture.",
    links: [
      { label: "Redcliffe and Moreton Bay", href: "/locations/redcliffe" },
    ],
  },
  {
    title: "East Brisbane, Redlands, and bayside",
    description:
      "The Capalaba guide covers eastern and bayside enquiries including Alexandra Hills, Birkdale, Wynnum, Manly, Carindale, Bulimba, and Hawthorne. Exact-address availability and access are confirmed before booking.",
    links: [
      { label: "Capalaba and Brisbane bayside", href: "/locations/capalaba" },
    ],
  },
];

export default function Locations() {
  const locationItems = suburbs.map((suburb) => ({
    slug: suburb.slug,
    h1: suburb.h1,
    summary: suburb.metaDescription,
  }));

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="Locations"
      title="Vehicle pickup areas across Greater Brisbane."
      subtitle={
        <p>
          Browse the retained local guides below or use the regional coverage
          summary for a suburb that is not listed. Pickup is included when
          Caraway buys; the exact address, access, vehicle details, payment
          method, and available window are confirmed first. You can also{" "}
          <Link href="/#price-estimator" className="text-primary font-medium link-underline">request a quote</Link>.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <LocationsFilter items={locationItems} />

        <section className="mt-16 sm:mt-20" aria-labelledby="regional-coverage-heading">
          <p className="eyebrow mb-3">Regional coverage</p>
          <h2
            id="regional-coverage-heading"
            className="text-2xl sm:text-3xl font-display text-foreground mb-4"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            If your suburb does not have a separate page.
          </h2>
          <p className="max-w-3xl text-muted-foreground leading-relaxed mb-8">
            Use these regional guides to check likely coverage and the access
            details Caraway needs. Availability and collection timing are
            confirmed for the exact vehicle and address before booking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coverageRegions.map((region) => (
              <article key={region.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg text-foreground mb-3">{region.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {region.description}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {region.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm font-medium text-primary link-underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-16 rounded-md border border-border/60 bg-secondary/60 p-8 sm:p-10 text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Not sure?</p>
          <h2 className="text-xl sm:text-2xl font-display text-foreground mb-3" style={{ letterSpacing: "var(--tracking-tight)" }}>Your suburb not listed?</h2>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto">
            Send the exact address and access details even if your suburb is not
            shown above. Caraway will confirm whether purchase and pickup are
            available for that vehicle and location. You can also call {BUSINESS.phoneDisplay}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={BUSINESS.phoneTel}
              className={cn(buttonVariants({ variant: "primary" }), "w-full sm:w-auto")}
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Call {BUSINESS.phoneDisplay}
            </a>
            <Link
              href="/#price-estimator"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              Get my quote
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
