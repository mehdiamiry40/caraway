import type { Metadata } from "next";
import { ExternalLink, MessageSquareText, ShieldCheck, Star } from "lucide-react";
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
      icon={Star}
      breadcrumbs={breadcrumbs}
      eyebrow="Customer feedback"
      title="Share honest feedback about Caraway"
      subtitle={
        <p>
          This customer handoff is for people whose genuine Caraway vehicle
          transaction or collection is complete.
        </p>
      }
    >
      <section className="site-container py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="rounded-md border border-border/60 bg-card p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquareText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight text-foreground">
                  Your experience, in your own words
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  There is no obligation to post. Positive, neutral, and
                  critical feedback are all welcome. Caraway does not offer an
                  incentive or ask for a particular rating, phrase, or keyword.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-background p-6 sm:p-8">
            <h2 className="font-display text-2xl leading-tight text-foreground">
              Review Caraway on Google
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed text-muted-foreground marker:font-semibold marker:text-primary">
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

          <div className="flex items-start gap-3 rounded-md border border-border/60 bg-secondary p-5 sm:p-6">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Protect your privacy: do not include a phone number, address,
              registration number, VIN, payment details, or another person&apos;s
              personal information in a public review.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
