# Canonical URL Polish Design

## Objective

Remove the duplicate homepage endpoint while keeping `https://www.jobcatchr.app/` as the only indexable homepage URL.

## Current State

- `https://www.jobcatchr.app/` is live, indexable, and has a self-referencing canonical tag.
- `https://www.jobcatchr.app/index.html` serves the same homepage and canonicals to `/`.
- Vercel redirects the apex domain to `https://www.jobcatchr.app/`.
- The sitemap contains only canonical `www` URLs.

## Redirect Contract

Add one deployment-level permanent redirect:

| Incoming URL | Expected result |
| --- | --- |
| `https://www.jobcatchr.app/index.html` | Permanent redirect to `https://www.jobcatchr.app/` |

Keep Vercel's domain redirect configuration with `www.jobcatchr.app` as the primary domain. The existing `http` to `https` normalization may require an additional platform-level hop; this is acceptable and does not require new infrastructure.

## Implementation

Create a root `vercel.json` with a permanent redirect from `/index.html` to `/`.

No HTML canonical tags, sitemap entries, robots directives, page content, or Vercel domain assignments will be changed in the repository.

## Verification

After deployment, verify:

1. `/index.html` returns a permanent redirect to `/`.
2. The canonical homepage returns `200` and its canonical tag is `https://www.jobcatchr.app/`.
3. Every URL in `sitemap.xml` returns `200` and has a self-referencing canonical tag.
4. `https://jobcatchr.app/` redirects to `https://www.jobcatchr.app/`.
5. `robots.txt` continues to permit crawling and points to the canonical sitemap.

## Search Console

No validation request is needed for the intentional domain redirects. Google may continue to list redirected URLs as excluded, which is expected. The `index.html` alternate should disappear from the canonical-exclusion report after Google recrawls it.
