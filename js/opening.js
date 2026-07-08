/**
 * The opening sequence. A ten second cinematic before the deck:
 * the screen is dark, flavor particles drift in, glass pipes light
 * up, the particles flow through them and converge onto the five
 * colored dots of the actual Flavor Factory logo as it materializes,
 * and the tagline fades in. Any key or tap skips. Reduced motion
 * skips the whole sequence. Runs only when the deck starts at the
 * cover, never on deep links.
 */
(function () {
  var root = document.getElementById("boi-open");
  if (!root) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hash = (location.hash || "").match(/^#(\d+)$/);
  if (reduced || (hash && parseInt(hash[1], 10) > 1)) {
    root.remove();
    return;
  }

  var canvas = document.getElementById("boi-open-canvas");
  var logoImg = root.querySelector(".boi-open-logo img");
  if (!canvas || !logoImg) { root.remove(); return; }

  root.hidden = false;
  var ctx = canvas.getContext("2d");
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var W = 0, H = 0;

  function size() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  /* The five dots of the real logo, measured from the artwork,
     as fractions of the rendered image box. */
  var DOTS = [
    { x: 0.467, y: 0.09, color: "#9028ab" },
    { x: 0.494, y: 0.29, color: "#f07c0a" },
    { x: 0.463, y: 0.47, color: "#fbc132" },
    { x: 0.500, y: 0.71, color: "#43a047" },
    { x: 0.464, y: 0.91, color: "#d8463b" },
  ];

  function dotTargets() {
    var r = logoImg.getBoundingClientRect();
    return DOTS.map(function (d) {
      return { x: r.left + d.x * r.width, y: r.top + d.y * r.height, color: d.color };
    });
  }

  /* One elegant glass pipe per dot: a cubic bezier from off screen. */
  function buildPipes() {
    var targets = dotTargets();
    return targets.map(function (t, i) {
      var fromLeft = i % 2 === 0;
      var p0 = { x: fromLeft ? -60 : W + 60, y: H * (0.12 + 0.76 * Math.random()) };
      var p1 = { x: fromLeft ? W * 0.26 : W * 0.74, y: H * (0.06 + 0.88 * Math.random()) };
      var p2 = { x: fromLeft ? W * 0.42 : W * 0.58, y: t.y + (Math.random() - 0.5) * H * 0.3 };
      return { p0: p0, p1: p1, p2: p2, p3: { x: t.x, y: t.y }, color: t.color };
    });
  }

  function bez(p, t) {
    var u = 1 - t;
    return {
      x: u*u*u*p.p0.x + 3*u*u*t*p.p1.x + 3*u*t*t*p.p2.x + t*t*t*p.p3.x,
      y: u*u*u*p.p0.y + 3*u*u*t*p.p1.y + 3*u*t*t*p.p2.y + t*t*t*p.p3.y,
    };
  }

  var pipes = buildPipes();

  /* Particles: drifters that later board a pipe and flow to its dot */
  var COLORS = ["#9028ab", "#f07c0a", "#fbc132", "#43a047", "#d8463b", "#4fd1c5", "#008fd3"];
  var N = 110;
  var parts = [];
  for (var i = 0; i < N; i++) {
    var pipe = i % pipes.length;
    parts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1.6 + Math.random() * 2.6,
      color: Math.random() < 0.55 ? pipes[pipe].color : COLORS[(Math.random() * COLORS.length) | 0],
      pipe: pipe,
      delay: (i / N) * 2400 + Math.random() * 500,
      speed: 1500 + Math.random() * 1300,
      wob: Math.random() * Math.PI * 2,
      arrived: false,
    });
  }

  /* Timeline, ms from start */
  var T_PIPES = 1500;   /* pipes begin to glow */
  var T_FLOW = 1900;    /* particles begin boarding */
  var T_LOGO = 5400;    /* logo materializes */
  var T_TAG = 6900;     /* tagline */
  var T_END = 9400;     /* fade the veil */
  var easeInOut = function (t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; };

  var start = performance.now();
  var raf = null;
  var finished = false;

  function drawPipe(p, alpha, sweepT) {
    ctx.beginPath();
    ctx.moveTo(p.p0.x, p.p0.y);
    ctx.bezierCurveTo(p.p1.x, p.p1.y, p.p2.x, p.p2.y, p.p3.x, p.p3.y);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255," + 0.045 * alpha + ")";
    ctx.lineWidth = 16;
    ctx.stroke();
    ctx.strokeStyle = hexA(p.color, 0.10 * alpha);
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255," + 0.16 * alpha + ")";
    ctx.lineWidth = 1.6;
    ctx.stroke();
    /* a light sweep travelling the tube */
    if (sweepT != null) {
      var a = bez(p, Math.max(0, sweepT - 0.05));
      var b = bez(p, Math.min(1, sweepT));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(255,255,255," + 0.5 * alpha + ")";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  function frame(now) {
    if (finished) return;
    var t = now - start;
    ctx.clearRect(0, 0, W, H);

    /* pipes */
    var pipeAlpha = t < T_PIPES ? 0 : Math.min(1, (t - T_PIPES) / 900);
    if (t > T_LOGO) pipeAlpha *= Math.max(0, 1 - (t - T_LOGO) / 900);
    if (pipeAlpha > 0.01) {
      var sweep = ((t - T_PIPES) % 1800) / 1800;
      pipes.forEach(function (p, i) {
        drawPipe(p, pipeAlpha, (sweep + i * 0.2) % 1);
      });
    }

    /* particles */
    var fadeAll = t > T_LOGO + 700 ? Math.max(0, 1 - (t - T_LOGO - 700) / 900) : 1;
    parts.forEach(function (pt) {
      var alpha = Math.min(1, t / 900) * fadeAll;
      var x, y, r = pt.r;
      var boardAt = T_FLOW + pt.delay;
      if (t < boardAt) {
        pt.x += pt.vx; pt.y += pt.vy;
        pt.wob += 0.02;
        x = pt.x + Math.sin(pt.wob) * 6;
        y = pt.y + Math.cos(pt.wob * 0.8) * 5;
        if (pt.x < -20) pt.x = W + 20; if (pt.x > W + 20) pt.x = -20;
        if (pt.y < -20) pt.y = H + 20; if (pt.y > H + 20) pt.y = -20;
      } else {
        var ft = Math.min(1, (t - boardAt) / pt.speed);
        var e = easeInOut(ft);
        var pos = bez(pipes[pt.pipe], e);
        var perp = Math.sin(pt.wob + e * 14) * 5 * (1 - e);
        x = pos.x + perp;
        y = pos.y + perp * 0.6;
        if (ft >= 1) {
          pt.arrived = true;
          /* tight orbit around the dot, shrinking as the logo lands */
          var k = Math.min(1, (t - boardAt - pt.speed) / 1200);
          var orbit = 8 * (1 - k);
          x = pos.x + Math.cos(pt.wob + t / 240) * orbit;
          y = pos.y + Math.sin(pt.wob + t / 240) * orbit;
          r = pt.r * (1 - 0.5 * k);
        }
      }
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = hexA(pt.color, 0.9 * alpha);
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    /* phase classes for the DOM layers */
    if (t >= T_LOGO) root.classList.add("show-logo");
    if (t >= T_TAG) root.classList.add("show-tag");
    if (t >= T_END) return end();

    raf = requestAnimationFrame(frame);
  }

  function end() {
    if (finished) return;
    finished = true;
    if (raf) cancelAnimationFrame(raf);
    root.classList.add("done");
    document.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", size);
    setTimeout(function () { root.remove(); }, 700);
  }

  function onKey(e) {
    if (finished) return;
    e.preventDefault();
    e.stopPropagation();
    /* F still toggles fullscreen without skipping the sequence */
    if (e.key === "f" || e.key === "F") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen();
      }
      return;
    }
    end();
  }

  document.addEventListener("keydown", onKey, true);
  root.addEventListener("click", end);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) end();
  });

  raf = requestAnimationFrame(frame);
})();
