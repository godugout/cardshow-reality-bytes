
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-ring/20 focus:ring-offset-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-0 backdrop-blur-sm",
        secondary: "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground border-0 backdrop-blur-sm",
        destructive: "bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border-0 backdrop-blur-sm",
        success: "bg-gradient-to-r from-success/20 to-success/10 text-success border-0 backdrop-blur-sm",
        warning: "bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-0 backdrop-blur-sm",
        outline: "border-2 border-primary/20 text-foreground hover:bg-primary/5",
        neutral: "bg-muted/50 text-muted-foreground hover:bg-muted/70 backdrop-blur-sm border-0",
      },
      size: {
        default: "text-sm px-4 py-2",
        sm: "text-xs px-3 py-1.5",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
