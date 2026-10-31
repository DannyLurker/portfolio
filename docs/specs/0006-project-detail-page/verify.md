# Verify: Project detail page · spec 0006

## UI and manual

- [x] Open `/en/projects/internal-management-system`. Confirm the project name is the only `h1`, the summary and role are present, the stack appears as tags, and the Problem, Approach, Built, and Outcome sections appear in that order. → AC-1, AC-2
- [x] Open `/id/projects/internal-management-system`. Confirm the project content and labels are Indonesian, and the project keeps the same slug. → AC-2, AC-6
- [x] Inspect the cover image. Confirm it uses the local project image, has descriptive alt text, keeps its natural aspect ratio, reserves its space before loading, sits in a bordered panel below the header, and is not preloaded. → AC-3
- [x] Confirm Source appears for the public project, opens in the same tab, and Live site is absent while `liveUrl` is `null`. → AC-4
- [x] Temporarily set the project's `liveUrl` to `https://example.com`. Reload the page and confirm Live site appears as the primary action and opens in the same tab. Restore `liveUrl` to `null`. → AC-4
- [x] Temporarily set the project's `private` value to `true`. Reload the page and confirm Private appears instead of Source. Restore `private` to `false`. → AC-4
- [x] Inspect the document title, description, and Open Graph tags. Confirm the title is `Internal Management System | Danny Ng`, the description matches the project summary, and Open Graph uses the project name, summary, and type `article`. Confirm there is no share image or canonical URL. → AC-5
- [x] Open `/en/projects/not-a-project`. Confirm the English not found page appears inside the site shell. Open `/id/projects/not-a-project` and confirm the Indonesian not found page appears inside the shell. → AC-6
- [x] Use the back link above the header and after the case study. Confirm each returns to `/{locale}#work`. Use the language switch and confirm it keeps the project slug. → AC-7
- [x] At 360px wide, confirm there is no horizontal scroll, the case study rows stack, and every action is at least 44px tall. Use only the keyboard to reach the back links and actions, and confirm each has a visible focus ring. → AC-9

## Content validation

For each invalid case, restore the valid value before trying the next one.

- [x] Remove `cover` from the project in `content/site.ts`, then run `npm.cmd run build`. Confirm production stops and names the cover field. Restore the cover. → AC-8
- [x] Blank one localized cover alt value, then run `npm.cmd run build`. Confirm production stops and names the locale field. Restore the alt text. → AC-8
- [x] Set the cover width or height to `0`, then run `npm.cmd run build`. Confirm production stops and names the dimension field. Restore the dimension. → AC-8
- [x] Change the cover source to a path outside `/projects/internal-management-system/`, then run `npm.cmd run build`. Confirm production stops and names `cover.src`. Restore the source. → AC-8
- [x] Change the cover source to a valid path under `/projects/internal-management-system/` whose file does not exist, then run `npm.cmd run build`. Confirm production stops and names `cover.src`. Restore the source. → AC-8
- [x] With one invalid cover field, run the development server. Confirm validation errors are logged, then restore valid content. → AC-8

## Commands

- [x] Run `npm.cmd run lint`. Confirm there are no errors. → AC-10
- [x] Run `npm.cmd run build`. Confirm the build succeeds and prerenders the project page for English and Indonesian. → AC-1, AC-10

## Acceptance criteria coverage

- AC-1 route and static generation
- AC-2 localized project content and page structure
- AC-3 cover image behavior
- AC-4 project actions
- AC-5 page metadata
- AC-6 unknown slugs and locale not found pages
- AC-7 back links and language switching
- AC-8 cover content validation
- AC-9 responsive layout and keyboard access
- AC-10 lint and production build
