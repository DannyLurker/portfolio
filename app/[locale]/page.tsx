import {
  getMessages,
  getExperience,
  getMetrics,
  getProfile,
  getLinks,
  getProjects,
  requireLocale,
} from "@/lib/content"
import { Hero } from "@/components/layout/hero"
import { ExperienceSection } from "@/components/layout/experience-section"
import { MetricCards } from "@/components/layout/metric-cards"
import { ProjectIndex } from "@/components/layout/project-index"
import { ContactSection } from "@/components/layout/contact-section"
import { siteSections } from "@/lib/navigation"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = requireLocale(rawLocale)

  const profile = getProfile(locale)
  const messages = getMessages(locale)
  const experience = getExperience(locale)
  const metrics = getMetrics(locale)
  const projects = getProjects(locale)
  const links = getLinks()

  return (
    <>
      <Hero locale={locale} profile={profile} messages={messages} />
      <MetricCards metrics={metrics} messages={messages} />

      {siteSections.map((section) => (
        section.id === "work" ? (
          <ProjectIndex
            key={section.id}
            locale={locale}
            projects={projects}
            messages={messages}
          />
        ) : section.id === "experience" ? (
          <ExperienceSection
            key={section.id}
            locale={locale}
            roles={experience}
            messages={messages}
          />
        ) : (
          <ContactSection
            key={section.id}
            profile={profile}
            links={links}
            messages={messages}
          />
        )
      ))}
    </>
  )
}
