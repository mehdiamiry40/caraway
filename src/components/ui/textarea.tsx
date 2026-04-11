import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] sm:min-h-[140px] w-full rounded-lg border border-border bg-card px-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/40 disabled:hover:border-border resize-y aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.03] aria-[invalid=true]:focus-visible:ring-destructive/40 aria-[invalid=true]:focus-visible:border-destructive [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
