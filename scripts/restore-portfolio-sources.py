"""Restore original C&D concept art into portfolio raw folder."""
from PIL import Image
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
RAW = os.path.join(ROOT, "assets", "portfolio", "raw")
MANIFEST = os.path.join(os.path.dirname(__file__), "portfolio-sources.json")

def to_jpg(src, dest):
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = bg
    else:
        img = img.convert("RGB")
    img.save(dest, "JPEG", quality=95)
    print("restored", os.path.basename(dest), "<-", src)


def main():
    os.makedirs(RAW, exist_ok=True)
    with open(MANIFEST, encoding="utf-8") as f:
        sources = json.load(f)
    for slug, path in sources.items():
        if not path or not isinstance(path, str) or not os.path.isfile(path):
            print("SKIP", slug)
            continue
        to_jpg(path, os.path.join(RAW, slug + ".jpg"))


if __name__ == "__main__":
    main()