import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Two button styles carry the whole site: the gold primary action and an
   outlined secondary. `outlineOnDark` is the secondary on a green band, and
   `ghost` is the quiet tertiary used in button rows. */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "font-sans font-semibold leading-none tracking-normal",
    "ring-offset-background transition-[background-color,color,border-color,box-shadow] duration-150 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border border-cta-hover bg-cta text-cta-foreground shadow-sm hover:bg-cta-hover active:shadow-none",
        outline:
          "border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        outlineOnDark:
          "border-[1.5px] border-on-dark-hi/70 bg-transparent text-on-dark-hi ring-offset-ink hover:border-on-dark-hi hover:bg-on-dark-hi hover:text-primary",
        ghost:
          "bg-transparent text-primary underline decoration-1 underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-12 px-5 text-base",
        sm: "h-11 px-4 text-[0.9375rem]",
        lg: "h-[3.25rem] px-6 text-[1.0625rem] sm:px-7",
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
