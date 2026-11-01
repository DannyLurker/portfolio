# 0009. Contribution heatmap from GitHub at build time

## Context

The portfolio is a statically served Next.js site with no backend, no database and no accounts. Its content comes from one typed source, and everything it publishes is your own material, so the site has no anonymous writes and no request time secret.

The design in `DESIGN.md` names a GitHub contribution heatmap as a component, down to cell size, gap, ramp and tooltip treatment. It is the one element on the page that claims something about how you work rather than describing it. A grid of invented or sample squares would be worse than no grid, because a visitor who checks your GitHub profile would find a different picture.

The site is built on Vercel or a VPS, both of which can hold a build secret, and the GitHub GraphQL API exposes a contribution calendar for any public login when the caller is authenticated. The alternatives either produce a different number than GitHub shows, or reach into a page that GitHub does not promise to keep stable.

Two forces shape the rest. First, a portfolio build must never fail because a third party is down, so the read has to degrade to a missing section rather than a broken deploy. Second, the window must end on your local day, which is why the profile needs a machine readable timezone rather than only its display text.

## Options considered

### Option 1: GitHub GraphQL API with a token

A build time read of `user.contributionsCollection.contributionCalendar` through `@octokit/graphql`, authenticated with a classic personal access token carrying `read:user`. It returns one entry per day with a contribution count, plus the calendar total.

**Pros**:
- The same per day counts and the same total as your public profile, private work included when your profile setting allows it.
- A documented, structured payload, so parsing is typed work rather than string matching.
- One request covers the whole year, and `@octokit/graphql` handles auth, user agent and error shapes.

**Cons**:
- The build now needs a credential, with the care that implies.
- Private counts depend on a profile setting, so the number can be lower than expected until it is turned on.

### Option 2: Parse the public contributions page

Fetch `https://github.com/<login>` and read the contribution cells out of the HTML.

**Pros**:
- No token and no API credential to own.

**Cons**:
- It reads markup GitHub never promised to keep, so the section breaks silently on a redesign.
- Against the acceptable use expectations of the site being read, and fragile in a way that only shows up on a build.

### Option 3: GitHub REST events API

Read `/users/<login>/events/public` and count pushes.

**Pros**:
- Public, unauthenticated and well understood.

**Cons**:
- Only the last 90 days and at most 300 events, so a year cannot be built from it.
- It is not a contribution count at all, so the grid would show a different story from your profile.

### Option 4: A third party contributions API

Send the login to a community service that mirrors contribution graphs.

**Pros**:
- No credential, and the response is already shaped like a grid.

**Cons**:
- The portfolio's proof now depends on a stranger's uptime, rate limits and continued interest.
- It is still a party reading GitHub on your behalf, so the freshness problem is only moved.

## Rationale

Only Option 1 answers the question the design asks. The heatmap exists to be checkable, and the other three either show a different number (Options 3 and 4 can lag or truncate) or break without warning (Option 2). The cost of Option 1 is one narrow credential held by the build, which is smaller than the cost of publishing a grid a recruiter can contradict.

The token type is classic with `read:user` rather than fine grained, because fine grained tokens do not carry the private contribution counts that make the total match your profile. This is a deliberate trade, recorded here so a later security review does not "fix" it into a lower number.

`@octokit/graphql` was chosen over a plain `fetch` with a typed query. A single query a day makes either work, but the official client keeps authentication, user agent and rate limit error shapes in one maintained place, and this code will be reused by the activity feed. The plain `fetch` approach was the runner up, and remains reasonable if the dependency ever becomes a burden.

The read is cached for a day and the page is static. The cached function returns the outcome as data rather than throwing: Cache Components ends a build when a cached function rejects during prerender, even when the caller catches it, so a rejected token would have failed the deploy it was meant to survive. The cost is that a failure is remembered for one cache lifetime instead of retried immediately; the visitor sees the same thing either way, a page without the section, and the next refresh tries again. Caching only until the next deploy was the runner up, and it loses because a grid that freezes for weeks undercuts the point of the section.

The clock is read inside the cached function for the same family of reasons. Cache Components treats `new Date()` during prerender as an unstable value and rejects it outside a cache scope, so the window is computed, fetched and cached together.

The grid is a small client component while the read and shaping stay on the server. A tooltip and a roving keyboard cursor need state, and the alternative, tab stops on 365 cells, is worse for the visitor. Presenting the grid to screen readers as one labelled figure with a summary sentence, rather than 365 announced cells, follows from the same reasoning.

Two smaller calls are recorded rather than left to the build. The cell radius follows the heatmap component rule in `DESIGN.md` (2px) over the general micro element radius table (4px), because the component rule is the more specific statement. The displayed total is the sum of the day counts rather than the API's separate total field, so the number under the heading can never disagree with the squares above it.
