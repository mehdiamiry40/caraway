import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[136px] w-full resize-y rounded-sm border border-input bg-card px-3.5 py-3 text-base leading-relaxed text-foreground ring-offset-background transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
        "placeholder:text-muted-foreground",
        "hover:border-foreground/70",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 disabled:hover:border-input",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:ring-destructive",
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
