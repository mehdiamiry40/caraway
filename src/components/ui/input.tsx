import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 sm:h-14 w-full rounded-lg border border-border bg-card px-4 text-base ring-offset-background shadow-[0_1px_0_0_rgba(20,52,88,0.02)] transition-all duration-200 motion-reduce:transition-none",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground/60",
          "hover:border-primary/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:ring-destructive/30 aria-[invalid=true]:focus-visible:border-destructive",
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
