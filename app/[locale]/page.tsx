import { getMessages, getProfile, requireLocale } from "@/lib/content"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionPlaceholder } from "@/components/layout/section-placeholder"
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

  return (
    <>
      <Section bordered={false}>
        <Container>
          <p className="type-mono-badge text-electric">{profile.role}</p>
          <h1 className="type-display-hero mt-sm text-foreground">
            {profile.headline}
          </h1>
          <p className="mt-lg max-w-2xl type-body-lg text-muted-foreground">
            {profile.intro}
          </p>
          <p className="mt-md max-w-2xl type-body-md text-foreground">
            {profile.availabilityLine}
          </p>
          <p className="mt-sm max-w-2xl type-body-sm text-muted-foreground font-mono">
            {profile.rememberLine}
          </p>
        </Container>
      </Section>

      {siteSections.map((section) => (
        <SectionPlaceholder
          key={section.id}
          id={section.id}
          label={messages[section.labelKey]}
        />
      ))}
    </>
  )
}
