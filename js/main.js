// Main JavaScript file
console.log("Website loaded successfully!");

// Courses carousel
(function () {
  const track = document.querySelector(".courses-track");
  if (!track) return;

  const prevBtn = document.querySelector('.courses-nav-btn[data-dir="prev"]');
  const nextBtn = document.querySelector('.courses-nav-btn[data-dir="next"]');

  function step() {
    const card = track.querySelector(".course-card");
    if (!card) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.offsetWidth + gap;
  }

  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  prevBtn.addEventListener("click", function () {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", function () {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });

  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  updateButtons();
})();

// Category tabs
(function () {
  const tabs = document.querySelectorAll(".category-tab");
  if (!tabs.length) return;

  const arrowMarkup =
    '<svg class="tab-arrow" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line>' +
    '<polyline points="7 7 17 7 17 17"></polyline></svg>';

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        const arrow = t.querySelector(".tab-arrow");
        if (arrow) arrow.remove();
      });
      tab.classList.add("is-active");
      tab.insertAdjacentHTML("beforeend", arrowMarkup);
    });
  });
})();

// Category question form
(function () {
  const form = document.querySelector(".category-options");
  const btn = document.querySelector(".category-btn");
  const feedback = document.querySelector(".category-feedback");
  if (!form || !btn || !feedback) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const selected = form.querySelector('input[name="bereich"]:checked');
    if (!selected) {
      feedback.textContent = "Bitte wähle zuerst einen Bereich aus.";
      feedback.classList.remove("is-success");
      feedback.classList.add("is-error", "is-visible");
      return;
    }
    feedback.textContent =
      "Super! Wir zeigen dir passende Kurse für „" +
      selected.parentElement.querySelector("span").textContent +
      "“.";
    feedback.classList.remove("is-error");
    feedback.classList.add("is-success", "is-visible");
  });

  form.addEventListener("change", function () {
    feedback.classList.remove("is-visible", "is-error", "is-success");
  });
})();

// Course filters
(function () {
  const filters = document.querySelectorAll(".course-filter");
  if (!filters.length) return;

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      filters.forEach(function (f) {
        f.classList.remove("is-active");
      });
      filter.classList.add("is-active");
    });
  });
})();

// Language switcher (DE / EN)
(function () {
  const STORAGE_KEY = "site-lang";
  const i18nEls = document.querySelectorAll("[data-en]");
  const langSwitch = document.querySelector(".lang-switch");
  if (!i18nEls.length) return;

  function firstTextNode(el) {
    for (let i = 0; i < el.childNodes.length; i++) {
      const node = el.childNodes[i];
      if (node.nodeType === 3 && node.textContent.trim() !== "") return node;
    }
    return null;
  }

  // Capture the German originals once
  i18nEls.forEach(function (el) {
    el._i18nNode = firstTextNode(el);
    el._i18nDe = el._i18nNode ? el._i18nNode.textContent : el.textContent;
  });

  function applyLang(lang) {
    i18nEls.forEach(function (el) {
      const value = lang === "en" ? el.getAttribute("data-en") : el._i18nDe;
      if (el._i18nNode) el._i18nNode.textContent = value;
      else el.textContent = value;
    });
    document.documentElement.lang = lang;
    const code = langSwitch && langSwitch.querySelector(".lang-code");
    if (code) code.textContent = lang === "en" ? "DE" : "EN";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  let current = "de";
  try {
    current = localStorage.getItem(STORAGE_KEY) || "de";
  } catch (e) {}
  applyLang(current);

  function toggle() {
    current = current === "en" ? "de" : "en";
    applyLang(current);
  }

  if (langSwitch) {
    langSwitch.style.cursor = "pointer";
    langSwitch.addEventListener("click", toggle);
    langSwitch.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }
})();

// GSAP — hero load-in, mouse parallax, scroll reveals
(function () {
  if (typeof window.gsap === "undefined") return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // --- Hero load-in timeline ---
  if (!reduceMotion) {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.85 },
    });
    tl.from(".hero-content-left h1", { y: 40, opacity: 0 })
      .from(".hero-content-left p", { y: 30, opacity: 0 }, "-=0.6")
      .from(".hero-actions", { y: 24, opacity: 0 }, "-=0.6")
      .from(".hero-circle", { scale: 0.5, opacity: 0, duration: 1.1 }, "-=0.7")
      .from(".hero-img", { y: 60, opacity: 0, duration: 1 }, "-=0.95")
      .from(
        ".hero-badge",
        { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(1.7)" },
        "-=0.45"
      )
      .from(".hero-card-community", { x: 60, opacity: 0 }, "-=0.5")
      .from(".hero-card-students", { x: -60, opacity: 0 }, "-=0.65");
  }

  // --- Hero mouse parallax (desktop only) ---
  const heroVisual = document.querySelector(".hero-visual");
  if (
    heroVisual &&
    !reduceMotion &&
    window.matchMedia("(min-width: 1100px)").matches
  ) {
    const layers = [
      { sel: ".hero-circle", depth: 16 },
      { sel: ".hero-img", depth: 8 },
      { sel: ".hero-badge", depth: 38 },
      { sel: ".hero-card-community", depth: 26 },
      { sel: ".hero-card-students", depth: 30 },
    ];
    heroVisual.addEventListener("mousemove", function (e) {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      layers.forEach(function (layer) {
        gsap.to(layer.sel, {
          x: -px * layer.depth,
          y: -py * layer.depth,
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
    heroVisual.addEventListener("mouseleave", function () {
      layers.forEach(function (layer) {
        gsap.to(layer.sel, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
  }

  // --- Scroll reveals (a distinct motion per section) ---
  if (typeof window.ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Each entry: a different entrance per group.
  const reveals = [
    // Section 2 — heading rises, partner labels pop, quality logos drop in
    { sel: ".section2 h2", from: { opacity: 0, y: 44 } },
    {
      sel: ".section2 .label",
      from: { opacity: 0, scale: 0.6 },
      ease: "back.out(1.6)",
      stagger: 0.07,
    },
    { sel: ".section2 .logo", from: { opacity: 0, y: -34 }, stagger: 0.12 },

    // Section 3 — heading slides from left, course cards glide in from right
    { sel: ".section3 h2", from: { opacity: 0, x: -56 } },
    { sel: ".section3 .courses-panel-label", from: { opacity: 0, y: 20 } },
    {
      sel: ".section3 .course-card",
      from: { opacity: 0, x: 90 },
      stagger: 0.12,
    },

    // Section 4 — tabs sweep from the left, card scales up
    { sel: ".section4 h2", from: { opacity: 0, y: 44 } },
    {
      sel: ".section4 .category-tab",
      from: { opacity: 0, x: -44 },
      stagger: 0.08,
    },
    {
      sel: ".section4 .category-card",
      from: { opacity: 0, scale: 0.9, y: 30 },
    },

    // Section 5 — filters pop, course cards rise with a slight tilt
    { sel: ".section5 h2", from: { opacity: 0, y: 44 } },
    { sel: ".section5 .section-intro", from: { opacity: 0, y: 24 } },
    {
      sel: ".section5 .course-filter",
      from: { opacity: 0, scale: 0.7 },
      ease: "back.out(1.6)",
      stagger: 0.07,
    },
    {
      sel: ".section5 .course5-card",
      from: { opacity: 0, y: 80, rotation: -4 },
      stagger: 0.12,
    },
    { sel: ".section5 .show-all-link", from: { opacity: 0, y: 20 } },

    // Section 6 — heading + intro rise (steps handled separately below)
    { sel: ".section6 h2", from: { opacity: 0, y: 44 } },
    { sel: ".section6 .section-intro", from: { opacity: 0, y: 24 } },

    // Section 7 — banner scales in, the two promos slide in from opposite sides
    {
      sel: ".section7 .cert-banner",
      from: { opacity: 0, scale: 0.93 },
      ease: "back.out(1.3)",
    },
    { sel: ".section7 .tutor-promo", from: { opacity: 0, x: -80 } },
    { sel: ".section7 .tutor-steps-block", from: { opacity: 0, x: 80 } },

    // Section 8 — benefits push up one by one
    {
      sel: ".section8 .tutor-benefit",
      from: { opacity: 0, y: 64 },
      stagger: 0.14,
    },

    // Section 9 — featured slides from left, grid cards scale in
    { sel: ".section9 .blog-header", from: { opacity: 0, y: 30 } },
    { sel: ".section9 .blog-featured", from: { opacity: 0, x: -80 } },
    {
      sel: ".section9 .blog-card",
      from: { opacity: 0, scale: 0.82 },
      ease: "back.out(1.5)",
      stagger: 0.12,
    },

    // Footer
    { sel: ".site-footer .footer-top", from: { opacity: 0, y: 40 } },
    { sel: ".site-footer .footer-bottom", from: { opacity: 0, y: 20 } },
  ];

  const NEUTRAL = { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 };

  reveals.forEach(function (cfg) {
    const items = gsap.utils.toArray(cfg.sel);
    if (!items.length) return;

    if (reduceMotion) {
      gsap.set(items, NEUTRAL);
      return;
    }

    gsap.set(items, cfg.from);
    ScrollTrigger.batch(items, {
      start: "top 88%",
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: cfg.ease || "power3.out",
          stagger: cfg.stagger || 0,
          overwrite: true,
        });
      },
    });
  });

  // Section 6 timeline — steps slide in from the side they sit on
  gsap.utils.toArray(".section6 .timeline-step").forEach(function (step) {
    const fromX = step.classList.contains("step-right") ? 90 : -90;
    if (reduceMotion) {
      gsap.set(step, NEUTRAL);
      return;
    }
    gsap.set(step, { opacity: 0, x: fromX });
    ScrollTrigger.create({
      trigger: step,
      start: "top 85%",
      onEnter: function () {
        gsap.to(step, {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          overwrite: true,
        });
      },
    });
  });
})();
