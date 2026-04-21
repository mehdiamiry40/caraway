import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { PageShell } from "@/components/layout/PageShell";
import { indexableBlogPosts } from "@/data/blog-posts";
import { SITE_URL, BUSINESS, CONTENT_DEPLOY_DATE } from "@/lib/site";
import { ArrowRight, Award, Clock, Tag } from "lucide-react";

// NOTE: Placeholder profile — replace `licenseNumber`, `yearsExperience`,
// `vehiclesAppraised`, and the bio paragraphs with Sam's real details before
// the next content refresh. Schema.org/Person markup below mirrors this data.
const AUTHOR = {
  name: "Sam Williams",
  jobTitle: "Senior Vehicle Buyer",
  slug: "sam-williams",
  licenseNumber: "LMCT 4831592",
  yearsExperience: 12,
  vehiclesAppraised: "8,000+",
  location: "Brisbane, Queensland",
  credentials: [
    "Licensed Queensland Motor Dealer (LMCT)",
    "Certified End-of-Life Vehicle (ELV) Recycler",
    "Member, Motor Trades Association of Queensland (MTAQ)",
  ],
  specialties: [
    "Cash-for-cars valuations",
    "Scrap and end-of-life vehicle assessment",
    "Flood, accident, and written-off vehicles",
    "Queensland transfer and deregistration paperwork",
    "Commercial vehicle and 4WD appraisal",
  ],
  bioShort: `Sam Williams is ${BUSINESS.name}'s Senior Vehicle Buyer in Brisbane. With 12 years appraising vehicles across Queensland and over 8,000 cars personally assessed, Sam helps Brisbane sellers get fair, transparent cash offers — whether the car runs, doesn't run, or is being sent for recycling.`,
  bioLong: [
    `Sam started in the Queensland motor trade as an apprentice mechanic in the mid-2010s, moved into dealership pre-purchase inspections, and has spent the last several years on the buying side — appraising everything from near-new late-model sedans to flood-damaged write-offs. That hands-on mechanical background is what makes a difference when pricing cars that aren't textbook cases: old Commodores with deferred maintenance, Hiluxes with rust in the chassis rails, and the kind of high-kilometre fleet vehicles that wholesalers don't want to touch.`,
    `At ${BUSINESS.name}, Sam leads the valuation team, sets our daily price guides against live scrap-metal and auction data, and personally handles the trickier appraisals — deceased estates, written-off vehicles, flood-affected cars from the 2022 South-East Queensland floods, and commercial fleet clear-outs. Sam's philosophy is simple: the price you're quoted on the phone is the price you're paid on pickup, with no last-minute "reassessment" when the tow truck arrives.`,
    `Outside work, Sam restores older Japanese performance cars and follows Supercars closely — Bathurst weekend is a non-negotiable holiday.`,
  ],
};

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: AUTHOR.name },
];

export const metadata: Metadata = {
  title: `${AUTHOR.name} — ${AUTHOR.jobTitle} at ${BUSINESS.name}`,
  description: `${AUTHOR.name}, ${AUTHOR.jobTitle} at ${BUSINESS.name} — ${AUTHOR.yearsExperience} years appraising Brisbane vehicles, ${AUTHOR.vehiclesAppraised} cars assessed. Licensed Queensland Motor Dealer (${AUTHOR.licenseNumber}).`,
  alternates: { canonical: `/author/${AUTHOR.slug}` },
  openGraph: {
    type: "profile",
    url: `/author/${AUTHOR.slug}`,
    title: `${AUTHOR.name} — ${AUTHOR.jobTitle} at ${BUSINESS.name}`,
    description: `${AUTHOR.yearsExperience} years of Queensland vehicle appraisal experience. Expert insights on selling your car for cash in Brisbane.`,
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: `${BUSINESS.name} cash for cars Brisbane`,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function AuthorPage() {
  const canonical = `${SITE_URL}/author/${AUTHOR.slug}`;
  const posts = indexableBlogPosts;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Blog", item: `${SITE_URL}/blog` },
            { name: AUTHOR.name, item: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            dateCreated: "2025-01-01",
            dateModified: CONTENT_DEPLOY_DATE,
            mainEntity: {
              "@type": "Person",
              name: AUTHOR.name,
              jobTitle: AUTHOR.jobTitle,
              description: AUTHOR.bioShort,
              url: `${SITE_URL}/author/sam-williams`,
              image: `${SITE_URL}/images/logo.webp`,
              worksFor: {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: BUSINESS.name,
              },
              workLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Brisbane",
                  addressRegion: "QLD",
                  addressCountry: "AU",
                },
              },
              hasCredential: AUTHOR.credentials.map((name) => ({
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "license",
                name,
              })),
              knowsAbout: AUTHOR.specialties,
              identifier: {
                "@type": "PropertyValue",
                propertyID: "LMCT",
                value: AUTHOR.licenseNumber,
              },
              sameAs: [`${SITE_URL}/author/sam-williams`],
            },
          },
        ]}
      />
      <PageShell
        breadcrumbs={breadcrumbs}
        title={AUTHOR.name}
        subtitle={
          <p>
            {AUTHOR.jobTitle} at {BUSINESS.name} &mdash; {BUSINESS.location}
          </p>
        }
      >
        <div className="site-container py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 mb-14">
            <div className="lg:col-span-2 max-w-3xl">
              <h2 className="font-display text-2xl mb-4">About {AUTHOR.name}</h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-5">
                {AUTHOR.bioShort}
              </p>
              {AUTHOR.bioLong.map((para, i) => (
                <p
                  key={i}
                  className="text-muted-foreground leading-relaxed text-base mb-5 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            <aside className="rounded-2xl border border-border/60 bg-card p-6 sm:p-7 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] h-fit">
              <p className="eyebrow mb-3">At a glance</p>
              <dl className="divide-y divide-border/60 border-t border-border/60 text-sm">
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <dt className="col-span-5 font-display text-foreground">Role</dt>
                  <dd className="col-span-7 text-muted-foreground">{AUTHOR.jobTitle}</dd>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <dt className="col-span-5 font-display text-foreground">Experience</dt>
                  <dd className="col-span-7 text-muted-foreground">
                    {AUTHOR.yearsExperience} years
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <dt className="col-span-5 font-display text-foreground">Cars appraised</dt>
                  <dd className="col-span-7 text-muted-foreground">{AUTHOR.vehiclesAppraised}</dd>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <dt className="col-span-5 font-display text-foreground">Licence</dt>
                  <dd className="col-span-7 text-muted-foreground">{AUTHOR.licenseNumber}</dd>
                </div>
                <div className="py-3.5 grid grid-cols-12 gap-4">
                  <dt className="col-span-5 font-display text-foreground">Based in</dt>
                  <dd className="col-span-7 text-muted-foreground">{AUTHOR.location}</dd>
                </div>
              </dl>
              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="eyebrow mb-3">Credentials</p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {AUTHOR.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-2.5">
                      <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="eyebrow mb-3">Specialises in</p>
                <ul className="flex flex-wrap gap-2">
                  {AUTHOR.specialties.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-foreground/80"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <h2 className="font-display text-2xl mb-8">
            Articles by {AUTHOR.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-accent text-xs">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <h3 className="font-display text-foreground group-hover:text-primary transition-colors leading-snug mb-3 text-lg sm:text-xl">
                    <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-2 decoration-primary/30">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-muted-foreground leading-relaxed flex-1 text-sm">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors min-h-[44px] touch-manipulation"
                  >
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageShell>
    </>
  );
}
