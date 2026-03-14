import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceVariants = cva("text-ink", {
  variants: {
    variant: {
      default: "bg-paper border border-ink/20 rounded-lg",
      elevated: "bg-paper border border-ink/25 rounded-lg shadow-paper",
      muted: "bg-secondary/20 border border-ink/15 rounded-lg",
      modal: "bg-paper paper-texture border border-ink/15 rounded-sm shadow-2xl",
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
