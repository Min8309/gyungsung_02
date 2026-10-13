/* 납량란 v2 — 자정의 백물어
   · 「촛불 켜고 드러가기」를 누르면 유성기가 돌아감 (브라우저는 누른 뒤에만 소리를 냄)
   · 봉투 여섯 장 · 한 장을 다 보면 초를 끔 → 대문 그림의 초가 꺼지고 방이 어두워짐
   · 오싹한 장치: 대문으로 돌아오면 꺼진 초 하나가 잠깐 다시 켜져 잇음 · 다 끄면 아모도 켜지 안은 일곱째 초
   · 기록은 남기지 않음 — 새로 고치면 처음부터 */
(function () {
  'use strict';
  var D = document, W = window;
  var reduce = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || D).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hover(root) {
    $$('.hj', root).forEach(function (el) {
      if (!el.dataset.ko || el._hv) return; el._hv = 1;
      var a = el.innerHTML, b = esc(el.dataset.ko);
      el.addEventListener('mouseenter', function () { el.innerHTML = b; });
      el.addEventListener('mouseleave', function () { el.innerHTML = a; });
    });
  }

  /* ═════════════ 유성기 (Web Audio로 그 자리에서 만드는 소리) ═════════════ */
  var AC = null, master, music, sfx, wet, wow, tone, hissG, haunt = false, hauntG = null, playing = false, mode = 'room', seqT = null, crT = null, padG = null;
  /* 가단조 자장가 — 오르골이 태엽 풀리듯 (음, 길이[박]) · 0 = 쉼 */
  var A3 = 220, N = function (s) { return A3 * Math.pow(2, s / 12); };
  var TUNE = [[7, 1], [3, 1], [0, 2], [2, 1], [3, 1], [2, 1], [-1, 1], [0, 3], [0, 1],
              [7, 1], [8, 1], [7, 1], [3, 1], [5, 1.5], [3, .5], [2, 2], [0, 2],
              [3, 1], [2, 1], [0, 1], [-1, 1], [-5, 2], [0, 1], [-1, 1], [0, 4], [0, 2]];
  function ctx() {
    if (AC) return AC;
    var C = W.AudioContext || W.webkitAudioContext; if (!C) return null;
    AC = new C();
    master = AC.createGain(); master.gain.value = 0;
    var comp = AC.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    master.connect(comp); comp.connect(AC.destination);
    /* 방 울림 */
    var cv = AC.createConvolver(), len = AC.sampleRate * 3.2, ir = AC.createBuffer(2, len, AC.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    cv.buffer = ir; wet = AC.createGain(); wet.gain.value = .55; cv.connect(wet); wet.connect(master);
    music = AC.createGain(); music.gain.value = 1;
    tone = AC.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 3600;
    music.connect(tone); tone.connect(master); tone.connect(cv);
    sfx = AC.createGain(); sfx.gain.value = 1; sfx.connect(master); sfx.connect(cv);
    /* 판이 살짝 늘어지는 흔들림 (모든 음에 걸림) */
    wow = AC.createGain(); wow.gain.value = 9;
    var lfo = AC.createOscillator(); lfo.frequency.value = .55; lfo.connect(wow); lfo.start();
    pad(); crackle();
    return AC;
  }
  function noise(sec) { var b = AC.createBuffer(1, AC.sampleRate * sec, AC.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
  function pad() {
    padG = AC.createGain(); padG.gain.value = .07;
    var f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700;
    [110, 164.81, 220.6].forEach(function (hz, i) {
      var o = AC.createOscillator(); o.type = i === 0 ? 'triangle' : 'sine'; o.frequency.value = hz; wow.connect(o.detune);
      var g = AC.createGain(); g.gain.value = [.7, .35, .25][i];
      var l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = .07 + i * .05; lg.gain.value = .25; l.connect(lg); lg.connect(g.gain); l.start();
      o.connect(g); g.connect(f); o.start();
    });
    f.connect(padG); padG.connect(master); padG.connect(wet);
  }
  function crackle() {
    var h = AC.createBufferSource(); h.buffer = noise(2); h.loop = true;
    var hf = AC.createBiquadFilter(); hf.type = 'bandpass'; hf.frequency.value = 2800; hf.Q.value = .5;
    var hg = AC.createGain(); hissG = hg; hg.gain.value = .022; h.connect(hf); hf.connect(hg); hg.connect(master); h.start();
    var pop = noise(.02);
    (function t() {
      crT = setTimeout(t, 40 + Math.random() * 260);
      if (!playing) return;
      var s = AC.createBufferSource(); s.buffer = pop; var g = AC.createGain(); g.gain.value = .03 + Math.random() * .07;
      var f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200 + Math.random() * 3000;
      s.connect(f); f.connect(g); g.connect(master); s.start();
    })();
  }
  function box(hz, t, v) {
    /* 오르골 빗살: 맑은 기음 + 어긋난 배음 */
    [[1, 1, 2.6], [3.01, .22, .9], [5.2, .07, .35]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.value = hz * p[0]; wow.connect(o.detune);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * p[1], t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + p[2]);
      o.connect(g); g.connect(music); o.start(t); o.stop(t + p[2] + .1);
    });
  }
  function rbox(hz, t, v) {
    /* 거꾸로 감긴 테이프: 소리가 빨려 들어오다 뚝 끊김 */
    [[1, 1], [2.02, .3], [3.97, .1]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = hz * p[0]; wow.connect(o.detune);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * p[1], t + 1.1); g.gain.linearRampToValueAtTime(0, t + 1.16);
      o.connect(g); g.connect(music); o.start(t); o.stop(t + 1.2);
    });
  }
  var hidx = 0, skip = 0;
  function hseq() {
    /* 기괴한 변주: 자장가를 거꾸로 · 셋온음 낮게 · 반 박 늦게 따라오는 어긋난 그림자 · 바늘이 튀어 같은 음을 되풀이 */
    var R = TUNE.slice().reverse(), n = R[hidx % R.length];
    var t = AC.currentTime + .02, hz = N(n[0] + 6) * Math.pow(2, (Math.random() - .5) * .02);
    if (skip > 0) { skip--; n = R[(hidx - 1 + R.length) % R.length]; hz = N(n[0] + 6); }
    else { hidx++; if (Math.random() < .16) skip = 2 + Math.floor(Math.random() * 3); }
    if (Math.random() < .45) rbox(hz, t, .16); else box(hz, t, .17);
    box(hz * Math.pow(2, 45 / 1200), t + .28, .07);           /* 4분의 1음 어긋난 그림자 */
    if (n[1] >= 2) box(hz / 2 * Math.pow(2, -1 / 12), t + .05, .06);
    seqT = setTimeout(seq, (skip > 0 ? .22 : n[1] * 1.05 + (Math.random() - .5) * .3) * 1000);
  }
  function hauntOn(v) {
    haunt = v; if (!AC) return; var t = AC.currentTime;
    function ramp(p, to, d) { p.cancelScheduledValues(t); p.setValueAtTime(p.value, t); p.linearRampToValueAtTime(to, t + d); }
    ramp(wow.gain, v ? 42 : 9, v ? 2.5 : 4);
    ramp(tone.frequency, v ? 1300 : 3600, 3);
    ramp(wet.gain, v ? .95 : .55, 3);
    ramp(hissG.gain, v ? .06 : .022, 2);
    if (v && !hauntG) {
      /* 밑에 깔리는 셋온음 울림 + 아주 느린 숨 */
      hauntG = AC.createGain(); hauntG.gain.value = 0;
      var f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520;
      [N(-21), N(-15), N(-14.6)].forEach(function (hz, i) {
        var o = AC.createOscillator(); o.type = i ? 'sine' : 'triangle'; o.frequency.value = hz; wow.connect(o.detune);
        var g = AC.createGain(); g.gain.value = [.6, .35, .3][i]; o.connect(g); g.connect(f); o.start();
      });
      var br = AC.createOscillator(), bg = AC.createGain(); br.frequency.value = .11; bg.gain.value = .5; br.connect(bg); bg.connect(f.frequency); br.start();
      f.connect(hauntG); hauntG.connect(master); hauntG.connect(wet);
    }
    if (hauntG) ramp(hauntG.gain, v ? .11 : 0, v ? 3 : 2.5);
    if (padG) ramp(padG.gain, v ? .02 : (mode === 'quiet' ? .05 : mode === 'low' ? .1 : .07), 2.5);
    if (v) { ramp(music.gain, 1, 1.5); clearTimeout(seqT); seqT = setTimeout(seq, 1400); }
    else if (mode === 'quiet') ramp(music.gain, 0, 2.5);
  }
  var idx = 0;
  function seq() {
    clearTimeout(seqT); if (!playing) return;
    if (haunt) { hseq(); return; }
    if (mode === 'quiet') { seqT = setTimeout(seq, 1500); return; }
    var beat = mode === 'low' ? .82 : .62;                 /* 4·5화에선 태엽이 풀려 느려짐 */
    var n = TUNE[idx % TUNE.length]; idx++;
    var t = AC.currentTime + .02, drift = (Math.random() - .5) * .06;
    if (n[0] !== null) {
      var hz = N(n[0] + 12) * (mode === 'low' ? Math.pow(2, -1 / 12) : 1);
      box(hz, t, .2 + Math.random() * .05);
      if (n[1] >= 2) box(hz / 2, t + .01, .07);
    }
    seqT = setTimeout(seq, (n[1] * beat + drift + (idx % TUNE.length === 0 ? 2.4 : 0)) * 1000);
  }
  function setMode(m) {
    if (mode === m) return; mode = m; if (!AC || haunt) return;
    var t = AC.currentTime;
    padG.gain.cancelScheduledValues(t); padG.gain.setValueAtTime(padG.gain.value, t);
    padG.gain.linearRampToValueAtTime(m === 'quiet' ? .05 : m === 'low' ? .1 : .07, t + 3);
    music.gain.cancelScheduledValues(t); music.gain.setValueAtTime(music.gain.value, t);
    music.gain.linearRampToValueAtTime(m === 'quiet' ? 0 : 1, t + 2.5);
  }
  function soundOn(v) {
    if (!ctx()) return;
    if (AC.state === 'suspended') AC.resume();
    playing = v; var t = AC.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(v ? .95 : 0, t + (v ? 2.2 : .7));
    var b = $('#snd'); b.setAttribute('aria-pressed', v ? 'true' : 'false');
    if (v) { clearTimeout(seqT); seqT = setTimeout(seq, 600); } else clearTimeout(seqT);
  }
  var userOff = false;
  $('#snd').addEventListener('click', function () { soundOn(!playing); userOff = !playing; });
  /* 들어오자마자 유성기를 돌림 — 브라우저가 막으면 처음 누르는 순간부터 */
  function autoOn() { if (userOff || playing) return; soundOn(true); }
  function first(e) {
    if (e && e.target && e.target.closest && e.target.closest('#snd, #enterQuiet')) return;
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { D.removeEventListener(t, first, true); });
    autoOn();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { D.addEventListener(t, first, true); });
  setTimeout(autoOn, 300);

  /* 효과음 */
  function breath() {
    if (!playing) return; var t = AC.currentTime, s = AC.createBufferSource(); s.buffer = noise(1.3);
    var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(1100, t); f.frequency.linearRampToValueAtTime(380, t + 1); f.Q.value = .7;
    var g = AC.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .1); g.gain.exponentialRampToValueAtTime(.0001, t + 1.15);
    s.connect(f); f.connect(g); g.connect(sfx); s.start(t); s.stop(t + 1.3);
  }
  function key() {
    if (!playing) return; var t = AC.currentTime, s = AC.createBufferSource(); s.buffer = noise(.03);
    var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200 + Math.random() * 800; f.Q.value = 3;
    var g = AC.createGain(); g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .05);
    s.connect(f); f.connect(g); g.connect(sfx); s.start(t);
  }
  function ring(times) {
    if (!playing) return; var t0 = AC.currentTime + .2;
    for (var k = 0; k < times; k++) {
      var t = t0 + k * 2.6;
      [440, 480].forEach(function (hz) {
        var o = AC.createOscillator(), g = AC.createGain(), am = AC.createOscillator(), ag = AC.createGain();
        o.frequency.value = hz; am.frequency.value = 22; am.type = 'square'; ag.gain.value = .5;
        am.connect(ag); ag.connect(g.gain);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.06, t + .02); g.gain.setValueAtTime(.06, t + 1.1); g.gain.linearRampToValueAtTime(0, t + 1.15);
        var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500;
        o.connect(g); g.connect(lp); lp.connect(sfx); o.start(t); am.start(t); o.stop(t + 1.2); am.stop(t + 1.2);
      });
    }
  }
  function whistle() {
    if (!playing) return; var t = AC.currentTime + .3;
    [523, 659, 784].forEach(function (hz) {
      var o = AC.createOscillator(), g = AC.createGain(), lp = AC.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = hz; lp.type = 'lowpass'; lp.frequency.value = 900;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.025, t + .8); g.gain.setValueAtTime(.025, t + 2.2); g.gain.linearRampToValueAtTime(0, t + 3.6);
      o.connect(lp); lp.connect(g); g.connect(sfx); o.start(t); o.stop(t + 3.8);
    });
  }
  function bell() {   /* 일곱째 초가 켜질 때 — 아주 작은 종 */
    if (!playing) return; var t = AC.currentTime + .1;
    box(N(19), t, .14); box(N(26), t + .02, .05);
  }

  /* ═════════════ 들어가기 ═════════════ */
  function enter(withSound) {
    if (withSound) { if (!playing) soundOn(true); } else { userOff = true; if (playing) soundOn(false); }
    D.body.classList.remove('locked'); T_IN = Date.now();
    setTimeout(function () { $('#pro').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }, 300);
    setTimeout(initFog, 400);
  }
  $('#enter').addEventListener('click', function () { enter(true); });
  $('#enterQuiet').addEventListener('click', function () { enter(false); });

  /* ═════════════ 초 ═════════════ */
  var lit = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 };
  var ORDER = [], T_IN = Date.now();
  function left() { var n = 0; for (var k in lit) if (lit[k]) n++; return n; }
  function blowOut(n) {
    if (!lit[n]) return; lit[n] = 0; ORDER.push(n);
    var sc = D.getElementById('ep' + n); sc.classList.add('out'); $('.blow', sc).disabled = true;
    var f = $('.fl[data-n="' + n + '"]'); f.classList.remove('fresh'); void f.offsetWidth; f.classList.add('out', 'fresh');
    $('.cb-row a[data-n="' + n + '"]').classList.add('out');
    D.documentElement.style.setProperty('--lit', left()); $('#left').textContent = left();
    breath();
    near();
    if (!left()) setTimeout(ending, 1600);
    else {
      /* 다음 초는 아래쪽에서만 찾아 내려감 — 우에만 남앗으면 쪽지로 알려 줌 (저절로 우로 끌어올리지 안음) */
      var nx = null; for (var j = n + 1; j <= 6; j++) if (lit[j]) { nx = j; break; }
      if (nx) setTimeout(function () { D.getElementById('ep' + nx).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 2200);
      else setTimeout(upNote, 2000);
    }
  }
  function near() {}
  /* ── 우에 남은 초 알림 ── */
  var UP = $('#upNote');
  function upNote() {
    if (!UP || !left()) return;
    var first = null; for (var k = 1; k <= 6; k++) if (lit[k]) { first = k; break; }
    UP.innerHTML = '<span class="hj" data-ko="남은 초 ' + left() + '개는 위쪽에 있어요">남은 초 ' + left() + ' 자루는 우에 잇소</span><button type="button">↑ <span class="hj" data-ko="올라가기">올라가기</span></button>';
    UP.classList.add('on'); hover(UP);
    UP.querySelector('button').onclick = function () { UP.classList.remove('on'); D.getElementById('ep' + first).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
    clearTimeout(UP._t); UP._t = setTimeout(function () { UP.classList.remove('on'); }, 9000);
  }
  /* ── 다른 창으로 가면 탭 제목이 바뀜 ── */
  var T0 = D.title;
  D.addEventListener('visibilitychange', function () {
    if (D.body.classList.contains('locked')) return;
    if (D.hidden) D.title = left() ? '…아즉 닑고 잇소? · 납량란' : '號外 — 납량란 독자 一名 행방불명';
    else { D.title = '도라왓구려 · 납량란'; setTimeout(function () { D.title = T0; }, 2600); }
  });
  var RESET = {};
  function ready(n) { var sc = D.getElementById('ep' + n); sc.classList.add('ok'); var b = $('.blow', sc); if (b && lit[n]) b.disabled = false; }
  $$('.sc').forEach(function (sc) {
    var n = +sc.dataset.n, b = $('.blow', sc);
    b.addEventListener('click', function () {
      if (b.disabled) return;
      if (n === 6) { b.disabled = true; setMode('quiet'); setTimeout(function () { blowOut(6); }, reduce ? 0 : 3000); return; }
      blowOut(n);
    });
  });
  var bar = $('#cbar');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var n = e.target.dataset.n;
      $$('.cb-row a').forEach(function (a) { a.classList.toggle('cur', a.dataset.n === n); });
      setMode(n === '4' || n === '5' ? 'low' : n === '6' ? 'quiet' : 'room');
      if (n === '6' && !$('#s6').classList.contains('go')) { $('#s6').classList.add('go'); setTimeout(whistle, 2500); ready(6); }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  $$('.sc').forEach(function (s) { io.observe(s); });
  /* 대문이 보이면 막대를 숨김 · 대문으로 돌아오면 — 꺼진 초 하나가 잠깐 다시 켜져 잇음 (한 번만) */
  var ghosted = false;
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      bar.classList.toggle('on', !e.isIntersecting && !D.body.classList.contains('locked'));
      if (e.isIntersecting && e.intersectionRatio > .6 && !ghosted && left() <= 3 && left() > 0) {
        ghosted = true;
        var outs = []; for (var k = 1; k <= 6; k++) if (!lit[k]) outs.push(k);
        var g = $('.fl[data-n="' + outs[0] + '"]');
        setTimeout(function () { g.classList.remove('fresh'); g.classList.add('ghost'); g.classList.remove('out'); }, 900);
        setTimeout(function () { g.classList.add('out', 'fresh'); g.classList.remove('ghost'); breath(); }, 6500);
      }
    });
  }, { threshold: [0, .25, .6] }).observe($('#gate'));

  /* ═════════════ 원문 서랍 ═════════════ */
  var SRC = {
    1: { date: '동아일보 1926년 8월 13일 · 5면', ot: '참살된 소녀의 무덤에 두 청년의 유령', vs: '제목 · 부제 · 첫머리 한 줄 · 사진 확인',
      mt: '살해된 소녀의 무덤에 나타난 두 청년의 유령', re: '사진 옆 세로글 가운데 「그 무덤 우에 서 잇는 것은 누구인가」는 편집국이 쓴 문장이오. 현상실 그림은 재현이오.' },
    2: { date: '동아일보 1932년 11월 6일 · 7면 5단', url: 'https://db.history.go.kr/id/npda_1932_11_06_v0007_1220',
      ot: '鬼神 파는 挾雜輩들 四名一團遂就縛', os: '현금 一천여 원을 협잡한 자 東大門署員에게',
      mt: '귀신 파는 사기꾼들 — 네 명 한 패, 마침내 붙잡히다', ms: '현금 천여 원을 가로챈 이들, 동대문서 경찰에게',
      pg: { src: 'assets/np/p1932.jpg', box: 'left:14.35%;top:32.64%;width:14.35%;height:20.73%' },
      re: '「귀신 파오」 벽보는 지어낸 것이오. 네 그림자는 재현 그림이오. 무엇을 귀신이라 하야 팔앗는지는 본문을 닑어야 알 수 잇소.' },
    3: { date: '동아일보 1927년 12월 23일 · 3면 5단', url: 'https://db.history.go.kr/id/npda_1927_12_23_v0003_0520',
      ot: '傳說의 朝鮮(六六) 怪異한 甑峰山', mt: '전설의 조선 (66) — 괴이한 증봉산',
      re: '사건 보도가 아니라 연재 전설이오. 산에 얽힌 이약이의 내용은 한 줄도 쓰지 안앗소. 사당의 불은 연출이오.' },
    4: { date: '동아일보 1924년 11월 18일 · 2면 5단', url: 'https://db.history.go.kr/id/npda_1924_11_18_v0002_0370',
      ot: '疑雲重疊의 怪事件, 怪夫婦一訪後主婦 卒倒', os: '현금과 뎌금 통장도 간곳업고 뎐화통 잡은채 죽은듯 말업서, 道立師範校長 佐佐氏 邸의 幻劇',
      mt: '의혹이 겹겹이 쌓인 괴사건 — 수상한 부부가 한 번 다녀간 뒤 주부가 쓰러지다', ms: '현금과 저금 통장도 간 곳 없고, 전화기를 쥔 채 죽은 듯 말이 없어 — 도립사범학교 교장 사사 씨 집의 환극(幻劇)',
      pg: { src: 'assets/np/p1924.jpg', box: 'left:55.04%;top:34.51%;width:16.86%;height:18.01%' }, pgc: '이날 2면에는 1909년 대한민보 지면을 제호째 다시 실은 자료가 함께 잇소.',
      re: '방 안의 글은 모다 제목·부제를 나눈 것이오. 신발·방·전화 그림과 전화벨은 편집국의 연출이오. 「누구에게 뎐화를 걸녀 하엿나」는 질문일 뿐 사실이 아니오.' },
    5: { date: '동아일보 1932년 11월 11일 · 2면 5단', url: 'https://db.history.go.kr/id/npda_1932_11_11_v0002_0200',
      ot: '奇怪! 殺人强盜嫌疑者 取調進行中 啞者로 突變', mt: '기괴! 살인강도 혐의자, 조사 도중 말을 못 하게 되다',
      re: '취조 긔록의 문답은 무르면 「……」만 돌아오도록 편집국이 꾸민 장면이오. 실제 조사 내용이 아니오.' },
    6: { date: '동아일보 1938년 12월 11일 · 4면 9단', url: 'https://db.history.go.kr/id/npda_1938_12_11_w0004_0540',
      ot: '平原線鐵路 우에 怪屍體橫在', mt: '평원선 철길 위에 수상한 시신이 놓여 있다',
      re: '철길 그림에는 사람을 그리지 안앗소. 신원·경위는 제목에 업서 쓰지 안앗소.' }
  };
  function recHTML(n) {
    var s = SRC[n];
    var pg = s.pg ? '<div class="pg"><img src="' + s.pg.src + '" alt="' + esc(s.date) + ' 지면 전체"><i style="' + s.pg.box + '"></i></div><p class="pg-c">테두리 — 이 긔사 자리' + (s.pgc ? ' · ' + esc(s.pgc) : '') + '</p>' : '';
    return '<div class="rec"><div class="rec-o"><p class="rl"><b>원문 기록</b><span>' + esc(s.date) + '</span></p>' +
      '<p class="ot" lang="ko-Hani">' + esc(s.ot) + '</p>' + (s.os ? '<p class="os" lang="ko-Hani">' + esc(s.os) + '</p>' : '') +
      '<ul class="vs"><li class="y">' + esc(s.vs || ('제목 · ' + (s.os ? '부제 · ' : '') + '날짜 · 지면 확인')) + '</li></ul>' + pg +
      (s.url ? '<a class="lk" href="' + s.url + '" target="_blank" rel="noopener">한국사데이터베이스에서 원문 보기 ↗</a>' : '') + '</div>' +
      '<div class="rec-m"><p class="rl"><b>현대어 풀이</b><span>제목' + (s.os ? ' · 부제' : '') + '만 옮김</span></p><p class="mt">' + esc(s.mt) + (s.ms ? '<small>' + esc(s.ms) + '</small>' : '') + '</p></div>' +
      '<div class="rec-r"><p class="rl"><b>편집국 재구성</b><span>원문 아님</span></p><p>' + esc(s.re) + '</p></div></div>';
  }
  $$('.sc').forEach(function (sc) {
    var b = $('.src-b', sc), d = $('.drawer', sc);
    d.innerHTML = recHTML(d.dataset.src);
    b.addEventListener('click', function () { var o = d.hidden; d.hidden = !o; b.setAttribute('aria-expanded', o ? 'true' : 'false'); b.querySelector('span').textContent = o ? '원문 닫기' : '원문 확인'; });
  });

  /* ═════════════ 제1화 · 현상 ═════════════ */
  var dev = $('#dev'), ran = false;
  new IntersectionObserver(function (es, ob) {
    es.forEach(function (e) {
      if (!e.isIntersecting || ran) return; ran = true; ob.disconnect();
      if (reduce) { dev.classList.add('on', 'done'); return; }
      setTimeout(function () { dev.classList.add('on'); }, 400);
      setTimeout(function () { dev.classList.add('done'); }, 7600);
    });
  }, { threshold: .55 }).observe(dev);
  RESET[1] = function () { dev.classList.remove('on', 'done'); void dev.offsetWidth; setTimeout(function () { dev.classList.add('on'); }, 300); setTimeout(function () { dev.classList.add('done'); }, 7500); };
  $$('#v1 .opts button').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = $('#v1'); if (box.classList.contains('picked')) return;
      b.classList.add('chosen'); box.classList.add('picked'); key();
      $('.vr', box).innerHTML = '<p class="t">본보 판정 — 보류</p><p><span class="hj" data-ko="동아일보는 이것을 \'진기한 사실\'이라며 실었다. 그러나 그 연재의 나머지를, 경성야록은 아직 다 읽지 못했다.">본보는 이것을 「진긔한 사실」이라 하야 실엇다.<br>그러나 그 연재의 나머지를, 본 야록은 아즉 다 닑지 못하얏다.</span></p><p class="me">당신의 도장 — ' + esc(b.dataset.o) + '</p>';
      hover($('.vr', box)); setTimeout(function () { ready(1); }, 1200);
    });
  });

  /* ═════════════ 제2화 · 벽보 뜯기 ═════════════ */
  var bill = $('#bill');
  $('#peel').addEventListener('click', function () {
    bill.classList.add('flip'); breath();
    setTimeout(function () { ready(2); }, 1500);
  });
  $('.bill-b', bill).addEventListener('click', function () { bill.classList.remove('flip'); });
  RESET[2] = function () { bill.classList.remove('flip'); };

  /* ═════════════ 제3화 · 안개 ═════════════ */
  var fogDone = false, fogInit = false;
  function initFog() {
    if (fogInit) return; fogInit = true;
    var st = $('#fogStage'), cv = $('#fog'), g = cv.getContext('2d'), W0 = 0, H0 = 0;
    function draw() {
      var r = st.getBoundingClientRect(), dpr = Math.min(2, W.devicePixelRatio || 1);
      W0 = r.width; H0 = r.height; if (!W0) return; cv.width = W0 * dpr; cv.height = H0 * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = 'source-over';
      if (fogDone) { g.clearRect(0, 0, W0, H0); return; }
      g.fillStyle = 'rgba(52,47,40,.9)'; g.fillRect(0, 0, W0, H0);
      for (var i = 0; i < 90; i++) { var x = Math.random() * W0, y = Math.random() * H0, rr = 60 + Math.random() * 200, c = g.createRadialGradient(x, y, 0, x, y, rr); c.addColorStop(0, 'rgba(160,152,138,.2)'); c.addColorStop(1, 'rgba(150,142,128,0)'); g.fillStyle = c; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    }
    draw();
    var t0; W.addEventListener('resize', function () { clearTimeout(t0); t0 = setTimeout(draw, 200); });
    function wipe(x, y) {
      g.globalCompositeOperation = 'destination-out';
      var rr = Math.max(70, W0 * .08), c = g.createRadialGradient(x, y, 0, x, y, rr);
      c.addColorStop(0, 'rgba(0,0,0,.45)'); c.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = c; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill();
    }
    var moves = 0;
    function check() {
      var ok = false;
      try { var d = g.getImageData(0, 0, cv.width, cv.height).data, clear = 0, tot = 0;
        for (var i = 3; i < d.length; i += 4 * 97) { tot++; if (d[i] < 90) clear++; } ok = clear / tot > .5; } catch (e) { ok = moves > 500; }
      if (ok) { fogDone = true; cv.style.transition = 'opacity 3s ease'; cv.style.opacity = '0'; ready(3); bell(); }
    }
    function mv(e) { if (fogDone) return; var r = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; wipe(p.clientX - r.left, p.clientY - r.top); if (++moves % 25 === 0) check(); if (e.touches) e.preventDefault(); }
    cv.addEventListener('mousemove', mv); cv.addEventListener('touchmove', mv, { passive: false });
    RESET[3] = function () { fogDone = false; moves = 0; cv.style.transition = 'none'; cv.style.opacity = '1'; draw(); };
  }

  /* ═════════════ 제4화 · 불 꺼진 방 ═════════════ */
  (function () {
    var room = $('#room'), got = {}, n = 0;
    function find(h) {
      var c = h.dataset.c; if (got[c]) return; got[c] = 1; n++;
      var li = $('#clues li[data-c="' + c + '"]'); li.classList.add('got');
      var pp = D.createElement('p'); pp.className = 'pop'; pp.style.setProperty('--x', h.style.getPropertyValue('--x')); pp.style.setProperty('--y', h.style.getPropertyValue('--y'));
      if (parseFloat(h.style.getPropertyValue('--x')) > 70) pp.classList.add('r');
      pp.textContent = li.querySelector('.hj').textContent; room.appendChild(pp); setTimeout(function () { pp.remove(); }, 3700);
      $('#cnt').textContent = n; key();
      if (n === 4) {
        setTimeout(function () { room.classList.add('all'); ring(2); }, 1400);
        setTimeout(function () { $('#ring').classList.add('on'); }, 4200);
        setTimeout(function () { ready(4); }, 6500);
      }
    }
    function pos(e) {
      var r = room.getBoundingClientRect(), p = e.touches ? e.touches[0] : e, x = p.clientX - r.left, y = p.clientY - r.top;
      room.style.setProperty('--mx', x + 'px'); room.style.setProperty('--my', y + 'px'); room.style.setProperty('--r', Math.max(110, r.width * .11) + 'px');
      $$('.hs', room).forEach(function (h) {
        var hr = h.getBoundingClientRect(), cx = hr.left + hr.width / 2 - r.left, cy = hr.top + hr.height / 2 - r.top;
        if (Math.hypot(cx - x, cy - y) < Math.max(70, r.width * .055)) find(h);
      });
    }
    room.addEventListener('mousemove', pos);
    room.addEventListener('touchmove', function (e) { pos(e); e.preventDefault(); }, { passive: false });
    room.addEventListener('touchstart', pos, { passive: true });
    $$('.hs', room).forEach(function (h) { h.addEventListener('click', function () { find(h); }); });
    RESET[4] = function () { got = {}; n = 0; $('#cnt').textContent = 0; room.classList.remove('all'); $('#ring').classList.remove('on'); $$('#clues li').forEach(function (l) { l.classList.remove('got'); }); room.style.setProperty('--mx', '-400px'); room.style.setProperty('--my', '-400px'); };
  })();

  /* ═════════════ 제5화 · 대답 업는 기록 ═════════════ */
  (function () {
    var L = $('#lgLines'), F = $('#lgF'), Q = $('#lgQ'), led = $('#ledger'), asked = 0;
    var A = ['……', '…………', '……………………'];
    function line(cls, who) { var p = D.createElement('p'); p.className = cls; p.innerHTML = '<b>' + who + '</b><span></span>'; L.appendChild(p); L.scrollTop = L.scrollHeight; return p.querySelector('span'); }
    function type(sp, text, gap, done) { var i = 0; (function t() { if (i < text.length) { sp.textContent += text[i++]; key(); setTimeout(t, gap + Math.random() * gap * .6); } else if (done) done(); })(); }
    function ask(q) {
      q = (q || '').trim(); if (!q || led.classList.contains('busy') || asked >= 3) return;
      led.classList.add('busy'); Q.value = '';
      type(line('q', '문'), q, 55, function () {
        setTimeout(function () {
          type(line('a', '답'), A[asked], 520, function () {
            asked++; led.classList.remove('busy');
            if (asked === 3) {
              led.classList.add('busy');
              setTimeout(function () { var p = D.createElement('p'); p.className = 'note'; p.textContent = '(혐의자는 더 말하지 안는다)'; L.appendChild(p); $('.s5').classList.add('dark'); }, 900);
              setTimeout(function () { ready(5); }, 2600);
            }
          });
        }, 1100);
      });
    }
    F.addEventListener('submit', function (e) { e.preventDefault(); ask(Q.value); });
    $$('.lg-chips button').forEach(function (b) { b.addEventListener('click', function () { ask(b.textContent); }); });
    RESET[5] = function () { asked = 0; L.innerHTML = ''; led.classList.remove('busy'); $('.s5').classList.remove('dark'); };
  })();

  /* ═════════════ 꺼진 편 다시 보기 — 초는 꺼진 채, 장면만 처음부터 ═════════════ */
  RESET[6] = function () { var s6 = $('#s6'); s6.classList.remove('go'); void s6.offsetWidth; setTimeout(function () { s6.classList.add('go'); }, 200); };
  /* 꺼진 편은 어둡게 바래 잇다. 그 장면에 손을 대면 — 꺼진 초가 혼자 다시 켜지고(푸른빛), 장면이 처음부터 돌아감.
     봉투를 떠나면 그 초는 다시 스르르 꺼짐. 단추는 업다. */
  var STG = { 1: '#dev', 2: '#s2', 3: '#fogStage', 4: '#room', 5: '.s5', 6: '#s6' };
  var WH = ['누가 초를 다시 켯소.', '…아즉 다 닑지 안앗소.', '초가 혼자 켜졋소.', '…한 번 더.', '누가 성냥을 그엇소.', '…돌아오섯소.'];
  function eerie() {
    if (!playing) return; var t = AC.currentTime;
    /* 숨을 들이쉬는 소리 (끌 때의 반대) + 낮게 어긋난 두 음 */
    var s = AC.createBufferSource(); s.buffer = noise(1.4);
    var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(380, t); f.frequency.linearRampToValueAtTime(1300, t + 1.1); f.Q.value = .8;
    var g = AC.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.35, t + 1); g.gain.linearRampToValueAtTime(0, t + 1.25);
    s.connect(f); f.connect(g); g.connect(sfx); s.start(t); s.stop(t + 1.4);
    [N(-12), N(-11)].forEach(function (hz, i) {
      var o = AC.createOscillator(), og = AC.createGain(); o.type = 'sine'; o.frequency.value = hz;
      og.gain.setValueAtTime(0, t + 1); og.gain.linearRampToValueAtTime(.06, t + 2.2); og.gain.linearRampToValueAtTime(0, t + 5.5);
      o.connect(og); og.connect(sfx); o.start(t + 1); o.stop(t + 5.6);
    });
  }
  var wcount = 0;
  function setHaunt() {
    var any = !!$('.sc.replay'); D.body.classList.toggle('haunt', any);
    if (any !== haunt) { if (AC) hauntOn(any); else haunt = any; }
  }
  $$('.sc').forEach(function (sc) {
    var n = +sc.dataset.n, st = $(STG[n], sc); if (!st) return;
    if (getComputedStyle(st).position === 'static') st.style.position = 'relative';
    var veil = D.createElement('div'); veil.className = 'ghostveil'; veil.setAttribute('aria-hidden', 'true');
    veil.innerHTML = '<span>꺼진 초 압헤 손을 대 보시오</span>';
    st.appendChild(veil);
    var wh = D.createElement('p'); wh.className = 'whisper'; st.appendChild(wh);
    veil.addEventListener('click', function () {
      if (!sc.classList.contains('out') || sc.classList.contains('replay')) return;
      sc.classList.add('replay'); eerie(); setHaunt();
      var f = $('.fl[data-n="' + n + '"]'), c = $('.cb-row a[data-n="' + n + '"]');
      if (f) { f.classList.remove('fresh'); f.classList.add('spirit'); }
      if (c) c.classList.add('spirit');
      wh.textContent = WH[wcount++ % WH.length]; wh.classList.remove('on'); void wh.offsetWidth; wh.classList.add('on');
      setTimeout(function () { if (RESET[n]) RESET[n](); }, 900);
    });
    /* 봉투를 떠나면 다시 꺼짐 */
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting || !sc.classList.contains('replay')) return;
        sc.classList.remove('replay'); setHaunt();
        var f = $('.fl[data-n="' + n + '"]'), c = $('.cb-row a[data-n="' + n + '"]');
        if (f) { f.classList.remove('spirit'); void f.offsetWidth; f.classList.add('fresh'); }
        if (c) c.classList.remove('spirit');
      });
    }, { threshold: 0 }).observe(sc);
  });

  /* ═════════════ 끝 · 일곱째 초 ═════════════ */
  var end = $('#end');
  /* ═════════════ 끝 — 귀신 대신, 신문이 「당신」을 보도함 ═════════════
     백물어: 초가 다 꺼지면 무엇이 온다 — 경성야록에선 기자가 오고, 호외가 찍힘. 기사의 주인공은 방금까지 닑던 독자.
     쓰는 것: 이 화면의 시계 · 머문 시간 · 초를 끈 차례 · 소리 켬 여부 · 기기 종류(폰/컴퓨터). 어듸로도 보내지 안음 */
  var SINO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  function kn(n) {   /* 숫자 → 「이십삼」 꼴 */
    if (n === 0) return '영'; var out = '', u = [['천', 1000], ['백', 100], ['십', 10]];
    u.forEach(function (x) { var q = Math.floor(n / x[1]); if (q) { out += (q > 1 ? SINO[q] : '') + x[0]; n -= q * x[1]; } });
    return out + (n ? SINO[n] : '');
  }
  var HAN = ['', '一', '二', '三', '四', '五', '六'];
  function report() {
    var now = new Date(), h = now.getHours(), m = now.getMinutes(), mins = Math.max(1, Math.round((Date.now() - T_IN) / 60000));
    var ampm = h < 12 ? '오전' : '오후', h12 = h % 12 || 12;
    var phone = W.matchMedia && matchMedia('(hover: none)').matches;
    var night = h >= 18 || h < 5;
    var when = ampm + ' ' + kn(h12) + ' 시 ' + (m ? kn(m) + ' 분' : '정각');
    var ord = ORDER.map(function (n) { return '제' + HAN[n] + '호'; }).join(' → ');
    return {
      date: '소화 ' + kn(now.getFullYear() - 1925) + ' 년 ' + kn(now.getMonth() + 1) + ' 월 ' + kn(now.getDate()) + ' 일 · ' + when + ' 발행',
      h: '납량란 독자 一名 행방불명',
      sub: '아모도 켜지 안은 일곱째 초가 꺼진 직후 — 마지막 목격지는 「이 화면 압」',
      tx: [
        '오늘 밤 ' + when + ', 경성야록 납량란을 닑던 독자 한 사람의 소식이 끈겻다.',
        '독자는 이 면에 약 ' + kn(mins) + ' 분 동안 머물럿다. 봉투는 ' + ord + ' 의 차례로 열엇고, 그때마다 초를 하나씩 껏다.',
        playing ? '유성기 소리를 켜 둔 채엿다. 마지막 초가 꺼질 때, 곡조도 함께 끈겻다.' : '소리는 끄고 잇섯다. 그래서 — 등 뒤의 소리를 듯지 못하엿을 것이다.',
        (phone ? '독자는 손바닥만 한 전화기를 들고 잇섯다' : '독자는 책상 우의 화면 압헤 안저 잇섯다') + (night ? '. 방 안은 어두웟다고 한다.' : '. 해가 아즉 지지 안앗는데도, 방 안은 어두웟다고 한다.'),
        STORY ? '독자가 마지막으로 투고함에 너은 원고는 이러케 시작한다 — 「' + STORY + '」' : '독자는 일곱째 원고지를 비워 둔 채, 일곱째 초를 껏다.',
        '독자를 마지막으로 본 사람은 — 이 기사를 닑고 잇는 이다.',
        '본보는 이 사람을 보신 이의 제보를 기다린다. 본보 심인계로.'
      ],
      cap: '독자의 마지막 모습 — 사진은 남지 안앗고, 화면에 비친 얼굴만 남앗다.',
      at: when, mins: mins
    };
  }
  function thud() {   /* 윤전기가 한 번 내려앉는 소리 */
    if (!playing) return; var t = AC.currentTime + .05, o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(38, t + .35);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.9, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + .6);
    o.connect(g); g.connect(sfx); o.start(t); o.stop(t + .7);
  }
  function type(el, text, speed, done) {   /* 활자를 하나씩 박음 */
    var i = 0; el.textContent = '';
    (function step() {
      if (i >= text.length) { if (done) done(); return; }
      el.textContent += text.charAt(i++); if (i % 2 === 0) key();
      setTimeout(step, reduce ? 0 : speed + (text.charAt(i - 1) === '.' ? speed * 6 : 0));
    })();
  }
  var HX = $('#hx');
  /* 순서: 여섯 초가 다 꺼짐 → 아모도 켜지 안은 일곱째 초 · 「당신의 괴담」 원고지 → 원고를 넣거나 건너뛰면 일곱째 초가 혼자 꺼짐 → 캄캄 · 전화 · 호외(독자 행방불명) — 이것이 마지막 */
  function ending() { setMode('quiet'); showEnd(); }
  var STORY = '', finaled = false;
  function finale() {
    if (finaled) return; finaled = true;
    var sv = $('.cb-row a.seven'); if (sv) sv.classList.remove('on');
    breath();
    var ec = $('#end'); if (ec) ec.classList.add('snuff');
    setTimeout(hxShow, 1800);
  }
  function hxShow() {
    setMode('quiet');
    var r = report();
    try { sessionStorage.setItem('yk-np-missing', JSON.stringify({ at: r.at, mins: r.mins, t: Date.now() })); } catch (e) {}
    if (!HX) return;
    HX.hidden = false; D.body.classList.add('hx-on');
    var call = $('#hxCall'), sheet = $('#hxSheet');
    sheet.classList.remove('on', 'done'); call.classList.remove('hx-faded'); call.textContent = ''; $('#hxH').textContent = ''; $('#hxSub').textContent = ''; $('#hxTx').innerHTML = ''; $('#hxCap').textContent = '';
    requestAnimationFrame(function () { HX.classList.add('on'); });
    setTimeout(function () { ring(2); }, 1800);
    setTimeout(function () { type(call, '편집국에 전화가 왓소. 수화기 저편에서는 — 활자 박는 소리만 들리오.', 55); }, 2200);
    setTimeout(function () {
      call.classList.add('hx-faded'); thud();
      $('#hxDate').textContent = r.date; sheet.classList.add('on');
      setTimeout(function () { type($('#hxH'), r.h, 90, function () {
        type($('#hxSub'), r.sub, 35, function () {
          var tx = $('#hxTx'), k = 0;
          (function next() {
            if (k >= r.tx.length) { $('#hxCap').textContent = r.cap; sheet.classList.add('done'); return; }
            var line = r.tx[k++], p = D.createElement('p'); if (line.indexOf('마지막으로 본 사람은') > -1) p.className = 'hx-you'; tx.appendChild(p);
            type(p, line, 28, function () { setTimeout(next, p.className ? 1400 : 350); });
          })();
        });
      }); }, 700);
    }, 7600);
  }
  function showEnd() {
    end.classList.add('on');
    setTimeout(function () { end.classList.add('show'); end.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 60);
    setTimeout(function () { $('.cb-row a.seven').classList.add('on'); bell(); }, 5200);
    setTimeout(function () { setMode('room'); }, 8000);
  }

  var T = $('#wgT'), Nn = $('#wgN');
  T.addEventListener('input', function () { Nn.textContent = T.value.length; key(); });
  $('#wgB').addEventListener('click', function () {
    var m = $('#wgM');
    if (!T.value.trim()) { T.placeholder = '빈 원고지는 투고함에 들어가지 안소.'; T.focus(); return; }
    $('#wg').classList.add('sent'); $('#post').classList.add('on'); breath();
    m.innerHTML = '봉투가 투고함에 드러갓소.<br><small>제칠화는 당신의 이약이오. 그런데 — 일곱째 초가 흔들리오.</small>';
    var t1 = T.value.trim().replace(/\s+/g, ' '); STORY = t1.length > 40 ? t1.slice(0, 40) + '…' : t1;
    setTimeout(finale, 5000);
  });
  if ($('#wgSkip')) $('#wgSkip').addEventListener('click', function () { STORY = ''; finale(); });
  if ($('#hxGo')) $('#hxGo').addEventListener('click', function () {
    HX.classList.remove('on'); D.body.classList.remove('hx-on');
    setTimeout(function () { HX.hidden = true; }, 900);
    $('#relight').click();
  });
  $('#relight').addEventListener('click', function () {
    for (var k = 1; k <= 6; k++) lit[k] = 1;
    $$('.fl').forEach(function (f) { f.classList.remove('out', 'fresh', 'ghost'); });
    $$('.cb-row a').forEach(function (a) { a.classList.remove('out', 'on'); });
    $$('.sc').forEach(function (s) { s.classList.remove('out'); var b = $('.blow', s); if (s.classList.contains('ok')) b.disabled = false; });
    D.documentElement.style.setProperty('--lit', 6); $('#left').textContent = 6; ghosted = false;
    ORDER = []; T_IN = Date.now(); STORY = ''; finaled = false; var ec0 = $('#end'); if (ec0) ec0.classList.remove('snuff'); T.value = ''; Nn.textContent = 0; if (HX) { HX.hidden = true; HX.classList.remove('on'); $('#hxSheet').classList.remove('on', 'done'); }
    end.classList.remove('on', 'show'); $('#wg').classList.remove('sent'); $('#post').classList.remove('on'); setMode('room');
    $('#gate').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  hover(D);
})();
