# 0004. Adopt a persistent site shell with section navigation

**Date**: 2026-10-30
**Status**: In Progress

## Summary

Every page gets one frame: a sticky header with the name, three section links and the language switch, a footer with the same links, social links and a copyright line, and a skip link for keyboard visitors. The current section is marked as you scroll, and on a phone the links live behind a menu button that traps no focus. The shell reads its copy from `content/messages.ts`, and the section ids come from one shared list so the later sections cannot drift from the nav.

## Context

The site has a design system, a bilingual content model and a thin home page, but no frame. The thin home page carries its own header with the name and language switch, and every later page would repeat that header, or invent a different one, unless the shell lands now. The scope makes this the thread the rest of the site hangs on: header, mobile menu, footer and the section rhythm from the design.

`DESIGN.md` defines the colors, the type scale, the fixed 1160px grid, the 1px section rules and the component primitives. It does not define a header, a mobile menu, a footer or a nav active state. The Figma file covers the home page only, and no Figma connection exists in this project, so the shell composes the existing primitives rather than inventing a new visual language.

The nav points at Work, Experience and Contact, and those sections arrive in later features. The shell must still prove the active marking and the sticky offset today, so it needs temporary anchor targets. The site is public and static: there is no account, no session, no database and no user input anywhere in this feature.

## Requirements

**User stories**:

- As a visitor, I want one clear frame on every page, so I always know where I am and how to reach the work, the experience and the contact section.
- As a visitor on a phone, I want a menu that opens and closes predictably, so I can reach the sections without fighting the page.
- As a keyboard or screen reader user, I want to skip the header, reach every control, and hear which section is current, so the site is usable without a mouse.
- As the site owner, I want one shared section list and one messages dictionary, so the nav, the footer and the later sections cannot drift apart.
- As the site owner, I want the same shell on both languages, so the site feels like one product.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: `/en` and `/id` render the header, the main landmark and the footer on every page. The header wordmark reads `Danny` and links to `/{locale}`. The thin home page's own header and `main` are removed, and the locale layout owns the frame.
- **AC-2**: The header nav lists Work, Experience and Contact in that order, each linking to `/{locale}#work`, `/{locale}#experience` and `/{locale}#contact`. The same three links appear in the footer nav.
- **AC-3**: On the home page, the section in view is marked with `aria-current="location"` and a visible state: foreground text plus a 2px electric underline. At most one section is marked. At the very top of the page no section is marked. At the bottom of the page the last section is marked. On a page without these sections, no section is marked.
- **AC-4**: Below 768px the three section links sit behind a menu button. The button carries `aria-expanded` and `aria-controls`, and opens a panel directly under the header. Escape, a pointer press outside the header, and choosing a link all close the panel. Escape returns focus to the button. No focus trap is used.
- **AC-5**: The first Tab stop is a skip link, visually hidden until focused, which moves focus to the main landmark. Every header and footer control shows the 2px focus ring, is reachable by keyboard, and no control traps focus.
- **AC-6**: The language switch sits in the header at every width. Below 768px it shows `EN` and `ID`; from 768px it shows `English` and `Bahasa Indonesia`. The current language carries `aria-current="page"` and the full locale name as its accessible name. Switching keeps the same path.
- **AC-7**: The footer shows the name and role, the three section links, all four social links from `getLinks()` and a copyright line. Each social link is an icon link with an accessible name from its `label` that opens in the same tab. lucide 1.x ships no brand marks, so each network takes a neutral lucide shape instead. The copyright line reads `© {year} {name}. Built with Next.js.` with the year taken at build time. The email is never printed in the shell.
- **AC-8**: No user facing string in the shell is hardcoded. Every label comes from `getMessages(locale)` or `getProfile(locale)`, and every new message key exists in both dictionaries. Removing or blanking a key stops `npm run build` through the existing validator.
- **AC-9**: `/en/nope` and `/id/nope` render the localized not found page inside the shell, with the copy in the route language and a link back to `/{locale}`. `/fr` keeps the default Next.js 404 because there is no valid locale to render.
- **AC-10**: The header is sticky at the top with the canvas fill and a 1px bottom border. A nav link scrolls its section into view with the section heading clear of the header. Scrolling is smooth when motion is allowed and instant under `prefers-reduced-motion`.
- **AC-11**: At 360px, 768px and 1280px the shell has no horizontal overflow, the nav is in the bar at desktop widths, and the menu button is present below 768px. `npm run lint` passes, `npm run build` passes, and `/en` and `/id` build as static routes.

## Options considered

### Option 1: Sticky header, shared section list, disclosure menu, scroll spy

One locale layout renders the header, main and footer. A shared `siteSections` list supplies the ids and message keys. The desktop nav and the mobile panel read that list. Active marking comes from observing the sections, and the mobile panel is a disclosure that traps no focus.

**Pros**:

- One frame for every page and one source for the section ids.
- The nav stays reachable while reading, and the active state orients the visitor.
- A disclosure needs no focus trap and is much less code than a modal sheet.
- The language switch and the later sections plug into the same structure.

**Cons**:

- The nav and the scroll spy are client components, so the shell carries a small JavaScript boundary.
- Sticky positioning removes 64px of viewport and needs a scroll margin on every target section.
- The placeholder sections are temporary and must be removed as the real sections land.

### Option 2: Static header with links in the footer only

The top of the page shows only the wordmark and the language switch. All section links live in the footer, and no active section is tracked.

**Pros**:

- The smallest shell, with no client component and no sticky offset.
- No placeholder sections are needed.

**Cons**:

- The nav is not reachable while reading, which defeats its purpose on a long page.
- It fails the scope line that the current section is marked.
- The footer becomes the only way to move around, which is the wrong place for primary navigation.

### Option 3: Sticky header with a full screen mobile sheet

The mobile menu becomes a modal sheet that covers the viewport and traps focus until it closes, with the active section taken from the URL hash.

**Pros**:

- The mobile menu feels like a dedicated screen.
- The sheet has room for the switch, the nav and a contact action.

**Cons**:

- A focus trap contradicts the scope line that the menu traps nothing.
- A modal needs more code for the overlay, the scroll lock and the focus return.
- Reading the active section from the hash makes the URL change on every scroll, or leaves it stale.

### Option 4: Sticky header, active state from the URL hash only

The header is sticky and lists the sections, but the active state comes only from a clicked hash, not from scroll position.

**Pros**:

- No observer and no scroll listeners.
- The active state is shareable and stable.

**Cons**:

- The marker does not follow the reader, so it lies as soon as you scroll.
- A fresh visit with no hash shows no active section at all.

## Decision

**Chosen option**: Option 1: Sticky header, shared section list, disclosure menu, scroll spy.

The site gets one locale layout frame: a sticky header with the wordmark, three section links, a language switch and a mobile disclosure panel, a footer with the same links plus social links and a copyright line, a skip link, and a localized not found page for valid locales. The section ids and labels live in one shared list, and the temporary anchors let the active marking and the sticky offset be proven before the real sections arrive.

## Rationale

The scope requires the current section to be marked and the menu to trap nothing. Option 1 is the only option that satisfies both without extra machinery: a disclosure is a button plus a panel, and the active state can follow the reader without touching the URL. The sticky header is the practical choice for a one page portfolio where the nav is the main way to move, and the flat canvas fill with a bottom rule fits the surface system in `DESIGN.md` without introducing blur or shadow.

The shared section list is the load bearing piece for the later features. Work, Experience and Contact will be built by four different features, and every one of them needs the final id and the scroll margin. A shared list makes a mismatch a type error rather than a silent dead link, and it keeps the header, the footer and the placeholders in one place. The temporary anchors are the Tracer Bullet cost: they let this feature ship with a working active state, and they are recorded for removal.

## Feature design

**Data model sketch**:

The shell has one new entity and a set of message keys. There is no persistence.

| Entity        | Fields                                                                   | Rules                                                  |
| ------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| `SiteSection` | `id`: `"work" \| "experience" \| "contact"` (required, unique)           | One entry per nav destination, in `siteSections` order |
|               | `labelKey`: `"nav.work" \| "nav.experience" \| "nav.contact"` (required) | Must be a key in `Messages`                            |

`siteSections` is a readonly ordered array of three `SiteSection` values. `sectionHref(locale, id)` returns `/${locale}#${id}`. The header, the mobile panel, the footer nav and the placeholder sections all read this list, and no section id is written anywhere else.

New `Messages` keys, in both dictionaries:

| Key                    | English                                      | Indonesian                        |
| ---------------------- | -------------------------------------------- | --------------------------------- |
| `nav.label`            | Sections                                     | Bagian                            |
| `nav.work`             | Work                                         | Work                              |
| `nav.experience`       | Experience                                   | Experience                        |
| `nav.contact`          | Contact                                      | Contact                           |
| `nav.openMenu`         | Open menu                                    | Buka menu                         |
| `nav.closeMenu`        | Close menu                                   | Tutup menu                        |
| `skip.label`           | Skip to content                              | Lewati ke konten                  |
| `footer.navLabel`      | Footer sections                              | Bagian footer                     |
| `footer.socialLabel`   | Social links                                 | Tautan sosial                     |
| `footer.builtWith`     | Built with Next.js.                          | Dibangun dengan Next.js.          |
| `notFound.title`       | Page not found                               | Halaman tidak ditemukan           |
| `notFound.description` | The page you are looking for does not exist. | Halaman yang Anda cari tidak ada. |
| `notFound.home`        | Back to home                                 | Kembali ke beranda                |

The nav labels stay `Work`, `Experience` and `Contact` in both languages by your choice. They still live in the dictionary so no component hardcodes them.

**State transitions**:

- Mobile menu: `closed` → `open` on the toggle. `open` → `closed` on the toggle, Escape, an outside pointer press, or a link choice. Escape returns focus to the toggle; the other paths leave focus where the browser puts it.
- Active section: `none` → `work` → `experience` → `contact` → `none`, derived from scroll position. No stored state, no URL change. At the top the state is `none`; at the bottom the last section wins.

**API surface**:

The feature has no HTTP endpoints. This table is the component and module surface.

| Surface                                             | Kind             | Key inputs                                  | Key outputs                                          | Auth   |
| --------------------------------------------------- | ---------------- | ------------------------------------------- | ---------------------------------------------------- | ------ |
| `siteSections`, `sectionHref` (`lib/navigation.ts`) | module           | `locale`, `id`                              | ordered list, href string                            | public |
| `SiteHeader`                                        | server component | `locale`, `profile.displayName`, `messages` | sticky header markup                                 | public |
| `HeaderNav`                                         | client component | `locale`, `messages`                        | desktop nav, mobile toggle and panel, active section | public |
| `SiteFooter`                                        | server component | `locale`, `profile`, `links`, `messages`    | footer markup                                        | public |
| `SocialLinks`                                       | server component | `links`                                     | icon links with accessible names                     | public |
| `SectionPlaceholder`                                | server component | `id`, `label`                               | tall anchor target with the label as heading         | public |
| `app/[locale]/not-found.tsx`                        | client page      | route locale from `useParams`               | localized 404 inside the shell                       | public |

`SiteHeader` and `SiteFooter` are server components. `HeaderNav` is the only new client boundary, because the menu state and the scroll observer need the browser. The language switch is already a client component and keeps that role.

**Value sourcing** (every value the shell produces or displays, and where it comes from):

| Action               | Value produced or displayed            | Source                                                                                                       |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Wordmark             | `Danny`                                | `getProfile(locale).displayName`                                                                             |
| Nav labels           | Work, Experience, Contact              | `messages["nav.work"]`, `["nav.experience"]`, `["nav.contact"]` through `siteSections`                       |
| Nav targets          | `/{locale}#{id}`                       | `sectionHref(locale, section.id)` from `lib/navigation.ts`                                                   |
| Active section       | the id in view                         | `document.getElementById` for each `siteSections` id, observed while on a page that contains them            |
| Menu button label    | Open menu, Close menu                  | `messages["nav.openMenu"]`, `["nav.closeMenu"]`, chosen by menu state                                        |
| Skip link            | Skip to content                        | `messages["skip.label"]`                                                                                     |
| Footer identity      | name and role                          | `getProfile(locale).name`, `.role`                                                                           |
| Footer nav           | the same three links                   | `siteSections`, `sectionHref`, the nav message keys                                                          |
| Social links         | labels, hrefs and icons                | `getLinks()` from `content/site.ts`                                                                          |
| Copyright year       | the build year                         | `new Date().getFullYear()` read once at module load                                                        |
| Copyright line       | `© {year} {name}. Built with Next.js.` | year, `profile.name`, `messages["footer.builtWith"]`                                                         |
| 404 language         | `en` or `id`                           | the `locale` route parameter through `useParams`, validated with `isLocale`, falling back to `defaultLocale` |
| 404 copy             | title, description, home link          | `messages["notFound.title"]`, `["notFound.description"]`, `["notFound.home"]`                                |
| Placeholder headings | Work, Experience, Contact              | the nav message keys through `siteSections`                                                                  |
| Section order        | Work, Experience, Contact              | `siteSections` array order                                                                                   |

**Key invariants**:

- `siteSections` has three entries in the order Work, Experience, Contact, with unique ids and labels that exist in both dictionaries.
- Every section href has the shape `/{locale}#{id}` and uses the current locale.
- At most one section carries `aria-current="location"`.
- The mobile toggle's `aria-expanded` matches whether the panel is rendered, and `aria-controls` names the panel id.
- No focus trap, no scroll lock and no modal role anywhere in the shell.
- Every shell string comes from `getMessages` or `getProfile`; the copyright punctuation and the `©` symbol are the only non copy characters.
- The email never appears in the header or footer, because `emailVisibility` is `copy`.
- Social links open in the same tab, carry no `target`, and have an accessible name from `SocialLink.label`.
- The header is 64px tall and every nav target carries an 80px scroll margin, so the heading clears the sticky bar.
- The three placeholder sections use the shared ids and the nav label as their heading, and no other copy.
- `prefers-reduced-motion` turns the menu animation and the smooth scroll into an instant change.

**Security model**:

Public and static. The shell reads public profile fields and public social links, adds no input, no session, no cookie and no new personal data. The only sensitive value in the content model is the email, and the shell deliberately does not render it. There is no compliance scope.

**Configuration required**: None. No new environment variables, secrets or credentials. The copyright year is read once at module load, so a static build shows its build year.

**Critical test scenarios** (each maps to an acceptance criterion):

- Happy path: at 1280px open `/en`, confirm the header, main and footer, scroll through Work, Experience and Contact, and watch the active marker follow, verifies **AC-1**, **AC-2**, **AC-3**, **AC-10**.
- Mobile: at 360px open the menu, close it with Escape and with an outside press, choose a link, and confirm focus returns to the toggle only for Escape, verifies **AC-4**.
- Keyboard: press Tab from the top, see the skip link, activate it, and confirm focus lands in main; tab through the header and footer and confirm the ring, verifies **AC-5**.
- Locale: `/id` shows Indonesian shell copy with the English nav labels, the switch keeps the path, `/id/nope` shows the Indonesian 404, and `/fr` shows the default 404, verifies **AC-6**, **AC-8**, **AC-9**.
- Footer: confirm all four social links, the four neutral shapes, the build year, and that the email is absent, verifies **AC-7**.
- Reduced motion: with the preference on, open the menu and click a nav link, and confirm both changes are instant, verifies **AC-4**, **AC-10**.
- Build: blank one new message key and confirm `npm run build` stops with its path; restore it and confirm lint, build and the two static routes, verifies **AC-8**, **AC-11**.

## Build plan

Tracer Bullet: stand up the frame end to end first, then thicken the nav behavior and the footer around it, so every step leaves a page that renders.

1. Add `lib/navigation.ts` with `SiteSectionId`, `SiteSection`, `siteSections` and `sectionHref`, add the 13 message keys to `lib/content/types.ts` and both dictionaries in `content/messages.ts`, satisfies **AC-2**, **AC-8**.
2. Render the frame in `app/[locale]/layout.tsx`: skip link, `SiteHeader` with the wordmark, the existing language switch and a first nav list, `main id="main" tabIndex={-1}`, and `SiteFooter` with the identity line. Remove the thin home page's own header, `main` and duplicate switch, satisfies **AC-1**, **AC-2**, **AC-5**, **AC-7**.
3. Build `HeaderNav` as a client component: desktop links, active section observer, `aria-current="location"` and the foreground plus 2px electric underline, satisfies **AC-3**.
4. Add the sticky header treatment, the 80px scroll margin on nav targets, and smooth scrolling that respects reduced motion, satisfies **AC-10**.
5. Add the mobile disclosure panel under the header with the toggle, `aria-expanded`, `aria-controls`, Escape, outside press, link choice and focus return, satisfies **AC-4**.
6. Restyle `components/language-switch.tsx` with real tokens (`bg-card`, `bg-muted`, `bg-primary` and `text-primary-foreground` or equivalent) and add the `EN` / `ID` labels below 768px with full accessible names, satisfies **AC-6**.
7. Finish `SiteFooter`: name and role, the footer nav from `siteSections`, `SocialLinks` with one neutral lucide shape per network, and the copyright line with the build year, satisfies **AC-7**, **AC-8**.
8. Add `SectionPlaceholder` and render Work, Experience and Contact on the home page as tall sections with the nav label as heading and the shared ids, satisfies **AC-2**, **AC-3**, **AC-10**.
9. Add `app/[locale]/not-found.tsx` as a client page that reads the locale, validates it, renders the localized copy inside the shell and links back to `/{locale}`, and confirm `/fr` keeps the default 404, satisfies **AC-9**.
10. Prove the shell: run `npm run lint` and `npm run build`, drive `/en`, `/id`, `/en/nope`, `/id/nope`, `/fr` at 360px, 768px and 1280px, do the keyboard pass and the reduced motion pass, blank one message key for the failure path, and restore it, satisfies **AC-1** through **AC-11**.

## Consequences

**Positive**:

- Every page gets the same header and footer, so the later sections plug into a frame instead of each inventing one.
- The nav marks the current section, and the shared list makes the header, the footer and the placeholders agree on ids.
- The mobile menu is small, keyboard usable and traps nothing.
- The shell copy is typed and checked at build time, so a missing translation cannot ship.
- The language switch is fixed to real tokens while it moves into the header, and it fits at 360px.

**Negative / tradeoffs**:

- The nav and the scroll spy are a client component and need JavaScript. Without it the mobile links cannot open, though the wordmark and the switch still render.
- The sticky header costs 64px of viewport on every page and every target section must carry the scroll margin.
- The three placeholder sections are visible on the home page until features 6, 7, 10 and 11 replace them, and they are temporary code.
- The four social links use neutral lucide shapes (a code bracket, an at sign, a briefcase and a camera) because lucide 1.x dropped every brand mark. The accessible name carries the network, but the shapes do not read as GitHub, X, LinkedIn or Instagram.
- The 404 is localized only inside a valid locale. `/fr` keeps the plain default 404.
- The localized 404 answers with a correct 404 status and a noindex tag, but its HTML arrives through the framework's client resume step, so the shell paints after hydration rather than in the first response.
- The nav labels are English in both languages, so the Indonesian header is not fully translated by choice.
- The year on the copyright line is the build year, not the visit year, on a static site.

**Neutral**:

- New `lib/navigation.ts`, a `SectionPlaceholder` component, a `SiteHeader`, a `SiteFooter`, a `HeaderNav` and a `SocialLinks` component.
- `app/[locale]/layout.tsx` becomes the owner of the page frame, and pages stop rendering their own `main`.
- The styleguide keeps its own root layout and shows no shell, as before.
- The shell adds one client boundary to every page.

## Follow-up

- [ ] Replace the three placeholder sections with the real sections as features 6, 7, 10 and 11 land, and delete `SectionPlaceholder` then.
- [ ] Revisit the social marks if accurate brand icons are wanted, since the current shapes are neutral stand ins.
- [ ] Widen the 404 delivery to full server rendered HTML if a no JavaScript visitor should read it.
- [ ] Keep `/fr` on the default 404 unless a styled root 404 is designed later.
- [ ] Re-check the language switch and the nav active state against the AA bar after the token restyle, since the old `bg-surface-container-*` and `text-electric-foreground` classes never existed.
- [ ] Record the shell conventions (sticky header, shared navigation list, scroll spy, message keys) in `AGENTS.md` at the next `/sync`.
- [ ] Consider a check for drift between `siteSections` and the section components once all real sections exist.
- [ ] Revisit the English only nav labels when the Indonesian copy is reviewed.
