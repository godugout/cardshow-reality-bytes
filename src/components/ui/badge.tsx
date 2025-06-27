
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-3 py-1 font-open-sans font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary-600",
        secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        destructive: "border-transparent bg-destructive text-white hover:bg-destructive/90",
        success: "border-transparent bg-success text-white hover:bg-success-600",
        warning: "border-transparent bg-neutral-800 text-white hover:bg-neutral-700",
        accent: "border-transparent bg-accent text-white hover:bg-accent-600",
        outline: "text-neutral-700 border border-neutral-300 hover:bg-neutral-50",
        neutral: "border-transparent bg-neutral-200 text-neutral-800 hover:bg-neutral-300",
      },
      size: {
        default: "text-caption-2-bold",
        sm: "text-xs px-2 py-0.5",
        lg: "text-caption-bold px-4 py-2",
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
