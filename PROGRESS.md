# Catchr Site: Progress

Static marketing site for the Catchr Chrome extension, served by Vercel at https://www.jobcatchr.app.
Plain HTML pages at the repo root; no build step.

## Current state

- Site 2.0 copy is live on every page: home, setup, FAQ, privacy, terms, and the two free templates
  (job tracker, resume).
- Clean URLs: pages are served without `.html`, and old `.html` addresses redirect permanently
  (`vercel.json`).
- Guides section (live 2026-11-06): /guides hub plus 10 pages. AI key guides (Gemini, Claude, OpenAI),
  two how-tos (tailor your resume, am I qualified), how Catchr handles your data, and comparisons with
  Teal, Simplify, Huntr and Jobscan. Content lives in `scripts/guides/content.js`; run
  `node scripts/guides/build-guides.js` after editing it. Shared nav and footer for every page come from
  `node scripts/site/build-chrome.js`. Comparison facts were checked against each company's own pages in
  November 2026 and will drift; recheck before relying on them.
- Template use is counted (built 2026-11-09). Every "Open in Google Docs/Sheets" and "Download"
  button on the two template pages goes through one handoff page, `get/index.html`, served at
  /get/resume-google, /get/resume-docx, /get/tracker-google and /get/tracker-xlsx (rewrite in
  `vercel.json`). Each visit shows up in Vercel Web Analytics as a page view for that path, which is
  the count. The page then starts the download (once per tab, so a refresh doesn't repeat it) or
  forwards to Google's "make a copy" page. The page sits on the homepage hero watercolor (cream card;
  Google pages use the small mobile image only). Download pages carry a short Catchr pitch and Add to
  Chrome button (utm_campaign=get-<item>); Google pages forward after ~0.7s so have no pitch.
  If a Google template link or download file ever changes, update it in `get/index.html`.
  It counts clicks, not people who actually filled the template in. Counting starts from deploy.
- Homepage feature images come from the real 2.0.1 popup, using Catchr / San Francisco example data.
- `sitemap.xml` dates were last updated for the 2.0 pages (2026-11-04).
- `faq.html` has FAQPage structured data (JSON-LD in `<head>`) covering the 12 questions in
  "Before you install" and "Using Catchr". The troubleshooting ledger is left out (its headings are
  error messages, not questions). Text was generated from the page; if an answer changes, regenerate
  or edit the JSON to match. Note: Google now shows FAQ rich results mainly for government and health
  sites, so the main benefit is for other search engines and AI answer tools.

## Health check (2026-11-06)

- Every page has a title, description, canonical link, and social share tags.
- Every image has alt text.
- No broken internal links.

## Next

- After deploying the /get/ pages: click each of the four template buttons on the live site, then
  check that Vercel Analytics lists the four /get/ paths.
- After deploy: confirm the 11 guide URLs load on the live site, then request indexing in Search Console.
- Open work for Catchr overall (extension release, directory listings) is tracked in the extension
  project's own notes, not here.
- When page copy changes, update that page's `<lastmod>` in `sitemap.xml`.

HANDOFF-ANCHOR: 3c4013d
