/* 경성야록 · 본지(메인) 폰 지면 — 「면을 넘기는 신문」
   폰(600px 이하)에서만. 한 화면 = 신문 한 면. 옆으로 밀면 종이가 왼쪽 끝을 축으로 넘어가고, 아래 一~六 을 누르면 그 면으로.
   기존 기사 · 장치는 그대로 옮겨 담기만 함 (복사하지 않으므로 누르기 · 문지르기 등은 원래대로 작동) */
(function () {
  'use strict';
  var W = window, D = document;
  if (!(W.matchMedia && matchMedia('(max-width:600px)').matches)) return;
  function ready(f) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', f); else f(); }
  ready(function () {
    var main = D.querySelector('main.spread'); if (!main) return;
    var $ = function (s) { return main.querySelector(s); };
    var FACES = [
      { no: '一', name: '사회', parts: ['.topbar', 'header.masthead', '.tagline', 'article.c1'] },
      { no: '二', name: '사회', parts: ['article.c2'] },
      { no: '三', name: '문화예술', parts: ['article.c3'] },
      { no: '四', name: '경제', parts: ['article.c4'] },
      { no: '五', name: '부록 · 편집국', parts: ['section.reads'] },
      { no: '六', name: '호외 · 광고', parts: ['section.rhg', 'section.ads', 'footer.foot'] }
    ];
    D.documentElement.classList.add('m-deck-on');
    var deck = D.createElement('div'); deck.className = 'm-deck'; deck.setAttribute('aria-label', '경성야록 지면 — 옆으로 넘기시압');
    var pages = [];
    FACES.forEach(function (f, i) {
      var pg = D.createElement('section'); pg.className = 'm-pg m-pg' + (i + 1); pg.setAttribute('data-face', f.no);
      var inner = D.createElement('div'); inner.className = 'm-in'; pg.appendChild(inner);
      if (i > 0) {
        var mh = D.createElement('div'); mh.className = 'm-mh';
        mh.innerHTML = '<b>경성야록</b><span>京城野錄 · 第' + f.no + '面</span><em>' + f.name + '</em>';
        inner.appendChild(mh);
      }
      f.parts.forEach(function (s) { var el = $(s); if (el) inner.appendChild(el); });
      var ft = D.createElement('div'); ft.className = 'm-pgno'; ft.textContent = '— 第' + f.no + '面 —'; inner.appendChild(ft);
      var shade = D.createElement('i'); shade.className = 'm-shade'; shade.setAttribute('aria-hidden', 'true'); pg.appendChild(shade);
      if (i < FACES.length - 1) { var cn = D.createElement('span'); cn.className = 'm-corner'; cn.setAttribute('aria-hidden', 'true'); pg.appendChild(cn); }
      deck.appendChild(pg); pages.push(pg);
    });
    main.parentNode.insertBefore(deck, main);
    main.classList.add('m-rest');

    /* 아래 면 고르개 */
    var dock = D.createElement('nav'); dock.className = 'm-dock'; dock.setAttribute('aria-label', '면 고르기');
    FACES.forEach(function (f, i) {
      var b = D.createElement('button'); b.type = 'button'; b.innerHTML = '<b>' + f.no + '</b><small>' + f.name.split(' ')[0] + '</small>';
      b.addEventListener('click', function () { go(i); });
      dock.appendChild(b);
    });
    D.body.appendChild(dock);
    var hint = D.createElement('div'); hint.className = 'm-hint'; hint.innerHTML = '옆으로 밀어 <b>면을 넘기시압</b> →'; D.body.appendChild(hint);

    function go(i) { deck.scrollTo({ left: i * deck.clientWidth, behavior: 'smooth' }); }

    /* 넘기는 종이 — 나가는 면은 왼쪽 끝을 축으로 접혀 넘어가고, 들어오는 면은 그 밑에 깔려 있음 */
    var cur = -1, raf = 0;
    function paint() {
      raf = 0;
      var w = deck.clientWidth || 1, x = deck.scrollLeft;
      pages.forEach(function (pg, i) {
        var o = x / w - i;                      /* 0 = 지금 면, 0~1 = 넘어가는 중, -1~0 = 밑에서 기다리는 면 */
        var sh = pg.lastChild && pg.querySelector('.m-shade');
        if (o > 0 && o < 1) {
          pg.style.transform = 'translateX(' + (o * w) + 'px) rotateY(' + (-o * 96) + 'deg)';
          pg.style.zIndex = 3; if (sh) sh.style.opacity = Math.min(.55, o * .8);
        } else if (o < 0 && o > -1) {
          pg.style.transform = 'translateX(' + (o * w) + 'px)';
          pg.style.zIndex = 1; if (sh) sh.style.opacity = (1 + o) * .35;
        } else { pg.style.transform = ''; pg.style.zIndex = 2; if (sh) sh.style.opacity = 0; }
      });
      var n = Math.round(x / w);
      if (n !== cur) {
        cur = n;
        [].forEach.call(dock.children, function (b, i) { b.classList.toggle('on', i === n); });
        if (n > 0) hint.classList.add('gone');
        try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
      }
    }
    deck.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    W.addEventListener('resize', paint);
    paint();
    setTimeout(function () { hint.classList.add('gone'); }, 7000);

    /* 다른 곳에서 「#hogoe」 같은 자리로 오라고 하면 그 면으로 */
    function toHash() {
      var h = null; try { h = location.hash && D.querySelector(location.hash); } catch (e) {} if (!h) return;
      for (var i = 0; i < pages.length; i++) if (pages[i].contains(h)) { deck.scrollLeft = i * deck.clientWidth; break; }
    }
    W.addEventListener('hashchange', toHash); setTimeout(toHash, 60);
    W.ykDeckGo = go;
    /* 「보는 법」 안내가 짚는 것이 다른 면에 있으면 그 면으로 넘기고, 면 안에서 그 자리로 */
    W.ykDeckReveal = function (t, want) {
      for (var i = 0; i < pages.length; i++) if (pages[i].contains(t)) {
        var sb = deck.style.scrollBehavior; deck.style.scrollBehavior = 'auto'; deck.scrollLeft = i * deck.clientWidth; deck.style.scrollBehavior = sb; paint();
        var inn = pages[i].querySelector('.m-in'), r = t.getBoundingClientRect();
        inn.scrollTop += r.top - (want || 80);
        return true;
      }
      return false;
    };

    /* 「사회면 다른 긔사 +7」 — 폰에서는 그 면의 긔록 색인을 펼쳐 보여 줌 */
    D.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.m-deck .secmore'); if (!a) return;
      e.preventDefault(); e.stopPropagation();
      var b = D.querySelector('.topbar .search'); if (!b) return;
      b.click();
      setTimeout(function () {
        var inp = D.querySelector('.yf-input'); if (!inp) return;
        inp.value = (a.dataset.sec || '') + '면'; inp.dispatchEvent(new Event('input', { bubbles: true }));
      }, 160);
    }, true);
  });
})();
