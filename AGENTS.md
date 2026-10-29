# Personal portfolio

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

- **Language / Runtime**: TypeScript, React 19, Node types 20
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Key dependencies**: Tailwind CSS 4 (`@tailwindcss/turbopack`), `next/font` with Geist and Geist Mono
- **Package manager**: npm

## Build approach

Tracer Bullet, vertical slices that each run end to end before the next feature starts.

## Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Start the production server
npm run start

# Lint
npm run lint
```

There is no test runner and no formatter installed yet.

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

## Rules

- Routes and layouts live under `app/`; imports use the `@/*` alias for the repo root.
- TypeScript strict stays on.
- `npm run lint` must pass; ESLint 9 flat config with `eslint-config-next` core web vitals and TypeScript rules.
- `DESIGN.md` holds the visual language: colors, type, spacing, radii and components.
- Base UI components come from shadcn/ui, themed to the `DESIGN.md` tokens, never left at shadcn defaults.
- Personal facts come only from `docs/profile.md` and never get invented or replaced with placeholder copy.
- `docs/scope/scope.md` is the feature plan; change it through `/scope`.
