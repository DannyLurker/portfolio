import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Panel } from "@/components/panel"
import { Tag } from "@/components/tag"
import { buttonVariants } from "@/components/ui/button"
import type { Messages, Project } from "@/lib/content/types"
import type { Locale } from "@/lib/i18n/locales"

function ProjectIndex({
  locale,
  projects,
  messages,
}: {
  locale: Locale
  projects: Project[]
  messages: Messages
}) {
  return (
    <Section id="work" aria-labelledby="work-heading">
      <Container>
        <h2 id="work-heading" className="type-headline-lg text-foreground">
          {messages["projects.heading"]}
        </h2>

        {projects.length > 0 ? (
          <ol className="mt-lg space-y-md">
            {projects.map((project, index) => {
              const externalUrl =
                project.liveUrl ?? (project.private ? null : project.repoUrl)
              const externalLabel = project.liveUrl
                ? messages["project.liveSite"]
                : messages["project.source"]

              return (
                <li key={project.slug}>
                  <Panel
                    interactive
                    className="relative p-0"
                  >
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      aria-labelledby={`project-title-${project.slug}`}
                      className="group/row block rounded-lg p-md pr-16 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-lg md:pr-20"
                    >
                      <div className="flex items-start gap-md">
                        <span className="shrink-0 pt-1 type-mono-stat text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-sm">
                            <h3
                              id={`project-title-${project.slug}`}
                              className="type-headline-md text-foreground transition-colors group-hover/row:text-electric"
                            >
                              {project.name}
                            </h3>
                            <ArrowRight
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/row:translate-x-1 group-hover/row:text-electric"
                            />
                          </div>
                          <p className="mt-sm max-w-3xl type-body-md text-muted-foreground">
                            {project.summary}
                          </p>
                          <ul
                            aria-label={messages["project.stackLabel"]}
                            className="mt-md flex flex-wrap gap-sm"
                          >
                            {project.stack.map((item) => (
                              <li key={item}>
                                <Tag>{item}</Tag>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Link>

                    {externalUrl ? (
                      <Link
                        href={externalUrl}
                        aria-label={`${externalLabel}: ${project.name}`}
                        className={buttonVariants({
                          variant: "icon",
                          size: "icon",
                          className: "absolute right-md top-md min-h-11 min-w-11 md:right-lg md:top-lg",
                        })}
                      >
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    ) : null}
                  </Panel>
                </li>
              )
            })}
          </ol>
        ) : (
          <Panel className="mt-lg">
            <p className="type-body-lg text-muted-foreground">
              {messages["projects.empty"]}
            </p>
          </Panel>
        )}
      </Container>
    </Section>
  )
}

export { ProjectIndex }
