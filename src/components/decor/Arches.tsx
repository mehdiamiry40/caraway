import { cn } from "@/lib/utils";

const BASE = 320;

function archPaths(cx: number, legTop: number, outer: number, count: number, gap: number) {
  return Array.from({ length: count }, (_, index) => outer - index * gap)
    .filter((radius) => radius > 6)
    .map(
      (radius) =>
        `M${cx - radius},${BASE} L${cx - radius},${legTop} A${radius},${radius} 0 0 1 ${cx + radius},${legTop} L${cx + radius},${BASE}`,
    );
}

const NAVY_ARCHES = archPaths(112, 125, 100, 11, 9);
const CORAL_ARCHES = archPaths(258, 215, 98, 11, 9);

/* Nested arches for the bottom corner of a light section: one tall set in
   muted navy, one shorter set in coral. Decorative only. */
export function Arches({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none", className)}
    >
      <g fill="none" strokeWidth={2.5} className="stroke-primary/35">
        {NAVY_ARCHES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" strokeWidth={2.5} className="stroke-accent">
        {CORAL_ARCHES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
