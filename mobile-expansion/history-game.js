/* Shared historical clues: all answers can be inferred inside the game. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GyeongHistoryGame=api;})(typeof window==='object'?window:globalThis,function(){
'use strict';
const QUESTIONS=[
 {id:'calendar',room:'main',place:'달력',level:'하',title:'뒤섞인 연도',clue:'『운수 좋은 날』은 1924년 작품이고, 손기정 일장기 말소사건은 1936년이다. 이 방은 서로 다른 시대의 기록을 보관한다.',question:'두 기록을 올바르게 설명한 문장은?',choices:['소설은 사건보다 먼저 나왔다.','소설은 1936년 사건을 보도한 기사다.','두 기록은 같은 해에 만들어졌다.'],answer:0,hints:['달력 옆의 두 연도를 비교하세요.','1924년과 1936년 중 먼저인 것은 무엇인가요?','작품은 사건보다 12년 먼저 나왔습니다.'],explanation:'같은 인물과 연결된 자료라도 작품 발표일과 사건 발생일은 다릅니다.',source:'경성야록 문학관 · 현진건 / 손기정 사건'},
 {id:'drawer',room:'main',place:'24번 서랍',level:'하',title:'서랍 속 세 장의 종이',clue:'한 장은 당시 신문 지면, 한 장은 현대어 요약, 한 장은 편집국이 새로 쓴 재현 대사이다. 재현 대사는 실제 발언으로 확인된 기록이 아니다.',question:'편집국이 새로 만든 대사에 붙일 표시는?',choices:['당시 기자의 실제 발언','창작 재구성','법원에서 확정된 사실'],answer:1,hints:['누가 언제 만든 자료인지 보세요.','새로 만든 문장과 당시 기록은 다릅니다.','실제 발언이 확인되지 않은 새 대사는 창작 재구성입니다.'],explanation:'원문·요약·창작을 구분해야 합니다. 당시 신문도 오류와 편향을 검토해야 합니다.',source:'경성야록 자료 유형 안내'},
 {id:'proof',room:'main',place:'테이블의 교정지',level:'중',title:'먹칠된 이름',clue:'현진건은 『운수 좋은 날』을 쓴 소설가이며 손기정 일장기 말소사건 당시 동아일보 사회부장이었다. 기사별 집필자는 서명이나 별도 자료로 확인한다.',question:'이 자료로 확인할 수 있는 현진건의 역할은?',choices:['사진 수정 화가만을 맡았다.','백백교의 교주였다.','소설가이자 신문사 사회부장이었다.'],answer:2,hints:['교정지의 작품명과 직책을 읽으세요.','글을 쓰는 역할과 신문사 직책을 함께 고르세요.','소설가 + 사회부장입니다.'],explanation:'작가와 기자의 활동은 연결될 수 있지만 특정 기사의 작성자까지 자동으로 증명하지는 않습니다.',source:'경성야록 인물면 · 현진건'},
 {id:'poster',room:'main',place:'벽의 포스터',level:'중',title:'빛나는 박람회의 그림자',clue:'1929년 조선박람회는 총독부가 통치 성과를 홍보한 행사였다. 화려한 광고와 함께 경복궁의 변화·관람 동원 자료를 비교해야 한다.',question:'포스터와 다른 기록을 함께 읽는 이유는?',choices:['홍보가 강조한 것과 생략한 맥락을 비교하려고','그림은 언제나 거짓이므로','모든 기록이 같은 목적을 가졌으므로'],answer:0,hints:['포스터를 만든 주체와 목적에 주목하세요.','홍보 자료에 모든 사정이 담길까요?','강조점과 생략된 맥락을 비교합니다.'],explanation:'자료의 제작 목적을 확인하고 다른 자료와 대조하면 선전의 성격을 읽을 수 있습니다.',source:'경성야록 부록 · 1929 조선박람회'},
 {id:'cabinet',room:'main',place:'뒤의 캐비닛',level:'중',title:'지워진 역할표',clue:'손기정 일장기 말소사건에서 이길용은 기자, 이상범은 사진 수정에 관여한 화가로 소개된다.',question:'인물의 역할을 올바르게 연결한 것은?',choices:['이길용—화가 / 이상범—선수','이길용—기자 / 이상범—화가','두 사람 모두 마라톤 선수'],answer:1,hints:['캐비닛의 역할표에서 직업을 확인하세요.','기사와 사진은 서로 다른 사람이 담당할 수 있습니다.','이길용은 기자, 이상범은 화가입니다.'],explanation:'사건에 관여한 사람의 역할을 구분해야 보도 과정을 이해할 수 있습니다.',source:'경성야록 문화면 · 손기정 사건'},
 {id:'book',room:'main',place:'복도에 떨어진 책',level:'상',title:'기사와 소설 사이',clue:'박태원의 『우맹』은 백백교 사건을 소재로 한 소설이다. 소설의 대사와 장면을 모두 실제 발언·사건으로 확인할 수는 없다.',question:'이 자료만으로 판단할 수 있는 내용은?',choices:['소설의 모든 대사가 실제 발언이다.','박태원이 최초 사건 기사를 썼다.','실제 사건이 문학의 소재가 되었다.'],answer:2,hints:['소재가 되었다는 말의 범위를 생각하세요.','소설 집필과 최초 뉴스 보도는 다른 일입니다.','확인되는 것은 사건과 작품의 소재 관계입니다.'],explanation:'문학적 재구성과 뉴스 보도는 구분합니다. 최초 보도 기자는 별도 원문 확인이 필요합니다.',source:'경성야록 문학관 · 박태원 『우맹』'},
 {id:'archive-source',room:'archive',place:'자료실 중앙 책상',level:'상',title:'서로 다른 숫자',clue:'백백교 사건의 피해자 수는 자료마다 다르다. 경성야록은 당시 동아일보 보도 기준임을 밝히며 수치를 제시한다.',question:'숫자가 다른 자료를 다룰 때 적절한 방법은?',choices:['출처·날짜·조사 범위를 함께 확인한다.','모든 숫자를 더한다.','가장 큰 숫자를 무조건 정답으로 쓴다.'],answer:0,hints:['숫자 옆의 출처 표시를 확인하세요.','조사 시기와 범위가 다를 수 있습니다.','출처·날짜·범위를 함께 확인해야 합니다.'],explanation:'수치만 외우지 말고 무엇을 언제 집계한 자료인지 확인합니다.',source:'경성야록 사회면 · 백백교 사건'},
 {id:'archive-language',room:'archive',place:'자료실 선반의 책',level:'중',title:'사라지지 않는 글자',clue:'조선어학회는 1933년 한글 맞춤법 통일안을 마련하고 사전 편찬을 추진했다. 1942년 조선어학회 사건으로 활동가들이 탄압받았다.',question:'이 활동의 역사적 의미는?',choices:['올림픽 경기 기록만 정리했다.','우리말과 민족 문화를 지키려 했다.','1933년에 이미 광복을 이루었다.'],answer:1,hints:['책 표지의 우리말·맞춤법·사전이라는 말을 보세요.','언어를 정리하고 기록하는 활동입니다.','우리말과 민족 문화 수호에 연결됩니다.'],explanation:'언어 연구·사전 편찬은 민족 문화 수호와 연결됩니다. 탄압 이후의 노력도 지워 설명하지 않습니다.',source:'교과 연계 설명 · 조선어학회와 문화 수호'},
 {id:'darkroom',room:'darkroom',place:'암실 인화 작업대',level:'중',title:'지워진 가슴',clue:'1936년 베를린 올림픽에서 우승한 손기정은 식민지 현실 속에서 일본 국적으로 출전했다. 일장기를 지운 사진의 보도는 민족의식과 언론 탄압의 문제로 이어졌다.',question:'일장기 말소사건을 이해하는 핵심 맥락은?',choices:['광복 후 독립 국가로 출전했다.','종이가 우연히 찢어졌을 뿐이다.','식민지 현실·민족의식·언론 탄압이다.'],answer:2,hints:['사진이 만들어진 1936년의 조선 상황을 보세요.','우승의 기쁨과 식민지 현실이 함께 있었습니다.','민족의식과 언론 탄압을 함께 읽습니다.'],explanation:'사진의 변화는 단순한 인쇄 오류가 아니라 당시 식민지 현실과 연결됩니다.',source:'경성야록 문화면 · 손기정 일장기 말소사건'},
 {id:'photo-0',room:'photos',place:'초록 집게 사진 ①',level:'하',title:'신문과 시',clue:'심훈의 「오오, 조선의 남아여!」는 손기정 우승에 대한 문학적 반응으로 경성야록에 소개된다. 경기 기록표와 시는 자료의 성격이 다르다.',question:'이 시에서 주로 읽을 수 있는 것은?',choices:['민족적 감정과 문학적 표현','법원 판결문','초 단위 경기 기록의 공식 수정'],answer:0,hints:['시와 경기 기록표의 목적을 비교하세요.','문학은 감정과 생각을 표현합니다.','민족적 감정과 문학적 표현입니다.'],explanation:'문학적 반응과 경기 결과 보도는 같은 자료가 아닙니다.',source:'경성야록 문학관 · 심훈'},
 {id:'photo-1',room:'photos',place:'초록 집게 사진 ②',level:'중',title:'범인이라고 쓰기 전에',clue:'죽첨정 사건 보도에는 무고한 가족을 유력 용의자로 지목한 일이 있었다. 조사 중인 용의자와 유죄가 확인된 범인은 구분해야 한다.',question:'조사 중인 사람을 부르는 적절한 표현은?',choices:['이미 확정된 범인','용의자','반드시 유죄인 사람'],answer:1,hints:['조사 중이라는 조건을 읽으세요.','혐의와 유죄 확정은 다릅니다.','아직 조사 중인 사람은 용의자입니다.'],explanation:'수사 발표를 그대로 유죄 확정처럼 보도하지 않아야 합니다.',source:'경성야록 사회면 · 죽첨정 사건의 오보'},
 {id:'photo-2',room:'photos',place:'초록 집게 사진 ③',level:'상',title:'마지막 지면의 판단',clue:'마리아 사건은 무죄 판결과 미제의 문제를 다룬다. 무죄 판결만으로 다른 범인의 신원이나 사건 자체의 부재를 증명할 수는 없다.',question:'무죄 판결 자료로 말할 수 있는 것은?',choices:['다른 범인의 신원이 확정되었다.','피해 사건이 없었다.','법원은 유죄를 인정하지 않았다.'],answer:2,hints:['판결 자료가 실제로 판단한 범위를 보세요.','알 수 없는 사실을 새로 덧붙이면 안 됩니다.','확인되는 것은 유죄를 인정하지 않았다는 판단입니다.'],explanation:'자료로 확인된 사실과 현재 판단할 수 없는 내용을 구분해야 합니다.',source:'경성야록 사회면 · 마리아 사건'}
];
const ROOMS={main:'1층 식자실',archive:'지하 자료실',darkroom:'암실',photos:'사진 건조방'};
class Progress{
 constructor(){this.solved=new Set();this.attempts=new Map();}
 answer(id,index){const q=QUESTIONS.find(q=>q.id===id);if(!q||!Number.isInteger(index)||index<0||index>=q.choices.length)return false;this.attempts.set(id,(this.attempts.get(id)||0)+1);if(index!==q.answer)return false;this.solved.add(id);return true;}
 remaining(room){return QUESTIONS.filter(q=>q.room===room&&!this.solved.has(q.id));}
 complete(room){return Boolean(ROOMS[room])&&this.remaining(room).length===0;}
}
function install(game){
 const state=new Progress(),archive=game.mobileArchive,dark=game.mobileDarkroom;game.historyGame={state,questions:QUESTIONS};
 const view=game.inspectViewRenderer.viewContainer,bar=game.inspectViewRenderer.actionBar;
 function node(tag,text,parent){const e=document.createElement(tag);e.textContent=text;if(parent)parent.appendChild(e);return e;}
 function shell(title){view.replaceChildren();bar.replaceChildren();const host=node('section','',view);host.className='gm-expansion history-puzzle';node('h2',title,host);return host;}
 function goal(){const room=game.camera.position.x>=35?'photos':game.camera.position.x>=28?'darkroom':game.camera.position.x>=14?'archive':'main';const remaining=state.remaining(room);const text=remaining.length?`${ROOMS[room]} · 남은 ${remaining.length}개 · 다음: ${remaining[0].place} [${remaining[0].level}]`:room==='main'?'1층 완료 · 오른쪽 지하 자료실 문 →':room==='archive'?'자료실 완료 · 끝의 검은 커튼 →':room==='darkroom'?'암실 완료 · 뒤쪽 검은 커튼 →':'모든 기록을 복원했습니다.';const objective=document.getElementById('exploration-objective');if(objective) {if(objective.textContent!==text)objective.textContent=text;objective.hidden=false;}if(archive.notice.textContent!==text)archive.notice.textContent=text;archive.notice.hidden=room==='main';return text;}
 function finishRoom(room){
  if(!state.complete(room))return;
  if(room==='main'){archive.unlocked=true;game.soundManager.playPuzzleSuccess();}
  if(room==='archive'){archive.solved=true;game.sharedInventory.addItem({id:'darkroom_iron_key',name:'암실 철문 열쇠',desc:'자료실의 출처·언어 기록을 복원해 얻은 열쇠.'});archive.playPuzzleEffect('editing');}
  if(room==='darkroom'){dark.developed=true;game.sharedInventory.addItem({id:'developed_press_photo',name:'복원된 손기정 보도사진',desc:'식민지 현실과 언론 탄압의 맥락을 확인한 기록.'});archive.playPuzzleEffect('develop');}
  goal();
 }
 function quiz(id){
  const q=QUESTIONS.find(q=>q.id===id);if(!q)return;
  game.interactionManager.inspectTagEl.textContent=ROOMS[q.room]+' · 난이도 '+q.level;
  const host=shell(`${q.title} · 난이도 ${q.level}`);host.dataset.historyQuestion=id;
  node('p','다른 기사를 읽지 않아도 아래 단서와 힌트로 풀 수 있습니다. 오답은 진행을 잃지 않고 다시 선택할 수 있습니다.',host);
  const clue=node('aside','',host);clue.className='gp-hints';node('strong','발견한 기록 · 게임 안 단서',clue);node('p',q.clue,clue);node('small','자료: '+q.source,clue);
  node('h3',q.question,host);const feedback=node('p','',host);feedback.setAttribute('role','status');
  if(state.solved.has(id)){feedback.textContent='✓ 기록 복원 완료 · '+q.explanation;}
  else{
   const actions=node('div','',host);actions.className='history-answers';
   q.choices.forEach((choice,index)=>{const b=node('button',choice,actions);b.type='button';b.onclick=()=>{
    if(state.solved.has(id)||game.gameEnded)return;
    if(!state.answer(id,index)){feedback.textContent='먹칠된 기록이 맞지 않습니다. 진행은 유지됩니다. 단서나 힌트를 확인하고 다시 선택하세요.';return;}
    finishRoom(q.room);
    if(q.room==='photos'){dark.missingPerson.choose(Number(id.slice(-1)),'record');if(state.complete('photos')){window.GyeongMissingPerson.render(dark,Number(id.slice(-1)));return;}}
    quiz(id);
   };});
  }
  let level=0;const hintText=node('p','',host);hintText.className='gp-hints';hintText.hidden=true;const hint=node('button','힌트 1 보기',host);hint.type='button';hint.onclick=()=>{hintText.hidden=false;hintText.textContent=q.hints[Math.min(level,2)];level=Math.min(level+1,3);hint.textContent=level<3?`힌트 ${level+1} 보기`:'마지막 힌트 다시 보기';};
  node('p',goal(),host);
 }
 function list(room,title){const host=shell(title);node('p','이 방의 필수 퍼즐을 모두 해결하면 다음 방으로 가는 문이 열립니다. 주변 물건을 조사하거나 아래 기록을 선택하세요.',host);for(const q of QUESTIONS.filter(q=>q.room===room)){const b=node('button',`${state.solved.has(q.id)?'✓ ':''}${q.place} · 난이도 ${q.level}`,host);b.type='button';b.onclick=()=>quiz(q.id);}node('p',goal(),host);}
 function route(){
  const host=shell('1층 출구 · 지하실로 이어지는 길');
  node('p','출구라고 쓰인 방은 바깥으로 나가는 문이 아닙니다. 오래된 안내문은 오른쪽 벽의 지하 자료실 문과 내려가는 계단을 가리킵니다.',host);
  node('p',state.complete('main')?'1층 기록을 모두 복원했습니다. 오른쪽 벽 지하 자료실 문을 열고 계단을 내려가세요.':'1층 퍼즐을 모두 풀어야 지하실 문이 열립니다. 아래에서 남은 기록과 힌트를 확인하세요.',host);
  const b=node('button','1층 퍼즐·힌트 확인',host);b.onclick=()=>list('main','1층 식자실 · 남은 기록');
  if(state.complete('main')){const corridor=node('button','1층 출구 안내실 문 열기',host);corridor.onclick=()=>{game.room.openDoor();game.soundManager.playMetalDoorOpen();game.interactionManager.closeInspect();};const open=node('button','지하실로 통하는 문 열기',host);open.onclick=()=>{archive.open=true;game.soundManager.playMetalDoorOpen();game.interactionManager.closeInspect();};}
 }
 // Capture before legacy inspection listeners so old puzzles cannot replace the new tasks.
 const nativeRender=game.inspectViewRenderer.render.bind(game.inspectViewRenderer);
 const mapped={calendar:'calendar',clock:'calendar',mirror_plate:'calendar',drawer_24:'drawer',drawer_locked:'drawer',proof:'proof',newspaper:'proof',desk:'proof',galley_slot:'proof',print_roller:'proof',cursed_cube:'cabinet',glasses:'cabinet',apron:'cabinet',rack:'book',type_rack_label:'book',censor_poster:'poster',radio:'book',history_poster:'poster',history_cabinet:'cabinet',history_book:'book',history_archive_hint:'archive-language',mobile_archive_hint:'archive-language'};
 function handled(data){return Boolean(mapped[data.type]||['mobile_archive_records','mobile_darkroom_station','drying_missing_photo','drying_missing_note','mobile_archive_door','mobile_darkroom_curtain'].includes(data.type)||data.clueId==='clue_exit_door');}
 game.inspectViewRenderer.render=data=>{if(!handled(data)){nativeRender(data);game.interactionManager.inspectTagEl.textContent+=' · 선택 장치 · 난이도 중';}};
 window.addEventListener('space-inspect',event=>{const data=event.detail;if(!handled(data))return;event.stopImmediatePropagation();
  if(mapped[data.type])quiz(mapped[data.type]);
  else if(data.clueId==='clue_exit_door'||data.type==='mobile_archive_door')route();
  else if(data.type==='mobile_archive_records')list('archive','資料室 · 봉인된 기록');
  else if(data.type==='mobile_darkroom_station')quiz('darkroom');
  else if(data.type==='drying_missing_photo')quiz('photo-'+data.photoIndex);
  else if(data.type==='drying_missing_note')list('photos','寫眞乾燥室 · 마지막 세 기록');
  else if(data.type==='mobile_darkroom_curtain'){
   const room=data.curtainIndex===0?'archive':'darkroom',curtain=dark.curtains[data.curtainIndex];
   const host=shell('검은 커튼 · 다음 방의 봉인');
   node('p',state.complete(room)?'기록이 복원되어 봉인이 풀렸습니다.':'이 방의 기록을 모두 복원해야 커튼 너머로 갈 수 있습니다.',host);
   const check=node('button','이 방의 퍼즐·힌트 확인',host);check.onclick=()=>list(room,ROOMS[room]+' · 남은 기록');
   const b=node('button','검은 커튼 젖히기',host);b.disabled=!state.complete(room);b.onclick=()=>{curtain.opened=true;game.soundManager.playFloorboardCreak();game.interactionManager.closeInspect();};
  }
 },{capture:true});
 game.beginScreamingRoomEnding=()=>game.interactionManager.triggerInspect({type:'history_exit',clueId:'clue_exit_door',name:'1층 출구 · 지하실 안내',description:'바깥이 아니라 지하로 이어지는 기록이다.'});
 let exitRoomGuideShown=false;
 const update=game.playerControls.update.bind(game.playerControls);game.playerControls.update=delta=>{update(delta);if(!game.gameEnded){archive.unlocked=state.complete('main');goal();if(game.camera.position.z<-16&&state.complete('main')&&!exitRoomGuideShown&&game.playerControls.controls.isLocked){exitRoomGuideShown=true;game.beginScreamingRoomEnding();}}};
 // The corridor marked exit opens into an in-world direction sign, never the ending.
 const openDoor=game.room.openDoor.bind(game.room);game.room.openDoor=()=>state.complete('main')&&openDoor();
 game.room.updateExitSign=function(){if(this.historyExitDrawn)return;this.historyExitDrawn=true;const c=this.signCanvas.getContext('2d');c.fillStyle='#211910';c.fillRect(0,0,768,256);c.fillStyle='#d6c59e';c.textAlign='center';c.font='bold 82px serif';c.fillText('1층 출구',384,115);c.font='36px serif';c.fillText('지하실 안내 · 오른쪽 자료실 문 →',384,205);this.signTexture.needsUpdate=true;};
 game.room.updateExitSign();
 function prop(id,text,x,y,z,w=.9,h=.3){const mesh=archive.sign(text,w,h,true);mesh.position.set(x,y,z);if(id==='cabinet')mesh.rotation.y=Math.PI;mesh.userData={isInteractable:true,clueId:'history_'+id,type:'history_'+id,name:text,description:'어둠 속에 남은 기록. 조사하면 단서·퀴즈·힌트를 확인할 수 있다.'};game.scene.add(mesh);game.furniture.interactables.push(mesh);}
 prop('poster','박람회의 그림자 · 중',-1.3,2.1,-3.86,1.1,.42);
 prop('cabinet','캐비닛 역할표 · 중',-3.6,1.45,4.62,1.1,.35);
 prop('book','복도의 책 · 상',1.2,.22,-6.2,.7,.25);
 prop('archive_hint','우리말 기록 · 중',18.7,-1.8,-5.95,1.1,.35);
 game.scene.traverse(object=>{const data=object.userData,q=QUESTIONS.find(q=>q.id===mapped[data.type]);if(q){data.name=q.place+' · 난이도 '+q.level;data.description='남겨진 기록을 조사하면 역사 단서와 재시도 가능한 퀴즈를 확인할 수 있다.';}});
 // A readable clue in the actual exit room points back to the existing stairs.
 const exitHint=archive.sign('지하실은 오른쪽 자료실 문 · 1층 기록부터',1.7,.4,true);exitHint.position.set(0,1.7,-17);exitHint.userData={isInteractable:true,clueId:'clue_exit_door',type:'history_exit',name:'1층 출구 안내문',description:'출구의 기록은 지하실로 이어진다.'};game.scene.add(exitHint);game.furniture.interactables.push(exitHint);
 const nativeUpdateTarget=game.explorationHUD.updateTarget.bind(game.explorationHUD);game.explorationHUD.updateTarget=()=>{game.explorationHUD.targetId=null;nativeUpdateTarget();};
 const notebookRender=game.notebookUI.render.bind(game.notebookUI);game.notebookUI.render=()=>{notebookRender();const right=document.querySelector('.notebook-page.right-page');if(!right)return;right.querySelectorAll('.puzzle-track-card,.notebook-status-summary,#notebook-puzzles-empty').forEach(e=>e.hidden=true);right.querySelector('.page-title').textContent='복원 기록 (HISTORY)';const clues=document.getElementById('notebook-clues-list');clues.replaceChildren();for(const q of QUESTIONS.filter(q=>state.attempts.has(q.id))){node('h4',q.place,clues);node('p',q.clue,clues);}if(!state.attempts.size)node('p','물건을 조사하면 단서가 문제 안에 나타납니다. 한 번 시도한 기록은 여기에 모입니다.',clues);let records=document.getElementById('history-notebook');if(!records){records=node('section','',right);records.id='history-notebook';}records.replaceChildren();for(const room of Object.keys(ROOMS)){node('h4',ROOMS[room],records);for(const q of QUESTIONS.filter(q=>q.room===room))node('p',`${state.solved.has(q.id)?'✓':'未'} ${q.place} · 난이도 ${q.level}`,records);}};
 game.notebookUI.render();
 const guide=node('button','진행 안내');guide.type='button';guide.id='history-progress-button';document.body.appendChild(guide);guide.onclick=()=>{if(game.gameEnded||!game.playerControls.controls.isLocked)return;game.interactionManager.triggerInspect({type:'history_progress',name:'방별 기록과 힌트',description:'다음 방의 봉인을 풀기 위한 안내'});list(game.camera.position.x>=35?'photos':game.camera.position.x>=28?'darkroom':game.camera.position.x>=14?'archive':'main','방별 기록 · 진행 안내');};
 game.playerControls.controls.addEventListener('lock',()=>{guide.hidden=game.gameEnded;});game.playerControls.controls.addEventListener('unlock',()=>{guide.hidden=true;});guide.hidden=true;
 const mobileGuide=document.getElementById('mobile-play-guide');if(mobileGuide){const tasks=node('button','방별 퍼즐·힌트 보기',mobileGuide);tasks.type='button';tasks.onclick=()=>{mobileGuide.addEventListener('close',()=>guide.click(),{once:true});mobileGuide.close();};}
 const start=document.querySelector('.intro-desc');if(start)start.appendChild(node('span',' 방마다 필수 기록을 복원해야 다음 문이 열립니다. 난이도는 상·중·하입니다. 모든 퀴즈는 게임 안 단서와 힌트로 풀 수 있고, 오답은 다시 시도할 수 있습니다. 공포 연출과 10분 제한은 유지됩니다.'));
 goal();
}
if(typeof window==='object')window.addEventListener('sikjasil-ready',event=>install(event.detail));
return{QUESTIONS,ROOMS,Progress,install};
});
