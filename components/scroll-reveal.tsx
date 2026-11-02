"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Reveals its children once as they scroll into view. The hidden state is only
 * applied after mount, so the content stays visible without JavaScript and for
 * visitors who prefer reduced motion.
 */
function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduceMotion || typeof IntersectionObserver === "undefined") return

    // Content that is already on screen should never be hidden or replayed.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return

    node.dataset.reveal = "pending"

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return

        node.dataset.reveal = "revealed"
        observer.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("scroll-reveal", className)}>
      {children}
    </div>
  )
}

export { ScrollReveal }
