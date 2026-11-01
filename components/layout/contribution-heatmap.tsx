import { ArrowUpRight } from "lucide-react"
import { ContributionGrid } from "@/components/contribution-grid"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import type { Messages, Profile } from "@/lib/content/types"
import { getContributionYear } from "@/lib/github/contributions"
import {
  buildMonthLabels,
  buildWeekdayMarkers,
  toHeatmapWeeks,
} from "@/lib/github/heatmap"
import { formatDay } from "@/lib/i18n/format"
import type { Locale } from "@/lib/i18n/locales"

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  )
}

/**
 * The contribution proof. Rendered only when the GitHub read succeeded: a
 * failed or missing read leaves the section out rather than showing a grid
 * that lies.
 */
async function ContributionHeatmap({
  locale,
  profile,
  messages,
}: {
  locale: Locale
  profile: Profile
  messages: Messages
}) {
  const year = await getContributionYear()

  if (!year) return null

  const total = String(year.total)
  const summary = fill(messages["heatmap.summary"], {
    count: total,
    from: formatDay(year.from, locale),
    to: formatDay(year.to, locale),
    max: String(year.maxCount),
  })

  return (
    <Section id="contributions" aria-labelledby="contributions-heading">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-sm">
          <h2
            id="contributions-heading"
            className="type-headline-lg text-foreground"
          >
            {messages["heatmap.heading"]}
          </h2>

          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-xs rounded-sm type-mono-badge text-electric transition-colors hover:text-foreground"
          >
            {messages["heatmap.profileLink"]}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>

        <div className="mt-lg rounded-lg border border-border bg-card p-5">
          <p className="type-mono-code text-muted-foreground">
            {fill(messages["heatmap.total"], { count: total })}
          </p>

          <div className="mt-md">
            <ContributionGrid
              weeks={toHeatmapWeeks(year)}
              monthLabels={buildMonthLabels(year.weeks, locale)}
              weekdayMarkers={buildWeekdayMarkers(year.weeks, locale)}
              locale={locale}
              label={messages["heatmap.graphLabel"]}
              dayCountTemplate={messages["heatmap.dayCount"]}
              summaryId="contributions-summary"
            />
          </div>

          {year.total === 0 ? (
            <p className="mt-sm type-body-sm text-faint">
              {messages["heatmap.empty"]}
            </p>
          ) : null}
        </div>

        <p id="contributions-summary" className="sr-only">
          {summary}
        </p>
      </Container>
    </Section>
  )
}

export { ContributionHeatmap }
