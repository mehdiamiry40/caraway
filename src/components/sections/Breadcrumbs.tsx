import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  light?: boolean;
}

export function Breadcrumbs({ items, light }: BreadcrumbsProps) {
  return (
    <div className="relative">
      <nav aria-label="Breadcrumb" className="text-sm overflow-x-auto scrollbar-none">
        <ol className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
          {items.map((item, i) => (
            <li key={item.href || item.label} className="flex items-center gap-1.5 min-w-0 shrink-0 last:shrink">
              {i > 0 && (
                <span aria-hidden="true" className={cn("text-xs select-none", light ? "text-primary-foreground/80" : "text-muted-foreground/60")}>/</span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors duration-200 rounded-md px-1.5 py-1 -mx-1.5 -my-1 min-h-11 inline-flex items-center touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                    light
                      ? "text-primary-foreground/80 hover:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={cn("font-medium px-1.5 py-1 -mx-1.5 -my-1 rounded-md", light ? "text-primary-foreground/90" : "text-foreground")}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent",
          light ? "from-primary" : "from-background"
        )}
      />
    </div>
  );
}
