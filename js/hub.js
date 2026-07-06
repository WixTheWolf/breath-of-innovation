(function () {
  var scheduleEl = document.getElementById("hub-schedule");
  var liveEl = document.getElementById("hub-live");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Canonical day. Times in minutes from midnight, local. */
  var blocks = [
    { t: "9:00", label: "Facility tour", desc: "Production, QC", start: 540, end: 565, href: "/visit" },
    { t: "9:30", label: "Presentation", desc: "Four pillars", start: 570, end: 615, href: "/present" },
    { t: "10:15", label: "Break", desc: "Reset", start: 615, end: 630, href: "/visit" },
    { t: "10:30", label: "Tasting", desc: "Blind map, score", start: 630, end: 675, href: "/taste" },
    { t: "11:30", label: "Lunch", desc: "Off site", start: 690, end: 780, href: "/visit" },
    { t: "1:00", label: "Open Q&A", desc: "Your pace", start: 780, end: 840, href: "/visit" }
  ];

  /* Live day. Real clock on July 8, 2026, or ?now=MIN to preview. */
  function liveState() {
    var override = new URLSearchParams(location.search).get("now");
    var now = new Date();
    var isDay =
      override !== null ||
      (now.getFullYear() === 2026 && now.getMonth() === 6 && now.getDate() === 8);
    if (!isDay) return null;
    var mins = override !== null ? parseInt(override, 10) : now.getHours() * 60 + now.getMinutes();
    if (mins < blocks[0].start) {
      return { pre: true, wait: blocks[0].start - mins };
    }
    var active = null;
    for (var i = 0; i < blocks.length; i++) {
      if (mins < blocks[i].end) { active = { index: i, block: blocks[i], inside: mins >= blocks[i].start }; break; }
    }
    if (!active) active = { index: blocks.length - 1, block: blocks[blocks.length - 1], inside: true };
    return active;
  }

  /* Horizontal timeline */
  if (scheduleEl) {
    scheduleEl.innerHTML = blocks
      .map(function (b) {
        return (
          '<div class="tl-stop" role="listitem" data-href="' + b.href + '">' +
          '<span class="tl-time mono">' + b.t + "</span>" +
          '<span class="tl-node" aria-hidden="true"></span>' +
          '<span class="tl-label">' + b.label + "</span>" +
          '<span class="tl-desc">' + b.desc + "</span>" +
          "</div>"
        );
      })
      .join("");

    Array.prototype.forEach.call(scheduleEl.querySelectorAll(".tl-stop"), function (stop) {
      stop.addEventListener("click", function () {
        var href = stop.getAttribute("data-href");
        if (href) location.href = href;
      });
    });
  }

  function paintLive() {
    var state = liveState();
    var stops = scheduleEl ? scheduleEl.querySelectorAll(".tl-stop") : [];
    Array.prototype.forEach.call(stops, function (s) { s.classList.remove("is-now"); });

    if (!state) {
      if (liveEl) liveEl.innerHTML = "";
      if (stops[0]) stops[0].classList.remove("is-now");
      return;
    }

    if (state.pre) {
      if (liveEl) {
        liveEl.innerHTML =
          '<a class="live-badge" href="/visit"><span class="breath-dot" aria-hidden="true"></span>' +
          "<b>Starts in " + state.wait + " min</b></a>";
      }
      if (stops[0]) stops[0].classList.add("is-now");
      return;
    }

    var b = state.block;
    var when = state.inside ? "Now, " + b.t + " AM" : "Next, " + b.t + " AM";
    if (liveEl) {
      liveEl.innerHTML =
        '<a class="live-badge" href="' + b.href + '"><span class="breath-dot" aria-hidden="true"></span>' +
        "<b>" + when + '</b> <span class="live-sep">·</span> ' + b.label + "</a>";
    }
    if (stops[state.index]) stops[state.index].classList.add("is-now");
  }

  paintLive();
  setInterval(paintLive, 30000);

  /* Reveal destination cards once, on first view */
  var revealEls = document.querySelectorAll(".hub-tile");
  if (revealEls.length && "IntersectionObserver" in window) {
    revealEls.forEach(function (el) { el.classList.add("hub-reveal"); });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Feature tile cursor shine, pointer devices only */
  var feature = document.querySelector(".hub-tile-feature");
  if (feature && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    feature.addEventListener("pointermove", function (e) {
      var r = feature.getBoundingClientRect();
      feature.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      feature.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  }
})();
