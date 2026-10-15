const {test}=require('node:test');
const assert=require('node:assert/strict');
const {QUESTIONS,ROOMS,Progress}=require('../mobile-expansion/history-game.js');
test('every game task has a local clue, three hints and a supported difficulty',()=>{
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
 for(const q of QUESTIONS){assert.ok(ROOMS[q.room]);assert.ok(['상','중','하'].includes(q.level));assert.ok(q.clue&&q.explanation&&q.source);assert.equal(q.hints.length,3);if(q.kind==='typesetting'){assert.equal(q.solution.length,4);assert.equal(new Set(q.letters).size,q.letters.length);assert.ok(q.solution.every(c=>q.letters.includes(c)));}else if(q.kind==='clock')assert.ok(Number.isInteger(q.solution)&&q.solution>=0&&q.solution<1440);else assert.ok(q.answer>=0&&q.answer<q.choices.length);}
});
test('wrong answers allow retry and preserve completed records',()=>{
 const p=new Progress(),first=QUESTIONS.find(q=>q.id==='calendar'),next=QUESTIONS.find(q=>q.id==='drawer');
 assert.equal(p.answer(first.id,first.answer),true);
 assert.equal(p.answer(next.id,(next.answer+1)%next.choices.length),false);
 assert.ok(p.solved.has(first.id));assert.ok(!p.solved.has(next.id));assert.equal(p.answer(next.id,next.answer),true);
 assert.equal(p.attempts.get(next.id),2);
});
test('each room unlocks only after all its own required tasks',()=>{
 const p=new Progress(),solve=q=>q.kind==='typesetting'?p.setTypesetting(q.solution):q.kind==='clock'?p.setClock(Math.floor(q.solution/60),q.solution%60):p.answer(q.id,q.answer);for(const room of Object.keys(ROOMS)){
  assert.equal(p.complete(room),false);const tasks=QUESTIONS.filter(q=>q.room===room);
  for(const q of tasks.slice(0,-1)){solve(q);assert.equal(p.complete(room),false);}
  solve(tasks.at(-1));assert.equal(p.complete(room),true);
 }
 assert.equal(p.complete('unknown'),false);assert.equal(p.answer('missing',0),false);
});

test('clock requires a valid 24-hour time, retries across midnight, and cannot be answered as a quiz',()=>{const p=new Progress();assert.equal(p.answer('clock',0),false);for(const [h,m]of [[0,3],[0,47],[23,46],[24,0],[-1,47],[23,60],[23,NaN],[23.5,47]])assert.equal(p.setClock(h,m),false);assert.equal(p.solved.has('clock'),false);assert.equal(p.setClock(23,47),true);assert.equal(p.setClock(0,0),false);assert.equal(p.solved.has('clock'),true);assert.equal(p.remaining('main').some(q=>q.id==='clock'),false);});

test('typesetting validates complete ordered letter tiles, permits retry, and is required for the first-floor gate',()=>{const p=new Progress();assert.equal(p.answer('typesetting',0),false);for(const a of [null,[],['일','자','가'],['일','일','가','탄'],['탄','자','가','일'],['일','자','가','왕']])assert.equal(p.setTypesetting(a),false);assert.equal(p.solved.has('typesetting'),false);assert.equal(p.setTypesetting(['일','자','가','탄']),true);assert.equal(p.remaining('main').some(q=>q.id==='typesetting'),false);assert.equal(p.setTypesetting(['탄','자','가','일']),false);assert.equal(p.solved.has('typesetting'),true);});
