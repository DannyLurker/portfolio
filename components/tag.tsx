import * as React from "react"
import { cn } from "@/lib/utils"

function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tag"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded border border-border bg-popover px-2 py-1 type-mono-badge text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Tag }
