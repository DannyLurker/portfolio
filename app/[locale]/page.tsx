import { getMessages, getProfile, requireLocale } from "@/lib/content"
import { Hero } from "@/components/layout/hero"
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
      <Hero locale={locale} profile={profile} messages={messages} />

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
