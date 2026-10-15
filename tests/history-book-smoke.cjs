const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:1280,height:720},hasTouch:mobile,isMobile:mobile}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.addEventListener('sikjasil-ready',e=>window.game=e.detail));await page.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8000')+'/sikjasil/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.game?.historyGame.bookCoverReady);await page.evaluate(()=>game.renderer.setPixelRatio(.6));await page.locator('#start-screen').click({position:{x:30,y:30}});
 await page.evaluate(()=>{game.camera.position.set(.65,1.6,-4.9);game.camera.lookAt(1,.11,-6.2);});await page.waitForFunction(()=>game.interactionManager.currentInteractable?.clueId==='history_book');await page.locator('#history-clue-label').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>game.historyGame.book.children.filter(o=>o.isMesh&&!o.userData.isPuzzleMarker).length),5);
 await page.screenshot({path:mobile?'/tmp/book-hover-mobile.png':'/tmp/book-hover-desktop.png'});
 await page.evaluate(()=>game.camera.lookAt(-1,1.6,-4.9));await page.locator('#history-clue-label').waitFor({state:'hidden'});
 await page.evaluate(()=>game.camera.lookAt(1,.11,-6.2));await page.waitForFunction(()=>game.interactionManager.currentInteractable?.clueId==='history_book');
 if(mobile){await page.locator('.mobile-pickup').tap();if(await page.locator('#mobile-nearby-clues').isVisible())await page.locator('[data-clue-id="history_book"]').tap();}else await page.keyboard.press('e');
 await page.locator('[data-history-question="book"]').waitFor();assert.equal(await page.locator('.history-puzzle h2').count(),0);assert.equal(await page.locator('.history-puzzle small').count(),0);assert.equal(await page.locator('.history-brief').count(),1);
 await page.getByRole('button',{name:'힌트 1 보기',exact:true}).click();await page.getByRole('button',{name:'실제 사건이 문학의 소재가 되었다.',exact:true}).click();assert.match(await page.locator('.history-next-step').innerText(),/다음 단계:.*달력/);assert.equal(await page.locator('.history-answers').count(),0);assert.equal(await page.locator('.history-brief').count(),0);
 await page.screenshot({path:mobile?'/tmp/book-quiz-mobile.png':'/tmp/book-quiz-desktop.png'});await page.locator('#inspect-close').click();
 await page.evaluate(()=>{game.camera.position.set(-3.6,1.6,3.4);game.camera.lookAt(-3.6,1.2,4.66);});await page.waitForFunction(()=>game.interactionManager.currentInteractable?.clueId==='history_cabinet_drawer_2');
 if(mobile){await page.locator('.mobile-pickup').tap();if(await page.locator('#mobile-nearby-clues').isVisible())await page.locator('[data-clue-id="history_cabinet_drawer_2"]').tap();}else await page.keyboard.press('e');
 await page.waitForFunction(()=>game.historyGame.cabinet.discovered);assert.equal(await page.locator('#inspect-modal').isVisible(),false);assert.ok(await page.evaluate(()=>game.historyGame.cabinet.drawers[2].group.position.z<-.45));assert.equal(await page.evaluate(()=>game.historyGame.cabinet.note.visible),true);
 await page.screenshot({path:mobile?'/tmp/cabinet-open-mobile.png':'/tmp/cabinet-open-desktop.png'});
 await page.evaluate(()=>{game.camera.position.set(-3.6,1.6,4.08);game.camera.lookAt(-3.6,1.085,4.42);});await page.waitForFunction(()=>game.interactionManager.currentInteractable?.clueId==='history_cabinet');
 if(mobile){await page.locator('.mobile-pickup').tap();if(await page.locator('#mobile-nearby-clues').isVisible())await page.locator('[data-clue-id="history_cabinet"]').tap();}else await page.keyboard.press('e');await page.locator('[data-history-question="cabinet"]').waitFor();assert.match(await page.locator('.history-brief').innerText(),/이길용.*이상범/);
 assert.deepEqual(errors,[]);console.log((mobile?'mobile':'desktop')+' hardcover / hover / concise quiz / next step / real drawer animation / role-card discovery PASS');await context.close();
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
