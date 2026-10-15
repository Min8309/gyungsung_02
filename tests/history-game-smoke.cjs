const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {QUESTIONS}=require('../mobile-expansion/history-game.js');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 for(const mobile of process.env.HISTORY_MOBILE_ONLY==='1'?[true]:[false,true]){
  const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1280,height:720},isMobile:mobile,hasTouch:mobile});const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.addEventListener('sikjasil-ready',e=>window.game=e.detail));
  await page.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8000')+'/sikjasil/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.game?.historyGame&&window.game?.hintFocus);await page.evaluate(()=>game.renderer.setPixelRatio(.25));
  await page.locator('#start-screen').click({position:{x:30,y:30}});
  const click=locator=>locator[mobile?'tap':'click']();
  const cdp=mobile?await context.newCDPSession(page):null;
  async function walk(x,z){if(!mobile)return;await page.evaluate(({x,z})=>game.camera.lookAt(x,game.camera.position.y,z),{x,z});const pad=await page.locator('#mobile-pad').boundingBox(),cx=pad.x+pad.width/2,cy=pad.y+pad.height/2;
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx,y:cy-pad.height*.38,id:1}]});
   try{await page.waitForFunction(({x,z})=>Math.hypot(game.camera.position.x-x,game.camera.position.z-z)<.3,{x,z},{timeout:45000});}finally{await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  }
  async function inspect(data){await page.evaluate(data=>game.interactionManager.triggerInspect(data),data);await page.locator('#inspect-modal').waitFor({state:'visible'});}
  async function close(){await click(page.locator('#inspect-close'));await page.locator('#inspect-modal').waitFor({state:'hidden'});}
  async function solve(q,data){if(q.id==='cabinet'){await page.evaluate(()=>game.interactionManager.triggerInspect({type:'history_cabinet_drawer',drawerIndex:2,name:'서랍'}));await page.waitForFunction(()=>game.historyGame.cabinet.discovered);}await inspect(data);await page.locator(`[data-history-question="${q.id}"]`).waitFor();
   if(q.kind==='typesetting'){for(const letter of ['탄','자','가','일'])await click(page.getByRole('button',{name:letter+' 활자',exact:true}));await click(page.getByRole('button',{name:'지면 조판 확인',exact:true}));assert.match(await page.locator('.history-puzzle [role=status]').innerText(),/다시 조판/);await click(page.getByRole('button',{name:'모든 활자 되돌리기',exact:true}));for(const letter of q.solution)await click(page.getByRole('button',{name:letter+' 활자',exact:true}));await click(page.getByRole('button',{name:'지면 조판 확인',exact:true}));await page.locator('.history-next-step').waitFor();await close();return;}
   if(q.kind==='clock'){await click(page.getByRole('button',{name:'시계의 봉인 확인',exact:true}));assert.match(await page.locator('.history-puzzle [role=status]').innerText(),/다시 시도/);for(let n=0;n<16;n++)await click(page.getByRole('button',{name:'일 분 뒤로',exact:true}));await click(page.getByRole('button',{name:'시계의 봉인 확인',exact:true}));await page.locator('.history-next-step').waitFor();await close();return;}
   assert.match(await page.locator('#inspect-tag').innerText(),new RegExp('난이도 '+q.level));
   const before=await page.evaluate(()=>game.historyGame.state.solved.size);
   await click(page.getByRole('button',{name:q.choices[(q.answer+1)%q.choices.length],exact:true}));assert.match(await page.locator('.history-puzzle [role=status]').innerText(),/다시 선택/);assert.equal(await page.evaluate(()=>game.historyGame.state.solved.size),before);
   for(let n=1;n<=3;n++)await click(page.getByRole('button',{name:`힌트 ${n} 보기`,exact:true}));assert.ok((await page.locator('.gp-hints').last().innerText()).length>5);
   for(const size of mobile?[{width:390,height:844},{width:844,height:390}]:[{width:1280,height:720}]){await page.setViewportSize(size);const card=await page.locator('.inspect-card').boundingBox();assert.ok(card.y>=0&&card.y+card.height<=size.height+1,JSON.stringify({mobile,id:q.id,size,card}));assert.ok(await page.evaluate(()=>{const e=document.querySelector('#inspect-interactive-view');return e.scrollWidth<=e.clientWidth+1;}));}
   await click(page.getByRole('button',{name:q.choices[q.answer],exact:true}));
   if(q.id!=='photo-2'){await page.waitForFunction(id=>game.historyGame.state.solved.has(id),q.id);assert.match(await page.locator('.history-next-step').innerText(),/다음 단계:/);assert.equal(await page.getByRole('button',{name:'힌트 1 보기',exact:true}).count(),0);await close();}
  }
  await page.evaluate(()=>{game.camera.position.set(-2.1,1.6,3.8);game.camera.lookAt(-2.1,1.95,5.965);});await page.waitForFunction(()=>game.interactionManager.currentInteractable?.clueId==='history_poster');
  await page.waitForFunction(()=>game.hintFocus.targets.find(t=>t.object.userData.clueId==='history_poster').materials[0].opacity>.7);
  if(mobile){await page.locator('.mobile-pickup').tap();if(await page.locator('#mobile-nearby-clues').isVisible())await page.locator('[data-clue-id="history_poster"]').tap();}else await page.keyboard.press('e');await page.locator('[data-history-question="poster"]').waitFor();await close();
  await page.evaluate(()=>game.camera.lookAt(5,1.6,0));await page.waitForFunction(()=>game.hintFocus.targets.find(t=>t.object.userData.clueId==='history_poster').materials[0].opacity<.3);
  assert.equal(await page.locator('#inspect-modal').isVisible(),false);
  if(!mobile){const box=await page.locator('#exploration-objective').boundingBox();assert.ok(box.width*box.height<1280*720*.08);}
  await page.screenshot({path:mobile?'/tmp/history-mobile-exploration.png':'/tmp/history-desktop-exploration.png'});
  await inspect({type:'mobile_archive_door',name:'지하 문'});assert.equal(await page.evaluate(()=>game.mobileArchive.open),false);assert.equal(await page.getByRole('button',{name:'지하실로 통하는 문 열기',exact:true}).count(),0);await close();
  await inspect({type:'history_exit',clueId:'clue_exit_door',name:'1층 출구'});
  assert.equal(await page.locator('.history-exit-checklist li').count(),9);
  assert.equal(await page.locator('.history-puzzle details,.history-puzzle button,[data-history-question]').count(),0);
  assert.equal(await page.evaluate(()=>game.historyGame.state.solved.size),0);await close();
 await require('./key-cache-helper.cjs')(page,mobile);
  for(const type of ['radio','glasses']){await inspect({type,name:'주변 물건'});assert.equal(await page.locator('[data-history-question],.history-answers').count(),0);await close();}
  assert.equal(await page.evaluate(()=>game.historyGame.cabinet.drawers[2].opened),false);
  const types={typesetting:'galley_slot',clock:'clock',calendar:'calendar',drawer:'drawer_24',proof:'proof',poster:'history_poster',cabinet:'history_cabinet',book:'history_book'};
  for(const q of QUESTIONS.filter(q=>q.room==='main')){await solve(q,{type:types[q.id],name:q.place});if(q.id!=='book')assert.equal(await page.evaluate(()=>game.mobileArchive.unlocked),false);}
  assert.equal(await page.evaluate(()=>game.mobileArchive.unlocked),false);
  await page.waitForFunction(()=>game.room.doorOpenProgress>=1);
  if(mobile){for(const [x,z]of [[0,-3],[0,-15.2],[0,-19]])await walk(x,z);}else await page.evaluate(()=>game.camera.position.set(0,1.6,-19));
  assert.equal(await page.locator('#inspect-modal').isVisible(),false);await page.evaluate(()=>game.camera.lookAt(0,.925,-20.1));await page.waitForFunction(()=>game.interactionManager.currentInteractable?.clueId==='history_exit_note');await page.screenshot({path:mobile?'/tmp/exit-table-mobile.png':'/tmp/exit-table-desktop.png'});
  if(mobile){await page.locator('.mobile-pickup').tap();if(await page.locator('#mobile-nearby-clues').isVisible())await page.locator('[data-clue-id="history_exit_note"]').tap();}else await page.keyboard.press('e');await page.locator('.history-exit-message').waitFor();assert.match(await page.locator('.history-exit-message').innerText(),/열쇠.*올려놓으시오/);assert.equal(await page.evaluate(()=>game.mobileArchive.unlocked),false);await click(page.getByRole('button',{name:'종이 위에 머리카락 엉킨 열쇠 올려놓기',exact:true}));assert.equal(await page.evaluate(()=>game.sharedInventory.hasItem('rusty_key')),false);assert.equal(await page.evaluate(()=>game.historyGame.exitRoom.keyPlaced),true);await close();assert.equal(await page.evaluate(()=>game.mobileArchive.unlocked),true);
  await page.waitForFunction(()=>game.mobileArchive.progress>=1);assert.equal(await page.evaluate(()=>game.room.colliders.includes(game.mobileArchive.doorCollider)),false);
  if(mobile){for(const [x,z]of [[0,-15.2],[0,-3],[2.6,-2.7],[4,-2.7],[6,-2.7],[14.5,-2.7],[20.3,-2.7],[20.3,-1.4],[21.8,-1.4]])await walk(x,z);}else await page.evaluate(()=>game.camera.position.set(21.8,-2,-1.4));
  await inspect({type:'mobile_darkroom_curtain',curtainIndex:0,name:'자료실 커튼'});assert.equal(await page.getByRole('button',{name:'검은 커튼 젖히기',exact:true}).isDisabled(),true);await close();
  await page.evaluate(()=>{game.camera.position.set(18.25,-1.97,-3.9);game.camera.lookAt(18.25,-2.15,-5.68);});await page.waitForFunction(()=>game.interactionManager.currentInteractable?.type==='history_archive_hint');
  if(mobile){await page.locator('.mobile-pickup').tap();if(await page.locator('#mobile-nearby-clues').isVisible())await page.locator('[data-clue-id="history_archive_papers_0"]').tap();}else await page.keyboard.press('e');await page.locator('[data-history-question="archive-language"]').waitFor();await close();await page.evaluate(()=>game.camera.position.set(21.8,-1.97,-1.4));
  for(const q of QUESTIONS.filter(q=>q.room==='archive'))await solve(q,{type:q.id==='archive-source'?'mobile_archive_records':'history_archive_hint',name:q.place});
  // Each archive task opens only at its own physical record.
  assert.equal(await page.evaluate(()=>game.mobileArchive.solved),true);
  await inspect({type:'mobile_darkroom_curtain',curtainIndex:0,name:'자료실 커튼'});await click(page.getByRole('button',{name:'검은 커튼 젖히기',exact:true}));await page.waitForFunction(()=>game.mobileDarkroom.curtains[0].progress>=1);
  if(mobile){for(const [x,z]of [[24,-1.4],[26.7,-2.7],[29,-2.7],[32.3,-2.7],[32.3,-1.8]])await walk(x,z);}else await page.evaluate(()=>game.camera.position.set(32.3,-2,-1.8));await inspect({type:'mobile_darkroom_curtain',curtainIndex:1,name:'암실 커튼'});assert.equal(await page.getByRole('button',{name:'검은 커튼 젖히기',exact:true}).isDisabled(),true);await close();
  await solve(QUESTIONS.find(q=>q.id==='darkroom'),{type:'mobile_darkroom_station',name:'작업대'});
  await inspect({type:'mobile_darkroom_curtain',curtainIndex:1,name:'암실 커튼'});await click(page.getByRole('button',{name:'검은 커튼 젖히기',exact:true}));await page.waitForFunction(()=>game.mobileDarkroom.curtains[1].progress>=1);
  if(mobile){await walk(33.7,-2.7);await walk(35.4,-2.7);}else{await page.evaluate(()=>game.camera.position.set(35.4,-2,-2.7));await page.locator('.history-puzzle').waitFor();await close();}
  for(let n=0;n<3;n++)await solve(QUESTIONS.find(q=>q.id==='photo-'+n),{type:'drying_missing_photo',photoIndex:n,name:'사진 '+n});
  await page.locator('.mp-final-photo.mp-flipped').waitFor();assert.equal(await page.evaluate(()=>game.gameEnded&&game.mobileDarkroom.missingPerson.solved),true);await click(page.getByRole('button',{name:'예고 확인 · 게임 종료',exact:true}));assert.match(await page.locator('.mp-puzzle').innerText(),/게임이 종료/);assert.deepEqual(errors,[]);
  console.log((mobile?'mobile':'desktop')+' history clues / retry / room gates / exit route / popup layout / ending PASS');await context.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
