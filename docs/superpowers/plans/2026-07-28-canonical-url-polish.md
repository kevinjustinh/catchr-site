# Canonical URL Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permanently redirect the duplicate `/index.html` homepage endpoint to the canonical root URL while preserving the current `www` canonical domain.

**Architecture:** Add one narrow Vercel deployment rule at the repository root. It changes only `/index.html`; canonical tags, sitemap URLs, robots rules, and Vercel custom-domain routing remain untouched. Verify the rule through Vercel's local development server, then against production after deployment.

**Tech Stack:** Static HTML, Vercel project configuration, curl, Playwright Chromium.

## Global Constraints

- Canonical homepage remains `https://www.jobcatchr.app/`.
- Use a permanent Vercel redirect (`permanent: true`, which returns HTTP 308).
- Do not modify `index.html`, `robots.txt`, `sitemap.xml`, or the legal/setup pages.
- Preserve `www.jobcatchr.app` as the Vercel primary domain.
- Do not remove or validate the intentional Search Console `Page with redirect` exclusions.

---

### Task 1: Add and verify the duplicate-homepage redirect

**Files:**
- Create: `vercel.json`
- Test: HTTP behavior for `/index.html`, `/`, `sitemap.xml`, and `robots.txt`

**Interfaces:**
- Consumes: Vercel's root-level `redirects` configuration.
- Produces: an HTTP 308 response from `/index.html` with `Location: /`.

- [ ] **Step 1: Confirm the current behavior before the change**

Run:

```bash
curl -sSI --max-time 20 https://www.jobcatchr.app/index.html | sed -n '1,12p'
```

Expected before implementation: `HTTP/2 200`, showing that `/index.html` currently serves the duplicate homepage.

- [ ] **Step 2: Create the Vercel redirect configuration**

Create `vercel.json` with exactly:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/index.html",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

- [ ] **Step 3: Validate configuration syntax**

Run:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('vercel.json', 'utf8')); console.log('valid JSON')"
```

Expected: `valid JSON`.

- [ ] **Step 4: Test the redirect locally with Vercel's router**

Run Vercel's local development server in one terminal:

```bash
npx vercel@latest dev --listen 3000
```

Then, in another terminal, run:

```bash
curl -sSI --max-time 20 http://localhost:3000/index.html | sed -n '1,12p'
curl -sSI --max-time 20 http://localhost:3000/ | sed -n '1,12p'
```

Expected: `/index.html` returns HTTP `308` and `Location: /`; `/` returns HTTP `200`.

- [ ] **Step 5: Verify unrelated crawl endpoints locally**

Run:

```bash
curl -sS http://localhost:3000/robots.txt
curl -sS http://localhost:3000/sitemap.xml
```

Expected: `robots.txt` still allows all crawlers and names `https://www.jobcatchr.app/sitemap.xml`; `sitemap.xml` still lists only the four canonical `www` URLs.

- [ ] **Step 6: Commit and push the focused redirect change**

Run:

```bash
git add vercel.json
git commit -m "fix: redirect duplicate index homepage"
git push
```

Expected: only `vercel.json` is included in this commit. Do not stage generated screenshots or unrelated files.

- [ ] **Step 7: Verify production after Vercel deploys the pushed commit**

Run:

```bash
curl -sSI --max-time 20 https://www.jobcatchr.app/index.html | sed -n '1,12p'
curl -sSIL --max-time 20 https://www.jobcatchr.app/index.html | sed -n '1,20p'
curl -sSI --max-time 20 https://www.jobcatchr.app/ | sed -n '1,12p'
curl -sSIL --max-time 20 https://jobcatchr.app/ | sed -n '1,20p'
```

Expected: `/index.html` returns HTTP `308` and resolves to `https://www.jobcatchr.app/`; the root returns `200`; the apex HTTPS domain redirects to the `www` root.

- [ ] **Step 8: Verify the rendered canonical homepage in Chromium**

Run:

```bash
npx playwright screenshot --device='Desktop Chrome' --full-page https://www.jobcatchr.app/ design-system/previews/screenshots/jobcatchr-production-canonical.png
```

Inspect the screenshot. Expected: homepage renders normally, with no browser errors or redirect loop.

- [ ] **Step 9: Confirm Vercel primary-domain configuration**

In Vercel Project Settings → Domains, confirm `www.jobcatchr.app` is the production/primary domain and `jobcatchr.app` redirects to it. Do not change DNS or introduce a proxy/CDN.

- [ ] **Step 10: Record the Search Console follow-up**

Wait for Google's normal recrawl; do not click **Validate fix** for `Page with redirect`. After `/index.html` is recrawled, its canonical-exclusion entry should no longer be needed because it will be a redirect exclusion instead.
