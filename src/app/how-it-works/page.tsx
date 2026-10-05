import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileSignature,
  FileText,
  IdCard,
  KeyRound,
  ListChecks,
  MessageCircleQuestion,
  PackageOpen,
  Truck,
} from "lucide-react";
import { IconHeading } from "@/components/templates/PagePieces";
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

export const revalidate = 3600;

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
  { icon: IdCard, text: "Current photo ID, such as a Queensland driver licence" },
  { icon: FileText, text: "Registration papers or ownership records, if you have them" },
  { icon: KeyRound, text: "All keys you hold, including spares" },
  { icon: FileCheck2, text: "Finance, insurer, or estate documents where they apply to the sale" },
  { icon: PackageOpen, text: "Personal belongings cleared out, and any e-tag or toll account noted so you can close it off" },
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

const h3Classes = "flex items-center gap-2.5 font-display text-lg font-semibold text-primary mb-2";

const proseClasses = "text-foreground/75 leading-relaxed text-base";

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
        icon={ListChecks}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How it works" },
        ]}
        eyebrow="How it works"
        title="Sell your car in four clear steps."
        subtitle={
          <p>Details, offer, pickup, payment.</p>
        }
      >
        <HowItWorks showHeader={false} />

        <section
          aria-labelledby="process-detail-heading"
          className="bg-background"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20 space-y-12 sm:space-y-14">
            <div>
              <IconHeading id="process-detail-heading" icon={ListChecks} tone="solid">
                What actually happens at each step
              </IconHeading>

              <div className="mt-8 border-l-2 border-border pl-5">
                <h3 className={h3Classes}>
                  <ClipboardList className="h-5 w-5 shrink-0 text-accent-ink" aria-hidden="true" />
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

              <div className="mt-8 border-l-2 border-border pl-5">
                <h3 className={h3Classes}>
                  <FileSignature className="h-5 w-5 shrink-0 text-accent-ink" aria-hidden="true" />
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

              <div className="mt-8 border-l-2 border-border pl-5">
                <h3 className={h3Classes}>
                  <Truck className="h-5 w-5 shrink-0 text-accent-ink" aria-hidden="true" />
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

              <div className="mt-8 border-l-2 border-border pl-5">
                <h3 className={h3Classes}>
                  <Banknote className="h-5 w-5 shrink-0 text-accent-ink" aria-hidden="true" />
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
              <IconHeading icon={ClipboardCheck}>What to have ready on pickup day</IconHeading>
              <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
                {pickupChecklist.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 border border-border bg-card p-3.5 text-sm text-foreground/80 leading-relaxed">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" strokeWidth={1.75} aria-hidden="true" />
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
                  className="text-primary underline underline-offset-4 hover:text-accent-ink"
                >
                  preparing your car for pickup
                </Link>
                .
              </p>
            </div>

            <div>
              <IconHeading icon={FileCheck2}>After the sale: the Queensland paperwork</IconHeading>
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
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {paperworkGuides.map((guide) => (
                  <li key={guide.href}>
                    <Link
                      href={guide.href}
                      className="group flex h-full min-h-11 items-center gap-3 border border-border bg-card p-3.5 text-sm font-medium text-primary transition-colors hover:border-primary/50"
                    >
                      <BookOpen className="h-5 w-5 shrink-0 text-accent-ink" strokeWidth={1.75} aria-hidden="true" />
                      <span className="flex-1">{guide.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <IconHeading icon={MessageCircleQuestion} tone="solid">Common questions about the process</IconHeading>
              <Accordion items={processFaqs} />
            </div>
          </div>
        </section>

        <QuoteForm source="how-it-works" />
        <FinalCTA />
      </PageShell>
    </>
  );
}
