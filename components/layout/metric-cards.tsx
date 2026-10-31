import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { MetricCard } from "@/components/metric-card"
import type { Messages, Metric } from "@/lib/content/types"

function MetricCards({
  metrics,
  messages,
}: {
  metrics: Metric[]
  messages: Messages
}) {
  return (
    <Section aria-labelledby="metrics-heading">
      <Container>
        <h2 id="metrics-heading" className="sr-only">
          {messages["metrics.heading"]}
        </h2>
        <ul className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <li key={`${metric.label}-${index}`}>
              <MetricCard
                label={metric.label}
                value={metric.value}
                className="h-full min-w-0"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

export { MetricCards }
