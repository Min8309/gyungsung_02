/* 경성야록 · 죽첨정 '단두 유아' 사건 — 「말이 사람을 죽이기까지」
   프롤로그(채록) → 一 그 아츰 → 二 받아 적은 말 → 三 퍼뜨린 말 → 四 호외 → 五 말은 아즉 떠도오 → 그 아해
   - 글자: <span class="hj" data-ko="오늘말">옛말</span> → 마우스를 올리면 오늘말로 바뀜 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = './image/Jukcheomjeong/';
  var AUD = './audio/';
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
    t.onload = function () { im.src = im.dataset.mj; im.classList.add('mj'); };
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
     죽첨정 — 자료
     ========================================================= */
  var PLACES = [
    { name: '죽첨정 일대', sub: ['그 아츰의 자리', '그 아침의 자리'],
      then: IMG + 'place/apartment-past.jpg', now: IMG + 'place/apartment-present.jpg', map: IMG + 'place/map-ahyeon-1936.jpg', seal: '京城',
      thenAddr: ['경성부 죽첨정 삼정목', '경성부 죽첨정 3정목'], nowAddr: ['서울 서대문구 충정로3가 일대', '서울 서대문구 충정로3가 일대 (1946년 죽첨정 → 충정로)'],
      text: ['매립지는 메워지고, 동네만 남앗소. 사진 속 건물은 그 동네의 것 — 그 아츰의 자리가 정확히 어대엿는지, 이제는 아모도 모르오.', '매립지는 메워지고, 동네만 남았다. 사진 속 건물은 그 동네의 것 — 그날 아침의 자리가 정확히 어디였는지, 이제는 아무도 모른다.'],
      src: '바탕 지도 · 아현동 일대 지도(1936) · 서울역사아카이브' }
  ];

  /* 신문이 받아 적은 말 — 날마다 지면에 오른 「말」 */
  var ARTS = [
    { d: ['오월 십칠일', '5월 17일'], tag: ['처음 실림', '첫 보도'], day: ['이튿날', '이튿날'], date: '1933.05.17', img: '19330517.jpg',
      title: '시내 형사 총출동, 팔방 활동도 수포',
      lead: '1933년 5월 17일자 동아일보 2면에 「유아 단두 사건」이 처음 실렸다. 형사 십여 명이 팔방으로 나섰지만 아이의 신원조차 밝혀지지 않았다.',
      body: ['기사는 "남녀를 분간할 수는 없으나 머리를 깎은 것을 보아 사내아이 같다"고 적었다. 경성제대 부검도 같은 판단이었다.',
             '같은 기사에는 범인을 "문둥병 환자의 짓이 아닌가" 짐작하는 대목이 실렸다. 한센병 환자를 향한 편견이 그대로 지면에 올랐다.',
             '서대문경찰서장은 "범행은 금일 새벽, 원한이나 치정관계에서 나온 것이 아닌가"라고 말했다.'],
      sum: ['5월 17일자 2면에 사건이 처음 실렸다.', '부검과 기사는 아이를 사내아이로 봤다.', '범인을 한센병 환자로 짐작하는 편견이 실렸다.', '경찰서장은 원한·치정을 의심했다.'],
      keys: ['첫보도', '신원미상', '편견'],
      w: [0, 1, 2, 3] },
    { d: ['오월 십팔일', '5월 18일'], tag: ['이튿날 실림', '이튿날 보도'], day: ['사흘째', '사흘째'], date: '1933.05.18', img: '19330518.jpg',
      title: '"오리무중이라 꾸짖어도 하는 수 없다"',
      lead: '사건은 다시 사회면에 실렸다. 범인은 아직 잡히지 않았다.',
      body: ['서장은 "사건이 오리무중으로 들어간다고 꾸지람을 해도 하는 수 없습니다. 그러나 과학적 수사방법은 있습니다"라고 말했다.',
             '경찰은 현장을 다시 살피고 감정 결과를 기다렸다. 아이가 누구인지는 여전히 아무도 몰랐다.'],
      sum: ['전날에 이어 사건이 다시 보도됐다.', '서장은 "오리무중"이라는 말을 스스로 꺼냈다.', '아이의 신원은 여전히 미상이었다.'],
      keys: ['오리무중', '서대문서'],
      w: [4] },
    { d: ['오월 십구일', '5월 19일'], tag: ['수사가 막힘', '수사 난항'], day: ['나흘째', '나흘째'], date: '1933.05.19', img: '19330519.jpg',
      title: '비가 내렸다, 흔적이 씻겨 갔다',
      lead: '서대문경찰서는 밤낮없이 수사를 이어 갔지만 뚜렷한 성과는 없었다.',
      body: ['비가 내리면서 현장에 남아 있던 흔적마저 사라질 처지가 됐다.',
             '경찰은 긴장 속에서 수사를 계속하면서도, 수사 내용은 철저히 비밀에 부쳤다.'],
      sum: ['집중 수사가 계속됐다.', '비로 현장 흔적이 사라질 처지가 됐다.', '경찰은 수사 내용을 감췄다.'],
      keys: ['수사난항', '비'],
      none: ['비가 내렷소. 새 말은 업고, 흔적만 씻기어 갓소.', '비가 내렸다. 새 말은 없고, 흔적만 씻겨 갔다.'], w: [] },
    { d: ['오월 이십오일', '5월 25일'], tag: ['방침을 다시 세움', '수사 재정비'], day: ['열흘째', '열흘째'], date: '1933.05.25', img: '19330525.jpg',
      title: '열흘, 경찰은 수사의 방향을 처음부터 다시 그렸다',
      lead: '성과가 나오지 않자 경기도 경찰부는 시내 여러 경찰서를 불러 모았다.',
      body: ['그동안의 조사 내용을 다시 검토하고 방침을 정비해, 각 경찰서가 함께 수사를 잇기로 했다.',
             '범인 대신, 의심받을 사람의 목록이 길어지기 시작했다.'],
      sum: ['수사가 길어지며 방향을 재검토했다.', '여러 경찰서가 대책 회의를 열었다.', '경찰서 간 공조를 강화했다.'],
      keys: ['수사회의', '공조'],
      none: ['새 말은 업섯소. 의심할 사람의 목록만 길어졋소.', '새 말은 없었다. 의심할 사람의 목록만 길어졌다.'], w: [] },
    { d: ['유월 이일', '6월 2일'], tag: ['혐의가 짙어짐', '유력 혐의선'], day: ['열여드레째', '18일째'], date: '1933.06.02', img: '19330602.jpg', mark: '오보',
      title: '수사 18일째, 한 가족이 혐의선에 오르다',
      lead: '죽첨정에 살던 한 가족 다섯이 서대문서에 검거돼 조사를 받았다. 그들은 모두 범행을 부인했다.',
      body: ['지면은 그 집안을 "유력한 혐의자"라 불렀다. 이 단계의 의혹은 아직 확인된 사실이 아니었다.',
             '그러나 무죄의 증거는 처음부터 있었다. 이 집안의 가장은 5월 13일 병원에서 이미 숨졌고, 아이가 숨진 것은 빨라야 15일 밤이었다. 가족은 열흘 만에 풀려났다.'],
      sum: ['한 가족 다섯이 검거돼 조사를 받았다.', '지면은 그들을 "유력한 혐의자"라 불렀다.', '가족은 열흘 만에 풀려났다.'],
      keys: ['혐의선', '오보'],
      w: [5] },
    { d: ['유월 삼일', '6월 3일'], tag: ['수사를 넓힘', '수사 확대'], day: ['열아흐레째', '19일째'], date: '1933.06.03', img: '19330603.jpg',
      title: '백여 명이 붙들렸다 풀려났다',
      lead: '서대문서는 죽첨정·합동·중림동 일대로 수사를 넓혔다.',
      body: ['그 사이 경찰은 걸인과 한센병 환자를 "혐의"로 잡아들였다. 서대문서에서만 붙들었다 풀어 준 사람이 백여 명이었다.',
             '첫날 지면에 실린 짐작 — "문둥병 환자의 짓" — 이 수사의 그물이 되어 있었다.'],
      sum: ['수사가 죽첨정 일대로 넓어졌다.', '걸인과 한센병 환자 백여 명이 붙들렸다 풀려났다.'],
      keys: ['수사확대', '편견'],
      none: ['새 말은 업섯소. 첫날의 말 — 「문둥병 환자의 짓」 — 이 그물이 되어, 백여 명을 붓드럿소.', '새 말은 없었다. 첫날의 말 — 「문둥병 환자의 짓」 — 이 그물이 되어, 백여 명을 붙들었다.'], w: [] },
    { d: ['유월 팔일', '6월 8일'], tag: ['봉함', '봉함'], sealed: 1 }
  ];

  /* 호외에서 지워지는 말 — 틀린 말 / 남은 한 마듸 */
  var WORDS = [
    { w: ['「사내아해 갓다」', '「사내아이 같다」'], d: '5.17', fix: ['한 살 난 계집아해엿소.', '한 살 난 여자아이였다.'] },
    { w: ['「문둥병 환자의 짓」', '「문둥병 환자의 짓」'], d: '5.17 · 6.3', fix: ['편견이엇소. 걸인과 한센인 백여 명이 붓들렷다 풀려낫소.', '편견이었다. 걸인과 한센인 백여 명이 붙들렸다 풀려났다.'] },
    { w: ['「원한이나 치정」', '「원한이나 치정」'], d: '5.17', fix: ['원한도, 치정도 업섯소.', '원한도, 치정도 없었다.'] },
    { w: ['「범행은 금일 새벽」', '「범행은 오늘 새벽」'], d: '5.17', fix: ['죽인 이는 업섯소. 아해는 병으로 죽엇소.', '죽인 사람은 없었다. 아이는 병으로 죽었다.'] },
    { w: ['「오리무중」', '「오리무중」'], d: '5.18', fix: ['답은 이웃의 무덤 속에 잇섯소.', '답은 이웃의 무덤 속에 있었다.'] },
    { w: ['「유력한 혐의자」', '「유력한 혐의자」'], d: '6.2', fix: ['그 집 가장은 아해보다 먼저, 이미 숨진 이엿소.', '그 집 가장은 아이보다 먼저, 이미 숨진 사람이었다.'] }
  ];

  (function () {
    var root = $('#places'); if (!root) return;
    var cur = 0;
    root.innerHTML =
      '<div class="pl-tabs">' + PLACES.map(function (p, i) {
        return '<button type="button" data-i="' + i + '"><span>0' + (i + 1) + '</span><strong>' + p.name + '<small>' + H(p.sub[0], p.sub[1]) + '</small></strong></button>';
      }).join('') + '</div>' +
      '<div class="pl-frame-wrap"><button type="button" class="pl-arrow left" aria-label="앞 사진">←</button><div class="pl-frame"></div><button type="button" class="pl-arrow right" aria-label="다음 사진">→</button></div>' +
      '<article class="pl-record"></article>';
    function draw() {
      var p = PLACES[cur];
      $$('.pl-tabs button', root).forEach(function (b, i) { b.classList.toggle('active', i === cur); });
      $('.pl-frame', root).innerHTML =
        '<div class="compare duo">' +
        '<figure class="duo-cell"><img alt="' + p.name + ' 그때 모습" src="' + p.then + '"><span class="tag-paper left"><small>' + H('그때') + '</small><b>' + H('녯 사진', '옛 사진') + '</b></span></figure>' +
        '<figure class="duo-cell"><img alt="' + p.name + ' 지금 모습" src="' + p.now + '"><span class="tag-paper left"><small>' + H('이제', '지금') + '</small><b>' + H('오늘') + '</b></span></figure></div>';
      $('.pl-record', root).innerHTML =
        '<div class="pr-num">0' + (cur + 1) + '</div><div class="pr-text"><span class="pr-kicker">' + H('장소 긔록', '장소 기록') + '</span><h3>' + p.name + '</h3>' +
        '<div class="pr-then-now"><div><small>' + H('그때 자리', '그때 자리') + '</small><b>' + H(p.thenAddr[0], p.thenAddr[1]) + '</b></div><span aria-hidden="true">→</span><div><small>' + H('이제 자리', '지금 자리') + '</small><b>' + H(p.nowAddr[0], p.nowAddr[1]) + '</b></div></div>' +
        '<p>' + H(p.text[0], p.text[1]) + '</p></div>' +
        '<figure class="pr-photo pr-chart"><img alt="아현동 일대 지도 (1936)" src="' + (p.map || p.then) + '"><span class="pr-seal" aria-hidden="true">' + p.seal + '</span></figure>' +
        '<span class="pr-src">' + p.src + '</span>';
      $('.pl-arrow.left', root).disabled = cur === 0;
      $('.pl-arrow.right', root).disabled = cur === PLACES.length - 1;
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('.pl-tabs button'); if (t) { cur = +t.dataset.i; draw(); return; }
      if (e.target.closest('.pl-arrow.left') && cur > 0) { cur--; draw(); }
      if (e.target.closest('.pl-arrow.right') && cur < PLACES.length - 1) { cur++; draw(); }
    });
    draw();
  })();

  /* =========================================================
     第二章  신문이 받아 적은 말 — 지면 한 장마다 「이날의 말」
     ========================================================= */
  var gotWords = {};
  (function () {
    var tl = $('#rTimeline'), book = $('#rBook'); if (!tl || !book) return;
    var N = ARTS.length - 1, cur = 0, tab = 0, cmp = 100;
    tl.innerHTML = ARTS.map(function (a, i) {
      if (a.sealed) return '<li class="tl-sealed"><button type="button" disabled title="호외에서 열리오"><span class="dot"></span><strong>' + H(a.d[0], a.d[1]) + '</strong><small>' + H('봉함 · 호외에서', '봉함 · 호외에서') + '</small></button></li>';
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
    var Q = [['이 보도의 요뎜은 무엇이오?', '이 보도의 핵심은 무엇인가요?'], ['그때 형편은 엇더하엿소?', '당시 어떤 상황이었나요?'], ['긔록에서 눈여겨볼 대목은 어대요?', '기록에서 주목할 부분은 어디인가요?']];
    function count() {
      var n = Object.keys(gotWords).length, c = $('#wordCount'); if (c) c.textContent = n + ' / ' + WORDS.length;
      var al = $('#wordAll'); if (al && n === WORDS.length) { al.innerHTML = H('여섯 말을 다 모앗소. 이 말들은 — 호외에서 다시 맛나리다.', '여섯 말을 다 모았습니다. 이 말들은 — 호외에서 다시 만납니다.'); al.classList.add('on'); }
    }
    function draw(anim) {
      var a = ARTS[cur];
      $$('button', tl).forEach(function (b, i) { b.classList.toggle('active', i === cur); });
      tl.style.setProperty('--prog', (cur / N * 100) + '%');
      var news = '<div class="news26" aria-label="2026년 뉴스로 다시 쓴 기사"><div class="n26-bar"><b>경성야록</b><span>사회</span><span>사건·사고</span><span>아카이브</span></div><div class="n26-body"><span class="n26-tag">아카이브 단독</span><h4>' + a.title + '</h4><p class="n26-meta">경성야록 사회부 · 원 보도 동아일보 ' + a.date + ' · 2026년 다시 씀</p>' +
        (a.mark ? '<p class="n26-alert">정정 · 이 보도에 나온 가족은 이후 사건과 무관한 것으로 밝혀졌습니다.</p>' : '') +
        '<p class="n26-lead">' + a.lead + '</p>' + a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '<div class="n26-keys">' + a.keys.map(function (k) { return '<span>#' + k + '</span>'; }).join('') + '</div><p class="n26-note">※ 1933년 동아일보 원문을 바탕으로 오늘의 기사 형식으로 다시 쓴 것입니다.</p></div></div>';
      book.innerHTML =
        '<div class="page left"><div class="page-head"><strong>동아일보</strong><span>' + H('소화 팔 년 원문판', '1933년 원문판') + '</span><em>' + H(a.d[0], a.d[1]) + '</em></div>' +
        '<div class="page-title"><span class="wm" aria-hidden="true">原文記事</span><h3>' + H('원문 긔사', '원문 기사') + '</h3><small>' + H('동아일보 소화 팔 년 ' + a.d[0] + ' 보도', '동아일보 1933년 ' + a.d[1] + ' 보도') + '</small></div>' +
        '<div class="plate-switch"><button type="button" class="active">' + H('소화 팔 년 지면', '1933년 지면') + '</button><button type="button">2026년 뉴스</button></div>' +
        '<figure class="plate plate-cmp">' + news + (a.mark ? '<span class="plate-stamp mis" aria-hidden="true">오보</span>' : '') + '<img class="plate-scan" alt="' + a.date + ' 동아일보 원문 지면" src="' + IMG + 'articles-toned/' + a.img + '"><div class="plate-line"><span class="plate-handle">‹ ›</span></div><input class="plate-range" type="range" min="0" max="100" value="100" aria-label="원문 지면과 2026년 뉴스 비교"><span class="plate-hint">' + H('손잡이를 왼편으로 당기면 2026년 뉴스로 바뀌오', '손잡이를 왼쪽으로 당기면 2026년 뉴스로 바뀝니다') + '</span></figure>' +
        '<p class="guide"><span class="guide-box"></span>' + H('테두리 친 곳이 그날 실린 긔사이오.', '테두리를 친 곳이 그날 실린 기사입니다.') + '</p></div>' +
        '<div class="page right"><div class="page-head"><strong>동아일보</strong><span>' + H('오늘판') + '</span><em>' + H('긔록이 오늘을 맛나는 자리, 경성야록', '기록이 오늘을 만나는 자리, 경성야록') + '</em></div>' +
        '<div class="report-tabs" role="tablist"><button type="button" role="tab" class="' + (tab === 0 ? 'active' : '') + '">' + H('오늘 말로 읽기') + '</button><button type="button" role="tab" class="' + (tab === 1 ? 'active' : '') + '">' + H('간추려 읽기', '요약해서 읽기') + '</button></div>' +
        '<article class="modern-news"><span class="kicker">사회면 <i>|</i> ' + H(a.d[0], a.d[1]) + ' <i>|</i> ' + H('수사 ' + a.day[0], '수사 ' + a.day[1]) + '</span>' +
        (a.mark ? '<div class="mark-note mis"><span class="stamp">오보</span><p>' + H('이 긔사에 나온 가족은 범인이 아니엇소.', '이 기사에 나온 가족은 범인이 아니었습니다.') + '</p></div>' : '') +
        '<div class="news-grid"><div><h3>' + a.title + '</h3><p class="lead">' + a.lead + '</p><span class="seal-rule" aria-hidden="true"></span><div class="body">' +
        (tab === 0 ? a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') : '<ol class="mr-sum">' + a.sum.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>') + '</div></div></div>' +
        '<div class="record-talk"><div class="talk-head"><h4>' + H('긔록에게 뭇다', '기록에게 묻다') + '</h4><p>' + H('이 긔사에 궁금한 것을 긔록과 함께 풀어 보시압.', '이 기사에 궁금한 것을 기록과 함께 풀어 보세요.') + '</p></div>' +
        Q.map(function (q, k) { var ans = a.sum[k] || a.lead; return '<div class="talk-pair show" style="animation-delay:' + (0.4 + k * 0.9) + 's"><div class="q-row"><span class="face">문</span><p class="bubble q">' + H(q[0], q[1]) + '</p></div><div class="a-row"><p class="bubble a">' + ans + '</p><span class="face a">답</span></div></div>'; }).join('') + '</div>' +
        '<div class="jk-word' + (a.w.length ? '' : ' none') + '"><b>' + H('이날 지면에 오른 말', '이날 지면에 오른 말') + '</b>' +
        (a.w.length ? '<span>' + a.w.map(function (k) { return H(WORDS[k].w[0], WORDS[k].w[1]); }).join(' ') + '</span>' : '<span class="nw">' + H(a.none[0], a.none[1]) + '</span>') +
        '<em>' + H('모은 말', '모은 말') + ' <i id="wordCount"></i></em><p class="jk-all" id="wordAll"></p></div>' +
        '</article></div>' +
        '<div class="book-foot"><span>' + H('원 긔사 · 동아일보 · 소화 팔 년 ' + a.d[0], '원 기사 · 동아일보 · 1933년 ' + a.d[1]) + '</span><span><strong>京城野錄</strong> ' + H('녯 긔록 → 오늘', '옛 기록 → 오늘') + '</span></div>';
      var wrap = book.parentNode;
      $('.book-arrow.left', wrap).disabled = cur === 0;
      $('.book-arrow.right', wrap).disabled = cur === N - 1;
      setCmp(100);
      a.w.forEach(function (k) { gotWords[k] = 1; }); count();
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
     第三章  신문이 퍼뜨린 말 — 그때처럼 쓰기 / 오늘의 보도 준칙대로
     ========================================================= */
  (function () {
    var root = $('#misWrite'); if (!root) return;
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.mw-tabs button'); if (!b) return;
      var k = b.dataset.k;
      $$('.mw-tabs button', root).forEach(function (x) { x.classList.toggle('active', x === b); });
      $$('.mw-pane', root).forEach(function (p) { p.hidden = p.dataset.k !== k; });
    });
  })();

  /* =========================================================
     第四章  號外 — 제목이 한 줄씩, 그리고 틀린 말이 지워짐
     ========================================================= */
  (function () {
    var ex = $('#extra'); if (!ex) return;
    var wall = $('#wordWall', ex);
    if (wall) wall.innerHTML = WORDS.map(function (w, i) {
      return '<li class="ww"><span class="ww-d">' + w.d + '</span><b class="ww-w">' + H(w.w[0], w.w[1]) + '</b><span class="ww-fix">' + H(w.fix[0], w.fix[1]) + '</span></li>';
    }).join('') + '<li class="ww ww-true"><span class="ww-d">' + H('채록 第一號', '채록 1호') + '</span><b class="ww-w">' + H('「아해의 골은, 약이 된다」', '「아이의 골은, 약이 된다」') + '</b><span class="ww-fix">' + H('이 말만이, 사람을 움직엿소.', '이 말만이, 사람을 움직였다.') + '</span></li>';
    var done = false;
    function run() {
      if (done) return; done = true;
      var T = 600, step = function (fn, ms) { setTimeout(fn, T); T += ms; };
      $$('.ex-lines li', ex).forEach(function (li) { step(function () { li.classList.add('on'); }, 1000); });
      step(function () { ex.classList.add('plate-on'); }, 1400);
      step(function () { ex.classList.add('twist'); play('sfxBell'); }, 2600);
      step(function () { ex.classList.add('truth'); }, 2600);
      step(function () { ex.classList.add('echo'); }, 2200);
      $$('.ww', ex).forEach(function (li) { if (li.classList.contains('ww-true')) return; step(function () { li.classList.add('struck'); }, 650); });
      step(function () { ex.classList.add('left'); document.body.classList.add('jk-judged'); }, 1600);
      step(function () { ex.classList.add('final'); }, 0);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } }); }, { threshold: 0.2 });
      io.observe(ex);
    } else run();
  })();

  /* =========================================================
     第五章  말은 아즉 떠도오 — 미신의 주파수
     ========================================================= */
  var JK = './';
  var ST = [
    { y: '1933', ang: 18, no: '제0호', when: '1933년 · 경성 죽첨정', au: null, moon: 70,
      h: '약이 된다는<br><em>말 한마디</em>가',
      t: ['약이 된다는 말 한 마듸', '약이 된다는 말 한마디'],
      b: [['진범은 여섯 살 아해의 병을 고치려 하엿다고 자백하엿소 (동아일보 소화 팔 년 유월 팔일)', '진범은 여섯 살 아이의 병을 고치려 했다고 자백했다 (동아일보 1933.6.8)'], ['그 이십삼 일 동안 지면은 한센병 환자와 한 집안을 차례로 의심하엿소', '그 23일 동안 신문은 한센병 환자와 한 집안을 차례로 의심했다']],
      d: ['이 칸은 녹음이 업소. 소화 팔 년 유월 팔일자 지면이 남긴 말만 화면으로 전하오. 다이알을 돌리면, 그 한 마듸가 지나온 세월이 잡히오.', '이 칸은 녹음이 없습니다. 1933년 6월 8일자 지면이 남긴 말만 화면으로 전합니다. 다이얼을 돌리면, 그 한마디가 지나온 세월이 잡힙니다.'],
      link: ['모든 주파수는 이 한 마듸에서 비롯하오 — 「아해의 골은 약이 된다」.', '모든 주파수는 이 한마디에서 시작된다 — 「아이의 골은 약이 된다」.'] },
    { y: '1930s', ang: 90, no: '제1호', when: '1930년대 ~ 해방 전후', au: 'case01.mp3', card: 'case01.png', moon: 28,
      h: '약이 없던 시절,<br>사람들은 <em>아이의 무덤</em>을 팠다',
      t: ['약이 업든 시절, 사람들은 아해의 무덤을 팟다', '약이 없던 시절, 사람들은 아이의 무덤을 팠다'],
      b: [['소화 십년대 중반 함경 · 평안도, 갓 무든 아해의 무덤을 판 일', '1930년대 중반 함경·평안도, 갓 묻힌 영아 무덤 도굴'], ['해방 뒤, 「아해를 잡아간다」는 소문이 실제 사건으로', '해방 후, "아이를 잡아간다"는 소문이 실제 사건으로']],
      d: ['소화 년간 긔록에서 차진 사건이오. 그때의 긔록을 오늘의 독자가 다시 드를 수 잇도록 라듸오로 꾸며 노앗소.', '1930년대 기록에서 발견한 사건입니다. 당시의 기록을 라디오 형식으로 재구성했습니다.'],
      link: ['죽첨정의 무덤은 처음이 아니엇소. 가튼 말이, 북쪽의 무덤들도 열엇소.', '죽첨정의 무덤은 처음이 아니었다. 같은 말이, 북쪽의 무덤들도 열었다.'] },
    { y: '1953', ang: 162, no: '제2호', when: '1953년 · 전북 남원', au: 'case02.mp3', card: 'case02.png', moon: 22,
      h: '미신이 빼앗은 건<br><em>아이 하나</em>가 아니었다',
      t: ['미신이 빼아슨 것은 아해 하나가 아니엿다', '미신이 빼앗은 건 아이 하나가 아니었다'],
      b: [['「생간을 먹으면 낫는다」는 미듬이 나은 영아 살해 사건', '"생간을 먹으면 낫는다"는 믿음이 낳은 영아 살해 사건'], ['그 뒤 전국의 한센인에게 번진 집단 린치와 혐오', '그 뒤 전국의 한센인에게 번진 집단 린치와 혐오']],
      d: ['전쟁 끗의 어수선하고 불안한 틈에도 비슷한 미듬과 사건이 긔록에 나타낫소. 그때 긔록을 라듸오로 꾸며 노앗소.', '전쟁 직후의 혼란 속에서도 비슷한 믿음과 사건은 기록에 등장했습니다. 당시 기록을 라디오 형식으로 재구성했습니다.'],
      link: ['소화 팔 년 첫 지면의 짐작 — 「문둥병 환자의 짓」. 스무 해 뒤에도, 가튼 혐오가 한센인을 향하엿소.', '1933년 첫 신문의 짐작 — "문둥병 환자의 짓". 스무 해 뒤에도, 같은 혐오가 한센인을 향했다.'] },
    { y: '1970s', ang: 234, no: '제3호', when: '1970년대', au: 'case03.mp3', card: 'case04.png', moon: 76,
      h: '갓난아이 무덤만<br><em>골라 판</em> 사람들',
      t: ['갓난아해 무덤만 골라 판 사람들', '갓난아이 무덤만 골라 판 사람들'],
      b: [['「아해 뼛가루를 먹으면 낫는다」는 무당의 꾐, 동자 무덤을 판 일', '"아이 뼛가루를 먹으면 낫는다"는 무당의 꾐, 동자 무덤 도굴'], ['사산아 · 태반까지 약재로 거래된 음지의 암시장', '사산아·태반까지 약재로 거래된 음지의 암시장']],
      d: ['공장이 늘고 세상이 변하든 때에도 오랜 미듬은 아조 사라지지 아넛소. 그때 긔록을 라듸오로 다시 드러 보시압.', '산업화 시기에도 오래된 믿음은 사라지지 않았습니다. 당시 기록을 라디오 형식으로 다시 살펴봅니다.'],
      link: ['죽첨정처럼, 다시 무덤이엇소. 말은 사람 대신 묘지를 차저갓소.', '죽첨정처럼, 다시 무덤이었다. 말은 사람 대신 묘지를 찾아갔다.'] },
    { y: '2011', ang: 306, no: '제4호', when: '2011~2012년 · 관세청 적발', au: 'case04.mp3', card: 'case03.png', moon: 34,
      h: '죽첨정의 미신은<br><em>캡슐</em>이 되어 돌아왔다',
      t: ['죽첨정의 미신은 다른 모양으로 도라왓다', '죽첨정의 미신은 다른 모습으로 돌아왔다'],
      b: [['이천십일 년 팔월부터 중국발 「인육 캡슐」 밀반입이 잇따라 적발되엇소 (관세청)', '2011년 8월부터 중국발 "인육 캡슐" 밀반입이 잇따라 적발됨 (관세청)'], ['소화 팔 년에서 여든 해 가까이, 미신은 「보약」의 얼골을 하고 잇섯소', '1933년에서 여든 해 가까이, 미신은 "보약"의 얼굴을 하고 있었다']],
      d: ['녯 미듬과 이야기가 오늘에 와서 엇더케 모양을 바꾸는지 긔록으로 살펴보시압.', '과거의 믿음이 현대에 들어 어떤 방식으로 변주되는지 기록을 통해 살펴봅니다.'],
      link: ['여든 해 가까이 지나도, 그 한 마듸는 겁질만 바꾸어 국경을 넘엇소.', '여든 해 가까이 지나도, 그 한마디는 포장만 바꿔 국경을 넘었다.'] }
  ];
  var GAPS = [
    ['1933', '1930s', '그 말은 죽첨정에서 처음 생긴 것이 아니엇소.', '그 말은 죽첨정에서 처음 생긴 것이 아니었다.'],
    ['1930s', '1953', '해방이 와도, 전쟁이 와도 — 그 말은 살아남앗소.', '해방이 와도, 전쟁이 와도 — 그 말은 살아남았다.'],
    ['1953', '1970s', '돌은 한센인에게 날아갓고, 무덤은 더 작아졋소.', '돌은 한센인에게 날아갔고, 무덤은 더 작아졌다.'],
    ['1970s', '2011', '무덤 대신 약장수가, 약장수 대신 국경 너머의 캡슐이.', '무덤 대신 약장수가, 약장수 대신 국경 너머의 캡슐이.'],
    ['2011', '1933', '모양만 바꾼 그 한 마듸를 따라가면 — 다시 소화 팔 년, 죽첨정 쓰레기장.', '모양만 바꾼 그 한마디를 따라가면 — 다시 1933년, 죽첨정 쓰레기장.']
  ];

  (function () {
    var root = $('#mrRadio'); if (!root) return;
    var LO = 550, HI = 1500, freqOf = function (a) { return LO + ((a % 360) + 360) % 360 / 360 * (HI - LO); };
    var pct = function (f) { return (f - LO) / (HI - LO) * 100; };
    var HILLS = '<svg class="rx-hills" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46 L40 24 L76 40 L118 12 L160 38 L196 22 L236 42 L270 28 L300 38 L300 60 L0 60Z" fill="#221d17"></path><path d="M0 54 L60 42 L110 50 L160 40 L214 52 L260 44 L300 50 L300 60 L0 60Z" fill="#191510"></path></svg>';
    root.innerHTML =
      '<div class="rx-panel rx-room"><div class="rx-room-bg" aria-hidden="true" style="background-image:url(\'' + JK + 'image/Jukcheomjeong/case/room.jpg\')"></div>' +
        '<div class="rx-mast"><strong>京城野錄</strong><small>' + H('긔록 수신긔', '기록 수신기') + '</small></div>' +
        '<button type="button" class="rx-radio" aria-label="라디오 켜기"><span class="rx-glow" aria-hidden="true"></span><img alt="1930년대 나무 라디오 (재현 그림)" draggable="false" src="' + JK + 'image/Jukcheomjeong/case/radio.png"><span class="yk-credit">재현</span></button>' +
        '<p class="rx-hint">' + H('라듸오를 눌러<br>긔록의 주파수를 바드시오.', '라디오를 눌러<br>기록의 주파수를 받으세요.') + '</p></div>' +
      '<div class="rx-panel rx-tuner"><div class="rx-scale"><div class="rx-nums"><span>550</span><span>700</span><span>900</span><span>1100</span><span>1300</span><span>1500</span></div><div class="rx-ticks"></div><span class="rx-needle"></span>' +
        '<div class="rx-years">' + ST.map(function (s, i) { return '<button type="button" data-i="' + i + '" style="left:' + pct(freqOf(s.ang)) + '%">' + s.y + '</button>'; }).join('') + '</div></div>' +
        '<div class="rx-dial-wrap"><span class="rx-screw a"></span><span class="rx-screw b"></span><span class="rx-screw c"></span><span class="rx-screw d"></span><span class="rx-dial-mark" aria-hidden="true"></span>' +
        '<div class="rx-dial" role="slider" tabindex="0" aria-label="주파수 다이얼. 좌우 화살표로도 돌릴 수 있습니다." aria-valuemin="550" aria-valuemax="1500"><img alt="" draggable="false" src="' + JK + 'image/Jukcheomjeong/case/dial.png"></div></div>' +
        '<div class="rx-readout">---<small>키로</small></div><div class="rx-bars">' + new Array(23).join('<i></i>') + '</div><span class="rx-signal">' + H('잡히는 정도') + '</span></div>' +
      '<div class="rx-panel rx-air"><div class="rx-screen"><div class="rx-screen-top"><span class="rx-when">' + H('수신 대긔', '수신 대기') + '</span><span class="rx-onair">' + H('방송 중이오', '방송 중') + '</span></div>' +
        '<div class="rx-visual"><span class="rx-moon"></span>' + HILLS + '<p class="rx-static">' + H('전원이 꺼져 잇소', '전원이 꺼져 있습니다') + '</p></div>' +
        '<div class="rx-player"><button type="button" class="rx-play" disabled aria-label="재생"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"></path></svg></button><div class="rx-track"><canvas width="228" height="27"></canvas><span></span></div><span class="rx-time">00:00 / 00:00</span></div></div>' +
        '<article class="rx-scrap"><div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span></div><p class="rx-wait">' + H('이 라듸오가 들려줄 다섯 편', '이 라디오가 들려줄 다섯 편') + '</p><ol class="rx-index">' +
          ST.map(function (s, i) { return '<li data-i="' + i + '"><span>' + s.y + '</span>' + H(s.t[0], s.t[1]) + '</li>'; }).join('') + '</ol></article></div>';
    var dial = $('.rx-dial', root), needle = $('.rx-needle', root), ro = $('.rx-readout', root), bars = $$('.rx-bars i', root);
    var vis = $('.rx-visual', root), when = $('.rx-when', root), onair = $('.rx-onair', root), scrap = $('.rx-scrap', root);
    var pbtn = $('.rx-play', root), trk = $('.rx-track span', root), tm = $('.rx-time', root), cv = $('.rx-track canvas', root);
    var au = $('#disc'), stc = new Audio(JK + 'audio/radio-static.mp3'); stc.loop = true; stc.volume = 0;
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
      vis.innerHTML = '<span class="rx-moon" style="left:' + s.moon + '%"></span>' + HILLS + (s.au ? '' : '<p class="rx-nosound">' + H('이 칸은 소리가 업소 — 지면만 남앗소', '이 칸은 소리가 없어요 — 신문 지면만 남았어요') + '</p>') + '<h4>' + s.h + '</h4>' +
        (s.card ? '<button type="button" class="rx-card rx-vcard" data-card="' + s.card + '" aria-label="카드뉴스 크게 보기"><img alt="' + s.y + ' 카드뉴스" src="' + JK + 'image/Jukcheomjeong/case/' + s.card + '"><span>' + H('크게 보기') + '</span></button>' : '');
      vis.classList.toggle('has-card', !!s.card);
      $$('.rx-years button', root).forEach(function (b, j) { b.classList.toggle('active', j === i); });
      $$('.rx-index li', root).forEach(function (b, j) { b.classList.toggle('on', j === i); });
      scrap.innerHTML = '<div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span><em>' + s.no + ' · ' + s.y + '</em></div>' +
        '<h5>' + H(s.t[0], s.t[1]) + '</h5><ul>' + s.b.map(function (x) { return '<li>' + x[1] + '</li>'; }).join('') + '</ul><p>' + H(s.d[0], s.d[1]) + '</p>' +
        (s.link ? '<p class="rx-link"><b>' + H('죽첨정과 겹치는 자리', '죽첨정과 겹치는 자리') + '</b>' + s.link[1] + '</p>' : '') +
        '<div class="rx-scrap-foot"><button type="button" class="rx-retune">' + H('다른 주파수 차즈시오', '다른 주파수 찾기') + '</button>' +
        '</div>';
      if (s.au) { au.src = AUD + s.au; au.currentTime = 0; var p = au.play(); if (p && p.catch) p.catch(function () {}); pbtn.disabled = false; }
      else { au.pause(); au.removeAttribute('src'); pbtn.disabled = true; tm.textContent = '소리 없는 칸 · 다이얼을 돌려 보세요'; trk.style.width = '0'; wave(0); }
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


  /* ── 이십삼 일: 하루씩 넘어가는 달력 ── */
  (function () {
    var root = $('#days'); if (!root) return;
    var NEWS = { '5.17': ['첫 보도', '「사내아해 갓다」'], '5.18': ['이튿날', '「오리무중」'], '5.19': ['비', '흔적이 씻김'], '5.25': ['회의', '방침을 다시'], '6.2': ['오보', '「유력한 혐의자」'], '6.3': ['백여 명', '붓들림'], '6.8': ['號外', ''] };
    var cells = [], d = new Date(1933, 4, 16);
    for (var n = 0; n <= 23; n++) {
      var k = (d.getMonth() + 1) + '.' + d.getDate(), nw = NEWS[k];
      cells.push('<li class="dy' + (n === 0 ? ' found' : '') + (nw ? ' news' : '') + (k === '6.2' ? ' mis' : '') + (n === 23 ? ' last' : '') + '" style="--n:' + n + '"><small>' + (n === 0 ? '發見' : n + '日') + '</small><b>' + k + '</b>' +
        (n === 0 ? '<i>쓰레기장</i>' : nw ? '<i>' + nw[0] + '</i><em>' + nw[1] + '</em>' : '<i class="nil">—</i>') + '</li>');
      d.setDate(d.getDate() + 1);
    }
    root.innerHTML = cells.join('');
  })();


  /* ── 第四章 지면 뒤의 스물세 날 — 날은 가고, 단서는 하나씩 지워짐 ── */
  (function () {
    var sec = $('#story'); if (!sec) return;
    var num = $('.st-n', sec), dt = $('.st-date', sec), ticks = $$('.st-ticks i', sec), scs = $$('.st-sc', sec), days = $$('.st-day', sec);
    var bgs = $('.st-bgs', sec), cl = $('.st-clues ol', sec);
    /* 무대 높이 = 화면 높이 (배율과 상관없이) */
    var stage = $('.st-stage', sec);
    function fitStage() { var h = Math.round(Math.max(window.innerHeight, document.documentElement.clientHeight) * 1.35); stage.style.height = h + 'px'; stage.style.marginBottom = (-h) + 'px'; }
    fitStage(); window.addEventListener('resize', fitStage);
    /* 단서: add 나타나는 장면 · end 지워지는 장면 · q 의심이 붙는 장면 · live 마지막까지 살아 있는 단서 */
    var CL = [
      { t: ['경찰견의 자취', '경찰견의 흔적'], add: 0, end: 0, why: ['령사관 근처에서 끈김', '영사관 근처에서 끊김'] },
      { t: ['하로 만의 감정', '하루 만의 감정'], add: 1, q: 7, why: ['그 감정은 맛는가?', '그 감정은 맞는가?'] },
      { t: ['쌀 봉지', '쌀 봉지'], add: 2, end: 2, why: ['어느 집 봉지인지 모름', '어느 집 봉지인지 모름'] },
      { t: ['개천', '개천'], add: 3, end: 3, why: ['아모것도 업슴', '아무것도 없음'] },
      { t: ['붓들린 오십여 명', '붙들린 50여 명'], add: 4, end: 7, why: ['백여 명이 풀려남', '100여 명이 풀려남'] },
      { t: ['헝겊 한 조각 · 한 집 다섯', '헝겊 한 조각 · 한 집 다섯'], add: 5, q: 6, why: ['모다 부인', '모두 부인'] },
      { t: ['자백', '자백'], add: 6, end: 6, why: ['금화산 — 아모것도 업슴', '금화산 — 아무것도 없음'] },
      { t: ['닷새 안에 죽은 아해의 무덤', '닷새 안에 죽은 아이의 무덤'], add: 7, live: 1 },
      { t: ['염리 공동묘지', '염리 공동묘지'], add: 8, live: 1 }
    ];
    cl.innerHTML = CL.map(function (c, k) { return '<li data-k="' + k + '"><b>' + H(c.t[0], c.t[1]) + '</b>' + (c.why ? '<small>' + H(c.why[0], c.why[1]) + '</small>' : '') + '</li>'; }).join('');
    var lis = $$('li', cl), last = -1;
    function clues(i) {
      CL.forEach(function (c, k) {
        var li = lis[k], show = i >= c.add;
        li.classList.toggle('on', show);
        li.classList.toggle('dead', show && c.end != null && i >= c.end);
        li.classList.toggle('ask', show && c.q != null && i >= c.q && !(c.end != null && i >= c.end));
        li.classList.toggle('live', show && !!c.live);
        li.classList.toggle('fresh', show && c.add === i);
      });
    }
    function set(el) {
      var n = +el.dataset.n, i = +el.dataset.i;
      num.textContent = n;
      ticks.forEach(function (t, k) { t.classList.toggle('on', k <= n); });
      dt.innerHTML = H(el.dataset.d, el.dataset.d);
      sec.style.setProperty('--p', Math.min(1, n / 22));
      if (el.classList.contains('st-sc')) {
        scs.forEach(function (x) { x.classList.toggle('now', x === el); });
        $$('.st-bg', bgs).forEach(function (b) { b.classList.toggle('on', +b.dataset.i === i); });
        sec.classList.toggle('rain', i === 3 || i === 9);
      }
      if (i !== last) { last = i; clues(i); }
    }
    /* 재현 그림: 파일이 있으면 그 장면 뒤에 깔림 (없으면 어둠만) */
    scs.forEach(function (sc) {
      var im = new Image(); im.onload = function () { var d = document.createElement('div'); d.className = 'st-bg'; d.dataset.i = sc.dataset.i; d.style.backgroundImage = 'url(' + sc.dataset.mj + ')'; bgs.appendChild(d); sc.classList.add('has-fig'); if (sc.classList.contains('now')) d.classList.add('on'); };
      im.src = sc.dataset.mj;
    });
    if (!('IntersectionObserver' in window)) { scs.concat(days).forEach(function (x) { x.classList.add('on'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); set(e.target); } });
    }, { rootMargin: '-42% 0px -48% 0px' });
    scs.concat(days).forEach(function (x) { io.observe(x); });
    /* 무대(배경 · 비 · 조여 오는 어둠)는 이 장 안에 있을 때만 */
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { sec.classList.toggle('inview', e.isIntersecting); if (e.isIntersecting) { sec.classList.add('in'); stamp('story'); } }); }, { rootMargin: '0px 0px -20% 0px' });
    io2.observe(sec);
    set(scs[0]);
  })();

  /* ── 스물세 날의 비 — 그림 우에 내리는 빗줄기 · 빗소리 ── */
  (function () {
    var sec = $('#story'), box = sec && $('.st-rain', sec); if (!box) return;
    var cv = document.createElement('canvas'); box.appendChild(cv);
    var cx = cv.getContext('2d'), W = 0, Hh = 0, drops = [], rip = [], on = false, lvl = 0, raf = 0, last = 0;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { var r = box.getBoundingClientRect(); W = Math.max(1, r.width); Hh = Math.max(1, r.height); cv.width = W * dpr; cv.height = Hh * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function drop(fresh) {
      var z = Math.random();                      /* 0 먼 비 … 1 가까운 비 */
      return { x: Math.random() * (W + 200) - 100, y: fresh ? Math.random() * Hh : -Math.random() * 200, z: z,
        v: 900 + z * 1500, l: 14 + z * 46, a: .10 + z * .32, w: .6 + z * 1.1 };
    }
    function fill() { drops = []; var n = Math.round(W * Hh / 2600); for (var i = 0; i < n; i++) drops.push(drop(true)); }
    var WIND = .16;
    function frame(t) {
      var dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
      lvl += ((on ? 1 : 0) - lvl) * Math.min(1, dt * 1.2);
      cx.clearRect(0, 0, W, Hh);
      if (lvl > .01) {
        cx.lineCap = 'round';
        for (var i = 0; i < drops.length; i++) {
          var d = drops[i];
          d.y += d.v * dt; d.x += d.v * WIND * dt;
          if (d.y > Hh) { if (d.z > .7 && Math.random() < .5) rip.push({ x: d.x, y: Hh - 6 - Math.random() * Hh * .18, r: 1, a: .35 * d.z }); drops[i] = drop(false); continue; }
          cx.strokeStyle = 'rgba(226,216,192,' + (d.a * lvl).toFixed(3) + ')'; cx.lineWidth = d.w;
          cx.beginPath(); cx.moveTo(d.x, d.y); cx.lineTo(d.x - d.l * WIND, d.y - d.l); cx.stroke();
        }
        for (var k = rip.length - 1; k >= 0; k--) {
          var p = rip[k]; p.r += 40 * dt; p.a -= .6 * dt; if (p.a <= 0) { rip.splice(k, 1); continue; }
          cx.strokeStyle = 'rgba(226,216,192,' + (p.a * lvl).toFixed(3) + ')'; cx.lineWidth = .8;
          cx.beginPath(); cx.ellipse(p.x, p.y, p.r, p.r * .28, 0, 0, Math.PI * 2); cx.stroke();
        }
        /* 빗안개 */
        var gr = cx.createLinearGradient(0, Hh * .55, 0, Hh); gr.addColorStop(0, 'rgba(180,170,150,0)'); gr.addColorStop(1, 'rgba(180,170,150,' + (.10 * lvl).toFixed(3) + ')');
        cx.fillStyle = gr; cx.fillRect(0, 0, W, Hh);
      }
      sound(lvl);
      if (on || lvl > .01) raf = requestAnimationFrame(frame); else { raf = 0; last = 0; lvl = 0; cx.clearRect(0, 0, W, Hh); if (gain) gain.gain.setTargetAtTime(0, ac.currentTime, .2); }
    }
    /* 빗소리 — 파일 없이 브라우저에서 만든 소리 (잔잔한 빗소리 + 가끔 떨어지는 굵은 방울) */
    var ac = null, gain = null, tick = 0;
    function makeSound() {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      ac = new C();
      var len = ac.sampleRate * 3, buf = ac.createBuffer(2, len, ac.sampleRate);
      for (var ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch), b0 = 0, b1 = 0, b2 = 0; for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099; b1 = .963 * b1 + w * .2965; b2 = .57 * b2 + w * 1.0527; d[i] = (b0 + b1 + b2 + w * .1848) * .16; } }
      var src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
      var hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 380;
      var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
      var pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 2400; pk.gain.value = 4; pk.Q.value = .8;
      gain = ac.createGain(); gain.gain.value = 0;
      src.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(gain); gain.connect(ac.destination); src.start();
      return ac;
    }
    function plink() {                              /* 처마에서 떨어지는 굵은 방울 */
      if (!ac || ac.state !== 'running') return;
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime, f = 900 + Math.random() * 1400;
      o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .55, t + .09);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.018 * lvl, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .12);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .14);
    }
    function sound(v) {
      if (!gain) return;
      gain.gain.setTargetAtTime(.32 * v, ac.currentTime, .4);
      if (v > .3 && ++tick % 9 === 0 && Math.random() < .55) plink();
    }
    var chip = document.createElement('button'); chip.type = 'button'; chip.className = 'st-sound';
    chip.innerHTML = H('빗소리 듯기', '빗소리 듣기'); document.body.appendChild(chip);
    var muted = false;
    function wake() { if (muted) return; if (!ac) makeSound(); if (ac && ac.state === 'suspended') ac.resume(); }
    chip.addEventListener('click', function () {
      if (ac && ac.state === 'running' && !muted) { muted = true; gain.gain.setTargetAtTime(0, ac.currentTime, .2); ac.suspend(); chip.innerHTML = H('빗소리 듯기', '빗소리 듣기'); return; }
      muted = false; wake(); chip.innerHTML = H('빗소리 끄기', '빗소리 끄기');
    });
    ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function () { if (on) { wake(); if (ac && ac.state !== 'suspended') chip.innerHTML = H('빗소리 끄기', '빗소리 끄기'); } }, { passive: true }); });
    function setRain(v) {
      if (v === on) return; on = v; sec.classList.toggle('raining', v); chip.classList.toggle('show', v);
      if (v) { if (!W || !drops.length) { size(); fill(); } wake(); if (ac && ac.state === 'running') chip.innerHTML = H('빗소리 끄기', '빗소리 끄기'); if (!raf) raf = requestAnimationFrame(frame); }
    }
    window.addEventListener('resize', function () { if (on) { size(); fill(); } });
    new MutationObserver(function () { setRain(sec.classList.contains('rain') && sec.classList.contains('inview')); }).observe(sec, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ── 섹션 나타나기 · 취재 도장 ── */
  var nb = $('.notebook'), got = {};
  function stamp(beat) {
    if (window.ykGuideOn) return;
    var b = nb && $('button[data-beat="' + beat + '"]', nb); if (!b || got[beat]) return;
    got[beat] = 1; b.classList.add('got');
    var c = Object.keys(got).length, all = $$('.nb-stamps button', nb).length; $('.nb-count', nb).textContent = c + ' / ' + all;
    if (c === all) nb.classList.add('done');
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
    $$('.sec, .bridge, .rumor, .extra, .finale, .days').forEach(function (s) { io.observe(s); });
    /* 보는 법 안내 중에 지나간 장은, 직접 다시 올 때 도장 */
    var ioS = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !window.ykGuideOn && e.target.dataset.beat) stamp(e.target.dataset.beat); }); }, { threshold: 0.18 });
    $$('[data-beat]').forEach(function (s) { if (!s.closest('.notebook')) ioS.observe(s); });
  } else { $$('.sec, .bridge, .rumor, .extra, .finale, .days').forEach(function (s) { s.classList.add('in'); }); }

  /* ── 비하인드(호외) 카드 ── */
  (function () {
    var m = $('#behind'), tab = $('.hogoe-tab'); if (!m || !tab) return;
    var pics = [1, 2, 3, 4].map(function (n) { return IMG + 'behind-fixed/behind0' + n + '.jpg'; }), i = 0;
    function show(k) { i = (k + pics.length) % pics.length; $('.mr-modal-img img', m).src = pics[i]; $('.mr-page-no', m).textContent = (i + 1) + ' / ' + pics.length; }
    function open() { m.hidden = false; tab.classList.add('seen'); $('.mr-prev', m).hidden = false; $('.mr-next', m).hidden = false; show(0); play('sfxBell'); }
    function close() { m.hidden = true; }
    tab.addEventListener('click', open);
    window.ykMariaCard = function (src) { m.hidden = false; $('.mr-modal-img img', m).src = src; $('.mr-page-no', m).textContent = '號外'; $('.mr-prev', m).hidden = true; $('.mr-next', m).hidden = true; };
    $('.mr-x', m).addEventListener('click', close);
    $('.mr-prev', m).addEventListener('click', function () { show(i - 1); });
    $('.mr-next', m).addEventListener('click', function () { show(i + 1); });
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    document.addEventListener('keydown', function (e) { if (m.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
    /* 사건 요지를 지나면 한 번 저절로 펼침 (죽첨정 페이지와 같은 흐름) */
    var shown = false, brief = $('.case-brief');
    if (brief && 'IntersectionObserver' in window) {
      var o2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && e.boundingClientRect.top < 0 && !shown) { shown = true; open(); o2.disconnect(); } }); });
      o2.observe(brief);
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
  var SEL = ['#rumor', '#daysBand', '#extra', '#finale'];
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

/* 다른 사건 · 손기정 카드 — 마우스를 올리면 흰 붓이 가슴의 일장기를 지우고, 그날의 지면이 됨 */
(function () {
  var a = document.querySelector('a.nc-card[href*="sonkijeong"]'); if (!a) return;
  var fig = a.querySelector('figure'); if (!fig) return;
  /* 실제 동아일보 1936.8.25 석간 지면 — 일장기가 지워진 사진 그대로, 칸에 꽉 차게 */
  var im = fig.querySelector('img');
  if (im) { im.src = '../assets/case3_dong0825.jpg'; im.alt = '동아일보 1936년 8월 25일자 — 일장기가 지워진 손기정 사진'; im.style.objectPosition = '78% 30%'; }
  return;
  var P = 'M222 392 C262 386 306 388 352 394 M222 410 C262 404 306 406 352 412 M222 428 C262 422 306 424 352 430 M222 446 C262 440 306 442 352 448 M222 464 C262 458 306 460 352 466 M222 482 C262 476 306 478 352 484';
  fig.classList.add('sb-card');
  fig.innerHTML = '<svg viewBox="0 0 560 810" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
    '<image class="o" href="../assets/case3-original.jpg" x="0" y="0" width="560" height="810"/>' +
    '<path class="br" d="' + P + '" fill="none" stroke="#f1ede4" stroke-width="22" stroke-linecap="round"/>' +
    '<image class="e" href="../assets/case3.jpg" x="0" y="0" width="560" height="810" preserveAspectRatio="xMidYMid slice"/></svg>' +
    '<span class="sb-st">停刊<small>二百七十八日</small></span><span class="sb-hn">마우스를 대면, 붓이 지나가오</span>';
  var css = document.createElement('style');
  css.textContent = '.sb-card{position:relative;background:#efe8d8!important}' +
    '.sb-card svg{display:block;width:100%;height:100%;filter:grayscale(1) sepia(.4) contrast(1.05)}' +
    '.sb-card .br{stroke-dasharray:1100;stroke-dashoffset:1100;transition:stroke-dashoffset 1.6s cubic-bezier(.6,0,.3,1)}' +
    '.sb-card .e{opacity:0;transition:opacity 2s ease}' +
    'a.nc-card:hover .sb-card .br,a.nc-card:focus .sb-card .br{stroke-dashoffset:0;transition-delay:.2s}' +
    'a.nc-card:hover .sb-card .e,a.nc-card:focus .sb-card .e{opacity:1;transition-delay:1.9s}' +
    '.sb-st{position:absolute;right:8%;top:10%;padding:4px 8px 3px;border:2.5px solid #9a2a1c;color:#9a2a1c;font-family:"Song Myung",serif;font-size:19px;line-height:1.15;letter-spacing:.12em;text-align:center;background:#efe8d8cc;opacity:0;transform:rotate(-8deg) scale(2);mix-blend-mode:multiply;pointer-events:none}' +
    '.sb-st small{display:block;font-size:9.5px;letter-spacing:.25em}' +
    'a.nc-card:hover .sb-st,a.nc-card:focus .sb-st{opacity:.88;transform:rotate(-8deg);transition:transform .4s cubic-bezier(.3,1.6,.5,1) 3.6s,opacity .2s 3.6s}' +
    '.sb-hn{position:absolute;left:0;right:0;bottom:6px;text-align:center;font-size:11px;letter-spacing:.2em;color:#6e6250;transition:opacity .4s}' +
    'a.nc-card:hover .sb-hn{opacity:0}';
  document.head.appendChild(css);
})();
