// Renderiza a cena 3D da Parte 3: node render3d.js <pasta_saida> [t1,t2,...]   (sem lista = 0..27 s a 30 fps)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const srv = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(0, '127.0.0.1');
(async () => {
  const out = process.argv[2] || 'frames3d', only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  p.on('pageerror', e => { console.error('ERRO NA PÁGINA:', e.message); process.exit(1); });
  p.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await p.goto(`http://127.0.0.1:${srv.address().port}/cena3d-p3.html`);
  await p.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  await p.evaluate(a => window.setAmp(a), JSON.parse(fs.readFileSync(path.join(ROOT, 'amp3.json'))));
  const TJ = JSON.parse(fs.readFileSync(path.join(ROOT, '../../audio/parte3/tempos-parte3.json')));
  await p.evaluate(j => { window.setEv(j.eventos); window.setFalas(j.falas); }, TJ);
  const SPECIAL = [];
  const N = Math.round(TJ.eventos.total * 30), last = only ? Math.max(...only) : 99;
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    const t = f / 30; if (t > last + 0.02) break;
    const want = !only || only.some(x => Math.abs(x - t) < 1 / 60);
    // quadros não pedidos: só precisam rodar até o clique da câmera (foto congelada)
    if (!want && !SPECIAL.some(s => t >= s && t < s + 0.05)) continue;
    const url = await p.evaluate(t => window.draw(t), t);
    if (want) fs.writeFileSync(path.join(out, `f_${String(f).padStart(4, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
    if (f % 90 === 0 && !only) console.log(`quadro ${f}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  await b.close(); srv.close();
})();
