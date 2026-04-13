"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  onItemToggle?: (question: string, isOpening: boolean) => void;
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
  onItemToggle,
  headingLevel = 3,
}: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const instanceId = useId();
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <div className={cn("w-full space-y-3", className)}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const triggerId = `accordion-trigger-${instanceId}-${index}`;
        const panelId = `accordion-panel-${instanceId}-${index}`;
        return (
          <div
            key={`${index}-${item.question}`}
            className={cn(
              "border bg-card rounded-lg overflow-hidden transition-colors",
              isActive ? "border-border" : "border-border/60 hover:border-border"
            )}
          >
            <HeadingTag className="m-0">
              <button
                type="button"
                id={triggerId}
                onClick={() => {
                  const willOpen = !isActive;
                  setActiveIndex(willOpen ? index : null);
                  onItemToggle?.(item.question, willOpen);
                }}
                className="flex w-full min-h-12 items-center justify-between gap-2 sm:gap-3 p-4 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
                aria-expanded={isActive}
                aria-controls={panelId}
              >
                <span className="font-display text-base sm:text-lg font-medium text-foreground break-words [overflow-wrap:anywhere]">
                  {item.question}
                </span>
                <div
                  className={cn(
                    "flex-shrink-0 ml-2 sm:ml-4 flex items-center justify-center h-8 w-8 rounded-full bg-muted text-primary/70 transition-transform duration-300 motion-reduce:transition-none motion-reduce:duration-0",
                    isActive && "rotate-180"
                  )}
                >
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </div>
              </button>
            </HeadingTag>
            {/* Grid-rows [0fr]->[1fr] animation: Safari 16+ supports this;
                older Safari will snap without animating (acceptable fallback). */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0",
                isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6 text-muted-foreground text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
