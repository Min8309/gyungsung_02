/* Drying room side puzzle. Completion returns to exploration, never ends the host game. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GyeongMissingPerson=api;})(typeof window==='object'?window:globalThis,function(){
'use strict';
const DIFFERENCES=[{mark:'押收',x:78,y:16,hint:'건조 사진 오른쪽 위에 새로 찍힌 압수 도장을 찾아보세요.'},{mark:'24',x:15,y:82,hint:'건조 사진 왼쪽 아래에 새로 적힌 숫자 24를 찾아보세요.'},{mark:'×',x:53,y:18,hint:'건조 사진 위쪽 가운데에 새로 생긴 × 표시를 찾아보세요.'}];
const PHOTO_URLS=[1,2,3].map(n=>'../mobile-expansion/assets/missing-person/photo-'+n+'.png');
const CREDIT='이 사진은 ai생성 이미지 입니다.';
class Puzzle{
 constructor(){this.found=new Set();this.teaserSeen=false;}
 choose(photo,person){if(!Number.isInteger(photo)||photo<0||photo>2||person!=='difference')return false;this.found.add(photo);return true;}
 get solved(){return this.found.size===3;}
}
function render(space,index){
 const game=space.game,state=space.missingPerson,view=game.inspectViewRenderer.viewContainer;game.inspectViewRenderer.actionBar.replaceChildren();view.replaceChildren();game.interactionManager.inspectTagEl.textContent='乾燥室 · 초록 단서';
 const panel=document.createElement('section');panel.className='gm-expansion mp-puzzle';view.appendChild(panel);
 const h=document.createElement('h2');h.textContent='사진 속 달라진 흔적 · 틀린그림 찾기';panel.appendChild(h);
 const touch=document.createElement('p');touch.className='mp-touch-guide';touch.textContent=navigator.maxTouchPoints>0?'모바일: 사진을 향해 조사 버튼을 누르고, 원본과 비교해 건조 사진의 달라진 곳을 터치하세요. 설명은 위아래로 스크롤할 수 있어요.':'사진을 조사한 뒤 원본과 건조 사진을 비교하세요.';panel.appendChild(touch);
 const help=document.createElement('p');help.className='gp-hints';help.textContent='초록 집게 사진 ① 입구 왼쪽 → ② 가운데 왼쪽 → ③ 안쪽 왼쪽. 각 사진의 원본과 건조본을 비교해 추가된 흔적 한 곳을 찾으세요. 잘못 골라도 다시 선택할 수 있어요.';panel.appendChild(help);
 const progress=document.createElement('p');progress.setAttribute('role','status');progress.textContent=`찾은 사진 ${state.found.size}/3`;panel.appendChild(progress);
 if(state.solved){
  space.refreshNotice();space.removeMissingPerson();
  const p=document.createElement('p');p.className='gp-hints';p.textContent='세 사진의 달라진 흔적을 모두 찾았다. 마지막 사진 뒷면에 윤전기실 열쇠와 한 줄의 기록이 남아 있다.';panel.appendChild(p);
  const teaser=document.createElement('blockquote');teaser.textContent='“우리는 그를 사진 속에서 찾았다. 그런데 사진 밖의 발자국은… 네 사람의 것이었다.”\n다음 시즌 예고 — 새벽의 윤전기: 아직 인쇄되지 않은 실종자';panel.appendChild(teaser);
  const close=document.createElement('button');close.textContent='예고를 읽었습니다 · 창 닫고 계속 탐색';close.onclick=()=>{state.teaserSeen=true;game.interactionManager.closeInspect();};panel.appendChild(close);return;
 }
 if(index===undefined){const p=document.createElement('p');p.textContent='입구를 지나 왼쪽 벽의 초록 테두리 사진부터 조사하세요. 초록 집게에 ①·②·③ 번호가 적혀 있습니다.';panel.appendChild(p);const start=document.createElement('button');start.textContent='안내 확인 · 초록 집게 사진 찾기';start.onclick=()=>game.interactionManager.closeInspect();panel.appendChild(start);return;}
 const caption=document.createElement('p');caption.textContent=`사진 ${index+1} · 신문사 보관 사진`;panel.appendChild(caption);const credit=document.createElement('p');credit.className='mp-photo-credit';credit.textContent=CREDIT;panel.appendChild(credit);
 if(state.found.has(index)){caption.textContent+=' · 확인 완료 ✓';return;}
 const pair=document.createElement('div');pair.className='mp-comparison';panel.appendChild(pair);const difference=DIFFERENCES[index];let target;
 for(const dry of [false,true]){
  const figure=document.createElement('figure'),label=document.createElement('figcaption');label.textContent=dry?'건조 사진 · 달라진 곳을 누르세요':'원본 사진';figure.appendChild(label);const photo=document.createElement('div');photo.className='mp-compare-photo';const image=document.createElement('img');image.src=PHOTO_URLS[index];image.alt=dry?'비교용 건조 사진':'변경 전 원본 사진';photo.appendChild(image);figure.appendChild(photo);pair.appendChild(figure);
  if(dry){photo.onclick=()=>{if(!game.gameEnded)progress.textContent='이곳은 원본과 같아요. 추가된 작은 표시를 찾아보세요. 초록 힌트를 볼 수도 있어요.';};target=document.createElement('button');target.className='mp-difference';target.style.left=difference.x+'%';target.style.top=difference.y+'%';target.textContent=difference.mark;target.setAttribute('aria-label','달라진 흔적 선택');target.onclick=e=>{e.stopPropagation();if(game.gameEnded||!state.choose(index,'difference'))return;if(state.solved){game.sharedInventory.addItem({id:'drying_press_key',name:'윤전기실 열쇠',desc:'세 사진의 달라진 흔적을 확인하고 얻은 열쇠.'});game.soundManager.playFloorboardCreak();}render(space,index);};photo.appendChild(target);}
 }
 const hint=document.createElement('button');hint.textContent='초록 힌트 보기';hint.onclick=()=>{progress.textContent=difference.hint;target.classList.add('mp-answer');};panel.appendChild(hint);

}
return{Puzzle,render,PHOTO_URLS,CREDIT,DIFFERENCES};
});
