import { siteContent } from "@/content/site"
import { assertContentValid } from "@/lib/content/validate"
import { defaultLocale, locales, type Locale } from "@/lib/i18n/locales"

export function getSiteOrigin(): URL {
  assertContentValid()
  return new URL(siteContent.siteUrl)
}

export function getPageUrl(locale: Locale, pathname = ""): string {
  const path = pathname.replace(/^\/+|\/+$/g, "")
  const route = path ? `/${locale}/${path}` : `/${locale}`
  return new URL(route, getSiteOrigin()).toString()
}

export function getLanguageAlternates(pathname = ""): Record<string, string> {
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, getPageUrl(locale, pathname)]),
  )

  return {
    ...alternates,
    "x-default": getPageUrl(defaultLocale, pathname),
  }
}

export const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
}

export const socialImageSize = {
  width: 1200,
  height: 630,
}
