import { getMessages, getProfile, requireLocale } from "@/lib/content"
import { LanguageSwitch } from "@/components/language-switch"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

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
    <main className="flex flex-1 flex-col justify-center py-2xl">
      <Container>
        <header className="flex items-center justify-between pb-xl border-b border-border">
          <span className="type-mono-body text-muted-foreground font-mono">
            {profile.name}
          </span>
          <LanguageSwitch currentLocale={locale} messages={messages} />
        </header>

        <Section className="py-xl">
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
        </Section>
      </Container>
    </main>
  )
}

