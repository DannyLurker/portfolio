# 0005. Hero section

**Date**: 2026-10-31
**Status**: Accepted

## Summary

The first screen of the site shows who you are, what you do and one way to reach you, all read from your content. It uses the status pill, the location and timezone, your role, your name as the page title, the headline, the intro and a single `Get in touch` button that jumps to the contact section. The dot in the status pill always pings, and the hero ignores the `available` flag, because the availability line is the message and the dot is only motion.

## Requirements

**User stories**:
- As a visitor, I want to understand who you are and what you do within the first screen, so I can decide whether to read on.
- As a visitor, I want one clear way to start a conversation, so I do not have to hunt for contact details.
- As the site owner, I want the first screen to read from my content, so a copy edit never needs a component change.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: The hero is the first section of `/en` and `/id`. Every visible value comes from `getProfile(locale)`: `availabilityLine`, `location`, `timezone`, `role`, `name`, `headline` and `intro`. No personal detail is hardcoded in the component.
- **AC-2**: The page has exactly one `h1`, its text is `profile.name`, and the hero section is named by it through `aria-labelledby="hero-title"`.
- **AC-3**: The hero renders one primary action, labelled `Get in touch` on `/en` and `Hubungi saya` on `/id` from the `hero.action` message key, linking to `sectionHref(locale, "contact")`, which resolves to `/{locale}#contact`.
- **AC-4**: The status pill shows `profile.availabilityLine` with a primary colored dot that pings on a 1.6 second loop. With `prefers-reduced-motion: reduce`, the ping is not rendered and the static dot stays. The ping never changes the accessible name of the pill.
- **AC-5**: The location line shows `profile.location` then `profile.timezone`, and the separator between them is `aria-hidden`, so a screen reader reads the two values without a stray character.
- **AC-6**: At 360px wide the status row wraps, the page has no horizontal scrollbar, and the action is at least 44px tall. The action shows the 2px focus ring when reached by keyboard.
- **AC-7**: The hero composes `Section` and `Container`, keeps the 600px decorative glow hidden below `lg`, and uses design tokens and named type classes for color and type. It contains no raw hex value, and the only raw size is the glow diameter.
- **AC-8**: `npm run lint` reports no errors and `npm run build` prerenders `/en` and `/id` as static routes.

## Decision

**Chosen option**: Option 1: the built composition, with one `Get in touch` action to the contact section and a dot that always pings.

The hero renders, in order: the status pill with `profile.availabilityLine` and the animated dot, a mono line with `profile.location` and `profile.timezone`, `profile.role` as an eyebrow, `profile.name` as the page `h1`, `profile.headline` as the supporting statement, `profile.intro` as the body paragraph, and one primary action from `hero.action` to `/{locale}#contact`. No secondary action is added. The dot is decorative and does not follow `profile.available`.

## Feature design

**Data model sketch**:

The hero owns no data and stores nothing. It is a server component that receives three props from the home page.

| Prop | Type | Source | Notes |
|---|---|---|---|
| `locale` | `Locale` | route segment, resolved by `requireLocale` | used for the action href |
| `profile` | `Profile` | `getProfile(locale)` | fully resolved strings, no localized wrappers |
| `messages` | `Messages` | `getMessages(locale)` | only `hero.action` is read |

**State transitions**: none. The hero is static. The only change over time is the decorative ping loop inside `StatusPill`, which is a client component.

**API surface**:

None. The hero fetches nothing and exposes no endpoint. The home page passes the values.

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Render the status pill | availability line | `profile.availabilityLine` from `getProfile(locale)` (spec 0002, spec 0003) |
| Render the status pill | pinging dot | decorative, always animates, `profile.available` is not read (decided here) |
| Render the location line | location and timezone | `profile.location` and `profile.timezone` from `getProfile(locale)` |
| Render the role eyebrow | role | `profile.role` from `getProfile(locale)` |
| Render the page title | name | `profile.name`, a shared fact in `content/site.ts` |
| Render the headline | headline | `profile.headline` from `getProfile(locale)` |
| Render the intro | intro | `profile.intro` from `getProfile(locale)` |
| Render the action label | button text | `hero.action` in `content/messages.ts` for the active locale (decided here) |
| Render the action destination | href | `sectionHref(locale, "contact")` in `lib/navigation.ts` (spec 0004) |
| Name the section | accessible name | `aria-labelledby="hero-title"` pointing at the `h1` (decided here) |
| Set the vertical rhythm | section padding | `md:py-2xl` from `--spacing-2xl: 64px` in `app/globals.css` (decided here) |
| Draw the glow | background decoration | `bg-primary/[0.08]`, `size-[600px]`, `blur-3xl`, `lg:block` (DESIGN.md, subtle atmospheric gradient) |

**Key invariants**:

- Every visible string except the action label comes from the profile accessor for the active locale.
- The page has exactly one `h1` and it is the name.
- `hero.action` exists in both dictionaries. The `Messages` type makes a missing key a type error.
- The ping is decoration. Its wrapper is `aria-hidden` and the dot carries no state.
- The component uses semantic tokens and named type classes for color and type, never raw hex. The one raw size is the glow diameter.

**Security model**:

Public and read only. No user input, no authentication and no storage. The hero shows only facts already published in `docs/profile.md` and `content/site.ts`.

**Configuration required**: none.

**Critical test scenarios** (each maps to an acceptance criterion in Requirements):

- Happy path: open `/en`, then `/id`. Both show the status row, role, name as the only `h1`, headline, intro and one action with the localized label. Verifies **AC-1**, **AC-2**, **AC-3**.
- Content source: edit `profile.headline` in `content/site.ts`, reload, and the hero shows the new value with no component edit. Verifies **AC-1**.
- Reduced motion: turn on reduce motion and reload. The ping loop is gone and the static dot stays. Verifies **AC-4**.
- Narrow viewport and keyboard: at 360px the status row wraps with no horizontal scrollbar, tab reaches the action, and the 2px ring is visible on a control at least 44px tall. Verifies **AC-6**.
- Action destination: activate the action on both locales. The page lands on `#contact` with the heading clear of the sticky header, through the `scroll-mt-20` on `Section`. Verifies **AC-3**.
- Token discipline: search the component for raw hex values. None are found, and the only raw size is the glow diameter. Verifies **AC-7**.

## Build plan

Tracer Bullet: the hero landed as one vertical slice, copy key first, then the component, then the binding, then the checks.

- [x] Add `hero.action` to both dictionaries in `content/messages.ts` and to the `Messages` type, satisfies **AC-3**.
- [x] Build `components/layout/hero.tsx` from `Section`, `Container`, `StatusPill` and `buttonVariants`, binding the seven profile values and the single action, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-5**.
- [x] Add `--spacing-2xl: 64px` to `app/globals.css` and the `2xl` step to the styleguide spacing scale, satisfies **AC-7**.
- [x] Bind the hero as the first section of `app/[locale]/page.tsx` and remove the temporary home block, satisfies **AC-1**, **AC-2**.
- [x] Check reduced motion, both locales, 360px, keyboard focus and the contact landing, satisfies **AC-3**, **AC-4**, **AC-6**.
- [x] Run `npm run lint` and `npm run build`, satisfies **AC-8**.

## Consequences

**Positive**:
- The first screen reads from one content source, so a copy edit never needs a component change.
- One action keeps the first screen focused, and every visitor path is one click from contact.
- The hero reuses the shell primitives, so later sections inherit the same rhythm and focus treatment.
- The dot is decoration, so the availability message and the motion can change independently.

**Negative / tradeoffs**:
- The name is the `h1` and the headline sits below it, so the most descriptive line for search is not the page title.
- The dot always pings, so it does not reflect `profile.available`. The current content says `false` while the line says open, and the dot stays blue regardless.
- The action uses `buttonVariants` on a `Link` because `Button asChild` fails on the current Button. That is a small workaround until the slot issue is fixed.
- The hero adds a spacing token and a glow, so it depends on the design system more than a plain section does.

**Neutral**:
- The hero is a server component. Only `StatusPill` is a client component, because of motion.
- `--spacing-2xl` joins the spacing scale and appears in the styleguide.
- The action points at the contact placeholder today. The anchor id comes from `lib/navigation.ts`, so the real contact section inherits it with no hero edit.

## Follow-up

- [ ] Settle `profile.available: false` against the availability line, which says open for select projects. The hero ignores the field, so this is a content decision, not a component bug.
- [ ] Revisit the single action once the project index and the detail pages exist. A second path into the work may earn a place then. Today one action is deliberate.
- [ ] Replace `buttonVariants` on `Link` with `Button asChild` when the Button slot issue is fixed, so the hero uses the same pattern as the rest of the site.
- [ ] Consider a lint rule for raw hex values inside components. Today the check is review only, carried from spec 0001.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
