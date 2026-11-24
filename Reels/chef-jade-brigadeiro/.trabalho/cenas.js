// Chef Jade — a Jaguatirica da Cozinha (personagem original). Desenho vetorial.
// jade(humor, opts) -> string SVG (viewBox 0 -80 400 620). humor: feliz | sorriso | surpresa | piscada | lambendo | olhosFechados
// jadeLogo() -> string SVG do logo (viewBox 0 0 900 420)
(function (g) {
  const D = '#2B1B17', PELO = '#F2A73B', PELO2 = '#E08A22', CREME = '#FFF2DE', PRETO = '#241712',
    ROSA = '#E6407F', ROSA2 = '#F37AAE', ROSA3 = '#FFC2DA', VERDE = '#58B83A', VERDE2 = '#2F7A1C', OURO = '#F4C542', MADEIRA = '#D59A55', MADEIRA2 = '#A8682E';
  const pinta = (x, y, w, h, r = 0) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" transform="rotate(${r} ${x} ${y})" fill="${PRETO}"/>`;
  const pata = (x, y, s, cor) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${cor}"><ellipse cx="0" cy="8" rx="11" ry="9"/><circle cx="-11" cy="-6" r="5"/><circle cx="-4" cy="-12" r="5"/><circle cx="4" cy="-12" r="5"/><circle cx="11" cy="-6" r="5"/></g>`;

  function corpo() {
    let s = '';
    // cauda
    s += `<path d="M270 500C350 500 372 420 346 362" stroke="${D}" stroke-width="42" fill="none" stroke-linecap="round"/><path d="M270 500C350 500 372 420 346 362" stroke="${PELO}" stroke-width="29" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M336 476l14 14M354 446l18 6M360 414l19 -1M354 384l16 -8" stroke="${PRETO}" stroke-width="10" stroke-linecap="round"/><circle cx="346" cy="362" r="13" fill="${PRETO}"/>`;
    // tronco
    s += `<path d="M118 540C98 440 128 340 200 340C272 340 302 440 282 540Z" fill="${PELO}" stroke="${D}" stroke-width="7"/>`;
    s += pinta(134, 440, 9, 6, 30) + pinta(128, 480, 8, 6, -20) + pinta(268, 432, 9, 6, -30) + pinta(274, 476, 8, 6, 20) + pinta(140, 512, 7, 5) + pinta(262, 512, 7, 5);
    // jardineira rosa
    s += `<path d="M146 400h108l18 140H128Z" fill="${ROSA}" stroke="${D}" stroke-width="6" stroke-linejoin="round"/>`;
    s += `<path d="M152 400L140 352M248 400L260 352" stroke="${ROSA}" stroke-width="20" stroke-linecap="round"/><path d="M152 400L140 352M248 400L260 352" stroke="${D}" stroke-width="26" stroke-linecap="round" opacity="0"/>`;
    s += `<path d="M146 400h108" stroke="${ROSA2}" stroke-width="8"/>`;
    s += `<circle cx="160" cy="410" r="9" fill="${OURO}" stroke="${D}" stroke-width="4"/><circle cx="240" cy="410" r="9" fill="${OURO}" stroke="${D}" stroke-width="4"/>`;
    s += pata(200, 436, 1.1, '#fff');
    s += `<text x="200" y="492" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="46" fill="#fff" stroke="${D}" stroke-width="2" paint-order="stroke">Jade</text>`;
    // babados nos ombros
    for (const l of [-1, 1]) {
      const x = 200 + l * 70;
      s += `<path d="M${x - 34} 372q8 -22 22 -10q8 -20 22 -6q12 -16 22 2q10 10 -4 22q-30 14 -62 4q-10 -4 0 -12Z" fill="${ROSA2}" stroke="${D}" stroke-width="5" stroke-linejoin="round" transform="${l > 0 ? `translate(${2 * x} 0) scale(-1 1)` : ''}"/>`;
    }
    // braços
    s += `<path d="M132 392C104 414 100 456 124 472" stroke="${D}" stroke-width="42" fill="none" stroke-linecap="round"/><path d="M132 392C104 414 100 456 124 472" stroke="${PELO}" stroke-width="29" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M268 392C298 404 310 430 300 452" stroke="${D}" stroke-width="42" fill="none" stroke-linecap="round"/><path d="M268 392C298 404 310 430 300 452" stroke="${PELO}" stroke-width="29" fill="none" stroke-linecap="round"/>`;
    s += pinta(114, 432, 6, 4, 60) + pinta(120, 452, 5, 4) + pinta(292, 418, 6, 4, -40) + pinta(300, 438, 5, 4);
    // colher com coração vazado
    s += `<g transform="rotate(16 300 452)"><rect x="293" y="350" width="15" height="116" rx="7" fill="${MADEIRA}" stroke="${D}" stroke-width="5"/>` +
      `<path fill-rule="evenodd" d="M300 296c-22 0 -30 22 -30 34c0 22 14 34 30 34s30 -12 30 -34c0 -12 -8 -34 -30 -34ZM300 342c-12 -8 -16 -12 -16 -18c0 -5 4 -8 8 -8c4 0 6 2 8 5c2 -3 4 -5 8 -5c4 0 8 3 8 8c0 6 -4 10 -16 18Z" fill="${MADEIRA}" stroke="${D}" stroke-width="5"/></g>`;
    s += `<circle cx="124" cy="474" r="18" fill="${CREME}" stroke="${D}" stroke-width="6"/><circle cx="300" cy="452" r="18" fill="${CREME}" stroke="${D}" stroke-width="6"/>`;
    return s;
  }

  function olho(x, y, lado, humor) {
    if (humor === 'olhosFechados' || (humor === 'piscada' && lado > 0))
      return `<path d="M${x - 28} ${y + 2}Q${x} ${y - 22} ${x + 28} ${y + 2}" fill="none" stroke="${D}" stroke-width="8" stroke-linecap="round"/><path d="M${x + lado * 26} ${y - 2}l${lado * 12} -10M${x + lado * 20} ${y - 10}l${lado * 8} -12" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`;
    const surpresa = humor === 'surpresa';
    const r = surpresa ? 33 : 31;
    let s = `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.08}" fill="#fff" stroke="${D}" stroke-width="6"/>`;
    s += `<circle cx="${x + lado * 2}" cy="${y + 4}" r="${r * .74}" fill="${VERDE}"/><circle cx="${x + lado * 2}" cy="${y + 4}" r="${r * .74}" fill="none" stroke="${VERDE2}" stroke-width="5"/>`;
    s += `<ellipse cx="${x + lado * 2}" cy="${y + 6}" rx="${r * .3}" ry="${r * (surpresa ? .3 : .42)}" fill="${D}"/>`;
    s += `<circle cx="${x + lado * 2 + 9}" cy="${y - 6}" r="${r * .24}" fill="#fff"/><circle cx="${x + lado * 2 - 8}" cy="${y + 14}" r="${r * .1}" fill="#fff"/>`;
    // delineado + cílios no canto de fora
    s += `<path d="M${x - lado * 30} ${y - 12}Q${x} ${y - r * 1.25} ${x + lado * 34} ${y - 14}" fill="none" stroke="${D}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M${x + lado * 30} ${y - 18}l${lado * 16} -8M${x + lado * 22} ${y - 26}l${lado * 12} -12M${x + lado * 12} ${y - 31}l${lado * 6} -13" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`;
    return s;
  }

  function boca(humor) {
    const y = 268;
    let s = `<path d="M186 ${y - 22}Q200 ${y - 32} 214 ${y - 22}Q212 ${y - 8} 200 ${y - 4}Q188 ${y - 8} 186 ${y - 22}Z" fill="#F27BA0" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="194" cy="${y - 22}" rx="5" ry="3" fill="#fff" opacity=".7"/>`;
    s += `<path d="M200 ${y - 4}v8" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`;
    if (humor === 'sorriso' || humor === 'olhosFechados')
      s += `<path d="M174 ${y + 2}Q187 ${y + 18} 200 ${y + 4}Q213 ${y + 18} 226 ${y + 2}" stroke="${D}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    else if (humor === 'surpresa')
      s += `<ellipse cx="200" cy="${y + 22}" rx="16" ry="20" fill="#7a2338" stroke="${D}" stroke-width="5"/><ellipse cx="200" cy="${y + 32}" rx="10" ry="7" fill="#F27BA0"/>`;
    else if (humor === 'lambendo')
      s += `<path d="M172 ${y + 2}Q187 ${y + 18} 200 ${y + 4}Q213 ${y + 18} 228 ${y + 2}" stroke="${D}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M206 ${y + 12}q22 2 24 22q-2 14 -16 10q-12 -6 -8 -32Z" fill="#F27BA0" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>`;
    else // feliz: boca aberta com língua e presinhas
      s += `<path d="M168 ${y + 2}Q184 ${y + 4} 200 ${y + 4}Q216 ${y + 4} 232 ${y + 2}Q226 ${y + 46} 200 ${y + 46}Q174 ${y + 46} 168 ${y + 2}Z" fill="#7a2338" stroke="${D}" stroke-width="6" stroke-linejoin="round"/>` +
        `<path d="M180 ${y + 34}Q200 ${y + 18} 220 ${y + 34}Q214 ${y + 46} 200 ${y + 46}Q186 ${y + 46} 180 ${y + 34}Z" fill="#F27BA0"/>` +
        `<path d="M176 ${y + 4}l5 10 5 -10M214 ${y + 4}l5 10 5 -10" fill="#fff" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/>`;
    // bigodes
    for (const l of [-1, 1]) s += `<path d="M${200 + l * 54} ${y - 6}q${l * 40} -14 ${l * 76} -10M${200 + l * 56} ${y + 4}q${l * 40} 0 ${l * 78} 10M${200 + l * 52} ${y + 14}q${l * 34} 12 ${l * 66} 26" stroke="${D}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".75"/>`;
    return s;
  }

  function cabeca(humor) {
    let s = '';
    // orelhas arredondadas com interior rosa
    for (const l of [-1, 1]) {
      const x = 200 + l * 96, y = 112;
      s += `<path d="M${x - 46} ${y + 36}Q${x - 44} ${y - 46} ${x + l * 8} ${y - 46}Q${x + 46} ${y - 40} ${x + 46} ${y + 36}Z" fill="${PELO}" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>`;
      s += `<path d="M${x - 28} ${y + 30}Q${x - 26} ${y - 26} ${x + l * 6} ${y - 28}Q${x + 28} ${y - 22} ${x + 28} ${y + 30}Z" fill="#F6A6B8"/>`;
      s += `<path d="M${x - 14} ${y + 26}q6 -24 12 -34M${x + 4} ${y + 26}q4 -20 10 -30" stroke="#fff" stroke-width="3" opacity=".8" fill="none" stroke-linecap="round"/>`;
    }
    // cabeça com bochechas peludas
    s += `<path d="M200 96C292 96 336 160 332 220C340 228 342 240 330 246C338 256 334 268 320 270C300 318 254 338 200 338C146 338 100 318 80 270C66 268 62 256 70 246C58 240 60 228 68 220C64 160 108 96 200 96Z" fill="${PELO}" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>`;
    // focinho/queixo creme e contorno dos olhos
    s += `<path d="M118 252Q132 330 200 332Q268 330 282 252Q258 222 200 226Q142 222 118 252Z" fill="${CREME}"/>`;
    s += `<ellipse cx="146" cy="200" rx="46" ry="42" fill="${CREME}"/><ellipse cx="254" cy="200" rx="46" ry="42" fill="${CREME}"/>`;
    // pintas e listras da jaguatirica
    s += `<path d="M200 112v32M180 116l5 30M220 116l-5 30M162 124l8 24M238 124l-8 24" stroke="${PRETO}" stroke-width="8" stroke-linecap="round"/>`;
    s += pinta(130, 140, 9, 6, -30) + pinta(270, 140, 9, 6, 30) + pinta(110, 170, 8, 6, -50) + pinta(290, 170, 8, 6, 50) + pinta(96, 210, 7, 5, -70) + pinta(304, 210, 7, 5, 70);
    s += pinta(108, 246, 7, 5) + pinta(292, 246, 7, 5) + pinta(122, 276, 6, 5) + pinta(278, 276, 6, 5);
    for (const l of [-1, 1]) s += `<path d="M${200 + l * 92} 236q${l * 14} 10 ${l * 30} 10M${200 + l * 84} 254q${l * 16} 10 ${l * 34} 10" stroke="${PRETO}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    // bochechas rosadas
    s += `<ellipse cx="128" cy="258" rx="18" ry="10" fill="#FF7FA6" opacity=".55"/><ellipse cx="272" cy="258" rx="18" ry="10" fill="#FF7FA6" opacity=".55"/>`;
    s += olho(150, 202, -1, humor) + olho(250, 202, 1, humor);
    s += boca(humor);
    return s;
  }

  function chapeu() {
    let s = `<g>`;
    s += `<path d="M126 92C92 72 96 14 140 12C148 -26 196 -40 224 -14C256 -36 308 -10 296 30C330 44 318 92 280 96Z" fill="#fff" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>`;
    s += `<path d="M170 -2q-10 30 -4 60M236 -4q8 30 2 60" stroke="#ECE6EF" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M124 74Q200 58 278 74L284 112Q200 98 118 112Z" fill="#fff" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>`;
    s += pata(214, 88, .8, ROSA);
    // laço rosa
    s += `<g transform="rotate(-18 136 96)"><path d="M136 96L96 72Q86 96 98 118Z" fill="${ROSA}" stroke="${D}" stroke-width="6" stroke-linejoin="round"/><path d="M136 96L176 72Q186 96 174 118Z" fill="${ROSA}" stroke="${D}" stroke-width="6" stroke-linejoin="round"/><path d="M104 84q8 6 10 20M168 84q-8 6 -10 20" stroke="${ROSA2}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="136" cy="96" rx="14" ry="16" fill="${ROSA2}" stroke="${D}" stroke-width="6"/></g>`;
    return s + `</g>`;
  }

  g.jade = (humor = 'feliz') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -80 400 620" overflow="visible">${corpo()}<g transform="translate(0 14)">${cabeca(humor)}${chapeu()}</g></svg>`;
  g.jadeCabeca = (humor = 'feliz') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 -60 320 420" overflow="visible">${cabeca(humor)}${chapeu()}</svg>`;

  g.jadeLogo = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420">
    <path d="M90 120Q450 60 810 120L840 300Q450 250 60 300Z" fill="${MADEIRA2}" stroke="${D}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M110 138Q450 84 790 138L812 282Q450 236 88 282Z" fill="#7A4521"/>
    <path d="M150 160Q450 112 750 160" stroke="#8E5428" stroke-width="6" fill="none"/><path d="M140 250Q450 208 760 250" stroke="#8E5428" stroke-width="6" fill="none"/>
    <path d="M60 230q-50 -10 -40 30q30 20 70 -10M840 230q50 -10 40 30q-30 20 -70 -10" fill="${VERDE}" stroke="${D}" stroke-width="6"/>
    <text x="320" y="238" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="150" fill="#fff" stroke="${D}" stroke-width="12" paint-order="stroke">Chef</text>
    <text x="610" y="238" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="160" fill="${ROSA2}" stroke="${D}" stroke-width="12" paint-order="stroke">Jade</text>
    ${pata(770, 150, 1.6, OURO)}
    <path d="M190 290Q450 262 710 290L700 350Q450 324 200 350Z" fill="#F6E2C2" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>
    <text x="450" y="333" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="34" fill="${D}">A Jaguatirica da Cozinha</text>
    <g transform="translate(120 70) scale(.9)"><path d="M0 70C-24 54 -18 10 14 12C20 -12 56 -18 70 4C92 -10 124 12 112 40C134 52 124 80 100 80Z" fill="#fff" stroke="${D}" stroke-width="8" stroke-linejoin="round"/><rect x="2" y="66" width="96" height="26" rx="6" fill="#fff" stroke="${D}" stroke-width="8"/></g>
  </svg>`;
})(typeof window !== 'undefined' ? window : globalThis);
// Chef Jade — Brigadeiro "mexe o dedo no ritmo" (120 BPM, batida = 0,5 s).
// A câmera sobe e desce no ritmo (desce nas batidas pares, sobe nas ímpares) e desliza pro lado a cada etapa.
// Montado em .trabalho/cenas.js junto com personagem/jaguatirica/jade.js
(() => {
const M = MQ, D = '#2B1B17', B = .5, b = n => n * B, W = 1080, H = 1920;
const PELO = '#F2A73B', PRETO = '#241712', ROSA = '#E6407F';
const S = (pai, x, y, w, h, inner, vb) => M.el(pai, `<svg class="abs" style="left:${x}px;top:${y}px;overflow:visible" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}">${inner}</svg>`);
const box = (pai, x, y, w, h, css = '') => M.el(pai, `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${css}"></div>`);
const bob = t => Math.cos(Math.PI * t / B);            // +1 = baixo (batidas pares), -1 = cima (ímpares)
const pulso = t => { const ph = ((t % B) + B) % B / B; return Math.exp(-ph * 7); };
let seed = 5; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const ESTACOES = [0, b(6), b(14), b(19), b(25)];        // início de cada cenário (s)

function jadeCamadas(pai, x, y, w, plano, fn = jade, asp = 620 / 400) {
  const h = Math.round(w * asp), wrap = box(pai, x, y, w, h), inn = box(wrap, 0, 0, w, h, 'transform-origin:50% 100%');
  plano.forEach(([t, hu], i) => {
    const L = M.el(inn, `<div class="abs" style="left:0;top:0;width:${w}px;height:${h}px">${fn(hu)}</div>`);
    L.firstElementChild.setAttribute('width', w); L.firstElementChild.setAttribute('height', h);
    const fim = i < plano.length - 1 ? plano[i + 1][0] : 99;
    M.up(tt => { L.style.visibility = tt >= t && tt < fim ? 'visible' : 'hidden'; });
  });
  M.up(t => { const p = pulso(t); inn.style.transform = `scale(${(1 + .03 * p).toFixed(4)},${(1 - .025 * p).toFixed(4)}) rotate(${(3 * Math.sin(t * Math.PI / B / 2)).toFixed(2)}deg)`; });
  return wrap;
}
const DEDO = `<path d="M110 700V360" stroke="${D}" stroke-width="150" stroke-linecap="round"/><path d="M110 700V360" stroke="${PELO}" stroke-width="134" stroke-linecap="round"/>
  <ellipse cx="90" cy="470" rx="14" ry="10" fill="${PRETO}"/><ellipse cx="140" cy="560" rx="12" ry="9" fill="${PRETO}"/><ellipse cx="80" cy="620" rx="13" ry="9" fill="${PRETO}"/>
  <path d="M60 320C20 300 20 230 70 220C110 212 200 214 220 260C236 300 216 350 170 360C130 368 90 350 60 320Z" fill="${PELO}" stroke="${D}" stroke-width="8"/>
  <path d="M150 230q34 -6 46 18q8 22 -18 28M172 280q30 0 34 22q2 22 -30 22" fill="none" stroke="${D}" stroke-width="7" stroke-linecap="round"/>
  <rect x="70" y="40" width="74" height="210" rx="37" fill="${PELO}" stroke="${D}" stroke-width="8"/>
  <ellipse cx="107" cy="78" rx="24" ry="28" fill="#F6A6B8"/><path d="M100 40q8 -26 14 0" fill="#fff" stroke="${D}" stroke-width="4"/>
  <ellipse cx="96" cy="150" rx="8" ry="6" fill="${PRETO}"/><ellipse cx="122" cy="196" rx="7" ry="5" fill="${PRETO}"/>
  <path d="M84 230q22 10 44 0" stroke="${D}" stroke-width="5" fill="none" stroke-linecap="round"/>`;

function titulo(pai, l1, l2, t0, t1, top = 230) {
  const fs = Math.min(l2 ? 100 : 116, Math.floor(980 / (Math.max(l1.length, (l2 || '').length) * .72)));
  const w = M.el(pai, `<div class="abs" style="left:0;right:0;top:${top}px;text-align:center;font:900 ${fs}px/1.02 Montserrat,sans-serif;color:#fff;-webkit-text-stroke:${Math.round(fs * .17)}px ${D};paint-order:stroke fill;text-shadow:0 8px 0 ${D}">${l1}${l2 ? `<br><span style="color:#FFD23F">${l2}</span>` : ''}</div>`);
  M.win(w, t0, t1); M.K(w, { s: .4, o: 0 }).to(t0, { s: 1, o: 1 }, .28, M.E.back2);
  M.up(t => { if (t >= t0 && t < t1) w.style.scale = (1 + .05 * pulso(t)).toFixed(3); });
  return w;
}

window.CENA = {
  brigadeiro(c) {
    const R = M.el(M.PALCOS, `<div class="abs dec" style="left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;background:#F4A9C7"></div>`);
    const cam = box(R, 0, 0, W, H);
    const mundo = box(cam, 0, 0, W * 5, H);
    M.up(t => { cam.style.transform = `translateY(${(55 * bob(t)).toFixed(1)}px)`; });
    const K = M.K(mundo);
    ESTACOES.slice(1).forEach((t, i) => { K.to(t - .32, { x: -W * (i + 1) }, .36, M.E.io); M.sfx('whoosh', t - .32, .5); });

    // ---------- cenários ----------
    const cores = [['#F9C6DA', '#E86FA0', '#F7A3C4'], ['#CDEFE3', '#3FB28A', '#7DD3B3'], ['#FFE2C4', '#F08A4B', '#FFB27D'], ['#FFF3B8', '#E9475A', '#FF8A96'], ['#FAD0E4', '#E6407F', '#F37AAE']];
    cores.forEach(([parede, bal, topo], i) => {
      const x = i * W;
      box(mundo, x, -100, W, 1500, `background:${parede};background-image:linear-gradient(rgba(255,255,255,.45) 3px,transparent 3px),linear-gradient(90deg,rgba(255,255,255,.45) 3px,transparent 3px);background-size:90px 90px`);
      box(mundo, x + 140, 300, 800, 800, `border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.6),transparent 65%)`);
      const bal_ = S(mundo, x, 1250, W, 800, `<rect width="${W}" height="800" fill="${bal}"/><rect width="${W}" height="36" fill="${topo}" stroke="${D}" stroke-width="6"/>` +
        (i === 3 ? Array.from({ length: 12 }, (_, k) => `<rect x="${k * 90}" y="36" width="45" height="764" fill="#fff" opacity=".35"/>`).join('') :
          [0, 1, 2, 3].map(k => `<rect x="${30 + k * 262}" y="70" width="236" height="300" rx="18" fill="${topo}" stroke="${D}" stroke-width="5"/><circle cx="${148 + k * 262}" cy="110" r="10" fill="#F4C542" stroke="${D}" stroke-width="4"/>`).join('')));
      bal_.style.zIndex = 3;
      S(mundo, x, 560, W, 120, `<rect x="0" y="96" width="${W}" height="16" rx="6" fill="#C98A4B" stroke="${D}" stroke-width="5"/>` +
        [[70 + i * 30, '#FFE08A'], [200, '#F7D6A8'], [800 - i * 20, '#C77B4A'], [930, '#FFB3CF']].map(([px, cor]) => `<rect x="${px}" y="14" width="80" height="82" rx="14" fill="${cor}" stroke="${D}" stroke-width="5"/><rect x="${px + 6}" y="2" width="68" height="16" rx="5" fill="${ROSA}" stroke="${D}" stroke-width="4"/>`).join(''));
    });

    // ---------- 1) Introdução: dedinho da Jade (0–3 s) ----------
    jadeCamadas(mundo, 30, 600, 560, [[0, 'surpresa'], [b(1), 'feliz'], [b(3), 'piscada'], [b(4), 'feliz']]);
    const dedoW = box(mundo, 650, 690, 230, 720);
    const dedoIn = box(dedoW, 0, 0, 230, 720);
    S(dedoIn, 0, 0, 230, 720, DEDO);
    M.up(t => { dedoIn.style.transform = `translateY(${(110 * bob(t)).toFixed(1)}px)`; });
    M.K(dedoW, { y: 700, o: 0 }).to(0, { y: 0, o: 1 }, .4, M.E.back).to(b(5) + .3, { o: 0, s: .6 }, .25);
    const cb = M.el(R, `<div class="abs" style="left:0;right:0;top:470px;text-align:center;font:900 64px Montserrat;color:#fff;-webkit-text-stroke:11px ${D};paint-order:stroke fill"></div>`);
    M.up(t => { if (t < b(6) - .3) { const up = bob(t) < 0; cb.innerHTML = up ? '⬆ CIMA' : '⬇ BAIXO'; cb.style.color = up ? '#FFD23F' : '#fff'; cb.style.visibility = 'visible'; } else cb.style.visibility = 'hidden'; });
    titulo(R, 'MEXA O DEDO', 'JUNTO!', 0, b(6) - .3, 220);

    // ---------- 2) Tigela: ingredientes caem na descida, tigela pula na subida (3–7 s) ----------
    const X2 = W;
    const tig = box(mundo, X2 + 200, 880, 680, 400, 'z-index:4');
    S(tig, 0, 0, 680, 400, `<ellipse cx="340" cy="80" rx="320" ry="70" fill="#7DD3B3" stroke="${D}" stroke-width="8"/>`);
    [['#F6E7C6', b(6)], ['#B98258', b(8)], ['#8F5434', b(10)], ['#6E3A22', b(12)]].forEach(([cor, t]) => {
      const e = S(tig, 0, 0, 680, 400, `<ellipse cx="340" cy="86" rx="270" ry="50" fill="${cor}"/>`); M.K(e, { o: 0 }).to(t + .02, { o: 1 }, .25);
    });
    S(tig, 0, 0, 680, 400, `<path d="M20 80Q40 360 340 380Q640 360 660 80Q600 150 340 150Q80 150 20 80Z" fill="#3FB28A" stroke="${D}" stroke-width="8" stroke-linejoin="round"/><path d="M90 170q40 120 120 160" stroke="#9BE3C8" stroke-width="16" fill="none" stroke-linecap="round"/>`);
    M.up(t => { if (t > ESTACOES[1] - .4 && t < ESTACOES[2]) { const sub = Math.max(0, -bob(t)); tig.style.transform = `translateY(${(-70 * sub * sub).toFixed(1)}px) scale(${(1 + .04 * pulso(t)).toFixed(3)},${(1 - .04 * pulso(t)).toFixed(3)})`; } });
    const cair = (el, tChega, x0 = 0) => { M.K(el, { o: 0, y: -620, x: x0, r: -15 }).set(tChega - .45, { o: 1 }).to(tChega - .45, { y: 0, x: 0, r: 0 }, .45, M.E.in).to(tChega + .02, { sy: .55, sx: 1.25, o: 0 }, .18); M.sfx('drop', tChega, .55); };
    const lata = S(mundo, X2 + 700, 330, 200, 240, `<g transform="rotate(-120 100 120)"><rect x="30" y="20" width="140" height="200" rx="20" fill="#5BA4E8" stroke="${D}" stroke-width="7"/><ellipse cx="100" cy="22" rx="70" ry="16" fill="#cfd6e4" stroke="${D}" stroke-width="7"/><rect x="40" y="80" width="120" height="80" rx="10" fill="#fff"/><text x="100" y="128" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="26" fill="${D}">LEITE</text></g>`);
    M.K(lata, { o: 0, x: 300 }).to(b(6) - .6, { o: 1, x: 0 }, .25, M.E.back).to(b(7) + .2, { x: 400, o: 0 }, .3, M.E.in);
    const gotaLeite = S(mundo, X2 + 440, 700, 200, 200, `<path d="M100 10C60 80 30 110 30 140a70 60 0 0 0 140 0c0 -30 -30 -60 -70 -130Z" fill="#F6E7C6" stroke="${D}" stroke-width="7"/>`);
    cair(gotaLeite, b(6), 160);
    const colherCacau = `<ellipse cx="80" cy="60" rx="74" ry="46" fill="#C98A4B" stroke="${D}" stroke-width="7"/><ellipse cx="80" cy="50" rx="56" ry="26" fill="#6E3A22"/><rect x="140" y="48" width="200" height="24" rx="12" fill="#C98A4B" stroke="${D}" stroke-width="7"/>`;
    cair(S(mundo, X2 + 430, 720, 220, 120, colherCacau), b(8), -120);
    for (let i = 0; i < 8; i++) { const n = box(mundo, X2 + 500 + (i - 4) * 40, 930, 70, 70, `border-radius:50%;background:#8B5233;opacity:.85`); M.K(n, { o: 0, s: .2 }).to(b(8), { o: .85, s: 1 }, .08).to(b(8) + .05, { y: -140 - (i % 3) * 40, x: (i - 3.5) * 40, s: 2, o: 0 }, .7, M.E.out); }
    const mant = S(mundo, X2 + 470, 760, 150, 120, `<path d="M10 40l60 -28 70 28 -60 28Z" fill="#FFF3A6" stroke="${D}" stroke-width="7" stroke-linejoin="round"/><path d="M10 40v44l70 28v-44ZM80 68v44l60 -28v-44Z" fill="#FFE066" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>`);
    cair(mant, b(10), 140);
    cair(S(mundo, X2 + 430, 720, 220, 120, colherCacau), b(12), -140);
    for (let k = 7; k < 14; k += 2) M.sfx('pop', b(k), .3);
    jadeCamadas(mundo, X2 - 50, 860, 330, [[0, 'feliz'], [b(6), 'surpresa'], [b(7), 'feliz'], [b(8), 'surpresa'], [b(9), 'piscada'], [b(10), 'surpresa'], [b(11), 'lambendo']], jadeCabeca, 420 / 320);
    titulo(R, 'LEITE', 'CONDENSADO', b(6) - .3, b(8) - .1, 210);
    titulo(R, 'CHOCOLATE!', '', b(8) - .1, b(10) - .1, 250);
    titulo(R, 'MANTEIGA!', '', b(10) - .1, b(12) - .1, 250);
    titulo(R, '+ CHOCOLATE!', '', b(12) - .1, ESTACOES[2] - .3, 250);

    // ---------- 3) Fogão: mexe, mexe (7–9,5 s) ----------
    const X3 = 2 * W;
    jadeCamadas(mundo, X3 - 10, 560, 520, [[0, 'feliz'], [b(15), 'olhosFechados'], [b(17), 'feliz']]);
    const fogao = S(mundo, X3 + 480, 1210, 560, 60, `<rect x="0" y="0" width="560" height="56" rx="16" fill="#3a3040" stroke="${D}" stroke-width="6"/>`);
    const fogo = S(mundo, X3 + 560, 1150, 400, 70, [0, 1, 2, 3, 4, 5].map(k => `<path d="M${30 + k * 66} 66q-22 -30 0 -60q22 30 0 60Z" fill="${k % 2 ? '#FFB020' : '#FF6B3D'}" stroke="${D}" stroke-width="4"/>`).join(''));
    M.up(t => { fogo.style.transformOrigin = '50% 100%'; fogo.style.transform = `scaleY(${(.75 + .3 * Math.abs(Math.sin(t * 13))).toFixed(3)})`; });
    const pan = box(mundo, X3 + 500, 900, 520, 320);
    S(pan, 0, 0, 520, 320, `<rect x="-20" y="100" width="80" height="30" rx="15" fill="#3a3040" stroke="${D}" stroke-width="7"/><rect x="460" y="100" width="80" height="30" rx="15" fill="#3a3040" stroke="${D}" stroke-width="7"/><path d="M40 80h440l-22 210q-4 24 -30 24H92q-26 0 -30 -24Z" fill="${ROSA}" stroke="${D}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="260" cy="80" rx="222" ry="46" fill="#6E3A22" stroke="${D}" stroke-width="8"/><ellipse cx="200" cy="70" rx="50" ry="10" fill="#fff" opacity=".3"/>`);
    const colher = S(mundo, X3 + 680, 520, 140, 480, `<rect x="60" y="0" width="24" height="420" rx="12" fill="#D59A55" stroke="${D}" stroke-width="7"/><ellipse cx="72" cy="420" rx="42" ry="30" fill="#D59A55" stroke="${D}" stroke-width="7"/>`);
    M.up(t => { const a = Math.PI * t / B; colher.style.transform = `translate(${(90 * Math.sin(a)).toFixed(1)}px,${(60 * bob(t)).toFixed(1)}px) rotate(${(10 * Math.sin(a)).toFixed(1)}deg)`; });
    for (let k = 14; k < 19; k++) { const bo = box(mundo, X3 + 620 + (k % 3) * 120, 960, 40, 40, `border-radius:50%;border:6px solid #4a2616;background:#8B5233`); M.K(bo, { o: 0, s: .2 }).to(b(k), { o: 1, s: 1 }, .1).to(b(k) + .25, { s: 1.5, o: 0, y: -60 }, .2); M.sfx('swish', b(k), .3); }
    [fogao, pan, colher, fogo].forEach(e => e.style.zIndex = 5);
    titulo(R, 'MEXE,', 'MEXE!', ESTACOES[2] - .3, ESTACOES[3] - .3, 210);

    // ---------- 4) Mesa: bolinhas na descida, granulado na subida (9,5–12,5 s) ----------
    const X4 = 3 * W;
    const prato4 = S(mundo, X4 + 140, 1060, 800, 220, `<ellipse cx="400" cy="120" rx="390" ry="90" fill="#fff" stroke="${D}" stroke-width="8"/><ellipse cx="400" cy="110" rx="300" ry="58" fill="#F4F0F6"/>`);
    prato4.style.zIndex = 4;
    const pos = [[330, 1000], [470, 980], [610, 980], [750, 1000], [400, 1080], [680, 1080]];
    pos.forEach(([x, y], i) => {
      const tB = b(20 + 2 * Math.floor(i / 2));
      const f = box(mundo, X4 + x - 50, y + 40, 100, 56, `z-index:5;background:#FF8FAB;border:6px solid ${D};clip-path:polygon(0 0,100% 0,88% 100%,12% 100%)`);
      M.K(f, { o: 0, s: .3 }).to(b(24), { o: 1, s: 1 }, .25, M.E.back2);
      const g = box(mundo, X4 + x - 45, y - 40, 90, 90, `z-index:6;border-radius:50%;background:radial-gradient(circle at 35% 30%,#9B5E3C,#5a2d18 70%);border:6px solid ${D}`);
      M.K(g, { o: 0, y: -700 }).set(tB - .4, { o: 1 }).to(tB - .4, { y: 0 }, .4, M.E.in).to(tB, { sy: .8, sx: 1.15 }, .06).to(tB + .06, { sy: 1, sx: 1 }, .25, M.E.spring);
      M.sfx('pop', tB, .45);
      const gr = M.el(g, `<div class="abs" style="inset:0;border-radius:50%;background-image:radial-gradient(#2a120a 30%,transparent 32%),radial-gradient(#FF8FAB 25%,transparent 27%);background-size:16px 16px,23px 23px;background-position:0 0,8px 8px"></div>`);
      M.K(gr, { o: 0 }).to(b(21 + 2 * Math.floor(i / 2)) + .1, { o: 1 }, .3);
    });
    [21, 23].forEach(k => {
      for (let i = 0; i < 40; i++) {
        const x = X4 + 250 + rnd() * 580, r = rnd() * 180, s = box(mundo, x, 1040, 10, 26, `z-index:7;border-radius:5px;background:${i % 5 === 0 ? '#FF8FAB' : '#3a1a0e'}`);
        M.K(s, { o: 0, r }).to(b(k) - .05, { o: 1 }, .04).to(b(k) - .05, { y: -420 - rnd() * 200, r: r + 120 }, .25, M.E.out).to(b(k) + .2, { y: -40 + rnd() * 60, r: r + 320 }, .35, M.E.in).to(b(k) + .55, { o: 0 }, .15);
      }
      M.sfx('shimmer', b(k), .35);
    });
    titulo(R, 'BOLINHAS', '+ GRANULADO', ESTACOES[3] - .3, ESTACOES[4] - .3, 210);

    // ---------- 5) Final: Jade com o prato (12,5–15,5 s) ----------
    const X5 = 4 * W;
    jadeCamadas(mundo, X5 + 200, 700, 680, [[0, 'feliz'], [b(26), 'lambendo'], [b(28), 'olhosFechados'], [b(29), 'piscada']]);
    const prato5 = S(mundo, X5 + 190, 1200, 700, 170, `<ellipse cx="350" cy="100" rx="340" ry="70" fill="#fff" stroke="${D}" stroke-width="8"/>` +
      [[200, 70], [300, 50], [400, 50], [500, 70], [250, 100], [450, 100]].map(([x, y]) => `<path d="M${x - 46} ${y + 20}h92l-10 40h-72Z" fill="#FF8FAB" stroke="${D}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="40" fill="#5a2d18" stroke="${D}" stroke-width="6"/><circle cx="${x - 12}" cy="${y - 12}" r="5" fill="#2a120a"/><circle cx="${x + 10}" cy="${y - 4}" r="5" fill="#FF8FAB"/><circle cx="${x - 2}" cy="${y + 14}" r="5" fill="#2a120a"/>`).join(''));
    prato5.style.zIndex = 4;
    for (let i = 0; i < 8; i++) {
      const hh = S(mundo, X5 + 120 + i * 110, 900, 64, 60, `<path d="M32 56C-10 28 2 2 17 2c9 0 13 6 15 11c2-5 6-11 15-11c15 0 27 26-15 54Z" fill="#FF4F8B" stroke="${D}" stroke-width="5"/>`);
      M.K(hh, { o: 0, s: .3 }).to(b(27) + i * .1, { o: 1, s: 1 }, .2, M.E.back2).to(b(27) + i * .1, { y: -480 - (i % 3) * 60, x: (i - 3.5) * 16 }, 1.5, M.E.out).to(b(27) + i * .1 + 1.1, { o: 0 }, .4);
    }
    titulo(R, 'HUMMM!', '', ESTACOES[4] - .3, b(28) + .2, 250);
    const logo = M.el(R, `<div class="abs" style="left:90px;top:230px;width:900px;height:420px">${jadeLogo()}</div>`);
    logo.firstElementChild.setAttribute('width', 900); logo.firstElementChild.setAttribute('height', 420);
    M.K(logo, { o: 0, s: .3, r: -8 }).to(b(28) + .2, { o: 1, s: 1, r: 0 }, .45, M.E.back2).float(6, 1);
    M.sfx('ding', b(28) + .2, .5);
    const segue = M.el(R, `<div class="abs" style="left:0;right:0;top:640px;display:flex;justify-content:center"><div class="cp-pill" style="position:relative">SEGUE PRA MAIS RECEITINHAS 💖</div></div>`);
    M.K(segue, { o: 0, y: 30 }).to(b(29), { o: 1, y: 0 }, .3, M.E.back);
  }
};
})();
