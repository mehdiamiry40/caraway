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
    <div className={cn("w-full border-t border-foreground/25", className)}>
      {items.map((item, index) => {
        return (
          <details
            key={`${index}-${item.question}`}
            className="group border-b border-border"
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-4 py-4 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:py-5 [&::-webkit-details-marker]:hidden">
              <HeadingTag className="m-0 contents">
                <span className="font-sans text-[1.0625rem] font-semibold leading-snug tracking-normal text-foreground break-words [overflow-wrap:anywhere] group-hover:text-primary sm:text-lg">
                  {item.question}
                </span>
              </HeadingTag>
              <Plus
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary transition-transform duration-200 ease-[var(--ease-out-quint)] group-open:rotate-45 motion-reduce:transition-none"
                strokeWidth={2}
                aria-hidden="true"
              />
            </summary>
            <div className="max-w-[68ch] pb-6 pr-8 text-base leading-relaxed text-foreground/85 break-words [overflow-wrap:anywhere]">
              {item.answer}
            </div>
          </details>
        );
      })}
    </div>
  );
}
