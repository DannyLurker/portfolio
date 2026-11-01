import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { StatusPill } from "@/components/status-pill";
import { buttonVariants } from "@/components/ui/button";
import type { Messages, Profile } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { sectionHref } from "@/lib/navigation";

/**
 * The first screen. Every value comes from getProfile(locale); the only copy
 * the hero owns is the primary action label from the message dictionary.
 */
function Hero({
  locale,
  profile,
  messages,
}: {
  locale: Locale;
  profile: Profile;
  messages: Messages;
}) {
  return (
    <Section
      bordered={false}
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 hidden size-150 rounded-full bg-primary/8 blur-3xl lg:block"
      />
      <Container className="relative">
        <div className="flex flex-wrap items-center gap-sm">
          <StatusPill>{profile.availabilityLine}</StatusPill>
          <p className="type-mono-code text-muted-foreground">
            {profile.location}
            <span aria-hidden="true"> · </span>
            {profile.timezone}
          </p>
        </div>

        <p className="mt-xl type-mono-badge text-electric">{profile.role}</p>

        <h1
          id="hero-title"
          className="mt-sm max-w-4xl type-display-hero text-foreground"
        >
          {profile.name}
        </h1>

        <p className="mt-md max-w-3xl type-headline-lg text-foreground">
          {profile.headline}
        </p>

        <p className="mt-md max-w-168 type-body-lg text-muted-foreground">
          {profile.intro}
        </p>

        <div className="mt-xl">
          <Link
            href={sectionHref(locale, "contact")}
            className={buttonVariants({ className: "min-h-11" })}
          >
            {messages["hero.action"]}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export { Hero };
