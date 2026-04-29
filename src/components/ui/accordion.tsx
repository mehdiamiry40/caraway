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
            className="border-b border-border"
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
                    "text-base font-medium break-words [overflow-wrap:anywhere] transition-opacity duration-150",
                    "text-foreground group-hover:opacity-70"
                  )}
                >
                  {item.question}
                </span>
                <div
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full text-muted-foreground transition-transform duration-200 ease-[var(--ease-out-quint)] motion-reduce:transition-none motion-reduce:duration-0",
                    isActive && "rotate-45"
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
                <div className="pb-6 pt-0 pr-10 text-sm sm:text-base text-muted-foreground leading-relaxed break-words [overflow-wrap:anywhere]">
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
