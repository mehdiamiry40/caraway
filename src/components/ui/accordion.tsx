"use client";

import { useState, useId } from "react";
import { Plus } from "lucide-react";
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
    <div className={cn("w-full border-t border-border", className)}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const triggerId = `accordion-trigger-${instanceId}-${index}`;
        const panelId = `accordion-panel-${instanceId}-${index}`;
        return (
          <div
            key={`${index}-${item.question}`}
            className={cn(
              "border-b border-border transition-colors duration-200",
              isActive && "border-primary/40"
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
                className="group flex w-full min-h-12 items-center justify-between gap-3 sm:gap-4 py-5 sm:py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
                aria-expanded={isActive}
                aria-controls={panelId}
              >
                <span
                  className={cn(
                    "font-display text-base sm:text-lg break-words [overflow-wrap:anywhere] transition-colors duration-200",
                    isActive ? "text-foreground" : "text-foreground group-hover:text-primary"
                  )}
                >
                  {item.question}
                </span>
                <div
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-border bg-secondary text-foreground/80 transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-out-quint)] motion-reduce:transition-none motion-reduce:duration-0",
                    isActive && "rotate-45 border-primary/50 bg-primary/15 text-primary"
                  )}
                >
                  <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </div>
              </button>
            </HeadingTag>
            {/* Grid-rows [0fr]->[1fr] animation: Safari 16+ supports this;
                older Safari will snap without animating (acceptable fallback). */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isActive}
              hidden={!isActive}
              className={cn(
                "grid transition-all duration-300 ease-[var(--ease-out-quint)] motion-reduce:transition-none motion-reduce:duration-0",
                isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pt-0 pr-10 text-[0.9375rem] sm:text-base text-foreground/80 leading-relaxed break-words [overflow-wrap:anywhere]">
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
