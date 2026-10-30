import type { Messages } from "@/lib/content/types"
import type { Locale } from "@/lib/i18n/locales"

/**
 * The one ordered source of the page section anchors.
 *
 * The header, the mobile panel, the footer and the section components all
 * read this list. Adding a section here gives it a nav entry, a footer entry
 * and a known id in one edit. Keep the array order as the visual order.
 */
export type SiteSectionId = "work" | "experience" | "contact"

export type SiteSection = {
  id: SiteSectionId
  labelKey: Extract<keyof Messages, `nav.${SiteSectionId}`>
}

export const siteSections: readonly SiteSection[] = [
  { id: "work", labelKey: "nav.work" },
  { id: "experience", labelKey: "nav.experience" },
  { id: "contact", labelKey: "nav.contact" },
]

export function sectionHref(locale: Locale, id: SiteSectionId): string {
  return `/${locale}#${id}`
}
