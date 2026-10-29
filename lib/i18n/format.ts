import type { Locale } from "./locales"

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/

export function formatMonth(value: string, locale: Locale): string {
  const match = value.match(MONTH_PATTERN)
  if (!match) {
    return value
  }

  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)

  const date = new Date(Date.UTC(year, month - 1, 1))
  const bcp47Locale = locale === "id" ? "id-ID" : "en-US"

  return new Intl.DateTimeFormat(bcp47Locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

