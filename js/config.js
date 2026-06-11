"use strict";
/* 公開時の設定。GitHub Pages＋独自ドメインが決まったら siteUrl を実URLに変更し、
   tools/gen_share_pages.py --site-url <URL> を実行して share/ と og メタを更新すること。 */
const KOSO_CONFIG = {
  // 例: "https://koso-koyomi.example.com/"（末尾スラッシュ必須）。未設定（""）なら現在のURLでシェアする。
  siteUrl: "",
  // Xアカウント（設計書のハンドル第一候補。実際に取得したハンドルに合わせて変更）
  xUrl: "https://x.com/koso_koyomi",
  hashtag: "古層の暦"
};
