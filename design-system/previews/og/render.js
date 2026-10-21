// Renders og-image.html to a 1200x630 PNG.
// Usage: node render.js <output.png>   (needs the `playwright` package on NODE_PATH)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const out = process.argv[2] || path.join(__dirname, 'og-image.png');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file://' + path.join(__dirname, 'og-image.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out });
  await browser.close();
  console.log('wrote', out);
})();
