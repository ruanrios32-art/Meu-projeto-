// Chef Jade em 3D — teste (three.js). Câmera sobe e desce no ritmo (120 BPM), ingredientes caem na tigela.
(() => {
const M = MQ, B = .5, b = n => n * B, W = 1080, H = 1920, D = '#2B1B17';
const bob = t => Math.cos(Math.PI * t / B) * (t < 8 ? 1 : Math.max(0, 1 - (t - 8) / .35));
const pulso = t => { const ph = ((t % B) + B) % B / B; return Math.exp(-ph * 7); };
const lerp = (a, c, k) => a + (c - a) * k, clamp = (x, a = 0, c = 1) => Math.max(a, Math.min(c, x));
const easeIn = k => k * k, easeOut = k => 1 - (1 - k) * (1 - k), back = k => { const s = 1.7; k -= 1; return k * k * ((s + 1) * k + s) + 1; };

function texturaPelo(T) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 512); grad.addColorStop(0, '#E99A2E'); grad.addColorStop(.5, '#F4AE45'); grad.addColorStop(1, '#F7C26B');
  g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
  let s = 3; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 170; i++) {
    const x = r() * 1024, y = 40 + r() * 440, w = 10 + r() * 16, h = 6 + r() * 9, a = r() * Math.PI;
    g.save(); g.translate(x, y); g.rotate(a);
    if (r() < .55) { g.fillStyle = '#C98236'; g.beginPath(); g.ellipse(0, 0, w, h, 0, 0, 7); g.fill(); g.lineWidth = 5; g.strokeStyle = '#241712'; g.setLineDash([w * .9, w * .35]); g.stroke(); }
    else { g.fillStyle = '#241712'; g.beginPath(); g.ellipse(0, 0, w * .6, h * .6, 0, 0, 7); g.fill(); }
    g.restore();
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = T.RepeatWrapping; return t;
}
function texturaAzulejo(T, cor1, cor2) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = cor1; g.fillRect(0, 0, 256, 256); g.fillStyle = cor2; g.fillRect(0, 0, 256, 8); g.fillRect(0, 0, 8, 256);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(10, 8); return t;
}

window.CENA = {
  jade3d(c) {
    const T = window.THREE;
    const cv = M.el(M.PALCOS, `<canvas class="abs dec" width="${W}" height="${H}" style="left:0;top:0;width:${W}px;height:${H}px"></canvas>`);
    const ren = new T.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
    ren.setSize(W, H, false); ren.outputColorSpace = T.SRGBColorSpace; ren.shadowMap.enabled = true; ren.shadowMap.type = T.PCFSoftShadowMap;
    ren.toneMapping = T.ACESFilmicToneMapping; ren.toneMappingExposure = 1.05;
    const cena = new T.Scene(); cena.background = new T.Color('#F6B6D0'); cena.fog = new T.Fog('#F6B6D0', 14, 30);
    const cam = new T.PerspectiveCamera(40, W / H, .1, 100);
    cena.add(new T.HemisphereLight('#FFF4F8', '#C76A90', 1.3));
    const sol = new T.DirectionalLight('#FFF1E0', 2.2); sol.position.set(3, 7, 6); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -5, right: 5, top: 6, bottom: -4 }); sol.shadow.radius = 6; cena.add(sol);
    const fill = new T.PointLight('#FFD6E8', 18, 20); fill.position.set(-3, 2, 4); cena.add(fill);
    const mat = (cor, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: cor, roughness: .65, metalness: 0 }, o));
    const add = (pai, geo, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => { const me = new T.Mesh(geo, m); me.position.set(x, y, z); me.scale.set(sx, sy, sz); me.castShadow = me.receiveShadow = true; pai.add(me); return me; };
    const esf = (r = 1, s = 40) => new T.SphereGeometry(r, s, Math.round(s * .75));

    // ---------- cozinha ----------
    add(cena, new T.PlaneGeometry(30, 16), mat('#FBC8DC', { map: texturaAzulejo(T, '#FBC8DC', '#FFE6F0') }), 0, 3, -3);
    add(cena, new T.PlaneGeometry(30, 20), mat('#E98AB2'), 0, -1.6, 4).rotation.x = -Math.PI / 2;
    const prat = add(cena, new T.BoxGeometry(9, .15, .7), mat('#C98A4B'), 0, 3.6, -2.6);
    [['#FFE08A', -3.4], ['#F7D6A8', -2.4], ['#C77B4A', 2.4], ['#FFB3CF', 3.4]].forEach(([cor, x]) => {
      add(cena, new T.CylinderGeometry(.33, .33, .7, 28), mat(cor, { roughness: .3 }), x, 4.05, -2.6);
      add(cena, new T.CylinderGeometry(.36, .36, .14, 28), mat('#E6407F'), x, 4.45, -2.6);
    });
    // balcão
    const balcao = add(cena, new T.BoxGeometry(12, 2.2, 3), mat('#E86FA0'), 0, -2.7, 1.2);
    add(cena, new T.BoxGeometry(12.2, .22, 3.2), mat('#FBD3E3', { roughness: .25 }), 0, -1.5, 1.2);
    [-3.3, -1.1, 1.1, 3.3].forEach(x => { add(cena, new T.BoxGeometry(1.9, 1.5, .08), mat('#F59BC0'), x, -2.65, 2.72); add(cena, esf(.08, 16), mat('#F4C542', { metalness: .6, roughness: .3 }), x + .7, -2.2, 2.8); });

    // ---------- Chef Jade 3D ----------
    const pelo = texturaPelo(T);
    const mPelo = mat('#ffffff', { map: pelo, roughness: .85 }), mCreme = mat('#FFF1DC', { roughness: .9 }), mPreto = mat('#241712', { roughness: .5 }),
      mBranco = mat('#ffffff', { roughness: .3 }), mRosa = mat('#E6407F', { roughness: .55 }), mRosa2 = mat('#F37AAE', { roughness: .6 }), mVerde = mat('#4FB534', { roughness: .2 }),
      mNariz = mat('#F27BA0', { roughness: .35 }), mBoca = mat('#7A2338'), mOuro = mat('#F4C542', { metalness: .7, roughness: .25 }), mMadeira = mat('#D59A55', { roughness: .7 });
    const jade = new T.Group(); cena.add(jade); jade.position.set(0, -1.1, -.6);
    // corpo + jardineira
    add(jade, new T.CapsuleGeometry(.78, .9, 12, 32), mPelo, 0, .55, 0, 1, 1, .85);
    add(jade, new T.CylinderGeometry(.82, .86, 1.0, 40, 1, true, -Math.PI * .42, Math.PI * .84), mRosa, 0, .35, 0, 1, 1, .88);
    add(jade, new T.BoxGeometry(.85, .55, .1), mRosa, 0, .95, .64);
    add(jade, esf(.07, 16), mOuro, -.32, 1.12, .7); add(jade, esf(.07, 16), mOuro, .32, 1.12, .7);
    [-1, 1].forEach(l => { const bab = add(jade, esf(.32, 24), mRosa2, l * .66, 1.32, .1, 1.1, .55, .9); bab.rotation.z = l * .5; });
    // braços
    const braco = l => { const g = new T.Group(); g.position.set(l * .9, 1.15, .1); jade.add(g); add(g, new T.CapsuleGeometry(.2, .75, 8, 20), mPelo, 0, -.45, 0); add(g, esf(.24, 24), mCreme, 0, -.95, .05); return g; };
    const bE = braco(-1), bD = braco(1); bE.rotation.z = -.35; bD.rotation.z = .2;
    const colher = new T.Group(); bD.add(colher); colher.position.set(0, -.95, .15);
    add(colher, new T.CylinderGeometry(.05, .05, 1.4, 12), mMadeira, 0, .65, 0); add(colher, esf(.2, 24), mMadeira, 0, 1.4, 0, 1, 1.3, .45);
    // cauda
    const curva = new T.CatmullRomCurve3([new T.Vector3(.5, -.2, -.5), new T.Vector3(1.2, -.1, -.8), new T.Vector3(1.45, .4, -.8), new T.Vector3(1.2, .75, -.7)]);
    add(jade, new T.TubeGeometry(curva, 40, .15, 16), mPelo); add(jade, esf(.16, 16), mPreto, 1.2, .75, -.7);
    // cabeça
    const cab = new T.Group(); cab.position.set(0, 2.25, .1); jade.add(cab);
    add(cab, esf(1, 48), mPelo, 0, 0, 0, 1.12, .98, .95);
    add(cab, esf(.62, 40), mCreme, 0, -.38, .62, 1.25, .8, .62);
    [-1, 1].forEach(l => {
      add(cab, esf(.42, 32), mCreme, l * .38, .12, .66, 1, .95, .55);                    // contorno claro dos olhos
      const orel = add(cab, esf(.4, 32), mPelo, l * .78, .82, -.1, .95, 1.1, .4); orel.rotation.z = -l * .35;
      add(cab, esf(.28, 28), mat('#F6A6B8'), l * .78, .8, .02, .85, 1, .3).rotation.z = -l * .35;
      add(cab, new T.CapsuleGeometry(.035, .32, 4, 8), mPreto, l * .86, -.12, .62).rotation.z = l * 1.2;   // listras da bochecha
      add(cab, new T.CapsuleGeometry(.035, .28, 4, 8), mPreto, l * .8, -.3, .64).rotation.z = l * 1.3;
    });
    // olhos (com pálpebra pra piscar)
    const olhos = [-1, 1].map(l => {
      const g = new T.Group(); g.position.set(l * .38, .14, .86); cab.add(g);
      add(g, esf(.26, 32), mBranco, 0, 0, 0, 1, 1.1, .6);
      add(g, esf(.19, 32), mVerde, l * .01, -.01, .1, 1, 1.05, .5);
      add(g, esf(.1, 24), mPreto, l * .01, -.01, .17, 1, 1.25, .5);
      add(g, esf(.045, 12), mBranco, l * .01 + .06, .07, .21);
      for (let k = 0; k < 3; k++) { const cil = add(g, new T.CapsuleGeometry(.018, .14, 4, 6), mPreto, l * (.16 + k * .06), .22 - k * .03, .05); cil.rotation.z = -l * (.5 + k * .35); }
      const pal = add(g, esf(.275, 32, ), mPelo, 0, .3, .0, 1, .02, .62); return pal;
    });
    add(cab, esf(.11, 24), mNariz, 0, -.18, 1.08, 1.3, .9, .8);
    const boca = add(cab, esf(.13, 32), mBoca, 0, -.47, 1.0, 1.25, .7, .4);
    add(cab, esf(.08, 24), mNariz, 0, -.52, 1.05, 1.1, .5, .4);
    const sorriso = add(cab, new T.TorusGeometry(.2, .025, 8, 32, Math.PI), mPreto, 0, -.36, 1.03); sorriso.rotation.z = Math.PI;
    for (let i = 0; i < 6; i++) add(cab, new T.CylinderGeometry(.006, .006, .9, 4), mPreto, (i < 3 ? -1 : 1) * .78, -.28 - (i % 3) * .08, .82).rotation.z = Math.PI / 2 + (i % 3 - 1) * .15 * (i < 3 ? 1 : -1);
    for (let i = 0; i < 5; i++) add(cab, new T.CapsuleGeometry(.04, .2, 4, 8), mPreto, (i - 2) * .14, .78, .62).rotation.x = -.5;
    // chapéu com laço
    const chap = new T.Group(); chap.position.set(0, .92, -.05); chap.rotation.z = -.08; cab.add(chap);
    add(chap, new T.CylinderGeometry(.74, .78, .42, 40), mBranco, 0, 0, 0);
    [[0, .62, 0, .55], [-.38, .48, .1, .42], [.38, .5, .05, .42], [0, .55, .32, .4], [0, .48, -.3, .42]].forEach(([x, y, z, r]) => add(chap, esf(r, 32), mBranco, x, y, z));
    const laco = new T.Group(); laco.position.set(-.62, .05, .45); laco.rotation.set(0, .4, .3); chap.add(laco);
    add(laco, new T.ConeGeometry(.2, .36, 20), mRosa, -.2, 0, 0).rotation.z = Math.PI / 2;
    add(laco, new T.ConeGeometry(.2, .36, 20), mRosa, .2, 0, 0).rotation.z = -Math.PI / 2;
    add(laco, esf(.1, 16), mRosa2, 0, 0, .04);

    // ---------- tigela + ingredientes ----------
    const perfil = [[0, -.55], [.45, -.52], [.85, -.35], [1.08, -.05], [1.18, .3], [1.2, .34]].map(([x, y]) => new T.Vector2(x, y));
    const tig = new T.Group(); tig.position.set(0, -.98, 1.6); cena.add(tig);
    add(tig, new T.LatheGeometry(perfil, 48), mat('#3FB28A', { side: T.DoubleSide, roughness: .35 }));
    add(tig, new T.TorusGeometry(1.19, .05, 12, 48), mat('#7DD3B3', { roughness: .3 }), 0, .34, 0).rotation.x = Math.PI / 2;
    const recheio = add(tig, new T.CylinderGeometry(1.0, .7, .2, 40), mat('#F6E7C6', { roughness: .25 }), 0, -.2, 0); recheio.visible = false;
    const cores = ['#F6E7C6', '#B98258', '#8F5434', '#6E3A22'].map(c => new T.Color(c));
    const ing = [
      add(cena, esf(.35, 32), mat('#F6E7C6', { roughness: .2 }), 1.45, 6, 1.0, 1, 1.25, 1),
      add(cena, esf(.3, 24), mat('#7A4228', { roughness: .9 }), 1.45, 6, 1.0),
      add(cena, new T.BoxGeometry(.5, .32, .38), mat('#FFE066', { roughness: .4 }), 1.45, 6, 1.0),
      add(cena, esf(.3, 24), mat('#6E3A22', { roughness: .9 }), 1.45, 6, 1.0),
    ];
    const quedas = [b(4), b(6), b(8), b(10)];

    // ---------- animação por quadro ----------
    M.up(t => {
      const y = bob(t), p = pulso(t);
      cam.position.set(0, 1.9 + .3 * -y, 11.5); cam.lookAt(0, .55 + .3 * -y, 0);
      jade.position.y = -1.1 + .06 * p; jade.rotation.y = .18 + .06 * Math.sin(t * Math.PI / B / 2);
      cab.rotation.z = .07 * Math.sin(t * Math.PI / B); cab.rotation.x = -.05 + .05 * p;
      bD.rotation.z = .2 + .25 * Math.max(0, y); bE.rotation.z = -.35 - .12 * p;
      const pisca = [1.2, 3.1, 5.6, 7.4].some(tb => t > tb && t < tb + .16);
      olhos.forEach(pal => { pal.scale.y = pisca ? 1.05 : .02; pal.position.y = pisca ? .0 : .3; });
      boca.scale.y = .5 + .3 * p;
      // tigela pula na subida
      const sub = Math.max(0, -y); tig.position.y = -.98 + .25 * sub * sub; tig.scale.set(1 + .05 * p, 1 - .05 * p, 1 + .05 * p);
      // ingredientes: caem e entram na tigela exatamente na descida
      ing.forEach((m, i) => {
        const tc = quedas[i], k = clamp((t - (tc - .45)) / .45);
        m.visible = t > tc - .45 && t < tc + .05;
        m.position.set((1 - k) * (i % 2 ? -.8 : .8), lerp(6, -.6, easeIn(k)) + tig.position.y + .98, 1.6); m.rotation.set(k * 3, k * 2, 0);
      });
      let n = -1; quedas.forEach((tc, i) => { if (t >= tc) n = i; });
      recheio.visible = n >= 0; if (n >= 0) { recheio.material.color.copy(cores[n]); recheio.position.y = -.2 + n * .07; }
      ren.render(cena, cam);
    });
    quedas.forEach(tc => M.sfx('drop', tc, .55));
    for (let k = 5; k < 12; k += 2) M.sfx('pop', b(k), .25);
    M.sfx('ding', b(16), .5);

    // ---------- textos ----------
    const tit = (l1, l2, t0, t1) => {
      const w = M.el(M.PALCOS, `<div class="abs" style="left:0;right:0;top:230px;text-align:center;font:900 ${l2 ? 96 : 112}px/1.02 Montserrat,sans-serif;color:#fff;-webkit-text-stroke:17px ${D};paint-order:stroke fill;text-shadow:0 8px 0 ${D}">${l1}${l2 ? `<br><span style="color:#FFD23F">${l2}</span>` : ''}</div>`);
      M.win(w, t0, t1); M.K(w, { s: .4, o: 0 }).to(t0, { s: 1, o: 1 }, .28, M.E.back2);
      M.up(tt => { if (tt >= t0 && tt < t1) w.style.scale = (1 + .05 * pulso(tt)).toFixed(3); });
    };
    tit('CHEF JADE', 'EM 3D!', 0, b(4) - .3);
    tit('LEITE', 'CONDENSADO', b(4) - .3, b(6) - .1); tit('CHOCOLATE!', '', b(6) - .1, b(8) - .1); tit('MANTEIGA!', '', b(8) - .1, b(10) - .1); tit('+ CHOCOLATE!', '', b(10) - .1, b(12) - .1); tit('HUMMM!', '', b(12) - .1, 99);
  }
};
})();
