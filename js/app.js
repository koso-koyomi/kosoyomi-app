"use strict";
/* ============================================================
   画面制御・結果レンダリング
   入力は端末内で処理され、氏名・生年月日は送信も保存もされない。
   （fetch / XHR / localStorage / Cookie いずれも不使用）
   ============================================================ */

(function () {
  const $ = function (sel) { return document.querySelector(sel); };

  /* ---------- 初期化 ---------- */

  $("#siteMark").innerHTML = kosoMarkSvg();
  if (KOSO_CONFIG.xUrl) $("#footerX").href = KOSO_CONFIG.xUrl;

  const selY = $("#birthY"), selM = $("#birthM"), selD = $("#birthD");
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 1930; y--) {
    selY.insertAdjacentHTML("beforeend", '<option value="' + y + '">' + y + "</option>");
  }
  for (let m = 1; m <= 12; m++) {
    selM.insertAdjacentHTML("beforeend", '<option value="' + m + '">' + m + "</option>");
  }
  for (let d = 1; d <= 31; d++) {
    selD.insertAdjacentHTML("beforeend", '<option value="' + d + '">' + d + "</option>");
  }
  selY.value = "1985"; selM.value = "1"; selD.value = "1";

  /* ---------- 診断実行 ---------- */

  $("#startBtn").addEventListener("click", function () {
    const errEl = $("#formError");
    errEl.hidden = true;

    const kana = kosoNormalizeName($("#kanaName").value);
    const y = parseInt(selY.value, 10);
    const m = parseInt(selM.value, 10);
    const d = parseInt(selD.value, 10);

    if (!kana) {
      errEl.textContent = "お名前をひらがなでご入力ください。";
      errEl.hidden = false; return;
    }
    if (!kosoIsKana(kana)) {
      errEl.textContent = "お名前は「ひらがな」または「カタカナ」でご入力ください（漢字・英字は音韻を読み取れません）。";
      errEl.hidden = false; return;
    }
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      errEl.textContent = "実在する日付をご入力ください。";
      errEl.hidden = false; return;
    }

    const result = kosoDiagnose(kana, y, m, d);

    const resEl = $("#result");
    resEl.hidden = true;
    resEl.innerHTML = "";
    $("#analyzing").hidden = false;
    $("#analyzing").scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(function () {
      $("#analyzing").hidden = true;
      renderResult(result.main, result.ura);
      resEl.hidden = false;
      resEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1400);
  });

  /* ---------- 結果レンダリング ---------- */

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderResult(mainIdx, uraIdx) {
    const main = KOSO_LAYERS[mainIdx];
    const ura = KOSO_LAYERS[uraIdx];
    const moon = kosoMoon(new Date());
    const moonWordSet = KOSO_MOON_WORDS[moon.group];
    const moonWord = moonWordSet[KOSO_ELEMENT_GROUP[mainIdx]];

    let html = "";

    /* 1. 紋章カード */
    html += '<div class="result-card-wrap">' + kosoCardSvg(mainIdx, uraIdx) + "</div>";
    if (mainIdx === uraIdx) {
      html += '<p class="section-sub">' + esc(KOSO_SAME_NOTE) + "</p>";
    }

    /* 2. 観測記録（図星3行） */
    html += '<section class="section"><h2 class="section-title">観測記録</h2>' +
      '<p class="section-sub">——心当たりのある順に、三行</p>' +
      '<div class="section-body"><ul class="hit-lines">' +
      '<li data-no="一">' + esc(main.barnum[0]) + "</li>" +
      '<li data-no="二">' + esc(main.barnum[1]) + "</li>" +
      '<li data-no="三">' + esc(ura.uraLine) + "</li>" +
      "</ul>" +
      '<p class="hit-note">※三行目だけ、あなたの裏古層〈' + esc(ura.name) + "〉の声から採った。</p>" +
      "</div></section>";

    /* 3. 裏古層 */
    html += '<section class="section"><h2 class="section-title">裏古層</h2>' +
      '<p class="section-sub">——人に見せない場所で働いている層</p>' +
      '<div class="section-body"><div class="ura-box">' +
      '<span class="ura-emblem">' + kosoEmblemSvg(uraIdx) + "</span>" +
      '<p class="ura-name">' + esc(ura.name) + "</p>" +
      '<p class="ura-summary">' + esc(ura.uraSummary) + "</p>" +
      '<p class="ura-notice">裏古層の解説は、ここには書かない。<br>' +
      "<strong>毎週水曜の夜、Xで一層ずつ公開している。</strong>あなたの層の番を待つこと。</p>" +
      "</div></div></section>";

    /* 4. 家の中の聖域 */
    html += '<section class="section"><h2 class="section-title">《家の中の聖域》</h2>' +
      '<div class="section-body">' +
      '<p class="sanctuary-place">' + esc(main.sanctuary.place) + "</p>" +
      "<p>" + esc(main.sanctuary.text) + "</p>" +
      "</div></section>";

    /* 4.5. 研究室の備品棚 */
    html += '<section class="section"><h2 class="section-title">研究室の備品棚</h2>' +
      '<p class="section-sub">——観測のそばに置くもの　<span class="pr-badge">PR</span></p>' +
      '<div class="section-body"><div class="sonae-grid">';
    KOSO_AFFIL.forEach(function (item) {
      html += '<div class="sonae-item">' + item.html +
        '<p class="sonae-label">' + esc(item.label) + '</p></div>';
    });
    html += '</div></div></section>';

    /* 5. 今宵の月と今週のひとこと */
    html += '<section class="section"><h2 class="section-title">今宵の月</h2>' +
      '<div class="section-body">' +
      '<div class="moon-row">' + kosoMoonSvg(moon.age) +
      '<p class="moon-meta"><span class="moon-name">' + esc(moon.name) + "</span>" +
      "月齢 " + moon.age.toFixed(1) + "・" + esc(moonWordSet.label) + "</p></div>" +
      '<p class="moon-word">' + esc(moonWord) + "</p>";
    if (moon.isNew) {
      html += '<div class="moon-special"><p class="moon-special-title">' +
        esc(KOSO_MOON_SPECIAL.newMoon.title) + "</p><p>" +
        esc(KOSO_MOON_SPECIAL.newMoon.text) + "</p></div>";
    } else if (moon.isFull) {
      html += '<div class="moon-special"><p class="moon-special-title">' +
        esc(KOSO_MOON_SPECIAL.fullMoon.title) + "</p><p>" +
        esc(KOSO_MOON_SPECIAL.fullMoon.text) + "</p></div>";
    }
    html += "</div></section>";

    /* 6. 古層録「未来の強奪」三段 */
    html += '<section class="section"><h2 class="section-title">古層録——未来の強奪</h2>' +
      '<p class="section-sub">強奪、と研究室は呼んでいる。奪ったのは誰でもない。日々である。</p>' +
      '<div class="section-body sandan">' +
      '<div class="dan"><p class="dan-label">第一段〈いま、眠っているもの〉</p>' +
      '<p class="dan-text">' + esc(main.dormant) + "</p></div>" +
      '<div class="dan"><p class="dan-label">第二段〈このままの一年〉</p>' +
      '<p class="dan-text">' + esc(main.dan2) + "</p></div>" +
      '<div class="dan"><p class="dan-label">第三段〈取り戻す最初の一手〉</p>' +
      '<ul class="dan-advice">' +
      '<li data-no="①">' + esc(main.advice[0]) + "</li>" +
      '<li data-no="②">' + esc(main.advice[1]) + "</li>" +
      '<li data-no="③">' + esc(main.advice[2]) + "</li>" +
      "</ul>" +
      '<p class="dan-coda">——ひとつでいい。三つやらないこと。</p></div>' +
      '<div class="cta-box"><p class="cta-lead">あなたの古層が強まる日は、毎朝7時の〈今日の古層暦〉で呼ばれる。<br>' +
      "「今日、私の日だ」——その朝を、見逃さないために。</p>" +
      '<a class="btn btn-ghost" href="' + KOSO_CONFIG.xUrl + '" target="_blank" rel="noopener">Xで〈古層の暦〉をフォローする</a>' +
      "</div></div></section>";

    /* 7. 縁の古層（相性） */
    html += '<section class="section"><h2 class="section-title">縁の古層</h2>' +
      '<p class="section-sub">——あなたの巡りを補い合う二層</p>' +
      '<div class="section-body">';
    main.affinity.forEach(function (af) {
      const rel = KOSO_LAYERS[af.idx];
      html += '<div class="affinity-card">' +
        '<span class="affinity-emblem">' + kosoEmblemSvg(af.idx) + "</span>" +
        '<div><p class="affinity-name">' + esc(rel.name) + "</p>" +
        '<p class="affinity-text">' + esc(af.text) + "</p></div></div>";
    });
    html += '<p class="affinity-cta">夫の、子の、友人の古層も観測できる。名前と生年月日だけ——<br>入力はすべて端末の中で完結し、送信も保存もされない。</p>' +
      '<button type="button" class="btn btn-ghost" id="againBtn">もうひとり観測する</button>' +
      "</div></section>";

    /* 8. シェア */
    html += '<div class="share-box">' +
      '<a class="btn btn-primary" id="shareBtn" href="#" target="_blank" rel="noopener">結果をXでシェアする</a>' +
      '<p class="share-tag">#' + esc(KOSO_CONFIG.hashtag) + "</p></div>";

    html += '<p class="result-disclaimer">本診断は神話と象徴をモチーフとした創作研究プロジェクト（エンタメ）です。<br>効果・効能を保証するものではありません。入力は端末内で処理され、送信も保存もされません。</p>';

    const resEl = $("#result");
    resEl.innerHTML = html;

    /* シェアリンク（X Web Intent） */
    const shareUrl = KOSO_CONFIG.siteUrl
      ? KOSO_CONFIG.siteUrl + "share/" + main.id + ".html"
      : location.origin === "null" || location.protocol === "file:"
        ? "" : location.origin + location.pathname;
    const intent = "https://twitter.com/intent/tweet" +
      "?text=" + encodeURIComponent("私の古層は【" + main.name + "】だった") +
      "&hashtags=" + encodeURIComponent(KOSO_CONFIG.hashtag) +
      (shareUrl ? "&url=" + encodeURIComponent(shareUrl) : "");
    $("#shareBtn").href = intent;

    $("#againBtn").addEventListener("click", function () {
      $("#kanaName").value = "";
      resEl.hidden = true;
      resEl.innerHTML = "";
      $("#formCard").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#kanaName").focus();
    });
  }
})();
