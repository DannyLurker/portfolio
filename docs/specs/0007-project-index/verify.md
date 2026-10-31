# Verify: Project index · scope feature 7

## UI and manual

- [x] Open `/en` and find the Work section. Confirm it shows the localized section heading, project number `01`, project name, summary, stack tags, and an external link icon. → Scope: project index
- [x] Select the project row. Confirm it opens `/en/projects/internal-management-system`. Use the browser back button, then activate the external link icon and confirm it opens the project's repository in the same tab. → Scope: project index
- [x] Open `/id`. Confirm the section heading, project name, summary, stack list label, and external link accessible name follow the Indonesian locale. → Scope: project index
- [x] Use only the keyboard to reach the project row and external link icon. Confirm both links have a visible focus indicator and activate correctly. → Scope: project index
- [x] Hover the project row. Confirm its border and background use the designed hover state. → Scope: proxect index
- [x] At 360px wide, confirm the project row and stack tags fit without horizontal scrolling. → Scope: project index
- [x] Temporarily clear the `projects` array in `content/site.ts` while running the development server. Confirm the localized empty state appears. Restore the project data before building. → Scope: empty state

## Commands

- [x] Run `npm.cmd run lint`. Confirm there are no errors. → Scope: project index
- [x] Run `npm.cmd run build`. Confirm the build succeeds and both locale home pages render. → Scope: project index

## Coverage

- Project number, title, summary, stack tags, and external link
- Navigation to each project's detail page
- Hover and keyboard focus states
- Empty state
- English and Indonesian content
- Responsive layout
- Lint and production build
