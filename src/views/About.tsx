import { PageShell } from "@/components/layout/PageShell";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { BUSINESS } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/templates/PagePieces";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About Caraway" }
];

const features = [
  { title: "Pickup included when we buy", desc: "When the vehicle and access match the details supplied." },
  { title: "Collection window confirmed", desc: "Agreed before dispatch." },
  { title: "Vehicles assessed individually", desc: "Running, damaged, scrap or unregistered. Not every car gets an offer." },
  { title: "Payment terms confirmed", desc: "Method and timing agreed before collection." },
  { title: "Buyer details and receipt", desc: "Records to keep for your sale." },
  { title: "No pressure", desc: "Free, no-obligation quotes." },
];

const proseClass = "text-[1.0625rem] leading-[1.7] text-foreground";

export default function About() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="A Brisbane buyer — not a broker."
      subtitle={
        <p>A locally owned Brisbane car buyer, paying cash for cars across Greater Brisbane.</p>
      }
    >
      <div className="site-container py-10 sm:py-12 lg:py-16">
        {/* Story on the left, the plain facts on the right. Source order is
            unchanged, so on a phone it simply reads top to bottom. */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <div>
              <SectionHeading>Who we are</SectionHeading>
              <p className={proseClass}>
                Caraway is a Brisbane-based direct buyer operated by {BUSINESS.legalName}. We assess each vehicle from the supplied details and, when we make an offer, confirm the collection, payment, and record-keeping terms before dispatch.
              </p>
              <p className={cn(proseClass, "mt-4")}>
                We started Caraway to make{" "}
                <Link href="/" className="text-primary font-medium link-underline">
                  cash for cars in Brisbane
                </Link>{" "}
                simpler and more honest: no instant online figure that changes on the day, no
                surprise towing fees, and no pressure to accept. A person reviews every car, the
                offer is in writing, and pickup is included when we buy — whether the car runs
                perfectly or hasn&apos;t moved in years.
              </p>
              <Image
                src="/images/tow-truck-hero.webp"
                alt="Tilt-tray truck carrying a silver sedan"
                width={800}
                height={800}
                sizes="(max-width: 767px) calc(100vw - 2rem), 768px"
                loading="lazy"
                className="mt-7 aspect-[16/9] h-auto w-full rounded-md object-cover object-[30%_62%]"
              />
            </div>

            <div className="border-l-4 border-accent bg-secondary px-5 py-5 sm:px-7">
              <SectionHeading>
                Meet the founder
              </SectionHeading>
              <p className={proseClass}>
                I&apos;m <strong className="font-semibold text-foreground">{BUSINESS.founder}</strong>, and I run Caraway out of Brisbane. I started this business because I was tired of watching mates get lowballed by dealers and ghosted by Gumtree buyers. If something goes sideways on your pickup, you email me directly at <a href={BUSINESS.emailHref} className="text-primary font-medium link-underline">{BUSINESS.email}</a>.
              </p>
              <p className={cn(proseClass, "mt-4")}>
                Caraway is a registered Australian business name operated by {BUSINESS.legalName} as a {BUSINESS.businessStructure.toLowerCase()} (ABN {BUSINESS.abn}). Before collection, we confirm the assigned pickup operator, access plan, timing, payment arrangement, buyer details, and receipt requirements.
              </p>
              <p className="mt-3 text-base">
                <TrackedOutboundLink
                  href={BUSINESS.googleBusinessUrl}
                  label="Google reviews"
                  location="about_founder"
                  className="link-arrow"
                >
                  View Caraway on Google
                </TrackedOutboundLink>
              </p>
            </div>
          </div>

          <div className="space-y-12 lg:col-span-5">
            <div>
              <SectionHeading>What sets us apart</SectionHeading>
              <dl className="list-ticks space-y-5">
                {features.map(({ title, desc }) => (
                  <div key={title}>
                    <dt className="text-lg font-bold leading-snug text-foreground">{title}</dt>
                    <dd className="mt-0.5 text-base leading-relaxed text-foreground">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <SectionHeading>Our service area</SectionHeading>
              <p className={proseClass}>
                Greater Brisbane. Coverage is confirmed for your exact address before booking.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/#quote-form" className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}>
                  Get my quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/locations" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
                  See pickup areas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrustBadges tone="green" />
    </PageShell>
  );
}
