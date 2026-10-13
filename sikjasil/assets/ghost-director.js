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
  /* ── 기괴한 금속 소리 (녹음 파일 없이 그 자리에서 만들어 냄) ──
     0 녹슨 철판 긁는 소리 · 1 활로 켠 쇠 (길게 우는 소리) · 2 멀리서 울리는 쇠 종 · 3 쇠사슬 끌리는 소리 · 4 철문 경첩 삐걱임 */
  function metal(sm, kind, dur, rnd) {
    var ctx = sm && sm.ctx; if (!ctx || sm.isMuted) return;
    if (ctx.state === 'suspended' && ctx.resume) { try { var pr = ctx.resume(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
    var t = ctx.currentTime, out = ctx.createGain(), dest = sm.masterGain || ctx.destination;
    out.gain.value = 0; out.connect(dest);
    /* 쇠 울림 (금속판 공명) */
    var dl = ctx.createDelay(1), fb = ctx.createGain(), lp = ctx.createBiquadFilter();
    dl.delayTime.value = .031 + rnd() * .02; fb.gain.value = .62; lp.type = 'lowpass'; lp.frequency.value = 3800;
    dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(out);
    function noise(sec) { var n = ctx.createBufferSource(), b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * sec), ctx.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; return n; }
    function partials(base, list, g, len, bend) {
      list.forEach(function (r, i) {
        var o = ctx.createOscillator(), gg = ctx.createGain();
        o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.setValueAtTime(base * r, t);
        if (bend) o.frequency.exponentialRampToValueAtTime(base * r * bend, t + len);
        gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime(g / (i + 1), t + .02 + i * .01); gg.gain.exponentialRampToValueAtTime(.0001, t + len * (1 - i * .08));
        o.connect(gg); gg.connect(out); gg.connect(dl); o.start(t); o.stop(t + len + .1);
      });
    }
    var L = Math.max(2.4, dur + .6);
    out.gain.setValueAtTime(.0001, t); var pk = [.9, 1.8, .9, 2.4, .5][kind] || .9;
    out.gain.exponentialRampToValueAtTime(pk, t + dur * .3); out.gain.setValueAtTime(pk, t + dur * .6); out.gain.exponentialRampToValueAtTime(.0001, t + L);
    if (kind === 0) {            // 녹슨 철판 긁기
      var n = noise(L), bp = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      bp.type = 'bandpass'; bp.Q.value = 14; bp.frequency.setValueAtTime(900, t); bp.frequency.exponentialRampToValueAtTime(2600, t + L * .6); bp.frequency.exponentialRampToValueAtTime(700, t + L);
      lfo.frequency.value = 13 + rnd() * 9; lg.gain.value = .5; lfo.connect(lg); lg.connect(g.gain); g.gain.value = .55;
      n.connect(bp); bp.connect(g); g.connect(out); g.connect(dl); n.start(t); lfo.start(t); n.stop(t + L); lfo.stop(t + L);
      partials(1180 + rnd() * 300, [1, 1.47, 2.09], .12, L, .82);
    } else if (kind === 1) {     // 활로 켠 쇠 — 높게 울다 무너짐
      partials(410 + rnd() * 160, [1, 2.76, 5.4, 8.93], .2, L, .71);
      var n2 = noise(L), hp = ctx.createBiquadFilter(), g2 = ctx.createGain(); hp.type = 'highpass'; hp.frequency.value = 3000; g2.gain.value = .05;
      n2.connect(hp); hp.connect(g2); g2.connect(out); n2.start(t); n2.stop(t + L);
    } else if (kind === 2) {     // 멀리서 울리는 쇠 종 (두 번)
      [0, .55 + rnd() * .3].forEach(function (d) {
        var base = 160 + rnd() * 60;
        [1, 2.4, 3.9, 5.43, 6.8].forEach(function (r, i) {
          var o = ctx.createOscillator(), gg = ctx.createGain(); o.frequency.value = base * r * (1 + (Math.random() - .5) * .01);
          gg.gain.setValueAtTime(.0001, t + d); gg.gain.exponentialRampToValueAtTime(.28 / (i + 1), t + d + .008); gg.gain.exponentialRampToValueAtTime(.0001, t + d + L * (.9 - i * .1));
          o.connect(gg); gg.connect(out); gg.connect(dl); o.start(t + d); o.stop(t + d + L);
        });
      });
    } else if (kind === 3) {     // 쇠사슬 끌림
      var c = 0, T = 0;
      while (T < L * .8) {
        var at = t + T, nn = noise(.06), f = ctx.createBiquadFilter(), gg = ctx.createGain();
        f.type = 'bandpass'; f.frequency.value = 2200 + Math.random() * 3000; f.Q.value = 9;
        gg.gain.setValueAtTime(.5 * (.4 + Math.random() * .6), at); gg.gain.exponentialRampToValueAtTime(.0001, at + .06);
        nn.connect(f); f.connect(gg); gg.connect(out); gg.connect(dl); nn.start(at); nn.stop(at + .07);
        T += .05 + Math.random() * .11; c++;
      }
      partials(90, [1, 1.5], .2, L, .9);
    } else {                     // 철문 경첩 삐걱임
      var o = ctx.createOscillator(), am = ctx.createOscillator(), ag = ctx.createGain(), g4 = ctx.createGain(), bp4 = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(140 + rnd() * 50, t); o.frequency.linearRampToValueAtTime(320 + rnd() * 120, t + L * .7); o.frequency.linearRampToValueAtTime(190, t + L);
      am.frequency.setValueAtTime(18, t); am.frequency.linearRampToValueAtTime(34, t + L); ag.gain.value = .5; g4.gain.value = .5;
      bp4.type = 'bandpass'; bp4.frequency.value = 1300; bp4.Q.value = 3;
      am.connect(ag); ag.connect(g4.gain); o.connect(bp4); bp4.connect(g4); g4.connect(out); g4.connect(dl);
      o.start(t); am.start(t); o.stop(t + L); am.stop(t + L);
    }
    setTimeout(function () { try { out.disconnect(); fb.disconnect(); } catch (e) {} }, (L + 3) * 1000);
  }
  function fadeOpacity(seconds) { return seconds<0||seconds>=2.4?0:Math.max(0,Math.min(1,seconds/.45,(2.4-seconds)/.8)); }
  class Director {
    constructor(options) {
      Object.assign(this, options);
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
      /* 나올 때마다 기괴한 쇠 소리 다섯 가지 중 하나 · 비명은 가끔 */
      var rnd = this.random || Math.random, sm = this.soundManager;
      try { metal(sm, Math.floor(rnd() * 5), 2.4, rnd); } catch (e) {}
      if (rnd() < .45) setTimeout(function () { try { sm.playGhostScream(); } catch (e) {} }, 700);
      var record = { number: this.history.length + 1, action:encounter.action||'rush', ghost: encounter.ghost.id, location: place.id, zone:place.zone||'main', point:place.point.slice(), scheduledSeconds: encounter.at, shownAt: now };
      this.history.push(record);
      window.dispatchEvent(new CustomEvent('ghost-encounter', { detail: record }));
      return true;
    }
    hide() {
      this.sprite.visible = false; this.material.opacity = 0;
      this.layer.classList.remove('active'); this.active = null;
    }
    stop() { this.stopped = true; this.hide(); }
    update(now, enabled, elapsed) {
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
  return { Director: Director, createPlan: createPlan, GHOSTS: GHOSTS, PLACES: PLACES, resolveExpandedPlace:resolveExpandedPlace, fadeOpacity:fadeOpacity, ACTIONS:ACTIONS, metal: metal };
});
