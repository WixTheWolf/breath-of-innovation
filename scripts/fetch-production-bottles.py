"""Download TheraBreath product bottle images for in-production portfolio SKUs."""
from __future__ import annotations

import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "portfolio" / "production"
OUT.mkdir(parents=True, exist_ok=True)

BOTTLES = {
    "clean-mint": "https://www.therabreath.com/cdn/shop/files/Medium_JPG-THB-190_Ecomm_Healthy_Gums_Optimized_Heroes_16OZ_Hero-Text_Final.jpg?v=1768250991",
    "invigorating-icy-mint": "https://www.therabreath.com/cdn/shop/files/f9wkgjmhnor0ikf2x7mp_1.jpg?v=1729188132",
    "mild-mint": "https://www.therabreath.com/cdn/shop/files/697029100165_Mobile_Hero_Image_-_Text_20.jpg?v=1729000656",
    "rainforest-mint": "https://www.therabreath.com/cdn/shop/files/of1tj4yddapfte9ejtq2.jpg?v=1729188138",
    "dazzling-mint": "https://www.therabreath.com/cdn/shop/files/30697029200200_Mobile_Hero_Image_-_Text_17.jpg?v=1729002664",
    "tingling-mint": "https://www.therabreath.com/cdn/shop/files/697029383414_Mobile_Hero_Image_-_Text_19.jpg?v=1728999961",
    "sparkle-mint": "https://www.therabreath.com/cdn/shop/files/00697029388167_Mobile_Hero_Image_-_Text_18.jpg?v=1728588613",
    "total-care": "https://www.therabreath.com/cdn/shop/files/THB-137_CompleteRinse_Hero-Text.jpg?v=1758891434",
    "overnight-rinse": "https://www.therabreath.com/cdn/shop/files/Therabreath_ATF_Overnight_20-February-2024.png?v=1729186538",
    "grapes-galore": "https://i5.walmartimages.com/seo/TheraBreath-Kids-Mouthwash-with-Fluoride-Organic-Grapes-Galore-Anticavity-10-fl-oz_e2ea4715-dc14-4437-83a7-a9d77ed8498e.40815db360ac0d21ac398b6a013b6b9e.jpeg",
    "wacky-watermelon": "https://www.therabreath.com/cdn/shop/files/Medium_PNG-TheraBreath_Kids_Watermelon_10oz_Label.png?v=1761598889",
    "strawberry-splash": "https://www.therabreath.com/cdn/shop/files/Medium_PNG-TheraBreathKidsStrawberry10ozLabel_1.png?v=1761598635",
    "bubble-gum": "https://www.therabreath.com/cdn/shop/files/TBLB-97423-01_front.jpg?v=1736773894",
}

UA = {"User-Agent": "Mozilla/5.0 (compatible; TFF-Portfolio/1.0)"}

for slug, url in BOTTLES.items():
    ext = ".png" if ".png" in url.split("?")[0] else ".jpg"
    dest = OUT / f"{slug}{ext}"
    print(f"Fetching {slug} …")
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())
    print(f"  -> {dest} ({dest.stat().st_size // 1024} KB)")

print("Done.")