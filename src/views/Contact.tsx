import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/templates/PagePieces";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact Us" }
];

const details = [
  {
    title: "Based in",
    main: BUSINESS.addressFormatted,
    sub: "Collection plan confirmed before any visit.",
  },
  {
    title: "Service area",
    main: `Greater ${BUSINESS.location}`,
    sub: "Coverage confirmed for your address.",
  },
  {
    title: "Response and collection",
    main: "Replies within one business day",
    sub: "Collection timing agreed per job.",
  },
];

const beforeYouCall = [
  { q: "Have ready", a: "Make, model, year, kilometres and condition." },
  { q: "At pickup", a: "Photo ID and the ownership, registration or finance records for your sale." },
  { q: "Payment", a: "Method and timing confirmed for each accepted job before collection." },
  { q: "Pickup cost", a: "Included when Caraway buys and the supplied vehicle and access details match." },
];

const channelClass =
  "group flex min-h-[44px] items-center justify-between gap-4 border-b border-border py-4 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function Contact() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Talk to a real Brisbane buyer."
      subtitle={
        <p>
          Request a free, no-obligation assessment for your vehicle.
        </p>
      }
    >
      <div className="site-container py-12 sm:py-16 lg:py-20">
        {/* Four grid items rather than two columns so phones get the form
            straight after the call/email rows; lg places them side by side. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8">
          <div className="self-start lg:col-span-5 lg:row-start-1">
            <SectionHeading className="mb-2">Get in touch</SectionHeading>
            <p className="text-[1.0625rem] leading-relaxed text-foreground">
              Fastest:{" "}
              <Link href="/#quote-form" className="font-medium text-primary link-underline">
                the online quote form
              </Link>
              .
            </p>

            {/* The two direct channels are whole-row links. */}
            <div className="mt-6 border-t-2 border-primary">
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="contact_page"
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                className={channelClass}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted-foreground">Call us</span>
                  <span className="mt-0.5 block text-[1.75rem] font-bold leading-tight tabular-nums text-primary">{BUSINESS.phoneDisplay}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary/45 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </TrackedPhoneLink>

              <a href={BUSINESS.emailHref} className={channelClass}>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted-foreground">Email us</span>
                  <span className="mt-0.5 block truncate text-xl font-semibold text-primary">{BUSINESS.email}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary/45 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="self-start lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <ContactForm />
          </div>

          <div className="self-start lg:col-span-5 lg:row-start-2">
            <dl className="border-t-2 border-primary">
              {details.map((item) => (
                <div key={item.title} className="grid grid-cols-1 gap-x-6 gap-y-0.5 border-b border-border py-4 sm:grid-cols-[11rem_1fr]">
                  <dt className="text-sm text-muted-foreground sm:pt-0.5">{item.title}</dt>
                  <dd>
                    <span className="block font-semibold text-foreground">{item.main}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{item.sub}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="self-start lg:col-span-7 lg:col-start-6 lg:row-start-3">
            <h2 className="text-[1.5rem] font-semibold leading-tight text-primary">Before you call</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-10 border-t-2 border-primary sm:grid-cols-2">
              {beforeYouCall.map(({ q, a }) => (
                <div key={q} className="border-b border-border py-4">
                  <dt className="font-semibold text-foreground">{q}</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
