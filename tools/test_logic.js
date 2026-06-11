// 判定ロジックの検証（node tools/test_logic.js で実行）
// 1) 同じ入力→必ず同じ結果（表記ゆれ正規化込み） 2) 分布の偏りなし 3) 月齢の妥当性
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const base = path.dirname(__dirname);
const ctx = {};
vm.createContext(ctx);
for (const f of ["js/data.js", "js/logic.js"]) {
  vm.runInContext(fs.readFileSync(path.join(base, f), "utf8"), ctx);
}

let fails = 0;
function check(label, cond) {
  console.log((cond ? "PASS" : "FAIL") + "  " + label);
  if (!cond) fails++;
}

// 1) 表記ゆれの正規化：ひらがな／カタカナ／半角カナ／空白入りが同一結果
const a = ctx.kosoDiagnose(ctx.kosoNormalizeName("やまだ はなこ"), 1985, 4, 12);
const b = ctx.kosoDiagnose(ctx.kosoNormalizeName("ヤマダハナコ"), 1985, 4, 12);
const c = ctx.kosoDiagnose(ctx.kosoNormalizeName("ﾔﾏﾀﾞ ﾊﾅｺ"), 1985, 4, 12);
const a2 = ctx.kosoDiagnose(ctx.kosoNormalizeName("やまだ　はなこ"), 1985, 4, 12);
console.log("result:", JSON.stringify(a), JSON.stringify(b), JSON.stringify(c), JSON.stringify(a2));
check("同一人物の表記ゆれが同じ結果になる", JSON.stringify(a) === JSON.stringify(b) &&
  JSON.stringify(b) === JSON.stringify(c) && JSON.stringify(c) === JSON.stringify(a2));

// 2) 再現性：同じ呼び出しを100回繰り返しても揺れない
let stable = true;
for (let i = 0; i < 100; i++) {
  const r = ctx.kosoDiagnose(ctx.kosoNormalizeName("すずき　みゆき"), 1979, 11, 3);
  if (r.main !== ctx.kosoDiagnose("すずきみゆき", 1979, 11, 3).main || r.ura === undefined) stable = false;
}
check("同じ入力100回で結果が揺れない", stable);

// 3) 入力が1字違えば（概ね）別の結果になりうる
const d1 = ctx.kosoDiagnose("やまだはなこ", 1985, 4, 12);
const d2 = ctx.kosoDiagnose("やまだはなえ", 1985, 4, 12);
const d3 = ctx.kosoDiagnose("やまだはなこ", 1985, 4, 13);
console.log("1字違い:", JSON.stringify(d1), JSON.stringify(d2), "生年月日違い:", JSON.stringify(d3));

// 4) 分布：合成入力24000件で主・裏とも約8.3%ずつ／144通り全てが出現
const kana = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれわ";
const mainCnt = new Array(12).fill(0);
const uraCnt = new Array(12).fill(0);
const combo = new Set();
const N = 24000;
let x = 123456789;
for (let i = 0; i < N; i++) {
  let s = "";
  for (let k = 0; k < 6; k++) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    s += kana[x % kana.length];
  }
  const y = 1950 + (x % 60), mo = 1 + (x % 12), da = 1 + (x % 28);
  const r = ctx.kosoDiagnose(s, y, mo, da);
  mainCnt[r.main]++; uraCnt[r.ura]++; combo.add(r.main + "-" + r.ura);
}
const pct = (v) => (v / N * 100).toFixed(2) + "%";
console.log("主古層分布:", mainCnt.map(pct).join(" "));
console.log("裏古層分布:", uraCnt.map(pct).join(" "));
console.log("出現組み合わせ:", combo.size + "/144");
check("主古層の偏りが±1.5%以内", mainCnt.every(v => Math.abs(v / N - 1 / 12) < 0.015));
check("裏古層の偏りが±1.5%以内", uraCnt.every(v => Math.abs(v / N - 1 / 12) < 0.015));
check("144通りすべて出現", combo.size === 144);

// 5) 月齢：既知の新月・満月で検算（2026-06-15 新月 / 2026-06-30 満月 ±1日）
const newMoonAge = ctx.kosoMoon(new Date(Date.UTC(2026, 5, 15, 12, 0))).age;
const fullMoonAge = ctx.kosoMoon(new Date(Date.UTC(2026, 5, 30, 12, 0))).age;
console.log("2026-06-15 月齢:", newMoonAge.toFixed(2), "/ 2026-06-30 月齢:", fullMoonAge.toFixed(2));
check("2026-06-15 が新月圏（月齢<1.5 or >28）", newMoonAge < 1.5 || newMoonAge > 28);
check("2026-06-30 が満月圏（月齢13.3〜16.3）", Math.abs(fullMoonAge - 14.765) < 1.5);
const today = ctx.kosoMoon(new Date());
console.log("今日の月:", today.age.toFixed(2), today.name, today.group);

// 6) かな判定
check("ひらがな＋全角空白を受理", ctx.kosoIsKana(ctx.kosoNormalizeName("やまだ　はなこ")));
check("漢字を拒否", !ctx.kosoIsKana(ctx.kosoNormalizeName("山田花子")));
check("英字を拒否", !ctx.kosoIsKana(ctx.kosoNormalizeName("yamada")));
check("長音符を受理", ctx.kosoIsKana(ctx.kosoNormalizeName("じょーじ")));

process.exitCode = fails ? 1 : 0;
console.log(fails ? "\n" + fails + " 件失敗" : "\n全テストPASS");
