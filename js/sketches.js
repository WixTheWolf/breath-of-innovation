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
 * Animated pillar icons. SVG recreations of the illustrated pillar set,
 * in the same navy line and brand fill style, with motion hooked up in
 * system.css (gated by prefers-reduced-motion). Rendered on the four
 * pillar slides. Class hooks: pi-loop, pi-check, pi-ray, pi-bulb,
 * pi-gear, pi-ck, pi-bottle, pi-piece-l, pi-piece-r, pi-spark.
 */
window.BOIPillarIcons = (function () {
  var NAVY = "#12386b";
  var LBLUE = "#cfe0f2";
  var BLUE = "#9cc3e6";
  var GREEN = "#5fb832";
  var GREENL = "#8fce5a";
  var GREEND = "#3f8f1e";
  var ORANGE = "#f58220";
  var DROP = "#7fb4e6";
  var WHITE = "#ffffff";

  function wrap(inner) {
    return (
      '<svg class="picon" viewBox="0 0 200 200" fill="none" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + "</svg>"
    );
  }
  function ring() {
    return '<circle cx="100" cy="100" r="92" stroke="' + NAVY + '" stroke-width="3" fill="none"/>';
  }
  /* Procedural cog centered at 0,0 */
  function gear(rOut, rIn, teeth) {
    var n = teeth * 2, pts = [];
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n - Math.PI / 2;
      var r = i % 2 === 0 ? rOut : rIn;
      pts.push((r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1));
    }
    return "M" + pts.join(" L") + " Z";
  }
  /* Small standing bottle, base at (bx, by) */
  function convBottle(bx, by, cls) {
    var h = 22;
    return (
      '<g class="' + cls + '" stroke="' + NAVY + '" stroke-width="2.2">' +
      '<path d="M' + (bx - 6) + " " + by + " v-" + (h - 6) +
        " q0 -3 2 -4 v-4 h8 v4 q2 1 2 4 v" + (h - 6) + ' Z" fill="' + WHITE + '"/>' +
      '<rect x="' + (bx - 4) + '" y="' + (by - h - 1) + '" width="8" height="4" rx="1" fill="' + BLUE + '" stroke="none"/>' +
      '<path d="M' + bx + " " + (by - 12) + " q4 5 0 9 q-4 -4 0 -9 Z\" fill=\"" + BLUE + '" stroke="none"/>' +
      "</g>"
    );
  }

  return {
    /* 1 Resiliency: shield protected between two sites, a continuity loop */
    1: wrap(
      ring() +
      '<g class="pi-loop" stroke="' + NAVY + '" stroke-width="3" fill="none">' +
        '<path d="M58 56 A60 60 0 0 1 150 60"/>' +
        '<path d="M150 60 l-8 -1 3 -8"/>' +
        '<path d="M142 144 A60 60 0 0 1 50 140"/>' +
        '<path d="M50 140 l8 1 -3 8"/>' +
      "</g>" +
      '<g class="pi-fac pi-fac-l" stroke="' + NAVY + '" stroke-width="2.4">' +
        '<path d="M32 122 v-16 l7 -5 v5 l7 -5 v5 l7 -5 v21 Z" fill="' + WHITE + '"/>' +
        '<rect x="44" y="112" width="6" height="10" fill="' + BLUE + '" stroke="none"/>' +
      "</g>" +
      '<g class="pi-fac pi-fac-r" stroke="' + NAVY + '" stroke-width="2.4">' +
        '<path d="M168 122 v-16 l-7 -5 v5 l-7 -5 v5 l-7 -5 v21 Z" fill="' + WHITE + '"/>' +
        '<rect x="150" y="112" width="6" height="10" fill="' + BLUE + '" stroke="none"/>' +
      "</g>" +
      '<g class="pi-dot" stroke="' + GREEN + '" stroke-width="2.4" stroke-dasharray="1.5 5">' +
        '<line x1="58" y1="114" x2="76" y2="106"/>' +
        '<line x1="142" y1="114" x2="124" y2="106"/>' +
      "</g>" +
      '<g class="pi-shield">' +
        '<path d="M100 62 L126 71 V100 Q126 123 100 136 Q74 123 74 100 V71 Z" fill="' + LBLUE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<path class="pi-check" pathLength="1" d="M88 100 l9 10 17 -22" stroke="' + GREEN + '" stroke-width="6" fill="none"/>' +
      "</g>" +
      '<g class="pi-box" stroke="' + NAVY + '" stroke-width="2.4">' +
        '<path d="M89 150 h22 v18 h-22 Z" fill="' + WHITE + '"/>' +
        '<path d="M89 150 l5 -5 h22 l-5 5" fill="' + LBLUE + '"/>' +
        '<line x1="100" y1="150" x2="100" y2="168" stroke="' + GREEN + '" stroke-width="3"/>' +
      "</g>"
    ),

    /* 2 Innovation: a bright idea with a leaf, a lime and a drop */
    2: wrap(
      ring() +
      '<g class="pi-rays" stroke-width="3">' +
        '<line class="pi-ray" x1="100" y1="30" x2="100" y2="41" stroke="' + BLUE + '"/>' +
        '<line class="pi-ray" x1="66" y1="41" x2="73" y2="51" stroke="' + BLUE + '"/>' +
        '<line class="pi-ray" x1="134" y1="41" x2="127" y2="51" stroke="' + BLUE + '"/>' +
        '<line class="pi-ray" x1="45" y1="66" x2="56" y2="70" stroke="' + ORANGE + '"/>' +
        '<line class="pi-ray" x1="155" y1="66" x2="144" y2="70" stroke="' + ORANGE + '"/>' +
        '<line class="pi-ray" x1="42" y1="96" x2="53" y2="96" stroke="' + BLUE + '"/>' +
        '<line class="pi-ray" x1="158" y1="96" x2="147" y2="96" stroke="' + BLUE + '"/>' +
      "</g>" +
      '<path class="pi-bulb" d="M100 50 a34 34 0 0 1 21 60 q-4 4 -4 10 v3 h-34 v-3 q0 -6 -4 -10 a34 34 0 0 1 21 -60 Z" fill="' + WHITE + '" stroke="' + NAVY + '" stroke-width="3.2"/>' +
      '<g stroke="' + NAVY + '" stroke-width="3">' +
        '<line x1="85" y1="126" x2="115" y2="126"/>' +
        '<line x1="88" y1="133" x2="112" y2="133"/>' +
        '<path d="M94 140 h12"/>' +
      "</g>" +
      '<path d="M90 74 q17 4 11 31 q-19 -4 -11 -31 Z" fill="' + GREENL + '" stroke="' + GREEND + '" stroke-width="1.8"/>' +
      '<path d="M92 79 q4 13 6 23" stroke="' + GREEND + '" stroke-width="1.3" fill="none"/>' +
      '<path d="M112 72 a27 27 0 0 1 0 42 Z" fill="' + GREENL + '" stroke="' + GREEND + '" stroke-width="1.8"/>' +
      '<g stroke="' + GREEND + '" stroke-width="1.2">' +
        '<line x1="112" y1="72" x2="119" y2="93"/>' +
        '<line x1="112" y1="114" x2="119" y2="93"/>' +
      "</g>" +
      '<path d="M105 102 q8 11 0 18 q-8 -7 0 -18 Z" fill="' + DROP + '" stroke="#2f7fbf" stroke-width="1.8"/>'
    ),

    /* 3 Operations: a checked clipboard, a turning gear, a line of product */
    3: wrap(
      ring() +
      '<g class="pi-clip">' +
        '<rect x="40" y="50" width="52" height="66" rx="6" fill="' + WHITE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<rect x="56" y="44" width="20" height="11" rx="3" fill="' + LBLUE + '" stroke="' + NAVY + '" stroke-width="2.6"/>' +
        '<g stroke="' + GREEN + '" stroke-width="2.4" fill="none">' +
          '<circle cx="54" cy="70" r="5"/><path class="pi-ck" pathLength="1" d="M51.4 70 l1.8 2 3.6 -4.4"/>' +
          '<circle cx="54" cy="85" r="5"/><path class="pi-ck" pathLength="1" d="M51.4 85 l1.8 2 3.6 -4.4"/>' +
          '<circle cx="54" cy="100" r="5"/><path class="pi-ck" pathLength="1" d="M51.4 100 l1.8 2 3.6 -4.4"/>' +
        "</g>" +
        '<g stroke="' + NAVY + '" stroke-width="2.6">' +
          '<line x1="66" y1="70" x2="84" y2="70"/>' +
          '<line x1="66" y1="85" x2="84" y2="85"/>' +
          '<line x1="66" y1="100" x2="84" y2="100"/>' +
        "</g>" +
      "</g>" +
      '<g transform="translate(142 66)">' +
        '<g class="pi-gear-arrows" stroke="' + GREEN + '" stroke-width="2.4" fill="none">' +
          '<path d="M-20 -5 A20 20 0 0 1 13 -14"/><path d="M13 -14 l-1 5 -5 -2"/>' +
          '<path d="M20 5 A20 20 0 0 1 -13 14"/><path d="M-13 14 l1 -5 5 2"/>' +
        "</g>" +
        '<g class="pi-gear">' +
          '<path d="' + gear(15, 10.5, 8) + '" fill="' + LBLUE + '" stroke="' + NAVY + '" stroke-width="2.6"/>' +
          '<circle r="4.5" fill="' + WHITE + '" stroke="' + NAVY + '" stroke-width="2.4"/>' +
        "</g>" +
      "</g>" +
      '<g class="pi-conveyor">' +
        convBottle(112, 150, "pi-bottle pi-b1") +
        convBottle(130, 150, "pi-bottle pi-b2") +
        convBottle(148, 150, "pi-bottle pi-b3") +
        '<rect x="94" y="150" width="74" height="15" rx="7.5" fill="' + LBLUE + '" stroke="' + NAVY + '" stroke-width="2.6"/>' +
        '<g stroke="' + NAVY + '" stroke-width="1.8" fill="none">' +
          '<circle cx="106" cy="157.5" r="2.4"/><circle cx="122" cy="157.5" r="2.4"/><circle cx="138" cy="157.5" r="2.4"/><circle cx="154" cy="157.5" r="2.4"/>' +
        "</g>" +
      "</g>" +
      '<g class="pi-endcheck">' +
        '<circle cx="176" cy="128" r="10" fill="' + WHITE + '" stroke="' + GREEN + '" stroke-width="2.6"/>' +
        '<path class="pi-ck" pathLength="1" d="M171 128 l3.5 3.5 6.5 -8" stroke="' + GREEN + '" stroke-width="2.6" fill="none"/>' +
      "</g>"
    ),

    /* 4 Partnership: two hands come together in a handshake, a spark
       on contact. The right arm slides in from the right (under hand
       plus thumb), the left arm from the left (over hand with
       knuckles), on the shared piece animation. */
    4: wrap(
      ring() +
      '<g class="pi-spark" stroke="' + ORANGE + '" stroke-width="3">' +
        '<line x1="100" y1="46" x2="100" y2="58"/>' +
        '<line x1="83" y1="51" x2="89" y2="62"/>' +
        '<line x1="117" y1="51" x2="111" y2="62"/>' +
      "</g>" +
      '<g class="pi-piece-r">' +
        '<path d="M150 96 L118 96 Q103 96 93 106 L78 118 Q72 124 77 130 Q83 136 90 130 L101 122 Q109 129 121 129 L150 129 Z" fill="' + WHITE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<path d="M124 98 Q116 87 103 90 Q106 99 118 102 Q122 101 124 98 Z" fill="' + WHITE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<rect x="148" y="88" width="42" height="42" rx="7" fill="' + GREENL + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<circle cx="158" cy="109" r="2.6" fill="' + NAVY + '"/>' +
      "</g>" +
      '<g class="pi-piece-l">' +
        '<path d="M50 100 L84 100 Q97 100 106 108 L121 120 Q126 125 121 130 Q115 136 108 130 L96 121 Q88 127 76 127 L50 127 Z" fill="' + WHITE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<path d="M96 112 q4 -5 8 0 M103 117 q4 -5 8 0 M110 122 q4 -5 8 0" stroke="' + NAVY + '" stroke-width="2" fill="none"/>' +
        '<rect x="10" y="88" width="42" height="42" rx="7" fill="' + BLUE + '" stroke="' + NAVY + '" stroke-width="3"/>' +
        '<circle cx="42" cy="109" r="2.6" fill="' + NAVY + '"/>' +
      "</g>" +
      '<path d="M62 152 q38 8 76 0" stroke="' + BLUE + '" stroke-width="2.4" fill="none"/>'
    ),
  };
})();
