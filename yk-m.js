/* 경성야록 · 폰 지면 공통 손 — 본편(사건 페이지)이 같이 씀. 폰(600px 이하)에서만.
   <script src="../yk-m.js" data-face="第三面" data-sec="京城野錄 · 文化藝術面">
   1) 제호 띠 : 맨 위에선 크게, 읽기 시작하면 작게 · 지금 읽는 장 이름 · 읽은 만큼 붉은 줄
   2) 그림은 자르지 않음
   3) 장(第○章)이 바뀌는 자리에서 종이 한 장이 넘어감 */
(function () {
  'use strict';
  if (!(window.matchMedia && matchMedia('(max-width:600px)').matches)) return;
  var D = document, me = D.currentScript || {}, ds = me.dataset || {};
  var FACE = ds.face || '', SEC = ds.sec || '京城野錄';
  function ready(f) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', f); else f(); }
  ready(function () {
    var nb = D.querySelector('.notebook'); if (nb) { nb.classList.remove('open'); var c = nb.querySelector('.nb-cover'); if (c) c.setAttribute('aria-expanded', 'false'); }
    /* 폰 전용 제호 띠 — 맨 위에선 크게, 읽기 시작하면 조금 작게. 지금 읽는 장 이름과 읽은 만큼 붉은 줄 */
    var hd = D.createElement('header'); hd.className = 'm-hd';
    hd.innerHTML = '<a href="../index.html" aria-label="본지로"><span>‹</span>본지</a><div class="m-logo"><b>경성야록</b><small>' + SEC + '</small></div>' + (FACE ? '<span class="m-no">' + FACE.split('').join('<br>') + '</span>' : '<span></span>') + '<i class="m-prog"></i>';
    D.body.appendChild(hd);
    var hs = D.querySelector('.hero-slide'); if (hs) D.documentElement.style.setProperty('--ykm-hero', 'url("' + hs.src + '")');
    var sub = hd.querySelector('small'), prog = hd.querySelector('.m-prog'), base = sub.textContent, py = scrollY, cur = '';
    var marks = [].slice.call(D.querySelectorAll('.label')).filter(function (l) { return /章/.test(l.textContent); });
    function head() {
      var y = scrollY, H = D.documentElement.scrollHeight - innerHeight;
      prog.style.width = (H > 0 ? Math.min(100, y / H * 100) : 0) + '%';
      hd.classList.toggle('mini', y > 140);
      py = y;
      var name = base;
      for (var i = 0; i < marks.length; i++) { if (marks[i].getBoundingClientRect().top < innerHeight * .4) { var b = marks[i].querySelector('b'), em = marks[i].querySelector('em'); name = (b ? b.textContent.trim() : '') + ' · ' + (em ? em.textContent.split('·').pop().trim() : ''); } }
      if (name !== cur) { cur = name; sub.style.opacity = 0; setTimeout(function () { sub.textContent = cur; sub.style.opacity = .78; }, 200); }
    }
    addEventListener('scroll', head, { passive: true }); head();

    /* 그림은 자르지 않음 — 폰에서 잘려 보이던 그림을 원래 비율 그대로 */
    function whole(img) {
      if (!img.naturalWidth || img.closest('.hero-slider, .bs-plate, .m-hd')) return;
      var cs = getComputedStyle(img); if (cs.objectFit !== 'cover' || cs.position === 'absolute') return;
      var ra = img.naturalWidth / img.naturalHeight, rb = img.offsetWidth / Math.max(1, img.offsetHeight);
      if (Math.abs(1 - Math.min(ra, rb) / Math.max(ra, rb)) < .06) return;
      img.style.setProperty('height', 'auto', 'important'); img.style.setProperty('aspect-ratio', ra.toFixed(4), 'important');
      img.style.setProperty('max-height', 'none', 'important'); img.style.setProperty('object-fit', 'contain', 'important');
      for (var e = img.parentElement, k = 0; e && k < 3; e = e.parentElement, k++) {
        var h = getComputedStyle(e).height; if (e.style && /px/.test(h) && e.scrollHeight > e.clientHeight + 2) { e.style.setProperty('height', 'auto', 'important'); e.style.setProperty('max-height', 'none', 'important'); }
      }
    }
    [].forEach.call(D.querySelectorAll('main img, .detail-content img, section img'), function (im) { if (im.complete) whole(im); else im.addEventListener('load', function () { whole(im); }); });

    var leaf = D.createElement('div'); leaf.className = 'm-leaf'; leaf.setAttribute('aria-hidden', 'true'); D.body.appendChild(leaf);
    var busy = false, seen = {};
    function turn(no, title) {
      if (busy) return; busy = true;
      leaf.innerHTML = '<i><b>' + no + '</b><em>' + title + '</em><s></s></i>';
      leaf.classList.add('go');
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
      var a = D.getElementById('sfxWhoosh'); if (a) { try { a.currentTime = 0; a.volume = .5; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
      setTimeout(function () { leaf.classList.remove('go'); leaf.innerHTML = ''; busy = false; }, 1100);
    }
    var heads = [].slice.call(D.querySelectorAll('.label')).filter(function (l) { return /章/.test(l.textContent); });
    var lastY = scrollY;
    function check() {
      var down = scrollY > lastY; lastY = scrollY; if (!down) return;
      for (var i = 0; i < heads.length; i++) {
        var l = heads[i]; if (seen[i]) continue;
        var r = l.getBoundingClientRect();
        if (r.top < innerHeight * .78 && r.top > innerHeight * .2) {
          seen[i] = 1;
          var b = l.querySelector('b'), em = l.querySelector('em');
          var t = em ? em.textContent.split('·').pop().trim() : '';
          turn(b ? b.textContent.trim().split('').join(' ') : '', t);
          break;
        }
      }
    }
    addEventListener('scroll', check, { passive: true });
  });
})();
