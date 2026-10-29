# Verify: Internationalization and locale routing · spec 0003 · updated 2026-10-29

_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open `/` in browser → redirects to `/en` → AC-1
- [x] Open `/en` in browser → `<html lang="en">`, English copy renders, language switch links to `/id` and marks English active → AC-1, AC-2, AC-3, AC-7
- [x] Open `/id` in browser → `<html lang="id">`, Indonesian copy renders, language switch links to `/en` and marks Indonesian active → AC-1, AC-2, AC-3, AC-7, AC-12
- [x] Click language switch on `/en` → navigates to `/id` while keeping the same path → AC-3
- [x] Click language switch on `/id` → navigates to `/en` while keeping the same path → AC-3
- [x] Open `/fr` in browser → returns 404 page → AC-1, AC-9
- [x] Open `/styleguide` in development → renders styleguide with its own root layout → AC-11
- [x] Open `/styleguide` in production build → returns 404 page → AC-11
- [x] Inspect `/en` and `/id` rendered copy → zero hardcoded English strings in thin home or language switch → AC-2
- [x] Review Indonesian text on `/id` → faithful translation addressing visitor as Anda without added facts → AC-12

## Commands

- [x] `npm.cmd run lint` → passes with 0 errors and 0 warnings → AC-9
- [x] `npm.cmd run build` → succeeds and generates static pages for `/en` and `/id` → AC-1, AC-9
- [x] Blank `profile.intro.id` in `content/site.ts` and run `npm.cmd run build` → build fails naming `profile.intro.id` → AC-5
- [x] Remove key from `content/messages.ts` and run `npm.cmd run lint` → TypeScript type check fails → AC-6
- [x] Blank message in `content/messages.ts` and run `npm.cmd run build` → build fails naming the message path → AC-6
- [x] Call `formatMonth("2026-10", "en")` → returns `October 2026` → AC-10
- [x] Call `formatMonth("2026-10", "id")` → returns `Oktober 2026` → AC-10
- [x] Call `getProjectBySlug("id", "internal-management-system")` → returns project with Indonesian localized fields → AC-4, AC-8
- [x] Call `getProjectBySlug("id", "unknown-slug")` → returns `undefined` → AC-8

## Acceptance-criteria coverage

- AC-1 covered by redirect to `/en`, 200 on `/en` and `/id`, 404 on `/fr`, and build verification
- AC-2 covered by component copy inspection on `/en` and `/id`
- AC-3 covered by `<html lang>` check, active indicator, and same path switch navigation
- AC-4 covered by typed `{ en, id }` storage and accessor resolution
- AC-5 covered by build failure on blank `profile.intro.id`
- AC-6 covered by type check on removed message key and build stop on blank message
- AC-7 covered by localized document title and meta description
- AC-8 covered by shared slugs, project lookup, and undefined on missing slug
- AC-9 covered by static route generation during production build
- AC-10 covered by `formatMonth` verification for English and Indonesian
- AC-11 covered by development access and production 404 on `/styleguide`
- AC-12 covered by Indonesian copy review
