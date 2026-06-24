"""Compose 4:3 landscape portfolio JPEGs with a dedicated bottom title strip."""
from PIL import Image, ImageDraw, ImageFont
import json
import os
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
MANIFEST = os.path.join(os.path.dirname(__file__), "portfolio-prompts.json")
RAW = os.path.join(ROOT, "assets", "portfolio", "raw")
OUT = os.path.join(ROOT, "assets", "portfolio")

OUT_W, OUT_H = 1200, 900
STRIP_H = 200

COLORS = {
    "Heritage Top 8": (232, 93, 138),
    "Mouthwash": (0, 143, 211),
    "Rinse-Wash": (42, 157, 143),
    "Pipeline": (95, 184, 50),
    "Gen Alpha": (108, 92, 231),
}

FONT_CANDIDATES = [
    os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "arialbd.ttf"),
    os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "segoeuib.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines, current = [], []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textlength(trial, font=font) <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines or [text]


def fit_photo_area(src):
    """Fill the photo region (above title strip) using a center-weighted crop."""
    area_w, area_h = OUT_W, OUT_H - STRIP_H
    sw, sh = src.size
    scale = max(area_w / sw, area_h / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    resized = src.resize((nw, nh), Image.LANCZOS)
    left = (nw - area_w) // 2
    # Bias crop upward so bottom captions in source art are trimmed away
    top = max(0, int((nh - area_h) * 0.35))
    top = min(top, nh - area_h)
    return resized.crop((left, top, left + area_w, top + area_h))


def draw_shadowed_text(draw, xy, text, font, fill, shadow=(0, 0, 0, 120)):
    x, y = xy
    for dx, dy in ((0, 2), (1, 1), (2, 0)):
        draw.text((x + dx, y + dy), text, font=font, fill=shadow)
    draw.text((x, y), text, font=font, fill=fill)


def finalize(src_path, name, collection, dest_path):
    src = Image.open(src_path).convert("RGB")
    photo = fit_photo_area(src)

    canvas = Image.new("RGB", (OUT_W, OUT_H), (10, 22, 40))
    canvas.paste(photo, (0, 0))

    overlay = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Solid title strip — never fades, always readable
    draw.rectangle([(0, OUT_H - STRIP_H), (OUT_W, OUT_H)], fill=(10, 22, 40, 245))
    draw.line([(0, OUT_H - STRIP_H), (OUT_W, OUT_H - STRIP_H)], fill=(255, 255, 255, 30), width=1)

    accent = COLORS.get(collection, (0, 143, 211))
    pad = 36
    sub_font = load_font(18)
    title_font = load_font(42 if len(name) < 22 else 34)

    draw.rectangle([(pad, OUT_H - STRIP_H + 22), (pad + 44, OUT_H - STRIP_H + 26)], fill=accent + (255,))
    draw.text((pad, OUT_H - STRIP_H + 34), collection.upper(), font=sub_font, fill=accent + (255,))

    max_text_w = OUT_W - pad * 2
    lines = wrap_text(draw, name, title_font, max_text_w)
    line_h = int(title_font.size * 1.12)
    y = OUT_H - STRIP_H + 68
    for line in lines:
        draw_shadowed_text(draw, (pad, y), line, title_font, (255, 255, 255, 255))
        y += line_h

    composed = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    composed.save(dest_path, "JPEG", quality=88, optimize=True)
    print("OK", os.path.basename(dest_path), composed.size, round(os.path.getsize(dest_path) / 1024), "KB")


def main():
    slugs = sys.argv[1:] if len(sys.argv) > 1 else None
    with open(MANIFEST, encoding="utf-8") as f:
        items = json.load(f)

    os.makedirs(OUT, exist_ok=True)
    for item in items:
        if slugs and item["slug"] not in slugs:
            continue
        raw = os.path.join(RAW, item["slug"] + ".jpg")
        if not os.path.exists(raw):
            print("MISSING", raw)
            continue
        dest = os.path.join(OUT, item["slug"] + ".jpg")
        finalize(raw, item["name"], item["collection"], dest)


if __name__ == "__main__":
    main()