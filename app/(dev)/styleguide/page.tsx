import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { ButtonStates } from "@/components/styleguide/button-states"
import { CardStates } from "@/components/styleguide/card-states"
import { FocusWalk } from "@/components/styleguide/focus-walk"
import { FormStates } from "@/components/styleguide/form-states"
import { GridDemo } from "@/components/styleguide/grid-demo"
import { LinkStates } from "@/components/styleguide/link-states"
import { RadiusScale } from "@/components/styleguide/radius-scale"
import { SpacingScale } from "@/components/styleguide/spacing-scale"
import { TokenSwatches } from "@/components/styleguide/token-swatches"
import { TypeScale } from "@/components/styleguide/type-scale"

export const metadata: Metadata = {
  title: "Styleguide",
  robots: {
    index: false,
    follow: false,
  },
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return (
    <main className="flex flex-col pb-xl">
      <Container className="pt-xl">
        <p className="type-mono-badge text-electric">Development only</p>
        <h1 className="type-display-hero mt-sm text-foreground">
          Obsidian system
        </h1>
        <p className="mt-md max-w-2xl type-body-lg text-muted-foreground">
          Every color token, type step, spacing step, radius and primitive
          state. This route is not part of the public site and is never
          indexed.
        </p>
      </Container>

      <Section className="mt-xl">
        <Container>
          <h2 className="type-headline-lg text-foreground">Color tokens</h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            Contrast is measured against the canvas and against the panel. Text
            pairs must reach 4.5 to 1 and control boundaries 3 to 1. Decorative
            values such as the faint gray are shown for reference only.
          </p>
          <div className="mt-lg">
            <TokenSwatches />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="type-headline-lg text-foreground">Type scale</h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            Ten named classes. Display and headline large step down at the
            tablet breakpoint, every other step stays fixed. Resize the window to
            compare both scales.
          </p>
          <div className="mt-lg">
            <TypeScale />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="type-headline-lg text-foreground">
            Spacing and radius
          </h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            Spacing uses a 4px step with five named values. Radius has six fixed
            values, and the pill radius is reserved for the status pill.
          </p>
          <div className="mt-lg grid grid-cols-1 gap-xl lg:grid-cols-2">
            <SpacingScale />
            <RadiusScale />
          </div>
          <h3 className="mt-xl type-headline-sm text-foreground">Layout grid</h3>
          <div className="mt-md">
            <GridDemo />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="type-headline-lg text-foreground">Buttons and links</h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            Four variants, two sizes, plus default, hover, focus, disabled and
            loading states. The ghost variant uses a mono label.
          </p>
          <div className="mt-lg">
            <ButtonStates />
          </div>
          <div className="mt-xl">
            <LinkStates />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="type-headline-lg text-foreground">Form controls</h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            Inputs and textareas share a 6px radius, the background fill and the
            readable boundary color. Help text and error text are announced with
            the control.
          </p>
          <div className="mt-lg">
            <FormStates />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="type-headline-lg text-foreground">
            Panels, badges and data
          </h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            The panel, code panel, metric card, badge, tag and status pill, in
            the states the site uses.
          </p>
          <div className="mt-lg">
            <CardStates />
          </div>
        </Container>
      </Section>

      <Section id="focus-walk">
        <Container>
          <h2 className="type-headline-lg text-foreground">
            Focus and motion walk
          </h2>
          <p className="mt-sm max-w-2xl type-body-md text-muted-foreground">
            The keyboard path and the reduced motion rule, checked by hand
            before any page ships.
          </p>
          <div className="mt-lg">
            <FocusWalk />
          </div>
        </Container>
      </Section>
    </main>
  )
}

