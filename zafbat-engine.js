/* ═══ ZAF BAT v3 · FAST ENGINE (vanilla, no Lenis, no GSAP) ═══ */
(function () {
  window.ZAF2 = window.ZAF2 || {};

  /* ── Inject optimized animation CSS once ── */
  var css = `
[data-anim]{opacity:0;transition:opacity .55s ease-out, transform .55s cubic-bezier(.2,.7,.2,1);will-change:opacity,transform}
[data-anim="up"]{transform:translate3d(0,28px,0)}
[data-anim="left"]{transform:translate3d(-28px,0,0)}
[data-anim="right"]{transform:translate3d(28px,0,0)}
[data-anim="scale"]{transform:scale(.95)}
[data-anim].is-visible{opacity:1;transform:none}
.hero-enter{opacity:0;transform:translate3d(0,20px,0);transition:opacity .7s ease-out, transform .7s cubic-bezier(.2,.7,.2,1)}
body.zb-booted .hero-enter{opacity:1;transform:none}
body.zb-booted .hero-enter:nth-of-type(2){transition-delay:.08s}
body.zb-booted .hero-enter:nth-of-type(3){transition-delay:.16s}
body.zb-booted .hero-enter:nth-of-type(4){transition-delay:.24s}
body.zb-booted #main-nav{opacity:1;transform:none}
#main-nav{opacity:0;transform:translate3d(0,-12px,0);transition:opacity .5s ease-out, transform .5s ease-out, background .3s}
#loader{transition:opacity .25s ease-out}
@media (prefers-reduced-motion: reduce){
  [data-anim],.hero-enter,#main-nav{opacity:1!important;transform:none!important;transition:none!important}
  #loader{display:none!important}
}
/* Boost perf on long pages */
section{content-visibility:auto;contain-intrinsic-size:1px 700px}
.hero-wrap,.page-hero,.page-hero-dark,nav,footer{content-visibility:visible}
`;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── BOOT ── */
  ZAF2.boot = function (opts) {
    opts = opts || {};
    var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function start() {
      /* 1. Loader, instant fade */
      var loader = document.getElementById('loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(function () { loader.style.display = 'none'; }, prefersReduced ? 0 : 260);
      }

      /* 2. Reveal animations via IntersectionObserver */
      var anims = document.querySelectorAll('[data-anim]');
      if (prefersReduced || !('IntersectionObserver' in window)) {
        for (var i = 0; i < anims.length; i++) anims[i].classList.add('is-visible');
      } else {
        var io = new IntersectionObserver(function (entries) {
          for (var k = 0; k < entries.length; k++) {
            var e = entries[k];
            if (e.isIntersecting) {
              var el = e.target;
              var d = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
              if (d > 0) el.style.transitionDelay = d + 's';
              el.classList.add('is-visible');
              io.unobserve(el);
            }
          }
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
        for (var j = 0; j < anims.length; j++) io.observe(anims[j]);
      }

      /* 3. Hero entrance via CSS class */
      document.body.classList.add('zb-booted');

      /* 4. Scroll progress + nav scrolled state, rAF-throttled */
      var prog = document.getElementById('scroll-progress');
      var nav = document.getElementById('main-nav');
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.pageYOffset || document.documentElement.scrollTop;
          if (prog) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            prog.style.width = max > 0 ? Math.min(100, (y / max) * 100) + '%' : '0';
          }
          if (nav) {
            if (y > 80) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
          }
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      /* 5. Mobile menu */
      var menuBtn = document.getElementById('menuBtn');
      var sideMenu = document.getElementById('sideMenu');
      if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var o = sideMenu.classList.toggle('open');
          menuBtn.classList.toggle('active', o);
          menuBtn.innerHTML = o ? '✕' : '&#9776;';
        });
        document.addEventListener('click', function (e) {
          if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.classList.remove('open');
            menuBtn.classList.remove('active');
            menuBtn.innerHTML = '&#9776;';
          }
        });
      }

      /* 6. FAQ */
      window.toggleFaq = function (id) {
        var item = document.getElementById(id);
        if (!item) return;
        var isOpen = item.classList.contains('open');
        var opens = document.querySelectorAll('.faq-item.open');
        for (var i = 0; i < opens.length; i++) {
          opens[i].classList.remove('open');
          var a0 = opens[i].querySelector('.faq-a');
          if (a0) a0.style.maxHeight = '0';
        }
        if (!isOpen) {
          item.classList.add('open');
          var a = item.querySelector('.faq-a');
          var inner = a && a.querySelector('.faq-a-inner');
          if (a && inner) a.style.maxHeight = inner.scrollHeight + 'px';
        }
      };
      var firstFaq = document.querySelector('.faq-item');
      if (firstFaq) {
        firstFaq.classList.add('open');
        var fa = firstFaq.querySelector('.faq-a');
        var fi = fa && fa.querySelector('.faq-a-inner');
        if (fa && fi) fa.style.maxHeight = fi.scrollHeight + 'px';
      }

      /* 7. Method timeline gold fill (if present) */
      var track = document.getElementById('method-track');
      if (track && !prefersReduced && 'IntersectionObserver' in window) {
        var line = document.getElementById('method-line');
        var steps = track.querySelectorAll('.method-step');
        var t2 = false;
        function updTrack() {
          if (t2) return;
          t2 = true;
          requestAnimationFrame(function () {
            var rect = track.getBoundingClientRect();
            var vh = window.innerHeight;
            var raw = (vh * 0.55 - rect.top) / (rect.height * 0.9);
            var pct = Math.max(0, Math.min(1, raw));
            if (line) line.style.height = (pct * 100) + '%';
            for (var s = 0; s < steps.length; s++) {
              if (pct >= s / Math.max(1, steps.length - 1)) steps[s].classList.add('lit');
            }
            t2 = false;
          });
        }
        window.addEventListener('scroll', updTrack, { passive: true });
        window.addEventListener('resize', updTrack, { passive: true });
        updTrack();
      }

      if (opts.afterLoad) opts.afterLoad();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  };

  /* ── Compatibility no-ops (heavy parallax dropped for performance) ── */
  ZAF2.parallax = function () { /* no-op, native scroll only */ };
  ZAF2.animateCounters = function () {
    var els = document.querySelectorAll('[data-count]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = els[i].dataset.count;
    }
  };
})();

/* ════════════ NAV: active state + dropdowns (hover desktop / tap mobile) ════════════ */
(function () {
  function init() {
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (!path) path = 'index.html';
    /* highlight the current page (and its parent group) */
    var links = document.querySelectorAll('#main-nav a, .side-menu a');
    Array.prototype.forEach.call(links, function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 || href.indexOf('wa.me') > -1 || href.indexOf('mailto') === 0 || href.indexOf('tel:') === 0) return;
      var file = href.split('/').pop().split('?')[0].split('#')[0];
      if (file === path) {
        a.classList.add('active');
        var dd = a.closest && a.closest('.nav-dd');
        if (dd) { dd.classList.add('active'); var top = dd.querySelector('.nav-dd-top'); if (top) top.classList.add('active'); }
      }
    });
    /* dropdown tap behaviour — first tap opens, second tap follows the link */
    var noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    var tops = document.querySelectorAll('.nav-dd-top');
    Array.prototype.forEach.call(tops, function (top) {
      top.addEventListener('click', function (e) {
        var dd = top.closest('.nav-dd');
        var inSide = !!(top.closest && top.closest('.side-menu'));
        if (inSide || noHover) {
          if (!dd.classList.contains('open')) {
            e.preventDefault();
            var scope = inSide ? '.side-menu .nav-dd' : '.nav-links .nav-dd';
            Array.prototype.forEach.call(document.querySelectorAll(scope), function (o) { if (o !== dd) o.classList.remove('open'); });
            dd.classList.add('open');
          }
        }
      });
    });
    /* click outside closes any open desktop dropdown */
    document.addEventListener('click', function (e) {
      if (!(e.target.closest && e.target.closest('.nav-dd'))) {
        Array.prototype.forEach.call(document.querySelectorAll('.nav-dd.open'), function (o) { o.classList.remove('open'); });
      }
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

/* ═══ WhatsApp conversion : messages pré-remplis + tracking GTM ═══ */
(function () {
  var MSG = {
    'index': "Bonjour ZAF BAT, je souhaite construire une villa au Maroc et j'aimerais un premier échange privé.",
    'diaspora': "Bonjour ZAF BAT, je vis à l'étranger et je souhaite construire au Maroc. J'aimerais un premier échange privé.",
    'sauvetage': "Bonjour ZAF BAT, j'ai un chantier en difficulté et j'aimerais en parler en toute discrétion.",
    'audit': "Bonjour ZAF BAT, je souhaite commencer par un audit de mon projet.",
    'realisations': "Bonjour ZAF BAT, j'ai vu vos réalisations et j'aimerais discuter de mon projet.",
    'methodologie': "Bonjour ZAF BAT, votre méthode m'intéresse. J'aimerais un premier échange privé.",
    'pilotage-financier': "Bonjour ZAF BAT, j'aimerais en savoir plus sur le séquestre notarial et le pilotage financier.",
    'contact': "Bonjour ZAF BAT, je souhaite un premier échange privé au sujet de mon projet.",
    'ressources': "Bonjour ZAF BAT, j'ai consulté vos guides et j'aimerais discuter de mon projet."
  };
  function pageKey() {
    var p = (location.pathname.split('/').pop() || 'index').toLowerCase().replace(/\.html$/, '');
    return p || 'index';
  }
  function init() {
    var key = pageKey();
    var msg = (MSG[key] || MSG['index']) + ' (vu sur zafbat.ma)';
    var links = document.querySelectorAll('a[href*="wa.me"]');
    Array.prototype.forEach.call(links, function (a) {
      try {
        if (a.href.indexOf('text=') === -1) {
          a.href += (a.href.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent(msg);
        }
      } catch (e) { /* no-op */ }
      a.addEventListener('click', function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'whatsapp_click',
          wa_page: key,
          wa_label: (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'icon'
        });
      });
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
