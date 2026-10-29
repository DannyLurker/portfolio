import { notFound } from "next/navigation"

export const locales = ["en", "id"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function requireLocale(value: string): Locale {
  if (!isLocale(value)) {
    notFound()
  }
  return value
}

