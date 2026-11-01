# Verify: contribution heatmap · spec 0009 · updated 2026-11-01

_Steps derived from spec 0009 acceptance criteria and value sourcing. `/check verify` runs these; `/test` locks the durable ones. Boxes are unchecked because `/check verify` has not run yet._

Run everything against a build made with a real `GITHUB_TOKEN` in `.env.local`, then repeat the failure steps without one.

## UI / manual

- [x] Open `/en`. Confirm a Contribution section sits between the project index and experience, has the `contributions` anchor, shows the heading, the total line, the `View on GitHub` link and the 52 week grid inside the card. **AC-1**
- [x] Open `/id`. Confirm the same placement with `Aktivitas kontribusi`, `Lihat di GitHub`, the Indonesian total line and the Indonesian summary. **AC-1**, **AC-11**
- [x] Compare the total line against the grid: count the cells, confirm 52 columns of seven slots, that only the days after today in the current week are blank slots, and that the number equals the sum you get by opening your GitHub profile for the same range. **AC-2**
- [x] Confirm the last painted cell is today, the first column starts on a Sunday, and the window is 52 weeks wide. **AC-2**
- [x] Find the busiest day. Confirm it paints the strongest blue and that a day with no contributions paints the empty token, with every other day sitting between them in the four step ramp. **AC-3**
- [x] Hover several days. Confirm the tooltip shows the localized date and the count, above the cell, and flips below near the top of the card. **AC-4**
- [x] Press Tab until focus reaches the grid. Confirm it takes one stop, an active cell appears, arrows move across weeks and within a week, Home jumps to the first day, End jumps to the last day, and Escape hides the tooltip. Confirm the active cell stays visible while it moves. **AC-4**
- [x] With a screen reader, reach the grid. Confirm it announces one group name and reads the summary sentence with the total, the date range and the busiest day, without announcing individual days. **AC-5**
- [x] At 360px width, scroll the card sideways and confirm the cells keep their size, the page itself never scrolls sideways, and arrow keys keep the active cell in view. **AC-6**
- [x] Confirm the card appears with `0 contributions in the last year` and the empty copy when the read returns a year of zeros. Temporarily stub the read to return zero counts, build, and inspect. **AC-9**
- [x] Confirm the GitHub link opens `https://github.com/<login>` in a new tab with `rel="noreferrer"`. **AC-1**

## Failure paths

- [x] Remove `.env.local` and run `npm run build`. Confirm the build succeeds, logs `[contribution heatmap] left out of the page, GITHUB_TOKEN is not set`, and both locales render without the section. **AC-7**
- [x] Put a rejected token in `.env.local` and build again. Confirm the build succeeds, logs `[contribution heatmap] left out of the page, GitHub read failed:` with the reason, and the section is absent. **AC-7**
- [x] Block network access to `api.github.com` with a valid token and build. Confirm the build succeeds, logs the same warning with a network reason, and the section is absent. **AC-7**

## Cache and secret boundary

- [x] Serve the built site with `npm run start`, reload `/en` several times, and confirm the served page is static and GitHub is not called per request. Confirm the read carries a one day cache life in `lib/github/contributions.ts`. **AC-8**
- [x] Search the built output and the served HTML for the token value. Confirm no file under `.next/` contains it and no `NEXT_PUBLIC_` variable carries it. **AC-10**

## Commands

- [x] `npm run lint` reports no errors and no new warnings from the files this feature adds. **AC-11**
- [x] `npm run build` completes, prerenders `/en` and `/id`, and prints the heatmap warning only on the failure runs. **AC-7**, **AC-11**

## Value sourcing

Each row from the spec either gets displayed or is derived. Confirm these:

- [x] Today is read in `profile.timezoneId`, not the machine clock's zone. Build just before and after midnight in Jakarta and confirm the window moves by one day. **AC-2**
- [x] `from` and `to` come from the Sunday aligned 51 week rule and today, and match the dates in the summary sentence. **AC-2**
- [x] Per day counts come from the GraphQL `contributionCalendar` and match your profile for the same range. **AC-2**
- [x] The login comes from `profile.githubUsername` in `content/site.ts`, and changing it changes the grid and the link. **AC-1**, **AC-2**
- [x] The token comes from `GITHUB_TOKEN` only, and no other variable can stand in for it. **AC-10**
- [x] `total` is the sum of the day counts, so the number under the heading always matches the squares. **AC-2**
- [x] `maxCount` is the largest single day, and the busiest cell is level 4. **AC-3**
- [x] Levels come from the count and `maxCount` through the level rule, with level 0 only for zero. **AC-3**
- [x] The blank slots after today are `null`, not zero counted days. **AC-2**
- [x] Month labels come from the column where each month starts and are localized, so English and Indonesian differ without changing the layout. **AC-11**
- [x] Weekday markers are the Sunday, Tuesday and Thursday rows, localized. **AC-11**
- [x] The total line, the summary sentence, the heading, the link label and the empty copy all come from `content/messages.ts`, and no copy is hardcoded in the components. **AC-1**, **AC-5**, **AC-9**
- [x] The profile URL is `https://github.com/` plus the login, with no hardcoded username. **AC-1**
- [x] The tooltip date and count come from the active day through `formatDay` and the day count, and switch language with the locale. **AC-4**

## Acceptance criteria coverage

- AC-1 is covered by the placement, heading, total, link and locale opening steps.
- AC-2 is covered by the count, window, cell count and last painted day steps, plus the window and login sourcing rows.
- AC-3 is covered by the busiest day and ramp steps.
- AC-4 is covered by the hover and keyboard steps, plus the tooltip sourcing row.
- AC-5 is covered by the screen reader step and the copy sourcing row.
- AC-6 is covered by the 360px step.
- AC-7 is covered by the three failure builds and the build command step.
- AC-8 is covered by the repeat reload step.
- AC-9 is covered by the zero year step and the copy sourcing row.
- AC-10 is covered by the token search and the token sourcing row.
- AC-11 is covered by the locale steps, the lint step and the axis label sourcing rows.
