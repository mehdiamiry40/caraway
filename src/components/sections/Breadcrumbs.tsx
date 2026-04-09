import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <nav aria-label="Breadcrumb" className="text-sm overflow-x-auto scrollbar-none">
      <ol className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
        {items.map((item, i) => (
          <li key={item.href || item.label} className="flex items-center gap-1.5 min-w-0 shrink-0 last:shrink">
            {i > 0 && (
              <span aria-hidden="true" className={cn("text-xs select-none", light ? "text-white/30" : "text-muted-foreground/40")}>/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "transition-colors duration-200 rounded-md px-1.5 py-1 -mx-1.5 -my-1 min-h-[44px] inline-flex items-center touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                  light
                    ? "text-white/50 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("font-medium px-1.5 py-1 -mx-1.5 -my-1 rounded-md truncate max-w-[200px] sm:max-w-none", light ? "text-white/90" : "text-foreground")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
