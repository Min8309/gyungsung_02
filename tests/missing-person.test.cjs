const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Puzzle}=require('../mobile-expansion/missing-person');
test('wrong selections leave progress intact and each photograph counts only once',()=>{
 const p=new Puzzle();assert.equal(p.choose(0,'scarf'),false);assert.equal(p.choose(0,'hat'),true);
 assert.equal(p.choose(0,'hat'),true);assert.equal(p.found.size,1);assert.equal(p.choose(1,'glasses'),false);assert.equal(p.found.size,1);
 assert.equal(p.choose(-1,'hat'),false);assert.equal(p.choose(3,'hat'),false);assert.equal(p.choose(.5,'hat'),false);
 assert.equal(p.solved,false);p.choose(2,'hat');assert.equal(p.solved,false);p.choose(1,'hat');assert.equal(p.solved,true);assert.equal(p.teaserSeen,false);
});
