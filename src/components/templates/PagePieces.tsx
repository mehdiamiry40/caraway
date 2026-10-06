import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  Banknote,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Receipt,
  SearchCheck,
  Truck,
} from "lucide-react";
import { PROMISE_POINTS } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Shared building blocks for the service, suburb and content pages: an icon
   beside each heading, icon chips in the hero, and icon-led sidebar cards. */

export const HERO_POINTS = [
  { icon: BadgeDollarSign, label: PROMISE_POINTS[0] },
  { icon: CalendarClock, label: PROMISE_POINTS[1] },
  { icon: Truck, label: PROMISE_POINTS[2] },
] as const;

const PROMISE_ICONS: LucideIcon[] = [
  BadgeDollarSign,
  CalendarClock,
  Truck,
  SearchCheck,
  Banknote,
  Receipt,
];

const PROMISE_TILES = PROMISE_POINTS.map((label, index) => ({
  label,
  icon: PROMISE_ICONS[index] ?? CheckCircle2,
}));

export function IconHeading({
  icon: Icon,
  children,
  as: Tag = "h2",
  id,
  tone = "light",
  className,
}: {
  icon: LucideIcon;
  children: ReactNode;
  as?: "h2" | "h3";
  id?: string;
  tone?: "light" | "solid";
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center gap-4", className)}>
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center",
          tone === "solid" ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <Tag
        id={id}
        className="text-2xl sm:text-3xl font-display text-foreground leading-[1.15]"
        style={{ letterSpacing: "var(--tracking-tight)" }}
      >
        {children}
      </Tag>
    </div>
  );
}

export function HeroPoints({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {HERO_POINTS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground/85"
        >
          <Icon className="h-4 w-4 text-accent-ink" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

export function PromiseTiles({ title }: { title: string }) {
  return (
    <div className="border border-border bg-card p-5 sm:p-6">
      <h3 className="font-display text-base text-foreground mb-4">{title}</h3>
      <ul className="grid grid-cols-2 gap-2.5">
        {PROMISE_TILES.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-2 bg-secondary px-2 py-3.5 text-center text-xs font-medium leading-snug text-foreground/85"
          >
            <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SidebarLinks({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string; icon: LucideIcon }[];
}) {
  return (
    <nav aria-label={label} className="border border-border bg-card p-5 sm:p-6">
      <h3 className="font-display text-base mb-3 text-foreground">{label}</h3>
      <ul className="divide-y divide-border/60 border-t border-border/60">
        {items.map(({ href, label: itemLabel, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex min-h-[44px] items-center gap-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="flex-1">{itemLabel}</span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-border transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* Icon steps used wherever a page summarises the quote → pickup flow. */
export function IconSteps({
  steps,
  headingLevel: StepHeading = "h3",
}: {
  steps: readonly { icon: LucideIcon; title: string; description: string }[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {steps.map(({ icon: Icon, title, description }, index) => (
        <li key={title} className="flex flex-col items-center text-center">
          <span className="relative flex h-16 w-16 items-center justify-center border border-border bg-secondary text-primary">
            <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-cta font-display text-xs font-bold text-cta-foreground"
            >
              {index + 1}
            </span>
          </span>
          <StepHeading className="mt-4 font-display text-base font-semibold text-foreground">{title}</StepHeading>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </li>
      ))}
    </ol>
  );
}
