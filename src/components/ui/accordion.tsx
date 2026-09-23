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
    <div className={cn("w-full border-t border-border", className)}>
      {items.map((item, index) => {
        return (
          <details
            key={`${index}-${item.question}`}
            className="group border-b border-border"
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
              <HeadingTag className="m-0 contents">
                <span className="text-base font-semibold text-foreground break-words [overflow-wrap:anywhere]">
                  {item.question}
                </span>
              </HeadingTag>
              <Plus
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </summary>
            <div className="max-w-[65ch] pb-6 pr-10 text-base text-muted-foreground break-words [overflow-wrap:anywhere]">
              {item.answer}
            </div>
          </details>
        );
      })}
    </div>
  );
}
