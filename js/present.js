(function () {
  var viewport = document.getElementById("pres-viewport");
  var chaptersEl = document.getElementById("pres-chapters");
  var progressEl = document.getElementById("pres-progress-fill");
  var counterEl = document.getElementById("pres-counter");
  var app = document.getElementById("pres-app");
  var slides = [];
  var index = 0;
  var hideTimer = null;
  var touchX = null;

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

  function hintChips(hints) {
    return hints
      .map(function (h) {
        return '<span class="pres-hint-chip">' + esc(h) + "</span>";
      })
      .join("");
  }

  function visualPanel(image, emoji, alt) {
    return (
      '<div class="pres-visual">' +
      '<img src="' + esc(image) + '" alt="' + esc(alt || "") + '" loading="lazy" />' +
      '<span class="pres-visual-emoji" aria-hidden="true">' + emoji + "</span>" +
      "</div>"
    );
  }

  function pillarIntroSlide(section) {
    return makeSlide(
      "pres-slide-intro",
      '<div class="pres-slide-inner pres-card-layout" style="--pillar-color:' + section.color + '">' +
        visualPanel(section.image, section.emoji, section.pillar) +
        '<div class="pres-card-copy">' +
        '<span class="pres-pillar-badge">' + esc(section.pillarShort) + "</span>" +
        '<h1><span class="pres-emoji-title">' + section.emoji + "</span> " + esc(section.pillar) + "</h1>" +
        '<p class="pres-lead">' + esc(section.intro) + "</p>" +
        '<p class="pres-cue-note">' + section.cards.length + " questions · you talk · screen shows cues</p>" +
        "</div></div>"
    );
  }

  function qaSlide(section, card) {
    return makeSlide(
      "pres-slide-qa",
      '<div class="pres-slide-inner pres-card-layout" style="--pillar-color:' + section.color + '">' +
        visualPanel(card.image, card.emoji, "Visual cue") +
        '<div class="pres-card-copy">' +
        '<p class="pres-tag">' + esc(section.pillarShort) + " · Q" + card.num + "</p>" +
        '<h2 class="pres-qa-q">' + esc(card.question) + "</h2>" +
        '<div class="pres-qa-reveal">' +
        '<p class="pres-qa-label">Talking points</p>' +
        '<div class="pres-hint-row">' + hintChips(card.hints) + "</div>" +
        "</div>" +
        '<button type="button" class="pres-reveal-btn" data-reveal-label="Show cues" data-hide-label="Hide cues">' +
        '<span class="pres-reveal-icon" aria-hidden="true">▶</span> Show cues</button>' +
        '<p class="pres-cue-foot">Full answers in <a href="/packet" target="_blank" rel="noopener">speaker packet</a></p>' +
        "</div></div>"
    );
  }

  function strategicIntroSlide() {
    return makeSlide(
      "pres-slide-intro pres-slide-strategic-intro",
      '<div class="pres-slide-inner pres-card-layout" style="--pillar-color:#6c5ce7">' +
        visualPanel("/assets/companies/therabreath/complete-rinse.jpg", "🎤", "Discussion") +
        '<div class="pres-card-copy">' +
        '<span class="pres-pillar-badge">Your turn</span>' +
        '<h1><span class="pres-emoji-title">🎤</span> Top 10 for TheraBreath</h1>' +
        '<p class="pres-lead">Questions we want to ask you — partnership, not supplier review.</p>' +
        '<p class="pres-cue-note">Tap for a one-line cue on why each matters</p>' +
        "</div></div>"
    );
  }

  function strategicSlide(item) {
    return makeSlide(
      "pres-slide-qa pres-slide-strategic",
      '<div class="pres-slide-inner pres-card-layout" style="--pillar-color:#6c5ce7">' +
        visualPanel(item.image, item.emoji, "Discussion cue") +
        '<div class="pres-card-copy">' +
        '<p class="pres-tag">Ask them · ' + item.num + "/10</p>" +
        '<h2 class="pres-qa-q">' + esc(item.question) + "</h2>" +
        '<div class="pres-qa-reveal">' +
        '<p class="pres-qa-label">Why ask this</p>' +
        '<div class="pres-hint-row single"><span class="pres-hint-chip big">' + esc(item.hint) + "</span></div>" +
        "</div>" +
        '<button type="button" class="pres-reveal-btn strategic" data-reveal-label="Show cue" data-hide-label="Hide">' +
        '<span class="pres-reveal-icon" aria-hidden="true">?</span> Show cue</button>' +
        "</div></div>"
    );
  }

  function buildDynamicSlides() {
    if (!viewport || !window.BOI) return;
    var staticSlides = Array.prototype.slice.call(
      viewport.querySelectorAll(".pres-slide:not(.pres-slide-dynamic)")
    );
    var lakewood = staticSlides[3];
    if (!lakewood) return;

    var frag = document.createDocumentFragment();

    BOI.qaSections.forEach(function (section) {
      var intro = pillarIntroSlide(section);
      intro.classList.add("pres-slide-dynamic");
      frag.appendChild(intro);
      section.cards.forEach(function (card) {
        var slide = qaSlide(section, card);
        slide.classList.add("pres-slide-dynamic");
        frag.appendChild(slide);
      });
    });

    var stratIntro = strategicIntroSlide();
    stratIntro.classList.add("pres-slide-dynamic");
    frag.appendChild(stratIntro);

    BOI.strategicQuestions.forEach(function (item) {
      var slide = strategicSlide(item);
      slide.classList.add("pres-slide-dynamic");
      frag.appendChild(slide);
    });

    viewport.insertBefore(frag, lakewood);

    slides = Array.prototype.slice.call(viewport.querySelectorAll(".pres-slide"));
    slides.forEach(function (s, i) {
      s.dataset.i = String(i);
    });

    buildChaptersFromSlides();
  }

  function buildChaptersFromSlides() {
    if (!window.BOI) return;
    var ch = [];
    var cursor = 0;

    ch.push({ id: "start", label: "Start", slides: [0, 1, 2] });

    BOI.qaSections.forEach(function (section) {
      var ids = [cursor];
      cursor += 1;
      section.cards.forEach(function () {
        ids.push(cursor);
        cursor += 1;
      });
      ch.push({
        id: "pillar-" + section.num,
        label: section.emoji + " " + section.pillar.split(" ")[0],
        slides: ids,
      });
    });

    var stratStart = cursor;
    var stratSlides = [stratStart];
    for (var s = 0; s < BOI.strategicQuestions.length; s++) {
      stratSlides.push(stratStart + 1 + s);
    }
    ch.push({ id: "strategic", label: "🎤 Top 10", slides: stratSlides });
    cursor = stratStart + 1 + BOI.strategicQuestions.length;

    var tail = [];
    for (var t = cursor; t < slides.length; t++) tail.push(t);
    if (tail.length > 1) {
      ch.push({ id: "finish", label: "Finish", slides: tail });
    }

    BOI.chapters = ch;
  }

  function chapterForSlide(i) {
    if (!window.BOI || !BOI.chapters) return null;
    for (var c = 0; c < BOI.chapters.length; c++) {
      if (BOI.chapters[c].slides.indexOf(i) !== -1) return BOI.chapters[c];
    }
    return null;
  }

  function buildChapters() {
    if (!chaptersEl || !BOI.chapters) return;
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

  function isRevealed(slide) {
    return slide && slide.classList.contains("revealed");
  }

  function resetReveal(slide) {
    if (!slide) return;
    slide.classList.remove("revealed");
    var btn = slide.querySelector(".pres-reveal-btn");
    if (!btn) return;
    var icon = slide.classList.contains("pres-slide-strategic") ? "?" : "▶";
    var label = btn.dataset.revealLabel || "Show cues";
    btn.innerHTML = '<span class="pres-reveal-icon" aria-hidden="true">' + icon + "</span> " + label;
  }

  function toggleReveal(slide) {
    if (!slide) return false;
    var btn = slide.querySelector(".pres-reveal-btn");
    var revealing = !slide.classList.contains("revealed");
    slide.classList.toggle("revealed", revealing);
    if (btn) {
      var label = revealing ? btn.dataset.hideLabel : btn.dataset.revealLabel;
      var icon = slide.classList.contains("pres-slide-strategic") ? "?" : revealing ? "▼" : "▶";
      btn.innerHTML = '<span class="pres-reveal-icon" aria-hidden="true">' + icon + "</span> " + label;
    }
    requestAnimationFrame(fitSlide);
    return revealing;
  }

  function bindRevealButtons() {
    slides.forEach(function (slide) {
      var btn = slide.querySelector(".pres-reveal-btn");
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleReveal(slide);
        flashChrome();
      });
    });
  }

  function fitSlide() {
    if (!viewport) return;
    var slide = slides[index];
    if (!slide) return;
    var inner = slide.querySelector(".pres-slide-inner");
    if (!inner) return;
    inner.style.transform = "none";
    var availH = viewport.clientHeight - 8;
    var availW = viewport.clientWidth - 8;
    var scale = Math.min(1, availH / inner.offsetHeight, availW / inner.offsetWidth);
    if (scale < 0.995) inner.style.transform = "scale(" + scale + ")";
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
    requestAnimationFrame(fitSlide);
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function handleAdvance() {
    var slide = slides[index];
    if (isQaSlide(slide) && !isRevealed(slide)) {
      toggleReveal(slide);
      flashChrome();
      return;
    }
    next();
    flashChrome();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
    else document.exitFullscreen();
  }

  function flashChrome() {
    if (!app) return;
    app.classList.remove("fs-chrome-hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (document.fullscreenElement) app.classList.add("fs-chrome-hidden");
    }, 3200);
  }

  function initCanvas() {
    var canvas = document.getElementById("pres-bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var orbs = [
      { x: 0.2, y: 0.3, r: 0.35, c: "0,143,211", s: 0.00015 },
      { x: 0.8, y: 0.7, r: 0.3, c: "95,184,50", s: -0.00012 },
      { x: 0.5, y: 0.85, r: 0.25, c: "108,92,231", s: 0.0001 },
    ];
    var t = 0;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.fillStyle = "#060d18";
      ctx.fillRect(0, 0, w, h);
      orbs.forEach(function (o, i) {
        var ox = (o.x + Math.sin(t * o.s * 1000 + i) * 0.08) * w;
        var oy = (o.y + Math.cos(t * o.s * 1000 + i * 2) * 0.06) * h;
        var rad = o.r * Math.min(w, h);
        var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
        g.addColorStop(0, "rgba(" + o.c + ",0.2)");
        g.addColorStop(1, "rgba(" + o.c + ",0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      t += 0.016;
      requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      next();
      flashChrome();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleAdvance();
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
      if (isQaSlide(slides[index])) toggleReveal(slides[index]);
      flashChrome();
    }
  });

  viewport?.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  viewport?.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) handleAdvance(); else prev();
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
  document.addEventListener("mousemove", flashChrome);

  buildDynamicSlides();
  bindRevealButtons();
  buildChapters();

  var hash = (location.hash || "").match(/^#(\d+)$/);
  initCanvas();
  show(hash ? parseInt(hash[1], 10) - 1 : 0);
  if (document.fonts?.ready) document.fonts.ready.then(fitSlide);
})();