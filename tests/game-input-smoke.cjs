const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
 try {
 for (const mobile of [true,false]) {
  const context = await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1280,height:720},hasTouch:mobile,isMobile:mobile});
  const page = await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>window.addEventListener('sikjasil-ready',e=>window.testGame=e.detail));
  await page.goto((process.env.GAME_TEST_URL || 'http://127.0.0.1:8000') + '/sikjasil/', {waitUntil:'domcontentloaded'}); await page.waitForFunction(()=>window.testGame);
  await page.locator('#start-screen').click({position:{x:30,y:30}});
  await page.waitForFunction(()=>window.testGame.playerControls.controls.isLocked);
  if(mobile) {
   await page.locator('[data-key="Tab"]').tap(); await page.waitForFunction(()=>window.testGame.notebookUI.isOpen);
   assert.equal(await page.locator('#mobile-controls').isVisible(),false);
   await page.locator('#notebook-close-btn').tap(); await page.waitForFunction(()=>window.testGame.playerControls.controls.isLocked);
   await page.locator('#notebook-modal').waitFor({state:'hidden'});
   const before=await page.evaluate(()=>testGame.camera.position.z);
   const pad=await page.locator('#mobile-pad').boundingBox();
   await page.mouse.move(pad.x+pad.width/2,pad.y+20);await page.mouse.down();
   await page.waitForFunction(z=>testGame.camera.position.z < z, before);
   await page.mouse.up();
   assert.ok(await page.evaluate(z=>testGame.camera.position.z<z,before),'movement advances camera');
   assert.equal(await page.evaluate(()=>testGame.playerControls.moveForward),false);
   const rotation=await page.evaluate(()=>testGame.camera.rotation.y);
   await page.mouse.move(420,180);await page.mouse.down();await page.mouse.move(480,180,{steps:5});await page.mouse.up();
   assert.notEqual(await page.evaluate(()=>testGame.camera.rotation.y),rotation);
   const flashlight=await page.evaluate(()=>testGame.lighting.flashlightOn);await page.locator('[data-key="KeyF"]').tap();
   assert.notEqual(await page.evaluate(()=>testGame.lighting.flashlightOn),flashlight);
   assert.equal(await page.locator('.mobile-pickup').isDisabled(), true);
   await page.evaluate(()=>{
    const manager=testGame.interactionManager;
    window.restoreInteractionUpdate=manager.update; manager.update=()=>{};
    manager.currentInteractable={type:'calendar',clueId:'clue_calendar',name:'달력',description:'단서'};
    manager.setPrompt(manager.currentInteractable);
   });
   assert.equal(await page.locator('.mobile-pickup').isEnabled(), true);
   await page.locator('.mobile-pickup').tap();
   await page.locator('#inspect-modal').waitFor({state:'visible'});assert.equal(await page.locator('#mobile-controls').isVisible(),false);
   await page.locator('#inspect-close').tap();await page.waitForFunction(()=>testGame.playerControls.controls.isLocked);
   await page.evaluate(()=>testGame.interactionManager.update=window.restoreInteractionUpdate);
   for(const viewport of [{width:390,height:844},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    const left=await page.locator('#mobile-pad').boundingBox();
    const right=await page.locator('.mobile-actions').boundingBox();
    assert.ok(left.x+left.width < right.x, 'joystick and actions do not overlap');
    assert.ok(right.x+right.width <= viewport.width && right.y+right.height <= viewport.height, 'actions fit viewport: '+JSON.stringify({viewport,left,right}));
   }
  } else {
   assert.equal(await page.locator('#mobile-controls').count(),0);
   await page.keyboard.press('Tab');await page.waitForFunction(()=>testGame.notebookUI.isOpen);
   await page.locator('#notebook-close-btn').click();await page.waitForFunction(()=>testGame.playerControls.controls.isLocked);
  }
  assert.deepEqual(errors,[]);console.log(mobile?'mobile movement/look/notebook/flashlight/inspection PASS':'desktop pointer lock/notebook PASS');
  if(mobile){
   await page.goto((process.env.GAME_TEST_URL || 'http://127.0.0.1:8000') + '/', {waitUntil:'domcontentloaded'});
   await page.locator('.ykg-skip').tap();await page.locator('.ykg-veil').waitFor({state:'detached'});
   await page.locator('.ykq-type').tap();
   for (let i=0;i<4;i++) {
    await page.locator('.ykq-relic').first().tap();
    await page.locator('.ykq-rv').tap();
    await page.locator('.ykq-rv').waitFor({state:'detached'});
   }
   await page.locator('.ykq-go').tap();
   const frame=page.frameLocator('.ykq-room iframe');
   await frame.locator('#start-screen').tap({position:{x:30,y:30}});
   await frame.locator('#mobile-controls').waitFor({state:'visible'});
   await page.locator('.ykq-up').tap();await page.locator('.ykq-room').waitFor({state:'detached'});
   console.log('mobile main-page entry/iframe/return PASS');
  }
  await context.close();
 }
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
