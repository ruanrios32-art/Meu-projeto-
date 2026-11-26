// Renderiza os quadros da cena: node render.js <pasta_saida> [t1,t2,...]  (sem lista = 0..27 s a 30 fps)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const out = process.argv[2] || 'frames';
  const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  p.on('pageerror', e => { console.error('ERRO NA PÁGINA:', e.message); process.exit(1); });
  await p.goto('file://' + path.resolve(__dirname, 'cena.html'));
  await p.evaluate(a => window.setAmp(a), JSON.parse(fs.readFileSync(path.join(__dirname, 'amp.json'))));
  await p.evaluate(() => document.fonts.ready);
  const N = Math.round(27 * 30);
  // renderiza sempre em sequência (a foto congelada da câmera depende do quadro do clique)
  for (let f = 0; f < N; f++) {
    const t = f / 30;
    if (only && !only.some(x => Math.abs(x - t) < 1 / 60) && t > Math.max(...only)) break;
    const url = await p.evaluate(t => window.draw(t), t);
    if (!only || only.some(x => Math.abs(x - t) < 1 / 60))
      fs.writeFileSync(path.join(out, `f_${String(f).padStart(4, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
  }
  await b.close();
})();
