const STEPS = [
  { className: "rounded-sm", value: "2px", token: "sm" },
  { className: "rounded", value: "4px", token: "base" },
  { className: "rounded-md", value: "6px", token: "md" },
  { className: "rounded-lg", value: "8px", token: "lg" },
  { className: "rounded-xl", value: "12px", token: "xl" },
  { className: "rounded-full", value: "9999px", token: "full" },
]

export function RadiusScale() {
  return (
    <div className="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-6">
      {STEPS.map((step) => (
        <div key={step.token} className="flex flex-col gap-sm">
          <div
            className={`flex h-20 items-end justify-center border border-border-strong bg-popover p-sm ${step.className}`}
          >
            <span className="type-mono-code text-muted-foreground">
              {step.value}
            </span>
          </div>
          <span className="type-mono-code text-foreground">
            rounded-{step.token}
          </span>
          <span className="type-body-sm text-muted-foreground">
            Token {step.token}
          </span>
        </div>
      ))}
    </div>
  )
}
