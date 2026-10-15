const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Puzzle}=require('../mobile-expansion/missing-person');
test('wrong selections leave progress intact and each photograph counts only once',()=>{
 const p=new Puzzle();assert.equal(p.choose(0,'scarf'),false);assert.equal(p.choose(0,'record'),true);
 assert.equal(p.choose(0,'record'),true);assert.equal(p.found.size,1);assert.equal(p.choose(1,'glasses'),false);assert.equal(p.found.size,1);
 assert.equal(p.choose(-1,'record'),false);assert.equal(p.choose(3,'record'),false);assert.equal(p.choose(.5,'record'),false);
 assert.equal(p.solved,false);p.choose(2,'record');assert.equal(p.solved,false);p.choose(1,'record');assert.equal(p.solved,true);assert.equal(p.teaserSeen,false);
});

test('ending uses the last newly solved photo, including out-of-order play',()=>{const p=new Puzzle();p.choose(2,'record');p.choose(0,'record');p.choose(2,'record');assert.equal(p.lastPhoto,0);p.choose(1,'record');assert.equal(p.solved,true);assert.equal(p.lastPhoto,1);});

test('ending requires first-floor, archive, darkroom and all three photos',()=>{const {canEnd}=require('../mobile-expansion/missing-person');const s={archive:{unlocked:false,solved:false},developed:false,missingPerson:new Puzzle()};for(let i=0;i<3;i++)s.missingPerson.choose(i,'record');assert.equal(canEnd(s),false);s.archive.unlocked=true;assert.equal(canEnd(s),false);s.archive.solved=true;assert.equal(canEnd(s),false);s.developed=true;assert.equal(canEnd(s),true);});
