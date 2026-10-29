# 0001. Design system foundation: decision record

## Context

The repository is a fresh Next.js 16 and TypeScript scaffold with the create next app starter page, one page, no design system. `DESIGN.md` describes the Obsidian Blueprint: a dark, high density, developer facing visual language with a deep obsidian canvas, electric blue accents, a strict type scale and a small set of components. Every planned feature, site shell, hero, project index, metric cards, contact and the two GitHub sections, depends on those colors, type steps and primitives.

`DESIGN.md` contradicts itself. The token block at the top lists surface `#131315`, primary `#adc6ff` and a Material style naming scheme. The brand, color, typography and component sections below it use canvas `#0a0a0c`, surfaces `#111216` and `#16181f`, border `#1e2029`, primary `#3b82f6` and a heatmap ramp. Those prose values are the ones the component rules describe, so the file contains two design systems and a build has to pick one.

The engineer set three constraints before this decision: shadcn/ui is always the source of base components, the site is frontend only with no backend, and the site must meet WCAG AA. The site is dark only. Content is filled in later from `docs/profile.md`, so this foundation must not depend on any personal content.

Without one system, each feature invents its own grays, type sizes and focus treatment, and the design drifts before the first real page ships.

## Options considered

### Option 1: The prose palette with shadcn primitives and a styleguide (chosen)

Use the palette and component descriptions from the brand and component sections of `DESIGN.md`, expose them to shadcn/ui under semantic token names, and add a development only styleguide page.

**Pros**:
- Matches every component rule in the file, including the hover borders, the heatmap ramp and the mono treatments.
- Semantic names let shadcn components theme with no per component overrides.
- The styleguide makes contrast, focus and hover verifiable before any page depends on them.

**Cons**:
- Requires adding shadcn, Radix primitives, an icon set, a motion library and three small helpers.
- Three values must deviate from the file to pass AA, so the build will not match the Figma exactly.

### Option 2: The token block palette

Use the Material style tokens at the top of the file: surface `#131315`, primary `#adc6ff`, and the fixed, fixed dim and container families.

**Pros**:
- The file already lists complete families, including inverse and fixed variants.
- Pale blue accents read as softer and less saturated.

**Cons**:
- The pale blue contradicts the button, link, active border and heatmap rules in the same file.
- The naming scheme requires a mapping layer for every shadcn component.
- The surface values differ from the component rules, so panels and borders would be mismatched.

### Option 3: Merge both palettes

Take surfaces and borders from the prose and primary and text from the token block.

**Pros**:
- Keeps the deepest surfaces and the softer accent.

**Cons**:
- The two systems were not designed to meet. Contrast and hover pairs would need to be re-derived and re-tested.
- The result matches neither source, so the Figma file stops being a reference.

### Option 4: Tokens only, no primitives or styleguide

Define variables and type classes, and let each feature bring its own components.

**Pros**:
- Smallest first pass and fastest to start the shell.

**Cons**:
- Component states drift immediately, which is the exact failure the foundation exists to prevent.
- Contrast and focus faults are found only after several pages exist.

## Rationale

The prose palette wins on evidence: every concrete component rule in `DESIGN.md`, the primary button, the outline hover, the active border, the mono badge and the heatmap ramp, names those values. The token block is a generated Material scheme whose pale primary contradicts those rules, so following it would mean rewriting the component section instead of the token block. Choosing the prose values keeps the Figma file readable as a reference.

Semantic token names are not a preference, they are the seam between the design and shadcn. shadcn components read `background`, `foreground`, `card`, `muted`, `border`, `primary`, `ring` and friends. Naming the Obsidian values that way means the copied components work unchanged; naming them `surface-container-high` would require an override in every component and would rot with each shadcn update.

The accessibility bar forced three measured corrections. Relative luminance on the canvas `#0a0a0c` gives white on `#3b82f6` a contrast of about 3.68 to 1, under the 4.5 needed at button label size, while white on `#2563eb` measures about 5.17. The input border `#1e2029` measures about 1.2 to 1 against the canvas, far under the 3 to 1 for a control boundary, so inputs use `#64748b` at about 4.2. The tertiary text `#475569` measures about 2.6 to 1, so it stays decorative and readable small text uses `#94a3b8` at about 7.7. These are the smallest deviations that meet the engineer's bar.

The styleguide is included because a design system's failures are visual and comparative: two grays that looked fine alone fail side by side, and a focus ring that looks strong on a panel disappears on the canvas. Rendering every token and state in one development only page makes those failures cheap to catch. Adding primitives now rather than per feature follows the project's Tracer Bullet approach: the first real slice composes them, so the foundation thread runs through a screen instead of stopping at variables.
