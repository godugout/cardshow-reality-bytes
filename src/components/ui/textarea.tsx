
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-2xl border-0 bg-background/50 backdrop-blur-sm px-4 py-3 text-base text-foreground ring-2 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:bg-background/80 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
)
Textarea.displayName = "Textarea"

export { Textarea }
