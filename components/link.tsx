import type { ComponentProps } from "react"
import NextLink from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const linkVariants = cva(
  "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        inline:
          "text-electric underline decoration-electric/40 underline-offset-4 hover:decoration-electric",
        nav: "type-body-md text-muted-foreground hover:text-foreground",
        icon: "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
)

type LinkProps = ComponentProps<typeof NextLink> &
  VariantProps<typeof linkVariants>

function Link({ className, variant, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Link, linkVariants }
