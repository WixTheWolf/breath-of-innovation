from PIL import Image
import glob
import os

folder = os.path.join(os.path.dirname(__file__), "..", "assets", "portfolio")
total_before = total_after = 0

for path in glob.glob(os.path.join(folder, "*.png")):
    total_before += os.path.getsize(path)
    img = Image.open(path)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    w, h = img.size
    max_w = 900
    if w > max_w:
        img = img.resize((max_w, int(h * max_w / w)), Image.LANCZOS)
    out = path.replace(".png", ".jpg")
    img.save(out, "JPEG", quality=82, optimize=True)
    os.remove(path)
    total_after += os.path.getsize(out)

print("Before: %.1f MB" % (total_before / 1024 / 1024))
print("After: %.1f MB" % (total_after / 1024 / 1024))
print("Files: %d" % len(glob.glob(os.path.join(folder, "*.jpg"))))