import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type ControlProps = {
  id?: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean
  "aria-required"?: boolean
}

function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  const control = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<ControlProps>, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        "aria-required": required || undefined,
      })
    : children

  return (
    <div className={cn("flex flex-col gap-sm", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-electric">
            *
          </span>
        ) : null}
      </Label>
      {control}
      {hint && !error ? (
        <p id={hintId} className="type-body-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="type-body-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
