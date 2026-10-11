/* =========================================================================
   경성야록 부록 — 京城事件博覽會
   ▶ expo.js : 동작
   -------------------------------------------------------------------------
   내용(글 · 사진 이름 · 관 · 작품)은 전부 expo-data.js 에 있습니다.
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
   ========================================================================= */

(function () {
  'use strict';   // 오타 같은 실수를 브라우저가 바로 알려 주도록


  /* =======================================================================
     ① 준비: 데이터 꺼내기 · 작은 도구들
     ======================================================================= */

  // expo-data.js 가 window.EXPO 에 넣어 둔 데이터
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
  var store = { stamps: [], ticket: '' };
  try {
    var saved = JSON.parse(localStorage.getItem(C.storageKey) || 'null');
    if (saved && Array.isArray(saved.stamps)) store = saved;
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
    var ticket = $('#ticket');
    var now = new Date();

    // 뒤 포스터: 사진이 있을 때만 깔림
    var probe = new Image();
    loadImg(probe, 'expo-poster');
    probe.onload = function () { $('#gatePoster').style.backgroundImage = 'url(' + probe.src + ')'; };

    // 개찰 도장 글자: 二〇二六年 / 十月 二日 / 改札
    var stamp = $('#dateStamp');
    stamp.innerHTML = yearKanji(now.getFullYear()) + '年<br>' + kanji(now.getMonth() + 1) + '月 ' + kanji(now.getDate()) + '日<br>改札';
    // 화면 읽기 프로그램에는 한글 날짜로
    stamp.setAttribute('aria-label', now.getFullYear() + '년 ' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일 개찰');

    // 입구 닫고 지면 열기
    function enter(punched) {
      gate.classList.add('is-open');
      document.body.style.overflow = '';
      if (punched) { store.ticket = todayKey(); save(); }   // 오늘 개찰했다고 기억
      drawTicketState();
      // 입구가 사라진 뒤 키보드 위치를 지면 첫 메뉴로
      setTimeout(function () { gate.setAttribute('hidden', ''); }, REDUCED ? 0 : 900);
    }

    // 오늘 이미 개찰했으면 입구 없이 바로
    if (store.ticket === todayKey()) { gate.setAttribute('hidden', ''); return; }

    // 입구가 떠 있는 동안 뒤 지면이 스크롤되지 않게
    document.body.style.overflow = 'hidden';

    // '개찰하고 입장' — 구멍(0초) → 반권 찢김(0.65초) → 입장(1.5초)
    $('#punchBtn').addEventListener('click', function () {
      ticket.classList.add('is-punched');
      if (REDUCED) { enter(true); return; }
      setTimeout(function () { ticket.classList.add('is-torn'); }, 650);
      setTimeout(function () { enter(true); }, 1500);
    });
    // '개찰 없이 둘러보기'
    $('#skipBtn').addEventListener('click', function () { enter(false); });
  }

  // 제호 오른쪽 '입장권 개찰 전 / 개찰 완료' 글자
  function drawTicketState() {
    $('#mTicket').textContent = store.ticket === todayKey() ? '오늘 입장권 개찰 완료' : '입장권 개찰 전';
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
    store.stamps = [];
    save();
    drawPassport();
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

    // 세 보기 중 하나만 보이게
    $('#view-map').hidden  = view !== 'map';
    $('#view-tree').hidden = view !== 'tree';
    $('#view-hall').hidden = view !== 'hall';

    // 위 메뉴 · 관 목차에 '지금 여기' 표시
    $$('[data-nav]').forEach(function (a) {
      if (a.dataset.nav === view) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
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
    } else if (view !== 'map' && view !== 'tree') {
      go('map');   // 모르는 주소면 회장안내도로
    }
  }
  window.addEventListener('hashchange', route);


  /* =======================================================================
     ⑩ 시작 — 그리는 순서: 칸 채우기 → 한자 전환 → 수첩 → 주소 → 입구
     ======================================================================= */
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
