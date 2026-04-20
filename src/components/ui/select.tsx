import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <div className="group relative">
        <select
          className={cn(
            "flex h-12 sm:h-14 w-full appearance-none rounded-lg border border-border bg-card pl-4 pr-12 py-3 text-base ring-offset-background shadow-[0_1px_0_0_hsl(var(--shadow-color)/0.08)] transition-all duration-200 motion-reduce:transition-none",
            "hover:border-primary/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_hsl(var(--accent)/0.12)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:ring-destructive/30 aria-[invalid=true]:focus-visible:border-destructive",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
