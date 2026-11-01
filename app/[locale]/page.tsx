import {
  getMessages,
  getLinks,
  getExperience,
  getMetrics,
  getProfile,
  getProjects,
  requireLocale,
} from "@/lib/content"
import { Fragment, Suspense } from "react"
import { Hero } from "@/components/layout/hero"
import { ExperienceSection } from "@/components/layout/experience-section"
import { MetricCards } from "@/components/layout/metric-cards"
import { ProjectIndex } from "@/components/layout/project-index"
import { ContactSection } from "@/components/layout/contact-section"
import { ContributionHeatmap } from "@/components/layout/contribution-heatmap"
import { ActivityFeed } from "@/components/layout/activity-feed"
import { siteSections } from "@/lib/navigation"
import { getPageUrl } from "@/lib/seo"

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
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.headline,
    url: getPageUrl(locale),
    sameAs: links.map((link) => link.href),
  }
  const serializedPersonStructuredData = JSON.stringify(personStructuredData).replace(
    /</g,
    "\\u003c",
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedPersonStructuredData }}
      />
      <Hero locale={locale} profile={profile} messages={messages} />
      <MetricCards metrics={metrics} messages={messages} />

      {siteSections.map((section) =>
        section.id === "work" ? (
          <Fragment key={section.id}>
            <ProjectIndex
              locale={locale}
              projects={projects}
              messages={messages}
            />
            <Suspense fallback={null}>
              <ContributionHeatmap
                locale={locale}
                profile={profile}
                messages={messages}
              />
            </Suspense>
            <Suspense fallback={null}>
              <ActivityFeed locale={locale} messages={messages} />
            </Suspense>
          </Fragment>
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
      )}
    </>
  )
}
