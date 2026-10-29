"use client"

import * as React from "react"
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

function StatusPill({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <span
      data-slot="status-pill"
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-sm py-xs type-body-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="relative flex size-2 shrink-0">
        <LazyMotion features={domAnimation} strict>
          <m.span
            className="absolute inset-0 rounded-full bg-primary"
            initial={false}
            animate={
              shouldReduceMotion
                ? { opacity: 0 }
                : { scale: [1, 2.4], opacity: [0.55, 0] }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.6,
                    repeat: Infinity,
                    ease: [0.2, 0, 0, 1],
                  }
            }
          />
        </LazyMotion>
        <span className="relative size-2 rounded-full bg-primary" />
      </span>
      <span>{children}</span>
    </span>
  )
}

export { StatusPill }
