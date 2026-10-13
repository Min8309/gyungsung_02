/* ─────────────────────────────────────────────────────────────
   경성야록 · 이스터에그 「거꾸로 꽂힌 활자」 → 식자실(1934 경성 활판 인쇄소)

   · 기존 index.html / app.js / styles.css 의 코드는 하나도 고치지 않습니다.
     이 파일 하나가 화면이 다 그려진 뒤 맨 아래(하단 칸)에 판권(版權) 한 줄을 덧붙일 뿐입니다.
   · 판권 줄의 '版' 한 자가 거꾸로 박혀 있습니다(오식 誤植). 눈치챈 사람만 누릅니다.
   · 누르면 식자실 입구 → 10분짜리 게임(sikjasil/index.html)이 지면 위에 열림.
   · 호외를 찍어 내면: 활자가 바로 서고 '校正畢' 도장이 찍힘.
     시간이 다 되면: 활자는 그대로 거꾸로, 판권 줄에 '植字工 一名 未歸'가 남음.
   · 진행 기록은 이 브라우저에만 남음 (localStorage: yk-sikjasil)
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  if (window.__ykSikjasil) return; window.__ykSikjasil = true;

  var GAME_URL = 'sikjasil/index.html';
  var KEY = 'yk-sikjasil';
  function getState() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function setState(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* ── 모양 (이 파일 안에서만 씀 · 모든 이름은 ykq- 로 시작) ── */
  var css = '' +
  '.ykq-colo{flex:1 1 100%;width:100%;margin:6px 0 0;padding-top:10px;border-top:1px solid rgba(58,49,40,.28);' +
    'font-family:var(--myeongjo,"Nanum Myeongjo",serif);font-size:11.5px;letter-spacing:.22em;color:var(--fade,#6e6250);' +
    'display:flex;flex-wrap:wrap;gap:4px 22px;align-items:baseline;line-height:1.9}' +
  '.ykq-colo .ykq-l{cursor:default}' +
  '.ykq-colo .ykq-l.gloss{letter-spacing:.06em;color:#3d3328}' +
  '.ykq-colo .ykq-miss{color:#4a3f33}' +
  /* 거꾸로 박힌 활자 — 표시 없이, 마우스를 대면 헐거운 활자처럼 살짝 흔들릴 뿐 */
  '.ykq-type{display:inline-block;transform:rotate(180deg);cursor:pointer;padding:0 .04em;transition:transform .25s ease;' +
    'background:none;border:0;font:inherit;color:inherit;letter-spacing:0;line-height:inherit}' +
  '.ykq-type:hover,.ykq-type:focus-visible{animation:ykq-loose .9s ease-in-out infinite;outline:none;color:var(--ink,#1e1913)}' +
  '@keyframes ykq-loose{0%,100%{transform:rotate(180deg)}30%{transform:rotate(174deg) translateY(-.5px)}60%{transform:rotate(185deg)}}' +
  '.ykq-type.ykq-right{transform:rotate(0deg);animation:none;cursor:pointer}' +
  '.ykq-type.ykq-righting{animation:ykq-set 1.4s cubic-bezier(.5,0,.2,1) forwards}' +
  '@keyframes ykq-set{0%{transform:rotate(180deg)}55%{transform:rotate(-12deg)}75%{transform:rotate(4deg)}100%{transform:rotate(0deg)}}' +
  '.ykq-seal{display:inline-block;margin-left:10px;padding:1px 5px 0;border:1.5px solid var(--seal,#8a2a21);color:var(--seal,#8a2a21);' +
    'font-family:var(--serif,"Noto Serif KR",serif);font-weight:900;font-size:11px;letter-spacing:.12em;transform:rotate(-6deg);opacity:.82;' +
    'writing-mode:horizontal-tb}' +
  '.ykq-seal.ykq-stamp{animation:ykq-stamp .5s cubic-bezier(.3,1.6,.5,1) both}' +
  '@keyframes ykq-stamp{0%{transform:rotate(-6deg) scale(1.9);opacity:0}100%{transform:rotate(-6deg) scale(1);opacity:.82}}' +

  /* 입구: 지면이 납빛으로 식고, 그 활자 한 개가 가운데에 */
  '.ykq-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(14,13,12,0);transition:background .9s ease;font-family:var(--myeongjo,"Nanum Myeongjo",serif)}' +
  '.ykq-gate.on{background:rgba(14,13,12,.94)}' +
  '.ykq-gbox{text-align:center;color:#cfc4ad;max-width:420px;padding:0 24px;opacity:0;transform:translateY(6px);transition:opacity .8s .5s,transform .8s .5s}' +
  '.ykq-gate.on .ykq-gbox{opacity:1;transform:none}' +
  /* 납 활자 한 개: 몸통(네모) 위 글자는 거울상 — 실제 활자는 뒤집혀 새겨지니까 */
  '.ykq-slug{width:96px;height:96px;margin:0 auto 30px;display:flex;align-items:center;justify-content:center;' +
    'background:linear-gradient(145deg,#6b6862,#3c3a36 55%,#2a2926);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 10px 30px rgba(0,0,0,.6);' +
    'font-family:var(--serif,"Noto Serif KR",serif);font-weight:900;font-size:62px;color:#1a1917;text-shadow:0 1px 0 rgba(255,255,255,.12);' +
    'transform:rotate(180deg) scaleX(-1)}' +
  '.ykq-g1{font-size:16px;letter-spacing:.14em;line-height:2;margin:0 0 10px;cursor:default;min-height:4em}' +
  '.ykq-g1.gloss{letter-spacing:.06em;color:#e7dbc2}' +
  '.ykq-g2{font-size:12.5px;letter-spacing:.06em;line-height:1.9;color:#8e846f;margin:0 0 26px}' +
  '.ykq-btns{display:flex;gap:26px;justify-content:center}' +
  '.ykq-btns button{background:none;border:0;border-bottom:1px solid transparent;color:#d8ccb3;font:inherit;font-size:14px;letter-spacing:.2em;cursor:pointer;padding:2px 0}' +
  '.ykq-btns button:hover,.ykq-btns button:focus-visible{border-bottom-color:#d8ccb3;outline:none}' +
  '.ykq-btns .ykq-no{color:#7d7462}' +
  '.ykq-note{margin-top:22px;font-size:11px;letter-spacing:.08em;color:#6c6453}' +

  /* 식자실(게임) 틀 */
  '.ykq-room{position:fixed;inset:0;z-index:2147483001;background:#050606;opacity:0;transition:opacity 1s ease}' +
  '@media(pointer:coarse){.ykq-type:hover,.ykq-type:focus-visible{animation:none}}' +
  '.ykq-room.on{opacity:1}' +
  '.ykq-touch-room .ykq-up{top:max(8px,env(safe-area-inset-top));bottom:auto;right:max(8px,env(safe-area-inset-right));min-height:44px}' +
  '.ykq-room iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#050606}' +
  '.ykq-up{position:absolute;right:18px;bottom:16px;z-index:2;background:rgba(10,10,9,.55);border:1px solid rgba(207,196,173,.25);' +
    'color:#a59a83;font-family:var(--myeongjo,"Nanum Myeongjo",serif);font-size:12px;letter-spacing:.16em;padding:7px 12px;cursor:pointer}' +
  '.ykq-up:hover{color:#e7dbc2;border-color:rgba(231,219,194,.6)}' +
  'html.ykq-lock,html.ykq-lock body{overflow:hidden!important}';

  var style = document.createElement('style');
  style.id = 'ykq-style'; style.textContent = css;
  document.head.appendChild(style);

  /* ── 판권 한 줄 ──
     당시 신문 끝머리의 '발행 겸 인쇄소' 표기를 본뜸. 마우스를 대면 다른 칸처럼 현대어로. */
  var OLD = { a: '發行兼印刷所　京城野錄社 活', b: '部', c: '每夜 子正 前 組版' };
  var KO  = { a: '펴낸 곳 겸 인쇄소　경성야록사 활', b: '부', c: '매일 밤 자정 전 조판' };
  var MISS_OLD = '植字工 一名 未歸', MISS_KO = '식자공 한 명, 아직 돌아오지 않음';

  var foot = document.querySelector('.spread > .foot') || document.querySelector('footer.foot') || document.querySelector('footer');
  if (!foot) return;

  var colo = document.createElement('p');
  colo.className = 'ykq-colo';
  colo.innerHTML =
    '<span class="ykq-l"><span class="ykq-a"></span><button type="button" class="ykq-type" aria-label="활판부의 판 자">版</button><span class="ykq-b"></span></span>' +
    '<span class="ykq-l ykq-c-wrap"><span class="ykq-c"></span></span>' +
    '<span class="ykq-l ykq-miss" hidden></span>';
  foot.appendChild(colo);

  var typeEl = colo.querySelector('.ykq-type');
  var aEl = colo.querySelector('.ykq-a'), bEl = colo.querySelector('.ykq-b'), cEl = colo.querySelector('.ykq-c');
  var missEl = colo.querySelector('.ykq-miss');

  function paint(modern) {
    var t = modern ? KO : OLD;
    aEl.textContent = t.a; bEl.textContent = t.b; cEl.textContent = t.c;
    typeEl.textContent = modern ? '판' : '版';
    missEl.textContent = modern ? MISS_KO : MISS_OLD;
    colo.querySelectorAll('.ykq-l').forEach(function (l) { l.classList.toggle('gloss', !!modern); });
  }
  paint(false);
  /* 다른 칸과 같은 감각: 마우스를 대면 현대어, 떼면 당시 말투 (거꾸로 된 활자는 그대로 거꾸로) */
  colo.addEventListener('mouseenter', function () { paint(true); });
  colo.addEventListener('mouseleave', function () { paint(false); });

  function seal(animate) {
    if (colo.querySelector('.ykq-seal')) return;
    var s = document.createElement('span');
    s.className = 'ykq-seal' + (animate ? ' ykq-stamp' : '');
    s.textContent = '校正畢'; s.title = '교정 끝';
    colo.querySelector('.ykq-c-wrap').appendChild(s);
  }
  function applyState(animate) {
    var st = getState();
    if (st === 'printed') {
      missEl.hidden = true;
      if (animate) {
        typeEl.classList.add('ykq-righting');
        setTimeout(function () { typeEl.classList.remove('ykq-righting'); typeEl.classList.add('ykq-right'); seal(true); }, 1400);
      } else { typeEl.classList.add('ykq-right'); seal(false); }
    } else if (st === 'lost') {
      missEl.hidden = false;
    }
  }
  applyState(false);

  /* ── 입구 ── */
  var touchPlay = matchMedia('(pointer: coarse)').matches;
  var canPlay = touchPlay || ('exitPointerLock' in document);

  function openGate(byRelics) {
    var printed = getState() === 'printed';
    var gate = document.createElement('div');
    gate.className = 'ykq-gate';
    gate.setAttribute('role', 'dialog'); gate.setAttribute('aria-modal', 'true'); gate.setAttribute('aria-label', '식자실 입구');
    var line1 = byRelics
      ? '지면 우에 흘러나온 물건이 넷.<br>모다 식자실 것이오. 돌려주러 나려가 보시겟소?'
      : printed
      ? '바로잡힌 활자이오.<br>그래도 식자실 불은 아즉 켜져 잇소.'
      : '이 활자는 거꾸로 꼬첫소.<br>누가 꼬젓는지, 식자실에 나려가 보시겟소?';
    var line2 = byRelics
      ? '신문 위로 흘러나온 물건이 넷.<br>모두 식자실 물건입니다. 돌려주러 내려가 보시겠습니까?'
      : printed
      ? '바로잡힌 활자입니다.<br>그래도 식자실 불은 아직 켜져 있습니다.'
      : '이 활자는 거꾸로 꽂혀 있습니다.<br>누가 꽂았는지, 식자실에 내려가 보시겠습니까?';
    gate.innerHTML =
      '<div class="ykq-gbox">' +
        '<div class="ykq-slug" aria-hidden="true">版</div>' +
        '<p class="ykq-g1" tabindex="0"></p>' +
        '<p class="ykq-g2"></p>' +
        (canPlay
          ? '<div class="ykq-btns"><button type="button" class="ykq-go">나려간다</button><button type="button" class="ykq-no">그만둔다</button></div>' +
            '<p class="ykq-note">' + (touchPlay ? '소리가 남 · 왼쪽 패드로 이동 · 화면을 밀어 둘러보기 · 가로 화면 권장' : '소리가 남 · 키보드와 마우스로 움직임 · ESC 를 누르면 손이 풀림') + '</p>'
          : '<div class="ykq-btns"><button type="button" class="ykq-no">알앗슴</button></div>' +
            '<p class="ykq-note">식자실은 책상 우의 전산기(PC)에서만 열리오.</p>') +
      '</div>';
    document.body.appendChild(gate);
    requestAnimationFrame(function () { requestAnimationFrame(function () { gate.classList.add('on'); }); });
    /* 다른 칸과 같은 감각: 기본은 당시 말투, 마우스를 대면 현대어 */
    var g1 = gate.querySelector('.ykq-g1'), g2 = gate.querySelector('.ykq-g2');
    var T2_OLD = '소화 구 년 시월 이십사일 밤, 열한 시 오십팔 분.<br>머무를 수 잇는 시간은 십 분.';
    var T2_KO  = '1934년 10월 24일 밤, 11시 58분.<br>머무를 수 있는 시간은 10분.';
    function gloss(m) { g1.innerHTML = m ? line2 : line1; g2.innerHTML = m ? T2_KO : T2_OLD; g1.classList.toggle('gloss', m); }
    gloss(false);
    [g1, g2].forEach(function (el) { el.addEventListener('mouseenter', function () { gloss(true); }); el.addEventListener('mouseleave', function () { gloss(false); }); });
    var go = gate.querySelector('.ykq-go'), no = gate.querySelector('.ykq-no');
    function closeGate() { gate.classList.remove('on'); setTimeout(function () { gate.remove(); }, 700); removeEventListener('keydown', onKey, true); typeEl.focus(); }
    function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); closeGate(); } }
    addEventListener('keydown', onKey, true);
    no.addEventListener('click', closeGate);
    gate.addEventListener('click', function (e) { if (e.target === gate) closeGate(); });
    if (go) {
      go.addEventListener('click', function () { removeEventListener('keydown', onKey, true); enterRoom(gate); });
      setTimeout(function () { go.focus(); }, 900);
    } else { setTimeout(function () { no.focus(); }, 900); }
  }

  /* ── 식자실(게임) ── */
  function enterRoom(gate) {
    document.documentElement.classList.add('ykq-lock');
    var room = document.createElement('div');
    room.className = 'ykq-room';
    if (touchPlay) room.classList.add('ykq-touch-room');
    room.innerHTML = '<iframe title="1934 경성 활판 인쇄소 식자실" allow="fullscreen; autoplay"></iframe>' +
                     '<button type="button" class="ykq-up">지면으로 올라가기</button>';
    var frame = room.querySelector('iframe');
    frame.src = GAME_URL;
    document.body.appendChild(room);
    requestAnimationFrame(function () { room.classList.add('on'); });
    setTimeout(function () { if (gate) gate.remove(); }, 1000);
    frame.addEventListener('load', function () { try { frame.focus(); } catch (e) {} });

    var ended = false, poll;
    /* 게임 코드를 고치지 않고, 같은 사이트 안의 틀이라 화면 상태만 살핌:
       호외 카드가 다 찍혀 나오면 → 'printed' / 시간 끝 화면이 뜨면 → 'lost' */
    poll = setInterval(function () {
      var d; try { d = frame.contentDocument; } catch (e) { return; }
      if (!d || ended) return;
      var card = d.getElementById('card-display'), modal = d.getElementById('reward-card-modal');
      if (modal && modal.classList.contains('active') && card && !card.classList.contains('hidden')) {
        if (getState() !== 'printed') setState('printed');
        room.dataset.result = 'printed';
      }
      var over = d.getElementById('timeout-overlay');
      if (over && !over.hidden && !over.classList.contains('flashing')) {
        ended = true;
        if (getState() !== 'printed') setState('lost');
        setTimeout(leave, 2600);   /* 끝 화면을 잠깐 보여준 뒤 조용히 지면으로 */
      }
    }, 400);

    /* 더블클릭(file://)으로 연 경우엔 위처럼 들여다볼 수 없어서, 게임이 보내 주는 알림으로 받음 */
    function onMsg(ev) {
      if (ev.source !== frame.contentWindow || !ev.data || ended) return;
      var r = ev.data.ykSikjasil;
      if (r === 'printed') { if (getState() !== 'printed') setState('printed'); room.dataset.result = 'printed'; }
      if (r === 'lost') { ended = true; if (getState() !== 'printed') setState('lost'); setTimeout(leave, 2600); }
    }
    window.addEventListener('message', onMsg);

    function leave() {
      clearInterval(poll); window.removeEventListener('message', onMsg);
      room.classList.remove('on');
      setTimeout(function () {
        try { frame.src = 'about:blank'; } catch (e) {}
        room.remove();
        document.documentElement.classList.remove('ykq-lock');
        missEl.hidden = getState() !== 'lost';
        applyState(getState() === 'printed' && !typeEl.classList.contains('ykq-right'));
        colo.scrollIntoView({ block: 'center' });
      }, 1000);
    }
    room.querySelector('.ykq-up').addEventListener('click', leave);
  }

  typeEl.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (relicsDone()) openGate(true); else nudgeTray();
  });

  /* ───────── 흩어진 식자실 물건 (2026. 10. 7) ─────────
     메인 지면 곳곳 열한 자리에 식자실에서 흘러나온 물건이 하나씩 숨어 잇음 (그림: Horror.zip, 종류마다 가장 무서운 한 장).
     칸에 마우스를 스치면 지면 우에 비치고 붉은 점이 깜빡임 → 누르면 왼쪽 아래 '식자공의 소지품'으로.
     아무거나 넷만 모으면 식자실 입구가 열림. (다 모으지 안아도 됨 · 열한 개를 다 모으면 소지품 칸에 표시만)
     모은 물건은 새로고침하면 처음부터 (화면을 보는 동안만 기억) */
  var RKEY = 'yk-relics', NEED = 4;
  var RELICS = [
    { id: 'watch',    host: '.case.c1',          ko: '이름표 달린 회중시계',  pos: 'left:40%;top:69%;width:92px;transform:rotate(-8deg)' },
    { id: 'scissors', host: '.case.c2',          ko: '녹슨 가위',            pos: 'right:4%;top:28%;width:104px;transform:rotate(18deg)' },
    { id: 'pen',      host: '.case.c3',          ko: '펜촉 부러진 만년필',    pos: 'left:46%;top:52%;width:108px;transform:rotate(-12deg)' },
    { id: 'door',     host: '.case.c4',          ko: '긁힌 문 사진',          pos: 'left:4%;top:50%;width:94px;transform:rotate(-5deg)' },
    { id: 'key',      host: '.spread > .index',  ko: '붉은 실 감긴 열쇠',     pos: 'right:3%;bottom:6%;width:96px;transform:rotate(-14deg)' },
    { id: 'mirror',   host: '.rd-appx',          ko: '깨진 손거울',          pos: 'left:4%;top:26%;width:80px;transform:rotate(8deg)' },
    { id: 'doll',     host: '.rd-parlor',        ko: '인형 머리',            pos: 'right:14px;top:120px;width:70px;transform:rotate(-6deg)' },
    { id: 'match',    host: '.ads .ad2.shop1', ko: '타 버린 성냥갑', pos: 'right:4%;bottom:6%;width:78px;transform:rotate(-10deg)' },
    { id: 'flesh',    host: '.ads .ad2.seek2',     ko: '살덩이 같은 덩어리',     pos: 'right:4%;bottom:6%;width:66px;transform:rotate(6deg)' },
    { id: 'bottle',   host: '.ads .ad2.film',    ko: '검붉은 약병',           pos: 'right:5%;bottom:6%;width:40px;transform:rotate(-4deg)' },
    { id: 'cube',     host: '.spread > .foot',   ko: '긁힌 활자 덩어리',       pos: 'right:3%;bottom:0;width:54px;transform:rotate(4deg)' }
  ];
  var CAPS = {"watch": {"old": "열한 시 오십팔 분. 이름표에 적힌 일홈은… {name}이오.", "now": "11시 58분. 이름표에 적힌 이름은… {name_now}이다."}, "scissors": {"old": "날에 감긴 머리카락이 아즉 자라고 잇소.", "now": "날에 감긴 머리카락이 아직도 자라고 있다."}, "pen": {"old": "부러지기 전 마지막 글자는 「살려」엿소. 그 뒤는 당신이 쓰게 되오.", "now": "부러지기 전 마지막 글자는 '살려'였다. 그 뒤는 당신이 쓰게 된다."}, "door": {"old": "문 안쪽 손톱자국이 하나 늘엇소. 방금.", "now": "문 안쪽 손톱자국이 하나 늘었다. 방금."}, "key": {"old": "붉은 실을 풀지 마시오. 실 끝은 당신 손목에 묶여 잇소.", "now": "붉은 실을 풀지 마라. 실 끝은 당신 손목에 묶여 있다."}, "mirror": {"old": "거울 속 당신은 아즉 뒤를 도라보지 안앗소. 당신은 방금 도라봣는대.", "now": "거울 속 당신은 아직 뒤를 돌아보지 않았다. 당신은 방금 돌아봤는데."}, "doll": {"old": "눈을 감겨 주어도 다시 뜨오. 매일 밤, 당신 쪽으로 고개가 조금씩 도라가오.", "now": "눈을 감겨 줘도 다시 뜬다. 매일 밤, 당신 쪽으로 고개가 조금씩 돌아간다."}, "match": {"old": "식자공 다섯이 사라진 밤, 성냥도 다섯 개비가 탓소. 여섯째 자리가 비어 잇소.", "now": "식자공 다섯이 사라진 밤, 성냥도 다섯 개비가 탔다. 여섯째 자리가 비어 있다."}, "flesh": {"old": "만지면 아즉 따뜻하오. 그리고… 맥이 뛰오.", "now": "만지면 아직 따뜻하다. 그리고… 맥이 뛴다."}, "bottle": {"old": "병 바닥에 가라안즌 것은 약이 아니오. 손톱이오.", "now": "병 바닥에 가라앉은 것은 약이 아니다. 손톱이다."}, "cube": {"old": "누가 손톱으로 날을 세엇소. 마지막 금은 오늘 날자요.", "now": "누군가 손톱으로 날짜를 셌다. 마지막 금은 오늘 날짜다."}};
  RELICS.forEach(function (r) { r.img = 'assets/egg/relic-' + r.id + '.webp'; r.cap = CAPS[r.id]; });
  function visitor() {   // 응접실 엽서에 적은 호 (없으면 '당신')
    try { var c = JSON.parse(localStorage.getItem('gsyr-parlor-card-v1') || '{}'); if (c.ho) return { old: c.ho + '생', now: c.ho + '생' }; } catch (e) {}
    return { old: '당신', now: '당신' };
  }
  function capOf(r) {
    var v = visitor(), f = function (t) { return t.replace('{name}', v.old).replace('{name_now}', v.now); };
    return { old: f(r.cap.old), now: f(r.cap.now) };
  }
  /* 모은 물건은 이 화면을 보는 동안만 기억 → 새로고침하거나 다시 켜면 처음부터 (2026. 10. 7)
     예전에 저장해 둔 기록(localStorage: yk-relics)도 지움 */
  try { localStorage.removeItem(RKEY); } catch (e) {}
  var bag = [];
  function got() { return bag.slice(); }
  function save(a) { bag = a.slice(); }
  function relicsDone() { return got().length >= NEED; }

  var rcss = '' +
  '.ykq-host{position:relative}' +
  '.ykq-relic{position:absolute;z-index:6;padding:0;border:0;background:none;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .9s ease .25s,filter .3s}' +
  '.ykq-relic img{display:block;width:100%;height:auto;filter:grayscale(.8) sepia(.55) contrast(1.12) brightness(.95) drop-shadow(0 6px 6px rgba(20,12,4,.45))}' +
  '.ykq-host.ykq-live .ykq-relic,.ykq-relic:focus-visible{opacity:.8;pointer-events:auto}' +
  '@media(pointer:coarse){.ykq-host .ykq-relic{opacity:.8;pointer-events:auto}.ykq-relic::after{opacity:.85}}' +
  '.ykq-relic:hover{opacity:1!important}' +
  '.ykq-relic:hover img{filter:grayscale(.6) sepia(.5) contrast(1.15) drop-shadow(0 0 7px rgba(138,42,33,.55))}' +
  '.ykq-relic::after{content:"";position:absolute;right:-6px;top:-6px;width:9px;height:9px;border-radius:50%;background:#8a2a21;opacity:0;animation:ykq-ping 1.8s ease-out infinite}' +
  '.ykq-host.ykq-live .ykq-relic::after{opacity:.85}' +
  '@keyframes ykq-ping{0%{box-shadow:0 0 0 0 rgba(138,42,33,.5)}80%,100%{box-shadow:0 0 0 12px rgba(138,42,33,0)}}' +
  '.ykq-fly{position:fixed;z-index:2147483000;pointer-events:none;transition:all .9s cubic-bezier(.5,0,.2,1)}' +
  '.ykq-fly img{width:100%;filter:grayscale(.8) sepia(.55) contrast(1.12)}' +
  '.ykq-tray{position:fixed;left:16px;bottom:16px;z-index:2147482990;display:flex;align-items:center;gap:10px;padding:8px 12px 8px 10px;' +
    'background:rgba(231,219,194,.96);border:1px solid #3a3128;box-shadow:0 8px 22px -10px rgba(0,0,0,.6);' +
    'font-family:var(--myeongjo,"Nanum Myeongjo",serif);color:#1e1913;opacity:0;transform:translateY(12px);transition:opacity .5s,transform .5s}' +
  '.ykq-tray{pointer-events:none}' +
  '.ykq-tray.on{opacity:1;transform:none}' +
  '.ykq-tray.on .ykq-open{pointer-events:auto}' +
  '.ykq-tray .ykq-tt{font-size:11.5px;letter-spacing:.1em;line-height:1.5;max-width:13em}' +
  '.ykq-tray .ykq-tt b{display:block;font-family:var(--serif,"Noto Serif KR",serif);font-weight:900;font-size:13px;letter-spacing:.06em}' +
  '.ykq-slots{display:flex;gap:6px}' +
  '.ykq-slot{width:40px;height:40px;border:1px dashed rgba(58,49,40,.55);display:grid;place-items:center;background:rgba(255,250,240,.4)}' +
  '.ykq-slot img{max-width:36px;max-height:34px;filter:grayscale(.8) sepia(.55) contrast(1.12)}' +
  '.ykq-slot.got{border-style:solid;border-color:#3a3128}' +
  '.ykq-more{font-family:var(--serif,"Noto Serif KR",serif);font-weight:700;font-size:12px;color:#6e6250}' +
  '.ykq-open{margin-left:4px;padding:6px 10px;border:1px solid #8a2a21;background:#1e1913;color:#e7dbc2;cursor:pointer;font-family:inherit;font-weight:800;font-size:12px;letter-spacing:.18em;animation:ykq-glow 2s ease-in-out infinite}' +
  '@keyframes ykq-glow{50%{box-shadow:0 0 0 4px rgba(138,42,33,.25)}}' +
  '.ykq-tray.nudge{animation:ykq-nudge .5s}' +
  '@keyframes ykq-nudge{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' +
  /* 주웠을 때: 화면 가득 확대되어 들이닥침 */
  '.ykq-rv{position:fixed;inset:0;z-index:2147483002;cursor:pointer;background:radial-gradient(ellipse at 50% 40%,rgba(28,6,3,.9),rgba(0,0,0,.985) 68%);opacity:0;transition:opacity .25s}' +
  '.ykq-rv.on{opacity:1}' +
  '.ykq-rv.out{opacity:0;transition:opacity .55s ease .25s}' +
  '.ykq-rv::before{content:"";position:absolute;inset:0;background:#8a1a12;mix-blend-mode:screen;opacity:0;animation:ykq-flash .55s steps(2,end) .05s}' +
  '@keyframes ykq-flash{0%{opacity:.75}30%{opacity:0}45%{opacity:.45}100%{opacity:0}}' +
  '.ykq-rv::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.35;mix-blend-mode:overlay;' +
    'background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px);animation:ykq-scan .18s steps(3) infinite}' +
  '@keyframes ykq-scan{50%{transform:translateY(2px)}}' +
  '.ykq-big{position:fixed;z-index:2147483003;pointer-events:none;transform-origin:50% 50%;' +
    'transition:left .5s cubic-bezier(.2,1.4,.3,1),top .5s cubic-bezier(.2,1.4,.3,1),width .5s cubic-bezier(.2,1.4,.3,1),opacity .4s}' +
  '.ykq-big img{display:block;width:100%;height:auto;filter:grayscale(.55) sepia(.45) contrast(1.35) brightness(.9) drop-shadow(0 30px 40px rgba(0,0,0,.8))}' +
  '.ykq-big.shake img{animation:ykq-twitch 1.9s steps(1,end) .45s}' +
  '@keyframes ykq-twitch{0%{transform:none;filter:grayscale(.55) sepia(.45) contrast(1.35) brightness(.9)}8%{transform:translate(-6px,3px) scale(1.02)}10%{transform:none;filter:grayscale(1) contrast(2) brightness(.35)}' +
    '12%{filter:grayscale(.55) sepia(.45) contrast(1.35) brightness(.9)}34%{transform:translate(4px,-2px) rotate(-1deg)}36%{transform:none}' +
    '58%{filter:grayscale(.2) sepia(.2) saturate(2.4) hue-rotate(-18deg) contrast(1.5) brightness(.8)}61%{filter:grayscale(.55) sepia(.45) contrast(1.35) brightness(.9)}' +
    '80%{transform:scale(1.06)}100%{transform:scale(1.03)}}' +
  '.ykq-big.go{transition:left .7s cubic-bezier(.6,0,.3,1),top .7s cubic-bezier(.6,0,.3,1),width .7s cubic-bezier(.6,0,.3,1),opacity .7s}' +
  '.ykq-cap{position:fixed;left:50%;top:calc(76vh / var(--ykz, 1));z-index:2147483004;transform:translateX(-50%);width:min(680px,calc(88vw / var(--ykz, 1)));text-align:center;pointer-events:none;' +
    'font-family:var(--myeongjo,"Nanum Myeongjo",serif);color:#e7dbc2;opacity:0;transition:opacity .6s ease .55s}' +
  '.ykq-rv.on .ykq-cap{opacity:1}' +
  '.ykq-cap b{display:block;font-family:var(--serif,"Noto Serif KR",serif);font-weight:900;font-size:clamp(20px,calc(2.4vw / var(--ykz, 1)),30px);letter-spacing:.3em;color:#f1e6cf;text-shadow:0 0 18px rgba(138,26,18,.7)}' +
  '.ykq-cap span{display:block;margin-top:12px;font-size:clamp(14px,calc(1.25vw / var(--ykz, 1)),17px);letter-spacing:.12em;line-height:1.8}' +
  '.ykq-cap small{display:block;margin-top:6px;font-size:12px;letter-spacing:.08em;color:rgba(231,219,194,.55)}' +
  '.ykq-cap i{display:block;margin-top:18px;font-style:normal;font-size:11px;letter-spacing:.3em;color:rgba(231,219,194,.4)}' +
  '@media (prefers-reduced-motion:reduce){.ykq-relic::after,.ykq-open{animation:none}.ykq-fly{transition:none}' +
    '.ykq-rv::before,.ykq-rv::after,.ykq-big.shake img{animation:none}.ykq-big,.ykq-big.go{transition:opacity .3s}}';
  style.textContent += rcss;

  var NUM = ['영', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열하나'];
  var tray = document.createElement('div');
  tray.className = 'ykq-tray'; tray.setAttribute('aria-live', 'polite');
  tray.innerHTML = '<div class="ykq-tt"><b>식자공의 소지품</b><span class="ykq-cnt"></span></div><div class="ykq-slots"></div><span class="ykq-more"></span>';
  document.body.appendChild(tray);
  function byId(id) { for (var i = 0; i < RELICS.length; i++) if (RELICS[i].id === id) return RELICS[i]; }
  function drawTray() {
    var a = got().filter(byId), n = a.length;
    tray.classList.toggle('on', n > 0);
    tray.querySelector('.ykq-cnt').textContent =
      n >= RELICS.length ? '열한 가지를 다 차잣소' :
      n >= NEED ? NUM[n] + ' 가지 · 식자실 문이 열렷소' :
      '넷이면 문이 열리오 · 지금 ' + NUM[n];
    var slots = tray.querySelector('.ykq-slots'), html = '';
    for (var i = 0; i < NEED; i++) {
      var r = a[i] && byId(a[i]);
      html += '<span class="ykq-slot' + (r ? ' got' : '') + '" title="' + (r ? r.ko : '?') + '">' + (r ? '<img src="' + r.img + '" alt="' + r.ko + '">' : '') + '</span>';
    }
    slots.innerHTML = html;
    tray.querySelector('.ykq-more').textContent = n > NEED ? '+' + (n - NEED) : '';
    var ob = tray.querySelector('.ykq-open');
    if (n >= NEED && !ob) {
      ob = document.createElement('button'); ob.type = 'button'; ob.className = 'ykq-open'; ob.textContent = '식자실 문을 연다';
      ob.addEventListener('click', function () { openGate(true); });
      tray.appendChild(ob);
    }
  }
  function nudgeTray() {
    tray.classList.add('on'); tray.classList.remove('nudge'); void tray.offsetWidth; tray.classList.add('nudge');
    tray.querySelector('.ykq-cnt').textContent = (touchPlay ? '지면의 물건 넷을 눌러 모으시오 (' : '물건이 모자라오 · 지면을 스처 보시오 (') + NUM[got().length] + ' / 넷)';
  }

  function place() {
    var a = got();
    RELICS.forEach(function (r) {
      var host = document.querySelector(r.host);
      if (!host) return;
      host.classList.add('ykq-host');
      var el = host.querySelector('.ykq-relic[data-id="' + r.id + '"]');
      if (a.indexOf(r.id) > -1) { if (el) el.remove(); return; }
      if (el) return;
      el = document.createElement('span'); el.className = 'ykq-relic'; el.dataset.id = r.id;
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.setAttribute('aria-label', '지면 우에 놓인 물건: ' + r.ko); el.setAttribute('style', r.pos);
      el.innerHTML = '<img src="' + r.img + '" alt="">';
      var go = function (e) { e.preventDefault(); e.stopPropagation(); take(r, el); };
      el.addEventListener('click', go, true);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
      host.appendChild(el);
    });
  }
  /* 낮게 쿵 + 바람 소리 (주울 때만, 짧게) */
  var actx = null;
  function thud() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(32, t + .7);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.55, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 1.2);
      var n = actx.createBufferSource(), buf = actx.createBuffer(1, actx.sampleRate * 1.4, actx.sampleRate), d = buf.getChannelData(0);
      for (var k = 0; k < d.length; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / d.length, 2);
      var f = actx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .7;
      var g2 = actx.createGain(); g2.gain.value = .12;
      n.buffer = buf; n.connect(f).connect(g2).connect(actx.destination); n.start(t + .05);
    } catch (e) {}
  }
  var revealing = false;
  function take(r, el) {
    var a = got(); if (a.indexOf(r.id) > -1 || revealing) return;
    revealing = true;
    a.push(r.id); save(a);
    var from = el.getBoundingClientRect(), elImg = el.querySelector('img'); el.remove();
    thud();
    /* ① 화면이 붉게 번쩍 → 물건이 화면 한가운데로 크게 들이닥침 */
    var rv = document.createElement('div'); rv.className = 'ykq-rv'; rv.setAttribute('role', 'dialog'); rv.setAttribute('aria-label', r.ko);
    rv.innerHTML = '<div class="ykq-cap"><b>' + r.ko + '</b><span>' + capOf(r).old + '</span><small>' + capOf(r).now + '</small>' +
      '<i>' + (a.length >= NEED ? '넷이 모엿소 · 식자실 문이 열리오' : '넷 중 ' + NUM[Math.min(a.length, NEED)] + ' · 누르면 넘어가오') + '</i></div>';
    var big = document.createElement('div'); big.className = 'ykq-big';
    big.style.cssText = 'left:' + from.left + 'px;top:' + from.top + 'px;width:' + from.width + 'px';
    big.innerHTML = '<img src="' + r.img + '" alt="">';
    document.body.appendChild(rv); document.body.appendChild(big);
    document.documentElement.classList.add('ykq-lock');
    /* 그림은 화면 위쪽 64% 안에 꽉 차게, 글귀는 그 바로 아래 */
    var im0 = elImg;
    var ratio = (im0 && im0.naturalWidth) ? im0.naturalHeight / im0.naturalWidth : .62;
    var boxH = innerHeight * .62, W = Math.min(innerWidth * .7, boxH / ratio, 820), Hh = W * ratio;
    var top = Math.max(16, innerHeight * .05 + (boxH - Hh) / 2);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      rv.classList.add('on');
      big.style.width = W + 'px'; big.style.left = (innerWidth - W) / 2 + 'px'; big.style.top = top + 'px';
      rv.querySelector('.ykq-cap').style.top = Math.min(innerHeight - 150, top + Hh + 26) + 'px';
      big.classList.add('shake');
    }); });
    /* ② 2.5초 뒤 (또는 누르면) 소지품 칸으로 빨려 들어감 */
    var done = false, timer = setTimeout(finish, 3400);
    rv.addEventListener('click', finish);
    function finish() {
      if (done) return; done = true; clearTimeout(timer);
      tray.classList.add('on'); drawTray();
      var idx = Math.min(a.length, NEED) - 1, slotEl = tray.querySelectorAll('.ykq-slot')[idx], to = slotEl.getBoundingClientRect();
      var keep = slotEl.innerHTML; if (a.length <= NEED) slotEl.innerHTML = '';
      big.classList.remove('shake'); big.classList.add('go');
      big.style.left = to.left + 2 + 'px'; big.style.top = to.top + 4 + 'px'; big.style.width = '36px'; big.style.opacity = '.85';
      rv.classList.add('out');
      setTimeout(function () {
        big.remove(); rv.remove(); document.documentElement.classList.remove('ykq-lock');
        if (a.length <= NEED) slotEl.innerHTML = keep;
        drawTray(); revealing = false;
        if (a.length === NEED) setTimeout(function () { openGate(true); }, 500);   // 넷째를 줍는 순간 문이 열림
      }, 800);
    }
  }
  /* 스치기 감지: 지면이 열리고 2.5초 뒤부터, 마우스를 실제로 움직여 칸에 0.45초 머물면 비침
     (열리자마자 마우스가 칸 우에 놓여 잇어도 물건이 먼저 뜨지 안음) */
  var armed = false, liveT = null, liveHost = null;
  setTimeout(function () { armed = true; }, 2500);
  addEventListener('mousemove', function (e) {
    if (!armed) return;
    var h = e.target.closest && e.target.closest('.ykq-host');
    if (h === liveHost) return;
    clearTimeout(liveT);
    if (liveHost) liveHost.classList.remove('ykq-live');
    liveHost = h;
    if (h) liveT = setTimeout(function () { if (liveHost === h) h.classList.add('ykq-live'); }, 450);
  }, { passive: true });
  document.addEventListener('mouseleave', function () { clearTimeout(liveT); if (liveHost) liveHost.classList.remove('ykq-live'); liveHost = null; });

  drawTray(); place();
  /* 면을 넘기거나 지면이 다시 그려져도 물건이 제자리에 */
  if ('MutationObserver' in window) {
    var tmr = null, spread = document.querySelector('.spread') || document.body;
    new MutationObserver(function () { clearTimeout(tmr); tmr = setTimeout(place, 250); }).observe(spread, { childList: true, subtree: true });
  }
  setTimeout(place, 1500); setTimeout(place, 4000);
})();
