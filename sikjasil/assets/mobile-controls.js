/* Touch input adapter; desktop keeps native PointerLockControls. */
(function () {
  'use strict';
  if (!matchMedia('(pointer: coarse)').matches && new URLSearchParams(location.search).get('mobilePreview') !== 'archive') return;
  document.documentElement.classList.add('touch-game');
  window.addEventListener('sikjasil-ready', function (event) {
    var game = event.detail, player = game.playerControls, controls = player.controls;
    controls.enabled = false; // Touch/preview look uses this adapter, never native mouse movement.
    var panel = document.createElement('div');
    panel.id = 'mobile-controls';
    panel.innerHTML = '<div id="mobile-pad" aria-label="이동 조이스틱"><span class="joystick-ring"></span><i></i><span class="joystick-label">이동</span></div>' +
      '<div class="mobile-actions" role="group" aria-label="픽업 및 탐색 기능">' +
      '<button class="mobile-pickup" data-key="KeyE" disabled><span aria-hidden="true">＋</span><b>픽업 · 조사</b><small>대상을 바라보세요</small></button>' +
      '<div class="mobile-tools"><button data-key="Tab">수첩</button><button data-key="KeyF">손전등</button><button data-key="KeyC">웅크리기</button><button data-key="KeyZ">집중</button><button data-key="KeyM">음향</button></div></div>';
    document.body.appendChild(panel);
    var pad = panel.querySelector('#mobile-pad'), knob = pad.querySelector('i');
    var pickup = panel.querySelector('.mobile-pickup'), targetLabel = pickup.querySelector('small');
    var interaction = game.interactionManager, originalSetPrompt = interaction.setPrompt;
    interaction.setPrompt = function (target) {
      originalSetPrompt.call(this, target);
      pickup.disabled = !target;
      var label = target ? target.name : '대상을 바라보세요';
      if (targetLabel.textContent !== label) targetLabel.textContent = label;
    };
    var moveId = null, lookId = null, lastX = 0, lastY = 0, moveStrength = 0;
    var originalUpdate = player.update;
    player.update = function (delta) {
      var speed = this.walkSpeed;
      this.walkSpeed = speed * moveStrength;
      try { return originalUpdate.call(this, delta); }
      finally { this.walkSpeed = speed; }
    };
    function reset() {
      player.moveForward = player.moveBackward = player.moveLeft = player.moveRight = player.isSprinting = false;
      moveId = lookId = null;
      moveStrength = 0;
      knob.style.transform = '';
      pad.classList.remove('active');
    }
    function canExplore() {
      return controls.isLocked && !game.gameEnded && !game.ending;
    }
    function sync() {
      panel.hidden = !canExplore();
      if (panel.hidden) reset();
    }
    // Touch browsers cannot acquire pointer lock. Keep the game's lock/unlock
    // lifecycle so inspection, notebook, timer and rewards still behave alike.
    controls.lock = function () {
      if (game.gameEnded || game.ending || document.hidden) return;
      if (!this.isLocked) { this.isLocked = true; this.dispatchEvent({ type: 'lock' }); }
    };
    controls.unlock = function () {
      if (this.isLocked) { this.isLocked = false; this.dispatchEvent({ type: 'unlock' }); }
    };
    controls.addEventListener('lock', sync);
    controls.addEventListener('unlock', sync);
    panel.querySelectorAll('button').forEach(function (button) {
      button.type = 'button';
      button.addEventListener('click', function () {
        if (!canExplore()) return;
        window.dispatchEvent(new KeyboardEvent('keydown', { code: button.dataset.key, bubbles: true, cancelable: true }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: button.dataset.key, bubbles: true }));
      });
    });
    function move(event) {
      var rect = pad.getBoundingClientRect();
      var x = event.clientX - rect.left - rect.width / 2;
      var y = event.clientY - rect.top - rect.height / 2;
      var length = Math.hypot(x, y), limit = rect.width * .32;
      if (length > limit) { x *= limit / length; y *= limit / length; }
      knob.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      var magnitude = Math.min(length / limit, 1);
      moveStrength = magnitude < .15 ? 0 : (magnitude - .15) / .85;
      player.moveLeft = moveStrength ? Math.max(0, -x / limit) : false;
      player.moveRight = moveStrength ? Math.max(0, x / limit) : false;
      player.moveForward = moveStrength ? Math.max(0, -y / limit) : false;
      player.moveBackward = moveStrength ? Math.max(0, y / limit) : false;
    }
    pad.addEventListener('pointerdown', function (event) {
      if (!canExplore() || moveId !== null) return;
      event.preventDefault(); moveId = event.pointerId; pad.setPointerCapture(moveId); pad.classList.add('active'); move(event);
    });
    pad.addEventListener('pointermove', function (event) { if (event.pointerId === moveId) move(event); });
    function endMove(event) {
      if (event.pointerId !== moveId) return;
      moveId = null;
      moveStrength = 0;
      player.moveForward = player.moveBackward = player.moveLeft = player.moveRight = false;
      knob.style.transform = "";
      pad.classList.remove("active");
    }
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (name) { pad.addEventListener(name, endMove); });
    var canvas = game.renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', function (event) {
      if (!canExplore() || lookId !== null) return;
      lookId = event.pointerId; lastX = event.clientX; lastY = event.clientY;
      canvas.setPointerCapture(lookId);
    });
    canvas.addEventListener('pointermove', function (event) {
      if (event.pointerId !== lookId || !canExplore()) return;
      game.camera.rotation.reorder('YXZ');
      game.camera.rotation.y -= (event.clientX - lastX) * .0035;
      game.camera.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2,
        game.camera.rotation.x - (event.clientY - lastY) * .0035));
      lastX = event.clientX; lastY = event.clientY;
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (name) {
      canvas.addEventListener(name, function (event) { if (event.pointerId === lookId) lookId = null; });
    });
    window.addEventListener('blur', function () { reset(); controls.unlock(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { reset(); controls.unlock(); } });
    window.addEventListener('resize', reset);
    game.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    document.querySelector('.start-btn-pulse').textContent = '화면을 터치하여 진입';
    document.querySelector('.controls-guide-box').textContent = '왼쪽 조이스틱: 이동 · 화면 드래그: 시선 · 오른쪽 버튼: 픽업 / 조사 · 가로 화면 권장';
    sync();
  });
})();
