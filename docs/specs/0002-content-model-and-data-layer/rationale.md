# Rationale: 0002. Adopt one typed content source and a read accessor layer

## Context

`docs/profile.md` now holds the real personal details, but the site has no data layer. The starter page hardcodes its copy, and every later feature (shell, hero, project index, detail pages, metrics, experience, contact, heatmap, feed, SEO) needs the same facts. Without one source, each screen would repeat or invent values, and a project change would touch several files.

The site is frontend only and static. There is no database, no accounts and no user input, so the content can live in the repository and be read at build time. That rules out a persistence layer and keeps the whole model in code review.

Feature 4 adds a second language right after this one, and the profile already mentions English and Mandarin. The content shape must not lock screens to one storage shape, or feature 4 will rewrite every consumer.

The project has no test runner and no formatter. ESLint and `next build` are the gates, so content validation has to run inside the build rather than in a separate test suite. Placeholder copy is the specific risk: the site is public and personal, and a `Lorem` or `Your Name` must never ship.

## Options considered

### Option 1: Typed TypeScript module, accessors and hand written validation

`content/site.ts` exports one typed object. `lib/content` holds the types, accessors and a small validator. The root layout calls the validator, so the build fails on bad content.

**Pros**:
- Type safety and runtime data in one place, with no parser and no new dependency.
- The accessor layer hides storage from screens, which gives feature 4 a clean swap point.
- Validation messages can name the exact field path because the data is already typed.
- Matches the project's minimal tooling and one file per concern style.

**Cons**:
- Duplicates `docs/profile.md` as a second record.
- The validator is hand maintained and grows with the model.
- TypeScript types are not a runtime schema, so the checks are imperative.

### Option 2: Parse `docs/profile.md` at build time

A custom parser reads the markdown form and produces the typed object.

**Pros**:
- One human file remains the only record.
- Editing the profile updates the site directly.

**Cons**:
- The form mixes prose, handles, names and `None` sentinels, so the parser is brittle.
- Any wording change in the profile can break the build.
- The parser itself needs tests, which the project does not have.

### Option 3: JSON or YAML data with TypeScript types

Store the content in `content/site.json` or `content/site.yml` and cast or validate it at load.

**Pros**:
- Clear separation between data and code.
- Portable and easy to diff.

**Cons**:
- Needs a schema check to be type safe, which is the same validation work plus a dependency.
- Weaker editor support than TypeScript for unions and required fields.
- No benefit over a typed module for a small static site.

### Option 4: MDX per project

Each project is an MDX file with frontmatter, and profile data stays in a separate module.

**Pros**:
- Case studies can use rich formatting.
- One file per project reads naturally.

**Cons**:
- Adds an MDX toolchain and build configuration to a project that currently has none.
- Splits profile and project data across two systems.
- Current case study copy is plain paragraphs, so the formatting power is unused.

## Rationale

Option 1 wins on the forces in Context: no database, a static build, minimal tooling and a second language coming next. TypeScript gives the type safety and the data in one file, and the accessors give feature 4 the seam it needs without committing to a locale shape now. A schema library would be the runner up if the site ever accepts external input or grows forms with shared validation; today it would add a dependency for about a dozen local rules.

Option 2 fails on the real content: the profile is a human form with handles, a name where a URL belongs and `None` sentinels, so a parser would encode those quirks and break on wording changes. Option 3 is close but buys nothing over TypeScript and still needs the same runtime checks. Option 4 is a reasonable future step if case studies need headings and images, but it is more toolchain than this slice needs.

The build time gate is the other half of the decision. The site has no tests, so the validator called from the root layout is the only automated protection against placeholder copy. Failing the production build while development still renders gives the owner a visible gap and a hard stop before deploy.
