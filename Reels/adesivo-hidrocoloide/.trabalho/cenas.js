// Cenas cartoon — Adesivo Hidrocoloide (historinha de produto)
(() => {
const M = MQ, D = '#26213a', SK = '#F6CFA8', SKD = '#E2A982', W = 1080, H = 1920;
const IMG = M.P.trabDir + 'produto.jpg';
const T = i => M.T(i);

// ---------- base ----------
const RAYS = (() => { let p = ''; const R = 2600, n = 22; for (let i = 0; i < n; i++) { const a0 = i * 2 * Math.PI / n, a1 = a0 + Math.PI / n; p += `M0 0L${(R * Math.cos(a0)).toFixed(0)} ${(R * Math.sin(a0)).toFixed(0)}L${(R * Math.cos(a1)).toFixed(0)} ${(R * Math.sin(a1)).toFixed(0)}Z`; } return p; })();
function cena(ctx, cor, luz) {
  const r = M.el(M.PALCOS, `<div class="abs dec" style="left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;background:radial-gradient(circle at 50% 48%, ${luz} 0%, ${cor} 60%)"></div>`);
  M.win(r, ctx.a, ctx.b);
  const rays = M.el(r, `<svg class="abs dec" style="left:${W / 2 - 2600}px;top:${900 - 2600}px" width="5200" height="5200" viewBox="-2600 -2600 5200 5200"><path d="${RAYS}" fill="rgba(255,255,255,.08)"/></svg>`);
  M.up(t => { if (t >= ctx.a - .05 && t < ctx.b + .05) rays.style.transform = `rotate(${(t * 4).toFixed(2)}deg)`; });
  for (let i = 0; i < 14; i++) { // brilhinhos
    const x = (i * 337) % W, y = 420 + (i * 523) % 1100;
    const s = M.el(r, `<div class="abs dec" style="left:${x}px;top:${y}px;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.35)"></div>`);
    M.K(s).float(10 + i % 5 * 3, 0, i * .7);
  }
  return r;
}
const S = (pai, x, y, w, h, inner, vb) => M.el(pai, `<svg class="abs" style="left:${x}px;top:${y}px;overflow:visible" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}">${inner}</svg>`);
const box = (pai, x, y, w, h, css = '') => M.el(pai, `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${css}"></div>`);
const ent = (el, t, tipo = 'pop', dur = .45) => { M.entra(el, t, tipo, dur); return el._k; };

const OK = `<svg width="44" height="44" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#22C55E"/><path d="M11 20l6 6 12-12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const NO = `<svg width="44" height="44" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#EF4444"/><path d="M13 13l14 14M27 13L13 27" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`;
function pill(root, txt, t, fim, ic, y = 452) {
  const w = M.el(root, `<div class="abs" style="left:0;right:0;top:${y}px;display:flex;justify-content:center"></div>`);
  const p = M.el(w, `<div class="cp-pill" style="position:relative">${ic === 'ok' ? OK : ic === 'no' ? NO : ''}<span>${txt}</span></div>`);
  M.win(w, t, fim);
  ent(p, t, 'pop', .4).float(4, 0);
  M.sfx('pop2', t + .02, .5);
  return p;
}

// ---------- rostinhos ----------
function face(cx, cy, k, m) {
  const ex = 26 * k, ey = -6 * k, er = 9 * k; let s = '';
  if (m === 'dorme') s += `<path d="M${cx - ex - 10 * k} ${cy + ey}q${10 * k} ${8 * k} ${20 * k} 0M${cx + ex - 10 * k} ${cy + ey}q${10 * k} ${8 * k} ${20 * k} 0" stroke="${D}" stroke-width="${5 * k}" fill="none" stroke-linecap="round"/>`;
  else if (m === 'feliz2') s += `<path d="M${cx - ex - 10 * k} ${cy + ey + 4 * k}q${10 * k} ${-12 * k} ${20 * k} 0M${cx + ex - 10 * k} ${cy + ey + 4 * k}q${10 * k} ${-12 * k} ${20 * k} 0" stroke="${D}" stroke-width="${5 * k}" fill="none" stroke-linecap="round"/>`;
  else s += `<ellipse cx="${cx - ex}" cy="${cy + ey}" rx="${er}" ry="${er * 1.2}" fill="${D}"/><ellipse cx="${cx + ex}" cy="${cy + ey}" rx="${er}" ry="${er * 1.2}" fill="${D}"/><circle cx="${cx - ex + 3 * k}" cy="${cy + ey - 4 * k}" r="${3.2 * k}" fill="#fff"/><circle cx="${cx + ex + 3 * k}" cy="${cy + ey - 4 * k}" r="${3.2 * k}" fill="#fff"/>`;
  s += `<ellipse cx="${cx - ex - 14 * k}" cy="${cy + 14 * k}" rx="${11 * k}" ry="${6 * k}" fill="#FF6F8E" opacity=".5"/><ellipse cx="${cx + ex + 14 * k}" cy="${cy + 14 * k}" rx="${11 * k}" ry="${6 * k}" fill="#FF6F8E" opacity=".5"/>`;
  const mw = 14 * k, my = cy + 18 * k;
  const boca = { feliz: `M${cx - mw} ${my}Q${cx} ${my + 16 * k} ${cx + mw} ${my}`, feliz2: `M${cx - mw} ${my}Q${cx} ${my + 18 * k} ${cx + mw} ${my}`, triste: `M${cx - mw} ${my + 8 * k}Q${cx} ${my - 6 * k} ${cx + mw} ${my + 8 * k}`, bravo: `M${cx - mw} ${my + 6 * k}Q${cx} ${my - 4 * k} ${cx + mw} ${my + 6 * k}`, neutro: `M${cx - mw * .7} ${my + 4 * k}L${cx + mw * .7} ${my + 4 * k}`, dorme: `M${cx - mw * .5} ${my + 4 * k}Q${cx} ${my + 9 * k} ${cx + mw * .5} ${my + 4 * k}` };
  if (m === 'susto') s += `<ellipse cx="${cx}" cy="${my + 6 * k}" rx="${7 * k}" ry="${9 * k}" fill="${D}"/>`;
  else s += `<path d="${boca[m] || boca.feliz}" stroke="${D}" stroke-width="${5 * k}" fill="none" stroke-linecap="round"/>`;
  if (m === 'bravo') s += `<path d="M${cx - ex - 14 * k} ${cy + ey - 22 * k}L${cx - ex + 12 * k} ${cy + ey - 12 * k}M${cx + ex + 14 * k} ${cy + ey - 22 * k}L${cx + ex - 12 * k} ${cy + ey - 12 * k}" stroke="${D}" stroke-width="${6 * k}" stroke-linecap="round"/>`;
  if (m === 'triste') s += `<path d="M${cx - ex - 12 * k} ${cy + ey - 14 * k}L${cx - ex + 10 * k} ${cy + ey - 20 * k}M${cx + ex + 12 * k} ${cy + ey - 14 * k}L${cx + ex - 10 * k} ${cy + ey - 20 * k}" stroke="${D}" stroke-width="${5 * k}" stroke-linecap="round"/>`;
  return s;
}
function boneco(pai, x, y, w, h, corpo, fx, fy, k, humores, fim) {
  const b = box(pai, x, y, w, h);
  S(b, 0, 0, w, h, corpo);
  humores.forEach(([t, m], i) => { const f = S(b, 0, 0, w, h, face(fx, fy, k, m)); const kk = M.K(f, { o: i ? 0 : 1 }); if (i) kk.set(t, { o: 1 }); if (i < humores.length - 1) kk.set(humores[i + 1][0], { o: 0 }); });
  return b;
}

// ---------- personagens ----------
const corpoEspinha = (w, cor = '#F2747E') => { const cx = w / 2, cy = w * .58, r = w * .4; return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cor}" stroke="${D}" stroke-width="8"/><ellipse cx="${cx}" cy="${cy - r * .66}" rx="${r * .42}" ry="${r * .28}" fill="#FFF4C9" stroke="${D}" stroke-width="7"/><path d="M${cx - r * .72} ${cy - r * .05}q${r * .08} ${-r * .42} ${r * .4} ${-r * .58}" stroke="#fff" stroke-width="10" opacity=".45" fill="none" stroke-linecap="round"/>`; };
const espinha = (pai, x, y, w, humores, fim, cor) => boneco(pai, x, y, w, w, corpoEspinha(w, cor), w / 2, w * .62, w / 170, humores, fim);
const corpoAdesivo = w => { const c = w / 2, r = w * .44; return `<circle cx="${c}" cy="${c}" r="${r}" fill="#FBEBD3" fill-opacity=".95" stroke="${D}" stroke-width="8"/><circle cx="${c}" cy="${c}" r="${r * .82}" fill="none" stroke="#fff" stroke-width="6" opacity=".7" stroke-dasharray="14 12"/><path d="M${c - r * .62} ${c - r * .25}q${r * .12} ${-r * .38} ${r * .45} ${-r * .48}" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".9"/>`; };
const adesivo = (pai, x, y, w, humores, fim) => boneco(pai, x, y, w, w, corpoAdesivo(w), w / 2, w * .55, w / 190, humores, fim);
const pele = (pai, x, y, w, h) => { let poros = ''; for (let i = 0; i < 26; i++) poros += `<circle cx="${60 + (i * 157) % (w - 120)}" cy="${50 + (i * 89) % (h - 100)}" r="${3 + i % 3}" fill="${SKD}" opacity=".6"/>`; const e = S(pai, x, y, w, h, `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${h * .42}" fill="${SK}" stroke="${D}" stroke-width="8"/>${poros}`); e.classList.add("dec"); return e; };
const dedo = (pai, x, y, esq) => S(pai, x, y, 330, 120, `<g transform="${esq ? '' : 'translate(330 0) scale(-1 1)'}"><rect x="-200" y="8" width="510" height="104" rx="52" fill="${SK}" stroke="${D}" stroke-width="8"/><ellipse cx="262" cy="60" rx="34" ry="30" fill="#FBE3D6" stroke="${D}" stroke-width="5"/><path d="M150 30v60" stroke="${SKD}" stroke-width="6" stroke-linecap="round"/></g>`);
const mao = (pai, x, y) => { let f = ''; for (let i = 0; i < 4; i++) f += `<rect x="${58 + i * 62}" y="${30 + Math.abs(i - 1.5) * 16}" width="56" height="190" rx="28" fill="${SK}" stroke="${D}" stroke-width="7"/>`; return S(pai, x, y, 360, 400, `${f}<rect x="10" y="190" width="120" height="58" rx="29" fill="${SK}" stroke="${D}" stroke-width="7" transform="rotate(-35 70 220)"/><rect x="50" y="150" width="260" height="230" rx="100" fill="${SK}" stroke="${D}" stroke-width="7"/><path d="M110 260q60 30 130 0" stroke="${SKD}" stroke-width="6" fill="none" stroke-linecap="round"/>`); };
const corpoBact = (w, cor = '#7BD36A') => { const c = w / 2, r = w * .3; let p = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p += `<circle cx="${c + Math.cos(a) * r * 1.15}" cy="${c + Math.sin(a) * r * 1.15}" r="${r * .3}" fill="${cor}" stroke="${D}" stroke-width="5"/>`; } return `${p}<circle cx="${c}" cy="${c}" r="${r}" fill="${cor}" stroke="${D}" stroke-width="6"/>`; };
const bacteria = (pai, x, y, w, fim, cor) => boneco(pai, x, y, w, w, corpoBact(w, cor), w / 2, w * .52, w / 260, [[0, 'bravo']], fim);
const base = (pai, x, y) => S(pai, x, y, 200, 340, `<rect x="20" y="100" width="160" height="230" rx="34" fill="#E8B48C" stroke="${D}" stroke-width="8"/><rect x="58" y="22" width="84" height="86" rx="14" fill="#3a3450" stroke="${D}" stroke-width="8"/><rect x="40" y="170" width="120" height="74" rx="12" fill="#fff" stroke="${D}" stroke-width="5"/><text x="100" y="219" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="32" fill="${D}">BASE</text>`);
const xis = (pai, x, y, s = 300) => S(pai, x, y, s, s, `<path d="M40 40L${s - 40} ${s - 40}M${s - 40} 40L40 ${s - 40}" stroke="${D}" stroke-width="64" stroke-linecap="round"/><path d="M40 40L${s - 40} ${s - 40}M${s - 40} 40L40 ${s - 40}" stroke="#EF4444" stroke-width="40" stroke-linecap="round"/>`);
const produto = (pai, x, y, s, extra = '') => M.el(pai, `<div class="abs" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:#fff;border:8px solid ${D};border-radius:${s * .08}px;box-shadow:0 14px 0 rgba(0,0,0,.18);overflow:hidden;${extra}"><img src="${IMG}" style="width:100%;height:100%;object-fit:cover"></div>`);
const HAIR = ['#3b2a20', '#1d1a22', '#8a5a2b', '#e0b55a', '#5a2f1f', '#2a1f1a', '#c0763a', '#141018', '#6b4226'];
const SKINS = ['#F6CFA8', '#E9B48A', '#C98B62', '#F8D9BC', '#A86B48', '#F1C39C'];
const menina = (pai, x, y, i) => { const h = HAIR[i % HAIR.length], s = SKINS[i % SKINS.length]; return S(pai, x, y, 200, 220, `<path d="M18 110C18 40 182 40 182 110V200H18Z" fill="${h}" stroke="${D}" stroke-width="6"/><circle cx="100" cy="118" r="70" fill="${s}" stroke="${D}" stroke-width="6"/><path d="M34 100C40 46 160 40 168 100C140 80 70 78 34 100Z" fill="${h}" stroke="${D}" stroke-width="6"/>${face(100, 126, .62, 'feliz')}<circle cx="${i % 2 ? 62 : 140}" cy="150" r="13" fill="#FBEBD3" stroke="${D}" stroke-width="3"/>`); };
const gota = (pai, x, y, s = 60) => S(pai, x, y, s, s * 1.35, `<path d="M${s / 2} 4C${s * .2} ${s * .55} 4 ${s * .8} 4 ${s * .95}A${s / 2 - 4} ${s / 2 - 4} 0 0 0 ${s - 4} ${s * .95}C${s - 4} ${s * .8} ${s * .8} ${s * .55} ${s / 2} 4Z" fill="#5BC0F8" stroke="${D}" stroke-width="5"/>`);
const etiqueta = (pai, x, y, html, cor = '#FFD23F', fs = 84) => M.el(pai, `<div class="abs" style="left:${x}px;top:${y}px;padding:22px 44px;background:${cor};border:8px solid ${D};border-radius:28px;box-shadow:0 12px 0 rgba(0,0,0,.2);font:900 ${fs}px Montserrat,sans-serif;color:${D};white-space:nowrap">${html}</div>`);
const cursor = (pai, x, y) => S(pai, x, y, 90, 110, `<path d="M6 4L6 84L28 64L44 100L62 92L46 57L78 57Z" fill="#fff" stroke="${D}" stroke-width="7" stroke-linejoin="round"/>`);
const sparks = (pai, cx, cy, t, cor = '#FFD23F') => { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, s = box(pai, cx - 9, cy - 9, 18, 18, `border-radius:50%;background:${cor};border:4px solid ${D}`); M.K(s, { o: 0, s: .3 }).to(t, { o: 1, s: 1 }, .05).to(t, { x: Math.cos(a) * 170, y: Math.sin(a) * 170 }, .5, M.E.out).to(t + .35, { o: 0 }, .25); } };

// ---------- cenas ----------
window.CENA = {
  // 0 — "Sabe por que hospital usa curativo de hidrocoloide em machucado?"
  gancho(c) {
    const r = cena(c, '#159A8F', '#3DC7B8');
    const hosp = S(r, 380, 560, 320, 300, `<rect x="20" y="70" width="280" height="220" rx="16" fill="#fff" stroke="${D}" stroke-width="8"/><rect x="0" y="50" width="320" height="40" rx="12" fill="#EF4444" stroke="${D}" stroke-width="8"/><circle cx="160" cy="40" r="38" fill="#fff" stroke="${D}" stroke-width="8"/><path d="M160 18v44M138 40h44" stroke="#EF4444" stroke-width="14" stroke-linecap="round"/>${[0, 1, 2].map(i => `<rect x="${48 + i * 82}" y="118" width="58" height="50" rx="8" fill="#9BDCF5" stroke="${D}" stroke-width="5"/>`).join('')}<rect x="130" y="200" width="60" height="90" rx="8" fill="#9BDCF5" stroke="${D}" stroke-width="6"/>`);
    ent(hosp, T(3), 'pop').to(T(5), { x: -250, y: -40, s: .62 }, .5, M.E.out).float(5, 1);
    M.sfx('pop', T(3), .6);
    const braco = box(r, 90, 960, 900, 300);
    S(braco, 0, 40, 900, 220, `<rect x="4" y="4" width="880" height="200" rx="100" fill="${SK}" stroke="${D}" stroke-width="8"/><ellipse cx="470" cy="104" rx="120" ry="52" fill="#E5484D" stroke="${D}" stroke-width="6"/><path d="M380 92l40 14 30-16 34 20 36-14 40 12M392 120l44 6 32-10 40 12" stroke="#B42330" stroke-width="7" fill="none" stroke-linecap="round"/>`);
    ent(braco, T(5), 'esq', .5).float(4, 0);
    M.sfx('whoosh', T(5), .5);
    const ad = adesivo(braco, 340, -60, 260, [[0, 'feliz']], c.b);
    M.K(ad, { y: -500, o: 0, r: -20 }).to(T(7), { y: 0, o: 1, r: 0 }, .45, M.E.back).float(3, 1.5);
    M.sfx('drop', T(7) + .3, .6);
    pill(r, 'CURATIVO DE HIDROCOLOIDE', T(6), c.b);
  },
  // 1 — "Porque ele protege a pele e puxa a secreção pra fora."
  absorve(c) {
    const r = cena(c, '#159A8F', '#3DC7B8');
    ent(pele(r, 90, 1020, 900, 360), c.a, 'fade', .3);
    const sec = box(r, 540 - 90, 1110, 180, 120, `border-radius:50%;background:#FFE58A;border:6px solid ${D}`);
    ent(sec, c.a, 'pop');
    const ad = adesivo(r, 290, 620, 500, [[0, 'feliz'], [T(16), 'feliz2']], c.b);
    ent(ad, c.a + .05, 'pop', .5).float(6, 1.5);
    const anel = box(r, 230, 560, 620, 620, `border-radius:50%;border:14px solid #fff`);
    M.K(anel, { o: 0, s: .7 }).to(T(12), { o: .9, s: 1 }, .3, M.E.back).to(T(12) + .6, { o: 0, s: 1.15 }, .4);
    M.sfx('shimmer', T(12), .5);
    for (let i = 0; i < 6; i++) {
      const g = box(r, 470 + (i % 3) * 50, 1150 + (i % 2) * 30, 34, 34, `border-radius:50%;background:#FFE58A;border:5px solid ${D}`);
      M.K(g, { o: 0 }).to(T(16) + i * .12, { o: 1 }, .1).to(T(16) + i * .12, { y: -330 - i * 10, x: (i - 2.5) * 12, s: .6 }, .6, M.E.io).to(T(16) + i * .12 + .55, { o: 0 }, .15);
    }
    M.K(sec).to(T(16), { s: .2, o: 0 }, 1.4, M.E.io);
    const branco = box(r, 540 - 110, 870 - 110, 220, 220, `border-radius:50%;background:radial-gradient(circle,#fff 40%,rgba(255,255,255,.6) 70%,transparent 72%)`);
    M.K(branco, { s: 0, o: 0 }).to(T(18), { s: 1, o: .95 }, .9, M.E.out);
    M.sfx('swish', T(16), .5);
    pill(r, 'PROTEGE A PELE', T(12), T(16), 'ok');
    pill(r, 'PUXA A SECREÇÃO', T(16), c.b, 'ok');
  },
  // 2 — "E é o mesmo motivo da tua espinha precisar dele."
  motivo(c) {
    const r = cena(c, '#159A8F', '#3DC7B8');
    pill(r, 'MESMO MOTIVO', T(23), c.b);
    const ad = adesivo(r, 120, 900, 280, [[0, 'feliz'], [T(28), 'susto'], [T(29), 'feliz']], c.b);
    ent(ad, c.a, 'pop').float(6, 2).to(T(29), { x: 140, y: -60 }, .5, M.E.back);
    const es = espinha(r, 560, 760, 420, [[0, 'triste']], c.b);
    ent(es, T(28), 'dir', .5).float(5, 2);
    M.sfx('pop', T(28), .6);
    M.sfx('blip', T(29), .5);
  },
  // 3 — "Espinha inflamada dá vontade de apertar."
  inflamada(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    ent(pele(r, 90, 1000, 900, 400), c.a, 'fade', .3);
    const glow = box(r, 540 - 260, 1010 - 260, 520, 520, `border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,.55),transparent 65%)`);
    M.K(glow, { o: 0 }).to(T(32), { o: 1 }, .3).float(0, 0);
    M.up(t => { if (t > T(32)) glow.style.transform = `scale(${1 + .08 * Math.sin(t * 9)})`; });
    const es = espinha(r, 360, 760, 360, [[0, 'triste'], [T(32), 'bravo'], [T(36), 'susto']], c.b, '#EF5A64');
    ent(es, c.a, 'pop').float(4, 1.5).to(T(36) + .25, { sx: .82, sy: 1.08 }, .15).to(T(36) + .45, { sx: 1, sy: 1 }, .3, M.E.spring);
    pill(r, 'INFLAMADA', T(32), c.b, 'no');
    M.sfx('zap', T(32), .4);
    const d1 = dedo(r, -340, 880, true), d2 = dedo(r, 1090, 880, false);
    M.K(d1).to(T(35), { x: 260 }, .55, M.E.back);
    M.K(d2).to(T(35), { x: -260 }, .55, M.E.back);
    M.sfx('whoosh', T(35), .4);
    M.treme(T(36) + .25, 7, .3);
  },
  // 4 — "Mas a mão leva bactéria, a maquiagem entope,"
  sujeira(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    ent(pele(r, 90, 1060, 900, 360), c.a, 'fade', .3);
    const es = espinha(r, 400, 880, 280, [[0, 'triste'], [T(44), 'bravo']], c.b, '#EF5A64');
    ent(es, c.a, 'pop').float(3, 1);
    const m = mao(r, 40, 520);
    ent(m, T(39), 'esq', .5).float(6, 3);
    M.sfx('whoosh', T(39), .5);
    for (let i = 0; i < 4; i++) {
      const b = bacteria(r, 90 + i * 70, 560 + (i % 2) * 120, 110, c.b);
      ent(b, T(41) + i * .1, 'pop', .35).to(T(42) + i * .12, { x: 300 - i * 40, y: 380 - (i % 2) * 90 }, .6, M.E.io).float(5, 6);
      M.sfx('pop', T(41) + i * .1, .35);
    }
    const bs = base(r, 760, 560);
    ent(bs, T(43), 'dir', .45).to(T(44), { r: -35, x: -120, y: 60 }, .35, M.E.back);
    const blob = S(r, 400, 860, 280, 220, `<path d="M30 120C10 60 80 10 140 30C200 0 280 60 250 130C270 190 180 220 130 200C70 220 40 180 30 120Z" fill="#E8B48C" stroke="${D}" stroke-width="7"/>`);
    M.K(blob, { s: 0, o: 0 }).to(T(44) + .3, { s: 1, o: 1 }, .35, M.E.back2);
    M.sfx('snap', T(44) + .3, .5);
    pill(r, 'BACTÉRIA', T(41), T(43), 'no');
    pill(r, 'ENTOPE O PORO', T(43), c.b, 'no');
  },
  // 5 — "e ela fica ainda mais vermelha."
  vermelha(c) {
    const r = cena(c, '#D9741A', '#F39A3A');
    ent(pele(r, 90, 1060, 900, 360), c.a, 'fade', .3);
    const glow = box(r, 540 - 330, 1000 - 330, 660, 660, `border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,.7),transparent 65%)`);
    M.up(t => { glow.style.transform = `scale(${1 + .1 * Math.sin(t * 11)})`; });
    const es = espinha(r, 300, 640, 480, [[0, 'bravo']], c.b, '#E5343F');
    ent(es, c.a, 'pop').to(T(49), { s: 1.18 }, .4, M.E.back).float(4, 2);
    M.treme(T(50), 10, .4);
    M.sfx('impact', T(50), .45);
    pill(r, 'MAIS VERMELHA', T(48), c.b, 'no');
  },
  // 6 — "Esconder com base não resolve."
  esconder(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    ent(pele(r, 90, 1060, 900, 360), c.a, 'fade', .3);
    const es = espinha(r, 400, 860, 280, [[0, 'bravo']], c.b, '#E5343F');
    ent(es, c.a, 'pop').float(3, 1);
    const bs = base(r, 740, 620);
    ent(bs, c.a + .1, 'dir', .45).to(T(52), { r: -35, x: -110, y: 40 }, .35, M.E.back);
    const blob = S(r, 380, 840, 320, 260, `<path d="M30 140C10 70 90 10 160 34C230 0 320 70 290 150C310 220 200 250 150 230C80 250 46 210 30 140Z" fill="#E8B48C" fill-opacity=".72" stroke="${D}" stroke-width="7"/>`);
    M.K(blob, { s: 0, o: 0 }).to(T(53), { s: 1, o: 1 }, .35, M.E.back2);
    M.sfx('snap', T(53), .5);
    const x = xis(r, 390, 780, 300);
    M.K(x, { s: 2, o: 0 }).to(T(54), { s: 1, o: 1 }, .3, M.E.back2);
    M.sfx('stamp', T(54) + .1, .6); M.punch(T(54) + .1, .04);
    pill(r, 'NÃO RESOLVE', T(54), c.b, 'no');
  },
  // 7 — "E espremer pode deixar marca."
  marca(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    ent(pele(r, 90, 1000, 900, 400), c.a, 'fade', .3);
    const mk = boneco(r, 400, 860, 280, 220, `<path d="M30 120C10 60 80 10 140 30C200 0 280 60 250 130C270 190 180 220 130 200C70 220 40 180 30 120Z" fill="#A8704C" stroke="${D}" stroke-width="6"/>`, 140, 110, 1.1, [[0, 'triste']], c.b);
    M.K(mk, { o: 0, s: .4 }).to(T(58) + .2, { o: 1, s: 1 }, .4, M.E.back).float(3, 1);
    const es = espinha(r, 380, 760, 320, [[0, 'susto']], c.b, '#EF5A64');
    ent(es, c.a, 'pop').to(T(57) + .3, { sx: .7, sy: 1.15 }, .15).to(T(58) + .1, { s: 0, o: 0 }, .2, M.E.in);
    const d1 = dedo(r, -340, 860, true), d2 = dedo(r, 1090, 860, false);
    M.K(d1).to(T(57), { x: 300 }, .35, M.E.back).to(T(58) + .3, { x: 0 }, .4, M.E.io);
    M.K(d2).to(T(57), { x: -300 }, .35, M.E.back).to(T(58) + .3, { x: 0 }, .4, M.E.io);
    sparks(r, 540, 900, T(58) + .1, '#FFF4C9');
    M.sfx('shot', T(58) + .1, .5);
    pill(r, 'PODE DEIXAR MARCA', T(59), c.b, 'no');
  },
  // 8 — "Por isso, tá todo mundo usando o adesivo de hidrocoloide."
  todoMundo(c) {
    const r = cena(c, '#D9487F', '#F27BA6');
    const pos = [[60, 1130], [300, 1180], [560, 1150], [800, 1120], [180, 900], [440, 930], [700, 910], [-40, 860], [900, 880]];
    pos.forEach(([x, y], i) => { const g = menina(r, x, y, i); ent(g, T(63) + i * .12, 'pop', .35).float(6, 2, i); if (i % 3 === 0) M.sfx('pop', T(63) + i * .12, .3); });
    const crowd = pos.length;
    const p = produto(r, 330, 560, 420);
    ent(p, T(68), 'zoom', .5).float(6, 1.5);
    M.sfx('whoosh', T(68), .5); M.sfx('ding', T(68) + .3, .45);
    pill(r, 'TODO MUNDO USANDO', T(64), T(68), crowd ? 'ok' : '');
    pill(r, 'ADESIVO DE HIDROCOLOIDE', T(68), c.b, 'ok');
  },
  // 9 — "Você cola em cima da espinha, ele absorve a secreção"
  cola(c) {
    const r = cena(c, '#D9487F', '#F27BA6');
    ent(pele(r, 90, 1000, 900, 400), c.a, 'fade', .3);
    const es = espinha(r, 400, 820, 280, [[0, 'triste']], c.b, '#EF5A64');
    ent(es, c.a, 'pop').to(T(78), { s: .45, o: .0 }, 1.2, M.E.io);
    const ad = adesivo(r, 360, 740, 360, [[0, 'feliz'], [T(78), 'feliz2']], c.b);
    M.K(ad, { y: -700, r: -30, o: 0 }).set(T(72) - .02, { o: 1 }).to(T(72), { y: 0, r: 0 }, .4, M.E.back).to(T(72) + .4, { sy: .9, sx: 1.08 }, .1).to(T(72) + .5, { sy: 1, sx: 1 }, .3, M.E.spring).float(4, 1);
    M.sfx('drop', T(72) + .35, .6);
    const branco = box(ad, 180 - 70, 200 - 70, 140, 140, `border-radius:50%;background:radial-gradient(circle,#fff 45%,rgba(255,255,255,.4) 70%,transparent 72%)`);
    M.K(branco, { s: 0, o: 0 }).to(T(78), { s: 1, o: .95 }, 1, M.E.out);
    M.sfx('shimmer', T(78), .4);
    pill(r, 'COLA EM CIMA', T(72), T(78), 'ok');
    pill(r, 'ABSORVE A SECREÇÃO', T(78), c.b, 'ok');
  },
  // 10 — "e protege da mão, da maquiagem e da sujeira."
  protege(c) {
    const r = cena(c, '#D9487F', '#F27BA6');
    ent(pele(r, 90, 1040, 900, 380), c.a, 'fade', .3);
    const ad = adesivo(r, 370, 800, 340, [[0, 'feliz']], c.b);
    ent(ad, c.a, 'pop').float(4, 1);
    const esc = box(r, 540 - 260, 970 - 260, 520, 520, `border-radius:50%;border:12px solid #fff;background:rgba(255,255,255,.12)`);
    ent(esc, c.a + .1, 'pop', .4);
    M.up(t => { esc.style.boxShadow = `0 0 ${30 + 20 * Math.sin(t * 8)}px rgba(255,255,255,.8)`; });
    const m = mao(r, -400, 520);
    M.K(m).to(T(84) - .2, { x: 560 }, .35, M.E.in).to(T(84) + .15, { x: 160, r: -20 }, .45, M.E.back);
    const bs = base(r, 1100, 560);
    M.K(bs).to(T(86) - .2, { x: -460 }, .35, M.E.in).to(T(86) + .15, { x: -60, r: 25 }, .45, M.E.back);
    for (let i = 0; i < 5; i++) {
      const p = box(r, 300 + i * 120, 380, 40, 40, `border-radius:40%;background:#6b4a2f;border:5px solid ${D}`);
      M.K(p, { o: 0 }).to(T(89) - .3, { o: 1 }, .1).to(T(89) - .3, { y: 300 }, .35, M.E.in).to(T(89) + .05, { y: 120, x: (i - 2) * 120, o: 0 }, .5, M.E.out);
    }
    [T(84) + .15, T(86) + .15, T(89) + .05].forEach(t => { M.sfx('thud', t, .45); M.K(box(r, 540 - 260, 970 - 260, 520, 520, `border-radius:50%;border:10px solid #fff`), { o: 0 }).to(t, { o: 1, s: 1 }, .05).to(t + .05, { o: 0, s: 1.2 }, .4); });
    pill(r, 'PROTEGE', T(82), c.b, 'ok');
  },
  // 11 — "É fininho, quase invisível, à prova d'água,"
  fininho(c) {
    const r = cena(c, '#1F9E6A', '#47C98F');
    ent(pele(r, 90, 1060, 900, 360), c.a, 'fade', .3);
    const ad = adesivo(r, 340, 700, 400, [[0, 'feliz']], c.b);
    ent(ad, c.a, 'pop').to(T(91), { sy: .18 }, .3, M.E.back).to(T(91) + .55, { sy: 1 }, .35, M.E.spring).to(T(93), { o: .35 }, .4).to(T(95), { o: 1 }, .3).float(4, 1);
    M.sfx('swish', T(91), .45); M.sfx('shimmer', T(93), .45);
    for (let i = 0; i < 7; i++) {
      const g = gota(r, 300 + i * 75, 200, 56);
      const t0 = T(95) + i * .09;
      M.K(g, { o: 0 }).to(t0, { o: 1 }, .05).to(t0, { y: 520 + (i % 2) * 30 }, .35, M.E.in).to(t0 + .35, { y: 380, x: (i - 3) * 70, r: (i - 3) * 20 }, .35, M.E.out).to(t0 + .7, { y: 900, o: 0 }, .4, M.E.in);
    }
    M.sfx('drop', T(95) + .35, .5);
    pill(r, 'FININHO', T(91), T(93), 'ok');
    pill(r, 'QUASE INVISÍVEL', T(93), T(95), 'ok');
    pill(r, 'À PROVA D\'ÁGUA', T(95), c.b, 'ok');
  },
  // 12 — "dá pra usar de dia ou na hora de dormir,"
  diaNoite(c) {
    const r = cena(c, '#1F9E6A', '#47C98F');
    const noite = box(r, 0, 0, W, H, 'background:radial-gradient(circle at 50% 45%,#2b3f8f,#141c47 70%)');
    M.K(noite, { o: 0 }).to(T(102), { o: 1 }, .5);
    const sol = S(r, 380, 560, 320, 320, `${Array.from({ length: 10 }, (_, i) => `<rect x="152" y="0" width="16" height="60" rx="8" fill="#FFD23F" stroke="${D}" stroke-width="4" transform="rotate(${i * 36} 160 160)"/>`).join('')}<circle cx="160" cy="160" r="96" fill="#FFD23F" stroke="${D}" stroke-width="8"/>`);
    ent(sol, T(99), 'pop').to(T(102), { y: 500, o: 0 }, .5, M.E.in);
    M.up(t => { sol.querySelectorAll('rect').forEach((e, i) => { }); });
    M.sfx('ding', T(100), .4);
    const lua = S(r, 400, 560, 280, 280, `<path d="M190 30A120 120 0 1 0 250 200A100 100 0 1 1 190 30Z" fill="#FFF1B8" stroke="${D}" stroke-width="8"/>`);
    M.K(lua, { y: -500, o: 0 }).to(T(102) + .1, { y: 0, o: 1 }, .55, M.E.back).float(5, 3);
    for (let i = 0; i < 5; i++) { const e = box(r, 140 + i * 190, 520 + (i % 2) * 140, 18, 18, 'border-radius:50%;background:#fff'); M.K(e, { o: 0 }).to(T(103) + i * .08, { o: 1 }, .2).float(6, 0, i); }
    ent(pele(r, 90, 1080, 900, 340), c.a, 'fade', .3);
    const ad = adesivo(r, 390, 900, 300, [[0, 'feliz'], [T(103), 'dorme']], c.b);
    ent(ad, c.a, 'pop').float(5, 2);
    const z = M.el(r, `<div class="abs" style="left:700px;top:820px;font:900 70px Montserrat;color:#fff;-webkit-text-stroke:8px ${D};paint-order:stroke fill">Z<span style="font-size:50px">z</span></div>`);
    M.K(z, { o: 0 }).to(T(104), { o: 1 }, .3).float(10, 6);
    M.sfx('whoosh', T(102), .4);
    pill(r, 'DE DIA', T(99), T(102), 'ok');
    pill(r, 'NA HORA DE DORMIR', T(102), c.b, 'ok');
  },
  // 13 — "e vem em tamanhos diferentes pra cada espinha."
  tamanhos(c) {
    const r = cena(c, '#1F9E6A', '#47C98F');
    const tam = [[150, 120, 960], [230, 425, 920], [320, 700, 870]];
    tam.forEach(([s, x, y], i) => {
      const e = espinha(r, x + s * .5 - s * .3, y + s * .35, s * .6, [[0, 'triste']], c.b);
      ent(e, c.a + i * .08, 'pop', .3);
      const a = adesivo(r, x, y, s, [[0, 'feliz']], c.b);
      M.K(a, { y: -600, o: 0 }).to(T(109) + i * .22, { y: 0, o: 1 }, .45, M.E.back).float(4, 1.5, i);
      M.sfx('drop', T(109) + i * .22 + .3, .4);
    });
    pill(r, 'TAMANHOS DIFERENTES', T(109), c.b, 'ok');
  },
  // 14 — "Uma cartela já vem com 36 adesivos."
  cartela(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    const cart = box(r, 250, 600, 580, 700, `background:rgba(255,255,255,.9);border:8px solid ${D};border-radius:36px;box-shadow:0 14px 0 rgba(0,0,0,.18)`);
    ent(cart, c.a, 'pop').float(4, .6);
    const t0 = T(116), t1 = M.S(120) + .3;
    for (let i = 0; i < 36; i++) {
      const col = i % 6, row = (i / 6) | 0, big = (col + row) % 2 === 0, s = big ? 70 : 52;
      const d = box(cart, 30 + col * 86 + (86 - s) / 2, 30 + row * 106 + (106 - s) / 2, s, s, `border-radius:50%;background:#FBEBD3;border:5px solid ${D}`);
      M.K(d, { s: 0, o: 0 }).to(t0 + (t1 - t0) * i / 36, { s: 1, o: 1 }, .2, M.E.back2);
    }
    for (let i = 0; i < 6; i++) M.sfx('tick', t0 + (t1 - t0) * i / 6, .3);
    const n = M.el(r, `<div class="abs" style="left:690px;top:1130px;width:280px;height:280px;border-radius:50%;background:#FFD23F;border:10px solid ${D};box-shadow:0 12px 0 rgba(0,0,0,.2);display:grid;place-items:center;font:900 150px Montserrat;color:${D}">0</div>`);
    ent(n, t0, 'pop');
    M.conta(n, 0, 36, t0, t1, v => Math.round(v));
    M.sfx('ding', t1, .5); M.punch(t1, .03);
    pill(r, '1 CARTELA = 36 ADESIVOS', T(115), c.b);
  },
  // 15 — "E quanto mais leva, mais barato sai:"
  escada(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    const cols = [[1, 'R$ 14,90'], [2, 'R$ 20,00'], [3, 'R$ 24,00']];
    cols.forEach(([n, preco], i) => {
      const x = 70 + i * 335, t = T(123 + i);
      for (let k = 0; k < n; k++) { const p = produto(r, x + 20 + k * 14, 1000 - k * 150, 220); ent(p, t + k * .1, 'cai', .45).float(3, .5, i); }
      const tag = etiqueta(r, x - 4, 1270, preco, '#fff', 44);
      ent(tag, t + .2, 'sobe', .35);
      M.sfx('pop', t, .45);
    });
    const seta = S(r, 110, 640, 160, 260, `<path d="M40 10h80v150h40L80 250 0 160h40Z" fill="#22C55E" stroke="${D}" stroke-width="8" stroke-linejoin="round"/>`);
    ent(seta, T(126), 'desce').float(8, 0);
    M.sfx('coin', T(126), .5);
    pill(r, 'QUANTO MAIS LEVA, MAIS BARATO', T(122), c.b, 'ok');
  },
  // 16 — "uma cartela sai por R$14,90."
  preco1(c) {
    const r = cena(c, '#E2574C', '#F58A74');
    const p = produto(r, 290, 600, 500);
    ent(p, c.a, 'zoom', .45).float(5, 1);
    const fio = S(r, 640, 1040, 10, 120, `<path d="M5 0v120" stroke="${D}" stroke-width="6"/>`, '0 0 10 120');
    const tag = etiqueta(r, 330, 1150, 'R$ 14,90', '#FFD23F', 120);
    M.K(tag, { y: -200, o: 0, r: -12 }).to(T(133), { y: 0, o: 1, r: 4 }, .5, M.E.spring).float(4, 2);
    M.K(fio, { o: 0 }).to(T(133), { o: 1 }, .2);
    M.sfx('coin', T(133) + .15, .55);
    pill(r, '1 CARTELA', T(130), c.b);
  },
  // 17 — "E levando 3 cartelas, são 108 adesivos por só R$24."
  preco3(c) {
    const r = cena(c, '#E2574C', '#F58A74');
    [-1, 0, 1].forEach((k, i) => { const p = produto(r, 360 + k * 230, 560 + Math.abs(k) * 40, 360); M.K(p, { o: 0, s: .4, r: k * 30 }).to(T(136) + i * .12, { o: 1, s: 1, r: k * 8 }, .45, M.E.back2).float(4, 1, i); M.sfx('pop', T(136) + i * .12, .4); });
    const n = M.el(r, `<div class="abs" style="left:0;right:0;top:960px;text-align:center;font:900 120px Montserrat;color:#fff;-webkit-text-stroke:14px ${D};paint-order:stroke fill;text-shadow:0 10px 0 ${D}"><span>36</span> <span style="font-size:60px">ADESIVOS</span></div>`);
    M.K(n, { o: 0 }).to(T(137), { o: 1 }, .3);
    M.conta(n.firstElementChild, 36, 108, T(139) - .2, M.S(139) + .4, v => Math.round(v));
    M.sfx('ding', M.S(139) + .4, .45);
    const velho = etiqueta(r, 60, 1190, '<s style="text-decoration-thickness:10px;text-decoration-color:#EF4444">R$ 44,70</s>', '#fff', 56);
    ent(velho, T(140), 'esq', .4).float(3, 1.5);
    const novo = etiqueta(r, 450, 1160, 'R$ 24,00', '#FFD23F', 92);
    M.K(novo, { s: 2.2, o: 0, r: -10 }).to(T(143), { s: 1, o: 1, r: 3 }, .4, M.E.back2).float(4, 2);
    M.sfx('stamp', T(143) + .1, .55); M.sfx('coin', T(143) + .2, .5); M.punch(T(143) + .1, .04);
    pill(r, '3 CARTELAS', T(136), T(139), 'ok');
    pill(r, '108 ADESIVOS', T(139), c.b, 'ok');
  },
  // 18 — "Dá 22 centavos cada adesivo!"
  centavos(c) {
    const r = cena(c, '#E08A1E', '#F7B54A');
    const moeda = M.el(r, `<div class="abs" style="left:240px;top:600px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFE98A,#F5B820 60%,#D99A0B);border:12px solid ${D};box-shadow:0 18px 0 rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;font:900 70px Montserrat;color:${D}"><div>R$</div><div style="font-size:200px;line-height:.9">0,22</div></div>`);
    M.K(moeda, { o: 0, sx: 0 }).to(T(145), { o: 1, sx: 1 }, .6, M.E.back).float(6, 3);
    M.sfx('coin', T(145) + .2, .6);
    sparks(r, 540, 900, T(145) + .4);
    const a = adesivo(r, 760, 1080, 220, [[0, 'feliz2']], c.b);
    ent(a, T(147), 'pop').float(6, 4);
    pill(r, 'CADA ADESIVO', T(146), c.b);
  },
  // 19 — "Clica no link e garante o teu."
  cta(c) {
    const r = cena(c, '#2457C5', '#4F86EA');
    const p = produto(r, 290, 560, 500);
    ent(p, c.a, 'zoom', .45).float(5, 1);
    const btn = M.el(r, `<div class="abs" style="left:110px;top:1150px;width:860px;height:150px;border-radius:80px;background:#FF6B3D;border:8px solid ${D};box-shadow:0 14px 0 ${D};display:flex;align-items:center;justify-content:center;gap:22px;white-space:nowrap;font:900 52px Montserrat;color:#fff;-webkit-text-stroke:8px ${D};paint-order:stroke fill">${M.icone('shopping-cart', '#fff', 3).replace('<div', '<div style="width:80px;height:80px"')}<span>CLICA E GARANTE</span></div>`);
    ent(btn, T(149), 'pop', .45).to(T(151) + .3, { s: .92, y: 10 }, .08).to(T(151) + .38, { s: 1, y: 0 }, .3, M.E.spring).to(T(153), { s: 1.06 }, .3, M.E.back).float(4, 0);
    const cur = cursor(r, 900, 1500);
    M.K(cur, { o: 0 }).to(T(150), { o: 1 }, .1).to(T(150), { x: -280, y: -270 }, .45, M.E.io).to(T(151) + .3, { s: .85 }, .08).to(T(151) + .38, { s: 1 }, .2);
    M.sfx('click', T(151) + .3, .6);
    sparks(r, 640, 1230, T(151) + .35, '#FFD23F');
    M.sfx('ding', T(153), .5);
    pill(r, 'LINK AQUI', T(150), c.b, 'ok');
  }
};
})();
