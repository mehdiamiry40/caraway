import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 sm:h-14 w-full min-h-[44px] rounded-lg border border-border bg-card px-4 py-3 text-base ring-offset-background transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-primary/40 disabled:hover:border-border",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.03] aria-[invalid=true]:focus-visible:ring-destructive/40 aria-[invalid=true]:focus-visible:border-destructive",
          "[&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
