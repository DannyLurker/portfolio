# 0011 · Site atmosphere and name intro

## Context

The portfolio already has a dark visual system and an animated status detail, but it has no shared background treatment or opening moment. The requested name intro and meteor shower belong to the same visual layer, and should work across the home page and project pages without changing their content.

The intro briefly delays access to the page, so it needs a short duration, a visible skip control, and a once per tab rule. The background must remain decorative and stay quiet behind text and controls.

## Options considered

### Option 1: Shared atmospheric layer with a session intro

Use one shared client layer for the sitewide meteor backdrop and the timed name intro. Keep the intro marker in tab scoped session storage and use the existing Motion package for animation.

**Pros**:
- Both effects share the existing app shell and design tokens.
- The intro does not replay during the same tab session.
- No new package, image, API, or stored personal data is needed.

**Cons**:
- A small client component is needed for animation and session state.
- The intro can delay a visitor briefly, even with a skip control.

### Option 2: Animate the hero name in place

Animate the existing hero heading and add a decorative background without a full screen intro.

**Pros**:
- The page remains immediately available.
- No session tracking is needed.

**Cons**:
- The page content competes with the name instead of showing it first.
- It does not meet the requested intro screen behavior.

### Option 3: Use a video or animated image background

Render a prebuilt animation behind the site and use a separate name intro.

**Pros**:
- The meteor appearance can be authored as one fixed visual.

**Cons**:
- It adds an asset to load and maintain.
- It offers less control over reduced motion and responsive behavior than the existing motion tools.

## Rationale

The shared app shell is the right place for effects that should look consistent across home and project routes. Reusing the existing Motion dependency keeps implementation small and lets the page content continue to come from the established server side content model. A short, skippable intro gives the name priority without making visitors wait through a long splash.
