import { StatusPill } from "@/components/status-pill"
import { MetricCard } from "@/components/metric-card"
import { Panel } from "@/components/panel"
import { CodePanel } from "@/components/code-panel"
import { Tag } from "@/components/tag"
import { Badge } from "@/components/ui/badge"

export function CardStates() {
  return (
    <div className="flex flex-col gap-xl">
      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        <Panel className="flex flex-col gap-sm">
          <p className="type-mono-badge text-muted-foreground">Panel</p>
          <p className="type-body-md text-foreground">
            The default panel carries cards, lists and grouped content.
          </p>
        </Panel>

        <Panel interactive className="flex flex-col gap-sm">
          <p className="type-mono-badge text-muted-foreground">
            Panel, interactive
          </p>
          <p className="type-body-md text-foreground">
            Hover the panel to see the accent border and the lifted fill.
          </p>
        </Panel>

        <Panel
          className="flex flex-col gap-sm border-border-accent bg-card-hover"
          aria-label="Panel hover state"
        >
          <p className="type-mono-badge text-muted-foreground">
            Panel, hover simulated
          </p>
          <p className="type-body-md text-foreground">
            The same two changes, shown without hovering.
          </p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        <MetricCard
          label="Uptime"
          value="99.98%"
          trend="Rolling 30 day window"
        />
        <MetricCard label="p95 latency" value="124ms" trend="Read API" />
        <MetricCard label="Deploys" value="342" trend="This quarter" />
      </div>

      <CodePanel className="max-w-2xl">
        <div className="flex items-center gap-2 border-b border-border-strong px-md py-sm">
          <span className="type-mono-badge text-muted-foreground">example.ts</span>
        </div>
        <pre className="overflow-x-auto p-md type-mono-code text-foreground">
          <code>{`const latency = await measure(p95);\nreturn latency < budget;`}</code>
        </pre>
      </CodePanel>

      <div className="flex flex-col gap-md">
        <p className="type-mono-badge text-muted-foreground">Badges</p>
        <div className="flex flex-wrap items-center gap-sm">
          <Badge>Default badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Blocked</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-md">
        <p className="type-mono-badge text-muted-foreground">Tags</p>
        <div className="flex flex-wrap items-center gap-sm">
          <Tag>TypeScript</Tag>
          <Tag>PostgreSQL</Tag>
          <Tag>Kubernetes</Tag>
          <Tag>Observability</Tag>
        </div>
      </div>

      <div className="flex flex-col gap-md">
        <p className="type-mono-badge text-muted-foreground">Status pill</p>
        <div className="flex flex-wrap items-center gap-md">
          <StatusPill>Status label</StatusPill>
        </div>
        <p className="type-body-sm text-muted-foreground">
          The dot is decorative. The label carries the meaning, so the pill is
          never read as a bare dot by a screen reader.
        </p>
      </div>
    </div>
  )
}
