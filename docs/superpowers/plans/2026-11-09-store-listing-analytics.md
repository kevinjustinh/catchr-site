# Store listing analytics — plan

Status: planned 2026-11-09, not started. Site analytics (Google Analytics on jobcatchr.app, cookies,
consent banner) is shelved by Kev's decision; this plan covers only the Chrome Web Store listing.
Public repo: keep this file free of account details and money.

## Goal

Answer, every week, without Kev digging through dashboards:
- How many people viewed the listing, and how many installed (install rate)?
- Which sources brought them (site pages, posts, directories), and which convert best?
- How many uninstalled, and is that changing?

## What exists today (verified 2026-11-09)

- Kev has opted in to the store's Google Analytics. Google owns that property; Kev has the
  fixed "Marketer" role.
- It records listing `page_view` and an `install` event (sent only when the user accepts the
  permission prompt). No uninstall event. Data is kept for **2 months only**. Cannot add our own
  tracking ID or custom events, cannot link to Google Ads. Looker Studio is the documented export.
- `utm_source`, `utm_medium`, `utm_campaign` on links to the listing are passed into that
  property as session source / medium / campaign on both `page_view` and `install`. Takes 24–48h
  to fill in.
- The Developer Dashboard separately shows impressions, daily installs and uninstalls (by country,
  language, OS) and weekly users, with CSV export. It does not break down by UTM.
- Every store button on jobcatchr.app is tagged: `utm_source=jobcatchr.app`, `utm_medium=website`,
  `utm_campaign=<page>-<spot>` (nav / hero / cta / body, `get-<item>` on the /get/ pages). The only
  untagged copies are the homepage's structured data (JSON-LD), which should stay untagged.
- Source: developer.chrome.com/docs/webstore/google-analytics and /docs/webstore/metrics.

## Steps

1. **DONE 2026-11-09:** `install` registered as a key event (Events → Create event → "Create with code", key event on, no monetary value, once per event). Verified in the Key events list. Note: the old "Key events → New key event" page no longer exists; it's under Create event now. Original step:
   **Mark installs as a key event (Kev, 2 min).** In the store's GA property: Admin → Key events
   (formerly Conversions) → new event named `install`. Makes install rate by source appear in
   standard reports.
2. **Tag every off-site link (Kev lists them, agent writes the URLs).** Kev lists everywhere the
   listing is linked outside the site (social profiles, posts, directory listings, email
   signature, Ko-fi, GitHub). Agent produces one tagged URL per place using the same scheme:
   `utm_source=<site name>` (e.g. `linkedin`, `reddit`, `producthunt`), `utm_medium` one of
   `social` / `directory` / `email` / `referral`, `utm_campaign=<short label>`. All lowercase,
   hyphens, no spaces. Record the table below.
3. **Connect the Google Analytics MCP (agent guides Kev, ~20 min).** Official server
   `googleanalytics/google-analytics-mcp` (experimental, read-only). Needs a Google Cloud project,
   the Analytics Admin + Data APIs enabled, and a one-time sign-in. **Open question to test first:**
   whether the API can read a store-managed property with the Marketer role. If it can't, fall
   back to Looker Studio (step 3b) and CSV exports.
   - 3b. Fallback: one Looker Studio report on the property (views, installs, install rate by
     source/campaign, by week). Shareable link, no setup beyond sign-in.
4. **Beat the 2-month limit.** Once a month, save a snapshot: installs and views by source /
   campaign by week (from MCP or Looker Studio) plus the Developer Dashboard CSVs (installs,
   uninstalls, impressions). Store them somewhere private (Kev's Drive or the private extension
   repo), never this public repo. If MCP works, this can become a scheduled monthly agent run.
5. **Weekly read-out.** A short summary Kev can ask for: views, installs, install rate, top 5
   sources, uninstalls, changes vs last week, one suggested action.

## Open questions (added 2026-11-09)

- **Installs missing from GA.** The Developer Dashboard shows daily installs (a clear rise from
  late Oct 2026), but on 2026-11-09 the GA property's Recent events (last 28 days) listed only
  `first_visit`, `page_view`, `session_start`: no `install`. Investigate first in the next session:
  compare dashboard installs vs GA `install` day by day after 2026-11-09. Suspects: GA privacy
  thresholds withholding small counts, installs not passing through the listing page, or GA opt-in
  newer than those installs. Not yet verified which.
- **Kev wants dashboard installs and GA together.** Can't import dashboard data into the
  store-managed property (Marketer role, no data import). Recommended: Looker Studio report that
  joins the GA property with the dashboard's installs/uninstalls CSV (kept in a Google Sheet in
  Kev's Drive, not this repo). This replaces 3b as the main report, MCP or not.

## Off-site link table (fill in at step 2)

| Place | Tagged URL | Added on |
|---|---|---|

## Done when

- `install` is a key event; a test visit via a tagged link shows its source on an install within 48h.
- Every known off-site link is tagged and listed above.
- Kev can get the weekly read-out (via MCP or Looker Studio), and the first monthly snapshot is saved.
