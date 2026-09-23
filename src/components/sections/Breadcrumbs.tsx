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
      <nav aria-label="Breadcrumb" className="text-xs overflow-x-auto scrollbar-none">
        <ol className="flex items-center gap-1 sm:gap-1.5 flex-nowrap whitespace-nowrap">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={item.href || item.label}
                className={cn(
                  "flex items-center gap-1 sm:gap-1.5",
                  isLast ? "min-w-0 shrink" : "shrink-0"
                )}
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-xs select-none shrink-0",
                      light ? "text-primary-foreground/80" : "text-muted-foreground/60"
                    )}
                  >
                    /
                  </span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "transition-colors duration-150 rounded-sm px-1.5 py-1 -mx-1.5 -my-1 min-h-11 inline-flex items-center touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                      light
                        ? "text-primary-foreground/85 hover:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={cn(
                      "px-1.5 py-1 -mx-1.5 -my-1",
                      isLast && "block max-w-[16rem] sm:max-w-[28rem] md:max-w-none truncate",
                      light ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
