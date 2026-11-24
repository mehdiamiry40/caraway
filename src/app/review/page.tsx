import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";

const title = "Share Honest Feedback | Caraway";
const description =
  "A dedicated handoff for genuine Caraway customers who want to share honest feedback on Google after a completed vehicle transaction.";

export const metadata: Metadata = {
  title: "Share Honest Feedback",
  description,
  alternates: { canonical: "/review" },
  openGraph: {
    type: "website",
    url: "/review",
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

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Customer feedback" },
];

export default function ReviewPage() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Share honest feedback about Caraway"
      subtitle={
        <p>
          This customer handoff is for people whose genuine Caraway vehicle
          transaction or collection is complete.
        </p>
      }
    >
      <section className="site-container py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl space-y-10">
          <div>
            <h2 className="text-[1.5rem] font-semibold leading-tight text-primary sm:text-[1.75rem]">
              Your experience, in your own words
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.7] text-foreground">
              There is no obligation to post. Positive, neutral, and
              critical feedback are all welcome. Caraway does not offer an
              incentive or ask for a particular rating, phrase, or keyword.
            </p>
          </div>

          <div className="border-t-2 border-primary pt-8">
            <h2 className="text-[1.5rem] font-semibold leading-tight text-primary sm:text-[1.75rem]">
              Review Caraway on Google
            </h2>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[1.0625rem] leading-relaxed text-foreground marker:font-semibold marker:text-primary">
              <li>Open Google&apos;s review form for Caraway.</li>
              <li>Sign in to your Google Account if asked.</li>
              <li>Describe only your own genuine experience.</li>
            </ol>

            <TrackedOutboundLink
              href={BUSINESS.googleReviewUrl}
              label="Google review"
              location="review_handoff"
              className={`${buttonVariants({ size: "lg" })} mt-7 inline-flex gap-2`}
            >
              Write a review on Google
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </TrackedOutboundLink>
          </div>

          <p className="border-l-2 border-primary pl-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Protect your privacy: do not include a phone number, address,
            registration number, VIN, payment details, or another person&apos;s
            personal information in a public review.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
