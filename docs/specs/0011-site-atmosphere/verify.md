# Verify: Site atmosphere and name intro · spec 0011 · updated 2026-11-01

_Steps derived from spec 0011 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open `/en` in a new tab. Confirm `Danny Ng` appears first with a fade up and soft blue glow, then the page appears after about two seconds. → AC-1, AC-2
- [x] Open a project URL directly in a new tab. Confirm the intro appears first and the same project URL remains open afterward. → AC-1
- [x] Activate `Skip intro` with mouse and keyboard, then try Escape. Confirm each dismisses immediately, focus moves to page content, and the focus indicator is visible. → AC-3
- [x] After skipping or waiting, refresh and navigate within the same tab. Confirm the intro does not replay. Open a new tab and confirm it can play again. → AC-3
- [x] Open `/id`. Confirm the skip label reads `Lewati intro` and the name remains `Danny Ng`. → AC-3, AC-7
- [x] View the home and project pages at desktop and phone widths. Confirm a few slow meteors and faint stars stay behind text, do not cover controls, and do not intercept clicks. → AC-4
- [x] Enable reduced motion. Confirm the intro is skipped, meteors stop, the still star field remains, and page content is available immediately. → AC-5
- [x] Block session storage and reload. Confirm the site content remains usable without a blocking intro. Disable JavaScript and confirm the intro does not cover the page. → AC-6

## Commands

- [x] `npm run lint` → exits successfully. Four existing warnings remain in unrelated files. → AC-7
- [x] `npm run build` → succeeds and prerenders English and Indonesian routes. → AC-7

## Acceptance-criteria coverage

- AC-1 covered by home and direct project route checks · AC-2 by the intro reveal and timing check · AC-3 by skip localization and tab session checks · AC-4 by visual and pointer checks · AC-5 by reduced motion check · AC-6 by storage and no JavaScript checks · AC-7 by locale and command checks.
