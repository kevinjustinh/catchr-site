// One source for the site nav and footer. Rewrites the <nav class="nav"> and <footer> blocks of every
// page from the templates below, so a menu or footer change is one edit here, then:
//   node scripts/site/build-chrome.js
// Running it twice changes nothing. scripts/guides/build-guides.js calls it after writing the guide pages.
// Per-page differences that are deliberate live in PAGE_OPTIONS (home-page anchors, active link, the
// tracking tag on Add to Chrome, footer width, and the plain Support link on the legal pages).
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '..', '..');
const STORE = 'https://chromewebstore.google.com/detail/kleffbpannecinoopgebbdhkfpkjhbia';
const KOFI = 'https://ko-fi.com/kevinjustin';
const CHECK = '<svg class="cur" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CARET = '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const KOFI_STYLED = `<a class="nav-kofi" href="${KOFI}" target="_blank" rel="noopener" aria-label="Support Catchr on Ko-fi"><span class="cup" aria-hidden="true">☕</span>Support</a>`;
const KOFI_PLAIN = `<a href="${KOFI}" target="_blank" rel="noopener">☕ Support</a>`;

// Defaults: campaign "<page>-nav", wide footer, styled Support link, nothing active.
const PAGE_OPTIONS = {
  index: { home: true, campaign: 'home-nav', footerWrap: 'wrap' },
  privacy: { active: 'privacy', footerWrap: 'wrap', plainKofi: true },
  terms: { footerWrap: 'wrap', plainKofi: true },
  'job-tracker-template': { active: 'job-tracker-template', campaign: 'template-nav' },
  'resume-template': { active: 'resume-template', campaign: 'resume-nav' },
};

const TEMPLATES = [
  { slug: 'resume-template', title: 'Resume', sub: 'For Google Docs' },
  { slug: 'job-tracker-template', title: 'Job tracker', sub: 'For Google Sheets' },
];

function nav(page, o) {
  const p = o.home ? '' : '/';
  const inTemplates = TEMPLATES.some((t) => t.slug === o.active);
  const items = TEMPLATES.map((t) => t.slug === o.active
    ? `            <li><a href="/${t.slug}" aria-current="page"><span class="t">${t.title}${CHECK}</span><span class="s">${t.sub}</span></a></li>`
    : `            <li><a href="/${t.slug}"><span class="t">${t.title}</span><span class="s">${t.sub}</span></a></li>`).join('\n');
  return `<nav class="nav">
    <div class="nav-inner">
      <a class="brand" href="${o.home ? '#top' : '/'}" aria-label="Catchr home">
        <img class="net" src="assets/net-forest.webp" alt="" />
        <span class="word">Catchr</span>
      </a>
      <div class="nav-links">
        <a href="${p}#features">Features</a>
        <a href="${p}#how">How it works</a>
        <div class="nav-drop">
          <button class="nav-drop-btn${inTemplates ? ' active' : ''}" type="button" aria-expanded="false" aria-controls="nav-templates">Free templates${CARET}</button>
          <ul class="nav-menu" id="nav-templates">
${items}
          </ul>
        </div>
        <a ${o.active === 'privacy' ? 'class="active" ' : ''}href="/privacy">Privacy</a>
        ${KOFI_STYLED}
      </div>
      <div class="nav-cta">
        <a class="btn btn-chrome" href="${STORE}?utm_source=jobcatchr.app&amp;utm_medium=website&amp;utm_campaign=${o.campaign || page + '-nav'}" target="_blank" rel="noopener">Add to Chrome</a>
      </div>
    </div>
  </nav>`;
}

function footer(page, o) {
  const p = o.home ? '' : '/';
  return `<footer>
    <div class="${o.footerWrap || 'wrap-wide'}">
      <div class="foot-grid">
        <div>
          <div class="foot-brand">
            <img class="net" src="assets/net-cream.webp" alt="" />
            <span class="word">Catchr</span>
          </div>
          <p class="foot-tag">Know your fit, tailor your resume, and walk into every interview ready. Catchr is free, and the AI runs on your own key.</p>
        </div>
        <div class="foot-links">
          <a href="${p}#features">Features</a>
          <a href="${p}#how">How it works</a>
          <a href="/setup">Setup guide</a>
          <a href="/faq">Help and FAQ</a>
          <a href="/guides">Guides</a>
          <a href="/resume-template">Free resume template</a>
          <a href="/job-tracker-template">Free tracker template</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          ${o.plainKofi ? KOFI_PLAIN : KOFI_STYLED}
        </div>
      </div>
      <div class="foot-bottom">
        <span>© 2026 Catchr.</span>
        <span>Made for job seekers who'd rather not do this twice.</span>
      </div>
    </div>
  </footer>`;
}

function buildChrome() {
  const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !f.startsWith('google'));
  let changed = 0;
  for (const file of files) {
    const page = file.replace(/\.html$/, '');
    const o = PAGE_OPTIONS[page] || {};
    const full = path.join(ROOT, file);
    const before = fs.readFileSync(full, 'utf8');
    const navRe = /<nav class="nav">[\s\S]*?<\/nav>/;
    const footRe = /<footer>[\s\S]*?<\/footer>/;
    if (!navRe.test(before) || !footRe.test(before)) throw new Error(`${file}: nav or footer marker missing`);
    const after = before.replace(navRe, () => nav(page, o)).replace(footRe, () => footer(page, o));
    if (after !== before) { fs.writeFileSync(full, after); changed++; console.log(`updated ${file}`); }
  }
  console.log(`site chrome: ${files.length} pages checked, ${changed} changed`);
}

module.exports = { buildChrome };
if (require.main === module) buildChrome();
