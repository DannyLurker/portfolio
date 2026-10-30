import * as React from "react"
import { cn } from "@/lib/utils"

function Section({
  className,
  bordered = true,
  ...props
}: React.ComponentProps<"section"> & {
  bordered?: boolean
}) {
  return (
    <section
      className={cn(
        "scroll-mt-20 py-xl",
        bordered && "border-t border-border",
        className
      )}
      {...props}
    />
  )
}

export { Section }
