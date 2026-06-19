import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { breadcrumbListSchema, howToSchema } from "@/lib/json-ld-schemas";
import { BUSINESS, CONTENT_DEPLOY_DATE, SITE_URL } from "@/lib/site";

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

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "How It Works", item: canonical },
          ]),
          howToSchema({
            name: "How to Sell Your Car for Cash in Brisbane",
            description:
              "Caraway's process for selling a car in Brisbane: share details, receive a confirmed offer, book free pickup, and get paid before the vehicle leaves.",
            totalTime: "PT1D",
            estimatedCost: { currency: "AUD", value: "0" },
            steps: [
              {
                name: "Tell us about your car",
                text: "Share the make, model, year, condition, suburb, and photos if available.",
                url: canonical,
              },
              {
                name: "Get a confirmed offer",
                text: "Caraway reviews the details and confirms the offer before pickup is booked.",
                url: canonical,
              },
              {
                name: "We come to you",
                text: "A truck arrives at the booked time anywhere in Greater Brisbane, with towing included.",
                url: canonical,
              },
              {
                name: "Get paid on the spot",
                text: "Payment is confirmed before the car leaves, with a signed receipt and buyer details for your records.",
                url: canonical,
              },
            ],
            supply: ["Vehicle details", "Photo ID", "Relevant ownership or registration documents"],
            tool: ["Caraway online quote tool"],
          }),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: "How Caraway Works",
            description:
              "How to sell your car for cash with Caraway in Brisbane, from quote to pickup and payment.",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            dateModified: CONTENT_DEPLOY_DATE,
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
        <HowItWorks />
        <PriceEstimator />
        <FinalCTA />
      </PageShell>
    </>
  );
}
