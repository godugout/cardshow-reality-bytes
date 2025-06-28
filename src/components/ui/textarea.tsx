
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-3xl border-0 bg-background/50 backdrop-blur-xl px-6 py-4 text-base text-foreground ring-2 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-primary/40 focus-visible:bg-background/80 focus-visible:shadow-soft disabled:cursor-not-allowed disabled:opacity-50 resize-none",
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
