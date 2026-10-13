const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Puzzle}=require('../mobile-expansion/missing-person');
test('wrong selections leave progress intact and each photograph counts only once',()=>{
 const p=new Puzzle();assert.equal(p.choose(0,'scarf'),false);assert.equal(p.choose(0,'difference'),true);
 assert.equal(p.choose(0,'difference'),true);assert.equal(p.found.size,1);assert.equal(p.choose(1,'glasses'),false);assert.equal(p.found.size,1);
 assert.equal(p.choose(-1,'difference'),false);assert.equal(p.choose(3,'difference'),false);assert.equal(p.choose(.5,'difference'),false);
 assert.equal(p.solved,false);p.choose(2,'difference');assert.equal(p.solved,false);p.choose(1,'difference');assert.equal(p.solved,true);assert.equal(p.teaserSeen,false);
});

test('ending uses the last newly solved photo, including out-of-order play',()=>{const p=new Puzzle();p.choose(2,'difference');p.choose(0,'difference');p.choose(2,'difference');assert.equal(p.lastPhoto,0);p.choose(1,'difference');assert.equal(p.solved,true);assert.equal(p.lastPhoto,1);});
