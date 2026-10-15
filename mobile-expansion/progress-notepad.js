/* Persistent, read-only paper checklist; it never captures exploration input. */
(function(){'use strict';window.addEventListener('sikjasil-ready',event=>{
 const game=event.detail,{state,questions}=game.historyGame;
 const names={main:'1층 식자실',archive:'지하 자료실',darkroom:'암실',photos:'사진 건조방'};
 const labels={calendar:'달력',clock:'괘종시계',drawer:'24번 서랍',proof:'교정지',typesetting:'활자판',poster:'박람회 포스터',cabinet:'캐비닛 역할표',book:'복도의 책','archive-source':'책상 기록','archive-language':'선반 서류',darkroom:'인화 작업대','photo-0':'사진 ①','photo-1':'사진 ②','photo-2':'사진 ③'};
 function node(tag,text,parent){const e=document.createElement(tag);e.textContent=text;parent.appendChild(e);return e;}
 const paper=document.createElement('aside');paper.id='history-notepad';paper.hidden=true;paper.setAttribute('aria-label','게임 완료 체크 수첩');document.body.appendChild(paper);document.documentElement.classList.add('history-notepad-ready');
 node('h2','식자공의 수첩',paper);const summary=node('p','',paper);summary.className='notepad-total';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');
 const roomLabel=node('p','',paper);roomLabel.className='notepad-room';const list=node('ul','',paper);list.className='notepad-checks';
 const key=node('p','',paper);key.className='notepad-key';node('small','상세 기록: 수첩 [Tab / 수첩 버튼]',paper);
 let snapshot='';
 function update(){paper.hidden=game.gameEnded||!game.startScreen.classList.contains('hidden');if(paper.hidden)return;
  const x=game.camera.position.x,room=x>=35?'photos':x>=28?'darkroom':x>=14?'archive':'main',tasks=questions.filter(q=>q.room===room),done=questions.filter(q=>state.solved.has(q.id)).length;
  const placed=game.historyGame.exitRoom.keyPlaced,hasKey=game.sharedInventory.hasItem('rusty_key')||placed,next=room+'|'+[...state.solved].join(',')+'|'+hasKey+'|'+placed;
  if(snapshot===next)return;snapshot=next;summary.textContent=`완료 ${done}/${questions.length} · 남은 ${questions.length-done}개`;roomLabel.textContent=`${names[room]} · ${tasks.filter(q=>state.solved.has(q.id)).length}/${tasks.length}`;
  list.replaceChildren();for(const q of tasks){const solved=state.solved.has(q.id),item=node('li','',list);item.dataset.question=q.id;item.dataset.complete=String(solved);node('span',solved?'☑':'☐',item).className='notepad-box';node('span',labels[q.id]||q.place,item).className='notepad-name';node('span',q.level,item).className='notepad-level';}
  key.textContent=placed?'☑ 열쇠 배치 · 지하실 개방':hasKey?'☑ 머리카락 엉킨 열쇠 획득':'☐ 머리카락 엉킨 열쇠';
 }
 const original=game.playerControls.update.bind(game.playerControls);game.playerControls.update=delta=>{original(delta);update();};game.playerControls.controls.addEventListener('lock',update);
 if(game.playTimer){const onEnd=game.playTimer.onEnd;game.playTimer.onEnd=function(...args){paper.hidden=true;return onEnd?.apply(this,args);};}
 game.historyGame.notepad={element:paper,update};
});})();
