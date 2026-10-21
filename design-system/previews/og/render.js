// Renders og-image.html to a 2400x1260 PNG (1200x630 layout at 2x, so it stays sharp on high-density screens).
// Usage: node render.js <output.png>   (needs the `playwright` package on NODE_PATH)
// Export: magick out.png -strip -quality 90 -sampling-factor 4:4:4 assets/og-image.jpg
//   (4:4:4 keeps full color detail, so text edges on the green don't smear)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const out = process.argv[2] || path.join(__dirname, 'og-image.png');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'og-image.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out });
  await browser.close();
  console.log('wrote', out);
})();
