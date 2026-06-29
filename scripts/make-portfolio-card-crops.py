"""Crop finalized portfolio JPEGs to photo-only thumbnails (no baked title strip)."""
from __future__ import annotations

import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "portfolio"
OUT = ROOT / "assets" / "portfolio" / "cards"
STRIP_H = 200
OUT_H = 900
PHOTO_H = OUT_H - STRIP_H

OUT.mkdir(parents=True, exist_ok=True)

for src in sorted(SRC.glob("*.jpg")):
    if src.parent.name in {"production", "raw", "cards"}:
        continue
    im = Image.open(src).convert("RGB")
    w, h = im.size
    crop_h = int(h * PHOTO_H / OUT_H) if h == OUT_H else max(1, h - int(STRIP_H * h / OUT_H))
    cropped = im.crop((0, 0, w, crop_h))
    dest = OUT / src.name
    cropped.save(dest, "JPEG", quality=88, optimize=True)
    print(dest.name, cropped.size)

print("Done.", len(list(OUT.glob("*.jpg"))), "cards")