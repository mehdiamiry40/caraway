import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { fieldSurfaceClasses, fieldStateClasses } from "./field-classes";

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
            "flex h-12 sm:h-14 w-full appearance-none pl-4 pr-12 py-3 text-base leading-snug",
            fieldSurfaceClasses,
            fieldStateClasses,
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
