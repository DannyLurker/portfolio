import * as React from "react"
import { Panel } from "@/components/panel"
import { cn } from "@/lib/utils"

function MetricCard({
  label,
  value,
  trend,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Panel>, "children"> & {
  label: string
  value: string
  trend?: string
}) {
  return (
    <Panel className={cn("flex flex-col gap-sm", className)} {...props}>
      <span className="type-mono-badge text-muted-foreground">{label}</span>
      <span className="type-mono-stat text-foreground">{value}</span>
      {trend ? (
        <span className="type-body-sm text-muted-foreground">{trend}</span>
      ) : null}
    </Panel>
  )
}

export { MetricCard }
