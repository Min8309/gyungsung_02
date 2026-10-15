/* Wall-bound shadows and quiet creature ambience confined to the iron-door room. */
(function(){'use strict';
class RoomAmbience{
 constructor(manager){this.manager=manager;this.voice=null;this.buffer=null;this.inside=false;document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();});this.bytes=fetch('./audio/creatures/creature_02_insectoid_xenomorph.mp3').then(r=>r.ok?r.arrayBuffer():null).catch(()=>null);}
 prepare(){const ctx=this.manager.ctx;if(!ctx)return;if(this.context===ctx)return this.prepared;this.context=ctx;this.prepared=this.bytes.then(bytes=>bytes?ctx.decodeAudioData(bytes.slice(0)):null).then(buffer=>{this.buffer=buffer;}).catch(()=>{});return this.prepared;}
 stop(){const voice=this.voice;if(!voice)return;this.voice=null;const now=this.context.currentTime;voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setValueAtTime(voice.gain.gain.value,now);voice.gain.gain.linearRampToValueAtTime(0,now+.04);try{voice.source.stop(now+.04);}catch{}}
 update(inside,pan){this.inside=inside;this.prepare();const ctx=this.context;if(!inside||this.manager.isMuted||ctx?.state!=='running'){this.stop();return;}if(!this.buffer)return;
  if(!this.voice){const source=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter(),panner=ctx.createStereoPanner();source.buffer=this.buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=2200;source.connect(filter);filter.connect(gain);gain.connect(panner);panner.connect(this.manager.masterGain);gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(.055,ctx.currentTime+.8);const voice={source,gain,filter,panner};this.voice=voice;source.onended=()=>{source.disconnect();gain.disconnect();filter.disconnect();panner.disconnect();};source.start();}
  this.voice.panner.pan.setTargetAtTime(pan,ctx.currentTime,.15);
 }
}
window.GyeongExitHorror={create(game,parent){
 const T=game.sceneAPI,group=new T.Group();group.name='exit-room-moving-hands';parent.add(group);const wallLight=new T.PointLight(0x8d9b92,5,5,2);wallLight.position.set(0,1.8,-21.15);group.add(wallLight);
 const maps={};let loaded=0;
 for(const [name,file] of [['hand','hand-shadow.png'],['swarm','hand-swarm.png']]){const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const texture=new T.CanvasTexture(canvas);texture.wrapS=texture.wrapT=1000;maps[name]=texture;const image=new Image();image.onload=()=>{texture.image=image;texture.needsUpdate=true;controller.textureReady=++loaded===2;};image.src='../mobile-expansion/assets/history/'+file;}
 const shadows=[],skins=[];let seed=1934;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function surface(list,wall,x,y,z,rx,ry,w,h,map,index){const anchor=new T.Group();anchor.position.set(x,y,z);anchor.rotation.set(rx,ry,0);group.add(anchor);const geometry=new T.PlaneGeometry(w,h,16,24),base=new Float32Array(geometry.attributes.position.array);const material=new T.MeshBasicMaterial({map,transparent:true,opacity:list===skins?.68:.8,color:0x090b09,depthWrite:false,side:2});const hand=new T.Mesh(geometry,material);hand.raycast=()=>{};anchor.add(hand);const item={wall,anchor,hand,base,w,h,phase:random()*Math.PI*2,index};list.push(item);return item;}
 surface(skins,'back',0,1.55,-22.31,0,0,3.82,2.95,maps.swarm,0);
 for(const side of [-1,1])surface(skins,side<0?'left':'right',side*1.91,1.55,-19.2,0,-side*Math.PI/2,6.2,2.95,maps.swarm,skins.length);
 surface(skins,'ceiling',0,3.065,-19.2,Math.PI/2,0,3.82,6.2,maps.swarm,3);
 for(const s of skins){const uv=s.hand.geometry.attributes.uv;for(let i=0;i<uv.count;i++){uv.setXY(i,uv.getX(i)*s.w/3+s.phase,uv.getY(i)*s.h/3+s.phase*.3);}uv.needsUpdate=true;}
 for(const wall of ['back','left','right','ceiling'])for(let i=0;i<(wall==='back'?9:12);i++){const w=.42+random()*.55,h=1.5+random()*1.5,u=random(),v=random();let s;
  if(wall==='back')s=surface(shadows,wall,-1.5+u*3,.55+v*1.9,-22.28,0,0,w,h,maps.hand,shadows.length);
  else if(wall==='ceiling')s=surface(shadows,wall,-1.5+u*3,3.045,-17-v*4.8,Math.PI/2,0,w,h,maps.hand,shadows.length);
  else {const side=wall==='left'?-1:1;s=surface(shadows,wall,side*1.89,.55+u*1.9,-17-v*4.8,0,-side*Math.PI/2,w,h,maps.hand,shadows.length);}
  s.angle=(random()-.5)*1.2;s.hand.rotation.z=s.angle;
 }
 const audio=new RoomAmbience(game.soundManager),right=new T.Vector3(),toward=new T.Vector3();
 const controller={group,shadows,skins,audio,textureReady:false,inside:false,update(delta){
  const p=game.camera.position,near=Math.abs(p.x)<3&&p.z< -14.5&&p.z> -24;group.visible=near&&game.room.doorOpenProgress>0;
  this.inside=Math.abs(p.x)<1.88&&p.z< -16.25&&p.z> -22.25&&p.y>=0&&p.y<3.1&&game.room.doorOpenProgress>=1&&!game.gameEnded&&!document.hidden;
  right.set(1,0,0).applyQuaternion(game.camera.quaternion);toward.set(-p.x,0,-20.2-p.z).normalize();audio.update(this.inside,Math.max(-.55,Math.min(.55,right.dot(toward)*.55)));
  if(!near)return;const time=performance.now()/1000;for(const s of [...skins,...shadows]){const skin=skins.includes(s),wave=Math.sin(time*.34+s.phase),positions=s.hand.geometry.attributes.position;
   for(let i=0;i<positions.count;i++){const offset=i*3,x=s.base[offset],y=s.base[offset+1],reach=(y/s.h+.5);positions.setXYZ(i,x+Math.sin(y*2.4+time*.37+s.phase)*(skin?.045:.14)*reach,y+(skin?Math.sin(x*2+time*.25+s.phase)*.045:reach*wave*.3),Math.sin(x*3+y*2+time*.4+s.phase)*(skin?.009:.025));}positions.needsUpdate=true;
   if(!skin){s.hand.rotation.z=s.angle+wave*.13;s.hand.scale.y=1+Math.sin(time*.29+s.phase)*.2;s.hand.material.opacity=.67+Math.sin(time*.31+s.phase)*.15;}
  }

 }};
 if(game.playTimer){const onEnd=game.playTimer.onEnd;game.playTimer.onEnd=function(...args){audio.stop();return onEnd?.apply(this,args);};}
 const update=game.playerControls.update.bind(game.playerControls);game.playerControls.update=delta=>{update(delta);controller.update(delta);};return controller;
}};
})();
