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
    // Aim assistance for small green clues, limited to nearby visible objects.
    var assistedTargets=[],nextTargetScan=0,assistPoint=new game.sceneAPI.Vector3(),assistForward=new game.sceneAPI.Vector3(),assistDirection=new game.sceneAPI.Vector3();
    var assistRay=interaction.raycaster.clone?interaction.raycaster.clone():new interaction.raycaster.constructor();
    var assistBounds=new game.sceneAPI.Box3(),nextAssistCheck=0,lastAssistedTarget=null,nearbyClues=[];
    var originalInteractionUpdate=interaction.update.bind(interaction);
    function visibleObject(object){for(var parent=object;parent;parent=parent.parent)if(!parent.visible)return false;return true;}
    function belongsTo(object,target){for(var parent=object;parent;parent=parent.parent)if(parent===target)return true;return false;}
    interaction.update=function(){
      originalInteractionUpdate();if(!canExplore()||this.isInspecting)return;
      var now=performance.now();if(now>=nextTargetScan){nextTargetScan=now+500;assistedTargets=[];game.scene.traverse(function(object){if(object.userData?.isInteractable&&object.userData.clueId&&object.userData.type!=='drawer_locked')assistedTargets.push(object);});}
      var current=this.currentInteractable;
      if(now<nextAssistCheck){if(current?.clueId&&current.type!=='drawer_locked')return;if(lastAssistedTarget){this.currentInteractable=lastAssistedTarget;this.setPrompt(lastAssistedTarget);}return;}nextAssistCheck=now+100;
      game.camera.getWorldDirection(assistForward);var best=null,bestScore=Infinity;nearbyClues=[];
      for(var target of assistedTargets){
        if(!visibleObject(target))continue;assistBounds.setFromObject(target);assistBounds.clampPoint(game.camera.position,assistPoint);if(assistPoint.distanceToSquared(game.camera.position)<.0001)target.getWorldPosition(assistPoint);assistDirection.subVectors(assistPoint,game.camera.position);var distance=assistDirection.length();if(distance>2.6||distance<.01)continue;assistDirection.normalize();var alignment=assistDirection.dot(assistForward);if(alignment<.15)continue;
        assistRay.set(game.camera.position,assistDirection);assistRay.far=distance+.25;var blocked=false;
        for(var hit of assistRay.intersectObjects(game.scene.children,true)){if(!visibleObject(hit.object))continue;if(belongsTo(hit.object,target))break;var material=hit.object.material;if(material&&!Array.isArray(material)&&!material.transparent&&hit.distance<distance-.2){blocked=true;break;}}
        if(blocked)continue;if(!nearbyClues.some(function(item){return item.clueId===target.userData.clueId;}))nearbyClues.push(target.userData);var score=distance+(1-alignment)*1.5;if(score<bestScore){best=target.userData;bestScore=score;}
      }
      if(current?.clueId&&current.type!=='drawer_locked')best=current;lastAssistedTarget=best;if(best){this.currentInteractable=best;this.setPrompt(best);}
    };
    var nearbyDialog=document.createElement('dialog');nearbyDialog.id='mobile-nearby-clues';nearbyDialog.setAttribute('aria-label','가까운 초록 단서 선택');document.body.appendChild(nearbyDialog);
    var choosingClue=false;
    function chooseNearbyClue(){reset();choosingClue=false;nearbyDialog.replaceChildren();var heading=document.createElement('h2');heading.textContent='가까운 초록 단서';nearbyDialog.appendChild(heading);for(var data of nearbyClues){var option=document.createElement('button');option.type='button';option.textContent=data.name;option.dataset.clueId=data.clueId;option.onclick=(function(clue){return function(){choosingClue=true;nearbyDialog.close();interaction.triggerInspect(clue);};})(data);nearbyDialog.appendChild(option);}var cancel=document.createElement('button');cancel.textContent='닫고 계속 탐색';cancel.onclick=function(){nearbyDialog.close();};nearbyDialog.appendChild(cancel);interaction.isInspecting=true;controls.unlock();nearbyDialog.showModal();}
    nearbyDialog.addEventListener('close',function(){if(!choosingClue&&!game.gameEnded){interaction.isInspecting=false;controls.lock();}});
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
    var guideButton=document.createElement('button');guideButton.id='mobile-guide-button';guideButton.type='button';guideButton.textContent='플레이 안내';guideButton.setAttribute('aria-haspopup','dialog');panel.appendChild(guideButton);
    var guide=document.createElement('dialog');guide.id='mobile-play-guide';guide.setAttribute('aria-labelledby','mobile-guide-title');
    guide.innerHTML='<h2 id="mobile-guide-title">플레이 방법</h2><p>왼쪽 조이스틱으로 이동하고, 화면을 드래그해 둘러보세요. 물건을 바라본 뒤 오른쪽 픽업·조사 버튼을 누르면 퍼즐을 열 수 있습니다.</p><p>수첩: 모은 단서 확인 · 손전등: 밝히기 · 웅크리기: 낮은 곳 조사 · 집중: 자세히 보기 · 음향: 켜기/끄기</p><h3>현재 목표</h3><p data-mobile-goal></p><h3>소지품</h3><p data-mobile-inventory></p><p>안내를 보는 동안에도 전체 제한 시간은 계속 흐릅니다.</p><button type="button" data-guide-close>닫고 계속 플레이</button>';document.body.appendChild(guide);
    guideButton.onclick=function(){if(!canExplore())return;reset();guide.querySelector('[data-mobile-goal]').textContent=(document.getElementById('archive-route-notice')?.hidden===false?document.getElementById('archive-route-notice').textContent:document.getElementById('exploration-objective')?.textContent)||'물건을 조사해 초록 단서를 찾으세요.';guide.querySelector('[data-mobile-inventory]').textContent=document.getElementById('inventory-items')?.textContent||'아직 모은 물건이 없습니다.';controls.unlock();guide.showModal();};
    guide.querySelector('[data-guide-close]').onclick=function(){guide.close();};
    guide.addEventListener('close',function(){if(!game.gameEnded&&!game.ending&&!document.hidden)controls.lock();});
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
        if(button.dataset.key==='KeyE'&&nearbyClues.length>1&&nearbyClues.some(function(item){return item.clueId===interaction.currentInteractable?.clueId;})){chooseNearbyClue();return;}
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
