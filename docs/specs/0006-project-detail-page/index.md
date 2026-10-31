# 0006. Project detail page

**Date**: 2026-10-31
**Status**: In Progress

## Summary

Every project gets its own page at `/{locale}/projects/{slug}`, built as a short case study. The page shows the name, summary, stack, role, one cover image and the four parts Problem, Approach, Built and Outcome, then sends the visitor back to the work section. It is fully static, reads only from your content, and carries its own title, description and Open Graph text so one link is shareable.

## Requirements

**User stories**:

- As a hiring manager, I want a short, scannable case study, so I can judge the work in a couple of minutes.
- As the site owner, I want each project to have its own shareable URL with my real content and a cover image, so I can send one link.
- As the engineer building the index next, I want a stable project URL, so every index row points at a real page.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: Every project in `content/site.ts` has a page at `/{locale}/projects/{slug}`. `generateStaticParams` prerenders one page per project per locale, and the page is a server component.
- **AC-2**: The page shows the project name as the only `h1`, the summary, the stack as tags, the role in the header line, the cover image, and the four case study rows in the order Problem, Approach, Built, Outcome. Every project value comes from the content accessors for the active locale, `getProjectBySlug` plus the order number from `getProjects`. Every interface label comes from `getMessages(locale)`. No personal copy is hardcoded.
- **AC-3**: The cover renders through `next/image` at its natural aspect using `cover.width` and `cover.height`, with `cover.alt` as the alt text, inside a bordered panel below the header. It causes no layout shift and is not preloaded.
- **AC-4**: A primary `Live site` action appears when `liveUrl` is not null, a secondary `Source` action appears when `repoUrl` is not null and the project is not private, and a `Private` tag appears instead of Source when `private` is true. Every action opens in the same tab.
- **AC-5**: `generateMetadata` returns the project name as the title (through the layout template), the summary as the description, and an `openGraph` object with the name, the summary and type `article`. No share image and no canonical URL yet.
- **AC-6**: An unknown slug calls `notFound()` and renders the locale not found page with the site shell and the route language. The same slug under the other locale renders the same project with translated content.
- **AC-7**: A back link to `/{locale}#work`, labelled from `project.back`, appears above the header and after the case study. The language switch on the page keeps the same slug.
- **AC-8**: `ProjectContent` gains a required `cover` with `src`, localized `alt`, `width` and `height`. The build validator rejects a missing or blank field, a dimension that is not a positive integer, a `src` outside `/projects/<slug>/`, and a file that does not exist under `public`. Production stops the build; development logs the errors, as spec 0002 does.
- **AC-9**: The four case study labels are `h2` headings and the rows stack on mobile. The back links and actions are keyboard reachable with the 2px focus ring, and the cover carries its alt text. At 360px there is no horizontal scroll and every action is at least 44px tall.
- **AC-10**: `npm run lint` reports no errors and `npm run build` prerenders `/en/projects/<slug>` and `/id/projects/<slug>` as static routes.

## Decision

**Chosen option**: Option 1: a static case study page at `/{locale}/projects/{slug}`, with the header, the cover, four labelled rows and a back link.

The page is a server component under `app/[locale]/projects/[slug]/page.tsx`. It resolves the project with `getProjectBySlug`, the order number from the project's position in `getProjects`, and the labels from `getMessages`. The cover is a required part of the project content, validated at build time. The fourth row uses `outcome`; `caseStudy.result` is not shown on this page.

## Feature design

**Data model sketch**:

`ProjectContent` and `Project` gain one embedded field. There is no new collection, no foreign key and no array.

| Entity                | Field    | Type                  | Required | Rule                                         |
| --------------------- | -------- | --------------------- | -------- | -------------------------------------------- |
| `ProjectContent`      | `cover`  | `ProjectCoverContent` | yes      | embedded, one per project                    |
| `ProjectCoverContent` | `src`    | `string`              | yes      | public path, starts with `/projects/<slug>/` |
| `ProjectCoverContent` | `alt`    | `LocalizedString`     | yes      | non empty in both `en` and `id`              |
| `ProjectCoverContent` | `width`  | `number`              | yes      | positive integer, natural pixel width        |
| `ProjectCoverContent` | `height` | `number`              | yes      | positive integer, natural pixel height       |
| `Project`             | `cover`  | `ProjectCover`        | yes      | resolved `alt` for the active locale         |

`getProjects` and `getProjectBySlug` resolve `cover.alt` for the active locale. A new `getProjectSlugs()` returns the slug list for `generateStaticParams`, so the route never needs a locale just to read slugs.

**State transitions**: none. The content is static and read only. The page has no client state.

**API surface**:

| Surface                          | Inputs                              | Outputs                             | Auth       | Key errors                                                    |
| -------------------------------- | ----------------------------------- | ----------------------------------- | ---------- | ------------------------------------------------------------- |
| `GET /{locale}/projects/{slug}`  | `locale`, `slug` from the route     | prerendered page                    | public     | unknown slug renders the locale not found page                |
| `generateStaticParams`           | none                                | `{ slug }[]`, run once per locale   | build time | none                                                          |
| `generateMetadata`               | `params: Promise<{ locale, slug }>` | `title`, `description`, `openGraph` | build time | falls back to the layout defaults when the project is missing |
| `getProjectBySlug(locale, slug)` | locale, slug                        | `Project` or `undefined`            | public     | `undefined` for an unknown slug                               |
| `getProjectSlugs()`              | none                                | `string[]`                          | public     | none                                                          |

Next 16 detail: `params` is a Promise, so both the page and `generateMetadata` await it. `dynamicParams` is not available because `cacheComponents` is on. Known slugs prerender; an unknown slug renders on demand and reaches `notFound()`.

**Value sourcing**:

| Action                | Value produced or displayed | Source                                                                            |
| --------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| Render the header     | order number `01`           | position in `getProjects(locale)`, padded to two digits (decided here)            |
| Render the header     | role                        | `project.role` from `getProjectBySlug`                                            |
| Render the page title | project name                | `project.name`, the only `h1`                                                     |
| Render the summary    | summary                     | `project.summary`                                                                 |
| Render the stack      | tag labels                  | `project.stack`, one `Tag` per entry                                              |
| Render the stack list | accessible list name        | `project.stackLabel` in `content/messages.ts` (decided here)                      |
| Render the cover      | image, dimensions, alt      | `project.cover.src`, `.width`, `.height`, `.alt` (decided here)                   |
| Render the actions    | Live site label and href    | `project.liveUrl`, `project.liveSite` message (decided here)                      |
| Render the actions    | Source label and href       | `project.repoUrl`, `project.source` message (decided here)                        |
| Render the actions    | Private tag                 | `project.private`, `project.private` message (decided here)                       |
| Render the case study | four labels                 | `project.part.problem`, `.approach`, `.built`, `.outcome` messages (decided here) |
| Render the case study | four paragraphs             | `caseStudy.problem`, `.approach`, `.built` and `project.outcome` (decided here)   |
| Render the back links | label and href              | `project.back` message, `sectionHref(locale, "work")` (spec 0004)                 |
| Set the metadata      | title, description          | `project.name`, `project.summary`                                                 |
| Set the metadata      | Open Graph fields           | name, summary, literal `article` (decided here)                                   |
| Switch language       | target href                 | `swapLocalePath(pathname, nextLocale)` keeps the slug (spec 0003)                 |
| Handle a bad slug     | not found page              | `notFound()` renders `app/[locale]/not-found.tsx` (spec 0003)                     |

**Key invariants**:

- The page has exactly one `h1`, the project name.
- Every visible project value comes from the accessor for the active locale.
- The cover is required, its file exists under `public`, and its dimensions are positive integers.
- The four rows are Problem, Approach, Built, Outcome, in that order. `caseStudy.result` is not shown.
- External actions open in the same tab.
- The page uses semantic tokens and named type classes. No raw hex. The order number uses `text-muted-foreground`, never `--faint`, because spec 0001 restricts `--faint` to decoration.
- The page is a server component and adds no client JavaScript.

**Security model**:

Public and read only. No authentication, no user input and no storage. The page shows only facts already published in `content/site.ts`. The cover image is a local file under `public`, so no remote image host is trusted.

**Configuration required**: none.

**Critical test scenarios** (each maps to an acceptance criterion in Requirements):

- Happy path: open `/en/projects/internal-management-system`. The header, cover, four rows and Source action render, then open the same slug on `/id` and every project value is translated while the slug stays. Verifies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-6**.
- Unknown slug: open `/en/projects/not-a-project`. The locale not found page renders with the shell and the English copy. Verifies **AC-6**.
- Language switch: on a project page, switch language and the same project stays open. Verifies **AC-7**.
- Metadata: inspect the document head. The title is `<project name> | Danny Ng`, the description is the summary, and the Open Graph tags carry the name and summary. Verifies **AC-5**.
- Validation: blank `cover.alt.id` or point `src` at a missing file, then run the build. It stops and names the field path. Verifies **AC-8**.
- Narrow and keyboard: at 360px there is no horizontal scroll, the rows stack, tab reaches the back links and actions, the focus ring is visible, and each action is at least 44px tall. Verifies **AC-9**.
- Build gate: `npm run lint` and `npm run build` pass, and both locale routes prerender. Verifies **AC-10**.

## Build plan

Tracer Bullet: stand up one real project end to end first, route plus name and summary, then add the cover, the actions and the four rows, then the metadata and validation around it.

1. Extend `lib/content/types.ts` with `ProjectCoverContent` and `ProjectCover`, add `cover` to `ProjectContent` and `Project`, resolve it in `getProjects` and `getProjectBySlug`, and add `getProjectSlugs()` to `lib/content/index.ts`, satisfies **AC-2**, **AC-8**.
2. Add the cover entry to the one project in `content/site.ts` and the image file under `public/projects/internal-management-system/`, satisfies **AC-2**, **AC-3**, **AC-8**.
3. Extend `lib/content/validate.ts` to check `cover.src`, the localized `alt`, positive `width` and `height`, the `/projects/<slug>/` prefix and the file existence under `public`, satisfies **AC-8**.
4. Add the new keys to `Messages` and to both dictionaries in `content/messages.ts`: `project.back`, `project.liveSite`, `project.source`, `project.private`, `project.stackLabel`, `project.part.problem`, `project.part.approach`, `project.part.built`, `project.part.outcome`, satisfies **AC-2**, **AC-4**, **AC-7**.
5. Create `app/[locale]/projects/[slug]/page.tsx` with `generateStaticParams`, `generateMetadata`, `notFound()`, the header, the cover, the four rows and the actions, satisfies **AC-1** to **AC-6**.
6. Add the back link above the header and after the case study, using `sectionHref(locale, "work")`, satisfies **AC-7**.
7. Check both locales, the unknown slug, the language switch, the metadata, 360px and keyboard focus, satisfies **AC-1**, **AC-5**, **AC-6**, **AC-7**, **AC-9**.
8. Run `npm run lint` and `npm run build`, satisfies **AC-10**.

## Consequences

**Positive**:

- Every project has a stable, shareable URL before the index ships, so each index row has a real destination.
- The cover becomes a typed, validated part of the content model, so a missing image stops the build instead of rendering a broken image.
- The page reuses the shell, `Container`, `Section`, `Grid`, `Panel`, `Tag` and `buttonVariants`, so it inherits the design language with no new visual system.
- The page is fully static and adds no client JavaScript, so it costs nothing to host and needs no runtime.

**Negative / tradeoffs**:

- The cover is required, so adding a project now means preparing an image, alt text in both languages, and two dimensions before the build passes.
- The page shows `outcome` as the fourth row, so `caseStudy.result` goes unused here. Two fields that say similar things now live side by side, and a future editor may update the wrong one.
- The scope says screenshots in the plural; this spec ships one cover. The scope wording needs reconciling.
- Only one project exists today, so the page cannot be checked against a second project. The `Projects: 2` metric also disagrees with the single project entry.
- The page owns metadata but not the share image or canonical URL, so sharing shows text only until the SEO feature adds `metadataBase`.

**Neutral**:

- The accessor surface grows by one field and one helper.
- The route adds a `projects` segment that the home page does not use.
- The header nav still points at home anchors from this page, so clicking Work leaves the case study for `/{locale}#work`.
- The order number comes from the array position, so reordering projects changes the numbers.

## Follow-up

- [ ] Reconcile the scope's "screenshots" wording with the single cover image in this spec at `/scope`.
- [ ] Decide whether `caseStudy.result` stays in the content model once `outcome` is the fourth row, or whether the two fields merge. This is a content model decision for a later spec.
- [ ] Add `metadataBase` and the cover as the share image when the production domain exists, in the SEO feature (spec 0003 follow up).
- [ ] The content says `Projects: 2` in `metrics` but `content/site.ts` holds one project. Settle the count with the owner. This feature does not change it.
- [ ] Add a second project to exercise the page with more than one entry, and decide then whether a next project link is wanted.
- [ ] Consider a project specific not found message with a link back to work if visitors report dead links. Today the locale not found page serves.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
