/* 경성야록 · 부산 마리아 참살사건 — 화면 장치 (보통 스크립트, 더블클릭으로도 동작)
   - 글자: <span class="hj" data-ko="오늘말">옛말</span> → 마우스를 올리면 오늘말로 바뀜
   - 그림/소리는 ../case/ 폴더의 것을 씀 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = '../case/image/maria/';
  var AUD = '../case/audio/maria/';
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
     01  부산, 그때와 이제
     ========================================================= */
  var PLACES = [
    { name: '초량 거리', sub: ['관사가 모인 동네', '철도 관사가 모인 동네'],
      then: IMG + 'place/choryang-1930.jpg', now: IMG + 'place/choryang-2026-02.jpg',
      thenAddr: ['부산부 초량정', '부산부 초량정'], nowAddr: ['부산 동구 초량동', '부산 동구 초량동'],
      text: ['철도국 관사가 모여 잇든 초량정 거리. 마리아가 숨진 집도 이 일대에 잇섯소. 옛 거리의 전차 길은 이제 좁은 골목과 가게로 바뀌엇소.',
             '철도국 관사가 모여 있던 초량동 거리. 마리아가 숨진 집도 이 일대에 있었다. 옛 거리의 전찻길은 이제 좁은 골목과 가게로 바뀌었다.'] },
    { name: '초량 언덕', sub: ['바다와 역 사이', '바다와 역 사이의 비탈'],
      then: IMG + 'place/choryang-view-02.jpg', now: IMG + 'place/choryang-2026-04.jpg',
      thenAddr: ['초량 바닷가 · 낫은 지붕들', '초량 바닷가 · 낮은 지붕들'], nowAddr: ['산비탈까지 들어찬 동네', '산비탈까지 들어찬 동네'],
      text: ['바다와 역 사이에 끼인 초량. 옛 사진의 낫은 지붕들은 이제 산비탈 꼭대기까지 빽빽한 집들로 바뀌엇소.',
             '바다와 역 사이에 끼인 초량. 옛 사진의 낮은 지붕들은 이제 산비탈 꼭대기까지 빽빽한 집들로 바뀌었다.'] },
    { name: '부산역', sub: ['관부연락선이 닷든 문', '관부연락선이 닿던 관문'],
      then: IMG + 'place/busan-station-1930.jpg', now: IMG + 'place/busan-station-2026.jpg',
      thenAddr: ['부산부 대창정 · 옛 부산역', '부산부 대창정 · 옛 부산역'], nowAddr: ['부산 동구 초량동 · 오늘의 부산역', '부산 동구 초량동 · 지금의 부산역'],
      text: ['관부연락선을 타고 건너온 사람과 짐이 경부선으로 갈아타든 문이오. 붉은 벽돌 옛 역사는 1953년 큰불로 사라지고, 역은 1969년 초량으로 옴겨 오늘에 이르럿소.',
             '관부연락선을 타고 건너온 사람과 짐이 경부선으로 갈아타던 관문이다. 붉은 벽돌의 옛 역사는 1953년 큰불로 사라졌고, 역은 1969년 초량으로 옮겨 지금에 이르렀다.'] }
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
        '<figure class="duo-cell"><img alt="' + p.name + ' 그때 모습" src="' + p.then + '"><span class="tag-paper left"><small>' + H('그때') + '</small><b>' + H('옛 사진', '옛 사진') + '</b></span></figure>' +
        '<figure class="duo-cell"><img alt="' + p.name + ' 지금 모습" src="' + p.now + '"><span class="tag-paper left"><small>' + H('이제', '지금') + '</small><b>' + H('오늘') + '</b></span></figure></div>';
      $('.pl-record', root).innerHTML =
        '<div class="pr-num">0' + (cur + 1) + '</div><div class="pr-text"><span class="pr-kicker">' + H('장소 긔록', '장소 기록') + '</span><h3>' + p.name + '</h3>' +
        '<div class="pr-then-now"><div><small>' + H('그때 자리', '그때 자리') + '</small><b>' + H(p.thenAddr[0], p.thenAddr[1]) + '</b></div><span aria-hidden="true">→</span><div><small>' + H('이제 자리', '지금 자리') + '</small><b>' + H(p.nowAddr[0], p.nowAddr[1]) + '</b></div></div>' +
        '<p>' + H(p.text[0], p.text[1]) + '</p></div>' +
        '<figure class="pr-photo"><img alt="" src="' + p.then + '"><span class="pr-seal" aria-hidden="true">釜山</span></figure>' +
        '<span class="pr-src">사진 · 부산 옛 사진 / 오늘 사진</span>';
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
     02  동아일보가 쪼차간 긔록 (인물 이름은 가림)
     ========================================================= */
  var ARTS = [
    { d: ['팔월 사일 · 一', '8월 4일 ①'], tag: ['처음 실림', '처음 실림'], day: ['사흘째', '사흘째'], date: '1931.08.04', img: '19310804_01.png',
      title: '철도 관사의 아침, 스무 살 하녀가 일어나지 않았다',
      lead: '1931년 8월 1일 아침, 부산 초량정 철도국 관사 15호. 조선인 하녀 마리아(본명 변흥례·20)가 숨진 채 발견됐다.',
      body: ['집주인은 출장 중이었다. 집에는 안주인과 그, 둘뿐이었다.', '경찰은 집 안팎을 살피기 시작했다. 사흘 뒤, 이 죽음은 동아일보 지면에 처음 실렸다.'],
      miss: ['그 밤, 그 아이가 마지막으로 본 얼굴.', '그날 밤, 그 아이가 마지막으로 본 얼굴.'],
      sum: ['부산 초량의 한 사택에서 스무 살 여성 마리아가 숨진 채 발견됐다.', '집주인이 출장으로 집을 비운 사이 사건이 발생한 것으로 보도됐다.', '경찰은 현장 조사와 함께 주변 인물들을 대상으로 수사에 착수했다.'],
      keys: ['부산', '초량', '마리아', '첫보도'] },
    { d: ['팔월 사일 · 二', '8월 4일 ②'], tag: ['가튼 날 · 부검', '같은 날 · 부검 결과'], day: ['사흘째', '사흘째'], date: '1931.08.04', img: '19310804_02.png',
      title: '부검이 말했다 — 사고가 아니다',
      lead: '부검 결과, 마리아의 죽음은 사고가 아닌 범죄로 판단됐다.',
      body: ['경찰은 수사의 방향을 \'누가\'로 돌렸다. 단서는 현장과, 그 밤 집 안에 있던 사람들에게 남아 있었다.', '관사 안의 일이 거리로 새어 나가면서, 부산은 이 사건을 숨죽여 지켜보기 시작했다.'],
      miss: ['목을 조른 손의 크기.', '목을 조른 손의 크기.'],
      sum: ['부검을 통해 마리아의 사망 경위에 대한 추가 사실이 확인됐다.', '경찰은 범죄 사건으로 보고 본격적인 수사에 들어갔다.', '현장과 주변 인물을 중심으로 단서를 찾기 위한 조사가 이어졌다.'],
      keys: ['부검', '수사', '부산경찰', '단서'] },
    { d: ['팔월 십삼일', '8월 13일'], tag: ['수사가 막힘', '수사 난항'], day: ['열이틀째', '열이틀째'], date: '1931.08.13', img: '19310813.png',
      title: '들어온 흔적도, 나간 흔적도 없었다',
      lead: '열이틀이 지나도록 경찰은 범인을 특정하지 못했다.',
      body: ['밖에서 침입한 뚜렷한 흔적은 나오지 않았다. 의심은 천천히 문 안쪽으로 돌아섰다.', '여러 사람이 불려 갔고 여러 물건이 검토됐지만, 그 밤을 설명할 결정적인 한 조각은 끝내 나오지 않았다.'],
      miss: ['문 안쪽에서 잠든 척한 사람의 숨소리.', '문 안쪽에서 잠든 척한 사람의 숨소리.'],
      sum: ['경찰의 수사가 계속됐지만 범인을 특정하지 못했다.', '외부 침입 흔적이 뚜렷하지 않아 집 내부와 주변 인물에 수사가 집중됐다.', '여러 단서가 등장했지만 사건을 해결할 결정적 증거는 확보되지 않았다.'],
      keys: ['수사난항', '내부설', '외부설', '미제'] },
    { d: ['구월 이일', '9월 2일'], tag: ['괴투서', '의문의 투서'], day: ['한 달째', '한 달째'], date: '1931.09.02', img: '19310902.png', mark: '투서',
      title: '이름 없는 편지가, 범인만 알 법한 것을 알고 있었다',
      lead: '사건 한 달 뒤, 경찰서에 날아든 익명의 투서가 수사를 다시 움직였다.',
      body: ['편지에는 그 밤의 일이 지나치게 자세히 적혀 있었다. 경찰은 쓴 사람이 무언가를 알고 있다고 보았다.', '필적이 닮았다는 남자가 붙잡혔지만, 혐의는 나오지 않았다. 편지를 쓴 손은 여전히 어둠 속에 있었다.'],
      miss: ['편지를 쓴 손이 떨렸는지, 웃었는지.', '편지를 쓴 손이 떨렸는지, 웃었는지.'],
      sum: ['범행 과정을 구체적으로 적은 익명의 투서가 등장했다.', '경찰은 투서 작성자가 사건의 중요한 정보를 알고 있다고 판단했다.', '용의자를 조사했지만 혐의가 확인되지 않아 투서자 추적이 계속됐다.'],
      keys: ['익명투서', '필적', '재수사', '추적'] },
    { d: ['구월 오일', '9월 5일'], tag: ['수사를 넓힘', '수사 확대'], day: ['한 달 나흘째', '한 달 나흘째'], date: '1931.09.05', img: '19310905.png',
      title: '의심은 벽 하나 너머, 옆방으로 향했다',
      lead: '경찰은 그 밤 바로 옆방에서 잤던 안주인 오하시 히사코를 집중적으로 조사했다.',
      body: ['수사는 그의 주변 관계를 따라 철도와 동래온천 일대로 넓어졌다.', '생전의 마리아와 길에서 여러 번 말을 나눈 철도 직원도 불려 갔다. 그의 이름은 지면에 실리지 않았다.'],
      miss: ['길에서 그 아이와 이야기하던 사내의 이름.', '길에서 그 아이와 이야기하던 남자의 이름.'],
      sum: ['경찰은 오하시의 아내 히사코를 집중 조사했다.', '수사는 주변 관계와 철도·동래온천 일대로 확대됐다.', '마리아와 접촉했던 주변 인물까지 조사했지만 진범은 확정되지 않았다.'],
      keys: ['히사코', '철도', '동래온천', '수사확대'] },
    { d: ['구월 십륙일', '9월 16일'], tag: ['투서 공개', '투서 공개'], day: ['한 달 보름째', '한 달 보름째'], date: '1931.09.16', img: '19310916.png', mark: '주장',
      title: '"창 너머로 다 보았소" — 지면에 실린 목격자의 편지',
      lead: '9월 16일, 동아일보는 수사의 단서로 거론되던 익명 투서의 내용을 지면에 공개했다.',
      body: ['투서자는 그 밤 관사 가까이에 있었고, 집 안의 일을 보았다고 주장했다. 증거물을 둔 곳까지 적혀 있었다.', '그러나 그것은 끝까지 이름 없는 사람의 주장이었다. 그 목격자는 둘째 편지에서, 스스로를 범인이라 불렀다.'],
      miss: ['그리고 — 범인의 이름.', '그리고 — 범인의 이름.'],
      sum: ['동아일보가 사건의 핵심 단서였던 익명의 투서 내용을 공개했다.', '투서자는 현장 상황을 목격했다고 주장하며 구체적인 정보를 제시했다.', '익명 투서의 주장이었던 만큼 실제 사실과 일치하는지 확인이 필요한 기록이었다.'],
      keys: ['투서공개', '목격자', '수사기록', '동아일보'] }
  ];
  var HOOK = [
    ['주인은 집에 업섯소. 그러면 그 밤, 집 안에는 누가 잇섯는가.', '주인은 집에 없었다. 그렇다면 그날 밤, 집 안에는 누가 있었나.'],
    ['부검은 \'사고가 아니다\'라고 말하엿소. 그러면 누가.', '부검은 \'사고가 아니다\'라고 말했다. 그렇다면 누가.'],
    ['밖에서 들어온 흔적이 업소 — 의심은 문 안쪽으로 도라섯소.', '밖에서 들어온 흔적이 없다 — 의심은 문 안쪽으로 돌아섰다.'],
    ['편지는 범인만 알 법한 것을 알고 잇섯소.', '편지는 범인만 알 법한 것을 알고 있었다.'],
    ['철도국 사람이 또 나왓소. 우연이엇는가.', '철도국 사람이 또 나왔다. 우연이었을까.'],
    ['신문은 일홈 업는 이의 \'목격담\'을 그대로 실럿소.', '신문은 이름 없는 사람의 \'목격담\'을 그대로 실었다.']
  ];
  /* 기자 취재 일지 — 인물마다 한 장. 왼편은 인물 조사표, 오른편은 날짜별 일지 · 의문 · 도장 */
  var PORT = '../assets/portraits/';
  /* 기자 수첩 — 東亞日報 社會部 기자가 부산에 내려가 한 사람씩 캐어 적은 수첩 (재구성)
     글은 그때 말투로, 낱말에 손을 대면 오늘 말로 풀이가 뜸. [옛말, 오늘말] */
  var PEOPLE = [
    { id: 'maria', clip: ['./img/scan/19310804_01.png', '동아일보 팔월 사일 — 첫 보도'], tab: '마리아', name: '마리아', hj: '', mj: './img/p_maria.jpg',
      f: [[['본명', '본명'], ['변흥례. 일인들은 「마리아」라 불럿다.', '변흥례. 일본인들은 「마리아」라 불렀다.']],
          [['나이', '나이'], ['스믈', '스물']],
          [['고향', '고향'], ['충남 텬안군 성환', '충남 천안군 성환']],
          [['처지', '처지'], ['열 살부터 남의 집살이. 월급 십오 원은 한 푼 남김업시 고향에 부첫다.', '열 살부터 남의 집살이. 월급 15원은 한 푼 남김없이 고향에 부쳤다.']],
          [['일홈', '이름'], ['열일곱에 경성 일인 집 하녀로. 주인은 「조선 일홈은 부르기 어렵다」며 마리아라 불럿다.', '열일곱에 서울 일본인 집 가정부로. 주인은 「조선 이름은 부르기 어렵다」며 마리아라 불렀다.']]],
      j: [[['팔월 일일 아츰', '8월 1일 아침'], ['초량뎡 철도관사 십오호. 조선인 하녀 하나가 주검으로 발견되엿다.', '초량정 철도관사 15호. 조선인 하녀 한 명이 시신으로 발견됐다.']],
          [['가튼 날', '같은 날'], ['아츰 열 시에야 문이 열렷다. 목에 감긴 비단 띄. 사고가 아니다.', '아침 10시에야 문이 열렸다. 목에 감긴 비단 띠. 사고가 아니다.']],
          [['탐문', '탐문'], ['일어를 곳잘 하고, 주인 얼골만 보고도 맥주인지 청주인지 아랏다 한다. 장사엿다고도 한다. 사십 킬로 짐을 지고 십 리를 례사로 거럿다고. 그런 아이가 소리 한 번 못 질럿단 말인가.', '일본어를 곧잘 하고, 주인 얼굴만 보고도 맥주인지 청주인지 알았다고 한다. 힘이 장사였다고도 한다. 40킬로 짐을 지고 십 리를 예사로 걸었다고. 그런 아이가 소리 한 번 못 질렀단 말인가.']],
          [['탐문', '탐문'], ['전날 밤 아홉 시, 아씨가 「래일은 늣게 이러나도 조타」 하엿다 한다. 어찌 하필 그 밤에.', '전날 밤 9시, 안주인이 「내일은 늦게 일어나도 좋다」고 했다고 한다. 왜 하필 그날 밤에.']]],
      q: ['그 아이의 비명을 — 벽 한 겹 너머는, 어찌 듯지 못하엿는가.', '그 아이의 비명을 — 벽 한 겹 너머는, 왜 듣지 못했는가.'], stamp: '미제', go: ['hisako', 'masami'] },

    { id: 'hisako', clip: ['./img/scan/19310905.png', '동아일보 구월 오일 — 부인 취조'], tab: '히사코', name: '오하시 히사코', hj: '大橋久子 · 서른여섯', mj: './img/p_hisako.jpg', re: 1,
      f: [[['관계', '관계'], ['관사 주인 오하시의 안해', '관사 주인 오하시의 아내']],
          [['그 밤', '그날 밤'], ['하녀 방 바로 엽방에서 잣다.', '하녀 방 바로 옆방에서 잤다.']],
          [['처분', '처분'], ['팔월 이십구일 검거 → 일심 무죄 · 공소(控訴) 기각', '8월 29일 체포 → 1심 무죄 · 항소 기각']],
          [['그 뒤', '그 뒤'], ['예심은 「주범」이라 하엿스나 — 긔소되지 아넛다.', '예심은 「주범」이라 했지만 — 기소되지 않았다.']]],
      j: [[['팔월 일일', '8월 1일'], ['첫 발견자. 순사가 다엇슬 때 <u>화장을 하고 외출복 차림으로 복도를 쓸고 잇섯다</u> 한다. 「조용히 처리해 달라」 하고, 일본의 로모에게 전보를 첫다.', '첫 발견자. 순경이 도착했을 때 화장을 하고 외출복 차림으로 복도를 쓸고 있었다고 한다. 「조용히 처리해 달라」고 하고, 일본의 노모에게 전보를 쳤다.']],
          [['진술', '진술'], ['「밤새 아모 소리도 듯지 못하엿소.」 — 벽 한 겹 사이다.', '「밤새 아무 소리도 듣지 못했어요.」 — 벽 한 겹 사이다.']],
          [['탐문', '탐문'], ['전날 낫, 하녀와 사진을 박고 옷을 마추어 주엇다 한다. 그날따라 류달리.', '전날 낮, 하녀와 사진을 찍고 옷을 맞춰 주었다고 한다. 그날따라 유난히.']],
          [['물증', '물증'], ['주검의 목에 감긴 비단 띄. 아씨의 것이라 한다.', '시신의 목에 감긴 비단 띠. 안주인의 것이라고 한다.']],
          [['팔월 이십구일', '8월 29일'], ['새벽 한 시, 검사국이 다려갓다. 끗까지 부인.', '새벽 1시, 검사국이 데려갔다. 끝까지 부인.']]],
      q: ['벽 한 겹 너머의 비명을, 참으로 듯지 못하엿는가.', '벽 한 겹 너머의 비명을, 정말 듣지 못했는가.'], stamp: '무죄', go: ['masami', 'inoue', 'maria'] },

    { id: 'masami', clip: ['./img/scan/19310804_02.png', '동아일보 팔월 사일 — 부검'], tab: '마사키', name: '오하시 마사키', hj: '大橋正己', mj: './img/p_masami.jpg', re: 1,
      f: [[['직위', '직위'], ['부산 철도 운수사무소장 · 고등관', '부산 철도 운수사무소장 · 고등관']],
          [['주소', '주소'], ['초량뎡 철도관사 십오호', '초량정 철도관사 15호']],
          [['그 밤', '그날 밤'], ['진주 출장. 닐헤 일뎡.', '진주 출장. 일주일 일정.']]],
      j: [[['팔월 일일', '8월 1일'], ['그 밤 집에 업섯다. 진주 출장, 닐헤 일뎡이엇다 한다.', '그날 밤 집에 없었다. 진주 출장, 일주일 일정이었다고 한다.']],
          [['풍문', '소문'], ['하녀와 갓가웠다는 말이 돈다. <i>확인 못함. 지면에 쓰지 말 것.</i>', '하녀와 가까웠다는 말이 돈다. 확인 못 함. 지면에 쓰지 말 것.']],
          [['긔자 메모', '기자 메모'], ['칠월 이십구일, 닐헤 예뎡으로 떠낫다. 그러면 그 주에 집이 빈다는 것을 누가 알앗는가.', '7월 29일, 일주일 예정으로 떠났다. 그렇다면 그 주에 집이 빈다는 것을 누가 알았는가.']]],
      q: ['어찌하야 하필 그 주에 집을 비웠는가.', '왜 하필 그 주에 집을 비웠는가.'], stamp: '부재', go: ['hisako', 'maria'] },

    { id: 'yama', clip: ['./img/scan/19310902.png', '동아일보 구월 이일 — 투서자 취조'], tab: '야마구치', name: '야마구치 추이치', hj: '', mj: './img/p_yama.jpg',
      f: [[['지목', '지목 이유'], ['괴투서와 필적이 달맛다.', '괴투서와 필적이 닮았다.']],
          [['처분', '처분'], ['구금 후 석방', '구금 후 석방']]],
      j: [[['팔월 삼일', '8월 3일'], ['부산서에 일홈 업는 편지. 「창 너머로 다 보앗소.」', '부산경찰서에 이름 없는 편지. 「창 너머로 다 보았소.」']],
          [['팔월 십삼일', '8월 13일'], ['가튼 손으로 둘재 편지. 이번에는 <u>「내가 범인이오.」</u>', '같은 손으로 두 번째 편지. 이번에는 「내가 범인이오.」']],
          [['구월 이일', '9월 2일'], ['필적이 달맛다는 사내 하나를 잡아드렷다. 관사 근처에 사는, 절도 전과 이 범의 일인이라 한다.', '필적이 닮았다는 남자 하나를 붙잡았다. 관사 근처에 사는, 절도 전과 2범의 일본인이라고 한다.']],
          [['구월', '9월'], ['곳 석방. 글씨가 비슷할 뿐, 그 이상은 나오지 아니하엿다.', '곧 석방. 글씨가 비슷할 뿐, 그 이상은 나오지 않았다.']]],
      q: ['열흘 만에 목격자가 범인이 되는 편지 — 그 붓은 누구의 손에 잇섯는가.', '열흘 만에 목격자가 범인이 되는 편지 — 그 붓은 누구의 손에 있었는가.'], stamp: '방면', go: ['rail', 'inoue'] },

    { id: 'inoue', clip: ['../assets/portraits/maria_19331110.jpg', '동아일보 1933. 11. 10 — 용의자'], tab: '이노우에', name: '이노우에 슈이치로', hj: '井上修一郞 → 隆雄', mj: './img/p_inoue.jpg', fb: PORT + 'maria_portrait.jpg',
      f: [[['직업', '직업'], ['철도국 공제조합 직원', '철도국 공제조합 직원']],
          [['관계', '관계'], ['룡산 시절부터 오하시 부부와 친분', '용산 시절부터 오하시 부부와 친분']],
          [['처분', '처분'], ['1933년 이월 검거 → 일심 무기 → 이심 무죄', '1933년 2월 체포 → 1심 무기징역 → 2심 무죄']]],
      j: [[['풍문', '소문'], ['룡산 때부터 오하시 집과 알든 사내. 아씨와 갓갑다는 말. <i>풍문뿐.</i>', '용산 때부터 오하시 집과 알던 남자. 안주인과 가깝다는 말. 소문뿐.']],
          [['사건 뒤', '사건 뒤'], ['<u>머리를 짧게 깍고 불교로 개종</u>하엿다 한다.', '머리를 짧게 깎고 불교로 개종했다고 한다.']],
          [['1933. 2', '1933년 2월'], ['두 해 만에 검거. 그 밤 관사 근처에 <u>로이드 안경 쓴 서른 살쯤의 사내</u>가 잇섯다는 증언.', '2년 만에 체포. 그날 밤 관사 근처에 로이드 안경을 쓴 서른 살쯤의 남자가 있었다는 증언.']],
          [['극장', '극장'], ['그 밤 열두 시까지 중앙극장에서 「요쓰야 괴담」을 보앗다 한다. 다른 것은 긔억이 업다고.', '그날 밤 12시까지 중앙극장에서 「요쓰야 괴담」을 봤다고 한다. 다른 것은 기억나지 않는다고.']],
          [['1934. 1', '1934년 1월'], ['일심 무기징역. — 그리고 이심, 무죄.', '1심 무기징역. — 그리고 2심, 무죄.']]],
      q: ['안경 쓴 그 사내는, 과연 그엿는가.', '안경을 쓴 그 남자는, 정말 그였는가.'], stamp: '무죄', go: ['hisako', 'yama'] },

    { id: 'rail', clip: ['./img/scan/19310813.png', '동아일보 팔월 십삼일 — 수사 난항'], tab: '길의 사내', name: '일홈 업는 철도원', nameKo: '이름 없는 철도원', hj: '이름 모름', mj: './img/p_rail.jpg', re: 1,
      f: [[['단서', '단서'], ['생전의 마리아와 길에서 여러 번 말을 나누엇다.', '생전의 마리아와 길에서 여러 번 말을 나눴다.']],
          [['출처', '출처'], ['동아일보 구월 오일 — 단 한 줄', '동아일보 9월 5일 — 단 한 줄']]],
      j: [[['구월 오일', '9월 5일'], ['서에서 철도 직원 하나를 불러 조사하엿다는 한 줄. 일홈은 실리지 아니하엿다.', '경찰서에서 철도 직원 하나를 불러 조사했다는 한 줄. 이름은 실리지 않았다.']],
          [['탐문', '탐문'], ['생전의 그 아이와 길에서 몃 번 서서 이약이하든 사내. 서는 누구인지 밝히지 안는다.', '생전의 그 아이와 길에서 몇 번 서서 이야기하던 남자. 경찰서는 누구인지 밝히지 않는다.']],
          [['그 뒤', '그 뒤'], ['<u>어느 긔록에도 다시 나오지 안는다.</u>', '어느 기록에도 다시 나오지 않는다.']]],
      q: ['야마구치인가, 이노우에인가 — 아니면 셋재 사내인가.', '야마구치인가, 이노우에인가 — 아니면 세 번째 남자인가.'], stamp: '불명', go: ['yama', 'inoue', 'maria'] },

    { id: 'last', clip: ['./img/scan/19310916.png', '동아일보 구월 십륙일 — 투서 공개'], tab: '범인', last: 1, name: '', hj: '범 인', mj: './img/p_last.jpg',
      f: [[['일홈', '이름'], ''], [['얼골', '얼굴'], ''], [['처분', '처분'], '']],
      j: [[['1934', '1934년'], ['두 번재 무죄. 검사국은 더 뭇지 안는다. 한 번 무죄가 난 아씨는 다시 법뎡에 세울 수 업다.', '두 번째 무죄. 검사국은 더 묻지 않는다. 한 번 무죄가 난 안주인은 다시 법정에 세울 수 없다.']],
          [['그 뒤', '그 뒤'], ['이 장은 비워 둔다. 채울 이가 나타나거든 — 그때 쓴다.', '이 장은 비워 둔다. 채울 사람이 나타나면 — 그때 쓴다.']]],
      q: null, stamp: '', go: ['maria'] }
  ];
  var Q = [['이 보도의 요점은 무엇이오?', '이 보도의 요점은 무엇인가요?'], ['그때 형편은 엇더하엿소?', '당시 상황은 어땠나요?'], ['긔록에서 눈여겨볼 대목은 어대요?', '기록에서 눈여겨볼 대목은 어디인가요?']];
  (function () {
    var tl = $('#rTimeline'), book = $('#rBook'); if (!tl || !book) return;
    var cur = 0, tab = 0, cmp = 100;
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
    function draw(anim) {
      var a = ARTS[cur];
      $$('button', tl).forEach(function (b, i) { b.classList.toggle('active', i === cur); });
      tl.style.setProperty('--prog', (cur / (ARTS.length - 1) * 100) + '%');
      var news = '<div class="news26" aria-label="2026년 뉴스로 다시 쓴 기사"><div class="n26-bar"><b>경성야록</b><span>사회</span><span>사건·사고</span><span>아카이브</span></div><div class="n26-body"><span class="n26-tag">아카이브 단독</span><h4>' + a.title + '</h4><p class="n26-meta">경성야록 사회부 · 원 보도 동아일보 ' + a.date + ' · 2026년 다시 씀</p><p class="n26-lead">' + a.lead + '</p>' + a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '<div class="n26-keys">' + a.keys.map(function (k) { return '<span>#' + k + '</span>'; }).join('') + '</div><p class="n26-note">※ 1931년 동아일보 원문을 바탕으로 오늘의 기사 형식으로 다시 쓴 것입니다.</p></div></div>';
      book.innerHTML =
        '<div class="page left"><div class="page-head"><strong>동아일보</strong><span>' + H('소화 륙 년 원문판', '1931년 원문판') + '</span><em>' + H(a.d[0], a.d[1]) + '</em></div>' +
        '<div class="page-title"><span class="wm" aria-hidden="true">原文記事</span><h3>' + H('원문 긔사', '원문 기사') + '</h3><small>' + H('동아일보 소화 륙 년 ' + a.d[0] + ' 보도', '동아일보 1931년 ' + a.d[1] + ' 보도') + '</small></div>' +
        '<div class="plate-switch"><button type="button" class="active">' + H('소화 륙 년 지면', '1931년 지면') + '</button><button type="button">2026년 뉴스</button></div>' +
        '<figure class="plate plate-cmp">' + news + '<img class="plate-scan" alt="' + a.date + ' 동아일보 원문 지면" src="./img/scan/' + a.img + '"><div class="plate-line"><span class="plate-handle">‹ ›</span></div><input class="plate-range" type="range" min="0" max="100" value="100" aria-label="원문 지면과 2026년 뉴스 비교"><span class="plate-hint">' + H('손잡이를 왼편으로 당기면 2026년 뉴스로 바뀌오', '손잡이를 왼쪽으로 당기면 2026년 뉴스로 바뀝니다') + '</span></figure>' +
        '<p class="guide"><span class="guide-box"></span>' + H('푸른 테두리 친 곳이 그날 실린 긔사이오.', '파란 테두리를 친 곳이 그날 실린 기사입니다.') + '</p></div>' +
        '<div class="page right"><div class="page-head"><strong>동아일보</strong><span>' + H('오늘판') + '</span><em>' + H('긔록이 오늘을 맛나는 자리, 경성야록', '기록이 오늘을 만나는 자리, 경성야록') + '</em></div>' +
        '<div class="report-tabs" role="tablist"><button type="button" role="tab" class="' + (tab === 0 ? 'active' : '') + '">' + H('오늘 말로 읽기', '오늘 말로 읽기') + '</button><button type="button" role="tab" class="' + (tab === 1 ? 'active' : '') + '">' + H('간추려 읽기', '요약해서 읽기') + '</button></div>' +
        '<article class="modern-news"><span class="kicker">사회면 <i>|</i> ' + H(a.d[0], a.d[1]) + ' <i>|</i> ' + H('사건 ' + a.day[0], '사건 ' + a.day[1]) + '</span>' +
        '<div class="news-grid"><div><h3>' + a.title + '</h3><p class="lead">' + a.lead + '</p><span class="seal-rule" aria-hidden="true"></span><div class="body">' +
        (tab === 0 ? a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') : '<ol class="mr-sum">' + a.sum.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>') + '</div></div></div>' +
        '<p class="mr-hook"><b>' + H('이 날의 수수께끼', '이날의 수수께끼') + '</b>' + H(HOOK[cur][0], HOOK[cur][1]) + '</p>' +
        '<div class="record-talk"><div class="talk-head"><h4>' + H('긔록에게 뭇다', '기록에게 묻다') + '</h4><p>' + H('이 긔사에 궁금한 것을 긔록과 함께 풀어 보시압.', '이 기사에 궁금한 것을 기록과 함께 풀어 보세요.') + '</p></div>' +
        a.sum.map(function (x, i) { return '<div class="talk-pair show" style="animation-delay:' + (0.4 + i * 0.9) + 's"><div class="q-row"><span class="face">문</span><p class="bubble q">' + H(Q[i][0], Q[i][1]) + '</p></div><div class="a-row"><p class="bubble a">' + x + '</p><span class="face a">답</span></div></div>'; }).join('') + '</div>' +
        (a.miss ? '<p class="mr-miss"><b>' + H('이날 지면에 실리지 못한 것', '이날 지면에 실리지 못한 것') + '</b><span>' + H(a.miss[0], a.miss[1]) + '</span></p>' : '') +
        '</article></div>' +
        '<div class="book-foot"><span>' + H('원 긔사 · 동아일보 · 소화 륙 년 ' + a.d[0], '원 기사 · 동아일보 · 1931년 ' + a.d[1]) + '</span><span><strong>京城野錄</strong> ' + H('옛 긔록 → 오늘', '옛 기록 → 오늘') + '</span></div>';
      var wrap = book.parentNode;
      $('.book-arrow.left', wrap).disabled = cur === 0;
      $('.book-arrow.right', wrap).disabled = cur === ARTS.length - 1;
      setCmp(100);
      seen[cur] = 1; window.ykMariaCur = cur; board();
      if (anim) { book.classList.remove('mr-turn'); void book.offsetWidth; book.classList.add('mr-turn'); }
    }
    var seen = {}, bd = $('#board'), built = false, curP = 0;
    function clipKo(t) {
      var N = { '일': 1, '이': 2, '삼': 3, '사': 4, '오': 5, '륙': 6, '칠': 7, '팔': 8, '구': 9 };
      function num(w) { var k = w.indexOf('십'); if (k < 0) return N[w] || w; return (k ? N[w.slice(0, k)] : 1) * 10 + (N[w.slice(k + 1)] || 0); }
      return t.replace(/([일이삼사오륙칠팔구십]+)월 ([일이삼사오륙칠팔구십]+)일/, function (m, a, b) { return num(a) + '월 ' + num(b) + '일'; });
    }
    function pidx(id) { for (var i = 0; i < PEOPLE.length; i++) if (PEOPLE[i].id === id) return i; return 0; }
    function page(i, anim) {
      curP = i; var P = PEOPLE[i];
      bd.classList.toggle('jn-lastp', !!P.last);
      $$('.jn-tab', bd).forEach(function (t, k) { t.classList.toggle('on', k === i); });
      $('.jn-l', bd).innerHTML =
        '<header class="nb-hd"><span>' + H('인물 조사') + '</span><em>' + H('뎨 ' + (i + 1) + ' 호', '제 ' + (i + 1) + '호') + '</em></header>' +
        '<div class="nb-who"><figure class="nb-photo' + (P.last ? ' last' : '') + '"><img alt="" src="' + P.mj + '"><i class="pc a"></i><i class="pc b"></i><i class="pc c"></i><i class="pc d"></i></figure>' +
        '<div class="nb-name"><small>' + H('일홈', '이름') + '</small><h4>' + (P.last ? '<span class="nb-blank w"></span>' : (P.nameKo ? H(P.name, P.nameKo) : P.name)) + '</h4>' + (P.hj ? '<p>' + P.hj + '</p>' : '') +
        (P.last ? '' : '<em class="nb-re">' + H('사진은 재현 — 얼골은 남기지 아니함', '사진은 재현 — 얼굴은 남기지 않음') + '</em>') + '</div></div>' +
        '<dl class="nb-f">' + P.f.map(function (f) { return '<div><dt>' + H(f[0][0], f[0][1]) + '</dt><dd>' + (f[1] ? H(f[1][0], f[1][1]) : '<span class="nb-blank"></span>') + '</dd></div>'; }).join('') + '</dl>' +
        '<p class="nb-foot">' + H('동아일보 사회부 · 부산 출장 취재 수첩', '동아일보 사회부 · 부산 출장 취재 수첩') + '<br>' + H('※ 동아일보 보도와 뒷날의 긔록을 바탕으로 다시 엮은 것이오.', '※ 동아일보 보도와 이후 기록을 바탕으로 재구성한 것입니다.') + '</p>';
      var im = $('.nb-photo img', bd);
      if (im) im.onerror = function () { if (P.fb && im.getAttribute('src') !== P.fb) { im.src = P.fb; } else { im.remove(); $('.nb-photo', bd).classList.add('empty'); } };
      $('.jn-r', bd).innerHTML =
        '<header class="nb-hd"><span>' + H('취재 일지') + '</span><em>' + H('부산 초량뎡 · 소화 륙 년 ~ 구 년', '부산 초량정 · 1931 ~ 1934년') + '</em></header>' +
        '<ol class="nb-log">' + P.j.map(function (e, k) { return '<li style="--d:' + (k * 0.14) + 's"><time>' + H(e[0][0], e[0][1]) + '</time><p>' + H(e[1][0], e[1][1]) + '</p></li>'; }).join('') + '</ol>' +
        (P.q ? '<p class="nb-q"><b>의문</b><span>' + H(P.q[0], P.q[1]) + '</span></p>' : '') +
        '<p class="nb-go"><span>' + H('이어진 사람') + '</span>' + P.go.map(function (g) { return '<button type="button" data-go="' + g + '">' + PEOPLE[pidx(g)].tab + '</button>'; }).join('') + '</p>' +
        '<div class="nb-rf">' + (P.stamp ? '<span class="nb-stamp">' + ((P.pre && !document.body.classList.contains('mr-judged')) ? P.pre : P.stamp) + '</span>' : '<span></span>') + (P.clip ? '<figure class="nb-clip"><img alt="" src="' + P.clip[0] + '"><figcaption>' + H(P.clip[1], clipKo(P.clip[1])) + '</figcaption></figure>' : '') + '</div>';
      if (anim) { var b = $('.jn-book', bd); b.classList.remove('turn'); void b.offsetWidth; b.classList.add('turn'); play('sfxWhoosh'); }
    }
    function build() {
      built = true;
      bd.innerHTML =
        '<div class="jn-desk"><div class="jn-head"><em class="jn-no">' + H('第五話', '제5화') + '</em><b>' + H('긔자 수첩 — 수첩 속의 사람들', '기자 수첩 — 수첩 속의 사람들') + '</b><span>' + H('동아일보 긔자가 부산에 나려가 한 사람식 캐어 적은 수첩 — 다시 엮음', '동아일보 기자가 부산에 내려가 한 사람씩 캐물어 적은 수첩 — 재구성') + '</span></div>' +
        '<button type="button" class="jn-folder" aria-label="기자 수첩 펼치기"><span class="nb-band"></span><span class="nb-emb"><small>동아일보 사회부</small><b>긔자 수첩</b><i>소화 륙 년 · 셋재 권</i></span><span class="nb-label"><b>부산 초량뎡 사건</b><small>八月 一日 ─</small></span><span class="nb-pen"></span></button>' +
        '<p class="jn-open-hint">' + H('수첩을 펼치시압', '수첩을 펼쳐 보세요') + '</p>' +
        '<div class="jn-book"><div class="jn-page jn-l"></div><div class="jn-page jn-r"></div>' +
        '<nav class="jn-tabs">' + PEOPLE.map(function (P, i) { return '<button type="button" class="jn-tab" data-i="' + i + '">' + P.tab + '</button>'; }).join('') + '</nav></div></div>';
      bd.addEventListener('click', function (e) {
        var t = e.target.closest('.jn-tab'); if (t) { page(+t.dataset.i, true); return; }
        var g = e.target.closest('[data-go]'); if (g) { page(pidx(g.dataset.go), true); return; }
        if (e.target.closest('.jn-folder, .jn-open-hint') && !bd.classList.contains('jn-open')) { bd.classList.add('jn-open'); play('sfxWhoosh'); page(0, true); }
      });
      page(0, false);
      var nb = new Image(); nb.onload = function () { var f = $('.jn-folder', bd); if (f) { f.classList.add('mjcover'); f.insertAdjacentHTML('afterbegin', '<img class="nb-mj" alt="" src="./img/notebook.jpg">'); } }; nb.src = './img/notebook.jpg';
    }
    function board() { if (bd && !built) build(); }
    window.ykMariaBoard = board;
    window.ykMariaRepage = function () { if (built) page(curP, false); };
    function go(i) { if (i < 0 || i >= ARTS.length || i === cur) return; cur = i; tab = 0; draw(true); play('sfxWhoosh'); }
    tl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) go(+b.dataset.i); });
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
     03  두 통의 괴투서 — 봉투 뜯기 · 확대경 · 감정서
     ========================================================= */
  var SPOTS = [
    { x: 30, y: 22, t: ['꺾임', '꺾임'], d: ['획을 꺾는 자리마다 붓을 한 번 멈추는 버릇', '획을 꺾을 때마다 붓을 한 번 멈추는 버릇'] },
    { x: 66, y: 48, t: ['삐침', '삐침'], d: ['왼편으로 길게 빼어 끗을 가늘게 흘리는 삐침', '왼쪽으로 길게 빼서 끝을 가늘게 흘리는 삐침'] },
    { x: 42, y: 76, t: ['먹', '먹'], d: ['붓을 누르는 힘이 고르지 못해 먹이 번진 자리', '붓을 누르는 힘이 고르지 않아 먹이 번진 자리'] }
  ];
  var STEPS = [
    { b: ['팔월 삼일', '8월 3일'], h: ['첫 괴투서', '첫 괴투서'], s: ['사건 이틀 뒤, 일홈 업는 편지가 부산경찰서에 날아들엇소. "창 너머로 그 밤을 보앗다."', '사건 이틀 뒤, 이름 없는 편지가 부산경찰서에 날아들었다. "창 너머로 그날 밤을 보았다."'] },
    { b: ['열흘쯤 뒤', '열흘쯤 뒤'], h: ['두 번째 괴투서', '두 번째 괴투서'], s: ['가튼 필적으로, 가튼 이약이를 다시 하엿소.', '같은 필적으로, 같은 이야기를 다시 했다.'] },
    { b: ['구월 초', '9월 초'], h: ['필적으로 야마구치를 지목', '필적으로 야마구치를 지목'], s: ['필적이 비슷하다 하야 야마구치 추이치가 붓들렷스나, 필적만으로는 죄를 물을 수 업서 곧 풀려낫소. 그는 관사 근처에 사는 절도 전과자엿소.', '필적이 비슷하다며 야마구치 추이치가 붙잡혔지만, 필적만으로는 죄를 물을 수 없어 곧 풀려났다. 그는 관사 근처에 사는 절도 전과자였다.'] },
    { b: ['구월 십륙일', '9월 16일'], h: ['지면에 실린 편지', '지면에 실린 편지'], s: ['동아일보가 투서의 \'목격담\'을 실럿소 — 어대까지나 주장이엇소.', '동아일보가 투서의 \'목격담\'을 실었다 — 어디까지나 주장이었다.'] },
    { b: ['소화 팔 년', '1933년'], h: ['편지가 다시 도마에', '편지가 다시 도마에'], s: ['이 년 뒤 잡힌 철도 공제조합 직원 이노우에의 재판에서 필적이 다시 다투어졌소. 자료마다 말이 엇갈리오.', '2년 뒤 체포된 철도 공제조합 직원 이노우에의 재판에서 필적이 다시 쟁점이 됐다. 자료마다 말이 엇갈린다.'], key: 1 }
  ];
  /* 편지가 말한 것 — 후대 정리 자료(나무위키 인용)를 줄여 옮김 · 참혹한 대목은 가림 */
  var LETTERS = [
    { t: ['첫째 편지', '첫째 편지'], d: '8월 3일', lines: [
      ['나는 절도 전과 이범이오.', '나는 절도 전과 2범이오.'],
      ['그 밤 새벽 세 시, 관사에서 녀자의 비명을 드럿소.', '그날 밤 새벽 3시, 관사에서 여자의 비명을 들었소.'],
      ['창 너머로 — 다 보앗소.', '창 너머로 — 다 보았소.'],
      ['범인은 집안 사람이오. 삼십 세가량 된 녀자요.', '범인은 집안 사람이오. 서른 살쯤 된 여자요.'],
      ['유리창을 깨고 창살 한 개를 뽑아 — 철도병원 압 공원 풀밧 속에 파무덧스니, 차저 보시오.', '유리창을 깨고 창살 한 개를 뽑아 — 철도병원 앞 공원 풀밭에 파묻었으니, 찾아 보시오.'],
      ['— 부산경찰서 서장 친전. 목격자로부터.', '— 부산경찰서 서장 친전. 목격자로부터.'],
      ['신문에 난 것은, 전부 거짓말이오.', '신문에 난 것은 전부 거짓말이다.']
    ] },
    { t: ['둘째 편지', '둘째 편지'], d: '열흘 뒤', lines: [
      ['— 가튼 손, 가튼 먹 —', '— 같은 손, 같은 먹 —'],
      ['그 밤의 일은,', '그날 밤의 일은,'],
      ['내가 한 것이오.', '내가 한 것이오.']
    ] }
  ];
  /* 편지 대 사실 — 눌러서 도장 찍기 */
  var CHECK = [
    { c: '"철도병원 앞 공원 풀밭에 묻었다"', f: '수건과 창살 — 실제로 나왔다', st: '一致', k: 'ok' },
    { c: '그 밤의 일을 본 듯한 묘사', f: '신문에 나기도 전인데, 부검에서만 보이던 흔적과 맞았다', st: '一致', k: 'ok' },
    { c: '"새벽 3시쯤 비명을 들었다"', f: '부검이 본 사망 시각은 밤 11시 ~ 새벽 1시', st: '不一致', k: 'no' },
    { c: '첫째: "집안의 서른 살쯤 된 여자" · 둘째: "내가 했다"', f: '한 사람의 두 편지가 서로 다른 범인을 말한다', st: '矛盾', k: 'no' },
    { c: '"신문에 난 것은 전부 거짓말"', f: '무엇이 거짓인지 편지는 말하지 않았다', st: '未詳', k: 'ask' }
  ];
  (function () {
    var root = $('#letters'); if (!root) return;
    root.innerHTML =
      '<article class="lt-desk">' +
        '<div class="lt-head"><b>' + H('증거품 · 괴투서 두 통', '증거물 · 괴투서 두 통') + '</b><span>' + H('부산경찰서 · 괴투서 (재현)', '부산경찰서 · 괴투서 (재현)') + '</span></div>' +
        '<div class="lt-stage">' +
          '<figure class="lt-sheet" aria-label="괴투서 (재현)"><img src="./img/letter1.png" alt="붓으로 쓴 괴투서 (재현 그림)" draggable="false">' +
            SPOTS.map(function (s, i) { return '<span class="lt-spot" data-i="' + i + '" style="left:' + s.x + '%;top:' + s.y + '%"></span>'; }).join('') +
            '<span class="lt-lens" aria-hidden="true"></span><span class="lt-match" aria-hidden="true">筆跡<br>一致</span>' +
          '</figure>' +
          '<button type="button" class="lt-env" hidden aria-label="편지"><img src="./img/envelope.jpg" alt="" draggable="false"><span class="lt-open">' + H('봉투를 뜻으시압', '봉투를 뜯어 보세요') + '</span></button>' +
        '</div>' +
        '<p class="lt-hint">' + H('확대경을 편지 우에 천천히 대어 보시압. 같은 손의 버릇이 세 군데 숨어 잇소.', '확대경을 편지 위에 천천히 대어 보세요. 같은 손의 버릇이 세 군데 숨어 있습니다.') + '</p>' +
        '<span class="yk-credit">재현</span>' +
      '</article>' +
      '<div class="mr-mid lt-mid"><span class="mr-years">1931</span><i></i><p>' + H('이 년 뒤 — 편지는 법뎡에 다시 나왓소', '2년 뒤 — 편지는 법정에 다시 나왔다') + '</p><i></i><span class="mr-years">1933</span></div>' +
      '<article class="lt-report">' +
        '<div class="lt-rhead"><b>鑑定書</b><span>' + H('필적 감정 · 체험', '필적 감정 · 체험') + '</span><em class="lt-count">0 / 3</em></div>' +
        '<ol class="lt-finds">' + SPOTS.map(function (s, i) { return '<li data-i="' + i + '"><b>' + H(s.t[0], s.t[1]) + '</b><span>' + H('— 아즉 차지 못함', '— 아직 찾지 못함') + '</span></li>'; }).join('') + '</ol>' +
        '<div class="lt-read"><div class="lt-read-head"><div class="lt-tabs">' + LETTERS.map(function (L, i) { return '<button type="button" class="lt-tab' + (i ? '' : ' on') + '" data-i="' + i + '">' + H(L.t[0], L.t[1]) + '<small>' + L.d + '</small></button>'; }).join('') + '</div><button type="button" class="lt-read-go">' + H('다시 읽기') + '</button></div><ol class="lt-lines"></ol><p class="lt-read-src">※ 나무위키(후대 정리)에 인용된 투서를 줄여 옮김</p></div>' +
        '<div class="lt-check"><div class="lt-check-head"><b>' + H('편지 대 사실', '편지 대 사실') + '</b><span>' + H('줄을 눌러 도장을 찍으시압', '줄을 눌러 도장을 찍어 보세요') + '</span><em class="lt-ck-n">0 / ' + CHECK.length + '</em></div><ol>' +
          CHECK.map(function (c, i) { return '<li data-i="' + i + '"><span class="ck-c">' + c.c + '</span><span class="ck-f">' + c.f + '</span><span class="ck-st ' + c.k + '">' + c.st + '</span></li>'; }).join('') + '</ol></div>' +
        '<ol class="mr-steps lt-steps">' + STEPS.map(function (s) { return '<li class="' + (s.key ? 'key' : '') + '"><b>' + H(s.b[0], s.b[1]) + '</b><strong>' + H(s.h[0], s.h[1]) + '</strong><span>' + H(s.s[0], s.s[1]) + '</span></li>'; }).join('') + '</ol>' +
        '<div class="mr-write lt-write"><div class="mw-tabs" role="tablist"><button type="button" role="tab" class="on">' + H('그때처럼 읽기', '그때처럼 읽기') + '</button><button type="button" role="tab">' + H('오늘의 보도 준칙대로', '오늘의 보도 준칙대로') + '</button></div>' +
          '<div class="mw-paper then lt-then"><p class="mw-quote">' + H('지면은 이 편지를 \'목격자의 편지\'로 실럿소. 일홈 업는 이의 말이, 사실처럼 읽혓소.', '지면은 이 편지를 \'목격자의 편지\'로 실었다. 이름 없는 사람의 말이 사실처럼 읽혔다.') + '</p><small>' + H('동아일보 소화 륙 년 구월 십륙일자를 바탕으로', '동아일보 1931년 9월 16일자를 바탕으로') + '</small></div>' +
          '<div class="mw-paper lt-now" hidden><ul><li>익명 제보는 확인되기 전까지 \'주장\'으로만 쓴다.</li><li>혐의를 받는 사람의 이름과 얼굴은 싣지 않는다.</li><li>사건과 관계없는 피해자의 사생활은 쓰지 않는다.</li></ul></div>' +
        '</div>' +
        '<p class="mr-src">※ 확대경 감정은 재현 편지로 꾸민 체험입니다. 실제 감정 결과는 당시 보도를 따릅니다.</p>' +
      '</article>';
    var desk = $('.lt-desk', root), sheet = $('.lt-sheet', root), lens = $('.lt-lens', root), env = $('.lt-env', root);
    var found = {}, n = 0;
    env.addEventListener('click', function () { desk.classList.add('open'); play('sfxWhoosh'); readLetter(); });
    desk.classList.add('open');
    if ('IntersectionObserver' in window) { var oL = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { readLetter(); oL.disconnect(); } }, { threshold: .3 }); oL.observe(desk); } else readLetter();
    var readT = [];
    var curL = 0;
    function fillLetter() {
      $('.lt-lines', root).innerHTML = LETTERS[curL].lines.map(function (l) { return l ? '<li' + (/거짓말|내가 한 것/.test(l[0]) ? ' class="lt-scream"' : '') + '>' + H(l[0], l[1]) + '</li>' : '<li class="redact"><span>████████ ██████ ███████████</span><small>' + H('차마 지면에 옮기지 못하는 대목', '차마 지면에 옮기지 못하는 대목') + '</small></li>'; }).join('');
    }
    fillLetter();
    $$('.lt-tab', root).forEach(function (b) { b.addEventListener('click', function () { curL = +b.dataset.i; var im = $('.lt-sheet img', root); im.src = './img/letter' + (curL + 1) + '.png'; lens.style.backgroundImage = 'url("' + im.getAttribute('src') + '")'; $$('.lt-tab', root).forEach(function (x) { x.classList.toggle('on', x === b); }); fillLetter(); desk.classList.add('open'); readLetter(); }); });
    var ckN = 0;
    $$('.lt-check li', root).forEach(function (li) { li.addEventListener('click', function () { if (li.classList.contains('on')) return; li.classList.add('on'); ckN++; $('.lt-ck-n', root).textContent = ckN + ' / ' + CHECK.length; play('sfxBell'); }); });
    function readLetter() {
      readT.forEach(clearTimeout); readT = [];
      var lis = $$('.lt-lines li', root); lis.forEach(function (li) { li.classList.remove('on'); });
      lis.forEach(function (li, k) { readT.push(setTimeout(function () { li.classList.add('on'); if (li.classList.contains('redact')) play('sfxBell'); }, 400 + k * 1100)); });
    }
    $('.lt-read-go', root).addEventListener('click', function () { if (!desk.classList.contains('open')) desk.classList.add('open'); readLetter(); });
    var src = $('img', sheet).getAttribute('src');
    lens.style.backgroundImage = 'url("' + src + '")';
    function move(cx, cy) {
      if (!desk.classList.contains('open')) return;
      var r = sheet.getBoundingClientRect(), x = cx - r.left, y = cy - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { lens.classList.remove('on'); return; }
      var Z = 2.6, L = lens.offsetWidth / 2;
      lens.classList.add('on');
      lens.style.left = x + 'px'; lens.style.top = y + 'px';
      lens.style.backgroundSize = (r.width * Z) + 'px ' + (r.height * Z) + 'px';
      lens.style.backgroundPosition = (L - x * Z) + 'px ' + (L - y * Z) + 'px';
      SPOTS.forEach(function (s, i) {
        if (found[i]) return;
        var dx = x - s.x / 100 * r.width, dy = y - s.y / 100 * r.height;
        if (Math.sqrt(dx * dx + dy * dy) < L * 0.55) hit(i);
      });
    }
    function hit(i) {
      found[i] = 1; n++;
      $('.lt-spot[data-i="' + i + '"]', root).classList.add('got');
      var li = $('.lt-finds li[data-i="' + i + '"]', root);
      li.classList.add('got'); li.querySelector(':scope > span').innerHTML = H('— ' + SPOTS[i].d[0], '— ' + SPOTS[i].d[1]);
      $('.lt-count', root).textContent = n + ' / 3';
      play('sfxBell');
      if (n === 3) setTimeout(function () { root.classList.add('matched'); }, 500);
    }
    sheet.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    sheet.addEventListener('mouseleave', function () { lens.classList.remove('on'); });
    sheet.addEventListener('touchmove', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    sheet.addEventListener('touchstart', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
    $$('.mw-tabs button', root).forEach(function (b, i) {
      b.addEventListener('click', function () {
        $$('.mw-tabs button', root).forEach(function (x, j) { x.classList.toggle('on', i === j); });
        $('.lt-then', root).hidden = i !== 0; $('.lt-now', root).hidden = i !== 1;
      });
    });
  })();

  /* =========================================================
     04  약한 고리의 주파수 — 죽첨정과 같은 라듸오 (다이알을 돌려 주파수 맞추기)
     ========================================================= */
  var JK = '../case-jukcheomjeong/';
  var ST = [
    { y: '1931', ang: 20, no: '제0호', when: '1931년 8월 · 부산 초량정', au: null, moon: 70,
      h: '주인은 출장 중,<br><em>스무 살 하녀</em>는 남의 방에서',
      t: ['소화 륙 년 — 목소리 대신 남은 것', '1931년 — 목소리 대신 남은 것'],
      b: ['「초량 철도 관사의 괴사」', '「두 번 날아든 괴투서」', '「주인 아씨, 무죄」'],
      d: ['그 밤을 증언할 목소리는 남지 안앗소. 남은 것은 신문 제목뿐 — 그리고 그 제목이 그 녀자에게 붙인 일홈, \'치정\'. 그 일홈이 어대까지 따라오는지, 다이알을 돌려 드러 보시압.', '그날 밤을 증언할 목소리는 남지 않았다. 남은 것은 신문 제목뿐 — 그리고 그 제목이 그녀에게 붙인 이름, \'치정\'. 그 이름이 어디까지 따라오는지, 다이얼을 돌려 들어 보세요.'] },
    { y: '1970', ang: 80, no: '제1호', when: '1970년 3월 · 서울 강변북로', au: 'maria-radiocase01.mp3', card: 'maria-case05.png', moon: 28,
      h: '수첩엔 스물여섯 이름,<br>결론은 <em>단 한 명</em>',
      t: ['수첩엔 스물여섯 일홈, 결론은 단 한 명', '수첩엔 26명의 이름, 결론은 단 한 명'],
      b: ['달리던 승용차 안, 요정 접대부 총격 사망', '권력형 암살 의혹 속에 \'친오빠 단독 범행\'으로 종결'],
      d: ['한 녀자의 죽음 뒤로 정재계 인사들의 일홈이 오르내렷스나, 수사는 가까운 이의 범행으로 매듭지어지고 의혹만 오래 남앗소.', '한 여성의 죽음 뒤로 정재계 인사들의 이름이 오르내렸지만, 수사는 가까운 사람의 범행으로 결론 났고 의혹만 오래 남았다.'],
      link: '수첩 속 권력의 이름은 지워지고, 여자의 \'행실\'만 남았다. — 마리아에게 \'치정\'이 먼저 붙었듯.' },
    { y: '1980s', ang: 140, no: '제2호', when: '1980년대 중반 · 현해탄', au: 'maria-radiocase02.mp3', card: 'maria-case01.png', moon: 22,
      h: '금괴는 바다를 건넜고,<br>그녀는 <em>산에 묻혔다</em>',
      t: ['금괴는 바다를 건넛고, 그 녀자는 산에 무첫다', '금괴는 바다를 건넜고, 그녀는 산에 묻혔다'],
      b: ['홍콩·도쿄·서울·부산을 오간 30대 여성 운반책', '정산 직전 교살, 야산 암매장 — 수사는 \'치정\'으로 흘렀다'],
      d: ['홍콩 · 일본 · 한국을 오가든 밀수 조직에서 운반책으로 쓰인 이들이 조직의 다툼과 범죄에 고스란히 드러낫소.', '홍콩·일본·한국을 오가던 밀수 조직에서 운반책으로 이용된 사람들이 조직 내부의 갈등과 범죄에 그대로 노출됐다.'],
      link: '수사는 또 \'치정\'으로 흘렀다. 국경을 넘나드는 큰 손 대신, 가장 약한 사람이 사라졌다.' },
    { y: '2000s', ang: 200, no: '제3호', when: '2000년대 초중반 · 서울 강남', au: 'maria-radiocase03.mp3', card: 'maria-case04.png', moon: 76,
      h: '수억을 벌던 그녀들은<br>왜 <em>저수지</em>에서',
      t: ['수억을 벌든 그 녀자들은 웨 저수지에서 발견되엇나', '수억을 벌던 그녀들은 왜 저수지에서 발견됐나'],
      b: ['선불금 채무·잠적 뒤 수개월 만에 변사체로 발견', '\'빚투와 일탈\'로 소비된 보도, 그 뒤엔 사채·조폭 연결 의혹'],
      d: ['화려한 거리의 뒤편, 불법 사채와 조직 범죄와 검은돈이 얽힌 자리에서 가장 약한 이들이 먼저 사라젓소.', '화려한 거리의 이면, 불법 사채와 조직범죄, 거액의 자금이 얽힌 곳에서 가장 취약한 사람들이 먼저 사라졌다.'],
      link: '신문은 범인보다 먼저 피해자의 몸가짐을 물었다. 1931년의 지면처럼.' },
    { y: '2023', ang: 260, no: '제4호', when: '2023년 3월 · 서울 강남 역삼동', au: 'maria-radiocase04.mp3', card: 'maria-case03.png', moon: 34,
      h: '금괴는 <em>코인</em>이 되었고,<br>범죄는 그대로였다',
      t: ['금괴는 코인이 되엇고, 범죄는 그대로엿다', '금괴는 코인이 되었고, 범죄는 그대로였다'],
      b: ['3월 29일 밤, 아파트 앞에서 40대 여성 납치·살해', '코인 탈취 노린 강도살인, 1심 주범 2명 무기징역'],
      d: ['거래하는 물건은 바뀌엇스나, 큰 리권과 범죄가 이어지는 꼴은 그대로엿소.', '거래 수단은 달라졌지만, 거대한 이권과 범죄가 연결되는 구조는 그대로였다.'],
      link: '거래하는 물건만 바뀌었다. 힘센 쪽은 남고, 약한 쪽이 지워지는 구조는 그대로.' },
    { y: '2020s', ang: 320, no: '제5호', when: '2020년대 중반 · 동남아 ↔ 서울', au: 'maria-radiocase05.mp3', card: 'maria-case02.png', moon: 62,
      h: '국경은 사라졌고,<br><em>가장 약한 고리</em>만 남았다',
      t: ['국경은 사라젓고, 가장 약한 고리만 남엇다', '국경은 사라졌고, 가장 약한 고리만 남았다'],
      b: ['통장 대여·자금 운반책으로 끌려든 청년 여성들', '조직 이탈·횡령 의혹 끝에 감금·살해된 사건들'],
      d: ['무대는 국경 너머로 넓어젓스나, 조직의 끄트머리에 선 이가 가장 큰 위험을 짊어지는 꼴은 되풀이되오.', '무대는 국경 너머로 넓어졌지만, 조직의 말단에 놓인 사람이 가장 큰 위험을 떠안는 구조는 되풀이된다.'],
      link: '가장 약한 고리 — 1931년 초량정 관사의 스무 살 하녀에서 시작된 이야기.' }
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
        '<article class="rx-scrap"><div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span></div><p class="rx-wait">' + H('이 라듸오가 들려줄 여섯 편', '이 라디오가 들려줄 여섯 편') + '</p><ol class="rx-index">' +
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
      vis.innerHTML = '<span class="rx-moon" style="left:' + s.moon + '%"></span>' + HILLS + '<h4>' + s.h + '</h4>' +
        (s.card ? '<button type="button" class="rx-card rx-vcard" data-card="' + s.card + '" aria-label="카드뉴스 크게 보기"><img alt="' + s.y + ' 카드뉴스" src="' + IMG + 'case/' + s.card + '"><span>' + H('크게 보기') + '</span></button>' : '');
      vis.classList.toggle('has-card', !!s.card);
      $$('.rx-years button', root).forEach(function (b, j) { b.classList.toggle('active', j === i); });
      $$('.rx-index li', root).forEach(function (b, j) { b.classList.toggle('on', j === i); });
      scrap.innerHTML = '<div class="rx-scrap-head"><span>' + H('긔록 더 읽기', '기록 더 읽기') + '</span><em>' + s.no + ' · ' + s.y + '</em></div>' +
        '<h5>' + H(s.t[0], s.t[1]) + '</h5><ul>' + s.b.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p>' + H(s.d[0], s.d[1]) + '</p>' +
        (s.link ? '<p class="rx-link"><b>' + H('마리아와 겹치는 자리', '마리아와 겹치는 자리') + '</b>' + s.link + '</p>' : '') +
        '<div class="rx-scrap-foot"><button type="button" class="rx-retune">' + H('다른 주파수 차즈시오', '다른 주파수 찾기') + '</button>' +
'</div>';
      if (s.au) { au.src = AUD + s.au; au.currentTime = 0; var p = au.play(); if (p && p.catch) p.catch(function () {}); pbtn.disabled = false; }
      else { au.pause(); au.removeAttribute('src'); pbtn.disabled = true; tm.textContent = '녹음 없음 · 지면만 남음'; trk.style.width = '0'; wave(0); }
      play('sfxBell');
    }
    /* 주파수 사이: 앞 칸과 뒤 칸을 잇는 한 줄이 잡음 속에서 떠오름 */
    var GAPS = [
      ['1931', '1970', '죽은 녀자보다 먼저 \'치정\'이 지면에 실렷다. 사십 년 뒤에도.', '죽은 여자보다 먼저 \'치정\'이 지면에 실렸다. 사십 년 뒤에도.'],
      ['1970', '1980s', '권력의 일홈은 수첩에 남고, 녀자만 사라졌다.', '권력의 이름은 수첩에 남고, 여자만 사라졌다.'],
      ['1980s', '2000s', '돈을 나르든 녀자가, 돈의 끗에서 버려졌다.', '돈을 나르던 여자가, 돈의 끝에서 버려졌다.'],
      ['2000s', '2023', '신문은 또 피해자의 몸가짐부터 무럿다.', '신문은 또 피해자의 행실부터 물었다.'],
      ['2023', '2020s', '금괴에서 코인으로. 거래는 바뀌어도 표적은 그대로.', '금괴에서 코인으로. 거래는 바뀌어도 표적은 그대로.'],
      ['2020s', '1931', '가장 약한 고리를 따라가면 — 다시 소화 륙 년, 초량정 관사.', '가장 약한 고리를 따라가면 — 다시 1931년, 초량정 관사.']
    ];
    var gap = -1;
    function between() {
      vis.classList.remove('has-card');
      var g = Math.floor(mod(rot - ST[0].ang) / 60) % 6; if (g === gap) return; gap = g; var G = GAPS[g];
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

  /* =========================================================
     04  야사(野史) — 뒤집는 카드
     ========================================================= */
  var YASA = [
    { q: '왜 하필 그날, 사진을 찍었나', a: '사건 당일 낮, 히사코는 마리아를 데리고 사진관에 가 함께 사진을 찍었다. 저녁엔 양복점을 불러 "마리아가 고향 갈 옷"을 맞춘다고 했지만 — 실제로 지은 것은 자기 옷이었다.', s: '기록' },
    { q: '옆방의 비명', a: '비명은 이웃집까지 들렸고, 그 방엔 몹시 몸부림친 자국이 남아 있었다. 바로 옆방에서 1시와 3시에 두 번 깨어 화장실에 다녀온 히사코는 — 아무 소리도 듣지 못했다고 했다.', s: '기록' },
    { q: '복도를 쓸던 아침', a: '경찰이 도착했을 때 히사코는 화장을 하고 외출복 차림으로 복도를 쓸고 있었다. "조용히 처리해 달라"고 부탁했고, 일본의 일흔 살 노모에게 전보를 쳤다.', s: '기록' },
    { q: '비단 허리띠', a: '마리아의 목에 감겨 있던 띠는 히사코의 것이었다. 경찰은 "그런 것을 현장에 남겨 둘 리 없다"며 크게 보지 않았다.', s: '기록' },
    { q: '목격자는 왜 범인이 되었나', a: '첫 편지는 "유리문 안을 들여다보았다"는 목격담. 열흘 뒤 같은 필적의 둘째 편지는 "내가 범인"이라 했다.', s: '기록' },
    { q: '편지가 가리킨 곳에, 정말 있었다', a: '"철도병원 앞 공원 풀밭에 파묻었다." 경찰이 가 보니 — 수건과 창살이 실제로 나왔다.', s: '기록' },
    { q: '머리를 깎은 사내', a: '사건 날 저녁 8시쯤 관사 앞을 서성인 로이드 안경의 서른 살쯤 된 남자. 2년 뒤 잡힌 이노우에는 사건 뒤 머리를 짧게 깎고, 천리교에서 불교로 개종했다.', s: '기록' },
    { q: '정부(情夫)라는 소문', a: '이노우에는 용산 시절부터 오하시 부부와 알던 사이. 부산에서 히사코와 자주 만나 \'정부\'라는 소문이 돌았다.', s: '소문' },
    { q: '주인과 하녀', a: '집주인과 마리아가 가까웠고, 그래서 아내가 질투했다는 추리도 붙었다. 1933년 잡지 『별건곤』이 적은 세 가지 짐작 가운데 하나다. 뒷받침할 기록은 없다.', s: '소문' },
    { q: '한 번 무죄면, 끝', a: '1933년 11월 예심은 "주범 히사코, 종범 이노우에"라 했다. 그러나 검사는 일사부재리를 들어 히사코를 기소하지 않았다.', s: '기록' },
    { q: '조선인들의 눈', a: '조선인 가정부가 일본인 고등관의 관사에서 숨진 사건. 배석판사 한 명을 빼면 판사·검사·피고·증인이 모두 일본인이었다. 방청석은 새벽부터 찼다.', s: '기록' },
    { q: '무대 위의 이름', a: '2019년 7월 연극 「그때, 변홍례」(극단 하땅세, 연출 윤시중)는 그를 별명이 아닌 이름으로 불렀다. — 현대의 재해석 자료다.', s: '후대' },
    { q: '그 밤만, 옆방', a: '남편이 떠난 뒤 히사코는 줄곧 응접실에서 잤다. 그런데 그날 밤만은 — 마리아의 옆방에서 잤다.', s: '기록' },
    { q: '전구의 지문', a: '유일한 물증은 하녀 방 전구의 지문. 부산엔 감식 장비가 없어 경기도 경찰부로 보냈지만 — "희미해 감식이 어렵다"는 답이 돌아왔다.', s: '기록' },
    { q: '깨진 유리창', a: '2층 유리창이 깨진 것 말고는 집 안이 잘 정돈돼 있었다. 비에 땅이 질었는데도 마당엔 수상한 발자국 하나 없었다. 경찰 안에서 "집 안 사람"이라는 의견이 7대 3으로 많았다.', s: '기록' }
  ];
  /* 야사 → 「관사 15호 평면도」 : 방을 누르면, 그 방에 남은 이야기 */
  (function () {
    var root = $('#yasa'); if (!root) return;
    var TG = { '기록': 'rec', '후대': 'later', '소문': 'rumor' };
    var ROOMS = [
      { id: 'study', x: 40, y: 60, w: 395, h: 230, t: '응접실', hj: '應接室', y_: [12], note: ['남편이 떠난 뒤, 아씨는 줄곧 여긔서 잣소.', '남편이 떠난 뒤, 안주인은 줄곧 여기서 잤다.'] },
      { id: 'wife', x: 435, y: 60, w: 395, h: 230, t: '안방', hj: '內房', y_: [0], note: ['밤 아홉 시, 마리아는 이 방 이부자리를 펴고 인사하엿소.', '밤 9시, 마리아는 이 방 이부자리를 펴고 인사했다.'] },
      { id: 'hall', x: 40, y: 290, w: 790, h: 70, t: '복도', hj: '廊下', y_: [2], note: '' },
      { id: 'door', x: 40, y: 360, w: 170, h: 140, t: '현관', hj: '玄關', y_: [6, 7], note: ['밧게서 드나든 사내들.', '밖에서 드나든 남자들.'] },
      { id: 'found', x: 210, y: 360, w: 230, h: 140, t: '하녀 방', hj: '下女房 · 發見', y_: [3, 13], note: ['아츰 열 시, 아씨가 이 문을 열엇소.', '아침 10시, 안주인이 이 문을 열었다.'], hot: 1 },
      { id: 'maid', x: 440, y: 360, w: 230, h: 140, t: '엽방', hj: '그 밤의 방', y_: [1], note: ['그 밤만 — 아씨는 여긔서 잣소. 벽 한 겹 너머가 하녀 방이엇소.', '그날 밤만 — 안주인은 여기서 잤다. 벽 한 겹 너머가 가정부 방이었다.'] },
      { id: 'kitchen', x: 670, y: 360, w: 160, h: 140, t: '부엌', hj: '臺所', y_: [], note: ['검사는 — 범인이 이 부엌문으로 드나들엇다 하엿소.', '검사는 — 범인이 이 부엌문으로 드나들었다고 했다.'] }
    ];
    var EXTRA = [
      { id: 'window', cx: 325, cy: 40, t: '유리문 밧', y_: [4, 14], note: ['편지의 사내는, 유리문 안을 드려다보앗다 하엿소.', '편지의 남자는, 유리문 안을 들여다보았다고 했다.'] },
      { id: 'park', cx: 930, cy: 430, t: '철도병원 압 공원', y_: [5], note: ['편지가 말한 곳에, 정말 잇섯소.', '편지가 말한 곳에, 정말 있었다.'] }
    ];
    var svg = '<svg class="pl-svg" viewBox="0 0 1000 540" aria-label="관사 15호 평면도 (재현)">' +
      '<defs><pattern id="tat" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 12h24M12 0v24" stroke="#3a312812" stroke-width="1"/></pattern></defs>' +
      ROOMS.map(function (r) {
        return '<g class="pl-room' + (r.hot ? ' hot' : '') + '" data-id="' + r.id + '" tabindex="0"><rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '"/>' +
          '<rect class="tat" x="' + (r.x + 8) + '" y="' + (r.y + 8) + '" width="' + (r.w - 16) + '" height="' + (r.h - 16) + '" fill="url(#tat)"/>' +
          '<text class="t" x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.h / 2 - 4) + '">' + r.t + '</text><text class="h" x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.h / 2 + 18) + '">' + r.hj + '</text></g>';
      }).join('') +
      /* 문과 창 */
      '<g class="pl-ink"><path d="M280 60 h90" class="win"/><path d="M435 175 v40 M210 410 v40 M440 410 v40 M670 410 v40" class="door"/><path d="M110 500 h60" class="door"/>' +
      '<path d="M840 430 h70 m-14 -8 l14 8 l-14 8" class="arrow"/></g>' +
      EXTRA.map(function (e) { return '<g class="pl-extra" data-id="' + e.id + '" tabindex="0"><circle cx="' + e.cx + '" cy="' + e.cy + '" r="15"/><text x="' + e.cx + '" y="' + (e.cy - 24) + '">' + e.t + '</text></g>'; }).join('') +
      '<text class="pl-cap" x="40" y="530">鐵道官舍 第十五號 · 平面圖 (재현 — 실제 구조는 전하지 않음)</text></svg>';
    root.innerHTML = '<div class="pl-wrap"><div class="pl-paper">' + svg + '</div><aside class="pl-note"></aside></div>' +
      '<ol class="pl-out">' + [10].map(function (k) { return '<li><b>' + YASA[k].q + '</b>' + YASA[k].a + '</li>'; }).join('') + '</ol>';
    function show(id) {
      var r = ROOMS.concat(EXTRA).filter(function (x) { return x.id === id; })[0]; if (!r) return;
      $$('.pl-room, .pl-extra', root).forEach(function (g) { g.classList.toggle('on', g.dataset.id === id); });
      $('.pl-note', root).innerHTML = '<figure class="pl-ph"><img alt="" src="./img/room_' + r.id + '.jpg" onerror="this.parentNode.remove()"></figure><span class="pl-k">이 방에 남은 이야기</span><h4>' + r.t + '</h4>' + (r.note ? '<p class="pl-lead">' + (r.note.length ? H(r.note[0], r.note[1]) : r.note) + '</p>' : '') +
        r.y_.map(function (k) { var y = YASA[k]; return '<div class="pl-y"><span class="mm-tag ' + TG[y.s] + '">' + (y.s === '후대' ? '후대 정리' : y.s) + '</span><b>' + y.q + '</b><p>' + y.a + '</p></div>'; }).join('');
      $('.pl-note', root).classList.remove('in'); void root.offsetWidth; $('.pl-note', root).classList.add('in');
    }
    root.addEventListener('click', function (e) { var g = e.target.closest('.pl-room, .pl-extra'); if (g) { show(g.dataset.id); play('sfxWhoosh'); } });
    root.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var g = e.target.closest('.pl-room, .pl-extra'); if (g) show(g.dataset.id); } });
    show('maid');
  })();


  /* ── 추리소설의 장 표지 · 프롤로그 : 독백이 한 줄씩 번져 나옴 ── */
  (function () {
    var els = $$('.ch-card, .prologue'); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .35 });
    els.forEach(function (e) { io.observe(e); });
  })();
  /* ── 第六話 담 너머의 세 가지 말 : 봉한 쪽지 펼치기 ── */
  (function () {
    var cs = $$('.rm-card'); if (!cs.length) return;
    cs.forEach(function (c) {
      var open = function () { if (c.classList.contains('open')) return; c.classList.add('open'); play('sfxWhoosh'); if ($$('.rm-card.open').length === cs.length) $('.rumors').classList.add('all'); };
      c.addEventListener('click', open);
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  })();



  /* ── 소리 (파일 없이) : 똑딱 · 자명종 · 도장 ── */
  var SND = (function () {
    var ac = null, on = false, bus = null;
    function ctx() { if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (C) { ac = new C(); bus = ac.createGain(); bus.connect(ac.destination); } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
    function mute(m) { var a = ctx(); if (!a) return; bus.gain.cancelScheduledValues(a.currentTime); bus.gain.setValueAtTime(bus.gain.value, a.currentTime); bus.gain.linearRampToValueAtTime(m ? 0 : 1, a.currentTime + (m ? .25 : .05)); }
    function tick(v) { var a = ctx(); if (!a) return; var t = a.currentTime;
      var n = a.createBufferSource(), b = a.createBuffer(1, Math.floor(a.sampleRate * .03), a.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
      var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = v ? 3400 : 2500; f.Q.value = 3;
      var g = a.createGain(); g.gain.value = .9; n.buffer = b; n.connect(f); f.connect(g); g.connect(bus); n.start(t); }
    var rainN = null, rainG = null;
    function rain(onoff) { var a = ctx(); if (!a) return;
      if (!rainN) { var len = a.sampleRate * 2, b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0), last = 0;
        for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; d[i] = last * 3.5 + (Math.random() < .0006 ? (Math.random() - .5) * .8 : 0); }
        rainN = a.createBufferSource(); rainN.buffer = b; rainN.loop = true;
        var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1600; rainG = a.createGain(); rainG.gain.value = 0;
        rainN.connect(f); f.connect(rainG); rainG.connect(bus); rainN.start(); }
      rainG.gain.cancelScheduledValues(a.currentTime); rainG.gain.linearRampToValueAtTime(onoff ? .35 : 0, a.currentTime + 1.2); }
    function bell(dur) { var a = ctx(); if (!a) return; var t0 = a.currentTime;
      for (var k = 0; k < dur * 22; k++) { var t = t0 + k / 22;
        [2350, 3170].forEach(function (fq, j) { var o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = fq + (k % 2 ? 30 : 0);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(j ? .12 : .2, t + .003); g.gain.exponentialRampToValueAtTime(.0001, t + .09);
          o.connect(g); g.connect(bus); o.start(t); o.stop(t + .1); }); } }
    function thud() { var a = ctx(); if (!a) return; var t = a.currentTime, o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + .18);
      g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + .26);
      var n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * .06, a.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var gn = a.createGain(); gn.gain.value = .25; n.buffer = b; n.connect(gn); gn.connect(a.destination); n.start(t); }
    return { tick: tick, bell: bell, thud: thud, rain: rain, mute: mute, ctx: ctx, get on() { return on; }, set on(v) { on = v; } };
  })();
  /* ── 第三話 자명종 : 단서의 시각에만 똑딱 · 비 오는 시각에만 비 · 칸을 나가면 소리 끔 ── */
  (function () {
    var sec = $('#clock'); if (!sec) return;
    var sh = $('.ck-s', sec), btn = $('.ck-snd', sec), cv = $('.ck-rainc', sec), inv = false, sOn = false, deg = 0, fired = {}, tq = [];
    setInterval(function () { deg += 6; if (sh) sh.style.transform = 'rotate(' + deg + 'deg)'; }, 1000);
    function isRain() { return sec.classList.contains('rain'); }
    function stopTicks() { tq.forEach(clearTimeout); tq = []; }
    function burst(n) { stopTicks(); for (var i = 0; i < n; i++) (function (i) { tq.push(setTimeout(function () { if (inv && sOn) SND.tick(i % 2); }, i * 1000)); })(i); }
    /* 들어오면 바로 똑딱 — 나가면 저절로 끔 (브라우저가 막으면 처음 누르는 순간부터) */
    sOn = true; var bgEl = document.getElementById('bgm'), bgV = null, softT = null;
    function soft(v) { clearInterval(softT); if (v) softT = setInterval(function () { if (inv && sOn && !tq.length) SND.tick(deg / 6 % 2); }, 1000); }
    function duck(v) { if (!bgEl) return; if (v) { if (bgV === null) bgV = bgEl.volume; bgEl.volume = Math.min(bgV, .1); } else if (bgV !== null) { bgEl.volume = bgV; bgV = null; } }
    function upd() { if (!sOn) { soft(false); duck(false); return; } SND.ctx(); SND.mute(!inv); SND.rain(inv && isRain()); soft(inv); duck(inv); if (!inv) stopTicks(); }
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { document.addEventListener(t, function () { if (inv && sOn) SND.ctx(); }, true); });
    new IntersectionObserver(function (es) { es.forEach(function (e) { inv = e.isIntersecting; btn.classList.toggle('show', inv); upd(); }); }, { rootMargin: '-30% 0px -30% 0px' }).observe(sec);
    btn.innerHTML = H('시계 소리 끄기', '시계 소리 끄기'); btn.classList.add('on');
    btn.addEventListener('click', function () { sOn = !sOn; SND.ctx();
      if (sOn) { SND.mute(false); upd(); } else { stopTicks(); SND.rain(false); SND.mute(true); soft(false); duck(false); }
      btn.innerHTML = sOn ? H('시계 소리 끄기', '시계 소리 끄기') : H('시계 소리 듯기', '시계 소리 듣기'); btn.classList.toggle('on', sOn); });
    /* 비 오는 시각이 바뀔 때 */
    new MutationObserver(function () { if (sOn && inv) SND.rain(isRain()); }).observe(sec, { attributes: true, attributeFilter: ['class'] });
    var hit = function (r) {
      if (r.classList.contains('alarm')) { var h = r.dataset.h; if (fired[h]) return; fired[h] = 1;
        sec.classList.remove('ring'); void sec.offsetWidth; sec.classList.add('ring'); r.classList.add('rang');
        if (sOn && inv) { stopTicks(); SND.bell(2.2); } setTimeout(function () { sec.classList.remove('ring'); }, 2600); }
      else if (r.classList.contains('warn')) { if (sOn && inv) burst(4); } };
    if ('IntersectionObserver' in window) { var io3 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) hit(e.target); }); }, { rootMargin: '-45% 0px -45% 0px' });
      $$('.ck-row.alarm, .ck-row.warn', sec).forEach(function (r) { io3.observe(r); }); }
    /* 유리창의 빗줄기 — 비 오는 시각에만 */
    if (cv && cv.getContext) {
      var c = cv.getContext('2d'), W = 0, Hh = 0, drops = [], was = false;
      function size() { var r = cv.getBoundingClientRect(); W = cv.width = Math.round(r.width); Hh = cv.height = Math.round(r.height); }
      function mk() { return { x: Math.random() * W * 1.1, y: -20 - Math.random() * Hh, l: 10 + Math.random() * 18, v: 6 + Math.random() * 6, a: .18 + Math.random() * .3 }; }
      size(); for (var i = 0; i < 110; i++) { var d = mk(); d.y = Math.random() * Hh; drops.push(d); }
      window.addEventListener('resize', size);
      (function loop() { requestAnimationFrame(loop); var on = inv && isRain(); if (!on) { if (was) { c.clearRect(0, 0, W, Hh); was = false; } return; } was = true;
        if (!W) size(); c.clearRect(0, 0, W, Hh); c.lineWidth = 1;
        drops.forEach(function (d) { d.y += d.v; d.x -= d.v * .12; if (d.y > Hh || d.x < 0) { var n = mk(); d.x = n.x; d.y = -20; d.l = n.l; d.v = n.v; d.a = n.a; }
          c.strokeStyle = 'rgba(236,222,190,' + d.a + ')'; c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x + d.l * .12, d.y - d.l); c.stroke(); }); })();
    }
  })();
  /* ── 第十話 방청석 : 한 문답씩 ── */
  (function () {
    var sec = $('#court'); if (!sec) return; var xs = $$('.ct-x', sec), n = $('.ct-n b', sec), cur = -1, nx = $('.ct-next', sec);
    function show(i) { if (i < 0 || i >= xs.length) return; cur = i; xs.forEach(function (x, j) { x.classList.toggle('on', j === i); x.classList.remove('ans'); });
      n.textContent = i + 1; xs[i].classList.add('ans');
      nx.innerHTML = i === xs.length - 1 ? H('처음부터 다시', '처음부터 다시') : H('다음 문답 ▸', '다음 문답 ▸'); }
    nx.addEventListener('click', function () { show(cur === xs.length - 1 ? 0 : cur + 1); });
    $('.ct-prev', sec).addEventListener('click', function () { show(cur - 1); });
    show(0);
  })();

  /* ── 第三話 그날의 열두 시간 : 바늘이 그 시각으로 ── */
  (function () {
    var sec = $('#clock'); if (!sec) return;
    var hh = $('.ck-h', sec), mm = $('.ck-m', sec), now = $('.ck-now', sec), rows = $$('.ck-row', sec);
    function set(r) {
      var h = parseFloat(r.dataset.h), turns = h / 12;
      if (hh) hh.style.transform = 'rotate(' + (turns * 360) + 'deg)';
      if (mm) mm.style.transform = 'rotate(' + (h * 360) + 'deg)';
      now.innerHTML = $('.ck-t', r).innerHTML;
      rows.forEach(function (x) { x.classList.toggle('now', x === r); });
      sec.classList.toggle('night', h >= 21 && h < 30); sec.classList.toggle('rain', h >= 21 && h < 22);
    }
    if (!('IntersectionObserver' in window)) { rows.forEach(function (x) { x.classList.add('on'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); set(e.target); } }); }, { rootMargin: '-45% 0px -45% 0px' });
    rows.forEach(function (r) { io.observe(r); });
    set(rows[0]);
  })();
  /* ── 第七話 진술서의 틈 : 한 줄씩 대조 ── */
  (function () {
    var rs = $$('.al-row'); if (!rs.length) return; var n = 0, out = $('#alN');
    rs.forEach(function (r) {
      var go = function () { if (r.classList.contains('open')) return; r.classList.add('open'); SND.thud(); n++; if (out) out.textContent = n; play('sfxWhoosh'); if (n === rs.length) $('.alibi').classList.add('all'); };
      r.addEventListener('click', go); r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  })();
  /* ── 지면 확대 : 누르면 기사 확대가 열림 ── */
  $$('.dp').forEach(function (f) { f.addEventListener('click', function (e) { if (e.target.closest('a')) return; f.classList.toggle('zoom'); }); f.addEventListener('keydown', function (e) { if (e.key === 'Enter') f.classList.toggle('zoom'); }); });

  /* ── 섹션 나타나기 · 긔자 수첩 · 판결 줄 ── */
  var nb = $('.notebook'), got = {};
  function stamp(beat) {
    if (window.ykGuideOn) return;
    var b = nb && $('button[data-beat="' + beat + '"]', nb); if (!b || got[beat]) return;
    got[beat] = 1; b.classList.add('got');
    var c = Object.keys(got).length; $('.nb-count', nb).textContent = c + ' / 4';
    if (c === 4) nb.classList.add('done');
  }
  if (nb) {
    $('.nb-cover', nb).addEventListener('click', function () { var o = nb.classList.toggle('open'); this.setAttribute('aria-expanded', o); });
    $$('.nb-stamps button', nb).forEach(function (b) { b.addEventListener('click', function () { var s = $('[data-beat="' + b.dataset.beat + '"].sec'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
  }
  function verdict() { $$('.rv-lines li').forEach(function (li, i) { setTimeout(function () { li.classList.add('on'); }, 500 + i * 900); }); var nL = $$('.rv-lines li').length, f = $('.rv-final'); if (f) setTimeout(function () { f.classList.add('on'); play('sfxBell'); }, 500 + nL * 900); var p = $('.rv-plate'); if (p) p.classList.add('on');
    setTimeout(function () {
      document.body.classList.add('mr-judged'); if (window.ykMariaBoard) window.ykMariaBoard(); if (window.ykMariaRepage) window.ykMariaRepage();
      var STP = ['未濟', '未詳', '無'];
      $$('.rd-list li').forEach(function (li, i) { var st = $('.rd-stamp', li); if (st) { st.textContent = STP[i]; li.classList.add('judged'); } });
      $$('.rv-riddles li').forEach(function (li, i) { setTimeout(function () { li.classList.add('on'); }, i * 700); });
    }, 500 + (nL + 1) * 900); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; t.classList.add('in'); io.unobserve(t);
        if (t.dataset.beat) stamp(t.dataset.beat);
        if (t.classList.contains('verdict')) verdict();
      });
    }, { threshold: 0.18 });
    $$('.sec, .bridge').forEach(function (s) { io.observe(s); });
    /* 보는 법 안내 중에 지나간 장은, 직접 다시 올 때 도장 */
    var ioS = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !window.ykGuideOn && e.target.dataset.beat) stamp(e.target.dataset.beat); }); }, { threshold: 0.18 });
    $$('[data-beat]').forEach(function (s) { if (!s.closest('.notebook')) ioS.observe(s); });
  } else { $$('.sec, .bridge').forEach(function (s) { s.classList.add('in'); }); verdict(); }

  /* ── 비하인드(호외) 카드 ── */
  (function () {
    var m = $('#behind'), tab = $('.hogoe-tab'); if (!m || !tab) return;
    var pics = [IMG + 'behind/maria-behind01.png', IMG + 'behind/maria-behind02.png'], i = 0;
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

/* 第一報 — 화면에 들어오면 한 줄씩 */
(function () {
  var s = document.getElementById('firstReport'); if (!s) return;
  if (!('IntersectionObserver' in window)) { s.classList.add('in'); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { s.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.35 });
  io.observe(s);
})();

/* 끗 — 빈 자리, 화면에 들어오면 천천히 */
(function () {
  var s = document.getElementById('finale'); if (!s) return;
  if (!('IntersectionObserver' in window)) { s.classList.add('in'); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { s.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.3 });
  io.observe(s);
})();

/* 어두운 띠(첫 보도 · 기자 수첩 · 빈 자리)를 지면 폭에 꼭 맞추기 */
(function () {
  var SEL = ['#firstReport', '#board', '.sec.verdict', '#finale', '#prologue'];
  function fit() {
    var list = SEL.map(function (s) { return document.querySelector(s); }).concat([].slice.call(document.querySelectorAll('.ch-card')));
    var page = document.querySelector('.archive-page'); if (!page) return;
    var pr = page.getBoundingClientRect();
    list.forEach(function (el) {
      if (!el) return;
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
