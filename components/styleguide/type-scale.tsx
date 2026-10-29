const STEPS = [
  {
    className: "type-display-hero",
    label: "Display hero",
    spec: "56/64 at 600, -0.04em. Mobile 36/44 at 600, -0.03em.",
    sample: "Build for the edge",
  },
  {
    className: "type-headline-lg",
    label: "Headline large",
    spec: "32/40 at 600, -0.03em. Mobile 26/34 at 600, -0.02em.",
    sample: "Selected work and systems",
  },
  {
    className: "type-headline-md",
    label: "Headline medium",
    spec: "22/30 at 500, -0.02em.",
    sample: "Platform engineering in practice",
  },
  {
    className: "type-headline-sm",
    label: "Headline small",
    spec: "18/26 at 500, -0.01em.",
    sample: "Reliable services under load",
  },
  {
    className: "type-body-lg",
    label: "Body large",
    spec: "16/26 at 400, -0.01em.",
    sample: "The quick brown fox jumps over the lazy dog while the system stays stable.",
  },
  {
    className: "type-body-md",
    label: "Body medium",
    spec: "14/22 at 400.",
    sample: "The quick brown fox jumps over the lazy dog while the system stays stable.",
  },
  {
    className: "type-body-sm",
    label: "Body small",
    spec: "13/20 at 400.",
    sample: "The quick brown fox jumps over the lazy dog while the system stays stable.",
  },
  {
    className: "type-mono-code",
    label: "Mono code",
    spec: "13/20 at 400, -0.01em.",
    sample: "const latency = await measure(p95);",
  },
  {
    className: "type-mono-badge",
    label: "Mono badge",
    spec: "11/14 at 500, 0.04em, uppercase.",
    sample: "Production ready",
  },
  {
    className: "type-mono-stat",
    label: "Mono stat",
    spec: "28/32 at 600, -0.03em.",
    sample: "99.98%",
  },
]

export function TypeScale() {
  return (
    <div className="flex flex-col">
      {STEPS.map((step) => (
        <div
          key={step.className}
          className="flex flex-col gap-xs border-b border-border py-lg first:pt-0 last:border-b-0 last:pb-0"
        >
          <p className="type-mono-badge text-muted-foreground">
            {step.className} · {step.spec}
          </p>
          <p className={`${step.className} text-foreground`}>{step.sample}</p>
        </div>
      ))}
    </div>
  )
}
