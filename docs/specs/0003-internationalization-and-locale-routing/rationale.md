# Rationale: 0003. Adopt Indonesian locale routing and a bilingual content model

## Context

The site is a static Next.js 16 App Router portfolio, English only today. Feature 4 adds the second language before the site shell and the hero, because the content shape and the routes decide what every later page can render. The owner chose Indonesian (`id`). The profile also names Mandarin as a personal language, and that stays a true fact about the owner, not the site's second language. The locale list can add Mandarin later without a rewrite.

The content model from spec 0002 is one typed source read through accessor functions. Every later feature reads the same profile, projects, experience, metrics and links. Without a locale shape now, each of those features would either hardcode English or need a rewrite when the second language lands. The accessor signatures are the seam the language feature was meant to use.

Next.js 16 has no App Router `i18n` configuration. The App Router guide uses a `[lang]` segment, `generateStaticParams`, and optionally `next/root-params`. The project is static, has no test runner, and avoids dependencies, so the build is the gate. The owner wants the language in the URL, a switch that keeps the current page, and no hardcoded English string in a component.

The copy is personal. Translations must be faithful and reviewed by the owner, and no new facts may appear. The site must stay accessible, static, and free of new services. A second language also means two versions of every later page, so the routing and content decisions made here are expensive to change later.

## Options considered

### Option 1: Hand rolled locale segment with localized fields in one content source

One `content/site.ts` holds every translatable field as `{ en, id }`, shared facts once. The `app/[locale]` segment serves `en` and `id`, `generateStaticParams` lists them, a typed `content/messages.ts` holds interface strings, and the accessors take a locale. A small `lib/i18n` folder holds the locale list, path swap, date formatting and the unknown locale guard.

**Pros**:
- One source and one set of shared facts, with no merge step to get wrong.
- TypeScript forces both locale values on every new translatable field.
- No dependency, no server and no database; both routes stay static.
- Explicit locale arguments keep the data layer free of Next.js request state and usable during build validation.

**Cons**:
- Every content edit now touches two languages, and the file is roughly twice as long.
- The accessor signatures change, so every later caller passes a locale.
- Plural rules and rich message formatting would need new code.

### Option 2: next-intl

Add `next-intl` for routing helpers, message loading, plural rules and formatting, with the same `[locale]` segment.

**Pros**:
- Mature library with plural and formatting support.
- Message catalogs and routing helpers are already solved.
- Easier if the site grows many locales or plural copy.

**Cons**:
- A new dependency and configuration for two locales with no plural strings yet.
- The content still needs a localized shape, so the library does not answer the main question.
- More runtime surface than a static portfolio needs, and one more thing to maintain.

### Option 3: Two full content files per locale

`content/en.ts` and `content/id.ts` each hold a complete `SiteContent`, and the accessors pick the file.

**Pros**:
- Each language file is readable on its own.
- Easy to hand one file to a translator.
- No localized wrapper types.

**Cons**:
- Duplicates email, URLs, dates, slugs and every shared fact, so the copies drift.
- Two validators or a comparison step to keep the sets aligned.
- A project added to one file can be missing from the other.

### Option 4: English source with an Indonesian translation overlay

Keep `content/site.ts` as the English source and add a typed Indonesian overlay that fills only the translatable fields.

**Pros**:
- The English file stays clean and close to `docs/profile.md`.
- Translations live in their own file, which is easy to review.
- Shared facts stay single.

**Cons**:
- Needs stable keys for experience and metrics plus merge logic for every entity.
- Index based mapping breaks when roles or metrics are reordered.
- A missing overlay key is easier to miss than a missing value in a `{ en, id }` pair.

## Rationale

Option 1 fits the forces in Context. The site has two locales, no plural copy, no user input and no server, so the smallest complete answer is a locale list, a `[locale]` segment and one source with both values. The inline shape costs some readability in `content/site.ts`, but it removes a merge step, a second record of shared facts and a class of drift bugs. TypeScript then forces both values whenever a field is added. The 0002 accessors remain the seam; only their signatures gain a locale.

Option 2 is the right answer if the site grows many locales or complex plural and date messages. Today it would add a dependency and configuration to solve problems the site does not have, and it would still leave the content shape to design. Option 3 is simple to read but duplicates the shared facts the 0002 spec deliberately made single, so it invites exactly the drift the build check exists to prevent. Option 4 keeps English clean but pays for it with stable keys and merge logic, and index based translation of experience roles is brittle. The overlay is a reasonable future step if the site ever has many translators or a content management system, not for one owner writing two languages.

The routing choice follows the Next.js 16 App Router guide. `app/[locale]` makes the locale a root parameter, `generateStaticParams` is required under Cache Components, and `dynamicParams = false` plus `isLocale` keeps unknown locales out. A config redirect sends `/` to `/en`; a proxy would only earn its place if browser language detection is wanted later. Explicit locale arguments beat reading the locale inside the accessors with `next/root-params`, because the data layer stays framework free, the locale is visible at each call, and the build validator can read both locales without a request.

The switch uses the URL as the only state. That keeps the pages static, makes shared links keep their language, and avoids a cookie or a client side preference that can disagree with the first paint. The cost is that a visitor who prefers Indonesian and opens `/` gets English until they switch. The owner accepted that tradeoff, and browser detection can be added at `/` later if it proves annoying.

Indonesian is the owner's choice. Mandarin remains a personal language in the profile, and the locale list makes it a third locale when and if the owner wants it. The default 404 stays English and canonical URLs and `hreflang` wait for the SEO feature; both are scope boundaries, not forgotten work. The styleguide keeps its short `/styleguide` URL with its own root layout so the feature 2 manual check still works after the document shell moves under the locale.
