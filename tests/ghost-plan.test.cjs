const test = require('node:test');
const assert = require('node:assert/strict');
const { createPlan, GHOSTS, PLACES } = require('../sikjasil/assets/ghost-director.js');
function seeded(seed) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}
test('each new play has six different ghosts and six random places inside ten minutes', () => {
  const places = new Set(), signatures = new Set();
  for (let seed = 1; seed <= 1000; seed++) {
    const plan = createPlan(seeded(seed));
    assert.equal(plan.length, 6);
    assert.equal(new Set(plan.map(e => e.ghost.id)).size, 6);
    assert.equal(new Set(plan.map(e => e.place.id)).size, 6);
    for (let i = 0; i < plan.length; i++) {
      assert.ok(plan[i].at >= 20 && plan[i].at < 540);
      if (i) assert.ok(plan[i].at - plan[i - 1].at >= 20);
      places.add(plan[i].place.id);
    }
    signatures.add(JSON.stringify(plan.map(e => [e.at, e.ghost.id, e.place.id])));
  }
  assert.equal(signatures.size, 1000);
  assert.equal(places.size, 8);
  assert.equal(GHOSTS.length, 6);
  assert.equal(PLACES.length, 8);
});
