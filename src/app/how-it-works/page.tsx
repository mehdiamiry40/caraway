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
  title: "How It Works: Sell Your Car in Four Steps",
  description: `How selling your car to Caraway works in Brisbane: send the details, get a written offer, free towing when we buy, and get paid. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/how-it-works",
    title: "How Selling to Caraway Works | Brisbane",
    description:
      "Four clear steps: your car's details, a written offer, pickup and payment.",
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
      "Four clear steps: your car's details, a written offer, pickup and payment.",
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
      "The written offer lists the car and access details it is based on. If they match, we honour the agreed figure and the free towing. If something is materially different, we talk to you before loading, and you can say no to a new offer.",
  },
  {
    question: "How long is my quote valid?",
    answer:
      "The written offer should say how long it is valid. If it expires, or the car, location or access changes, we recheck the details and confirm the current terms before the truck is sent.",
  },
  {
    question: "Can someone else hand the car over for me?",
    answer:
      "It may be possible if we arrange it first. Tell us who will be there so we can confirm their ID, their authority, the car's records and the site access before pickup.",
  },
  {
    question: "What if the car can't roll or is in an awkward spot?",
    answer:
      "Tell us about a basement car park, locked gate, steep driveway, seized brakes, missing wheels, soft ground or anything else in the way before the quote is confirmed. Access can affect whether we can pick up, the truck, the timing and the offer.",
  },
];

const pickupChecklist = [
  { text: "Current photo ID, such as a Queensland driver licence" },
  { text: "Rego papers or ownership records, if you have them" },
  { text: "All your keys, including spares" },
  { text: "Finance, insurance or estate documents, if they apply" },
  { text: "Your belongings cleared out, and any e-tag or toll account noted so you can close it" },
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
              "How Caraway checks a Brisbane car and confirms the offer, pickup, payment and sale records.",
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
                What happens at each step
              </SectionHeading>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  1. Tell us about the car
                </h3>
                <p className={proseClasses}>
                  Fill in the quote form below with the car, its condition,
                  your contact details and where it is, or call{" "}
                  {BUSINESS.phoneDisplay}. Tell us about anything that affects
                  loading, like a flat battery, missing wheels, a car that
                  won&apos;t roll, or parking in a basement or behind a gate.
                  Clear photos of the outside, the inside, the access and any
                  damage help. Accurate details make it less likely the offer
                  or pickup plan has to change later.
                </p>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  2. Get a written offer
                </h3>
                <p className={proseClasses}>
                  We check the details against current demand for parts,
                  resale and scrap, plus ownership, location and access, then
                  decide whether to make an offer. The written offer lists what
                  it is based on, how long it is valid, the free towing, and
                  what could change the figure. You can accept it or say no.
                </p>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  3. Book the pickup
                </h3>
                <p className={proseClasses}>
                  Once you accept, we confirm a pickup time based on the car,
                  location, access, when you are free and the operator assigned.
                  Towing is free when we buy and those details match what was
                  agreed. Tell us about a car that doesn&apos;t run, a height
                  limit, narrow driveway, gate, slope, soft ground or missing
                  wheel, so we can confirm the pickup is possible and book the
                  right truck. Don&apos;t move or deliver the car to an address
                  unless that is part of the agreed pickup plan.
                </p>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <h3 className={h3Classes}>
                  4. Payment, receipt, and the car leaves
                </h3>
                <p className={proseClasses}>
                  On the day, the operator checks the car against the
                  description. You are paid by the method and at the time agreed
                  before the truck was sent, and you confirm the money before you
                  hand over the car. Keep a receipt showing the car, date, amount
                  and buyer details, plus proof of the Queensland seller steps
                  that apply to your sale.
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
                We can usually start with the car&apos;s details, the VIN,
                photos and current ID. To complete a sale you need the right to
                sell and the registration, finance, insurance, estate, company or
                other records that apply. A VIN lookup does not prove ownership
                or the right to sell. For more, see our guide to{" "}
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
                details. These are the records the seller-side steps with the
                Department of Transport and Main Roads (TMR) ask for. For a
                registered vehicle that usually means completing the transfer
                or cancelling the registration. Unregistered sales rely on the
                receipt itself. Rules for number plates differ between
                transfers, cancellations and personalised plates, so check the
                current TMR guidance for your situation and keep confirmation
                of whichever step you complete. It&apos;s also worth closing off
                tolls and insurance tied to the car the same day. These guides
                cover each situation:
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
