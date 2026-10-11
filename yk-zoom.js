/* 경성야록 · 새로 열 때마다 기록 초기화
   창(탭)을 새로 열면 도장 · 다녀간 관 · 엽서 · 안내 본 기록 · 특전 진행 등 경성야록 기록(yk- · gsyr- · yarok- 로 시작)을 모두 지움
   - 새로고침(F5)해도 지움 · 같은 창에서 링크를 눌러 페이지를 오갈 때만 그대로 둠
   - 남겨 두는 것: 편집국 전신 회선(OpenAI 키, 「기억하기」를 눌렀을 때만) · 화면 비율 · 편집국 원고 꽂이(따로 보관) */
(function () {
  try {
    var reload = false;
    try { var nv = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]; reload = nv ? nv.type === 'reload' : (performance.navigation && performance.navigation.type === 1); } catch (e) {}
    if (sessionStorage.getItem('yk-sess') && !reload) return;
    /* 새로고침(F5)도 처음부터: 이 창의 경성야록 임시 기록(sessionStorage)도 비움 */
    for (var j = sessionStorage.length - 1; j >= 0; j--) { var sk = sessionStorage.key(j); if (/^(yk|gsyr|yarok)[-_]/.test(sk)) sessionStorage.removeItem(sk); }
    sessionStorage.setItem('yk-sess', '1');
    var keep = { 'yk-nr-key': 1, 'yk-dpr-base': 1, 'yk-pass': 1 }, rm = [];
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^(yk|gsyr|yarok)[-_]/.test(k) && !keep[k]) rm.push(k); }
    rm.forEach(function (k) { localStorage.removeItem(k); });
  } catch (e) {}
})();
/* 경성야록 · 휴대폰 화면 — yk-mobile.css 를 모든 페이지에 붙임 (폰 폭에서만 작동) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src ? cs.src.replace(/yk-zoom\.js.*$/, '') : '';
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = src + 'yk-mobile.css?v=1';
    (document.head || document.documentElement).appendChild(l);
    if (window.matchMedia && matchMedia('(max-width: 760px)').matches) document.documentElement.classList.add('yk-mob');
  } catch (e) {}
  /* 폰에서 좁아 찌그러지는 칸 · 옆으로 삐져나가는 칸을 저절로 펴 줌 */
  function fit() {
    if (!(window.matchMedia && matchMedia('(max-width: 760px)').matches)) return;
    var vw = document.documentElement.clientWidth, all = document.querySelectorAll('body *');
    for (var i = 0; i < all.length; i++) {
      var e = all[i]; if (e.closest('svg') || e.closest('nav, .mh, .masthead') || e.dataset.ykFit) continue;
      var cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.display === 'none') continue;
      if (cs.display === 'grid' || cs.display === 'inline-grid') {
        var cols = cs.gridTemplateColumns.split(' ').filter(function (x) { return /px$/.test(x); }).map(parseFloat);
        var txt = 0; Array.prototype.forEach.call(e.children, function (c) { txt = Math.max(txt, (c.textContent || '').replace(/\s+/g, '').length); });
        if (cols.length >= 2 && cols.length <= 4 && Math.min.apply(null, cols) < 132 && txt > 28 && e.getBoundingClientRect().width < vw * 1.05) {
          e.style.gridTemplateColumns = 'minmax(0,1fr)'; e.style.gridColumnGap = '0'; e.dataset.ykFit = 'g';
          Array.prototype.forEach.call(e.children, function (c) { c.style.gridColumn = 'auto'; c.style.gridRow = 'auto'; });
        }
      }
    }
    for (var j = 0; j < all.length; j++) {
      var f = all[j]; if (f.closest('svg')) continue;
      var r = f.getBoundingClientRect(); if (!r.width || r.right <= vw + 1) continue;
      var c2 = getComputedStyle(f); if (c2.position === 'fixed' || c2.position === 'absolute' || /translate|matrix/.test(c2.transform)) continue;
      if (r.width > vw * 0.55 && r.left >= -1) { f.style.maxWidth = (vw - Math.max(0, r.left)) + 'px'; f.style.minWidth = '0'; if (/px$/.test(c2.width) && f.tagName !== 'IMG') f.style.width = 'auto'; f.dataset.ykFit = 'w'; }
      if (c2.display === 'flex' && c2.flexWrap === 'nowrap' && c2.flexDirection.indexOf('row') === 0) { f.style.flexWrap = 'wrap'; f.dataset.ykFit = 'f'; }
    }
  }
  /* 손가락으로도 : 문지르기 · 돋보기 · 다이얼 · 끌기 칸에서는 화면이 밀리지 않고 손가락을 따라감 */
  var ZONE = '.lens, .jangv4, .c3 .visual.desk, .bs-plate, .rx-dial, .jr-pic, .sb-item, #vPic, .km-touch';
  function touchy() {
    if (!(window.matchMedia && matchMedia('(hover: none)').matches)) return;
    document.documentElement.classList.add('yk-touch');
    var st = document.createElement('style'); st.textContent = ZONE.split(',').map(function (x) { return x.trim(); }).join(',') + '{touch-action:none}';
    document.head.appendChild(st);
    /* 마우스만 듣는 장치에 손가락 움직임을 마우스 움직임으로 전해 줌 */
    document.addEventListener('touchmove', function (e) {
      var t = e.touches[0], el = e.target; if (!t || !el.closest || !el.closest(ZONE)) return;
      try { el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: t.clientX, clientY: t.clientY, view: window })); } catch (x) {}
    }, { passive: true });
  }
  function later() { setTimeout(fit, 300); setTimeout(fit, 1600); touchy(); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
})();
/* 경성야록 · 화면 배율 120%
   팀 의견: "폭이 너무 좁다 → 브라우저 120% 배율로 보는 게 좋다"
   → 페이지가 열릴 때 스스로 120%로 키워서 보여 준다 (브라우저 배율을 따로 안 건드려도 됨).
   - 화면이 좁은 노트북은 넘치지 않게 알아서 조금 덜 키움 (폭 1100px 아래는 100%)
   - 크롬 계열의 CSS zoom 은 마우스 좌표 · 화면 크기 값이 '키우기 전' 기준으로 나와서,
     기존 스크립트(돋보기 · 등불 · 드래그 등)가 어긋나지 않게 그 값들을 '키운 뒤' 기준으로 바꿔 줌
   - 배율을 바꾸고 싶으면 아래 TARGET 숫자만 고치면 됨 (1 = 100%, 1.2 = 120%)
   - 이 파일을 지우거나 <script src="yk-zoom.js"> 줄을 빼면 원래(100%)대로 돌아감 */
(function () {
  'use strict';
  var TARGET = 1.2, MIN_W = 1100;
  var W = window, D = document, root = D.documentElement;
  if (W.__ykZoom) return; W.__ykZoom = true;
  try { if (/[?&]zoom=1\b/.test(location.search)) return; } catch (e) {}

  var pd = function (o, k) { while (o) { var d = Object.getOwnPropertyDescriptor(o, k); if (d) return d; o = Object.getPrototypeOf(o); } return null; };
  var iwD = pd(W, 'innerWidth'), ihD = pd(W, 'innerHeight');
  var realW = function () { return iwD && iwD.get ? iwD.get.call(W) : root.clientWidth; };
  var realH = function () { return ihD && ihD.get ? ihD.get.call(W) : root.clientHeight; };
  /* 브라우저 배율(Ctrl + / -)이 탭마다 달라도 메인과 똑같이 보이게:
     메인(index.html)을 열 때의 화면 비율(devicePixelRatio)을 기억해 두고, 다른 페이지는 그 차이만큼 되돌림 */
  var isMain = !!(D.currentScript && D.currentScript.hasAttribute('data-yk-main'));
  /* 화면 한 장을 꽉 채우는 페이지(박람회 등): 세로가 이 높이(px)보다 모자라면 덜 키움 → 위아래가 겹치지 않게 */
  var fitH = D.currentScript ? parseFloat(D.currentScript.getAttribute('data-yk-fit-h')) || 0 : 0;
  var dpr = function () { return W.devicePixelRatio || 1; };
  var base = dpr();
  try {
    if (isMain) localStorage.setItem('yk-dpr-base', String(dpr()));
    else { var b = parseFloat(localStorage.getItem('yk-dpr-base')); if (b > 0) base = b; }
  } catch (e) {}
  var pick = function () {
    var bz = dpr() / base;                       // 이 탭이 메인보다 몇 배 더 확대돼 있나
    var w = realW() * bz;                        // 메인 기준으로 본 화면 폭
    var t = w < 760 ? 1 : Math.max(1, Math.min(TARGET, w / MIN_W));
    if (fitH) t = Math.max(1, Math.min(t, realH() * bz / fitH));
    return Math.max(0.5, Math.min(2, t / bz));
  };

  var Z = pick();
  root.style.zoom = Z;
  root.style.setProperty('--ykz', '1');
  W.ykZoom = Z;

  /* 이 브라우저의 zoom 이 '좌표는 키우기 전 기준'(크롬 128+ · 파이어폭스 126+)인지 재 봄 */
  var probe = D.createElement('div');
  probe.style.cssText = 'position:absolute;left:0;top:0;width:100px;height:100vh;visibility:hidden;pointer-events:none';
  (D.body || root).appendChild(probe);
  var r0 = probe.getBoundingClientRect();
  var visual = Math.abs(r0.width - 100 * Z) < 2;            // 좌표가 키운 크기로 나옴 → 고쳐야 함
  var vhScaled = Math.abs(r0.height - realH() * Z) < 3;      // 100vh 도 같이 커짐 → vw/vh 보정
  probe.remove();
  if (vhScaled) root.style.setProperty('--ykz', String(Z));
  root.classList.add('yk-zoomed');
  if (!visual) { watchResize(); return; }

  var z = function () { return W.ykZoom || 1; };
  function def(o, k, get) { try { Object.defineProperty(o, k, { configurable: true, get: get }); } catch (e) {} }
  /* 화면 크기 */
  if (iwD && iwD.get) def(W, 'innerWidth', function () { return iwD.get.call(W) / z(); });
  if (ihD && ihD.get) def(W, 'innerHeight', function () { return ihD.get.call(W) / z(); });
  /* 마우스 · 손가락 좌표 */
  [W.MouseEvent && MouseEvent.prototype, W.Touch && Touch.prototype].forEach(function (P) {
    if (!P) return;
    ['clientX', 'clientY', 'pageX', 'pageY', 'x', 'y'].forEach(function (k) {
      var d = pd(P, k); if (!d || !d.get) return;
      def(P, k, function () { return d.get.call(this) / z(); });
    });
  });
  /* 요소 위치 */
  var gbcr = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    var r = gbcr.call(this), s = z();
    return new DOMRect(r.x / s, r.y / s, r.width / s, r.height / s);
  };
  var gcr = Element.prototype.getClientRects;
  Element.prototype.getClientRects = function () {
    var list = gcr.call(this), s = z(), out = [];
    for (var i = 0; i < list.length; i++) out.push(new DOMRect(list[i].x / s, list[i].y / s, list[i].width / s, list[i].height / s));
    out.item = function (i) { return out[i]; };
    return out;
  };
  /* 스크롤 */
  ['scrollX', 'scrollY', 'pageXOffset', 'pageYOffset'].forEach(function (k) {
    var d = pd(W, k); if (!d || !d.get) return;
    def(W, k, function () { return d.get.call(W) / z(); });
  });
  ['scrollTo', 'scroll', 'scrollBy'].forEach(function (k) {
    var f = W[k]; if (typeof f !== 'function') return;
    W[k] = function (a, b) {
      var s = z();
      if (a && typeof a === 'object') {
        var o = {}; for (var p in a) o[p] = a[p];
        if (typeof o.top === 'number') o.top *= s;
        if (typeof o.left === 'number') o.left *= s;
        return f.call(W, o);
      }
      return f.call(W, (a || 0) * s, (b || 0) * s);
    };
  });
  /* 좌표로 요소 찾기 */
  ['elementFromPoint', 'elementsFromPoint'].forEach(function (k) {
    var f = D[k]; if (typeof f !== 'function') return;
    D[k] = function (x, y) { var s = z(); return f.call(D, x * s, y * s); };
  });

  function watchResize() {
    var t = 0;
    W.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var n = pick();
        if (Math.abs(n - (W.ykZoom || 1)) < 0.01) return;
        W.ykZoom = n; root.style.zoom = n;
        if (root.classList.contains('yk-zoomed') && vhScaled) root.style.setProperty('--ykz', String(n));
      }, 150);
    });
  }
  watchResize();
})();
