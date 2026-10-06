import { PageShell } from "@/components/layout/PageShell";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { BUSINESS } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarClock,
  CarFront,
  HeartHandshake,
  MapPin,
  Receipt,
  Star,
  Truck,
  UserRound,
  Users,
} from "lucide-react";
import { IconHeading } from "@/components/templates/PagePieces";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About Caraway" }
];

const features = [
  { icon: Truck, title: "Pickup included when we buy", desc: "When the vehicle and access match the details supplied." },
  { icon: CalendarClock, title: "Collection window confirmed", desc: "Agreed before dispatch." },
  { icon: CarFront, title: "Vehicles assessed individually", desc: "Running, damaged, scrap or unregistered. Not every car gets an offer." },
  { icon: Banknote, title: "Payment terms confirmed", desc: "Method and timing agreed before collection." },
  { icon: Receipt, title: "Buyer details and receipt", desc: "Records to keep for your sale." },
  { icon: HeartHandshake, title: "No pressure", desc: "Free, no-obligation quotes." },
];

export default function About() {
  return (
    <PageShell
      icon={Users}
      breadcrumbs={breadcrumbs}
      eyebrow="About"
      title="A Brisbane buyer — not a broker."
      subtitle={
        <p>A locally owned Brisbane vehicle buyer.</p>
      }
    >
      <div className="site-container py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
          <div>
            <IconHeading icon={Users}>Who we are</IconHeading>
            <p className="text-foreground/75 leading-relaxed text-base">
              Caraway is a Brisbane-based direct buyer operated by {BUSINESS.legalName}. We assess each vehicle from the supplied details and, when we make an offer, confirm the collection, payment, and record-keeping terms before dispatch.
            </p>
            <div className="mt-6 overflow-hidden border border-border">
              <Image
                src="/images/tow-truck-hero.webp"
                alt="Tilt-tray truck carrying a silver sedan"
                width={800}
                height={800}
                sizes="(max-width: 767px) calc(100vw - 2rem), 768px"
                loading="lazy"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="border border-border bg-card p-6 sm:p-8">
              <IconHeading icon={UserRound} tone="solid" className="mb-5">
                Meet the founder
              </IconHeading>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                <div className="flex-1">
                  <p className="text-foreground/75 leading-relaxed text-base mb-4">
                    I&apos;m <strong className="text-foreground">{BUSINESS.founder}</strong>, and I run Caraway out of Brisbane. I started this business because I was tired of watching mates get lowballed by dealers and ghosted by Gumtree buyers. If something goes sideways on your pickup, you email me directly at <a href={BUSINESS.emailHref} className="text-primary font-medium link-underline">{BUSINESS.email}</a>.
                  </p>
                  <p className="text-foreground/75 leading-relaxed text-base">
                    Caraway is a registered Australian business name operated by {BUSINESS.legalName} as a {BUSINESS.businessStructure.toLowerCase()} (ABN {BUSINESS.abn}). Before collection, we confirm the assigned pickup operator, access plan, timing, payment arrangement, buyer details, and receipt requirements.
                  </p>
                  <p className="mt-4 text-base">
                    <TrackedOutboundLink
                      href={BUSINESS.googleBusinessUrl}
                      label="Google reviews"
                      location="about_founder"
                      className="inline-flex min-h-11 items-center gap-2 text-primary font-medium link-underline"
                    >
                      <Star className="h-4 w-4" aria-hidden="true" />
                      View Caraway on Google
                    </TrackedOutboundLink>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <IconHeading icon={BadgeCheck} className="mb-6">What sets us apart</IconHeading>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center border border-border bg-card px-3 py-5 text-center">
                  <span className="flex h-12 w-12 items-center justify-center bg-secondary text-primary">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <dt className="mt-3 font-display text-sm font-semibold leading-snug text-foreground">{title}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <IconHeading icon={MapPin}>Our service area</IconHeading>
            <p className="text-foreground/75 leading-relaxed text-base">
              Greater Brisbane. Coverage is confirmed for your exact address before booking.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/#quote-form" className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}>
                Get my quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/locations" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
                <MapPin className="h-4 w-4" aria-hidden="true" />
                See pickup areas
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TrustBadges />
    </PageShell>
  );
}
