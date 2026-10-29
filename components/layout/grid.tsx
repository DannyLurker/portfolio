import * as React from "react"
import { cn } from "@/lib/utils"

function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-md md:grid-cols-8 md:gap-5 lg:grid-cols-12 lg:gap-lg",
        className
      )}
      {...props}
    />
  )
}

export { Grid }
