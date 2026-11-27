// Gera as fotos de perfil: node gerar.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'perfil.html')); await p.evaluate(() => document.fonts.ready);
  for (const [nome, txt] of [['perfil-sem-texto.png', false], ['perfil-com-texto.png', true]]) {
    const u = await p.evaluate(t => window.pinta(t), txt);
    fs.writeFileSync(path.join(__dirname, nome), Buffer.from(u.split(',')[1], 'base64'));
  }
  await b.close();
})();
