import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page-width wrapper: 70rem content column with the site gutters. */
export function Container({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("site-container", className)} {...props}>
      {children}
    </div>
  );
}

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Hairline above the section. Off for the first section after a hero. */
  divided?: boolean;
  /** Vertical rhythm: "default" for page sections, "tight" for short bands. */
  spacing?: "default" | "tight";
  containerClassName?: string;
};

/** A page section: generous vertical rhythm, optional hairline, contained. */
export function Section({
  divided = true,
  spacing = "default",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "tight" ? "section-y-tight" : "section-y",
        divided && "border-t border-border",
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

const headingSizes = {
  display: "text-4xl sm:text-5xl leading-[1.05]",
  section: "text-3xl leading-[1.15]",
  sub: "text-xl leading-[1.3]",
  item: "text-base leading-snug",
} as const;

type HeadingProps<T extends ElementType> = {
  as?: T;
  size?: keyof typeof headingSizes;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Heading with a fixed size step; the element level is chosen separately. */
export function Heading<T extends ElementType = "h2">({
  as,
  size = "section",
  className,
  children,
  ...props
}: HeadingProps<T>) {
  const Tag = (as ?? "h2") as ElementType;
  return (
    <Tag
      className={cn("font-semibold tracking-[-0.02em] text-foreground text-balance", headingSizes[size], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Small uppercase label above a heading. */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("eyebrow mb-4", className)}>{children}</p>;
}
