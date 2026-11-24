import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, defaultValue, value, ...props }, ref) => {
    const initialValue =
      value === undefined && defaultValue === undefined && placeholder
        ? ""
        : defaultValue;

    return (
      <div className="group relative">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-md border border-input bg-card py-0 pl-3.5 pr-10 text-base leading-snug text-foreground ring-offset-background transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
            "hover:border-foreground/70",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 disabled:hover:border-input",
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          value={value}
          defaultValue={initialValue}
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
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
