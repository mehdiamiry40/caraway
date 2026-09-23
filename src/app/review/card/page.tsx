import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PrintReviewCardButton } from "@/app/review/card/PrintReviewCardButton";
import { buttonVariants } from "@/components/ui/button";
import { SITE_URL } from "@/lib/site";

const title = "Printable Customer Feedback Card | Caraway";
const description =
  "An unlisted printable card for inviting eligible completed Caraway customers to share genuine, unincentivised feedback in their own time.";

export const REVIEW_CARD_QR_SRC = "/images/caraway-review-qr.svg";
export const REVIEW_CARD_DESTINATION = `${SITE_URL}/review`;

export const metadata: Metadata = {
  title: "Printable Customer Feedback Card",
  description,
  alternates: { canonical: "/review/card" },
  openGraph: {
    type: "website",
    url: "/review/card",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
};

export default function ReviewCardPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="review-card-print-root min-h-screen bg-secondary px-4 py-10 sm:px-6 sm:py-14"
    >
      <section className="review-card-screen-only no-print mx-auto mb-8 max-w-2xl rounded-xl border border-border bg-background p-5 shadow-sm sm:p-7">
        <Link
          href="/review"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Customer feedback handoff
        </Link>
        <div className="mt-6 mb-3">
          <p className="eyebrow">Review operations</p>
        </div>
        <h1 className="font-display text-3xl leading-tight text-foreground">
          Printable customer feedback card
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Give the same card to every eligible customer only after their
          genuine Caraway transaction or collection is complete. Never offer
          an incentive, select only likely-positive customers, or ask someone
          to write while staff wait.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <PrintReviewCardButton />
          <Link
            href="/review"
            className={`${buttonVariants({ variant: "link", size: "lg" })} inline-flex gap-2`}
          >
            Open customer handoff
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="review-card-heading"
        className="review-card-sheet mx-auto flex min-h-[210mm] w-full max-w-[148mm] flex-col items-center justify-between border border-slate-300 bg-white px-8 py-10 text-center text-slate-950 shadow-xl sm:px-12 sm:py-14"
      >
        <div className="review-card-copy w-full">
          <p className="text-sm font-bold tracking-[0.24em] text-[#2C5697]">
            CARAWAY
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Customer feedback
          </p>
          <h2
            id="review-card-heading"
            className="review-card-title mt-8 font-display text-4xl font-bold leading-tight text-slate-950 sm:text-5xl"
          >
            Share honest feedback
          </h2>
          <p className="review-card-intro mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-700 sm:text-lg">
            After your Caraway transaction or collection is complete, scan
            this code if you choose to share your genuine experience on Google.
          </p>
        </div>

        <div className="review-card-code my-8 flex flex-col items-center">
          <div className="rounded-lg border border-slate-200 bg-white p-2">
            <Image
              src={REVIEW_CARD_QR_SRC}
              width={512}
              height={512}
              unoptimized
              priority
              alt="QR code opening Caraway's customer feedback handoff"
              className="review-card-qr h-[52mm] w-[52mm]"
            />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Can&apos;t scan? Visit
          </p>
          <p className="mt-1 font-mono text-base font-bold text-slate-950">
            caraway.au/review
          </p>
        </div>

        <div className="review-card-closing w-full space-y-5">
          <p className="review-card-terms mx-auto max-w-md text-base font-medium leading-relaxed text-slate-800">
            Positive, neutral and critical feedback are welcome. There is no
            obligation, no incentive, and no requested rating or wording.
          </p>
          <p className="review-card-later font-display text-2xl font-semibold text-[#2C5697]">
            Review later, in your own time.
          </p>
          <p className="review-card-privacy border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-500">
            Protect your privacy: do not include your address, phone number,
            registration number, VIN, payment details, or another person&apos;s
            personal information in a public review.
          </p>
        </div>
      </section>
    </main>
  );
}
