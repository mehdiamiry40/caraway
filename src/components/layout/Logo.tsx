import { cn } from "@/lib/utils";

/**
 * Wordmark: the name set in the display serif over a small tracked caption.
 * `tone` picks the colour pair for light or dark grounds.
 */
export function Logo({
  tone = "dark",
  size = "md",
  className,
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col items-center leading-none",
        tone === "light" ? "text-on-dark-hi" : "text-primary",
        className,
      )}
    >
      <span
        className={cn(
          "font-display tracking-[0.04em]",
          size === "sm" && "text-[1.65rem]",
          size === "md" && "text-[1.9rem] sm:text-[2.35rem]",
          size === "lg" && "text-[2.6rem] sm:text-[3rem]",
        )}
      >
        Caraway
      </span>
      <span
        className={cn(
          "mt-1.5 pl-[0.4em] font-sans font-bold uppercase tracking-[0.4em]",
          size === "sm" ? "text-[0.55rem]" : "text-[0.6rem] sm:text-[0.66rem]",
        )}
      >
        Vehicle buying
      </span>
    </span>
  );
}
