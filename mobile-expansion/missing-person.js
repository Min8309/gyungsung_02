/* Drying room side puzzle. Completion returns to exploration, never ends the host game. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GyeongMissingPerson=api;})(typeof window==='object'?window:globalThis,function(){
'use strict';
const PEOPLE=[['hat','검은 모자'],['glasses','안경'],['cap','납작 모자']];
const PHOTO_URLS=[1,2,3].map(n=>'../mobile-expansion/assets/missing-person/photo-'+n+'.png');
const CREDIT='이 사진은 ai생성 이미지 입니다.';
class Puzzle{
 constructor(){this.found=new Set();this.teaserSeen=false;}
 choose(photo,person){if(!Number.isInteger(photo)||photo<0||photo>2||person!=='hat')return false;this.found.add(photo);return true;}
 get solved(){return this.found.size===3;}
}
function render(space,index){
 const game=space.game,state=space.missingPerson,view=game.inspectViewRenderer.viewContainer;game.inspectViewRenderer.actionBar.replaceChildren();view.replaceChildren();game.interactionManager.inspectTagEl.textContent='乾燥室 · 초록 단서';
 const panel=document.createElement('section');panel.className='gm-expansion mp-puzzle';view.appendChild(panel);
 const h=document.createElement('h2');h.textContent='사진 속 사라진 사람 찾기';panel.appendChild(h);
 const touch=document.createElement('p');touch.className='mp-touch-guide';touch.textContent=navigator.maxTouchPoints>0?'모바일: 사진을 향해 조사 버튼을 누르고, 아래 인물 사진을 터치하세요. 설명은 위아래로 스크롤할 수 있어요.':'사진을 조사한 뒤 아래 인물 사진을 선택하세요.';panel.appendChild(touch);
 const help=document.createElement('p');help.className='gp-hints';help.textContent='초록 집게 사진 ① 입구 왼쪽 → ② 가운데 왼쪽 → ③ 안쪽 왼쪽. 세 사진에서 같은 검은 모자 인물을 선택하세요. 잘못 골라도 다시 선택할 수 있어요.';panel.appendChild(help);
 const progress=document.createElement('p');progress.setAttribute('role','status');progress.textContent=`찾은 사진 ${state.found.size}/3`;panel.appendChild(progress);
 if(state.solved){
  space.refreshNotice();space.removeMissingPerson();
  const p=document.createElement('p');p.className='gp-hints';p.textContent='세 사진에서 그가 사라졌다. 마지막 사진 뒷면에 윤전기실 열쇠와 한 줄의 기록이 남아 있다.';panel.appendChild(p);
  const teaser=document.createElement('blockquote');teaser.textContent='“우리는 그를 사진 속에서 찾았다. 그런데 사진 밖의 발자국은… 네 사람의 것이었다.”\n다음 시즌 예고 — 새벽의 윤전기: 아직 인쇄되지 않은 실종자';panel.appendChild(teaser);
  const close=document.createElement('button');close.textContent='예고를 읽었습니다 · 창 닫고 계속 탐색';close.onclick=()=>{state.teaserSeen=true;game.interactionManager.closeInspect();};panel.appendChild(close);return;
 }
 if(index===undefined){const p=document.createElement('p');p.textContent='입구를 지나 왼쪽 벽의 초록 테두리 사진부터 조사하세요. 초록 집게에 ①·②·③ 번호가 적혀 있습니다.';panel.appendChild(p);const start=document.createElement('button');start.textContent='안내 확인 · 초록 집게 사진 찾기';start.onclick=()=>game.interactionManager.closeInspect();panel.appendChild(start);return;}
 const caption=document.createElement('p');caption.textContent=`사진 ${index+1} · 신문사 보관 사진`;panel.appendChild(caption);const credit=document.createElement('p');credit.className='mp-photo-credit';credit.textContent=CREDIT;panel.appendChild(credit);
 if(state.found.has(index)){caption.textContent+=' · 확인 완료 ✓';return;}
 const choices=document.createElement('div');choices.className='mp-portraits mp-real-photo';const image=document.createElement('img');image.src=PHOTO_URLS[index];image.alt='보관 사진: 왼쪽 검은 모자, 가운데 안경, 오른쪽 납작 모자를 쓴 세 인물';choices.appendChild(image);panel.appendChild(choices);
 for(const person of PEOPLE){const b=document.createElement('button');b.className='mp-person';b.innerHTML='<span class="mp-person-label">'+person[1]+'</span>';b.setAttribute('aria-label',person[1]+' 인물 선택');b.onclick=()=>{if(game.gameEnded)return;if(!state.choose(index,person[0])){progress.textContent='괜찮아요. 세 사진에 공통으로 찍힌 검은 모자를 찾아보세요.';return;}if(state.solved){game.sharedInventory.addItem({id:'drying_press_key',name:'윤전기실 열쇠',desc:'사라진 사람의 사진 뒷면에서 찾은 열쇠. 다음 기록은 아직 비어 있다.'});game.soundManager.playFloorboardCreak();}render(space,index);};choices.appendChild(b);}
 const hint=document.createElement('button');hint.textContent='초록 힌트 보기';hint.onclick=()=>{progress.textContent='챙이 넓은 검은 모자를 쓴 사람입니다. 모자 인물을 누르세요.';choices.querySelector('[aria-label="검은 모자 인물 선택"]').classList.add('mp-answer');};panel.appendChild(hint);
}
return{Puzzle,render,PHOTO_URLS,CREDIT};
});
