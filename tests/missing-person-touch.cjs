const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const root=path.resolve(__dirname,'..');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
for(const viewport of [{width:390,height:844},{width:360,height:640},{width:844,height:390},{width:667,height:375}]){
const context=await browser.newContext({viewport,isMobile:true,hasTouch:true}),page=await context.newPage();
await page.setContent('<base href="http://127.0.0.1:8010/sikjasil/"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0}</style><div id="inspect-modal" class="active"><div class="inspect-card"><div class="inspect-header">사진 조사</div><div id="inspect-interactive-view"></div><div class="inspect-footer"><button id="inspect-close">닫기</button></div></div></div>');
await page.addStyleTag({content:fs.readFileSync(path.join(root,'sikjasil/assets/index-BnN-PICE.css'),'utf8').replace(/@import[^;]+;/g,'')});await page.addStyleTag({path:path.join(root,'mobile-expansion/room-puzzles.css')});await page.addScriptTag({path:path.join(root,'mobile-expansion/missing-person.js')});
await page.evaluate(()=>{window.space={missingPerson:new GyeongMissingPerson.Puzzle(),refreshNotice(){},removeMissingPerson(){},game:{sharedInventory:{addItem(){window.rewardCount=(window.rewardCount||0)+1}},soundManager:{playFloorboardCreak(){}},inspectViewRenderer:{viewContainer:document.querySelector('#inspect-interactive-view'),actionBar:document.createElement('div')},interactionManager:{inspectTagEl:document.createElement('span'),closeInspect(){window.puzzleClosed=true}}}};GyeongMissingPerson.render(space,0)});
assert.match(await page.locator('.mp-touch-guide').innerText(),/모바일/);
for(let index=0;index<3;index++){
await page.evaluate(i=>GyeongMissingPerson.render(space,i),index);
for(const button of await page.locator('.mp-person').all()){const box=await button.boundingBox();assert.ok(box.width>=48&&box.height>=48);}
await page.locator('.mp-real-photo img').evaluate(image=>image.decode());if(process.env.PHOTO_SCREENSHOT&&index===0&&viewport.width===390)await page.screenshot({path:process.env.PHOTO_SCREENSHOT});assert.match(await page.locator('.mp-photo-credit').innerText(),/이 사진은 ai생성 이미지 입니다/);
await page.getByRole('button',{name:'납작 모자 인물 선택',exact:true}).tap();assert.match(await page.locator('[role=status]').innerText(),/괜찮아요/);
await page.getByRole('button',{name:'초록 힌트 보기',exact:true}).tap();assert.equal(await page.locator('.mp-answer').count(),1);
await page.getByRole('button',{name:'검은 모자 인물 선택',exact:true}).tap();
const bounds=await page.locator('#inspect-close').boundingBox();assert.ok(bounds.y>=0&&bounds.y+bounds.height<=viewport.height);
assert.equal(await page.evaluate(()=>{const e=document.querySelector('#inspect-interactive-view');return e.scrollWidth<=e.clientWidth}),true);
}
await page.getByRole('button',{name:'예고를 읽었습니다 · 창 닫고 계속 탐색',exact:true}).tap();assert.equal(await page.evaluate(()=>puzzleClosed&&space.missingPerson.teaserSeen&&rewardCount===1),true);console.log(`touch selection / hints / teaser / scrolling PASS ${viewport.width}x${viewport.height}`);await context.close();
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
