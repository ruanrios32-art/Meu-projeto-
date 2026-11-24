// Jaguatirica chef — desenho em SVG (personagem original). jaguatirica(variante, humor) -> string SVG (viewBox 0 0 400 540)
(function (g) {
  const D = '#2a2030', PELO = '#F0B04E', PELO2 = '#E39A35', CLARO = '#FFF4E2', MANCHA = '#3a2a22', MIOLO = '#C98236';
  const roseta = (x, y, r, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - r} ${y}a${r} ${r * .8} 0 1 1 ${r * 2} 0a${r} ${r * .8} 0 1 1 ${-r * 2} 0" fill="${MIOLO}" stroke="${MANCHA}" stroke-width="${r * .45}" stroke-dasharray="${r * 1.5} ${r * .5}" stroke-linecap="round"/></g>`;
  const ponto = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${MANCHA}"/>`;
  function olhos(v, h) {
    const y = 196, dx = v === 'fofa' ? 54 : 50, r = v === 'fofa' ? 30 : 25;
    const um = (x, lado) => {
      if (h === 'feliz' || (v === 'chef' && h === 'normal')) {
        if (v === 'chef') return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .75}" fill="#fff" stroke="${D}" stroke-width="6"/><circle cx="${x}" cy="${y + 3}" r="${r * .55}" fill="#8A5A1C"/><circle cx="${x}" cy="${y + 3}" r="${r * .3}" fill="${D}"/><circle cx="${x + 5}" cy="${y - 3}" r="5" fill="#fff"/><path d="M${x - r - 4} ${y - r * .55}Q${x} ${y - r * 1.05} ${x + r + 4} ${y - r * .55}" fill="${PELO}" stroke="${D}" stroke-width="6" stroke-linecap="round"/>`;
        return `<path d="M${x - r * .8} ${y + 4}Q${x} ${y - r * 1.1} ${x + r * .8} ${y + 4}" fill="none" stroke="${D}" stroke-width="8" stroke-linecap="round"/>`;
      }
      if (v === 'engracada' && lado > 0) return `<path d="M${x - r * .8} ${y + 2}L${x + r * .8} ${y - 2}" stroke="${D}" stroke-width="8" stroke-linecap="round"/><path d="M${x - r * .6} ${y - 14}L${x + r * .7} ${y - 22}" stroke="${D}" stroke-width="6" stroke-linecap="round"/>`;
      return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="#fff" stroke="${D}" stroke-width="6"/><circle cx="${x + lado * 3}" cy="${y + 4}" r="${r * .7}" fill="#8A5A1C"/><circle cx="${x + lado * 3}" cy="${y + 4}" r="${r * .45}" fill="${D}"/><circle cx="${x + lado * 3 + 8}" cy="${y - 6}" r="${r * .22}" fill="#fff"/><circle cx="${x + lado * 3 - 6}" cy="${y + 12}" r="${r * .1}" fill="#fff"/>`;
    };
    // listras de jaguatirica: branco em cima do olho + listra escura descendo pela bochecha
    const marca = (x, lado) => `<path d="M${x - 18 * lado} ${y - 38}q${18 * lado} -10 ${34 * lado} 0" stroke="${CLARO}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${x + 22 * lado} ${y + 24}q${12 * lado} 14 ${30 * lado} 18" stroke="${MANCHA}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${x + 12 * lado} ${y + 40}q${14 * lado} 16 ${32 * lado} 20" stroke="${MANCHA}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    return marca(200 - dx, -1) + marca(200 + dx, 1) + um(200 - dx, -1) + um(200 + dx, 1);
  }
  function boca(v, h) {
    const y = 262;
    let s = `<path d="M188 ${y - 14}Q200 ${y - 22} 212 ${y - 14}Q206 ${y - 2} 200 ${y}Q194 ${y - 2} 188 ${y - 14}Z" fill="#B85C6A" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>`;
    if (v === 'engracada' || h === 'feliz') s += `<path d="M200 ${y}v6M166 ${y + 4}Q183 ${y + 34} 200 ${y + 8}Q217 ${y + 34} 234 ${y + 4}" stroke="${D}" stroke-width="6" fill="#7a2f3a" stroke-linejoin="round" stroke-linecap="round"/><path d="M186 ${y + 18}q14 18 28 0" fill="#F27B8E"/>`;
    else s += `<path d="M200 ${y}v8M176 ${y + 6}Q188 ${y + 20} 200 ${y + 8}Q212 ${y + 20} 224 ${y + 6}" stroke="${D}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    if (v === 'engracada') s += `<path d="M190 ${y + 10}h8v10h-8z" fill="#fff" stroke="${D}" stroke-width="3"/>`;
    const bx = [[-1, 0], [1, 0]].map(([l]) => `<path d="M${200 + l * 58} ${y - 2}l${l * 62} -10M${200 + l * 58} ${y + 8}l${l * 64} 6" stroke="${D}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`).join('');
    return s + bx;
  }
  function chapeu(v) {
    if (v === 'fofa') return `<g><rect x="132" y="62" width="136" height="34" rx="10" fill="#fff" stroke="${D}" stroke-width="6"/><circle cx="160" cy="50" r="30" fill="#fff" stroke="${D}" stroke-width="6"/><circle cx="240" cy="50" r="30" fill="#fff" stroke="${D}" stroke-width="6"/><circle cx="200" cy="34" r="38" fill="#fff" stroke="${D}" stroke-width="6"/><rect x="138" y="58" width="124" height="22" fill="#fff"/><circle cx="244" cy="74" r="9" fill="#FF8FAB" stroke="${D}" stroke-width="4"/></g>`;
    if (v === 'engracada') return `<g transform="rotate(-12 200 70)"><rect x="140" y="58" width="120" height="36" rx="10" fill="#fff" stroke="${D}" stroke-width="6"/><path d="M146 62C120 20 160 -40 200 -10C240 -50 300 10 252 62Z" fill="#fff" stroke="${D}" stroke-width="6"/><path d="M200 -10C190 20 196 40 204 60" stroke="#ddd" stroke-width="5" fill="none"/></g>`;
    return `<g><rect x="138" y="48" width="124" height="44" rx="8" fill="#fff" stroke="${D}" stroke-width="6"/><path d="M144 52C110 30 116 -30 160 -26C170 -60 230 -60 240 -26C284 -30 290 30 256 52Z" fill="#fff" stroke="${D}" stroke-width="6"/><path d="M170 -10v56M200 -24v70M230 -10v56" stroke="#e3e3ea" stroke-width="5" stroke-linecap="round"/></g>`;
  }
  function corpo(v) {
    const avental = v === 'fofa' ? '#FF8FAB' : v === 'engracada' ? '#5BC0F8' : '#fff';
    let s = '';
    // cauda com anéis
    s += `<path d="M268 470C340 470 360 400 340 350" stroke="${D}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M268 470C340 470 360 400 340 350" stroke="${PELO}" stroke-width="28" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M330 448l14 14M346 420l18 6M352 390l18 0M346 362l16 -6" stroke="${MANCHA}" stroke-width="9" stroke-linecap="round"/>`;
    // corpo
    s += `<path d="M120 520C100 420 130 330 200 330C270 330 300 420 280 520Z" fill="${PELO}" stroke="${D}" stroke-width="7"/>`;
    s += `<path d="M150 520C140 440 160 370 200 370C240 370 260 440 250 520Z" fill="${CLARO}"/>`;
    s += roseta(140, 420, 12, 20) + roseta(262, 410, 11, -15) + roseta(150, 480, 10) + roseta(256, 470, 12, 30);
    // avental
    s += `<path d="M150 360h100l14 160H136Z" fill="${avental}" stroke="${D}" stroke-width="6" stroke-linejoin="round"/><rect x="176" y="420" width="48" height="34" rx="8" fill="none" stroke="${D}" stroke-width="5"/>`;
    if (v === 'chef') s += `<path d="M150 336l50 34 50-34-14 26-36 16-36-16z" fill="#E5484D" stroke="${D}" stroke-width="6" stroke-linejoin="round"/>`;
    // braços
    s += `<path d="M138 380C110 400 104 440 126 456" stroke="${D}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M138 380C110 400 104 440 126 456" stroke="${PELO}" stroke-width="27" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M262 380C290 396 300 420 292 440" stroke="${D}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M262 380C290 396 300 420 292 440" stroke="${PELO}" stroke-width="27" fill="none" stroke-linecap="round"/>`;
    // colher de pau
    s += `<g transform="rotate(${v === 'engracada' ? 30 : 18} 292 440)"><rect x="286" y="330" width="14" height="120" rx="7" fill="#C98A4B" stroke="${D}" stroke-width="5"/><ellipse cx="293" cy="322" rx="22" ry="30" fill="#C98A4B" stroke="${D}" stroke-width="5"/></g>`;
    s += ponto(118, 410, 6) + ponto(126, 432, 5) + ponto(282, 400, 6) + ponto(292, 418, 5) + roseta(170, 350, 9) + roseta(232, 350, 9, 20);
    s += `<circle cx="126" cy="458" r="17" fill="${CLARO}" stroke="${D}" stroke-width="6"/><circle cx="292" cy="440" r="17" fill="${CLARO}" stroke="${D}" stroke-width="6"/>`;
    return s;
  }
  function cabeca(v) {
    const rx = v === 'fofa' ? 138 : 126, ry = v === 'fofa' ? 120 : 112;
    let s = '';
    // orelhas (redondas, costas escuras com ponto branco = marca da jaguatirica)
    for (const l of [-1, 1]) {
      const x = 200 + l * (rx - 30), y = 118;
      s += `<circle cx="${x}" cy="${y}" r="40" fill="${MANCHA}" stroke="${D}" stroke-width="6"/><circle cx="${x}" cy="${y + 4}" r="30" fill="${PELO}"/><circle cx="${x}" cy="${y + 8}" r="18" fill="#F7C9C9"/>`;
    }
    s += `<ellipse cx="200" cy="215" rx="${rx}" ry="${ry}" fill="${PELO}" stroke="${D}" stroke-width="7"/>`;
    // bochechas claras e focinho
    s += `<path d="M${200 - rx + 10} 250Q200 ${340 + (v === 'fofa' ? 0 : -8)} ${200 + rx - 10} 250Q${200 + rx - 30} 300 200 ${326}Q${200 - rx + 30} 300 ${200 - rx + 10} 250Z" fill="${CLARO}"/>`;
    s += `<ellipse cx="200" cy="262" rx="58" ry="40" fill="${CLARO}"/>`;
    // manchas da testa
    s += `<path d="M200 112v26M178 118l6 22M222 118l-6 22" stroke="${MANCHA}" stroke-width="8" stroke-linecap="round"/>`;
    s += ponto(150, 140, 6) + ponto(250, 140, 6) + ponto(130, 168, 5) + ponto(270, 168, 5) + roseta(98, 214, 9, 30) + roseta(302, 214, 9, -30) + ponto(104, 262, 5) + ponto(296, 262, 5) + ponto(176, 150, 4) + ponto(224, 150, 4);
    s += `<ellipse cx="${200 - rx + 52}" cy="252" rx="18" ry="11" fill="#FF8FAB" opacity="${v === 'chef' ? .35 : .6}"/><ellipse cx="${200 + rx - 52}" cy="252" rx="18" ry="11" fill="#FF8FAB" opacity="${v === 'chef' ? .35 : .6}"/>`;
    return s;
  }
  g.jaguatirica = (v = 'fofa', h = 'normal') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -70 400 610" overflow="visible">${corpo(v)}<g transform="translate(0 10)">${cabeca(v)}${olhos(v, h)}${boca(v, h)}${chapeu(v)}</g></svg>`;
})(typeof window !== 'undefined' ? window : globalThis);
