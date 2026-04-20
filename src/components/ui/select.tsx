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
            "flex h-12 sm:h-[52px] w-full appearance-none rounded-[10px] border border-border bg-card pl-4 pr-12 py-3 text-base text-foreground transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
            "hover:border-border-strong",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.18)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:shadow-[0_0_0_3px_hsl(var(--destructive)/0.18)] aria-[invalid=true]:focus-visible:border-destructive",
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
