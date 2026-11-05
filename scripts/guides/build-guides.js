// Builds the guide, comparison and trust pages plus the /guides hub from content.js, reusing
// faq.html's exact <style>, nav, CTA band and footer so the site chrome stays identical.
//   node scripts/guides/build-guides.js
// Also keeps vercel.json's clean-URL rules and sitemap.xml in step with the page list.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '..', '..');
const pages = require('./content.js');
const { STORE } = pages;
const SITE = 'https://www.jobcatchr.app';
const UPDATED = '2026-11-05';
const UPDATED_TEXT = 'November 2026';

const faq = fs.readFileSync(path.join(ROOT, 'faq.html'), 'utf8');
const between = (a, b) => { const i = faq.indexOf(a); const j = faq.indexOf(b, i); if (i < 0 || j < 0) throw new Error(`faq.html marker missing: ${a}`); return faq.slice(i, j); };
const FONTS = between('<link rel="preconnect" href="https://fonts.googleapis.com"', '<style>');
const STYLE = between('<style>', '</style>');
const NAV = between('<!-- ===================== NAV', '<!-- ===================== PAGE HEADER');
const CTA = between('<!-- ===================== CTA', '<!-- ===================== FOOTER');
const FOOT = faq.slice(faq.indexOf('<!-- ===================== FOOTER'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const strip = (s) => s.replace(/<[^>]+>/g, '');

const EXTRA_CSS = `
  /* ── Guides, comparisons, trust page (scripts/guides) ── */
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}
  .page-header .updated{margin-top:14px;font-size:0.875rem;color:var(--mint-soft);}
  .short{background:var(--cream-warm);border-left:4px solid var(--mint);border-radius:0 14px 14px 0;padding:20px 24px;margin-bottom:clamp(40px,5vw,56px);max-width:40em;}
  .short .eyebrow{color:var(--stone);}
  .short p{margin-top:8px;font-size:1.125rem;line-height:1.6;color:var(--ink);}
  .short strong{font-weight:600;}
  .qa-block h2{font-size:clamp(1.5rem,2.8vw,2.1rem);color:var(--ink);}
  .qa-block .substeps{max-width:40em;}
  .qa-block .shot{margin-top:28px;max-width:380px;}
  .ledger-wrap{margin-top:clamp(40px,5vw,56px);}
  .ledger-wrap h2{font-size:clamp(1.5rem,2.8vw,2.1rem);color:var(--ink);margin-bottom:18px;}
  .cmp{width:100%;border-collapse:collapse;margin-bottom:clamp(40px,5vw,56px);font-size:0.975rem;line-height:1.5;}
  .cmp caption{text-align:left;font-size:0.8125rem;color:var(--stone);padding-bottom:12px;}
  .cmp th,.cmp td{text-align:left;vertical-align:top;padding:14px 16px 14px 0;border-bottom:1px solid var(--cream-warm);}
  .cmp thead th{font-family:var(--display);font-size:1.15rem;color:var(--ink);border-bottom:2px solid var(--ink);}
  .cmp tbody th{font-weight:600;color:var(--ink);width:24%;}
  .cmp td{color:var(--ink);width:38%;}
  .cmp .ic{display:inline-block;width:1.1em;font-weight:700;color:var(--forest);}
  .cmp .ic.no{color:var(--stone);}
  .cmp .yn{font-weight:600;}
  @media(max-width:700px){
    .cmp thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);}
    .cmp tr{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;padding:14px 0;border-bottom:1px solid var(--cream-warm);}
    .cmp tbody th{grid-column:1 / -1;width:auto;padding:0;border:0;}
    .cmp td{width:auto;padding:0;border:0;font-size:0.925rem;}
    .cmp td::before{content:attr(data-col);display:block;font-size:0.6875rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--stone);margin-bottom:2px;}
  }
  .sides{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,48px);margin-bottom:clamp(40px,5vw,56px);}
  .sides h2{font-size:clamp(1.3rem,2.4vw,1.7rem);color:var(--ink);}
  .sides ul{margin:14px 0 0;padding-left:1.1em;color:var(--ink);line-height:1.6;}
  .sides li{margin-bottom:8px;}
  @media(max-width:700px){.sides{grid-template-columns:1fr;}}
  .sources{margin-top:clamp(40px,5vw,56px);padding-top:20px;border-top:1px solid var(--cream-warm);font-size:0.875rem;color:var(--stone);line-height:1.6;}
  .sources ul{margin:8px 0 0;padding-left:1.1em;}
  .sources a{color:var(--forest);border-bottom:1px solid rgba(44,95,74,.25);}
  .flow{display:flex;flex-direction:column;gap:14px;margin:0 0 clamp(40px,5vw,56px);}
  .flow .link{display:grid;grid-template-columns:1fr auto 1.5fr;align-items:stretch;gap:14px;}
  .flow .node{border:1px solid var(--cream-warm);background:#fff;border-radius:14px;padding:16px 18px;}
  .flow .node.src{background:var(--cream-warm);}
  .flow .node b{display:block;font-family:var(--display);font-size:1.1rem;color:var(--ink);}
  .flow .node span{display:block;margin-top:4px;font-size:0.9rem;color:var(--stone);line-height:1.5;}
  .flow .arrow{align-self:center;color:var(--forest);font-size:1.4rem;text-align:center;}
  .flow .none{border:1.5px dashed var(--stone);border-radius:14px;padding:12px 18px;color:var(--stone);font-size:0.95rem;text-align:center;}
  @media(max-width:700px){.flow{gap:22px;}.flow .link{grid-template-columns:1fr;gap:6px;}.flow .arrow{transform:rotate(90deg);line-height:1;}}
  .related{margin-top:clamp(48px,6vw,72px);}
  .related h2{font-size:1.25rem;color:var(--ink);}
  .related ul{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .related a{display:block;height:100%;padding:16px 18px;border:1px solid var(--cream-warm);border-radius:12px;color:var(--ink);font-weight:600;line-height:1.4;transition:border-color .15s;}
  .related a:hover,.related a:focus-visible{border-color:var(--forest);}
  .related a span{display:block;margin-top:4px;font-weight:400;font-size:0.875rem;color:var(--stone);}
  @media(max-width:700px){.related ul{grid-template-columns:1fr;}}
  .hub-group{margin-bottom:clamp(40px,5vw,56px);}
  .hub-group h2{font-size:clamp(1.3rem,2.4vw,1.7rem);color:var(--ink);}
  .hub-group ul{grid-template-columns:repeat(2,1fr);}
  @media(max-width:700px){.hub-group ul{grid-template-columns:1fr;}}
`;

// Footer: one "Guides" link after "Help and FAQ" (also patched into the existing pages).
const GUIDES_LINK = '<a href="/guides">Guides</a>';
const withGuides = (html) => html.includes('href="/guides"') ? html
  : html.replace('<a href="/faq">Help and FAQ</a>', `<a href="/faq">Help and FAQ</a>\n          ${GUIDES_LINK}`);

const bySlug = Object.fromEntries(pages.map((p) => [p.slug, p]));
const shortName = (p) => strip(p.h1);

const icon = (cell) => {
  if (cell.startsWith('✓ ')) return `<span class="ic" aria-hidden="true">✓</span><span class="yn">Yes.</span> ${cell.slice(2)}`;
  if (cell.startsWith('– ')) return `<span class="ic no" aria-hidden="true">–</span><span class="yn">No.</span> ${cell.slice(2).replace(/^No\b\.?\s*/, '')}`;
  return cell;
};

function head(p, url, jsonld) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${p.title}</title>
<meta name="description" content="${esc(p.description)}" />
<link rel="canonical" href="${url}" />
<link rel="icon" type="image/webp" href="assets/net-forest.webp" />
${FONTS}${STYLE}${EXTRA_CSS}</style>
<script defer src="/_vercel/insights/script.js"></script>
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Catchr" />
<meta property="og:title" content="${esc(strip(p.h1))}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/assets/og-image.jpg" />
<meta property="og:image:width" content="2400" />
<meta property="og:image:height" content="1260" />
<meta property="og:image:alt" content="Catchr: the free job tracker with AI built in. Check your fit, tailor your resume, prep the interview." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(strip(p.h1))}" />
<meta name="twitter:description" content="${esc(p.description)}" />
<meta name="twitter:image" content="${SITE}/assets/og-image.jpg" />
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>

  `;
}

function jsonld(p, url) {
  const crumbs = [{ name: 'Home', item: `${SITE}/` }, { name: 'Guides', item: `${SITE}/guides` }];
  if (p.slug !== 'guides') crumbs.push({ name: strip(p.h1), item: url });
  const graph = [{ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })) }];
  if (p.slug !== 'guides') graph.push({ '@type': 'Article', headline: strip(p.h1), description: p.description, dateModified: UPDATED,
    datePublished: UPDATED, mainEntityOfPage: url, image: `${SITE}/assets/og-image.jpg`,
    author: { '@type': 'Organization', name: 'Catchr', url: `${SITE}/` }, publisher: { '@type': 'Organization', name: 'Catchr', url: `${SITE}/` } });
  return { '@context': 'https://schema.org', '@graph': graph };
}

const header = (p) => `<!-- ===================== PAGE HEADER ===================== -->
  <header class="page-header">
    <div class="wrap">
      <p class="eyebrow">${p.eyebrow}</p>
      <h1>${p.h1}</h1>
      <p class="sub">${p.sub}</p>
      ${p.slug === 'guides' ? '' : `<p class="updated">Updated <time datetime="${UPDATED}">${UPDATED_TEXT}</time></p>`}
    </div>
  </header>
`;

const short = (p) => `<div class="short"><p class="eyebrow">Short answer</p><p>${p.short}</p></div>`;

const section = (s, i, p) => `
        <section class="qa-block" aria-labelledby="q${i}">
          <h2 id="q${i}">${s.h}</h2>
          <p class="answer">${s.answer}</p>
          ${s.detail ? `<p class="detail">${s.detail}</p>` : ''}
          ${s.steps ? `<ol class="substeps">${s.steps.map((t, n) => `<li><span class="sub-marker" aria-hidden="true">${n + 1}</span><span>${t}</span></li>`).join('')}</ol>` : ''}
          ${i === 0 && p.shot ? `<figure class="shot"><img src="${p.shot.src}" alt="${esc(p.shot.alt)}" loading="lazy" /><figcaption>${p.shot.caption}</figcaption></figure>` : ''}
        </section>`;

const problems = (p) => !p.problems ? '' : `
        <section class="ledger-wrap" aria-labelledby="problems">
          <h2 id="problems">Common problems</h2>
          <p class="ledger-intro">Find the message Catchr showed you. The fix is next to it.</p>
          <ul class="ledger">${p.problems.map(([m, fix]) => `<li><h3><span class="msg">${m}</span></h3><p>${fix}</p></li>`).join('')}</ul>
        </section>`;

const relatedCard = (slug) => { const r = bySlug[slug]; return `<li><a href="/${slug}">${shortName(r)}<span>${r.eyebrow}</span></a></li>`; };
const related = (p) => `
        <nav class="related" aria-labelledby="related">
          <h2 id="related">Related</h2>
          <ul>${p.related.map(relatedCard).join('')}</ul>
        </nav>`;

const table = (p) => `
        <table class="cmp">
          <caption>Catchr and ${p.them} compared. Checked ${UPDATED_TEXT}; see sources below.</caption>
          <thead><tr><th scope="col"><span class="sr">Feature</span></th><th scope="col">Catchr</th><th scope="col">${p.them}</th></tr></thead>
          <tbody>${p.rows.map(([l, a, b]) => `<tr><th scope="row">${l}</th><td data-col="Catchr">${icon(a)}</td><td data-col="${p.them}">${icon(b)}</td></tr>`).join('')}</tbody>
        </table>`;

const compareBody = (p) => `${short(p)}${table(p)}
        <div class="sides">
          <section><h2>Where ${p.them} is better</h2><ul>${p.themBetter.map((x) => `<li>${x}</li>`).join('')}</ul></section>
          <section><h2>Where Catchr is better</h2><ul>${p.usBetter.map((x) => `<li>${x}</li>`).join('')}</ul></section>
        </div>
        <section class="qa-block"><h2>Which should you pick?</h2><p class="answer">${p.who}</p></section>
        <div class="sources"><p>Sources, checked ${UPDATED_TEXT}. Prices and plans change; check each site before you decide.${p.sourceNote ? ' ' + p.sourceNote : ''}</p>
          <ul>${p.sources.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></div>`;

const FLOW = `
        <figure class="flow" aria-label="Where your data goes: two separate connections from your browser">
          <div class="link"><div class="node src"><b>Your browser</b><span>Catchr runs here. Your AI key is stored here.</span></div><div class="arrow" aria-hidden="true">→</div><div class="node"><b>The AI you chose</b><span>Gemini, Claude, or ChatGPT gets your resume, with the name and contact details Catchr detects removed first, and the job description.</span></div></div>
          <div class="link"><div class="node src"><b>Your browser</b><span>Catchr saves and reads your files from here.</span></div><div class="arrow" aria-hidden="true">→</div><div class="node"><b>Your Google account</b><span>Your tracker sheet, tailored resumes and prep docs, in your own Drive.</span></div></div>
          <p class="none">No Catchr data server: your resume and jobs never pass through one.</p>
        </figure>`;

function render(p) {
  const url = `${SITE}/${p.slug}`;
  let body;
  if (p.type === 'compare') body = compareBody(p);
  else if (p.type === 'hub') body = p.body;
  else body = short(p) + (p.type === 'trust' ? FLOW : '') + p.sections.map((s, i) => section(s, i, p)).join('') + problems(p);
  const campaign = p.slug;
  const nav = NAV.replace(/utm_campaign=faq-nav/g, `utm_campaign=${campaign}-nav`);
  const cta = CTA.replace(/utm_campaign=faq-cta/g, `utm_campaign=${campaign}-cta`);
  return head(p, url, jsonld(p, url)) + nav + header(p) + `
  <main class="faq">
    <div class="wrap">
${body}${p.related ? related(p) : ''}
    </div>
  </main>

  ` + cta + withGuides(FOOT);
}

// ── /guides hub ──
const group = (title, slugs) => `
        <section class="hub-group related" aria-labelledby="g-${slugs[0]}">
          <h2 id="g-${slugs[0]}">${title}</h2>
          <ul>${slugs.map(relatedCard).join('')}</ul>
        </section>`;
const hub = {
  slug: 'guides', type: 'hub', eyebrow: 'Guides',
  title: 'Job Search Guides and Catchr Help | Catchr',
  h1: 'Guides',
  sub: 'Getting an AI key, tailoring your resume, checking your fit, and how Catchr compares.',
  description: 'Guides from Catchr: get a free Gemini API key, a Claude or OpenAI key, tailor your resume, check if you\'re qualified, and compare Catchr with Teal, Simplify, Huntr and Jobscan.',
  body: group('Get an AI key', ['gemini-api-key', 'claude-api-key', 'openai-api-key'])
    + group('Job search', ['tailor-resume-to-job-description', 'am-i-qualified-for-this-job'])
    + group('Compare', ['teal-alternative', 'simplify-alternative', 'huntr-alternative', 'jobscan-alternative'])
    + group('Your data', ['how-catchr-handles-your-data'])
    + `\n        <p class="detail" style="margin-top:8px">Setting up Catchr? Follow the <a href="/setup">setup guide</a>. Something not working? See <a href="/faq">Help and FAQ</a>.</p>`,
};

const all = [...pages, hub];
for (const p of all) {
  fs.writeFileSync(path.join(ROOT, `${p.slug}.html`), render(p));
  console.log('wrote', `${p.slug}.html`);
}

// Every page (new and existing): nav and footer from the one shared template.
require('../site/build-chrome.js').buildChrome();

// vercel.json clean URLs.
const vp = path.join(ROOT, 'vercel.json'); const v = JSON.parse(fs.readFileSync(vp, 'utf8'));
const names = new Set(['setup', 'privacy', 'terms', 'faq', 'job-tracker-template', 'resume-template', ...all.map((p) => p.slug)]);
const alt = [...names].join('|');
for (const r of v.redirects) if (r.source.startsWith('/:page(')) r.source = `/:page(${alt}).html`;
for (const r of v.rewrites) if (r.source.startsWith('/:page(')) r.source = `/:page(${alt})`;
fs.writeFileSync(vp, JSON.stringify(v, null, 2) + '\n');

// sitemap.xml
const sp = path.join(ROOT, 'sitemap.xml'); let sm = fs.readFileSync(sp, 'utf8');
for (const p of all) {
  if (sm.includes(`<loc>${SITE}/${p.slug}</loc>`)) continue;
  sm = sm.replace('</urlset>', `  <url>\n    <loc>${SITE}/${p.slug}</loc>\n    <lastmod>${UPDATED}</lastmod>\n  </url>\n</urlset>`);
}
fs.writeFileSync(sp, sm);
console.log('vercel.json + sitemap.xml updated');
