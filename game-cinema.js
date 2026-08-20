/* =====================================================================
   ANIME LEGENDS — CINEMATIC COMBAT LAYER
   يرفع الإحساس السينمائي للقتال (بدون تغيير منطق القتال الأصلي):
   - زوم بَنش (Zoom Punch) عند الضربات الحرجة والقاضية
   - توقّف لحظي (Hit-Stop) على الضربات القوية
   - خطوط سرعة أنمي + أشرطة سينمائية أثناء الهجوم النهائي
   - اهتزاز شاشة مُدرّج حسب قوة الضربة
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- حقن CSS ---------- */
  var style = document.createElement('style');
  style.textContent = [
    '.b-stage{transform-origin:center 60%;transition:transform .18s cubic-bezier(.2,.9,.3,1)}',
    '.cinema-zoom{transform:scale(1.06) !important}',
    '.cinema-zoom-lg{transform:scale(1.14) !important}',
    '.hitstop{animation-play-state:paused !important}',
    '.speed-lines{position:absolute;inset:0;z-index:19;pointer-events:none;overflow:hidden}',
    '.speed-lines i{position:absolute;top:-20%;height:140%;width:2px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.85),transparent);animation:spdl .5s linear infinite}',
    '@keyframes spdl{from{transform:translateY(-100%)}to{transform:translateY(100%)}}',
    '.letterbox{position:absolute;left:0;right:0;height:9%;background:#000;z-index:22;pointer-events:none}',
    '.letterbox.top{top:0}.letterbox.bot{bottom:0}',
    '.letterbox.on{animation:lbIn .4s cubic-bezier(.2,.9,.3,1) forwards}',
    '@keyframes lbIn{from{height:0}to{height:9%}}',
    '.chromatic{filter:saturate(1.6) contrast(1.15)}'
  ].join('\n');
  document.head.appendChild(style);

  function stage() {
    return document.getElementById('bStage') || (typeof FX !== 'undefined' && FX.layer ? FX.layer() : null);
  }

  var CINEMA = {
    on: true,
    /* زوم بَنش — يتقلص بسرعة ويعود */
    zoomPunch(level) {
      var st = stage(); if (!st || !this.on) return;
      var cls = level === 'lg' ? 'cinema-zoom-lg' : 'cinema-zoom';
      st.classList.add(cls);
      setTimeout(function () { st.classList.remove(cls); }, 200);
    },
    /* توقّت لحظي (Hit-Stop) */
    hitStop(ms) {
      var st = stage(); if (!st || !this.on) return;
      st.classList.add('hitstop');
      setTimeout(function () { st.classList.remove('hitstop'); }, ms || 90);
    },
    /* خطوط سرعة أنمي */
    speedLines(dur) {
      var st = stage(); if (!st || !this.on) return;
      var sl = document.createElement('div');
      sl.className = 'speed-lines';
      var n = 22;
      for (var i = 0; i < n; i++) {
        var l = document.createElement('i');
        l.style.left = (Math.random() * 100) + '%';
        l.style.animationDuration = (0.25 + Math.random() * 0.4) + 's';
        l.style.opacity = 0.3 + Math.random() * 0.6;
        sl.appendChild(l);
      }
      st.appendChild(sl);
      setTimeout(function () { sl.remove(); }, dur || 900);
    },
    /* أشرطة سينمائية علوية/سفلية */
    letterbox(dur) {
      var st = stage(); if (!st || !this.on) return;
      var top = document.createElement('div'); top.className = 'letterbox top';
      var bot = document.createElement('div'); bot.className = 'letterbox bot';
      st.appendChild(top); st.appendChild(bot);
      requestAnimationFrame(function () { top.classList.add('on'); bot.classList.add('on'); });
      setTimeout(function () { top.remove(); bot.remove(); }, dur || 1200);
    },
    /* وميض كروما خفيف */
    chromaticFlash() {
      var st = stage(); if (!st || !this.on) return;
      st.classList.add('chromatic');
      setTimeout(function () { st.classList.remove('chromatic'); }, 160);
    }
  };
  window.CINEMA = CINEMA;

  /* ---------- ربط تلقائي بنظام FX الأصلي ---------- */
  function hookFX() {
    if (typeof FX === 'undefined') return;
    if (FX.__cinemaHooked) return;
    FX.__cinemaHooked = true;

    // اهتزاز مُدرّج حسب قوة الضربة
    var oShake = FX.shake;
    FX.shake = function (intensity) {
      oShake.call(FX);
      if (intensity === 'lg') CINEMA.zoomPunch('lg');
      else if (intensity === 'md') CINEMA.zoomPunch();
    };

    // عند الهجوم النهائي (cutin) → خطوط سرعة + أشرطة سينمائية + توقف لحظي
    var oCutin = FX.cutin;
    FX.cutin = function (emo, name, color) {
      oCutin.call(FX, emo, name, color);
      CINEMA.speedLines(1200);
      CINEMA.letterbox(1200);
      CINEMA.hitStop(120);
      CINEMA.zoomPunch('lg');
    };

    // ضربة حرجة → زوم + كروما
    var oBurst = FX.burst;
    FX.burst = function (x, y, color, size) {
      oBurst.apply(FX, arguments);
      if (size >= 120) { CINEMA.hitStop(70); CINEMA.zoomPunch(); CINEMA.chromaticFlash(); }
    };
  }

  /* ---------- زرّ تبديل السينمائي من الإعدادات ---------- */
  function ensureSetting() {
    if (window.G && window.G.settings && window.G.settings.cinema === undefined) {
      window.G.settings.cinema = true;
    }
  }

  function boot() {
    ensureSetting();
    hookFX();
    if (window.G && window.G.settings) CINEMA.on = window.G.settings.cinema !== false;
    // مزامنة دائمة مع الإعداد
    setInterval(function () {
      if (window.G && window.G.settings) CINEMA.on = window.G.settings.cinema !== false;
    }, 2000);
  }

  if (document.readyState === 'complete') setTimeout(boot, 600);
  else window.addEventListener('load', function () { setTimeout(boot, 600); });
})();
