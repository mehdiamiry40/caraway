import * as React from "react"

import { cn } from "@/lib/utils"
import {
  fieldSurfaceClasses,
  fieldStateClasses,
  fieldAutofillClasses,
} from "./field-classes";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[136px] sm:min-h-[160px] w-full resize-y px-4 py-3 text-base",
        fieldSurfaceClasses,
        "placeholder:text-muted-foreground",
        fieldStateClasses,
        fieldAutofillClasses,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
