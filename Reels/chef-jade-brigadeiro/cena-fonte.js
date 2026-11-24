// Chef Jade — Brigadeiro "mexe o dedo no ritmo" (120 BPM, batida = 0,5 s).
// A câmera sobe e desce no ritmo (desce nas batidas pares, sobe nas ímpares) e desliza pro lado a cada etapa.
// Montado em .trabalho/cenas.js junto com personagem/jaguatirica/jade.js
(() => {
const M = MQ, D = '#2B1B17', B = .5, b = n => n * B, W = 1080, H = 1920;
const PELO = '#F2A73B', PRETO = '#241712', ROSA = '#E6407F';
const S = (pai, x, y, w, h, inner, vb) => M.el(pai, `<svg class="abs" style="left:${x}px;top:${y}px;overflow:visible" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}">${inner}</svg>`);
const box = (pai, x, y, w, h, css = '') => M.el(pai, `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${css}"></div>`);
const FIM = 15;                                         // último "tchan!" da música: o sobe e desce para aqui
const bob = t => Math.cos(Math.PI * t / B) * (t < FIM ? 1 : Math.max(0, 1 - (t - FIM) / .35));  // +1 = baixo (pares), -1 = cima (ímpares)
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
    jadeCamadas(mundo, -10, 620, 560, [[0, 'surpresa'], [b(1), 'feliz'], [b(3), 'piscada'], [b(4), 'feliz']]);
    const dedoW = box(mundo, 430, 600, 720, 230);          // entra pela lateral direita, na horizontal
    const dedoIn = box(dedoW, 0, 0, 720, 230);
    S(dedoIn, 0, 0, 720, 230, `<g transform="translate(0 230) rotate(-90)">${DEDO}</g>`);
    M.up(t => { dedoIn.style.transform = `translateY(${(110 * bob(t)).toFixed(1)}px)`; });
    M.K(dedoW, { x: 700 }).to(0, { x: 0 }, .45, M.E.back).to(b(5) - .2, { x: 760, o: 0 }, .35, M.E.in);
    const cb = M.el(R, `<div class="abs" style="left:60px;width:440px;top:470px;text-align:left;font:900 64px Montserrat;color:#fff;-webkit-text-stroke:11px ${D};paint-order:stroke fill"></div>`);
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
