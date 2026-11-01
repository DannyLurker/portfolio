# 0012. SEO and share metadata

**Date**: 2026-11-01
**Status**: In Progress

## Summary

Every public page will have localized search details and a share card, with URLs based on `https://danny-dev.my.id`. Search engines will get language links, a sitemap, a robots file, and a Person record built from your existing profile. The project detail page keeps its current title and description source.

## Requirements

**User stories**:

- As a visitor, I want shared links to show the right page and language so I can recognize what I am opening.
- As a site owner, I want search engines to find the public pages and connect them to my portfolio identity.

**Acceptance criteria**:

- **AC-1**: The English and Indonesian home pages have localized titles and descriptions from the active locale's profile name, role, and headline. Project pages keep the project name and summary from the active locale, through the existing title template.
- **AC-2**: Each home and project page has an absolute canonical URL on `https://danny-dev.my.id` and alternate language URLs for `en`, `id`, and `x-default`. Each page points to itself as canonical. The `x-default` URL points to the English page. Project alternates preserve the same project slug.
- **AC-3**: Each home and project page has an Open Graph title, description, locale, site name, canonical URL, and localized 1200 by 630 image. X uses the same image with a large image card. The home card shows the localized profile name and role. A project card shows its localized cover, name, and summary. The image URL resolves for every generated locale route and project.
- **AC-4**: `/sitemap.xml` contains each localized home page and every localized project page, with canonical URLs and language alternates. It excludes the root redirect and `/styleguide`.
- **AC-5**: `/robots.txt` permits crawling of public routes and names the sitemap at `https://danny-dev.my.id/sitemap.xml`. The existing development only `/styleguide` page remains `noindex` and is never listed in the sitemap.
- **AC-6**: Each home page includes valid Person JSON-LD (structured data for search engines) using only the localized profile name, role, headline, canonical home URL, and existing public social links. It does not add an email, location, or other fact absent from those sources.
- **AC-7**: `siteContent.siteUrl` is the single source of the production origin. Content validation rejects a missing, malformed, non-HTTPS, or non-origin value before production output is generated.
- **AC-8**: The metadata and images work for direct visits to English and Indonesian home and project URLs. `/` continues to redirect to `/en` and is not emitted as a canonical page.

## Decision

**Chosen option**: Use the Next.js Metadata API and metadata file conventions for localized page metadata, generated Open Graph images, sitemap, and robots output. Configure the origin once as `siteContent.siteUrl` and `metadataBase`, reuse localized profile and project content, and add a Person JSON-LD record to each localized home page.

The Open Graph image route also supplies the X large image card. Home and project card layouts use the existing Obsidian colors and typography. The project card reads its local cover file with Node.js at build time, then embeds it in the generated image.

## Feature design

**Data model sketch**:

| Entity        | Field                | Type                      | Required | Rule                                                                                    |
| ------------- | -------------------- | ------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `SiteContent` | `siteUrl`            | `string`                  | yes      | Absolute HTTPS origin only, `https://danny-dev.my.id`, with no path, query, or fragment |
| `Profile`     | name, role, headline | existing localized fields | yes      | Source for home metadata and home card                                                  |
| `Project`     | name, summary, cover | existing localized fields | yes      | Source for project metadata and project card                                            |
| `SiteContent` | `links`              | existing social link list | yes      | Public links with valid absolute URLs; source for Person `sameAs`                       |

No database or persistent state is added. `siteContent.siteUrl` is the only new content field.

**State transitions**: None. Metadata and images are generated from static content.

**API surface**:

| Surface                                            | Inputs                                               | Output                                                                        | Access                              | Errors                                                                          |
| -------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- |
| `generateMetadata` for `/{locale}`                 | route locale, localized profile, `siteUrl`           | title, description, canonical, alternates, Open Graph, X card                 | public, build time                  | invalid locale follows existing locale handling                                 |
| `generateMetadata` for `/{locale}/projects/{slug}` | locale, slug, localized project, `siteUrl`           | existing title and description plus canonical, alternates, Open Graph, X card | public, build time                  | unknown slug follows existing not found handling                                |
| `/{locale}/opengraph-image`                        | locale and profile content                           | generated home card, 1200 by 630                                              | public, build time                  | invalid locale follows existing locale handling                                 |
| `/{locale}/projects/{slug}/opengraph-image`        | locale, slug, localized project and local cover file | generated project card, 1200 by 630                                           | public, build time, Node.js runtime | unknown slug follows existing not found handling; missing cover fails the build |
| `/sitemap.xml`                                     | locales and project slugs                            | localized public page URLs with language alternates                           | public, build time                  | content validation fails the build for invalid site origin                      |
| `/robots.txt`                                      | `siteUrl`                                            | crawl policy and absolute sitemap URL                                         | public, build time                  | content validation fails the build for invalid site origin                      |

**Value sourcing**:

| Action                                | Value produced or displayed                     | Source                                                                        |
| ------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Set the production URL base           | origin                                          | `siteContent.siteUrl`                                                         |
| Render home title                     | localized name and role                         | `getProfile(locale)` and existing title template                              |
| Render home description and card copy | localized headline, name, and role              | `getProfile(locale)`                                                          |
| Render project title and description  | localized project name and summary              | existing project `generateMetadata` using `getProjectBySlug(locale, slug)`    |
| Build canonical page URL              | locale and route pathname                       | route params joined to `siteContent.siteUrl`                                  |
| Build language alternates             | same route in `en` and `id`                     | supported `locales`; project slug from route and `getProjectSlugs()`          |
| Build the `x-default` URL             | English route                                   | `defaultLocale`                                                               |
| Build home card image                 | localized name and role                         | `getProfile(locale)`                                                          |
| Build project card image              | localized cover, name, and summary              | `getProjectBySlug(locale, slug)`                                              |
| Build Open Graph locale               | locale tag                                      | fixed mapping `en` to `en_US`, `id` to `id_ID`                                |
| Build Person JSON-LD                  | name, job title, description, URL, social links | localized `getProfile(locale)`, canonical home URL, and existing `getLinks()` |
| Build sitemap                         | public URLs and language alternates             | `locales`, `getProjectSlugs()`, and `siteContent.siteUrl`                     |
| Build robots sitemap reference        | absolute sitemap URL                            | `siteContent.siteUrl` plus `/sitemap.xml`                                     |

**Key invariants**:

- All page URLs use the one validated `siteContent.siteUrl` origin.
- Localized routes have self canonicals and reciprocal language alternates. English is the `x-default` route.
- Titles and descriptions reuse published content. No duplicate SEO copy or invented personal facts are added.
- The generated image dimensions are 1200 by 630. Image text follows the route locale.
- Every project image uses its local cover file. No remote image host or new package is introduced.
- Generated project cards read local files with Node.js and embed image bytes. They do not fetch the public site during the build.
- Only localized home pages receive Person JSON-LD. Its values come from the profile, canonical URL, and public social links.
- JSON-LD is serialized with `<` escaped before it is placed in a script element.
- The root redirect and `/styleguide` are not sitemap entries. `/styleguide` retains its current `noindex` metadata.

**Security model**: All routes and metadata are public and read only. JSON-LD contains only details already published in the portfolio. There are no secrets or user supplied values.

**Configuration required**: Add `siteUrl: "https://danny-dev.my.id"` to `siteContent` and validate that it is an HTTPS origin.

**Critical test scenarios**:

- Open `/en` and `/id`, inspect the document head and generated image, confirm localized title, description, canonical, alternates, social card and Person data. Verifies **AC-1**, **AC-2**, **AC-3**, **AC-6**, **AC-8**.
- Open the project URL in both locales and inspect the head and image. Confirm project name and summary, same slug in alternates, localized card text, local cover, and X image reuse. Verifies **AC-1**, **AC-2**, **AC-3**, **AC-8**.
- Read `/sitemap.xml` and `/robots.txt`. Confirm all localized home and project URLs, alternates, origin, and exclusions. Verifies **AC-4**, **AC-5**.
- Temporarily remove or corrupt `siteContent.siteUrl` and run a production build. Confirm validation stops output with a useful field path, then restore the valid origin. Verifies **AC-7**.
- Open `/` and `/styleguide`. Confirm the redirect remains `/en`, the redirect is absent from the sitemap, and the style guide stays `noindex` and absent from the sitemap. Verifies **AC-4**, **AC-5**, **AC-8**.

## Build plan

Tracer Bullet: establish the shared origin and metadata helpers first, then connect the route images and discovery files to the same content source.

1. [x] Add and validate `siteContent.siteUrl`; expose the origin to metadata and route generation, satisfies **AC-7**, **AC-8**.
2. [x] Extend home and project metadata with canonical URLs, reciprocal locale alternates, Open Graph fields and X large image cards while preserving existing localized titles and descriptions, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-8**.
3. [x] Generate the home and project image routes from the chosen localized layouts and existing local project covers, satisfies **AC-3**.
4. [x] Add Person JSON-LD on localized home pages from profile and link content, satisfies **AC-6**.
5. [x] Add sitemap and robots metadata routes, excluding redirect and development style guide routes, satisfies **AC-4**, **AC-5**.
6. Verify generated metadata, images, sitemap, robots, invalid origin behavior, direct locale routes, lint, and production build, satisfies **AC-1** to **AC-8**.

## Consequences

**Positive**:

- All public pages share one origin and consistent language metadata.
- Existing project copy and cover files drive their previews without a new content system.
- Search engines can discover localized routes and associate the home page with existing public profiles.

**Negative / tradeoffs**:

- Generated images must load and render correctly during static generation. A missing project cover fails its card build, so build verification must cover each project.
- Social card rendering introduces route image code that has framework specific constraints and should stay within the installed Next.js 16 conventions.
- `siteContent.siteUrl` is a production origin in content, so changing domains requires updating and validating that field.

**Neutral**:

- No package, runtime service, database, or secret is added.
- The homepage has one Person record per locale, with localized text and URLs.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
