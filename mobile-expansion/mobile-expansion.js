/* Standalone mobile expansion. No automatic connection to the original game. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GyeongMobileExpansion = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const ROOMS = [
    { id: 'archive', title: '地下 資料室 · 쉬움', name: '지하 자료실', difficulty: 1,
      description: '붉은 압수 도장이 찍힌 검열문과 천공 먹지를 대조하시오.',
      clues: ['책상 서랍 틈에 천공 먹지가 끼어 있다.', '초록 격자 모서리: 먹지를 오른쪽 두 칸, 아래 한 칸으로 밀고 글자가 정방향이 되도록 회전하시오.', '도장 규정: 발행일은 월/일 네 자리. 먹지 구멍으로 드러나는 글자를 월과 일로 나누시오.', '먹줄 아래 글자는 격자와 구멍이 맞을 때만 드러난다.'],
      prompt: '날짜를 찾아 암실 열쇠를 얻으세요.',
      answer: '1124', reward: '1124 · 암실 철문 열쇠',
      hint: '먹지 회전을 0도로 맞추고 오른쪽 두 칸, 아래 한 칸. 十一月은 11월, 二十四日은 24일.' },
    { id: 'darkroom', title: '寫眞 暗室 · 매우 어려움', name: '암실', difficulty: 4,
      description: '붉은 등 아래 사진 속 인물이 한 걸음씩 가까워진다.',
      clues: ['현상사의 쪽지: 물에 잠긴 필름을 먼저 씻으시오.', '붉은 등을 켠 뒤 현상액에 담그시오.', '정착액은 얼굴이 나타난 뒤에만 부으시오. 현상액에 담근 뒤 3초는 기다려야 한다.', '작업대의 금지 표시: 현상 전에 정착하면 기록은 영영 사라진다.'],
      prompt: '사진 속에 남은 얼굴을 현상하시오. 작업 순서를 선택하시오.',
      choices: [{ id: 'fix', label: '정착액' }, { id: 'develop', label: '현상액' }, { id: 'wash', label: '필름 세척' }, { id: 'red', label: '붉은 등' }],
      answer: ['wash', 'red', 'develop', 'fix'], reward: '14',
      hint: '필름 세척 → 안전등 → 현상 → 정착. 네 단서에 순서가 나뉘어 있다.' },
    { id: 'press', title: '地下 輪轉機室', name: '지하 윤전기실', difficulty: 3,
      description: '철문이 닫힌다. 멈춘 기계 안에서 사람의 목소리가 들린다.',
      clues: ['제어반의 쪽지: 문서가 먼저, 사진은 그 뒤.', '편집실의 날짜 네 자리와 사진의 두 자리를 이어 여섯 자리 전원을 맞추시오.'],
      prompt: '자료실과 암실에서 얻은 숫자를 이어 전원 암호를 입력하시오.',
      answer: '112414', reward: '호외 출력 준비 완료',
      hint: '편집실의 1124 뒤에 암실의 14를 붙이시오.' }
  ];
  class Expansion {
    constructor(options) {
      if (!options || typeof options.getRemainingSeconds !== 'function') throw new TypeError('기존 게임의 남은 시간을 읽는 getRemainingSeconds가 필요합니다.');
      this.options = options;
      this.rooms = ROOMS.map(room => ({ ...room, answer: Array.isArray(room.answer) ? room.answer.slice() : room.answer }));
      this.index = 0; this.phase = 'idle'; this.solved = new Set(); this.rewards = [];
      this.listeners = new Map(); this.host = null; this.interval = null; this.selection = [];
      this.elapsedInRoom = 0; this.enterRemaining = null;
    }
    on(name, callback) {
      if (!this.listeners.has(name)) this.listeners.set(name, new Set());
      this.listeners.get(name).add(callback);
      return () => this.listeners.get(name)?.delete(callback);
    }
    emit(name, detail) { for (const fn of this.listeners.get(name) || []) fn(detail); }
    get room() { return this.rooms[this.index]; }
    get remaining() {
      const value = Number(this.options.getRemainingSeconds());
      if (!Number.isFinite(value)) throw new TypeError('남은 시간은 유한한 초 단위 숫자여야 합니다.');
      return Math.max(0, Math.min(600, value));
    }
    start(host) {
      if (this.phase !== 'idle') return false;
      // Shared puzzles start on either platform; only the host input adapter differs.
      this.phase = 'playing'; this.host = host || null;
      this.enterRemaining = this.remaining;
      this.tick();
      if (this.phase === 'expired') return false;
      this.render(); this.notifyRoom();
      this.interval = setInterval(() => this.tick(), 250);
      return true;
    }
    notifyRoom() {
      const detail = { room: this.room, index: this.index, rewards: this.rewards.slice() };
      this.options.onRoomChange?.(detail); this.emit('room-enter', detail);
    }
    tick() {
      if (this.phase !== 'playing') return;
      const seconds = this.remaining;
      this.elapsedInRoom = Math.max(0, this.enterRemaining - seconds);
      if (seconds <= 0) {
        this.phase = 'expired'; clearInterval(this.interval); this.interval = null;
        this.render(); this.options.onTimeout?.(); this.emit('timeout');
      }
      const timer = this.host?.querySelector('[data-expansion-timer]');
      if (timer) timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    }
    submit(answer) {
      this.tick();
      if (this.phase !== 'playing' || this.solved.has(this.room.id)) return false;
      const correct = Array.isArray(this.room.answer)
        ? Array.isArray(answer) && answer.length === this.room.answer.length && answer.every((value, i) => value === this.room.answer[i])
        : String(answer).trim() === this.room.answer;
      if (!correct) { this.emit('wrong-answer', { room: this.room.id }); return false; }
      this.solved.add(this.room.id); this.rewards.push({ room: this.room.id, code: this.room.reward });
      this.emit('puzzle-solved', { room: this.room.id, reward: this.room.reward }); this.render();
      return true;
    }
    nextRoom() {
      this.tick();
      if (this.phase !== 'playing' || !this.solved.has(this.room.id)) return false;
      if (this.index === this.rooms.length - 1) {
        this.phase = 'completed'; clearInterval(this.interval); this.interval = null;
        this.render(); this.options.onComplete?.({ rewards: this.rewards.slice() }); this.emit('completed');
      } else {
        this.index++; this.selection = []; this.enterRemaining = this.remaining;
        this.render(); this.notifyRoom();
      }
      return true;
    }
    render() {
      if (!this.host) return;
      // Only fixed module text enters markup. Submitted input is never rendered as HTML.
      this.host.innerHTML = '<section class="gm-expansion" style="background:#0b0e0d;color:#ddd0b7;padding:20px;min-height:70vh;font-family:serif;border:1px solid #574936"><header><small>PC · 모바일 공통 · 단계별 지하 탐색</small><strong data-expansion-timer style="float:right"></strong></header><h2></h2><p data-description></p><div data-clues></div><p data-prompt></p><div data-actions style="display:flex;flex-wrap:wrap;gap:8px"></div><p data-feedback role="status"></p><p data-rewards></p><button data-next style="min-height:48px">다음 방의 문 열기</button><button data-hint style="min-height:48px">단서 다시 살피기</button></section>';
      const find = selector => this.host.querySelector(selector);
      find('h2').textContent = `${this.index + 1}. ${this.room.title}`;
      find('[data-description]').textContent = this.phase === 'expired' ? '10분이 끝났다. 지하의 문은 더 이상 열리지 않는다.' : this.phase === 'completed' ? '전원이 돌아왔다. 이제 호외를 인쇄할 수 있다.' : this.room.description;
      find('[data-prompt]').textContent = this.room.prompt;
      for (const clue of this.room.clues) { const p = document.createElement('p'); p.textContent = clue; find('[data-clues]').appendChild(p); }
      const actions = find('[data-actions]'), feedback = find('[data-feedback]');
      if (this.phase === 'playing' && !this.solved.has(this.room.id)) {
        if (this.room.choices) {
          for (const choice of this.room.choices) {
            const b = document.createElement('button'); b.textContent = choice.label; b.style.minHeight = '48px';
            b.onclick = () => {
              this.selection.push(choice.id); b.disabled = true;
              feedback.textContent = this.selection.map(id => this.room.choices.find(c => c.id === id).label).join(' → ');
              if (this.selection.length === this.room.answer.length && !this.submit(this.selection)) { this.selection = []; for (const button of actions.querySelectorAll('button')) button.disabled = false; feedback.textContent = '순서가 맞지 않는다. 기록을 다시 대조하시오.'; }
            }; actions.appendChild(b);
          }
        } else {
          const input = document.createElement('input'); input.inputMode = 'numeric'; input.maxLength = this.room.id==='press'?6:4; input.setAttribute('aria-label', '전원 암호 여섯 자리');
          const b = document.createElement('button'); b.textContent = '전원 암호 확인'; b.style.minHeight = '48px';
          b.onclick = () => { if (!this.submit(input.value)) feedback.textContent = '기계가 응답하지 않는다. 앞선 방의 숫자를 대조하시오.'; };
          actions.append(input, b);
        }
      }
      find('[data-rewards]').textContent = this.rewards.map(r => `${this.rooms.find(room => room.id === r.room).name}: ${r.code}`).join(' / ');
      const next = find('[data-next]'); next.disabled = this.phase !== 'playing' || !this.solved.has(this.room.id);
      next.textContent = this.index === 2 ? '호외 인쇄로 이어가기' : '다음 방의 문 열기'; next.onclick = () => this.nextRoom();
      find('[data-hint]').onclick = () => { feedback.textContent = this.elapsedInRoom >= 45 ? this.room.hint : '지금 방의 기록을 대조하시오. 45초 뒤 추가 단서를 볼 수 있다.'; };
      const seconds = this.remaining; find('[data-expansion-timer]').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
      if(typeof window==='object')window.GyeongRoomPuzzles?.render(this);
    }
    destroy() { clearInterval(this.interval); this.interval = null; this.phase = 'disposed'; this.listeners.clear(); if (this.host) this.host.replaceChildren(); this.host = null; }
  }
  return { Expansion, rooms: ROOMS };
});
