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
}

export function Accordion({ items, className }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const instanceId = useId();

  return (
    <div className={cn("w-full space-y-3", className)}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const triggerId = `accordion-trigger-${instanceId}-${index}`;
        const panelId = `accordion-panel-${instanceId}-${index}`;
        return (
          <div
            key={item.question}
            className={cn(
              "border bg-white rounded-lg overflow-hidden transition-colors",
              isActive ? "border-border" : "border-border/60 hover:border-border"
            )}
          >
            <button
              type="button"
              id={triggerId}
              onClick={() => setActiveIndex(isActive ? null : index)}
              className="flex w-full min-h-12 items-center justify-between gap-2 sm:gap-3 p-4 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
              aria-expanded={isActive}
              aria-controls={panelId}
            >
              <span className="font-display text-base sm:text-lg font-medium text-foreground break-words [overflow-wrap:anywhere]">
                {item.question}
              </span>
              <div
                className={cn(
                  "flex-shrink-0 ml-2 sm:ml-4 flex items-center justify-center h-8 w-8 rounded-full bg-muted text-primary/60 transition-transform duration-300",
                  isActive && "rotate-180"
                )}
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </div>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-all duration-300 ease-in-out",
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
