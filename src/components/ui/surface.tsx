import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceVariants = cva("text-ink", {
  variants: {
    variant: {
      default: "bg-paper border border-pencil/30 rounded-xl paper-texture",
      elevated: "bg-paper border border-pencil/35 rounded-xl paper-texture shadow-paper",
      muted: "bg-secondary/15 border border-pencil/25 rounded-xl paper-texture",
      modal: "bg-paper paper-texture border border-pencil/30 rounded-lg shadow-2xl",
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
