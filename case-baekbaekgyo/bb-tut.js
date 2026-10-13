/* 경성야록 · 백백교 — 지면 우의 ▸ 표 · 장치마다 「이건 무어요」(그 장치 설명만)
   · 처음 오면 한 번: 짧은 카드 다섯 장, 카드마다 직접 해 보는 작은 장치
   · 지면 우의 장치마다 같은 모양의 작은 표(▸)를 달아 둠 — 한 번 해 보면 「해 봄」으로 바뀌고 사라짐
   · 끝에서 「하나씩 짚어 주기」를 누르면 기존 「보는 법」 투어로 이어짐
   (번쩍임 없음 · 모든 변화는 천천히) */
(function () {
  'use strict';
  var D = document, W = window;
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function H(o, k) { return k && k !== o ? '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>' : '<span class="hj" tabindex="0">' + o + '</span>'; }
  /* 처음 온 사람에게는 이 안내가 먼저 — 기존 투어가 저절로 뜨지 안케 */

  /* ── 지면 우의 표 : 같은 모양, 세 가지 손짓 ── */
  var MARKS = [
    ['#obit .ob6', 'tap', '눌러 들추시압', '눌러서 들춰 보세요', 'click'],
    ['#ledger .l6-give', 'tap', '다섯 번 바치시압', '다섯 번 눌러 보세요', 'click'],
    ['#house .hs6', 'tap', '나누고, 한 사람을 누르시압', '나누고, 한 사람을 눌러 보세요', 'click'],
    ['#night .n6-stick', 'down', '천천히 내리시압', '천천히 내려 보세요', 'scroll'],
    ['#mountain .mt-poster', 'lamp', '마우스로 비추시압', '마우스를 대 보세요', 'hover'],
    ['#land .l6w', 'tap', '다섯을 세어 보시압', '다섯 번 눌러 세어 보세요', 'click'],
    ['#dossier .ds-list', 'tap', '먹줄을 거드시압', '먹줄을 눌러 걷어 보세요', 'click'],
    ['#jar .jr-grid', 'down', '천천히 내리시압', '천천히 내려 보세요', 'scroll']
  ];
  var ICON = { tap: '<i class="bt-ic tap" aria-hidden="true"></i>', down: '<i class="bt-ic down" aria-hidden="true"></i>', lamp: '<i class="bt-ic lamp" aria-hidden="true"></i>' };
  MARKS.forEach(function (m) {
    var el = $(m[0]); if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var b = D.createElement('span'); b.className = 'bt-mark ' + m[1]; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = ICON[m[1]] + '<b>' + H(m[2], m[3]) + '</b>';
    el.appendChild(b);
    var done = function () { if (b.classList.contains('did')) return; b.classList.add('did'); b.innerHTML = '<b>' + H('해 봄', '해 봤어요') + '</b>'; setTimeout(function () { b.classList.add('gone'); }, 2600); };
    if (m[4] === 'click') el.addEventListener('click', done);
    else if (m[4] === 'hover') { var t = 0; el.addEventListener('pointerenter', function () { t = setTimeout(done, 2500); }); el.addEventListener('pointerleave', function () { clearTimeout(t); }); }
    else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > .9) { setTimeout(done, 5000); io.disconnect(); } }); }, { threshold: [.9] }); io.observe(el); }
  });

  /* ── 이건 무어요? : 장치마다 작은 표 하나 — 누르면 그 장치 설명만 ── */
  var HELP = [
    ['#obit .ob6', '흰 종이', '흰 종이', '눌러야만 들춰지오. 밋헤 깔린 부고를 다 읽으면 저절로 다음으로 넘어가고 — 흰 칠이 덥히오.', '눌러야만 들춰져요. 밑에 깔린 부고를 다 읽으면 저절로 넘어가고 — 흰 칠이 덮여요.'],
    ['#ledger .l6-give', '헌납 장부', '헌납 장부', '이 단추를 다섯 번 누르면 재산이 한 칸씩 바쳐지오. 다섯을 다 바치면 — 맨 우에 한 줄이 더 적히오.', '이 버튼을 다섯 번 누르면 재산이 한 칸씩 바쳐져요. 다섯 번을 다 누르면 — 맨 위에 한 줄이 더 적혀요.'],
    ['#house .hs6', '흐터진 한 집', '흩어진 한 집', '아래 단추를 누르면 한 집이 네 조각으로 찌져지오. 그 다음 한 사람을 눌러 떠나게 하면 — 남은 식구가 어찌 되는지 나오오.', '아래 버튼을 누르면 한 집이 네 조각으로 찢겨요. 그다음 한 사람을 눌러 떠나게 하면 — 남은 가족이 어떻게 되는지 나와요.'],
    ['#night .n6-stick', '그 밤', '그 밤', '누를 것 업소. 휠을 천천히 굴리면 여덟 장면이 영화처럼 넘어가오. 오른쪽 시간 줄을 누르면 그 장면으로 바로 가오.', '누를 것이 없어요. 휠을 천천히 굴리면 여덟 장면이 영화처럼 넘어가요. 오른쪽 시간 줄을 누르면 그 장면으로 바로 가요.'],
    ['#mountain .mt-poster', '얼굴 업는 수배', '얼굴 없는 수배', '어두운 숲에서는 마우스가 등불이오. 수배지 우에 손을 대고 잠시 기다리시압.', '어두운 숲에서는 마우스가 등불이에요. 수배지 위에 마우스를 대고 잠시 기다려 보세요.'],
    ['#land .l6w', '땅이 내노은 것', '땅이 내놓은 것', '산비탈을 누를 때마다 흰 표지가 하나 꼬치오 — 표지 하나가 한 사람. 다섯을 세면 산이 스스로 세기 시작하오.', '산비탈을 누를 때마다 흰 표식이 하나 꽂혀요 — 표식 하나가 한 사람. 다섯을 세면 산이 스스로 세기 시작해요.'],
    ['#dossier .ds-list', '조서가 밝힌 것', '조서가 밝힌 것', '검은 먹줄을 누르면 그 아래 조서의 글이 드러나오. 엽헤 노힌 당시 신문은 손을 대면 가까이 보이오.', '검은 먹줄을 누르면 그 아래 조서 내용이 드러나요. 옆의 당시 신문은 마우스를 대면 크게 보여요.'],
    ['#jar .jr-grid', '선반 우의 병', '선반 위의 병', '휠을 천천히 내리면 오른편 해가 한 줄씩 넘어가고, 우의 큰 숫자가 그 해로 바뀌오 — 병 속에서 몇 해째인지. 왼편 병 속의 세월도 함께 흐르오. 끗까지 따라가 보시압.', '휠을 천천히 내리면 오른쪽 해가 한 줄씩 넘어가고, 위의 큰 숫자가 그 해로 바뀌어요 — 병 속에서 몇 년째인지. 왼쪽 병 속의 세월도 함께 흘러요. 끝까지 따라가 보세요.']
  ];
  HELP.forEach(function (h) {
    var el = $(h[0]); if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var q = D.createElement('button'); q.type = 'button'; q.className = 'bt-q';
    q.setAttribute('aria-label', h[2] + ' — 이 장치 설명 보기');
    q.innerHTML = '<i aria-hidden="true">？</i><b>' + H('이건 무어요', '이건 뭐예요') + '</b>';
    ['click', 'pointerdown', 'pointerup', 'mousedown'].forEach(function (ev) { q.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    q.addEventListener('click', function (e) {
      e.preventDefault();
      if (W.ykGuide) W.ykGuide({ sel: h[0], t: [h[1], h[2]], b: [h[3], h[4]] });
    });
    el.appendChild(q);
  });
})();
