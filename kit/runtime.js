// Kit motion runtime — inlined into every generated composition.
// Elements declare motion with attributes; this file turns them into one
// paused, seek-safe GSAP timeline. Times are composition-local seconds.
//
//   data-in="pop" data-at="3.2"            entrance preset at 3.2 s
//   data-out="fade" data-out-at="7.9"      exit preset
//   data-fx='[{"at":4,"dur":0.6,"to":{"rotation":30},"ease":"power2.inOut"}]'
//   data-count='{"at":2,"dur":1.2,"from":0,"to":95,"dec":0,"suffix":"%"}'
//   section.kit-scene[data-s][data-e][data-tin][data-tout]  scene transitions
//
// Hand-written custom scenes use the same attributes, so they stay
// deterministic and inherit the style without touching this file.
(function () {
  var ID = "__ID__";
  var hosts = document.querySelectorAll('[data-composition-id="' + ID + '"]');
  var root = hosts[hosts.length - 1];
  var tl = gsap.timeline({ paused: true });
  var num = function (v, d) { var n = parseFloat(v); return isFinite(n) ? n : d; };

  var IN = {
    pop: function (el, t) { tl.fromTo(el, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.9)" }, t); },
    rise: function (el, t) { tl.fromTo(el, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }, t); },
    drop: function (el, t) { tl.fromTo(el, { opacity: 0, y: -420, rotation: -6 }, { opacity: 1, y: 0, rotation: 0, duration: 0.75, ease: "back.out(1.4)" }, t); },
    blur: function (el, t) { tl.fromTo(el, { opacity: 0, filter: "blur(14px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power2.out" }, t); },
    word: function (el, t) { tl.fromTo(el, { opacity: 0, y: 26, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.32, ease: "expo.out" }, t); },
    slam: function (el, t) { tl.fromTo(el, { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: 0.34, ease: "power4.out" }, t); },
    stamp: function (el, t) { tl.fromTo(el, { opacity: 0, scale: 3, rotation: -28 }, { opacity: 1, scale: 1, rotation: -9, duration: 0.3, ease: "power4.out" }, t); },
    wipe: function (el, t) { tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" }, t); },
    wipeup: function (el, t) { tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" }, t); },
    left: function (el, t) { tl.fromTo(el, { opacity: 0, x: -300 }, { opacity: 1, x: 0, duration: 0.65, ease: "expo.out" }, t); },
    right: function (el, t) { tl.fromTo(el, { opacity: 0, x: 300 }, { opacity: 1, x: 0, duration: 0.65, ease: "expo.out" }, t); },
    grow: function (el, t, d) { tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: num(d.dur, 0.55), ease: d.ease || "power3.inOut" }, t); },
    growy: function (el, t, d) { tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: num(d.dur, 0.55), ease: d.ease || "power3.out" }, t); },
    zoom: function (el, t) { tl.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }, t); },
    spin: function (el, t) { tl.fromTo(el, { opacity: 0, scale: 0, rotation: -160 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.6)" }, t); },
    fade: function (el, t) { tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, t); },
    draw: function (el, t, d) { tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: num(d.dur, 0.6), ease: "power2.inOut" }, t); },
    type: function (el, t, d) {
      var chars = el.querySelectorAll(".ch");
      var each = Math.min(0.045, num(d.dur, chars.length * 0.035) / Math.max(1, chars.length));
      tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: each, ease: "none" }, t);
    },
  };

  var OUT = {
    fade: function (el, t) { tl.to(el, { opacity: 0, duration: 0.25, ease: "power1.in" }, t); },
    blur: function (el, t) { tl.to(el, { opacity: 0, filter: "blur(12px)", duration: 0.22, ease: "power2.in" }, t); },
    fall: function (el, t) { tl.to(el, { opacity: 0, y: 420, rotation: 24, duration: 0.6, ease: "power3.in" }, t); },
    up: function (el, t) { tl.to(el, { opacity: 0, y: -120, duration: 0.4, ease: "power3.in" }, t); },
    shrink: function (el, t) { tl.to(el, { opacity: 0, scale: 0.3, duration: 0.35, ease: "power3.in" }, t); },
    dim: function (el, t) { tl.to(el, { opacity: 0.28, duration: 0.3, ease: "power1.inOut" }, t); },
  };

  // Scene transitions act on .stage (never on the timed section itself).
  var TIN = {
    cut: function () {},
    whip: function (st, t) { tl.fromTo(st, { x: 1920, filter: "blur(18px)" }, { x: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.inOut" }, t); },
    rise: function (st, t) { tl.fromTo(st, { y: 1080 }, { y: 0, duration: 0.6, ease: "power3.inOut" }, t); },
    zoom: function (st, t) { tl.fromTo(st, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.55, ease: "expo.out" }, t + 0.12); },
    iris: function (st, t, sc) {
      var at = sc.getAttribute("data-iris") || "50% 50%";
      tl.fromTo(st, { clipPath: "circle(0% at " + at + ")" }, { clipPath: "circle(120% at " + at + ")", duration: 0.7, ease: "power2.inOut" }, t);
    },
    flood: function (st, t, sc) {
      var bar = sc.querySelector(".tr-bar");
      tl.fromTo(bar, { xPercent: -101 }, { xPercent: 0, duration: 0.3, ease: "power3.in" }, t);
      tl.fromTo(st, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t + 0.3);
      tl.to(bar, { xPercent: 101, duration: 0.4, ease: "power3.out" }, t + 0.31);
    },
  };
  var TOUT = {
    whip: function (st, t) { tl.to(st, { x: -1920, filter: "blur(18px)", duration: 0.5, ease: "power3.inOut" }, t); },
    rise: function (st, t) { tl.to(st, { y: -1080, duration: 0.6, ease: "power3.inOut" }, t); },
    zoom: function (st, t) { tl.to(st, { opacity: 0, scale: 0.7, duration: 0.3, ease: "power3.in" }, t); },
  };

  root.querySelectorAll(".kit-scene").forEach(function (sc) {
    var st = sc.querySelector(".stage");
    var s = num(sc.getAttribute("data-s"), 0);
    var next = num(sc.getAttribute("data-next"), NaN);
    (TIN[sc.getAttribute("data-tin")] || TIN.cut)(st, s, sc);
    var out = TOUT[sc.getAttribute("data-tout")];
    if (out && isFinite(next)) out(st, next, sc);
  });

  root.querySelectorAll("[data-in]").forEach(function (el) {
    var f = IN[el.getAttribute("data-in")];
    if (f) f(el, num(el.getAttribute("data-at"), 0), el.dataset);
  });
  root.querySelectorAll("[data-count]").forEach(function (el) {
    var c = JSON.parse(el.getAttribute("data-count"));
    var o = { v: c.from || 0 };
    var paint = function () { el.textContent = (c.prefix || "") + o.v.toFixed(c.dec || 0) + (c.suffix || ""); };
    paint();
    tl.to(o, { v: c.to, duration: c.dur || 1, ease: c.ease || "power2.out", onUpdate: paint }, c.at);
  });
  root.querySelectorAll("[data-fx]").forEach(function (el) {
    JSON.parse(el.getAttribute("data-fx")).forEach(function (k) {
      if (k.from) tl.fromTo(el, k.from, Object.assign({ duration: k.dur || 0.5, ease: k.ease || "power3.inOut" }, k.to), k.at);
      else tl.to(el, Object.assign({ duration: k.dur || 0.5, ease: k.ease || "power3.inOut" }, k.to), k.at);
    });
  });
  root.querySelectorAll("[data-out]").forEach(function (el) {
    var f = OUT[el.getAttribute("data-out")];
    if (f) f(el, num(el.getAttribute("data-out-at"), 0));
  });

  window.__timelines = window.__timelines || {};
  window.__timelines[ID] = tl;
})();
