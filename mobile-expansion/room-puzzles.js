/* Shared PC/touch puzzle state and accessible pointer/keyboard controls. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GyeongRoomPuzzles=api;})(typeof window==='object'?window:globalThis,function(){
'use strict';
class EditingPuzzle{
 constructor(){this.paper=false;this.x=0;this.y=0;this.rotation=1;this.revealed=false;this.solved=false;this.failures=0;}
 collect(){this.paper=true;}
 alignWithGuide(){if(!this.paper)return false;this.x=2;this.y=1;this.rotation=0;return this.align();}
 align(){this.revealed=this.paper&&this.x===2&&this.y===1&&this.rotation===0;return this.revealed;}
 stamp(code){if(this.solved)return false;if(!this.revealed||String(code)!=='1124'){this.failures++;return false;}this.solved=true;return true;}
}
class DevelopingPuzzle{
 constructor(clock=()=>Date.now()){this.clock=clock;this.developedAt=null;this.safe=true;this.stage=0;this.burned=false;this.solved=false;this.failures=0;}
 light(safe){if(this.solved)return false;this.safe=safe;if(!safe)this.burn();return true;}
 burn(){this.burned=true;this.stage=0;this.failures++;return false;}
 refill(){if(this.solved)return false;this.safe=true;this.burned=false;this.stage=0;this.developedAt=null;return true;}
 act(action){if(this.solved||this.burned)return false;if(!this.safe||['wash','red','develop','fix'][this.stage]!==action||(action==='fix'&&this.clock()-this.developedAt<3000))return this.burn();if(action==='develop')this.developedAt=this.clock();this.stage++;if(this.stage===4)this.solved=true;return true;}
}
function render(quest){
 if(!quest.host||!['archive','darkroom'].includes(quest.room.id))return;
 const host=quest.host,actions=host.querySelector('[data-actions]'),feedback=host.querySelector('[data-feedback]');actions.replaceChildren();
 host.querySelector('header small').textContent='PC · 모바일 공통 퍼즐';host.querySelector('section').style.minHeight='0';
 quest.puzzleStates??={archive:new EditingPuzzle(),darkroom:new DevelopingPuzzle()};const state=quest.puzzleStates[quest.room.id];
 function button(label,fn){const b=document.createElement('button');b.textContent=label;b.style.minHeight='48px';b.disabled=quest.phase!=='playing'||quest.solved.has(quest.room.id);b.onclick=()=>{quest.tick();if(quest.phase!=='playing')return;fn();quest.render();};actions.appendChild(b);return b;}
 quest.hintLevels??={archive:0,darkroom:0};
 const hints=quest.room.id==='archive'?[
  '① 먹지 얻기 → ② 먹지 한 번에 맞추기 → ③ 날짜 1124 입력 → ④ 스탬프 찍기. 순서대로 누르면 됩니다.',
  '초록 메모의 발행일은 11월 24일입니다. 월 두 자리 11과 일 두 자리 24를 붙이면 1124입니다.',
  '완료 후 조사창을 닫고 자료실 끝의 暗室 표지와 검은 커튼으로 가세요. 커튼을 조사해 열쇠로 철문을 열고 인화 작업대를 조사하세요.'
 ]:[
  '벽의 현상사 메모를 읽으세요. 맑은 물 → 붉은 안전등 → 현상액 → 정착액 순서입니다.',
  '현상액에 담근 뒤 최소 3초 기다려 윤전기와 인물이 드러나면 정착액을 넣으세요. 일반 전등을 켜면 실패합니다.',
  '실패했다면 약품 다시 채우기를 누르세요. 필름 세척 → 붉은 안전등 확인 → 현상액 침지 → 3초 대기 → 정착액 투입으로 숫자 14를 얻습니다.'
 ];
 const hintBox=document.createElement('aside');hintBox.className='gp-hints';hintBox.dataset.puzzleHints='';hintBox.setAttribute('aria-label','퍼즐 도움말');const heading=document.createElement('strong');heading.textContent='초록 메모 · 퍼즐 힌트';hintBox.appendChild(heading);
 for(let i=0;i<=quest.hintLevels[quest.room.id];i++){const p=document.createElement('p');p.textContent=hints[i];hintBox.appendChild(p);}host.querySelector('[data-prompt]').after(hintBox);
 if(quest.room.id==='archive'){host.querySelector('[data-clues]').hidden=true;const details=document.createElement('details');details.className='gp-guide';const summary=document.createElement('summary');summary.textContent='풀이 방법 · 다음 장소 안내';details.appendChild(summary);for(const hint of hints.slice(1)){const p=document.createElement('p');p.textContent=hint;details.appendChild(p);}hintBox.appendChild(details);}
 const hintButton=host.querySelector('[data-hint]');hintButton.textContent=quest.hintLevels[quest.room.id]<2?'다음 힌트 보기':'힌트 모두 표시됨';hintButton.disabled=quest.hintLevels[quest.room.id]>=2;hintButton.onclick=()=>{quest.hintLevels[quest.room.id]=Math.min(2,quest.hintLevels[quest.room.id]+1);quest.render();};
 const artifact=document.createElement('div');artifact.className='gp-artifact';actions.before(artifact);
 if(quest.room.id==='archive'){
  artifact.innerHTML='<div class="gp-ledger"><span class="gp-seal">押收 · 檢閱</span><p>京城日報 · 검열 기사 대장</p><p>발행일 <span class="gp-ink">██████████</span></p><div class="gp-grid" aria-label="기사 대조 격자"></div><div class="gp-carbon"></div></div>';
  const grid=artifact.querySelector('.gp-grid');for(const c of ['京','日','報','禁','押','十','一','封','密','二','四','印','黑','未','見','止']){const span=document.createElement('span');span.textContent=c;grid.appendChild(span);}
  const carbon=artifact.querySelector('.gp-carbon');carbon.hidden=!state.paper;carbon.style.transform=`translate(${state.x*12}px,${state.y*12}px) rotate(${state.rotation*90}deg)`;
  if(state.revealed){carbon.classList.add('aligned');feedback.textContent='구멍 사이에 十 · 一 · 二 · 四가 보인다. 발행일 표기는 월/일 네 자리이다.';}else feedback.textContent=state.paper?`먹지 위치: 가로 ${state.x}, 세로 ${state.y} · 회전 ${state.rotation*90}°. 네 모서리의 초록 기준선에 맞추시오.`:'책상 서랍 틈에 구겨진 먹지가 끼어 있다.';
  if(state.solved){
   artifact.hidden=true;hintBox.hidden=true;host.querySelector('[data-prompt]').hidden=true;
   feedback.textContent='✓ 자료실 완료! 암실 철문 열쇠를 얻었습니다. 조사창을 닫고 자료실 끝의 暗室 표지·검은 커튼을 찾아가세요. 커튼을 조사해 철문을 연 뒤, 안쪽 인화 작업대에서 필름 세척 → 붉은 안전등 → 현상액 → 3초 기다리기 → 정착액 순서로 진행하세요.';
  }else if(!state.paper)button('① 서랍 틈의 천공 먹지 얻기',()=>{state.collect();quest.emit('item-acquired',{id:'perforated_carbon',name:'천공 기름종이',desc:'검열문의 초록 격자와 맞추는 구멍 뚫린 먹지.'});});
  else if(!state.revealed){
   button('② 먹지 한 번에 맞추기',()=>state.alignWithGuide());
   feedback.textContent='먹지를 얻었습니다. “먹지 한 번에 맞추기”를 누르면 날짜가 드러납니다.';
  }else{
   feedback.textContent='발행일은 11월 24일입니다. 아래에 1124를 입력하고 스탬프를 찍으세요. 입력이 어려우면 “단서 날짜 넣기”를 누르세요.';
   const label=document.createElement('label');label.className='gp-date-label';label.textContent='③ 날짜 스탬프 (월 11 + 일 24)';
   const input=document.createElement('input');input.type='text';input.inputMode='numeric';input.maxLength=4;input.placeholder='1124';input.setAttribute('aria-label','날짜 스탬프 네 자리');input.value=quest.stampDraft||'';input.oninput=()=>{input.value=input.value.replace(/[^0-9]/g,'').slice(0,4);quest.stampDraft=input.value;};label.appendChild(input);actions.appendChild(label);
   button('단서 날짜 1124 넣기',()=>{quest.stampDraft='1124';});
   button('④ 서류함 봉인에 스탬프 찍기',()=>{if(state.stamp(input.value))quest.submit('1124');else quest.puzzleMessage='괜찮아요. 11월 24일을 네 자리 1124로 입력해 다시 찍으세요. 먹지를 다시 맞출 필요는 없습니다.';});
  }
 }else{
  quest.emit('safe-light',{safe:state.safe});const image=document.createElement('div');image.className='gp-latent stage-'+state.stage+(state.burned?' burned':'');image.tabIndex=0;image.setAttribute('aria-label','잠상 인화지 — 트레이로 드래그하거나 아래 처리 버튼을 누르세요');image.innerHTML='<div class="gp-press">輪轉機<br><span>14</span><i></i></div>';artifact.appendChild(image);
  if(state.burned)feedback.textContent='인화지가 새까맣게 타버렸다. 약품을 다시 채우고 새 인화지로 시작하시오.';
  else feedback.textContent=['백지 인화지 · 아직 아무것도 보이지 않는다.','필름 세척 완료 · 붉은 안전등을 확인하시오.','안전등 확인 완료 · 현상액을 사용할 수 있다.','잠상이 떠오르는 중이다. 윤전기와 얼굴이 드러날 때까지 3초 이상 기다린 뒤 정착액으로 고정하시오.','현상 완료 · 붉은 숫자 14'][state.stage];
  const run=id=>{if(!state.act(id))quest.puzzleMessage='잘못된 화학 처리로 인화지가 타버렸다.';if(state.solved)quest.submit(['wash','red','develop','fix']);};
  for(const [id,label]of[['wash','필름 세척'],['red','붉은 안전등 확인'],['develop','현상액 침지'],['fix','정착액 투입']]){const b=button(label,()=>run(id));b.dataset.chemical=id;b.onpointerup=e=>{if(quest.draggingPaper&&quest.phase==='playing'){quest.draggingPaper=false;e.preventDefault();run(id);quest.render();}};}
  button(state.safe?'일반 전등 켜기':'붉은 안전등 켜기',()=>state.light(!state.safe));if(state.burned)button('약품 다시 채우기',()=>state.refill());
  image.style.touchAction='none';image.onpointerdown=e=>{if(state.burned||state.solved||quest.phase!=='playing')return;quest.draggingPaper=true;image.setPointerCapture(e.pointerId);};image.onpointerup=e=>{if(!quest.draggingPaper)return;quest.draggingPaper=false;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-chemical]');if(target&&quest.phase==='playing'){run(target.dataset.chemical);quest.render();}};image.onpointercancel=()=>quest.draggingPaper=false;
 }
 if(quest.puzzleMessage){feedback.textContent+=' '+quest.puzzleMessage;quest.puzzleMessage='';}
}
return{EditingPuzzle,DevelopingPuzzle,render};
});
