"use strict";
/* ============================================================
   判定ロジック（純粋関数のみ・DOM非依存）
   同じ入力なら必ず同じ結果（端末内ハッシュ／送信なし）
   ============================================================ */

const KOSO_SYNODIC = 29.530588853; // 朔望月（日）

/* かな氏名の正規化：
   NFKC（半角カナ→全角化）→ 空白・中点類の除去 → カタカナ→ひらがな */
function kosoNormalizeName(raw) {
  if (!raw) return "";
  let s = raw.normalize("NFKC");
  s = s.replace(/[\s　・･、。.,]/g, "");
  s = s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  return s;
}

/* 正規化後にひらがな（長音・繰り返し記号含む）のみで構成されているか */
function kosoIsKana(s) {
  return /^[ぁ-ゖーゝゞ]+$/.test(s);
}

/* FNV-1a 32bit ＋最終攪拌。seed違いで独立したハッシュ列を得る */
function kosoHash(str, seed) {
  let h = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h ^= h >>> 15;
  return h >>> 0;
}

/* 主古層・裏古層の判定（0..11）。12×12=144通り（主と裏が同じ層もありうる） */
function kosoDiagnose(kanaName, y, m, d) {
  const key =
    kanaName + "|" + y + "-" +
    String(m).padStart(2, "0") + "-" +
    String(d).padStart(2, "0");
  return {
    main: kosoHash(key, 0) % 12,
    ura: kosoHash(key, 0x9e3779b9) % 12
  };
}

/* 月齢と月相（基準新月: 2000-01-06 18:14 UTC） */
function kosoMoon(date) {
  const epoch = Date.UTC(2000, 0, 6, 18, 14, 0);
  const days = (date.getTime() - epoch) / 86400000;
  const age = ((days % KOSO_SYNODIC) + KOSO_SYNODIC) % KOSO_SYNODIC;

  let name;
  if (age < 1.0 || age >= 28.53) name = "新月";
  else if (age < 6.0)  name = "三日月のころ";
  else if (age < 8.6)  name = "上弦の月";
  else if (age < 13.8) name = "十三夜のころ";
  else if (age < 15.8) name = "満月";
  else if (age < 21.0) name = "居待月のころ";
  else if (age < 23.6) name = "下弦の月";
  else                 name = "有明の月";

  let group; // 週単位のひとこと用（約7.4日で切り替わる）
  if (age < 7.4)        group = "newWeek";
  else if (age < 14.77) group = "waxing";
  else if (age < 22.15) group = "fullWeek";
  else                  group = "waning";

  return {
    age: age,
    name: name,
    group: group,
    isNew: age < 1.0 || age >= 28.53,
    isFull: Math.abs(age - 14.765) < 1.0
  };
}

/* 月相SVG用パス：照らされた部分の形（半径r、中心0,0） */
function kosoMoonPath(age, r) {
  const t = age / KOSO_SYNODIC;          // 0=新月, 0.5=満月
  const phi = t * 2 * Math.PI;
  const rx = Math.abs(Math.cos(phi)) * r;
  const waxing = t < 0.5;
  const sweepOuter = waxing ? 1 : 0;     // 満ちる月は右側が光る
  const sweepInner = (Math.cos(phi) > 0)
    ? (waxing ? 0 : 1)
    : (waxing ? 1 : 0);
  return "M 0 " + (-r) +
    " A " + r + " " + r + " 0 0 " + sweepOuter + " 0 " + r +
    " A " + rx.toFixed(3) + " " + r + " 0 0 " + sweepInner + " 0 " + (-r) + " Z";
}
