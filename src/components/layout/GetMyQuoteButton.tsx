"use client";

import { Button } from "@/components/ui/button";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";
import type { ButtonProps } from "@/components/ui/button";

type Props = Omit<ButtonProps, "onClick">;

export function GetMyQuoteButton({ children, ...props }: Props) {
  const scrollToQuote = useScrollToQuote();
  return (
    <Button onClick={scrollToQuote} {...props}>
      {children}
    </Button>
  );
}
