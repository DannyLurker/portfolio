# Rationale: SEO and share metadata

## Context

The portfolio already serves English and Indonesian pages and keeps profile and project copy in locale aware content. Project detail pages already choose their own localized title and description. The missing pieces are a stable production origin, canonical and alternate language URLs, share images, and crawler discovery files.

The scope covers home and project pages. The site has one project today, but the design must work for every slug as the content grows. The root URL redirects to English, and `/styleguide` is a development only route that already carries `noindex` metadata.

## Options considered

### Option 1: Use Next.js metadata conventions and generated route images

Use the existing Metadata API for page metadata and the framework file conventions for generated images, sitemap, and robots output.

**Pros**:

- Uses the installed framework and static route generation.
- Keeps canonical, language, image, and crawler output close to the routes that own it.
- Does not add a dependency or separate service.

**Cons**:

- Image generation must follow the installed Next.js version's rendering constraints.
- A route specific metadata setup takes more care than one shared static image.

### Option 2: Hand write metadata and use static share images

Set metadata strings manually and add image files for each page and locale.

**Pros**:

- Image output is simple for crawlers to fetch.
- Cards do not need a rendering route.

**Cons**:

- New or changed project content can drift from its static card.
- Multiple locales and projects create manual image maintenance.

### Option 3: Add an external SEO or image service

Send page content to an external service to create and host share images.

**Pros**:

- Could offer a managed editor and image pipeline.

**Cons**:

- Adds a provider, configuration, and external dependency for a static portfolio.
- The current content and framework already cover the required pages.

## Rationale

The project is a static Next.js site with localized content already available at build time. The built in metadata conventions can produce the requested route specific output without another provider or a set of manually maintained copies. The generated image approach keeps previews aligned with the content, while the existing project cover gives each project card a real asset.

The site URL belongs in central content because metadata, images, the sitemap, and robots output all need the same origin. Validation catches a broken deployment configuration before it produces incorrect absolute URLs. No web references are included, as requested.
