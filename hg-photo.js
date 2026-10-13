/* 독자 호외 · 사진관 (1012)
   건판 서랍 여섯 칸(괴담 · 일상 · 사건 · 진기 · 인물 · 동물)에서 사진을 골라 호외에 박음
   판짜기: 한 장 / 두 장 / 세 컷 이야기(발단 → 사건 → 반전) · 심령사진 합성 · 사진 설명 다시 뽑기
   사진은 모두 미드저니 재현 사진(hg-photos.js, data URI) — 실제 인물 · 사건 아님 */
(function () {
  'use strict';
  var D = document, PH = window.HG_PHOTOS || {};
  var DRAWERS = [
    { k: 'g', n: '괴담', ids: ['g_well', 'g_room', 'g_bridge', 'g_alley'] },
    { k: 'd', n: '일상', ids: ['d_cafe', 'd_tram', 'd_market', 'd_barber'] },
    { k: 's', n: '사건', ids: ['s_police', 's_fire', 's_steps'] },
    { k: 'w', n: '진기', ids: ['w_baby', 'w_fly', 'w_elephant', 'w_radish'] },
    { k: 'p', n: '인물', ids: ['p_reporter', 'p_moga', 'p_elder', 'p_boy'] },
    { k: 'a', n: '동물', ids: ['a_cat', 'a_ox', 'a_rooster', 'a_dog'] }
  ];
  /* n: 이름 · h: 제목 · c: 사진 설명 · s/e/t: 세 컷일 때 발단 / 사건 / 반전 */
  var M = {
    g_well: { n: '빈집 우물', h: ['빈집 우물에 밧줄 하나 — 누가 내렷나', '자정마다 우물 속에서 대답이 들린다'], c: ['밧줄은 아즉 젓어 잇섯다', '동네 사람들은 「대답하는 우물」이라 부른다', '두레박을 올리니 — 두레박이 업섯다'], s: '북촌 빈집 마당에 오래된 우물이 하나 잇섯다.', e: '자정, 누군가 우물 속으로 밧줄을 내렷다.', t: '그런데 밧줄은 — 우물 안에서 당기고 잇섯다.' },
    g_room: { n: '빈 하숙방', h: ['하숙생 사흘째 행방불명 — 이부자리는 그대로', '문이 혼자 열리는 하숙방'], c: ['이불은 아즉 따뜻하엿다 한다', '주인 왈 「방세는 선불이엇소」', '문틈으로 무엇이 보인다는 제보가 잇섯다'], s: '종로 뒷골목 하숙방에 학생 하나가 살앗다.', e: '사흘째 그 방문이 조금 열린 채 닫히지 안앗다.', t: '방엔 아모도 업고 — 이불만 사람 모양으로 부퍼 잇섯다.' },
    g_bridge: { n: '다리 밑 그림자', h: ['다리 밑에 사흘째 서 잇는 이 — 꼼짝도 안 해', '물속에 선 그림자, 누구의 것인가'], c: ['순사가 불러도 대답이 업섯다', '물은 무릎까지 차 잇섯다', '현상하니 그림자가 하나 더 잇섯다'], s: '청계천 돌다리 밑은 밤이면 아모도 지나지 안는다.', e: '그날 밤, 물속에 누군가 서 잇는 것이 보엿다.', t: '불을 비추니 — 그림자만 잇고 사람은 업섯다.' },
    g_alley: { n: '골목 끗 소복 여인', h: ['골목 끗 소복 여인, 불러도 도라보지 안어', '가스등 아래 흰 옷 — 매일 밤 같은 자리'], c: ['사진사는 이 사진을 찍고 이사를 갓다', '여인은 매일 밤 열두 시에 나타난다 한다', '도라보지 안는 것이 다행이라는 이도 잇다'], s: '본정 뒷골목 끗엔 가스등이 하나 잇다.', e: '자정이면 그 아래 소복 입은 여인이 서 잇다.', t: '사진사가 다가가자 — 여인이 처음으로 고개를 돌렷다.' },
    d_cafe: { n: '모던 다방', h: ['커피 한 잔에 세 시간 — 다방의 신풍경', '축음기 곡조에 손님 일제히 고개 끄덕'], c: ['커피보다 축음기가 더 비싸다 한다', '「모던」은 원래 이러케 안는 것이라 한다', '이 손님들은 아즉 커피를 주문하지 안앗다'], s: '종로 모던 다방에 사람들이 모엿다.', e: '축음기에서 새 노래가 흘러나오자 모두 말을 멈췃다.', t: '노래가 끗나도 — 아모도 커피값을 내지 안앗다.' },
    d_tram: { n: '만원 전차', h: ['전차 지붕까지 사람 — 「다음 차 타시오」 소용업서', '종로 전차, 오늘도 정원 초과'], c: ['차장은 지붕 우 손님에게도 차표를 팔앗다', '내리고 십허도 내릴 수가 업다', '이 중 반은 표가 업다는 소문'], s: '아츰 종로 네거리에 전차가 드러섯다.', e: '타려는 사람이 너무 만하 지붕까지 올라갓다.', t: '전차는 — 한 사람도 내리지 안코 떠낫다.' },
    d_market: { n: '남대문 장', h: ['남대문 장에 닭 도망 소동 — 상인 셋 추격', '흥정 세 시간, 값은 그대로'], c: ['닭값은 흥정할수록 올라간다 한다', '바구니 속 닭이 사진사를 노려보앗다', '오늘 장의 주인공은 단연 닭이엇다'], s: '남대문 장이 열리자 사람들이 몰려들엇다.', e: '바구니에서 닭 한 마리가 뛰쳐나왓다.', t: '닭을 쫏든 상인은 — 엉뚱하게 사진사를 잡앗다.' },
    d_barber: { n: '신식 이발소', h: ['「하이칼라」 시술 중 손님 대경실색', '이발소에 신식 머리 유행 — 거울 압 비명'], c: ['완성된 머리는 본인만 마음에 들어 햇다', '이발사는 「유행이오」 한마디뿐이엇다', '가위 소리가 유난히 길엇다'], s: '종로 이발소에 신식 머리를 하겟다는 손님이 왓다.', e: '가위가 지나갈 때마다 손님 얼굴이 굳어갓다.', t: '거울을 본 손님은 — 모자를 사러 나갓다.' },
    s_police: { n: '파출소 압 군중', h: ['파출소 압 구경꾼 수백 — 무엇을 보앗나', '모다 한곳을 가리키는데 아모것도 업다'], c: ['무엇을 보앗느냐 물으니 모다 대답이 달랏다', '순사도 덩달아 그쪽을 보앗다', '구경꾼 수는 사진을 찍는 사이 두 배가 되엇다'], s: '파출소 압에 사람들이 하나둘 모엿다.', e: '모다 한곳을 가리키며 웅성거렷다.', t: '그런데 그곳엔 — 아모것도 업섯다.' },
    s_fire: { n: '불탄 상뎜', h: ['새벽 상뎜 화재 — 불씨는 어듸서', '탄 자리에서 금고만 멀쩡'], c: ['주인은 「어제 문을 잠갓소」만 되풀이햇다', '구경꾼 중 한 사람이 슬그머니 사라졋다', '불은 꺼졋으나 연긔는 아즉'], s: '새벽, 상뎜 거리에 연긔가 피어올랏다.', e: '날이 밝자 가게 하나가 숫덩이가 되어 잇섯다.', t: '타다 남은 장부엔 — 어제 날자의 마지막 줄이 업섯다.' },
    s_steps: { n: '눈 우 발자국', h: ['발자국은 대문 압에서 끈겻다', '눈 우의 발자국, 나간 것만 잇고 드러온 것은 업다'], c: ['대문은 안에서 잠겨 잇섯다', '발자국 크기가 점점 작어진다는 제보', '이튿날 아츰 발자국은 하나 더 늘엇다'], s: '밤새 눈이 내린 골목에 발자국이 생겻다.', e: '발자국은 한 대문 압까지 이어졋다.', t: '그런데 대문은 — 안에서 잠겨 잇섯다.' },
    w_baby: { n: '우량아 대회', h: ['우량아 대회 성황 — 심사위원 결정 못 해', '올해 경성 최고 우량아는 누구'], c: ['심사 도중 세 명이 동시에 울기 시작햇다', '어머니들의 눈빗이 심사위원보다 매서웟다', '일등 상품은 쌀 한 가마니'], s: '경성 우량아 대회에 아기들이 줄지어 안젓다.', e: '심사위원이 저울을 드는 순간 모다 울음을 터뜨렷다.', t: '일등은 — 끗까지 울지 안은 심사위원에게 갓다.' },
    w_fly: { n: '자작 비행긔', h: ['마당에서 만든 비행긔 — 「래일 날으겟소」', '경성 청년, 대나무로 비행긔 제작'], c: ['발명가는 「날개가 조금 무겁소」라 햇다', '이웃들은 지붕을 단단히 고쳣다', '첫 비행은 「날이 조흐면」이라 한다'], s: '한 청년이 마당에서 비행긔를 만들엇다.', e: '동네 사람들이 모다 모여 날기를 기다렷다.', t: '비행긔는 — 날지 안코 청년만 날앗다.' },
    w_elephant: { n: '박람회 코끼리', h: ['박람회 정문에 코끼리 — 관람객 혼비백산', '코끼리 한 마리, 표 업시 입장'], c: ['코끼리는 표를 내지 안앗다', '사육사는 「산책 중」이라 햇다', '구경꾼 중 제일 놀란 것은 코끼리엿다'], s: '박람회 정문에 사람들이 줄을 섯다.', e: '그 사이로 코끼리 한 마리가 천천히 거러 드러왓다.', t: '코끼리는 — 표 파는 곳 압헤서 멈추어 기다렷다.' },
    w_radish: { n: '대왕 무', h: ['사람만 한 무 출현 — 농부 둘이 겨우 들어', '올해 품평회 일등은 무'], c: ['무를 뽑는 데 사흘이 걸렷다 한다', '깍두기로 담그면 한 동네가 먹는다', '농부는 「비결은 비밀」이라 햇다'], s: '가을 품평회에 농부 둘이 무를 메고 왓다.', e: '무가 너무 커서 심사위원이 올려다보아야 햇다.', t: '일등 상을 받은 무는 — 그날 밤 업서졋다.' },
    p_reporter: { n: '본보 긔자', h: ['본보 긔자, 특종 쫏다 사흘째 귀가 안 해', '안경 쓴 긔자의 마지막 사진'], c: ['그는 「진짜 이약이가 잇소」라는 말을 남겻다', '수첩은 책상 우에 그대로 잇섯다', '편집장은 아즉 그의 원고를 기다린다'], s: '본보 긔자 하나가 특종을 쫏는다며 나갓다.', e: '그날 밤 편집국으로 전화가 한 통 왓다.', t: '수화긔 저편에서 — 그의 목소리가 원고를 불러 주엇다.' },
    p_moga: { n: '모던 껄', h: ['모던 껄 단발 사진, 장안의 화제', '종로를 거르면 모다 도라본다'], c: ['단발은 어제 햇다 한다', '모자는 동경에서 왓다는 소문', '사진관 주인이 이 사진을 진열장에 걸엇다'], s: '종로 사진관에 단발한 모던 껄이 드러섯다.', e: '사진이 진열장에 걸리자 사람들이 몰려들엇다.', t: '사진 속 주인공은 — 사진관에 다시 오지 안앗다.' },
    p_elder: { n: '갓 쓴 노인', h: ['백 세 노인 왈 「신문은 거꾸로 읽어야 재미잇소」', '장죽 문 노인의 경성 구경담'], c: ['노인은 전차를 「쇠 소」라 불럿다', '장죽은 칠십 년째 가튼 것이라 한다', '사진 찍는 동안 담배 한 대를 다 피웟다'], s: '갓 쓴 노인이 처음으로 경성 구경을 나왓다.', e: '전차를 보고는 「쇠 소가 사람을 끈다」 하엿다.', t: '노인은 — 전차를 타지 안코 거러서 따라갓다.' },
    p_boy: { n: '보통학교 아이', h: ['보통학교 학생, 숙제 대신 신문 투고', '이 아이가 웃는 이유'], c: ['아이는 「선생님한텐 비밀」이라 햇다', '도시락은 이미 먹엇다 한다', '모자는 형의 것이라 한다'], s: '보통학교 아이 하나가 신문사를 차저왓다.', e: '「제가 본 이상한 일을 실어 주시오」 하엿다.', t: '아이가 말한 이상한 일은 — 바로 이 신문이엇다.' },
    a_cat: { n: '인쇄소 고양이', h: ['인쇄소 고양이, 오늘도 신문 우에서 근무', '검은 고양이, 활자 하나 물고 잠적'], c: ['고양이는 신문을 읽는 척햇다', '이 고양이 압헤선 오자가 업다 한다', '사진사를 끗까지 노려보앗다'], s: '인쇄소 신문 더미 우에 검은 고양이가 안젓다.', e: '고양이가 사라진 뒤 「ㄱ」 활자가 업서졋다.', t: '이튿날 신문엔 — 「ㄱ」이 하나도 업섯다.' },
    a_ox: { n: '소달구지', h: ['문 압 교통 정체 — 원인은 소 한 마리', '소달구지, 성문을 막고 움직이지 안어'], c: ['소는 전차보다 먼저 지나갈 권리가 잇다 주장햇다', '주인은 소를 설득하는 중이엇다', '뒤에 선 전차 운전수는 한숨만 쉬엇다'], s: '아츰 성문 압으로 소달구지가 드러섯다.', e: '소가 문 한가운데서 멈추어 움직이지 안앗다.', t: '한 시간 뒤 — 소는 혼자 도라서 집에 갓다.' },
    a_rooster: { n: '정류장 닭', h: ['전차 정류장 표지판 우에 닭 — 「다음 역」 알려', '닭 한 마리, 정류장을 점거'], c: ['닭은 전차가 올 때마다 울엇다', '승객들은 닭 덕분에 늦지 안앗다 한다', '닭의 주인은 아즉 나타나지 안앗다'], s: '전차 정류장 표지판 우에 닭이 올라앗젓다.', e: '전차가 올 때마다 닭이 크게 울엇다.', t: '정류장 사람들은 — 이제 시계 대신 닭을 본다.' },
    a_dog: { n: '모자 쓴 개', h: ['모자 쓴 개, 가게 문을 지켜', '이 집 주인은 개라는 소문'], c: ['개는 손님이 오면 모자를 살짝 벗는다 한다', '가게 주인은 「내가 아니라 개가 사장」이라 햇다', '모자는 개가 직접 골랏다'], s: '한 가게 문 압에 모자 쓴 개가 안저 잇섯다.', e: '손님이 드러오려 하자 개가 고개를 저엇다.', t: '알고 보니 — 그날은 가게가 쉬는 날이엇다.' }
  };
  var SPIRITS = [{ k: '', n: '업슴' }, { k: 'sp_woman', n: '흰 여인' }, { k: 'sp_face', n: '얼굴' }, { k: 'sp_hand', n: '손' }];
  var LAYOUTS = [{ k: 1, n: '한 장' }, { k: 2, n: '두 장' }, { k: 3, n: '세 컷 이야기' }];
  var ST = { layout: 1, picks: [], spirit: '', seed: 0, drawer: 'g' };
  function src(id, v) { var a = PH[id]; return a ? a[(v || 0) % a.length] : ''; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pick(a, n) { return a[Math.abs(n) % a.length]; }

  /* ── 작업대 「사진관」 칸 ── */
  var box;
  function build() {
    var desk = D.querySelector('.h2-desk'), after = D.querySelector('.h2-desk .ph-type'); if (!desk || !after) return;
    box = D.createElement('section'); box.className = 'h2-part hp-part'; box.id = 'hpPart';
    box.innerHTML =
      '<h2><b>사진</b><span>사진관 · 건판 서랍</span></h2>' +
      '<div class="hp-tabs" role="tablist">' + DRAWERS.map(function (d) { return '<button type="button" role="tab" data-d="' + d.k + '">' + d.n + '</button>'; }).join('') + '</div>' +
      '<div class="hp-grid" id="hpGrid"></div>' +
      '<div class="hp-row"><span class="hp-l">판짜기</span>' + LAYOUTS.map(function (l) { return '<button type="button" data-l="' + l.k + '">' + l.n + '</button>'; }).join('') + '</div>' +
      '<div class="hp-slots" id="hpSlots"></div>' +
      '<div class="hp-row"><span class="hp-l">심령 합성</span>' + SPIRITS.map(function (s) { return '<button type="button" data-s="' + s.k + '">' + s.n + '</button>'; }).join('') + '</div>' +
      '<div class="hp-row hp-act"><button type="button" id="hpRand">아모거나 세 컷</button><button type="button" id="hpCap">사진 설명 다시</button><button type="button" id="hpClear">사진 빼기</button></div>' +
      '<p class="hp-note">사진은 모다 재현 사진이오 (실제 인물 · 사건 아님).</p>';
    after.parentNode.insertBefore(box, after.nextSibling);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.d) { ST.drawer = b.dataset.d; paint(); return; }
      if (b.dataset.l) { ST.layout = +b.dataset.l; while (ST.picks.length > ST.layout) ST.picks.shift(); changed(); return; }
      if (b.dataset.s != null && b.closest('.hp-row')) { ST.spirit = b.dataset.s; changed(); return; }
      if (b.dataset.id) { toggle(b.dataset.id, +b.dataset.v); return; }
      if (b.dataset.rm != null) { ST.picks.splice(+b.dataset.rm, 1); changed(); return; }
      if (b.id === 'hpRand') { random3(); return; }
      if (b.id === 'hpCap') { ST.seed++; changed(); return; }
      if (b.id === 'hpClear') { ST.picks = []; ST.spirit = ''; changed(); return; }
    });
    paint();
  }
  function toggle(id, v) {
    var i = ST.picks.findIndex(function (p) { return p.id === id && p.v === v; });
    if (i > -1) ST.picks.splice(i, 1);
    else { ST.picks.push({ id: id, v: v }); while (ST.picks.length > ST.layout) ST.picks.shift(); }
    changed();
  }
  function random3() {
    var ds = DRAWERS.slice().sort(function () { return Math.random() - .5; }).slice(0, 3);
    ST.layout = 3; ST.picks = ds.map(function (d) { return { id: pick(d.ids, Math.floor(Math.random() * 9)), v: Math.floor(Math.random() * 2) }; });
    ST.seed = Math.floor(Math.random() * 9); changed();
  }
  function paint() {
    if (!box) return;
    [].forEach.call(box.querySelectorAll('[data-d]'), function (b) { b.setAttribute('aria-selected', b.dataset.d === ST.drawer); });
    [].forEach.call(box.querySelectorAll('[data-l]'), function (b) { b.setAttribute('aria-pressed', +b.dataset.l === ST.layout); });
    [].forEach.call(box.querySelectorAll('.hp-row [data-s]'), function (b) { b.setAttribute('aria-pressed', b.dataset.s === ST.spirit); });
    var dr = DRAWERS.filter(function (d) { return d.k === ST.drawer; })[0], h = '';
    dr.ids.forEach(function (id) { (PH[id] || []).forEach(function (_, v) {
      var on = ST.picks.some(function (p) { return p.id === id && p.v === v; });
      h += '<button type="button" class="hp-th' + (on ? ' on' : '') + '" data-id="' + id + '" data-v="' + v + '" title="' + esc(M[id].n) + '"><img alt="' + esc(M[id].n) + '" src="' + src(id, v) + '"><i>' + esc(M[id].n) + '</i></button>';
    }); });
    D.getElementById('hpGrid').innerHTML = h;
    var lab = ST.layout === 3 ? ['一 발단', '二 사건', '三 반전'] : ST.layout === 2 ? ['우', '아래'] : ['사진'], sh = '';
    for (var i = 0; i < ST.layout; i++) {
      var p = ST.picks[i];
      sh += '<span class="hp-slot' + (p ? ' on' : '') + '"><b>' + lab[i] + '</b>' + (p ? '<img alt="" src="' + src(p.id, p.v) + '"><button type="button" data-rm="' + i + '" aria-label="빼기">×</button>' : '<em>서랍에서 고르시오</em>') + '</span>';
    }
    D.getElementById('hpSlots').innerHTML = sh;
  }
  function changed() { paint(); if (window.ykHgLive) window.ykHgLive(); }

  /* ── 호외에 실을 사진 정보 (compose 가 부름) ── */
  function snapshot(noWords, seed) {
    if (!ST.picks.length) return null;
    var ps = ST.picks.slice(0, ST.layout), L = ST.layout === 3 && ps.length === 3 ? 3 : Math.min(ps.length, 2), sd = ST.seed + (seed || 0);
    if (ST.layout === 3 && ps.length < 3) L = ps.length;
    var caps = ps.map(function (p, i) {
      var m = M[p.id];
      if (L === 3) return [m.s, m.e, m.t][i];
      return pick(m.c, sd + i);
    });
    if (ST.spirit) { var li = caps.length - 1; caps[li] = caps[li] + ' — 현상하니, 찍을 때 업던 것이 함께 박혀 잇섯다.'; }
    var head = null;
    if (noWords) {
      var m0 = M[ps[0].id];
      head = L === 3 ? pick([m0.n + '에서 시작된 일, ' + M[ps[2].id].n + '에서 끗나다', m0.n + ' · ' + M[ps[1].id].n + ' · ' + M[ps[2].id].n + ' — 세 장의 사진이 말하는 것'], sd) : pick(m0.h, sd);
      if (ST.spirit) head = '【심령사진】 ' + head;
    }
    return { l: L, ids: ps.map(function (p) { return [p.id, p.v]; }), sp: ST.spirit ? [ST.spirit, sd % 2] : null, caps: caps, head: head };
  }

  /* ── 지면(화면)에 그리기 ── */
  function render(d) {
    var fig = D.getElementById('hgFig'), art = D.getElementById('hgArt'), cap = D.getElementById('hgCap'), sheet = D.getElementById('hgSheet');
    var strip = D.getElementById('hpStrip');
    if (!strip) { strip = D.createElement('div'); strip.id = 'hpStrip'; strip.className = 'hp-strip'; var sub = D.getElementById('hgSub'); sub.parentNode.insertBefore(strip, sub.nextSibling); }
    var p = d && d.ph;
    sheet.classList.toggle('hp-3', !!(p && p.l === 3));
    strip.innerHTML = ''; strip.hidden = true; fig.hidden = false;
    if (!p) return false;
    var spi = p.sp ? '<img class="hp-spirit" alt="" src="' + src(p.sp[0], p.sp[1]) + '">' : '';
    if (p.l === 3) {
      fig.hidden = true; strip.hidden = false;
      strip.innerHTML = p.ids.map(function (x, i) {
        return '<figure><span class="hp-ph"><img alt="" src="' + src(x[0], x[1]) + '">' + (i === 2 ? spi : '') + '</span><figcaption><b>' + ['一 · 발단', '二 · 사건', '三 · 반전'][i] + '</b>' + esc(p.caps[i] || '') + '</figcaption></figure>';
      }).join('') + '<p class="hp-cr">사진 · 재현 (경성야록 사진관)</p>';
    } else {
      art.className = 'sh-art hp-art l' + p.l;
      art.innerHTML = p.ids.map(function (x, i) { return '<span class="hp-ph"><img alt="" src="' + src(x[0], x[1]) + '">' + (i === 0 ? spi : '') + '</span>'; }).join('');
      cap.textContent = p.caps.join(' / ') + ' (사진 · 재현)';
    }
    return true;
  }

  /* ── 그림 저장(캔버스)용: 이미지 미리 읽기 ── */
  function load(p) {
    if (!p) return Promise.resolve(null);
    function img(s) { return new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = s; }); }
    return Promise.all(p.ids.map(function (x) { return img(src(x[0], x[1])); }).concat([p.sp ? img(src(p.sp[0], p.sp[1])) : Promise.resolve(null)])).then(function (a) {
      return { l: p.l, imgs: a.slice(0, p.ids.length), sp: a[a.length - 1], caps: p.caps };
    });
  }
  /* 한 칸에 사진 한 장 (옛 신문 사진처럼 바래고 거칠게) */
  function photo(x, im, sp, ax, ay, w, h, spOn) {
    x.save(); x.beginPath(); x.rect(ax, ay, w, h); x.clip();
    if (im) {
      try { x.filter = 'grayscale(1) sepia(.35) contrast(1.15)'; } catch (e) {}
      var r = Math.max(w / im.width, h / im.height), iw = im.width * r, ih = im.height * r;
      x.drawImage(im, ax + (w - iw) / 2, ay + (h - ih) / 2, iw, ih);
      x.filter = 'none';
      if (sp && spOn) { x.globalCompositeOperation = 'screen'; x.globalAlpha = .7; var sr = h * .95 / sp.height, sw = sp.width * sr; x.drawImage(sp, ax + w * .62 - sw / 2, ay + h * .03, sw, sp.height * sr); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
      /* 망점 · 거친 입자 */
      x.globalAlpha = .08; for (var i = 0; i < w * h / 900; i++) { x.fillStyle = Math.random() < .5 ? '#000' : '#fff'; x.fillRect(ax + Math.random() * w, ay + Math.random() * h, 2, 2); } x.globalAlpha = 1;
    }
    x.restore();
    x.lineWidth = 2; x.strokeRect(ax, ay, w, h);
  }

  window.HGP = { snapshot: snapshot, render: render, load: load, photo: photo, state: ST };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', build); else build();
})();
