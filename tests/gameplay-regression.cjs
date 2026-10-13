/* Real scene raycasts and touch UI: no inventory, puzzle or timer overrides. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, acceptDownloads: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => window.addEventListener('sikjasil-ready', e => window.testGame = e.detail));
    await page.goto((process.env.GAME_TEST_URL || 'http://127.0.0.1:8000') + '/sikjasil/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.testGame);
    // Lower graphics resolution for the software renderer; game rules remain unchanged.
    await page.evaluate(() => testGame.renderer.setPixelRatio(.5));
    async function touch(type, points) {
      await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map(p => ({ ...p, id: 1, radiusX: 4, radiusY: 4, force: 1 })) });
    }
    async function aim(point) {
      for (let i = 0; i < 8; i++) {
        const delta = await page.evaluate(p => {
          const c = testGame.camera, dx = p[0] - c.position.x, dy = p[1] - c.position.y, dz = p[2] - c.position.z;
          const yaw = Math.atan2(-dx, -dz);
          return { yaw: Math.atan2(Math.sin(yaw - c.rotation.y), Math.cos(yaw - c.rotation.y)), pitch: Math.atan2(dy, Math.hypot(dx, dz)) - c.rotation.x };
        }, point);
        if (Math.abs(delta.yaw) < .012 && Math.abs(delta.pitch) < .012) break;
        const dx = Math.max(-270, Math.min(270, -delta.yaw / .0035));
        const dy = Math.max(-130, Math.min(130, -delta.pitch / .0035));
        await touch('touchStart', [{ x: 420, y: 185 }]);
        await touch('touchMove', [{ x: 420 + dx, y: 185 + dy }]);
        await touch('touchEnd', []);
      }
    }
    async function inspect(point, id) {
      await aim(point);
      await page.waitForFunction(id => testGame.interactionManager.currentInteractable?.clueId === id, id);
      await page.locator('.mobile-pickup').tap();
      await page.locator('#inspect-modal').waitFor({ state: 'visible' });
    }
    async function closeInspect() {
      await page.locator('#inspect-close').tap();
      await page.locator('#inspect-modal').waitFor({ state: 'hidden' });
    }
    await page.locator('#start-screen').tap({ position: { x: 30, y: 30 } });
    await inspect([-.35, 1.044, 1.25], 'clue_galley_slot');
    assert.ok((await page.locator('#inspect-interactive-view').innerText()).includes('큐브 활자 결합 홈'));
    await closeInspect();
    console.log('galley decorative surfaces allow real scene pickup PASS');
    await inspect([.9167, .15, 1.82], 'clue_drawer');
    for (const [col, digit] of [2, 3, 5, 8].entries()) {
      const dir = digit > 5 ? 'down' : 'up';
      for (let n = 0; n < (digit > 5 ? 10 - digit : digit); n++) await page.locator(`.dial-btn[data-col="${col}"][data-dir="${dir}"]`).tap();
    }
    await page.waitForFunction(() => document.querySelector('#inventory-items').innerText.includes('전원 퓨즈'));
    await closeInspect();
    await inspect([-.35, 1.044, 1.25], 'clue_galley_slot');
    await page.getByRole('button', { name: '인쇄기 가동 · 호외 출력', exact: true }).tap();
    await page.locator('#card-display').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => testGame.rewardCardRenderer.currentCardType.type), 'TYPE_B');
    assert.equal(await page.evaluate(() => testGame.rewardCardRenderer.jumpscareTriggered), false);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#download-card-btn').tap();
    const download = await downloadPromise;
    assert.equal(await download.failure(), null);
    assert.ok(download.suggestedFilename().endsWith('type_b.png'));
    await page.locator('#close-card-btn').tap();
    await page.locator('#reward-card-modal').waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => testGame.interactionManager.isInspecting), false);
    assert.equal(await page.locator('#inspect-modal').isVisible(), false);
    assert.equal(await page.locator('#mobile-controls').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log('drawer unlock / card / no extra print scare / PNG download / unobstructed return PASS');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
