import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "font-medium",
    "transition-opacity duration-150 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background hover:opacity-90 active:opacity-95",
        primary:
          "bg-foreground text-background hover:opacity-90 active:opacity-95",
        secondary:
          "bg-secondary text-foreground hover:bg-muted",
        outline:
          "border border-border bg-background text-foreground hover:bg-secondary",
        ghost:
          "bg-transparent text-foreground hover:bg-secondary",
        inkOutline:
          "border border-[hsl(var(--on-dark-hi)/0.4)] bg-transparent text-[hsl(var(--on-dark-hi))] hover:bg-[hsl(var(--on-dark-hi)/0.1)]",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
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
          <span className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
