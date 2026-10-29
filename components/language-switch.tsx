"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { locales, localeNames, type Locale } from "@/lib/i18n/locales"
import { swapLocalePath } from "@/lib/i18n/path"
import type { Messages } from "@/lib/content/types"
import { cn } from "@/lib/utils"

interface LanguageSwitchProps {
  currentLocale: Locale
  messages: Messages
  className?: string
}

export function LanguageSwitch({
  currentLocale,
  messages,
  className,
}: LanguageSwitchProps) {
  const pathname = usePathname() || `/${currentLocale}`

  return (
    <nav
      aria-label={messages["language.label"]}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-container-low p-1",
        className
      )}
    >
      {locales.map((locale) => {
        const isCurrent = locale === currentLocale
        const targetPath = swapLocalePath(pathname, locale)

        return (
          <Link
            key={locale}
            href={targetPath}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1 type-body-sm transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isCurrent
                ? "bg-electric text-electric-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high"
            )}
          >
            <span>{localeNames[locale]}</span>
            {isCurrent && (
              <span className="sr-only"> ({messages["language.current"]})</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

