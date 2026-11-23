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
    <div className={cn("w-full border-t-2 border-foreground", className)}>
      {items.map((item, index) => {
        return (
          <details
            key={`${index}-${item.question}`}
            className="group border-b border-border transition-colors duration-200"
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-5 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-4 sm:py-6 [&::-webkit-details-marker]:hidden">
              <HeadingTag className="m-0 contents">
                <span className="font-display text-xl font-bold leading-[1.15] text-foreground break-words [overflow-wrap:anywhere] sm:text-[1.375rem]">
                  {item.question}
                </span>
              </HeadingTag>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-secondary text-foreground transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-quint)] group-hover:bg-cta group-hover:text-cta-foreground group-open:rotate-45 group-open:bg-cta group-open:text-cta-foreground motion-reduce:transition-none motion-reduce:duration-0">
                <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
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
