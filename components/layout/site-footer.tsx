import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SocialLinks } from "@/components/layout/social-links";
import type { Messages, Profile, SocialLink } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { sectionHref, siteSections } from "@/lib/navigation";

// The build year. A prerendered page cannot read the current time, and a static
// site has no visit time to read anyway.
const COPYRIGHT_YEAR = new Date().getFullYear();

function SiteFooter({
  locale,
  profile,
  links,
  messages,
}: {
  locale: Locale;
  profile: Profile;
  links: SocialLink[];
  messages: Messages;
}) {
  const copyright = `© ${COPYRIGHT_YEAR} ${profile.name}.`;

  return (
    <footer className="border-t border-border">
      <Container className="py-xl">
        <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
          <div>
            <p className="type-headline-sm text-foreground">{profile.name}</p>
            <p className="mt-xs type-body-sm text-muted-foreground">
              {profile.role}
            </p>
          </div>

          <nav
            aria-label={messages["footer.navLabel"]}
            className="flex flex-wrap gap-x-lg gap-y-sm"
          >
            {siteSections.map((section) => (
              <Link
                key={section.id}
                href={sectionHref(locale, section.id)}
                className="inline-flex min-h-11 items-center type-body-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {messages[section.labelKey]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-lg flex flex-col gap-md border-t border-border pt-lg md:flex-row md:items-center md:justify-between">
          <SocialLinks links={links} label={messages["footer.socialLabel"]} />
          <p className="type-mono-code text-muted-foreground">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}

export { SiteFooter };
