# 0011. Site atmosphere and name intro

**Date**: 2026-11-01  
**Status**: Accepted

## Summary

The site will open with a brief introduction that shows your name, then reveal the page you requested. A quiet meteor shower will sit behind the site content. Both effects follow the existing dark design system and respect reduced motion settings.

## Requirements

**User stories**:

- As a visitor, I want to see the portfolio owner's name when the site opens so I know whose portfolio I am viewing.
- As a visitor, I want a calm animated background that adds atmosphere without distracting from the portfolio content.
- As a visitor who prefers reduced motion, I want the site to remain calm and usable without animated effects.

**Acceptance criteria**:

- **AC-1**: On the first route opened in a tab session, including a direct project URL, the site shows a full viewport intro with the exact name from `profile.name` before revealing the requested page. It does not change the destination route.
- **AC-2**: The name fades up with a soft blue glow. The intro lasts about two seconds total, then fades away to reveal the page.
- **AC-3**: A visible, keyboard accessible skip button dismisses the intro immediately. Its labels are `Skip intro` in English and `Lewati intro` in Indonesian. Dismissal by skip or timeout marks the intro complete for that tab, so it does not replay on refresh or client navigation.
- **AC-4**: A low density meteor shower appears behind content on all localized site routes, including project detail pages. A few slow streaks appear at a time, using the existing blue accent palette. The effect does not capture pointer events, receive focus, or add accessible content.
- **AC-5**: With reduced motion enabled, the intro is skipped and the meteor motion stops. A still star field remains behind the content.
- **AC-6**: If browser session storage is unavailable, or client scripting does not run, the page remains usable and the intro does not block access to its content.
- **AC-7**: `npm run lint` and `npm run build` pass, and both English and Indonesian routes render the intro labels correctly.

## Decision

**Chosen option**: Option 1, a shared atmospheric layer with a session intro.

Show `profile.name` in a centered, full viewport intro on the first route opened in each tab. Fade it up with a soft blue glow, then reveal the requested page after about two seconds. Provide a localized skip button. Use the existing Motion package and a tab scoped session marker. Render a sparse meteor shower behind content on localized routes. Reduced motion skips the intro and leaves only a still star field.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).

## Feature design

**Data model sketch**:

No persistent data model. The intro uses one tab scoped session storage key to record that it has been shown or skipped. The key contains no personal information.

**State transitions**:

`not shown in this tab` → `intro visible` → `complete for this tab`.

The intro becomes complete after its two second duration or when the visitor activates Skip intro. With reduced motion, the intro moves directly to complete. If session storage cannot be read or written, the page must still render and remain usable.

**API surface**:

No API or server action. The locale layout passes the resolved profile name, locale, and localized skip label to the shared client layer.

**Value sourcing**:

| Action | Value produced or displayed | Source |
| --- | --- | --- |
| Show the intro name | `Danny Ng` or the current profile name | `profile.name` from `getProfile(locale)` |
| Show the skip action | English or Indonesian label | New `intro.skip` message in `content/messages.ts` |
| Decide whether to show the intro | Per tab completion marker | `sessionStorage`; set on skip or timeout |
| Decide whether to animate | User motion preference | `prefers-reduced-motion`, read by the existing Motion setup |
| Color the name glow and meteor streaks | Existing blue accent colors | Design tokens in `app/globals.css` |
| Draw the background stars | Decorative fixed positions | Component styling; no user or profile data |
| Choose the current page | Requested route | Existing Next.js route; the intro does not redirect |

**Key invariants**:

- The name always comes from the profile content source.
- The intro appears no more than once in a tab session.
- Skipping or finishing the intro never changes the current route.
- The meteor layer never intercepts pointer or keyboard input.
- Reduced motion never plays the intro or meteor movement.
- A session storage failure never hides or disables the site content.

**Security model**:

The intro and background are public presentation only. The session marker is non sensitive and is stored only in the current tab. No secrets or personal data are added to browser storage.

**Configuration required**:

None.

**Critical test scenarios**:

- Happy path: open a home or project route in a new tab, see the profile name, then the requested page, verifies **AC-1**, **AC-2**, **AC-3**.
- Session behavior: skip or wait, refresh and navigate within the tab, and confirm the intro does not replay; open a new tab and confirm it can play again, verifies **AC-3**.
- Reduced motion: enable reduced motion and confirm the intro and moving streaks are absent while the still stars remain, verifies **AC-5**.
- Failure: deny or disable session storage and confirm the requested page remains usable, verifies **AC-6**.
- Accessibility: use the skip button by keyboard and confirm meteor decoration is absent from the accessibility tree, verifies **AC-3**, **AC-4**.

## Build plan

Use the project's Tracer Bullet approach: build the shared visual layer and the intro together, then verify its states across routes and locales.

1. [x] Add localized skip labels and create the shared meteor background using existing design tokens and Motion, satisfies **AC-4**, **AC-7**.
2. [x] Add the name intro, tab session behavior, timeout, skip action, and fail open behavior in the shared locale layout, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-6**.
3. [x] Add reduced motion behavior, verify accessibility and both locales, then run lint and production build, satisfies **AC-5**, **AC-7**.

## Consequences

**Positive**:
- The name is the first intentional visual moment, and the atmospheric treatment is consistent across routes.
- The implementation reuses the existing motion package and content source.

**Negative / tradeoffs**:
- Visitors wait up to two seconds unless they skip, and the intro requires a small client side state layer.
- A visitor with reduced motion will not see the animated intro or moving meteors.

**Neutral**:
- No external asset, API, environment variable, database, or new dependency is required.

## Follow-up

- [ ] This feature has no matching row in `docs/scope/scope.md`. Enroll it with `/scope` if you want it tracked in the project plan.

