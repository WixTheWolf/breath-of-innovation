(function () {
  var viewport = document.getElementById("pres-viewport");
  var chaptersEl = document.getElementById("pres-chapters");
  var progressEl = document.getElementById("pres-progress-fill");
  var counterEl = document.getElementById("pres-counter");
  var railEl = document.getElementById("pres-rail");
  var bgEl = document.querySelector(".pres-bg");
  var app = document.getElementById("pres-app");
  var railSegs = [];
  var segOfSlide = [];
  var currentSeg = -1;
  var slides = [];
  var index = 0;
  var hideTimer = null;
  var touchX = null;
  var touchY = null;
  var isTouch =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches;

  if (isTouch) {
    document.documentElement.classList.add("pres-touch");
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function makeSlide(className, html) {
    var el = document.createElement("section");
    el.className = "pres-slide" + (className ? " " + className : "");
    el.innerHTML = html;
    return el;
  }

  function bulletList(items) {
    if (!items || !items.length) return "";
    return (
      '<ul class="pres-qa-bullets">' +
      items
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function pillarIntroSlide(section) {
    var pillar = (window.BOI.pillars || []).filter(function (p) {
      return p.num === section.num;
    })[0];
    var pills = pillar
      ? '<div class="pres-pills pres-pills-left">' +
        pillar.points.map(function (pt) { return "<span>" + esc(pt) + "</span>"; }).join("") +
        "</div>"
      : "";
    return makeSlide(
      "pres-slide-intro",
      '<div class="pres-slide-inner" style="--pillar-color:' + section.color + '">' +
        '<div class="pres-slide-pad">' +
        '<span class="pres-pillar-badge">' + esc(section.pillarShort) + "</span>" +
        "<h1>" + esc(section.pillar) + "</h1>" +
        '<p class="pres-lead">' + esc(section.intro) + "</p>" +
        pills +
        '<p class="pres-intro-hint">' + section.cards.length + " questions · tap to reveal key points</p>" +
        "</div></div>"
    );
  }

  function qaSlide(section, card, pos, total, opts) {
    opts = opts || {};
    var extraClass = opts.strategic ? " pres-slide-strategic" : "";
    var tag = opts.strategic
      ? "Strategic · Question " + pos
      : esc(section.pillarShort) + " · Question " + pos + " of " + total;
    var color = opts.strategic ? "#6c5ce7" : section.color;
    var answerClass = opts.strategic ? " pres-qa-answer strategic" : " pres-qa-answer";
    var btnClass = opts.strategic ? " pres-reveal-btn strategic" : " pres-reveal-btn";
    return makeSlide(
      "pres-slide-qa" + extraClass,
      '<div class="pres-slide-inner" style="--pillar-color:' + color + '">' +
        '<div class="pres-slide-pad">' +
        '<p class="pres-tag">' + tag + "</p>" +
        '<div class="pres-qa-stage">' +
        '<p class="pres-qa-label">Question</p>' +
        '<h2 class="pres-qa-q">' + esc(card.question) + "</h2>" +
        '<div class="pres-qa-reveal">' +
        '<p class="pres-qa-label answer">Key points</p>' +
        '<div class="' + answerClass.trim() + '">' + bulletList(card.points) + "</div>" +
        "</div>" +
        '<button type="button" class="' + btnClass.trim() + '" data-reveal-label="Reveal points" data-hide-label="Hide points">' +
        '<span class="pres-reveal-icon" aria-hidden="true">✦</span> Reveal points</button>' +
        "</div></div></div>"
    );
  }

  function agendaSlide() {
    var items = (BOI.schedule || [])
      .map(function (item) {
        var isNow = item.title === "Presentation";
        return (
          '<li class="' + (isNow ? "is-now" : "") + '" style="--accent:' + esc(item.accent || "#008fd3") + '">' +
          "<time>" + esc(item.time) + "</time>" +
          "<div><b>" + esc(item.title) + "</b><span>" + esc(item.desc) + "</span></div></li>"
        );
      })
      .join("");
    return makeSlide(
      "pres-slide-agenda pres-slide-dynamic",
      '<div class="pres-slide-inner"><div class="pres-slide-pad">' +
        '<p class="pres-tag">Your day</p>' +
        "<h1>Where we are in July 8.</h1>" +
        '<p class="pres-lead">Tour done. Now capabilities. Then tasting at 10:30.</p>' +
        '<ul class="pres-agenda">' + items + "</ul>" +
        "</div></div>"
    );
  }

  function facilitySlide() {
    return makeSlide(
      "pres-slide-facility pres-slide-dynamic",
      '<div class="pres-slide-inner"><div class="pres-slide-pad pres-facility">' +
        '<div class="pres-facility-copy">' +
        '<p class="pres-tag">You just walked this</p>' +
        "<h1>From the floor to the conversation.</h1>" +
        '<div class="pres-body">' +
        "<p>You saw production, QC, and the TheraBreath room. This presentation connects what you walked to how we plan, document, and scale.</p>" +
        '<div class="pres-quote">One site in Norco — development, production, and quality under one roof.</div>' +
        "</div></div>" +
        '<figure class="pres-facility-photo">' +
        '<img src="/assets/companies/tff/therabreath-production-room.jpg" alt="TheraBreath production room at The Flavor Factory" width="384" height="512" decoding="async" />' +
        "<figcaption>The Flavor Factory · production room</figcaption></figure>" +
        "</div></div>"
    );
  }

  function handoffSlide() {
    return makeSlide(
      "pres-slide-handoff pres-slide-dynamic",
      '<div class="pres-slide-inner"><div class="pres-slide-pad">' +
        '<p class="pres-tag">What&apos;s next</p>' +
        "<h1>10:30 — blind Flavor Flight.</h1>" +
        '<p class="pres-lead">Five prototypes. Score on your phone. Results live in the room.</p>' +
        '<div class="pres-handoff-grid">' +
        '<a class="pres-handoff-card" href="/taste">' +
        '<span class="pres-handoff-kicker">10:30 AM</span><strong>Tasting</strong><span>Blind samples A–E · score as you go</span></a>' +
        '<a class="pres-handoff-card" href="/portfolio">' +
        '<span class="pres-handoff-kicker">Gallery</span><strong>Flavor portfolio</strong><span>53 SKUs · pipeline · Gen Alpha</span></a>' +
        '<div class="pres-handoff-qr">' +
        '<img src="/assets/qr/score-sm.png" alt="QR code for tasting" width="88" height="88" />' +
        "<span>Scan for tasting</span></div></div>" +
        "</div></div>"
    );
  }

  function strategicIntroSlide() {
    return makeSlide(
      "pres-slide-strategic-intro pres-slide-dynamic",
      '<div class="pres-slide-inner" style="--pillar-color:#6c5ce7"><div class="pres-slide-pad">' +
        '<p class="pres-tag">Your turn</p>' +
        "<h1>Questions for TheraBreath.</h1>" +
        '<p class="pres-lead">Three strategic prompts to shape the partnership conversation. Full list of ten is in your speaker packet.</p>' +
        '<div class="pres-pills pres-pills-left">' +
        "<span>Vision &amp; growth</span><span>Innovation priorities</span><span>Confidence &amp; partnership</span>" +
        "</div>" +
        '<p class="pres-intro-hint">Reveal key points on each — then open the floor.</p>' +
        "</div></div>"
    );
  }

  function buildDynamicSlides() {
    if (!viewport || !window.BOI) return;
    var closeSlide = viewport.querySelector(".pres-slide-close");
    var overviewSlide = viewport.querySelector(".pres-slide-overview");
    var welcomeSlide = viewport.querySelector(".pres-slide-welcome");
    if (!closeSlide || !overviewSlide || !welcomeSlide) return;

    var preOverview = document.createDocumentFragment();
    preOverview.appendChild(agendaSlide());
    preOverview.appendChild(facilitySlide());
    overviewSlide.parentNode.insertBefore(preOverview, overviewSlide);

    var pillarFrag = document.createDocumentFragment();
    BOI.qaSections.forEach(function (section) {
      var intro = pillarIntroSlide(section);
      intro.classList.add("pres-slide-dynamic");
      pillarFrag.appendChild(intro);
      section.cards.forEach(function (card, c) {
        var slide = qaSlide(section, card, c + 1, section.cards.length);
        slide.classList.add("pres-slide-dynamic");
        pillarFrag.appendChild(slide);
      });
    });
    closeSlide.parentNode.insertBefore(pillarFrag, closeSlide);

    var closeFrag = document.createDocumentFragment();
    closeFrag.appendChild(handoffSlide());
    closeFrag.appendChild(strategicIntroSlide());
    var featured = [0, 4, 9];
    (BOI.strategicQuestions || []).forEach(function (card, i) {
      if (featured.indexOf(i) === -1) return;
      var slide = qaSlide(
        { pillarShort: "Strategic", color: "#6c5ce7" },
        card,
        featured.indexOf(i) + 1,
        3,
        { strategic: true }
      );
      slide.classList.add("pres-slide-dynamic");
      closeFrag.appendChild(slide);
    });
    closeSlide.parentNode.insertBefore(closeFrag, closeSlide);

    slides = Array.prototype.slice.call(viewport.querySelectorAll(".pres-slide"));
    slides.forEach(function (s, i) {
      s.dataset.i = String(i);
    });

    buildChaptersFromSlides();
  }

  function buildChaptersFromSlides() {
    if (!window.BOI || !slides.length) return;
    var ch = [];
    var i = 0;

    function take(count, id, label) {
      var ids = [];
      for (var n = 0; n < count && i < slides.length; n++) {
        ids.push(i);
        i += 1;
      }
      if (ids.length) ch.push({ id: id, label: label, slides: ids });
    }

    take(1, "cover", "Cover");
    take(1, "welcome", "Welcome");
    take(2, "today", "Today");
    take(1, "overview", "Overview");

    BOI.qaSections.forEach(function (section) {
      var ids = [i];
      i += 1;
      section.cards.forEach(function () {
        ids.push(i);
        i += 1;
      });
      ch.push({
        id: "pillar-" + section.num,
        label: section.pillarShort.replace("Pillar ", "P"),
        slides: ids,
      });
    });

    var tail = [];
    while (i < slides.length) {
      tail.push(i);
      i += 1;
    }
    if (tail.length) ch.push({ id: "close", label: "Close", slides: tail });

    BOI.chapters = ch;
  }

  function jumpToPillar(num) {
    if (!BOI.chapters) return;
    var ch = BOI.chapters.filter(function (c) {
      return c.id === "pillar-" + num;
    })[0];
    if (ch && ch.slides.length) {
      show(ch.slides[0]);
      flashChrome();
    }
  }

  function bindPillarPicker() {
    Array.prototype.forEach.call(document.querySelectorAll(".pres-pillar-cell[data-pillar]"), function (btn) {
      btn.addEventListener("click", function () {
        jumpToPillar(parseInt(btn.dataset.pillar, 10));
      });
    });
  }

  /* Section rail: Welcome, four pillars, Close */
  function buildRail() {
    if (!railEl || !window.BOI || !BOI.chapters) return;
    var ch = BOI.chapters;
    function byId(id) { return ch.filter(function (c) { return c.id === id; })[0]; }
    var segments = [];
    var intro = [];
    ["cover", "welcome", "today", "overview"].forEach(function (id) {
      var c = byId(id);
      if (c) intro = intro.concat(c.slides);
    });
    segments.push({ label: "Intro", slides: intro });
    ch.forEach(function (c) {
      if (c.id.indexOf("pillar-") === 0) segments.push({ label: c.label, slides: c.slides });
    });
    var close = byId("close");
    if (close) segments.push({ label: "Close", slides: close.slides });

    railEl.innerHTML = "";
    railSegs = [];
    segOfSlide = [];
    segments.forEach(function (seg, si) {
      var el = document.createElement("span");
      el.className = "pres-rail-seg";
      el.title = seg.label;
      railEl.appendChild(el);
      railSegs.push(el);
      seg.slides.forEach(function (sl) { segOfSlide[sl] = si; });
    });
  }

  function updateRail(i) {
    if (!railSegs.length) return;
    var seg = segOfSlide[i];
    if (seg === undefined) seg = 0;
    railSegs.forEach(function (el, si) {
      el.classList.toggle("past", si < seg);
      el.classList.toggle("current", si === seg);
    });
    if (seg !== currentSeg && currentSeg !== -1 && bgEl) {
      bgEl.classList.remove("inhaling");
      void bgEl.offsetWidth;
      bgEl.classList.add("inhaling");
    }
    currentSeg = seg;
  }

  function chapterForSlide(i) {
    if (!window.BOI || !BOI.chapters) return null;
    var ch = BOI.chapters;
    for (var c = 0; c < ch.length; c++) {
      if (ch[c].slides.indexOf(i) !== -1) return ch[c];
    }
    return null;
  }

  function buildChapters() {
    if (!chaptersEl || !window.BOI || !BOI.chapters) return;
    chaptersEl.innerHTML = '<p class="pres-chapters-label">Chapters</p>';
    BOI.chapters.forEach(function (ch) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pres-chapter-btn";
      btn.textContent = ch.label;
      btn.dataset.slide = String(ch.slides[0]);
      btn.addEventListener("click", function () {
        show(parseInt(btn.dataset.slide, 10));
        flashChrome();
      });
      chaptersEl.appendChild(btn);
    });
  }

  function updateChapters() {
    if (!chaptersEl || !BOI.chapters) return;
    var ch = chapterForSlide(index);
    Array.prototype.forEach.call(chaptersEl.querySelectorAll(".pres-chapter-btn"), function (btn) {
      var start = parseInt(btn.dataset.slide, 10);
      var match = ch && BOI.chapters.some(function (c) {
        return c.id === ch.id && c.slides.indexOf(start) !== -1;
      });
      btn.classList.toggle("on", match && start === ch.slides[0]);
    });
  }

  function isQaSlide(slide) {
    return slide && slide.classList.contains("pres-slide-qa");
  }

  function isRevealSlide(slide) {
    return slide && (slide.classList.contains("pres-slide-qa") || slide.classList.contains("pres-slide-strategic"));
  }

  function isRevealed(slide) {
    return slide && slide.classList.contains("revealed");
  }

  function revealLabel(btn, slide, revealing) {
    if (!btn) return;
    var icon = slide.classList.contains("pres-slide-strategic") ? "?" : "✦";
    var label = revealing
      ? btn.dataset.hideLabel
      : isTouch
        ? "Tap to reveal points"
        : btn.dataset.revealLabel || "Reveal points";
    btn.setAttribute("aria-expanded", revealing ? "true" : "false");
    btn.innerHTML =
      '<span class="pres-reveal-icon" aria-hidden="true">' + icon + "</span> " + label;
  }

  function syncRevealHeight(slide) {
    var answer = slide && slide.querySelector(".pres-qa-answer");
    if (!answer) return;
    if (slide.classList.contains("revealed")) {
      answer.style.maxHeight = answer.scrollHeight + 32 + "px";
    } else {
      answer.style.maxHeight = "0px";
    }
  }

  function refitAfterReveal(slide) {
    syncRevealHeight(slide);
    requestAnimationFrame(function () {
      fitSlide();
      requestAnimationFrame(fitSlide);
    });
    window.setTimeout(fitSlide, 580);
  }

  function resetReveal(slide) {
    if (!slide) return;
    slide.classList.remove("revealed");
    var btn = slide.querySelector(".pres-reveal-btn");
    syncRevealHeight(slide);
    revealLabel(btn, slide, false);
  }

  function toggleReveal(slide) {
    if (!slide) return false;
    var btn = slide.querySelector(".pres-reveal-btn");
    var revealing = !slide.classList.contains("revealed");
    slide.classList.toggle("revealed", revealing);
    revealLabel(btn, slide, revealing);
    if (revealing) {
      refitAfterReveal(slide);
    } else {
      syncRevealHeight(slide);
      requestAnimationFrame(fitSlide);
    }
    updateMobileNextLabel();
    return revealing;
  }

  function bindRevealButtons() {
    slides.forEach(function (slide) {
      var btn = slide.querySelector(".pres-reveal-btn");
      var answer = slide.querySelector(".pres-qa-answer");
      if (btn && !btn.dataset.bound) {
        btn.dataset.bound = "1";
        btn.setAttribute("aria-expanded", "false");
        if (isTouch) {
          btn.dataset.revealLabel = "Tap to reveal points";
        }
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          toggleReveal(slide);
          flashChrome();
        });
      }
      if (answer && !answer.dataset.bound) {
        answer.dataset.bound = "1";
        answer.addEventListener("transitionend", function (e) {
          if (e.propertyName !== "max-height") return;
          if (slide === slides[index]) fitSlide();
        });
      }
    });
  }

  function fitSlide() {
    if (!viewport) return;
    var slide = slides[index];
    if (!slide) return;
    var inner = slide.querySelector(".pres-slide-inner");
    if (!inner) return;

    inner.style.transform = "none";
    var availH = viewport.clientHeight - 12;
    var availW = viewport.clientWidth - 12;
    var h = inner.offsetHeight;
    var w = inner.offsetWidth;
    if (!h || !w) return;
    var scale = Math.min(1, availH / h, availW / w);
    inner.style.transform = scale < 0.995 ? "scale(" + scale + ")" : "none";
  }

  function updateMobileNextLabel() {
    var nextBtn = document.getElementById("pres-next");
    if (!nextBtn || !isTouch) return;
    var slide = slides[index];
    nextBtn.textContent =
      isRevealSlide(slide) && !isRevealed(slide) ? "Reveal" : "Next";
  }

  function show(i) {
    if (!slides.length) return;
    var prev = slides[index];
    if (prev && prev !== slides[i]) resetReveal(prev);

    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, n) {
      s.classList.toggle("active", n === index);
      if (n !== index) {
        var inner = s.querySelector(".pres-slide-inner");
        if (inner) inner.style.transform = "none";
      }
    });
    if (progressEl) progressEl.style.width = ((index + 1) / slides.length * 100) + "%";
    if (counterEl) counterEl.textContent = (index + 1) + " / " + slides.length;
    history.replaceState(null, "", "#" + (index + 1));
    updateChapters();
    updateRail(index);
    updateMobileNextLabel();
    requestAnimationFrame(fitSlide);
  }

  function next() {
    show(index + 1);
  }

  function prev() {
    show(index - 1);
  }

  function handleAdvance() {
    var slide = slides[index];
    if (isRevealSlide(slide) && !isRevealed(slide)) {
      toggleReveal(slide);
      flashChrome();
      return;
    }
    next();
    flashChrome();
  }

  function toggleFullscreen() {
    var root = document.documentElement;
    if (!document.fullscreenElement) {
      root.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  }

  function flashChrome() {
    if (!app) return;
    app.classList.remove("fs-chrome-hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (document.fullscreenElement) app.classList.add("fs-chrome-hidden");
    }, 3200);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown" || e.key === "Enter") {
      e.preventDefault();
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        next();
        flashChrome();
      } else {
        handleAdvance();
      }
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
      flashChrome();
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
      flashChrome();
    } else if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1);
      flashChrome();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      if (isRevealSlide(slides[index])) toggleReveal(slides[index]);
      flashChrome();
    }
  });

  viewport?.addEventListener("touchstart", function (e) {
    if (e.target.closest(".pres-reveal-btn")) return;
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });

  viewport?.addEventListener("touchend", function (e) {
    if (touchX == null || touchY == null) return;
    if (e.target.closest(".pres-reveal-btn")) {
      touchX = null;
      touchY = null;
      return;
    }
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    touchY = null;
    var slide = slides[index];

    if (Math.abs(dx) < 36 && Math.abs(dy) < 36) {
      if (isRevealSlide(slide) && !isRevealed(slide)) {
        toggleReveal(slide);
        flashChrome();
      }
      return;
    }

    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < -50) handleAdvance();
    else if (dx > 50) prev();
    flashChrome();
  }, { passive: true });

  document.getElementById("pres-prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.getElementById("pres-next")?.addEventListener("click", function () { handleAdvance(); flashChrome(); });
  document.getElementById("pres-fs")?.addEventListener("click", toggleFullscreen);
  document.querySelector(".pres-hitzone.prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.querySelector(".pres-hitzone.next")?.addEventListener("click", function () { handleAdvance(); flashChrome(); });

  document.addEventListener("fullscreenchange", function () {
    document.documentElement.classList.toggle("pres-fs", !!document.fullscreenElement);
    if (document.fullscreenElement) flashChrome();
    else if (app) app.classList.remove("fs-chrome-hidden");
    requestAnimationFrame(fitSlide);
  });

  window.addEventListener("resize", function () { requestAnimationFrame(fitSlide); });
  window.addEventListener("orientationchange", function () {
    setTimeout(function () { requestAnimationFrame(fitSlide); }, 120);
  });
  document.addEventListener("mousemove", flashChrome);

  /* Keyboard hint shows briefly, then folds to a ? affordance */
  var hintEl = document.getElementById("pres-hint");
  var hintToggle = document.getElementById("pres-hint-toggle");
  var hintTimer = null;
  function foldHint() {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
      if (hintEl) hintEl.classList.add("is-hidden");
    }, 4000);
  }
  if (hintToggle && hintEl) {
    hintToggle.addEventListener("click", function () {
      hintEl.classList.remove("is-hidden");
      foldHint();
    });
  }

  buildDynamicSlides();
  bindRevealButtons();
  bindPillarPicker();
  buildChapters();
  buildRail();

  var hash = (location.hash || "").match(/^#(\d+)$/);
  show(hash ? parseInt(hash[1], 10) - 1 : 0);
  foldHint();

  if (document.fonts?.ready) document.fonts.ready.then(fitSlide);
})();