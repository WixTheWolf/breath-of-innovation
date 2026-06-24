"""Generate portfolio raw JPEGs via Pollinations image API."""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.join(os.path.dirname(__file__), "..")
MANIFEST = os.path.join(os.path.dirname(__file__), "portfolio-prompts.json")
RAW = os.path.join(ROOT, "assets", "portfolio", "raw")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}


def generate(prompt, dest, width=1200, height=900):
    full = (
        f"{prompt} Professional food photography, 4:3 landscape composition, "
        "no text, no logos, no watermarks, photorealistic."
    )
    url = (
        "https://image.pollinations.ai/prompt/"
        + urllib.parse.quote(full)
        + f"?width={width}&height={height}&nologo=true&enhance=true"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = resp.read()
    if len(data) < 10000:
        raise RuntimeError(f"response too small ({len(data)} bytes)")
    with open(dest, "wb") as f:
        f.write(data)
    print("OK", os.path.basename(dest), len(data) // 1024, "KB")


def main():
    slugs = sys.argv[1:] if len(sys.argv) > 1 else None
    with open(MANIFEST, encoding="utf-8") as f:
        items = json.load(f)

    os.makedirs(RAW, exist_ok=True)
    for item in items:
        if slugs and item["slug"] not in slugs:
            continue
        dest = os.path.join(RAW, item["slug"] + ".jpg")
        print("GEN", item["slug"], "...")
        try:
            generate(item["prompt"], dest)
        except Exception as exc:
            print("FAIL", item["slug"], exc)
        time.sleep(2)


if __name__ == "__main__":
    main()