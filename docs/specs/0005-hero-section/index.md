# 0005 · Hero section

**Status**: Assumed
**Date**: 2026-10-31
**Authorized by**: Danny, during /develop

## Owed decision

The hero's primary action. The scope names "primary action" but no source for its label or its destination exists: there is no hero message key, no content field, and `DESIGN.md` does not name a call to action. The rest of the hero is already sourced (name, role, headline, intro, availability and location come from `getProfile(locale)`).

## Assumption built on

One primary action only: a primary button labelled `Get in touch` in English and `Hubungi saya` in Indonesian, from a new `hero.action` message key, linking to the contact section at `/{locale}#contact` through `sectionHref(locale, "contact")`.

The hero renders, in order: a status pill with `profile.availabilityLine` and the animated dot, a mono line with `profile.location` and `profile.timezone`, `profile.role` as an eyebrow, `profile.name` as the page `h1`, `profile.headline` as the supporting statement, `profile.intro` as the body paragraph, and the primary action. No secondary action is added, so no further copy is invented. The section reuses the existing `Section`, `Container`, `StatusPill` and `Button` primitives, adds one spacing token (`--spacing-2xl: 64px`) for the hero's vertical breathing room, and a decorative 600px radial glow from the `DESIGN.md` surface rules.

## Code area

`components/layout/hero.tsx`, `app/[locale]/page.tsx`, `content/messages.ts`, `lib/content/types.ts`, `app/globals.css`, `components/styleguide/spacing-scale.tsx`

## Requirements

- Every hero element renders from the content source in both languages.
- The availability dot animates and respects reduced motion preferences.
- The copy contains no invented detail.

## Ratify

This decision was recorded by /develop, not deliberated. Run `/architect hero section`
to deliberate and ratify it. Until then it stays flagged as an owed decision; it does not block marking the feature `done`.
