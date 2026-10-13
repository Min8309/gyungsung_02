/* 독자 호외 v2 — 팀원이 만든 「독자가 만드는 호외」를 본지 꼴로
   작업대: 활자 서랍(주제) · 종이(지면 꼴) · 잉크(분위기) · 원고(낱말/직접) · 윤전기 손잡이
   지면: 고르는 대로 바로 바뀜 · 「제목 다시 뽑기」 · 찍은 뒤 글자를 눌러 고침
   찍은 뒤: 널기(본지 빨랫줄) · 간직(PNG) · 공유(그림 복사 → 카톡 Ctrl+V / 링크 복사 / 휴대폰 공유 창)
   링크: hogoe.html#h=… 에 호외 내용을 담음 → 받은 사람이 열면 그 호외가 그대로 보임
   글은 AI 없이 틀로 엮음 · 독자 창작이며 실제 사건이 아님을 지면에 박음
   삽화: window.HG_ART[주제] (hg-art.js, 그림을 글자로 담아 둔 것) 가 있으면 넣고, 없으면 빗금 판 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (window.matchMedia && matchMedia('(hover: hover)').matches) {
    var gloss = function (el, on) {
      if (!el.dataset.ko) return;
      if (on) { if (el.dataset.old == null) el.dataset.old = el.innerHTML; el.innerHTML = el.dataset.ko; el.classList.add('gloss'); }
      else if (el.dataset.old != null) { el.innerHTML = el.dataset.old; el.classList.remove('gloss'); }
    };
    document.addEventListener('mouseover', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, true); });
    document.addEventListener('mouseout', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, false); });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pick(a, seed) { return a[Math.abs(seed) % a.length]; }

  /* 날짜 · 호수 */
  var HN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  function hn(n) { var t = Math.floor(n / 10), o = n % 10; return (t ? (t > 1 ? HN[t] : '') + '十' : '') + (HN[o] || (n === 0 ? '〇' : '')); }
  var now = new Date(), Y = now.getFullYear() - 90;
  var KN = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']; function kn(n) { var t = Math.floor(n / 10), o = n % 10; return ((t ? (t > 1 ? KN[t] : '') + '십' : '') + KN[o]) || '영'; }
  var DATE = '소화 ' + kn(Y - 1925) + '년 ' + kn(now.getMonth() + 1) + '월 ' + kn(now.getDate()) + '일';
  var DATE_KO = Y + '년 ' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일';
  function load() { try { return JSON.parse(localStorage.getItem('yk-hogoe') || '[]') || []; } catch (e) { return []; } }
  function issueNo() { return '제 ' + kn(load().length + 1) + ' 호'; }

  var S = { topic: 'mystery', style: 'classic', tone: 'serious', mode: 'kw', seed: 0 };
  var ACC = { serious: '#1e1913', tense: '#6a2219', tender: '#34475a', funny: '#8a4a21' };
  var SUGG = {
    mystery: ['자정', '골목', '그림자', '우물', '전차', '종소리', '인형'],
    daily: ['다방', '전차', '야시장', '우산', '백화점', '단팥죽', '모자'],
    history: ['라디오', '전등', '정거장', '극장', '시계탑', '자전거', '활동사진'],
    free: ['고양이', '편지', '달', '김치볶음밥', '짝꿍', '구두', '비']
  };
  var PLACE = { mystery: ['남산 밋 골목', '청계천 다리 아래', '북촌 빈집 압'], daily: ['종로 네거리', '본정 다방 안', '남대문 시장'], history: ['경성역 대합실', '광화문 통', '단성사 압'], free: ['경성 어느 동리', '한강 인도교 우', '어느 집 마루'] };
  var KICK = { classic: '사회 · 독자 투고', horror: '괴담 · 자정 이후', breaking: '특보 · 속보' };
  var SUB = {
    serious: ['— 본보 긔자 현장을 차저 사실 여부를 캐다', '— 경찰서 「아즉은 아모 말도 할 수 업다」', '— 동리 로인 「내 평생 처음 보는 일」'],
    tense: ['— 목격자 「다시는 그 길로 가지 안켓다」', '— 그날 밤 뒤로 개가 짓지 안는다 함', '— 사흘째 아모도 그 자리에 가지 안어'],
    tender: ['— 그날 밤 남은 것은 한 사람의 이약이뿐', '— 「꼭 다시 오겟다」는 말만 남기고', '— 동리 사람들 말업시 고개를 숙이다'],
    funny: ['— 구경꾼 수백, 순사도 우슴을 참지 못하다', '— 당사자 「별일 아니오」 한마듸', '— 근처 엿장수만 큰 재미를 보다']
  };
  var HEAD = {
    classic: [function (a, b) { return b ? a + ', ' + josa(b, '으로', '로') + ' 장안이 술렁이다' : josa(a, '으로', '로') + ' 장안이 술렁이다'; },
      function (a, b) { return a + (b ? '과 ' + b : '') + ' — 사흘 동안의 수수께끼'; },
      function (a, b) { return '「' + a + '」 한 마듸에 ' + (b ? b + ' 동리가' : '온 동리가') + ' 발칵'; }],
    horror: [function (a, b) { return '자정의 ' + a + ', ' + (b ? josa(b, '을', '를') + ' 보앗다는 이 속출' : '그 뒤로 아모도 보지 못햇다'); },
      function (a, b) { return a + ' 압헤서 ' + (b ? b + ' 소리가' : '누가') + ' 세 번 불럿다'; },
      function (a, b) { return '아모도 업는 ' + a + (b ? ', ' + josa(b, '이', '가') + ' 혼자 움즉이다' : '에 불이 켜지다'); }],
    breaking: [function (a, b) { return josa(a, '이', '가') + ' 돌연 ' + (b ? b + ' 소동' : '대소동') + '! 시내 발칵'; },
      function (a, b) { return '속보 — ' + a + (b ? '와 ' + b : '') + ', 경성을 뒤집다!'; },
      function (a, b) { return a + ' 사건, 마츰내 ' + (b ? josa(b, '이', '가') + ' 입을 열다!' : '진상 드러나다!'); }]
  };
  var NOKW = { classic: '경성에 전해진 새 이약이', horror: '자정 넘어 들려온 이상한 소문', breaking: '경성에 뜻밧긔 일이 터지다!' };
  var TONE_LINE = {
    serious: '본보 긔자가 그 자리를 차저가 보니 소문과 사실이 반씩 석겨 잇섯다.',
    tense: '이 말을 들은 동리 사람들은 그날부터 해가 지면 문을 걸어 잠근다 한다.',
    tender: '이약이를 마친 독자는 한참이나 창밧글 내다보앗다 한다.',
    funny: '이 소문이 돌자 구경꾼이 몰녀 근처 엿장수만 큰 재미를 보앗다 한다.'
  };
  var WIT = {
    serious: ['「눈으로 똑똑히 보앗소. 그런데 말하기가 좀 그러오.」 — 근처 상인', '「처음엔 헛것인 줄 아랏지.」 — 동리 로인', '「본보에 알린 건 내가 처음이오.」 — 인력거꾼'],
    tense: ['「뒤도 돌아보지 말고 뛰엇소.」 — 지나던 학생', '「그 뒤로 밤엔 창문을 안 여오.」 — 이웃 부인', '「소리가… 아즉도 귀에 남앗소.」 — 야경꾼'],
    tender: ['「그 사람, 우스며 손을 흔들엇소.」 — 다방 마담', '「다시 오겟다 햇소. 나는 기다리오.」 — 하숙집 주인', '「그날 달이 유난히 밝앗소.」 — 우편배달부'],
    funny: ['「나는 엿만 팔앗을 뿐이오.」 — 엿장수 김 씨', '「우리 집 개가 먼저 알앗소.」 — 개 주인', '「구경 한번 잘햇소. 또 하시오?」 — 구경꾼']
  };
  var CLOSE = { classic: '본보는 이 일을 계속 아라보는 중이다.', horror: '밤길에 혼자 나서는 일은 삼가기를 바란다. 특히 자정 넘어서는.', breaking: '자세한 소식은 다음 호외로 알리겟다.' };
  var WEATHER = {
    mystery: ['흐리고 곳에 따라 소문. 자정 넘어 한기.', '안개. 골목 끗이 잘 안 보이겟음.', '바람 업슴. 그런데 문풍지가 떨림.'],
    daily: ['맑음. 단, 다방 안은 담배 연기로 흐림.', '오후 한때 소나기 — 우산 단속을.', '쾌청. 빨래 널기 조흔 날.'],
    history: ['구름 조금. 라듸오 잡음 만흠.', '맑다가 흐림. 전차 늣을 듯.', '바람 강함. 모자 단속을.'],
    free: ['맑음, 때때로 엉뚱함.', '흐림. 기분은 맑음.', '달 밝음. 산책 권함.']
  };
  var ADS = {
    mystery: ['◇ 겁 만흔 이를 위한 야광 우산 — 종로 이정목', '◇ 자정 넘어도 끄떡업는 등불 — 본정 ○○상회', '◇ 부적 아님. 그냥 조흔 종이 — 지물포'],
    daily: ['◇ 단팥죽 한 그릇 오 전 — 관철동 ○○당', '◇ 비 올 때 빌려 드림. 우산 — 다방 「자정」', '◇ 소문 잘 퍼지는 확성기 — 경성 ○○상회'],
    history: ['◇ 라듸오 수리 — 잡음은 덤', '◇ 활동사진 상영 중 — 단성사, 불을 끄고 보시압', '◇ 정확한 시계, 대개는 — 시계포'],
    free: ['◇ 아모거나 팜 — 무엇이든 상회', '◇ 고양이 차즘 — 「ㄱ」 활자를 물고 감', '◇ 이 칸 비엇소. 광고 문의 환영']
  };
  var FORTUNE = ['남쪽으로 가면 조흔 일. 북쪽은 아즉 모름.', '오늘 맛나는 첫 사람에게 친절하시오.', '우산을 챙기시오. 비가 안 와도.', '자정 전에 잠들면 운이 조흠.', '일허버린 물건이 도라오는 날.', '말 한마듸가 소문이 되는 날 — 조심.'];

  function josa(w, a, b) { if (!w) return w; var c = w.charCodeAt(w.length - 1); if (c < 0xac00 || c > 0xd7a3) return w + a; return w + (((c - 0xac00) % 28) ? a : b); }
  function words() {
    if (S.mode === 'kw') return $('#hgKw').value.split(/[,，、·\s]+/).map(function (w) { return w.trim(); }).filter(Boolean).slice(0, 4);
    var m = ($('#hgStory').value.match(/[가-힣A-Za-z0-9]{2,}/g) || []).filter(function (w) { return !/^(오늘|어제|그리고|그런데|그래서|정말|너무|했다|하고|있다|없다|싶다고|먹고|내가|나는|우리|이제|진짜)$/.test(w); });
    return m.map(function (w) { return w.replace(/(에서|으로|에게|까지|부터|이라|이가|이는|이를|엔|이|가|은|는|을|를|에|의|도|로|와|과|랑)$/, ''); })
      .filter(function (w) { return w.length > 1 && !/(다|고|서|면|며|지|게|요|데)$/.test(w); }).slice(0, 2);
  }
  function story() { return $('#hgStory').value.trim(); }
  var TOPIC_KO = { mystery: '괴담', daily: '경성의 일상', history: '세상 소식', free: '자유 투고' };

  function compose() {
    var k = words(), a = k[0], b = k[1], sd = S.seed;
    var place = pick(PLACE[S.topic], sd);
    var head = a ? pick(HEAD[S.style], sd)(a, b) : NOKW[S.style];
    var ph = window.HGP ? HGP.snapshot(!a && !(S.mode === 'story' && story()), 0) : null; if (ph && ph.head) head = ph.head;
    var p1 = '【경성】 ' + DATE_KO + ' 밤, ' + place + '에서 ' + (a ? a + '에 관한 ' : '') + '이상한 소식이 본사에 날아드럿다.';
    var p2 = S.mode === 'story' && story()
      ? '소식을 전한 독자의 말을 그대로 옴기면 이러하다. 「' + story() + '」'
      : (k.length ? '소식을 전한 독자에 의하면 「' + k.join(' · ') + '」 — 이 몃 마디가 사건의 전부라 한다.' : '소식을 전한 독자는 끗내 자세한 말을 하지 안앗다 한다.');
    var p3 = TONE_LINE[S.tone] + ' ' + CLOSE[S.style];
    var wit = pick(WIT[S.tone], sd + 3);
    var name = $('#hgName').value.trim() || '아무개';
    return {
      style: S.style, tone: S.tone, topic: S.topic, kick: KICK[S.style], head: head, sub: pick(SUB[S.tone], sd), body: [p1, p2, wit, p3],
      cap: '삽화 · ' + TOPIC_KO[S.topic] + ' · 재현 그림', w: pick(WEATHER[S.topic], sd + 1), ad: pick(ADS[S.topic], sd + 2), f: pick(FORTUNE, sd + name.length),
      by: '투고 · ' + name + '생', no: issueNo(), ph: ph
    };
  }

  var sheet = $('#hgSheet'), printed = false, cur = null;
  function art(topic) { return window.HG_ART && window.HG_ART[topic]; }
  function render(d) {
    cur = d;
    sheet.className = 'sh ' + d.style + (printed ? ' done' : '');
    sheet.style.setProperty('--acc', d.style === 'horror' ? '#c9a46a' : (ACC[d.tone] || '#1e1913'));
    $('#hgNo').textContent = d.no; $('#hgDate').textContent = DATE;
    $('#hgKick').textContent = d.kick; $('#hgHead').textContent = d.head; $('#hgSub').textContent = d.sub;
    $('#hgBody').innerHTML = d.body.map(function (p) { return '<p' + (/^「/.test(p) ? ' class="wit"' : '') + '>' + esc(p) + '</p>'; }).join('');
    var A = $('#hgArt'), src = art(d.topic);
    A.className = 'sh-art' + (src ? '' : ' none'); A.innerHTML = src ? '<img alt="" src="' + src + '">' : '';
    $('#hgCap').textContent = d.cap; if (window.HGP) HGP.render(d); $('#hgW').textContent = d.w; $('#hgAd').textContent = d.ad; $('#hgF').textContent = d.f; $('#hgBy').textContent = d.by;
  }
  function live() { if (printed) return; render(compose()); }
  window.ykHgLive = function () { unprint(); live(); };
  function readSheet() {
    var d = {}; for (var k in cur) d[k] = cur[k];
    d.head = $('#hgHead').textContent.trim(); d.sub = $('#hgSub').textContent.trim();
    d.body = $$('#hgBody p').map(function (p) { return p.textContent.trim(); }).filter(Boolean);
    return d;
  }

  /* 작업대 */
  $$('[data-k]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-v]'); if (!b) return;
      $$('button[data-v]', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      S[g.dataset.k] = b.dataset.v; if (g.dataset.k === 'topic') sugg();
      unprint(); live();
    });
  });
  $$('.ms-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      S.mode = b.dataset.mode;
      $$('.ms-tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $$('.ms').forEach(function (x) { x.hidden = x.dataset.for !== S.mode; });
      unprint(); live();
    });
  });
  function sugg() { $('#hgSugg').innerHTML = SUGG[S.topic].map(function (w) { return '<button type="button">' + w + '</button>'; }).join(''); }
  $('#hgSugg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var kw = $('#hgKw'), list = kw.value.split(/[,，]/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (list.indexOf(b.textContent) < 0 && list.length < 4) list.push(b.textContent);
    kw.value = list.join(', '); unprint(); live();
  });
  ['#hgKw', '#hgStory', '#hgName'].forEach(function (s) { $(s).addEventListener('input', function () { if (s === '#hgStory') $('#hgCnt').textContent = $(s).value.length; unprint(); live(); }); });
  $('#hgReroll').addEventListener('click', function () {
    S.seed++;
    if (printed) { var d = compose(); $('#hgHead').textContent = d.head; $('#hgSub').textContent = d.sub; cur.head = d.head; cur.sub = d.sub; }
    else live();
  });

  /* 찍기 */
  var proof = $('#hgProof'), lever = $('#hgPress');
  function editable(on) { ['#hgHead', '#hgSub', '#hgBody'].forEach(function (s) { $(s).contentEditable = on ? 'true' : 'false'; }); }
  function unprint() {
    if (!printed) return; printed = false; editable(false); sheet.classList.remove('done', 'censored');
    $('#hgAfter').hidden = true; say('');
    $('#hgLab').textContent = '교정쇄 · 고르는 대로 바뀌오';
  }
  /* 소리: 윤전기 덜컹 + 종이 스치는 소리 (브라우저가 직접 만듦) · 다 찍히면 신문팔이 「호외요!」 */
  var AC = window.AudioContext || window.webkitAudioContext, actx = null;
  function sfxPress() {
    if (!AC || !$('#hgSnd').checked) return;
    try {
      actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
      var t = actx.currentTime, len = 1.35, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), ch = buf.getChannelData(0);
      for (var i = 0; i < ch.length; i++) { var x = i / actx.sampleRate; ch[i] = (Math.random() * 2 - 1) * (.35 + .65 * Math.abs(Math.sin(x * Math.PI * 7))) * Math.min(1, x * 8) * Math.min(1, (len - x) * 3); }
      var src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = .7; g.gain.value = .16;
      src.connect(f); f.connect(g); g.connect(actx.destination); src.start(t);
      for (var k = 0; k < 7; k++) { var o = actx.createOscillator(), og = actx.createGain(); o.type = 'square'; o.frequency.value = 70 + (k % 2) * 12; og.gain.setValueAtTime(0, t + k * .19); og.gain.linearRampToValueAtTime(.05, t + k * .19 + .01); og.gain.exponentialRampToValueAtTime(.0008, t + k * .19 + .09); o.connect(og); og.connect(actx.destination); o.start(t + k * .19); o.stop(t + k * .19 + .1); }
    } catch (e) {}
  }
  function cry() {
    if (!$('#hgSnd').checked || !window.speechSynthesis) return;
    try {
      var v = speechSynthesis.getVoices().filter(function (x) { return /^ko/i.test(x.lang); })[0];
      if (!v) return;
      var u = new SpeechSynthesisUtterance('호외요, 호외! ' + ($('#hgHead').textContent || '').slice(0, 26));
      u.voice = v; u.lang = v.lang; u.rate = 1.12; u.pitch = 1.35; u.volume = .8; speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  }
  if (window.speechSynthesis) try { speechSynthesis.getVoices(); } catch (e) {}
  lever.addEventListener('click', function () {
    lever.disabled = true; printed = false; live(); sfxPress();
    lever.classList.remove('go'); void lever.offsetWidth; lever.classList.add('go');
    proof.classList.remove('printing'); void proof.offsetWidth; proof.classList.add('printing');
    setTimeout(function () {
      proof.classList.remove('printing'); lever.disabled = false; lever.classList.remove('go');
      printed = true; editable(true); sheet.classList.add('done');
      $('#hgAfter').hidden = false; $('#hgLab').textContent = '찍혓소 · 글자를 눌러 고칠 수 잇소';
      $('#hgAfter').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      cry();
    }, 1450);
  });
  /* 검열관 — 본문에서 한 대목을 먹으로 지우고 「削除」 도장. 1930년대 신문의 실제 풍경을 장난스럽게 */
  var CENS_SAY = ['검열관이 다녀갓소. 「이 대목은 불온하다」 하오.', '검열관 「이건 안 되오.」 — 먹 한 줄.', '검열관이 하품하며 한 줄 지웟소. 이유는 모른다 하오.', '검열관 「너무 재미잇서서 안 되오.」'];
  $('#hgCens').addEventListener('click', function () {
    var ps = $$('#hgBody p').filter(function (p) { return !p.classList.contains('wit') && !p.querySelector('.cens') && p.textContent.length > 14; });
    if (!ps.length) { say('더 지울 대목이 업다 하오. 검열관이 돌아갓소.'); return; }
    var p = ps[Math.floor(Math.random() * ps.length)], t = p.textContent, n = Math.min(t.length - 4, 8 + Math.floor(Math.random() * 10)), st = 2 + Math.floor(Math.random() * Math.max(1, t.length - n - 2));
    p.innerHTML = esc(t.slice(0, st)) + '<span class="cens">' + new Array(n + 1).join('■') + '</span>' + esc(t.slice(st + n));
    sheet.classList.add('censored'); say(CENS_SAY[Math.floor(Math.random() * CENS_SAY.length)] + ' <small>(지워진 자리는 그림으로 저장해도 그대로 남소)</small>');
  });
  $('#hgAgain').addEventListener('click', function () { unprint(); live(); window.scrollTo({ top: $('.h2-stage').offsetTop - 20, behavior: 'smooth' }); });
  function say(h) { $('#hgMsg').innerHTML = h || ''; }

  /* 널기 */
  $('#hgHang').addEventListener('click', function () {
    var d = readSheet(), list = load();
    list.unshift(d); try { localStorage.setItem('yk-hogoe', JSON.stringify(list.slice(0, 6))); } catch (e) {}
    count();
    try { sessionStorage.setItem('yk-hogoe-fresh', '1'); } catch (e) {}
    say('본지 「독자 호외」 빨랫줄에 널엇소. <a href="index.html#hogoe">널린 것 보러 가기 →</a>');
  });
  function count() { var n = load().length; $('#h2Count').textContent = n ? '오늘 밤 찍은 호외 · ' + n + '장' : ''; }

  /* ── 그림으로: 캔버스에 직접 찍음 ── */
  function wrap(ctx, text, maxW) {
    var out = [], line = '';
    text.split(/(\s+|■)/).forEach(function (w) {
      if (!w) return;
      var t = line + w;
      if (ctx.measureText(t).width <= maxW) { line = t; return; }
      if (line.trim()) out.push(line.replace(/\s+$/, ''));
      line = w.replace(/^\s+/, '');
      while (ctx.measureText(line).width > maxW) { var c = line.length; while (c > 1 && ctx.measureText(line.slice(0, c)).width > maxW) c--; out.push(line.slice(0, c)); line = line.slice(c); }
    });
    if (line.trim()) out.push(line); return out;
  }
  function draw() {
    return (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { return window.HGP ? HGP.load(readSheet().ph) : null; }).then(function (PHD) {
      var d = readSheet(), W = 1400, P = 80, SERIF = '"Noto Serif KR", serif';
      var dark = d.style === 'horror', bg = dark ? '#1f1a15' : '#f2e9d4', ink = dark ? '#e6dac0' : '#1e1913';
      var acc = dark ? '#c9a46a' : (ACC[d.tone] || ink), red = '#8a2a21';
      var c = document.createElement('canvas'), x = c.getContext('2d');
      var hs = d.style === 'breaking' ? 112 : 92, mainW = W - P * 2, artW = Math.round(mainW * .36), bodyW = mainW - artW - 36, colW = (bodyW - 28) / 2, lh = 44;
      var L3 = PHD && PHD.l === 3, stripW = (mainW - 48) / 3, stripPH = Math.round(stripW * 3 / 4), stripH = L3 ? stripPH + 185 : 0;
      if (L3) { artW = 0; bodyW = mainW; colW = (bodyW - 28) / 2; }
      x.font = '900 ' + hs + 'px ' + SERIF; var HL = wrap(x, d.head, mainW);
      x.font = '700 34px ' + SERIF; var SL = wrap(x, d.sub, mainW);
      x.font = '400 28px ' + SERIF; var BL = [];
      d.body.forEach(function (p, i) { wrap(x, (i ? '　' : '') + p, colW).forEach(function (l) { BL.push(l); }); BL.push(null); });
      var half = Math.ceil(BL.length / 2), artH = Math.round(artW * 3.3 / 4) + 40;
      if (PHD && !L3) artH = PHD.l === 2 ? Math.round(artW * 3 / 4) * 2 + 130 : Math.round(artW * 3 / 4) + 100; if (L3) artH = 0;
      var top = P + 150 + 50 + HL.length * hs * 1.1 + 70 + SL.length * 48 + 40 + stripH;
      var mainH = Math.max(half * lh, artH), H = Math.round(top + mainH + 40 + 190 + 80);
      c.width = W; c.height = H; x = c.getContext('2d');
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      var g = x.createRadialGradient(W * .4, H * .25, W * .3, W * .5, H * .5, W * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, dark ? 'rgba(0,0,0,.35)' : 'rgba(110,80,40,.22)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = ink; x.strokeStyle = ink; x.textBaseline = 'alphabetic';
      /* 제호 */
      var y = P + 92;
      x.font = '900 84px ' + SERIF; x.textAlign = 'center'; var nm = '경성야록'; var nw = x.measureText(nm).width;
      x.fillText(nm, W / 2 - 40, y);
      var bx = W / 2 - 40 + nw / 2 + 22; x.fillStyle = d.style === 'breaking' ? red : (dark ? ink : '#1e1913'); x.fillRect(bx, y - 92, 66, 112);
      x.fillStyle = dark ? bg : '#f2e9d4'; x.font = '900 42px ' + SERIF; x.fillText('호', bx + 33, y - 46); x.fillText('외', bx + 33, y + 6); x.fillStyle = ink;
      x.font = '800 22px ' + SERIF; x.textAlign = 'left'; x.strokeRect(P, y - 74, 112, 36); x.fillText('독자판', P + 14, y - 47);
      x.font = '400 20px ' + SERIF; x.fillText(d.no || '', P, y - 6);
      x.textAlign = 'right'; x.font = '700 22px ' + SERIF; x.fillText(DATE, W - P, y - 47); x.font = '400 20px ' + SERIF; x.fillText('정가 · 공짜', W - P, y - 6);
      y += 34; x.fillStyle = d.style === 'breaking' ? red : ink; x.fillRect(P, y, mainW, 4); x.fillRect(P, y + 9, mainW, 1.5); x.fillStyle = ink; y += 66;
      /* 머리글 */
      x.textAlign = 'left'; x.font = '800 24px ' + SERIF;
      if (d.style === 'breaking') { var kw = x.measureText(d.kick).width; x.fillStyle = red; x.fillRect(P, y - 32, kw + 34, 44); x.fillStyle = '#f2e9d4'; x.fillText(d.kick, P + 17, y); x.fillStyle = ink; }
      else { x.fillStyle = acc; x.fillText(d.kick, P, y); x.fillStyle = ink; }
      y += 16; x.font = '900 ' + hs + 'px ' + SERIF;
      HL.forEach(function (l) { y += hs * 1.1; x.fillText(l, P, y); });
      y += 66; x.font = '700 34px ' + SERIF;
      SL.forEach(function (l) { x.fillText(l, P, y); y += 48; });
      y -= 18; x.fillRect(P, y, mainW, 1.5); y += 56;
      /* 세 컷 사진 이야기 */
      if (L3) {
        var lab3 = ['一 · 발단', '二 · 사건', '三 · 반전'];
        PHD.imgs.forEach(function (im, i) {
          var sx = P + i * (stripW + 24), sy = y - 24;
          HGP.photo(x, im, PHD.sp, sx, sy, stripW, stripPH, i === 2);
          x.font = '900 24px ' + SERIF; x.fillStyle = acc; x.fillText(lab3[i], sx, sy + stripPH + 38); x.fillStyle = ink;
          x.font = '400 22px ' + SERIF; wrap(x, PHD.caps[i] || '', stripW).slice(0, 3).forEach(function (l, k) { x.fillText(l, sx, sy + stripPH + 72 + k * 30); });
        });
        y += stripH; x.fillRect(P, y - 40, mainW, 1.5);
      }
      /* 본문 두 단 + 삽화 */
      var colTop = y; x.font = '400 28px ' + SERIF;
      BL.forEach(function (l, i) { var col = i < half ? 0 : 1, row = col ? i - half : i; if (l) x.fillText(l, P + col * (colW + 28), colTop + row * lh); });
      x.globalAlpha = .4; x.fillRect(P + colW + 13, colTop - 30, 1.2, half * lh); if (!L3) x.fillRect(P + bodyW + 18, colTop - 30, 1.2, mainH); x.globalAlpha = 1;
      var ax = P + bodyW + 36, ay = colTop - 30, ah = Math.round(artW * 3.3 / 4);
      var finish = function () {
        if (!PHD) { x.strokeRect(ax, ay, artW, ah);
        x.font = '400 20px ' + SERIF; x.fillText(d.cap || '', ax, ay + ah + 30); }
        /* 아래 세 칸 */
        var by = colTop - 30 + mainH + 40; x.fillRect(P, by, mainW, 3);
        var bw = mainW / 3, heads = ['자정의 날씨', '광고', '독자 운세'], texts = [d.w, d.ad, d.f];
        heads.forEach(function (hh, i) {
          var bx2 = P + i * bw + (i ? 24 : 0);
          if (i) { x.globalAlpha = .4; x.fillRect(P + i * bw, by + 14, 1.2, 150); x.globalAlpha = 1; }
          x.font = '900 24px ' + SERIF; x.fillStyle = acc; x.fillText(hh, bx2, by + 48); x.fillStyle = ink;
          x.font = '400 23px ' + SERIF; wrap(x, texts[i] || '', bw - 40).slice(0, 4).forEach(function (l, k) { x.fillText(l, bx2, by + 88 + k * 34); });
        });
        x.fillRect(P, by + 180, mainW, 1.5);
        x.font = '400 20px ' + SERIF; x.textAlign = 'left'; x.fillText(d.by, P, by + 214); x.textAlign = 'right'; x.fillText('※ 독자가 지어 낸 이약이 · 실제 사건 아님 · 경성야록 독자판', W - P, by + 214);
        if (d.body.join('').indexOf('■') > -1) { x.save(); x.translate(P + bodyW * .55, colTop + mainH * .45); x.rotate(-.24); x.strokeStyle = 'rgba(138,42,33,.85)'; x.lineWidth = 5; x.strokeRect(-110, -44, 220, 76); x.fillStyle = 'rgba(138,42,33,.9)'; x.font = '900 46px ' + SERIF; x.textAlign = 'center'; x.fillText('삭  제', 0, 12); x.restore(); }
        /* 發行 도장 */
        x.save(); x.translate(W - P - 70, by + 118); x.rotate(.17); x.strokeStyle = 'rgba(138,42,33,.8)'; x.lineWidth = 5; x.strokeRect(-36, -58, 72, 116); x.fillStyle = 'rgba(138,42,33,.85)'; x.font = '900 40px ' + SERIF; x.textAlign = 'center'; x.fillText('발', 0, -8); x.fillText('행', 0, 42); x.restore();
        return c;
      };
      if (PHD) {
        if (!L3) {
          var pw = artW, phh = Math.round(artW * 3 / 4);
          PHD.imgs.forEach(function (im, i) {
            var py = ay + i * (phh + 70);
            HGP.photo(x, im, PHD.sp, ax, py, pw, phh, i === 0);
            x.font = '400 20px ' + SERIF; wrap(x, (PHD.caps[i] || '') + (i === PHD.imgs.length - 1 ? ' (사진 · 재현)' : ''), pw).slice(0, 2).forEach(function (l, k) { x.fillText(l, ax, py + phh + 28 + k * 26); });
          });
        }
        return finish();
      }
      var src = art(d.topic);
      if (src) return new Promise(function (ok) { var im = new Image(); im.onload = function () { x.save(); x.filter = 'grayscale(1) sepia(.35) contrast(1.15)' + (dark ? ' brightness(.8)' : ''); var r = Math.max(artW / im.width, ah / im.height), iw = im.width * r, ih = im.height * r; x.beginPath(); x.rect(ax, ay, artW, ah); x.clip(); x.drawImage(im, ax + (artW - iw) / 2, ay + (ah - ih) / 2, iw, ih); x.restore(); ok(finish()); }; im.onerror = function () { ok(finish()); }; im.src = src; });
      x.save(); x.beginPath(); x.rect(ax, ay, artW, ah); x.clip(); x.fillStyle = dark ? 'rgba(230,218,192,.08)' : 'rgba(30,25,19,.06)'; x.fillRect(ax, ay, artW, ah); x.fillStyle = ink;
      x.translate(ax + artW / 2, ay + ah / 2);
      x.rotate(Math.PI / 4); x.globalAlpha = .16; for (var i = -artW; i < artW; i += 9) x.fillRect(i, -artW, 1.2, artW * 2);
      x.rotate(-Math.PI / 2); x.globalAlpha = .11; for (var j = -artW; j < artW; j += 9) x.fillRect(j, -artW, 1, artW * 2);
      x.restore();
      x.font = '900 30px ' + SERIF; x.textAlign = 'center'; x.globalAlpha = .5; x.fillText('삽 화', ax + artW / 2, ay + ah / 2 + 10); x.globalAlpha = 1; x.textAlign = 'left';
      return finish();
    });
  }
  function fname() { return '경성야록_독자호외.png'; }
  function download(c) { var a = document.createElement('a'); a.download = fname(); a.href = c.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); }
  $('#hgPng').addEventListener('click', function () { draw().then(function (c) { download(c); say('그림으로 내려받앗소. 「다운로드」 폴더를 보시오.'); }); });

  /* ── 공유 ── */
  /* ── 공유 ── 「부치기」 창을 열 때 그림을 미리 찍어 둠 → 누르는 순간 바로 복사 (브라우저가 늦은 복사를 막아서) */
  var M = $('#hgShareBox'), shot = null, shotBlob = null, shotUrl = '';
  function msg(h) { $('#shmMsg').innerHTML = h || ''; }
  function openShare() {
    M.hidden = false; requestAnimationFrame(function () { M.classList.add('on'); });
    msg('그림을 찍는 중이오…'); $('#shmImg').removeAttribute('src'); shotBlob = null;
    draw().then(function (c) {
      shot = c;
      c.toBlob(function (b) { shotBlob = b; if (shotUrl) URL.revokeObjectURL(shotUrl); shotUrl = URL.createObjectURL(b); $('#shmImg').src = shotUrl; msg(''); }, 'image/png');
    });
  }
  function closeShare() { M.classList.remove('on'); setTimeout(function () { M.hidden = true; }, 250); }
  $('#hgShare').addEventListener('click', openShare);
  $('#shmX').addEventListener('click', closeShare);
  M.addEventListener('click', function (e) { if (e.target === M) closeShare(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !M.hidden) closeShare(); });
  function enc(d) { var s = JSON.stringify({ s: d.style, t: d.tone, p: d.topic, k: d.kick, h: d.head, u: d.sub, b: d.body, c: d.cap, w: d.w, a: d.ad, f: d.f, y: d.by, n: d.no, ph: d.ph || null }); return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function dec(z) { try { var s = decodeURIComponent(escape(atob(z.replace(/-/g, '+').replace(/_/g, '/')))); var o = JSON.parse(s); return { ph: o.ph || null, style: o.s, tone: o.t, topic: o.p, kick: o.k, head: o.h, sub: o.u, body: o.b || [], cap: o.c, w: o.w, ad: o.a, f: o.f, by: o.y, no: o.n }; } catch (e) { return null; } }
  function linkOf(d) { return location.href.split('#')[0].split('?')[0] + '#h=' + enc(d); }
  function copyText(t) {
    return new Promise(function (ok, no) {
      var done = function () { ok(); };
      var old = function () { var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); var r = false; try { r = document.execCommand('copy'); } catch (e) {} ta.remove(); r ? ok() : no(); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, old); else old();
    });
  }
  function file() { try { return shotBlob ? new File([shotBlob], fname(), { type: 'image/png' }) : null; } catch (e) { return null; } }
  var KAKAO = '<ol class="shm-steps"><li><b>카카오톡</b>에서 보낼 사람의 대화창을 여시오.</li><li>글 쓰는 칸을 한 번 누르고 <kbd>Ctrl</kbd> + <kbd>V</kbd></li><li>호외 그림이 붓흐면 — <b>전송</b>.</li></ol>';
  function kakaoOK() { return !!window.YK_KAKAO_KEY && /^https?:$/.test(location.protocol); }
  function kakaoReady() {
    if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) return Promise.resolve(window.Kakao);
    return new Promise(function (ok, no) {
      var sc = document.createElement('script'); sc.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'; sc.crossOrigin = 'anonymous';
      sc.onload = function () { try { if (!window.Kakao.isInitialized()) window.Kakao.init(window.YK_KAKAO_KEY); ok(window.Kakao); } catch (e) { no(e); } };
      sc.onerror = no; document.head.appendChild(sc);
    });
  }
  function sysShare(d) {
    var f = file();
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) {
      navigator.share({ files: [f], title: d.head, text: '경성야록 독자 호외 — ' + d.head }).then(function () { msg('보냇소.'); }).catch(function (er) { if (er && er.name !== 'AbortError') fallbackCopy(); });
      msg('공유 창이 열렷소. 목록에서 <b>카카오톡</b>을 고르시오.');
      return;
    }
    fallbackCopy();
  }
  function fallbackCopy() {
    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': shotBlob })]).then(function () {
        msg('<b>이 브라우저는 공유 창을 열 수 업서 호외 그림을 복사해 두엇소.</b>' + KAKAO);
      }).catch(function () { download(shot); msg('<b>그림으로 내려바닷소.</b> 「다운로드」 폴더의 파일을 카톡 대화창으로 끌어다 노으시오.'); });
    } else { download(shot); msg('<b>그림으로 내려바닷소.</b> 「다운로드」 폴더의 파일을 카톡 대화창으로 끌어다 노으시오.'); }
  }
  M.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sh]'); if (!b) return;
    var kind = b.dataset.sh, d = readSheet();
    if (kind !== 'link' && !shotBlob) { msg('아즉 그림을 찍는 중이오. 잠깐 뒤 다시 누르시오.'); return; }
    if (kind === 'kakao') {
      /* ① 카카오 공유 — 사이트가 인터넷 주소(https)에 올라가 있고 yk-kakao.js 에 열쇠가 있으면:
            카카오톡 「친구 고르기」 창이 바로 뜨고, 호외 그림 + 「호외 펼쳐 보기」 버튼이 카드로 감 */
      if (kakaoOK()) {
        msg('카카오톡을 여는 중이오…');
        kakaoReady().then(function (K) {
          return K.Share.uploadImage({ file: [file()] }).then(function (r) {
            var url = linkOf(d);
            K.Share.sendDefault({ objectType: 'feed',
              content: { title: d.head, description: '경성야록 독자 호외 · ' + (d.by || ''), imageUrl: r.infos.original.url, imageWidth: 1400, imageHeight: 1200, link: { webUrl: url, mobileWebUrl: url } },
              buttons: [{ title: '호외 펼쳐 보기', link: { webUrl: url, mobileWebUrl: url } }, { title: '나도 찍어 보기', link: { webUrl: url.split('#')[0], mobileWebUrl: url.split('#')[0] } }] });
            msg('카카오톡 창에서 보낼 사람을 고르시오.');
          });
        }).catch(function () { sysShare(d); });
        return;
      }
      /* ② 열쇠가 업거나 이 컴퓨터 안의 파일일 때 — 이 기기의 공유 창(휴대폰 · 윈도우)에서 카카오톡을 고름 */
      sysShare(d);
      return;
    }
    if (kind === 'save') { download(shot); msg('<b>그림으로 내려바닷소.</b> 「다운로드」 폴더를 보시오.'); return; }
    if (kind === 'os') {
      var f2 = file();
      if (f2 && navigator.canShare && navigator.canShare({ files: [f2] })) navigator.share({ files: [f2], title: d.head, text: '경성야록 독자 호외 — ' + d.head }).catch(function () {});
      else { download(shot); msg('이 컴퓨터에는 공유 창이 업서 그림으로 내려바닷소.'); }
      return;
    }
    if (kind === 'link') {
      var url = linkOf(d), local = location.protocol === 'file:';
      copyText(url).then(function () {
        msg('<b>링크를 복사햇소.</b> 대화창에 <kbd>Ctrl</kbd> + <kbd>V</kbd>. 받은 사람이 누르면 이 호외가 그대로 펼쳐지오.' + (local ? '<br><small>※ 지금은 사이트가 이 컴퓨터 안에만 잇서, 링크는 이 컴퓨터에서만 열리오. 사이트를 인터넷에 올리면 누구나 열 수 잇소. 그 전엔 「카톡으로」(그림)를 쓰시오.</small>' : ''));
      }).catch(function () { msg('복사가 막혓소. 아래 링크를 끌어 복사하시오.<br><small style="word-break:break-all">' + esc(url) + '</small>'); });
    }
  });

  /* 시작: 본지 줄에서 왓거나(?see=) · 받은 링크(#h=) 면 그 호외를 */
  sugg(); count(); live();
  var shown = null, see = new URLSearchParams(location.search).get('see'), hm = /#h=([A-Za-z0-9_-]+)/.exec(location.hash);
  if (hm) shown = dec(hm[1]);
  else if (see != null) shown = load()[+see] || null;
  if (shown) {
    var base = compose(); ['cap', 'w', 'ad', 'f', 'kick', 'sub', 'by'].forEach(function (k) { if (!shown[k]) shown[k] = base[k]; }); shown.topic = shown.topic || 'mystery'; shown.tone = shown.tone || 'serious'; shown.style = shown.style || 'classic';
    printed = true; shown.no = shown.no || issueNo(); render(shown); editable(true); sheet.classList.add('done');
    $('#hgAfter').hidden = false; $('#hgLab').textContent = hm ? '누군가 보낸 호외 · 글자를 눌러 고칠 수 잇소' : '본지에 널린 호외 · 글자를 눌러 고칠 수 잇소';
    if (hm) say('누군가 이 호외를 보내 왓소. 당신도 한 장 찍어 보시오 — 왼쪽 작업대에서.');
  }
})();
