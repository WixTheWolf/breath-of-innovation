(function () {
  var STORAGE_KEY = "tff-scores";
  var concepts = TFFConcepts.activeList().map(function (c) {
    return { id: c.id, name: c.name, sub: c.sub, stability: c.stability };
  });

  function migrate(raw) {
    if (!raw || raw.version === 2) return raw || { version: 2, activeRater: "", raters: {} };
    if (raw.raters) return raw;
    return { version: 2, activeRater: "Rater 1", raters: { "Rater 1": raw } };
  }

  function load() { return migrate(TFFStorage.get(STORAGE_KEY, { version: 2, activeRater: "", raters: {} })); }
  function save(data) { TFFStorage.set(STORAGE_KEY, data); }

  function activeScores(data) {
    var name = data.activeRater;
    if (!name) return {};
    if (!data.raters[name]) data.raters[name] = {};
    return data.raters[name];
  }

  function setSyncStatus(state, msg) {
    var pill = document.getElementById("sync-pill");
    if (!pill) return;
    pill.className = "boi-sync " + state;
    pill.textContent = msg;
  }

  function syncActiveRater() {
    var data = load();
    if (!data.activeRater) {
      setSyncStatus("wait", "Set rater name to sync");
      return;
    }
    setSyncStatus("pending", "Syncing…");
    TFFScoreSync.push(activeScores(data), data.activeRater, concepts.length, function (res, status) {
      if (res && res.ok) setSyncStatus("ok", "Live · " + (res.rated || 0) + " concepts synced");
      else if (status === 503) setSyncStatus("err", "Live storage offline — saved locally");
      else setSyncStatus("err", "Sync failed — saved locally");
    });
  }

  function setRater(name) {
    name = (name || "").trim();
    if (!name) return;
    var data = load();
    data.activeRater = name;
    if (!data.raters[name]) data.raters[name] = {};
    save(data);
    updateRaterUI();
    renderCards();
    syncActiveRater();
  }

  function updateRaterUI() {
    var data = load();
    var pick = document.getElementById("rater-pick");
    var names = Object.keys(data.raters).sort();
    pick.innerHTML = names.map(function (n) {
      return '<option value="' + n + '"' + (n === data.activeRater ? " selected" : "") + ">" + n + "</option>";
    }).join("");
    document.getElementById("rater-name").value = data.activeRater || "";
    document.getElementById("rater-summary").textContent =
      names.length ? names.length + " rater(s) on this device: " + names.join(", ") : "No raters yet — enter your name.";
  }

  function slider(key, label, val, id) {
    return '<label class="boi-slider-row"><span>' + label + '</span><output id="o-' + id + "-" + key + '">' + val + "</output></label>" +
      '<input type="range" min="1" max="9" step="1" value="' + val + '" data-id="' + id + '" data-key="' + key + '">';
  }

  function renderCards() {
    var data = load();
    var scores = activeScores(data);
    document.getElementById("cards").innerHTML = concepts.map(function (c) {
      var s = scores[c.id] || { liking: 5, unique: 5, intent: 5 };
      return '<article class="boi-score-card" data-id="' + c.id + '">' +
        '<div class="boi-score-head"><span class="boi-score-num">' + String(c.id).padStart(2, "0") + "</span>" +
        "<div><h2>" + c.name + "</h2><p class=\"sub\">" + c.sub + "</p></div></div>" +
        '<div class="boi-sliders">' +
        slider("liking", "Liking", s.liking, c.id) +
        slider("unique", "Uniqueness", s.unique, c.id) +
        slider("intent", "Purchase intent", s.intent, c.id) +
        "</div></article>";
    }).join("");

    document.querySelectorAll('input[type="range"]').forEach(function (inp) {
      inp.addEventListener("input", onSlide);
    });
    renderBoard();
  }

  function onSlide(e) {
    var id = e.target.dataset.id;
    var key = e.target.dataset.key;
    var val = +e.target.value;
    document.getElementById("o-" + id + "-" + key).textContent = val;
    var data = load();
    var scores = activeScores(data);
    if (!scores[id]) scores[id] = { liking: 5, unique: 5, intent: 5 };
    scores[id][key] = val;
    save(data);
    renderBoard();
    syncActiveRater();
  }

  function aggregateScores(data) {
    var names = Object.keys(data.raters);
    var agg = {};
    concepts.forEach(function (c) {
      var liking = 0, unique = 0, intent = 0, count = 0;
      names.forEach(function (n) {
        var s = (data.raters[n] || {})[c.id];
        if (!s) return;
        liking += s.liking || 0;
        unique += s.unique || 0;
        intent += s.intent || 0;
        count++;
      });
      agg[c.id] = {
        liking: count ? liking / count : 0,
        unique: count ? unique / count : 0,
        intent: count ? intent / count : 0,
        count: count
      };
    });
    return agg;
  }

  function renderRoomBoard(aggregate, count, updatedAt) {
    var rows = concepts.map(function (c) {
      var a = (aggregate || {})[c.id] || (aggregate || {})[String(c.id)] || { liking: 0, count: 0 };
      return { name: c.name, id: c.id, liking: a.liking, count: a.count };
    }).sort(function (a, b) { return b.liking - a.liking || b.count - a.count; });

    document.getElementById("room-rows").innerHTML = rows.map(function (r, i) {
      var pct = r.count ? (r.liking / 9) * 100 : 0;
      var val = r.count ? r.liking.toFixed(1) : "—";
      return '<div class="boi-lb-row"><span><b>#' + (i + 1) + "</b> " + r.name + "</span><span>" + val + "/9</span></div>" +
        (r.count ? '<div class="boi-bar"><i style="width:' + pct + '%"></i></div>' : "");
    }).join("");

    var meta = document.getElementById("room-meta");
    if (!count) meta.textContent = "No room scores yet — be the first rater.";
    else meta.textContent = count + " rater(s) in the room" +
      (updatedAt ? " · updated " + new Date(updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "");
  }

  function pollRoom() {
    TFFScoreSync.fetchPublic(function (res) {
      if (res && res.ok && res.aggregate) renderRoomBoard(res.aggregate, res.count, res.updatedAt);
    });
  }

  function renderBoard() {
    var data = load();
    var agg = aggregateScores(data);
    var rows = concepts.map(function (c) {
      var s = agg[c.id];
      return { name: c.name, id: c.id, liking: s.liking, avg: (s.liking + s.unique + s.intent) / 3, count: s.count };
    }).sort(function (a, b) { return b.liking - a.liking || b.avg - a.avg; });

    document.getElementById("board-rows").innerHTML = rows.map(function (r, i) {
      var pct = (r.liking / 9) * 100;
      var val = r.count ? r.liking.toFixed(1) : "—";
      return '<div class="boi-lb-row"><span><b>#' + (i + 1) + "</b> " + r.name + "</span><span>" + val + "/9</span></div>" +
        (r.count ? '<div class="boi-bar"><i style="width:' + pct + '%"></i></div>' : "");
    }).join("");
    updateRaterUI();
  }

  window.exportScores = function () {
    var data = load();
    var lines = ["TFF × TheraBreath concept scores · " + new Date().toLocaleDateString(), ""];
    Object.keys(data.raters).sort().forEach(function (name) {
      lines.push("=== " + name + " ===");
      concepts.forEach(function (c) {
        var s = (data.raters[name] || {})[c.id] || {};
        lines.push(c.id + ". " + c.name + " — L:" + (s.liking || "-") + " U:" + (s.unique || "-") + " I:" + (s.intent || "-"));
      });
      lines.push("");
    });
    lines.push("=== AGGREGATE (avg liking) ===");
    var agg = aggregateScores(data);
    concepts.forEach(function (c) {
      var s = agg[c.id];
      lines.push(c.id + ". " + c.name + " — L:" + (s.count ? s.liking.toFixed(1) : "-"));
    });
    navigator.clipboard.writeText(lines.join("\n")).then(function () { alert("All rater scores copied"); });
  };

  window.clearScores = function () {
    if (confirm("Clear all scores for all raters on this device?")) {
      TFFStorage.remove(STORAGE_KEY);
      renderCards();
    }
  };

  document.getElementById("rater-save").addEventListener("click", function () {
    setRater(document.getElementById("rater-name").value);
  });
  document.getElementById("rater-pick").addEventListener("change", function () {
    setRater(this.value);
  });

  renderCards();
  pollRoom();
  setInterval(pollRoom, 3000);
})();