(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".pres-slide"));
  var chaptersEl = document.getElementById("pres-chapters");
  var progressEl = document.getElementById("pres-progress-fill");
  var counterEl = document.getElementById("pres-counter");
  var app = document.getElementById("pres-app");
  var viewport = document.getElementById("pres-viewport");
  var index = 0;
  var hideTimer = null;
  var touchX = null;

  function chapterForSlide(i) {
    if (!window.BOI) return null;
    var ch = BOI.chapters;
    for (var c = 0; c < ch.length; c++) {
      if (ch[c].slides.indexOf(i) !== -1) return ch[c];
    }
    return null;
  }

  function buildChapters() {
    if (!chaptersEl || !window.BOI) return;
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
    if (!chaptersEl) return;
    var ch = chapterForSlide(index);
    Array.prototype.forEach.call(chaptersEl.querySelectorAll(".pres-chapter-btn"), function (btn) {
      var start = parseInt(btn.dataset.slide, 10);
      var match = ch && BOI.chapters.some(function (c) {
        return c.id === ch.id && c.slides.indexOf(start) !== -1;
      });
      btn.classList.toggle("on", match && start === ch.slides[0]);
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
    var h = inner.offsetHeight;
    var w = inner.offsetWidth;
    var scale = Math.min(1, availH / h, availW / w);
    if (scale < 0.995) {
      inner.style.transform = "scale(" + scale + ")";
    }
  }

  function show(i) {
    if (!slides.length) return;
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

  /* Ambient canvas */
  function initCanvas() {
    var canvas = document.getElementById("pres-bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var orbs = [
      { x: 0.2, y: 0.3, r: 0.35, c: "0,143,211", s: 0.00015 },
      { x: 0.8, y: 0.7, r: 0.3, c: "95,184,50", s: -0.00012 },
      { x: 0.5, y: 0.85, r: 0.25, c: "245,130,32", s: 0.0001 },
    ];
    var t = 0;
    var raf = 0;

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
        g.addColorStop(0, "rgba(" + o.c + ",0.18)");
        g.addColorStop(1, "rgba(" + o.c + ",0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      t += 0.016;
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
      flashChrome();
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
    if (dx < 0) next(); else prev();
    flashChrome();
  }, { passive: true });

  document.getElementById("pres-prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.getElementById("pres-next")?.addEventListener("click", function () { next(); flashChrome(); });
  document.getElementById("pres-fs")?.addEventListener("click", toggleFullscreen);
  document.querySelector(".pres-hitzone.prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.querySelector(".pres-hitzone.next")?.addEventListener("click", function () { next(); flashChrome(); });

  document.addEventListener("fullscreenchange", function () {
    document.documentElement.classList.toggle("pres-fs", !!document.fullscreenElement);
    if (document.fullscreenElement) flashChrome();
    else if (app) app.classList.remove("fs-chrome-hidden");
    requestAnimationFrame(fitSlide);
  });

  window.addEventListener("resize", function () { requestAnimationFrame(fitSlide); });
  document.addEventListener("mousemove", flashChrome);

  var hash = (location.hash || "").match(/^#(\d+)$/);
  buildChapters();
  initCanvas();
  show(hash ? parseInt(hash[1], 10) - 1 : 0);

  if (document.fonts?.ready) document.fonts.ready.then(fitSlide);
})();