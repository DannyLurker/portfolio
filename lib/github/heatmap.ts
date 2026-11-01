import { formatMonthShort, formatWeekdayShort } from "@/lib/i18n/format"
import type { Locale } from "@/lib/i18n/locales"

/**
 * Shaping for the contribution heatmap. Everything here is pure: the window,
 * the 52 Sunday aligned columns, the heat levels and the axis labels. The
 * GitHub read lives in `contributions.ts`.
 */

export const WEEKS_IN_GRID = 52
export const DAYS_IN_WEEK = 7

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export type ContributionDay = {
  date: string
  count: number
}

export type ContributionWeek = {
  startDate: string
  days: Array<ContributionDay | null>
}

export type ContributionYear = {
  weeks: ContributionWeek[]
  total: number
  from: string
  to: string
  maxCount: number
}

export type ContributionWindow = {
  from: string
  to: string
}

/** A cell that has already been given its heat level, ready to render. */
export type HeatmapCell = ContributionDay & {
  level: number
}

export type HeatmapWeek = {
  startDate: string
  days: Array<HeatmapCell | null>
}

export type MonthLabel = {
  column: number
  label: string
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`)
}

export function isIsoDate(value: string): boolean {
  return ISO_DATE.test(value) && !Number.isNaN(parseDate(value).getTime())
}

export function addDays(value: string, days: number): string {
  const date = parseDate(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** The Sunday on or before a date. */
export function startOfWeek(value: string): string {
  return addDays(value, -parseDate(value).getUTCDay())
}

/** Today in an IANA timezone, as `YYYY-MM-DD`. */
export function todayInZone(timeZone: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)

  const part = (type: string) =>
    parts.find((entry) => entry.type === type)?.value ?? ""

  return `${part("year")}-${part("month")}-${part("day")}`
}

/** The 52 week window ending today, Sunday aligned. */
export function windowFor(today: string): ContributionWindow {
  return {
    from: addDays(startOfWeek(today), -(WEEKS_IN_GRID - 1) * DAYS_IN_WEEK),
    to: today,
  }
}

export function buildWeeks(
  days: ContributionDay[],
  window: ContributionWindow
): ContributionWeek[] {
  const counts = new Map<string, number>()

  for (const day of days) {
    if (day.date >= window.from && day.date <= window.to) {
      counts.set(day.date, day.count)
    }
  }

  const weeks: ContributionWeek[] = []

  for (let column = 0; column < WEEKS_IN_GRID; column += 1) {
    const startDate = addDays(window.from, column * DAYS_IN_WEEK)
    const slots: Array<ContributionDay | null> = []

    for (let day = 0; day < DAYS_IN_WEEK; day += 1) {
      const date = addDays(startDate, day)

      slots.push(
        date > window.to
          ? null
          : { date, count: counts.get(date) ?? 0 }
      )
    }

    weeks.push({ startDate, days: slots })
  }

  return weeks
}

export function levelFor(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) {
    return 0
  }

  return Math.min(4, Math.max(1, Math.ceil((count / maxCount) * 4)))
}

export function buildYear(
  days: ContributionDay[],
  window: ContributionWindow
): ContributionYear {
  const weeks = buildWeeks(days, window)
  let total = 0
  let maxCount = 0

  for (const week of weeks) {
    for (const day of week.days) {
      if (!day) continue
      total += day.count
      if (day.count > maxCount) maxCount = day.count
    }
  }

  return { weeks, total, from: window.from, to: window.to, maxCount }
}

export function toHeatmapWeeks(year: ContributionYear): HeatmapWeek[] {
  return year.weeks.map((week) => ({
    startDate: week.startDate,
    days: week.days.map((day) =>
      day ? { ...day, level: levelFor(day.count, year.maxCount) } : null
    ),
  }))
}

/** One label per month, placed on the column where that month starts. */
export function buildMonthLabels(
  weeks: ContributionWeek[],
  locale: Locale
): MonthLabel[] {
  const labels: MonthLabel[] = []
  let currentMonth = ""

  weeks.forEach((week, column) => {
    const firstDay = week.days.find((day) => day !== null)
    if (!firstDay) return

    const month = firstDay.date.slice(0, 7)

    if (month === currentMonth) return

    currentMonth = month
    labels.push({ column, label: formatMonthShort(firstDay.date, locale) })
  })

  return labels
}

/** Sunday, Tuesday and Thursday, the three markers GitHub shows. */
export function buildWeekdayMarkers(
  weeks: ContributionWeek[],
  locale: Locale
): Array<string | null> {
  const firstWeek = weeks[0]

  return Array.from({ length: DAYS_IN_WEEK }, (_, day) => {
    if (day > 4 || day % 2 !== 0) return null
    const entry = firstWeek?.days[day]
    return entry ? formatWeekdayShort(entry.date, locale) : null
  })
}
