const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {QUESTIONS}=require('../mobile-expansion/history-game.js');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:{width:844,height:390},isMobile:mobile,hasTouch:mobile});const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.addEventListener('sikjasil-ready',e=>window.game=e.detail));
  await page.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8004')+'/sikjasil/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.game?.historyGame?.audio);await page.evaluate(()=>game.renderer.setPixelRatio(.2));await page.locator('#start-screen').click({position:{x:30,y:30}});
  await page.evaluate(()=>game.historyGame.audio.prepare());assert.equal(await page.evaluate(()=>Object.keys(game.historyGame.audio.buffers).length),2);
  const click=loc=>loc[mobile?'tap':'click']();
  async function inspect(data){await page.evaluate(data=>game.interactionManager.triggerInspect(data),data);await page.locator('#inspect-modal').waitFor({state:'visible'});}
  const q=QUESTIONS[0];await inspect({type:'calendar',name:'달력'});await click(page.getByRole('button',{name:q.choices[1],exact:true}));assert.equal(await page.evaluate(()=>game.historyGame.audio.active),null);
  await click(page.getByRole('button',{name:q.choices[q.answer],exact:true}));await page.waitForFunction(()=>game.historyGame.audio.active?.name==='correct');
  await page.evaluate(()=>{const a=game.historyGame.audio;window.firstVoice=a.active;window.probe=game.soundManager.ctx.createAnalyser();probe.fftSize=2048;a.active.gain.connect(probe);});
  await page.waitForFunction(()=>{const samples=new Float32Array(probe.fftSize);probe.getFloatTimeDomainData(samples);return samples.some(v=>Math.abs(v)>.00001);});
  await click(page.locator('#inspect-close'));await inspect({type:'calendar',name:'달력'});assert.equal(await page.evaluate(()=>game.historyGame.audio.active===firstVoice),true);await click(page.locator('#inspect-close'));
  // Audio-focused test: pre-complete earlier rooms, then answer all three photos through the real UI.
  await page.evaluate(()=>{for(const q of game.historyGame.questions.filter(q=>q.room!=='photos'))game.historyGame.state.solved.add(q.id);game.mobileArchive.unlocked=true;game.mobileArchive.solved=true;game.mobileDarkroom.developed=true;game.historyGame.exitRoom.found=true;game.historyGame.exitRoom.keyPlaced=true;});
  for(let n=0;n<3;n++){const photo=QUESTIONS.find(q=>q.id==='photo-'+n);await inspect({type:'drying_missing_photo',photoIndex:n,name:'사진'});await click(page.getByRole('button',{name:photo.choices[photo.answer],exact:true}));if(n<2){await page.waitForFunction(()=>game.historyGame.audio.active?.name==='correct');await click(page.locator('#inspect-close'));}}
  await page.locator('.mp-final-photo.mp-flipped').waitFor();await page.waitForFunction(()=>game.historyGame.audio.active?.name==='ending');assert.equal(await page.evaluate(()=>game.gameEnded),true);
  const result=await page.evaluate(()=>{const a=game.historyGame.audio;window.endingVoice=a.active;return{delay:a.active.startedAt-game.soundManager.ctx.currentTime,duration:a.buffers.ending.duration};});assert.ok(result.delay<=.61);assert.ok(result.duration>20);
  await page.waitForFunction(()=>game.soundManager.ctx.currentTime>endingVoice.startedAt+.1);assert.equal(await page.evaluate(()=>game.historyGame.audio.active===endingVoice),true);
  await page.evaluate(()=>game.soundManager.toggleMute());await page.waitForFunction(()=>game.soundManager.masterGain.gain.value===0);assert.equal(await page.evaluate(()=>game.historyGame.audio.play('correct')),false);
  assert.deepEqual(errors,[]);console.log((mobile?'mobile':'desktop')+' correct audio / wrong-answer silence / no replay / third-photo ending / mute PASS');await context.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
