const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium', args:['--no-sandbox']});
 try {
  for (const viewport of [{width:1280,height:720},{width:953,height:600},{width:844,height:390},{width:390,height:844}]) {
   const page = await browser.newPage({viewport});
   await page.setContent('<style>html,body{margin:0;height:100%;overflow:hidden}*{box-sizing:border-box}</style><div id="inspect-modal" class="active"><div class="inspect-card"><div class="inspect-header">자료실 조사</div><p id="inspect-desc">설명</p><div id="inspect-interactive-view"></div><div class="inspect-footer"><button id="inspect-close">닫기</button></div></div></div>');
   await page.addStyleTag({content:fs.readFileSync(path.join(root,'sikjasil/assets/index-BnN-PICE.css'),'utf8').replace(/@import[^;]+;/g,'')});
   await page.addStyleTag({path:path.join(root,'mobile-expansion/room-puzzles.css')});
   await page.addScriptTag({path:path.join(root,'mobile-expansion/room-puzzles.js')});
   await page.addScriptTag({path:path.join(root,'mobile-expansion/mobile-expansion.js')});
   await page.evaluate(()=>{window.quest=new GyeongMobileExpansion.Expansion({getRemainingSeconds:()=>600});quest.start(document.querySelector('#inspect-interactive-view'));});
   for (const selector of ['.inspect-header','#inspect-close']) {
    const box=await page.locator(selector).boundingBox();assert.ok(box.y>=0 && box.y+box.height<=viewport.height,`${selector} fits ${JSON.stringify(viewport)}`);
   }
   await page.getByRole('button',{name:'① 서랍 틈의 천공 먹지 얻기',exact:true}).click();
   assert.equal(await page.getByRole('button',{name:'먹지 90도 회전',exact:true}).count(),0);
   await page.getByRole('button',{name:'② 먹지 한 번에 맞추기',exact:true}).click();
   await page.getByLabel('날짜 스탬프 네 자리').fill('0000');
   await page.getByRole('button',{name:'④ 서류함 봉인에 스탬프 찍기',exact:true}).click();
   assert.match(await page.locator('[data-feedback]').innerText(),/1124.*다시/);
   assert.equal(await page.evaluate(()=>quest.puzzleStates.archive.revealed),true);
   await page.getByRole('button',{name:'단서 날짜 1124 넣기',exact:true}).click();
   assert.equal(await page.getByLabel('날짜 스탬프 네 자리').inputValue(),'1124');
   await page.getByRole('button',{name:'④ 서류함 봉인에 스탬프 찍기',exact:true}).click();
   assert.match(await page.locator('[data-feedback]').innerText(),/자료실 완료.*검은 커튼.*인화 작업대/);
   assert.equal(await page.evaluate(()=>quest.solved.has('archive')),true);
   await page.getByRole('button',{name:'다음 방의 문 열기',exact:true}).click();
   assert.equal(await page.evaluate(()=>quest.room.id),'darkroom');
   assert.equal(await page.evaluate(()=>document.querySelector('#inspect-interactive-view').scrollWidth<=document.querySelector('#inspect-interactive-view').clientWidth),true);
   console.log(`archive help / retry / completion / scroll layout PASS ${viewport.width}x${viewport.height}`);
   await page.evaluate(()=>quest.destroy());await page.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
