import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg tracking-[-0.005em]",
    "ring-offset-background transition-[transform,box-shadow,background-color,color] duration-[180ms] ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
    "hover:-translate-y-px active:translate-y-0 active:scale-[0.99]",
    "motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_hsl(var(--primary)/0.55),0_1px_2px_hsl(var(--shadow-color)/0.08)] hover:bg-primary/96 hover:shadow-[0_12px_24px_-8px_hsl(var(--primary)/0.6),0_2px_4px_hsl(var(--shadow-color)/0.1)] active:bg-primary",
        secondary:
          "bg-accent text-accent-foreground shadow-[0_6px_16px_-6px_hsl(var(--accent)/0.5),0_1px_2px_hsl(var(--shadow-color)/0.08)] hover:bg-accent/94 hover:shadow-[0_12px_24px_-8px_hsl(var(--accent)/0.55),0_2px_4px_hsl(var(--shadow-color)/0.1)] active:bg-accent",
        outline:
          "border border-border bg-card text-foreground shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06)] hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary hover:shadow-[0_4px_12px_hsl(var(--shadow-color)/0.08)]",
        ghost:
          "bg-transparent text-foreground hover:text-primary hover:bg-primary/[0.04]",
        inkOutline:
          "border border-[hsl(var(--on-dark)/0.25)] bg-transparent text-[hsl(var(--on-dark-hi))] hover:bg-[hsl(var(--on-dark-hi)/0.08)] hover:border-[hsl(var(--on-dark-hi)/0.45)]",
      },
      size: {
        default: "h-11 sm:h-12 px-5 text-[0.9375rem]",
        sm: "h-10 px-4 text-sm",
        lg: "h-12 sm:h-[52px] px-6 sm:px-7 text-base",
        icon: "h-11 w-11 sm:h-12 sm:w-12",
      },
    },
    defaultVariants: {
      variant: "default",
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
