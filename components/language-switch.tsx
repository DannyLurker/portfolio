"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { locales, localeNames, type Locale } from "@/lib/i18n/locales";
import { swapLocalePath } from "@/lib/i18n/path";
import type { Messages } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./layout/active-section";
interface LanguageSwitchProps {
  currentLocale: Locale;
  messages: Messages;
  className?: string;
}

export function LanguageSwitch({
  currentLocale,
  messages,
  className,
}: LanguageSwitchProps) {
  const pathname = usePathname() || `/${currentLocale}`;
  const { activeId } = useActiveSection();
  const hash = activeId ? `#${activeId}` : "";

  return (
    <nav
      aria-label={messages["language.label"]}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card p-1",
        className,
      )}
    >
      {locales.map((locale) => {
        const isCurrent = locale === currentLocale;
        const targetPath = swapLocalePath(pathname, locale) + hash;

        return (
          <Link
            key={locale}
            href={targetPath}
            aria-label={localeNames[locale]}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-6 items-center justify-center rounded-full px-3 type-body-sm transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isCurrent
                ? "text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* Sliding Pill Background */}
            {isCurrent && (
              <motion.span
                layoutId="active-locale-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}

            {/* Label Content */}
            <span className="relative z-10">
              <span>{localeNames[locale]}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
