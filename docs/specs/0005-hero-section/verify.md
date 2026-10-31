# Verify: Hero section · spec 0005 · updated 2026-10-31

_Steps derived from spec 0005 requirements. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open `/en`: the status pill shows the availability line with a blue dot that pings, then the location and timezone line, the role eyebrow, `Danny Ng` as the only `h1`, the headline, the intro and a `Get in touch` button. → content source, both languages
- [x] Open `/id`: the same elements show the Indonesian role, availability line, headline, intro and `Hubungi saya`; the name stays `Danny Ng`. → both languages
- [x] Activate `Get in touch` or `Hubungi saya`: the page moves to the contact section (`#contact`) with the heading clear of the sticky header. → primary action
- [x] Tab from the top to the hero button: a 2px blue focus ring is visible and the button is reachable in reading order. → keyboard and focus
- [x] Turn on reduce motion and reload `/en`: the status dot stays static, with no ping loop. → reduced motion
- [x] At 360px wide: the status row wraps, there is no horizontal scrollbar, the hero text stays readable and the button is at least 44px tall. → responsive
- [x] Edit `content/site.ts` (for example `profile.headline`) and reload: the hero shows the edited value with no component edit; restore it. → content source
- [x] Confirm `content/messages.ts` holds the only hero copy (`hero.action`), so no personal detail is invented. → no invented detail

## Commands

- [x] `npm run lint` → 0 errors (one pre existing warning in `components/layout/site-nav.tsx`) → build gate
- [x] `npm run build` → succeeds and `/en` and `/id` prerender as static routes → both languages

## Acceptance-criteria coverage

- **AC-1** content source in both languages: steps 1, 2, 7.
- **AC-2** one `h1`, the name, naming the section: steps 1, 2.
- **AC-3** one primary action with the localized label to `#contact`: steps 1, 2, 3, 8.
- **AC-4** the ping and reduced motion: steps 1, 5.
- **AC-5** the location and timezone line, separator hidden from assistive tech: step 1.
- **AC-6** narrow viewport and keyboard focus: steps 4, 6.
- **AC-7** primitives, tokens and the glow: steps 1, 8.
- **AC-8** lint and build: the Commands section.
