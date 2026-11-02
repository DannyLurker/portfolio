"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import Particles from "@/components/backgrounds/particles"

/* Colors mirror the Obsidian Blueprint accents: electric tint, primary core, text. */
const PARTICLE_COLORS = ["#60a5fa", "#3b82f6", "#f8fafc"]
const FADE_VIEWPORTS = 0.9

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

/**
 * The site-wide particle field. It fades with the page scroll: fully present
 * behind the hero, gone once the visitor is a viewport into the content, and
 * back again on the way up. The animation loop rests while it is invisible.
 */
function ParticleField() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const restingRef = useRef(false)
  const [resting, setResting] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    let frame = 0

    const update = () => {
      frame = 0

      const viewport = window.innerHeight || 1
      const distance = Math.max(0, window.scrollY)
      const progress = clamp01(distance / (viewport * FADE_VIEWPORTS))
      const eased = progress * progress * (3 - 2 * progress)
      field.style.opacity = (1 - eased).toFixed(3)

      const nextResting = progress >= 1
      if (nextResting !== restingRef.current) {
        restingRef.current = nextResting
        setResting(nextResting)
      }
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className="particle-field absolute inset-0"
    >
      <div className="particle-field-inner h-full w-full">
        <Particles
          particleCount={320}
          particleSpread={10}
          speed={0.08}
          particleColors={PARTICLE_COLORS}
          particleBaseSize={80}
          sizeRandomness={1.2}
          alphaParticles
          glow={0.55}
          twinkle={0.4}
          depthOfField={0.15}
          drift="down"
          driftSpeed={0.35}
          variation={2}
          moveParticlesOnHover
          hoverEffect="parallax"
          particleHoverFactor={0.6}
          clickBurst={false}
          paused={shouldReduceMotion || resting}
        />
      </div>
    </div>
  )
}

export { ParticleField }
