import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Panel } from "@/components/panel"
import { Tag } from "@/components/tag"
import type { ExperienceRole, Messages } from "@/lib/content/types"
import { formatMonth } from "@/lib/i18n/format"
import type { Locale } from "@/lib/i18n/locales"

function ExperienceSection({
  locale,
  roles,
  messages,
}: {
  locale: Locale
  roles: ExperienceRole[]
  messages: Messages
}) {
  return (
    <Section id="experience" aria-labelledby="experience-heading">
      <Container>
        <h2
          id="experience-heading"
          className="type-headline-lg text-foreground"
        >
          {messages["experience.heading"]}
        </h2>

        <ol className="ml-sm mt-lg space-y-lg border-l border-border pl-lg md:ml-md">
          {roles.map((role) => (
            <li
              key={`${role.company}-${role.start}`}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="absolute -left-7 top-lg size-2 rounded-full bg-primary ring-4 ring-background"
              />
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-md">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-x-sm gap-y-xs type-mono-code text-muted-foreground">
                      <span>{role.company}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={role.start}>
                        {formatMonth(role.start, locale)}
                      </time>
                      <span>{messages["experience.rangeTo"]}</span>
                      {role.end ? (
                        <time dateTime={role.end}>
                          {formatMonth(role.end, locale)}
                        </time>
                      ) : (
                        <span>{messages["experience.present"]}</span>
                      )}
                    </p>
                    <h3 className="mt-sm type-headline-md text-foreground">
                      {role.title}
                    </h3>
                  </div>

                  {role.end === null ? (
                    <Tag className="border-badge-border bg-badge-bg text-electric">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-primary"
                      />
                      {messages["experience.current"]}
                    </Tag>
                  ) : null}
                </div>

                <p className="mt-md max-w-3xl type-body-lg text-muted-foreground">
                  {role.summary}
                </p>
              </Panel>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

export { ExperienceSection }
