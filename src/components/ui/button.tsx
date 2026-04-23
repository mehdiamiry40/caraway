import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Looping-style buttons: fully rounded pills, bold sentence-case label, hover lift.
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-bold tracking-[-0.005em]",
    "ring-offset-background transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        // Lime-green action — the site's default CTA ("Get my quote").
        cta:
          "bg-cta text-cta-foreground shadow-[0_4px_0_0_hsl(var(--cta)/0.5),0_12px_24px_hsl(var(--cta)/0.25)] hover:bg-cta/95 hover:shadow-[0_6px_0_0_hsl(var(--cta)/0.55),0_14px_28px_hsl(var(--cta)/0.3)] hover:-translate-y-0.5 active:translate-y-0",
        // Deep purple — brand primary used for secondary CTAs on light surfaces.
        primary:
          "bg-primary text-primary-foreground shadow-[0_4px_0_0_hsl(var(--primary)/0.5),0_12px_24px_hsl(var(--primary)/0.2)] hover:bg-primary/95 hover:shadow-[0_6px_0_0_hsl(var(--primary)/0.55),0_14px_28px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5 active:translate-y-0",
        // Orange emphasis — used for highlight CTAs.
        accent:
          "bg-accent text-accent-foreground shadow-[0_4px_0_0_hsl(var(--accent)/0.5),0_12px_24px_hsl(var(--accent)/0.2)] hover:bg-accent/95 hover:shadow-[0_6px_0_0_hsl(var(--accent)/0.55),0_14px_28px_hsl(var(--accent)/0.3)] hover:-translate-y-0.5 active:translate-y-0",
        // Light outline for quiet actions on white surfaces.
        outline:
          "border-2 border-primary/15 bg-card text-primary hover:bg-primary/5 hover:border-primary/25 active:translate-y-px",
        ghost:
          "bg-transparent text-primary hover:bg-primary/8",
        // Outline-on-dark — used on purple bands for secondary actions.
        inkOutline:
          "border-2 border-[hsl(var(--on-dark-hi)/0.35)] bg-transparent text-[hsl(var(--on-dark-hi))] hover:bg-[hsl(var(--on-dark-hi)/0.08)] hover:border-[hsl(var(--on-dark-hi)/0.55)]",
      },
      size: {
        default: "h-12 px-6 text-[0.9375rem]",
        sm: "h-11 px-5 text-sm",
        lg: "h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "cta",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none rounded-full border-[2.5px] border-current border-t-transparent" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
