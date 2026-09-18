import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  /**
   * Semantic heading level used for each accordion trigger. Defaults to 3.
   * Use 2 on pages where the nearest heading above the accordion is an h1
   * to avoid skipping heading levels.
   */
  headingLevel?: 2 | 3 | 4;
}

export function Accordion({
  items,
  className,
  headingLevel = 3,
}: AccordionProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <div className={cn("w-full border-t border-accent/25", className)}>
      {items.map((item, index) => {
        return (
          <details
            key={`${index}-${item.question}`}
            className="group border-b border-accent/25 transition-colors duration-200 open:border-accent/60"
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-5 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-4 sm:py-6 [&::-webkit-details-marker]:hidden">
              <HeadingTag className="m-0 contents">
                <span className="font-display text-lg font-semibold text-foreground break-words transition-colors duration-200 [overflow-wrap:anywhere] group-hover:text-accent-ink sm:text-xl">
                  {item.question}
                </span>
              </HeadingTag>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-background text-accent-ink transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-out-quint)] group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-accent-foreground motion-reduce:transition-none motion-reduce:duration-0">
                <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </span>
            </summary>
            <div className="pb-6 pt-0 pr-10 text-[0.9375rem] leading-relaxed text-foreground/80 break-words [overflow-wrap:anywhere] sm:text-base">
              {item.answer}
            </div>
          </details>
        );
      })}
    </div>
  );
}
