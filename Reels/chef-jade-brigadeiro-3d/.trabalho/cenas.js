// Chef Jade — Brigadeiro "mexe o dedo no ritmo": Jade em 2D (recortes PNG) dentro de uma cozinha 3D (three.js).
// 120 BPM (batida = 0,5 s). A câmera sobe e desce no ritmo e desliza pro lado a cada etapa.
(() => {
const M = MQ, D = '#2B1B17', B = .5, b = n => n * B, W = 1080, H = 1920, FIM = 15, SX = 14;
const ESTACOES = [0, b(6), b(14), b(19), b(25)];
const bob = t => Math.cos(Math.PI * t / B) * (t < FIM ? 1 : Math.max(0, 1 - (t - FIM) / .35));   // +1 desce, -1 sobe
const pulso = t => { const ph = ((t % B) + B) % B / B; return Math.exp(-ph * 7); };
const clamp = (x, a = 0, c = 1) => Math.max(a, Math.min(c, x)), lerp = (a, c, k) => a + (c - a) * k;
const io = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, eIn = k => k * k;
let seed = 9; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

// imagens 2D da Jade (no DOM já na carga da página, pra o render esperar elas)
const NOMES = ['corpo-feliz', 'corpo-surpresa', 'corpo-piscada', 'corpo-olhosFechados', 'corpo-lambendo', 'corpo-sorriso', 'cabeca-feliz', 'cabeca-surpresa', 'cabeca-piscada', 'cabeca-lambendo', 'dedo', 'logo'];
const IMG = {};
NOMES.forEach(n => { const im = document.createElement('img'); im.src = MQ.P.trabDir + 'img/' + n + '.png'; im.style.display = 'none'; (document.body || document.documentElement).appendChild(im); IMG[n] = im; });

function titulo(pai, l1, l2, t0, t1, top = 230) {
  const fs = Math.min(l2 ? 100 : 116, Math.floor(980 / (Math.max(l1.length, (l2 || '').length) * .72)));
  const w = M.el(pai, `<div class="abs" style="left:0;right:0;top:${top}px;text-align:center;font:900 ${fs}px/1.02 Montserrat,sans-serif;color:#fff;-webkit-text-stroke:${Math.round(fs * .17)}px ${D};paint-order:stroke fill;text-shadow:0 8px 0 ${D}">${l1}${l2 ? `<br><span style="color:#FFD23F">${l2}</span>` : ''}</div>`);
  M.win(w, t0, t1); M.K(w, { s: .4, o: 0 }).to(t0, { s: 1, o: 1 }, .28, M.E.back2);
  M.up(t => { if (t >= t0 && t < t1) w.style.scale = (1 + .05 * pulso(t)).toFixed(3); });
}

window.CENA = {
  brigadeiro3d() {
    const T = window.THREE;
    const cv = M.el(M.PALCOS, `<canvas class="abs dec" width="${W}" height="${H}" style="left:0;top:0;width:${W}px;height:${H}px"></canvas>`);
    const ren = new T.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
    ren.setSize(W, H, false); ren.outputColorSpace = T.SRGBColorSpace; ren.shadowMap.enabled = true; ren.shadowMap.type = T.PCFSoftShadowMap;
    ren.toneMapping = T.ACESFilmicToneMapping; ren.toneMappingExposure = 1.0;
    const cena = new T.Scene(); cena.background = new T.Color('#F6B6D0');
    const cam = new T.PerspectiveCamera(42, W / H, .1, 200);
    cena.add(new T.HemisphereLight('#FFF6FA', '#B86A8C', 1.35));
    const sol = new T.DirectionalLight('#FFF1E0', 2.3); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -7, right: 7, top: 7, bottom: -5 }); sol.shadow.radius = 5; cena.add(sol); cena.add(sol.target);
    const mat = (cor, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: cor, roughness: .6, metalness: 0 }, o));
    const add = (pai, geo, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, sombra = true) => { const me = new T.Mesh(geo, m); me.position.set(x, y, z); me.scale.set(sx, sy, sz); me.castShadow = me.receiveShadow = sombra; pai.add(me); return me; };
    const esf = (r = 1, s = 32) => new T.SphereGeometry(r, s, Math.round(s * .75));
    const canvasTex = (w, h, desenha, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; desenha(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
    const azulejo = (c1, c2) => canvasTex(256, 256, (g) => { g.fillStyle = c1; g.fillRect(0, 0, 256, 256); g.fillStyle = c2; g.fillRect(0, 0, 256, 10); g.fillRect(0, 0, 10, 256); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(14, 14, 60, 18); }, [9, 7]);
    // texturas 2D -> 3D
    const TEX = {}; NOMES.forEach(n => { const t = new T.Texture(IMG[n]); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; TEX[n] = t; });
    let texOk = false;
    const recorte = (pai, nome, w, h, x, y, z) => { const m = new T.MeshBasicMaterial({ map: TEX[nome], transparent: true, alphaTest: .08, toneMapped: false }); const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.position.set(x, y, z); pai.add(me); return me; };
    const humor = (mesh, plano, pref) => M.up(t => { let h = plano[0][1]; plano.forEach(([tt, hh]) => { if (t >= tt) h = hh; }); mesh.material.map = TEX[pref + h]; });

    // ---------- 5 cenários lado a lado ----------
    const CORES = [['#F9C6DA', '#FFE3EE', '#E86FA0', '#F7A3C4'], ['#CDEFE3', '#EAFBF4', '#3FB28A', '#7DD3B3'], ['#FFE2C4', '#FFF2E3', '#F08A4B', '#FFB27D'], ['#FFF3B8', '#FFFBE0', '#E9475A', '#FF8A96'], ['#FAD0E4', '#FFE9F3', '#E6407F', '#F37AAE']];
    const listrado = canvasTex(256, 256, g => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#E9475A'; g.fillRect(i * 32, 0, 32, 256); } }, [6, 1]);
    CORES.forEach(([parede, linha, bal, topo], i) => {
      const x = i * SX;
      add(cena, new T.PlaneGeometry(SX, 18), mat(parede, { map: azulejo(parede, linha) }), x, 4, -3);
      add(cena, new T.BoxGeometry(SX, .18, .8), mat('#C98A4B'), x, 3.5, -2.6);
      [[-3.6, '#FFE08A'], [-2.5, '#F7D6A8'], [2.5, '#C77B4A'], [3.6, '#FFB3CF']].forEach(([dx, cor], k) => {
        add(cena, new T.CylinderGeometry(.36, .36, .8, 28), mat(cor, { roughness: .25 }), x + dx + (i % 2) * .2, 4.0, -2.6);
        add(cena, new T.CylinderGeometry(.39, .39, .16, 28), mat('#E6407F'), x + dx + (i % 2) * .2, 4.47, -2.6);
      });
      const bm = i === 3 ? new T.MeshStandardMaterial({ map: listrado, roughness: .8 }) : mat(bal);
      add(cena, new T.BoxGeometry(SX, 2.4, 3.2), bm, x, -2.75, 1.2);
      add(cena, new T.BoxGeometry(SX, .24, 3.4), i === 3 ? new T.MeshStandardMaterial({ map: listrado, roughness: .8 }) : mat(topo, { roughness: .25 }), x, -1.5, 1.2);
      if (i !== 3) [-4.6, -1.55, 1.55, 4.6].forEach(dx => { add(cena, new T.BoxGeometry(2.6, 1.6, .1), mat(topo), x + dx, -2.75, 2.82); add(cena, esf(.09, 16), mat('#F4C542', { metalness: .6, roughness: .3 }), x + dx + 1, -2.3, 2.9); });
      add(cena, new T.PlaneGeometry(SX, 12), mat(bal), x, -4, 6).rotation.x = -Math.PI / 2;
    });
    const TOPO = -1.38;   // altura do tampo do balcão

    // ---------- 0) introdução: Jade + dedinho ----------
    const j0 = recorte(cena, 'corpo-feliz', 3.2, 4.96, -1.35, .45, -.6);
    humor(j0, [[0, 'surpresa'], [b(1), 'feliz'], [b(3), 'piscada'], [b(4), 'feliz']], 'corpo-');
    const dedo = M.el(M.PALCOS, `<div class="abs" style="left:430px;top:640px;width:720px;height:230px"></div>`);
    const dedoIn = M.el(dedo, `<img src="${IMG.dedo.src}" style="position:absolute;left:0;top:0;width:720px;height:230px">`);
    M.up(t => { dedoIn.style.transform = `translateY(${(150 * bob(t)).toFixed(1)}px)`; });
    M.K(dedo, { x: 700 }).to(0, { x: 0 }, .45, M.E.back).to(b(5) - .2, { x: 760, o: 0 }, .35, M.E.in);
    const cb = M.el(M.PALCOS, `<div class="abs" style="left:60px;width:440px;top:470px;text-align:left;font:900 64px Montserrat;color:#fff;-webkit-text-stroke:11px ${D};paint-order:stroke fill"></div>`);
    M.up(t => { if (t < b(6) - .3) { const up = bob(t) < 0; cb.innerHTML = up ? '⬆ CIMA' : '⬇ BAIXO'; cb.style.color = up ? '#FFD23F' : '#fff'; cb.style.visibility = 'visible'; } else cb.style.visibility = 'hidden'; });

    // ---------- 1) tigela: ingrediente cai na descida, tigela pula na subida ----------
    const X1 = SX;
    const perfilTig = [[0, -.55], [.45, -.52], [.85, -.35], [1.08, -.05], [1.18, .3], [1.2, .34]].map(([x, y]) => new T.Vector2(x, y));
    const tig = new T.Group(); cena.add(tig); const tigY = TOPO + .55 * 1.5;
    tig.position.set(X1 + .7, tigY, 1.3); tig.scale.setScalar(1.5);
    add(tig, new T.LatheGeometry(perfilTig, 56), mat('#3FB28A', { side: T.DoubleSide, roughness: .3 }));
    add(tig, new T.TorusGeometry(1.19, .05, 12, 56), mat('#9BE3C8', { roughness: .25 }), 0, .34, 0).rotation.x = Math.PI / 2;
    const recheio = add(tig, new T.CylinderGeometry(1.0, .75, .16, 48), mat('#F6E7C6', { roughness: .18 }), 0, -.16, 0); recheio.visible = false;
    const CORREC = ['#F6E7C6', '#B98258', '#8F5434', '#6E3A22'].map(c => new T.Color(c));
    const QUEDAS = [b(6), b(8), b(10), b(12)];
    const jH = recorte(cena, 'cabeca-feliz', 2.2, 2.89, X1 - 2.2, -.55, -.5);
    humor(jH, [[0, 'feliz'], [b(6), 'surpresa'], [b(7), 'feliz'], [b(8), 'surpresa'], [b(9), 'piscada'], [b(10), 'surpresa'], [b(11), 'lambendo']], 'cabeca-');
    // lata de leite condensado (rótulo pintado)
    const rotulo = canvasTex(512, 256, (g) => { g.fillStyle = '#5BA4E8'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#fff'; g.fillRect(0, 70, 512, 116); g.fillStyle = D; g.font = '900 54px Poppins'; g.textAlign = 'center'; g.fillText('LEITE', 256, 128); g.font = '800 34px Poppins'; g.fillText('CONDENSADO', 256, 172); });
    const lata = new T.Group(); cena.add(lata);
    add(lata, new T.CylinderGeometry(.55, .55, 1.3, 40), new T.MeshStandardMaterial({ map: rotulo, roughness: .4 }));
    add(lata, new T.CylinderGeometry(.56, .56, .08, 40), mat('#cfd6e4', { metalness: .6, roughness: .3 }), 0, .66, 0);
    const gotaLeite = add(cena, esf(.42, 32), mat('#F6E7C6', { roughness: .15 }), 0, 0, 0, 1, 1.25, 1);
    // colher de cacau
    const colherCacau = () => { const g = new T.Group(); cena.add(g); add(g, new T.CylinderGeometry(.07, .07, 2, 12), mat('#D59A55'), 1.1, 0, 0).rotation.z = Math.PI / 2; add(g, esf(.42, 24), mat('#D59A55'), 0, 0, 0, 1, .5, 1); add(g, esf(.34, 24), mat('#6E3A22', { roughness: .95 }), 0, .12, 0, 1, .45, 1); return g; };
    const cc1 = colherCacau(), cc2 = colherCacau();
    const nuvem = Array.from({ length: 10 }, () => { const m = add(cena, esf(.28, 16), new T.MeshStandardMaterial({ color: '#8B5233', transparent: true, opacity: .8, roughness: 1 }), 0, 0, 0, 1, 1, 1, false); m.visible = false; return m; });
    const manteiga = add(cena, new T.BoxGeometry(.8, .5, .55), mat('#FFE066', { roughness: .35 }));
    // ---------- 2) fogão e panela ----------
    const X2 = 2 * SX;
    const j2 = recorte(cena, 'corpo-feliz', 3.0, 4.65, X2 - 1.9, .35, -.6);
    humor(j2, [[0, 'feliz'], [b(15), 'olhosFechados'], [b(17), 'feliz']], 'corpo-');
    add(cena, new T.BoxGeometry(4.6, .35, 2.4), mat('#3a3040', { roughness: .4 }), X2 + 1.2, TOPO + .17, 1.2);
    add(cena, new T.TorusGeometry(.9, .07, 10, 40), mat('#222', { metalness: .5 }), X2 + 1.2, TOPO + .37, 1.2).rotation.x = Math.PI / 2;
    const chamas = Array.from({ length: 10 }, (_, k) => { const a = k / 10 * Math.PI * 2; const m = add(cena, new T.ConeGeometry(.12, .45, 10), new T.MeshStandardMaterial({ color: k % 2 ? '#FFB020' : '#FF6B3D', emissive: k % 2 ? '#FF9A00' : '#FF4A1A', emissiveIntensity: 1.4 }), X2 + 1.2 + Math.cos(a) * .85, TOPO + .55, 1.2 + Math.sin(a) * .85, 1, 1, 1, false); return m; });
    const perfilPan = [[0, 0], [1.2, 0], [1.25, .05], [1.3, 1.1], [1.36, 1.15]].map(([x, y]) => new T.Vector2(x, y));
    const pan = new T.Group(); pan.position.set(X2 + 1.2, TOPO + .6, 1.2); cena.add(pan);
    add(pan, new T.LatheGeometry(perfilPan, 56), mat('#E6407F', { side: T.DoubleSide, roughness: .35 }));
    [-1, 1].forEach(l => add(pan, new T.CapsuleGeometry(.12, .5, 6, 12), mat('#3a3040'), l * 1.65, .85, 0).rotation.z = Math.PI / 2);
    add(pan, new T.CylinderGeometry(1.24, 1.24, .1, 48), mat('#6E3A22', { roughness: .15 }), 0, .8, 0);
    const colherPau = new T.Group(); cena.add(colherPau);
    add(colherPau, new T.CylinderGeometry(.08, .08, 3.4, 12), mat('#D59A55'), 0, 1.7, 0); add(colherPau, esf(.32, 20), mat('#D59A55'), 0, 0, 0, 1, 1.3, .45);
    const bolhas = Array.from({ length: 5 }, (_, k) => add(pan, esf(.16, 16), mat('#8B5233', { roughness: .2 }), -.7 + k * .35, .86, (k % 2 ? .4 : -.3), 1, 1, 1, false));
    // ---------- 3) mesa: bolinhas e granulado ----------
    const X3 = 3 * SX;
    const perfilPrato = [[0, 0], [1.6, 0], [2.2, .12], [2.3, .2]].map(([x, y]) => new T.Vector2(x, y));
    add(cena, new T.LatheGeometry(perfilPrato, 64), mat('#ffffff', { roughness: .2, side: T.DoubleSide }), X3, TOPO + .02, 1.3);
    const granTex = canvasTex(256, 128, g => { g.fillStyle = '#5a2d18'; g.fillRect(0, 0, 256, 128); const cs = ['#2a120a', '#2a120a', '#2a120a', '#FF8FAB', '#FFD23F']; let s2 = 4; const r2 = () => (s2 = (s2 * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < 380; i++) { g.save(); g.translate(r2() * 256, r2() * 128); g.rotate(r2() * 3.14); g.fillStyle = cs[i % 5]; g.fillRect(-5, -1.6, 10, 3.2); g.restore(); } });
    const mBola = () => mat('#6b3720', { roughness: .45 }), mGran = new T.MeshStandardMaterial({ map: granTex, roughness: .7 });
    const perfilForma = Array.from({ length: 8 }, (_, k) => new T.Vector2(.42 + k * .035, k * .055));
    const POS = [[-1.1, .25], [0, .45], [1.1, .25], [-.6, -.45], [.6, -.45], [0, -.05]];
    const bolas = POS.map(([dx, dz], i) => {
      const g = new T.Group(); g.position.set(X3 + dx, TOPO + .48, 1.3 + dz); cena.add(g);
      const bola = add(g, esf(.42, 32), mBola()); const forma = add(g, new T.LatheGeometry(perfilForma, 24), mat('#FF8FAB', { side: T.DoubleSide }), 0, -.42, 0); forma.visible = false;
      return { g, bola, forma, tB: b(20 + 2 * Math.floor(i / 2)), tG: b(21 + 2 * Math.floor(i / 2)) };
    });
    const graos = Array.from({ length: 70 }, (_, i) => { const m = add(cena, new T.CapsuleGeometry(.035, .12, 3, 6), mat(i % 5 === 3 ? '#FF8FAB' : i % 7 === 0 ? '#FFD23F' : '#2a120a'), 0, 0, 0, 1, 1, 1, false); m.visible = false; return { m, x: (rnd() - .5) * 3.4, z: (rnd() - .5) * 1.6, h: 2 + rnd() * 2, r: rnd() * 6, k: i < 35 ? 21 : 23 }; });
    // ---------- 4) final: Jade com o prato ----------
    const X4 = 4 * SX;
    const j4 = recorte(cena, 'corpo-feliz', 3.4, 5.27, X4, .6, -.6);
    humor(j4, [[0, 'feliz'], [b(26), 'lambendo'], [b(28), 'olhosFechados'], [b(29), 'piscada']], 'corpo-');
    add(cena, new T.LatheGeometry(perfilPrato, 64), mat('#ffffff', { roughness: .2, side: T.DoubleSide }), X4, TOPO + .02, 1.7, .9, 1, .8);
    [[-1.1, .2], [0, .35], [1.1, .2], [-.55, -.3], [.55, -.3]].forEach(([dx, dz]) => { const g = new T.Group(); g.position.set(X4 + dx, TOPO + .45, 1.7 + dz); cena.add(g); add(g, esf(.4, 32), mGran); add(g, new T.LatheGeometry(perfilForma, 24), mat('#FF8FAB', { side: T.DoubleSide }), 0, -.4, 0); });

    // ---------- câmera e animação por quadro ----------
    const camX = t => { let x = 0; ESTACOES.slice(1).forEach((ts, i) => { const k = clamp((t - (ts - .32)) / .36); if (k > 0) x = lerp(i * SX, (i + 1) * SX, io(k)); }); return x; };
    ESTACOES.slice(1).forEach(ts => M.sfx('whoosh', ts - .32, .5));
    const queda = (obj, tChega, alturaFinal, dx = 0) => { const k = clamp((t_ - (tChega - .42)) / .42); obj.visible = t_ > tChega - .42 && t_ < tChega + .04; obj.position.y = lerp(alturaFinal + 6, alturaFinal, eIn(k)); obj.position.x += (1 - k) * dx; return k; };
    let t_ = 0;
    M.up(t => {
      t_ = t;
      if (!texOk && NOMES.every(n => IMG[n].complete && IMG[n].naturalWidth)) { NOMES.forEach(n => TEX[n].needsUpdate = true); texOk = true; }
      const y = bob(t), p = pulso(t), cx = camX(t);
      cam.position.set(cx, 2.0 + .36 * y, 14); cam.lookAt(cx, .5 + .36 * y, 0);
      sol.position.set(cx + 3, 8, 7); sol.target.position.set(cx, 0, 0);
      // Jade balança no ritmo (squash)
      [j0, j2, j4].forEach((j, i) => { j.scale.set(1 + .03 * p, 1 - .025 * p, 1); j.rotation.z = .05 * Math.sin(t * Math.PI / B / 2 + i); });
      jH.scale.set(1 + .04 * p, 1 - .04 * p, 1); jH.rotation.z = .08 * Math.sin(t * Math.PI / B);
      // tigela
      const sub = Math.max(0, -y); tig.position.y = tigY + .4 * sub * sub; tig.scale.set(1.5 * (1 + .04 * p), 1.5 * (1 - .05 * p), 1.5 * (1 + .04 * p));
      let n = -1; QUEDAS.forEach((tc, i) => { if (t >= tc) n = i; });
      recheio.visible = n >= 0; if (n >= 0) { recheio.material.color.copy(CORREC[n]); recheio.position.y = -.16 + n * .06; }
      const rimY = tig.position.y + .3;
      // lata despeja (b6)
      const kl = clamp((t - (b(6) - .8)) / .3), ks = clamp((t - (b(7) + .1)) / .3);
      lata.visible = t > b(6) - .8 && t < b(7) + .4; lata.position.set(X1 + 2.1 + 2 * (1 - kl) + 3 * ks, 2.3, 1.3); lata.rotation.z = lerp(0, 2.1, kl);
      gotaLeite.position.set(X1 + .7, 0, 1.3); queda(gotaLeite, b(6), rimY, 1.4);
      // cacau (b8, b12) + nuvem
      [[cc1, b(8), 1], [cc2, b(12), -1]].forEach(([cc, tc, l]) => { cc.position.set(X1 + .7, 0, 1.3); const k = queda(cc, tc, rimY + .3, 1.6 * l); cc.rotation.z = l * (1 - k) * .6; cc.visible = t > tc - .42 && t < tc + .25; });
      nuvem.forEach((m, i) => { const tc = i < 5 ? b(8) : b(12); const k = clamp((t - tc) / .7); m.visible = k > 0 && k < 1; const a = i / 5 * Math.PI * 2; m.position.set(X1 + .7 + Math.cos(a) * 1.6 * k, rimY + .2 + 1.6 * k, 1.3 + Math.sin(a) * .8 * k); m.scale.setScalar(.6 + 1.4 * k); m.material.opacity = .8 * (1 - k); });
      // manteiga (b10)
      manteiga.position.set(X1 + .7, 0, 1.3); queda(manteiga, b(10), rimY, -1.2); manteiga.rotation.set(t * 3, t * 2, 0);
      // fogão: chamas, colher mexendo, bolhas
      chamas.forEach((m, i) => { m.scale.y = .75 + .35 * Math.abs(Math.sin(t * 13 + i)); });
      const a = Math.PI * t / B; colherPau.position.set(X2 + 1.2 + .6 * Math.sin(a), TOPO + 1.4 + .35 * y, 1.2 + .4 * Math.cos(a)); colherPau.rotation.z = .25 * Math.sin(a);
      bolhas.forEach((m, i) => { const ph = ((t + i * .23) % B) / B; m.scale.setScalar(ph < .6 ? .3 + ph * 1.3 : 0); });
      // bolinhas caem na descida, granulado na subida
      bolas.forEach((o, i) => { const k = clamp((t - (o.tB - .42)) / .42); o.g.visible = t > o.tB - .42; o.g.position.y = TOPO + .48 + 5 * (1 - eIn(k)); const sq = clamp((t - o.tB) / .25); o.g.scale.set(1 + .18 * Math.sin(sq * Math.PI), 1 - .2 * Math.sin(sq * Math.PI), 1 + .18 * Math.sin(sq * Math.PI)); o.bola.material = t >= o.tG ? mGran : o.bola.material; o.forma.visible = t >= b(24); });
      graos.forEach(gq => { const t0 = b(gq.k) - .05, k = clamp((t - t0) / .9); gq.m.visible = k > 0 && k < 1; const hy = gq.h * 4 * k * (1 - k); gq.m.position.set(X3 + gq.x * (.4 + .6 * k), TOPO + .5 + hy, 1.3 + gq.z); gq.m.rotation.set(gq.r + t * 8, gq.r * 2, t * 5); });
      ren.render(cena, cam);
    });
    QUEDAS.forEach(tc => M.sfx('drop', tc, .55));
    for (let k = 7; k < 14; k += 2) M.sfx('pop', b(k), .3);
    for (let k = 14; k < 19; k++) M.sfx('swish', b(k), .3);
    [20, 22, 24].forEach(k => M.sfx('pop', b(k), .5)); [21, 23].forEach(k => M.sfx('shimmer', b(k), .35));

    // ---------- textos e final (2D por cima) ----------
    titulo(M.PALCOS, 'MEXA O DEDO', 'JUNTO!', 0, b(6) - .3, 220);
    titulo(M.PALCOS, 'LEITE', 'CONDENSADO', b(6) - .3, b(8) - .1, 210);
    titulo(M.PALCOS, 'CHOCOLATE!', '', b(8) - .1, b(10) - .1, 250);
    titulo(M.PALCOS, 'MANTEIGA!', '', b(10) - .1, b(12) - .1, 250);
    titulo(M.PALCOS, '+ CHOCOLATE!', '', b(12) - .1, ESTACOES[2] - .3, 250);
    titulo(M.PALCOS, 'MEXE,', 'MEXE!', ESTACOES[2] - .3, ESTACOES[3] - .3, 210);
    titulo(M.PALCOS, 'BOLINHAS', '+ GRANULADO', ESTACOES[3] - .3, ESTACOES[4] - .3, 210);
    titulo(M.PALCOS, 'HUMMM!', '', ESTACOES[4] - .3, b(28) + .2, 250);
    for (let i = 0; i < 8; i++) {
      const hh = M.el(M.PALCOS, `<svg class="abs" style="left:${120 + i * 110}px;top:1000px;overflow:visible" width="64" height="60" viewBox="0 0 64 60"><path d="M32 56C-10 28 2 2 17 2c9 0 13 6 15 11c2-5 6-11 15-11c15 0 27 26-15 54Z" fill="#FF4F8B" stroke="${D}" stroke-width="5"/></svg>`);
      M.K(hh, { o: 0, s: .3 }).to(b(27) + i * .1, { o: 1, s: 1 }, .2, M.E.back2).to(b(27) + i * .1, { y: -520 - (i % 3) * 60, x: (i - 3.5) * 16 }, 1.5, M.E.out).to(b(27) + i * .1 + 1.1, { o: 0 }, .4);
    }
    const logo = M.el(M.PALCOS, `<img class="abs" src="${IMG.logo.src}" style="left:90px;top:170px;width:900px;height:420px">`);
    M.K(logo, { o: 0, s: .3, r: -8 }).to(b(28) + .2, { o: 1, s: 1, r: 0 }, .45, M.E.back2).float(6, 1);
    M.sfx('ding', b(28) + .2, .5);
    const segue = M.el(M.PALCOS, `<div class="abs" style="left:0;right:0;top:570px;display:flex;justify-content:center"><div class="cp-pill" style="position:relative">SEGUE PRA MAIS RECEITINHAS 💖</div></div>`);
    M.K(segue, { o: 0, y: 30 }).to(b(29), { o: 1, y: 0 }, .3, M.E.back);
  }
};
})();
