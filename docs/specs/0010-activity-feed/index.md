# 0010. Public GitHub activity feed

**Date**: 2026-11-01  
**Status**: In Progress

**Code**: `content/site.ts`, `lib/content/types.ts`, `lib/content/validate.ts`, `lib/github/`, `components/layout/`, `app/[locale]/page.tsx`, `content/messages.ts`

## Summary

The home page will show up to eight recent commits from a repository you explicitly approve. It will include only public commits GitHub attributes to your account, and hide a repository as soon as it becomes private. GitHub is read during the build and cached for a day, so visitors do not make GitHub requests.

## Requirements

**User stories**:

- As a visitor, I want to see recent public commits so I can tell the portfolio owner is actively building.
- As the site owner, I want to choose which repositories appear so work from other repositories stays private.
- As a visitor using a keyboard or screen reader, I want to read and open each commit without relying on a mouse.

**Acceptance criteria**:

- **AC-1**: The home page shows a localized Recent activity section after the contribution heatmap and before experience on `/en` and `/id`. Its rows use the activity spine and card treatment in `DESIGN.md`.
- **AC-2**: The feed shows up to eight unique commits, newest committer date first, from public branch push events within the last 30 days and the most recent 300 events GitHub returns. Each row shows the repository name, branch, seven character short SHA, first line of the commit message, and localized relative time. The repository name links to the repository and the short SHA links to the commit. Fewer than eight rows are valid when fewer eligible commits are available.
- **AC-3**: A commit is eligible only when its event is public, its repository is in the explicit allowlist, its branch is a branch rather than a tag, the repository is public at read time, and GitHub associates the commit with `profile.githubUsername`. A repository that has become private is excluded before its commit details are read.
- **AC-4**: If there are no eligible commits, the activity section is omitted without an empty state.
- **AC-5**: A missing token, network or GitHub API error, rate limit, or invalid response logs a warning, omits the whole section, and does not fail the build or expose a partial feed. A transient network or server error is retried once.
- **AC-6**: The feed data is read on the server and cached for one day. Each cache snapshot includes `asOf`, and relative time is calculated from that timestamp so the rendered value is stable in both locales.
- **AC-7**: The section uses a semantic ordered list. Repository and commit links have clear accessible names, keyboard users can focus them with visible focus styling, and commit messages render as plain text.
- **AC-8**: The GitHub token is never included in client JavaScript or served HTML. `npm run lint` and `npm run build` pass, including the Octokit compatibility check against the existing Next.js TypeScript settings.

## Decision

**Chosen option**: Option 1, read public user push events and resolve their commit ranges with the GitHub REST API (basis: scope feature 13; GitHub events and commits API documentation).

Use `@octokit/rest` with the existing server only `GITHUB_TOKEN`. Keep an explicit repository allowlist in site content, initially containing only `DannyLurker/internal-management-system`. Check that an allowlisted repository is public before reading commit details. Verify Octokit works with the project's current `moduleResolution: "bundler"` setting before building the integration; the engineer chose to keep Octokit and check compatibility during the build.

## Feature design

### Section

- Add the section after the contribution heatmap and before experience. Use `id="activity"` and no navigation item.
- Localized heading: `Recent activity` in English and `Aktivitas terbaru` in Indonesian.
- Use the vertical spine, node bullets, bordered commit cards, branch tag, monospace short SHA, concise message and muted timestamp from `DESIGN.md`.
- Show up to eight rows in a semantic ordered list. Render the first message line only. Keep repository names and commit messages in their original GitHub language.
- Show the short repository name as a link. Include the full owner and repository name in its accessible name. Link the short SHA to the commit. Use native anchors and visible focus states.
- Source the accessible link names from localized `activity.repositoryLink` (`Open {repository} on GitHub` and `Buka {repository} di GitHub`) and `activity.commitLink` (`View commit {sha} on GitHub` and `Lihat komit {sha} di GitHub`).
- Use localized relative time from `Intl.RelativeTimeFormat` for `en-US` and `id-ID`. Give each timestamp a machine readable `datetime` value.
- Omit the whole section when the read succeeds but has no eligible commits.

### Data model sketch

Nothing is persisted. The server returns one snapshot to the page.

| Shape | Field | Type | Rule |
| --- | --- | --- | --- |
| `ActivityFeedSnapshot` | `asOf` | ISO timestamp string, required | Captured inside the daily cache. |
|  | `commits` | `ActivityCommit[]`, required | Zero to eight entries, sorted newest first. |
| `ActivityCommit` | `repository` | `owner/repo` string, required | Must be in the allowlist and public at read time. |
|  | `repositoryUrl` | URL string, required | Public GitHub repository URL. |
|  | `branch` | string, required | Derived from a `refs/heads/` push event. |
|  | `sha` | full SHA string, required | Unique with `repository`. |
|  | `shortSha` | string, derived | First seven characters of `sha`; not stored separately. |
|  | `commitUrl` | URL string, required | GitHub HTML URL for the commit. |
|  | `message` | string, required | First line of the GitHub commit message. |
|  | `committerDate` | ISO timestamp string, required | Source date for ordering and relative time. |

One snapshot contains zero to eight commit records. A record is unique by `(repository, sha)`. There is no database, foreign key, or lifecycle state.

### API surface

All calls happen at build or server render time. There is no visitor facing API route.

| Endpoint or function | Method | Key inputs | Key outputs | Auth | Key errors |
| --- | --- | --- | --- | --- | --- |
| `getActivityFeed()` | Internal server read | None; reads username, allowlist and `GITHUB_TOKEN` | `ActivityFeedSnapshot \| null` | Server only | Missing token; GitHub failure; invalid response |
| `/users/{username}/events/public` | `GET` | `username`; `per_page=100`; `page` | Public events, including push ref, before SHA, head SHA and event time | Existing `GITHUB_TOKEN` | 401 or 403; rate limit; network or 5xx |
| `/repos/{owner}/{repo}` | `GET` | Allowlisted owner and repo | Current repository visibility | Existing `GITHUB_TOKEN` | Not found; rate limit; network or 5xx |
| `/repos/{owner}/{repo}/compare/{before}...{head}` | `GET` | Repository; push before and head SHAs | Commits with author association, commit message, committer date, SHA and HTML URL | Existing `GITHUB_TOKEN` | Invalid comparison; rate limit; network or 5xx |

The public events endpoint can return at most 300 events from the last 30 days. Request up to three pages of 100 so sorting by commit date uses the full available candidate window. For each public branch push in an allowlisted repository, check current visibility and resolve the commit range through the compare endpoint. The GitHub compare response can contain up to 250 commits for one push. Deduplicate all eligible records, sort by committer date and take eight.

### Value sourcing

| Action | Value produced or displayed | Source |
| --- | --- | --- |
| Select public activity | Username | `siteContent.profile.githubUsername` |
| Select eligible repositories | Allowlist | `siteContent.activityRepositories`, initially `DannyLurker/internal-management-system` |
| Check privacy | Current public state | Repository response `private === false`; a private repository is skipped before commit detail reads |
| Select branches | Branch | Push event `payload.ref`, only values beginning `refs/heads/` |
| Resolve commits | Commit author identity | Compare response `author.login`, equal to `profile.githubUsername` without case sensitivity |
| Resolve commits | Full SHA, URL, first message line, committer date | Compare response commit fields |
| Order and limit | Up to eight unique records | Deduplicate by `repository + sha`, sort by `committerDate` descending, take first eight |
| Render short hash | Seven character SHA | First seven characters of full `sha` |
| Render repository | Short label and accessible full name | `repository` split into owner and repo; visible label is repo, accessible label includes both |
| Render relative time | Localized relative time | `committerDate` compared with snapshot `asOf`, formatted for the current locale |
| Render section | Heading | `content/messages.ts`, English `Recent activity`, Indonesian `Aktivitas terbaru` |
| Label links | Accessible repository and commit link names | Localized `activity.repositoryLink` and `activity.commitLink` message templates |
| Render links | Repository and commit URLs | GitHub response `html_url` values |
| Authenticate reads | Token | Existing `GITHUB_TOKEN`; never sent to the browser |

### Key invariants

- No commit detail is requested for a repo outside the allowlist or a repository that is private at read time.
- Only public branch push events can contribute rows. Tag pushes and other event kinds are ignored.
- A feed row must have a GitHub author association matching the configured account. Commits with no associated GitHub account are excluded.
- A repository and SHA pair appears at most once.
- Successful empty results return an empty list; read failures return no snapshot and warn. Neither case breaks the build.
- The `asOf` time and fetched records belong to one cache snapshot. The rendering code does not read the live clock outside the cache.

### Security model

Visitors can read the rendered public commit data. Only the build or server process reads GitHub. The GitHub token stays server side. The explicit allowlist, public event flag and current repository visibility check jointly limit publication. The feature has no visitor input, account, write path or regulated data.

### Configuration required

- `GITHUB_TOKEN`: reuse the existing build secret. No new secret or public environment variable is added.
- `siteContent.activityRepositories`: an explicit list of owner and repository names, validated for shape and duplicates. It starts with `DannyLurker/internal-management-system`.
- `@octokit/rest`: add the GitHub REST client. Its compatibility with current TypeScript and Next.js settings is checked before implementing the feed reader.

### Critical test scenarios

- Happy path: approved public pushes across branches produce up to eight newest unique commits in both locales, verifies **AC-1**, **AC-2**, **AC-3**, **AC-6**.
- Privacy: unlisted and currently private repos never produce rows or commit detail requests, verifies **AC-3**.
- Empty result: no eligible pushes leaves no activity section, verifies **AC-4**.
- Failure: missing token, rejected token, rate limit, malformed payload and unavailable GitHub leave the build successful, log a warning and omit the section, verifies **AC-5**.
- Accessibility: keyboard and screen reader visitors can identify the ordered list and follow both links, verifies **AC-7**.
- Secret boundary and build gate: search served HTML and client assets for the token, run lint and build, and check `@octokit/rest` with the existing TypeScript configuration, verifies **AC-8**.

## Build plan

Tracer Bullet: create one thin path from the GitHub read to both localized pages, then complete privacy, failure and accessibility rules.

1. [x] Add the allowlist to the site content model and validator, add the `ActivityFeedSnapshot` and `ActivityCommit` types, and check `@octokit/rest` against the existing Next.js TypeScript settings. Satisfies **AC-2**, **AC-3**, **AC-8**.
2. [x] Build the server read for public push events, current repository visibility and commit comparisons, then render one commit in the activity section between heatmap and experience. Satisfies **AC-1**, **AC-2**, **AC-3**.
3. [x] Complete event pagination, author and branch filters, deduplication, sorting, eight item limit, `asOf`, daily cache, retry and graceful failure behavior. Satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**.
4. [x] Add localized messages and relative time formatting, then finish the spine cards, links, responsive layout, semantic list and keyboard focus states. Satisfies **AC-1**, **AC-6**, **AC-7**.
5. [x] Check both locales, empty and failure paths, privacy filters, token boundary, lint and production build. Satisfies **AC-3**, **AC-4**, **AC-5**, **AC-8**.

## Consequences

**Positive**:

- The portfolio shows checkable recent work without a database or request time GitHub call.
- You control publication through a small allowlist, and a repository becoming private is hidden automatically.
- The site can still build when GitHub is unavailable.

**Negative / tradeoffs**:

- GitHub's public event history only reaches 30 days and 300 events, so older work cannot enter the feed through this source.
- A single push comparison can return at most 250 commits, so an unusually large push may not expose every commit in its range.
- Each eligible push needs a commit comparison request. A busy account can use more API calls, though the daily cache and 300 event ceiling bound the read.
- `@octokit/rest` adds a dependency, and its TypeScript module resolution guidance may need a compatibility adjustment.
- Relative time can be nearly a day old, and the feed can be absent for a day after a cached read failure.

**Neutral**:

- The site content model gains one allowlist field. There is no schema migration or navigation change.
- Commit messages remain in the language written by their author. The surrounding labels and relative time are localized.

## Follow-up

- [ ] Agent Skill and MCP discovery for `@octokit/rest` was declined on 2026-11-01. Do not offer it again.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
