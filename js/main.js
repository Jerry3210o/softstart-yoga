/* Softstart — nav, reveal, and the stage selector. */
(function () {
  "use strict";

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Tabs across the four stages. Works without JS too: all panels are
     visible until this runs and hides the inactive ones. */
  function initStages() {
    var bar = document.querySelector(".stagebar");
    if (!bar) return;
    var buttons = bar.querySelectorAll("button");
    var panels = document.querySelectorAll(".stage");

    function show(key) {
      panels.forEach(function (p) { p.classList.toggle("is-active", p.dataset.stage === key); });
      buttons.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.stage === key ? "true" : "false"); });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.stage); });
    });

    // Respect a #hash so footer links land on the right stage.
    var hash = (location.hash || "").replace("#", "");
    var known = Array.prototype.some.call(buttons, function (b) { return b.dataset.stage === hash; });
    show(known ? hash : buttons[0].dataset.stage);
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initStages();
    initReveal();
  });
})();
