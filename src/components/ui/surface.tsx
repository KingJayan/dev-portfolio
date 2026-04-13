import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceVariants = cva("text-ink backdrop-blur-2xl", {
  variants: {
    variant: {
      default:  "surface-default border border-pencil/15 rounded-xl",
      elevated: "surface-elevated border border-pencil/20 rounded-xl shadow-paper",
      muted:    "bg-paper/25 border border-pencil/12 rounded-xl backdrop-blur-xl",
      modal:    "surface-modal border border-pencil/20 rounded-lg shadow-paper-hover backdrop-blur-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cn(surfaceVariants({ variant }), className)} {...props} />
  }
)
Surface.displayName = "Surface"

export { Surface, surfaceVariants }
