const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
for(const mobile of [false,true]){const context=await browser.newContext({viewport:{width:844,height:390},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.addEventListener('sikjasil-ready',e=>window.game=e.detail));await page.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8000')+'/sikjasil/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.game?.ghostEncounters.ready);await page.evaluate(()=>game.renderer.setPixelRatio(.2));
await page.locator('#start-screen').click({position:{x:30,y:30}});await page.evaluate(()=>game.ghostEncounters.popupSound.prepare());assert.equal(await page.evaluate(()=>game.ghostEncounters.popupSound.buffers.length),3);assert.equal(await page.evaluate(()=>game.ghostEncounters.popupSound.active),null);
// Known random values exercise each real uploaded asset; playback uses the actual AudioContext.
for(let i=0;i<3;i++){
 const result=await page.evaluate(async i=>{const d=game.ghostEncounters,a=d.popupSound;a.random=()=>i/3+.01;const e={...d.plan[i],seen:false};const shown=d.trigger(e,performance.now()),v=a.active;const probe=game.soundManager.ctx.createAnalyser();v.gain.connect(probe);probe.fftSize=2048;window.audioProbe=probe;return{shown,file:v.file,peak:v.peak,span:v.endsAt-v.startedAt,visual:!!d.active};},i);
 assert.equal(result.shown,true);assert.equal(result.visual,true);assert.ok(result.peak<=.18);assert.ok(result.span<=2.400001);assert.ok(result.file.includes('creature_0'+(i+1)));
 await page.waitForTimeout(350);
 assert.ok(await page.evaluate(()=>{const a=new Float32Array(audioProbe.fftSize);audioProbe.getFloatTimeDomainData(a);return a.some(v=>Math.abs(v)>.00001);}),'uploaded sound generates an audio signal');
 if(i===0){await page.waitForFunction(()=>!game.ghostEncounters.active);await page.waitForFunction(()=>!game.ghostEncounters.popupSound.active);}
 else if(i===1){await page.evaluate(()=>game.ghostEncounters.hide());await page.waitForFunction(()=>!game.ghostEncounters.popupSound.active);}
 else{await page.evaluate(()=>game.soundManager.toggleMute());await page.waitForFunction(()=>!game.ghostEncounters.popupSound.active);assert.equal(await page.evaluate(()=>game.soundManager.masterGain.gain.value),0);await page.evaluate(()=>{game.ghostEncounters.hide();game.soundManager.toggleMute();});}
 await page.evaluate(()=>audioProbe.disconnect());
}
await page.evaluate(()=>{game.soundManager.toggleMute();game.ghostEncounters.trigger({...game.ghostEncounters.plan[4],seen:false},performance.now());});assert.equal(await page.evaluate(()=>game.ghostEncounters.popupSound.active),null);await page.evaluate(()=>game.ghostEncounters.stop());assert.deepEqual(errors,[]);console.log((mobile?'mobile':'desktop')+' three uploaded sounds / quiet gain / visual duration / early hide / mute / stop PASS');await context.close();
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
