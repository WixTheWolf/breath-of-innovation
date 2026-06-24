"""Add flavor name title overlay and export web-ready portfolio JPEG."""
from PIL import Image, ImageDraw, ImageFont
import json
import os
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
MANIFEST = os.path.join(os.path.dirname(__file__), "portfolio-prompts.json")
RAW = os.path.join(ROOT, "assets", "portfolio", "raw")
OUT = os.path.join(ROOT, "assets", "portfolio")

COLORS = {
    "Heritage Top 8": "#e85d8a",
    "Mouthwash": "#008fd3",
    "Rinse-Wash": "#2a9d8f",
    "Pipeline": "#5fb832",
    "Gen Alpha": "#6c5ce7",
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


def finalize(src_path, name, collection, dest_path):
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    if w > 1200:
        nh = int(h * 1200 / w)
        img = img.resize((1200, nh), Image.LANCZOS)
        w, h = img.size

    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    band_h = int(h * 0.32)
    for y in range(band_h):
        alpha = int(220 * (y / band_h) ** 1.4)
        draw.line([(0, h - band_h + y), (w, h - band_h + y)], fill=(10, 22, 40, alpha))

    title_font = load_font(max(28, int(w * 0.052)))
    sub_font = load_font(max(14, int(w * 0.022)))
    pad = int(w * 0.06)
    max_text_w = w - pad * 2

    lines = wrap_text(draw, name.upper(), title_font, max_text_w)
    line_h = int(title_font.size * 1.15)
    sub_h = int(sub_font.size * 1.5)
    block_h = len(lines) * line_h + sub_h + int(w * 0.03)
    y_start = h - pad - block_h

    accent = COLORS.get(collection, "#008fd3")
    draw.text((pad, y_start - sub_h - 8), collection.upper(), font=sub_font, fill=accent)

    for i, line in enumerate(lines):
        draw.text((pad, y_start + i * line_h), line, font=title_font, fill=(255, 255, 255, 255))

    # subtle top brand line
    draw.rectangle([(pad, h - pad - block_h - sub_h - 18), (pad + 48, h - pad - block_h - sub_h - 14)], fill=accent)

    composed = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    composed.save(dest_path, "JPEG", quality=86, optimize=True)
    print("OK", os.path.basename(dest_path), round(os.path.getsize(dest_path) / 1024), "KB")


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