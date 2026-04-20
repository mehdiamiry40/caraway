import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans font-semibold tracking-tight",
    "ring-offset-background transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary: deep navy with soft shadow, lifts on hover, amber ring on focus
        default: [
          "bg-primary text-primary-foreground border border-primary",
          "shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_6px_16px_-4px_hsl(var(--primary)/0.35)]",
          "hover:bg-[hsl(224_56%_23%)] hover:border-[hsl(224_56%_23%)] hover:-translate-y-[1px]",
          "hover:shadow-[0_2px_4px_hsl(var(--shadow-color)/0.08),0_12px_28px_-6px_hsl(var(--primary)/0.45)]",
          "active:translate-y-0 active:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.08)]",
        ].join(" "),
        // Secondary: warm amber — the value / money button
        secondary: [
          "bg-accent text-accent-foreground border border-accent",
          "shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_6px_16px_-4px_hsl(var(--accent)/0.35)]",
          "hover:bg-[hsl(38_62%_40%)] hover:border-[hsl(38_62%_40%)] hover:-translate-y-[1px]",
          "hover:shadow-[0_2px_4px_hsl(var(--shadow-color)/0.08),0_12px_28px_-6px_hsl(var(--accent)/0.45)]",
          "active:translate-y-0",
        ].join(" "),
        // Outline: clean hairline, navy text, hover fill light navy tint
        outline: [
          "border border-border-strong bg-card text-foreground",
          "hover:bg-muted hover:border-primary/40 hover:text-primary",
        ].join(" "),
        // Ghost: text-only, no chrome
        ghost: "bg-transparent text-foreground hover:text-primary hover:bg-primary/5",
        // Ink outline: used on dark surfaces
        inkOutline: [
          "border border-[hsl(var(--on-dark-hi)/0.35)] bg-transparent text-[hsl(var(--on-dark-hi))]",
          "hover:bg-[hsl(var(--on-dark-hi)/0.1)] hover:border-[hsl(var(--on-dark-hi)/0.6)]",
        ].join(" "),
      },
      size: {
        default: "h-11 sm:h-12 px-6 text-sm rounded-full",
        sm: "h-10 px-5 text-[0.8125rem] rounded-full",
        lg: "h-12 sm:h-[52px] px-7 sm:px-8 text-[0.9375rem] rounded-full",
        icon: "h-11 w-11 sm:h-12 sm:w-12 rounded-full",
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
