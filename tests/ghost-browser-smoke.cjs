const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  try {
    let sharedAssets;
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 844, height: 390 } : { width: 1280, height: 720 }, hasTouch: mobile, isMobile: mobile });
      const page = await context.newPage();
      const errors = [], failures = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400 && r.url().includes('/assets/ghosts/')) failures.push(r.url()); });
      await page.addInitScript(() => window.addEventListener('sikjasil-ready', e => { window.testGame = e.detail; window.ghostEvents = []; window.addEventListener('ghost-encounter', e => window.ghostEvents.push(e.detail)); }));
      await page.goto((process.env.GAME_TEST_URL || 'http://127.0.0.1:8000') + '/sikjasil/', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.testGame && testGame.ghostEncounters.ready);
      await page.evaluate(() => testGame.renderer.setPixelRatio(.35));
      const assets = await page.evaluate(() => SikjasilGhosts.GHOSTS.map(g => g.file));
      if (sharedAssets) assert.deepEqual(assets, sharedAssets); else sharedAssets = assets;
      await page.clock.install();
      await page.locator('#start-screen').click({ position: { x: 30, y: 30 } });
      const start = await page.evaluate(() => testGame.playTimer.startedAt);
      assert.notEqual(start, null);
      const plan = await page.evaluate(() => testGame.ghostEncounters.plan.map(e => e.at));
      for (let i = 0; i < plan.length; i++) {
        const elapsed = await page.evaluate(() => (performance.now() - testGame.playTimer.startedAt) / 1000);
        await page.clock.fastForward(Math.max(1, Math.ceil((plan[i] - elapsed) * 1000) + 150));
        await page.clock.runFor(100);
        assert.equal(await page.evaluate(() => testGame.ghostEncounters.history.length), i + 1);
        assert.equal(await page.locator('#ghost-apparition-overlay').evaluate(e => e.classList.contains('active')), true);
        assert.equal(await page.locator('.ghost-figure').evaluate(e => e.complete && e.naturalWidth > 0), true);
        assert.equal(await page.locator('#ghost-apparition-overlay').evaluate(e => getComputedStyle(e).pointerEvents), 'none');
        // The scare is visual: real UI behind it still accepts input.
        if (i === 0) {
          if (mobile) await page.locator('[data-key="Tab"]').tap(); else await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(() => testGame.notebookUI.isOpen), true);
          await page.locator('#notebook-close-btn').click();
        }
        if (process.env.GHOST_SCREENSHOTS) {
          fs.mkdirSync(process.env.GHOST_SCREENSHOTS, { recursive: true });
          await page.clock.runFor(600);
          await page.screenshot({ path: `${process.env.GHOST_SCREENSHOTS}/${mobile ? 'mobile' : 'web'}-${i + 1}.png` });
        }
        await page.clock.fastForward(3000);
        await page.clock.runFor(50);
        assert.equal(await page.locator('#ghost-apparition-overlay').evaluate(e => e.classList.contains('active')), false);
      }
      const history = await page.evaluate(() => testGame.ghostEncounters.history);
      assert.equal(new Set(history.map(e => e.ghost)).size, 6);
      assert.equal(new Set(history.map(e => e.location)).size, 6);
      const elapsed = await page.evaluate(() => performance.now() - testGame.playTimer.startedAt);
      await page.clock.fastForward(Math.max(1, 600200 - elapsed));
      await page.clock.runFor(100);
      assert.equal(await page.evaluate(() => testGame.ghostEncounters.history.length), 6);
      assert.equal(await page.evaluate(() => testGame.playTimer.ended), true);
      assert.equal(await page.evaluate(() => testGame.ghostEncounters.stopped), true);
      assert.deepEqual(errors, []); assert.deepEqual(failures, []);
      console.log(JSON.stringify({ platform: mobile ? 'mobile' : 'web', passed: true, count: history.length, history }));
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
