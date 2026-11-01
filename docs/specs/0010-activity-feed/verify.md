# Verify: Public GitHub activity feed · spec 0010 · updated 2026-11-01

_Steps derived from spec 0010 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open `/en` and `/id` and confirm the localized Recent activity heading appears after the contribution heatmap and before experience. Confirm the Indonesian heading is `Aktivitas terbaru`. → AC-1
- [x] Confirm each row shows the short repository name, branch, seven character SHA, first commit message line and localized relative time. Confirm there are no more than eight rows, they are newest first, and duplicate repository plus SHA pairs appear once. → AC-2
- [x] Open repository and commit links. Confirm each goes to the matching GitHub URL and has a clear accessible name. Tab through both links and confirm a visible focus indicator. → AC-2, AC-7
- [x] Confirm only `DannyLurker/internal-management-system` appears, tag pushes and commits GitHub does not attribute to `DannyLurker` are absent, and commit messages display as plain text. → AC-3, AC-7
- [x] With no eligible commits, confirm the activity section is omitted without an empty state. → AC-4
- [x] Temporarily build without `GITHUB_TOKEN`, then with an invalid token. Confirm both builds succeed, warn, and omit the whole activity section. → AC-5
- [x] Confirm a transient GitHub network or server failure is retried once, and a final failure warns and omits the whole section. → AC-5
- [x] Confirm a private allowlisted repository is excluded before commit comparisons are requested. → AC-3

## Commands

- [x] `npm run lint` → succeeds. → AC-8
- [x] `npm run build` → succeeds and prerenders both locale pages. → AC-1, AC-8
- [x] Inspect served HTML and client JavaScript for the configured GitHub token → token is absent. → AC-8

## Acceptance-criteria coverage

- AC-1 covered by locale and placement check · AC-2 by row content, order and links · AC-3 by public allowlist, branch, author and visibility checks · AC-4 by empty feed check · AC-5 by missing token and failure checks · AC-6 by stable relative time check across locales · AC-7 by list semantics, link names, focus and plain text checks · AC-8 by token boundary and command checks.
