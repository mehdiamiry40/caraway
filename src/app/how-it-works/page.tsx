import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Accordion } from "@/components/ui/accordion";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import {
  BUSINESS,
  HOW_IT_WORKS_CONTENT_UPDATED,
  SITE_URL,
} from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "How It Works — Sell Your Car for Cash in Brisbane",
  description: `See how Caraway's Brisbane cash-for-cars process works: share your vehicle details, get a confirmed offer, book free pickup, and get paid. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    type: "website",
    url: "/how-it-works",
    title: "How Caraway Works — Cash for Cars Brisbane",
    description:
      "Four clear steps to sell your car for cash in Brisbane: quote, confirmed offer, free pickup, and payment before the vehicle leaves.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: "Caraway cash for cars Brisbane pickup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Caraway Works — Cash for Cars Brisbane",
    description:
      "Four clear steps to sell your car for cash in Brisbane: quote, confirmed offer, free pickup, and payment before the vehicle leaves.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        alt: "Caraway cash for cars Brisbane pickup",
      },
    ],
  },
};

const canonical = `${SITE_URL}/how-it-works`;

/* Page-specific process FAQs. Deliberately distinct from the questions on
 * the homepage and /faq so each page owns its own Q&A content — this page
 * was previously clustered as a homepage duplicate in Search Console. */
const processFaqs = [
  {
    question: "Can the offer change when the driver arrives?",
    answer:
      "Not when the vehicle matches the details you provided — the confirmed offer is the amount that's paid, and towing is never deducted from it. If the driver finds something material that wasn't mentioned in the quote, it's discussed openly before anything is loaded, and you're free to decline.",
  },
  {
    question: "How long does my quote stay valid?",
    answer:
      "Offers reflect current parts, resale, and metal demand, so the number is firm for the pickup we book together. If time passes between the quote and your booking, we re-confirm the figure before dispatching a truck rather than revising it at the kerb.",
  },
  {
    question: "Can someone else hand the car over for me?",
    answer:
      "Often, yes — by arrangement. Tell us at booking who will be present, and we'll confirm the ID and authority needed for that sale. We also coordinate pickups directly with workshops during their access hours.",
  },
  {
    question: "What if the car can't roll or is in an awkward spot?",
    answer:
      "That's routine work for us. Flag it at booking — basement car park, locked gate, steep driveway, seized brakes, missing wheels — and the driver arrives with the right truck and recovery gear. Access details don't change the offer; they just help the pickup run to schedule.",
  },
];

const pickupChecklist = [
  "Current photo ID, such as a Queensland driver licence",
  "Registration papers or ownership records, if you have them",
  "All keys you hold, including spares",
  "Finance, insurer, or estate documents where they apply to the sale",
  "Personal belongings cleared out, and any e-tag or toll account noted so you can close it off",
];

const paperworkGuides = [
  {
    label: "How to transfer car ownership in QLD",
    href: "/blog/how-to-transfer-car-ownership-qld",
  },
  {
    label: "Cancelling rego after selling a car in QLD",
    href: "/blog/cancel-rego-after-selling-car-qld",
  },
  {
    label: "What paperwork you need to sell a car in QLD",
    href: "/blog/what-paperwork-to-sell-a-car-qld",
  },
  {
    label: "What happens with number plates when you sell",
    href: "/blog/number-plates-when-selling-car-qld",
  },
];

const h2Classes =
  "text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]";

const h3Classes = "font-display text-lg font-semibold text-primary mb-2";

const proseClasses = "text-muted-foreground leading-relaxed text-base sm:text-lg";

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "How It Works", item: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: "How Caraway Works",
            description:
              "How to sell your car for cash with Caraway in Brisbane, from quote to pickup and payment.",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            dateModified: HOW_IT_WORKS_CONTENT_UPDATED,
          },
        ]}
      />
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How it works" },
        ]}
        eyebrow="How it works"
        title="Sell your car in four clear steps."
        subtitle={
          <p>
            Share the details, get a confirmed offer, book free pickup, and get
            paid before the vehicle leaves.
          </p>
        }
      >
        <HowItWorks showHeader={false} />

        <section
          aria-labelledby="process-detail-heading"
          className="bg-background"
        >
          <div className="site-container max-w-4xl py-14 lg:py-20 space-y-12 sm:space-y-14">
            <div>
              <h2 id="process-detail-heading" className={h2Classes}>
                What actually happens at each step
              </h2>
              <p className={proseClasses}>
                The four cards above are the short version. Here is what each
                stage involves in practice, so there are no surprises between
                your first message and the truck pulling away.
              </p>

              <div className="mt-8">
                <h3 className={h3Classes}>1. Tell us about the car — about a minute</h3>
                <p className={proseClasses}>
                  The quote starts with four details: make, model, year, and an
                  honest description of condition. Use the quote tool below or
                  call {BUSINESS.phoneDisplay}. Add your suburb so we can plan
                  the pickup, and mention anything that affects loading — a flat
                  battery, missing wheels, a car that won&apos;t roll, or parking in
                  a basement or behind a gate. Photos aren&apos;t required, but a
                  few clear shots of the exterior, interior, and any damage help
                  us firm up the number faster. Accuracy pays here: the closer
                  the description matches the car, the less there is to discuss
                  on pickup day.
                </p>
              </div>

              <div className="mt-8">
                <h3 className={h3Classes}>2. Get a confirmed offer — within one business day</h3>
                <p className={proseClasses}>
                  We weigh the details against current parts, resale, and scrap
                  demand, then confirm an offer before any pickup is booked.
                  The offer is no-obligation — if it doesn&apos;t suit, nothing
                  happens and nobody chases you. If another buyer has given you
                  a written quote, tell us; we&apos;ll see what we can do. The
                  figure we confirm is the figure that&apos;s paid, provided the
                  vehicle matches what you described.
                </p>
              </div>

              <div className="mt-8">
                <h3 className={h3Classes}>3. Book the pickup — usually same- or next-day</h3>
                <p className={proseClasses}>
                  Once you accept, we agree a pickup window that suits you.
                  Most booked collections happen the same or next business day,
                  subject to truck availability, and weekend pickups can be
                  arranged. Towing is included anywhere in Greater Brisbane —
                  including Logan, Ipswich, Moreton Bay, and the Redlands —
                  with no distance surcharge. The driver arrives with equipment
                  matched to what you told us: winches and extended ramps for
                  non-runners, and an access plan for tight driveways or gated
                  complexes. We don&apos;t operate a public yard, so there&apos;s
                  nothing to drop off — every sale happens at your location.
                </p>
              </div>

              <div className="mt-8">
                <h3 className={h3Classes}>4. Payment, receipt, and the car leaves</h3>
                <p className={proseClasses}>
                  On the day, the driver checks the vehicle against the
                  description, then completes the agreed payment — cash or
                  cleared bank transfer, whichever was settled at booking —
                  before the car is loaded. You&apos;re handed a signed receipt
                  recording the vehicle identification and the buyer&apos;s
                  details. Only after payment is confirmed does the vehicle
                  leave your property.
                </p>
              </div>
            </div>

            <div>
              <h2 className={h2Classes}>What to have ready on pickup day</h2>
              <ul className="mt-2 space-y-3">
                {pickupChecklist.map((item) => (
                  <li key={item} className="flex gap-3 text-base text-foreground/80 sm:text-lg">
                    <CheckCircle2
                      className="mt-1 h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className={`${proseClasses} mt-5`}>
                None of the documents beyond photo ID are essential for every
                sale — we can look a vehicle up by VIN if the papers are long
                gone. For a fuller rundown, see our guide to{" "}
                <Link
                  href="/blog/preparing-your-car-for-pickup"
                  className="text-primary underline underline-offset-4 hover:text-accent-ink"
                >
                  preparing your car for pickup
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className={h2Classes}>After the sale: the Queensland paperwork</h2>
              <p className={proseClasses}>
                You leave the pickup with a signed receipt and the buyer&apos;s
                details — the records the seller-side steps with the Department
                of Transport and Main Roads (TMR) ask for. For a registered
                vehicle that usually means completing the transfer or
                cancelling the registration; unregistered sales rely on the
                receipt itself. Rules for number plates differ between
                transfers, cancellations, and personalised plates, so check the
                current TMR guidance for your situation and keep confirmation
                of whichever step you complete. It&apos;s also worth closing off
                tolls and insurance tied to the car the same day. These guides
                walk through each situation:
              </p>
              <ul className="mt-5 space-y-2">
                {paperworkGuides.map((guide) => (
                  <li key={guide.href}>
                    <Link
                      href={guide.href}
                      className="inline-flex min-h-11 items-center text-base font-medium text-primary underline underline-offset-4 hover:text-accent-ink"
                    >
                      {guide.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={h2Classes}>Common questions about the process</h2>
              <Accordion items={processFaqs} />
            </div>
          </div>
        </section>

        <PriceEstimator />
        <FinalCTA />
      </PageShell>
    </>
  );
}
