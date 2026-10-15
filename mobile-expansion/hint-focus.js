/* Low-intensity clues brighten only under the pointer/aim; no global green pulse. */
(function(){'use strict';window.addEventListener('sikjasil-ready',function(event){
 const game=event.detail,T=game.sceneAPI,point=new T.Vector3(),pointer={x:0,y:0};let pointerUsed=false;
 const ray=new game.interactionManager.raycaster.constructor(),targets=[];
 window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer.x=e.clientX/window.innerWidth*2-1;pointer.y=1-e.clientY/window.innerHeight*2;pointerUsed=true;});
 game.scene.traverse(object=>{if(!object.isMesh||!object.material)return;const materials=Array.isArray(object.material)?object.material:[object.material];if(object.isHintAccent||object.userData.isPuzzleMarker||materials.some(m=>m.color?.getHex()===0x39c85a)){
  object.material=Array.isArray(object.material)?materials.map(m=>m.clone()):object.material.clone();
  const list=Array.isArray(object.material)?object.material:[object.material];for(const m of list){m.transparent=true;m.opacity=.22;m.depthWrite=false;}targets.push({object,materials:list});
 }});
 const nativeUpdate=game.hintSystem.update.bind(game.hintSystem);game.hintSystem.update=(elapsed,delta)=>{
  nativeUpdate(elapsed,delta);
  const exploring=game.playerControls.controls.isLocked&&!game.gameEnded;
  // Locked desktop controls use the crosshair; unlocked pointer uses its actual position.
  ray.setFromCamera(exploring?{x:0,y:0}:pointerUsed?pointer:{x:0,y:0},game.camera);
  const hits=exploring?ray.intersectObjects(game.scene.children,true):[];const hit=hits.find(h=>h.object.visible&&h.distance<=3.5);
  function related(object){for(let o=hit?.object;o;o=o.parent)if(o===object)return true;return false;}
  for(const item of game.hintSystem.clueRegistry){const active=exploring&&related(item.object);for(const m of item.meshList)if(m.emissive){m.emissive.setHex(0x39c85a);m.emissiveIntensity=active?1.25:.035;}}
  for(const target of targets){target.object.getWorldPosition(point);const active=exploring&&(related(target.object)||(hit&&point.distanceTo(hit.point)<.55));const opacity=active?.92:.22;for(const m of target.materials)m.opacity+=(opacity-m.opacity)*Math.min(1,Math.max(0,delta)*12);}
 };
 game.hintFocus={targets};
});})();
