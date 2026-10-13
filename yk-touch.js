/* 경성야록 · 손가락으로 보는 지면 (폰 · 태블릿 — 손가락 화면에서만 작동)
   1) 마우스를 대면 바뀌던 것 → 톡 누르면 바뀌고, 조금 뒤 저절로 돌아옴
   2) 마우스를 따라오던 빛 · 돋보기 · 등불 → 손가락을 따라옴 (화면을 내리는 중에도)
      + 폰을 기울이면 빛이 움직임 (아이폰은 처음 한 번 허락)
   3) 도장 · 노크 · 전보 · 바치기 같은 순간에 짧은 진동 (갤럭시 등 안드로이드)
   4) 안내 문구의 「마우스」 「휠」을 손가락 말로 바꿔 보여 줌
   5) 소리가 있는 지면에 처음 손대면 「소리를 켜고 보시압」 한 번 */
(function () {
  'use strict';
  var W = window, D = document;
  var touch = (W.matchMedia && matchMedia('(hover: none)').matches) || ('ontouchstart' in W && navigator.maxTouchPoints > 0 && !(W.matchMedia && matchMedia('(hover: hover)').matches));
  if (!touch || W.__ykTouch) return; W.__ykTouch = true;
  D.documentElement.classList.add('yk-touch');

  /* ── 4) 안내 문구 바꾸기 ── */
  var SW = [
    [/마우스를 대고 기다려 보세요/g, '손가락으로 누르고 기다려 보세요'], [/마우스를 대고 잠시 기다리시압/g, '손가락으로 누르고 잠시 기다리시압'],
    [/마우스를 대 보세요/g, '손가락으로 눌러 보세요'], [/마우스를 대면/g, '손가락으로 누르면'], [/마우스를 대고/g, '손가락을 대고'],
    [/마우스로 비추시압/g, '손가락으로 비추시압'], [/마우스로 비추어/g, '손가락으로 비추어'], [/마우스가 등불이오/g, '손가락이 등불이오'], [/마우스가 등불이에요/g, '손가락이 등불이에요'],
    [/마우스를 따라/g, '손가락을 따라'], [/마우스를/g, '손가락을'], [/마우스가/g, '손가락이'], [/마우스는/g, '손가락은'], [/마우스로/g, '손가락으로'], [/마우스와/g, '손가락과'], [/마우스/g, '손가락'],
    [/휠을 천천히 굴리면/g, '화면을 천천히 밀어 올리면'], [/휠을 천천히 내리면/g, '화면을 천천히 밀어 올리면'], [/휠을 굴리면/g, '화면을 밀면'], [/휠을/g, '화면을'],
    [/굴려 보시압/g, '밀어 보시압'], [/굴려 보세요/g, '밀어 보세요'],
    [/손을 대고 기다려/g, '손가락을 대고 기다려'], [/커서/g, '손가락']
  ];
  function fix(s) { for (var i = 0; i < SW.length; i++) s = s.replace(SW[i][0], SW[i][1]); return s; }
  function walk(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.closest && root.closest('script,style,textarea,input')) return;
    var tw = D.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode())) { if (/마우스|휠|굴려|커서|손을 대고 기다려/.test(n.nodeValue)) n.nodeValue = fix(n.nodeValue); }
    var els = root.querySelectorAll ? root.querySelectorAll('[data-ko],[aria-label],[title]') : [];
    Array.prototype.forEach.call(els, function (e) {
      ['data-ko', 'aria-label', 'title'].forEach(function (a) { var v = e.getAttribute(a); if (v && /마우스|휠|굴려|커서/.test(v)) e.setAttribute(a, fix(v)); });
    });
  }
  function start() {
    walk(D.body);
    new MutationObserver(function (ms) { ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (x) { if (x.nodeType === 1) walk(x); else if (x.nodeType === 3 && /마우스|휠|굴려/.test(x.nodeValue)) x.nodeValue = fix(x.nodeValue); }); }); })
      .observe(D.body, { childList: true, subtree: true });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', start); else start();

  /* ── 1) 톡 누르면 오늘 말 → 3초 뒤 옛말로 ── */
  D.addEventListener('touchend', function (e) {
    var h = e.target.closest && e.target.closest('.hj[data-ko], .hj'); if (!h) return;
    clearTimeout(h._ykT);
    h._ykT = setTimeout(function () { try { h.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false })); h.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })); h.blur && h.blur(); } catch (x) {} }, 3200);
  }, { passive: true });

  /* ── 2) 손가락을 따라오는 빛 ── */
  var FOLLOW = '.lantern, .bb-mount, .mt-poster, .lens, .lt-sheet, .lt-desk, #fogStage, #room, .wl, .jr-pic, .mk-wall, .bs-plate, .c3 .visual.desk, #vPic, .sk-night, .hero-slider, #white';
  function send(el, x, y) {
    try {
      el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y, view: W }));
      if (W.PointerEvent) el.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'mouse', isPrimary: true }));
    } catch (e) {}
  }
  var lastHost = null;
  D.addEventListener('touchmove', function (e) {
    var t = e.touches[0]; if (!t) return;
    var host = e.target.closest && e.target.closest(FOLLOW); if (!host) return;
    lastHost = host; send(e.target, t.clientX, t.clientY);
  }, { passive: true });
  D.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; if (!t) return;
    var host = e.target.closest && e.target.closest(FOLLOW); if (!host) return;
    lastHost = host;
    try { host.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false })); if (W.PointerEvent) host.dispatchEvent(new PointerEvent('pointerenter', { bubbles: false, pointerType: 'mouse' })); } catch (x) {}
    send(e.target, t.clientX, t.clientY);
  }, { passive: true });

  /* 기울이면 빛이 움직임 — 화면 가운데에 걸린 빛 칸 안에서 */
  var tilt = false, base = null;
  function onTilt(ev) {
    if (ev.beta == null || ev.gamma == null) return;
    if (!base) base = { b: ev.beta, g: ev.gamma };
    var hosts = D.querySelectorAll('.lantern, #fogStage, .bb-mount, .sk-night'), host = null;
    for (var i = 0; i < hosts.length; i++) { var r = hosts[i].getBoundingClientRect(); if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5 && r.height) { host = hosts[i]; break; } }
    if (!host) return;
    var r2 = host.getBoundingClientRect();
    var x = r2.left + r2.width * Math.max(.05, Math.min(.95, .5 + (ev.gamma - base.g) / 50));
    var y = Math.max(r2.top, 0) + Math.min(r2.height, innerHeight) * Math.max(.05, Math.min(.95, .5 + (ev.beta - base.b) / 50));
    send(host, x, y);
  }
  function askTilt() {
    if (tilt) return; tilt = true;
    var DOE = W.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === 'function') {
      DOE.requestPermission().then(function (s) { if (s === 'granted') W.addEventListener('deviceorientation', onTilt); }).catch(function () {});
    } else if (DOE) W.addEventListener('deviceorientation', onTilt);
  }
  D.addEventListener('touchend', function (e) { if (e.target.closest && e.target.closest('.lantern, #fogStage, .bb-mount, .sk-night')) askTilt(); }, { passive: true });
  if (!(W.DeviceOrientationEvent && typeof W.DeviceOrientationEvent.requestPermission === 'function')) setTimeout(askTilt, 1500);

  /* ── 3) 진동 ── */
  /* 안드로이드는 진동, 아이폰(iOS 18 이상)은 스위치를 누를 때의 「톡」 손맛(햅틱)을 빌려 씀 */
  var hap = null;
  function iosTap() {
    try {
      if (!hap) {
        hap = D.createElement('label'); hap.setAttribute('aria-hidden', 'true');
        hap.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
        var inp = D.createElement('input'); inp.type = 'checkbox'; inp.setAttribute('switch', ''); inp.tabIndex = -1;
        hap.appendChild(inp); D.body.appendChild(hap);
      }
      hap.click();
    } catch (e) {}
  }
  var buzz = function (p) {
    try {
      if (navigator.vibrate) { navigator.vibrate(p); return; }
      var n = Array.isArray(p) ? Math.ceil(p.length / 2) : 1;
      for (var i = 0; i < Math.min(n, 3); i++) setTimeout(iosTap, i * 90);
    } catch (e) {}
  };
  var HARD = '.l6-give, #hgPress, .lever, .knock, .sk-knock, .kk, .rf-give, .lm-off, .ob6, .relight, #relight, .fl, .vd-seats, .wl, .stamp, [data-stamp]';
  var SOFT = 'button, .hj, a, [role="button"]';
  D.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    if (e.target.closest(HARD)) buzz([18, 40, 30]); else if (e.target.closest(SOFT)) buzz(8);
  }, true);
  /* 도장이 찍히거나 전보가 오면 */
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.type === 'attributes' && m.target.classList && m.target.classList.contains('got') && !(m.oldValue || '').match(/\bgot\b/)) buzz([30, 50, 60]);
      Array.prototype.forEach.call(m.addedNodes || [], function (x) { if (x.classList && x.classList.contains('ykr-tel')) setTimeout(function () { buzz([60, 80, 60, 80, 120]); }, 600); });
    });
  }).observe(D.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });

  /* ── 5) 소리 안내 (소리 있는 지면 · 창마다 한 번) ── */
  function soundNote() {
    if (!D.querySelector('audio, .bgm-toggle, #snd, .yk-gramo, #hgSnd')) return;
    try { if (sessionStorage.getItem('yk-snd-note')) return; sessionStorage.setItem('yk-snd-note', '1'); } catch (e) {}
    var n = D.createElement('div'); n.className = 'yk-sndnote'; n.setAttribute('role', 'status');
    n.innerHTML = '<b>소리를 켜고 보시압</b><span>폰이 무음이면 들리지 안소</span>';
    D.body.appendChild(n); requestAnimationFrame(function () { n.classList.add('on'); });
    setTimeout(function () { n.classList.remove('on'); setTimeout(function () { n.remove(); }, 800); }, 4200);
  }
  D.addEventListener('touchstart', function once() { D.removeEventListener('touchstart', once); setTimeout(soundNote, 300); }, { passive: true });
})();
