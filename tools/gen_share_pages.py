# -*- coding: utf-8 -*-
"""シェア用ページ(share/<id>.html)12枚を生成する。

各ページは古層別のOGPメタ(og:image=og/<id>.png)を持ち、開くと即トップへリダイレクトする。
XのクローラーはJSを実行しないため、OGPメタはここに静的に書く必要がある。
og:image は絶対URL必須なので、公開URL確定後に --site-url で再生成すること。

使い方:
  python tools/gen_share_pages.py                                  # プレースホルダURLで生成
  python tools/gen_share_pages.py --site-url https://example.com/  # 本番URLで再生成
"""
import argparse
import io
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LAYERS = [
    ("akebono", "曙の古層"),
    ("nichirin", "日輪の古層"),
    ("kamado", "竈火の古層"),
    ("kaji", "鍛冶の古層"),
    ("ho", "穂の古層"),
    ("ishizue", "礎の古層"),
    ("shiosai", "潮騒の古層"),
    ("suimyaku", "水脈の古層"),
    ("kazamachi", "風待ちの古層"),
    ("kiri", "霧の古層"),
    ("yoiyami", "宵闇の古層"),
    ("tsukimachi", "月待の古層"),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>私の古層は【{name}】だった｜古層診断</title>
<meta property="og:title" content="私の古層は【{name}】だった">
<meta property="og:description" content="名の音韻と生まれた日のリズムで観測する無料診断「古層診断｜あなたの名と、月のリズム」。30秒・登録不要・入力は端末内処理。 #古層の暦">
<meta property="og:image" content="{site}og/{lid}.png">
<meta property="og:url" content="{site}share/{lid}.html">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=../index.html">
<style>body{{background:#0B0E1A;color:#7FA8C9;font-family:serif;text-align:center;padding-top:80px}}a{{color:#C9A227}}</style>
</head>
<body>
<p>古層診断へ移動しています——</p>
<p><a href="../index.html">自動で移動しない場合はこちら</a></p>
<script>location.replace("../index.html");</script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site-url", default="https://koso-koyomi.example.com/",
                    help="公開URL（末尾スラッシュ付き）")
    args = ap.parse_args()
    site = args.site_url if args.site_url.endswith("/") else args.site_url + "/"

    out_dir = os.path.join(BASE, "share")
    os.makedirs(out_dir, exist_ok=True)
    for lid, name in LAYERS:
        path = os.path.join(out_dir, lid + ".html")
        with io.open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(TEMPLATE.format(name=name, lid=lid, site=site))
        print("OK", path)

    # index.html の og:image も同じドメインに合わせて書き換える
    index_path = os.path.join(BASE, "index.html")
    with io.open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
    import re
    new_html = re.sub(
        r'(<meta property="og:image" content=")[^"]*(og/site\.png")',
        r"\g<1>" + site + r"\g<2>",
        html.replace('content="https://koso-koyomi.example.com/og/site.png"',
                     'content="' + site + 'og/site.png"'),
    )
    if new_html != html:
        with io.open(index_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(new_html)
        print("OK index.html og:image ->", site + "og/site.png")
    print("完了: share/ 12ページ（site-url=" + site + "）")


if __name__ == "__main__":
    main()
