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
            "flex h-11 w-full appearance-none rounded-md border border-border bg-card pl-3 pr-10 py-2 text-base leading-snug transition-colors duration-150",
            "hover:border-foreground/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
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
        <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-150 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
