import { createProjectSocialCard } from "@/lib/seo/social-card"
import { getProjectSlugs, requireLocale } from "@/lib/content"

export const alt = "Project social preview"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale = requireLocale(rawLocale)

  return createProjectSocialCard(locale, slug)
}
