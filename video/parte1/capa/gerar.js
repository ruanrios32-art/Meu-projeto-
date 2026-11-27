// Gera a capa: node gerar.js  → capa-parte1.png (1080x1920)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'capa.html'));
  await p.waitForFunction(() => document.title === 'pronto'); await p.evaluate(() => document.fonts.ready);
  await p.locator('#c').screenshot({ path: path.join(__dirname, 'capa-parte1.png') });
  await b.close();
})();
