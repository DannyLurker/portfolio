---
name: Obsidian Blueprint
colors:
  surface: "#131315"
  surface-dim: "#131315"
  surface-bright: "#39393b"
  surface-container-lowest: "#0e0e10"
  surface-container-low: "#1c1b1d"
  surface-container: "#201f21"
  surface-container-high: "#2a2a2c"
  surface-container-highest: "#353437"
  on-surface: "#e5e1e4"
  on-surface-variant: "#c2c6d6"
  inverse-surface: "#e5e1e4"
  inverse-on-surface: "#313032"
  outline: "#8c909f"
  outline-variant: "#424754"
  surface-tint: "#adc6ff"
  primary: "#adc6ff"
  on-primary: "#002e6a"
  primary-container: "#4d8eff"
  on-primary-container: "#00285d"
  inverse-primary: "#005ac2"
  secondary: "#a4c9ff"
  on-secondary: "#00315d"
  secondary-container: "#0267b8"
  on-secondary-container: "#d6e5ff"
  tertiary: "#b7c4ff"
  on-tertiary: "#002682"
  tertiary-container: "#6989ff"
  on-tertiary-container: "#002072"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#d8e2ff"
  primary-fixed-dim: "#adc6ff"
  on-primary-fixed: "#001a42"
  on-primary-fixed-variant: "#004395"
  secondary-fixed: "#d4e3ff"
  secondary-fixed-dim: "#a4c9ff"
  on-secondary-fixed: "#001c39"
  on-secondary-fixed-variant: "#004883"
  tertiary-fixed: "#dce1ff"
  tertiary-fixed-dim: "#b7c4ff"
  on-tertiary-fixed: "#001551"
  on-tertiary-fixed-variant: "#0039b5"
  background: "#131315"
  on-background: "#e5e1e4"
  surface-variant: "#353437"
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: "600"
    lineHeight: 64px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: "600"
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: "600"
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: "500"
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: "500"
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: 0em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: -0.01em
  mono-badge:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-stat:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

##

Figma Design Link: [UI](https://www.figma.com/design/iRpOoAdvd5nJH93ks6moht/Untitled?node-id=2001-6&t=WoEREljT7BW7GgIZ-4)

## Brand & Style

The design system embodies an ultra-focused, architectural developer aesthetic. Built on rigorous dark-mode minimalism, it pairs low-luminance deep obsidian canvases with electric azure accents to project extreme engineering competence, precision, and craftsmanship.

### Core Ethos

- **Technical Rigor:** Dense yet breathable data presentation; code blocks, metrics, and commit records treated with museum-grade typographic discipline.
- **Atmospheric Restraint:** Black-and-charcoal planes punctuated only by purposeful structural rules and deliberate status lights.
- **Tactile Utility:** Micro-interactions feel snappy, mechanical, and deliberate—analogous to modern IDE tooling and refined command-line interfaces.

### Target Persona

Designed for senior engineers, systems architects, and technical product builders seeking to communicate authority to high-tier engineering leaders, tech founders, and open-source collaborators.

## Colors

The palette relies on absolute control over tonal depth, eliminating visual noise while maintaining AAA contrast across text hierarchies.

### Surface System

- **Canvas Base (`#0a0a0c`):** Deep obsidian abyss for root viewport containers.
- **Surface Elevation 1 (`#111216`):** Card panels, metric containers, modal layers.
- **Surface Elevation 2 (`#16181f`):** Interactive card hovers, code blocks, active list rows.
- **Structural Border (`#1e2029`):** Sub-pixel hairline outlines dividing sections and grid units.
- **Border Focus / Accent (`#2563eb`):** Active structural borders and interactive focus states.

### Monochromatic Text & Accents

- **Primary Text (`#f8fafc`):** High-readability pure slate-white for headlines and critical metrics.
- **Secondary Text (`#94a3b8`):** Muted cool slate for technical descriptions and metadata.
- **Tertiary / Muted (`#475569`):** Code comments, inactive indicators, timestamps.

### Semantic Blue Accents & Heatmap Ramps

- **Primary Core (`#3b82f6`):** Primary action buttons, active tags, metric highlights.
- **Electric Tint (`#60a5fa`):** Monospace badges, active link hovers, tooltips.
- **Deep Glow (`#1d4ed8`):** Ambient backdrop glows, selected chip fills, focus rings.
- **GitHub Heatmap Scale:**
  - Level 0: `#16181f`
  - Level 1: `#1e3a8a`
  - Level 2: `#1d4ed8`
  - Level 3: `#3b82f6`
  - Level 4: `#60a5fa`

## Typography

Typography establishes an editorial yet developer-first reading rhythm. `Geist` provides an impeccably balanced, low-distortion neo-grotesque foundation for high-density reading and titles, while `JetBrains Mono` handles data points, badges, code snippets, and commit hashes.

### Rules of Usage

- **Display and Title Tracking:** Tightly track large headings (`-0.03em` to `-0.04em`) to maintain sharp, compact visual impact.
- **Monospace Separation:** Reserve `JetBrains Mono` strictly for metadata, system status, execution readouts, labels, and code tokens. Never use it for multiline editorial body copy.
- **Punctuation & Slugs:** Monospace indicators like `/` and `$` use `#475569` to ensure syntax styling mirrors modern code editors.

## Layout & Spacing

The portfolio uses an ultra-clean, structured 12-column fixed-max layout capped at `1160px` centered width. This prevents wide-monitor line stretching and maintains architectural balance.

### Grid Anatomy

- **Desktop (>= 1024px):** 12 columns, `1.5rem` (`24px`) gutters, `3rem` (`48px`) margins.
- **Tablet (768px - 1023px):** 8 columns, `1.25rem` (`20px`) gutters, `2rem` (`32px`) margins.
- **Mobile (< 768px):** 4 columns, `1rem` (`16px`) gutters, `1.25rem` (`20px`) margins.

### Vertical Rhythms & Sectional Gutters

- Main sections are partitioned with continuous `1px` border lines in `#1e2029` rather than arbitrary whitespace blocks.
- Component internals employ a strict 4px/8px micro-grid. Card interiors default to `space-lg` (`24px`) padding on desktop and `space-md` (`16px`) on mobile.

## Elevation & Depth

This system intentionally rejects heavy dropshadows, relying on flat, high-definition layered planes, razor-thin borders, and selective luminous backdrops.

### Surface Tiers

1. **Tier 0 (Root):** `#0a0a0c` canvas. Zero elevation.
2. **Tier 1 (Panels & Cards):** `#111216` background wrapped in a `1px` solid `#1e2029` stroke.
3. **Tier 2 (Popovers, Overlays, Code Panels):** `#16181f` background with `#282b37` border.

### Glows and Focused Energy

- **Subtle Atmospheric Gradient:** An optional 600px radius radial blur (`rgba(37, 99, 235, 0.08)`) placed behind the hero section or project showcase creates dimensional depth without visual clutter.
- **Card Hover Depth:** Interactive cards do not elevate via dropshadows. Instead, the border transitions smoothly from `#1e2029` to `#3b82f6` (at 40% opacity), paired with an internal background shift to `#14161c`.

## Shapes

The design uses a refined "Soft" radius philosophy (`roundedness: 1`), striking a balance between cold industrial geometry and contemporary UI tactility.

### Radius Assignments

- **Inner Micro Elements (Heatmap cells, badges, code tags):** `4px` (`space-xs`).
- **Inputs, Buttons, Activity Cards:** `6px` to `8px` (`0.375rem` - `0.5rem`).
- **Feature Cards, Project Banners:** `8px` (`0.5rem`).
- **Pill Exceptions:** Pure circular/pill radius is restricted exclusively to status indicators (e.g., active blinking ping dot for availability).

## Components

### 1. Buttons

- **Primary:** Background `#3b82f6`, text `#ffffff`, font `Geist Medium 14px`, radius `6px`, padding `10px 18px`. Hover: `#2563eb` with a subtle box-shadow `0 0 16px rgba(59, 130, 246, 0.35)`.
- **Secondary / Outline:** Background `transparent`, border `1px solid #1e2029`, text `#f8fafc`. Hover: border `#3b82f6`, background `#16181f`.
- **Ghost Utility:** Background `transparent`, text `#94a3b8`, font `JetBrains Mono 12px`. Hover: text `#f8fafc`, background `#111216`.

### 2. Badges & Chips

- **Monospace Badges:** Background `rgba(37, 99, 235, 0.1)`, border `1px solid rgba(59, 130, 246, 0.25)`, text `#60a5fa`, font `JetBrains Mono 11px uppercase`, radius `4px`, padding `4px 8px`.
- **Neutral Tech Tag:** Background `#16181f`, border `1px solid #1e2029`, text `#94a3b8`, font `JetBrains Mono 11px`.

### 3. Metric Cards

- Background `#111216`, border `1px solid #1e2029`, radius `8px`, padding `20px`.
- Header: Label in `JetBrains Mono 11px uppercase` color `#94a3b8`.
- Metric Value: Large numeral in `mono-stat` (`28px`), color `#f8fafc`.
- Trend/Context: Inline indicator in `#3b82f6` or `#22c55e` accompanied by micro sparklines or change tags.

### 4. Interactive Project Index

- Layout: Stacked modular list or 2-column grid.
- Border top/bottom lines in `#1e2029`.
- Project Row: Includes dynamic index number (`01`, `02`) in `#475569`, project title in `Geist 18px #f8fafc`, live link icon, tech stack badges, and expanded accordion details on hover/click.
- Transition: Border transitions to `#3b82f6` with smooth background fill `#14161d`.

### 5. GitHub Contribution Heatmap

- Outer Wrapper: `#111216` border `#1e2029`, radius `8px`, padding `20px`.
- Contribution Grid: 52-week horizontal calendar matrix.
- Cell: `11px x 11px`, radius `2px`, gap `3px`. Cells change from `#16181f` (empty) to graduated shades of `#1e3a8a`, `#1d4ed8`, `#3b82f6`, and `#60a5fa`.
- Hover Tooltip: Floating dark panel with `#16181f` background, `#282b37` border, displaying commit count and date in `JetBrains Mono 12px`.

### 6. Activity Feed & Commit History Cards

- Continuous vertical spine wire `#1e2029` connected by node bullets (`6px` circular nodes in `#3b82f6` or `#1e2029`).
- Commit Card: Background `#111216`, border `1px solid #1e2029`, radius `6px`, padding `14px 16px`.
- Content: Repository branch tag, commit SHA-1 badge in `JetBrains Mono 11px #60a5fa`, concise commit message in `Geist 14px #f8fafc`, and timestamp in `#475569`.

### 7. Form Inputs & Terminal Command Bar

- Input field: Background `#0a0a0c`, border `1px solid #1e2029`, radius `6px`, text `#f8fafc`, placeholder `#475569`, font `Geist 14px`.
- Focus state: Border `#3b82f6`, ring `2px rgba(59, 130, 246, 0.15)`, outline `none`.
