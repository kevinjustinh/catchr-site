// Runs the Catchr extension's own sheet-setup code (background.js) offline and
// records the Google Sheets batchUpdate requests it would send for a brand-new
// tracker. build-tracker-template.py turns those requests into the .xlsx, so
// the downloadable template is exactly the sheet Catchr makes.
//
// Usage: node scripts/capture-catchr-sheet.js /path/to/catchr > scripts/catchr-sheet-requests.json
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ext = process.argv[2] || path.resolve(__dirname, '../../catchr');
const any = () => new Proxy(function () {}, { get: (t, k) => (k === 'then' ? undefined : any()), apply: () => any() });
const captured = [];
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  chrome: any(), self: any(), setTimeout, clearTimeout, setInterval, clearInterval,
  URL, URLSearchParams, TextEncoder, AbortController, crypto: globalThis.crypto, fetch: async () => ({ ok: true, json: async () => ({}) }),
};
ctx.globalThis = ctx;
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ext, f), 'utf8'), ctx, { filename: f });
ctx.importScripts = (...files) => files.forEach(load);
vm.createContext(ctx);
load('background.js');
vm.runInContext(`
  googleWrite = async (token, url, opts) => { __captured.push(opts.json.requests); return { ok: true, data: {} }; };
`, Object.assign(ctx, { __captured: captured }));
(async () => {
  await vm.runInContext(`(async () => {
    await formatNewSheet('t', 'S', 0);
    await formatDashboardSheet('t', 'S', 1, { tab: 'Jobs', headerRow: 1, headerMap: CATCHR_HEADER_MAP });
  })()`, ctx);
  const title = vm.runInContext('CATCHR_HEADERS', ctx);
  process.stdout.write(JSON.stringify({ headers: title, jobs: captured[0], dashboard: captured[1] }));
})().catch((e) => { console.error(e); process.exit(1); });
