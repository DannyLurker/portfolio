import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ButtonStates() {
  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">Default</p>
        <div className="flex flex-wrap items-center gap-md">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
          <Button variant="ghost">Ghost action</Button>
          <Button variant="icon" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">
          Hover, simulated with the hover classes
        </p>
        <div className="flex flex-wrap items-center gap-md">
          <Button className="bg-primary-hover shadow-glow">Primary action</Button>
          <Button
            variant="secondary"
            className="border-border-accent bg-accent"
          >
            Secondary action
          </Button>
          <Button variant="ghost" className="bg-card text-foreground">
            Ghost action
          </Button>
          <Button
            variant="icon"
            aria-label="Open menu"
            className="border-border-accent bg-accent text-foreground"
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">
          Focus, simulated with the focus ring
        </p>
        <div className="flex flex-wrap items-center gap-md">
          <Button className="ring-2 ring-ring ring-offset-2 ring-offset-background">
            Primary action
          </Button>
          <Button
            variant="secondary"
            className="ring-2 ring-ring ring-offset-2 ring-offset-background"
          >
            Secondary action
          </Button>
          <Button
            variant="ghost"
            className="ring-2 ring-ring ring-offset-2 ring-offset-background"
          >
            Ghost action
          </Button>
          <Button
            variant="icon"
            aria-label="Open menu"
            className="ring-2 ring-ring ring-offset-2 ring-offset-background"
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">Disabled</p>
        <div className="flex flex-wrap items-center gap-md">
          <Button disabled>Primary action</Button>
          <Button variant="secondary" disabled>
            Secondary action
          </Button>
        </div>
        <p className="type-body-sm text-muted-foreground">
          Disabled controls are removed from the tab order and drop to 40 percent
          opacity.
        </p>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">Loading</p>
        <div className="flex flex-wrap items-center gap-md">
          <Button loading>Working</Button>
          <Button variant="secondary" loading>
            Working
          </Button>
        </div>
        <p className="type-body-sm text-muted-foreground">
          The spinner is decorative and the button reports busy to assistive
          technology.
        </p>
      </div>

      <div className="flex flex-col gap-sm">
        <p className="type-mono-badge text-muted-foreground">Sizes</p>
        <div className="flex flex-wrap items-center gap-md">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="sm" variant="secondary">
            <Plus aria-hidden="true" />
            Small with icon
          </Button>
        </div>
      </div>
    </div>
  )
}
