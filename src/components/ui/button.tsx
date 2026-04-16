import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold tracking-[-0.005em] ring-offset-background shadow-[0_12px_30px_-24px_hsl(var(--shadow-color)/0.45)] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/94 active:bg-primary shadow-[0_18px_38px_-26px_hsl(var(--primary)/0.68)] hover:shadow-[0_22px_42px_-26px_hsl(var(--primary)/0.72)]",
        secondary:
          "bg-accent text-accent-foreground hover:bg-accent/92 active:bg-accent shadow-[0_18px_38px_-26px_hsl(var(--accent)/0.56)] hover:shadow-[0_22px_42px_-26px_hsl(var(--accent)/0.6)]",
        outline:
          "border-2 border-primary/50 bg-card/70 text-primary hover:bg-primary/[0.06] hover:border-primary active:bg-primary/[0.1]",
        ghost:
          "bg-transparent text-primary hover:bg-primary/[0.05]",
      },
      size: {
        default: "h-11 sm:h-12 px-5 text-sm sm:text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-12 sm:h-14 px-7 text-base sm:text-lg",
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
