/* 경성야록 · 백백교 — 엔딩 : 병 장부터 끗까지, 지면 바깥이 천천히 희게 바램 */
(function () {
  var D = document, a = D.getElementById('jar'), fin = D.getElementById('finale'); if (!a || !fin) return;
  var veil = D.createElement('div'); veil.className = 'bb-bleach'; veil.setAttribute('aria-hidden', 'true'); D.body.appendChild(veil);
  function top(e) { return e.getBoundingClientRect().top; }
  function f() {
    var s = top(a) - innerHeight * .3, e = top(fin), end = fin.getBoundingClientRect().bottom, p = 0;
    if (s < 0 && e > 0) p = Math.min(1, -s / Math.max(1, e - s));
    else if (e <= 0 && end > innerHeight * .4) p = 1;
    else if (end <= innerHeight * .4) p = Math.max(0, 1 - (innerHeight * .4 - end) / 500);
    veil.style.setProperty('--p', p.toFixed(3));
  }
  addEventListener('scroll', f, { passive: true }); setTimeout(f, 300);
})();
