const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GAME_TEST_URL||'http://127.0.0.1:18941';
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile,isMobile:mobile}),page=await context.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))missing.push(r.url());});
  await page.goto(base+'/radio-device/',{waitUntil:'load'});await page.locator('#radioBtn')[mobile?'tap':'click']();await page.waitForFunction(()=>document.body.dataset.screen==='tune');
  // Pointer/touch drag must turn the dial, then keyboard tuning must reach the actual receiving state.
  await page.locator('#dial').click({trial:true});const before=await page.locator('#dial').getAttribute('aria-valuenow'),box=await page.locator('.dial-wrap').boundingBox();
  if(mobile){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+10,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width-10,y:box.y+box.height/2,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else{await page.mouse.move(box.x+box.width/2,box.y+10);await page.mouse.down();await page.mouse.move(box.x+box.width-10,box.y+box.height/2,{steps:8});await page.mouse.up();}
  assert.notEqual(await page.locator('#dial').getAttribute('aria-valuenow'),before);
  // A stopped drag leaves no inertia; tune through the user-facing keyboard controls.
  await page.evaluate(()=>{state.velocity=0;});await page.locator('#dial').focus();for(let i=0;i<180&&await page.evaluate(()=>!state.locked);i++)await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.body.dataset.screen==='air');assert.equal(await page.locator('#airFreq').innerText(),'1123');assert.equal(await page.locator('#fileNote').isVisible(),true);await page.locator('#playBtn')[mobile?'tap':'click']();
  await page.locator('#retune')[mobile?'tap':'click']();await page.waitForFunction(()=>document.body.dataset.screen==='tune');await page.locator('#toRoom')[mobile?'tap':'click']();await page.waitForFunction(()=>document.body.dataset.screen==='room');
  await page.screenshot({path:`/tmp/radio-restored-${mobile?'mobile':'desktop'}.png`});assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log((mobile?'mobile':'desktop')+' radio load / drag / tune / retry / room return PASS');await context.close();
 }
 const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['jukcheomjeong','maria','sonkijeong','baekbaekgyo']){
  await page.goto(base+'/case/index.html#/case/'+id);await page.waitForURL('**/case-'+id+'/index.html');
  await page.locator('.rx-radio').waitFor({state:'attached'});assert.equal(await page.locator('.rx-radio img').getAttribute('src'),'../assets/radio/radio.png');
  assert.equal(await page.locator('.rx-dial img').getAttribute('src'),'../assets/radio/dial.png');
  for(const url of await page.locator('img[src]').evaluateAll(els=>els.map(e=>e.src))){const response=await page.request.get(url);assert.equal(response.status(),200,url);}
  const favicon=await page.locator('link[rel=icon]').getAttribute('href');assert.equal((await page.request.get(new URL(favicon,page.url()).href)).status(),200);
  console.log(id+' legacy redirect / static article images / shared radio artwork / favicon PASS');
 }
 assert.deepEqual(errors,[]);await context.close();
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
