# Scope: Personal portfolio site

A single page portfolio for you as an engineer, with one detail page per project, built on Next.js and TypeScript and following the Obsidian Blueprint design in `DESIGN.md`. Frontend only, no backend, no accounts, no database.

**Build approach:** Tracer Bullet (vertical slices, each feature built end to end and working before the next).
**Workflow:** Alpha (after `/develop`, `/check verify` on the real app; no separate test suite or second model review unless a feature needs it).
**UI components:** shadcn/ui for every base component (your call, recorded as a project constraint), themed to the Obsidian tokens instead of left at its defaults.

**Content:** every personal detail comes from you, name, headline, experience, projects, links, metrics and availability. Nothing is invented or filled with sample text. Answer the content questions before the hero, index and detail page are built.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## What to check by hand

The short human pass for each shipped feature, kept here so long checklists stay out of chat. Add one line per feature when it lands, replace it when the next feature supersedes it.

- **2. Design system:** open `/styleguide` at desktop and phone width, scan tokens, type scale, spacing, radius and card states. Tab through the focus walk and confirm the blue ring. Turn on reduce motion and confirm the status ping stops. Build for production and confirm `/styleguide` returns 404. Known dev warning: under reduce motion the status pill logs one hydration warning in the console, the ping still stops.
- **3. Content model:** the home tab title and description now come from `content/site.ts`. Blank `profile.headline` and run `npm run build` to watch it stop with the field name, then restore it. Add a project to the array and it appears through the accessors with no other edit. The runtime check passed on 2026-10-29.
- **4. Internationalization:** open `/` and confirm redirect to `/en`. Switch to Bahasa Indonesia and confirm `/id` renders with Indonesian copy and active marker. Verify `/fr` returns 404. The runtime check passed on 2026-10-29.

## At a glance

| #   | Feature                                 | Phase      | Status   |
| --- | --------------------------------------- | ---------- | -------- |
| A   | Next.js scaffold                        | Foundation | existing |
| 1   | Coding standards and tooling            | Foundation | done     |
| 2   | Design system and UI foundation         | Foundation | done     |
| 3   | Content model and data layer            | Foundation | in-progress |
| 4   | Internationalization and locale routing | Foundation | in-progress |
| 5   | Site shell and navigation               | Slice 1    | in-progress |
| 6   | Hero section                            | Slice 1    | planned  |
| 7   | Project index                           | Slice 1    | planned  |
| 8   | Project detail page                     | Slice 1    | planned  |
| 9   | Metric cards                            | Slice 2    | planned  |
| 10  | Experience section                      | Slice 2    | planned  |
| 11  | Contact section                         | Slice 2    | planned  |
| 12  | Contribution heatmap                    | Slice 3    | planned  |
| 13  | Activity feed                           | Slice 3    | planned  |
| 14  | SEO and share metadata                  | Slice 4    | planned  |

## Foundations

### A. Next.js scaffold · existing

Pre-workflow scaffold from `create-next-app`: Next.js 16 with the app router, React 19, TypeScript strict, Tailwind 4, Geist fonts and ESLint. It boots but shows the starter page only. code in `./`

### 1. Coding standards and tooling · done

Capture the real conventions of this project, including the shadcn/ui rule for base components, and keep ESLint as the one automated gate. No test runner and no formatter in this project, by your decision.
**Done when:** root `AGENTS.md` describes the actual stack and conventions, and `npm run lint` passes with no warnings.

- [x] Capture conventions and tooling choices: `/audit`

ESLint 9 with the flat config and `eslint-config-next` is the lint gate, verified clean. No test runner, by your decision.

### 2. Design system and UI foundation · done

Turn `DESIGN.md` into tokens and base components so every screen looks like one system. Base components come from shadcn/ui, themed to the tokens rather than left at their defaults. The palette conflict is now settled in favour of the prose palette, with three AA corrections.
**Done when:** color, type, spacing, radius and focus tokens live in one place, the base button, badge, card, input and tag exist with hover and focus states, the development only styleguide renders them, and every text on background pair used passes WCAG AA contrast.

- [x] Design it (spec): `/architect design system and UI foundation`
- [x] Build it: `/develop design system and UI foundation`
- [x] Verify it: `/check verify design system and UI foundation`

Code in `app/globals.css`, `app/layout.tsx`, `components/ui/`, `components/`, `components/layout/` and the development only `app/styleguide/page.tsx`.
Spec [0001](../specs/0001-design-system-foundation/index.md)

### 3. Content model and data layer · in-progress

One typed source of truth for profile, projects, metrics and links, seeded from your personal information README, so the site reads real content and a new project is one entry, not scattered edits. The shape decides what every page can render.
**Done when:** the personal information file exists and holds your real details, adding one project entry produces its page with no other edits, profile and links come from the same source, and no placeholder copy can ship unnoticed.

- [x] Design it (spec): `/architect content model and data layer`
- [x] Build it: `/develop content model and data layer`
  - [x] Types and the real seed: `lib/content/types.ts` and `content/site.ts` from `docs/profile.md`, satisfies AC-1, AC-7, AC-8, AC-10
  - [x] Accessors and the layout thread: seven accessors plus `getProfile()` in `app/layout.tsx`, satisfies AC-2, AC-3, AC-4, AC-7, AC-9
  - [x] Validation in the build: `lib/content/validate.ts` wired through `assertContentValid()`, satisfies AC-5, AC-6
  - [x] Lint and build proof: `npm run lint`, `npm run build`, and one deliberate failure, satisfies AC-5
- [x] Verify it: `/check verify content model and data layer`

Code in `content/site.ts` and `lib/content/`.
Spec [0002](../specs/0002-content-model-and-data-layer/index.md)

### 4. Internationalization and locale routing · in-progress

English plus the second language you choose, with the language in the URL so links stay shareable. Content shape, routes and metadata all depend on this, so it comes before the first screen.
**Done when:** every page renders in both languages, the current language is in the URL, switching keeps you on the same page, and no hardcoded English string remains in a component.

- [x] Design it (spec): `/architect internationalization and locale routing`
- [x] Build it: `/develop internationalization and locale routing`
  - [x] i18n core helpers and date formatting: `lib/i18n/locales.ts`, `lib/i18n/path.ts`, and `lib/i18n/format.ts`, satisfies AC-1, AC-3, AC-10
  - [x] Bilingual content model and messages: `lib/content/types.ts`, `content/site.ts`, `content/messages.ts`, and accessors in `lib/content/index.ts`, satisfies AC-4, AC-6, AC-8, AC-12
  - [x] Validation in build and development: `lib/content/validate.ts` checking both locales and messages, satisfies AC-5, AC-6
  - [x] Locale routing, layouts, and language switch: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `next.config.ts`, and preserved `app/(dev)/styleguide/`, satisfies AC-1, AC-2, AC-3, AC-7, AC-9, AC-11
  - [x] Lint, build proof, and failure injection: verify `/en`, `/id`, root redirect, 404s, and deliberate missing field failure, satisfies AC-1, AC-5, AC-9, AC-10
- [x] Verify it: `/check verify internationalization and locale routing`

Code in `lib/i18n/`, `content/`, and `app/[locale]/`.
Spec [0003](../specs/0003-internationalization-and-locale-routing/index.md)

## Slice 1: Walking skeleton

### 5. Site shell and navigation · in-progress

The frame every page sits in: header, mobile menu, footer and the section rhythm from the design. This is the thread the rest of the site hangs on.
**Done when:** header, menu and footer render on every page, the menu works by keyboard and traps nothing, the current section is marked, and the layout matches the fixed width grid at desktop, tablet and mobile.

- [x] Design it (spec): `/architect site shell and navigation`
- [x] Build it: `/develop site shell and navigation`
  - [x] Shared section list and shell copy: `lib/navigation.ts` and the messages keys, satisfies AC-2, AC-8
  - [x] Locale frame, header, desktop nav and active marking: `app/[locale]/layout.tsx` and `components/layout/`, satisfies AC-1, AC-2, AC-3, AC-5, AC-10
  - [x] Mobile disclosure, language switch and footer: `components/layout/` and `components/language-switch.tsx`, satisfies AC-4, AC-6, AC-7
  - [x] Temporary anchors and the localized 404: the home placeholders and `app/[locale]/not-found.tsx`, satisfies AC-2, AC-3, AC-9
  - [x] Lint, build and hands on checks at three widths and both locales, satisfies AC-1 to AC-11
- [ ] Verify it: `/check verify site shell and navigation`

Code in `lib/navigation.ts`, `components/layout/`, `components/language-switch.tsx`, `app/[locale]/` and `content/messages.ts`.
Spec [0004](../specs/0004-site-shell-and-navigation.md)

### 6. Hero section · planned

The first screen: name, role, headline, intro, availability dot and primary action, all from your content.
**Done when:** every hero element renders from the content source in both languages, the availability dot animates and respects reduced motion preferences, and the copy contains no invented detail.

- [ ] Build it: `/develop hero section`

### 7. Project index · planned

The numbered project list from the design, the main way a visitor reaches your work.
**Done when:** projects show in the design's index style with order number, title, stack badges and an external link, each row opens its project page, hover and focus states match the design, and an empty state exists.

- [ ] Build it: `/develop project index`

### 8. Project detail page · needs a decision

One page per project, a short case study: the problem, your approach, what you built, the outcome and screenshots. The Figma covers the home page only, so the page layout and section order are the decision.
**Done when:** each project has its own URL with title, summary, stack, links, a short case study body and screenshots, an unknown slug shows the not found page, and the page is shareable with its own metadata.

- [ ] Design it (spec): `/architect project detail page`

## Slice 2: Depth

### 9. Metric cards · planned

The measurable proof row from the design: the numbers you want a recruiter to see first.
**Done when:** your real labels and values render from the content source, the mono stat treatment matches the design, and the row reflows to one or two columns on mobile without clipping.

- [ ] Build it: `/develop metric cards`

### 10. Experience section · planned

Your roles in the design's card and spine language, the proof that the projects came from real jobs. It is not in the Figma, so it reuses the existing card and section rhythm rather than inventing a new visual idea.
**Done when:** roles render from the content source in both languages with company, title, dates and one line each, the current role is marked, and the section sits above contact without breaking the section rhythm.

- [ ] Build it: `/develop experience section`

### 11. Contact section · planned

The closing section: the form styled as in the design that opens a prefilled mail draft, plus copy email and social links. No backend.
**Done when:** submitting opens a prefilled mail draft to your address, the address can be copied with visible feedback, social links are labelled for screen readers, and the whole section is keyboard usable.

- [ ] Build it: `/develop contact section`

## Slice 3: Live proof

### 12. Contribution heatmap · needs a decision

A real 52 week contribution grid pulled from GitHub when the site builds, the most convincing signal in the design. Reading GitHub at build time, caching it and keeping the page usable without it are the decisions.
**Done when:** the grid shows your real counts in the design's ramp, a hover or focus tooltip gives date and count, a text summary serves screen readers, and the build still succeeds when GitHub is unreachable.

- [ ] Design it (spec): `/architect contribution heatmap`

### 13. Activity feed · needs a decision

Recent public commits on the vertical spine from the design, showing the work is current. It reuses the GitHub data source chosen for the heatmap but needs its own rules for what is public.
**Done when:** the feed lists recent public commits with repo, short hash and relative time from build data, hidden repos never appear, and the section is omitted cleanly when there is nothing to show.

- [ ] Design it (spec): `/architect activity feed`

## Slice 4: Discovery

### 14. SEO and share metadata · needs a decision

Titles, descriptions, share cards, hreflang, sitemap and robots, for a link that looks right when a recruiter opens it in a chat.
**Done when:** every page has a title, description, canonical URL and language alternates, the Open Graph and X card image renders for the home and each project, and sitemap and robots are generated at build.

- [ ] Design it (spec): `/architect SEO and share metadata`

## Deferred

Out of scope for this pass, kept so the plan stays honest.

- **Resume download**: a downloadable resume file or link on the site · needs a decision
- **Blog or writing**: articles with their own pages · needs a decision
- **Project filtering and search**: filter the index by stack · needs a decision
- **Light theme toggle**: a second palette · needs a decision
- **Real contact form delivery**: messages sent without a mail app · needs a decision
- **Product analytics**: visits, sources and conversion · needs a decision
- **More languages**: beyond the second one · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Every other box is an execution box.

**Status**: `planned`, then `in-progress`, then `done`. `existing` means it predates this workflow, `dropped` means de-scoped. `needs a decision` beside a heading means run `/architect` first, otherwise go straight to `/develop`.

**Next step** is always the first unticked box.

**Workflow Alpha**: after `/develop`, `/check verify` on the real app. A feature can carry a `· Beta` or `· GA` tag to do more.

**Pointer line** (`spec <n> · code in <path>`) appears once the spec or the code exists.
