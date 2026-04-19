import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Stripe-style thin-stroke icon wrapper.
 * - Normalises stroke width to 1.5 across all Lucide icons.
 * - Standardises sizes: 16 (inline small), 20 (inline), 24 (feature), 28 (hero).
 * - Optional `duotone` layers a filled square at 15% opacity behind the icon
 *   in the current indigo.
 */

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number; size?: number | string }>;

type IconSize = 16 | 20 | 24 | 28 | 32;

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  "aria-hidden"?: boolean;
  label?: string;
  duotone?: boolean;
}

const containerSize: Record<IconSize, string> = {
  16: "h-8 w-8 rounded-md",
  20: "h-10 w-10 rounded-lg",
  24: "h-12 w-12 rounded-xl",
  28: "h-14 w-14 rounded-xl",
  32: "h-16 w-16 rounded-2xl",
};

export function Icon({
  icon: IconComponent,
  size = 20,
  className,
  label,
  duotone = false,
}: IconProps) {
  const common = {
    strokeWidth: 1.5,
    "aria-hidden": label ? undefined : true,
    role: label ? "img" : undefined,
    "aria-label": label,
  } as const;

  if (duotone) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center bg-primary/10 text-primary",
          containerSize[size],
          className,
        )}
      >
        <IconComponent {...common} width={size} height={size} />
      </span>
    );
  }

  return (
    <IconComponent
      {...common}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}
