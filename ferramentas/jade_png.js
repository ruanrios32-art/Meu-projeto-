// Gera PNGs transparentes da Chef Jade (2D) pra usar dentro de cenas 3D. uso: node jade_png.js <pasta-saida>
const { chromium } = require('playwright'); const path = require('path');
const JADE = path.resolve(__dirname, '../personagem/jaguatirica/jade.js');
const F = '/home/user/Meu-projeto-/.claude/skills/maquina-de-reels/fontes/arquivos';
(async () => {
  const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2000, height: 1600 } });
  const fs = require('fs'); const pag = path.join(out, '_pag.html'); fs.writeFileSync(pag, `<html><head><style>@font-face{font-family:Caveat;font-weight:700;src:url(file://${F}/caveat-latin-700-normal.woff2)}@font-face{font-family:Poppins;font-weight:800;src:url(file://${F}/poppins-latin-800-normal.woff2)}body{margin:0;background:transparent}#a{display:inline-block}</style></head><body><div id="a"></div><span style="font:700 10px Caveat">Jade</span><span style="font:800 10px Poppins">a</span></body></html>`); await p.goto('file://' + path.resolve(pag)); await p.evaluate(() => document.fonts.ready);
  await p.addScriptTag({ path: JADE });
  const DEDO = require('fs').readFileSync(path.resolve(__dirname, 'dedo-jade.svg'), 'utf8');
  const itens = [];
  for (const h of ['feliz', 'surpresa', 'piscada', 'olhosFechados', 'lambendo', 'sorriso']) itens.push(['corpo-' + h, `jade('${h}')`, 800, 1240]);
  for (const h of ['feliz', 'surpresa', 'piscada', 'lambendo']) itens.push(['cabeca-' + h, `jadeCabeca('${h}')`, 640, 840]);
  itens.push(['logo', 'jadeLogo()', 1800, 840]);
  for (const [nome, expr, w, h] of itens) {
    await p.evaluate(([e, w, h]) => { const a = document.getElementById('a'); a.innerHTML = eval(e); const s = a.firstElementChild; s.setAttribute('width', w); s.setAttribute('height', h); a.style.width = w + 'px'; a.style.height = h + 'px'; }, [expr, w, h]);
    await p.waitForTimeout(150);
    await p.locator('#a').screenshot({ path: path.join(out, nome + '.png'), omitBackground: true });
  }
  await p.evaluate(s => { const a = document.getElementById('a'); a.innerHTML = s; a.style.width = '1440px'; a.style.height = '460px'; }, DEDO);
  await p.locator('#a').screenshot({ path: path.join(out, 'dedo.png'), omitBackground: true });
  await b.close(); fs.unlinkSync(pag); console.log('ok');
})();
