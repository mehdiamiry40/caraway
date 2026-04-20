import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Swiss buttons: rectangular, flat, monospace label, wide tracking,
    // bold uppercase. No lift on hover — colour inversion only.
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none",
    "font-mono font-bold uppercase tracking-[0.08em]",
    "ring-offset-background transition-[background-color,color,border-color] duration-150 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60 touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary hover:bg-accent hover:border-accent active:bg-accent",
        secondary:
          "bg-accent text-accent-foreground border border-accent hover:bg-primary hover:border-primary active:bg-primary",
        outline:
          "border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background",
        ghost:
          "bg-transparent text-foreground hover:text-accent",
        inkOutline:
          "border border-[hsl(var(--on-dark-hi)/0.4)] bg-transparent text-[hsl(var(--on-dark-hi))] hover:bg-[hsl(var(--on-dark-hi))] hover:text-[hsl(var(--ink))]",
      },
      size: {
        default: "h-11 sm:h-12 px-5 text-[0.8125rem]",
        sm: "h-10 px-4 text-xs",
        lg: "h-12 sm:h-[52px] px-6 sm:px-7 text-sm",
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
