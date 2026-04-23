import React from "react";
import { cn } from "@/lib/utils";
import {
  fieldSurfaceClasses,
  fieldStateClasses,
  fieldAutofillClasses,
} from "./field-classes";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 sm:h-14 w-full px-4 text-base leading-snug",
          fieldSurfaceClasses,
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground/60",
          fieldStateClasses,
          fieldAutofillClasses,
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
