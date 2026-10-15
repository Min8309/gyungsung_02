const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>window.addEventListener('sikjasil-ready',e=>window.game=e.detail));await page.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8000')+'/sikjasil/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.game?.mobileArchive);await page.evaluate(()=>game.renderer.setPixelRatio(.35));await page.locator('#start-screen').tap({position:{x:30,y:30}});
for(const viewport of [{width:390,height:844},{width:360,height:640},{width:844,height:390},{width:667,height:375}]){
await page.setViewportSize(viewport);
for(const selector of ['.hud-top','.hud-bottom','#exploration-objective','#clue-direction','#inventory-bar','#archive-route-notice'])assert.equal(await page.locator(selector).isVisible(),false,selector);
const timer=await page.locator('#play-timer').boundingBox();assert.ok(timer.y>=0&&timer.y<30&&timer.x+timer.width<=viewport.width);
const guide=await page.locator('#mobile-guide-button').boundingBox(),pad=await page.locator('#mobile-pad').boundingBox();assert.ok(guide.x>=0&&guide.y>=0&&guide.y+guide.height<=pad.y);
const start=await page.evaluate(()=>game.playTimer.startedAt);await page.locator('#mobile-guide-button').tap();await page.locator('#mobile-play-guide').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>game.playerControls.controls.isLocked),false);assert.equal(await page.locator('#mobile-controls').isVisible(),false);
assert.match(await page.locator('#mobile-play-guide').innerText(),/現在目標|현재 목표/);const box=await page.locator('#mobile-play-guide').boundingBox();assert.ok(box.y>=0&&box.y+box.height<=viewport.height);
await page.getByRole('button',{name:'닫고 계속 플레이',exact:true}).tap();await page.waitForFunction(()=>game.playerControls.controls.isLocked);assert.equal(await page.evaluate(()=>game.playTimer.startedAt),start);assert.equal(await page.locator('#mobile-controls').isVisible(),true);
console.log(`clear HUD / timer only / guide tap / exploration return PASS ${viewport.width}x${viewport.height}`);
}
await page.evaluate(()=>game.camera.position.set(36,-2,-2.7));await page.waitForTimeout(300);assert.equal(await page.locator('#inspect-modal').isVisible(),false);await page.locator('#mobile-guide-button').tap();assert.match(await page.locator('[data-mobile-goal]').innerText(),/사진 건조방/);await page.getByRole('button',{name:'닫고 계속 플레이'}).tap();assert.deepEqual(errors,[]);if(process.env.HUD_SCREENSHOT){await page.setViewportSize({width:390,height:844});await page.screenshot({path:process.env.HUD_SCREENSHOT});}
await context.close();}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
