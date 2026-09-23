import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Two variants only: a solid accent button for the primary action, and a
 * text link for everything secondary. No gradients, glows or lift.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "transition-colors duration-150 ease-(--ease-out)",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "whitespace-nowrap rounded bg-primary text-primary-foreground hover:bg-ink-deep",
        // Inline with copy: keeps a 44px hit area, no horizontal padding.
        link:
          "justify-start text-left rounded-sm text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary",
      },
      size: {
        default: "h-11 text-sm",
        sm: "h-10 text-sm",
        lg: "h-12 text-base",
        icon: "h-11 w-11",
      },
    },
    compoundVariants: [
      { variant: "default", size: "default", class: "px-5" },
      { variant: "default", size: "sm", class: "px-4" },
      { variant: "default", size: "lg", class: "px-6" },
    ],
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
          <span className="h-4 w-4 animate-spin motion-reduce:animate-none rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
