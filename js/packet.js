(function () {
  var qaEl = document.getElementById("pkt-qa");
  var stratEl = document.getElementById("pkt-strategic");

  if (!window.BOI || !qaEl) return;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  BOI.qaSections.forEach(function (section) {
    var block = document.createElement("div");
    block.className = "pkt-pillar";

    var head = document.createElement("div");
    head.className = "pkt-pillar-head";
    head.style.background = section.color;
    head.textContent = section.pillarShort + " · " + section.pillar;
    block.appendChild(head);

    section.cards.forEach(function (card) {
      var item = document.createElement("article");
      item.className = "pkt-card";
      var bullets = (card.points || [])
        .map(function (p) {
          return "<li>" + esc(p) + "</li>";
        })
        .join("");

      item.innerHTML =
        '<p class="pkt-card-num">Card ' + card.num + "</p>" +
        '<h3 class="pkt-card-q">' + esc(card.question) + "</h3>" +
        (bullets ? '<ul class="pkt-points">' + bullets + "</ul>" : "") +
        '<p class="pkt-answer"><strong>Full answer:</strong> ' + esc(card.answer) + "</p>";
      block.appendChild(item);
    });

    qaEl.appendChild(block);
  });

  BOI.strategicQuestions.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "pkt-strat-item";
    var stratBullets = (item.points || [])
      .map(function (p) {
        return "<li>" + esc(p) + "</li>";
      })
      .join("");

    row.innerHTML =
      '<span class="pkt-strat-num">' + item.num + ".</span>" +
      '<p class="pkt-strat-q">' + esc(item.question) + "</p>" +
      (stratBullets ? '<ul class="pkt-strat-points">' + stratBullets + "</ul>" : "") +
      '<p class="pkt-strat-why"><strong>Why it matters:</strong> ' + esc(item.why) + "</p>";
    stratEl.appendChild(row);
  });

  document.getElementById("pkt-print")?.addEventListener("click", function () {
    window.print();
  });
})();