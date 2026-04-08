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
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => (
          <li key={item.href || item.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className={cn("text-xs select-none", light ? "text-white/30" : "text-muted-foreground/40")}>/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5 -my-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                  light
                    ? "text-white/50 hover:text-white hover:bg-white/[0.08]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("font-medium px-1.5 py-0.5 -mx-1.5 -my-0.5 rounded-md", light ? "text-white/90 bg-white/[0.06]" : "text-foreground bg-muted/40")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
