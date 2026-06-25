"""Patch tasting copy from 10 prototypes to 5 mint platforms."""
from __future__ import annotations

import pathlib
import re

ROOTS = [
    pathlib.Path(r"C:\Users\Matt\breath-of-innovation"),
    pathlib.Path(r"C:\Users\Matt\therabreath-visit-site"),
]

GLOBS = ["*.html", "*.js", "*.json"]

REPLACEMENTS = [
    ("M1–M10", "M1–M5"),
    ("M1-M10", "M1-M5"),
    ("ten coded cups", "five coded cups"),
    ("Ten coded cups", "Five coded cups"),
    ("ten coded prototypes", "five coded prototypes"),
    ("Ten coded prototypes", "Five coded prototypes"),
    ("Ten coded workshop prototypes", "Five coded workshop prototypes"),
    ("ten workshop prototypes", "five workshop prototypes"),
    ("Ten workshop prototypes", "Five workshop prototypes"),
    ("one of ten neutral", "one of five neutral"),
    ("Ten workshop prototypes —", "Five workshop prototypes —"),
    ("Find the code on your cup (M1–M5)", "Find the code on your cup (M1–M5)"),
    ("Ten prototypes ·", "Five prototypes ·"),
    ("ten prototypes ·", "five prototypes ·"),
    ("Ten prototypes", "Five prototypes"),
    ("ten prototypes", "five prototypes"),
    ("Ten directions", "Five directions"),
    ("ten directions", "five directions"),
    ("Taste the ten prototypes", "Taste the five prototypes"),
    ("Ten prototypes —", "Five prototypes —"),
    ("not ten product launches", "not five product launches"),
    ("not ten launch candidates", "not five launch candidates"),
    ("all ten workshop prototypes", "all five workshop prototypes"),
    ("Rate all ten prototypes", "Rate all five prototypes"),
    ("Preview the ten directions", "Preview the five directions"),
    ("What are the ten workshop prototypes", "What are the five workshop prototypes"),
    ("live tasting of ten prototypes", "live tasting of five prototypes"),
    ("Three stations · ten concepts", "Three stations · five concepts"),
    ("Ten new concepts", "Five new concepts"),
    ("Ten workshop samples", "Five workshop samples"),
    ("Ten workshop directions", "Five workshop directions"),
    ("Workshop samples M1–M5", "Workshop samples M1–M5"),
    ("Sample kit labels · M1–M5", "Sample kit labels · M1–M5"),
    ("Ten directional workshop prototypes", "Five directional workshop prototypes"),
    ("Ten directions worth discussing", "Five mint platforms worth discussing"),
    ("<title>Ten Workshop Directions", "<title>Five Mint Platforms"),
]

SKIP_PARTS = {"documents", "node_modules", ".git", "assets", "booklet", "unpacked"}

FLAVOR_ROWS_OLD = """            <tr><td>Spearmint Garden</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Green Tea Fresh</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Crisp Cucumber Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Warm Ginger Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Vanilla Mint Silk</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Overnight Calm Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Crystal Whitening Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Icy Peak Refresh</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Winter Frost</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Healthy Gums Herbal</td><td></td><td></td><td></td><td></td></tr>"""

FLAVOR_ROWS_NEW = """            <tr><td>Fresh Herbal Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Grove Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Botanical Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Immunity Mint</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>Garden Mint</td><td></td><td></td><td></td><td></td></tr>"""

CHECKLIST_OLD = """          <tr><td><span class="box"></span></td><td><strong>01</strong> Spearmint Garden</td></tr>
          <tr><td><span class="box"></span></td><td><strong>02</strong> Green Tea Fresh</td></tr>
          <tr><td><span class="box"></span></td><td><strong>03</strong> Crisp Cucumber Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>04</strong> Warm Ginger Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>05</strong> Vanilla Mint Silk</td></tr>
          <tr><td><span class="box"></span></td><td><strong>06</strong> Overnight Calm Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>07</strong> Crystal Whitening Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>08</strong> Icy Peak Refresh</td></tr>
          <tr><td><span class="box"></span></td><td><strong>09</strong> Winter Frost</td></tr>
          <tr><td><span class="box"></span></td><td><strong>10</strong> Healthy Gums Herbal</td></tr>"""

CHECKLIST_NEW = """          <tr><td><span class="box"></span></td><td><strong>01</strong> Fresh Herbal Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>02</strong> Grove Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>03</strong> Botanical Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>04</strong> Immunity Mint</td></tr>
          <tr><td><span class="box"></span></td><td><strong>05</strong> Garden Mint</td></tr>"""


def should_skip(path: pathlib.Path) -> bool:
    return any(part in SKIP_PARTS for part in path.parts)


def patch_file(path: pathlib.Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if FLAVOR_ROWS_OLD in text:
        text = text.replace(FLAVOR_ROWS_OLD, FLAVOR_ROWS_NEW)
    if CHECKLIST_OLD in text:
        text = text.replace(CHECKLIST_OLD, CHECKLIST_NEW)
    # worksheet / slides table rows (slightly different indent)
    text = re.sub(
        r"<tr><td>0[1-9]</td><td>Spearmint Garden</td>.*?</tr>\s*"
        r"<tr><td>10</td><td>Healthy Gums Herbal</td>.*?</tr>",
        "<tr><td>01</td><td>Fresh Herbal Mint</td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td></tr>\n"
        "              <tr><td>02</td><td>Grove Mint</td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td></tr>\n"
        "              <tr><td>03</td><td>Botanical Mint</td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td></tr>\n"
        "              <tr><td>04</td><td>Immunity Mint</td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td></tr>\n"
        "              <tr><td>05</td><td>Garden Mint</td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td><td class=\"blank\"></td></tr>",
        text,
        flags=re.DOTALL,
        count=1,
    )
    if text != orig:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


changed = []
for root in ROOTS:
    for pattern in GLOBS:
        for path in root.rglob(pattern):
            if should_skip(path):
                continue
            if patch_file(path):
                changed.append(path)

print(f"Patched {len(changed)} files")
for p in changed:
    print(" ", p)