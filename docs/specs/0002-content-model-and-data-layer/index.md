# 0002. Adopt one typed content source and a read accessor layer

**Date**: 2026-10-29
**Status**: In Progress

## Summary

The site's real details move into one typed TypeScript file, read only through small accessor functions. A check at build time rejects blank or placeholder values, duplicate project slugs and broken links, so placeholder copy cannot ship. Adding a project is one entry in an array, and both the index and the detail page read it. The model stays English only for now, behind the accessors, so the language feature can swap the source later.

## Requirements

**User stories**:
- As the site owner, I want one typed file that holds my real details, so a new project is one entry and no screen hardcodes copy.
- As the site owner, I want the production build to stop on blank or placeholder content, so nothing fake ships.
- As the engineer building later features, I want accessor functions, so the language feature can change storage without touching screens.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: A single typed source (`content/site.ts`) exports the whole site content: profile, experience, projects, skills, metrics and social links. `docs/profile.md` stays the intake record, and the typed file is the runtime source.
- **AC-2**: Screens read content only through the named accessors in `@/lib/content`. No screen imports `content/site.ts` directly.
- **AC-3**: Adding one project entry to the array makes it appear in `getProjects()` in array order and reachable through `getProjectBySlug(slug)`, with no other code change.
- **AC-4**: `getProjectBySlug` returns `undefined` for an unknown slug. Feature 8 maps that to `notFound()`.
- **AC-5**: A production build fails when a required field is blank, a placeholder token is present, a project slug is duplicated or malformed, a URL cannot parse, or a required collection is empty. The failure names the exact field path.
- **AC-6**: In development, the same problems log to the console and the page still renders.
- **AC-7**: Experience dates are stored as `YYYY-MM`. `end: null` means the current role, and `getExperience()` returns roles newest first.
- **AC-8**: `getSkills()` exposes exactly three `top` entries, all present in `all`. Metrics keep their declared order. Every social link has a label, an absolute `http` or `https` URL and a supported icon key.
- **AC-9**: `getProfile().githubUsername` is the only source features 12 and 13 read for GitHub data.
- **AC-10**: The content file is seeded from `docs/profile.md` with no invented facts and no `None` strings, including the stored X and Instagram handle URLs and the supplied LinkedIn and repository URLs.

## Decision

**Chosen option**: Option 1: one typed TypeScript module, read through accessors, with hand written validation at build time.

`content/site.ts` holds the data as a typed `SiteContent` object. `lib/content` holds the types, the accessors and the validator. `assertContentValid()` runs from the root layout, so every production build checks the content and names the failing field path. Feature 4 can later replace the data source or add locales without changing screens, because screens only call the accessors.

## Feature design

**Data model sketch**:

`Profile` (one object)

| Field | Type | Required |
|---|---|---|
| `name`, `displayName`, `pronouns` | `string` | yes |
| `role`, `location`, `timezone` | `string` | yes |
| `headline`, `intro` | `string` | yes |
| `currentlyLooking`, `availabilityLine` | `string` | yes |
| `available` | `boolean` | yes |
| `experienceSummary`, `rememberLine` | `string` | yes |
| `email` | `string` | yes |
| `emailVisibility` | `"copy"` \| `"text"` | yes |
| `githubUsername` | `string` | yes |

`ExperienceRole` (array, at least one)

| Field | Type | Required |
|---|---|---|
| `company`, `title` | `string` | yes |
| `start` | `string` in `YYYY-MM` | yes |
| `end` | `string` in `YYYY-MM` or `null` (present) | yes |
| `summary` | `string` | yes |

`Project` (array, at least one)

| Field | Type | Required |
|---|---|---|
| `slug` | `string`, kebab case, unique | yes |
| `name`, `summary`, `role`, `outcome` | `string` | yes |
| `stack` | `string[]`, at least one | yes |
| `liveUrl`, `repoUrl` | `string` or `null`, at least one for a public project | yes |
| `private` | `boolean` | yes |
| `caseStudy.problem`, `.approach`, `.built`, `.result` | `string` | yes |

`Metric` (array, at least one): `value: string` and `label: string`. Declared order is display order.

`Skills` (one object): `top: string[]` with exactly three entries, `all: string[]` with at least three that contains every `top` entry.

`SocialLink` (array, at least one): `label: string`, `href: string` as an absolute URL, and `icon: "github" \| "x" \| "linkedin" \| "instagram"`.

`SiteContent` holds one `Profile`, one `Skills`, and the four arrays. There are no foreign keys and no database. Array order is display order, except experience, which the accessor sorts newest first.

**State transitions**: none. The content is static and read only.

**API surface**:

| Function | Inputs | Returns | Auth | Key errors |
|---|---|---|---|---|
| `getProfile()` | none | `Profile` | public | none |
| `getExperience()` | none | `ExperienceRole[]`, newest first | public | none |
| `getProjects()` | none | `Project[]` in array order | public | none |
| `getProjectBySlug(slug)` | `slug: string` | `Project \| undefined` | public | none; `undefined` for an unknown slug |
| `getSkills()` | none | `Skills` | public | none |
| `getMetrics()` | none | `Metric[]` | public | none |
| `getLinks()` | none | `SocialLink[]` | public | none |
| `assertContentValid()` | none | `void` | build and dev | throws in production; logs in development |

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Accessors | every personal value | `content/site.ts`, seeded from `docs/profile.md` |
| `getExperience` | current role flag | `end === null` |
| `getExperience` | role order | sorted by `start` descending |
| `getProjectBySlug` | lookup key | the unique `Project.slug` |
| `getLinks` | GitHub URL, X URL, Instagram URL | GitHub URL from the profile; X and Instagram built from the handles with each network's URL pattern |
| `getLinks` | LinkedIn URL | supplied by the engineer: `https://www.linkedin.com/in/danny-ng-33a16b3b4/` |
| Project seed | repository URL | supplied by the engineer: `https://github.com/DannyLurker/internal-management-system` |
| `getSkills` | top three and full list | the profile's "three to notice first" and full list |
| `getMetrics` | metric order | the profile's declared order |
| `getLinks` | icon | the fixed `icon` union, mapped to a lucide icon in the component |
| `assertContentValid` | mode | `process.env.NODE_ENV` |

**Key invariants**:
- One runtime source. Screens never import `content/site.ts`.
- Every required string is non-empty and free of placeholder tokens (`Lorem`, `TODO`, `TBD`, `Your Name`, `example.com`, `placeholder`, case insensitive).
- Project slugs match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and are unique.
- `skills.top` has exactly three entries, and every one appears in `skills.all`.
- At least one experience role, one project, one metric and one social link exists.
- At most one role has `end: null`.
- An experience `end` is not earlier than its `start`.
- Every URL is absolute with an `http` or `https` protocol.
- The email matches a simple address shape.
- Optional fields are absent or `null`, never the string `None`.

**Security model**: public read only static content. There is no authentication, no write path and no user data. The published email is deliberately included in the page payload for the copy button. No compliance scope applies.

**Configuration required**: none.

**Critical test scenarios** (each maps to an acceptance criterion):

- Happy path: `getProjects()` returns the one project, and `getProjectBySlug("internal-management-system")` returns it, verifies **AC-3** and **AC-8**.
- Unknown slug: `getProjectBySlug("missing")` returns `undefined`, verifies **AC-4**.
- Build failure: blank the headline or duplicate a slug, run `npm run build`, and the build stops naming `profile.headline` or `projects[1].slug`, verifies **AC-5**.
- Development failure: the same invalid value in `npm run dev` logs the field path and the page still renders, verifies **AC-6**.
- Real content: every seeded value matches `docs/profile.md`, and the stored links resolve, verifies **AC-1**, **AC-9** and **AC-10**.

## Build plan

Tracer Bullet: stand up the thinnest end to end thread first, one real value moving from the data file through an accessor into the running app, then thicken the model and the checks around it.

- [x] Create `lib/content/types.ts` with `SiteContent`, `Profile`, `ExperienceRole`, `Project`, `Metric`, `Skills` and `SocialLink`, including the date, visibility and icon unions, satisfies **AC-1**, **AC-7**, **AC-8**.
- [x] Create `content/site.ts` with the real seed from `docs/profile.md`, using the supplied LinkedIn and repository URLs and no `None` strings, satisfies **AC-1**, **AC-10**.
- [x] Create `lib/content/index.ts` with the seven accessors, including the newest first sort and `getProjectBySlug` returning `undefined`, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-7**, **AC-9**.
- [x] Prove the thread: read the profile through `getProfile()` in `app/layout.tsx` for the default title and description, so one real value reaches the running app, satisfies **AC-2**.
- [x] Create `lib/content/validate.ts` with the hand written checks and field path messages, satisfies **AC-5**, **AC-6**.
- [x] Call `assertContentValid()` from `app/layout.tsx` so every production build checks the content, satisfies **AC-5**, **AC-6**.
- [x] Run `npm run lint` and `npm run build`, then repeat the build with one invalid value to prove the failure path, satisfies **AC-5**.

## Consequences

**Positive**:
- Every fact has one runtime home, and a new project is one array entry.
- TypeScript catches shape mistakes at compile time, and the build check catches bad content before deploy.
- The accessor layer is the seam feature 4 needs for a second language.
- No new dependency and no database, in line with the frontend only scope.

**Negative / tradeoffs**:
- `docs/profile.md` and `content/site.ts` are two records of the same facts, so they can drift. The typed file is canonical; the profile is the intake worksheet.
- Validation is hand written and must be maintained as fields change. A schema library would give runtime parsing for external input that this static site does not have.
- Screens pay one import indirection for simple reads.
- A content typo can stop a deploy, which is the point, but it can also block an unrelated fix.
- The model is English only, so feature 4 still has to add locale storage and routing.

**Neutral**:
- Adds `content/` and `lib/content/` directories.
- The icon union is closed, so a new network needs a type update.
- GitHub data still arrives at build time in features 12 and 13; this slice only stores the username.

## Follow-up

- [ ] Confirm the case study copy and metric labels as seeded. They are taken verbatim from `docs/profile.md`, including the Indonesian second metric label and the `an 12th-grade` wording in the intro.
- [ ] Decide whether `docs/profile.md` stays the intake record or is retired once the typed file is canonical.
- [ ] Consider a lint rule that rejects a direct import of `content/site.ts` outside `lib/content`; the accessor rule is review enforced for now.
- [ ] Add a Content section to root `AGENTS.md` at the next `/sync`.

## Rationale

The reasoning and the options considered are in `rationale.md`.
