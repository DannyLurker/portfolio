"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { buttonVariants } from "@/components/ui/button"
import { messages } from "@/content/messages"
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales"
import { cn } from "@/lib/utils"

// Lives inside the locale layout, so the shell and its copy follow the route
// language. `not-found` receives no props, hence the client hook for the locale.
export default function LocaleNotFound() {
  const params = useParams<{ locale?: string }>()
  const locale: Locale =
    params?.locale && isLocale(params.locale) ? params.locale : defaultLocale
  const copy = messages[locale]

  return (
    <Section bordered={false} className="flex flex-1 items-center">
      <Container>
        <p className="type-mono-badge text-electric">404</p>
        <h1 className="type-display-hero mt-sm text-foreground">
          {copy["notFound.title"]}
        </h1>
        <p className="mt-lg max-w-2xl type-body-lg text-muted-foreground">
          {copy["notFound.description"]}
        </p>
        <Link
          href={`/${locale}`}
          className={cn(buttonVariants({ variant: "secondary" }), "mt-lg")}
        >
          {copy["notFound.home"]}
        </Link>
      </Container>
    </Section>
  )
}
