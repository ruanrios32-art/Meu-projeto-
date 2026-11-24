// Chef Jade — Brigadeiro no ritmo (120 BPM, batida = 0,5 s). Montado em .trabalho/cenas.js junto com jade.js
(() => {
const M = MQ, D = '#2B1B17', B = .5, b = n => n * B, W = 1080;
const S = (pai, x, y, w, h, inner, vb) => M.el(pai, `<svg class="abs" style="left:${x}px;top:${y}px;overflow:visible" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}">${inner}</svg>`);
const box = (pai, x, y, w, h, css = '') => M.el(pai, `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${css}"></div>`);
const ent = (el, t, tipo = 'pop', d = .4) => { M.entra(el, t, tipo, d); return el._k; };
const pulso = t => { const ph = ((t % B) + B) % B / B; return Math.exp(-ph * 7); };
let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

function pill(pai, txt, t0, t1, y = 440) {
  const w = M.el(pai, `<div class="abs" style="left:0;right:0;top:${y}px;display:flex;justify-content:center"></div>`);
  const p = M.el(w, `<div class="cp-pill" style="position:relative;background:#fff;border-color:${D}">${txt}</div>`);
  M.win(w, t0, t1); ent(p, t0, 'pop', .35).float(4, 0); M.sfx('pop2', t0, .4);
}

window.CENA = {
  brigadeiro(c) {
    const R = M.el(M.PALCOS, `<div class="abs dec" style="left:0;top:0;width:${W}px;height:1920px;overflow:hidden"></div>`);
    // ---------- cozinha ----------
    box(R, 0, 0, W, 1920, `background:linear-gradient(#F9C6DA,#F4A9C7 60%);`).classList.add('dec');
    box(R, 0, 0, W, 1200, `background-image:linear-gradient(rgba(255,255,255,.35) 3px,transparent 3px),linear-gradient(90deg,rgba(255,255,255,.35) 3px,transparent 3px);background-size:90px 90px;opacity:.6`).classList.add('dec');
    const luz = box(R, 140, 380, 800, 800, `border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.55),transparent 65%)`);
    M.up(t => { luz.style.opacity = (.6 + .4 * pulso(t)).toFixed(3); });
    // prateleira com potes
    S(R, 0, 520, W, 140, `<rect x="0" y="96" width="${W}" height="18" rx="6" fill="#C98A4B" stroke="${D}" stroke-width="5"/>` +
      [[60, '#FFE08A', 'AÇÚCAR'], [190, '#F7D6A8', 'FARINHA'], [800, '#C77B4A', 'CACAU'], [930, '#FFB3CF', 'GRANUL.']].map(([x, cor, txt]) =>
        `<rect x="${x}" y="8" width="96" height="88" rx="16" fill="${cor}" stroke="${D}" stroke-width="5"/><rect x="${x + 8}" y="-4" width="80" height="18" rx="6" fill="#E6407F" stroke="${D}" stroke-width="5"/><rect x="${x + 12}" y="40" width="72" height="26" rx="6" fill="#fff" opacity=".85"/><text x="${x + 48}" y="59" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="14" fill="${D}">${txt}</text>`).join(''));
    // folhagem decorativa
    S(R, -20, 140, 260, 380, [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${60 + (i % 2) * 50}" cy="${40 + i * 55}" rx="40" ry="22" transform="rotate(${i % 2 ? 30 : -30} ${60 + (i % 2) * 50} ${40 + i * 55})" fill="${i % 2 ? '#6CC04A' : '#4FA83A'}" stroke="${D}" stroke-width="4"/>`).join('') + `<path d="M80 0C70 120 100 220 90 330" stroke="#3E7F2C" stroke-width="6" fill="none"/>`);

    // ---------- Chef Jade ----------
    const humores = [[0, 'surpresa'], [b(1), 'feliz'], [b(8), 'surpresa'], [b(9), 'feliz'], [b(12), 'piscada'], [b(14), 'feliz'], [b(16), 'olhosFechados'], [b(20), 'sorriso'], [b(24), 'feliz'], [b(28), 'lambendo'], [b(29.5), 'piscada']];
    const jWrap = box(R, 0, 395, 640, 990);
    const jIn = box(jWrap, 0, 0, 640, 990, 'transform-origin:50% 100%');
    humores.forEach(([t, h], i) => {
      const L = M.el(jIn, `<div class="abs" style="left:0;top:0;width:640px;height:990px">${jade(h)}</div>`);
      L.firstElementChild.setAttribute('width', 640); L.firstElementChild.setAttribute('height', 990);
      const fim = i < humores.length - 1 ? humores[i + 1][0] : 99;
      M.up(tt => { L.style.visibility = tt >= t && tt < fim ? 'visible' : 'hidden'; });
    });
    M.K(jWrap, { y: 500 }).to(0, { y: 0 }, .45, M.E.back);
    M.up(t => { const p = pulso(t); jIn.style.transform = `translateY(${(-14 * p).toFixed(1)}px) scale(${(1 + .025 * p).toFixed(4)},${(1 - .02 * p).toFixed(4)}) rotate(${(2.5 * Math.sin(t * Math.PI)).toFixed(2)}deg)`; });

    // ---------- balcão ----------
    S(R, 0, 1120, W, 800, `<rect x="0" y="0" width="${W}" height="800" fill="#E86FA0"/><rect x="0" y="0" width="${W}" height="34" fill="#F7A3C4" stroke="${D}" stroke-width="6"/>` +
      [0, 1, 2, 3].map(i => `<rect x="${30 + i * 262}" y="70" width="236" height="300" rx="18" fill="#F08AB4" stroke="${D}" stroke-width="5"/><circle cx="${148 + i * 262}" cy="110" r="10" fill="#F4C542" stroke="${D}" stroke-width="4"/>`).join(''));
    // fogareiro + chama
    S(R, 560, 1074, 380, 60, `<rect x="10" y="10" width="360" height="46" rx="14" fill="#3a3040" stroke="${D}" stroke-width="6"/><circle cx="60" cy="33" r="10" fill="#E6407F"/><circle cx="320" cy="33" r="10" fill="#E6407F"/>`);
    const chamas = S(R, 650, 1040, 200, 50, [0, 1, 2, 3, 4].map(i => `<path d="M${20 + i * 40} 46q-14 -20 0 -40q14 20 0 40Z" fill="${i % 2 ? '#FFB020' : '#5BC0F8'}" stroke="${D}" stroke-width="3"/>`).join(''));
    M.up(t => { chamas.style.transform = `scaleY(${(.8 + .25 * Math.abs(Math.sin(t * 13))).toFixed(3)})`; chamas.style.transformOrigin = '50% 100%'; });

    // ---------- panela ----------
    const panela = box(R, 560, 860, 380, 240);
    S(panela, 0, 0, 380, 240, `<rect x="-10" y="80" width="60" height="24" rx="12" fill="#3a3040" stroke="${D}" stroke-width="6"/><rect x="330" y="80" width="60" height="24" rx="12" fill="#3a3040" stroke="${D}" stroke-width="6"/>` +
      `<path d="M30 60h320l-16 160q-4 20 -24 20H70q-20 0 -24 -20Z" fill="#E6407F" stroke="${D}" stroke-width="7" stroke-linejoin="round"/><path d="M60 110q10 60 14 100" stroke="#F37AAE" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="190" cy="60" rx="162" ry="34" fill="#3a2030" stroke="${D}" stroke-width="7"/>`);
    // conteúdo (camadas de cor que vão aparecendo)
    const cont = (cor, t0, ry = 26) => { const e = S(panela, 0, 0, 380, 240, `<ellipse cx="190" cy="62" rx="148" ry="${ry}" fill="${cor}"/>`); M.K(e, { o: 0 }).to(t0, { o: 1 }, .5); return e; };
    cont('#F6E7C6', b(4)); cont('#C79A70', b(8) + .1); cont('#9B5E3C', b(9) + .1); cont('#6E3A22', b(10) + .1);
    const brilho = S(panela, 0, 0, 380, 240, `<ellipse cx="150" cy="54" rx="40" ry="8" fill="#fff" opacity=".35"/>`); M.K(brilho, { o: 0 }).to(b(16), { o: 1 }, .3);
    ent(panela, b(2), 'cai', .45);
    M.sfx('thud', b(2) + .3, .5);

    // leite condensado (beats 4-7)
    const lata = box(R, 820, 600, 200, 260);
    S(lata, 0, 0, 200, 260, `<rect x="30" y="20" width="140" height="200" rx="20" fill="#5BA4E8" stroke="${D}" stroke-width="7"/><ellipse cx="100" cy="22" rx="70" ry="16" fill="#cfd6e4" stroke="${D}" stroke-width="7"/><rect x="40" y="80" width="120" height="80" rx="10" fill="#fff"/><text x="100" y="115" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="22" fill="${D}">LEITE</text><text x="100" y="145" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="17" fill="${D}">CONDENS.</text>`);
    M.K(lata, { x: 300, o: 0, r: 0 }).to(b(4) - .2, { x: 0, o: 1 }, .3, M.E.back).to(b(4) + .1, { r: -70, x: -90, y: 120 }, .3, M.E.back).to(b(8) - .3, { r: 0, x: 300, y: 0, o: 0 }, .3, M.E.in);
    const jato = box(R, 765, 880, 26, 10, `background:#F6E7C6;border:5px solid ${D};border-radius:13px`);
    M.K(jato, { o: 0, sy: .1 }).to(b(4) + .35, { o: 1, sy: 1 }, .1).to(b(8) - .35, { o: 0 }, .1);
    M.up(t => { jato.style.height = (t > b(4) + .35 && t < b(8) - .3 ? 40 + 30 * pulso(t) : 10).toFixed(0) + 'px'; });
    for (let k = 4; k < 8; k++) M.sfx('drop', b(k) + .02, .45);

    // chocolate (beats 8-11): colheradas de cacau com nuvem
    for (let k = 8; k < 11; k++) {
      const t = b(k);
      const col = S(R, 600, 700, 200, 80, `<ellipse cx="40" cy="40" rx="38" ry="26" fill="#C98A4B" stroke="${D}" stroke-width="5"/><ellipse cx="40" cy="34" rx="28" ry="14" fill="#6E3A22"/><rect x="70" y="32" width="130" height="16" rx="8" fill="#C98A4B" stroke="${D}" stroke-width="5"/>`);
      M.K(col, { o: 0, x: 260, y: -100 }).to(t - .25, { o: 1, x: 80, y: 120 }, .22, M.E.out).to(t, { r: -40 }, .08).to(t + .18, { o: 0, x: 260, y: -100, r: 0 }, .25, M.E.in);
      for (let i = 0; i < 6; i++) { const n = box(R, 700 + (i - 3) * 22, 880, 50, 50, `border-radius:50%;background:#8B5233;opacity:.8`); M.K(n, { o: 0, s: .2 }).to(t + .02, { o: .85, s: 1 }, .1).to(t + .05, { y: -80 - i * 12, x: (i - 2.5) * 30, s: 1.8, o: 0 }, .6, M.E.out); }
      M.sfx('swish', t, .5); M.punch(t, .02);
    }
    pill(R, '🍫 3 colheres de chocolate', b(8), b(12));

    // manteiga (beats 12-15)
    const mant = S(R, 700, 300, 110, 90, `<path d="M10 30l40 -20 50 20 -40 20Z" fill="#FFF3A6" stroke="${D}" stroke-width="6" stroke-linejoin="round"/><path d="M10 30v36l50 20v-36ZM60 50v36l40 -20v-36Z" fill="#FFE066" stroke="${D}" stroke-width="6" stroke-linejoin="round"/>`);
    M.K(mant, { o: 0, y: -300 }).to(b(12), { o: 1, y: 560 }, .35, M.E.in).to(b(12) + .35, { sy: .6 }, .1).to(b(13), { sy: .35, o: .0 }, 1.4);
    M.sfx('drop', b(12) + .35, .6); M.sfx('shimmer', b(13), .3);
    pill(R, '🧈 1 colher de manteiga', b(12), b(16));
    pill(R, '🥫 1 leite condensado', b(4), b(8));

    // mexe (beats 16-19)
    const colher = S(R, 0, 0, 120, 360, `<rect x="52" y="40" width="20" height="300" rx="10" fill="#D59A55" stroke="${D}" stroke-width="6"/><ellipse cx="62" cy="330" rx="34" ry="24" fill="#D59A55" stroke="${D}" stroke-width="6"/>`);
    M.K(colher, { o: 0 }).to(b(16) - .1, { o: 1 }, .1).to(b(20) - .1, { o: 0 }, .15);
    M.up(t => { const a = (t - b(16)) * Math.PI * 2 / B / 2; colher.style.left = (690 + 70 * Math.cos(a)).toFixed(1) + 'px'; colher.style.top = (590 + 14 * Math.sin(a)).toFixed(1) + 'px'; });
    const giro = S(panela, 0, 0, 380, 240, `<path d="M120 60a70 16 0 1 0 140 0a50 12 0 1 0 -100 0" stroke="#4a2616" stroke-width="6" fill="none" stroke-linecap="round"/>`);
    M.K(giro, { o: 0 }).to(b(16), { o: 1 }, .2).to(b(20), { o: 0 }, .2);
    for (let k = 16; k < 20; k++) { M.sfx('swish', b(k), .35); const bo = box(R, 650 + (k % 3) * 70, 900, 30, 30, `border-radius:50%;border:5px solid #4a2616;background:#8B5233`); M.K(bo, { o: 0, s: .2 }).to(b(k), { o: 1, s: 1 }, .1).to(b(k) + .25, { s: 1.4, o: 0, y: -40 }, .2); M.sfx('pop', b(k) + .25, .25); }
    pill(R, '🥄 mexe até desgrudar', b(16), b(20));

    // bolinhas (beats 20-23)
    M.K(panela).to(b(20) - .25, { x: 600, r: 20 }, .3, M.E.in);
    const prato = S(R, 560, 990, 400, 120, `<ellipse cx="200" cy="70" rx="190" ry="44" fill="#fff" stroke="${D}" stroke-width="7"/><ellipse cx="200" cy="64" rx="140" ry="28" fill="#F4F0F6"/>`);
    M.K(prato, { x: -700, o: 0 }).set(b(20) - .16, { o: 1 }).to(b(20) - .15, { x: 0 }, .35, M.E.back);
    const pos = [[630, 960], [720, 940], [810, 960], [900, 945]];
    const bolas = pos.map(([x, y], i) => {
      const f = box(R, x - 40, y + 30, 80, 46, `background:#FF8FAB;border:5px solid ${D};border-radius:0 0 18px 18px;clip-path:polygon(0 0,100% 0,88% 100%,12% 100%)`);
      M.K(f, { o: 0, s: .3 }).to(b(26) + i * .08, { o: 1, s: 1 }, .25, M.E.back2);
      const g = box(R, x - 36, y - 30, 72, 72, `border-radius:50%;background:radial-gradient(circle at 35% 30%,#9B5E3C,#5a2d18 70%);border:5px solid ${D}`);
      M.K(g, { o: 0, s: .2, y: -200 }).to(b(20 + i), { o: 1, s: 1, y: 0 }, .3, M.E.back2).float(3, 0, i);
      M.sfx('pop', b(20 + i), .5);
      const gr = M.el(g, `<div class="abs" style="inset:0;border-radius:50%;background-image:radial-gradient(#2a120a 30%,transparent 32%),radial-gradient(#2a120a 30%,transparent 32%);background-size:14px 14px;background-position:0 0,7px 7px"></div>`);
      M.K(gr, { o: 0 }).to(b(25) + i * .1, { o: 1 }, .4);
      return g;
    });
    pill(R, '🟤 enrola as bolinhas', b(20), b(24));

    // granulado (beats 24-27)
    for (let i = 0; i < 46; i++) {
      const x = 590 + rnd() * 360, t0 = b(24) + rnd() * 1.7, r = rnd() * 180;
      const s = box(R, x, 600, 8, 22, `border-radius:4px;background:${i % 7 === 0 ? '#FF8FAB' : '#3a1a0e'}`);
      M.K(s, { o: 0, r }).to(t0, { o: 1 }, .05).to(t0, { y: 340 + rnd() * 40, r: r + 200 }, .5, M.E.in).to(t0 + .5, { o: 0 }, .2);
    }
    for (let k = 24; k < 28; k++) M.sfx('shimmer', b(k), .25);
    pill(R, '✨ passa no granulado', b(24), b(28));

    // final (beats 28-31)
    for (let i = 0; i < 7; i++) {
      const h = S(R, 120 + i * 120, 900, 60, 56, `<path d="M30 52C-10 26 2 2 16 2c8 0 12 6 14 10c2-4 6-10 14-10c14 0 26 24-14 50Z" fill="#FF4F8B" stroke="${D}" stroke-width="5"/>`);
      M.K(h, { o: 0, s: .3 }).to(b(28) + i * .1, { o: 1, s: 1 }, .2, M.E.back2).to(b(28) + i * .1, { y: -420 - (i % 3) * 60, x: (i - 3) * 20 }, 1.6, M.E.out).to(b(28) + i * .1 + 1.2, { o: 0 }, .4);
    }
    M.sfx('ding', b(28), .5);
    const logo = M.el(R, `<div class="abs" style="left:110px;top:1150px;width:860px;height:400px">${jadeLogo()}</div>`);
    logo.firstElementChild.setAttribute('width', 860); logo.firstElementChild.setAttribute('height', 400);
    M.K(logo, { o: 0, s: .4, r: -6 }).to(b(28) + .2, { o: 1, s: 1, r: 0 }, .45, M.E.back2).float(5, 1);
    M.sfx('whoosh', b(28) + .2, .4);

    // ---------- dedinho no ritmo ----------
    const dedo = M.el(R, `<div class="abs" style="left:440px;top:1260px;width:200px;height:200px"></div>`);
    const anel = box(dedo, 30, 30, 140, 140, `border-radius:50%;border:8px solid #fff`);
    const bola = M.el(dedo, `<div class="abs" style="left:40px;top:40px;width:120px;height:120px;border-radius:50%;background:#fff;border:6px solid ${D};display:grid;place-items:center;font-size:66px">👆</div>`);
    M.up(t => { const p = pulso(t); bola.style.transform = `scale(${(1 + .15 * p).toFixed(3)})`; anel.style.transform = `scale(${(1 + .6 * (1 - p)).toFixed(3)})`; anel.style.opacity = (p * .9).toFixed(3); });
    M.win(dedo, 0, b(28));
    pill(R, '👆 MEXE O DEDO NO RITMO', 0, b(4));
    // títulos grandes no ritmo
    [[0, 'BRIGADEIRO', 'DA JADE!'], [4, 'LEITE', 'CONDENSADO'], [8, 'CHOCOLATE!', ''], [12, 'MANTEIGA!', ''], [16, 'MEXE,', 'MEXE!'], [20, 'BOLINHAS!', ''], [24, 'GRANULADO!', ''], [28, 'HUMMM!', '']].forEach(([k, l1, l2], i, arr) => {
      const t0 = b(k), t1 = i < arr.length - 1 ? b(arr[i + 1][0]) : 99;
      const fs = Math.min(l2 ? 104 : 118, Math.floor(980 / (Math.max(l1.length, l2.length) * .72)));
      const w = M.el(R, `<div class="abs" style="left:0;right:0;top:${l2 ? 196 : 250}px;text-align:center;font:900 ${fs}px/1 Montserrat,sans-serif;color:#fff;-webkit-text-stroke:${Math.round(fs * .17)}px ${D};paint-order:stroke fill;text-shadow:0 8px 0 ${D}">${l1}${l2 ? `<br><span style="color:#FFD23F">${l2}</span>` : ''}</div>`);
      M.win(w, t0, t1); M.K(w, { s: .4, o: 0 }).to(t0, { s: 1, o: 1 }, .3, M.E.back2);
      M.up(t => { if (t >= t0 && t < t1) w.style.scale = (1 + .06 * pulso(t)).toFixed(3); });
    });
    for (let k = 0; k < 28; k += 4) M.punch(b(k), .02);
  }
};
})();
