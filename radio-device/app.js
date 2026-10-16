/* =========================================================
   ★ 바꾸고 싶은 값은 여기서 ★
   ========================================================= */

// 정답 각도 (0 ~ 359). 다이얼 맨 위 ▼ 표시가 0도, 시계 방향으로 커집니다.
const TARGET_ANGLE = 217;

// 정답으로 인정하는 범위 (± 몇 도)
const SNAP_RANGE = 5;

// 선택 방송 파일: index.html의 body data-broadcast-src에 지정합니다. 없으면 파형만 표시합니다.
const BROADCAST_SRC = document.body.dataset.broadcastSrc || '';

// 다이얼 숫자 범위 (0도 = FREQ_MIN, 한 바퀴 = FREQ_MAX)
const FREQ_MIN = 550;
const FREQ_MAX = 1500;

/* ========================================================= */

const $ = (id) => document.getElementById(id);
const body = document.body;
const dialEl = $('dial');
const freqNum = $('freqNum');
const meterFill = $('meterFill');
const noiseCanvas = $('noise');
const waveCanvas = $('wave');
const playBtn = $('playBtn');
const fileNote = $('fileNote');

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionQuery.matches;
motionQuery.addEventListener?.('change', (e) => {
  reducedMotion = e.matches;
  noiseDirty = true;
});

const state = {
  screen: 'room',
  angle: 0,          // 누적 각도 (몇 바퀴든 그대로 쌓임)
  velocity: 0,       // 손을 뗀 뒤 관성
  dragging: false,
  locked: false,
  noise: 0.08,       // 화면 노이즈 목표값 0~1
  noiseShown: 0.08,  // 부드럽게 따라가는 실제 값
};

const wrap360 = (a) => ((a % 360) + 360) % 360;
const distToTarget = (a) => {
  const d = Math.abs(wrap360(a) - wrap360(TARGET_ANGLE));
  return Math.min(d, 360 - d);
};
const angleToFreq = (a) => Math.round(FREQ_MIN + (wrap360(a) / 360) * (FREQ_MAX - FREQ_MIN));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* =========================================================
   소리 (Web Audio) — 라디오를 처음 누른 뒤에만 켜짐
   ========================================================= */
const audio = {
  ctx: null,
  master: null,
  noiseGain: null,
  band: null,
  analyser: null,
};

function initAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (audio.ctx) { audio.ctx.resume(); return; }

  const ctx = new AC();
  audio.ctx = ctx;
  audio.master = ctx.createGain();
  audio.master.gain.value = 0.9;
  audio.master.connect(ctx.destination);

  // 화이트노이즈 + 가끔 튀는 지직 소리
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    let v = Math.random() * 2 - 1;
    if (Math.random() < 0.0006) v *= 6;
    data[i] = v * 0.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  audio.band = ctx.createBiquadFilter();
  audio.band.type = 'bandpass';
  audio.band.frequency.value = 1800;
  audio.band.Q.value = 0.55;

  audio.noiseGain = ctx.createGain();
  audio.noiseGain.gain.value = 0;

  src.connect(audio.band).connect(audio.noiseGain).connect(audio.master);
  src.start();
}

function setStatic(level, smooth = 0.08) {
  if (!audio.ctx) return;
  const t = audio.ctx.currentTime;
  audio.noiseGain.gain.setTargetAtTime(level * 0.45, t, smooth);
  audio.band.frequency.setTargetAtTime(700 + level * 2600, t, 0.1);
}

// 짧은 소리 하나 (틱, 딸깍)
function blip({ dur = 0.03, gain = 0.05, hp = 2500, thump = 0 }) {
  const ctx = audio.ctx;
  if (!ctx) return;
  const t = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  const s = ctx.createBufferSource();
  s.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = hp;
  const g = ctx.createGain();
  g.gain.value = gain;
  s.connect(f).connect(g).connect(audio.master);
  s.start(t);

  if (thump) {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.08);
    og.gain.setValueAtTime(thump, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(og).connect(audio.master);
    o.start(t);
    o.stop(t + 0.12);
  }
}

/* =========================================================
   화면 전환
   ========================================================= */
function setScreen(name) {
  state.screen = name;
  body.dataset.screen = name;
}

async function goTune() {
  initAudio();
  if (state.screen === 'room') {
    body.classList.add('zooming');
    await wait(reducedMotion ? 350 : 1050);
  }
  startTuning();
  setScreen('tune');
  body.classList.remove('zooming');
  setTimeout(() => dialEl.focus({ preventScroll: true }), 900);
}

function startTuning() {
  stopBroadcast();
  state.locked = false;
  state.velocity = 0;
  dialEl.classList.remove('locked');
  // 정답에서 멀리 떨어진 곳에서 시작 (90~270도 떨어진 곳)
  state.angle = TARGET_ANGLE + 90 + Math.random() * 180;
  lastTickStep = Math.floor(state.angle / 6);
  renderDial();
}

function goRoom() {
  stopBroadcast();
  state.locked = false;
  state.velocity = 0;
  setStatic(0, 0.25);
  body.classList.remove('zooming');
  setScreen('room');
}

async function onTuned() {
  state.locked = true;
  state.velocity = 0;
  state.dragging = false;
  dialEl.classList.remove('dragging');

  // 딸깍 — 정답 자리로 붙음
  const from = state.angle;
  const to = from - (((wrap360(from) - wrap360(TARGET_ANGLE) + 540) % 360) - 180);
  blip({ dur: 0.025, gain: 0.35, hp: 1800, thump: 0.5 });
  dialEl.classList.add('locked');
  await tweenAngle(from, to, reducedMotion ? 0 : 160);

  // 노이즈 사라짐
  setStatic(0, 0.25);
  await wait(1100);
  if (state.screen !== 'tune' || !state.locked) return;

  $('airFreq').textContent = angleToFreq(TARGET_ANGLE);
  setScreen('air');
  setTimeout(() => startBroadcast(), 500);
}

function tweenAngle(from, to, ms) {
  return new Promise((resolve) => {
    if (ms <= 0) { state.angle = to; renderDial(); return resolve(); }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      state.angle = from + (to - from) * e;
      renderDial();
      if (p < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
}

$('radioBtn').addEventListener('click', goTune);
$('toRoom').addEventListener('click', goRoom);
$('retune').addEventListener('click', goTune);

/* =========================================================
   다이얼 돌리기 (마우스 드래그 · 손가락 · 휠 · 키보드)
   ========================================================= */
let lastPointerAngle = 0;
let lastMoveTime = 0;
let lastTickStep = 0;

function pointerAngle(e) {
  const r = dialEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  // 맨 위가 0도, 시계 방향 +
  return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
}

function turnBy(delta) {
  if (state.locked) return;
  state.angle += delta;
  renderDial();
  checkTuned();
}

dialEl.addEventListener('pointerdown', (e) => {
  if (state.locked || state.screen !== 'tune') return;
  e.preventDefault();
  dialEl.setPointerCapture(e.pointerId);
  state.dragging = true;
  state.velocity = 0;
  lastPointerAngle = pointerAngle(e);
  lastMoveTime = performance.now();
  dialEl.classList.add('dragging');
});

dialEl.addEventListener('pointermove', (e) => {
  if (!state.dragging) return;
  const a = pointerAngle(e);
  let d = a - lastPointerAngle;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  lastPointerAngle = a;

  const now = performance.now();
  const dt = Math.max(1, now - lastMoveTime);
  lastMoveTime = now;
  state.velocity = state.velocity * 0.6 + (d / dt) * 16 * 0.4; // 도/프레임

  turnBy(d);
});

function endDrag(e) {
  if (!state.dragging) return;
  state.dragging = false;
  dialEl.classList.remove('dragging');
  try { dialEl.releasePointerCapture(e.pointerId); } catch (_) {}
  // 마지막 움직임 후 잠깐 멈췄다 떼면 관성 없음
  if (performance.now() - lastMoveTime > 80 || reducedMotion) state.velocity = 0;
}
dialEl.addEventListener('pointerup', endDrag);
dialEl.addEventListener('pointercancel', endDrag);

// 마우스 휠
window.addEventListener('wheel', (e) => {
  if (state.screen !== 'tune') return;
  e.preventDefault();
  const unit = e.deltaMode === 1 ? 16 : 1;
  turnBy(Math.max(-12, Math.min(12, e.deltaY * unit * 0.12)));
}, { passive: false });

// 키보드 (← →, PageUp/PageDown)
dialEl.addEventListener('keydown', (e) => {
  const step = { ArrowRight: 2, ArrowUp: 2, ArrowLeft: -2, ArrowDown: -2, PageUp: 15, PageDown: -15 }[e.key];
  if (step === undefined) return;
  e.preventDefault();
  turnBy(step);
});

function checkTuned() {
  if (!state.locked && state.screen === 'tune' && distToTarget(state.angle) <= SNAP_RANGE) {
    onTuned();
  }
}

function renderDial() {
  dialEl.style.transform = `rotate(${state.angle}deg)`;
  const f = angleToFreq(state.angle);
  freqNum.textContent = String(f).padStart(4, ' ');
  dialEl.setAttribute('aria-valuenow', Math.round(wrap360(state.angle)));
  dialEl.setAttribute('aria-valuetext', `${f} 킬로사이클`);

  const dist = distToTarget(state.angle);
  const far = Math.pow(Math.min(1, dist / 140), 1.15); // 0 = 정답, 1 = 아주 멂
  meterFill.style.width = `${(1 - far) * 100}%`;

  if (state.screen === 'tune' || body.classList.contains('zooming')) {
    state.noise = state.locked ? 0 : 0.1 + far * 0.9;
    if (!state.locked) setStatic(0.04 + far * 0.96);
  }

  // 돌릴 때 '틱' (6도마다)
  const tick = Math.floor(state.angle / 6);
  if (tick !== lastTickStep && !state.locked) {
    lastTickStep = tick;
    blip({ dur: 0.012, gain: 0.05, hp: 3500 });
  }
}

/* =========================================================
   방송
   ========================================================= */
const broadcast = {
  el: null,        // <audio> (파일이 있을 때만)
  checked: false,
  playing: false,
  level: 0,        // 파형 높이 (부드럽게)
  wired: false,
};

// 페이지가 열릴 때 파일이 있는지 미리 확인
(function checkBroadcastFile() {
  if (!BROADCAST_SRC) { broadcast.checked = true; fileNote.hidden = false; return; }
  const a = new Audio();
  a.preload = 'auto';
  const done = (ok) => {
    if (broadcast.checked) return;
    broadcast.checked = true;
    broadcast.el = ok ? a : null;
    fileNote.hidden = ok;
    if (ok) a.addEventListener('ended', () => setPlaying(false));
  };
  a.addEventListener('loadedmetadata', () => done(true), { once: true });
  a.addEventListener('error', () => done(false), { once: true });
  setTimeout(() => done(false), 5000);
  a.src = BROADCAST_SRC;
})();

function wireAnalyser() {
  // file:// 로 열면 브라우저 보안 때문에 분석기를 쓰면 소리가 안 나므로 건너뜀
  if (broadcast.wired || !broadcast.el || !audio.ctx || location.protocol === 'file:') return;
  try {
    const srcNode = audio.ctx.createMediaElementSource(broadcast.el);
    audio.analyser = audio.ctx.createAnalyser();
    audio.analyser.fftSize = 1024;
    srcNode.connect(audio.analyser);
    audio.analyser.connect(audio.ctx.destination);
    broadcast.wired = true;
  } catch (_) { /* 파형은 가짜로 그림 */ }
}

function setPlaying(on) {
  broadcast.playing = on;
  playBtn.classList.toggle('is-playing', on);
  playBtn.setAttribute('aria-label', on ? '멈춤' : '재생');
}

async function startBroadcast() {
  if (state.screen !== 'air') return;
  if (broadcast.el) {
    wireAnalyser();
    try {
      await broadcast.el.play();
      setPlaying(true);
    } catch (_) {
      setPlaying(false);
    }
  } else {
    setPlaying(true);
  }
}

function stopBroadcast() {
  if (broadcast.el) broadcast.el.pause();
  setPlaying(false);
}

playBtn.addEventListener('click', () => {
  initAudio();
  if (broadcast.playing) stopBroadcast();
  else startBroadcast();
});

/* =========================================================
   그리기 루프: 화면 노이즈 + 파형 + 관성
   ========================================================= */
const nctx = noiseCanvas.getContext('2d');
const wctx = waveCanvas.getContext('2d');
let noiseImg = null;
let noiseDirty = true;
let lastNoiseDraw = 0;
const INK = [21, 16, 11];
const CREAM = [232, 220, 194];

function sizeCanvases() {
  // 노이즈는 1/3 해상도로 그리고 늘려서 필름 입자처럼
  noiseCanvas.width = Math.max(1, Math.ceil(window.innerWidth / 3));
  noiseCanvas.height = Math.max(1, Math.ceil(window.innerHeight / 3));
  noiseImg = nctx.createImageData(noiseCanvas.width, noiseCanvas.height);
  noiseDirty = true;

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const r = waveCanvas.getBoundingClientRect();
  waveCanvas.width = Math.max(1, Math.round(r.width * dpr));
  waveCanvas.height = Math.max(1, Math.round(r.height * dpr));
}
window.addEventListener('resize', sizeCanvases);

function drawNoise(intensity) {
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const d = noiseImg.data;
  // 먹색 점 + 크림색 점
  for (let i = 0; i < d.length; i += 4) {
    const r = Math.random();
    const c = r < 0.5 ? INK : CREAM;
    d[i] = c[0];
    d[i + 1] = c[1];
    d[i + 2] = c[2];
    d[i + 3] = Math.random() * 150;
  }
  nctx.putImageData(noiseImg, 0, 0);

  // 지직: 가로 띠
  const bands = Math.floor(intensity * 5);
  for (let i = 0; i < bands; i++) {
    const y = Math.random() * h;
    nctx.fillStyle = Math.random() < 0.5 ? 'rgba(21,16,11,.55)' : 'rgba(232,220,194,.18)';
    nctx.fillRect(0, y, w, 1 + Math.random() * 3 * intensity);
  }
  // 필름 긁힘: 세로 실선
  const scratches = Math.floor(intensity * 4 + Math.random() * 1.5);
  for (let i = 0; i < scratches; i++) {
    const x = Math.random() * w;
    nctx.fillStyle = `rgba(232,220,194,${0.25 + Math.random() * 0.35})`;
    nctx.fillRect(x, 0, 0.6, h);
  }
}

function drawWave(now) {
  const W = waveCanvas.width;
  const H = waveCanvas.height;
  if (!W || !H) return;
  wctx.clearRect(0, 0, W, H);
  broadcast.level += ((broadcast.playing ? 1 : 0) - broadcast.level) * 0.08;

  const mid = H / 2;
  const n = 64;
  const gap = W / n;
  const barW = Math.max(1, gap * 0.5);
  wctx.fillStyle = 'rgba(42,33,25,.85)';

  let freq = null;
  if (audio.analyser && broadcast.playing) {
    freq = new Uint8Array(audio.analyser.frequencyBinCount);
    audio.analyser.getByteFrequencyData(freq);
  }

  for (let i = 0; i < n; i++) {
    let amp;
    if (freq) {
      amp = freq[Math.floor((i / n) * freq.length * 0.6)] / 255;
    } else {
      // 파일이 없을 때: 사람 목소리처럼 출렁이는 가짜 파형
      const t = now / 1000;
      amp =
        0.35 +
        0.3 * Math.sin(t * 3.1 + i * 0.35) * Math.sin(t * 1.3 + i * 0.11) +
        0.2 * Math.sin(t * 7.7 + i * 0.9) +
        0.15 * (Math.random() - 0.5);
      amp = Math.max(0.05, Math.min(1, amp));
    }
    const hgt = Math.max(1, (amp * broadcast.level * 0.9 + 0.04) * H * 0.95);
    wctx.fillRect(i * gap + (gap - barW) / 2, mid - hgt / 2, barW, hgt);
  }
}

function loop(now) {
  // 관성: 손을 뗀 뒤 다이얼이 조금 더 돌다가 멈춤
  if (!state.dragging && !state.locked && state.screen === 'tune' && Math.abs(state.velocity) > 0.05) {
    turnBy(state.velocity);
    state.velocity *= 0.93;
  }

  // 화면별 노이즈 바닥값
  if (state.screen === 'room' && !body.classList.contains('zooming')) state.noise = 0.12;
  if (state.screen === 'air') state.noise = 0.1;
  state.noiseShown += (state.noise - state.noiseShown) * (state.locked ? 0.06 : 0.2);
  noiseCanvas.style.opacity = state.noiseShown.toFixed(3);

  if (noiseCanvas.width !== Math.max(1, Math.ceil(window.innerWidth / 3))) sizeCanvases();

  // 움직임 줄이기: 노이즈는 한 장만 그리고 멈춰 둠
  if (reducedMotion) {
    if (noiseDirty) { drawNoise(0.3); noiseDirty = false; }
  } else if (now - lastNoiseDraw > 42) {
    drawNoise(state.noiseShown);
    lastNoiseDraw = now;
  }

  if (state.screen === 'air') {
    if (waveCanvas.width <= 1) sizeCanvases();
    drawWave(now);
  }
  requestAnimationFrame(loop);
}

sizeCanvases();
renderDial();
requestAnimationFrame(loop);
