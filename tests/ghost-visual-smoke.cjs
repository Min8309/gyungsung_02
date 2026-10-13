/* One live, unaccelerated apparition on each platform, plus file:// asset readiness. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  try {
    await Promise.all([false, true].map(async mobile => {
      const context = await browser.newContext({ viewport: mobile ? { width: 844, height: 390 } : { width: 1280, height: 720 }, hasTouch: mobile, isMobile: mobile });
      const page = await context.newPage(); const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => window.addEventListener('sikjasil-ready', e => window.testGame = e.detail));
      await page.goto((process.env.GAME_TEST_URL || 'http://127.0.0.1:8000') + '/sikjasil/', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.testGame?.ghostEncounters.ready);
      await page.evaluate(() => testGame.renderer.setPixelRatio(.35));
      await page.locator('#start-screen').click({ position: { x: 30, y: 30 } });
      await page.waitForFunction(() => testGame.ghostEncounters.active, null, { timeout: 100000 });
      await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.ghost-figure')).opacity) > .5);
      const visual = await page.locator('.ghost-figure').evaluate(e => ({ opacity: getComputedStyle(e).opacity, image: e.naturalWidth, rect: e.getBoundingClientRect().toJSON(), file: e.src }));
      assert.ok(visual.image > 0);
      if (process.env.GHOST_SCREENSHOTS) {
        fs.mkdirSync(process.env.GHOST_SCREENSHOTS, { recursive: true });
        await page.screenshot({ path: `${process.env.GHOST_SCREENSHOTS}/${mobile ? 'mobile' : 'web'}-live.png` });
      }
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ platform: mobile ? 'mobile' : 'web', livePopup: true, opacity: visual.opacity, imageWidth: visual.image, file: visual.file }));
      await context.close();
    }));
    if (process.env.GHOST_TEST_FILE === '1') {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await page.addInitScript(() => window.addEventListener('sikjasil-ready', e => window.testGame = e.detail));
    await page.goto('file://' + process.cwd() + '/sikjasil/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.testGame?.ghostEncounters.ready, null, { timeout: 60000 });
    assert.equal(await page.evaluate(() => testGame.ghostEncounters.textures.size), 6);
    console.log('file:// six embedded ghost images ready PASS');
    await context.close();
    } else { console.log('file:// runtime check not requested (GHOST_TEST_FILE=1 enables it)'); }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
