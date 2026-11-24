import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/templates/PagePieces";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Accordion } from "@/components/ui/accordion";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import {
  BUSINESS,
  HOW_IT_WORKS_CONTENT_UPDATED,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "How Our Vehicle Buying Process Works",
  description: `See how Caraway assesses a Brisbane vehicle, documents an offer, confirms conditional pickup and payment terms, and records the sale. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/how-it-works",
    title: "How Selling to Caraway Works | Brisbane",
    description:
      "Four clear steps covering vehicle details, individual assessment, conditional collection, payment, and sale records.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 800,
        height: 800,
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Selling to Caraway Works | Brisbane",
    description:
      "Four clear steps covering vehicle details, individual assessment, conditional collection, payment, and sale records.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        alt: SHARED_PICKUP_IMAGE_ALT,
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
      "The written offer states the vehicle and access details it assumes. When those details match, Caraway honours the agreed figure and included-pickup terms. A material difference is discussed before loading, and the seller can decline a revised offer.",
  },
  {
    question: "How long does my quote stay valid?",
    answer:
      "The written offer should state its validity period. If it expires or the vehicle, location, or access changes, Caraway rechecks the details and confirms the current terms before dispatch.",
  },
  {
    question: "Can someone else hand the car over for me?",
    answer:
      "It may be possible by prior arrangement. Tell Caraway who will be present so the identity, authority, vehicle records, and site-access requirements can be confirmed before collection.",
  },
  {
    question: "What if the car can't roll or is in an awkward spot?",
    answer:
      "Flag a basement car park, locked gate, steep driveway, seized brakes, missing wheels, soft ground, or other constraint before the quote is confirmed. Access can affect feasibility, equipment, timing, and the offer.",
  },
];

const pickupChecklist = [
  { text: "Current photo ID, such as a Queensland driver licence" },
  { text: "Registration papers or ownership records, if you have them" },
  { text: "All keys you hold, including spares" },
  { text: "Finance, insurer, or estate documents where they apply to the sale" },
  { text: "Personal belongings cleared out, and any e-tag or toll account noted so you can close it off" },
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

const h3Classes = "mb-2 text-xl font-bold leading-snug text-primary";

const proseClasses = "text-[1.0625rem] leading-[1.7] text-foreground";

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
              "How Caraway assesses a Brisbane vehicle and confirms an offer, collection plan, payment arrangement, and sale records.",
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
        title="Sell your car in four clear steps."
        subtitle={
          <p>
            Details, offer, pickup, payment — the four steps behind every{" "}
            <Link href="/">
              cash for cars Brisbane
            </Link>{" "}
            sale with Caraway.
          </p>
        }
      >
        <HowItWorks showHeader={false} />

        <section
          aria-labelledby="process-detail-heading"
          className="bg-background"
        >
          <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div>
              <SectionHeading id="process-detail-heading">
                What actually happens at each step
              </SectionHeading>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  1. Tell us about the car
                </h3>
                <p className={proseClasses}>
                  The assessment starts with the vehicle, condition, contact,
                  and pickup details requested in the quote tool below, or you
                  can call {BUSINESS.phoneDisplay}. Mention anything that affects
                  loading — a flat battery, missing wheels, a car that won&apos;t
                  roll, or parking in a basement or behind a gate. Clear photos
                  of the exterior, interior, access, and any damage help the
                  assessment. Accurate details reduce the chance that the offer
                  or collection plan needs to change later.
                </p>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  2. Review an individual offer
                </h3>
                <p className={proseClasses}>
                  We weigh the details against current parts, resale, and scrap
                  demand, ownership, location, and access, then decide whether to
                  make an offer. The written terms record the assumptions,
                  validity period, included pickup, and circumstances in which
                  the figure could change. You can accept or decline it.
                </p>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  3. Confirm the collection plan
                </h3>
                <p className={proseClasses}>
                  Once you accept, Caraway confirms a collection window based on
                  the vehicle, location, access, seller availability, and assigned
                  operator. Pickup is included when Caraway buys and those details
                  match the agreed terms. A non-running vehicle, height limit,
                  narrow driveway, gate, slope, soft ground, or missing wheel must
                  be disclosed so feasibility and equipment can be confirmed.
                  Do not move or deliver the vehicle to an address unless that
                  location is part of the agreed collection plan.
                </p>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  4. Payment, receipt, and the car leaves
                </h3>
                <p className={proseClasses}>
                  On the day, the assigned operator checks the vehicle against the
                  description. The parties follow the payment method and timing
                  agreed before dispatch, and the seller confirms the agreed funds
                  before handover. Retain a receipt recording the vehicle, date,
                  amount, and buyer details, plus evidence of the Queensland
                  seller steps that apply to the transaction.
                </p>
              </div>
            </div>

            <div>
              <SectionHeading>What to have ready on pickup day</SectionHeading>
              <ul className="list-ticks space-y-4 text-[1.0625rem] text-foreground">
                {pickupChecklist.map(({ text }) => (
                  <li key={text}>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p className={`${proseClasses} mt-5`}>
                An assessment can usually start from the vehicle details, VIN,
                photos, and current identification. Completing a sale requires
                the ownership authority and registration, finance, insurer,
                estate, company, or other transaction records that apply; a VIN
                lookup does not prove ownership or authority to sell. For a
                fuller rundown, see our guide to{" "}
                <Link
                  href="/blog/preparing-your-car-for-pickup"
                  className="font-medium text-primary link-underline"
                >
                  preparing your car for pickup
                </Link>
                .
              </p>
            </div>

            <div>
              <SectionHeading>After the sale: the Queensland paperwork</SectionHeading>
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
              <ul className="mt-6 border-t-2 border-primary">
                {paperworkGuides.map((guide) => (
                  <li key={guide.href} className="border-b border-border">
                    <Link
                      href={guide.href}
                      className="group flex min-h-12 items-center justify-between gap-4 py-3 text-base font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span className="flex-1 decoration-cta decoration-2 underline-offset-[5px] group-hover:underline">{guide.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary/45 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading>Common questions about the process</SectionHeading>
              <Accordion items={processFaqs} />
            </div>
          </div>
        </section>

        <QuoteForm source="how-it-works" />
        <FinalCTA tone="green" />
      </PageShell>
    </>
  );
}
