import type { MetadataRoute } from "next"
import { getProjectSlugs, locales } from "@/lib/content"
import { getLanguageAlternates, getPageUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const homePages = locales.map((locale) => ({
    url: getPageUrl(locale),
    alternates: { languages: getLanguageAlternates() },
  }))
  const projectPages = getProjectSlugs().flatMap((slug) =>
    locales.map((locale) => {
      const pathname = `projects/${slug}`

      return {
        url: getPageUrl(locale, pathname),
        alternates: { languages: getLanguageAlternates(pathname) },
      }
    }),
  )

  return [...homePages, ...projectPages]
}
