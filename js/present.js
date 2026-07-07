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
  var mainCount = 0;
  var hideTimer = null;
  var touchX = null;
  var touchY = null;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PARK_KEY = "boi-parking-v1";
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
    var eyebrow = pillar ? esc(section.pillarShort) + " · " + esc(pillar.title) : esc(section.pillarShort);
    /* One signature visual: the flavor journey strip lives on Operations */
    var journey = "";
    if (section.num === 3) {
      var stages = ["Brief", "Bench", "Pilot", "Production", "Shelf"];
      journey =
        '<div class="pres-journey" aria-label="A flavor\'s journey from brief to shelf">' +
        stages
          .map(function (label, si) {
            return (
              '<span class="pres-journey-stage" style="--j:' + si + '">' +
              '<i class="pres-journey-dot"></i>' +
              '<span class="pres-journey-label mono">' + label + "</span></span>"
            );
          })
          .join('<i class="pres-journey-line" aria-hidden="true"></i>') +
        "</div>";
    }
    return makeSlide(
      "pres-slide-intro",
      '<div class="pres-slide-inner" style="--pillar-color:' + section.color + '">' +
        '<div class="pres-slide-pad">' +
        '<span class="pres-pillar-badge">' + eyebrow + "</span>" +
        "<h1>" + esc(section.questionTitle || section.pillar) + "</h1>" +
        '<p class="pres-lead">' + esc(section.intro) + "</p>" +
        journey +
        pills +
        "</div></div>"
    );
  }

  /* Tasting anticipation: the deck's cliffhanger, lives in Innovation */
  function teaseSlide() {
    return makeSlide(
      "pres-slide-tease",
      '<div class="pres-slide-inner" style="--pillar-color:#f58220">' +
        '<div class="pres-slide-pad">' +
        '<p class="pres-tag">10:30 AM · coming up</p>' +
        "<h1>In about 40 minutes, you taste five of these blind.</h1>" +
        '<p class="pres-lead">Samples A to E. Start deciding what you think a next generation mint should be.</p>' +
        '<div class="pres-tease-row">' +
        '<a class="pres-handoff-card" href="/taste">' +
        '<span class="pres-handoff-kicker">On your phone</span><strong>Flavor Flight</strong><span>Blind first, scores live in the room</span></a>' +
        '<div class="pres-handoff-qr">' +
        '<img src="/assets/qr/score-sm.png" alt="QR code for the tasting" width="88" height="88" />' +
        "<span>Scan for tasting</span></div>" +
        "</div></div></div>"
    );
  }

  function qaSlide(section, card, pos, total, opts) {
    opts = opts || {};
    var extraClass = opts.strategic ? " pres-slide-strategic" : "";
    var tag = opts.strategic
      ? "Strategic · Question " + pos
      : opts.appendix
        ? esc(section.pillarShort) + " · Appendix"
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
        "<h1>The shape of your day.</h1>" +
        '<p class="pres-lead">Tour done. Capabilities now. Tasting at 10:30.</p>' +
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
        '<div class="pres-quote">One site in Norco. Development, production, and quality under one roof.</div>' +
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
        "<h1>10:30. The blind Flavor Flight.</h1>" +
        '<p class="pres-lead">Five prototypes. Score on your phone. Results live in the room.</p>' +
        '<div class="pres-handoff-grid">' +
        '<a class="pres-handoff-card" href="/taste">' +
        '<span class="pres-handoff-kicker">10:30 AM</span><strong>Tasting</strong><span>Blind samples A to E · score as you go</span></a>' +
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
        '<p class="pres-lead">Two prompts to shape the partnership conversation. The full list of ten lives in the appendix and the speaker packet.</p>' +
        '<div class="pres-pills pres-pills-left">' +
        "<span>Vision &amp; growth</span><span>Confidence &amp; partnership</span>" +
        "</div>" +
        "</div></div>"
    );
  }

  function discussionSlide(section) {
    return makeSlide(
      "pres-slide-discussion",
      '<div class="pres-slide-inner" style="--pillar-color:' + section.color + '">' +
        '<div class="pres-slide-pad">' +
        '<p class="pres-tag pres-discussion-tag">Your turn · 2 min</p>' +
        '<h1 class="pres-discussion-q">' + esc(section.discussion) + "</h1>" +
        '<p class="pres-discussion-hint">Anyone can start.</p>' +
        '<div class="pres-timer" aria-hidden="true"><i class="pres-timer-fill"></i><span class="pres-timer-count mono"></span></div>' +
        "</div></div>"
    );
  }

  /* Guess then reveal numbers. Values derived from repo data:
     53 = 14 production + 29 presented + 5 pipeline + 5 Gen Alpha (portfolio-data.js),
     40 = Dan's years in flavor (tff-team.js). */
  var STATS = [
    {
      section: 2,
      tag: "Pillar 2 · One number",
      color: "#5fb832",
      question: "How many flavors has TFF put in front of TheraBreath so far?",
      value: 53,
      suffix: "",
      story: "14 in production, 29 presented concepts, 5 in today's flight, 5 Gen Alpha directions. The bench runs deep.",
    },
    {
      section: 4,
      tag: "Pillar 4 · One number",
      color: "#0a1628",
      question: "How many years of flavor experience set the standards here?",
      value: 40,
      suffix: "+",
      story: "Dan has spent more than 40 years in flavor. He is still the first person in the room when a project gets complicated.",
    },
  ];

  function statSlide(stat) {
    return makeSlide(
      "pres-slide-stat",
      '<div class="pres-slide-inner" style="--pillar-color:' + stat.color + '">' +
        '<div class="pres-slide-pad">' +
        '<p class="pres-tag">' + esc(stat.tag) + "</p>" +
        '<div class="pres-qa-stage">' +
        '<h2 class="pres-qa-q">' + esc(stat.question) + "</h2>" +
        '<p class="pres-stat-hint">Take a guess.</p>' +
        '<div class="pres-qa-reveal">' +
        '<div class="pres-qa-answer pres-stat-answer">' +
        '<span class="pres-stat-number mono" data-value="' + stat.value + '" data-suffix="' + esc(stat.suffix) + '">0</span>' +
        '<p class="pres-stat-story">' + esc(stat.story) + "</p>" +
        "</div></div>" +
        '<button type="button" class="pres-reveal-btn" data-reveal-label="Reveal" data-hide-label="Hide">' +
        '<span class="pres-reveal-icon" aria-hidden="true">✦</span> Reveal</button>' +
        "</div></div></div>"
    );
  }

  function appendixCoverSlide() {
    return makeSlide(
      "pres-slide-appendix-cover",
      '<div class="pres-slide-inner"><div class="pres-slide-pad">' +
        '<p class="pres-tag">Appendix</p>' +
        "<h1>Detail on demand.</h1>" +
        '<p class="pres-lead">Backup slides for specific questions. Press A to jump back to the close.</p>' +
        "</div></div>"
    );
  }

  function tagChapter(el, id) {
    el.classList.add("pres-slide-dynamic");
    el.dataset.chapter = id;
    if (id === "appendix") el.classList.add("pres-slide-appendix");
    return el;
  }

  /* Supporting detail lives in the appendix, nothing is deleted.
     Demoted Q&A cards by card.num, plus the facility photo slide and
     the non-featured strategic questions. */
  var APPENDIX_CARDS = { 1: [4, 5], 2: [8], 4: [14] };
  var FEATURED_STRATEGIC = [0, 9];

  function buildDynamicSlides() {
    if (!viewport || !window.BOI) return;
    var closeSlide = viewport.querySelector(".pres-slide-close");
    var overviewSlide = viewport.querySelector(".pres-slide-overview");
    var contrastSlide = viewport.querySelector(".pres-slide-contrast");
    if (!closeSlide || !overviewSlide || !contrastSlide) return;

    var appendixSlides = [];

    overviewSlide.parentNode.insertBefore(tagChapter(agendaSlide(), "today"), overviewSlide);

    var pillarFrag = document.createDocumentFragment();
    BOI.qaSections.forEach(function (section) {
      var demoted = APPENDIX_CARDS[section.num] || [];
      pillarFrag.appendChild(tagChapter(pillarIntroSlide(section), "pillar-" + section.num));
      var kept = section.cards.filter(function (card) {
        return demoted.indexOf(card.num) === -1;
      });
      kept.forEach(function (card, c) {
        pillarFrag.appendChild(
          tagChapter(qaSlide(section, card, c + 1, kept.length), "pillar-" + section.num)
        );
      });
      section.cards.forEach(function (card) {
        if (demoted.indexOf(card.num) === -1) return;
        appendixSlides.push(
          tagChapter(qaSlide(section, card, card.num, 0, { appendix: true }), "appendix")
        );
      });
      STATS.forEach(function (stat) {
        if (stat.section === section.num) {
          pillarFrag.appendChild(tagChapter(statSlide(stat), "pillar-" + section.num));
        }
      });
      if (section.num === 2) {
        pillarFrag.appendChild(tagChapter(teaseSlide(), "pillar-2"));
      }
      pillarFrag.appendChild(tagChapter(discussionSlide(section), "pillar-" + section.num));
    });
    contrastSlide.parentNode.insertBefore(pillarFrag, contrastSlide);

    var closeFrag = document.createDocumentFragment();
    closeFrag.appendChild(tagChapter(handoffSlide(), "close"));
    closeFrag.appendChild(tagChapter(strategicIntroSlide(), "close"));
    var strat = BOI.strategicQuestions || [];
    var extraPos = 0;
    strat.forEach(function (card, i) {
      var fi = FEATURED_STRATEGIC.indexOf(i);
      if (fi !== -1) {
        closeFrag.appendChild(
          tagChapter(
            qaSlide({ pillarShort: "Strategic", color: "#6c5ce7" }, card, fi + 1, FEATURED_STRATEGIC.length, { strategic: true }),
            "close"
          )
        );
      } else {
        extraPos += 1;
        appendixSlides.push(
          tagChapter(
            qaSlide({ pillarShort: "Strategic", color: "#6c5ce7" }, card, extraPos, strat.length - FEATURED_STRATEGIC.length, { strategic: true }),
            "appendix"
          )
        );
      }
    });
    contrastSlide.parentNode.insertBefore(closeFrag, contrastSlide);

    var appFrag = document.createDocumentFragment();
    appFrag.appendChild(tagChapter(appendixCoverSlide(), "appendix"));
    appFrag.appendChild(tagChapter(facilitySlide(), "appendix"));
    appendixSlides.forEach(function (s) {
      appFrag.appendChild(s);
    });
    closeSlide.parentNode.appendChild(appFrag);

    slides = Array.prototype.slice.call(viewport.querySelectorAll(".pres-slide"));
    slides.forEach(function (s, i) {
      s.dataset.i = String(i);
    });

    mainCount = slides.length;
    for (var m = 0; m < slides.length; m++) {
      if (slides[m].dataset.chapter === "appendix") {
        mainCount = m;
        break;
      }
    }

    buildChaptersFromSlides();
  }

  function buildChaptersFromSlides() {
    if (!window.BOI || !slides.length) return;
    var labels = {
      cover: "Cover",
      welcome: "Welcome",
      today: "Today",
      overview: "Overview",
      close: "Close",
      appendix: "Appendix",
    };
    BOI.qaSections.forEach(function (s) {
      labels["pillar-" + s.num] = s.pillarShort.replace("Pillar ", "P");
    });
    var ch = [];
    slides.forEach(function (s, i) {
      var id = s.dataset.chapter || "cover";
      var last = ch[ch.length - 1];
      if (last && last.id === id) last.slides.push(i);
      else ch.push({ id: id, label: labels[id] || id, slides: [i] });
    });
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
    var appendix = byId("appendix");
    if (appendix) segments.push({ label: "Appendix", slides: appendix.slides, appendix: true });

    railEl.innerHTML = "";
    railSegs = [];
    segOfSlide = [];
    segments.forEach(function (seg, si) {
      var el = document.createElement("span");
      el.className = "pres-rail-seg" + (seg.appendix ? " is-appendix" : "");
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
    return (
      slide &&
      (slide.classList.contains("pres-slide-qa") ||
        slide.classList.contains("pres-slide-strategic") ||
        slide.classList.contains("pres-slide-stat"))
    );
  }

  function countUp(el) {
    var target = parseInt(el.dataset.value, 10) || 0;
    var suffix = el.dataset.suffix || "";
    if (reducedMotion) {
      el.textContent = target.toLocaleString("en-US") + suffix;
      return;
    }
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / 900);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US") + (t >= 1 ? suffix : "");
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
    var num = slide.querySelector(".pres-stat-number");
    if (num) num.textContent = "0";
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
      var num = slide.querySelector(".pres-stat-number");
      if (num) countUp(num);
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
    if (prev && prev !== slides[i]) {
      resetReveal(prev);
      if (prev.classList.contains("pres-slide-discussion")) resetTimer();
    }

    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, n) {
      s.classList.toggle("active", n === index);
      if (n !== index) {
        var inner = s.querySelector(".pres-slide-inner");
        if (inner) inner.style.transform = "none";
      }
    });
    var inAppendix = index >= mainCount && mainCount < slides.length;
    if (app) app.classList.toggle("in-appendix", inAppendix);
    if (progressEl) {
      progressEl.style.width = inAppendix ? "100%" : ((index + 1) / mainCount * 100) + "%";
    }
    if (counterEl) {
      counterEl.textContent = inAppendix
        ? "A" + (index - mainCount + 1) + " / A" + (slides.length - mainCount)
        : (index + 1) + " / " + mainCount;
    }
    history.replaceState(null, "", "#" + (index + 1));
    updateChapters();
    updateRail(index);
    updateMobileNextLabel();
    if (slides[index].classList.contains("pres-slide-close")) renderParked();
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

  /* Discussion beat timer. T cycles start, pause, reset. Silent.
     Reduced motion shows a numeric countdown instead of the bar. */
  var TIMER_TOTAL = 120;
  var timer = { state: "idle", remaining: TIMER_TOTAL, raf: null, last: 0 };

  function timerEls() {
    var s = slides[index];
    if (!s || !s.classList.contains("pres-slide-discussion")) return null;
    return {
      bar: s.querySelector(".pres-timer"),
      fill: s.querySelector(".pres-timer-fill"),
      count: s.querySelector(".pres-timer-count"),
    };
  }

  function paintTimer() {
    var els = timerEls();
    if (!els || !els.bar) return;
    els.bar.classList.toggle("numeric", reducedMotion);
    els.bar.classList.toggle("running", timer.state === "running");
    els.bar.classList.toggle("paused", timer.state === "paused");
    els.bar.classList.toggle("done", timer.state === "done");
    if (reducedMotion) {
      var whole = Math.ceil(timer.remaining);
      var m = Math.floor(whole / 60);
      var sec = whole % 60;
      els.count.textContent =
        timer.state === "idle" ? "" : m + ":" + (sec < 10 ? "0" : "") + sec;
    } else if (els.fill) {
      els.fill.style.width = ((1 - timer.remaining / TIMER_TOTAL) * 100) + "%";
    }
  }

  function timerTick(ts) {
    if (timer.state !== "running") return;
    timer.remaining = Math.max(0, timer.remaining - (ts - timer.last) / 1000);
    timer.last = ts;
    paintTimer();
    if (timer.remaining <= 0) {
      timer.state = "done";
      paintTimer();
      return;
    }
    timer.raf = requestAnimationFrame(timerTick);
  }

  function toggleTimer() {
    if (!timerEls()) return;
    if (timer.state === "running") {
      timer.state = "paused";
      cancelAnimationFrame(timer.raf);
    } else if (timer.state === "paused") {
      timer.state = "idle";
      timer.remaining = TIMER_TOTAL;
    } else {
      timer.state = "running";
      timer.remaining = TIMER_TOTAL;
      timer.last = performance.now();
      timer.raf = requestAnimationFrame(timerTick);
    }
    paintTimer();
  }

  function resetTimer() {
    cancelAnimationFrame(timer.raf);
    timer.state = "idle";
    timer.remaining = TIMER_TOTAL;
    Array.prototype.forEach.call(document.querySelectorAll(".pres-timer"), function (bar) {
      bar.classList.remove("running", "paused", "done");
      var fill = bar.querySelector(".pres-timer-fill");
      if (fill) fill.style.width = "0%";
      var count = bar.querySelector(".pres-timer-count");
      if (count) count.textContent = "";
    });
  }

  /* Parking lot. P opens the overlay, Enter saves to localStorage,
     the final discussion slide renders the parked list. */
  var parkEl = document.getElementById("pres-park");
  var parkInput = document.getElementById("pres-park-input");

  function loadParked() {
    try {
      return JSON.parse(localStorage.getItem(PARK_KEY) || "[]");
    } catch (err) {
      return [];
    }
  }

  function saveParked(list) {
    try {
      localStorage.setItem(PARK_KEY, JSON.stringify(list));
    } catch (err) {}
  }

  function closePark() {
    if (parkEl) parkEl.hidden = true;
    if (parkInput) parkInput.blur();
  }

  function togglePark() {
    if (!parkEl) return;
    if (parkEl.hidden) {
      parkEl.hidden = false;
      if (parkInput) {
        parkInput.value = "";
        parkInput.focus();
      }
    } else {
      closePark();
    }
  }

  function renderParked() {
    var host = document.getElementById("pres-parked");
    if (!host) return;
    var list = loadParked();
    if (!list.length) {
      host.innerHTML = "";
      return;
    }
    host.innerHTML =
      '<p class="pres-parked-label mono">Parked from earlier</p>' +
      "<ul>" +
      list.map(function (item) { return "<li>" + esc(item.text) + "</li>"; }).join("") +
      "</ul>" +
      '<button type="button" class="pres-parked-clear mono" id="pres-parked-clear">Clear list</button>';
    var clearBtn = document.getElementById("pres-parked-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        saveParked([]);
        renderParked();
        requestAnimationFrame(fitSlide);
      });
    }
  }

  document.getElementById("pres-park-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = (parkInput && parkInput.value || "").trim();
    if (text) {
      var list = loadParked();
      list.push({ text: text, slide: index + 1 });
      saveParked(list);
    }
    closePark();
    flashChrome();
    if (slides[index] && slides[index].classList.contains("pres-slide-close")) {
      renderParked();
      requestAnimationFrame(fitSlide);
    }
  });

  parkEl?.addEventListener("click", function (e) {
    if (e.target === parkEl) closePark();
  });

  /* Seeded conversation chips on the close slide */
  Array.prototype.forEach.call(document.querySelectorAll(".pres-chip"), function (chip) {
    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      chip.classList.toggle("on");
    });
  });

  function toggleAppendix() {
    if (mainCount >= slides.length) return;
    if (index >= mainCount) show(mainCount - 1);
    else show(mainCount);
  }

  document.addEventListener("keydown", function (e) {
    var tgt = e.target;
    if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePark();
      }
      return;
    }
    if (e.key === "Escape" && parkEl && !parkEl.hidden) {
      closePark();
      return;
    }
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
    } else if (e.key === "t" || e.key === "T") {
      e.preventDefault();
      toggleTimer();
      flashChrome();
    } else if (e.key === "p" || e.key === "P") {
      e.preventDefault();
      togglePark();
    } else if (e.key === "a" || e.key === "A") {
      e.preventDefault();
      toggleAppendix();
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