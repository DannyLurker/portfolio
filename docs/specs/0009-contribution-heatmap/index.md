# 0009. Contribution heatmap from GitHub at build time

**Date**: 2026-11-01
**Status**: In Progress

**Code**: `lib/github/` (`heatmap.ts`, `contributions.ts`), `components/contribution-grid.tsx`, `components/layout/contribution-heatmap.tsx`, `app/[locale]/page.tsx`, `content/messages.ts`, `content/site.ts`, `lib/content/`, `lib/i18n/format.ts`, `.env.example`, `README.md`

## Summary

The home page gains a contribution section showing your real GitHub activity as a 52 week grid, read once a day from the GitHub GraphQL API with a token kept on the server. The grid uses the four blue heat levels from `DESIGN.md`, gives every day a hover and keyboard tooltip, and carries a written summary for screen readers. If GitHub cannot be read during a build, the section is left out and the build still succeeds, so the site never breaks because of a third party.

## Requirements

**User stories**:

- As a visitor, I want to see recent engineering activity as a year of squares so that I can judge how current your work is.
- As a keyboard or screen reader visitor, I want the grid to be reachable and understandable without a mouse so that the proof is available to me too.
- As the site owner, I want a build that never fails because GitHub is down or the token is missing so that a portfolio update cannot be blocked by someone else's service.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: The home page renders a contribution section between the project index and the experience section, in both locales, showing the section heading, the total line, a link to your GitHub profile and the 52 week grid inside the design's card.
- **AC-2**: The grid shows real counts from your GitHub account for the window ending today in your profile timezone: 52 Sunday aligned columns, the last counted day is today, and the sum of the day counts equals the number in the total line.
- **AC-3**: Each day paints with the heat ramp: level 0 only when the count is 0, levels 1 to 4 scale to your busiest day, and the busiest day paints level 4.
- **AC-4**: Hovering a day shows a tooltip with its localized date and count. A keyboard visitor reaches the grid in one Tab stop, moves with the arrow keys, jumps with Home and End, dismisses the tooltip with Escape, and the active cell stays visible while it moves.
- **AC-5**: Screen readers get one labelled figure and one summary sentence naming the total, the date range and the busiest day. Day cells are presentational, so nothing is announced 365 times.
- **AC-6**: On a phone the card scrolls sideways, cells keep their design size, the page itself never scrolls sideways, and keyboard movement keeps the active cell in view.
- **AC-7**: With no token, a rejected token, a network failure or a rate limit, the build succeeds, logs a warning naming the reason, and the section is simply absent. Nothing half rendered appears.
- **AC-8**: The read is cached: the served page does not call GitHub per request, and a cached reading older than 24 hours is fetched again.
- **AC-9**: A successful read where every day is zero still renders the card, with a zero total and localized empty copy.
- **AC-10**: The token never appears in client JavaScript, in the served HTML, or in any `NEXT_PUBLIC_` variable.
- **AC-11**: Month labels and weekday markers render localized in both languages, and `npm run lint` and `npm run build` both pass.

## Decision

**Chosen option**: Option 1: Read the contribution calendar through the GitHub GraphQL API at build time, with a token, and cache the result for one day.

The build reads `contributionCalendar` for the profile's GitHub login through `@octokit/graphql`, normalizes it to the shape in _Feature design_, paints it with the existing heat tokens, and catches every failure into "no section" rather than a failed build.

## Rationale

Reasoning and options: see `rationale.md`.

## Feature design

### Section layout

- The section sits after the project index and before experience, inside the existing `Section` rhythm, with `id="contributions"` as a deep link target. It gets no navigation entry, so the header and footer keep three items.
- Card: surface 1 background, structural border, 8px radius, 20px padding, matching the heatmap component in `DESIGN.md`.
- Grid: 52 columns of 7 slots, cells `11px` square, `3px` gap, `2px` radius. The component rule in `DESIGN.md` names 2px for micro elements while the radius table says 4px; the more specific component rule wins (decided here, do not re open it during the build).
- Colors come only from the `--heat-0` to `--heat-4` tokens already defined in `app/globals.css`. No new hardcoded hex values.
- Axis: localized short month names above the columns where the month changes, and three weekday markers on the left (the Sunday, Tuesday and Thursday rows, as GitHub does), localized through `Intl`.
- Header row: heading `Contribution activity`, the total line, and a mono `View on GitHub` link to `https://github.com/<login>`. In languages other than English the heading, total and link are translated.
- Tooltip: surface 2 background, its own border, `JetBrains Mono 12px`, showing the localized date on one line and the count on the next, anchored above the active cell and flipped when it would leave the viewport.

### Data model sketch

Confirmed with the engineer. Nothing is persisted; the build computes it.

| Entity             | Field        | Type                           | Notes                                                   |
| ------------------ | ------------ | ------------------------------ | ------------------------------------------------------- |
| `ContributionDay`  | `date`       | `string` `YYYY-MM-DD`          | Primary key, unique, in the profile timezone            |
|                    | `count`      | `number`, integer, `>= 0`      | All contributions that day                              |
| `ContributionWeek` | `startDate`  | `string` `YYYY-MM-DD`          | Sunday, primary key                                     |
|                    | `days`       | `(ContributionDay \| null)[7]` | Always seven slots; slots outside the window are `null` |
| `ContributionYear` | `weeks`      | `ContributionWeek[]`           | Exactly 52, oldest first                                |
|                    | `total`      | `number`                       | Sum of all day counts                                   |
|                    | `from`, `to` | `string`                       | First and last day of the window                        |
|                    | `maxCount`   | `number`                       | Busiest day, drives the levels                          |

Content model extension, decided in this spec: the profile gains `timezoneId` (an IANA identifier such as `Asia/Jakarta`) beside the existing human readable `timezone`. `docs/profile.md` gains a `Timezone ID` line, and the validator requires both. See spec 0002 for the surrounding shape.

### API surface

Internal functions only, no HTTP route is added.

| Function                                    | Kind                           | Key inputs                                  | Key outputs                | Auth               | Key errors                                                                               |
| ------------------------------------------- | ------------------------------ | ------------------------------------------- | -------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `getContributionYear()`                     | server read, cache entry point | none; reads the profile login and the token | `ContributionYear \| null` | server only, token | returns `null` on missing token, network failure, rate limit or unexpected payload shape |
| `readContributionYear()`                    | cached GitHub read (daily)     | none; reads the profile and the clock       | `{ ok: true; year } \| { ok: false; reason }` | token         | never throws; a failure is returned as data and is therefore cached for up to a day     |
| `readContributionDays(login, from, to)`     | internal transport             | login, ISO dates                            | flat day list from GitHub  | token              | throws after one retry, caught by `readContributionYear`                                 |
| `buildYear(days, window)`                   | pure                           | flat day list, window                       | `ContributionYear`         | none               | none                                                                                     |
| `levelFor(count, maxCount)`                 | pure                           | two numbers                                 | `0` to `4`                 | none               | `maxCount` of `0` returns `0`                                                            |
| `buildMonthLabels(weeks, locale)`           | pure                           | weeks, locale                               | label and column pairs     | none               | none                                                                                     |
| `formatDay(date, locale)`                   | format helper                  | ISO date, locale                            | localized date             | none               | none                                                                                     |

Window rules: `to` is today in `timezoneId`; the first column starts on the Sunday of the current week minus 51 weeks, so there are always 52 columns and the current week is last and partial. Days later than `to` are `null` slots. The GraphQL window is `from` to `to`.

Level rule: `maxCount === 0` gives every day `0`; otherwise `count === 0` gives `0` and any other day gives `Math.ceil((count / maxCount) * 4)`, clamped to `1` to `4`.

Caching: the GitHub read sits in a cached function (the `use cache` model in this Next version, with a cache life of one day). The clock is read inside that cached scope, because Cache Components rejects an unstable value such as `new Date()` during prerender outside a cache. `/develop` confirmed the directive and cache API in the bundled Next 16 docs.

Correction recorded during the build: the original plan cached only successful readings and handled failures outside the cache. That does not work under Cache Components. Next ends the build when a cached function rejects during prerender, even though the caller catches the rejection, so a bad token failed the build. The shipped shape returns the outcome as data instead: `readContributionYear()` never throws and resolves to `{ ok: true, year }` or `{ ok: false, reason }`, and `getContributionYear()` turns `ok: false` into a warning and `null`. The consequence is that a failure is now cached for up to a day rather than retried on the next request, which changes the trade rather than the visitor's experience: the section is missing either way, and the next cached refresh tries again.

### Value sourcing

| Action             | Value produced or displayed             | Source                                                                                |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------- |
| Compute the window | today                                   | profile `timezoneId`, read against the build clock                                    |
|                    | `from`, `to`                            | derived: Sunday of the current week minus 51 weeks, through today                     |
| Read GitHub        | per day counts                          | GitHub GraphQL `contributionCalendar`, through the login                              |
|                    | login                                   | `profile.githubUsername` from `content/site.ts`                                       |
|                    | token                                   | `GITHUB_TOKEN` from the build environment                                             |
| Build the grid     | `total`                                 | derived: sum of day counts, never a separate API field, so it always matches the grid |
|                    | `maxCount`                              | derived: largest day count                                                            |
|                    | level per day                           | derived: count and `maxCount` through the level rule                                  |
|                    | `null` slots                            | derived: days after `to` in the current week                                          |
| Labels             | month names                             | derived: column start dates, `Intl` with the route locale                             |
|                    | weekday markers                         | derived: `Intl` weekday names with the route locale                                   |
|                    | total line text                         | `heatmap.total` message with `{count}` substituted                                    |
|                    | summary sentence                        | `heatmap.summary` message with count, range and busiest day substituted               |
|                    | heading, profile link label, empty copy | `content/messages.ts`, both locales                                                   |
|                    | profile URL                             | derived: `https://github.com/` plus `profile.githubUsername`                          |
| Tooltip            | date and count                          | active day, formatted through `formatDay` and the count                               |

### Key invariants

- `total` equals the sum of every day count.
- Dates are unique, ascending and contiguous from `from` to `to`, with no day outside the window.
- `weeks` has exactly 52 entries, each Sunday aligned with seven slots, and the last week is the current partial week.
- A day is level `0` if and only if its count is `0`; a day with any count is at least level `1`; the busiest day is level `4`.
- A failed or missing read produces no section, never a partial grid.
- The token exists only in server code and in the build environment.

### Security model

- Everything rendered is public: contribution counts only, with no repository names, commit messages or other people's data.
- The token is a classic personal access token with `read:user`, read once at build time on the server, never sent to the browser, never prefixed with `NEXT_PUBLIC_`, never logged.
- Private contribution counts may appear as numbers when the profile setting allows them, which is the same visibility GitHub itself grants on a public profile.
- No user accounts, no input, no writes: there is no request time attack surface for this feature.

### Configuration required

- `GITHUB_TOKEN`: classic personal access token with `read:user`, set in `.env.local` for local builds and in the host environment for Vercel or the VPS. The build reads it on the server only.
- A committed `.env.example` carrying the variable name with an empty value, plus a `!.env.example` rule in `.gitignore`, which currently ignores every `.env*` file.

### Critical test scenarios

- Happy path: open `/en` and `/id`, the section appears between project index and experience with the real total, the grid, localized labels and the profile link, verifies **AC-1**, **AC-2**, **AC-3**, **AC-11**.
- Interaction: hover a day and read the tooltip, then Tab once into the grid, arrow across a week and down a column, press Home and End, press Escape, verifies **AC-4**.
- Accessibility: with a screen reader, the figure announces one name and one summary sentence, and Tab reaches the grid once, verifies **AC-5**.
- Small screen: at phone width the card scrolls sideways, the page does not, and arrow keys keep the active cell in view, verifies **AC-6**.
- Failure: build with the token removed and again with a bad token, the build succeeds, a warning names the reason, the section is absent, verifies **AC-7**.
- Staleness: a reading older than 24 hours is fetched again while served pages avoid GitHub calls, verifies **AC-8**.
- Empty year: point the window at a login with no activity, the card renders with a zero total and the empty copy, verifies **AC-9**.
- Secret boundary: search the built client output and the served HTML for the token value, verifies **AC-10**.

## Build plan

Tracer Bullet, the project default: stand up one thin thread from token to rendered grid first, then thicken it. Each task names the criteria it satisfies.

1. [x] Extend the content model with `timezoneId`: add it to `ProfileContent` in `lib/content/types.ts`, seed `Asia/Jakarta` in `content/site.ts`, require it in `lib/content/validate.ts`, and add the `Timezone ID` line to `docs/profile.md`, satisfies **AC-2**.
2. [x] Configure the source: install `@octokit/graphql`, add the committed `.env.example` and its `.gitignore` exception, and record the variable and the token type in the README, satisfies **AC-7**.
3. [x] Thin thread: add `lib/github/contributions.ts` with the GraphQL query, the normalization to `ContributionYear`, one retry, the daily cached read and the null on failure, and render a first grid on the home page between project index and experience, satisfies **AC-1**, **AC-2**, **AC-7**, **AC-8**.
4. [x] Add the pure shaping helpers in `lib/github/heatmap.ts`: the 52 week window rule, `buildWeeks` with `null` slots, `levelFor`, month labels and weekday markers, satisfies **AC-2**, **AC-3**, **AC-11**.
5. [x] Add the message keys in both locales plus the small `{count}`, `{from}`, `{to}` and `{max}` substitution, satisfies **AC-1**, **AC-5**, **AC-9**.
6. [x] Build the section presentation: card, axes, heat tokens, cell sizing, heading, total line and GitHub link, satisfies **AC-1**, **AC-3**, **AC-11**.
7. [x] Add the interactive grid: one Tab stop with arrow, Home, End and Escape handling, the tooltip, the horizontal scroll wrapper on small screens with the active cell kept in view, the labelled figure and the hidden summary, satisfies **AC-4**, **AC-5**, **AC-6**.
8. [x] Add the empty year state with the zero total and its own copy, satisfies **AC-9**.
9. [x] Prove the failure paths: build with no token and with a rejected token, and record the warning text, satisfies **AC-7**.
10. [x] Close the secret boundary and run the gate: inspect the client bundle and served HTML for the token, run `npm run lint` and `npm run build`, check both locales, satisfies **AC-10**, **AC-11**.

## Consequences

**Positive**:

- The design's most convincing proof element becomes real data, with no backend and no request time key.
- The page stays statically served, so the grid costs no visitor latency.
- One raise of the failure ceiling: GitHub being down can never block a deploy.
- `lib/github/` becomes the shared read layer the activity feed will reuse.

**Negative / tradeoffs**:

- A token to own, keep out of the repo and rotate if it leaks, and a personal access token is a real credential even with a narrow scope.
- The count depends on your GitHub profile's private contribution setting; if it is off, the total will look lower than you expect.
- Data can be up to a day old, and after a failed refresh an expired cache leaves the section missing until the next successful read.
- One more dependency, `@octokit/graphql`, and an external API shape that can change.
- The grid needs a small client component for keyboard and tooltip behaviour, so this section ships JavaScript that the rest of the page does not.
- On a phone the year is only readable by scrolling the card sideways.

**Neutral**:

- The content model grows one field, `timezoneId`, a small change to the shape spec 0002 settled.
- `.gitignore` gains one exception, and `.env.example` enters the repo.
- The section has an anchor but no navigation entry, so the shell is untouched.

## Follow-up

- [ ] Feature 13 (activity feed) reuses `lib/github/`; confirm the shared client shape there and keep its rules for what is public its own decision.
- [ ] GitHub Agent Skills and MCP servers were declined on 2026-11-01; do not offer them again.
- [ ] Check the private contribution setting on your GitHub profile before verifying AC-2, so the expected total is the one you want to show.
- [ ] Rotate the classic token if it is ever pasted into a chat, a log or a commit.
- [ ] If the site ever moves to a static export, daily refresh stops and the window freezes at build time; revisit this spec then.
