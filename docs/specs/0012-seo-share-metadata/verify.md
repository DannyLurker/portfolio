# Verify SEO and share metadata

Run these checks against a production build so generated metadata files behave as visitors and crawlers receive them.

## Page metadata

1. Open `/en` and `/id` directly. Inspect each document head.
2. Confirm the title uses the localized profile name and role, and the description uses the localized headline.
3. Confirm each canonical URL uses `https://danny-dev.my.id` and points to the current route.
4. Confirm `en`, `id`, and `x-default` alternates are present. The English URL should be `x-default`.
5. Confirm Open Graph title, description, locale, site name, URL, and image are present. Confirm X uses the same image with `summary_large_image`.
6. Confirm the home page contains valid Person JSON-LD with only profile values and public social links.

## Project pages

1. Open every project route under both `/en/projects/` and `/id/projects/` directly.
2. Confirm the title and description remain the localized project name and summary.
3. Confirm canonical URLs and alternates preserve the same project slug.
4. Open the generated image URL from each page. Confirm it is 1200 by 630, uses the right locale, and shows the local cover, name, and summary.
5. Confirm the X image URL matches the Open Graph image URL.

## Sitemap and robots

1. Open `/sitemap.xml`. Confirm each localized home and project route appears with its language alternates.
2. Confirm `/`, `/styleguide`, and unknown routes do not appear.
3. Open `/robots.txt`. Confirm public crawling is allowed and the sitemap URL is `https://danny-dev.my.id/sitemap.xml`.
4. Confirm `/styleguide` remains `noindex` in development and is absent in production as already specified.

## Invalid origin

1. Temporarily remove or corrupt `siteContent.siteUrl`.
2. Run `npm.cmd run build` and confirm validation fails with the field path.
3. Restore `https://danny-dev.my.id` and confirm `npm.cmd run lint` and `npm.cmd run build` complete.

## End to end checks from the build

_Use the current site origin from `siteContent.siteUrl`, which is `https://danny-dev.my.id`._

### UI / manual

- [x] Open `/en` and `/id`. Confirm each title combines the profile name and localized role, and each description matches the localized headline. **AC-1**
- [x] Confirm the home page image card shows the localized profile name and role. **AC-3**
- [x] Confirm each canonical URL is the current localized route on the `siteContent.siteUrl` origin. **AC-2**, **AC-7**
- [x] Confirm each home page has reciprocal `en` and `id` alternates, and `x-default` points to English. **AC-2**
- [x] Confirm the `x-default` URL is derived from `defaultLocale`, currently `/en`. **AC-2**
- [x] Confirm home Open Graph locale is `en_US` on `/en` and `id_ID` on `/id`. **AC-3**
- [ ] Open `/en/opengraph-image.png` and `/id/opengraph-image.png`. Confirm each is 1200 by 630 and its text follows the page locale. **AC-3**
- [ ] Open every project route in English and Indonesian. Confirm titles and descriptions use the localized project name and summary. **AC-1**
- [ ] Confirm each project canonical and language alternate retains the same slug and uses the configured origin. **AC-2**
- [ ] Open each project Open Graph image URL. Confirm it is 1200 by 630 and contains the local cover, localized project name, and localized summary. **AC-3**
- [ ] Confirm X card metadata uses the same generated image URL as Open Graph and `summary_large_image`. **AC-3**
- [ ] Confirm Person JSON-LD on both home locales has the localized name, role, headline, canonical home URL, and existing social links, with no email or location. **AC-6**
- [ ] Confirm `/sitemap.xml` lists each localized home and project route with language alternates, and excludes `/`, `/styleguide`, and unknown routes. **AC-4**
- [ ] Confirm `/robots.txt` allows public routes and names `https://danny-dev.my.id/sitemap.xml`. Confirm `/styleguide` remains noindex in development and is absent from the sitemap. **AC-5**
- [ ] Open `/` and confirm it still redirects to `/en`; confirm no canonical points to `/`. **AC-8**

### Commands

- [x] `npm.cmd run lint` completes with no errors. Existing unrelated warnings may remain. **AC-1** to **AC-8**
- [x] `npm.cmd run build` completes and generates sitemap and robots routes. GitHub data sections may be omitted when the build cannot reach GitHub. **AC-4**, **AC-5**, **AC-8**
- [x] Temporarily set `siteContent.siteUrl` to a relative URL or HTTP URL. `npm.cmd run build` must fail with the `siteUrl` field path. Restore `https://danny-dev.my.id` afterwards. **AC-7**

### Acceptance criteria coverage

- AC-1 covered by localized home and project metadata checks.
- AC-2 covered by canonical, locale alternate, and `x-default` checks.
- AC-3 covered by Open Graph fields, image routes, card content, and X image checks.
- AC-4 covered by sitemap contents and exclusions.
- AC-5 covered by robots policy, sitemap URL, and style guide checks.
- AC-6 covered by the localized Person JSON-LD checks.
- AC-7 covered by origin and invalid origin validation checks.
- AC-8 covered by direct localized routes, production build, and root redirect checks.
