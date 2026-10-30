import { cn } from "@/lib/utils"

function SkipLink({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <a
      href="#main"
      className={cn(
        "sr-only type-body-sm",
        "focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50",
        "focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-md focus:py-sm",
        "focus:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {label}
    </a>
  )
}

export { SkipLink }
