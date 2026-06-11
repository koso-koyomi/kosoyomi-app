"use strict";
/* ============================================================
   幾何学紋章（SVG）— 濃紺 #0B0E1A × 金 #C9A227 × 月光青 #7FA8C9
   各紋章は viewBox -50..50 の中心に描く線刻スタイル。
   モチーフは正本データの「象徴・紋章」記述に基づく。
   ============================================================ */

const KOSO_GOLD = "#C9A227";
const KOSO_GOLD_PALE = "#E8D9A0";
const KOSO_MOON_BLUE = "#7FA8C9";
const KOSO_NAVY = "#0B0E1A";

function kosoStroke(inner, w) {
  return '<g fill="none" stroke="' + KOSO_GOLD + '" stroke-width="' + (w || 1.6) +
         '" stroke-linecap="round" stroke-linejoin="round">' + inner + "</g>";
}

/* 内向きの螺旋（潮騒）を生成 */
function kosoSpiralPath() {
  const pts = [];
  const turns = 2.6;
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * turns * 2 * Math.PI - Math.PI / 2;
    const r = 32 - t * 28;
    pts.push((r * Math.cos(ang)).toFixed(2) + " " + (r * Math.sin(ang)).toFixed(2));
  }
  return "M " + pts.join(" L ");
}

const KOSO_EMBLEMS = {

  /* 曙：開きかけた戸の隙間から差す一筋＋地平の半円陽 */
  akebono: function () {
    let rays = "";
    [-150, -120, -60, -30].forEach(function (deg) {
      const a = deg * Math.PI / 180;
      rays += '<path d="M' + (19 * Math.cos(a)).toFixed(1) + " " + (20 + 19 * Math.sin(a)).toFixed(1) +
              " L" + (27 * Math.cos(a)).toFixed(1) + " " + (20 + 27 * Math.sin(a)).toFixed(1) + '"/>';
    });
    return kosoStroke(
      '<path d="M-36 20 H36"/>' +
      '<path d="M-15 20 A15 15 0 0 1 15 20"/>' +
      rays +
      '<path d="M0 2 V-38"/>'
    ) +
    '<path d="M-3 -2 V-28 M3 -2 V-28" fill="none" stroke="' + KOSO_MOON_BLUE + '" stroke-width="0.9" stroke-linecap="round" opacity="0.7"/>' +
    '<circle cx="0" cy="26" r="3" fill="none" stroke="' + KOSO_MOON_BLUE + '" stroke-width="1.2"/>';
  },

  /* 日輪：八方に腕を伸ばす日輪、中心に開いた一つの目 */
  nichirin: function () {
    let rays = "";
    for (let i = 0; i < 8; i++) {
      const a = (i * 45 - 90) * Math.PI / 180;
      rays += '<path d="M' + (21 * Math.cos(a)).toFixed(1) + " " + (21 * Math.sin(a)).toFixed(1) +
              " L" + (31 * Math.cos(a)).toFixed(1) + " " + (31 * Math.sin(a)).toFixed(1) + '"/>';
    }
    return kosoStroke(
      '<circle cx="0" cy="0" r="16"/>' + rays +
      '<path d="M-8 0 Q0 -7 8 0 Q0 7 -8 0 Z"/>'
    ) +
    '<circle cx="0" cy="0" r="2.3" fill="' + KOSO_MOON_BLUE + '"/>';
  },

  /* 竈火：円炉の中で揺れない焔＋三つ石 */
  kamado: function () {
    return kosoStroke(
      '<circle cx="0" cy="2" r="27"/>' +
      '<path d="M0 -13 C9 -3 7 9 0 14 C-7 9 -9 -3 0 -13 Z"/>' +
      '<ellipse cx="-11" cy="20" rx="4" ry="2.6"/>' +
      '<ellipse cx="0" cy="23" rx="4" ry="2.6"/>' +
      '<ellipse cx="11" cy="20" rx="4" ry="2.6"/>'
    ) +
    '<path d="M0 -4 C3.5 1 3 6 0 9 C-3 6 -3.5 1 0 -4 Z" fill="none" stroke="' + KOSO_MOON_BLUE + '" stroke-width="1.1"/>';
  },

  /* 鍛冶：金床と小槌、飛び散る三つの火花 */
  kaji: function () {
    const spark = function (x, y) {
      return '<path d="M' + (x - 3.2) + " " + y + " H" + (x + 3.2) +
             " M" + x + " " + (y - 3.2) + " V" + (y + 3.2) +
             " M" + (x - 2.1) + " " + (y - 2.1) + " L" + (x + 2.1) + " " + (y + 2.1) +
             " M" + (x + 2.1) + " " + (y - 2.1) + " L" + (x - 2.1) + " " + (y + 2.1) + '"/>';
    };
    return kosoStroke(
      '<path d="M-18 4 H18 V9 H-18 Z"/>' +
      '<path d="M-12 9 L-9 16 H9 L12 9"/>' +
      '<path d="M-13 16 H13 V21 H-13 Z M-13 21 H-16 M13 21 H16"/>' +
      '<g transform="translate(13,-24) rotate(42)">' +
      '<rect x="-10" y="-4.5" width="20" height="9" rx="1.5"/>' +
      '<path d="M0 4.5 L0 21"/></g>'
    ) +
    '<g fill="none" stroke="' + KOSO_MOON_BLUE + '" stroke-width="1" stroke-linecap="round">' +
    spark(-16, -15) + spark(-5, -26) + spark(-24, -29) + "</g>";
  },

  /* 穂：結わえた麦穂の一束と三粒の種 */
  ho: function () {
    const ear = function (x, y, dx) {
      return '<path d="M' + x + " " + y + " l" + (dx - 4) + " -6 M" + x + " " + y + " l" + (dx + 4) + " -6" + '"/>';
    };
    return kosoStroke(
      '<path d="M0 30 C0 10 0 -10 0 -32"/>' +
      '<path d="M-2 28 C-9 8 -13 -8 -21 -26"/>' +
      '<path d="M2 28 C9 8 13 -8 21 -26"/>' +
      ear(0, -16, 0) + ear(0, -24, 0) + ear(0, -32, 0) +
      ear(-15, -14, -3) + ear(-18, -20, -3) + ear(-21, -26, -3) +
      ear(15, -14, 3) + ear(18, -20, 3) + ear(21, -26, 3) +
      '<ellipse cx="0" cy="13" rx="9" ry="3.4"/>'
    ) +
    '<g fill="' + KOSO_MOON_BLUE + '"><circle cx="-8" cy="37" r="1.7"/><circle cx="0" cy="39" r="1.7"/><circle cx="8" cy="37" r="1.7"/></g>';
  },

  /* 礎：三段の敷石、山形の下の一本の水平線 */
  ishizue: function () {
    return kosoStroke(
      '<path d="M-12 -26 L0 -36 L12 -26"/>' +
      '<path d="M-18 -20 H18"/>' +
      '<rect x="-9" y="-13" width="18" height="9" rx="1.5"/>' +
      '<rect x="-20" y="-2" width="18" height="9" rx="1.5"/>' +
      '<rect x="2" y="-2" width="18" height="9" rx="1.5"/>' +
      '<rect x="-30" y="9" width="18" height="9" rx="1.5"/>' +
      '<rect x="-9" y="9" width="18" height="9" rx="1.5"/>' +
      '<rect x="12" y="9" width="18" height="9" rx="1.5"/>'
    );
  },

  /* 潮騒：内へ巻く一筋の螺旋 */
  shiosai: function () {
    return kosoStroke('<path d="' + kosoSpiralPath() + '"/>', 1.7) +
    '<circle cx="0" cy="-4" r="1.8" fill="' + KOSO_MOON_BLUE + '"/>';
  },

  /* 水脈：三筋の波線 */
  suimyaku: function () {
    const wave = function (y) {
      return "M-30 " + y + " q7.5 -9 15 0 q7.5 9 15 0 q7.5 -9 15 0 q7.5 9 15 0";
    };
    return kosoStroke('<path d="' + wave(-13) + '"/><path d="' + wave(13) + '"/>') +
    '<path d="' + wave(0) + '" fill="none" stroke="' + KOSO_MOON_BLUE + '" stroke-width="1.6" stroke-linecap="round"/>';
  },

  /* 風待ち：八方位の風配図 */
  kazamachi: function () {
    let pts = "";
    [45, 135, 225, 315].forEach(function (deg) {
      pts += '<g transform="rotate(' + deg + ')"><path d="M0 -21 L2.4 -7 L0 -4 L-2.4 -7 Z"/></g>';
    });
    let longs = "";
    [90, 180, 270].forEach(function (deg) {
      longs += '<g transform="rotate(' + deg + ')"><path d="M0 -33 L3.4 -8 L0 -3.5 L-3.4 -8 Z"/></g>';
    });
    return kosoStroke(
      '<circle cx="0" cy="0" r="27" stroke-width="1"/>' +
      longs + pts +
      '<circle cx="0" cy="0" r="3.4"/>'
    ) +
    '<path d="M0 -33 L3.4 -8 L0 -3.5 L-3.4 -8 Z" fill="rgba(127,168,201,0.35)" stroke="' + KOSO_MOON_BLUE + '" stroke-width="1.2" stroke-linejoin="round"/>';
  },

  /* 霧：乳白の窓硝子に引かれた一本の指線 */
  kiri: function () {
    return '<rect x="-20" y="-27" width="40" height="54" rx="3" fill="rgba(127,168,201,0.12)" stroke="' + KOSO_GOLD + '" stroke-width="1.2"/>' +
    '<g stroke="' + KOSO_GOLD + '" stroke-width="1" stroke-linecap="round" opacity="0.45" stroke-dasharray="4 6">' +
    '<path d="M-14 -14 H14"/><path d="M-14 -2 H14"/><path d="M-14 10 H14"/></g>' +
    '<path d="M-9 -20 C0 -10 -7 4 3 14 C6 17 8 19 10 21" fill="none" stroke="' + KOSO_MOON_BLUE + '" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="10.5" cy="24" r="1.5" fill="' + KOSO_MOON_BLUE + '"/>';
  },

  /* 宵闇：星を銀の鋲にした夜の織布 */
  yoiyami: function () {
    const dots = [[-14, -8], [2, -15], [16, -6], [-4, 2], [10, 10], [-16, 10], [0, 18]];
    let stars = '<g fill="' + KOSO_MOON_BLUE + '">';
    dots.forEach(function (p) { stars += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.5"/>'; });
    stars += "</g>";
    return '<path d="M-26 -18 C-16 -27 16 -27 26 -18 C29 -4 27 12 22 22 C8 28 -8 28 -22 22 C-27 12 -29 -4 -26 -18 Z" ' +
    'fill="rgba(16,24,46,0.85)" stroke="' + KOSO_GOLD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    stars +
    '<circle cx="8" cy="-2" r="2.1" fill="' + KOSO_GOLD + '"/>';
  },

  /* 月待：銀の盃に映る月 */
  tsukimachi: function () {
    return kosoStroke(
      '<ellipse cx="0" cy="-12" rx="16" ry="4"/>' +
      '<path d="M-16 -12 C-15 2 -7 9 0 9 C7 9 15 2 16 -12"/>' +
      '<path d="M0 9 V21"/>' +
      '<ellipse cx="0" cy="24" rx="10" ry="2.6"/>'
    ) +
    '<path d="M4.5 -9 A5.5 5.5 0 1 0 4.5 -0.5 A4.2 4.2 0 1 1 4.5 -9 Z" fill="' + KOSO_MOON_BLUE + '" opacity="0.9"/>';
  }
};

/* ---------- 12分割リング（天文盤） ---------- */

function kosoPolar(r, deg) {
  const a = deg * Math.PI / 180;
  return (r * Math.cos(a)).toFixed(2) + " " + (r * Math.sin(a)).toFixed(2);
}

/* mainIdx / uraIdx に -1 を渡すと強調なし */
function kosoRingSvg(mainIdx, uraIdx, ro, ri, fontSize) {
  let s = '<circle cx="0" cy="0" r="' + ro + '" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.8"/>';
  s += '<circle cx="0" cy="0" r="' + ri + '" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="0.7" opacity="0.5"/>';

  for (let i = 0; i < 12; i++) {
    const b = i * 30 - 105; // 各セグメント境界
    s += '<path d="M' + kosoPolar(ri, b) + " L" + kosoPolar(ro, b) +
         '" stroke="' + KOSO_GOLD + '" stroke-width="0.7" opacity="0.5"/>';
  }

  const wedge = function (idx, color, op) {
    const a0 = idx * 30 - 105, a1 = idx * 30 - 75;
    return '<path d="M' + kosoPolar(ri, a0) + " L" + kosoPolar(ro, a0) +
      " A" + ro + " " + ro + " 0 0 1 " + kosoPolar(ro, a1) +
      " L" + kosoPolar(ri, a1) +
      " A" + ri + " " + ri + " 0 0 0 " + kosoPolar(ri, a0) +
      ' Z" fill="' + color + '" opacity="' + op + '"/>';
  };
  if (mainIdx >= 0) s += wedge(mainIdx, KOSO_GOLD, 0.22);
  if (uraIdx >= 0 && uraIdx !== mainIdx) s += wedge(uraIdx, KOSO_MOON_BLUE, 0.2);

  const rm = (ro + ri) / 2;
  for (let i = 0; i < 12; i++) {
    const c = i * 30 - 90;
    const a = c * Math.PI / 180;
    const x = rm * Math.cos(a), y = rm * Math.sin(a);
    let fill = KOSO_GOLD, op = 0.45;
    if (i === mainIdx) { op = 1; }
    else if (i === uraIdx) { fill = KOSO_MOON_BLUE; op = 1; }
    s += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
      '" font-size="' + fontSize + '" fill="' + fill + '" opacity="' + op +
      '" text-anchor="middle" dominant-baseline="central" font-family="\'Yu Mincho\',\'Hiragino Mincho ProN\',serif">' +
      KOSO_LAYERS[i].segChar + "</text>";
  }
  return s;
}

/* ---------- 結果カード（縦 360x500） ---------- */

function kosoCardSvg(mainIdx, uraIdx) {
  const main = KOSO_LAYERS[mainIdx];
  const ura = KOSO_LAYERS[uraIdx];
  const serif = "'Yu Mincho','Hiragino Mincho ProN',serif";
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 500" role="img" aria-label="' +
          main.name + 'の紋章カード">';
  s += '<rect width="360" height="500" fill="' + KOSO_NAVY + '"/>';
  s += '<rect x="8" y="8" width="344" height="484" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.7"/>';
  s += '<rect x="13" y="13" width="334" height="474" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="0.5" opacity="0.4"/>';
  s += '<text x="180" y="42" font-size="12" letter-spacing="8" fill="' + KOSO_MOON_BLUE + '" text-anchor="middle" font-family="' + serif + '">古層診断</text>';
  s += '<g transform="translate(180,182)">' + kosoRingSvg(mainIdx, uraIdx, 115, 95, 10) +
       '<g transform="scale(1.6)">' + KOSO_EMBLEMS[main.id]() + "</g></g>";
  s += '<text x="180" y="352" font-size="30" letter-spacing="4" fill="' + KOSO_GOLD + '" text-anchor="middle" font-family="' + serif + '" font-weight="600">' + main.name + "</text>";
  s += '<text x="180" y="377" font-size="12" letter-spacing="2" fill="' + KOSO_MOON_BLUE + '" text-anchor="middle" font-family="' + serif + '">属性──' + main.element + "</text>";
  s += '<path d="M70 398 H290" stroke="' + KOSO_GOLD + '" stroke-width="0.5" opacity="0.5"/>';
  s += '<path d="M180 394 L184 398 L180 402 L176 398 Z" fill="' + KOSO_GOLD + '" opacity="0.8"/>';
  s += '<text x="180" y="421" font-size="10" letter-spacing="5" fill="' + KOSO_MOON_BLUE + '" text-anchor="middle" font-family="' + serif + '">裏古層</text>';
  s += '<text x="180" y="443" font-size="17" letter-spacing="2" fill="#AFC6DC" text-anchor="middle" font-family="' + serif + '">' + ura.name + "</text>";
  s += '<text x="180" y="468" font-size="9" letter-spacing="1" fill="' + KOSO_MOON_BLUE + '" opacity="0.75" text-anchor="middle" font-family="' + serif + '">十二古層 × 十二裏古層──百四十四通りのひとつ</text>';
  s += '<text x="180" y="485" font-size="10" letter-spacing="2" fill="' + KOSO_GOLD + '" opacity="0.85" text-anchor="middle" font-family="' + serif + '">#古層の暦</text>';
  s += "</svg>";
  return s;
}

/* ---------- OGP画像（1200x675） idx=-1 でサイト汎用版 ---------- */

function kosoOgSvg(idx) {
  const serif = "'Yu Mincho','Hiragino Mincho ProN',serif";
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">';
  s += "<defs><linearGradient id='ogbg' x1='0' y1='0' x2='0' y2='1'>" +
       "<stop offset='0' stop-color='#0B0E1A'/><stop offset='0.6' stop-color='#10182E'/><stop offset='1' stop-color='#0B0E1A'/>" +
       "</linearGradient></defs>";
  s += '<rect width="1200" height="675" fill="url(#ogbg)"/>';
  const stars = [[150, 80, 1.5], [420, 50, 1], [700, 95, 1.2], [980, 60, 1.5], [1120, 180, 1], [80, 300, 1], [1060, 420, 1.2], [180, 560, 1], [640, 620, 1], [900, 580, 1.2]];
  stars.forEach(function (p, i) {
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' +
         (i % 2 ? KOSO_MOON_BLUE : KOSO_GOLD) + '" opacity="0.5"/>';
  });
  s += '<rect x="18" y="18" width="1164" height="639" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1.5" opacity="0.6"/>';

  if (idx >= 0) {
    const main = KOSO_LAYERS[idx];
    s += '<g transform="translate(300,330)">' + kosoRingSvg(idx, -1, 250, 210, 20) +
         '<g transform="scale(3.4)">' + KOSO_EMBLEMS[main.id]() + "</g></g>";
    const title = "【" + main.name + "】";
    const fs = title.length <= 7 ? 76 : 64;
    s += '<text x="830" y="230" font-size="32" letter-spacing="10" fill="' + KOSO_MOON_BLUE + '" text-anchor="middle" font-family="' + serif + '">私の古層は</text>';
    s += '<text x="830" y="330" font-size="' + fs + '" letter-spacing="2" fill="' + KOSO_GOLD + '" text-anchor="middle" font-family="' + serif + '" font-weight="600">' + title + "</text>";
    s += '<text x="830" y="385" font-size="22" letter-spacing="4" fill="' + KOSO_MOON_BLUE + '" text-anchor="middle" font-family="' + serif + '">属性──' + main.element + "</text>";
    s += '<path d="M620 420 H1040" stroke="' + KOSO_GOLD + '" stroke-width="0.8" opacity="0.5"/>';
    s += '<text x="830" y="468" font-size="28" letter-spacing="3" fill="' + KOSO_GOLD_PALE + '" text-anchor="middle" font-family="' + serif + '">古層診断｜あなたの名と、月のリズム</text>';
    s += '<text x="830" y="508" font-size="19" letter-spacing="2" fill="' + KOSO_MOON_BLUE + '" opacity="0.9" text-anchor="middle" font-family="' + serif + '">名の音韻と生まれた日のリズムで観測する・30秒・登録不要</text>';
    s += '<text x="830" y="586" font-size="26" letter-spacing="3" fill="' + KOSO_GOLD + '" text-anchor="middle" font-family="' + serif + '">#古層の暦</text>';
  } else {
    s += '<g transform="translate(280,330)">' + kosoRingSvg(-1, -1, 250, 210, 20) +
         '<circle cx="0" cy="0" r="120" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.5"/>' +
         '<path d="M 40 -76 A 88 88 0 1 0 40 76 A 70 70 0 1 1 40 -76 Z" fill="' + KOSO_GOLD + '" opacity="0.9"/></g>';
    s += '<text x="820" y="265" font-size="88" letter-spacing="14" fill="' + KOSO_GOLD + '" text-anchor="middle" font-family="' + serif + '" font-weight="600">古層診断</text>';
    s += '<text x="820" y="335" font-size="30" letter-spacing="6" fill="' + KOSO_MOON_BLUE + '" text-anchor="middle" font-family="' + serif + '">あなたの名と、月のリズム</text>';
    s += '<path d="M600 380 H1040" stroke="' + KOSO_GOLD + '" stroke-width="0.8" opacity="0.5"/>';
    s += '<text x="820" y="430" font-size="22" letter-spacing="2" fill="' + KOSO_GOLD_PALE + '" text-anchor="middle" font-family="' + serif + '">30秒・登録不要・入力は端末内で処理</text>';
    s += '<text x="820" y="472" font-size="20" letter-spacing="2" fill="' + KOSO_MOON_BLUE + '" opacity="0.85" text-anchor="middle" font-family="' + serif + '">十二の古層 × 十二の裏古層──百四十四通り</text>';
    s += '<text x="820" y="580" font-size="26" letter-spacing="3" fill="' + KOSO_GOLD + '" text-anchor="middle" font-family="' + serif + '">#古層の暦</text>';
  }
  s += '<text x="600" y="650" font-size="14" letter-spacing="2" fill="#6b7488" text-anchor="middle" font-family="' + serif + '">神話と象徴をモチーフとした創作研究プロジェクト（エンタメ）</text>';
  s += "</svg>";
  return s;
}

/* ---------- 小物 ---------- */

/* ヘッダーのサイトマーク（12分割盤＋三日月） */
function kosoMarkSvg() {
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const b = i * 30;
    ticks += '<path d="M' + kosoPolar(17, b) + " L" + kosoPolar(21, b) +
             '" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.7"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 -24 48 48">' +
    '<circle cx="0" cy="0" r="21" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1.2"/>' + ticks +
    '<path d="M 5 -10 A 11.5 11.5 0 1 0 5 10 A 9 9 0 1 1 5 -10 Z" fill="' + KOSO_GOLD + '"/>' +
    "</svg>";
}

/* 月相アイコン（result用） */
function kosoMoonSvg(age) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 80" role="img" aria-label="月相">' +
    '<circle cx="0" cy="0" r="30" fill="#10182E" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.95"/>' +
    '<path d="' + kosoMoonPath(age, 30) + '" fill="' + KOSO_GOLD_PALE + '" opacity="0.92"/>' +
    '<circle cx="0" cy="0" r="30" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.6"/>' +
    "</svg>";
}

/* 小さな紋章単体（裏古層・縁の古層表示用） */
function kosoEmblemSvg(idx) {
  const l = KOSO_LAYERS[idx];
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" role="img" aria-label="' + l.name + 'の紋章">' +
    '<circle cx="0" cy="0" r="46" fill="none" stroke="' + KOSO_GOLD + '" stroke-width="1" opacity="0.45"/>' +
    KOSO_EMBLEMS[l.id]() + "</svg>";
}
