# 0001. Adopt the Obsidian design system for all UI

**Date**: 2026-10-29
**Status**: Accepted

## Summary

The site gets one dark design system, built from the Obsidian Blueprint in `DESIGN.md`. Colors and other tokens use the shadcn semantic names, the base components come from shadcn/ui themed to those tokens, and the type scale becomes named classes. A development only styleguide page shows every token and component state so contrast and focus problems surface before any real page exists. Every later feature builds from this one system.

## Decision

**Chosen option**: Option 1: the prose palette, shadcn primitives, semantic tokens and a styleguide page.

The design system uses the prose palette from `DESIGN.md` (canvas `#0a0a0c`, panels `#111216`, secondary surface `#16181f`, border `#1e2029`, accent `#3b82f6`), not the Material style token block at the top of the file. Tokens carry shadcn semantic names so shadcn components theme without per component overrides. Base components come from shadcn/ui (style `new-york`, CSS variables on, components copied into `components/ui`). Icons are `lucide-react`. Micro animation uses the `motion` package in client components only. The site is dark only.

Three deliberate corrections to the file, needed to meet the WCAG AA bar:

- Filled primary buttons use `#2563eb` with white text (5.17 to 1). `#3b82f6` with white text is 3.68 to 1 and fails for button label size.
- Input and textarea boundaries use `#64748b` (about 4.2 to 1 against the canvas). `#1e2029` is about 1.2 to 1 and does not identify a control.
- Placeholders use `#94a3b8`. The file says `#475569`, which is about 2.6 to 1 and unreadable as text.

## Standard definition

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--background` | `#0a0a0c` | Root canvas |
| `--foreground` | `#f8fafc` | Primary text |
| `--card` | `#111216` | Panels, cards, metric cards |
| `--card-foreground` | `#f8fafc` | Text on panels |
| `--popover` | `#16181f` | Code panels, tooltips, overlays |
| `--popover-foreground` | `#f8fafc` | Text on overlays |
| `--muted` | `#16181f` | Quiet fills, hover rows |
| `--muted-foreground` | `#94a3b8` | Secondary text, metadata, placeholders |
| `--accent` | `#16181f` | Hover fill |
| `--accent-foreground` | `#f8fafc` | Text on hover fill |
| `--primary` | `#2563eb` | Filled action background |
| `--primary-foreground` | `#ffffff` | Text on filled actions |
| `--primary-hover` | `#1d4ed8` | Filled action hover |
| `--secondary` | `#16181f` | Outline button fill |
| `--secondary-foreground` | `#f8fafc` | Outline button text |
| `--destructive` | `#ffb4ab` | Error text and icons |
| `--border` | `#1e2029` | Structural hairlines, section rules |
| `--border-strong` | `#282b37` | Overlay and code panel borders |
| `--input` | `#64748b` | Input and textarea boundary |
| `--ring` | `#3b82f6` | Focus ring |
| `--electric` | `#60a5fa` | Mono badges, link hover |
| `--faint` | `#475569` | Dividers, inactive dots, decoration only, never text |
| `--heat-0` to `--heat-4` | `#16181f`, `#1e3a8a`, `#1d4ed8`, `#3b82f6`, `#60a5fa` | Contribution heatmap only |

Rules: the canvas is never lighter than a panel, panels never lighter than overlays. Raw hex values appear only in `app/globals.css`. Components reference semantic classes, never hex.

### Type scale

One family for reading, one for data. Geist for text and headings, JetBrains Mono for badges, metadata, code and stats. JetBrains Mono loads through `next/font/google` next to the existing Geist setup, exposed as `--font-mono`.

| Class | Size / line | Weight | Tracking | Mobile |
|---|---|---|---|---|
| `type-display-hero` | 56 / 64 | 600 | -0.04em | 36 / 44 at -0.03em |
| `type-headline-lg` | 32 / 40 | 600 | -0.03em | 26 / 34 at -0.02em |
| `type-headline-md` | 22 / 30 | 500 | -0.02em | same |
| `type-headline-sm` | 18 / 26 | 500 | -0.01em | same |
| `type-body-lg` | 16 / 26 | 400 | -0.01em | same |
| `type-body-md` | 14 / 22 | 400 | 0 | same |
| `type-body-sm` | 13 / 20 | 400 | 0 | same |
| `type-mono-code` | 13 / 20 | 400 | -0.01em | same |
| `type-mono-badge` | 11 / 14 | 500 | 0.04em, uppercase | same |
| `type-mono-stat` | 28 / 32 | 600 | -0.03em | same |

Rules: headings track tight as the table says. Mono is never used for multi line body copy. Each class sets size, line height, weight and tracking together, and no screen sets a raw `text-3xl` or a custom tracking value.

### Layout

- Container: max width `1160px`, centered, page margins `48px` desktop, `32px` tablet, `20px` mobile.
- Grid: 12 columns at `1024px` and up with `24px` gutters, 8 columns from `768px` to `1023px` with `20px` gutters, 4 columns below `768px` with `16px` gutters.
- Spacing: 4px base step. Named steps `xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 40.
- Radius: `sm` 2px, base 4px, `md` 6px, `lg` 8px, `xl` 12px, `full` 9999px. Pill radius only for the availability status.
- Sections are separated by a 1px `--border` rule, not by arbitrary gaps.

### Primitives

All live in `components/ui` when shadcn provides them, with project wrappers in `components/` where a design specific pattern is needed.

One component per file, named in kebab case: `button.tsx`, `metric-card.tsx`, `status-pill.tsx`. Each file exports one component plus its own variant config. A component that grows subcomponents splits them into sibling files rather than nesting. No `components/index.ts` barrel, screens import from the component's own path (`@/components/ui/button`, `@/components/metric-card`).

- **Button**: variants `primary` (fill `--primary`, white text, hover `--primary-hover` with a soft glow), `secondary` (transparent, `--border`, hover border `--primary` at 40 percent and `--accent` fill), `ghost` (mono label, muted text, hover text foreground and `--card` fill), `icon` (square, for the live link and menu). Sizes `sm` and `md` (10px by 18px padding). States: hover, focus ring, disabled at 40 percent opacity, loading.
- **Link**: inline text link in `--electric`, nav link in muted with foreground on hover, icon link with an accessible name.
- **Input, Textarea, Label**: fill `--background`, boundary `--input`, radius 6px, text `--foreground`, placeholder `--muted-foreground`. Focus: 2px `--ring` ring with 2px offset, no default outline. Label in `type-body-sm`, error text in `--destructive`, help text in `--muted-foreground`.
- **Badge**: mono uppercase 11px, fill `rgba(37, 99, 235, 0.1)`, border `rgba(59, 130, 246, 0.25)`, text `--electric`, radius 4px, padding 4px 8px.
- **Tag**: fill `--popover`, border `--border`, mono 11px, text `--muted-foreground`, radius 4px.
- **StatusPill**: dot plus label, pill radius, dot `--primary` with a ping animation, label in `type-body-sm`. The dot is decorative, the label is the real text.
- **Panel**: fill `--card`, border `--border`, radius 8px, padding 24px desktop and 16px mobile. Hover: border `rgba(59, 130, 246, 0.4)`, fill `#14161c`.
- **CodePanel**: fill `--popover`, border `--border-strong`, radius 8px.
- **MetricCard**: panel plus mono uppercase label, `type-mono-stat` value, optional trend line.
- **Section**: vertical padding from the spacing scale, optional top border.
- **Container** and **Grid**: the layout rules above, as components with column span props.

Focus is always the 2px `--ring` ring with 2px offset on a dark surface, on every interactive element. Hover never replaces focus. Disabled elements are skipped by keyboard.

### Motion and icons

- `lucide-react` only. Icons inherit `currentColor`, sit at 16px or 20px, and decorative ones are `aria-hidden`. An icon only button always carries an `aria-label`.
- `motion` in client components only, imported through `LazyMotion` with `domAnimation`. Used for the mobile menu, tooltips, and the status ping. Duration 120ms to 200ms, ease `[0.2, 0, 0, 1]`.
- `MotionConfig reducedMotion="user"` plus `prefers-reduced-motion` in CSS. With reduced motion, states change instantly and the ping stops.
- No page transitions and no scroll reveals.

### Styleguide

`/styleguide`, development only. In production it calls `notFound()`, so it is never built into the public site's navigation or sitemap. It renders:

- every color token as a swatch with its hex and its contrast ratio against the canvas and against `--card`
- the full type scale at both breakpoints
- spacing and radius steps
- every primitive in default, hover, focus, disabled and error states
- a keyboard focus walk and a reduced motion note

**Canonical pattern**:

```tsx
// Screens compose primitives and semantic type classes. No raw colors, no raw sizes.
import { Button } from "@/components/ui/button";
import { Container, Grid } from "@/components/layout";

export function ProjectIndex() {
  return (
    <section className="border-t border-border">
      <Container>
        <h2 className="type-headline-lg text-foreground">Selected work</h2>
        <Grid className="mt-lg">
          <Button variant="secondary">View project</Button>
        </Grid>
      </Container>
    </section>
  );
}
```

**Replaces**:

- The starter page's default Tailwind grays, `bg-zinc-50` and `dark:bg-black`.
- The browser default focus outline and the faint 15 percent focus ring suggested in `DESIGN.md`.
- Ad hoc `text-3xl`, `tracking-tight` and one off hex values inside components.
- A light mode palette and any `prefers-color-scheme` switch.

**Enforcement**:

- Tokens and type classes in `app/globals.css` only. Components import semantic classes.
- `components.json` fixes the aliases (`@/components`, `@/components/ui`, `@/lib/utils`) so shadcn adds files in predictable places.
- `cn()` from `clsx` and `tailwind-merge` for conditional classes.
- One component per file, kebab case, under about 150 lines. A larger file splits by responsibility, never by adding more exports.
- Review convention plus the styleguide as the check. There is no lint rule for raw hex yet, which is recorded as follow up.

**Rollout**:

New code immediately. The only existing screen is the starter page, replaced when the site shell feature lands. No migration debt.

**Exceptions**:

- The heatmap ramp is data, not UI color, and uses the `--heat-*` tokens.
- Photographic assets are not themed, but they may not carry UI colors or text.
- Third party surfaces (a future embedded widget) are out of scope until one exists.

## Consequences

**Positive**:

- Every later screen composes one set of colors, type, spacing and states, so the design does not drift feature by feature.
- shadcn components render correctly with no per component color overrides, which keeps them updatable.
- The styleguide catches contrast and focus faults before five pages depend on them.
- Three accessibility corrections mean the AA bar holds from the first screen instead of being retrofitted.

**Negative / tradeoffs**:

- Adds dependencies: shadcn and its Radix primitives, `lucide-react`, `motion`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- shadcn copies component code into the repo, so updates are manual merges, not package bumps.
- `motion` only works in client components, so any animated wrapper forces a client boundary and must stay small.
- The three corrected colors mean the built UI differs from the Figma file in button fill, input border and placeholder.
- No automated rule stops a raw hex value yet.

**Neutral**:

- Dark only, so no theme toggle and no `next-themes` dependency.
- The styleguide exists in development only.
- JetBrains Mono adds a second font download.
- One component per file means more, smaller files, so more paths to navigate and import.

## Follow-up

- [ ] Consider a lint rule that rejects raw hex values, arbitrary text sizes and files past a length limit in `tsx`, once components exist and the pattern is proven.
- [ ] If exact Figma spacing matters, connect a Figma MCP server and re-check the frames against these tokens.
- [ ] Record the `motion` and `lucide-react` choices in `AGENTS.md` at the next `/sync`.

## Rationale

Reasoning, alternatives and measurements: see `rationale.md`.
