"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react"
import { AnimatePresence, domAnimation, LazyMotion, m, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"

const INTRO_SESSION_KEY = "portfolio:site-intro:v1"

type IntroState = "pending" | "open" | "closed"

let introState: IntroState = "pending"
let introStateInitialized = false
const introStateListeners = new Set<() => void>()

function notifyIntroState() {
  for (const listener of introStateListeners) listener()
}

function getIntroState(): IntroState {
  return introState
}

function getServerIntroState(): IntroState {
  return "open"
}

function subscribeIntroState(listener: () => void) {
  introStateListeners.add(listener)

  if (!introStateInitialized) {
    introStateInitialized = true

    try {
      introState = window.sessionStorage.getItem(INTRO_SESSION_KEY)
        ? "closed"
        : "open"
    } catch {
      introState = "closed"
    }

    notifyIntroState()
  }

  return () => {
    introStateListeners.delete(listener)
  }
}

function completeIntroState() {
  if (introState !== "open") return

  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "complete")
  } catch {
    // Keep the current page usable when browser storage is blocked.
  }

  introState = "closed"
  notifyIntroState()
}

const METEORS = [
  { top: "8%", left: "8%", x: 240, y: 220, duration: 8, delay: 0 },
  { top: "18%", left: "44%", x: 220, y: 200, duration: 9, delay: 2.7 },
  { top: "4%", left: "76%", x: 200, y: 180, duration: 8.5, delay: 5.4 },
]

function SiteAtmosphere({
  name,
  skipLabel,
}: {
  name: string
  skipLabel: string
}) {
  const introState = useSyncExternalStore(
    subscribeIntroState,
    getIntroState,
    getServerIntroState
  )
  const shouldReduceMotion = useReducedMotion() ?? false
  const headingRef = useRef<HTMLParagraphElement>(null)
  const skipButtonRef = useRef<HTMLButtonElement>(null)

  const finishIntro = useCallback(() => {
    completeIntroState()
    document.getElementById("main")?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (shouldReduceMotion && introState === "open") completeIntroState()
  }, [introState, shouldReduceMotion])

  useEffect(() => {
    if (introState !== "open" || shouldReduceMotion) return

    headingRef.current?.focus({ preventScroll: true })
    const timeout = window.setTimeout(finishIntro, 1650)
    return () => window.clearTimeout(timeout)
  }, [finishIntro, introState, shouldReduceMotion])

  function handleIntroKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      finishIntro()
      return
    }

    if (event.key !== "Tab") return

    if (event.shiftKey && document.activeElement === headingRef.current) {
      event.preventDefault()
      skipButtonRef.current?.focus()
    } else if (!event.shiftKey && document.activeElement === skipButtonRef.current) {
      event.preventDefault()
      headingRef.current?.focus()
    }
  }

  return (
    <>
      <div aria-hidden="true" className="site-atmosphere fixed inset-0 z-0">
        <div className="site-atmosphere-stars absolute inset-0" />
        <LazyMotion features={domAnimation} strict>
          {METEORS.map((meteor, index) => (
            <m.span
              key={index}
              className="site-meteor absolute"
              style={{ top: meteor.top, left: meteor.left }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.65, 0],
                x: [0, meteor.x],
                y: [0, meteor.y],
              }}
              transition={{
                duration: meteor.duration,
                delay: meteor.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </LazyMotion>
      </div>

      <AnimatePresence>
        {introState === "open" && !shouldReduceMotion ? (
          <m.div
            id="site-intro"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-intro-name"
            onKeyDown={handleIntroKeyDown}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background px-lg"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <m.p
              ref={headingRef}
              id="site-intro-name"
              role="heading"
              aria-level={2}
              tabIndex={-1}
              className="site-intro-name type-display-hero text-center text-foreground outline-none"
            >
              {name}
            </m.p>

            <Button
              ref={skipButtonRef}
              type="button"
              size="sm"
              className="absolute right-5 top-5 min-h-11 md:right-8 md:top-8"
              onClick={finishIntro}
            >
              {skipLabel}
            </Button>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export { SiteAtmosphere }
