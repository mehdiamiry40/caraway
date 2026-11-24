import type { ReactNode } from "react";
import Link from "next/link";
import { PROMISE_POINTS } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Shared building blocks for the service, suburb and content pages. They are
   deliberately plain: a heading, a ticked list, a ruled list of links, a
   numbered run of steps. No icon tiles. */

export const HERO_POINTS = PROMISE_POINTS.slice(0, 3);

/** In-body section heading. Sits one step below the page title. */
export function SectionHeading({
  children,
  as: Tag = "h2",
  id,
  className,
}: {
  children: ReactNode;
  as?: "h2" | "h3";
  id?: string;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "mb-4 font-display text-[1.5rem] font-semibold leading-[1.18] tracking-[-0.02em] text-primary sm:text-[1.75rem]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function HeroPoints({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "list-ticks flex flex-col gap-x-8 gap-y-2 !space-y-0 text-base font-medium text-foreground sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      {HERO_POINTS.map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  );
}

/** Sidebar block: a rule, a small heading, then whatever it holds. */
function SidebarBlock({
  title,
  children,
  as: Tag = "div",
  ariaLabel,
}: {
  title: string;
  children: ReactNode;
  as?: "div" | "nav";
  ariaLabel?: string;
}) {
  return (
    <Tag
      aria-label={ariaLabel}
      className="border-t border-foreground/25 pt-5"
    >
      <h3 className="text-[1.0625rem] font-bold leading-snug text-foreground">{title}</h3>
      {children}
    </Tag>
  );
}

export function PromiseList({ title }: { title: string }) {
  return (
    <SidebarBlock title={title}>
      <ul className="list-ticks mt-3 text-[0.9375rem] text-foreground/85">
        {PROMISE_POINTS.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </SidebarBlock>
  );
}

export function SidebarPanel({ title, children }: { title: string; children: ReactNode }) {
  return <SidebarBlock title={title}>{children}</SidebarBlock>;
}

export const sidebarLinkClass =
  "inline-flex min-h-11 items-center rounded-sm py-1.5 text-[0.9375rem] leading-snug text-accent-ink underline decoration-accent-ink/40 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function SidebarLinks({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <SidebarBlock as="nav" ariaLabel={label} title={label}>
      <ul className="mt-1.5 flex flex-col items-start">
        {items.map(({ href, label: itemLabel }) => (
          <li key={href}>
            <Link href={href} className={sidebarLinkClass}>
              {itemLabel}
            </Link>
          </li>
        ))}
      </ul>
    </SidebarBlock>
  );
}

/* Numbered steps used wherever a page summarises the quote → pickup flow. */
export function NumberedSteps({
  steps,
  headingLevel: StepHeading = "h3",
}: {
  steps: readonly { title: string; description: string }[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ol className="grid grid-cols-1 border-t-2 border-primary sm:grid-cols-3">
      {steps.map(({ title, description }, index) => (
        <li
          key={title}
          className="grid grid-cols-[2.75rem_1fr] items-baseline gap-x-2 border-b border-border py-5 sm:block sm:border-b-0 sm:border-l sm:py-6 sm:pl-5 sm:pr-5 sm:first:border-l-0 sm:first:pl-0"
        >
          <span
            aria-hidden="true"
            className="font-display text-[2.25rem] font-semibold leading-none text-accent sm:block sm:text-[2.75rem]"
          >
            {index + 1}
          </span>
          <div className="sm:mt-4">
            <StepHeading className="font-sans text-lg font-bold leading-snug tracking-[-0.006em] text-foreground">
              {title}
            </StepHeading>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
