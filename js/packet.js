(function () {
  var qaEl = document.getElementById("pkt-qa");
  var stratEl = document.getElementById("pkt-strategic");

  if (!window.BOI || !qaEl) return;

  BOI.qaSections.forEach(function (section) {
    var block = document.createElement("div");
    block.className = "pkt-pillar";

    var head = document.createElement("div");
    head.className = "pkt-pillar-head";
    head.style.background = section.color;
    head.textContent = section.emoji + "  " + section.pillarShort + " · " + section.pillar;
    block.appendChild(head);

    section.cards.forEach(function (card) {
      var cues = card.hints
        .map(function (h) {
          return '<span class="pkt-cue">' + h + "</span>";
        })
        .join("");

      var item = document.createElement("article");
      item.className = "pkt-card";
      item.innerHTML =
        '<div class="pkt-card-top">' +
        '<img class="pkt-thumb" src="' + card.image + '" alt="" />' +
        "<div>" +
        '<p class="pkt-card-num">Card ' + card.num + " · Screen cue</p>" +
        '<h3 class="pkt-card-q">' + card.emoji + " " + card.question + "</h3>" +
        "</div></div>" +
        '<div class="pkt-cues">' + cues + "</div>" +
        '<p class="pkt-answer"><strong>Say:</strong> ' + card.fullAnswer + "</p>";
      block.appendChild(item);
    });

    qaEl.appendChild(block);
  });

  BOI.strategicQuestions.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "pkt-strat-item";
    row.innerHTML =
      '<span class="pkt-strat-num">' + item.num + ".</span>" +
      '<p class="pkt-strat-q">' + item.emoji + " " + item.question + "</p>" +
      '<p class="pkt-strat-why"><strong>Why:</strong> ' + item.fullWhy + "</p>";
    stratEl.appendChild(row);
  });

  document.getElementById("pkt-print")?.addEventListener("click", function () {
    window.print();
  });
})();