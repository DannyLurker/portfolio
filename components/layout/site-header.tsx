import Link from "next/link";
import { LanguageSwitch } from "@/components/language-switch";
import { Container } from "@/components/layout/container";
import { SiteNav } from "@/components/layout/site-nav";
import type { Messages } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { ActiveSectionProvider } from "@/components/layout/active-section";

function SiteHeader({
  locale,
  displayName,
  messages,
}: {
  locale: Locale;
  displayName: string;
  messages: Messages;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between gap-md">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-11 items-center rounded-sm type-headline-sm text-foreground transition-colors hover:text-electric"
        >
          {displayName}
        </Link>

        <div className="flex items-center gap-sm">
          <ActiveSectionProvider>
            <SiteNav locale={locale} messages={messages} />
            <LanguageSwitch currentLocale={locale} messages={messages} />
          </ActiveSectionProvider>
        </div>
      </Container>
    </header>
  );
}

export { SiteHeader };
