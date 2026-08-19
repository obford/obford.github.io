/*! whoosh.js — optional entrance animations for Obford
 *  Drop in:  <script src="whoosh.js"></script>   (in <head>, no defer)
 *  Drop out: delete that one line. Nothing else changes, nothing breaks.
 *
 *  ----------------------------------------------------------------
 *  TUNING — the four numbers worth touching
 *  ----------------------------------------------------------------
 *    duration   how long the movement takes          1150 ms
 *    distance   how far it travels                     72 px
 *    blur       motion blur that clears on arrival      6 px
 *    ease       the curve. Slight overshoot so it
 *               lands with a definite stop rather
 *               than creeping into place
 *
 *  Slower and heavier:  duration 1500, distance 100px
 *  Snappier:            duration 800,  distance 48px
 *  No overshoot:        ease 'cubic-bezier(.2,.8,.3,1)'
 *  ----------------------------------------------------------------
 *
 *  Usage
 *    <h1 data-whoosh>...</h1>                        up, the default
 *    <img data-whoosh="left">                        from the left
 *    <div data-whoosh="scale" data-whoosh-delay="200">
 *    <div data-whoosh-stagger="120"> ... </div>      stagger direct children
 *
 *  Directions: up · down · left · right · scale · fade · blur
 *
 *  Per element (all optional)
 *    data-whoosh-distance   default 72px
 *    data-whoosh-duration   default 1150   ms
 *    data-whoosh-delay      default 0      ms
 *    data-whoosh-blur       default 6      px, 0 to disable
 *    data-whoosh-threshold  default 0.12   0-1
 *    data-whoosh-once       default true   "false" replays on re-entry
 *
 *  Container
 *    data-whoosh-stagger    ms between direct children
 *
 *  Global defaults, set before this script loads:
 *    <script>window.WHOOSH_DEFAULTS={duration:1500,distance:'100px'}</script>
 *
 *  API: window.Whoosh.refresh()   rescan after adding DOM
 *       window.Whoosh.revealAll() show everything now
 */
(function (win, doc) {
  'use strict';

  var D = win.WHOOSH_DEFAULTS || {};
  var CFG = {
    distance:  D.distance  || '72px',
    duration:  D.duration  || 1150,
    delay:     D.delay     || 0,
    blur:      D.blur      == null ? 6 : D.blur,
    threshold: D.threshold || 0.12,
    // transform: slight overshoot, so it arrives and stops rather than drifting in
    ease:      D.ease      || 'cubic-bezier(.22,1.12,.34,1)',
    // opacity and blur: plain decel, no overshoot
    easeSoft:  D.easeSoft  || 'cubic-bezier(.2,.7,.3,1)',
    // opacity and blur finish early, so it is solid and sharp before it lands
    fadeRatio: D.fadeRatio == null ? 0.62 : D.fadeRatio,
    blurRatio: D.blurRatio == null ? 0.50 : D.blurRatio,
    margin:    D.margin    || '0px 0px -8% 0px',
    failsafe:  D.failsafe  || 3500
  };

  var reduced = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // No motion wanted, or no observer support: do nothing at all.
  // The hiding CSS is injected by this script, so opting out simply
  // means everything renders normally.
  if (reduced || !('IntersectionObserver' in win)) return;

  var css =
    '[data-whoosh]{' +
      'opacity:0;' +
      'transform:translate3d(var(--wx,0),var(--wy,0),0) scale(var(--ws,1));' +
      'filter:blur(var(--wb,0px));' +
      'will-change:opacity,transform,filter;' +
      'transition:' +
        'transform var(--wd,' + CFG.duration + 'ms) var(--we,' + CFG.ease + ') var(--wl,0ms),' +
        'opacity var(--wod,' + Math.round(CFG.duration * CFG.fadeRatio) + 'ms) var(--wes,' + CFG.easeSoft + ') var(--wl,0ms),' +
        'filter var(--wbd,' + Math.round(CFG.duration * CFG.blurRatio) + 'ms) var(--wes,' + CFG.easeSoft + ') var(--wl,0ms);' +
    '}' +
    '[data-whoosh].whooshed{opacity:1;transform:none;filter:none}';

  var style = doc.createElement('style');
  style.setAttribute('data-whoosh-styles', '');
  style.appendChild(doc.createTextNode(css));
  (doc.head || doc.documentElement).appendChild(style);

  function num(el, attr, fallback) {
    var v = el.getAttribute(attr);
    if (v === null || v === '') return fallback;
    var n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  function prime(el, extraDelay) {
    if (el.__whooshPrimed) return;
    el.__whooshPrimed = true;

    var dir  = (el.getAttribute('data-whoosh') || 'up').toLowerCase();
    var dist = el.getAttribute('data-whoosh-distance') || CFG.distance;
    var dur  = num(el, 'data-whoosh-duration', CFG.duration);
    var del  = num(el, 'data-whoosh-delay', CFG.delay) + (extraDelay || 0);
    var blur = num(el, 'data-whoosh-blur', CFG.blur);
    var ease = el.getAttribute('data-whoosh-ease') || CFG.ease;

    var x = '0', y = '0', s = '1';
    if (dir === 'up')          y = dist;
    else if (dir === 'down')   y = '-' + dist;
    else if (dir === 'left')   x = '-' + dist;
    else if (dir === 'right')  x = dist;
    else if (dir === 'scale')  s = '0.90';
    else if (dir === 'blur')   blur = Math.max(blur, 12);
    // 'fade' stays put and only animates opacity

    el.style.setProperty('--wx', x);
    el.style.setProperty('--wy', y);
    el.style.setProperty('--ws', s);
    el.style.setProperty('--wb', blur + 'px');
    el.style.setProperty('--wd', dur + 'ms');
    el.style.setProperty('--wod', Math.round(dur * CFG.fadeRatio) + 'ms');
    el.style.setProperty('--wbd', Math.round(dur * CFG.blurRatio) + 'ms');
    el.style.setProperty('--wl', del + 'ms');
    el.style.setProperty('--we', ease);
    el.style.setProperty('--wes', CFG.easeSoft);
  }

  function show(el) {
    el.classList.add('whooshed');
    var total = num(el, 'data-whoosh-duration', CFG.duration) +
                num(el, 'data-whoosh-delay', CFG.delay) + 150;
    win.setTimeout(function () { el.style.willChange = 'auto'; }, total);
  }

  function hide(el) { el.classList.remove('whooshed'); }

  var observers = {};
  function observerFor(t) {
    if (!observers[t]) {
      observers[t] = new win.IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var el = e.target;
          if (e.isIntersecting) {
            show(el);
            if (el.getAttribute('data-whoosh-once') !== 'false') {
              observers[t].unobserve(el);
            }
          } else if (el.getAttribute('data-whoosh-once') === 'false') {
            hide(el);
          }
        });
      }, { threshold: t, rootMargin: CFG.margin });
    }
    return observers[t];
  }

  function scan() {
    var groups = doc.querySelectorAll('[data-whoosh-stagger]');
    Array.prototype.forEach.call(groups, function (group) {
      if (group.__whooshStaggered) return;
      group.__whooshStaggered = true;
      var step = parseFloat(group.getAttribute('data-whoosh-stagger')) || 120;
      var inherit = group.getAttribute('data-whoosh-child') || 'up';
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (!child.hasAttribute('data-whoosh')) child.setAttribute('data-whoosh', inherit);
        prime(child, i * step);
      });
    });

    var els = doc.querySelectorAll('[data-whoosh]');
    Array.prototype.forEach.call(els, function (el) {
      prime(el, 0);
      if (el.__whooshObserved) return;
      el.__whooshObserved = true;
      var t = num(el, 'data-whoosh-threshold', CFG.threshold);
      if (t < 0) t = 0; if (t > 1) t = 1;
      observerFor(t).observe(el);
    });
    return els.length;
  }

  function revealAll() {
    Array.prototype.forEach.call(doc.querySelectorAll('[data-whoosh]'), show);
  }

  function start() {
    scan();
    // If anything is stuck hidden, show it. A broken animation
    // should never cost someone the content.
    win.setTimeout(function () {
      Array.prototype.forEach.call(
        doc.querySelectorAll('[data-whoosh]:not(.whooshed)'),
        function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < win.innerHeight && r.bottom > 0) show(el);
        }
      );
    }, CFG.failsafe);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  win.Whoosh = { refresh: scan, revealAll: revealAll, config: CFG };

})(window, document);
