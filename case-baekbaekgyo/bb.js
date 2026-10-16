/* 경성야록 · 백백교 사건 — 「희게, 더 희게」
   序 흰 옷 → 一 숨긴 죽음 → 二 헌납 장부 → 三 그 밤 → 四 땅 → 五 말할 수 업던 신문 → 보도 → 六 용문산 → 七 병 → 八 판결 → 라디오 → 흰 지면
   - 글자: <span class="hj" data-ko="오늘말">옛말</span> → 마우스를 올리면 오늘말로 바뀜 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = './img/';
  var AUD = '../case/audio/baekbaekgyo/';
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
     보도 — 지면이 따라간 반년 (첫 장은 조선일보 호외)
     ========================================================= */
  var ARTS = [
    { d: ['사월 십삼일', '4월 13일'], tag: ['보도 금지 해제 · 호외', '보도 금지 해제 · 호외'], paper: '조선일보', date: '1937.04.13', img: '19370413.png',
      note: ['이 지면은 조선일보 호외요. 동아일보는 이때 정간 중이어서, 첫 보도를 하지 못하엿소.', '이 지면은 조선일보 호외입니다. 동아일보는 이때 정간 중이어서, 첫 보도를 하지 못했습니다.'],
      title: '보도 금지가 풀리며 드러난 백백교 사건',
      lead: '1937년 2월 시작된 수사, 두 달 가까운 보도 통제 끝에 사건이 세상에 공개됐다. 원제 「흉포의 극 · 참학의 절 · 마도 백백교 죄상」.',
      body: ['1937년 2월 16일, 동대문경찰서는 백백교 관계자들에 대한 대대적인 수사에 착수했다.',
             '수사 과정에서 백백교가 종교단체를 내세우면서 신도들의 재산을 빼앗고 여러 범죄에 연루된 정황이 드러났다.',
             '사건의 중대성을 이유로 2월 19일부터 관련 보도가 통제되었으며, 약 두 달 뒤인 4월 13일 보도 금지가 해제되면서 사건의 전모가 신문을 통해 본격적으로 알려지기 시작했다.'],
      sum: ['1937년 2월 16일 백백교 관계자들에 대한 대규모 수사가 시작됐다.', '사건 관련 보도는 한동안 통제되었다가 4월 13일 해제됐다.', '보도 해제와 함께 백백교 사건이 대대적으로 세상에 알려지기 시작했다.'],
      keys: ['보도해제', '조선일보호외', '동대문경찰서'],
      qa: [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '두 달 가까이 막혀 있던 사건이, 보도 금지가 풀린 날 한꺼번에 지면에 나왔다.'], ['왜 그동안 실리지 못하엿소?', '왜 그동안 실리지 못했나요?', '사건이 중대하다는 이유로 2월 19일부터 보도가 통제됐다.'], ['이 지면에서 눈여겨볼 대목은 어대요?', '이 지면에서 주목할 부분은 어디인가요?', '첫 보도는 조선일보 호외다. 동아일보는 손기정 사건으로 정간 중이었다.']] },
    { d: ['류월 구일', '6월 9일'], tag: ['삼백팔십', '380'], paper: '동아일보', date: '1937.06.09', img: '19370609.png',
      title: '전국으로 확대되는 백백교 수사',
      lead: '여러 지역으로 현장 수사가 확대되며 사건의 규모가 계속 커졌다. 원제 「발굴시체 삼백팔십 — 또 양평서 발굴에 착수」.',
      body: ['백백교 사건 수사가 계속되면서 경찰의 현장 조사는 여러 지역으로 확대됐다.',
             '기사에서는 평강·안변 등지에서 206구, 연천에서 80여 구가 확인됐다고 전했으며, 이어 양평에서도 추가 조사가 시작됐다고 보도했다.',
             '충북 보은을 비롯한 다른 지역에서도 추가 조사가 예정되어 있어, 사건의 규모가 계속 커질 수 있다고 전했다.'],
      sum: ['백백교 관련 현장 수사가 전국 여러 지역으로 확대됐다.', '평강·안변·연천 등에 이어 양평에서도 추가 조사가 시작됐다.', '수사가 이어지면서 사건의 규모 역시 계속 커지고 있었다.'],
      keys: ['수사확대', '양평', '연천'],
      qa: [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '확인된 수가 380에 이르렀고, 양평에서도 새로 땅을 파기 시작했다.'], ['어대어대서 나왓소?', '어디어디서 나왔나요?', '평강·안변에서 206, 연천에서 80여. 보은 등지도 조사를 앞두고 있었다.'], ['이 수는 맞는 수요?', '이 숫자는 정확한가요?', '그때그때 달랐다. 11월 기사는 346, 뒤의 기록은 314를 적는다.']] },
    { d: ['구월 이십삼일', '9월 23일'], tag: ['송국 준비', '송치 준비'], paper: '동아일보', date: '1937.09.23', img: '19370923.png',
      title: '9개월에 걸친 수사가 일단락되다',
      lead: '장기간 이어진 조사와 증거 수집이 마무리 단계에 들어갔다. 원제 「살인결사 백백교 삼십 명 불원 송국」.',
      body: ['1937년 2월 시작된 백백교 수사는 약 9개월 동안 계속됐다.',
             '9월 보도에서는 이경득을 비롯한 핵심 관련자 30명을 살인·강간·사기 등의 혐의로 검찰에 송치할 예정이라고 전했다.',
             '수천 장에 이르는 조사 기록을 정리하면서, 경찰 수사는 본격적인 마무리 단계에 들어갔다.'],
      sum: ['백백교 수사가 시작된 지 약 9개월이 지났다.', '핵심 관련자 30명에 대한 검찰 송치가 준비됐다.', '경찰은 방대한 수사 기록과 증거를 정리하기 시작했다.'],
      keys: ['살인결사', '검찰송치', '수사기록'],
      qa: [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '핵심 관련자 30명이 곧 검찰로 넘어간다는 소식이다.'], ['신문은 이 무리를 무어라 불럿소?', '신문은 이 무리를 뭐라고 불렀나요?', '「살인결사」. 더 이상 종교라 부르지 않았다.'], ['누가 맨 압헤 잇섯소?', '누가 맨 앞에 있었나요?', '그 밤 인현동에서 붙잡힌 이경득이 첫머리에 적혔다.']] },
    { d: ['시월 십칠일', '10월 17일'], tag: ['갈라지는 사람들', '갈라지는 사람들'], paper: '동아일보', date: '1937.10.17', img: '19371017.png',
      title: '관련자 송치와 피해자들의 석방',
      lead: '사건의 책임자와 피해자를 구분하는 단계로 수사가 넘어갔다. 원제 「백백교의 무진죄상 십 개월 만에 취조단락」.',
      body: ['10개월 동안 이어진 백백교 수사는 관련자들의 역할을 구분하는 단계에 들어갔다.',
             '경찰은 이경득을 비롯한 30여 명의 핵심 관련자를 검찰에 송치할 계획이라고 밝혔다.',
             '경찰서에 남아 있던 남녀 60여 명 가운데 상당수는 재산 등을 빼앗긴 피해자 또는 참고인으로 판단되어, 석방이 시작될 예정이라고 신문은 전했다.'],
      sum: ['핵심 관련자 30여 명의 검찰 송치가 준비됐다.', '유치돼 있던 사람 가운데 피해자와 참고인이 구분되기 시작했다.', '피해자·참고인으로 판단된 약 60명의 석방이 예정됐다.'],
      keys: ['피해자', '석방', '관련자구분'],
      qa: [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '붙잡혀 있던 사람들 가운데, 누가 가해자이고 누가 피해자인지 가르기 시작했다.'], ['풀려난 이들은 누구엿소?', '풀려난 사람들은 누구였나요?', '재산을 빼앗긴 신도와 참고인들 — 60여 명이다.'], ['왜 그리 오래 걸렷소?', '왜 그렇게 오래 걸렸나요?', '같은 흰 옷을 입은 이들 사이에서, 바친 사람과 거둔 사람을 가려야 했다.']] },
    { d: ['십일월 십칠일', '11월 17일'], tag: ['삼백사십륙', '346'], paper: '동아일보', date: '1937.11.17', img: '19371117.png',
      title: '수사 종료 직전에도 이어진 추가 확인',
      lead: '검찰 송치를 앞두고 새로운 진술이 나오면서 현장 조사가 다시 이어졌다. 원제 「백백교의 끝없는 "지옥" 안내」.',
      body: ['경찰은 수사 기록과 의견서 작성까지 마치고 검찰 송치를 준비하고 있었다.',
             '그러나 송치를 앞둔 시점에 새로운 진술이 나오면서, 사리원 일대에 조사팀을 다시 파견하기로 했다.',
             '기사는 이 시점까지 확인된 피해자 수를 346명으로 보도했다.'],
      sum: ['검찰 송치를 앞두고 새로운 진술이 추가로 나왔다.', '경찰은 사리원 일대에 다시 현장 조사팀을 파견했다.', '당시 기사에서 확인된 피해자 수는 346명으로 보도됐다.'],
      keys: ['사리원', '346명', '현장검증'],
      qa: [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '끝난 줄 알았던 수사가, 새 진술 하나로 다시 산으로 향했다.'], ['어대로 갓소?', '어디로 갔나요?', '황해도 사리원 일대.'], ['제목은 왜 「지옥 안내」요?', '제목은 왜 「지옥 안내」인가요?', '진술이 나올 때마다 새 땅이 열렸다. 신문은 그것을 끝없는 안내라 불렀다.']] },
    { d: ['십이월 십일일', '12월 11일'], tag: ['삼백일 일', '301일'], paper: '동아일보', date: '1937.12.11', img: '19371211.png',
      title: '301일간의 수사, 마침내 송치 단계로',
      lead: '수천 장의 기록과 증거를 남기고 백백교 수사가 마무리됐다. 원제 「"살인교서" 수 완성! 십삼일경에 송국」.',
      body: ['추가 진술과 현장 검증으로 여러 차례 연장됐던 수사가 마침내 마무리 단계에 들어갔다.',
             '신문은 수사 착수 이후 301일 만에 문봉조 등을 포함한 관련자 43명이 수사 서류 및 증거와 함께 송치될 예정이라고 보도했다.',
             '경찰 의견서만 1천여 장에 달할 정도로, 백백교 사건은 방대한 수사 기록을 남겼다.'],
      sum: ['백백교 사건 수사가 약 301일 만에 마무리 단계에 들어갔다.', '관련자 43명의 송치가 예정됐다.', '경찰 의견서만 1천여 장에 이르는 방대한 수사 기록이 작성됐다.'],
      keys: ['301일', '43명', '살인교서'],
      qa: [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?', '301일 만에, 43명이 검찰로 넘어간다.'], ['긔록은 얼마나 되엇소?', '기록은 얼마나 됐나요?', '경찰 의견서만 1천여 장. 신문은 그것을 「살인교서」라 불렀다.'], ['그 뒤는 엇더케 되엇소?', '그 뒤는 어떻게 됐나요?', '재판은 1940년 3월에야 끝났다 — 피고 25명, 사형 14명.']] }
  ];
  (function () {
    var tl = $('#rTimeline'), book = $('#rBook'); if (!tl || !book) return;
    var N = ARTS.length, cur = 0, tab = 0, cmp = 100;
    tl.innerHTML = ARTS.map(function (a, i) {
      return '<li><button type="button" data-i="' + i + '"><span class="dot"></span><strong>' + H(a.d[0], a.d[1]) + '</strong><small>' + H(a.tag[0], a.tag[1]) + '</small></button></li>';
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
    function draw(anim) {
      var a = ARTS[cur];
      $$('button', tl).forEach(function (b, i) { b.classList.toggle('active', i === cur); });
      tl.style.setProperty('--prog', (cur / (N - 1) * (100 - 100 / N)) + '%');
      var news = '<div class="news26" aria-label="2026년 뉴스로 다시 쓴 기사"><div class="n26-bar"><b>경성야록</b><span>사회</span><span>사건</span><span>아카이브</span></div><div class="n26-body"><span class="n26-tag">아카이브 단독</span><h4>' + a.title + '</h4><p class="n26-meta">경성야록 사회부 · 원 보도 ' + a.paper + ' ' + a.date + ' · 2026년 다시 씀</p>' +
        '<p class="n26-lead">' + a.lead + '</p>' + a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '<div class="n26-keys">' + a.keys.map(function (k) { return '<span>#' + k + '</span>'; }).join('') + '</div><p class="n26-note">※ 1937년 ' + a.paper + ' 원문을 바탕으로 오늘의 기사 형식으로 다시 쓴 것입니다.</p></div></div>';
      book.innerHTML =
        '<div class="page left"><div class="page-head"><strong>' + a.paper + '</strong><span>' + H('소화 십이 년 원문판', '1937년 원문판') + '</span><em>' + H(a.d[0], a.d[1]) + '</em></div>' +
        '<div class="page-title"><span class="wm" aria-hidden="true">原文記事</span><h3>' + H('원문 긔사', '원문 기사') + '</h3><small>' + H(a.paper + ' 소화 십이 년 ' + a.d[0] + ' 보도', a.paper + ' 1937년 ' + a.d[1] + ' 보도') + '</small></div>' +
        '<div class="plate-switch"><button type="button" class="active">' + H('소화 십이 년 지면', '1937년 지면') + '</button><button type="button">2026년 뉴스</button></div>' +
        '<figure class="plate plate-cmp">' + news + '<img class="plate-scan" alt="' + a.date + ' ' + a.paper + ' 원문 지면" src="' + IMG + 'scan/' + a.img + '"><div class="plate-line"><span class="plate-handle">‹ ›</span></div><input class="plate-range" type="range" min="0" max="100" value="100" aria-label="원문 지면과 2026년 뉴스 비교"><span class="plate-hint">' + H('손잡이를 왼편으로 당기면 2026년 뉴스로 바뀌오', '손잡이를 왼쪽으로 당기면 2026년 뉴스로 바뀝니다') + '</span></figure>' +
        '<p class="guide"><span class="guide-box"></span>' + H('테두리 친 곳이 그날 실린 긔사이오.', '테두리를 친 곳이 그날 실린 기사입니다.') + '</p></div>' +
        '<div class="page right"><div class="page-head"><strong>' + a.paper + '</strong><span>' + H('오늘판') + '</span><em>' + H('긔록이 오늘을 맛나는 자리, 경성야록', '기록이 오늘을 만나는 자리, 경성야록') + '</em></div>' +
        '<div class="report-tabs" role="tablist"><button type="button" role="tab" class="' + (tab === 0 ? 'active' : '') + '">' + H('오늘 말로 읽기') + '</button><button type="button" role="tab" class="' + (tab === 1 ? 'active' : '') + '">' + H('간추려 읽기', '요약해서 읽기') + '</button></div>' +
        '<article class="modern-news"><span class="kicker">경제면 <i>|</i> ' + H(a.d[0], a.d[1]) + ' <i>|</i> ' + a.paper + '</span>' +
        (a.note ? '<div class="sk-artnote"><b>' + H('알려 두오', '알림') + '</b><p>' + H(a.note[0], a.note[1]) + '</p></div>' : '') +
        '<div class="news-grid"><div><h3>' + a.title + '</h3><p class="lead">' + a.lead + '</p><span class="seal-rule" aria-hidden="true"></span><div class="body">' +
        (tab === 0 ? a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') : '<ol class="mr-sum">' + a.sum.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>') + '</div></div></div>' +
        '<div class="record-talk"><div class="talk-head"><h4>' + H('긔록에게 뭇다', '기록에게 묻다') + '</h4><p>' + H('이 긔사에 궁금한 것을 긔록과 함께 풀어 보시압.', '이 기사에 궁금한 것을 기록과 함께 풀어 보세요.') + '</p></div>' +
        a.qa.map(function (q, k) { return '<div class="talk-pair show" style="animation-delay:' + (0.4 + k * 0.9) + 's"><div class="q-row"><span class="face">문</span><p class="bubble q">' + H(q[0], q[1]) + '</p></div><div class="a-row"><p class="bubble a">' + q[2] + '</p><span class="face a">답</span></div></div>'; }).join('') + '</div>' +
        '</article></div>' +
        '<div class="book-foot"><span>' + H('원 긔사 · ' + a.paper + ' · 소화 십이 년 ' + a.d[0], '원 기사 · ' + a.paper + ' · 1937년 ' + a.d[1]) + '</span><span><strong>京城野錄</strong> ' + H('녯 긔록 → 오늘', '옛 기록 → 오늘') + '</span></div>';
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

  /* ── 序 흰 옷: 마우스가 지나간 자리만 흰 옷이 드러남 ── */
  (function () {
    var sec = $('#white'); if (!sec) return;
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      sec.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      sec.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      sec.classList.add('lit');
    });
    sec.addEventListener('pointerleave', function () { sec.classList.remove('lit'); });
  })();

  /* ── 一 숨긴 죽음: 흰 종이 들추기 ── */
  $$('.ln-paper').forEach(function (b) {
    b.addEventListener('click', function () { b.closest('li').classList.add('open'); play('sfxWhoosh'); setTimeout(function () { b.remove(); }, 1800); });
  });

  /* ── 二 헌납 장부: 줄을 누르면 임명장 ── */
  (function () {
    var sec = $('#ledger'); if (!sec) return;
    var slip = $('.lg2-slip', sec), seen = {};
    $$('.lg2-rows button', sec).forEach(function (b, i) {
      b.addEventListener('click', function () {
        $$('.lg2-rows button', sec).forEach(function (x) { x.classList.toggle('on', x === b); });
        b.classList.add('seen'); seen[i] = 1;
        slip.classList.remove('show'); void slip.offsetWidth;
        slip.innerHTML = '<p class="sl-h">任命狀</p><p class="sl-to">' + H('某 殿', '아무개 귀하') + '</p><p class="sl-b">' + H('독립이 되는 날,<br>그대를 <b>' + b.dataset.post + '</b>에 임함.', '독립이 되는 날,<br>그대를 <b>' + b.dataset.postko + '</b>에 임명한다.') + '</p><p class="sl-f">' + H('大元', '대원') + '</p><span class="sl-void" aria-hidden="true">' + H('無效', '무효') + '</span>';
        slip.classList.add('show'); play('sfxBell');
        if (Object.keys(seen).length >= 5) sec.classList.add('all');
      });
    });
  })();

  /* ── 三 그 밤: 문 열기 ── */
  (function () {
    var sec = $('#night'); if (!sec) return;
    var doors = $$('.ng-door', sec), opened = 0;
    doors.forEach(function (d) {
      d.addEventListener('click', function () {
        if (d.classList.contains('open')) return;
        d.classList.add('open'); opened++; play('sfxWhoosh');
        if (opened === doors.length) sec.classList.add('all');
      });
    });
  })();

  /* ── 四 땅: 세어 올라가는 수 ── */
  (function () {
    var el = $('#ldNum'), sec = el && el.closest('section'); if (!el) return;
    var done = false;
    function run() {
      if (done) return; done = true;
      var t0 = performance.now(), T = 4200;
      (function step(t) { var k = Math.min(1, (t - t0) / T), e = 1 - Math.pow(1 - k, 2.4); el.textContent = Math.round(314 * e); if (k < 1) requestAnimationFrame(step); else sec.classList.add('counted'); })(t0);
    }
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(); o.disconnect(); } }); }, { threshold: 0.5 });
      o.observe($('.ld-count', sec));
    } else run();
  })();

  /* ── 五 말할 수 업던 신문: 하루씩 ── */
  (function () {
    var root = $('#muDays'); if (!root) return;
    var cells = [], d = new Date(1937, 1, 16), end = new Date(1937, 3, 13), n = 0;
    var MON = { 2: '2월', 3: '3월', 4: '4월' };
    while (d <= end) {
      var m = d.getMonth() + 1, dd = d.getDate(), k = '1937.' + m + '.' + dd, c = '';
      if (m === 2 && dd === 16) c = 'm0';
      else if (m === 2 && dd === 21) c = 'ban m2';
      else if (m === 4 && dd <= 7) c = 'ban m4';
      else if ((m === 2 && dd >= 19) || m === 3 || (m === 4 && dd <= 12)) c = 'ban';
      else if (m === 4 && dd === 13) c = 'm1';
      else if (m === 6 && dd === 3) c = 'm3';
      cells.push('<li class="' + c + '"' + (dd === 1 || n === 0 ? ' data-m="' + MON[m] + '"' : '') + ' style="--n:' + n + '" title="' + k + '"></li>');
      d.setDate(d.getDate() + 1); n++;
    }
    root.innerHTML = cells.join('');
  })();

  /* ── 七 병: 1937 → 2011 ── */
  (function () {
    var y = $('#jrYear'), a = $('#jrAgo'), sec = y && y.closest('section'); if (!y) return;
    var done = false;
    function run() {
      if (done) return; done = true;
      var t0 = performance.now(), T = 7400;
      (function step(t) { var k = Math.min(1, (t - t0) / T), v = Math.round(74 * k); y.textContent = 1937 + v; a.textContent = v; if (k < 1) requestAnimationFrame(step); else sec.classList.add('counted'); })(t0);
    }
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(); o.disconnect(); } }); }, { threshold: 0.45 });
      o.observe($('.jr-side', sec));
    } else run();
  })();

  /* =========================================================
     라듸오 — 닫힌 무리의 주파수 (1962 · 1987 · 1990년대 · 1996)
     ========================================================= */
  var JK = './';
  var ST = [
    { y: '1937', ang: 18, no: '제0호', when: '1937년 · 백백교', au: null, moon: 70,
      h: '흰 것 하나로,<br><em>천하를</em>',
      t: ['흰 것 하나로, 천하를', '흰 것 하나로, 온 세상을'],
      b: ['독립 뒤의 벼슬을 약속하고 재산과 딸을 거둠', '떠나려는 이를 맡은 무리 「벽력사」 · 식구를 흩어 볼모로'],
      d: ['이 칸은 녹음이 업소. 소화 십이 년의 지면이 남긴 것만 화면으로 전하오. 다이알을 돌리면, 그 뒤의 닫힌 무리들이 잡히오.', '이 칸은 녹음이 없습니다. 1937년의 신문이 남긴 것만 화면으로 전합니다. 다이얼을 돌리면, 그 뒤의 닫힌 무리들이 잡힙니다.'],
      link: '모든 주파수는 이 장부 한 권에서 시작된다.' },
    { y: '1962', ang: 90, no: '제1호', when: '1962년 · 용화교 사건', au: 'baekbaekgyo-radio01.mp3', card: 'baekbaekgyo-case01.jpg', moon: 28,
      h: '천지개벽을 내세워<br><em>재산</em>까지 바치게 했다',
      t: ['천지개벽을 내세운 미듬, 재산까지 바치게 하다', '천지개벽을 내세운 믿음, 재산까지 바치게 하다'],
      b: ['종말론적 주장을 내세움', '신도들에게 재산 헌납을 요구해 사회적 파장'],
      d: ['종교의 권위와 닫힌 무리가 범죄로 이어진 일이오. 그때 긔록을 라듸오로 꾸며 노앗소.', '종교의 권위와 폐쇄적인 집단이 범죄로 이어진 일입니다. 당시 기록을 라디오 형식으로 재구성했습니다.'],
      link: '1937년의 장부에도 헌납이 있었다 — 그때는 「독립 뒤의 벼슬」을 약속했다.' },
    { y: '1987', ang: 162, no: '제2호', when: '1987년 · 오대양 사건', au: 'baekbaekgyo-radio02.mp3', card: 'baekbaekgyo-case02.jpg', moon: 22,
      h: '닫힌 공간 안에서,<br>집단은 <em>바깥과 끊겼다</em>',
      t: ['닫힌 공간 안에서, 집단은 바깥과 끈어졋다', '닫힌 공간 안에서, 집단은 외부와 단절됐다'],
      b: ['폐쇄적인 공동체와 금전 문제가 얽힘', '큰 사회적 충격을 남김'],
      d: ['바깥과 끈긴 무리 안에서 일어난 일이오. 그때 긔록을 라듸오로 다시 드러 보시압.', '외부와 끊긴 집단 안에서 일어난 일입니다. 당시 기록을 라디오로 다시 들어 보세요.'],
      link: '백백교도 식구를 흩어 놓아, 바깥으로 나갈 길을 끊었다.' },
    { y: '1990s', ang: 234, no: '제3호', when: '1990~2000년대 · 영생교', au: 'baekbaekgyo-radio03.mp3', card: 'baekbaekgyo-case03.jpg', moon: 76,
      h: '교단을 떠난 사람들은<br>왜 <em>사라져야</em> 했나',
      t: ['교단을 떠난 사람들은 왜 사라저야 햇나', '교단을 떠난 사람들은 왜 사라져야 했나'],
      b: ['이탈하거나 비판한 이들을 둘러싼 범죄가 수사로 드러남', '언론은 과거 백백교 사건과 견주기도 함'],
      d: ['떠나려는 이를 막은 일이오. 그때 긔록을 라듸오로 꾸며 노앗소.', '떠나려는 사람을 막은 일입니다. 당시 기록을 라디오 형식으로 재구성했습니다.'],
      link: '떠나려는 이를 맡은 「벽력사」 — 같은 구조가 반세기 뒤에 다시 보였다.' },
    { y: '1996', ang: 306, no: '제4호', when: '1996년 · 아가동산 사건', au: 'baekbaekgyo-radio04.mp3', card: 'baekbaekgyo-case04.jpg', moon: 34,
      h: '공동체라는 이름 아래,<br><em>통제</em>된 사람들',
      t: ['공동체라는 일홈 아래, 통제된 사람들', '공동체라는 이름 아래, 통제된 사람들'],
      b: ['폐쇄적인 공동체 운영', '재산·노동 통제를 둘러싼 의혹과 수사'],
      d: ['개인보다 무리의 권위가 압선 일이오. 그때 긔록을 라듸오로 다시 드러 보시압.', '개인보다 집단의 권위가 앞선 일입니다. 당시 기록을 라디오로 다시 들어 보세요.'],
      link: '개인보다 집단의 권위가 앞설 때 — 1937년과 같은 그림자가 드리운다.' }
  ];
  var GAPS = [
    ['1937', '1962', '교주는 산에서 발견되엇고, 병 속에 남앗소. 그러나 그 장부의 방식은 — 남앗소.', '교주는 산에서 발견됐고, 병 속에 남았다. 그러나 그 장부의 방식은 — 남았다.'],
    ['1962', '1987', '헌납 다음엔, 문을 닫는 일이 왓소.', '헌납 다음엔, 문을 닫는 일이 왔다.'],
    ['1987', '1990s', '닫힌 문 안에서, 떠나는 일이 죄가 되엇소.', '닫힌 문 안에서, 떠나는 일이 죄가 됐다.'],
    ['1990s', '1996', '일홈은 공동체로 바뀌엇소. 통제는 그대로엿소.', '이름은 공동체로 바뀌었다. 통제는 그대로였다.'],
    ['1996', '1937', '그 일홈들을 거슬러 올라가면 — 다시 소화 십이 년, 흰 옷의 장부.', '그 이름들을 거슬러 올라가면 — 다시 1937년, 흰 옷의 장부.']
  ];

  (function () {
    var root = $('#mrRadio'); if (!root) return;
    var LO = 550, HI = 1500, freqOf = function (a) { return LO + ((a % 360) + 360) % 360 / 360 * (HI - LO); };
    var pct = function (f) { return (f - LO) / (HI - LO) * 100; };
    var HILLS = '<svg class="rx-hills" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46 L40 24 L76 40 L118 12 L160 38 L196 22 L236 42 L270 28 L300 38 L300 60 L0 60Z" fill="#221d17"></path><path d="M0 54 L60 42 L110 50 L160 40 L214 52 L260 44 L300 50 L300 60 L0 60Z" fill="#191510"></path></svg>';
    root.innerHTML =
      '<div class="rx-panel rx-room"><div class="rx-room-bg" aria-hidden="true" style="background-image:url(\'../assets/radio/room.jpg\')"></div>' +
        '<div class="rx-mast"><strong>京城野錄</strong><small>' + H('긔록 수신긔', '기록 수신기') + '</small></div>' +
        '<button type="button" class="rx-radio" aria-label="라디오 켜기"><span class="rx-glow" aria-hidden="true"></span><img alt="1930년대 나무 라디오 (재현 그림)" draggable="false" src="../assets/radio/radio.png"><span class="yk-credit">재현</span></button>' +
        '<p class="rx-hint">' + H('라듸오를 눌러<br>긔록의 주파수를 바드시오.', '라디오를 눌러<br>기록의 주파수를 받으세요.') + '</p></div>' +
      '<div class="rx-panel rx-tuner"><div class="rx-scale"><div class="rx-nums"><span>550</span><span>700</span><span>900</span><span>1100</span><span>1300</span><span>1500</span></div><div class="rx-ticks"></div><span class="rx-needle"></span>' +
        '<div class="rx-years">' + ST.map(function (s, i) { return '<button type="button" data-i="' + i + '" style="left:' + pct(freqOf(s.ang)) + '%">' + s.y + '</button>'; }).join('') + '</div></div>' +
        '<div class="rx-dial-wrap"><span class="rx-screw a"></span><span class="rx-screw b"></span><span class="rx-screw c"></span><span class="rx-screw d"></span><span class="rx-dial-mark" aria-hidden="true"></span>' +
        '<div class="rx-dial" role="slider" tabindex="0" aria-label="주파수 다이얼. 좌우 화살표로도 돌릴 수 있습니다." aria-valuemin="550" aria-valuemax="1500"><img alt="" draggable="false" src="../assets/radio/dial.png"></div></div>' +
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
      vis.classList.remove('card'); vis.classList.remove('has-card');
      vis.innerHTML = '<span class="rx-moon"></span>' + HILLS + '<p class="rx-static">' + msg + '</p>';
    }
    function setStation(i) {
      if (cur === i) return; cur = i; var s = ST[i];
      root.classList.add('tuned'); onair.classList.add('live');
      when.textContent = s.when;
      vis.classList.remove('card'); vis.classList.remove('has-card');
      vis.innerHTML = '<span class="rx-moon" style="left:' + s.moon + '%"></span>' + HILLS + '<h4>' + s.h + '</h4>' +
        (s.card ? '<button type="button" class="rx-cardimg rx-vcard" aria-label="카드뉴스 크게 보기"><img alt="' + s.when + ' 카드뉴스" src="' + JK + 'img/case/' + s.card + '"><span>' + H('크게 보기') + '</span></button>' : '');
      vis.classList.toggle('has-card', !!s.card);
      $$('.rx-years button', root).forEach(function (b, j) { b.classList.toggle('active', j === i); });
      $$('.rx-index li', root).forEach(function (b, j) { b.classList.toggle('on', j === i); });
      scrap.innerHTML = '<div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span><em>' + s.no + ' · ' + s.y + '</em></div>' +
        '<h5>' + H(s.t[0], s.t[1]) + '</h5><ul>' + s.b.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p>' + H(s.d[0], s.d[1]) + '</p>' +
        (s.link ? '<p class="rx-link"><b>' + H('1937년과 겹치는 자리', '1937년과 겹치는 자리') + '</b>' + s.link + '</p>' : '') +
        '<div class="rx-scrap-foot"><button type="button" class="rx-retune">' + H('다른 주파수 차즈시오', '다른 주파수 찾기') + '</button>' +
        '</div>';
      if (s.au) { au.src = AUD + s.au; au.currentTime = 0; var p = au.play(); if (p && p.catch) p.catch(function () {}); pbtn.disabled = false; }
      else { au.pause(); au.removeAttribute('src'); pbtn.disabled = true; tm.textContent = '녹음 없음 · 지면만 남음'; trk.style.width = '0'; wave(0); }
      play('sfxBell');
    }
    var gap = -1;
    function between() {
      var SP = 360 / ST.length, g = Math.floor(mod(rot - ST[0].ang) / SP) % ST.length; if (g === gap) return; gap = g; var G = GAPS[g];
      when.innerHTML = H('주파수 사이', '주파수 사이') + ' · ' + G[0] + ' → ' + G[1];
      scrap.innerHTML = '<div class="rx-scrap-head"><span>' + H('주파수 사이', '주파수 사이') + '</span><em>' + G[0] + ' → ' + G[1] + '</em></div><p class="rx-wait">' + H('두 칸 사이에서 이어지는 것을 드르시오. 바늘을 조금 더 돌리면 다음 이약이가 잡히오.', '두 칸 사이에서 이어지는 것을 들어 보세요. 바늘을 조금 더 돌리면 다음 이야기가 잡힙니다.') + '</p><ol class="rx-index">' + ST.map(function (s, i) { return '<li data-i="' + i + '"><span>' + s.y + '</span>' + H(s.t[0], s.t[1]) + '</li>'; }).join('') + '</ol>';
      vis.classList.remove('card'); vis.classList.remove('has-card');
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
      var c = e.target.closest('.rx-card, .rx-cardimg'); if (c && window.ykMariaCard) window.ykMariaCard(c.querySelector('img').src);
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
    var c = Object.keys(got).length; $('.nb-count', nb).textContent = c + ' / 8';
    if (c === 8) nb.classList.add('done');
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
    }, { threshold: 0.18 });
    $$('.sec, .bridge, .bb-white, .bb-night, .bb-mute, .bb-mount, .bb-fin').forEach(function (s) { io.observe(s); });
    /* 보는 법 안내 중에 지나간 장은, 직접 다시 올 때 도장 */
    var ioS = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !window.ykGuideOn && e.target.dataset.beat) stamp(e.target.dataset.beat); }); }, { threshold: 0.18 });
    $$('[data-beat]').forEach(function (s) { if (!s.closest('.notebook')) ioS.observe(s); });
  } else { $$('.sec, .bridge, .bb-white, .bb-night, .bb-mute, .bb-mount, .bb-fin').forEach(function (s) { s.classList.add('in'); }); }

  /* ── 비하인드(호외) 카드 ── */
  (function () {
    var m = $('#behind'), tab = $('.hogoe-tab'); if (!m || !tab) return;
    var pics = [IMG + 'case/baekbaekgyo-behind01.png', IMG + 'case/baekbaekgyo-behind03.png', IMG + 'case/baekbaekgyo-behind04.png'], i = 0;
    var NOTE = ['', '※ 이 카드는 증명된 사실이 아니라 — 그런 설(說)도 있다는 이야기입니다.', '※ 그림은 재현입니다.'];
    function show(k) { i = (k + pics.length) % pics.length; $('.mr-modal-img img', m).src = pics[i]; $('.mr-page-no', m).textContent = (i + 1) + ' / ' + pics.length + (NOTE[i] ? '  ' + NOTE[i] : ''); }
    function open() { m.hidden = false; tab.classList.add('seen'); $('.mr-prev', m).hidden = false; $('.mr-next', m).hidden = false; show(0); play('sfxBell'); }
    function close() { m.hidden = true; }
    tab.addEventListener('click', open);
    window.ykMariaCard = function (src) { m.hidden = false; $('.mr-modal-img img', m).src = src; $('.mr-page-no', m).textContent = '號外'; $('.mr-prev', m).hidden = true; $('.mr-next', m).hidden = true; };
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
  var SEL = ['.bb-dusk', '.bb-dusk + .bridge', '.bb-dark', '#white', '#night', '#mute', '#mountain', '#jar', '#finale'];
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

/* ── 끝 장면 : 화면에 멈춰 서서, 내리는 만큼 한 줄씩 (그냥 지나치지 않게) ── */
(function () {
  var f = document.getElementById('finale'); if (!f) return;
  var steps = [].slice.call(f.querySelectorAll('.bf-k, .bf-lines li, .bf-big, .bf-why, .bf-end'));
  f.classList.add('hold');
  function upd() {
    var r = f.getBoundingClientRect(), vh = window.innerHeight, total = r.height - vh;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    var n = Math.floor(p * (steps.length + 1.5)) + (r.top < vh * .5 ? 2 : 0);
    steps.forEach(function (el, i) { el.classList.toggle('on', i < n || p > .97); });
  }
  window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
})();

/* ── 흰 것에서 종이로 : 문장은 안개 한가운데서만 또렷 · 옅은 눈발 ── */
(function () {
  var t = document.querySelector('.bb-thaw'); if (!t) return;
  var cv = t.querySelector('.th-snow'), c = cv && cv.getContext && cv.getContext('2d'), W = 0, Hh = 0, fl = [], on = false;
  function size() { if (!cv) return; var r = cv.getBoundingClientRect(); W = cv.width = Math.round(r.width); Hh = cv.height = Math.round(r.height); fl = []; for (var i = 0; i < 70; i++) fl.push({ x: Math.random() * W, y: Math.random() * Hh, r: .6 + Math.random() * 1.6, v: .25 + Math.random() * .5, d: Math.random() * 6 }); }
  function upd() {
    var r = t.getBoundingClientRect(), vh = window.innerHeight, p = (vh - r.top) / (r.height + vh); p = Math.max(0, Math.min(1, p));
    var o = 1 - Math.min(1, Math.abs(p - .5) / .42); t.style.setProperty('--th-o', Math.max(0, o).toFixed(3));
    on = r.bottom > 0 && r.top < vh;
  }
  window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', function () { size(); upd(); }); size(); upd();
  if (c) (function loop() { requestAnimationFrame(loop); if (!on) return; c.clearRect(0, 0, W, Hh);
    fl.forEach(function (f) { f.y += f.v; f.x += Math.sin((f.y + f.d * 40) / 60) * .3; if (f.y > Hh) { f.y = -4; f.x = Math.random() * W; }
      var a = Math.max(0, 1 - Math.abs(f.y / Hh - .45) / .5) * .5; c.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')'; c.beginPath(); c.arc(f.x, f.y, f.r, 0, 6.283); c.fill(); }); })();
})();
