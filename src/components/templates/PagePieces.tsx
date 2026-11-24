import type { ReactNode } from "react";
import Link from "next/link";
import { PROMISE_POINTS } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Shared building blocks for the service, suburb and content pages: a blue
   heading, a green-tick list, a boxed list of links, a numbered run of
   steps. */

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
        "mb-3 text-[1.625rem] font-bold leading-[1.2] text-primary sm:text-[1.875rem]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** The three lead promises, for a blue title band: white squares, green ticks. */
export function HeroPoints({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "list-ticks ticks-inverse flex flex-col gap-x-8 gap-y-3 !space-y-0 text-lg font-semibold text-on-dark-hi sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      {HERO_POINTS.map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  );
}

/** Sidebar box: a blue top edge, a heading, then whatever it holds. */
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
      className="rounded-md border border-border border-t-4 border-t-primary bg-card px-5 pb-4 pt-4"
    >
      <h3 className="text-xl font-bold leading-snug text-primary">{title}</h3>
      {children}
    </Tag>
  );
}

export function PromiseList({ title }: { title: string }) {
  return (
    <SidebarBlock title={title}>
      <ul className="list-ticks mt-3 pb-1 text-base text-foreground">
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
  "inline-flex min-h-11 items-center rounded-sm py-1.5 text-base font-semibold leading-snug text-primary underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:decoration-primary hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function SidebarLinks({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <SidebarBlock as="nav" ariaLabel={label} title={label}>
      <ul className="mt-1 flex flex-col items-start">
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
    <ol className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
      {steps.map(({ title, description }, index) => (
        <li
          key={title}
          className="grid grid-cols-[3rem_1fr] items-start gap-x-4 sm:block"
        >
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-2xl font-bold leading-none text-accent-foreground"
          >
            {index + 1}
          </span>
          <div className="sm:mt-3">
            <StepHeading className="text-lg font-bold normal-case leading-snug text-primary">
              {title}
            </StepHeading>
            <p className="mt-1 text-base leading-relaxed text-foreground">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
