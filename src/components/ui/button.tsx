import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Two button styles carry the whole site: the yellow primary action and an
   outlined secondary. `outlineOnDark` is the secondary on a blue, green or
   photo band, and `ghost` is the quiet tertiary used in button rows. */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm",
    "font-sans font-bold leading-none tracking-normal",
    "ring-offset-background transition-[background-color,color,border-color,box-shadow] duration-150 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border border-cta-hover bg-cta text-cta-foreground hover:bg-cta-hover",
        outline:
          "border-2 border-primary bg-card text-primary hover:bg-primary hover:text-primary-foreground",
        outlineOnDark:
          "border-2 border-on-dark-hi bg-transparent text-on-dark-hi hover:bg-on-dark-hi hover:text-primary",
        ghost:
          "bg-transparent text-primary underline decoration-1 underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-12 px-5 text-[1.0625rem]",
        sm: "h-11 px-4 text-base",
        lg: "h-[3.25rem] px-6 text-lg sm:px-7",
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
          <span className="h-4 w-4 animate-spin motion-reduce:animate-none rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
