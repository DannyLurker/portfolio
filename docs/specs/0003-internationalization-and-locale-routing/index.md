# 0003. Adopt Indonesian locale routing and a bilingual content model

**Date**: 2026-10-29
**Status**: In Progress

## Summary

The site gets English and Indonesian versions at `/en` and `/id`, with the language in the URL and a language switch that keeps the same page. One typed content source holds both languages, shared facts appear once, and the production build stops on a missing or blank translation. A thin home page proves the route, the content and the switch end to end.

## Requirements

**User stories**:
- As a visitor, I want the site in English or Indonesian with the language in the URL, so I can read it in my language and share the link.
- As the site owner, I want one content source with both languages, so I update a fact once and the translation stays next to it.
- As the engineer building later features, I want locale aware accessors and one messages dictionary, so no screen hardcodes English.
- As the site owner, I want the build to stop on missing copy, so a half translated page never ships.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: A request to `/` responds with a redirect to `/en`. `/en` returns 200 with English copy, `/id` returns 200 with Indonesian copy, and an unknown locale such as `/fr` returns 404.
- **AC-2**: The thin home page and the language switch render no hardcoded English copy. Every visible string comes from `getProfile(locale)`, `getMessages(locale)` or the locale name constant. The development only styleguide is exempt.
- **AC-3**: The URL segment selects the language. `<html lang>` is `en` on `/en` and `id` on `/id`. The switch on `/en` links to the same path under `/id` and marks the current language, and the reverse holds on `/id`.
- **AC-4**: `content/site.ts` stores every translatable field as `{ en, id }`, and every shared fact once. Every accessor that returns personal copy takes a locale and returns fully resolved strings.
- **AC-5**: A missing, blank or placeholder translation stops `npm run build` and names the exact field path with the locale, for example `profile.intro.id`. In development the same problem logs to the console and the page still renders with the English value.
- **AC-6**: Interface strings live in `content/messages.ts` as one typed dictionary per locale. Both dictionaries expose the same keys, and removing a key from one fails type checking. A missing or blank message stops the production build and names its path; development logs it and falls back to English.
- **AC-7**: The page title and description are localized. `/en` shows the English role and headline, and `/id` shows the Indonesian role and headline.
- **AC-8**: Both locales expose the same project set and slugs, experience entries, metrics and shared facts. `getProjectBySlug("id", "internal-management-system")` returns the Indonesian project, and an unknown slug returns `undefined`.
- **AC-9**: `npm run build` generates `/en` and `/id` as static routes. The locale segment rejects a locale that is not in `locales`.
- **AC-10**: `formatMonth("2026-10", "en")` returns `October 2026` and `formatMonth("2026-10", "id")` returns `Oktober 2026`.
- **AC-11**: The development only styleguide stays at `/styleguide`, keeps its own root layout and the design tokens, and still returns 404 from a production build.
- **AC-12**: The Indonesian copy is a faithful translation of the English source, addresses the visitor as `Anda`, adds no facts, and is drafted for the owner's review before the feature is called done.

## Decision

**Chosen option**: Option 1: Hand rolled locale segment with localized fields in one content source.

The site uses an `app/[locale]` root layout for `en` and `id`, one `content/site.ts` with `{ en, id }` for every translatable field, a typed `content/messages.ts` for interface strings, and explicit locale arguments in the accessors. The production build rejects an incomplete translation.

## Feature design

**Data model sketch**:

`Locale` is `"en" | "id"`, and `Localized<T>` is `{ en: T; id: T }`. Every translatable value is a localized string. Shared facts are plain values.

| Entity | Shared fields | Localized fields |
|---|---|---|
| `ProfileContent` | `name`, `displayName`, `email`, `emailVisibility`, `githubUsername`, `available`, `timezone` | `pronouns`, `role`, `location`, `headline`, `intro`, `currentlyLooking`, `availabilityLine`, `experienceSummary`, `rememberLine` |
| `ExperienceRoleContent` | `company`, `start`, `end` (`YYYY-MM` or `null`) | `title`, `summary` |
| `ProjectContent` | `slug` (unique), `stack`, `liveUrl`, `repoUrl`, `private` | `name`, `summary`, `role`, `outcome`, `caseStudy.problem`, `caseStudy.approach`, `caseStudy.built`, `caseStudy.result` |
| `MetricContent` | `value` | `label` |
| `Skills` | `top`, `all` (skill names stay as written) | none |
| `SocialLink` | `label` (brand name), `href`, `icon` | none |
| `Messages` | none | every interface string, one dictionary per locale |

`SiteContent` holds one `ProfileContent`, the experience, project and metric arrays, and the shared `Skills`. The social links stay shared. `Messages` lives in `content/messages.ts` as `Record<Locale, Messages>` and starts with two keys: `language.label` (the accessible name of the switch) and `language.current` (the marker on the active language). Further keys arrive with the features that need them.

`Profile`, `ExperienceRole`, `Project`, `Metric`, `Skills`, `SocialLink` and `Messages` are the resolved types with plain strings, returned by the accessors.

**State transitions**: None. The site is static, and the only state is the locale in the URL.

**API surface**:

| Function | Inputs | Returns | Auth | Key errors |
|---|---|---|---|---|
| `getProfile(locale)` | `locale: Locale` | `Profile` | public | none |
| `getExperience(locale)` | `locale: Locale` | `ExperienceRole[]`, newest first | public | none |
| `getProjects(locale)` | `locale: Locale` | `Project[]` in array order | public | none |
| `getProjectBySlug(locale, slug)` | `locale: Locale`, `slug: string` | `Project \| undefined` | public | `undefined` for an unknown slug |
| `getSkills()` | none | `Skills` | public | none |
| `getMetrics(locale)` | `locale: Locale` | `Metric[]` in declared order | public | none |
| `getLinks()` | none | `SocialLink[]` | public | none |
| `getMessages(locale)` | `locale: Locale` | `Messages` | public | none |
| `isLocale(value)` | `value: string` | `value is Locale` | public | none |
| `requireLocale(value)` | `value: string` | `Locale` | public | calls `notFound()` for an unknown locale |
| `swapLocalePath(pathname, locale)` | `pathname: string`, `locale: Locale` | `string` | public | when the first segment is not a locale, prefixes `/${locale}` and keeps the rest of the path |
| `formatMonth(value, locale)` | `value: string` in `YYYY-MM`, `locale: Locale` | `string` | public | a long month name and a numeric year in UTC, for example `October 2026`; returns the raw value when it cannot parse, which the validator prevents in production |
| `assertContentValid()` | none | `void` | build and dev | throws in production; logs in development |

`getSkills` and `getLinks` take no locale because skill names and brand names do not translate. All other personal content accessors take the locale first so the call site is explicit.

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Root redirect | `/en` | `defaultLocale` in `lib/i18n/locales.ts`, applied in `next.config.ts` |
| Route language | `locale` | the `[locale]` URL segment, narrowed by `requireLocale` |
| `<html lang>` | `en` or `id` | the resolved route locale |
| Home copy | name, role, headline, intro | `getProfile(locale)` from `content/site.ts`; the English values come from `docs/profile.md`, the Indonesian values are drafted for review |
| Interface strings | switch label, current language label | `getMessages(locale)` from `content/messages.ts` |
| Language names | `English`, `Bahasa Indonesia` | `localeNames` in `lib/i18n/locales.ts` |
| Switch target | the same path in the other locale | `usePathname()` plus `swapLocalePath(pathname, locale)` |
| Current language marker | the active locale | the `locale` prop and `aria-current` |
| Title and description | localized page title and description | the localized profile name, role and headline |
| Project lookup | the project for a slug | the shared `Project.slug`, then the localized fields |
| Experience order | newest first | the shared `start` and `end` values |
| Date display | long month and numeric year | `formatMonth(start, locale)` or `formatMonth(end, locale)` |
| Static routes | `/en` and `/id` | `locales` in `generateStaticParams` |
| Unknown locale | 404 | `isLocale` and `notFound()` |
| Build errors | field path with locale | `assertContentValid()` |
| Development fallback | English copy | the `en` value when the active locale is blank |
| Styleguide URL | `/styleguide` | the `(dev)` route group, outside the locale segment |

**Key invariants**:
- Every localized field has both locale values, each not empty, with no placeholder token and no `None` string.
- Every shared fact appears once, not once per locale.
- One project set serves both locales. Every slug is unique and matches the kebab case pattern.
- Experience roles are sorted newest first, at most one role has `end: null`, and every date uses `YYYY-MM`.
- Metrics keep their declared order.
- `skills.top` has exactly three entries, all present in `skills.all`.
- `messages.en` and `messages.id` have the same keys, and every value is a string that is not empty, without a placeholder token.
- Every URL is absolute with an `http` or `https` protocol, and the email matches a simple address shape.
- The route locale is always in `locales`; an unknown locale returns 404.
- `<html lang>` always equals the route locale.
- The switch changes only the first path segment and keeps the rest of the path.
- The thin home page and the switch read content only through the accessors and messages, never `content/site.ts` directly.
- The 0002 invariants still hold for shared fields and for each locale's copy.

**Security model**: public, static, read only content. There is no authentication, no write path and no user input. The published email is deliberately included in the page payload, as before. The feature adds no new personal data and no compliance scope. The locale route parameter is validated before use.

**Configuration required**: None. No new environment variables or credentials. The root redirect lives in `next.config.ts`. Canonical URLs and `hreflang` wait for the SEO feature, so no site URL environment variable is introduced here.

**Critical test scenarios** (each maps to an acceptance criterion):

- Happy path: `/` redirects to `/en`, `/en` shows English copy, `/id` shows Indonesian copy, the switch links to the other locale at the same path, and `lang` matches. Verifies **AC-1**, **AC-3**, **AC-7**.
- Data: `getProfile("id")` returns the Indonesian role and headline, the shared email is identical in both locales, `getProjectBySlug("id", "internal-management-system")` returns the Indonesian project, and an unknown slug returns `undefined`. Verifies **AC-4**, **AC-8**.
- Missing translation: blank `profile.intro.id` and run `npm run build`. The build stops with `profile.intro.id` in the message. In development the same blank logs and the page renders the English intro. Verifies **AC-5**.
- Messages: remove a key from the `id` dictionary and type checking fails. Blank a message value and the build stops with the message path. Verifies **AC-6**.
- Date: `formatMonth("2026-10", "en")` returns `October 2026` and `formatMonth("2026-10", "id")` returns `Oktober 2026`. Verifies **AC-10**.
- Unknown locale: `/fr` returns 404, and the static build lists only `/en` and `/id`. Verifies **AC-1**, **AC-9**.
- Styleguide: `/styleguide` renders in development and returns 404 from a production build. Verifies **AC-11**.
- No hardcoded copy: read the thin home page and the switch. Every visible string comes from content or messages. Verifies **AC-2**.
- Copy review: read `/id` and confirm the Indonesian copy addresses the visitor as `Anda`, reads naturally, and adds no facts. Verifies **AC-12**.

## Build plan

Tracer Bullet: stand up the thinnest end to end thread first, one real profile value on `/en` and `/id` moving from the localized source through an accessor into the running page, then thicken the switch, metadata and checks around it.

- [x] Add `lib/i18n/locales.ts` with `Locale`, `locales`, `defaultLocale`, `isLocale` and `localeNames`; add `lib/i18n/path.ts` with `swapLocalePath` and `lib/i18n/format.ts` with `formatMonth`, satisfies **AC-1**, **AC-3**, **AC-10**.
- [x] Add `Localized<T>` and the localized source types to `lib/content/types.ts`, and keep the resolved types with plain strings, satisfies **AC-4**.
- [x] Restructure `content/site.ts` to `{ en, id }` for every translatable field, with the English values from `docs/profile.md` and the Indonesian draft; add `content/messages.ts` with both dictionaries, satisfies **AC-4**, **AC-6**, **AC-8**, **AC-12**.
- [x] Update `lib/content/index.ts` so the accessors take a locale, resolve localized fields, keep the newest first sort and the slug lookup, and add `getMessages`, satisfies **AC-4**, **AC-8**.
- [x] Extend `lib/content/validate.ts` to check every localized field and both message dictionaries, with `.en` and `.id` in the field path; make the accessors return the English value in development when the active locale is blank, satisfies **AC-5**, **AC-6**.
- [x] Move the document shell to `app/[locale]/layout.tsx` with `generateStaticParams`, the `lang` attribute, `assertContentValid()` and localized metadata; delete `app/layout.tsx`; move `app/styleguide/page.tsx` to `app/(dev)/styleguide/page.tsx` and add `app/(dev)/styleguide/layout.tsx` so `/styleguide` keeps its own root layout, satisfies **AC-1**, **AC-3**, **AC-7**, **AC-9**, **AC-11**.
- [x] Build the thin home at `app/[locale]/page.tsx` with the localized profile and the language switch, satisfies **AC-2**, **AC-4**.
- [x] Add the language switch client component and place it on the thin page, using `usePathname` and `swapLocalePath` to keep the path, satisfies **AC-2**, **AC-3**.
- [x] Add the `/` to `/en` redirect in `next.config.ts` with `permanent: false`, satisfies **AC-1**.
- [x] Prove the failure path and the happy path: run `npm run lint` and `npm run build`, blank `profile.intro.id` to confirm the build stops and development logs, then drive `/`, `/en`, `/id`, `/fr`, `/styleguide`, the switch and the date helper, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-5**, **AC-7**, **AC-9**, **AC-10**, **AC-11**, **AC-12**.

## Consequences

**Positive**:
- One source holds both languages, so a fact and its translation stay together and shared values cannot drift.
- Every localized field is type checked and checked at build time, so a missing translation stops deployment.
- The accessor layer hides the localized storage, so later screens read a locale and a value without knowing the shape.
- The site stays static with no new dependency, no database and no server.
- The language switch keeps the page and is usable without JavaScript because the links are server rendered.
- The locale list makes Mandarin a possible third language later with one more dictionary and copy, not a rewrite.

**Negative / tradeoffs**:
- `content/site.ts` is roughly twice as long and every copy edit now touches both languages.
- The Indonesian copy is a translation, so it needs the owner's review and future maintenance. A stale translation remains possible.
- The accessor signatures change from no arguments to a locale argument, so the layout and every later caller must pass it.
- Hand rolled code has no plural rules or rich message formatting. Adding a third language or plural copy means more code or a library.
- The default 404 stays English until the site shell adds a localized error page.
- Canonical URLs and `hreflang` wait for the SEO feature, so search engines see two language versions without explicit alternates in the meantime.
- The styleguide needs a second root layout, so the document shell appears in two places.
- `/en` is longer than `/`, and the root redirect adds one request.
- A visitor who prefers Indonesian but opens `/` lands on English until they switch. The URL only choice accepts that cost.

**Neutral**:
- `app/layout.tsx` is replaced by two root layouts: the locale layout and the development styleguide layout.
- New `lib/i18n` folder, `content/messages.ts` and a language switch component.
- The site builds two static versions of every public page.
- `docs/profile.md` stays the English intake record. The profile names Mandarin as a personal language; the site's second language is Indonesian by the owner's choice.

## Follow-up

- [ ] Review the Indonesian copy with the owner before calling the feature done. The draft lives in `content/site.ts` and `content/messages.ts`.
- [ ] Add canonical URLs, `hreflang`, a sitemap and robots rules in the SEO feature, when the production domain exists.
- [ ] Add a styled, localized 404 with the site shell.
- [ ] If Mandarin should also appear on the site, add it as a third locale. The locale list, dictionaries and switch already support it.
- [ ] Consider a lint rule for hardcoded strings if the component count grows. This slice relies on convention and review.
- [ ] Add `metadataBase` when the production domain is known.
- [ ] Revisit browser language detection at `/` if visitors report landing in the wrong language. Today `/` always goes to `/en`.
- [ ] Fix the stale line in `docs/profile.md` that says the content model reads from the profile. The typed file is the runtime source; settle the intake record wording at `/sync`.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
