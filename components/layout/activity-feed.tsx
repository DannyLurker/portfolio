import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Panel } from "@/components/panel"
import { Tag } from "@/components/tag"
import type { Messages } from "@/lib/content/types"
import { getActivityFeed } from "@/lib/github/activity"
import { formatRelativeTime } from "@/lib/i18n/format"
import type { Locale } from "@/lib/i18n/locales"

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  )
}

async function ActivityFeed({
  locale,
  messages,
}: {
  locale: Locale
  messages: Messages
}) {
  const snapshot = await getActivityFeed()
  if (!snapshot || snapshot.commits.length === 0) return null

  return (
    <Section id="activity" aria-labelledby="activity-heading">
      <Container>
        <h2 id="activity-heading" className="type-headline-lg text-foreground">
          {messages["activity.heading"]}
        </h2>

        <ol className="ml-sm mt-lg space-y-md border-l border-border pl-lg md:ml-md">
          {snapshot.commits.map((commit) => {
            const repositoryLabel = commit.repository.split("/").at(-1) ?? commit.repository
            const shortSha = commit.sha.slice(0, 7)

            return (
              <li
                key={`${commit.repository}:${commit.sha}`}
                className="relative"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-7 top-lg size-2 rounded-full bg-primary ring-4 ring-background"
                />

                <Panel className="p-md md:p-lg">
                  <div className="flex flex-wrap items-center gap-x-sm gap-y-xs">
                    <a
                      href={commit.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={fill(messages["activity.repositoryLink"], {
                        repository: commit.repository,
                      })}
                      className="type-mono-code text-electric transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                    >
                      {repositoryLabel}
                    </a>

                    <Tag>{commit.branch}</Tag>

                    <a
                      href={commit.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={fill(messages["activity.commitLink"], {
                        sha: commit.sha,
                      })}
                      className="type-mono-code text-electric transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                    >
                      <code>{shortSha}</code>
                    </a>

                    <time
                      dateTime={commit.committerDate}
                      className="type-body-sm text-faint"
                    >
                      {formatRelativeTime(
                        commit.committerDate,
                        snapshot.asOf,
                        locale
                      )}
                    </time>
                  </div>

                  <p className="mt-sm break-words type-body-md text-foreground">
                    {commit.message}
                  </p>
                </Panel>
              </li>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}

export { ActivityFeed }
