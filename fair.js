/* =========================================================================
   경성야록 부록 — 경성사건박람회 '회장 거리'
   ▶ fair.js : 동작
   -------------------------------------------------------------------------
   목차
     ① 준비 (데이터 · 작은 도구 · 기억)
     ② 글 바꾸기 — 당시 말투 ↔ 현대어 (메인과 같은 약속)
     ③ 건물 그림 (정문 · 안내소 · 네 관 · 게시판 · 출구)
     ④ 전구 찍기 — 건물 윤곽선을 따라 전구를 늘어놓음
     ⑤ 거리 세우기 — 건물들을 한 줄로 늘어세움
     ⑥ 걷기 — 아래로 굴리면 오른쪽으로 걸어감 (먼 풍경 · 가로등은 다른 빠르기로)
     ⑦ 관 안 — 어두운 진열실
     ⑧ 불 켜진 관 · 거리 지도 (아래 띠)
     ⑨ 소리 — 오래된 전선의 웅웅거림 (누르면 켜짐)
     ⑩ 입장 장면 — 깜깜한 데서 동그랗게 열림
     ⑪ 시작
   ========================================================================= */
(function () {
  'use strict';

  /* ── ① 준비 ───────────────────────────────────────────── */
  var F = window.FAIR, C = F.config;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // 글 한 토막: 화면엔 당시 말투(old), 마우스를 올리면 현대어(now)
  function T(o) { return '<span class="hj" data-ko="' + esc(o.now) + '">' + esc(o.old) + '</span>'; }
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NUMW = ['', '한', '두', '세', '네', '다섯', '여섯', '닐곱', '여덟', '아홉', '열', '열한', '열두'];          // 당시 말투 숫자

  // 기억: 다녀간 관 (메인 부록 칸 · 기존 박람회 페이지와 같은 이름 · 같은 모양)
  var store = { stamps: [], ticket: '', ticketType: '', plays: {} };
  try { var sv = JSON.parse(localStorage.getItem(C.storageKey) || 'null'); if (sv && Array.isArray(sv.stamps)) store = sv; } catch (e) {}
  function save() { try { localStorage.setItem(C.storageKey, JSON.stringify(store)); } catch (e) {} }
  function visited(id) { return store.stamps.indexOf(id) > -1; }


  /* ── ② 글 바꾸기: 화면에 새로 그린 뒤 이 함수를 부르면 마우스 반응이 붙음 ── */
  function bindSwap(root) {
    $$('.hj', root).forEach(function (el) {
      if (el._sw || !el.dataset.ko) return;
      el._sw = true;
      var old = el.textContent, now = el.dataset.ko;
      var host = el.closest('button, a') || el;
      if (host === el) el.tabIndex = 0;
      function on() { el.textContent = now; el.classList.add('gloss'); }
      function off() { el.textContent = old; el.classList.remove('gloss'); }
      host.addEventListener('mouseenter', on); host.addEventListener('mouseleave', off);
      host.addEventListener('focus', function () { if (host.matches(':focus-visible')) on(); });
      host.addEventListener('blur', off);
      // 손가락 화면(마우스 없음): 글자를 누르면 바뀌고, 다시 누르면 돌아옴 (버튼 · 링크 안의 글자는 제외)
      if (host === el && TOUCH) el.addEventListener('click', function () { if (el.classList.contains('gloss')) off(); else on(); });
    });
  }
  var TOUCH = window.matchMedia && matchMedia('(hover: none)').matches;


  /* ── ③ 건물 그림 ─────────────────────────────────────────
     body  : 어두운 건물 몸 (채운 모양)
     bulbs : 전구를 늘어놓을 윤곽선 (fair.js ④ 가 이 선을 따라 전구를 찍음)
     sign  : 간판(현판)이 걸리는 높이 — 건물 그림 위에서부터 %
     모든 그림은 가로 320 · 세로 300 칸에 그림 (땅 = 300) */
  var FACADES = {
    // 문학관: 박공지붕 + 기둥 — 1929 직영관 같은 서양식
    classic: { sign: '38%', body: '<path d="M30 120 L160 60 L290 120 Z"/><rect x="40" y="120" width="240" height="150"/><rect x="20" y="270" width="280" height="30"/>' +
                     '<g class="dim"><rect x="62" y="130" width="12" height="140"/><rect x="104" y="130" width="12" height="140"/><rect x="204" y="130" width="12" height="140"/><rect x="246" y="130" width="12" height="140"/></g>' +
                     '<rect class="door" x="138" y="196" width="44" height="74"/>',
               bulbs: ['M30 120 L160 60 L290 120', 'M40 120 V270', 'M280 120 V270', 'M20 270 H300'] },
    // 활동사진관: 계단식 탑 + 둥근 창 — 활동사진 필름 통 같은 창
    deco:    { sign: '60%', body: '<rect x="50" y="140" width="220" height="160"/><path d="M130 300 V60 H140 V40 H180 V60 H190 V300 Z"/>' +
                     '<circle class="win" cx="160" cy="112" r="22"/><rect class="door" x="140" y="230" width="40" height="70"/>',
               bulbs: ['M130 140 V60 H140 V40 H180 V60 H190 V140', 'M50 300 V140 H270 V300', 'M182 112 A22 22 0 1 1 182 111.9'] },
    // 창가관: 둥근 지붕(돔) + 깃대
    dome:    { sign: '64%', body: '<path d="M80 150 Q160 40 240 150 Z"/><rect x="80" y="150" width="160" height="150"/><path class="dim" d="M160 66 V34 M160 34 L184 42 L160 50"/>' +
                     '<rect class="door" x="140" y="226" width="40" height="74"/>',
               bulbs: ['M80 150 Q160 40 240 150', 'M80 150 V300', 'M240 150 V300', 'M160 66 V34'] },
    // 무대관: 큰 아치(무대 입구) + 양쪽 뾰족탑
    theater: { sign: '46%', body: '<rect x="60" y="110" width="200" height="190"/><path d="M50 300 V90 L65 60 L80 90 V300 Z"/><path d="M240 300 V90 L255 60 L270 90 V300 Z"/>' +
                     '<path class="door" d="M110 300 V190 Q160 130 210 190 V300 Z"/>',
               bulbs: ['M110 300 V190 Q160 130 210 190 V300', 'M60 110 H260', 'M50 90 L65 60 L80 90', 'M240 90 L255 60 L270 90'] },
    // 미술관: 기와 지붕 두 겹 (경회루 같은 우리 집)
    hanok:   { sign: '62%', body: '<path d="M90 120 Q110 100 125 88 H195 Q210 100 230 120 Z"/><path d="M30 150 Q60 140 80 120 H240 Q260 140 290 150 Z"/><rect x="70" y="150" width="180" height="150"/>' +
                     '<g class="dim"><rect x="88" y="150" width="8" height="150"/><rect x="224" y="150" width="8" height="150"/></g><rect class="door" x="136" y="210" width="48" height="90"/>',
               bulbs: ['M30 150 Q60 140 80 120 H240 Q260 140 290 150', 'M90 120 Q110 100 125 88 H195 Q210 100 230 120'] },
    // 신세대관: 장식 없는 상자 + 세로로 긴 창들 (2026의 차가운 빛이 새어 나옴)
    future:  { sign: '42%', body: '<rect x="70" y="100" width="180" height="200"/>' +
                     '<g class="slit"><rect x="92" y="124" width="10" height="150"/><rect x="122" y="124" width="10" height="150"/><rect x="155" y="124" width="10" height="150"/><rect x="188" y="124" width="10" height="150"/><rect x="218" y="124" width="10" height="150"/></g>',
               bulbs: ['M70 300 V100 H250 V300'] }
  };
  // 정문 (메인 전환 장면의 정문과 같은 윤곽) — 가로 400 · 세로 220
  var GATE = ['M100 80 Q118 76 128 68 Q200 44 272 68 Q282 76 300 80', 'M142 80 V102 H258 V80',
              'M66 114 Q88 110 102 102 Q200 82 298 102 Q312 110 334 114', 'M92 118 V204 H308 V118', 'M176 204 V164 Q200 136 224 164 V204'];


  /* ── ④ 전구 찍기: svg 안 [data-bulbs] 선들을 따라 STEP 간격으로 동그라미 ── */
  function placeBulbs(svg, step) {
    var g = svg.querySelector('.bulbs'), NS = 'http://www.w3.org/2000/svg';
    $$('[data-bulb-path]', svg).forEach(function (p) {
      var L = p.getTotalLength();
      for (var d = 0; d <= L; d += step) {
        var pt = p.getPointAtLength(d), c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1)); c.setAttribute('r', '2.6');
        var r = Math.random();
        if (r < .06) c.setAttribute('class', 'dead');          // 6%: 끝내 안 켜지는 전구 (빈자리)
        else if (r > .93) c.setAttribute('class', 'flick');    // 7%: 켜져도 떨리는 전구
        c.style.setProperty('--d', (d / L * .9 + Math.random() * .25).toFixed(2) + 's');   // 켜지는 순서
        g.appendChild(c);
      }
    });
  }
  function bulbsSVG(paths) {
    return '<g class="bulb-paths" fill="none">' + paths.map(function (d) { return '<path data-bulb-path d="' + d + '"/>'; }).join('') + '</g><g class="bulbs"></g>';
  }


  /* ── ⑤ 거리 세우기 ─────────────────────────────────────── */
  var STOPS = [];                                   // [{id, el, label}] 거리 순서
  function worksIn(id) { return F.works.filter(function (w) { return w.hall === id; }).sort(function (a, b) { return a.year - b.year; }); }

  function buildStreet() {
    var track = $('#track'), html = [];

    // 정문
    html.push('<section class="stop gate-stop" data-stop="gate">' +
      '<div class="gate-art"><img class="mj" src="' + C.assetDir + 'mj-gate.jpg" alt="" onload="this.parentNode.classList.add(\'has-mj\')" onerror="if(this.src.slice(-4)===\'.jpg\'){this.src=this.src.slice(0,-4)+\'.png\'}else{this.remove()}">' +   // 미드저니 정문 그림 자리
      '<svg viewBox="0 0 400 220" class="lights">' + bulbsSVG(GATE) + '</svg>' +
      '<p class="gate-sign">' + T({ old: '경성사건박람회', now: '경성사건박람회' }) + '</p></div>' +
      '<p class="gate-stamp" id="gateStamp" hidden>' + T({ old: '입장권 개찰하엿소', now: '입장권 확인 완료' }) + '</p>' +
      '<p class="gate-note">' + T({ old: '폐장한 지 오래인 회장에 오늘 밤 다시 불이 드러오오.', now: '오래전 문을 닫은 박람회장에 오늘 밤 다시 불이 켜집니다.' }) + '</p>' +
      '</section>');
    STOPS.push({ id: 'gate', label: { old: '정문', now: '정문' } });

    // 안내소 (1929 실물 자료 → 기존 자료실)
    html.push('<section class="stop info-stop" data-stop="info">' +
      '<div class="kiosk"><span class="kiosk-roof"></span>' +
      '<div class="pins"><img src="' + C.assetDir + 'ex-poster-bw.png" alt=""><img src="' + C.assetDir + 'ex-leaflet-cover.jpg" alt=""><img src="' + C.assetDir + 'ex-notice.png" alt=""></div>' +
      '<span class="kiosk-sign">' + T({ old: '안내소', now: '안내소' }) + '</span></div>' +
      board({ old: '안내소', now: '안내소' }, { old: '소화 사 년 조선박람회 안내', now: '1929년 조선박람회 안내' },
            { old: '진짜 박람회의 입장권 · 입장료 · 안내문 · 조감도를 보시오', now: '실제 박람회의 입장권 · 입장료 · 안내문 · 조감도를 보세요' }, null, { old: '드러가기', now: '들어가기' }, 'info') +
      '</section>');
    STOPS.push({ id: 'info', label: { old: '안내소', now: '안내소' } });

    // 네 관 (문학 · 창가 · 무대 · 미술)
    F.halls.forEach(function (h) {
      var f = FACADES[h.look], n = worksIn(h.id).length;
      html.push('<section class="stop hall-stop' + (h.isNew ? ' is-new' : '') + '" data-stop="' + h.id + '" data-hall="' + h.id + '">' +
        '<div class="facade"><span class="sign" style="top:' + f.sign + '">' + T(h.name) + '</span>' +
        // 미드저니 그림 자리: assets/expo/mj-pav-관id.png 를 넣으면 코드 그림 대신 그 그림이 섬 (검은 바탕 그림이면 밤에 자연스럽게 녹아듦)
        '<img class="mj" src="' + C.assetDir + 'mj-pav-' + h.id + '.png" alt="" onload="this.parentNode.classList.add(\'has-mj\')" onerror="this.remove()">' +   // 바탕을 투명하게 빼 둔 .png (없으면 코드 그림)
        '<svg viewBox="0 0 320 300" class="lights"><g class="body">' + f.body + '</g>' + bulbsSVG(f.bulbs) + '</svg></div>' +
        board(h.name, h.kind,
              n ? { old: '진열품 ' + (NUMW[n] || (['', '열', '스물', '설흔', '마흔'][Math.floor(n / 10)] + (['', '한', '두', '세', '네', '다섯', '여섯', '닐곱', '여덟', '아홉'][n % 10]))) + ' 점이 노혀 잇소', now: '작품 ' + n + '점 진열' } : { old: '아즉 진열 준비 중이오', now: '진열 준비 중' },
              null, { old: '드러가기', now: '들어가기' }, h.id) +
        '</section>');
      STOPS.push({ id: h.id, label: h.name });
    });

    // 게시판 (사건 족보)
    html.push('<section class="stop tree-stop" data-stop="tree">' +
      '<div class="notice-board"><span class="nb-title">' + T({ old: '게시판', now: '게시판' }) + '</span>' +
      '<div class="nb-papers">' + ['윤심덕 · 김우진', '마리아 참살', '죽첨정', '손긔정 말소', '백백교'].map(function (t, i) {
        return '<span style="--r:' + ((i % 2 ? 1 : -1) * (2 + i)) + 'deg">' + t + '</span>'; }).join('') + '</div></div>' +
      board({ old: '사건 족보', now: '사건 족보' }, { old: '사건 → 작품', now: '사건 → 작품' },
            { old: '사건이 어느 작품으로 니어졋는지 족보로 보시오', now: '사건이 어떤 작품으로 이어졌는지 족보로 보세요' }, C.treePage, { old: '족보 보기', now: '족보 보기' }) +
      '</section>');
    STOPS.push({ id: 'tree', label: { old: '게시판', now: '게시판' } });

    // 출구
    html.push('<section class="stop exit-stop" data-stop="exit">' +
      '<div class="exit-gate"><span>' + T({ old: '출구', now: '출구' }) + '</span></div>' +
      board({ old: '출구', now: '출구' }, { old: '첫닭 울기 전에', now: '새벽이 오기 전에' },
            { old: '본지로 도라가 다른 사건도 보시오', now: '본지로 돌아가 다른 사건도 보세요' }, C.mainPage, { old: '본지로 도라가기', now: '본지로 돌아가기' }) +
      '</section>');
    STOPS.push({ id: 'exit', label: { old: '출구', now: '출구' } });

    track.innerHTML = html.join('');

    // 전구 찍기 (정문은 촘촘히, 건물은 조금 성기게)
    $$('svg.lights', track).forEach(function (svg) { placeBulbs(svg, svg.closest('.gate-stop') ? 9 : 11); });
    // 정문은 처음부터 켜짐 (입장한 순간)
    $('.gate-stop').classList.add('on');
    // 다녀간 관은 켜진 채로
    $$('.hall-stop', track).forEach(function (s) { if (visited(s.dataset.hall)) s.classList.add('on'); });

    // 입간판 버튼: 관이면 관 안 열기, 아니면 그 페이지로
    track.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (!b) return;
      if (b.dataset.open === 'info') openInfo(); else openHall(b.dataset.open);
    });
  }

  // 입간판 (관 앞에 세워 둔 나무 판)
  function board(title, kind, line, href, btn, hallId) {
    var go = hallId
      ? '<button type="button" class="b-go" data-open="' + hallId + '">' + T(btn) + '</button>'
      : '<a class="b-go" href="' + href + '">' + T(btn) + '</a>';
    return '<div class="board"><b>' + T(title) + '</b><small>' + T(kind) + '</small><p>' + T(line) + '</p>' + go + '<i class="leg"></i></div>';
  }


  /* ── ⑥ 걷기 ─────────────────────────────────────────────
     · 페이지 높이를 '거리 길이'만큼 늘려 두고, 굴린 만큼 거리(track)를 왼쪽으로 밀어 앞으로 걷는 것처럼
     · 먼 풍경은 0.12배, 가로등은 1.4배 빠르기 → 깊이가 생김
     · 바로 따라가지 않고 조금 늦게 따라가 '걷는' 느낌 (REDUCED 면 바로) */
  var trackW = 0, maxX = 0, curX = 0, goalX = 0;
  function layout() {
    var vw = window.innerWidth, stopW = Math.max(vw * .62, 560);
    if (vw < 700) stopW = vw * .92;
    $$('.stop').forEach(function (s, i) { s.style.left = (vw * .2 + i * stopW) + 'px'; s.style.width = stopW + 'px'; });
    trackW = vw * .2 + STOPS.length * stopW + vw * .2;
    $('#track').style.width = trackW + 'px';
    maxX = Math.max(0, trackW - vw);
    $('#walk').style.height = (maxX + window.innerHeight) + 'px';    // 굴릴 수 있는 길이 = 걸을 수 있는 길이
    STOPS.forEach(function (s, i) { s.x = Math.max(0, Math.min(maxX, vw * .2 + i * stopW + stopW / 2 - vw / 2)); });
    buildNear();
    onScroll();
  }
  function onScroll() { goalX = Math.min(maxX, Math.max(0, window.scrollY)); }
  function frame() {
    curX += (goalX - curX) * (REDUCED ? 1 : .12);
    if (Math.abs(goalX - curX) < .3) curX = goalX;
    $('#track').style.transform = 'translate3d(' + (-curX) + 'px,0,0)';
    $('#near').style.transform = 'translate3d(' + (-curX * 1.4) + 'px,0,0)';
    $('#far').style.transform = 'translate3d(' + (-curX * .12) + 'px,0,0)';
    updateWhere();
    requestAnimationFrame(frame);
  }
  // 가까운 가로등 줄: 일정 간격으로 세우고, 다섯에 하나는 떨리는 등
  function buildNear() {
    var near = $('#near'), vw = window.innerWidth, gap = Math.max(vw * .55, 420), n = Math.ceil(trackW * 1.45 / gap) + 2, h = '';
    for (var i = 0; i < n; i++) h += '<i class="lamp' + (i % 5 === 3 ? ' flick' : '') + '" style="left:' + (i * gap + gap * .5) + 'px"></i>';
    near.innerHTML = h;
    near.style.width = (n * gap) + 'px';
  }
  // 한 칸씩 걷기 (화살표 키 · 거리 지도)
  function goStop(i) {
    i = Math.max(0, Math.min(STOPS.length - 1, i));
    window.scrollTo({ top: STOPS[i].x, behavior: REDUCED ? 'auto' : 'smooth' });
  }
  function nearestStop() {
    var best = 0, d = Infinity;
    STOPS.forEach(function (s, i) { var k = Math.abs(s.x - curX); if (k < d) { d = k; best = i; } });
    return best;
  }
  document.addEventListener('keydown', function (e) {
    if (!$('#viewer').hidden) { if (e.key === 'Escape') $('#viewer').hidden = true; return; }
    if (!$('#hall').hidden) { if (e.key === 'Escape') { var rd = $('#reader'); if (rd && !rd.hidden) rd.hidden = true; else closeHall(); } return; }
    if (!$('#info').hidden) { if (e.key === 'Escape') closeInfo(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); goStop(nearestStop() + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goStop(nearestStop() - 1); }
  });


  /* ── ⑦ 관 안 ───────────────────────────────────────────── */
  var openId = null;
  function openHall(id) {
    var h = F.halls.filter(function (x) { return x.id === id; })[0];
    if (!h) return;
    openId = id;
    $('#hallName').innerHTML = T(h.name);
    $('#hallKind').innerHTML = T(h.kind);
    // 도슨트 한마디 + 숨은 이야기 (접힌 쪽지 — 누르면 펼쳐짐)
    $('#docent').innerHTML = h.docent
      ? '<p class="dc-say"><b>' + T({ old: '안내원', now: '도슨트' }) + '</b>' + T(h.docent) + '</p>' +
        (h.secret ? '<details class="dc-secret"><summary>' + T({ old: '숨은 이약이 펼치기', now: '숨은 이야기 펼치기' }) + '</summary><p>' + T(h.secret) + '</p></details>' : '')
      : '';
    var list = worksIn(id);
    // 관마다 다른 진열실 벽 (문학 · 음악 · 무대 — 미드저니 재현 그림), 나머지는 공용 벽
    var RM = { literature: 1, music: 1, stage: 1 }, hl = $('#hall');
    if (RM[id]) { hl.style.setProperty('--room', 'url("' + C.assetDir + 'mj-room-' + id + '.jpg")'); hl.classList.add('has-mj'); }
    else if (hl.dataset.room0) hl.style.setProperty('--room', hl.dataset.room0);
    $('#hall').hidden = false;
    document.documentElement.classList.add('in-hall');
    // 관마다 다른 꾸밈: 책장 · 축음기 · 극장 · 그림 벽 (⑦-3)
    ROOMS[h.room](list);
    bindSwap($('#hall'));
    $('#hallOut').focus();
  }
  function closeHall() {
    var au = $('#phonoAudio'); if (au) au.pause();   // 창가관에서 나가면 노래도 멈춤
    if (SP.ctl) try { SP.ctl.pause(); } catch (e) {}
    $('#viewer').hidden = true;
    $('#hall').hidden = true;
    document.documentElement.classList.remove('in-hall');
    // 다녀간 관에 불 켜기 (처음 다녀왔을 때만 깜빡이며 켜지는 순간을 보여 줌)
    if (openId && !visited(openId)) {
      store.stamps.push(openId); save();
      var s = $('.hall-stop[data-hall="' + openId + '"]');
      if (s) { s.classList.add('on', 'just'); setTimeout(function () { s.classList.remove('just'); }, 1600); }
      sound.tick(); drawLit();
    }
    var b = $('.hall-stop[data-hall="' + openId + '"] .b-go'); if (b) b.focus();
    openId = null;
  }
  $('#hallOut').addEventListener('click', closeHall);
  $('#hall').addEventListener('click', function (e) { if (e.target === $('#hall')) closeHall(); });

  /* ── ⑦-2 안내소: 1929년 조선박람회 실제 정보 ─────────────────
     탭 넷: 한눈에 · 입장권과 입장료 · 옛 안내문 읽기 · 실물 자료 */
  function openInfo() {
    var I = F.info, A = C.assetDir, box = $('#info');
    var tabs = [
      { id: 'glance', t: { old: '한눈에', now: '한눈에' } },
      { id: 'ticket', t: { old: '입장권과 입장료', now: '입장권과 입장료' } },
      { id: 'notice', t: { old: '녯 안내문 닑기', now: '옛 안내문 읽기' } },
      { id: 'things', t: { old: '실물 자료', now: '실물 자료' } }
    ];
    box.innerHTML =
      '<div class="hall-room">' +
        '<header class="hall-head"><h2 class="hall-name">' + T({ old: '안내소', now: '안내소' }) + '</h2>' +
        '<p class="hall-kind">' + T({ old: '소화 사 년 조선박람회 · 진짜 자료', now: '1929년 조선박람회 · 실제 자료' }) + '</p>' +
        '<button type="button" class="hall-out" id="infoOut">' + T({ old: '안내소 밧그로', now: '안내소 나가기' }) + '</button></header>' +
        '<nav class="i-tabs" role="tablist">' + tabs.map(function (t, i) { return '<button type="button" role="tab" data-tab="' + t.id + '" aria-selected="' + (i === 0) + '">' + T(t.t) + '</button>'; }).join('') + '</nav>' +
        // ① 한눈에
        '<section class="i-pane" data-pane="glance">' +
          '<ul class="i-facts">' + I.facts.map(function (f) { return '<li><b>' + f.num + '<small>' + T(f.unit) + '</small></b><span>' + T(f.label) + '</span></li>'; }).join('') + '</ul>' +
          '<div class="i-text">' + I.text.map(function (p) { return '<p>' + T(p) + '</p>'; }).join('') + '</div>' +
          '<p class="i-src">' + T(I.src) + '</p>' +
        '</section>' +
        // ② 입장권 · 입장료
        '<section class="i-pane" data-pane="ticket" hidden>' +
          '<div class="i-tickets">' + I.tickets.map(function (t) {
            return '<figure><img src="' + A + t.img + '" alt=""><figcaption><b>' + T(t.name) + '</b><em>' + T(t.price) + '</em><span>' + T(t.note) + '</span></figcaption></figure>'; }).join('') + '</div>' +
          '<h3 class="i-h">' + T({ old: '그때 입장료', now: '당시 입장료' }) + '</h3>' +
          '<dl class="i-fee">' + I.fee.map(function (f) { return '<dt>' + T(f.who) + '</dt><dd>' + T(f.price) + '</dd>'; }).join('') + '</dl>' +
        '</section>' +
        // ③ 옛 안내문 읽기
        '<section class="i-pane" data-pane="notice" hidden>' +
          '<div class="i-notice"><div class="nt-img"><img src="' + A + 'ex-notice.png" alt="조선박람회 안내문">' +
            I.notice.map(function (n, i) { return '<button type="button" class="nt-spot" style="left:' + n.x + '%;top:' + n.y + '%" data-n="' + i + '">' + (i + 1) + '</button>'; }).join('') +
          '</div><aside class="nt-read"><p class="nt-k">' + T({ old: '현대어 풀이', now: '현대어 풀이' }) + ' <span id="ntCount">0 / ' + I.notice.length + '</span></p>' +
          '<h3 id="ntT">' + T({ old: '동그라미를 누르시오', now: '동그라미를 누르세요' }) + '</h3><p id="ntB">' + T({ old: '박람회 구경꾼이 손에 쥐엇던 안내문이오. 단락마다 오늘 말로 풀어 드리리다.', now: '박람회 관람객이 손에 쥐었던 안내문입니다. 단락마다 오늘 말로 풀어 드립니다.' }) + '</p></aside></div>' +
        '</section>' +
        // ④ 실물 자료
        '<section class="i-pane" data-pane="things" hidden>' +
          '<div class="i-gallery">' + I.gallery.map(function (g, i) {
            return '<button type="button" class="ig" data-g="' + i + '"><img src="' + A + g.img + '" alt=""><b>' + T(g.t) + '</b><span>' + T(g.c) + '</span></button>'; }).join('') + '</div>' +
          
        '</section>' +
      '</div>';
    box.hidden = false;
    document.documentElement.classList.add('in-hall');
    bindSwap(box);
    // 탭 바꾸기
    $$('.i-tabs button', box).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.i-tabs button', box).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        $$('.i-pane', box).forEach(function (p) { p.hidden = p.dataset.pane !== b.dataset.tab; });
      });
    });
    // 옛 안내문: 동그라미 → 풀이
    var read = {};
    $$('.nt-spot', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = I.notice[+b.dataset.n];
        $$('.nt-spot', box).forEach(function (x) { x.classList.remove('now'); });
        b.classList.add('now', 'read'); read[b.dataset.n] = 1;
        $('#ntT').textContent = n.t; $('#ntB').textContent = n.b;
        $('#ntCount').textContent = Object.keys(read).length + ' / ' + I.notice.length;
      });
    });
    // 실물 자료: 누르면 큰 화면 + 현상 렌즈 (원래 색 보기)
    $$('.ig', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var g = I.gallery[+b.dataset.g];
        openViewer(A + g.img, g.t, '<h3>' + T(g.t) + '</h3><p class="cur">' + T(g.c) + '</p><p class="t-case">' + T({ old: '소화 사 년 조선박람회 실물 자료', now: '1929년 조선박람회 실물 자료' }) + '</p>');
      });
    });
    $('#infoOut').addEventListener('click', closeInfo);
    $('#infoOut').focus();
  }
  function closeInfo() {
    $('#info').hidden = true;
    document.documentElement.classList.remove('in-hall');
    var b = $('.info-stop .b-go'); if (b) b.focus();
  }
  $('#info').addEventListener('click', function (e) { if (e.target === $('#info')) closeInfo(); });

  /* ── ⑦-3 관 안 꾸밈 넷 ────────────────────────────────────
     사진 · 음원 자리: assets/expo/이름.jpg → 없으면 .png → 없으면 fail() (코드로 그린 틀이 대신 섬) */
  function slot(img, name, fail) {
    var tries = [C.assetDir + name + '.jpg', C.assetDir + name + '.png'], k = 0;
    img.onerror = function () { if (k < tries.length) img.src = tries[k++]; else if (fail) fail(); };
    img.onerror();
  }
  // 표찰에 공통으로 붙는 줄: 사건 · 문헌 표시 · 지면 링크 · 찾아보기
  function foot(w) {
    var c = w.case ? F.cases[w.case] : null;
    return (c ? '<p class="t-case">' + T({ old: '사건', now: '사건' }) + ' · ' + T(c) + '</p>' : '<p class="t-case">' + T({ old: '사건과 바로 닷지 안는 시대 자료', now: '사건과 직접 관계없는 시대 자료' }) + '</p>') +
      (w.verify ? '<p class="t-verify">' + T({ old: '다른 문헌에 의함', now: '다른 문헌 기준' }) + ' · 乙</p>' : '') +
      '<p class="t-go">' + (w.link ? '<a href="' + esc(w.link) + '" target="_blank" rel="noopener">' + T({ old: '차저보기', now: '찾아보기' }) + '</a>' : '') +
      (w.link && c ? ' · ' : '') + (c ? '<a href="' + C.caseLink(w.case) + '">' + T({ old: '이 작품이 태여난 지면', now: '이 작품이 태어난 지면' }) + '</a>' : '') + '</p>';
  }
  function meta(w) { return [w.genre, { old: String(w.year), now: String(w.year) }].concat(w.maker ? [w.maker] : []).map(T).join(' · '); }

  var ROOMS = {

    /* 문학관 — 책장에서 책을 뽑으면 두 쪽으로 펼쳐짐
       왼쪽: 처음 실린 지면 · 표지 사진 (cover 자리) / 오른쪽: 줄거리 · 핵심 문장 */
    shelf: function (list) {
      /* 문학관 — 표지가 보이게 세워 둔 책들 (표지 진열대)
         · 책마다 위에서 떨어지는 조명 한 줄기 + 아래 놋쇠 명판(제목 · 지은이 · 연도)
         · 사건 곁의 작가(aside)는 오른쪽 끝에 점선으로 나뉘어 따로
         · 누르면 두 쪽 책이 펼쳐짐: 왼쪽 표지(원래 색) / 오른쪽 작품 · 핵심 문장 · 이 작품이 그린 사건 */
      var room = $('#cases');
      room.className = 'cases room-shelf';
      list = list.filter(function (w) { return !w.aside; }).concat(list.filter(function (w) { return w.aside; }));
      room.innerHTML = '<div class="lit-wall">' + list.map(function (w, i) {
        return (w.aside ? '<span class="lit-div">' + T({ old: '사건 겨테 섯던 작가', now: '사건 곁의 작가' }) + '</span>' : '') +
          '<button type="button" class="bk' + (w.aside ? ' aside' : '') + '" data-i="' + i + '">' +
            '<span class="bk-light" aria-hidden="true"></span>' +
            '<span class="bk-cover"><img alt=""><span class="bk-fb"><b>' + T({ old: w.title.old.replace(/[!,.]/g, ''), now: w.title.now.replace(/[!,.]/g, '') }) + '</b></span></span>' +
            '<span class="bk-ledge" aria-hidden="true"></span>' +
            '<span class="bk-plaque"><b>' + T(w.title) + '</b><small>' + esc(w.maker ? w.maker.now : '') + ' · ' + w.year + '</small></span>' +
          '</button>';
      }).join('') + '</div>' +
      '<p class="room-hint">' + T({ old: '책을 누르면 펼처지오', now: '책을 누르면 펼쳐집니다' }) + '</p>' +
      '<div class="reader" id="reader" hidden></div>';
      bindSwap(room);
      $$('.bk', room).forEach(function (b) {
        var w = list[+b.dataset.i], img = $('.bk-cover img', b);
        img.onload = function () { b.classList.add('has-img'); };
        slot(img, w.cover);
      });
      room.querySelector('.lit-wall').addEventListener('click', function (e) {
        var b = e.target.closest('.bk'); if (b) openBook(+b.dataset.i);
      });
      function openBook(idx) {
        var w = list[idx], rd = $('#reader'), b = $$('.bk', room)[idx], c = w.case ? F.cases[w.case] : null;
        rd.innerHTML =
          '<div class="book-open">' +
            '<div class="page left"><div class="mat"><img alt=""><div class="cover-txt"><b>' + T(w.title) + '</b><span>' + T(w.maker || { old: '', now: '' }) + '</span><em>' + w.year + '</em></div></div>' +
              (w.coverNote ? '<p class="cover-note">' + T(w.coverNote) + '</p>' : '') + (w.credit ? '<p class="cover-note credit">' + esc(w.credit) + '</p>' : '') +
              '</div>' +
            '<div class="page right">' +
              // 머리띠: 메인 1면 기사 칸과 같은 모양 (검은 꼬리표 · 붉은 번호 · 오른쪽 연도)
              '<header class="rd-label"><b>' + T({ old: '문학관', now: '문학관' }) + '</b><i>' + String(idx + 1).padStart(2, '0') + '</i><em>' + w.year + '</em></header>' +
              '<h3>' + T(w.title) + '</h3>' +
              '<p class="colophon">' + [w.genre].concat(w.maker ? [w.maker] : []).map(T).join(' · ') + '</p>' +
              (w.plot ? '<p class="rd-body">' + T(w.plot) + '</p>' : '') +
              (w.quote ? '<blockquote>' + T(w.quote) + '<cite>' + T(w.quote.src) + '</cite></blockquote>' : '') +
              (c && c.story ? '<section class="case-box"><h4>' + T({ old: '이 작품이 그린 사건', now: '이 작품이 그린 사건' }) + '<span class="cb-name">' + T(c) + '</span></h4><p>' + T(c.story) + '</p></section>' : '') +
              (w.note ? '<p class="p-note">' + T(w.note) + '</p>' : '') +
              (w.verify ? '<p class="t-verify">' + T({ old: '다른 문헌에 의함', now: '다른 문헌 기준' }) + ' · 乙</p>' : '') +
              (c ? '<a class="rd-more" href="' + C.caseLink(w.case) + '">' + T({ old: '본지에서 사건 닑기', now: '신문에서 사건 읽기' }) + '</a>' : '') +
              (w.lastpage ? '<button type="button" class="lp-go">' + T({ old: '책장을 끗까지 넘기시오', now: '마지막 장 넘기기' }) + '</button>' : '') +
              // 마지막 장: 판권 뒤 빈 장 — 글 쓴 사람에게 그 뒤 생긴 일
              (w.lastpage ? '<section class="lp" aria-live="polite"><p class="lp-head"><b>' + T({ old: '마지막 장', now: '마지막 장' }) + '</b><span>' + T({ old: '판권 뒤', now: '판권 뒤' }) + '</span></p>' +
                w.lastpage.lines.map(function (p, i) { return '<p class="bl" style="--d:' + (0.5 + i * 1.4) + 's">' + T(p) + '</p>'; }).join('') +
                '<p class="bs-src" style="--d:' + (0.7 + w.lastpage.lines.length * 1.4) + 's">' + T(w.lastpage.src) + '</p>' +
                '<button type="button" class="lp-back">' + T({ old: '본문으로 도로 넘기시오', now: '본문으로 돌아가기' }) + '</button></section>' : '') +
            '</div>' +
          '</div><div class="r-nav">' +
            '<button type="button" class="r-prev">' + T({ old: '← 압 책', now: '← 이전 책' }) + '</button>' +
            '<button type="button" class="r-close">' + T({ old: '책을 덥흐시오', now: '책 덮기' }) + '</button>' +
            '<button type="button" class="r-next">' + T({ old: '다음 책 →', now: '다음 책 →' }) + '</button></div>';
        rd.hidden = false; rd.classList.remove('opening'); void rd.offsetWidth; rd.classList.add('opening');
        var img = $('.page.left img', rd);
        img.onload = function () { $('.page.left', rd).classList.add('has-img'); };
        slot(img, w.cover);
        bindSwap(rd);
        $('.r-close', rd).addEventListener('click', function () { rd.hidden = true; b.focus(); });
        $('.r-prev', rd).addEventListener('click', function () { openBook((idx - 1 + list.length) % list.length); });
        $('.r-next', rd).addEventListener('click', function () { openBook((idx + 1) % list.length); });
        $('.r-next', rd).focus();
        var bo = $('.book-open', rd), lg = $('.lp-go', rd), lb = $('.lp-back', rd);
        function turn(toLast) {
          bo.classList.add('lp-turning');
          setTimeout(function () { bo.classList.toggle('lp-on', toLast); $('.page.right', rd).scrollTop = 0; requestAnimationFrame(function () { bo.classList.remove('lp-turning'); }); }, REDUCED ? 0 : 700);
        }
        if (lg) lg.addEventListener('click', function () { turn(true); });
        if (lb) lb.addEventListener('click', function () { turn(false); });
      }
    },

    /* 창가관 — 한 화면에: 왼쪽 축음기 · 오른쪽 음반 해설지 · 아래 음반 봉투
       · 음반 봉투를 누르면 바로 판이 돌고 노래 시작 (판 · ▶ 단추로 멈춤/재생)
       · 노래가 도는 동안 나팔에서 가사(왈츠는 쿵 짝 짝)가 한 줄씩 흘러나와 사라짐
       · 해설지: 제목 · 부른 이 · 지금 흐르는 가사 · 소개 · 음반 뒷면 정보 · 같은 해의 사건
       · 소리: preview(미리듣기 · 공유 저작물) → assets 음원 → 스포티파이 곡(숨은 재생기). 소리 없는 판은 진열 안 함
       · 윤심덕 음반(still)은 원칙대로 판이 돌지 않음 */
    phono: function (list) {
      var room = $('#cases');
      room.className = 'cases room-gramo';
      list = list.filter(function (w) { return w.preview || spotifyUri(w.spotify) || w.hasFile || w.albumNo; });   // albumNo: 「유성기로 듣던 가요사」 앨범 안 곡 번호 (소리는 스포티파이 앱에서)
      room.innerHTML =
        '<div class="g2">' +
          '<div class="g2-stage vn-deck gm-deck" id="gDeck">' +
            '<span class="gm-light" aria-hidden="true"></span>' +
            '<div class="gm-box" id="gmBox">' +
              '<img class="gm-img" alt="1920년대 나팔 축음기 (재현 그림)" src="' + C.assetDir + 'mj-gramophone.png" onerror="document.getElementById(\'gmBox\').classList.add(\'no-mj\')">' +
              GRAMO_SVG +
              '<button type="button" class="vn-disc gm-rec" id="vnDisc" aria-label="재생 · 멈춤" style="--x:' + C.gramoDisc.x + '%;--y:' + C.gramoDisc.y + '%;--w:' + C.gramoDisc.w + '%;--r:' + C.gramoDisc.r + '">' +
                '<span class="gm-spin"><span class="vn-grooves"></span><span class="vn-label"><img alt=""><span class="vn-ltxt"><b id="vnLt"></b></span></span><i class="gm-mark"></i></span>' +
                '<span class="vn-sheen" aria-hidden="true"></span></button>' +
              // 나팔 입: 여기서 가사가 흘러나옴
              '<div class="horn-fx" id="hornFx" style="--hx:' + C.gramoHorn.x + '%;--hy:' + C.gramoHorn.y + '%"></div>' +
            '</div>' +
          '</div>' +
          '<article class="g2-sheet" id="gSheet"></article>' +
        '</div>' +
        '<div class="g2-shelf">' + list.map(function (w, i) {
          return '<button type="button" class="slv" data-i="' + i + '">' +
                   '<span class="slv-cover"><img alt=""><span class="slv-paper"><i class="slv-hole"><b>' + esc(w.title.old) + '</b></i></span></span>' +
                   '<span class="slv-cap"><b>' + T(w.title) + '</b><small>' + w.year + '</small></span></button>';
        }).join('') + '<p class="g2-more">' + T({ old: '판이 더 드러올 자리', now: '음반이 더 들어올 자리' }) + '</p></div>' +
        '<audio id="phonoAudio" preload="none"></audio><div class="sp-hidden" id="spHidden" aria-hidden="true"></div>';
      bindSwap(room);
      $$('.slv', room).forEach(function (b) { var w = list[+b.dataset.i], img = $('img', b); img.onload = function () { b.classList.add('has-img'); }; slot(img, w.label); });

      var audio = $('#phonoAudio'), deck = $('#gDeck'), disc = $('#vnDisc'), fx = $('#hornFx');
      var cur = null, mode = '', on = false, lyT = null, lyI = 0;

      function sheet(w) {
        var c = w.case ? F.cases[w.case] : null;
        var same = F.timeline.filter(function (e) { return e.y === w.year; })[0];
        var next = F.timeline.filter(function (e) { return e.y > w.year; })[0];
        $('#gSheet').innerHTML =
          // 옛 류성긔 음반 가사지(해설지) 머리: 장식 테 안에 '류성긔 음반 해설' · 번호 · 연도
          '<header class="lc-head"><span class="lc-orn" aria-hidden="true">❖</span><p>' + T({ old: '류성긔 음반 해설', now: '축음기 음반 해설지' }) + '</p>' +
            '<small>' + T({ old: '제 ' + NUMW[list.indexOf(w) + 1] + ' 호 · ' + w.year, now: (list.indexOf(w) + 1) + '번 · ' + w.year }) + '</small></header>' +
          '<h3>' + T(w.title) + '</h3>' +
          '<p class="colophon">' + [w.genre].concat(w.maker ? [w.maker] : []).map(T).join(' · ') + '</p>' +
          (w.lyric ? '<blockquote class="g2-lyric">' + T(w.lyric) + '</blockquote>' : '') +
          // 이 판이 들려주는 이야기: 판이 도는 동안 한 단락씩 드러남
          (w.story ? '<section class="g2-story"><h4>' + T({ old: '이 판이 들려주는 이야기', now: '이 음반이 들려주는 이야기' }) + '<span id="gStep">0 / ' + w.story.length + '</span></h4>' +
            w.story.map(function (p, i) { return '<p class="st" data-i="' + i + '">' + T(p) + '</p>'; }).join('') + '</section>' : '') +
          (w.plot && !w.story ? '<p class="rd-body">' + T(w.plot) + '</p>' : '') +
          // 음반 뒷면 정보: 표로
          (w.notes ? '<dl class="g2-notes">' + w.notes.map(function (n) { return '<dt>' + T(n.k) + '</dt><dd>' + T(n.v) + (n.verify ? ' <span class="t-verify">乙</span>' : '') + '</dd>'; }).join('') + '</dl>' : '') +
          // 같은 해 · 그다음 사건
          '<p class="g2-when">' + (same ? T({ old: '같은 해 지면엔 — ' + same.t.old, now: '같은 해 신문에는 — ' + same.t.now }) :
              next ? T({ old: (next.y - w.year) + ' 년 뒤 지면엔 — ' + next.t.old, now: (next.y - w.year) + '년 뒤 신문에는 — ' + next.t.now }) : '') + '</p>' +
          (w.source ? '<p class="vn-src dark">' + T(w.source) + '</p>' : '') +
          // 판 뒷면: 노래 업는 면 (뒤집으면 소리가 멎고, 한 줄씩 떠오름)
          (w.bside ? '<section class="g2-bside" aria-live="polite"><p class="bs-head"><b>' + T({ old: '뒷면', now: '뒷면' }) + '</b><span>' + T({ old: '노래 업는 면', now: '노래가 없는 면' }) + '</span></p>' +
            w.bside.lines.map(function (p, i) { return '<p class="bl" style="--d:' + (0.6 + i * 1.5) + 's">' + T(p) + '</p>'; }).join('') +
            '<p class="bs-src" style="--d:' + (0.8 + w.bside.lines.length * 1.5) + 's">' + T(w.bside.src) + '</p></section>' : '') +
          '<div class="np-tools">' + (w.bside ? '<button type="button" class="np-flip" id="gFlip">' + T({ old: '판을 뒤집으시오', now: '판 뒤집기' }) + '</button>' : '') +
          '<button type="button" class="np-stop" id="gPlay">' + T({ old: '❚❚ 멈춤', now: '❚❚ 멈춤' }) + '</button>' +
          (c ? '<a class="rd-more" href="' + C.caseLink(w.case) + '">' + T({ old: '본지에서 사건 닑기', now: '신문에서 사건 읽기' }) + '</a>' : '') + '</div>';
        bindSwap($('#gSheet'));
        $('#gPlay').addEventListener('click', function () { if (on) stop(); else start(); });
        var fb = $('#gFlip');
        if (fb) fb.addEventListener('click', function () {
          var sh = $('#gSheet'), toB = !sh.classList.contains('b-on');
          if (toB) stop();                                   // 뒷면엔 노래가 업슴 — 소리가 멎음
          sh.classList.add('turning'); disc.classList.add('turning');
          setTimeout(function () {
            sh.classList.toggle('b-on', toB); deck.classList.toggle('b-side', toB); sh.scrollTop = 0;
            fb.innerHTML = T(toB ? { old: '앞면으로 도로 뒤집으시오', now: '앞면으로 뒤집기' } : { old: '판을 뒤집으시오', now: '판 뒤집기' }); bindSwap(fb);
            sh.classList.remove('turning');
          }, REDUCED ? 0 : 420);
          setTimeout(function () { disc.classList.remove('turning'); }, REDUCED ? 0 : 900);
        });
      }
      function setBtn() { var b = $('#gPlay'); if (b) { var s = $('.hj', b); s.textContent = on ? '❚❚ 멈춤' : '▶ 재생'; s.dataset.ko = s.textContent; } }
      // 판이 도는 동안 이야기 단락을 하나씩 드러냄 (멈추면 그 자리에서 멈춤)
      function lyricTick() {
        var ps = $$('#gSheet .st'); if (!ps.length) return;
        if (lyI >= ps.length) { clearInterval(lyT); return; }
        ps[lyI].classList.add('show'); lyI++;
        var s = $('#gStep'); if (s) s.textContent = lyI + ' / ' + ps.length;
        var sh = $('#gSheet'), el = ps[lyI - 1];   // 해설지 안에서만 스크롤 (화면 전체는 그대로)
        if (el.offsetTop + el.offsetHeight > sh.scrollTop + sh.clientHeight) sh.scrollTo({ top: el.offsetTop - sh.clientHeight / 2, behavior: REDUCED ? 'auto' : 'smooth' });
      }
      function start() {
        if (mode === 'none' && cur && cur.albumNo) return;   // 소리 업는 음반은 판을 돌리지 안음
        if (on || !cur) return;
        on = true; setBtn();
        deck.classList.add('arm-down');
        if (!REDUCED && (!cur.still || C.stillSpin)) deck.classList.add('spinning');   // 윤심덕 음반은 config.stillSpin 이 true 일 때만 (천천히)
        if (mode === 'audio') audio.play().catch(function () {});
        else if (mode === 'spotify' && SP.ctl) { try { SP.ctl.resume(); } catch (e) {} }
        clearInterval(lyT); lyT = setInterval(lyricTick, 6500); if (lyI === 0) lyricTick();   // 6.5초마다 한 단락
      }
      function stop() {
        on = false; setBtn(); clearInterval(lyT);
        deck.classList.remove('arm-down', 'spinning');
        audio.pause(); if (SP.ctl) try { SP.ctl.pause(); } catch (e) {}
      }
      disc.addEventListener('click', function () { if (on) stop(); else start(); });
      audio.onended = stop;

      room.querySelector('.g2-shelf').addEventListener('click', function (e) {
        var b = e.target.closest('.slv'); if (!b) return;
        var w = list[+b.dataset.i];
        stop(); cur = w; lyI = 0;
        $$('.slv', room).forEach(function (x) { x.classList.toggle('now', x === b); });
        sheet(w);
        $('#vnLt').textContent = w.title.old;
        var li = $('.vn-label img', disc); li.removeAttribute('src'); disc.classList.remove('has-img');
        li.onload = function () { disc.classList.add('has-img'); }; slot(li, w.label);
        var srcs = [].concat(w.preview || []).concat([C.assetDir + w.audio + '.mp3']), k = 0;
        mode = 'audio';
        audio.onerror = function () {
          if (k < srcs.length) { audio.src = srcs[k++]; audio.load(); if (on) audio.play().catch(function () {}); return; }
          var sp = spotifyUri(w.spotify);
          if (sp) { mode = 'spotify'; mountSpotify($('#spHidden'), sp, function () {}, true); if (on) setTimeout(function () { try { SP.ctl.resume(); } catch (e) {} }, 1500); }
          else {
            mode = 'none';
            if (w.albumNo) {   // 곡 링크가 아직 업는 음반: 판은 멈추고, 앨범의 그 번호 곡으로 가는 길을 해설지 아래에
              stop();
              var sh = $('.g2-sheet', room);
              if (sh && !sh.querySelector('.sp-out')) {
                sh.insertAdjacentHTML('beforeend', '<p class="sp-out"><a href="' + C.spotifyAlbum + '" target="_blank" rel="noopener">' +
                  T({ old: '「유성기로 듣던 가요사」 ' + w.albumNo + ' 번 곡으로 드르시오 ↗', now: '스포티파이 「유성기로 듣던 가요사」 ' + w.albumNo + '번 곡 듣기 ↗' }) + '</a></p>');
                bindSwap(sh);
              }
            }
          }
        };
        audio.onerror();
        setTimeout(start, mode === 'spotify' ? 1200 : 400);
      });
      var first = room.querySelector('.slv'); if (first) first.click();
    },

    /* 무대관 — 막(커튼)을 걷으면 그 작품이 상영됨
       1990년 이전 작품: 포스터 자리(poster) + 줄거리 / 1990년 이후: 포스터 · 장면 없이 제목 · 연도 · 찾아보기 (경성야록 원칙) */
    theater: function (list) {
      var room = $('#cases');
      room.className = 'cases room-theater';
      room.innerHTML = list.map(function (w, i) {
        return '<article class="stagebox' + (w.still ? ' still' : '') + '" data-i="' + i + '">' +
          '<div class="proscenium"><div class="screen">' +
            (w.poster && !w.recent ? '<img alt="">' : '') +
            '<div class="title-card"><small>' + T(w.genre) + '</small><b>' + T(w.title) + '</b><em>' + w.year + '</em></div>' +
          '</div><button type="button" class="curtain" aria-label="막 걷기"><i></i><i></i><span>' + T({ old: '막을 거드시오', now: '막 걷기' }) + '</span></button></div>' +
          '<div class="s-info"><p class="p-meta">' + meta(w) + '</p>' + (w.plot ? '<p>' + T(w.plot) + '</p>' : '') + foot(w) + '</div>' +
        '</article>';
      }).join('');
      bindSwap(room);
      $$('.stagebox', room).forEach(function (box) {
        var w = list[+box.dataset.i], img = $('img', box);
        if (img) { img.onload = function () { box.classList.add('has-img'); }; slot(img, w.poster); }
        $('.curtain', box).addEventListener('click', function () { box.classList.add('open'); });
      });
    },

    /* 무대관 — 한 장의 은막, 세 가지 빛
       어두운 객석 아래 기계 셋(영사기 · 조명 · 텔레비), 위에 큰 은막 하나.
       기계를 누르면 그 기계에서 은막으로 빛이 건너가고, 은막이 그 매체의 결로 바뀜
         활동사진 → 바랜 필름 자막 · 연극/가극 → 붉은 막이 갈라지고 조명 동그라미 · 방송 → 브라운관 결
       아래 '상영 순서지'(종이 프로그램)에서 작품을 고르면 은막에 오르고, 은막 아래에 설명이 붙음
       원칙: 1990년 이후 작품은 제목 · 연도 · 찾아보기만 / still(윤심덕 · 김우진)은 흔들림 · 깜빡임 없이
       (2026. 10. 6) 단, trailer(공식 채널 영상)가 잇는 작품은 은막에 「틀기」 단추 → 은막 안에서 유튜브가 돌아감
             영상이 도는 동안엔 필름 깜빡임 · 자동 '불 끄기'를 멈추고, 결(입자 · 주사선)만 옅게 남김 */
    media: function (list) {
      // 유튜브 주소(여러 꼴) 또는 영상 번호 → 영상 번호
      // 영상 주소 → 어떤 영상인지 (유튜브 · 네이버TV · 이 폴더 안의 영상 파일)
      //   유튜브   : youtu.be/… · youtube.com/watch?v=… · shorts/… · 영상 번호 11자
      //   네이버TV : tv.naver.com/v/숫자 · tv.naver.com/embed/숫자
      //   파일     : assets/expo/… .mp4 · .webm (팀이 쓸 권리가 있는 영상만)
      function vidOf(t) {
        if (!t) return null;
        var v = String(t.url || t.yt || '').trim(), m;
        if (!v) return null;
        if (/\.(mp4|webm|m4v)(\?|$)/i.test(v)) return { type: 'file', src: v, watch: v };
        if ((m = v.match(/tv\.naver\.com\/(?:v|embed)\/(\d+)/))) return { type: 'naver', src: 'https://tv.naver.com/embed/' + m[1] + '?autoPlay=true', watch: 'https://tv.naver.com/v/' + m[1] };
        m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
        var id = m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : '');
        if (!id) return null;
        var org = /^https?:/.test(location.protocol) ? '&origin=' + encodeURIComponent(location.origin) : '';
        // list: 이어서 틀 영상 번호들 (공식 장면 여러 개를 줄거리 차례로 이어 보기)
        var more = (t.list || []).map(function (x) { var mm = String(x).match(/([\w-]{11})$/); return mm ? mm[1] : ''; }).filter(Boolean);
        var pl = more.length ? '&playlist=' + more.join(',') : '';
        return { type: 'yt', src: 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=0' + pl + org, watch: 'https://www.youtube.com/watch?v=' + id, count: more.length + 1 };
      }
      function ytId(t) { return !!vidOf(t); }   // (예전 이름 그대로 둠: 영상이 잇는지)
      var KIND_WORD = { '예고편': { old: '예고편을 트시오', now: '예고편 보기' }, '장면': { old: '한 장면을 트시오', now: '장면 보기' }, '무대': { old: '무대를 트시오', now: '무대 영상 보기' }, '줄거리': { old: '줄거리 차례로 트시오', now: '줄거리 따라 보기' } };
      var room = $('#cases');
      room.className = 'cases room-media';
      var KINDS = [
        { id: 'film',  img: 'mj-projector', lens: [76, 53], name: { old: '활동사진', now: '영화' },          verb: { old: '영사긔', now: '영사기' },
          test: function (w) { return /영화/.test(w.genre.now); } },
        { id: 'stage', img: 'mj-spotlight', lens: [55, 32], name: { old: '연극 · 가극', now: '연극 · 뮤지컬' },   verb: { old: '조명', now: '조명' },
          test: function (w) { return /뮤지컬|연극|공연/.test(w.genre.now); } },
        { id: 'tv',    img: 'mj-tv',        lens: [48, 58], name: { old: '방송 · 연속극', now: '방송 · 드라마' }, verb: { old: '텔레비', now: '텔레비전' },
          test: function (w) { return /드라마|방송|보도/.test(w.genre.now); } }
      ];
      var NUM = ['영', '한', '두', '세', '네', '다섯', '여섯', '일곱'];
      KINDS.forEach(function (k) { k.list = list.filter(k.test).sort(function (a, b) { return a.year - b.year; }); });

      room.innerHTML =
        '<div class="th">' +
          '<div class="th-house">' +
            '<div class="th-screen" data-mode="off">' +
              '<div class="th-frame">' +
                '<div class="th-curtain l" aria-hidden="true"></div><div class="th-curtain r" aria-hidden="true"></div>' +
                '<div class="th-pic" aria-live="polite"><p class="th-idle">' + T({ old: '아래 긔계 하나를 눌러 불을 켜시오', now: '아래 기계 하나를 눌러 불을 켜세요' }) + '</p></div>' +
                '<i class="th-grain" aria-hidden="true"></i><i class="th-scan" aria-hidden="true"></i>' +
              '</div>' +
            '</div>' +
            '<svg class="th-beams" aria-hidden="true"><defs>' +
              KINDS.map(function (k) { return '<linearGradient id="thg-' + k.id + '" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffe9bd" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9bd" stop-opacity=".02"/></linearGradient>'; }).join('') +
              '<filter id="thBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>' +
            '</defs>' + KINDS.map(function (k) { return '<polygon class="th-beam b-' + k.id + '" fill="url(#thg-' + k.id + ')" filter="url(#thBlur)"/>'; }).join('') + '</svg>' +
            '<div class="th-floor">' + KINDS.map(function (k, i) {
              return '<button type="button" class="th-dev d-' + k.id + '" data-k="' + i + '" aria-pressed="false">' +
                '<span class="th-img"><img alt="" src="' + F.config.assetDir + k.img + '.jpg"></span>' +
                '<span class="th-tag"><b>' + T(k.verb) + '</b><small>' + T(k.name) + ' · ' + NUM[k.list.length] + ' 번</small></span>' +
              '</button>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="th-cap" aria-live="polite"></div>' +
          '<div class="th-bill">' +
            '<p class="tb-head"><b>' + T({ old: '상영 순서', now: '상영 순서' }) + '</b><span>' + T({ old: '한 사건이 몃 번이나 다시 빗을 바닷는지', now: '한 사건이 몇 번이나 다시 빛을 받았는지' }) + '</span></p>' +
            '<div class="tb-cols">' + KINDS.map(function (k, i) {
              return '<section class="tb-col" data-k="' + i + '"><h4>' + T(k.name) + '</h4><ol>' + k.list.map(function (w, j) {
                return '<li><button type="button" class="tb-item" data-k="' + i + '" data-j="' + j + '"><span class="y">' + w.year + '</span><span class="t">' + T(w.title) + '</span><span class="g">' + T(w.genre) + '</span></button></li>';
              }).join('') + '</ol></section>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="th-osmu" aria-live="polite"></div>' +
        '</div>';
      bindSwap(room);

      var th = $('.th', room), house = $('.th-house', room), scr = $('.th-screen', room), pic = $('.th-pic', room), cap = $('.th-cap', room);
      var cur = -1, timer = null;

      // 빛줄기: 렌즈 자리 → 은막 아래 가장자리 (화면 크기가 바뀌면 다시 계산)
      function beams() {
        var hb = house.getBoundingClientRect(), sb = $('.th-frame', room).getBoundingClientRect(), svg = $('.th-beams', room);
        svg.setAttribute('viewBox', '0 0 ' + hb.width + ' ' + hb.height);
        KINDS.forEach(function (k, i) {
          var im = $('.d-' + k.id + ' img', room).getBoundingClientRect();
          var lx = im.left - hb.left + im.width * k.lens[0] / 100, ly = im.top - hb.top + im.height * k.lens[1] / 100;
          var x1 = sb.left - hb.left + sb.width * .06, x2 = sb.right - hb.left - sb.width * .06, y = sb.bottom - hb.top - sb.height * .12;
          var sp = k.id === 'tv' ? 10 : 4;
          $('.b-' + k.id, room).setAttribute('points', (lx - sp) + ',' + ly + ' ' + (lx + sp) + ',' + ly + ' ' + x2 + ',' + y + ' ' + x1 + ',' + y);
          var g = $('#thg-' + k.id); g.setAttribute('x1', lx); g.setAttribute('y1', ly); g.setAttribute('x2', (x1 + x2) / 2); g.setAttribute('y2', y);
        });
      }
      requestAnimationFrame(beams);
      $$('.th-img img', room).forEach(function (im) { im.addEventListener('load', beams); });
      window.addEventListener('resize', beams);

      function play(i, j) {
        var k = KINDS[i], w = k.list[j]; if (!w) return;
        clearTimeout(timer);
        var changed = cur !== i; cur = i;
        th.dataset.on = k.id;
        $$('.th-dev', room).forEach(function (d) { d.setAttribute('aria-pressed', +d.dataset.k === i); });
        $$('.tb-item', room).forEach(function (b) { b.classList.toggle('on', +b.dataset.k === i && +b.dataset.j === j); });
        scr.dataset.mode = k.id;
        scr.classList.toggle('still', !!w.still);
        scr.classList.remove('playing');
        // 바뀌는 순간: 필름은 암전 · 막은 닫혔다 열림 · 텔레비는 지지직
        scr.classList.remove('cut'); void scr.offsetWidth; scr.classList.add('cut');
        timer = setTimeout(function () {
          var vid = vidOf(w.trailer), tid = !!vid;
          pic.innerHTML =
            (w.poster && !w.recent ? '<img class="th-poster" alt="">' : '') +
            '<div class="th-title"><small>' + T(w.genre) + '</small><b>' + T(w.title) + '</b><em>' + w.year + '</em>' +
            (tid ? '<button type="button" class="th-play"><i aria-hidden="true"></i>' + T(KIND_WORD[w.trailer.kind] || KIND_WORD['예고편']) + '</button>'
                 : (w.year >= 1990 ? '<p class="th-nofilm">' + T({ old: '공식 영상이 아즉 영사실에 드러오지 안앗소', now: '공식 영상을 아직 찾지 못했습니다' }) + '</p>' +
                     (w.link ? '<a class="th-play th-find" href="' + esc(w.link) + '" target="_blank" rel="noopener">' + T({ old: '차저보시오 ↗', now: '찾아보기 ↗' }) + '</a>' : '') : '')) + '</div>';
          var pb = $('button.th-play', pic);
          if (pb) pb.addEventListener('click', function () {
            clearTimeout(play._auto);
            scr.classList.remove('lights-out'); var a0 = $('.th-after', scr); if (a0) a0.remove();
            var ob = $('.th-off', cap); if (ob) ob.hidden = true;
            scr.classList.add('playing');
            var ttl = esc(T(w.title).replace(/<[^>]+>/g, ''));
            if (vid.type === 'file') {
              pic.innerHTML = '<video class="th-video" src="' + esc(vid.src) + '" controls autoplay playsinline title="' + ttl + '"></video>';
            } else if (vid.type === 'yt' && location.protocol === 'file:') {
              // 파일을 더블클릭으로 연 경우: 유튜브가 은막 안 재생을 막음(오류 153) → 안내 + 바로가기
              pic.innerHTML = '<div class="th-title th-novid"><small>' + T({ old: '영사 불가', now: '재생 불가' }) + '</small><b>' + T({ old: '「경성야록 열기」로 여시오', now: '「경성야록 열기」로 열어 주세요' }) + '</b>' +
                '<p class="th-how">' + T({ old: '폴더 안 「경성야록_열기」를 두 번 누르면 이 은막에서 바로 도라가오', now: '폴더 안 「경성야록_열기」를 더블클릭하면 이 은막에서 바로 재생됩니다' }) + '</p>' +
                '<a class="th-play" href="' + esc(vid.watch) + '" target="_blank" rel="noopener">' + T({ old: '유튜브에서 보시오 ↗', now: '유튜브에서 보기 ↗' }) + '</a></div>';
              bindSwap(pic); scr.classList.remove('playing'); return;
            } else {
              pic.innerHTML = '<iframe class="th-video" src="' + esc(vid.src) + '" title="' + ttl + '" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
            }
          });
          var p = $('.th-poster', pic); if (p) slot(p, w.poster);
          bindSwap(pic);
          scr.classList.remove('cut');
          if (pb) pb.click();   // 영상이 잇스면 단추를 누를 것 업시 바로 은막에서 도라감
        }, changed ? 900 : 450);
        if (w.case && typeof drawOsmu === 'function') drawOsmu(w.case);
        var af = w.case && F.afterimage ? F.afterimage[w.case] : null;
        cap.innerHTML = '<p class="p-meta">' + meta(w) + '</p>' + (w.note ? '<p class="c-note">' + T(w.note) + '</p>' : '') + (w.plot && !w.recent && !w.note ? '<p class="c-plot">' + T(w.plot) + '</p>' : '') +
          (vidOf(w.trailer) ? '<p class="t-video">' + T({ old: '영상 · ', now: '영상 · ' }) + T(w.trailer.by) +
            (vidOf(w.trailer).type === 'file' ? '' : ' · ' + T({ old: '인터넷이 이어저 잇서야 나오오', now: '인터넷 연결 필요' }) +
              ' · <a href="' + esc(vidOf(w.trailer).watch) + '" target="_blank" rel="noopener">' + T({ old: vidOf(w.trailer).type === 'naver' ? '네이버TV에서 보시오 ↗' : '유튜브에서 보시오 ↗', now: vidOf(w.trailer).type === 'naver' ? '네이버TV에서 보기 ↗' : '유튜브에서 보기 ↗' }) + '</a>') + '</p>' : '') + foot(w) +
          (af ? '<button type="button" class="th-off">' + T({ old: '불을 끄시오', now: '불 끄기' }) + '</button>' : '');
        bindSwap(cap);
        scr.classList.remove('lights-out'); var oldAf = $('.th-after', scr); if (oldAf) oldAf.remove();
        var offB = $('.th-off', cap);
        clearTimeout(play._auto);
        if (offB && !vidOf(w.trailer)) play._auto = setTimeout(function () { if (!scr.classList.contains('lights-out') && document.body.contains(offB)) offB.click(); }, REDUCED ? 0 : 6500);
        if (offB) offB.addEventListener('click', function () {
          var out = !scr.classList.contains('lights-out');
          var a = $('.th-after', scr);
          if (out && !a) {
            a = document.createElement('div'); a.className = 'th-after'; a.setAttribute('aria-live', 'polite');
            a.innerHTML = af.lines.map(function (p, i) { return '<p class="bl" style="--d:' + (1.4 + i * 1.8) + 's">' + T(p) + '</p>'; }).join('') +
              '<p class="bs-src" style="--d:' + (1.8 + af.lines.length * 1.8) + 's">' + T(af.src) + '</p>';
            $('.th-frame', scr).appendChild(a); bindSwap(a);
          }
          scr.classList.toggle('lights-out', out);
          offB.innerHTML = T(out ? { old: '불을 다시 켜시오', now: '불 다시 켜기' } : { old: '불을 끄시오', now: '불 끄기' }); bindSwap(offB);
        });
      }
      $$('.th-dev', room).forEach(function (d) {
        d.addEventListener('click', function () {
          var i = +d.dataset.k;
          if (cur === i) {   // 같은 기계를 다시 누르면 불이 꺼짐
            cur = -1; th.dataset.on = ''; scr.dataset.mode = 'off'; d.setAttribute('aria-pressed', 'false');
            pic.innerHTML = '<p class="th-idle">' + T({ old: '아래 긔계 하나를 눌러 불을 켜시오', now: '아래 기계 하나를 눌러 불을 켜세요' }) + '</p>'; bindSwap(pic);
            cap.innerHTML = ''; $$('.tb-item', room).forEach(function (b) { b.classList.remove('on'); }); return;
          }
          var first = KINDS[i].list.findIndex(function (x) { return !!vidOf(x.trailer); });   // 영상 잇는 작품부터
          play(i, first > -1 ? first : 0);
        });
      });
      $$('.tb-item', room).forEach(function (b) { b.addEventListener('click', function () { play(+b.dataset.k, +b.dataset.j); }); });

      /* ── 한 사건이 걸어온 길 (원 소스 · 여러 쓰임) ──
         사건(원천 지면) → 노래 · 책 · 무대 · 화면으로 다시 태어난 차례 → 경성야록이 제안하는 다음 쓰임(기획안)
         perf: 기사로 확인된 성과(판매 · 관객 · 시청률 · 공연)만, 출처와 함께 / 무대관 작품 칸을 누르면 은막에 오름 */
      var osmuBox = $('.th-osmu', room), osmuCur = '';
      var OPEN_HALLS = F.halls.map(function (h) { return h.id; });
      var MEDIUM = { literature: { old: '책', now: '책' }, music: { old: '음반', now: '음반' } };
      function drawOsmu(cid) {
        var O = F.osmu && F.osmu[cid]; if (!O || !osmuBox || cid === osmuCur) return;
        osmuCur = cid;
        var ws = F.works.filter(function (x) { return x.case === cid && !x.aside && OPEN_HALLS.indexOf(x.hall) > -1 && x.year >= O.year; })
                        .sort(function (a, b) { return a.year - b.year; });
        var kinds = {}; ws.forEach(function (x) { kinds[x.hall === 'stage' ? x.genre.now.replace(/\s*\(.*\)/, '') : x.hall] = 1; });
        var last = ws.length ? ws[ws.length - 1].year : O.year;
        var tabs = Object.keys(F.osmu).map(function (k) {
          return '<button type="button" class="os-tab' + (k === cid ? ' on' : '') + '" data-c="' + k + '">' + T(F.cases[k]) + '</button>'; }).join('');
        var cards = ws.map(function (x) {
          var kk = -1, jj = -1;
          if (x.hall === 'stage') KINDS.forEach(function (k, a) { var b = k.list.indexOf(x); if (b > -1) { kk = a; jj = b; } });
          var med = x.hall === 'stage' ? x.genre : (MEDIUM[x.hall] || x.genre);
          return '<li class="os-card' + (kk > -1 ? ' go' : '') + (vidOf(x.trailer) ? ' vid' : '') + '"' + (kk > -1 ? ' data-k="' + kk + '" data-j="' + jj + '" tabindex="0" role="button"' : '') + '>' +
            '<span class="os-y">' + x.year + '</span><span class="os-m">' + T(med) + '</span><b>' + T(x.title) + '</b>' +
            (x.perf ? '<span class="os-p">' + T(x.perf) + '</span>' + (x.perfSrc ? '<small>' + T(x.perfSrc) + '</small>' : '') : '') +
            (x.note && !x.perf ? '<span class="os-n">' + T(x.note) + '</span>' : '') +
            (vidOf(x.trailer) ? '<i class="os-v">' + T({ old: '은막에서 보기', now: '영상 보기' }) + '</i>' : '') + '</li>';
        }).join('');
        osmuBox.innerHTML =
          '<p class="tb-head"><b>' + T({ old: '한 사건이 걸어온 길', now: '한 사건이 걸어온 길' }) + '</b><span>' + T({ old: '원천 하나가 노래 · 책 · 무대 · 화면으로 팔려 나간 차례', now: '원천 하나가 노래·책·무대·화면 콘텐츠가 된 과정 (원 소스 멀티 유즈)' }) + '</span></p>' +
          '<div class="os-tabs">' + tabs + '</div>' +
          '<p class="os-sum">' + T({ old: O.year + ' 년의 지면 한 장이', now: O.year + '년 신문 한 면이' }) + ' <b>' + (last - O.year) + '</b>' + T({ old: ' 해 동안 ', now: '년 동안 ' }) + '<b>' + Object.keys(kinds).length + '</b>' + T({ old: ' 가지 꼴로 ', now: '가지 형태로 ' }) + '<b>' + ws.length + '</b>' + T({ old: ' 번 다시 태여낫소', now: '번 다시 만들어졌다' }) + '</p>' +
          '<ol class="os-row">' +
            '<li class="os-card src"><span class="os-y">' + O.year + '</span><span class="os-m">' + T({ old: '원천 · 본보 지면', now: '원천 · 신문 보도' }) + '</span><b>' + T(F.cases[cid]) + '</b>' +
              '<a class="os-p" href="' + C.caseLink(cid) + '">' + T({ old: '그날 지면 보기', now: '원래 기사 보기' }) + '</a></li>' +
            cards +
            '<li class="os-card next"><span class="os-y">' + T({ old: '다음 칸', now: '다음 칸' }) + '</span><span class="os-m">' + T({ old: '경성야록 긔획안', now: '경성야록 기획안' }) + '</span>' +
              '<ul>' + O.next.map(function (n) { return '<li>' + T(n) + '</li>'; }).join('') + '</ul>' +
              '<small>' + T({ old: '아즉 나오지 안은 것 · 경성야록이 제안함', now: '아직 나오지 않은 것 · 경성야록의 제안' }) + '</small></li>' +
          '</ol>' +
          '<p class="os-note">' + T({ old: '숫자는 긔사로 확인된 것만 적엇소 · 출처는 칸마다', now: '성과 숫자는 기사로 확인된 것만, 출처는 칸마다 표기' }) + '</p>';
        bindSwap(osmuBox);
      }
      if (osmuBox) {
        osmuBox.addEventListener('click', function (e) {
          var t = e.target.closest('.os-tab'); if (t) { drawOsmu(t.dataset.c); return; }
          var c = e.target.closest('.os-card.go'); if (c) { play(+c.dataset.k, +c.dataset.j); scr.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }); }
        });
        osmuBox.addEventListener('keydown', function (e) { var c = e.target.closest('.os-card.go'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); c.click(); } });
        drawOsmu('hyeonhaetan');
      }
      // 드러서면 빈 은막 대신 영사긔가 먼저 켜짐 (첫 상영작)
      setTimeout(function () {
        if (cur !== -1 || !document.body.contains(scr)) return;
        for (var a = 0; a < KINDS.length; a++) {   // 영사긔 → 조명 → 텔레비 차례로, 영상 잇는 첫 작품
          var b = KINDS[a].list.findIndex(function (x) { return !!vidOf(x.trailer); });
          if (b > -1) { play(a, b); return; }
        }
        play(0, 0);
      }, 1400);
    },

    /* 미술관 — 그림 벽. 그림을 누르면 큰 화면 + 큐레이터 해설
       '현상 렌즈': 흑백 그림 위에 렌즈를 대면 그 자리만 원래 색 / '제 빗으로 보기': 전체 원래 색 */
    gallery: function (list) {
      /* 미술관 — 지면이 지운 것들
         그림마다 검열 먹줄이 처 잇음 → 그림을 누르면 먹이 왼쪽부터 천천히 걷히고, 지운 자리 · 두 줄 이야기가 드러남
         다시 누르면 먹줄이 도로 덥힘 · '크게 보시오' 로 큰 화면 */
      var room = $('#cases');
      room.className = 'cases room-gallery room-ink';
      room.innerHTML = '<div class="ink-wall">' + list.map(function (w, i) {
        var k = w.ink || { left: 10, top: 40, width: 80, height: 14, label: '' };
        return '<figure class="ink-f" data-i="' + i + '">' +
          '<button type="button" class="ink-pic" aria-pressed="false" aria-label="먹줄 걷기">' +
            '<span class="ink-img"><img src="' + esc(w.img) + '" alt=""><span class="ink-bar" style="left:' + k.left + '%;top:' + k.top + '%;width:' + k.width + '%;height:' + k.height + '%"><b>' + esc(k.label) + '</b></span></span>' +
          '</button>' +
          '<figcaption><p class="ink-t"><b>' + T(w.title) + '</b><small>' + T(w.genre) + ' · ' + w.year + '</small></p>' +
            '<div class="ink-say">' + (w.reveal || []).map(function (p, j) { return '<p class="bl" style="--d:' + (1.2 + j * 1.3) + 's">' + T(p) + '</p>'; }).join('') +
            (w.src ? '<p class="bs-src" style="--d:' + (1.4 + (w.reveal || []).length * 1.3) + 's">' + T(w.src) + '</p>' : '') + '</div>' +
            '<button type="button" class="ink-view">' + T({ old: '크게 보시오', now: '크게 보기' }) + '</button></figcaption>' +
        '</figure>';
      }).join('') + '</div>';
      bindSwap(room);
      room.querySelector('.ink-wall').addEventListener('click', function (e) {
        var f = e.target.closest('.ink-f'); if (!f) return;
        var w = list[+f.dataset.i];
        if (e.target.closest('.ink-view')) {
          openViewer(w.img, w.title, '<p class="p-meta">' + T(w.genre) + ' · ' + w.year + '</p><h3>' + T(w.title) + '</h3>' +
            (w.reveal || []).map(function (p) { return '<p class="cur">' + T(p) + '</p>'; }).join('') + (w.src ? '<p class="p-meta">' + T(w.src) + '</p>' : ''));
          return;
        }
        if (!e.target.closest('.ink-pic')) return;
        var open = !f.classList.contains('open');
        f.classList.toggle('open', open);
        f.querySelector('.ink-pic').setAttribute('aria-pressed', String(open));
        if (open && sound.on) sound.tick();
      });
    }
  };


  /* 1920년대 나팔 축음기 — 나무 상자 · 돌아가는 원판 · 놋쇠 바늘 팔 · 큰 나팔 · 태엽 손잡이
     원판은 납작한 타원(위에서 비스듬히 본 모양)으로 보이게 scale(1,.3) 안에서 돌림 */
  var GRAMO_SVG =
    '<svg class="gramo" viewBox="0 0 540 470" aria-hidden="true">' +
    '<defs>' +
      '<linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a2b"/><stop offset="1" stop-color="#3a2614"/></linearGradient>' +
      '<linearGradient id="gWoodTop" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5532"/><stop offset=".5" stop-color="#8d6339"/><stop offset="1" stop-color="#6b4a2b"/></linearGradient>' +
      '<radialGradient id="gBrass" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#f0d79a"/><stop offset=".45" stop-color="#b8904a"/><stop offset="1" stop-color="#5c4220"/></radialGradient>' +
      '<radialGradient id="gHornIn" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#1a120a"/><stop offset=".55" stop-color="#3e2c16"/><stop offset="1" stop-color="#c9a35e"/></radialGradient>' +
      '<clipPath id="gLabelClip"><circle r="44"/></clipPath>' +
    '</defs>' +
    // 그림자
    '<ellipse cx="270" cy="448" rx="230" ry="14" fill="rgba(0,0,0,.6)"/>' +
    // 나무 상자: 윗면 · 앞면 · 옆면
    '<polygon points="70,300 430,300 480,236 120,236" fill="url(#gWoodTop)" stroke="#2a1a0c"/>' +
    '<rect x="70" y="300" width="360" height="140" fill="url(#gWood)" stroke="#2a1a0c"/>' +
    '<polygon points="430,300 480,236 480,376 430,440" fill="#3a2614" stroke="#2a1a0c"/>' +
    '<rect x="92" y="318" width="316" height="104" fill="none" stroke="rgba(240,215,154,.25)"/>' +
    '<rect x="100" y="326" width="300" height="88" fill="none" stroke="rgba(0,0,0,.35)"/>' +
    // 태엽 손잡이 (옆면)
    '<g class="crank"><circle cx="458" cy="330" r="6" fill="url(#gBrass)"/><path d="M458 330 L500 318 L500 300" stroke="#b8904a" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="494" y="286" width="12" height="18" rx="5" fill="#2a1a0c"/></g>' +
    // 원판 받침 (놋쇠 테)
    '<ellipse cx="270" cy="268" rx="158" ry="44" fill="#2a1a0c"/>' +
    '<ellipse cx="270" cy="266" rx="154" ry="42" fill="none" stroke="url(#gBrass)" stroke-width="2"/>' +
    // 원판 (돌아가는 부분)
    '<g transform="translate(270 264) scale(1 .28)"><g id="gSpin" class="spin">' +
      '<circle r="146" fill="#14100c"/>' +
      Array.apply(null, Array(14)).map(function (_, i) { return '<circle r="' + (138 - i * 6.5) + '" fill="none" stroke="rgba(255,255,255,' + (i % 3 ? .05 : .1) + ')"/>'; }).join('') +
      '<circle r="46" fill="#c9b07a"/>' +
      '<image id="gLabelImg" x="-44" y="-44" width="88" height="88" preserveAspectRatio="xMidYMid slice" clip-path="url(#gLabelClip)"/>' +
      '<text id="gLabelTxt" y="6" text-anchor="middle" font-size="15" font-family="Noto Serif KR, serif" font-weight="900" fill="#1e1913">음반</text>' +
      '<rect x="-3" y="-44" width="6" height="18" fill="#1e1913" opacity=".5"/>' +   // 도는 게 보이게 딱지에 작은 표시
      '<circle r="4" fill="#d9ccb0"/>' +
    '</g></g>' +
    // 원판 위 반사광 (돌지 않음)
    '<path d="M150 252 Q210 236 290 238" stroke="rgba(255,255,255,.12)" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    // 나팔: 상자 뒤에서 솟아 앞으로 벌어짐
    '<path d="M424 240 C440 200 440 170 420 140" stroke="url(#gBrass)" stroke-width="14" fill="none" stroke-linecap="round"/>' +
    '<path d="M420 140 C400 110 330 60 250 40 L210 160 C300 150 380 150 420 150 Z" fill="url(#gBrass)" stroke="#5c4220"/>' +
    '<ellipse cx="226" cy="98" rx="38" ry="64" transform="rotate(18 226 98)" fill="url(#gHornIn)" stroke="#e8cf8e" stroke-width="3"/>' +
    '<g stroke="rgba(92,66,32,.6)" fill="none"><path d="M410 142 C360 120 300 90 246 62"/><path d="M414 147 C360 140 300 135 232 128"/><path d="M412 151 C370 150 320 152 260 156"/></g>' +
    // 바늘 팔 (회전축 = 놋쇠 받침)
    '<g class="arm">' +
      '<path d="M424 246 C410 258 380 268 336 266" stroke="url(#gBrass)" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="330" cy="266" rx="16" ry="9" fill="url(#gBrass)" stroke="#5c4220"/>' +
      '<path d="M326 272 L322 284" stroke="#e8e0cc" stroke-width="2"/>' +
    '</g>' +
    '<circle cx="424" cy="244" r="13" fill="url(#gBrass)" stroke="#5c4220"/>' +
    '</svg>';

  /* 큰 화면 + 현상 렌즈 (미술관 · 안내소 실물 자료가 함께 씀) */
  function openViewer(src, title, sideHTML) {
    var v = $('#viewer');
    v.innerHTML =
      '<div class="v-pic" id="vPic"><img src="' + esc(src) + '" alt=""><span class="lens" id="vLens"></span></div>' +
      '<aside class="v-side">' + sideHTML +
        '<div class="v-tools"><button type="button" id="vColor" aria-pressed="false">' + T({ old: '제 빗으로 보기', now: '원래 색으로 보기' }) + '</button>' +
        '<button type="button" id="vClose">' + T({ old: '다드시오', now: '닫기' }) + '</button></div>' +
        '<p class="v-hint">' + T({ old: '그림 우에 마우스를 대면 렌즈 안만 제 빗이 드러나오', now: '그림 위에 마우스를 대면 렌즈 안만 원래 색이 보입니다' }) + '</p>' +
      '</aside>';
    v.hidden = false;
    bindSwap(v);
    var pic = $('#vPic'), lens = $('#vLens'), img = $('img', pic);
    // 렌즈: 같은 그림을 원래 색으로, 2배로 키워 렌즈 안에 보여 줌
    pic.addEventListener('mousemove', function (e) {
      var r = img.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { lens.style.opacity = 0; return; }
      var Z = 2, R = 80;
      lens.style.opacity = 1;
      lens.style.left = (e.clientX - pic.getBoundingClientRect().left) + 'px';
      lens.style.top = (e.clientY - pic.getBoundingClientRect().top) + 'px';
      lens.style.backgroundImage = 'url("' + img.currentSrc + '")';
      lens.style.backgroundSize = (r.width * Z) + 'px ' + (r.height * Z) + 'px';
      lens.style.backgroundPosition = (-(x * Z - R)) + 'px ' + (-(y * Z - R)) + 'px';
    });
    pic.addEventListener('mouseleave', function () { lens.style.opacity = 0; });
    $('#vColor').addEventListener('click', function () {
      var on = pic.classList.toggle('color'); this.setAttribute('aria-pressed', String(on));
    });
    $('#vClose').addEventListener('click', function () { v.hidden = true; });
    $('#vClose').focus();
  }

  /* 스포티파이 재생기 (공식 iFrame API)
     · 로그인 안 한 사람은 곡마다 30초 미리듣기, 로그인하면 전곡
     · 재생 · 멈춤 소식을 받아 축음기 원판 · 바늘을 맞춰 움직임 */
  var SP = { api: null, ctl: null, wait: [] };
  function spotifyUrl(v) { var u = spotifyUri(v).split(':'); return u.length === 3 ? 'https://open.spotify.com/' + u[1] + '/' + u[2] : '#'; }
  function spotifyUri(v) {
    if (!v) return '';
    var m = String(v).match(/(track|album|playlist)[\/:]([A-Za-z0-9]{10,})/);
    if (m) return 'spotify:' + m[1] + ':' + m[2];
    return /^[A-Za-z0-9]{22}$/.test(v) ? 'spotify:track:' + v : '';
  }
  function mountSpotify(el, uri, onPlay, noAuto) {
    function go(api) {
      if (SP.ctl) { try { SP.ctl.destroy(); } catch (e) {} SP.ctl = null; }
      api.createController(el, { uri: uri, width: '100%', height: 80 }, function (ctl) {
        SP.ctl = ctl;
        ctl.addListener('playback_update', function (e) { onPlay(!e.data.isPaused && !e.data.isBuffering); });
        if (!noAuto && uri.indexOf(':track:') > -1) try { ctl.play(); } catch (e) {}
      });
    }
    if (SP.api) return go(SP.api);
    SP.wait.push(go);
    if (!document.getElementById('spApi')) {
      window.onSpotifyIframeApiReady = function (api) { SP.api = api; SP.wait.splice(0).forEach(function (f) { f(api); }); };
      var sc = document.createElement('script'); sc.id = 'spApi'; sc.src = 'https://open.spotify.com/embed/iframe-api/v1'; sc.async = true;
      sc.onerror = function () { el.innerHTML = '<p class="sp-off">스포티파이에 연결하지 못했소 (인터넷 연결 확인)</p>'; };
      document.body.appendChild(sc);
    }
  }

  // 음원이 없을 때: 오래된 음반의 지직거림 (3초)
  function crackle() {
    try {
      var A = new (window.AudioContext || window.webkitAudioContext)(), len = A.sampleRate * 3, b = A.createBuffer(1, len, A.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() < .002 ? (Math.random() * 2 - 1) * .8 : (Math.random() * 2 - 1) * .02) * (1 - i / len);
      var s = A.createBufferSource(), g = A.createGain(); g.gain.value = .3; s.buffer = b; s.connect(g); g.connect(A.destination); s.start();
      setTimeout(function () { A.close(); }, 3300);
    } catch (e) {}
  }

  /* ── ⑧ 불 켜진 관 · 거리 지도 ───────────────────────────── */
  function drawLit() {
    var n = F.halls.filter(function (h) { return visited(h.id); }).length;
    var bulbs = F.halls.map(function (h) { return '<i class="' + (visited(h.id) ? 'on' : '') + (h.isNew ? ' cool' : '') + '"></i>'; }).join('');
    var all = F.halls.length;                         // 관 수 (지금 네 관)
    var msg = n === 0 ? { old: '아즉 불 켜진 관이 업소', now: '아직 다녀간 관이 없습니다' }
            : n >= all ? { old: NUMW[all] + ' 관 모다 불을 밝혓소 · 경성야록 상점 할인권을 드리오', now: all + '관을 모두 다녀왔습니다 · 경성야록 상점 할인권 지급' }
            : { old: NUMW[all] + ' 관 중 ' + NUMW[n] + ' 관에 불이 드러왓소', now: all + '관 중 ' + n + '곳 다녀옴' };
    $('#lit').innerHTML = '<span class="bulbs" aria-hidden="true">' + bulbs + '</span>' + T(msg);
    bindSwap($('#lit'));
  }
  function buildWhere() {
    $('#where').innerHTML = STOPS.map(function (s, i) { return '<li><button type="button" data-i="' + i + '">' + T(s.label) + '</button></li>'; }).join('');
    $('#where').addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) goStop(+b.dataset.i); });
    bindSwap($('#where'));
  }
  var lastNear = -1;
  function updateWhere() {
    var i = nearestStop();
    if (i === lastNear) return;
    lastNear = i;
    $$('#where button').forEach(function (b, k) { b.classList.toggle('now', k === i); });
    $('#hint').classList.toggle('gone', i > 0);           // 한 걸음 떼면 '아래로 굴리면' 안내는 사라짐
  }


  /* ── ⑨ 소리 (누르면 켜짐 · 아주 작게) ───────────────────── */
  var sound = { on: false, A: null, out: null,
    start: function () {
      try {
        this.A = new (window.AudioContext || window.webkitAudioContext)();
        this.out = this.A.createGain(); this.out.gain.value = 0; this.out.connect(this.A.destination);
        this.out.gain.linearRampToValueAtTime(.03, this.A.currentTime + 1.5);
        var A = this.A, out = this.out;
        [55, 82.4].forEach(function (f, i) { var o = A.createOscillator(); o.type = i ? 'triangle' : 'sine'; o.frequency.value = f; o.connect(out); o.start(); });
        this.on = true;
      } catch (e) {}
    },
    stop: function () { if (this.A) { this.A.close(); this.A = null; } this.on = false; },
    tick: function () {
      if (!this.on || !this.A) return;
      var A = this.A, b = A.createBuffer(1, A.sampleRate * .02, A.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var s = A.createBufferSource(), g = A.createGain(); g.gain.value = .05; s.buffer = b; s.connect(g); g.connect(A.destination); s.start();
    }
  };
  $('#soundBtn').addEventListener('click', function () {
    var b = this;
    if (sound.on) sound.stop(); else sound.start();
    b.setAttribute('aria-pressed', String(sound.on));
    var span = $('.hj', b);
    span.dataset.ko = sound.on ? '소리 끄기' : '소리 켜기';
    span.textContent = sound.on ? '소리 끄기' : '소리 켜기';
  });


  /* ── ⑩ 입장 장면 ────────────────────────────────────────
     메인에서 반권을 뜨드고 오면(?from=main) 입장권 개찰 도장을 찍고,
     깜깜한 화면이 가운데부터 동그랗게 열림 (옛 활동사진의 원형 열림) */
  function entrance() {
    var fromMain = /[?&]from=main/.test(location.search);
    if (fromMain) {
      var d = new Date();
      store.ticket = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      store.ticketType = 'adult'; save();
      $('#gateStamp').hidden = false;
      try { history.replaceState(null, '', location.pathname); } catch (e) {}
    }
    var iris = $('#iris');
    if (REDUCED) { iris.remove(); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { iris.classList.add('open'); }); });
    setTimeout(function () { iris.remove(); }, 2200);
  }


  /* ── ⑪ 시작 ─────────────────────────────────────────────── */
  // 먼 풍경: 1929 경성 조감도 (아주 어둡게)
  // 먼 풍경: assets/expo/mj-far.png(미드저니)가 있으면 그것, 없으면 1929 조감도에서 그림 부분만 잘라 둔 것
  (function () {
    var probe = new Image();
    probe.onload = function () { $('#far').style.backgroundImage = 'url("' + probe.src + '")'; $('#far').classList.add('has-mj'); };
    var tries = ['mj-far.jpg', 'mj-far.png'], k = 0;
    probe.onerror = function () {
      if (k < tries.length) { probe.src = C.assetDir + tries[k++]; return; }
      $('#far').style.backgroundImage = 'url("' + C.assetDir + 'ex-panorama-map.jpg")';
    };
    probe.onerror();
  })();
  // 관 안 배경: assets/expo/mj-hall.png 가 있으면 진열실 벽으로
  (function () {
    var probe = new Image();
    probe.onload = function () { var v = 'url("' + probe.src + '")'; $('#hall').dataset.room0 = v; $('#hall').style.setProperty('--room', v); $('#hall').classList.add('has-mj'); };
    probe.onerror = function () { if (probe.src.slice(-4) === '.jpg') probe.src = C.assetDir + 'mj-hall.png'; };
    probe.src = C.assetDir + 'mj-hall.jpg';
  })();
  // 먼지 알갱이: 가로등 불빛 속을 천천히 떠다님
  (function () {
    var h = '';
    for (var i = 0; i < 26; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (20 + Math.random() * 60).toFixed(1) + '%;animation-delay:' + (-Math.random() * 14).toFixed(1) + 's;animation-duration:' + (10 + Math.random() * 10).toFixed(1) + 's"></i>';
    $('#dust').innerHTML = h;
  })();
  /* ── ⑪ 자정의 회장 순환 전차 ─────────────────────────────
     거리를 전차 창으로 봄: 위엔 차내 안내판, 아래엔 창틀 · 놋쇠 손잡이 · 정거장 단추 · 내리는 줄
     · '다음 정거장' / '앞 정거장' → 전차가 굴러가듯 다음 칸으로 (화살표 키 · 굴리기도 그대로)
     · 서면 안내판: "이번은 ○○이오. 다음은 △△이오."
     · 줄을 당기면 그 정거장에서 내림 (관이면 관 안으로, 출구면 입장권 돌려받기) */
  (function tram() {
    var stage = $('#stage');
    var tr = document.createElement('div');
    tr.className = 'tram'; tr.setAttribute('aria-hidden', 'false');
    tr.innerHTML =
      '<div class="tr-top"><span class="tr-plate">' + T({ old: '회장 순환선', now: '박람회장 순환 전차' }) + '</span>' +
        '<p class="tr-sign" id="trSign" aria-live="polite"></p>' +
        '<span class="tr-straps" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span></div>' +
      '<i class="tr-post l" aria-hidden="true"></i><i class="tr-post r" aria-hidden="true"></i><i class="tr-glass" aria-hidden="true"></i>' +
      '<div class="tr-sill">' +
        '<button type="button" class="tr-btn" id="trPrev">' + T({ old: '◀ 앞 정거장', now: '◀ 이전 정류장' }) + '</button>' +
        '<button type="button" class="tr-cord" id="trCord">' + T({ old: '줄을 당겨 내리시오', now: '줄을 당겨 내리기' }) + '</button>' +
        '<button type="button" class="tr-btn" id="trNext">' + T({ old: '다음 정거장 ▶', now: '다음 정류장 ▶' }) + '</button>' +
      '</div>';
    stage.appendChild(tr);
    bindSwap(tr);
    var sign = $('#trSign'), shown = -1, settleT = null;
    function say(i) {
      var here = STOPS[i], next = STOPS[i + 1];
      var old = '이번은 ' + here.label.old + '이오.' + (next ? ' 다음은 ' + next.label.old + '이오.' : ' 종점이오. 나리실 손님은 입장권을 돌려바드시오.');
      var now = '이번 정류장은 ' + here.label.now + '입니다.' + (next ? ' 다음은 ' + next.label.now + '입니다.' : ' 종점입니다. 입장권을 돌려받으세요.');
      sign.innerHTML = T({ old: old, now: now });
      sign.classList.remove('roll'); void sign.offsetWidth; sign.classList.add('roll');
      bindSwap(sign);
      if (shown !== -1 && sound.on) sound.tick();
      shown = i;
    }
    // 멈춰 섰을 때만 안내 (지나가는 중엔 안내판이 흐려짐)
    (function watch() {
      if (!STOPS.length || !STOPS[0].x && STOPS[0].x !== 0) { requestAnimationFrame(watch); return; }
      var moving = Math.abs(goalX - curX) > 2;
      stage.classList.toggle('riding', moving);
      if (!moving) {
        var i = nearestStop();
        if (i !== shown && Math.abs(STOPS[i].x - curX) < window.innerWidth * .2) say(i);
      }
      requestAnimationFrame(watch);
    })();
    $('#trNext').addEventListener('click', function () { goStop(nearestStop() + 1); });
    $('#trPrev').addEventListener('click', function () { goStop(nearestStop() - 1); });
    $('#trCord').addEventListener('click', function () {
      var c = $('#trCord'); c.classList.remove('pull'); void c.offsetWidth; c.classList.add('pull');
      if (sound.on) sound.tick();
      var st = STOPS[nearestStop()], sec = $('.stop[data-stop="' + st.id + '"]');
      setTimeout(function () {
        if (st.id === 'exit') { showTicket(); return; }
        var go = sec && sec.querySelector('.b-go'); if (go) go.click();
      }, 420);
    });
  })();

  /* ── ⑫ 구멍 뚫린 입장권 ───────────────────────────────────
     관을 다녀올 때마다 차장 펀치로 구멍 하나 · 출구에서 돌려받으면 날짜가 '소화 백일 년 …'
     (실물: 소화 사 년 조선박람회 대인 입장권 사진) */
  var SINO = ['', '일', '이', '삼', '사', '오', '륙', '칠', '팔', '구'];
  function sino(n) { if (n >= 100) return '백' + (n % 100 ? sino(n % 100) : ''); if (n < 10) return SINO[n]; return (n >= 20 ? SINO[Math.floor(n / 10)] : '') + '십' + SINO[n % 10]; }
  function ticketHTML(big) {
    var holes = F.halls.map(function (h, i) {
      return '<i class="tk-hole' + (visited(h.id) ? ' on' : '') + '" style="left:' + (16 + i * 22) + '%" title="' + esc(h.name.now) + '"></i>';
    }).join('');
    var d = new Date();
    var date = { old: '소화 ' + sino(d.getFullYear() - 1925) + ' 년 ' + (d.getMonth() + 1 === 10 ? '시' : sino(d.getMonth() + 1)) + '월 ' + sino(d.getDate()) + '일 · 자정 입장',
                 now: d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (소화 ' + (d.getFullYear() - 1925) + '년) · 자정 입장' };
    return '<div class="tk' + (big ? ' big' : '') + '"><img src="' + C.assetDir + 'ex-ticket-adult.jpg" alt="소화 사 년 조선박람회 대인 입장권">' + holes +
      (big ? '<span class="tk-date">' + T(date) + '</span>' : '') + '</div>';
  }
  function showTicket() {
    var n = F.halls.filter(function (h) { return visited(h.id); }).length;
    var box = $('#ticketOut');
    if (!box) { box = document.createElement('section'); box.id = 'ticketOut'; box.className = 'ticket-out'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); document.body.appendChild(box); }
    box.innerHTML = '<div class="to-in">' +
      '<p class="to-head">' + T({ old: '입장권을 돌려드리오', now: '입장권을 돌려드립니다' }) + '</p>' + ticketHTML(true) +
      '<p class="to-say">' + T(n ? { old: '폐장한 지 ' + sino(new Date().getFullYear() - 1929) + ' 년 되는 회장에, 오늘 밤 ' + NUMW[n] + ' 관을 다녀가섯소.', now: '문 닫은 지 ' + (new Date().getFullYear() - 1929) + '년 된 박람회장에, 오늘 밤 ' + n + '곳을 다녀가셨습니다.' }
                                    : { old: '한 관에도 드지 안코 나가시오? 구멍 업는 입장권은 쓸 데가 업소.', now: '한 곳도 들르지 않고 나가시나요? 구멍 없는 입장권은 쓸모가 없습니다.' }) + '</p>' +
      '<p class="to-src">' + T({ old: '입장권: 소화 사 년 조선박람회 실물 · 날자 고무인은 경성야록 연출', now: '입장권: 1929년 조선박람회 실물 · 날짜 도장은 경성야록 연출' }) + '</p>' +
      '<div class="to-go"><button type="button" class="to-back">' + T({ old: '회장으로 도라가기', now: '박람회장으로 돌아가기' }) + '</button>' +
      '<a href="' + C.mainPage + '">' + T({ old: '본지로 도라가기', now: '본지로 돌아가기' }) + '</a></div></div>';
    bindSwap(box); box.hidden = false;
    setTimeout(function () { box.classList.add('stamped'); }, 900);
    box.querySelector('.to-back').addEventListener('click', function () { box.hidden = true; box.classList.remove('stamped'); });
  }
  // 출구 입간판의 '본지로' 도 먼저 입장권을 돌려줌
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.exit-stop .b-go'); if (!a) return;
    e.preventDefault(); showTicket();
  });
  // 관을 나오면: 아래 작은 입장권에 구멍 하나 '철컥'
  var _drawLit = drawLit;
  drawLit = function () {
    _drawLit();
    var lit = $('#lit'); if (!lit) return;
    lit.insertAdjacentHTML('afterbegin', ticketHTML(false));
  };

  buildStreet();
  buildWhere();
  drawLit();
  bindSwap(document);
  window.scrollTo(0, 0);
  layout();
  window.addEventListener('resize', layout);
  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(frame);
  entrance();
})();
