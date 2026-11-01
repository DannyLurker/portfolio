import type { Locale } from "./locales"

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/

const BCP47: Record<Locale, string> = {
  en: "en-US",
  id: "id-ID",
}

const RELATIVE_UNITS: Array<{
  unit: Intl.RelativeTimeFormatUnit
  seconds: number
}> = [
  { unit: "year", seconds: 31_536_000 },
  { unit: "month", seconds: 2_592_000 },
  { unit: "week", seconds: 604_800 },
  { unit: "day", seconds: 86_400 },
  { unit: "hour", seconds: 3_600 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
]

function toUtcDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`)
}

export function formatMonth(value: string, locale: Locale): string {
  const match = value.match(MONTH_PATTERN)
  if (!match) {
    return value
  }

  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)

  const date = new Date(Date.UTC(year, month - 1, 1))

  return new Intl.DateTimeFormat(BCP47[locale], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

/** A single day, for the heatmap tooltip. */
export function formatDay(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(value))
}

/** A short month name, for the heatmap axis. */
export function formatMonthShort(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    month: "short",
    timeZone: "UTC",
  }).format(toUtcDate(value))
}

/** A short weekday name, for the heatmap axis. */
export function formatWeekdayShort(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    weekday: "short",
    timeZone: "UTC",
  }).format(toUtcDate(value))
}

/** A localized relative timestamp based on a stable cache snapshot time. */
export function formatRelativeTime(
  value: string,
  asOf: string,
  locale: Locale
): string {
  const delta = (Date.parse(value) - Date.parse(asOf)) / 1000
  if (!Number.isFinite(delta)) return value

  const formatter = new Intl.RelativeTimeFormat(BCP47[locale], {
    numeric: "auto",
  })
  const unit = RELATIVE_UNITS.find(({ seconds }) => Math.abs(delta) >= seconds)

  if (!unit) return formatter.format(0, "second")

  return formatter.format(Math.round(delta / unit.seconds), unit.unit)
}


