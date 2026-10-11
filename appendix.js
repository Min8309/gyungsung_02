/* =========================================================================
   경성야록 부록 — 京城事件博覽會
   ▶ appendix.js : 동작 (기존 expo.js 를 바탕으로 새로 구성)
   -------------------------------------------------------------------------
   내용(글 · 사진 이름 · 관 · 작품 · 1929 자료)은 전부 appendix-data.js 에 있습니다.
   이 파일은 그 데이터를 읽어서 화면을 그리고, 누르면 반응하게만 합니다.

   목차
     ① 준비: 데이터 꺼내기 · 작은 도구들
     ② 입구: 입장권 개찰
     ③ 한자 전환: 기본 한글 → 마우스를 올리면 한자
     ④ 관 목차 띠 · 지도 명패 · 관별 색인 그리기
     ⑤ 관람 안내 칸: 입장료 · 포스터 · 회기
     ⑥ 관 내부: 진열품 5가지 모양 + 표찰
     ⑦ 사건 족보
     ⑧ 관람 도장 수첩 · 할인권
     ⑨ 주소(#)에 따라 화면 바꾸기
     ⑩ 시작
     ⑪ 第一部 박람회 소개
     ⑫ 第二部 자료실 — 공통 (사진 불러오기 · 진행 칸 · 확대경)
     ⑬   놀이 2  조감도 숨은 그림 찾기
     ⑭   놀이 3  옛 안내문 읽기
     ⑮   놀이 1 · 4 · 5  리플렛 펼치기 · 남대문 불 켜기 · 포스터 표어
     ⑯   놀이 6  지도 서랍 · 활동사진
   (⑪~⑯ 은 ⑩ 시작보다 먼저 정의되어야 하므로 실제로는 ⑩ 바로 앞에 있습니다)
   ========================================================================= */

(function () {
  'use strict';   // 오타 같은 실수를 브라우저가 바로 알려 주도록


  /* =======================================================================
     ① 준비: 데이터 꺼내기 · 작은 도구들
     ======================================================================= */

  // appendix-data.js 가 window.EXPO 에 넣어 둔 데이터
  var D = window.EXPO;
  var C = D.config;

  // 자주 쓰는 찾기 — $('#id') 하나, $$('.class') 여러 개
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // 글자를 HTML 에 넣기 전에 < > & " 를 안전하게 바꿈 (데이터에 기호가 있어도 화면이 깨지지 않게)
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // 한자 전환 글자 만들기: 메인과 같은 약속 → 안쪽 글자는 한자, data-ko 는 한글
  // (한자가 없으면 그냥 한글 글자만)
  function hj(ko, hanja) {
    if (!hanja || hanja === ko) return esc(ko);
    return '<span class="hj" data-ko="' + esc(ko) + '">' + esc(hanja) + '</span>';
  }

  // id 로 관 · 사건 찾기
  function pavById(id) { return D.pavilions.filter(function (p) { return p.id === id; })[0]; }
  function caseById(id) { return D.cases.filter(function (c) { return c.id === id; })[0]; }
  // 어느 관에 놓인 작품들 (오래된 것부터)
  function worksIn(hallId) {
    return D.works.filter(function (w) { return w.hall === hallId; }).sort(function (a, b) { return a.year - b.year; });
  }

  // 한자 숫자 (메인 index.html 의 kanji 함수와 같은 규칙)
  var DIGIT = '〇一二三四五六七八九';
  function kanji(n) {                                   // 1~99 → 一 ~ 九十九
    if (n <= 10) return n === 10 ? '十' : DIGIT[n];
    if (n < 20) return '十' + (n % 10 ? DIGIT[n % 10] : '');
    return DIGIT[Math.floor(n / 10)] + '十' + (n % 10 ? DIGIT[n % 10] : '');
  }
  function yearKanji(y) {                               // 2026 → 二〇二六
    return String(y).split('').map(function (d) { return DIGIT[+d]; }).join('');
  }
  // '1933.05.17' → '1933. 5. 17' (메인과 같은 표기)
  function prettyDate(s) {
    var p = String(s).split('.');
    return p.length === 3 ? p[0] + '. ' + (+p[1]) + '. ' + (+p[2]) : s;
  }

  // 사진 불러오기: 이름.png → 없으면 이름.jpg → 둘 다 없으면 fail()
  // (사진을 아직 안 넣었어도 화면이 깨지지 않게 하는 장치)
  function loadImg(img, name, fail) {
    var tries = ['.png', '.jpg'];
    var i = 0;
    function next() {
      if (i >= tries.length) { if (fail) fail(); return; }
      img.src = C.assetDir + name + tries[i++];
    }
    img.onerror = next;
    next();
  }

  // 움직임 줄이기 설정을 켠 사람인지
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 오늘 날짜 문자열 (도장 · 개찰 기억용) — '2026-10-02'
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // 브라우저 기억(localStorage): 막혀 있어도 오류 없이 '이번 방문만 기억'으로 넘어가게 try 로 감쌈
  // stamps  : 도장 받은 관 id 들
  // ticket  : 개찰한 날짜 ('2026-10-02') — 같은 날 다시 오면 입구를 건너뜀
  // ticketType : 고른 입장권 id (adult · congrats · vip)
  // plays   : 자료실 놀이 진행 { seek:[찾은 id들], notice:[읽은 id들], leaflet:true, light:true, drawer:[연 지도들] }
  var store = { stamps: [], ticket: '', ticketType: '', plays: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(C.storageKey) || 'null');
    if (saved && Array.isArray(saved.stamps)) store = saved;
    if (!store.plays) store.plays = {};          // 예전 기억에 plays 칸이 없을 때 대비
  } catch (e) { /* 기억 못 해도 괜찮음 */ }
  function save() {
    try { localStorage.setItem(C.storageKey, JSON.stringify(store)); } catch (e) { /* 무시 */ }
  }

  // 제호(京城野錄) 자리: data-brand 가 붙은 칸에 expo-data.js 의 제호를 넣음
  $$('[data-brand]').forEach(function (el) {
    el.textContent = C.brandHj;
    el.setAttribute('data-ko', C.brandKo);
  });


  /* =======================================================================
     ② 입구: 입장권 개찰
     ======================================================================= */
  function setupGate() {
    var gate = $('#gate');
    var pick = $('#ticketPick');
    var now = new Date();

    // 뒤 포스터: 사진이 있을 때만 깔림
    var probe = new Image();
    loadImg(probe, 'expo-poster');
    probe.onload = function () { $('#gatePoster').style.backgroundImage = 'url(' + probe.src + ')'; };

    // 개찰 도장 글자: 二〇二六年 / 十月 二日 / 改札 — 고른 표 위에 찍힘
    var stampHTML = yearKanji(now.getFullYear()) + '年<br>' + kanji(now.getMonth() + 1) + '月 ' + kanji(now.getDate()) + '日<br>改札';
    var stampLabel = now.getFullYear() + '년 ' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일 개찰';

    // 실제 입장권 세 장 그리기 (appendix-data.js tickets)
    pick.innerHTML = D.tickets.map(function (t) {
      return '<button type="button" class="tk" data-ticket="' + t.id + '">' +
               '<span class="tk-img"><img src="' + C.expoDir + t.img + '" alt="">' +
                 '<span class="punch" aria-hidden="true"></span>' +                         // 펀치 구멍
                 '<span class="date-stamp" aria-label="' + stampLabel + '">' + stampHTML + '</span>' +   // 개찰 도장
               '</span>' +
               '<b>' + hj(t.ko, t.hj) + '</b>' +
               '<em>' + hj(t.price, t.priceHj) + '</em>' +
               '<small>' + esc(t.note) + '</small>' +
             '</button>';
    }).join('');
    bindHanja(pick);                     // 표 이름도 기본 한글 → 마우스를 올리면 한자

    // 입구 닫고 지면 열기
    function enter(ticketId) {
      gate.classList.add('is-open');
      document.body.style.overflow = '';
      if (ticketId) { store.ticket = todayKey(); store.ticketType = ticketId; save(); }   // 오늘 · 고른 표 기억
      drawTicketState();
      setTimeout(function () { gate.setAttribute('hidden', ''); }, REDUCED ? 0 : 900);
    }

    // 메인에서 반권을 뜯고 넘어온 경우 (appendix.html?from=main)
    // → 이미 대인권으로 개찰한 것으로 치고, 입구 대신 '불 켜진 정문'이 걷히며 지면이 열림
    if (/[?&]from=main/.test(location.search)) {
      store.ticket = todayKey(); store.ticketType = 'adult'; save();
      gate.setAttribute('hidden', '');
      drawTicketState();
      arriveFromMain();
      return;
    }

    // 오늘 이미 개찰했으면 입구 없이 바로
    if (store.ticket === todayKey()) { gate.setAttribute('hidden', ''); return; }

    // 입구가 떠 있는 동안 뒤 지면이 스크롤되지 않게
    document.body.style.overflow = 'hidden';

    // 표를 고르면: 그 표에 구멍 + 도장(0초) → 다른 두 장 물러남 → 입장(1.6초)
    pick.addEventListener('click', function (e) {
      var b = e.target.closest('.tk');
      if (!b || pick.classList.contains('is-chosen')) return;   // 두 번 누르기 막기
      pick.classList.add('is-chosen');
      b.classList.add('is-punched');
      if (REDUCED) { enter(b.dataset.ticket); return; }
      setTimeout(function () { enter(b.dataset.ticket); }, 1600);
    });
    // '표 없이 둘러보기'
    $('#skipBtn').addEventListener('click', function () { enter(''); });
  }

  // 메인에서 넘어왔을 때: 메인 장면은 정문 아치 안으로 다가가며 깜깜해지고 끝남
  // → 여기서는 그 깜깜함에서 시작해, 안개 사이로 「자정 개장」이 잠깐 비치고 1.4초 동안 걷힘
  function arriveFromMain() {
    if (REDUCED) return;
    var veil = document.createElement('div');
    veil.className = 'arrive-veil';
    veil.setAttribute('aria-hidden', 'true');
    veil.innerHTML = '<div class="fog f1"></div><div class="fog f2"></div><p>자정 개장</p>';   // 100% 한글
    document.body.appendChild(veil);
    setTimeout(function () { veil.classList.add('lift'); }, 700);
    setTimeout(function () { veil.remove(); }, 2300);
    // 주소의 ?from=main 은 지워 둠 (새로고침해도 다시 연출되지 않게)
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
  }

  // 제호 오른쪽 '입장권 개찰 전 / 개찰 완료' 글자
  function drawTicketState() {
    var t = D.tickets.filter(function (x) { return x.id === store.ticketType; })[0];
    var ok = store.ticket === todayKey();
    $('#mTicket').textContent = ok ? (t ? t.ko + ' 개찰 완료' : '오늘 입장권 개찰 완료') : '입장권 개찰 전';
    // 수첩 맨 위에도 가진 표를 보여 줌
    var pt = $('#passTicket');
    if (pt) pt.textContent = ok && t ? '소지한 표 · ' + t.ko + ' (' + t.price + ')' : '표 없이 입장';
  }


  /* =======================================================================
     ③ 한자 전환: 기본 한글 → 마우스를 올리면 한자 (메인 index.html 맨 아래와 같은 방식)
     · 화면에 새 글자를 그릴 때마다 bindHanja(그 칸) 를 불러 줘야 함
     ======================================================================= */
  function bindHanja(root) {
    $$('.hj', root).forEach(function (el) {
      if (el.dataset.flip) return;                 // 이미 처리한 글자는 건너뜀
      var hanja = el.textContent;                  // 처음 안쪽 글자 = 한자
      var ko = el.dataset.ko;                      // data-ko = 한글
      if (!ko) return;
      el.dataset.flip = '1';
      el.textContent = ko;                         // 처음엔 한글로 보이게
      el.setAttribute('aria-label', ko);           // 화면 읽기 프로그램은 늘 한글로 읽음
      // 버튼 · 링크 안의 글자는 그 버튼에 올렸을 때 바뀌게 (작은 글자만 정확히 겨누지 않아도 되게)
      var host = el.closest('button, a') || el;
      if (host === el) el.setAttribute('tabindex', '0');
      function on()  { el.textContent = hanja; el.style.fontFamily = 'var(--hanja)'; }
      function off() { el.textContent = ko;    el.style.fontFamily = ''; }
      host.addEventListener('mouseenter', on);
      host.addEventListener('mouseleave', off);
      // 키보드로 온 경우에만 한자로 (스크립트가 자동으로 옮긴 포커스에는 반응 안 함)
      host.addEventListener('focus', function () { if (host.matches(':focus-visible')) on(); });
      host.addEventListener('blur', off);
    });
  }


  /* =======================================================================
     ④ 관 목차 띠 · 지도 명패 · 관별 색인 그리기
     ======================================================================= */
  function drawHallTabs() {
    var nav = $('#halls');
    D.pavilions.forEach(function (p) {
      var n = worksIn(p.id).length;
      var a = document.createElement('a');
      a.href = '#hall/' + p.id;                    // 누르면 주소가 바뀌고 ⑨ 가 관을 엶
      a.className = 'hall-tab' + (p.isNew ? ' is-new' : '');
      a.dataset.hall = p.id;
      // 큰 글자: 관 이름(한글 → 한자) / 작은 글자: 무엇을 모았나 + 진열 수
      a.innerHTML = '<b>' + hj(p.ko, p.hj) + '</b><small>' + esc(p.kind) + (n ? '<sup>' + n + '</sup>' : '') + '</small>';
      nav.appendChild(a);
    });
  }

  function drawMap() {
    var map = $('#map');

    // 배치도 사진: 없으면 .no-img 를 붙여 코드 그림으로 대신
    loadImg($('#mapImg'), 'expo-map', function () { map.classList.add('no-img'); });

    // 명패 6개를 x,y(%) 자리에 얹음
    D.pavilions.forEach(function (p) {
      var n = worksIn(p.id).length;
      var a = document.createElement('a');
      a.href = '#hall/' + p.id;
      a.className = 'pav' + (p.isNew ? ' pav-new' : '');
      a.dataset.hall = p.id;
      a.style.left = p.x + '%';
      a.style.top = p.y + '%';
      a.setAttribute('aria-label', p.ko + ' 들어가기, 진열 ' + n + '점');
      a.innerHTML =
        '<span class="pav-plate">' + hj(p.ko, p.hj) + (n ? '<sup>' + n + '</sup>' : '') + '</span>' +
        '<span class="pav-pin"></span><span class="pav-dot"></span>';
      map.appendChild(a);
    });
  }

  // 지도 아래 '각 관 진열' 색인: 관마다 작품 목록 (메인 '각면 기록' 모양)
  function drawIndex() {
    var box = $('#indexCols');
    box.innerHTML = D.pavilions.map(function (p) {
      var list = worksIn(p.id);
      var items = list.length
        ? '<ul>' + list.map(function (w) {
            return '<li><button type="button" data-go-hall="' + p.id + '" data-go-work="' + w.id + '">' +
                   '<b>' + esc(w.title) + '</b><span>' + w.year + ' · ' + esc(w.genre) + ' · ' + esc(caseById(w.case).ko) + '</span>' +
                   '</button></li>';
          }).join('') + '</ul>'
        : '<p class="empty">진열 준비 중</p>';
      return '<div class="col"><h3>' + hj(p.ko, p.hj) + '<small>' + list.length + '점</small></h3>' + items +
             '<a class="go" href="#hall/' + p.id + '">' + esc(p.ko) + ' 들어가기</a></div>';
    }).join('');
  }


  /* =======================================================================
     ⑤ 관람 안내 칸: 입장료 · 포스터 · 회기
     ======================================================================= */
  function drawGuide() {
    // 1929 회기 · 회장 · 규모
    var E = D.expo1929;
    $('#periodList').innerHTML =
      '<dt>회기</dt><dd>' + hj(E.period, E.periodHj) + '</dd>' +
      '<dt>회장</dt><dd>' + hj(E.place, E.placeHj) + '</dd>' +
      '<dt>규모</dt><dd>' + hj(E.scale, E.scaleHj) + '</dd>';

    // 입장료 표: 권종 · 점선 · 요금
    // 단체 요금(group:true)은 작은 글씨로, 첫 단체 줄 위에만 가는 선
    var firstGroup = true;
    $('#feeList').innerHTML = D.fee1929.map(function (f) {
      var cls = '';
      if (f.group) { cls = ' group' + (firstGroup ? ' group-first' : ''); firstGroup = false; }
      return '<dt class="' + cls.trim() + '">' + hj(f.ko, f.hj) + '</dt>' +
             '<dd class="dots' + cls + '"></dd>' +
             '<dd class="price' + cls + '">' + hj(f.price, f.priceHj) + '</dd>';
    }).join('');

    // 포스터 액자: 사진이 없으면 칸째 숨김
    loadImg($('#posterImg'), 'expo-poster', function () { $('#posterFig').classList.add('no-img'); });

    // 제호 오른쪽 회기 날짜: 2026년 10월 2일 금요일 (메인 오른쪽 위 날짜와 같은 모양)
    var d = new Date();
    var md = $('#mDate');
    md.className += ' hj';
    md.dataset.ko = d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + '일월화수목금토'[d.getDay()] + '요일';
    md.textContent = yearKanji(d.getFullYear()) + '年 ' + kanji(d.getMonth() + 1) + '月 ' + kanji(d.getDate()) + '日 ' + '日月火水木金土'[d.getDay()] + '曜日';

    // 본지로 돌아가기 주소
    $('#toMain').href = C.mainPage;
  }


  /* =======================================================================
     ⑥ 관 내부: 진열품 5가지 모양 + 표찰
     ======================================================================= */

  // 진열품 '물건' 부분 — 모양(shape)에 따라 다르게 그림
  // 사진 자리는 <img data-img="이름"> 로만 두고, 다 그린 뒤 fillImages() 가 사진을 찾아 넣음
  function objectHTML(w) {
    var p = pavById(w.hall);

    // 1990년 이후 작품: 포스터 · 장면 없이 표찰만 (제목 · 연도 · 찾아보기)
    if (w.recent) {
      return '<div class="obj obj-plate' + (p.isNew ? ' is-new' : '') + '">' +
               '<span class="p-kind">' + esc(w.genre) + '</span>' +
               '<span class="p-title">' + esc(w.title) + '</span>' +
               '<span class="p-year">' + w.year + '</span>' +
               (w.link ? '<a href="' + esc(w.link) + '" target="_blank" rel="noopener">찾아보기</a>' : '') +
             '</div>';
    }

    var T = hj(w.title, w.titleHj);                                   // 제목 (한글 → 한자)
    var img = w.img ? '<img data-img="' + esc(w.img) + '" alt="">' : ''; // 사진 자리

    switch (w.shape) {
      // 책 표지: 사진이 있으면 타원 초상 + 세로 제목 + 지은이
      case 'book':
        return '<div class="obj obj-book">' +
                 (w.img ? '<div class="b-portrait">' + img + '</div>' : '') +
                 '<span class="b-title">' + T + '</span>' +
                 '<span class="b-maker">' + esc(w.maker) + '</span>' +
               '</div>';

      // 레코드: 원판 가운데 라벨 (사진이 있으면 라벨 자리에)
      case 'record':
        return '<div class="obj obj-record"><div class="r-label">' + img +
                 '<b>' + T + '</b><small>' + w.year + '</small>' +
               '</div></div>';

      // 극장 전단: 上映 / 제목 / 연도 · 만든 사람
      case 'flyer':
        return '<div class="obj obj-flyer"><div class="f-in">' +
                 '<span class="f-kind">' + hj('상영', '上映') + '</span>' +
                 '<span class="f-title">' + T + '</span>' +
                 '<span class="f-meta">' + yearKanji(w.year) + '年 · ' + esc(w.maker) + '</span>' +
               '</div></div>';

      // 편성표 조각: 방송 · 연도 · 만든 이 세 줄 표
      case 'sched':
        return '<div class="obj obj-sched"><table>' +
                 '<tr><td>' + hj('방송', '放送') + '</td><td>' + T + '</td></tr>' +
                 '<tr><td>' + hj('연도', '年度') + '</td><td>' + w.year + '</td></tr>' +
                 '<tr><td>' + hj('만든 이', '製作') + '</td><td>' + esc(w.maker) + '</td></tr>' +
               '</table></div>';

      // 액자: 사진 (없으면 제목 글자가 대신 걸림)
      case 'frame':
      default:
        return '<div class="obj obj-frame"><div class="fr-in' + (w.img ? '' : ' no-src') + '">' + img +
                 '<b class="fr-alt">' + T + '</b>' +
               '</div></div>';
    }
  }

  // 진열품 아래 '표찰'
  function tagHTML(w) {
    var c = caseById(w.case);
    var toPage = '<a class="to-page" href="' + esc(C.caseLink(c.id)) + '">이 작품이 태어난 지면 →</a>';
    var pending = w.verify ? '<span class="pending">다른 문헌에 의함</span><br>' : '';

    // 1990년 이후 작품: 사건과 지면 링크만 (제목 · 연도는 이미 위 표찰에)
    if (w.recent) {
      return '<div class="tag"><dl><dt>사건</dt><dd>' + esc(c.ko) + '</dd></dl>' + pending + toPage + '</div>';
    }
    return '<div class="tag">' +
             '<h3>' + hj(w.title, w.titleHj) + '</h3>' +
             '<dl>' +
               '<dt>갈래</dt><dd>' + esc(w.genre) + '</dd>' +
               '<dt>연도</dt><dd>' + w.year + '</dd>' +
               '<dt>만든 사람</dt><dd>' + esc(w.maker) + '</dd>' +
               '<dt>사건</dt><dd>' + esc(c.ko) + '</dd>' +
             '</dl>' +
             '<p class="line">' + esc(w.line) + '</p>' +
             pending + toPage +
           '</div>';
  }

  // 그려 둔 <img data-img> 에 실제 사진을 찾아 넣음. 못 찾으면 부모에 .noimg → 사진만 숨김
  function fillImages(root) {
    $$('img[data-img]', root).forEach(function (img) {
      loadImg(img, img.dataset.img, function () { img.parentNode.classList.add('noimg'); });
    });
  }

  // 관 열기
  function openHall(id, focusWorkId) {
    var p = pavById(id);
    if (!p) { go('map'); return; }
    var list = worksIn(id);

    // 머리: 세로 관 이름 · 사진 · 설명
    $('#hallName').innerHTML = hj(p.ko, p.hj);
    $('#hallKind').textContent = p.kind;
    $('#hallCount').textContent = list.length ? '진열 ' + list.length + '점 · 오래된 것부터' : '진열 준비 중';
    $('#hallHead').classList.toggle('is-new', !!p.isNew);
    $('#hallEmpty').textContent = p.hj;
    var photo = $('#hallPhoto');
    photo.classList.remove('no-img');
    loadImg($('#hallImg'), p.img, function () { photo.classList.add('no-img'); });

    // 진열장
    $('#shelf').innerHTML = list.length
      ? list.map(function (w) {
          var still = w.still || (caseById(w.case) || {}).still;   // 윤심덕 · 김우진 → 움직임 없음
          return '<figure class="exhibit' + (still ? ' is-still' : '') + '" id="w-' + esc(w.id) + '">' +
                   objectHTML(w) + tagHTML(w) +
                 '</figure>';
        }).join('')
      : '<div class="empty-hall"><b>' + hj('진열 준비 중', '陳列 準備中') + '</b>리서치 자료집과 대조가 끝난 작품부터 이 관에 들어옵니다.</div>';
    fillImages($('#shelf'));

    // 아래 '다른 관' 띠 — 아직 도장을 못 받은 관이 먼저 오게
    var others = D.pavilions.filter(function (q) { return q.id !== id; })
      .sort(function (a, b) { return (store.stamps.indexOf(a.id) > -1) - (store.stamps.indexOf(b.id) > -1); });
    $('#nextHall').innerHTML = '<span>다른 관</span>' + others.map(function (q) {
      var v = store.stamps.indexOf(q.id) > -1;
      return '<a href="#hall/' + q.id + '"' + (v ? ' class="is-visited"' : '') + '>' + hj(q.ko, q.hj) + '</a>';
    }).join('');

    bindHanja($('#view-hall'));

    // 족보에서 작품을 눌러 들어왔으면 그 작품까지 내려가 보여 줌
    if (focusWorkId) {
      setTimeout(function () {
        var el = document.getElementById('w-' + focusWorkId);
        if (el) el.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
      }, 60);
    }

    // 관에 들어섰으니 도장
    stamp(id);
  }


  /* =======================================================================
     ⑦ 사건 족보 — 맨 위 사건(뿌리) → 아래로 연도순 작품(가지)
     ======================================================================= */
  function drawTrees() {
    $('#trees').innerHTML = D.cases.map(function (c) {
      // 이 사건에서 태어난 작품, 오래된 것부터
      var ws = D.works.filter(function (w) { return w.case === c.id; }).sort(function (a, b) { return a.year - b.year; });

      var nodes = ws.length
        ? ws.map(function (w) {
            var p = pavById(w.hall);
            return '<li class="node">' +
                     '<span class="node-yr">' + w.year + '</span>' +             // 줄기 위 연도 마디
                     '<div class="leaf"><button type="button" data-go-hall="' + w.hall + '" data-go-work="' + w.id + '">' +
                       '<b>' + hj(w.title, w.titleHj) + '</b>' +
                       '<span class="sub">' + esc(w.genre) + ' · ' + esc(p.ko) + '</span>' +
                     '</button></div>' +
                   '</li>';
          }).join('')
        : '<li class="node-empty">파생 작품은 아즉 실리지 안앗소</li>';

      return '<article class="tree">' +
               '<header class="root">' +
                 '<span class="face">' + hj(c.face + '면', c.faceHj + '面') + '</span>' +
                 '<h3>' + hj(c.ko, c.hj) + '</h3>' +
                 '<p class="date">' + prettyDate(c.date) + '</p>' +
                 '<a href="' + esc(C.caseLink(c.id)) + '">지면으로</a>' +
               '</header>' +
               '<ol class="spine">' + nodes + '</ol>' +
             '</article>';
    }).join('');
  }

  // 색인 · 족보에서 작품 이름을 누르면 → 그 작품이 놓인 관으로 (작품 위치까지)
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go-hall]');
    if (!b) return;
    pendingWork = b.dataset.goWork;          // ⑨ 가 관을 연 뒤 이 작품으로 내려감
    location.hash = 'hall/' + b.dataset.goHall;
  });
  var pendingWork = null;


  /* =======================================================================
     ⑧ 관람 도장 수첩 · 할인권
     ======================================================================= */

  // 원형 기념인 SVG: 이중 원 + 관 한자를 세로로. 쪽빛.
  function sealSVG(p) {
    var color = p.isNew ? '#4a6f9a' : 'var(--indigo)';
    var chars = p.hj.split('');
    var size = chars.length > 4 ? 13 : chars.length > 3 ? 15 : 18;      // 글자 수가 많으면 작게
    var top = 50 - (chars.length - 1) * size / 2;                        // 세로 가운데 맞춤
    var text = chars.map(function (ch, i) {
      return '<text x="50" y="' + (top + i * size + size * 0.36) + '" text-anchor="middle" font-size="' + size +
             '" font-weight="800" font-family="Noto Serif KR, serif" fill="' + color + '">' + ch + '</text>';
    }).join('');
    // 도장마다 살짝 다른 기울기 (손으로 찍은 느낌)
    var tilt = (p.x % 7) - 4;
    return '<svg viewBox="0 0 100 100" aria-hidden="true" style="transform:rotate(' + tilt + 'deg)">' +
             '<circle cx="50" cy="50" r="46" fill="none" stroke="' + color + '" stroke-width="3"/>' +
             '<circle cx="50" cy="50" r="40" fill="none" stroke="' + color + '" stroke-width="1"/>' +
             text +
           '</svg>';
  }

  // 수첩 다시 그리기 (justId: 방금 찍힌 관 → 그 칸만 찍히는 움직임)
  function drawPassport(justId) {
    $('#slots').innerHTML = D.pavilions.map(function (p) {
      var on = store.stamps.indexOf(p.id) > -1;
      return '<div class="slot' + (on && p.id === justId ? ' just' : '') + '" aria-label="' + p.ko + (on ? ' 도장 받음' : ' 아직') + '">' +
               (on ? sealSVG(p) : esc(p.ko)) +
             '</div>';
    }).join('');
    $('#passCount').textContent = store.stamps.length + '/' + D.pavilions.length;

    // 6관을 다 돌았으면 할인권
    var done = D.pavilions.every(function (p) { return store.stamps.indexOf(p.id) > -1; });
    $('#coupon').hidden = !done;
    if (done) {
      $('#couponShop').innerHTML = hj(C.coupon.shopKo, C.coupon.shopHj);
      $('#couponCode').textContent = C.coupon.code;
      $('#couponNote').textContent = C.coupon.note;
      bindHanja($('#coupon'));
    }

    // 관 목차 · 지도 명패: 다녀간 관은 불이 켜짐 (.is-visited)
    $$('[data-hall]').forEach(function (el) {
      el.classList.toggle('is-visited', store.stamps.indexOf(el.dataset.hall) > -1);
    });
    // 여섯 관 모두 점등이면 회장 전체가 밝아짐
    $('#map').classList.toggle('all-lit', done);
    drawLitCount(done);
  }

  // 지도 아래 점등 현황: ●●○○○○ 2 / 6 + 안내 한 줄
  function drawLitCount(done) {
    var bulbs = D.pavilions.map(function (p) {
      var on = store.stamps.indexOf(p.id) > -1;
      return '<i class="' + (on ? 'on' : '') + (on && p.isNew ? ' cool' : '') + '"></i>';   // 신세대관 전구는 차가운 빛
    }).join('');
    var n = store.stamps.length, all = D.pavilions.length;
    var msg = done
      ? '전 관 점등 · 수첩에 할인권이 나왔습니다'
      : (n === 0 ? '관에 들어갔다 나오면 그 관에 불이 들어옵니다' : '불 켜진 관 ' + n + ' / ' + all + ' · 여섯 관이 다 밝아지면 할인권');
    $('#litCount').innerHTML = '<span class="bulbs" aria-hidden="true">' + bulbs + '</span><span>' + msg + '</span>';
  }

  // 방금 불이 들어온 관 — 지도로 돌아왔을 때 그 명패만 한 번 깜빡이며 켜짐
  var justLit = null;
  function playSwitchOn() {
    if (!justLit || REDUCED) { justLit = null; return; }
    var el = $('.pav[data-hall="' + justLit + '"]');
    justLit = null;
    if (!el) return;
    el.classList.remove('just-lit');
    void el.offsetWidth;                 // 같은 움직임을 다시 틀기 위한 한 줄 (브라우저가 처음부터 다시 그리게)
    el.classList.add('just-lit');
    setTimeout(function () { el.classList.remove('just-lit'); }, 1200);
  }

  // 수첩 펼치기 / 접기
  function setPassport(open) {
    $('#passport').hidden = !open;
    $('#passBtn').setAttribute('aria-expanded', String(open));
  }

  // 도장 찍기: 처음 들어간 관일 때만. 찍히는 순간을 2.2초 보여 주고 접음
  var foldTimer = null;
  function stamp(id) {
    if (store.stamps.indexOf(id) > -1) return;
    store.stamps.push(id);
    save();
    justLit = id;                        // 지도로 돌아가면 이 관에 불이 들어오는 순간을 보여 줌
    drawPassport(id);
    setPassport(true);
    clearTimeout(foldTimer);
    foldTimer = setTimeout(function () { setPassport(false); }, 2200);
  }

  // 겉표지 버튼
  $('#passBtn').addEventListener('click', function () {
    clearTimeout(foldTimer);
    setPassport($('#passport').hidden);
  });
  // 수첩 비우기 (발표 · 시연용) — 도장이 지워지고 지도의 불도 모두 꺼짐
  $('#passReset').addEventListener('click', function () {
    // 발표 · 시연 때 처음 상태로: 관 도장 · 자료실 놀이 · 오늘 개찰 기록을 모두 지우고 새로 불러옴
    store = { stamps: [], ticket: '', ticketType: '', plays: {} };
    save();
    location.hash = 'map';
    location.reload();
  });
  // Esc 로 수첩 접기
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setPassport(false); });


  /* =======================================================================
     ⑨ 주소(#)에 따라 화면 바꾸기
        #map → 회장안내도 / #tree → 족보 / #hall/관id → 관 내부
        (뒤로 가기 버튼도 그대로 작동)
     ======================================================================= */
  function go(view) { location.hash = view; }

  function route() {
    var h = location.hash.replace(/^#/, '') || 'map';
    var parts = h.split('/');
    var view = parts[0];

    // #p1 · #p2 · #p3 는 '처음 화면(map)' 안의 한 부분 → map 을 보여 주고 그 부로 내려감
    var part = /^p[123]$/.test(view) ? view : null;
    if (part) view = 'map';

    // 세 보기 중 하나만 보이게
    $('#view-map').hidden  = view !== 'map';
    $('#view-tree').hidden = view !== 'tree';
    $('#view-hall').hidden = view !== 'hall';

    // 위 메뉴 · 관 목차에 '지금 여기' 표시
    $$('[data-nav]').forEach(function (a) {
      if (a.dataset.nav === (part || view)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $$('.hall-tab').forEach(function (a) {
      if (view === 'hall' && a.dataset.hall === parts[1]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    if (view === 'hall') {
      var target = pendingWork;          // 색인 · 족보에서 고른 작품 (없으면 null)
      pendingWork = null;
      openHall(parts[1], target);
      // 작품을 고르지 않고 들어왔으면 관 목차 띠가 화면 위에 오도록
      // (작품을 골랐으면 openHall 이 그 작품까지 내려감)
      if (!target) $('#halls').scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
    } else if (view === 'map') {
      playSwitchOn();                    // 방금 다녀온 관이 있으면 그 관 불 켜기
      if (part) {                        // 부 목차를 눌렀으면 그 부로
        setTimeout(function () { document.getElementById(part).scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' }); }, 30);
      }
    } else if (view !== 'map' && view !== 'tree') {
      go('map');   // 모르는 주소면 회장안내도로
    }
  }
  window.addEventListener('hashchange', route);


  /* =======================================================================
     ⑪ 第一部 박람회 소개 — 숫자 넷 + 해설 문단
     ======================================================================= */
  function drawIntro() {
    var I = D.intro;
    // 숫자: 큰 숫자 + 단위 + 작은 설명
    $('#facts').innerHTML = I.facts.map(function (f) {
      return '<li><b>' + esc(f.num) + '<small>' + esc(f.unit) + '</small></b><span>' + esc(f.label) + '</span></li>';
    }).join('');
    // 해설: 첫 글자를 크게 (옛 신문의 머리글자)
    $('#introText').innerHTML = I.text.map(function (t, i) {
      return '<p' + (i === 0 ? ' class="dropcap"' : '') + '>' + esc(t) + '</p>';
    }).join('');
    $('#introSrc').textContent = I.src;
  }


  /* =======================================================================
     ⑫ 第二部 자료실 — 공통
     ======================================================================= */

  // <img data-ex="파일이름"> → assets/expo/파일이름 으로 사진을 채움 (layout 처럼 '../' 로 시작하면 assets 바로 아래)
  function fillExpoImages(root) {
    $$('img[data-ex]', root).forEach(function (img) {
      img.src = C.expoDir + img.dataset.ex;
      img.onerror = function () { img.closest('figure, .play, div').classList.add('noimg'); };
    });
  }

  // 자료실 놀이 다섯 가지 — 머리띠의 진행 칸
  var PLAYS = [
    { id: 'leaflet', ko: '펼치기' },
    { id: 'seek',    ko: '찾기' },
    { id: 'notice',  ko: '읽기' },
    { id: 'light',   ko: '켜기' },
    { id: 'drawer',  ko: '서랍' }
  ];
  // 놀이 하나가 끝났는지
  function playDone(id) {
    var P = store.plays;
    if (id === 'seek')   return (P.seek || []).length >= D.play.seek.length;
    if (id === 'notice') return (P.notice || []).length >= D.play.notice.length;
    if (id === 'drawer') return (P.drawer || []).length >= D.play.drawer.length;
    return !!P[id];
  }
  // 진행 칸 다시 그리기: 끝낸 놀이는 쪽빛 印
  function drawPlayMarks() {
    $('#playMarks').innerHTML = PLAYS.map(function (p) {
      var on = playDone(p.id);
      return '<li class="' + (on ? 'on' : '') + '"><span aria-hidden="true">' + (on ? '印' : '') + '</span>' + p.ko + '</li>';
    }).join('');
  }
  // 놀이 진행을 기억하고 진행 칸 갱신
  function savePlay() { save(); drawPlayMarks(); }

  // 확대경: 사진 위에서 마우스를 움직이면 둥근 렌즈 안에 2.6배 확대해 보여 줌 (메인 백백교 칸의 확대경과 같은 생각)
  function attachLens(box) {
    var lens = $('.lens', box);
    var img = $('img', box);
    if (!lens || !img) return;
    var Z = 2.6;
    function move(e) {
      var r = box.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { lens.style.opacity = 0; return; }
      lens.style.opacity = 1;
      lens.style.left = x + 'px';
      lens.style.top = y + 'px';
      lens.style.backgroundImage = 'url("' + img.currentSrc + '")';
      lens.style.backgroundSize = (r.width * Z) + 'px ' + (r.height * Z) + 'px';
      var half = lens.offsetWidth / 2;
      lens.style.backgroundPosition = (-(x * Z - half)) + 'px ' + (-(y * Z - half)) + 'px';
    }
    box.addEventListener('mousemove', move);
    box.addEventListener('mouseleave', function () { lens.style.opacity = 0; });
  }


  /* =======================================================================
     ⑬ 놀이 2 — 조감도 숨은 그림 찾기
     · 조감도를 누른 자리가 찾을 것의 반경(r%) 안이면 '찾음'
     · 찾은 자리에 먹선 동그라미 + 이름표, 아래 목록에 줄이 그어짐
     ======================================================================= */
  function setupSeek() {
    var map = $('#seekMap');
    var list = $('#seekList');
    var note = $('#seekNote');
    var found = store.plays.seek || [];

    // 찾을 것 목록
    function drawList() {
      list.innerHTML = D.play.seek.map(function (t) {
        var ok = found.indexOf(t.id) > -1;
        return '<li class="' + (ok ? 'ok' : '') + '">' + esc(t.ko) + '</li>';
      }).join('');
      if (found.length >= D.play.seek.length) note.textContent = '다섯 가지를 모두 찾았습니다. 그림 한 장에 도시 하나가 통째로 들어 있습니다.';
    }
    // 찾은 자리 표시
    function mark(t) {
      var m = document.createElement('span');
      m.className = 'found';
      m.style.left = t.x + '%';
      m.style.top = t.y + '%';
      m.innerHTML = '<i></i><em>' + esc(t.ko) + '</em>';
      map.appendChild(m);
    }
    found.forEach(function (id) { mark(D.play.seek.filter(function (t) { return t.id === id; })[0]); });

    map.addEventListener('click', function (e) {
      var r = map.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width * 100;     // 누른 자리 %
      var py = (e.clientY - r.top) / r.height * 100;
      // 가로 · 세로 비율이 달라서 세로 거리는 화면 비율만큼 보정
      var ratio = r.height / r.width;
      var hit = D.play.seek.filter(function (t) {
        var dx = px - t.x, dy = (py - t.y) * ratio;
        return Math.sqrt(dx * dx + dy * dy) <= t.r && found.indexOf(t.id) < 0;
      })[0];
      if (!hit) { note.textContent = '그 자리에는 없습니다. 확대경으로 더 가까이 보세요.'; return; }
      found.push(hit.id);
      store.plays.seek = found;
      savePlay();
      mark(hit);
      note.textContent = hit.ko + ' — ' + hit.found;
      drawList();
    });
    drawList();
    attachLens(map);
  }


  /* =======================================================================
     ⑭ 놀이 3 — 옛 안내문 읽기
     · 안내문 단락마다 동그란 표시. 누르면 오른쪽에 현대어 풀이
     · 읽은 표시는 속이 채워짐
     ======================================================================= */
  function setupNotice() {
    var box = $('#notice');
    var read = store.plays.notice || [];

    D.play.notice.forEach(function (n, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'spot' + (read.indexOf(n.id) > -1 ? ' read' : '');
      b.style.left = n.x + '%';
      b.style.top = n.y + '%';
      b.textContent = kanji(i + 1);                       // 一 二 三 …
      b.setAttribute('aria-label', n.title + ' 풀이 보기');
      b.addEventListener('click', function () {
        $$('.spot', box).forEach(function (s) { s.classList.remove('now'); });
        b.classList.add('now', 'read');
        $('#noticeTitle').textContent = n.title;
        $('#noticeBody').textContent = n.body;
        if (read.indexOf(n.id) < 0) { read.push(n.id); store.plays.notice = read; savePlay(); }
        $('#noticeCount').textContent = read.length + ' / ' + D.play.notice.length;
      });
      box.appendChild(b);
    });
    $('#noticeCount').textContent = read.length + ' / ' + D.play.notice.length;
  }


  /* =======================================================================
     ⑮ 놀이 1 · 4 · 5 — 리플렛 펼치기 · 남대문 불 켜기 · 포스터 표어
     ======================================================================= */

  // 리플렛: 0 접힌 표지 → 1 펼친 앞면 → 2 뒷면 조감도 → 다시 0
  var LEAFLET = [
    { btn: '펼치기',       text: '붉은 해를 등진 봉황이 그려진 표지. 접혀 있는 안내서를 한 단씩 펼쳐 보세요.' },
    { btn: '뒤집기',       text: '펼치면 경성의 명소 사진과 안내문이 병풍처럼 이어집니다. 박람회 구경 뒤에 들를 곳까지 알려 주는 관광 안내서입니다.' },
    { btn: '다시 접기',    text: '뒷면에는 경성 전체를 한 장에 담은 조감도. 이 그림은 아래 「숨은 그림 찾기」에서 확대경으로 볼 수 있습니다.' }
  ];
  function setupLeaflet() {
    var lf = $('#leaflet'), btn = $('#leafletBtn'), txt = $('#leafletText');
    btn.addEventListener('click', function () {
      var step = (+lf.dataset.step + 1) % 3;
      lf.dataset.step = step;                       // CSS 가 이 숫자를 보고 사진을 바꿈
      btn.textContent = LEAFLET[step].btn;
      txt.textContent = LEAFLET[step].text;
      if (step === 2 && !store.plays.leaflet) { store.plays.leaflet = true; savePlay(); }
    });
  }

  // 남대문 불 켜기: 스위치를 올리면 사진이 어둠에서 밝아짐
  function setupLight() {
    var sw = $('#lightSwitch'), ng = $('#nightGate'), txt = $('#lightText');
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      ng.classList.toggle('is-on', on);
      txt.textContent = on
        ? '지붕선과 문을 따라 늘어선 전구. 경성야록 회장안내도의 「불 켜지는 관」은 이 사진에서 왔습니다.'
        : '박람회 기간, 남대문은 밤마다 전구로 둘러졌습니다. 스위치를 올려 보세요.';
      if (on && !store.plays.light) { store.plays.light = true; savePlay(); }
    });
  }

  // 포스터 두 장 + 표어 표시 (마우스를 올리거나 누르면 풀이 말풍선)
  function setupPosters() {
    $('#posters').innerHTML = D.play.posters.map(function (p) {
      return '<figure class="poster-card">' +
               '<div class="pc-img"><img src="' + C.expoDir + p.img + '" alt="' + esc(p.title) + '">' +
                 p.spots.map(function (s) {
                   return '<button type="button" class="tip" style="left:' + s.x + '%;top:' + s.y + '%">' +
                            '<span class="tip-dot" aria-hidden="true"></span>' +
                            '<span class="tip-box"><b>' + esc(s.t) + '</b>' + esc(s.b) + '</span>' +
                          '</button>';
                 }).join('') +
               '</div>' +
               '<figcaption><b>' + esc(p.title) + '</b><span>' + esc(p.who) + '</span></figcaption>' +
             '</figure>';
    }).join('');
  }


  /* =======================================================================
     ⑯ 놀이 6 — 지도 서랍 · 활동사진
     · 서랍 손잡이를 누르면 그 지도가 꺼내짐 (확대경 사용 가능)
     · 네 서랍을 다 열면 놀이 끝
     ======================================================================= */
  function materialById(id) { return D.materials.filter(function (m) { return m.id === id; })[0]; }

  function setupDrawer() {
    var tabs = $('#drawerTabs');
    var opened = store.plays.drawer || [];
    tabs.innerHTML = D.play.drawer.map(function (id, i) {
      var m = materialById(id);
      return '<button type="button" role="tab" data-map="' + id + '" aria-selected="false">' +
               '<i>' + kanji(i + 1) + '</i>' + hj(m.title, m.titleHj) +
             '</button>';
    }).join('');

    function open(id) {
      var m = materialById(id);
      $$('[role="tab"]', tabs).forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.map === id)); });
      var box = $('#drawerMap');
      box.classList.remove('slide'); void box.offsetWidth; box.classList.add('slide');   // 서랍에서 꺼내는 움직임 다시 틀기
      // layout 은 기존 assets/expo-map.png 를 그대로 씀 ('../' 로 시작)
      $('#drawerImg').src = C.expoDir + m.img;
      $('#drawerImg').alt = m.title;
      $('#drawerTitle').innerHTML = hj(m.title, m.titleHj);
      $('#drawerWho').textContent = [m.date, m.maker].filter(Boolean).join(' · ');
      $('#drawerDesc').textContent = m.desc;
      $('#drawerLook').textContent = m.look;
      bindHanja($('#play-drawer'));
      if (opened.indexOf(id) < 0) { opened.push(id); store.plays.drawer = opened; savePlay(); }
    }
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-map]');
      if (b) open(b.dataset.map);
    });
    // 처음엔 첫 서랍이 열린 채로 — 단, 진행에는 세지 않으려고 직접 그림만
    var first = materialById(D.play.drawer[0]);
    $('#drawerImg').src = C.expoDir + first.img;
    $('#drawerTitle').innerHTML = hj(first.title, first.titleHj);
    $('#drawerWho').textContent = [first.date, first.maker].filter(Boolean).join(' · ');
    $('#drawerDesc').textContent = first.desc;
    $('#drawerLook').textContent = '서랍 손잡이를 눌러 지도를 하나씩 꺼내 보세요. 네 장을 다 열면 印.';
    tabs.firstElementChild.setAttribute('aria-selected', 'true');
    attachLens($('#drawerMap'));

    // 활동사진 링크
    var film = materialById('film');
    $('#filmStrip').href = film.link;
  }

  function setupMaterials() {
    fillExpoImages(document);
    drawIntro();
    drawPlayMarks();
    setupLeaflet();
    setupSeek();
    setupNotice();
    setupLight();
    setupPosters();
    setupDrawer();
  }


  /* =======================================================================
     ⑩ 시작 — 그리는 순서: 칸 채우기 → 한자 전환 → 수첩 → 주소 → 입구
     ======================================================================= */
  setupMaterials();          // 第一部 · 第二部 (새로 더한 부분)
  drawHallTabs();
  drawMap();
  drawIndex();
  drawGuide();
  drawTrees();
  bindHanja(document);      // 위에서 그린 글자 전부 한글로 바꾸고 마우스 반응 달기
  drawPassport();
  drawTicketState();
  route();
  setupGate();

})();
