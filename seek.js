/* 심인 광고면 — 「제가 그 사람이오」 · 「여기 잇소」 통지서 → 광고를 내림(發見)
   팀원이 만든 「제작 동료 모집 · 정기 독자 신청」을 옮김. 화면 시연용: 서버로 보내지 않고 이 컴퓨터에만 남김 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 옛말 ↔ 오늘말 */
  var hover = window.matchMedia && matchMedia('(hover: hover)').matches;
  function gloss(el, on) {
    if (!el.dataset.ko) return;
    if (on) { if (el.dataset.old == null) el.dataset.old = el.innerHTML; el.innerHTML = el.dataset.ko; el.classList.add('gloss'); }
    else if (el.dataset.old != null) { el.innerHTML = el.dataset.old; el.classList.remove('gloss'); }
  }
  if (hover) {
    document.addEventListener('mouseover', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, true); });
    document.addEventListener('mouseout', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, false); });
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var KEY = 'yk-seek';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  var TEXT = {
    crew: { t: '자 수 서', s: '「동료를 차즘」 광고를 보고 통지하오. 그 사람은 — 나요. (도망칠 생각은 업소)', go: '자수하기' },
    reader: { t: '통 지 서', s: '「독자를 차즘」 광고를 보고 통지하오. 그 사람은 — 여기 잇소. 화면을 내리다 말앗슬 뿐이오.', go: '부치기' }
  };
  function hj(o, n) { return '<span class="hj" tabindex="0" data-ko="' + n + '">' + o + '</span>'; }
  /* 판결 — 죄가 만흘수록 형이 무거워짐 (형벌은 모다 야근) */
  var SENT = ['훈방. 단, 차는 본인이 끓일 것', '야근 사흘. 집행유예 업슴', '야근 한 달. 식은 차 무제한 지급', '무기 야근. 가석방은 다음 호 발행 뒤 심사', '종신 편집국 근무. 이불은 지참 허가'];
  function foundLine(k, d) {
    var n = esc(d.name || '아무개');
    if (k === 'crew') {
      var c = (d.crime || []).length, sv = SENT[Math.min(c, SENT.length - 1)];
      var cr = c ? esc(d.crime.join(' · ')) : '죄 업슴 (그것이 가장 수상함)';
      return '<span class="sk-verdict"><b>판　결</b><em>죄목 ' + c + '건 — ' + cr + '</em><strong>' + esc(sv) + '</strong><i>京城野錄 編輯局 審人係</i></span>' +
        hj(n + ' 님, 자수를 접수하엿소. 수색대는 해산하오. 현상금(식은 차 한 잔)은 본인이 마시시오.', n + ' 님, 자수를 접수했습니다. 수색대는 해산합니다. 현상금(식은 차 한 잔)은 본인이 드세요.') + '<small>' + hj('※ 시연 화면이라 실제로 접수되지 안소. 안심하시오.', '※ 시연 화면이라 실제로 접수되지 않습니다. 안심하세요.') + '</small><button type="button" data-undo="crew">광고 다시 걸기 (탈옥)</button>';
    }
    return k === 'crew' ? '' + '<small>' + hj('※ 시연 화면이라 실제로 접수되지 안소. 안심하시오.', '※ 시연 화면이라 실제로 접수되지 않습니다. 안심하세요.') + '</small><button type="button" data-undo="crew">광고 다시 걸기</button>'
      : '<span class="sk-verdict r"><b>發　見</b><em>최종 목격지 — ' + esc(d.where || '본지 삼 면 하단') + '</em><strong>' + (d.where === '지금 이 칸' ? '발견 장소가 너무 갓가워 수색대가 놀랏소' : '수색대 해산 · 광고 내림') + '</strong><i>京城野錄 編輯局 審人係</i></span>' + hj(n + ' 님, 차잣소. 다음 호부터 남보다 먼저 배달하리다. 이제 못 빠져나가오.', n + ' 님, 찾았습니다. 다음 호부터 남보다 먼저 보내 드립니다. 이제 못 빠져나갑니다.') + '<small>' + hj('※ 시연 화면이라 실제로 메일이 가지 안소. 안심하시오.', '※ 시연 화면이라 실제로 메일이 가지 않습니다. 안심하세요.') + '</small><button type="button" data-undo="reader">광고 다시 걸기</button>';
  }
  function paint() {
    var d = load();
    [['crew', '#adCrew'], ['reader', '#adReader']].forEach(function (p) {
      var ad = $(p[1]), v = d[p[0]];
      ad.classList.toggle('found', !!v);
      $('.sk-found', ad).innerHTML = v ? foundLine(p[0], v) : '';
    });
  }
  document.addEventListener('click', function (e) {
    var u = e.target.closest('[data-undo]'); if (!u) return;
    var d = load(); delete d[u.dataset.undo]; save(d); paint();
  });

  /* 통지서 */
  var modal = $('#modal'), form = $('#mForm'), cur = null, tab = 'new', last = null;
  function open(k) {
    cur = k; last = document.activeElement;
    $('#mT').textContent = TEXT[k].t; $('#mS').textContent = TEXT[k].s; $('#mGo').textContent = TEXT[k].go;
    $$('.sk-fields', form).forEach(function (f) { f.classList.toggle('on', f.dataset.for === k); });
    $$('[aria-invalid]', form).forEach(function (x) { x.removeAttribute('aria-invalid'); });
    modal.hidden = false; requestAnimationFrame(function () { modal.classList.add('on'); });
    setTimeout(function () { var f = $('.sk-fields.on input:not([hidden]), .sk-fields.on textarea', form); if (f) f.focus(); }, 60);
  }
  function close() { modal.classList.remove('on'); setTimeout(function () { modal.hidden = true; if (last) last.focus(); }, 280); }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.dataset.open); }); });
  $('#mX').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  $$('.sk-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      tab = b.dataset.t;
      $$('.sk-tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $$('[data-only]', form).forEach(function (x) { x.hidden = x.dataset.only !== tab; });
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, bad = null;
    function need(el, ok) { el.setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok && !bad) bad = el; }
    var rec;
    if (cur === 'crew') {
      need(f.name, f.name.value.trim()); need(f.reason, f.reason.value.trim());
      rec = { name: f.name.value.trim(), field: f.field.value, reason: f.reason.value.trim(), crime: $$('input[name=crime]:checked', form).map(function (x) { return x.value; }) };
    } else {
      if (tab === 'new') need(f.rname, f.rname.value.trim());
      need(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()));
      rec = { name: tab === 'new' ? f.rname.value.trim() : f.email.value.trim().split('@')[0], email: f.email.value.trim(), where: f.where.value };
    }
    if (bad) { bad.focus(); return; }
    rec.at = new Date().toISOString();
    var d = load(); d[cur] = rec; save(d);
    close();
    var ad = cur === 'crew' ? $('#adCrew') : $('#adReader');
    setTimeout(function () { ad.scrollIntoView({ behavior: 'smooth', block: 'center' }); paint(); }, 320);
  });

  paint();
})();

/* 尋猫 — 누르면 고양이가 「ㄱ」을 물고 튀어나와 냐옹 (소리 파일 없이 브라우저가 직접 만듦) */
(function () {
  'use strict';
  var ad = document.getElementById('adCat'); if (!ad) return;
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null, t0 = 0;
  function meow() {
    if (!AC) return;
    try {
      ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
      var now = ctx.currentTime, dur = .62 + Math.random() * .18, base = 520 + Math.random() * 120;
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), g = ctx.createGain(), mix = ctx.createGain();
      o.type = 'sawtooth'; o2.type = 'triangle';
      /* 냐— (올라감) 옹 (내려감) */
      [o, o2].forEach(function (x, k) {
        var m = k ? 2 : 1;
        x.frequency.setValueAtTime(base * .78 * m, now);
        x.frequency.linearRampToValueAtTime(base * 1.32 * m, now + dur * .35);
        x.frequency.linearRampToValueAtTime(base * 1.12 * m, now + dur * .6);
        x.frequency.exponentialRampToValueAtTime(base * .62 * m, now + dur);
      });
      f.type = 'bandpass'; f.Q.value = 6;               /* 입 모양: 이 → 아 → 오 */
      f.frequency.setValueAtTime(1900, now); f.frequency.linearRampToValueAtTime(1300, now + dur * .45); f.frequency.linearRampToValueAtTime(700, now + dur);
      f2.type = 'lowpass'; f2.frequency.value = 3200;
      var vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 7; vg.gain.value = 9; vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
      o.connect(mix); o2.connect(mix); mix.gain.value = .5; mix.connect(f); f.connect(f2); f2.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(.28, now + .06); g.gain.setValueAtTime(.26, now + dur * .55); g.gain.exponentialRampToValueAtTime(.001, now + dur);
      [o, o2, vib].forEach(function (x) { x.start(now); x.stop(now + dur + .05); });
    } catch (e) {}
  }
  var hide = null;
  function pop() {
    if (Date.now() - t0 < 500) return; t0 = Date.now();
    ad.classList.remove('mew'); void ad.offsetWidth; ad.classList.add('mew');
    meow();
    clearTimeout(hide); hide = setTimeout(function () { ad.classList.remove('mew'); }, 1800);
  }
  ad.addEventListener('click', function (e) { if (e.target.closest('.hj') && e.detail === 0) return; pop(); });
  ad.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pop(); } });
})();

/* 광고면 아래칸 — 부고 · 현상 수배 · 사과 · 문 두드림 */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null;
  function ac() { if (!AC) return null; ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function knock(t0, loud) {   /* 나무문을 주먹으로 */
    var c = ac(); if (!c) return; var t = c.currentTime + t0;
    var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(70, t + .09);
    g.gain.setValueAtTime(loud, t); g.gain.exponentialRampToValueAtTime(.001, t + .14); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .16);
    var n = c.createBufferSource(), b = c.createBuffer(1, c.sampleRate * .03, c.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; var gn = c.createGain(); gn.gain.value = loud * .6; n.buffer = b; n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(t);
  }
  /* 부고 — 분향 */
  var ob = $('obitB'), on = 0, OB = ['', '고인(기계)께서 감사를 표할 수 업소', '세 번째 향 — 야근조가 울컥함', '분향소에서 원두 냄새가 나기 시작함', '고인이 잠시 「삐」 소리를 냇다는 제보가 잇소', '그만 하시오. 고인이 다시 켜질라'];
  if (ob) ob.addEventListener('click', function () { on++; $('obitN').textContent = '· 향 ' + on + ' 대'; var p = ob.parentNode.querySelector('.sk-obit-msg') || ob.parentNode.appendChild(Object.assign(document.createElement('p'), { className: 'sk-obit-msg' })); p.textContent = OB[Math.min(on, OB.length - 1)] || ''; ob.parentNode.classList.add('lit'); });
  /* 현상 수배 — 자정까지 남은 시간 (매일 밤 온다) */
  var dl = $('dl');
  if (dl) (function tick() { var n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); var s = Math.floor((m - n) / 1000), h = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
    dl.textContent = (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss; $('adWanted').classList.toggle('near', s < 3600); setTimeout(tick, 1000); })();
  /* 문 두드림 — 두드리면, 셋째부터는 저쪽에서도 두드림 */
  var kn = $('adKnock'), kc = 0, KN = ['짐작 가는 이는 이 칸을 두드려 보시오.', '…대답이 업소.', '…대답이 업소.', '똑. 똑. 똑. — 이번엔 저쪽에서.', '두드린 이를 차잣소. 당신이엇소.', '그만 두드리시오. 저쪽이 겁을 먹엇소.'];
  function hit() {
    kc++; [0, .22, .44].forEach(function (d) { knock(d, .5); });
    if (kc === 3) { setTimeout(function () { [0, .3, .6].forEach(function (d) { knock(d, .22); }); kn.classList.add('back'); }, 1500); }
    kn.classList.remove('shake'); void kn.offsetWidth; kn.classList.add('shake');
    setTimeout(function () { $('knockN').firstChild.textContent = KN[Math.min(kc, KN.length - 1)]; }, kc === 3 ? 2400 : 700);
  }
  if (kn) { kn.addEventListener('click', hit); kn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(); } }); }
})();

/* v6 (1012) · 유성기 「심인계 행진곡」 · 실적판 · 추보 · 정정의 정정 · 도망가기 · 부활 */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var D = document;
  function hj(o, n) { return '<span class="hj" tabindex="0" data-ko="' + n + '">' + o + '</span>'; }

  /* ── 유성기 : 처음 아무 데나 누르면 저절로 돌기 시작 · 단추로 끄고 켬 ── */
  var snd = $('skSnd'), bgm = $('skBgm'), off = false, started = false;
  function set(on) {
    if (!bgm) return;
    if (on) { bgm.volume = .55; var p = bgm.play(); if (p && p.catch) p.catch(function () {}); }
    else bgm.pause();
    snd.setAttribute('aria-pressed', on ? 'true' : 'false');
    D.body.classList.toggle('sk-play', !!on);
  }
  if (snd && bgm) {
    snd.addEventListener('click', function (e) { e.stopPropagation(); started = true; off = !bgm.paused; set(!off); });
    D.addEventListener('pointerdown', function first(e) {
      if (started || off || (e.target.closest && e.target.closest('#skSnd'))) return;
      started = true; set(true); D.removeEventListener('pointerdown', first, true);
    }, true);
  }

  /* ── 실적판 ── */
  var found = 0;
  function gotOne() {
    found++; var f = $('bFound'), l = $('bLost');
    if (f) { f.textContent = found; f.classList.remove('bump'); void f.offsetWidth; f.classList.add('bump'); }
    if (l) l.textContent = Math.max(0, 9 - found);
  }

  /* ── 작은 광고 추보 ── */
  [].forEach.call(D.querySelectorAll('.sk-upb'), function (b) {
    b.addEventListener('click', function () { var ad = b.closest('.sk-ad'); if (ad.classList.contains('upd')) return; ad.classList.add('upd'); gotOne(); });
  });
  /* 통지서로 차즌 것도 실적에 셈 */
  var mf = $('mForm'); if (mf) mf.addEventListener('submit', function () { setTimeout(function () { if (D.querySelector('.sk-ad.big.found')) gotOne(); }, 400); });

  /* ── 사과 : 누를 때마다 정정이 하나씩 ── */
  var FIX = [
    ['정정', '엄지손가락이 아니엇소. 편집장은 그날 장갑을 끼고 잇섯소.', '엄지손가락이 아니었습니다. 편집장은 그날 장갑을 끼고 있었습니다.'],
    ['정정의 정정', '장갑이 아니라 편집장의 귀엿소. 사진 찍을 때 귀를 기우리고 잇섯다 함.', '장갑이 아니라 편집장의 귀였습니다. 사진 찍을 때 귀를 기울이고 있었다고 합니다.'],
    ['정정의 정정의 정정', '편집장이 아니라 사환 김 군이엇소. 김 군은 「나는 그날 쉬엇다」 함.', '편집장이 아니라 사환 김 군이었습니다. 김 군은 "나는 그날 쉬었다"고 합니다.'],
    ['최종 정정', '그날 편집국엔 아모도 업섯소. 귀신께 드린 사과를 취소하오.', '그날 편집국엔 아무도 없었습니다. 귀신께 드린 사과를 취소합니다.'],
    ['사과', '귀신으로부터 항의 편지가 왓소. 다시 깁히 사과드리오. 편지는 젖어 잇섯소.', '귀신에게서 항의 편지가 왔습니다. 다시 깊이 사과드립니다. 편지는 젖어 있었습니다.'],
    ['알림', '이 건에 관한 정정은 이제 밧지 안소. 귀신도 마찬가지요.', '이 건에 대한 정정은 이제 받지 않습니다. 귀신도 마찬가지입니다.']
  ];
  var sorry = $('adSorry'), fx = $('sorryFix'), fi = 0;
  function more() {
    if (!fx || fi >= FIX.length) return;
    var f = FIX[fi++], li = D.createElement('li');
    li.innerHTML = '<b>' + f[0] + '</b>' + hj(f[1], f[2]); fx.appendChild(li);
    var n = $('sorryN'); if (n) n.innerHTML = fi < FIX.length ? hj('한 번 더 누르면 또 정정이 나오.', '한 번 더 누르면 또 정정이 나옵니다.') : hj('정정 접수 마감.', '정정 접수 마감.');
    if (fi === 4) gotOne();
  }
  if (sorry) { sorry.addEventListener('click', function (e) { if (e.target.closest('.hj') && e.detail === 0) return; more(); });
    sorry.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); more(); } }); }

  /* ── 현상 수배 : 도망가면 마감이 더 빨리 옴 (화면에서만) ── */
  var RUN = ['도망쳣소. 마감이 십 분 빨라졋소.', '또 도망쳣소. 마감이 뛰기 시작햇소.', '마감이 택시를 잡앗소.', '마감이 당신 집 주소를 아오.', '마감이 바로 뒤에 잇소. 도라보지 마시오.', '잡혓소. 오늘은 야근이오.'];
  var RUNK = ['도망쳤습니다. 마감이 10분 빨라졌습니다.', '또 도망쳤습니다. 마감이 뛰기 시작했습니다.', '마감이 택시를 잡았습니다.', '마감이 당신 집 주소를 압니다.', '마감이 바로 뒤에 있습니다. 돌아보지 마세요.', '잡혔습니다. 오늘은 야근입니다.'];
  var rb = $('runB'), rn = $('runN'), wa = $('adWanted'), ri = 0, dl = $('dl'), cut = 0;
  if (rb) rb.addEventListener('click', function () {
    var k = Math.min(ri, RUN.length - 1); rn.innerHTML = hj(RUN[k], RUNK[k]); ri++;
    cut += 600 * ri; wa.classList.remove('flee'); void wa.offsetWidth; wa.classList.add('flee');
    if (k === RUN.length - 1) { rb.disabled = true; rb.style.opacity = .4; gotOne(); }
  });
  /* 원래 시계 위에 덮어 씀 — 도망친 만큼 앞당김 */
  if (dl) setInterval(function () {
    if (!cut) return;
    var n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0);
    var s = Math.max(0, Math.floor((m - n) / 1000) - cut), h = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
    dl.textContent = (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
  }, 250);

  /* ── 부고 : 향을 열 대 피우면 고인(기계)이 다시 켜짐 ── */
  var ob = $('obitB'), oc = 0;
  if (ob) ob.addEventListener('click', function () {
    if (++oc !== 10) return;
    var c = ob.closest('.sk-l'), h = c.querySelector('h3');
    setTimeout(function () {
      h.innerHTML = hj('【정정】 본사 차 끓이는 기계 부활', '[정정] 본사 차 끓이는 기계 부활');
      var p = c.querySelector('.sk-obit-msg'); if (p) p.innerHTML = hj('삐—. 고인께서 다시 물을 끓이기 시작하엿소. 부고를 거두오. 원두는 돌려드리지 안소.', '삐—. 고인께서 다시 물을 끓이기 시작했습니다. 부고를 거둡니다. 원두는 돌려드리지 않습니다.');
      c.classList.add('flee'); gotOne();
    }, 300);
  });
  /* ── 문 두드림 : 다섯 번째에 차잣소 → 실적 ── */
  var kn = $('adKnock'), kc = 0;
  if (kn) kn.addEventListener('click', function () { if (++kc === 4) setTimeout(gotOne, 2400); });
  /* ── 고양이 : 다섯 번 누르면 차즘 ── */
  var cat = $('adCat'), cc = 0;
  if (cat) cat.addEventListener('click', function () { if (++cc === 5) { gotOne(); var em = D.querySelectorAll('.sk-board em'); var last = em[em.length - 1]; if (last) last.innerHTML = hj('차즘 (ㄱ은 아즉)', '찾음 (ㄱ은 아직)'); } });
})();

/* v7 (1012) · 사진 속 장난 — 이불 속 동료 · 독자가 남긴 단서 넷 */
(function () {
  'use strict';
  var D = document, $ = function (i) { return D.getElementById(i); };
  function hj(o, n) { return '<span class="hj" tabindex="0" data-ko="' + n + '">' + o + '</span>'; }
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null;
  function ac() { if (!AC) return null; ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function say(el, who, o, n, ms) {
    el.innerHTML = (who ? '<b>' + who + '</b>' : '') + hj(o, n); el.classList.add('on');
    clearTimeout(el._t); if (ms) el._t = setTimeout(function () { el.classList.remove('on'); }, ms);
  }
  function bump() {   /* 실적판 「차즘」 하나 올림 (앞 스크립트와 같은 자리) */
    var f = $('bFound'), l = $('bLost'); if (!f) return;
    f.textContent = (+f.textContent || 0) + 1; f.classList.remove('bump'); void f.offsetWidth; f.classList.add('bump');
    if (l) l.textContent = Math.max(0, (+l.textContent || 0) - 1);
  }
  /* 코 고는 소리 — 숨 들이쉬고 드르렁 */
  function snore() {
    var c = ac(); if (!c) return; var t = c.currentTime;
    var len = 1.4, b = c.createBuffer(1, c.sampleRate * len, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) { var x = i / c.sampleRate; d[i] = (Math.random() * 2 - 1) * (x < .9 ? Math.pow(Math.sin(Math.PI * x / .9), 2) * (.55 + .45 * Math.sign(Math.sin(2 * Math.PI * 38 * x))) : 0); }
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'lowpass'; f.frequency.value = 520; g.gain.value = .5;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  function mumble(n) {   /* 이불 속 웅얼거림 */
    var c = ac(); if (!c) return; var t = c.currentTime;
    for (var k = 0; k < n; k++) {
      var o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(), st = t + k * .16;
      o.type = 'sawtooth'; o.frequency.setValueAtTime(140 + Math.random() * 50, st); o.frequency.linearRampToValueAtTime(110, st + .14);
      f.type = 'lowpass'; f.frequency.value = 600; g.gain.setValueAtTime(0, st); g.gain.linearRampToValueAtTime(.12, st + .03); g.gain.linearRampToValueAtTime(0, st + .15);
      o.connect(f); f.connect(g); g.connect(c.destination); o.start(st); o.stop(st + .17);
    }
  }
  function shake(fig) { fig.classList.remove('shake'); void fig.offsetWidth; fig.classList.add('shake'); }

  /* ── 동료 : 이불 ── */
  var cp = $('crewPh'), ch = $('crewHot'), cs = $('crewSay'), ci = 0;
  var CREW = [
    ['', '드르렁…… 드르렁……', '드르렁…… 드르렁……', snore],
    ['이불 속', '음냐… 마감은… 내일이오…', '음… 마감은… 내일이에요…', function () { mumble(5); }],
    ['이불 속', '오 분만……', '5분만……', function () { mumble(3); }],
    ['이불 속', '……십 분만.', '……10분만.', function () { mumble(2); }],
    ['이불 속', '알앗소, 알앗소! 자수하겟소!', '알았어요, 알았어요! 자수할게요!', function () { mumble(7); }]
  ];
  if (ch) ch.addEventListener('click', function () {
    if (ci >= CREW.length) return;
    var s = CREW[ci++]; s[3](); shake(cp);
    if (ci === 4) cp.classList.add('swap');
    say(cs, s[0], s[1], s[2], ci < CREW.length ? 2600 : 0);
    var tip = $('crewTip');
    if (ci === 1 && tip) tip.innerHTML = hj('☞ 더 흔들어 보시오', '☞ 더 흔들어 보세요');
    if (ci === CREW.length) {
      ch.classList.add('seen'); bump();
      if (tip) { tip.innerHTML = hj('차잣소 — 이불 속에 잇섯소. 자수서를 받으시오.', '찾았어요 — 이불 속에 있었어요. 자수서를 받으세요.'); tip.classList.add('done'); }
      setTimeout(function () { var go = D.querySelector('[data-open="crew"]'); if (go) go.click(); }, 1800);
    }
  });

  /* ── 독자 : 단서 넷 ── */
  var rp = $('readPh'), rs = $('readSay'), got = {}, bite = 0;
  if (rp) {
    var sh = D.createElement('span'); sh.className = 'ix-shadow'; sh.setAttribute('aria-hidden', 'true'); rp.appendChild(sh);
  }
  var CLUE = {
    news: function () { return ['신문', '삼 면 하단이 접혀 잇소. 연필로 「이따 마저」라 써 잇소.', '3면 아래쪽이 접혀 있어요. 연필로 "이따 마저"라고 써 있어요.']; },
    cup: function () { return ['찻잔', '아즉 따뜻하오. 멀리 가지 안앗소!', '아직 따뜻해요. 멀리 가지 않았어요!']; },
    tteok: function () {
      bite = Math.min(3, bite + 1); rp.setAttribute('data-bite', bite);
      return bite === 1 ? ['떡', '한 입 먹엇소. …맛잇소.', '한 입 먹었어요. …맛있어요.']
        : bite === 2 ? ['떡', '두 입 먹엇소. 독자에겐 비밀이오.', '두 입 먹었어요. 독자에겐 비밀이에요.']
        : (function () {
            if (!rp.classList.contains('swap')) { rp.classList.add('swap');
              [].forEach.call(rp.querySelectorAll('.ix-hot[data-p2]'), function (h) { h.setAttribute('style', h.dataset.p2); }); }
            return ['떡', '다 먹엇소. 접시엔 부스러기만… 독자가 도라오면 큰일이오.', '다 먹었어요. 접시엔 부스러기만… 독자가 돌아오면 큰일이에요.'];
          })();
    },
    win: function () {
      rp.classList.add('dim'); var s = rp.querySelector('.ix-shadow'); if (s) { s.classList.remove('on'); void s.offsetWidth; s.classList.add('on'); }
      setTimeout(function () { rp.classList.remove('dim'); if (s) s.classList.remove('on'); }, 3200);
      return ['창밧', '방금 누가 창밧을 지나갓소! …화면을 내리는 손놀림이엇소.', '방금 누가 창밖을 지나갔어요! …화면을 내리는 손놀림이었어요.'];
    }
  };
  [].forEach.call(D.querySelectorAll('#readPh .ix-hot'), function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.c, r = CLUE[k](); say(rs, r[0], r[1], r[2], 3200);
      if (got[k]) return; got[k] = 1;
      var n = Object.keys(got).length, cn = $('clueN'); if (cn) cn.textContent = n;
      if (n === 4) setTimeout(function () {
        say(rs, '추리', '신문 · 찻잔 · 떡 · 창밧… 독자는 지금 이 화면 압헤 잇소. — 바로 당신이오.', '신문 · 찻잔 · 떡 · 창밖… 독자는 지금 이 화면 앞에 있어요. 바로 당신이에요.', 0);
        var tip = $('readTip'); if (tip) tip.classList.add('done'); bump();
      }, 3400);
    });
  });
})();

/* 납량란을 끝까지 닑은 독자 → 심인 급고 (같은 창에서 넘어왓을 때만) */
(function () {
  var box = document.getElementById('skNp'); if (!box) return;
  var d = null; try { d = JSON.parse(sessionStorage.getItem('yk-np-missing') || 'null'); } catch (e) {}
  if (!d) return;
  box.hidden = false;
  document.getElementById('skNpT').innerHTML = '<span class="hj" tabindex="0" data-ko="오늘 밤 ' + d.at + ', 납량란에서 마지막 초를 끈 뒤 소식이 끊겼습니다. 인상 — 촛불을 다 끄는 사람. 마지막으로 본 곳 — 이 화면 앞.">오늘 밤 ' + d.at + ', 납량란에서 마지막 초를 끈 뒤 소식이 끈겻소. 인상 — 촛불을 다 끄는 자. 마지막 목격지 — 이 화면 압.</span>';
  document.getElementById('skNpGo').addEventListener('click', function () {
    document.getElementById('skNpR').textContent = '차잣소. …그런데 납량란에서 도라온 이가 정말 당신 맞소?';
    var f = document.getElementById('bFound'); if (f) { f.textContent = (+f.textContent || 0) + 1; }
    this.disabled = true; this.style.opacity = .4;
  });
})();
