/* One encounter director shared by desktop and touch browsers. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SikjasilGhosts = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  var GHOSTS = [
    { id: 'crawler', name: '고개 꺾인 식자공', file: './assets/ghosts/crawler.png' },
    { id: 'shroud', name: '소복의 그림자', file: './assets/ghosts/shroud.png' },
    { id: 'wall', name: '벽을 찢고 나오는 것', file: './assets/ghosts/wall.png' },
    { id: 'hanged', name: '들보에 매달린 해골', file: './assets/ghosts/hanged.png' },
    { id: 'cabinet', name: '얼굴이 열린 여인', file: './assets/ghosts/cabinet.png' },
    { id: 'ink', name: '찢어진 웃음', file: './assets/ghosts/ink.png' }
  ];
  var PLACES = [
    { id: 'ceiling', name: '천장', point: [2.6, 3.3, -2.4], offset: [0, 1.1, 0] },
    { id: 'floor', name: '바닥', point: [0, .8, 2.4], offset: [0, -1.3, 0] },
    { id: 'corner', name: '코너', point: [-3.7, 1.8, -3.1], offset: [-.7, 0, 0] },
    { id: 'cabinet', name: '캐비닛 뒤', point: [-3.7, 2, .1], offset: [-.8, 0, 0] },
    { id: 'wall', name: '벽', point: [4.2, 2.1, -1.8], offset: [.8, 0, 0] },
    { id: 'corridor', name: '복도', point: [0, 1.9, -8.5], offset: [0, 0, -1.8] },
    { id: 'drawer', name: '서랍', point: [.9, 1.1, 1.8], offset: [0, -.8, -.2] },
    { id: 'door', name: '철문 뒤', point: [0, 1.8, -16.2], offset: [0, 0, -1.4] }
  ];
  function shuffled(list, random) {
    var result = list.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var value = result[i]; result[i] = result[j]; result[j] = value;
    }
    return result;
  }
  var ACTIONS=['drop','rise','sweep','rush','corner','retreat'];
  function createPlan(random) {
    random = random || Math.random;
    var ghosts = shuffled(GHOSTS, random), places = shuffled([PLACES[0],PLACES[1],...shuffled(PLACES.slice(2),random).slice(0,4)],random);
    // Six independently random windows, at least 20 seconds apart, before timeout warnings.
    var actions=shuffled(ACTIONS.filter(a=>a!=='drop'&&a!=='rise'),random);
    var hasCeiling=places.slice(0,6).some(p=>p.id==='ceiling'),hasFloor=places.slice(0,6).some(p=>p.id==='floor');
    if(!hasCeiling)actions.push('drop');if(!hasFloor)actions.push('rise');
    return ghosts.map(function (ghost, i) {
      return { at: 20 + i * 90 + random() * 70, ghost: ghost, place: places[i], action:places[i].id==='ceiling'?'drop':places[i].id==='floor'?'rise':actions.shift(), seen: false };
    });
  }
  function resolveExpandedPlace(position, forward, random, fallback) {
    if (position.x < 5.4) return fallback;
    random = random || Math.random;
    var zone = position.x >= 35 ? 'photos' : position.x >= 28 ? 'darkroom' : position.x >= 14 ? 'archive' : 'stairs';
    var bounds = zone === 'photos' ? [35,42,-5.7,.3,3.2] : zone === 'darkroom' ? [28,35,-5.7,.3,3.2] : zone === 'archive' ? [14,28,-6.2,.8,5.2] : [5.4,14,-3.9,-1.5,2.8];
    var floor = zone === 'stairs' ? -Math.max(0,Math.min(20,Math.floor((position.x-5.8)/.32)+1))*.18 : -3.6;
    var clamp = (value,min,max) => Math.max(min+.35,Math.min(max-.35,value));
    var x = clamp(position.x+forward.x*2.2,bounds[0],bounds[1]), z = clamp(position.z+forward.z*2.2,bounds[2],bounds[3]);
    var kind = fallback?.action==='drop'?'ceiling':fallback?.action==='rise'?'floor':fallback?.action?['wall','corner'][Math.min(1,Math.floor(random()*2))]:['ceiling','floor','wall','corner'][Math.min(3,Math.floor(random()*4))];
    var y = floor+1.5, offset = [0,0,0];
    if (kind === 'ceiling') { y=floor+bounds[4]-1.05;offset=[0,.8,0]; }
    if (kind === 'floor') { y=floor+.65;offset=[0,-.9,0]; }
    if (kind === 'wall') { z=forward.z>0?bounds[3]-.25:bounds[2]+.25;offset=[0,0,forward.z>0?.6:-.6]; }
    if (kind === 'corner') { x=forward.x>0?bounds[1]-.4:bounds[0]+.4;z=forward.z>0?bounds[3]-.4:bounds[2]+.4;offset=[forward.x>0?.5:-.5,0,0]; }
    var names={ceiling:'천장',floor:'바닥',wall:'벽',corner:'코너'};
    return {id:kind,name:names[kind],zone:zone,point:[x,y,z],offset:offset};
  }
  function fadeOpacity(seconds) { return seconds<0||seconds>=2.4?0:Math.max(0,Math.min(1,seconds/.45,(2.4-seconds)/.8)); }
  class Director {
    constructor(options) {
      Object.assign(this, options);
      this.popupSound = new window.SikjasilGhostAudio.PopupAudio(this.soundManager,this.random||Math.random);
      this.plan = createPlan(options.random);
      this.encounters = this.plan;
      this.history = [];
      this.active = null;
      this.stopped = false;
      this.ready = false;
      this.lastEncounter = -Infinity;
      this.textures = new Map();
      this.images = new Map();
      this.pending = new Map();
      this.failedAssets = [];
      var T = this.THREE;
      this.material = new T.SpriteMaterial({ transparent: true, opacity: 0, depthWrite: false, depthTest: false, toneMapped: false });
      this.sprite = new T.Sprite(this.material);
      this.sprite.visible = false;
      this.sprite.renderOrder = 500;
      this.sprite.userData.isGhostEffect = true;
      this.sprite.raycast = function () {}; // Effects never hide clues or the door from pickup rays.
      this.scene.add(this.sprite);
      this.layer = document.createElement('div');
      this.layer.id = 'ghost-apparition-overlay';
      this.layer.setAttribute('aria-hidden', 'true');
      this.layer.innerHTML = '<div class="ghost-veil"></div><img class="ghost-figure" alt="" draggable="false">';
      document.body.appendChild(this.layer);
      this.figure = this.layer.querySelector('img');
      var loader = new T.TextureLoader();
      GHOSTS.forEach(ghost => {
        var url = this.resolveMedia(ghost.file);
        // Load/decode the DOM image as well as the scene texture before scheduling it.
        var image = new Image();
        var decoded = new Promise(resolve => {
          image.onload = () => (image.decode ? image.decode() : Promise.resolve()).then(() => resolve(true), () => resolve(true));
          image.onerror = () => resolve(false);
        });
        image.src = url; this.images.set(ghost.id, image);
        var textured = new Promise(resolve => {
          var texture = loader.load(url, () => {
            texture.colorSpace = T.SRGBColorSpace;
            this.textures.set(ghost.id, texture); resolve(true);
          }, undefined, () => resolve(false));
        });
        this.pending.set(ghost.id, Promise.all([decoded, textured]).then(result => {
          if (!result.every(Boolean)) this.failedAssets.push(ghost.file);
          this.ready = GHOSTS.every(g => this.textures.has(g.id) && this.images.get(g.id).complete && this.images.get(g.id).naturalWidth > 0);
        }));
      });
    }
    canShow() { return this.isAllowed ? this.isAllowed() : true; }
    trigger(encounter, now) {
      if (this.stopped || this.active || encounter.seen || !this.ready || !this.canShow()) return false;
      encounter.seen = true;
      var requested={...encounter.place,action:encounter.action};var place=this.resolvePlace?this.resolvePlace(requested):requested;
      var T = this.THREE, point = new T.Vector3(...place.point);
      var origin = point.clone().add(new T.Vector3(...place.offset));
      this.active = { encounter: encounter, startedAt: now, origin: origin, target: point };
      this.material.map = this.textures.get(encounter.ghost.id); this.material.needsUpdate = true;
      this.material.opacity = 0; this.sprite.visible = false; // One screen apparition; avoid a second static world copy.
      this.sprite.position.copy(origin); this.sprite.scale.set(1.5, 2.25, 1);
      this.figure.src = this.images.get(encounter.ghost.id).src;
      this.layer.dataset.location = place.id;this.layer.dataset.zone=place.zone||'main';
      this.layer.dataset.ghost = encounter.ghost.id;this.layer.dataset.action=encounter.action||'rush';
      this.layer.classList.remove('active');
      void this.layer.offsetWidth;
      this.layer.classList.add('active');
      this.lighting.triggerFlicker();
      this.popupSound.play(2.4);
      var record = { number: this.history.length + 1, action:encounter.action||'rush', ghost: encounter.ghost.id, location: place.id, zone:place.zone||'main', point:place.point.slice(), scheduledSeconds: encounter.at, shownAt: now };
      this.history.push(record);
      window.dispatchEvent(new CustomEvent('ghost-encounter', { detail: record }));
      return true;
    }
    hide() {
      this.popupSound.stop();
      this.sprite.visible = false; this.material.opacity = 0;
      this.layer.classList.remove('active'); this.active = null;
    }
    stop() { this.stopped = true; this.hide(); }
    update(now, enabled, elapsed) {
      this.popupSound.prepare();
      if(this.soundManager?.isMuted)this.popupSound.stop(0);
      if (this.stopped) return;
      if (!enabled || !this.canShow()) { if(this.active)this.lastEncounter=now;this.hide(); return; }
      if (this.active) {
        var seconds = (now - this.active.startedAt) / 1000;
        if (seconds >= 2.4) { this.hide(); this.lastEncounter = now; return; }
        var lunge = 1 - Math.pow(1 - Math.min(1, seconds / .2), 3);
        this.sprite.position.lerpVectors(this.active.origin, this.active.target, lunge);
        var scale = 1 + Math.min(.3, seconds * .5);
        this.sprite.scale.set(1.5 * scale, 2.25 * scale, 1);
        this.material.opacity = fadeOpacity(seconds);
        return;
      }
      if (!this.ready || document.hidden || document.querySelector('.gp-room-effect') || now - this.lastEncounter < 8000) return;
      var next = this.plan.find(encounter => !encounter.seen);
      if (next && elapsed >= next.at && elapsed < 597) this.trigger(next, now);
    }
  }
  return { Director: Director, createPlan: createPlan, GHOSTS: GHOSTS, PLACES: PLACES, resolveExpandedPlace:resolveExpandedPlace, fadeOpacity:fadeOpacity, ACTIONS:ACTIONS };
});
