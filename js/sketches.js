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
