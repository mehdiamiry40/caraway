import { cn } from "@/lib/utils";

const RAYS = 18;
const CENTER = 300;
const RADIUS = 290;

/* Straight strokes through a shared centre, like a wheel's spokes seen
   head-on. Coordinates are computed once at module load, so the SVG is
   static markup with no client cost. */
const rays = Array.from({ length: RAYS }, (_, index) => {
  const angle = (Math.PI * index) / RAYS + 0.08;
  const dx = RADIUS * Math.cos(angle);
  const dy = RADIUS * Math.sin(angle);
  return {
    x1: (CENTER + dx).toFixed(1),
    y1: (CENTER + dy).toFixed(1),
    x2: (CENTER - dx).toFixed(1),
    y2: (CENTER - dy).toFixed(1),
  };
});

export function Starburst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
      className={cn("text-accent", className)}
    >
      <g stroke="currentColor" strokeWidth={15}>
        {rays.map((ray, index) => (
          <line key={index} {...ray} />
        ))}
      </g>
      <circle cx={CENTER} cy={CENTER} r={46} fill="currentColor" />
      <circle cx={CENTER} cy={CENTER} r={18} className="fill-secondary" />
    </svg>
  );
}
