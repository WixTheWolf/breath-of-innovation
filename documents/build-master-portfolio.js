const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer,
  AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType,
  ShadingType, Table, TableRow, TableCell, PageNumber, PageBreak,
  TabStopType, TabStopPosition
} = require("docx");

const OUT = path.join(__dirname, "TFF-TheraBreath-Flavor-Master-Portfolio.docx");
const SEASONAL = path.join(__dirname, "unpacked-seasonal", "word", "media");
const MW = path.join(__dirname, "unpacked-cd-mw", "word", "media");
const RW = path.join(__dirname, "unpacked-cd", "word", "media");
const PNG = "C:\\Users\\Matt\\OneDrive - Flavor Factory\\Pictures\\C&D Concept Images\\PNGs";
const TOP8 = "C:\\Users\\Matt\\OneDrive - Flavor Factory\\Pictures\\C&D Concept Images\\Top 8 picks\\Top 8 PNGs";
const MATTS = PNG + "\\Matts PNGs";
const PORT = path.join(__dirname, "..", "assets", "portfolio");

const TFF_BLUE = "008FD3";
const TFF_GREEN = "5FB832";
const TFF_INK = "0A1628";
const MUTED = "5C6678";
const LIGHT = "F0F9FD";
const SUMMER = "E85D8A";
const WINTER = "C45C26";
const GEN = "6C5CE7";

function readImg(file) {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file);
}

function imgPara(file, title) {
  const data = readImg(file);
  if (!data) return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "[Image: " + title + "]", italics: true, color: MUTED })] });
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 140, after: 140 },
    children: [new ImageRun({ type: "png", data, transformation: { width: 400, height: 285 },
      altText: { title, description: title, name: title } })]
  });
}

function tagPara(text, fill) {
  return new Paragraph({ spacing: { after: 70 },
    children: [new TextRun({ text: "  " + text + "  ", bold: true, size: 18, color: "FFFFFF", font: "Arial",
      shading: { fill, type: ShadingType.CLEAR } })] });
}

function flavorTitle(name) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 70 },
    children: [new TextRun({ text: name, bold: true, size: 26, font: "Arial", color: TFF_INK })] });
}

function body(text) {
  return new Paragraph({ spacing: { after: 100, line: 276 },
    children: [new TextRun({ text, size: 21, font: "Arial", color: "344054" })] });
}

function feel(f) {
  return new Paragraph({ spacing: { after: 80, line: 276 },
    children: [
      new TextRun({ text: "Sensory story · ", bold: true, size: 21, font: "Arial", color: TFF_BLUE }),
      new TextRun({ text: f, italics: true, size: 21, font: "Arial", color: "344054" })
    ] });
}

function pos(text) {
  return new Paragraph({ spacing: { after: 90 },
    children: [new TextRun({ text, bold: true, size: 19, font: "Arial", color: TFF_GREEN })] });
}

function note(text) {
  return new Paragraph({ spacing: { after: 200 },
    children: [
      new TextRun({ text: "TFF note · ", bold: true, size: 19, font: "Arial", color: TFF_BLUE }),
      new TextRun({ text, size: 19, font: "Arial", color: MUTED })
    ] });
}

function sectionDivider(label) {
  return new Paragraph({ spacing: { before: 300, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: TFF_BLUE, space: 4 } },
    children: [new TextRun({ text: label, bold: true, size: 30, font: "Arial", color: TFF_BLUE })] });
}

function flavorBlock(item) {
  const k = [flavorTitle(item.name), tagPara(item.tag, item.tagColor)];
  if (item.positioning) k.push(pos(item.positioning));
  if (item.image) k.push(imgPara(item.image, item.name));
  if (item.feel) k.push(feel(item.feel));
  if (item.story) k.push(body(item.story));
  if (item.note) k.push(note(item.note));
  return k;
}

/* ── Part 1: Seasonal Heritage Top 8 ── */
const top8 = [
  { name: "Hibiscus Lemonade", tag: "HERITAGE TOP 8 · SPRING / SUMMER", tagColor: SUMMER, image: path.join(SEASONAL, "image1.png"),
    positioning: "Seasonal LE · floral-bright · garden-party",
    story: "Imagine a relaxed summer afternoon in a sunlit garden. Soft petals of vibrant hibiscus flowers float gracefully atop ice-cold glasses filled with pink lemonade, beads of condensation slowly gliding down the sides. Gentle sunlight filters through lush greenery and blooming flowers, evoking tranquility, elegance, and the sophisticated refreshment of a leisurely summer day.",
    note: "Long-form heritage storytelling · floral top over mint-fresh base" },
  { name: "Raspberry Mint Lemonade", tag: "HERITAGE TOP 8 · SPRING / SUMMER", tagColor: SUMMER, image: path.join(SEASONAL, "image2.png"),
    positioning: "Social refresh · brunch & patio",
    story: "Picture an inviting outdoor brunch, nestled in the shade of tall trees. Bright raspberries and fresh mint leaves garnish glasses filled with sparkling lemonade, creating a vivid contrast of red and green against crystal-clear ice. There's the hum of quiet conversation, gentle laughter, and the peaceful calm of friends sharing fresh, invigorating flavors that rejuvenate both mood and senses.",
    note: "Mint anchor stabilizes berry brightness" },
  { name: "Cherry Limeade", tag: "HERITAGE TOP 8 · SPRING / SUMMER", tagColor: SUMMER, image: path.join(SEASONAL, "image3.png"),
    positioning: "Nostalgic energy · picnic occasion",
    story: "Visualize a lively, yet nostalgic scene—friends gathered around a picnic table draped in a classic checkered cloth. Mason jars filled with vibrant cherry limeade glisten under golden sunshine, garnished playfully with cherries and wedges of zesty lime. The scene feels warm, vibrant, carefree, and full of youthful energy, effortlessly blending nostalgia with adult sophistication.",
    note: "Citrus-cherry innovation lane · seasonal LE" },
  { name: "Berry Melon", tag: "HERITAGE TOP 8 · SPRING / SUMMER", tagColor: SUMMER, image: path.join(SEASONAL, "image4.png"),
    positioning: "Peak summer · farmers-market vitality",
    story: "Envision a farmers' market at the height of summer: stalls overflowing with fresh berries nestled next to juicy, vibrant slices of melon. Sunlight dances through market umbrellas, highlighting lush abundance. You sense freshness, juiciness, and the pure enjoyment of nature's bounty.",
    note: "Mixed-fruit · retain review beyond seasonal LE" },
  { name: "Cinnamon Mint (Cinnamint)", tag: "HERITAGE TOP 8 · FALL / WINTER", tagColor: WINTER, image: path.join(SEASONAL, "image5.png"),
    positioning: "Holiday warmth · cozy morning ritual",
    story: "Picture yourself in a cozy cabin on a crisp winter morning, the landscape outside dusted gently with snow. Steam rises from a warmly spiced beverage garnished with cinnamon sticks and fresh mint leaves. You feel comforted by soothing warmth of cinnamon, balanced perfectly by the cool clarity of mint.",
    note: "Spice-mint · chlorite-friendly fall LE" },
  { name: "Wintergreen Spice", tag: "HERITAGE TOP 8 · FALL / WINTER", tagColor: WINTER, image: path.join(SEASONAL, "image6.png"),
    positioning: "Fireside calm · cool-warm contrast",
    story: "Imagine a tranquil evening beside a crackling fireplace. Aromas of fresh wintergreen mingle with gentle spices, filling the room with warmth and clarity. Outside, snow quietly blankets the landscape, enveloping you in cozy sophistication.",
    note: "Wintergreen proven in oral care" },
  { name: "Honey-Ginger", tag: "HERITAGE TOP 8 · FALL / WINTER", tagColor: WINTER, image: path.join(SEASONAL, "image7.png"),
    positioning: "Wellness cue · soothing evening · also appears in RW portfolio",
    story: "Visualize a calming evening indoors, soft golden candlelight illuminating a warmly decorated kitchen. Honey slowly drizzles from a spoon as freshly sliced ginger steeps nearby. The air feels soothing, comforting, and serene—calm indulgence, wellness, and luxurious freshness that warms and revitalizes the senses.",
    note: "Included once across master book · ginger stability path in chlorite" },
  { name: "Pomegranate Ginger", tag: "HERITAGE TOP 8 · FALL / WINTER", tagColor: WINTER, image: path.join(SEASONAL, "image8.png"),
    positioning: "Festive premium · holiday entertaining",
    story: "Picture an elegant holiday gathering, softly illuminated by twinkling lights. Glasses garnished with vibrant pomegranate seeds and sliced ginger glow warmly in the festive atmosphere. Ginger brightness complements rich, tart pomegranate—refined celebration and festive warmth.",
    note: "Distinct from RW Pomegranate-Pear · holiday LE flagship" }
];

/* ── Part 2: Mouthwash Storytelling (10) ── */
const mw = [
  { name: "Watermelon Mojito", tag: "MOUTHWASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(MW, "image1.png"),
    feel: "Refreshing, lively, and energizing — sunny afternoons and social gatherings.",
    story: "Juicy watermelon with a mint-lime snap — poolside energy in a capful.",
    positioning: "Peak summer LE · patio & pool", note: "Mint-lime chassis · fruit top over cooling base" },
  { name: "Pink Lemonade", tag: "MOUTHWASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(MW, "image2.png"),
    feel: "Carefree moments, nostalgic summers, and vibrant freshness.",
    story: "Soft pink lemonade nostalgia with a clean adult finish — carnival memory without the sugar crash.",
    positioning: "Nostalgia LE · carefree summer", note: "Lemon brightness · mint stabilizer for chlorite" },
  { name: "Strawberry Basil", tag: "MOUTHWASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(MW, "image3.png"),
    feel: "Sophisticated freshness — classic sweetness with a modern herbal twist.",
    story: "Ripe strawberry cut by fresh basil — farmers-market sophistication for consumers who want interesting, not loud.",
    positioning: "Premium tier · beauty-counter fresh", note: "Herbal-strawberry · Gen Alpha crossover" },
  { name: "Peach Tea", tag: "MOUTHWASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(MW, "image4.png"),
    feel: "Leisurely refreshment and the charm of a peaceful summer day.",
    story: "Sun-warmed peach over soft iced tea — porch-swing calm in liquid form.",
    positioning: "Afternoon calm · tea-house", note: "Distinct from pipeline Green Tea Fresh" },
  { name: "Cucumber Melon", tag: "MOUTHWASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(MW, "image5.png"),
    feel: "Soothing wellness and rejuvenation — serene summer retreat.",
    story: "Cool cucumber water meets honeydew-soft melon — spa-day serenity that still feels fresh.",
    positioning: "Spa wellness · calm fresh", note: "Workshop cucumber direction · retain review" },
  { name: "Peppermint Mocha", tag: "MOUTHWASH · FALL / WINTER", tagColor: WINTER, image: path.join(MW, "image6.png"),
    feel: "Warmth, indulgence, festive cheer, and comforting freshness.",
    story: "Coffeehouse peppermint mocha warmth with a clean mint exhale — holiday indulgence that still freshens.",
    positioning: "Holiday LE · coffeehouse", note: "Chocolate-mint · seasonal only" },
  { name: "Ginger + Lime Mule", tag: "MOUTHWASH · FALL / WINTER", tagColor: WINTER, image: path.join(MW, "image7.png"),
    feel: "Sophistication, festive energy, and vibrant freshness.",
    story: "Copper-mug ginger bite with bright lime lift — cocktail sophistication translated to mouthwash.",
    positioning: "Holiday entertaining · cocktail cue", note: "Distinct from Honey-Ginger and Warm Ginger Mint" },
  { name: "Crisp Apple / Spiced Apple Cider", tag: "MOUTHWASH · FALL / WINTER", tagColor: WINTER, image: path.join(MW, "image8.png"),
    feel: "Warmth, comfort, authenticity, and crisp autumn nostalgia.",
    story: "Orchard-crisp apple wrapped in gentle baking spice — autumn walks in a bottle.",
    positioning: "Autumn flagship · orchard LE", note: "Spice-apple architecture" },
  { name: "Cranberry Lime", tag: "MOUTHWASH · FALL / WINTER", tagColor: WINTER, image: path.join(MW, "image9.png"),
    feel: "Bright freshness, celebration, and crisp festive energy.",
    story: "Tart cranberry sparkle with lime brightness — Thanksgiving-to-New-Year table fresh.",
    positioning: "Winter holidays · gathering fresh", note: "Berry-lime innovation lane" },
  { name: "Pumpkin Spice", tag: "MOUTHWASH · FALL / WINTER", tagColor: WINTER, image: path.join(MW, "image10.png"),
    feel: "Seasonal comfort, indulgent freshness, and cozy fall-winter nostalgia.",
    story: "Cinnamon, nutmeg, and clove warmth with a surprisingly clean finish — October's expected flavor, built for oral care.",
    positioning: "October LE · cozy comfort", note: "Proven retail velocity anchor" }
];

/* ── Part 3: Rinse-Wash (11 — Honey-Ginger omitted, in Top 8) ── */
const rw = [
  { name: "Strawberry-Pineapple", tag: "RINSE-WASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(RW, "image1.png"),
    feel: "Carefree summer getaway, vibrant energy, and relaxation.",
    story: "Sun-warmed strawberry meets bright pineapple — vacation in a capful.",
    positioning: "Vacation energy · travel occasion", note: "Fruit-forward · mint stabilizer for chlorite" },
  { name: "Orange Creamsicle", tag: "RINSE-WASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(RW, "image2.png"),
    feel: "Childhood memories with adult sophistication.",
    story: "Creamy vanilla-orange nostalgia with a clean, grown-up finish.",
    positioning: "Nostalgia play · summer LE", note: "Cream + citrus · innovation lane" },
  { name: "Blueberry-Lemon", tag: "RINSE-WASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(RW, "image3.png"),
    feel: "Relaxation, rejuvenation, and fresh morning energy.",
    story: "Morning-bright lemon lifts deep blueberry richness — spa-water clarity.",
    positioning: "Morning refresh · daily ritual", note: "Berry character · retain review" },
  { name: "Coconut-Lime", tag: "RINSE-WASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(RW, "image4.png"),
    feel: "Calm, tropical indulgence, relaxation, and escape.",
    story: "Creamy coconut softened by zesty lime — beach calm without sunscreen sweetness.",
    positioning: "Tropical calm · resort self-care", note: "Covers coconut platform for Gen Alpha (no separate coconut concept)" },
  { name: "Mango-Berry", tag: "RINSE-WASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(RW, "image5.png"),
    feel: "Natural goodness and abundance for an energetic lifestyle.",
    story: "Ripe mango folded into mixed berry depth — farmers-market abundance.",
    positioning: "Active lifestyle · vibrant daily", note: "Mixed fruit · directional tasting" },
  { name: "Dragonfruit-Rose", tag: "RINSE-WASH · SPRING / SUMMER", tagColor: SUMMER, image: path.join(RW, "image6.png"),
    feel: "Refined freshness, serenity, luxury, and elevated personal care.",
    story: "Exotic dragonfruit with a whisper of rose — premium, photogenic, skincare-adjacent oral care.",
    positioning: "Premium tier · beauty counter · Gen Alpha crossover", note: "Covers dragonfruit platform (Gen Alpha Frost variant omitted as duplicate)" },
  { name: "Vanilla-Hazelnut", tag: "RINSE-WASH · FALL / WINTER", tagColor: WINTER, image: path.join(RW, "image7.png"),
    feel: "Comfort, warmth, and indulgence in colder seasons.",
    story: "Toasted hazelnut and warm vanilla — coffeehouse comfort in a rinse.",
    positioning: "Cozy indulgence · AM ritual", note: "Nutty-vanilla · more stable than citrus" },
  { name: "Toasted Marshmallow", tag: "RINSE-WASH · FALL / WINTER", tagColor: WINTER, image: path.join(RW, "image9.png"),
    feel: "Community, warmth, nostalgia, and cozy companionship.",
    story: "Campfire marshmallow toastiness with a clean snap finish.",
    positioning: "Holiday LE · campfire nostalgia", note: "Sweet gourmand · seasonal only" },
  { name: "Carrot Cake", tag: "RINSE-WASH · FALL / WINTER", tagColor: WINTER, image: path.join(RW, "image10.png"),
    feel: "Comfort, nostalgia, and freshly baked seasonal treats.",
    story: "Spiced carrot cake warmth — cinnamon, vanilla, and baked comfort.",
    positioning: "Bakery nostalgia · autumn LE", note: "Spice-vanilla architecture" },
  { name: "Blackberry-Lavender", tag: "RINSE-WASH · FALL / WINTER", tagColor: WINTER, image: path.join(RW, "image11.png"),
    feel: "Sophisticated calmness, relaxation, and seasonal tranquility.",
    story: "Dark blackberry richness softened by lavender calm — evening-rinse sophistication.",
    positioning: "PM calm · spa-evening", note: "Floral-berry · retain review" },
  { name: "Pomegranate-Pear", tag: "RINSE-WASH · FALL / WINTER", tagColor: WINTER, image: path.join(RW, "image12.png"),
    feel: "Festive sophistication and crisp winter celebration.",
    story: "Tart pomegranate with crisp pear brightness — holiday sparkle without cloying sweetness.",
    positioning: "Holiday premium · entertaining", note: "Distinct from Top 8 Pomegranate Ginger" }
];

/* ── Part 4: Production Pipeline / Workshop (8) ── */
const pipeline = [
  { name: "Spearmint Garden", tag: "PIPELINE · STABLE", tagColor: TFF_GREEN, image: path.join(PORT, "spearmint-garden.jpg"),
    story: "Sweet spearmint with soft green herb — garden-fresh lift, clean peppermint close. Built for sodium chlorite.",
    positioning: "Core extension · everyday fresh", note: "QC cleared · July 8 workshop prototype M1" },
  { name: "Icy Peak Refresh", tag: "PIPELINE · STABLE", tagColor: TFF_GREEN, image: path.join(PORT, "icy-peak-refresh.jpg"),
    story: "Extra-cooling signature mint — peak icy hit, classic TheraBreath cooling length.",
    positioning: "Hero cooling SKU", note: "Workshop prototype M8" },
  { name: "Crystal Whitening Mint", tag: "PIPELINE · STABLE", tagColor: TFF_GREEN, image: path.join(PORT, "crystal-whitening-mint.jpg"),
    story: "Bright peppermint + icy cool for whitening-positioned rinses.",
    positioning: "Whitening sub-line", note: "Workshop prototype M7" },
  { name: "Green Tea Fresh", tag: "PIPELINE · INNOVATION", tagColor: TFF_BLUE, image: path.join(PORT, "green-tea-fresh.jpg"),
    story: "Steamed green tea with spearmint — modern wellness, light botanical body.",
    positioning: "Wellness refresh", note: "Workshop prototype M2 · retain in progress" },
  { name: "Overnight Calm Mint", tag: "PIPELINE · INNOVATION", tagColor: TFF_BLUE, image: path.join(PORT, "overnight-calm-mint.jpg"),
    story: "Chamomile and lavender with soft mint — evening calm cue for PM rinse.",
    positioning: "PM calm ritual", note: "Workshop prototype M6" },
  { name: "Warm Ginger Mint", tag: "PIPELINE · INNOVATION", tagColor: TFF_BLUE, image: path.join(PORT, "warm-ginger-mint.jpg"),
    story: "Ginger root warmth with peppermint — spice without citrus.",
    positioning: "Fall/winter MW", note: "Workshop prototype M4 · distinct from Honey-Ginger" },
  { name: "Healthy Gums Herbal", tag: "PIPELINE · INNOVATION", tagColor: TFF_BLUE, image: path.join(PORT, "healthy-gums-herbal.jpg"),
    story: "Eucalyptus and tea tree over clinical-fresh mint — gum-health cue.",
    positioning: "Therapeutic herbal", note: "Workshop prototype M10" },
  { name: "Vanilla Mint Silk", tag: "PIPELINE · INNOVATION", tagColor: TFF_BLUE, image: path.join(PORT, "vanilla-mint-silk.jpg"),
    story: "Creamy vanilla with peppermint — comfort-first for non-icy seekers.",
    positioning: "Comfort premium", note: "Workshop prototype M5 · vanilla retain review" }
];

/* ── Part 5: Gen Alpha (5 — deduped) ── */
const genAlpha = [
  { name: "Electric Blue Chill", tag: "GEN ALPHA · FUTURE", tagColor: GEN, image: path.join(PORT, "electric-blue-chill.jpg"),
    feel: "Scroll-stopping cool for the generation that films their routine.",
    story: "Hyper-cool peppermint with electric sensory identity — belongs next to a gaming monitor.",
    positioning: "#FreshCheck · viral aesthetic", note: "Mint-forward shell · color story drives shelf pop" },
  { name: "Cloud Matcha Mint", tag: "GEN ALPHA · FUTURE", tagColor: GEN, image: path.join(PORT, "cloud-matcha-mint.jpg"),
    feel: "Clean-girl calm — café culture meets oral care.",
    story: "Soft matcha creaminess with airy spearmint — gentle, photogenic, wellness-native.",
    positioning: "TikTok clean aesthetic", note: "Distinct from pipeline Green Tea (production vs. social positioning)" },
  { name: "Y2K Bubblegum Mint", tag: "GEN ALPHA · FUTURE", tagColor: GEN, image: path.join(PORT, "y2k-bubblegum-mint.jpg"),
    feel: "Ironic nostalgia — fun first, fresh always.",
    story: "Playful bubblegum sweetness snapped shut by crisp peppermint.",
    positioning: "Limited-edition drop", note: "Distinct from RW Orange Creamsicle (novelty vs. nostalgia)" },
  { name: "Astro Peppermint", tag: "GEN ALPHA · FUTURE", tagColor: GEN, image: path.join(PORT, "astro-peppermint.jpg"),
    feel: "Night-owl power-up — cosmic cool for gamers.",
    story: "Dark, intense peppermint with star-level cooling — a boost, not a chore.",
    positioning: "Night gaming · extreme cool", note: "Distinct from MW Peppermint Mocha" },
  { name: "Sparkling Vanilla Fizz", tag: "GEN ALPHA · FUTURE", tagColor: GEN, image: path.join(PORT, "sparkling-vanilla-fizz.jpg"),
    feel: "Soda-fountain fantasy — treat-yourself without sugar.",
    story: "Vanilla sparkle with a mint snap finish — malt-shop energy for the sparkling-water generation.",
    positioning: "Soda-shop revival · festive LE", note: "Distinct from pipeline Vanilla Mint Silk" }
];

const border = { style: BorderStyle.SINGLE, size: 1, color: "D8E2EC" };
const borders = { top: border, bottom: border, left: border, right: border };

function masterIndex() {
  const all = [
    ...top8.map(function (f) { return [f.name, "Heritage Top 8", f.tag.split("·").pop().trim()]; }),
    ...mw.map(function (f) { return [f.name, "Mouthwash", f.tag.split("·").pop().trim()]; }),
    ...rw.map(function (f) { return [f.name, "Rinse-Wash", f.tag.split("·").pop().trim()]; }),
    ...pipeline.map(function (f) { return [f.name, "Pipeline", f.tag.split("·").pop().trim()]; }),
    ...genAlpha.map(function (f) { return [f.name, "Gen Alpha", "Future"]; })
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4000, 1800, 3560],
    rows: [
      new TableRow({ children: ["Flavor", "Collection", "Season / Lane"].map(function (h, i) {
        return new TableCell({ borders, width: { size: [4000, 1800, 3560][i], type: WidthType.DXA },
          shading: { fill: TFF_INK, type: ShadingType.CLEAR }, margins: { top: 70, bottom: 70, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 18, font: "Arial" })] })] });
      }) }),
      ...all.map(function (r, idx) {
        return new TableRow({ children: r.map(function (c, i) {
          return new TableCell({ borders, width: { size: [4000, 1800, 3560][i], type: WidthType.DXA },
            shading: { fill: idx % 2 === 0 ? "FFFFFF" : LIGHT, type: ShadingType.CLEAR },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: c, size: 18, font: "Arial", color: "344054", bold: i === 0 })] })] });
        }) });
      })
    ]
  });
}

const children = [
  new Paragraph({ spacing: { before: 500, after: 80 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "THE FLAVOR FACTORY", bold: true, size: 22, font: "Arial", color: TFF_BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "TheraBreath Flavor Master Portfolio", bold: true, size: 46, font: "Arial", color: TFF_INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
    children: [new TextRun({ text: "Church & Dwight · Complete · Deduplicated", size: 26, font: "Arial", color: MUTED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "42 unique concepts · images & storytelling", size: 22, font: "Arial", color: MUTED, italics: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
    children: [new TextRun({ text: "Confidential · Norco, California · June 2026", size: 20, font: "Arial", color: MUTED })] }),
  new Paragraph({ children: [new PageBreak()] }),

  new Paragraph({ heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: "Overview", bold: true, size: 30, font: "Arial", color: TFF_INK })] }),
  body("This master portfolio consolidates all TFF flavor development for Church & Dwight and TheraBreath — heritage seasonal concepts, mouthwash storytelling, rinse-wash ideas, active production pipeline prototypes, and Gen Alpha future concepts. Overlapping flavors appear only once."),
  body("Deduplication rules applied: Honey-Ginger (Top 8 only), Dragonfruit-Rose covers the dragonfruit platform (Gen Alpha Frost omitted), Watermelon Mojito covers watermelon (Gen Alpha Wave omitted), Coconut-Lime covers coconut."),
  masterIndex(),
  new Paragraph({ spacing: { before: 200 }, children: [
    new TextRun({ text: "Collections at a glance", bold: true, size: 22, font: "Arial", color: TFF_INK })
  ] }),
  new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 50 },
    children: [new TextRun({ text: "Heritage Top 8 — long-form seasonal storytelling (8)", size: 21, font: "Arial", color: "344054" })] }),
  new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 50 },
    children: [new TextRun({ text: "Mouthwash concepts — C&D MW imagery (10)", size: 21, font: "Arial", color: "344054" })] }),
  new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 50 },
    children: [new TextRun({ text: "Rinse-wash concepts — RW emotional cues (11)", size: 21, font: "Arial", color: "344054" })] }),
  new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 50 },
    children: [new TextRun({ text: "Production pipeline — July 8 workshop prototypes (8)", size: 21, font: "Arial", color: "344054" })] }),
  new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 180 },
    children: [new TextRun({ text: "Gen Alpha future — social-first positioning (5)", size: 21, font: "Arial", color: "344054" })] }),
  new Paragraph({ children: [new PageBreak()] }),

  sectionDivider("Part 1 · Heritage Seasonal Top 8"),
  body("Long-form sensory storytelling — our original seasonal concepts for TheraBreath limited editions."),
  ...top8.flatMap(flavorBlock),
  new Paragraph({ children: [new PageBreak()] }),

  sectionDivider("Part 2 · Mouthwash Concepts"),
  body("Ten MW ideas from Church & Dwight flavor development — imagery and emotional positioning."),
  ...mw.flatMap(flavorBlock),
  new Paragraph({ children: [new PageBreak()] }),

  sectionDivider("Part 3 · Rinse-Wash Concepts"),
  body("Eleven RW ideas — Honey-Ginger appears in Part 1 only. Each concept includes original imagery."),
  ...rw.flatMap(flavorBlock),
  new Paragraph({ children: [new PageBreak()] }),

  sectionDivider("Part 4 · Production Pipeline"),
  body("Eight chlorite-aware prototypes in active development — tied to the July 8 workshop tasting (M1–M10 subset)."),
  ...pipeline.flatMap(flavorBlock),
  new Paragraph({ children: [new PageBreak()] }),

  sectionDivider("Part 5 · Gen Alpha Future"),
  body("Five forward-looking concepts — deduplicated against Parts 2–3. Bold positioning for next-generation shoppers."),
  ...genAlpha.flatMap(flavorBlock),

  new Paragraph({ spacing: { before: 320 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: TFF_BLUE, space: 8 } },
    children: [new TextRun({ text: "Schedule a tasting", bold: true, size: 22, font: "Arial", color: TFF_INK })] }),
  body("The Flavor Factory · 2058 Second Street · Norco, CA 92860 · (951) 273-9877 · flavorfactory.net"),
  body("July 8, 2026 — Breath of Innovation workshop · breath-of-innovation.vercel.app")
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: TFF_INK },
        paragraph: { spacing: { before: 220, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: TFF_INK },
        paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 1 } }
    ]
  },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
    alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
    headers: { default: new Header({ children: [new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TFF_BLUE, space: 4 } },
      children: [
        new TextRun({ text: "TFF Flavor Master Portfolio", size: 17, font: "Arial", color: TFF_BLUE, bold: true }),
        new TextRun({ text: "\tChurch & Dwight × TheraBreath", size: 17, font: "Arial", color: MUTED })
      ], tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Confidential · The Flavor Factory · Page ", size: 15, font: "Arial", color: MUTED }),
      new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MUTED })
    ] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(function (buf) {
  fs.writeFileSync(OUT, buf);
  console.log("Wrote", OUT, "— 42 unique concepts");
}).catch(function (e) { console.error(e); process.exit(1); });