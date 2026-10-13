/* 경성야록 · 손기정 일장기 말소 사건 — 「붓을 든 손, 지워진 가슴」
   序 밤 열한 시 이 분 → 一 기뻐한 지면 → 二 가슴을 가린 나무 → 三 붓 → 四 편집국 명부 → 五 이백칠십구 일 → 六 손긔졍 KOREAN → 七 라디오 → 빈 가슴
   - 글자: <span class="hj" data-ko="오늘말">옛말</span> → 마우스를 올리면 오늘말로 바뀜 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = './img/';
  var AUD = '../case/audio/sonkijeong/';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function H(old, ko) {
    return ko && ko !== old
      ? '<span class="hj" tabindex="0" data-ko="' + esc(ko) + '">' + old + '</span>'
      : '<span class="hj" tabindex="0">' + old + '</span>';
  }
  function play(id) { var a = document.getElementById(id); if (!a) return; try { a.currentTime = 0; a.volume = 0.5; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }

  /* ── 옛말 ↔ 오늘말 ── */
  var hover = window.matchMedia && matchMedia('(hover: hover)').matches;
  function gloss(el, on) {
    if (!el.dataset.ko) return;
    if (on) { if (el.dataset.old == null) el.dataset.old = el.innerHTML; el.innerHTML = el.dataset.ko; el.classList.add('gloss'); }
    else if (el.dataset.old != null) { el.innerHTML = el.dataset.old; el.classList.remove('gloss'); }
  }
  if (hover) {
    document.addEventListener('mouseover', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, true); });
    document.addEventListener('mouseout', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, false); });
  } else {
    document.addEventListener('click', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.closest('button,a')) { e.stopPropagation(); gloss(h, !h.classList.contains('gloss')); } });
  }
  document.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches('.hj[data-ko]')) gloss(e.target, true); });
  document.addEventListener('focusout', function (e) { if (e.target.matches && e.target.matches('.hj[data-ko]')) gloss(e.target, false); });

  /* ── 머리: 90년 전 오늘 ── */
  (function () {
    var D = ['', '일', '이', '삼', '사', '오', '륙', '칠', '팔', '구'];
    var n2 = function (v) { return v < 10 ? D[v] : (Math.floor(v / 10) > 1 ? D[Math.floor(v / 10)] : '') + '십' + D[v % 10]; };
    var now = new Date(), y = now.getFullYear() - 90, m = now.getMonth() + 1, d = now.getDate();
    var wd = '일월화수목금토'[new Date(y, m - 1, d).getDay()];
    var h = now.getHours(), mi = now.getMinutes(), ap = h < 12 ? '오전' : '오후', hh = h % 12 || 12;
    var HR = ['', '한', '두', '세', '네', '다섯', '여섯', '닐곱', '여덟', '아홉', '열', '열한', '열두'];
    var td = $('.t-date'), tn = $('.t-now'), ta = $('.t-ago');
    if (td) td.innerHTML = H('소화 ' + n2(y - 1925) + ' 년 ' + (m === 10 ? '시' : m === 6 ? '류' : n2(m)) + '월 ' + n2(d) + '일 ' + wd + '요일', y + '년 ' + m + '월 ' + d + '일 ' + wd + '요일');
    if (tn) tn.innerHTML = H('시방 ' + ap + ' ' + HR[hh] + ' 시 ' + (mi ? n2(mi) + ' 분' : '정각'), '지금 ' + ap + ' ' + hh + '시 ' + mi + '분');
    if (ta) ta.textContent = y + ' · 90년 전 오늘날';
  })();

  /* ── 미드저니 그림 자리: case-maria/img/ 에 파일을 넣으면 저절로 바뀜 ── */
  $$('img[data-mj]').forEach(function (im) {
    var t = new Image();
    t.onload = function () { im.src = im.dataset.mj; im.classList.add('mj'); var fc = im.dataset.mjcap && im.parentNode.querySelector('figcaption'); if (fc) fc.innerHTML = H(im.dataset.mjcap); };
    t.onerror = function () { if (im.dataset.optional) im.remove(); };
    t.src = im.dataset.mj;
  });
  /* ── 머리 그림 넘김 ── */
  (function () {
    var i = 0;
    setInterval(function () { var s = $$('.hero-slide'); if (s.length < 2) return; s[i % s.length].classList.remove('active'); i = (i + 1) % s.length; s[i].classList.add('active'); }, 6500);
  })();

  /* ── 사건 요지: 봉함 뜯기 ── */
  $$('.cb-seal').forEach(function (b) {
    b.addEventListener('click', function () { var li = b.closest('li'); li.classList.add('opened'); b.remove(); play('sfxWhoosh'); });
  });


  /* =========================================================
     第一章  기뻐한 지면 — 닷새의 지면 (신문 이름을 바로 적음)
     ========================================================= */
  var ARTS = [
    { d: ['팔월 십일', '8월 10일'], tag: ['우승 속보 · 호외', '우승 속보 · 호외'], paper: '조선일보', date: '1936.08.10', img: '19360810.jpg',
      title: '손기정 1위, 남승룡 3위 — 베를린에서 날아온 지급전보',
      lead: '1936년 8월 10일, 조선일보는 호외를 찍었다. 「대망의 세계 마라손 제패 완성」 「조선남아 의기충천!」',
      body: ['베를린 올림픽 스타디움발 지급전보는 "30여 개국 56명이 출장한 마라톤에서 손기정 군이 2시간 29분 19초 2로 일착, 남승룡 군이 삼착"이라고 전했다.',
             '경기는 한국 시각 8월 9일 밤 11시 2분에 출발했다. 2위는 영국의 하퍼, 2시간 31분 23초 2였다.',
             '이 호외는 동아일보가 아니라 조선일보의 것이다. 그날 경성의 신문들은 앞다투어 같은 소식을 찍었다.'],
      sum: ['손기정 1위(2시간 29분 19초 2), 남승룡 3위(2시간 31분 42초).', '30여 개국 56명이 달린 경기, 출발은 한국 시각 밤 11시 2분.', '이 지면은 조선일보 호외다 — 신문들이 앞다투어 같은 소식을 전했다.'],
      keys: ['손기정', '남승룡', '호외'],
      qa: [['이 보도의 요점은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '손기정 1위(2시간 29분 19초 2), 남승룡 3위(2시간 31분 42초). 30여 개국 56명이 달린 경기였다.'], ['소식은 엇더케 닿앗소?', '소식은 어떻게 전해졌나요?', '베를린 올림픽 스타디움발 지급전보로 왔고, 신문사들은 이튿날 호외를 찍었다.'], ['이 지면에서 눈여겨볼 대목은 어대요?', '이 지면에서 주목할 부분은 어디인가요?', '이 호외는 조선일보 것이다. 이 사건에선 「어느 신문이었나」가 끝까지 중요해진다.']] },
    { d: ['팔월 십일일', '8월 11일'], tag: ['세계 제패', '세계 제패'], paper: '동아일보', date: '1936.08.11', img: '19360811.jpg',
      title: '세계 제패의 개가 — "이미 헐린 성일망정"',
      lead: '동아일보는 1면 머리에 「세계 제패의 개가」를 걸고, 「성전의 경과」로 그날의 레이스를 되짚었다.',
      body: ['1면 머리는 「세계 제패의 개가」였다. 같은 날 2면에는 연재 「조선의 아들 손기정 세계의 영웅이 되기까지」 첫 회와, 두 사람의 남북 고향의 축하 소식을 담은 「개선의 기쁨이 충천한 양웅의 남북 고향」이 실렸다.',
             '지면은 마라톤 승자를 맞으려 성벽을 헐었다는 그리스 고사를 들어 이렇게 썼다. "우리는 이미 헐린 성일망정 새 힘과 새 마음으로 우리 두 용사를 맞어 드리리라."',
             '「일본」이라는 말 대신 「조선」과 「우리」가 지면을 채웠다.'],
      sum: ['1면 「세계 제패의 개가」, 2면 「조선의 아들 손기정」 연재 첫 회.', '"이미 헐린 성일망정" — 나라를 잃은 현실을 헐린 성에 빗댔다.', '지면은 「일본」 대신 「조선」과 「우리」를 썼다.'],
      keys: ['세계제패', '라디오중계', '헐린성'],
      qa: [['이 보도의 요점은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '1면 머리에 「세계 제패의 개가」를 걸었다. 2면에는 그가 걸어온 길을 되짚는 연재가 시작됐다.'], ['그 밤 경성은 엇더하엿소?', '그날 밤 경성은 어땠나요?', '장맛비 속에 시민들이 동아일보사 앞에 모여 스피커로 라디오 중계를 들었다. 새벽 1시 30분, 우승 소식에 거리로 쏟아져 나왔다. (동아일보 2006년 4월 1일 창간특집)'], ['지면이 고른 말에 무엇이 숨어 잇소?', '신문이 고른 말에 무엇이 숨어 있나요?', '「일본」 대신 「조선」과 「우리」를 썼다. 지면은 이미, 할 수 있는 만큼 그 표지를 비켜 가고 있었다.']] },
    { d: ['팔월 십이일', '8월 12일'], tag: ['환영하자', '환영하자'], paper: '동아일보', date: '1936.08.12', img: '19360812p.jpg',
      title: '「우리 민족의 최대의 영예에 전체적으로 환영하자」',
      lead: '우승 사흘째, 동아일보는 한 면을 환영으로 채웠다. 조선체육회가 앞장서 여러 단체가 함께 두 선수를 맞자는 기사였다.',
      body: ['지면 가운데에는 「우리 민족의 최대의 영예에 전체적으로 환영하자」는 제목이 섰다. 조선체육회 주최로 여러 단체가 연합해 환영하자는 내용이다.',
             '옆에는 「첩보에 만도 환희」 — 승전 소식에 온 도시가 기뻐했다는 기사와 사진이, 손기정의 고향 신의주 거리의 만세 소리가 함께 실렸다.',
             '신문은 「민족」이라는 말을 머리에 걸었다. 축하는 이날 절정에 올랐다 — 그리고 곧, 마음껏 축하할 수 없는 날들이 온다.'],
      sum: ['조선체육회를 중심으로 「전체적으로 환영하자」는 기사가 실렸다.', '온 도시의 기쁨과 신의주 거리의 만세 소리가 함께 실렸다.', '「민족」이라는 말이 머리에 걸린 날 — 축하는 이날 절정이었다.'],
      keys: ['전체적으로환영하자', '조선체육회', '신의주'],
      qa: [['이날 지면은 무엇을 말하엿소?', '이날 신문은 무엇을 말했나요?', '「우리 민족의 최대의 영예에 전체적으로 환영하자」 — 조선체육회가 앞장서 함께 환영하자는 기사다.'], ['어대서 기뻐하엿소?', '어디서 기뻐했나요?', '경성과 그의 고향 신의주 — 거리마다 만세 소리가 났다고 지면은 적었다.'], ['이 날이 중요한 까닭은?', '이 날이 중요한 이유는?', '축하가 절정에 오른 날이다. 다음 날, 다른 판의 사진에서 처음으로 가슴이 지워진다.']] },
    { d: ['팔월 십삼일', '8월 13일'], tag: ['같은 날, 다른 판', '같은 날, 다른 판'], paper: '동아일보', date: '1936.08.13', img: '19360813.jpg', note: ['이 지면(일반판)에는 지운 사진이 업소. 지운 사진은 같은 날 지방판 조간 이면과 조선중앙일보 사면에 실렷소.', '이 지면(일반판)에는 지운 사진이 없습니다. 지운 사진은 같은 날 지방판 조간 2면과 조선중앙일보 4면에 실렸습니다.'],
      title: '「조선의 아들 손기정」 — 그리고 같은 날, 다른 판의 가슴',
      lead: '동아일보는 연재 「조선의 아들 손기정」 셋째 회에서 그가 세계의 패왕이 되기까지를 적었다.',
      body: ['1932년 경성–영등포 마라톤 2위. 그 길로 양정고보에 들어가 본격적으로 달리기 시작했고, 1935년에는 2시간 26분 42초를 기록했다.',
             '같은 날, 조선중앙일보 4면과 동아일보 지방판 조간 2면에 손기정의 사진이 실렸다. 가슴의 일장기는 — 이미 지워져 있었다. 화면의 이 지면은 일반판이라 그 사진이 없다.',
             '이때는 아무도 문제 삼지 않았다. 같은 가슴은 열이틀 뒤, 다시 지워진다.'],
      sum: ['연재 「조선의 아들 손기정」이 그가 걸어온 길을 되짚었다.', '같은 날 조선중앙일보 4면과 동아일보 지방판 2면이 일장기를 지운 사진을 실었다.', '이때는 아무도 문제 삼지 않았다 — 열이틀 뒤, 같은 일이 다시 일어난다.'],
      keys: ['조선의아들', '양정고보', '같은날다른판'],
      qa: [['이 연재는 무엇을 적엇소?', '이 연재는 무엇을 다뤘나요?', '1932년 경성–영등포 마라톤 2위부터 양정고보 입학, 1935년 2시간 26분 42초까지 — 그가 걸어온 길이다.'], ['같은 날 다른 판에선 무슨 일이 잇섯소?', '같은 날 다른 판에선 무슨 일이 있었나요?', '지방판 조간 2면과 조선중앙일보 4면에, 일장기를 지운 사진이 실렸다. 화면의 이 일반판에는 그 사진이 없다.'], ['그때 문제가 되엇소?', '그때 문제가 됐나요?', '아무도 문제 삼지 않았다. 열이틀 뒤, 같은 일이 다시 일어난다.']] }
  ];
  (function () {
    var tl = $('#rTimeline'), book = $('#rBook'); if (!tl || !book) return;
    var N = ARTS.length, cur = 0, tab = 0, cmp = 100;
    tl.innerHTML = ARTS.map(function (a, i) {
      return '<li><button type="button" data-i="' + i + '"><span class="dot"></span><strong>' + H(a.d[0], a.d[1]) + '</strong><small>' + H(a.tag[0], a.tag[1]) + '</small>' + (a.mark ? '<span class="tl-mark">' + a.mark + '</span>' : '') + '</button></li>';
    }).join('');
    function setCmp(v) {
      cmp = v;
      var s = $('.plate-scan', book), l = $('.plate-line', book), r = $('.plate-range', book), f = $('.plate-cmp', book);
      if (s) s.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      if (l) l.style.left = v + '%';
      if (r && +r.value !== v) r.value = v;
      $$('.plate-switch button', book).forEach(function (b, i) { b.classList.toggle('active', i === 0 ? v > 50 : v <= 50); });
      if (f) f.classList.toggle('full-news', v === 0);
    }
    var Q = [['이 보도의 요점은 무엇이오?', '이 보도의 핵심은 무엇인가요?'], ['그때 형편은 엇더하엿소?', '당시 어떤 상황이었나요?'], ['긔록에서 눈여겨볼 대목은 어대요?', '기록에서 주목할 부분은 어디인가요?']];
    function draw(anim) {
      var a = ARTS[cur];
      $$('button', tl).forEach(function (b, i) { b.classList.toggle('active', i === cur); });
      tl.style.setProperty('--prog', (cur / (N - 1) * 66.667) + '%');
      var news = '<div class="news26" aria-label="2026년 뉴스로 다시 쓴 기사"><div class="n26-bar"><b>경성야록</b><span>문화</span><span>스포츠</span><span>아카이브</span></div><div class="n26-body"><span class="n26-tag">아카이브 단독</span><h4>' + a.title + '</h4><p class="n26-meta">경성야록 문화부 · 원 보도 ' + a.paper + ' ' + a.date + ' · 2026년 다시 씀</p>' +
        '<p class="n26-lead">' + a.lead + '</p>' + a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '<div class="n26-keys">' + a.keys.map(function (k) { return '<span>#' + k + '</span>'; }).join('') + '</div><p class="n26-note">※ 1936년 ' + a.paper + ' 원문을 바탕으로 오늘의 기사 형식으로 다시 쓴 것입니다.</p></div></div>';
      book.innerHTML =
        '<div class="page left"><div class="page-head"><strong>' + a.paper + '</strong>' + (a.paper === '동아일보' ? '<span class="src-tag da">실제 동아일보 기사</span>' : '<span class="src-tag ot">당대 다른 신문</span>') + '<span>' + H('소화 십일 년 원문판', '1936년 원문판') + '</span><em>' + H(a.d[0], a.d[1]) + '</em></div>' +
        '<div class="page-title"><span class="wm" aria-hidden="true">原文記事</span><h3>' + H('원문 긔사', '원문 기사') + '</h3><small>' + H(a.paper + ' 소화 십일 년 ' + a.d[0] + ' 보도', a.paper + ' 1936년 ' + a.d[1] + ' 보도') + '</small></div>' +
        '<div class="plate-switch"><button type="button" class="active">' + H('소화 십일 년 지면', '1936년 지면') + '</button><button type="button">2026년 뉴스</button></div>' +
        '<figure class="plate plate-cmp">' + news + '<img class="plate-scan" alt="' + a.date + ' ' + a.paper + ' 원문 지면" src="' + IMG + 'scan/' + a.img + '"><div class="plate-line"><span class="plate-handle">‹ ›</span></div><input class="plate-range" type="range" min="0" max="100" value="100" aria-label="원문 지면과 2026년 뉴스 비교"><span class="plate-hint">' + H('손잡이를 왼편으로 당기면 2026년 뉴스로 바뀌오', '손잡이를 왼쪽으로 당기면 2026년 뉴스로 바뀝니다') + '</span></figure>' +
        '<p class="guide"><span class="guide-box"></span>' + H('테두리 친 곳이 그날 실린 긔사이오.', '테두리를 친 곳이 그날 실린 기사입니다.') + '</p></div>' +
        '<div class="page right"><div class="page-head"><strong>' + H('경성야록') + '</strong><span>' + H('오늘판') + '</span><em>' + H('옛 긔록 → 오늘', '옛 기록 → 오늘') + '</em></div>' +
        '<div class="report-tabs" role="tablist"><button type="button" role="tab" class="' + (tab === 0 ? 'active' : '') + '">' + H('오늘 말로 읽기') + '</button><button type="button" role="tab" class="' + (tab === 1 ? 'active' : '') + '">' + H('간추려 읽기', '요약해서 읽기') + '</button></div>' +
        '<article class="modern-news"><span class="kicker">문화예술면 <i>|</i> ' + H(a.d[0], a.d[1]) + ' <i>|</i> ' + a.paper + '</span>' +
        (a.note ? '<div class="sk-artnote"><b>' + H('알려 두오', '알림') + '</b><p>' + H(a.note[0], a.note[1]) + '</p></div>' : '') +
        '<div class="news-grid"><div><h3>' + a.title + '</h3><p class="lead">' + a.lead + '</p><span class="seal-rule" aria-hidden="true"></span><div class="body">' +
        (tab === 0 ? a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') : '<ol class="mr-sum">' + a.sum.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>') + '</div></div></div>' +
        '<div class="record-talk"><div class="talk-head"><h4>' + H('긔록에게 뭇다', '기록에게 묻다') + '</h4><p>' + H('이 긔사에 궁금한 것을 긔록과 함께 풀어 보시압.', '이 기사에 궁금한 것을 기록과 함께 풀어 보세요.') + '</p></div>' +
        a.qa.map(function (q, k) { return '<div class="talk-pair show" style="animation-delay:' + (0.4 + k * 0.9) + 's"><div class="q-row"><span class="face">문</span><p class="bubble q">' + H(q[0], q[1]) + '</p></div><div class="a-row"><p class="bubble a">' + q[2] + '</p><span class="face a">답</span></div></div>'; }).join('') + '</div>' +
        '</article></div>' +
        '<div class="book-foot"><span>' + H('원 긔사 · ' + a.paper + ' · 소화 십일 년 ' + a.d[0], '원 기사 · ' + a.paper + ' · 1936년 ' + a.d[1]) + '</span><span><strong>京城野錄</strong> ' + H('옛 긔록 → 오늘', '옛 기록 → 오늘') + '</span></div>';
      var wrap = book.parentNode;
      $('.book-arrow.left', wrap).disabled = cur === 0;
      $('.book-arrow.right', wrap).disabled = cur === N - 1;
      setCmp(100);
      if (anim) { book.classList.remove('mr-turn'); void book.offsetWidth; book.classList.add('mr-turn'); }
    }
    function go(i) { if (i < 0 || i >= N || i === cur) return; cur = i; tab = 0; draw(true); play('sfxWhoosh'); }
    tl.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (b) go(+b.dataset.i); });
    book.parentNode.addEventListener('click', function (e) {
      if (e.target.closest('.book-arrow.left')) go(cur - 1);
      else if (e.target.closest('.book-arrow.right')) go(cur + 1);
      var sw = e.target.closest('.plate-switch button');
      if (sw) setCmp(sw.previousElementSibling ? 0 : 100);
      var rt = e.target.closest('.report-tabs button');
      if (rt) { tab = rt.previousElementSibling ? 1 : 0; var keep = cmp; draw(false); setCmp(keep); }
    });
    book.addEventListener('input', function (e) { if (e.target.classList.contains('plate-range')) setCmp(+e.target.value); });
    draw(false);
  })();

  /* =========================================================
     第三章  붓 — 마우스가 곧 그날 편집국의 붓
     ========================================================= */
  (function () {
    var sec = $('#brush'), pl = sec && $('.bs-plate', sec); if (!pl) return;
    var cv = $('.bs-cv', pl), ctx = cv.getContext('2d'), meter = $('.bs-meter i', pl), steps = $$('.bs-steps li', sec);
    var W = 0, Hh = 0, flag = null, done = false, last = null;
    /* 원판 560×810 에서 일장기 자리: x 233–345, y 382–483 */
    function size() {
      var w = cv.offsetWidth, h = cv.offsetHeight; if (!w || !h || (w === W && h === Hh)) return;
      var keep = W ? ctx.getImageData(0, 0, W, Hh) : null;
      W = cv.width = w; Hh = cv.height = h;
      var sx = W / 560, sy = Hh / 810;
      flag = { x: 233 * sx, y: 382 * sy, w: 112 * sx, h: 101 * sy };
      if (keep) ctx.putImageData(keep, 0, 0);
    }
    function pos(e) { var r = cv.getBoundingClientRect(), k = cv.offsetWidth / r.width; return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k }; }
    function dab(a, b) {
      var rad = Math.max(9, W / 30);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(240,236,226,.96)'; ctx.lineWidth = rad * 1.6; ctx.shadowColor = 'rgba(236,231,220,.9)'; ctx.shadowBlur = rad * .7;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.globalAlpha = .3; ctx.strokeStyle = 'rgba(206,198,182,.8)'; ctx.lineWidth = rad * .45; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(a.x + rad * .3, a.y + rad * .2); ctx.lineTo(b.x + rad * .3, b.y + rad * .2); ctx.stroke();
      ctx.restore();
    }
    function cover() {
      if (!flag) return 0;
      var d = ctx.getImageData(flag.x | 0, flag.y | 0, Math.max(1, flag.w | 0), Math.max(1, flag.h | 0)).data, n = 0, t = 0;
      for (var i = 3; i < d.length; i += 4 * 7) { t++; if (d[i] > 150) n++; }
      return t ? n / t : 0;
    }
    function show(c) { steps.forEach(function (li) { li.classList.toggle('on', c >= +li.dataset.at); }); }
    function finish() {
      if (done) return; done = true; show(1); meter.style.width = '100%';
      sec.classList.add('printed'); play('sfxBell');
    }
    function move(e) {
      size(); if (done) return;
      var p = pos(e); if (last) dab(last, p); else dab(p, { x: p.x + .1, y: p.y + .1 }); last = p;
      var c = cover() / .8; meter.style.width = Math.min(100, c * 100) + '%'; show(Math.min(.99, c));
      if (c >= 1) finish();
    }
    pl.addEventListener('pointerenter', function () { size(); last = null; pl.classList.add('over'); });
    pl.addEventListener('pointerleave', function () { last = null; pl.classList.remove('over'); });
    cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerdown', function (e) { last = null; move(e); });
    /* 키보드로 들어오면 붓이 저절로 지나감 */
    pl.addEventListener('focus', function () {
      if (done) return; size(); var i = 0, rows = 8;
      (function stroke() {
        if (done) return; if (i >= rows) { finish(); return; }
        var y = flag.y + flag.h * (i + .5) / rows; dab({ x: flag.x - 4, y: y }, { x: flag.x + flag.w + 4, y: y }); i++;
        var c = cover() / .8; meter.style.width = Math.min(100, c * 100) + '%'; show(Math.min(.99, c)); setTimeout(stroke, 170);
      })();
    });
    window.addEventListener('resize', size); setTimeout(size, 500);
  })();

  /* =========================================================
     第五章  이백칠십구 일 — 빈 지면이 하루씩
     ========================================================= */
  (function () {
    var root = $('#days'); if (!root) return;
    var MK = { '1936.8.29': 'm0', '1936.9.5': 'm1', '1936.10.17': 'm2', '1937.6.2': 'm3' };
    var cells = [], d = new Date(1936, 7, 29);
    for (var n = 0; n < 278; n++) {
      var k = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate(), m = MK[k];
      cells.push('<li' + (m ? ' class="' + m + '"' : '') + (d.getDate() === 1 ? ' data-m="' + '一二三四五六七八九十'.split('').concat(['十一','十二'])[d.getMonth()] + '月"' : '') + ' style="--n:' + n + '" title="' + k + '"></li>');
      d.setDate(d.getDate() + 1);
    }
    root.innerHTML = cells.join('');
  })();

  /* =========================================================
     第六章  라듸오 — 지운 자리의 주파수 (원고 1968·1974·1980·1986)
     ========================================================= */
  var JK = './';
  var ST = [
    { y: '1936', ang: 18, no: '제0호', when: '1936년 · 동아일보', au: null, moon: 70,
      h: '붓 한 번에,<br><em>아홉 달</em>',
      t: ['붓 한 번에, 아홉 달', '붓 한 번에, 아홉 달'],
      b: ['8월 25일 일장기를 지운 사진 → 8월 29일 무기정간', '기자 여덟 명 구속 · 약 40일 · 사장·주필·편집국장 사임'],
      d: ['이 칸은 녹음이 업소. 소화 십일 년 팔월의 지면이 남긴 것만 화면으로 전하오. 다이알을 돌리면, 그 빈자리가 지나온 세월이 잡히오.', '이 칸은 녹음이 없습니다. 1936년 8월의 지면이 남긴 것만 화면으로 전합니다. 다이얼을 돌리면, 그 빈자리가 지나온 세월이 잡힙니다.'],
      link: '모든 주파수는 이 한 장의 사진에서 시작된다 — 지운 가슴.' },
    { y: '1968', ang: 90, no: '제1호', when: '1968년 · 신동아', au: 'sonkijeong_radio01.mp3', card: 'sonkijeong-case01.jpg', moon: 28,
      h: '차관 기사 한 줄에<br>정권은 <em>기자</em>를 겨눴다',
      t: ['차관 긔사 한 줄에, 정권은 긔자를 겨누엇다', '차관 기사 한 줄에, 정권은 기자를 겨눴다'],
      b: ['월간 《신동아》가 외자 도입과 정치자금 의혹을 보도', '해당 호 압수, 관련 언론인 구속'],
      d: ['긔사 한 편이 긔자의 구속으로 도라온 일이오. 그때의 긔록을 라듸오로 꾸며 노앗소.', '기사 한 편이 기자의 구속으로 돌아온 일입니다. 당시 기록을 라디오 형식으로 재구성했습니다.'],
      link: '1936년의 『신동아』도 같은 사진을 실었다가 잡지부장이 끌려갔다. 서른두 해 뒤, 같은 잡지가 다시 겨눠졌다.' },
    { y: '1974', ang: 162, no: '제2호', when: '1974~1975년 · 동아일보', au: 'sonkijeong_radio02.mp3', card: 'sonkijeong-case02.jpg', moon: 22,
      h: '가장 큰 기사는<br><em>비어 있는 광고면</em>이었다',
      t: ['가장 큰 긔사는 비어 잇는 광고면이엇다', '가장 큰 기사는 비어 있는 광고면이었다'],
      b: ['자유언론실천선언 이후 광고 계약이 대규모로 해약됨', '채워지지 않은 광고면이 압박의 증거가 됨'],
      d: ['빈 지면이 도리어 가장 큰 말이 된 일이오. 그때 긔록을 라듸오로 다시 드러 보시압.', '빈 지면이 오히려 가장 큰 말이 된 일입니다. 당시 기록을 라디오로 다시 들어 보세요.'],
      link: '1936년엔 가슴이 비었고, 1974년엔 광고면이 비었다. 독자는 두 번 다 — 무엇이 지워졌는지 알아보았다.' },
    { y: '1980', ang: 234, no: '제3호', when: '1980년 · 언론 검열', au: 'sonkijeong_radio03.mp3', card: 'sonkijeong-case03.jpg', moon: 76,
      h: '검열이 지운 자리를<br>그대로 <em>비워</em> 뒀다',
      t: ['검열이 지운 자리를 그대로 비워 두엇다', '검열이 지운 자리를 그대로 비워 뒀다'],
      b: ['비상계엄 확대 이후 사전 검열 강화', '삭제된 자리를 다른 글로 메우지 않고 빈칸으로 남김'],
      d: ['지운 자리를 숨기지 안코 비워 둔 일이오. 그때 긔록을 라듸오로 꾸며 노앗소.', '지운 자리를 숨기지 않고 비워 둔 일입니다. 당시 기록을 라디오 형식으로 재구성했습니다.'],
      link: '지운 자리를 감추지 않는 것 — 그것이 지면에 남은 마지막 말이었다.' },
    { y: '1986', ang: 306, no: '제4호', when: '1986년 · 보도지침 폭로', au: 'sonkijeong_radio04.mp3', card: 'sonkijeong-case04.jpg', moon: 34,
      h: '정부가 매일 보낸<br><em>보도지침</em>이 세상에 나왔다',
      t: ['정부가 매일 보낸 보도지침이 세상에 나왓다', '정부가 매일 보낸 보도지침이 세상에 나왔다'],
      b: ['무엇을 쓸지, 사진의 크기와 기사의 자리까지 정한 문서', '폭로한 언론인들이 구속됨'],
      d: ['무엇을 지우라고 시킨 문서가 처음으로 드러난 일이오. 그때 긔록을 라듸오로 다시 드러 보시압.', '무엇을 지우라고 시킨 문서가 처음으로 드러난 일입니다. 당시 기록을 라디오로 다시 들어 보세요.'],
      link: '1936년의 붓은 기자가 들었다. 1986년엔 — 무엇을 지울지 정하는 손이 따로 있었다.' }
  ];
  var GAPS = [
    ['1936', '1968', '정간이 풀리고, 해방이 오고, 전쟁이 지나도 — 지면을 겨누는 손은 남앗소.', '정간이 풀리고, 해방이 오고, 전쟁이 지나도 — 신문을 겨누는 손은 남았다.'],
    ['1968', '1974', '긔자를 잡아가는 대신, 이번에는 돈줄을 쥐엇소.', '기자를 잡아가는 대신, 이번에는 돈줄을 쥐었다.'],
    ['1974', '1980', '비운 광고면 다음엔, 비운 긔사면이 왓소.', '비운 광고면 다음엔, 비운 기사면이 왔다.'],
    ['1980', '1986', '지우는 일이, 날마다 내려오는 문서가 되엇소.', '지우는 일이, 날마다 내려오는 문서가 되었다.'],
    ['1986', '1936', '그 문서를 거슬러 올라가면 — 다시 소화 십일 년, 흰 옷 입은 가슴.', '그 문서를 거슬러 올라가면 — 다시 1936년, 흰 옷 입은 가슴.']
  ];

  (function () {
    var root = $('#mrRadio'); if (!root) return;
    var LO = 550, HI = 1500, freqOf = function (a) { return LO + ((a % 360) + 360) % 360 / 360 * (HI - LO); };
    var pct = function (f) { return (f - LO) / (HI - LO) * 100; };
    var HILLS = '<svg class="rx-hills" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46 L40 24 L76 40 L118 12 L160 38 L196 22 L236 42 L270 28 L300 38 L300 60 L0 60Z" fill="#221d17"></path><path d="M0 54 L60 42 L110 50 L160 40 L214 52 L260 44 L300 50 L300 60 L0 60Z" fill="#191510"></path></svg>';
    root.innerHTML =
      '<div class="rx-panel rx-room"><div class="rx-room-bg" aria-hidden="true" style="background-image:url(\'' + JK + 'img/case/room.jpg\')"></div>' +
        '<div class="rx-mast"><strong>京城野錄</strong><small>' + H('긔록 수신긔', '기록 수신기') + '</small></div>' +
        '<button type="button" class="rx-radio" aria-label="라디오 켜기"><span class="rx-glow" aria-hidden="true"></span><img alt="1930년대 나무 라디오 (재현 그림)" draggable="false" src="' + JK + 'img/case/radio.png"><span class="yk-credit">재현</span></button>' +
        '<p class="rx-hint">' + H('라듸오를 눌러<br>긔록의 주파수를 바드시오.', '라디오를 눌러<br>기록의 주파수를 받으세요.') + '</p></div>' +
      '<div class="rx-panel rx-tuner"><div class="rx-scale"><div class="rx-nums"><span>550</span><span>700</span><span>900</span><span>1100</span><span>1300</span><span>1500</span></div><div class="rx-ticks"></div><span class="rx-needle"></span>' +
        '<div class="rx-years">' + ST.map(function (s, i) { return '<button type="button" data-i="' + i + '" style="left:' + pct(freqOf(s.ang)) + '%">' + s.y + '</button>'; }).join('') + '</div></div>' +
        '<div class="rx-dial-wrap"><span class="rx-screw a"></span><span class="rx-screw b"></span><span class="rx-screw c"></span><span class="rx-screw d"></span><span class="rx-dial-mark" aria-hidden="true"></span>' +
        '<div class="rx-dial" role="slider" tabindex="0" aria-label="주파수 다이얼. 좌우 화살표로도 돌릴 수 있습니다." aria-valuemin="550" aria-valuemax="1500"><img alt="" draggable="false" src="' + JK + 'img/case/dial.png"></div></div>' +
        '<div class="rx-readout">---<small>키로</small></div><div class="rx-bars">' + new Array(23).join('<i></i>') + '</div><span class="rx-signal">' + H('잡히는 정도') + '</span></div>' +
      '<div class="rx-panel rx-air"><div class="rx-screen"><div class="rx-screen-top"><span class="rx-when">' + H('수신 대긔', '수신 대기') + '</span><span class="rx-onair">' + H('방송 중이오', '방송 중') + '</span></div>' +
        '<div class="rx-visual"><span class="rx-moon"></span>' + HILLS + '<p class="rx-static">' + H('전원이 꺼져 잇소', '전원이 꺼져 있습니다') + '</p></div>' +
        '<div class="rx-player"><button type="button" class="rx-play" disabled aria-label="재생"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"></path></svg></button><div class="rx-track"><canvas width="228" height="27"></canvas><span></span></div><span class="rx-time">00:00 / 00:00</span></div></div>' +
        '<article class="rx-scrap"><div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span></div><p class="rx-wait">' + H('이 라듸오가 들려줄 다섯 칸', '이 라디오가 들려줄 다섯 칸') + '</p><ol class="rx-index">' +
          ST.map(function (s, i) { return '<li data-i="' + i + '"><span>' + s.y + '</span>' + H(s.t[0], s.t[1]) + '</li>'; }).join('') + '</ol></article></div>';
    var dial = $('.rx-dial', root), needle = $('.rx-needle', root), ro = $('.rx-readout', root), bars = $$('.rx-bars i', root);
    var vis = $('.rx-visual', root), when = $('.rx-when', root), onair = $('.rx-onair', root), scrap = $('.rx-scrap', root);
    var pbtn = $('.rx-play', root), trk = $('.rx-track span', root), tm = $('.rx-time', root), cv = $('.rx-track canvas', root);
    var au = $('#disc'), stc = new Audio('../case-jukcheomjeong/audio/radio-static.mp3'); stc.loop = true; stc.volume = 0;
    var on = false, rot = 0, cur = -1, anim = 0;
    var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"></path></svg>', PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"></path></svg>';
    var mod = function (a) { return ((a % 360) + 360) % 360; };
    var dist = function (a, b) { var d = Math.abs(mod(a) - mod(b)); return Math.min(d, 360 - d); };
    function fmt(s) { s = Math.max(0, Math.floor(s || 0)); return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2); }
    function wave(p) {
      var c = cv.getContext('2d'), W = cv.width, Hh = cv.height, n = 64; c.clearRect(0, 0, W, Hh);
      for (var i = 0; i < n; i++) {
        var h = (0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + (cur + 1) * 3) * Math.cos(i * 0.43))) * Hh;
        c.fillStyle = i / n < p ? '#e7c98f' : '#e7dbc255'; c.fillRect(i * (W / n), (Hh - h) / 2, W / n - 1.5, h);
      }
    }
    function nearest() { var bi = 0, bd = 999; ST.forEach(function (s, i) { var d = dist(rot, s.ang); if (d < bd) { bd = d; bi = i; } }); return { i: bi, d: bd }; }
    function screenOff(msg) {
      vis.classList.remove('has-card');
      vis.innerHTML = '<span class="rx-moon"></span>' + HILLS + '<p class="rx-static">' + msg + '</p>';
    }
    function setStation(i) {
      if (cur === i) return; cur = i; var s = ST[i];
      root.classList.add('tuned'); onair.classList.add('live');
      when.textContent = s.when;
      vis.innerHTML = '<span class="rx-moon" style="left:' + s.moon + '%"></span>' + HILLS + '<h4>' + s.h + '</h4>' +
        (s.card ? '<button type="button" class="rx-card rx-vcard" data-card="' + s.card + '" aria-label="카드뉴스 크게 보기"><img alt="' + s.y + ' 카드뉴스" src="' + JK + 'img/case/' + s.card + '"><span>' + H('크게 보기') + '</span></button>' : '');
      vis.classList.toggle('has-card', !!s.card);
      $$('.rx-years button', root).forEach(function (b, j) { b.classList.toggle('active', j === i); });
      $$('.rx-index li', root).forEach(function (b, j) { b.classList.toggle('on', j === i); });
      scrap.innerHTML = '<div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span><em>' + s.no + ' · ' + s.y + '</em></div>' +
        '<h5>' + H(s.t[0], s.t[1]) + '</h5><ul>' + s.b.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p>' + H(s.d[0], s.d[1]) + '</p>' +
        (s.link ? '<p class="rx-link"><b>' + H('1936년과 겹치는 자리', '1936년과 겹치는 자리') + '</b>' + s.link + '</p>' : '') +
        '<div class="rx-scrap-foot"><button type="button" class="rx-retune">' + H('다른 주파수 차즈시오', '다른 주파수 찾기') + '</button>' +
        '</div>';
      if (s.au) { au.src = AUD + s.au; au.currentTime = 0; var p = au.play(); if (p && p.catch) p.catch(function () {}); pbtn.disabled = false; }
      else { au.pause(); au.removeAttribute('src'); pbtn.disabled = true; tm.textContent = '녹음 없음 · 지면만 남음'; trk.style.width = '0'; wave(0); }
      play('sfxBell');
    }
    var gap = -1;
    function between() {
      vis.classList.remove('has-card');
      var SP = 360 / ST.length, g = Math.floor(mod(rot - ST[0].ang) / SP) % ST.length; if (g === gap) return; gap = g; var G = GAPS[g];
      when.innerHTML = H('주파수 사이', '주파수 사이') + ' · ' + G[0] + ' → ' + G[1];
      scrap.innerHTML = '<div class="rx-scrap-head"><span>' + H('주파수 사이', '주파수 사이') + '</span><em>' + G[0] + ' → ' + G[1] + '</em></div><p class="rx-wait">' + H('두 칸 사이에서 이어지는 것을 드르시오. 바늘을 조금 더 돌리면 다음 이약이가 잡히오.', '두 칸 사이에서 이어지는 것을 들어 보세요. 바늘을 조금 더 돌리면 다음 이야기가 잡힙니다.') + '</p><ol class="rx-index">' + ST.map(function (s, i) { return '<li data-i="' + i + '"><span>' + s.y + '</span>' + H(s.t[0], s.t[1]) + '</li>'; }).join('') + '</ol>';
      vis.innerHTML = '<span class="rx-moon"></span>' + HILLS + '<p class="rx-between"><small>' + G[0] + ' ─── ' + G[1] + '</small>' + H(G[2], G[3]) + '</p>';
    }
    function untune() {
      if (cur < 0) return; cur = -1;
      root.classList.remove('tuned'); onair.classList.remove('live'); au.pause();
      when.innerHTML = H('주파수를 차즈는 중', '주파수를 찾는 중');
      gap = -1;
      $$('.rx-years button', root).forEach(function (b) { b.classList.remove('active'); });
      pbtn.disabled = true;
    }
    function update() {
      dial.style.transform = 'rotate(' + rot + 'deg)';
      var f = freqOf(rot); needle.style.left = pct(f) + '%';
      dial.setAttribute('aria-valuenow', Math.round(f));
      if (!on) return;
      ro.innerHTML = Math.round(f) + '<small>키로</small>';
      var n = nearest(), sig = Math.max(0, 1 - n.d / 22);
      bars.forEach(function (b, k) { b.classList.toggle('on', k < Math.round(sig * bars.length)); });
      if (n.d < 4) { stc.volume = ST[n.i].au ? 0.04 : 0.32; setStation(n.i); }
      else { stc.volume = Math.min(0.5, 0.18 + (1 - sig) * 0.3); untune(); between(); }
    }
    function power(v) {
      on = v; root.classList.toggle('on', v); root.classList.toggle('off', !v);
      $('.rx-radio', root).setAttribute('aria-label', v ? '라디오 끄기' : '라디오 켜기');
      $('.rx-hint', root).innerHTML = v ? H('가운데 다이알을 돌려<br>긔록의 주파수를 차즈시오.', '가운데 다이얼을 돌려<br>기록의 주파수를 찾으세요.') : H('라듸오를 눌러<br>긔록의 주파수를 바드시오.', '라디오를 눌러<br>기록의 주파수를 받으세요.');
      if (v) {
        var b = $('#bgm'); if (b && !b.paused) b.pause();
        var p = stc.play(); if (p && p.catch) p.catch(function () {});
        when.innerHTML = H('주파수를 차즈는 중', '주파수를 찾는 중'); cur = -1; gap = -1; update();
      } else {
        stc.pause(); au.pause(); cur = -1; root.classList.remove('tuned'); onair.classList.remove('live');
        ro.innerHTML = '---<small>키로</small>'; bars.forEach(function (b) { b.classList.remove('on'); });
        when.innerHTML = H('수신 대긔', '수신 대기'); screenOff(H('전원이 꺼져 잇소', '전원이 꺼져 있습니다')); pbtn.disabled = true;
      }
    }
    function goTo(i) {
      if (!on) power(true);
      var target = rot + ((mod(ST[i].ang - rot) + 540) % 360 - 180), from = rot, t0 = performance.now();
      cancelAnimationFrame(anim);
      (function step(t) { var k = Math.min(1, (t - t0) / 650), e = 1 - Math.pow(1 - k, 3); rot = from + (target - from) * e; update(); if (k < 1) anim = requestAnimationFrame(step); })(t0);
    }
    $('.rx-radio', root).addEventListener('click', function () { power(!on); });
    root.addEventListener('click', function (e) {
      var y = e.target.closest('.rx-years button, .rx-index li'); if (y) { goTo(+y.dataset.i); return; }
      if (e.target.closest('.rx-retune')) { goTo(((cur < 0 ? nearest().i : cur) + 1) % ST.length); return; }
      var c = e.target.closest('.rx-card'); if (c && window.ykMariaCard) window.ykMariaCard(c.querySelector('img').src);
    });
    /* 다이알 돌리기 */
    var drag = null;
    function angAt(e) { var r = dial.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
    dial.addEventListener('pointerdown', function (e) { if (!on) power(true); cancelAnimationFrame(anim); drag = angAt(e); dial.setPointerCapture(e.pointerId); e.preventDefault(); });
    dial.addEventListener('pointermove', function (e) { if (drag === null) return; var a = angAt(e), d = a - drag; if (d > 180) d -= 360; if (d < -180) d += 360; drag = a; rot += d; update(); });
    var end = function () { if (drag === null) return; drag = null; var n = nearest(); if (n.d < 7) goTo(n.i); };
    dial.addEventListener('pointerup', end); dial.addEventListener('pointercancel', end);
    dial.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { if (!on) power(true); rot += 3; update(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { if (!on) power(true); rot -= 3; update(); e.preventDefault(); } });
    /* 재생기 */
    pbtn.addEventListener('click', function () { if (!au.src) return; if (au.paused) { var p = au.play(); if (p && p.catch) p.catch(function () {}); } else au.pause(); });
    au.addEventListener('play', function () { pbtn.innerHTML = PAUSE; pbtn.setAttribute('aria-label', '멈춤'); var b = $('#bgm'); if (b && !b.paused) b.pause(); });
    au.addEventListener('pause', function () { pbtn.innerHTML = PLAY; pbtn.setAttribute('aria-label', '재생'); });
    au.addEventListener('timeupdate', function () { var p = au.duration ? au.currentTime / au.duration : 0; trk.style.width = p * 100 + '%'; wave(p); tm.textContent = fmt(au.currentTime) + ' / ' + fmt(au.duration); });
    $('.rx-track', root).addEventListener('click', function (e) { if (!au.duration) return; var r = this.getBoundingClientRect(); au.currentTime = (e.clientX - r.left) / r.width * au.duration; });
    rot = 0; update(); wave(0);
  })();


  /* ── 섹션 나타나기 · 취재 도장 ── */
  var nb = $('.notebook'), got = {};
  function stamp(beat) {
    if (window.ykGuideOn) return;
    var b = nb && $('button[data-beat="' + beat + '"]', nb); if (!b || got[beat]) return;
    got[beat] = 1; b.classList.add('got');
    var c = Object.keys(got).length; $('.nb-count', nb).textContent = c + ' / 7';
    if (c === 7) nb.classList.add('done');
  }
  if (nb) {
    $('.nb-cover', nb).addEventListener('click', function () { var o = nb.classList.toggle('open'); this.setAttribute('aria-expanded', o); });
    $$('.nb-stamps button', nb).forEach(function (b) { b.addEventListener('click', function () { var s = $('[data-beat="' + b.dataset.beat + '"]'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; t.classList.add('in'); io.unobserve(t);
        if (t.dataset.beat) stamp(t.dataset.beat);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    $$('.sec, .bridge, .sk-night, .sk-brush, .sk-blank, .finale').forEach(function (s) { io.observe(s); });
    /* 보는 법 안내 중에 지나간 장은, 직접 다시 올 때 도장 */
    var ioS = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !window.ykGuideOn && e.target.dataset.beat) stamp(e.target.dataset.beat); }); }, { threshold: 0.18 });
    $$('[data-beat]').forEach(function (s) { if (!s.closest('.notebook')) ioS.observe(s); });
  } else { $$('.sec, .bridge, .sk-night, .sk-brush, .sk-blank, .finale').forEach(function (s) { s.classList.add('in'); }); }

  /* ── 비하인드(호외) 카드 ── */
  (function () {
    var m = $('#behind'), tab = $('.hogoe-tab'); if (!m || !tab) return;
    var pics = [IMG + 'case/sonkijeong-behind.png'], i = 0;
    function show(k) { i = (k + pics.length) % pics.length; $('.mr-modal-img img', m).src = pics[i]; $('.mr-page-no', m).textContent = (i + 1) + ' / ' + pics.length; }
    function open() { m.hidden = false; tab.classList.add('seen'); $('.mr-prev', m).hidden = false; $('.mr-next', m).hidden = false; show(0); play('sfxBell'); }
    function close() { m.hidden = true; }
    tab.addEventListener('click', open);
    window.ykMariaCard = function (src) { m.hidden = false; $('.mr-modal-img img', m).src = src; $('.mr-page-no', m).textContent = '카드뉴스'; $('.mr-prev', m).hidden = true; $('.mr-next', m).hidden = true; };
    $('.mr-x', m).addEventListener('click', close);
    $('.mr-prev', m).addEventListener('click', function () { show(i - 1); });
    $('.mr-next', m).addEventListener('click', function () { show(i + 1); });
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    document.addEventListener('keydown', function (e) { if (m.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
    /* 저절로 펼치는 때: 사건을 끝까지 다 읽고 맨 끝(빈 자리)에 닿았을 때 한 번만.
       보는 법 안내가 떠 잇는 동안, 다른 창이 열려 잇는 동안엔 절대 안 뜸 — 안내가 끝난 뒤 다시 거기 닿으면 그때 뜸. */
    var KEYS = 'yk-behind-' + location.pathname.split('/').slice(-2, -1)[0], shown = false, endEl = $('#finale'), wait = null;
    try { shown = !!sessionStorage.getItem(KEYS); } catch (e) {}
    function busy() { return window.ykGuideOn || document.documentElement.classList.contains('ykg-run') || document.querySelector('.ykg-veil') || [].some.call(document.querySelectorAll('.mr-modal'), function (x) { return !x.hidden; }); }
    if (endEl && 'IntersectionObserver' in window && !shown) {
      var o2 = new IntersectionObserver(function (es) { es.forEach(function (e) {
        clearTimeout(wait);
        if (!e.isIntersecting || shown) return;
        wait = setTimeout(function chk() {
          var r = endEl.getBoundingClientRect(); if (shown || r.top > innerHeight * .75 || r.bottom < innerHeight * .25) return;
          if (busy()) { wait = setTimeout(chk, 1200); return; }   // 안내 · 다른 창이 닫힐 때까지 기다렷다가
          shown = true; try { sessionStorage.setItem(KEYS, '1'); } catch (x) {} open(); o2.disconnect();
        }, 1800);
      }); }, { threshold: 0.4 });
      o2.observe(endEl);
    }
  })();

  /* ── 축음긔(배경음악) ── */
  var bgmBtn = $('.bgm-toggle'), bgm = $('#bgm');
  function syncBgm() {
    if (!bgmBtn) return;
    var on = bgm && !bgm.paused;
    bgmBtn.classList.toggle('playing', on);
    var sm = $('small', bgmBtn); if (sm) sm.textContent = on ? '곡조가 흐르고 잇소' : '곡조가 멈추어 잇소';
    var o = $('.yg-old', bgmBtn), k = $('.yg-ko', bgmBtn);
    if (o) o.textContent = on ? '축음긔 멈추기' : '축음긔 틀기';
    if (k) k.textContent = on ? '배경음악 끄기' : '배경음악 켜기';
  }
  if (bgmBtn && bgm) {
    bgm.volume = 0.35;
    bgmBtn.addEventListener('click', function () {
      if (bgm.paused) { var d = $('#disc'); if (d && !d.paused) d.pause(); var p = bgm.play(); if (p && p.catch) p.catch(function () {}); }
      else bgm.pause();
      setTimeout(syncBgm, 50);
    });
    bgm.addEventListener('play', syncBgm); bgm.addEventListener('pause', syncBgm);
    /* 들어오자마자 곡조를 튼다. 브라우저가 소리를 막으면, 처음 누르는 순간 튼다. 사용자가 끈 뒤에는 다시 켜지 않는다. */
    var userOff = false;
    bgmBtn.addEventListener('click', function () { setTimeout(function () { userOff = bgm.paused; }, 60); });
    bgm.preload = 'auto';
    function autoStart() {
      if (userOff || !bgm.paused) return;
      var d = $('#disc'); if (d && !d.paused) return;
      var p = bgm.play(); if (p && p.catch) p.catch(function () {});
    }
    function firstTouch(e) {
      if (e && e.target && e.target.closest && e.target.closest('.bgm-toggle')) return;
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { document.removeEventListener(t, firstTouch, true); });
      autoStart();
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { document.addEventListener(t, firstTouch, true); });
    autoStart();
  }
})();


/* 어두운 띠(채록 · 호외 · 그 아해)를 지면 폭에 꼭 맞추기 */
(function () {
  var SEL = ['#night', '#brush', '#blank', '#marks', '#finale'];
  function fit() {
    var page = document.querySelector('.archive-page'); if (!page) return;
    var pr = page.getBoundingClientRect();
    SEL.forEach(function (s) {
      var el = document.querySelector(s); if (!el) return;
      for (var t = 0; t < 2; t++) {
        var er = el.getBoundingClientRect(); if (!er.width) return;
        var k = el.offsetWidth / er.width;
        var cs = getComputedStyle(el);
        var ml = parseFloat(cs.marginLeft) || 0, mr = parseFloat(cs.marginRight) || 0;
        el.style.setProperty('margin-left', (ml - (er.left - pr.left) * k) + 'px', 'important');
        el.style.setProperty('margin-right', (mr - (pr.right - er.right) * k) + 'px', 'important');
      }
    });
  }
  window.addEventListener('load', fit); window.addEventListener('resize', fit); setTimeout(fit, 300);
})();

/* ── 판 10 · 기록 영상(누르면 재생 · 소리 없음) · 실물 엽서 · 가슴의 표지 ── */
(function () {
  var D = document;
  [].forEach.call(D.querySelectorAll('.sk-film'), function (f) {
    var v = f.querySelector('video'), b = f.querySelector('.sf-play'); if (!v || !b) return;
    v.muted = true;
    function tog() { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); f.classList.add('on'); } else { v.pause(); f.classList.remove('on'); } }
    b.addEventListener('click', function (e) { e.stopPropagation(); tog(); });
    v.addEventListener('click', tog);
    v.addEventListener('ended', function () { f.classList.remove('on'); v.currentTime = 0; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && !v.paused) { v.pause(); f.classList.remove('on'); } }); }).observe(f);
  });
  var r = D.querySelector('.nm-real');
  if (r) r.addEventListener('click', function (e) { e.stopPropagation(); if (window.ykMariaCard) { window.ykMariaCard(r.dataset.src); var n = D.querySelector('#behind .mr-page-no'); if (n) n.textContent = '실물 엽서 · 1936.8.15 · 국립중앙박물관 제공'; } });
  var m = D.querySelector('.sk-marks');
  if (m && 'IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { m.classList.add('in'); io.disconnect(); } }, { rootMargin: '0px 0px -15% 0px' }); io.observe(m); } else if (m) m.classList.add('in');
})();
