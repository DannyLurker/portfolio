import * as React from "react"
import { cn } from "@/lib/utils"

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-page px-5 md:px-8 lg:px-12",
        className
      )}
      {...props}
    />
  )
}

export { Container }
