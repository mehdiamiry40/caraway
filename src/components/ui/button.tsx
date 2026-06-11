import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-display font-semibold tracking-normal",
    "ring-offset-background transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-cta text-cta-foreground border border-cta hover:bg-cta/88 hover:border-cta/88 active:translate-y-px",
        primary:
          "bg-primary text-primary-foreground border border-primary hover:bg-ink-deep hover:border-ink-deep active:translate-y-px",
        secondary:
          "bg-accent text-accent-foreground border border-accent hover:bg-accent/90 active:translate-y-px",
        outline:
          "border-2 border-primary bg-card text-primary hover:bg-primary hover:text-primary-foreground active:translate-y-px",
        ghost:
          "bg-transparent text-primary hover:bg-primary/8",
        inkOutline:
          "border-2 border-on-dark-hi bg-transparent text-on-dark-hi hover:bg-on-dark-hi hover:text-primary",
      },
      size: {
        default: "h-12 px-6 text-[0.9375rem]",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg",
        icon: "h-12 w-12",
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
