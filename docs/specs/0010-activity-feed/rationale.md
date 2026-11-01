# 0010. Public GitHub activity feed rationale

## Context

The portfolio has no database or backend. Its contribution heatmap already reads GitHub during the build with `GITHUB_TOKEN`, caches the result for a day and omits the section if the read fails. The activity feed should use the same server side boundary and leave page requests independent from GitHub availability.

The feed needs to show the owner's real public work. It must not disclose commits from an unselected repository, a repository that is now private, another contributor's commit, or a tag push. The existing portfolio lists one public repository, `DannyLurker/internal-management-system`.

The activity section is a home page proof element rather than a new destination. It needs a short list of links with localized time labels. The site already supports English and Indonesian and has a visual rule for commit cards and the vertical spine in `DESIGN.md`.

## Options considered

### Option 1: Public events plus commit comparison

Read the account's public events, retain approved public branch pushes, and use GitHub's compare endpoint to resolve commits between each push's before and head SHAs. Use `@octokit/rest` for the REST calls (basis: official GitHub events and commits API documentation; the existing server side GitHub data pattern in spec 0009).

**Pros**:
- The event tells the site that a public push happened and names its branch.
- A compare response supplies the individual commits needed for separate rows.
- One explicit allowlist can hide unapproved repos before their commit data is read.

**Cons**:
- The event API only returns up to 300 events from the last 30 days.
- Each eligible push requires another GitHub request, and current repository visibility needs a separate check.
- Octokit may need TypeScript compatibility work because the project uses Next's bundler module resolution.

### Option 2: List commits in each approved repository

Read the commit history for each allowlisted repository and filter by author. The REST endpoint exposes commit metadata directly (basis: official GitHub commits API documentation).

**Pros**:
- It provides commit messages, dates and links directly, with fewer translation steps.
- It avoids relying on the event history window.

**Cons**:
- It is branch oriented and does not identify which commits were in a public push across all branches.
- It would require more logic to enumerate branches and determine which commits became public.

### Option 3: Maintain the feed as site content

Add commit rows by hand alongside the rest of the portfolio content (basis: the existing typed content source in `content/site.ts`).

**Pros**:
- It needs no GitHub API request or credential.
- Every row is selected manually.

**Cons**:
- The feed goes stale unless it is updated by hand.
- SHA, message and date can drift from GitHub, weakening the feed as checkable proof.

## Rationale

Option 1 fits the stated job: a small feed of recent public pushes across branches. GitHub's event stream establishes public activity, while commit comparison provides individual rows. The allowlist plus a current visibility check makes the publication boundary explicit. A one day cache and the existing failure behavior keep a third party outage from blocking a portfolio build (basis: scope feature 13; spec 0009; official GitHub events and commits API documentation).

The 30 day and 300 event limit is acceptable for a feed of up to eight recent commits, but it is a real ceiling rather than a promise of a full history. The event path can require multiple calls, so the read stops when it has enough unique commits or has exhausted the bounded event pages.

The engineer chose `@octokit/rest` after the project TypeScript compatibility caveat was raised. The first build task therefore checks it against the current Next.js configuration. The SDK adds a dependency, but it provides typed endpoint helpers and handles standard GitHub request setup. No additional credential is needed; the existing server token is reused (basis: `AGENTS.md` stack; official Octokit client documentation).

## References

**Project sources**:

- `AGENTS.md`, Next.js 16, TypeScript and the tracer bullet build approach.
- Spec 0009, server side GitHub reads, daily cache and the rule that a GitHub failure cannot fail the build.
- `docs/scope/scope.md`, feature 13 and its privacy and empty state requirements.
- `DESIGN.md`, activity spine and commit card treatment.

**Practices & standards**:

- Least privilege through explicit allowlists and server only credentials.
- Fail soft for optional third party data in a portfolio build.

**Links**:

- [GitHub REST API events](https://docs.github.com/en/rest/activity/events), public events and their retention limits.
- [GitHub REST API commits](https://docs.github.com/en/rest/commits/commits), commit comparison response and commit fields.
- [Octokit REST client](https://github.com/octokit/rest.js), client setup and TypeScript module guidance.
