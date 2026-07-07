/**
 * Sketch illustrations for the presentation. One line art scene per
 * slide, drawn in a consistent hand sketched style. Every stroked
 * element carries pathLength="1" so the draw on animation is uniform.
 * Color comes from currentColor, set per slide in system.css.
 */
window.BOISketches = (function () {
  function svg(inner) {
    return (
      '<svg class="sk" viewBox="0 0 220 160" fill="none" aria-hidden="true" ' +
      'stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      inner +
      "</svg>"
    );
  }
  function p(d) { return '<path pathLength="1" d="' + d + '"/>'; }
  function c(x, y, r) { return '<circle pathLength="1" cx="' + x + '" cy="' + y + '" r="' + r + '"/>'; }
  function line(x1, y1, x2, y2) {
    return '<line pathLength="1" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  }

  /* A small standing bottle open at the base, resting on a shelf */
  function bottle(bx, by, h) {
    h = h || 30;
    return p(
      "M" + (bx - 7) + " " + by + " v-" + (h - 10) +
      " q0 -5 4 -7 v-5 h6 v5 q4 2 4 7 v" + (h - 10)
    );
  }

  /* A tapered tasting cup, wider at the rim */
  function cup(cx, top, tall) {
    tall = tall || 38;
    return (
      p("M" + (cx - 9) + " " + top + " q9 6 18 0") +
      p("M" + (cx - 8) + " " + (top + 2) + " l2.5 " + tall + " h11 l2.5 -" + tall)
    );
  }

  var scenes = {
    /* Cover: a flask with rising bubbles, breath of innovation */
    cover: svg(
      p("M97 28 h26") +
      p("M101 28 v16 l-16 54 q-3 10 7 10 h36 q10 0 7 -10 l-16 -54 v-16") +
      line(88, 92, 132, 92) +
      c(118, 80, 4) + c(129, 63, 3) + c(120, 48, 2.5)
    ),

    /* Welcome: a factory making flavor, you just stood on this floor */
    welcome: svg(
      p("M32 118 V72 l14 -10 v10 l14 -10 v10 l14 -10 V118 Z") +
      line(22, 118, 150, 118) +
      p("M46 118 v-20 h12 v20") +
      p("M88 72 v-30 h9 v30") +
      c(90, 34, 3) + c(99, 24, 2.5) + c(93, 15, 2)
    ),

    /* Overview: four pillars under a roof */
    overview: svg(
      p("M28 52 L110 28 L192 52") +
      line(24, 52, 196, 52) +
      line(48, 58, 48, 126) +
      line(89, 58, 89, 126) +
      line(131, 58, 131, 126) +
      line(172, 58, 172, 126) +
      line(24, 132, 196, 132)
    ),

    /* Resiliency: a safety net catches what falls */
    resiliency: svg(
      c(110, 42, 9) +
      line(46, 84, 46, 126) +
      line(174, 84, 174, 126) +
      p("M46 84 q64 44 128 0") +
      line(74, 94, 82, 112) +
      line(103, 99, 107, 117) +
      line(132, 96, 132, 114)
    ),

    /* Innovation: a bright idea, where new flavors come from */
    innovation: svg(
      p("M110 38 a28 28 0 0 1 18 49 q-3 3 -3 9 h-30 q0 -6 -3 -9 a28 28 0 0 1 18 -49 Z") +
      line(97, 104, 123, 104) +
      line(100, 112, 120, 112) +
      p("M62 46 v14 M55 53 h14") +
      p("M160 58 v12 M154 64 h12") +
      p("M58 96 v10 M53 101 h10")
    ),

    /* Operations: a clock and a check, on time every order */
    operations: svg(
      c(102, 78, 42) +
      p("M102 78 V50") +
      p("M102 78 L122 88") +
      p("M102 40 v5 M102 111 v5 M64 78 h5 M136 78 h5") +
      p("M150 106 l12 12 20 -26")
    ),

    /* Partnership: two paths climb to a shared flag, year five */
    partnership: svg(
      line(30, 132, 190, 132) +
      p("M40 132 C70 118 92 96 108 58") +
      p("M180 132 C150 118 128 96 112 58") +
      line(110, 58, 110, 34) +
      p("M110 34 h22 l-6 8 6 8 h-22") +
      c(40, 132, 5) + c(180, 132, 5)
    ),

    /* Discussion beats: two voices in the room */
    discussion: svg(
      p("M38 50 h72 q10 0 10 10 v28 q0 10 -10 10 h-42 l-16 14 v-14 h-14 q-10 0 -10 -10 v-28 q0 -10 10 -10 Z") +
      p("M126 74 h56 q10 0 10 10 v24 q0 10 -10 10 h-12 v12 l-14 -12 h-30 q-10 0 -10 -10 v-24 q0 -10 10 -10 Z")
    ),

    /* Stat 53: a shelf lined with flavors */
    shelf: svg(
      line(28, 118, 192, 118) +
      bottle(52, 118, 34) + bottle(84, 118, 30) + bottle(116, 118, 36) +
      bottle(148, 118, 28) + bottle(178, 118, 32)
    ),

    /* Stat 40: rings of experience, like a tree */
    rings: svg(
      c(110, 80, 14) + c(110, 80, 26) + c(110, 80, 38) + c(110, 80, 50)
    ),

    /* Tasting tease: five blind cups */
    tease: svg(
      cup(44, 62) + cup(82, 66) + cup(120, 62) + cup(158, 66) + cup(196, 62)
    ),

    /* Contrast: a seedling today, a tree in what could be */
    contrast: svg(
      line(34, 128, 188, 128) +
      p("M66 128 v-26") +
      p("M66 108 q-14 -2 -18 -14 q16 -1 18 10") +
      p("M66 100 q12 -2 16 -12 q-14 0 -16 8") +
      p("M150 128 v-40") +
      c(150, 72, 26) +
      p("M150 96 l-16 -12 M150 104 l16 -12")
    ),

    /* Next step: pick one from the flight */
    cta: svg(
      cup(78, 74) + cup(112, 74) + cup(146, 74) +
      p("M102 50 l7 8 14 -18")
    ),

    /* Close: an open door, the floor is yours */
    close: svg(
      p("M84 36 h56 v108 h-56") +
      p("M84 36 L62 26 v118 l22 -6") +
      line(74, 92, 78, 92) +
      p("M150 58 l30 -10 M150 90 l32 0 M150 122 l30 10")
    ),
  };

  return scenes;
})();

/**
 * Full color pillar icons, matching the illustrated set. These render
 * on the four pillar slides in place of the line sketch. Filled shapes,
 * so they fade in rather than draw on. No pathLength here on purpose.
 */
window.BOIPillarIcons = (function () {
  var NAVY = "#12386b";
  var BLUE = "#a9cdec";
  var GREEN = "#8fce5a";
  var GREEND = "#4f9c22";
  var DROP = "#9cc3e6";
  var ORANGE = "#f58220";
  function wrap(inner) {
    return (
      '<svg class="pic" viewBox="0 0 120 120" fill="none" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + "</svg>"
    );
  }

  return {
    /* 1 Resiliency: a shield with a check, protected and continuous */
    1: wrap(
      '<path d="M60 18 L94 29 V58 Q94 89 60 104 Q26 89 26 58 V29 Z" fill="#eef4fa" stroke="' + NAVY + '" stroke-width="3.4"/>' +
      '<path d="M60 27 L86 35 V58 Q86 82 60 94 Q34 82 34 58 V35 Z" fill="none" stroke="' + BLUE + '" stroke-width="2"/>' +
      '<path d="M47 59 l10 11 19 -25" fill="none" stroke="' + GREEN + '" stroke-width="7"/>'
    ),

    /* 2 Innovation: a bright idea with a leaf and a drop inside */
    2: wrap(
      '<g stroke="' + NAVY + '" stroke-width="3.1">' +
      '<line x1="60" y1="9" x2="60" y2="18"/>' +
      '<line x1="31" y1="21" x2="37" y2="29"/>' +
      '<line x1="89" y1="21" x2="83" y2="29"/>' +
      '<line x1="17" y1="49" x2="26" y2="51"/>' +
      '<line x1="103" y1="49" x2="94" y2="51"/>' +
      "</g>" +
      '<path d="M60 22 a26 26 0 0 1 16 46 q-3 3 -3 8 v3 h-26 v-3 q0 -5 -3 -8 a26 26 0 0 1 16 -46 Z" fill="#fff" stroke="' + NAVY + '" stroke-width="3.4"/>' +
      '<path d="M47 84 h26 M50 91 h20" stroke="' + NAVY + '" stroke-width="3.1"/>' +
      '<path d="M56 45 q13 3 9 25 q-15 -3 -9 -25 Z" fill="' + GREEN + '" stroke="' + GREEND + '" stroke-width="1.8"/>' +
      '<path d="M69 57 q7 9 0 15 q-7 -6 0 -15 Z" fill="' + DROP + '" stroke="#2f7fbf" stroke-width="1.8"/>'
    ),

    /* 3 Operations: a checked clipboard and a gear, run reliably */
    3: wrap(
      '<rect x="24" y="28" width="50" height="64" rx="6" fill="#fff" stroke="' + NAVY + '" stroke-width="3.4"/>' +
      '<rect x="39" y="22" width="20" height="11" rx="3" fill="' + BLUE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
      '<g stroke="' + GREEN + '" stroke-width="2.6" fill="none">' +
      '<circle cx="37" cy="47" r="5"/><path d="M34.6 47 l1.8 2 3.4 -4"/>' +
      '<circle cx="37" cy="62" r="5"/><path d="M34.6 62 l1.8 2 3.4 -4"/>' +
      '<circle cx="37" cy="77" r="5"/><path d="M34.6 77 l1.8 2 3.4 -4"/>' +
      "</g>" +
      '<g stroke="' + NAVY + '" stroke-width="3" stroke-linecap="round">' +
      '<line x1="48" y1="47" x2="66" y2="47"/>' +
      '<line x1="48" y1="62" x2="66" y2="62"/>' +
      '<line x1="48" y1="77" x2="66" y2="77"/>' +
      "</g>" +
      '<g transform="translate(88 80)">' +
      '<path d="M0 -15 l3 0 2 -5 4 1 0 5 3 2 4 -3 3 3 -3 4 2 3 5 0 1 4 -5 2 0 3 3 3 -3 3 -4 -2 -3 2 -1 4 -4 -1 -1 -5 -3 -2 -4 3 -3 -3 3 -4 -2 -3 -5 0 -1 -4 5 -2 0 -3 z" fill="#eef4fa" stroke="' + NAVY + '" stroke-width="2.6"/>' +
      '<circle cx="0" cy="0" r="5" fill="#fff" stroke="' + NAVY + '" stroke-width="2.6"/>' +
      "</g>"
    ),

    /* 4 Partnership: two puzzle pieces coming together */
    4: wrap(
      '<g stroke="' + ORANGE + '" stroke-width="3">' +
      '<line x1="60" y1="24" x2="60" y2="34"/>' +
      '<line x1="47" y1="28" x2="51" y2="36"/>' +
      '<line x1="73" y1="28" x2="69" y2="36"/>' +
      "</g>" +
      '<path d="M28 48 H57 V56 A6 6 0 0 1 57 68 V80 H28 V68 A6 6 0 0 0 28 56 Z" fill="' + BLUE + '" stroke="' + NAVY + '" stroke-width="3.2"/>' +
      '<path d="M92 48 H63 V56 A6 6 0 0 0 63 68 V80 H92 V68 A6 6 0 0 1 92 56 Z" fill="' + GREEN + '" stroke="' + NAVY + '" stroke-width="3.2"/>'
    ),
  };
})();
