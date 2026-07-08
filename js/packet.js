/**
 * Speaker packet. A slide by slide run of show that mirrors the
 * presentation exactly. Presentation and packet use this content.
 * Keep them synchronized. The deck structure (short row questions,
 * appendix card list, stat slides) comes from BOI.deck, the same
 * source present.js builds the slides from, so the two cannot drift.
 *
 * Main path (17 slides):
 *   1 Cover, 2 Welcome, 3 Roadmap,
 *   then per pillar: the composed pillar slide, its stat slide where
 *   one exists (P2, P4), the tasting tease (P2 only), and the
 *   discussion beat, closing on Contrast, Next step, and The floor
 *   is yours.
 * Appendix (A1..A31): cover, agenda, facility, all 17 Q&A cards in
 * full, strategic intro, ten strategic questions.
 */
(function () {
  var rosEl = document.getElementById("pkt-ros");
  var stratEl = document.getElementById("pkt-strategic");

  if (!window.BOI || !rosEl) return;

  var deck = BOI.deck || {};
  var SHORT_Q = deck.shortQ || {};
  var APPENDIX_CARDS = deck.appendixCards || {};
  var STATS = deck.stats || [];

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var slideNum = 0;

  function slide(opts) {
    slideNum += 1;
    var badge = opts.badge || "";
    var accent = opts.color || "#0a1628";
    return (
      '<article class="pkt-slide' + (opts.kind ? " pkt-slide-" + opts.kind : "") + '" style="--accent:' + accent + '">' +
      '<div class="pkt-slide-head">' +
      '<span class="pkt-slide-num">Slide ' + slideNum + " / 17</span>" +
      (badge ? '<span class="pkt-slide-badge">' + esc(badge) + "</span>" : "") +
      "</div>" +
      '<h3 class="pkt-slide-title">' + esc(opts.title) + "</h3>" +
      (opts.body || "") +
      "</article>"
    );
  }

  function sayBlock(text) {
    return (
      '<div class="pkt-block pkt-block-say">' +
      '<p class="pkt-label">Say</p>' +
      '<p class="pkt-answer">' + esc(text) + "</p></div>"
    );
  }

  function pillarRows(section) {
    var demoted = APPENDIX_CARDS[section.num] || [];
    var kept = section.cards.filter(function (c) { return demoted.indexOf(c.num) === -1; });
    return kept
      .map(function (card, i) {
        var chips = (card.points || [])
          .map(function (p) { return "<span>" + esc(p) + "</span>"; })
          .join("");
        return (
          '<div class="pkt-row">' +
          '<div class="pkt-row-head">' +
          '<span class="pkt-row-press">Press ' + (i + 1) + "</span>" +
          '<p class="pkt-row-q">' + esc(SHORT_Q[card.num] || card.question) + "</p>" +
          "</div>" +
          '<div class="pkt-row-chips">' + chips + "</div>" +
          '<p class="pkt-row-say"><span class="pkt-label-inline">Say</span> ' + esc(card.answer) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  var html = "";

  /* 1 Cover */
  html += slide({
    title: "Breath of Innovation",
    badge: "Cover",
    body:
      sayBlock("Welcome. While everyone settles, the screen is breathing on its own. Both logos are on it. Start when the room is ready."),
  });

  /* 2 Welcome */
  html += slide({
    title: "You just stood where your flavors are made.",
    badge: "Cold open",
    body:
      sayBlock("You guys didn't ask for a presentation. You asked us to take an honest look at whether we're built for where TheraBreath is going. That's exactly what this morning is about. Ask questions, interrupt us, push us where you want to go."),
  });

  /* 3 Roadmap */
  html += slide({
    title: "Four pillars. Honest answers.",
    badge: "Roadmap",
    body:
      sayBlock("When your team sent over the four areas you wanted to discuss, we took that pretty literally. So everything today fits into those buckets: resiliency, innovation, operations, and partnership."),
  });

  /* Pillars, matching buildDynamicSlides order exactly */
  BOI.qaSections.forEach(function (section) {
    html += slide({
      title: section.questionTitle || section.pillar,
      badge: section.pillarShort + " · " + section.pillar,
      color: section.color,
      kind: "pillar",
      body: '<div class="pkt-rows">' + pillarRows(section) + "</div>",
    });

    STATS.forEach(function (stat) {
      if (stat.section !== section.num) return;
      html += slide({
        title: stat.question,
        badge: "One number · guess then reveal",
        color: stat.color,
        kind: "stat",
        body: sayBlock(stat.story),
      });
    });

    if (section.num === 2) {
      html += slide({
        title: "In about 40 minutes, you taste five of these blind.",
        badge: "Tasting tease",
        color: "#f58220",
        body:
          sayBlock("Samples A to E. Start deciding what you think a next generation mint should be. Feedback is directional, not a launch decision."),
      });
    }

    html += slide({
      title: section.discussion,
      badge: "Your turn · 2 min",
      color: section.color,
      kind: "discussion",
      body: sayBlock("Anyone can start. We genuinely want the honest version, this shapes what we build next."),
    });
  });

  /* 15 Contrast */
  html += slide({
    title: "Today, and what could be.",
    badge: "Close 1 of 3",
    body:
      sayBlock("Today we're making flavors together. Five years from now we'd love to be helping shape where the entire category goes next."),
  });

  /* 16 CTA */
  html += slide({
    title: "Pick one direction worth advancing.",
    badge: "Close 2 of 3",
    body:
      sayBlock("Pick the direction worth advancing and we'll go back to work tomorrow morning making it even better. We'll move in weeks, not months."),
  });

  /* 17 Close */
  html += slide({
    title: "The floor is yours.",
    badge: "Close 3 of 3",
    body: sayBlock("We've talked enough about us. Let's talk about where you want to go next."),
  });

  rosEl.innerHTML = html;

  /* Appendix map, mirrors the appendix slide order exactly */
  var appEl = document.getElementById("pkt-appendix");
  if (appEl) {
    var aNum = 0;
    function aRow(title, note) {
      aNum += 1;
      return (
        '<div class="pkt-app-row">' +
        '<span class="pkt-app-num">A' + aNum + "</span>" +
        '<p class="pkt-app-title">' + esc(title) + "</p>" +
        (note ? '<p class="pkt-app-note">' + note + "</p>" : "") +
        "</div>"
      );
    }
    var appHtml = "";
    appHtml += aRow("Appendix cover", "");
    appHtml += aRow("The shape of your day", "Agenda with the live schedule.");
    appHtml += aRow("From the floor to the conversation", "Production room photo bridge.");
    BOI.qaSections.forEach(function (section) {
      section.cards.forEach(function (card, i) {
        appHtml += aRow(
          card.question,
          '<span class="pkt-label-inline">' + esc(section.pillarShort) + " · full card · Say</span> " + esc(card.answer)
        );
      });
    });
    appHtml += aRow("Questions for TheraBreath", "Strategic intro.");
    (BOI.strategicQuestions || []).forEach(function (q) {
      appHtml += aRow(q.question, '<span class="pkt-label-inline">Why ask</span> ' + esc(q.why));
    });
    appEl.innerHTML = appHtml;
  }

  /* All ten strategic questions in full, for open Q&A after 1:00 */
  if (stratEl) {
    BOI.strategicQuestions.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "pkt-strat-item";
      var stratBullets = (item.points || [])
        .map(function (p) { return "<li>" + esc(p) + "</li>"; })
        .join("");
      row.innerHTML =
        '<span class="pkt-strat-num">' + item.num + "</span>" +
        '<div class="pkt-strat-body">' +
        '<p class="pkt-strat-q">' + esc(item.question) + "</p>" +
        (stratBullets ? '<ul class="pkt-strat-points">' + stratBullets + "</ul>" : "") +
        '<p class="pkt-strat-why"><span class="pkt-label-inline">Why ask</span> ' + esc(item.why) + "</p></div>";
      stratEl.appendChild(row);
    });
  }

  document.getElementById("pkt-print")?.addEventListener("click", function () {
    window.print();
  });

  document.getElementById("pkt-lock")?.addEventListener("click", function () {
    if (typeof TFF !== "undefined" && TFF.logout) TFF.logout();
    else location.href = "/gate";
  });
})();
