const {test}=require('node:test');
const assert=require('node:assert/strict');
const {QUESTIONS,ROOMS,Progress}=require('../mobile-expansion/history-game.js');
test('every historical task has a local clue, three hints and a supported difficulty',()=>{
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
 for(const q of QUESTIONS){assert.ok(ROOMS[q.room]);assert.ok(['상','중','하'].includes(q.level));assert.ok(q.clue&&q.explanation&&q.source);assert.equal(q.hints.length,3);assert.ok(q.answer>=0&&q.answer<q.choices.length);}
});
test('wrong answers allow retry and preserve completed records',()=>{
 const p=new Progress(),first=QUESTIONS[0],next=QUESTIONS[1];
 assert.equal(p.answer(first.id,first.answer),true);
 assert.equal(p.answer(next.id,(next.answer+1)%next.choices.length),false);
 assert.ok(p.solved.has(first.id));assert.ok(!p.solved.has(next.id));assert.equal(p.answer(next.id,next.answer),true);
 assert.equal(p.attempts.get(next.id),2);
});
test('each room unlocks only after all its own required tasks',()=>{
 const p=new Progress();for(const room of Object.keys(ROOMS)){
  assert.equal(p.complete(room),false);const tasks=QUESTIONS.filter(q=>q.room===room);
  for(const q of tasks.slice(0,-1)){p.answer(q.id,q.answer);assert.equal(p.complete(room),false);}
  p.answer(tasks.at(-1).id,tasks.at(-1).answer);assert.equal(p.complete(room),true);
 }
 assert.equal(p.complete('unknown'),false);assert.equal(p.answer('missing',0),false);
});
