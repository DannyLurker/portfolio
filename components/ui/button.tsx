import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-sm rounded-md border font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-glow",
        secondary:
          "border-border bg-transparent text-foreground hover:border-border-accent hover:bg-accent",
        ghost:
          "border-transparent bg-transparent type-mono-badge text-muted-foreground hover:bg-card hover:text-foreground",
        icon: "border-border bg-transparent text-muted-foreground hover:border-border-accent hover:bg-accent hover:text-foreground",
      },
      size: {
        sm: "type-body-sm px-3 py-1.5 font-medium",
        md: "type-body-md px-[18px] py-2.5 font-medium",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const resolvedSize = variant === "icon" ? "icon" : size

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      className={cn(buttonVariants({ variant, size: resolvedSize }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : null}
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
