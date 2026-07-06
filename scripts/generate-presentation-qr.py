"""Regenerate QR assets for every live guest and internal page."""
from pathlib import Path

import qrcode

BASE = "https://breath-of-innovation.vercel.app"
OUT = Path(__file__).resolve().parents[1] / "assets" / "qr"

TARGETS = {
    "site": f"{BASE}/",
    "home": f"{BASE}/",
    "find": f"{BASE}/find",
    "visit": f"{BASE}/visit",
    "present": f"{BASE}/present",
    "portfolio": f"{BASE}/portfolio",
    "taste": f"{BASE}/taste",
    "mystery": f"{BASE}/map",
    "map": f"{BASE}/map",
    "score": f"{BASE}/score",
    "gate": f"{BASE}/gate",
    "team": f"{BASE}/team",
    "packet": f"{BASE}/packet",
    "chlorite": f"{BASE}/chlorite",
    "mystery-live": f"{BASE}/mystery-live",
    "score-live": f"{BASE}/score-live",
    "qr": f"{BASE}/qr",
}


def write_png(path: Path, url: str, size: int) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    img = img.resize((size, size))
    img.save(path)
    print(f"wrote {path.name} -> {url}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, url in TARGETS.items():
        write_png(OUT / f"{name}.png", url, 512)
        write_png(OUT / f"{name}-sm.png", url, 256)


if __name__ == "__main__":
    main()
