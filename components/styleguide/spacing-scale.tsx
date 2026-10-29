const STEPS = [
  { token: "xs", value: 4, use: "Tight gaps, pill padding" },
  { token: "sm", value: 8, use: "Inline gaps, label to field" },
  { token: "md", value: 16, use: "Card padding on mobile, grid gap" },
  { token: "lg", value: 24, use: "Card padding, block gaps" },
  { token: "xl", value: 40, use: "Section padding" },
]

export function SpacingScale() {
  return (
    <div className="flex flex-col gap-md">
      {STEPS.map((step) => (
        <div
          key={step.token}
          className="grid grid-cols-[4rem_1fr] items-center gap-md border-b border-border pb-md last:border-b-0 last:pb-0"
        >
          <span className="type-mono-code text-electric">{step.token}</span>
          <div className="flex items-center gap-md">
            <span
              className="h-4 rounded-sm bg-primary"
              style={{ width: step.value }}
            />
            <span className="type-mono-code text-muted-foreground">
              {step.value}px
            </span>
            <span className="type-body-sm text-muted-foreground">
              {step.use}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
