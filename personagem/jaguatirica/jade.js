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
