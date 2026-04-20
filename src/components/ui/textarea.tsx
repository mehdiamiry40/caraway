import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[140px] sm:min-h-[168px] w-full resize-y rounded-[10px] border border-border bg-card px-4 py-3 text-base text-foreground transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
        "placeholder:text-muted-foreground/70",
        "hover:border-border-strong",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.18)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:shadow-[0_0_0_3px_hsl(var(--destructive)/0.18)] aria-[invalid=true]:focus-visible:border-destructive",
        "[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
