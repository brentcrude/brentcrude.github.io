/* Rotating project panel — no dependencies, no build step. */
(function () {
  "use strict";

  var PANEL = document.getElementById("panel");
  var STAGE = document.getElementById("stage");
  var DOTS = document.getElementById("dots");
  var PREV = document.getElementById("prev");
  var NEXT = document.getElementById("next");
  var PLAY = document.getElementById("playPause");
  var INDEX = document.getElementById("pIndex");
  var TOTAL = document.getElementById("pTotal");
  var PROGRESS = document.getElementById("progress");
  var PAUSE_NOTE = document.getElementById("rotatorNote");
  var projects = window.PROJECTS || [];

  if (!PANEL || !STAGE || !projects.length) return;

  var ROTATE_MS = 7000;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = 0;
  var timer = null;
  var autoplay = !reduceMotion;
  var hovered = false;

  var pad = function (n) {
    return n < 10 ? "0" + n : String(n);
  };

  /* ---- build slides ---- */
  var slides = projects.map(function (p, i) {
    var article = document.createElement("article");
    article.className = "slide";
    article.id = "slide-" + i;
    article.setAttribute("role", "tabpanel");
    article.setAttribute("aria-label", p.name);
    article.hidden = i !== 0;

    var rail = document.createElement("div");
    rail.className = "slide-rail";

    var idx = document.createElement("span");
    idx.className = "idx";
    idx.setAttribute("aria-hidden", "true");
    idx.textContent = pad(i + 1);

    var status = document.createElement("span");
    status.className = "status status--" + (p.status || "active");
    var dot = document.createElement("i");
    dot.setAttribute("aria-hidden", "true");
    status.appendChild(dot);
    status.appendChild(document.createTextNode(p.statusLabel || "Active"));

    rail.appendChild(idx);
    rail.appendChild(status);

    var body = document.createElement("div");
    body.className = "slide-body";

    var h3 = document.createElement("h3");
    h3.textContent = p.name;
    body.appendChild(h3);

    var blurb = document.createElement("p");
    blurb.className = "lede";
    blurb.textContent = p.blurb;
    body.appendChild(blurb);

    if (p.tags && p.tags.length) {
      var tags = document.createElement("ul");
      tags.className = "tags";
      p.tags.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        tags.appendChild(li);
      });
      body.appendChild(tags);
    }

    var links = document.createElement("div");
    links.className = "slide-links";
    if (p.href) {
      var a = document.createElement("a");
      a.className = "link-arrow";
      a.href = p.href;
      a.rel = "noopener";
      a.target = "_blank";
      a.textContent = p.linkLabel || "Source";
      var arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = " \u2197";
      a.appendChild(arrow);
      links.appendChild(a);
    } else {
      var priv = document.createElement("span");
      priv.className = "not-public";
      priv.textContent = "In private development";
      links.appendChild(priv);
    }
    body.appendChild(links);

    article.appendChild(rail);
    article.appendChild(body);
    return article;
  });

  /* ---- build dots ---- */
  var dots = projects.map(function (p, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "slide-" + i);
    b.setAttribute("aria-label", "Show " + p.name);
    b.addEventListener("click", function () {
      go(i, true);
    });
    return b;
  });

  if (DOTS) {
    dots.forEach(function (d) {
      DOTS.appendChild(d);
    });
  }

  slides.forEach(function (s) {
    STAGE.appendChild(s);
  });
  if (TOTAL) TOTAL.textContent = pad(projects.length);

  /* ---- render ---- */
  function go(i, userDriven) {
    var target = (i + projects.length) % projects.length;
    /* keeps roving tabindex honest when arrows are used from a dot */
    var focusOnDot = dots.indexOf(document.activeElement) !== -1;
    slides[current].hidden = true;
    slides[current].classList.remove("is-active");
    dots[current].setAttribute("aria-selected", "false");
    dots[current].tabIndex = -1;

    current = target;

    slides[current].hidden = false;
    slides[current].classList.add("is-active");
    dots[current].setAttribute("aria-selected", "true");
    dots[current].tabIndex = 0;
    if (INDEX) INDEX.textContent = pad(current + 1);
    if (focusOnDot) dots[current].focus();

    restartProgress();
    if (userDriven) {
      /* A deliberate click means the reader wants to drive: stop the clock. */
      setAutoplay(false, true);
    }
  }

  function next() {
    go(current + 1, false);
  }

  function prev() {
    go(current - 1, false);
  }

  /* ---- progress bar doubles as the slide clock ---- */
  function restartProgress() {
    if (!PROGRESS || reduceMotion) return;
    PROGRESS.style.animation = "none";
    void PROGRESS.offsetWidth; /* force reflow so the animation restarts */
    if (autoplay) {
      PROGRESS.style.animation = "sweep " + ROTATE_MS + "ms linear forwards";
    }
  }

  function tick() {
    if (!autoplay || hovered || document.hidden) return;
    next();
  }

  function startClock() {
    stopClock();
    if (!autoplay) return;
    timer = window.setInterval(tick, ROTATE_MS);
    restartProgress();
  }

  function stopClock() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (PROGRESS) {
      PROGRESS.style.animation = "none";
      PROGRESS.style.width = "0";
    }
  }

  function setAutoplay(on, announce) {
    autoplay = on;
    if (PLAY) {
      PLAY.setAttribute("aria-pressed", on ? "false" : "true");
      PLAY.setAttribute("aria-label", on ? "Pause auto-rotation" : "Resume auto-rotation");
      PLAY.classList.toggle("is-paused", !on);
      /* glyph: pause bars when running, triangle when stopped */
      PLAY.textContent = on ? "\u275A\u275A" : "\u25B6";
    }
    if (on) {
      startClock();
    } else {
      stopClock();
    }
    if (announce && PAUSE_NOTE) {
      PAUSE_NOTE.textContent = on ? "" : "Auto-rotation paused.";
    }
  }

  /* ---- controls ---- */
  if (NEXT)
    NEXT.addEventListener("click", function () {
      go(current + 1, true);
    });
  if (PREV)
    PREV.addEventListener("click", function () {
      go(current - 1, true);
    });
  if (PLAY)
    PLAY.addEventListener("click", function () {
      setAutoplay(!autoplay, true);
    });

  /* ---- pause while the reader is inspecting it ---- */
  function hold() {
    hovered = true;
    if (PROGRESS) PROGRESS.style.animationPlayState = "paused";
  }

  /* Resume by restarting the cycle, so the bar and the clock stay in step. */
  function release() {
    hovered = false;
    if (autoplay && !document.hidden) startClock();
  }

  PANEL.addEventListener("mouseenter", hold);
  PANEL.addEventListener("mouseleave", release);
  PANEL.addEventListener("focusin", hold);
  PANEL.addEventListener("focusout", release);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) hold();
    else release();
  });

  /* ---- keyboard ---- */
  PANEL.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(current + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(current - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      go(projects.length - 1, true);
    }
  });

  /* ---- touch ---- */
  var startX = null;
  STAGE.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  STAGE.addEventListener(
    "touchend",
    function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 45) return;
      go(current + (dx < 0 ? 1 : -1), true);
    },
    { passive: true }
  );

  /* ---- init ---- */
  slides[0].classList.add("is-active");
  dots[0].setAttribute("aria-selected", "true");
  dots.forEach(function (d, i) {
    d.tabIndex = i === 0 ? 0 : -1;
  });
  if (reduceMotion) {
    setAutoplay(false, false);
  } else {
    setAutoplay(true, false);
  }
})();
