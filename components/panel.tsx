import * as React from "react"
import { cn } from "@/lib/utils"

function Panel({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & {
  interactive?: boolean
}) {
  return (
    <div
      data-slot="panel"
      data-interactive={interactive || undefined}
      className={cn(
        "rounded-lg border border-border bg-card p-md md:p-lg",
        interactive &&
          "transition-colors hover:border-border-accent hover:bg-card-hover",
        className
      )}
      {...props}
    />
  )
}

export { Panel }
