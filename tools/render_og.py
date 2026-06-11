# -*- coding: utf-8 -*-
"""シェア用OGP画像(1200x675 PNG)をヘッドレスChromeで書き出す。

og_template.html を ?i=0..11 / ?i=site で開き、og/<id>.png / og/site.png に保存。
紋章SVGの実装(js/emblems.js)をそのまま描画するので、ページ表示と完全に一致する。

使い方:  python tools/render_og.py
"""
import os
import subprocess
import sys
import urllib.parse

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LAYER_IDS = [
    "akebono", "nichirin", "kamado", "kaji", "ho", "ishizue",
    "shiosai", "suimyaku", "kazamachi", "kiri", "yoiyami", "tsukimachi",
]

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]


def find_chrome():
    for p in CHROME_CANDIDATES:
        if os.path.isfile(p):
            return p
    sys.exit("Chrome/Edge が見つかりません。CHROME_CANDIDATES にパスを追加してください。")


def render(chrome, query, out_png):
    template = os.path.join(BASE, "og_template.html")
    url = "file:///" + urllib.parse.quote(template.replace("\\", "/")) + "?i=" + query
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,675",
        "--screenshot=" + out_png,
        "--virtual-time-budget=3000",
        url,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if not os.path.isfile(out_png):
        print(r.stdout)
        print(r.stderr)
        sys.exit("書き出し失敗: " + out_png)
    print("OK", out_png)


def main():
    chrome = find_chrome()
    og_dir = os.path.join(BASE, "og")
    os.makedirs(og_dir, exist_ok=True)
    for i, lid in enumerate(LAYER_IDS):
        render(chrome, str(i), os.path.join(og_dir, lid + ".png"))
    render(chrome, "site", os.path.join(og_dir, "site.png"))
    print("完了: og/ に13枚")


if __name__ == "__main__":
    main()
