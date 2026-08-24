import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[136px] w-full resize-y rounded-sm border border-input bg-card px-4 py-3 text-[15px] ring-offset-background transition-all duration-200 motion-reduce:transition-none",
        "placeholder:text-muted-foreground",
        "hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15 focus-visible:ring-offset-0 focus-visible:border-accent focus-visible:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:ring-destructive/30 aria-[invalid=true]:focus-visible:border-destructive",
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
