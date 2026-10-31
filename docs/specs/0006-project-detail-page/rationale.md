# 0006. Project detail page: decision record

## Context

The scope asks for one page per project, a short case study with the problem, the approach, what was built and the outcome. The Figma covers the home page only, so the detail page has no frame to copy and its layout and section order are a real decision. The content model already holds the four case study paragraphs, the stack, the role, the outcome, the live and repo links, and a private flag. It holds no images, and `public/` has no project images.

The index feature is next and every row must open a real project page, so this spec settles the URL the index will link to. The site is static, public and bilingual. Every page is prerendered, the language switch keeps the path, and the layout already owns the title template, the shell and the not found page. The site has no production domain yet, which limits how far share metadata can go.

The forces are: a URL that stays stable for the index, a page that reads as a case study rather than a second home page, a cover image without inventing content, and metadata that works without an absolute domain. Only one project exists today, so the page must be correct for one entry and ready for more.

## Options considered

### Option 1: A static case study page at `/{locale}/projects/{slug}` (chosen)

A server rendered page under a `projects` segment, with the header, the cover, four labelled rows and a back link.

**Pros**:
- A stable, shareable URL that the index can link to and that never collides with a future top level page.
- Prerenders for every project at build time, so it is fast and needs no runtime.
- The plural segment leaves room for an index route later if the home page section is not enough.

**Cons**:
- Adds a route segment and a new page file for a site with one project.
- The header nav still points at home anchors, so the page is a leaf that always sends visitors back.

### Option 2: A static page at `/{locale}/work/{slug}`

The same page under the nav label.

**Pros**:
- The URL matches the word a visitor sees in the navigation.
- Shorter and easy to say out loud.

**Cons**:
- `work` is a home page anchor today, not a route, so the segment carries no extra meaning.
- A future work index route and the anchor would share a name and invite confusion.

### Option 3: A root level page at `/{locale}/{slug}`

The project slug sits directly under the locale.

**Pros**:
- The shortest URL and the easiest to type.
- No new segment to learn.

**Cons**:
- Every future page name must avoid every project slug, which is a collision waiting to happen.
- The URL gives no hint that the page is a project.

### Option 4: No page, expand the row in the index

The index row opens in place and shows the case study, with no separate URL.

**Pros**:
- No new route, and the visitor never leaves the work list.
- Less code than a page.

**Cons**:
- No shareable URL per project, which fails the scope's done line.
- Long case study copy inside a list row fights the index's compact rhythm.
- The index would carry the detail page's content and layout, which couples two features.

### Other calls

The cover is a single required image, embedded in the project, with localized alt and natural dimensions. A list of screenshots was considered and dropped because the owner chose one cover, and a nullable cover was dropped because the build should stop rather than ship a project with no visual. The fourth case study row uses `outcome` rather than `caseStudy.result`, because the scope names outcome and showing both would repeat the same idea. The order number comes from the array position so the detail page carries the same number as its index row. The cover does not preload, because it sits below the header and the shell already loads the fonts. The four labels are `h2` headings so a screen reader user can jump between parts.

## Rationale

The URL choice follows the index dependency. The index feature needs a destination it can trust, and a plural `projects` segment gives one without borrowing a name that the home page already uses for an anchor. A root level slug saves a few characters but turns every future page name into a collision risk, and a page is the only option that gives each project a shareable link, which the scope requires.

The page shape follows the content. The four case study paragraphs already exist, so the page is a reading surface, not a new writing task. The header carries the identity, the cover carries the proof, and the four labelled rows carry the story in the order the scope names. The two column rows keep the labels visible while the paragraphs stay readable, and they stack cleanly on mobile.

The cover decision is the one that costs the most. Requiring it means a new project cannot ship until an image, two alt strings and two dimensions exist, and the build enforces that. The alternative, a nullable cover, would let a project ship with a gap in the strongest visual position. For a portfolio, a missing cover is worse than a short delay, so the strict rule wins. The tradeoff is recorded in Consequences and in the follow up about the scope's plural wording.
