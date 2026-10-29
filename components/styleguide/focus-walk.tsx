import { ArrowUpRight } from "lucide-react"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FocusWalk() {
  return (
    <div className="flex flex-col gap-lg">
      <p className="type-body-md text-muted-foreground">
        Press Tab through the controls below. Every control shows a 2px ring in
        the focus color with a 2px gap, including the icon link. Focus never
        relies on hover, and it is never removed without a replacement.
      </p>

      <div className="flex flex-wrap items-center gap-lg rounded-lg border border-border bg-card p-lg">
        <Link href="/styleguide" variant="inline">
          Inline link
        </Link>
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
        <Button variant="secondary">Secondary button</Button>
        <Input
          aria-label="Sample field"
          placeholder="Sample field"
          className="max-w-56"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-lg">
        <p className="type-mono-badge text-muted-foreground">
          Reduced motion
        </p>
        <p className="mt-sm type-body-md text-muted-foreground">
          The system turns off transitions, the status ping and every keyframe
          animation when the operating system asks for reduced motion. States
          change instantly instead. The preference is read from the system and
          is never stored.
        </p>
      </div>
    </div>
  )
}
