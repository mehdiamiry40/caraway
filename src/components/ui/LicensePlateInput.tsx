"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LicensePlateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  prefix?: string;
  prefixTint?: "green" | "purple" | "orange";
}

const prefixTints: Record<NonNullable<LicensePlateInputProps["prefixTint"]>, string> = {
  green: "bg-cta text-cta-foreground",
  purple: "bg-primary text-primary-foreground",
  orange: "bg-accent text-accent-foreground",
};

/**
 * Looping-style plate input: yellow "plate" body with a coloured country/state
 * prefix block, and a big bold uppercase input field. Used as the primary lead
 * capture in the hero and final CTA bands.
 */
export const LicensePlateInput = forwardRef<HTMLInputElement, LicensePlateInputProps>(
  function LicensePlateInput(
    { className, prefix = "QLD", prefixTint = "green", placeholder = "ABC 123", ...rest },
    ref,
  ) {
    return (
      <div
        className={cn(
          "group relative flex h-16 sm:h-[72px] w-full items-stretch overflow-hidden rounded-2xl bg-plate shadow-lg ring-1 ring-[hsl(var(--plate-foreground)/0.15)] transition-[box-shadow,transform] duration-200 ease-[var(--ease-out-quint)] focus-within:ring-2 focus-within:ring-primary/60 focus-within:-translate-y-0.5",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-full w-14 sm:w-16 shrink-0 items-center justify-center font-display text-xs sm:text-sm font-black tracking-[0.1em]",
            prefixTints[prefixTint],
          )}
        >
          {prefix}
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={placeholder}
          className="flex-1 min-w-0 h-full bg-transparent px-4 sm:px-6 font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.12em] text-[hsl(var(--plate-foreground))] placeholder:text-[hsl(var(--plate-foreground)/0.45)] placeholder:font-black focus:outline-none"
          {...rest}
        />
      </div>
    );
  },
);
