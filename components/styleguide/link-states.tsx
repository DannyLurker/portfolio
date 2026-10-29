import { ArrowUpRight } from "lucide-react"
import { Link } from "@/components/link"

const focusRing = "ring-2 ring-ring ring-offset-2 ring-offset-background"

export function LinkStates() {
  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">Default</p>
        <div className="flex flex-wrap items-center gap-lg">
          <Link href="/styleguide">Inline link</Link>
          <Link href="/styleguide" variant="nav">
            Navigation link
          </Link>
          <Link
            href="/styleguide"
            variant="icon"
            aria-label="Open the project, example"
          >
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">
          Hover, simulated with the hover classes
        </p>
        <div className="flex flex-wrap items-center gap-lg">
          <Link href="/styleguide" className="decoration-electric">
            Inline link
          </Link>
          <Link href="/styleguide" variant="nav" className="text-foreground">
            Navigation link
          </Link>
          <Link
            href="/styleguide"
            variant="icon"
            aria-label="Open the project, example"
            className="bg-accent text-foreground"
          >
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">
          Focus, simulated with the focus ring
        </p>
        <div className="flex flex-wrap items-center gap-lg">
          <Link href="/styleguide" className={focusRing}>
            Inline link
          </Link>
          <Link href="/styleguide" variant="nav" className={focusRing}>
            Navigation link
          </Link>
          <Link
            href="/styleguide"
            variant="icon"
            aria-label="Open the project, example"
            className={focusRing}
          >
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
        <p className="type-body-sm text-muted-foreground">
          An icon link always carries an accessible name, because the icon alone
          carries no text.
        </p>
      </div>
    </div>
  )
}
