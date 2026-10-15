const {test}=require('node:test'),assert=require('node:assert/strict');const {PopupAudio}=require('../sikjasil/assets/ghost-audio.js');
test('fade envelope reaches silence at the popup boundary and interrupted stops do not extend',()=>{
 const events=[];const param={setValueAtTime:(...a)=>events.push(['set',...a]),linearRampToValueAtTime:(...a)=>events.push(['ramp',...a]),cancelAndHoldAtTime:()=>{}};
 const stops=[];const ctx={state:'running',currentTime:10,createBufferSource:()=>({connect(){},start(){},stop:t=>stops.push(t)}),createGain:()=>({gain:param,connect(){}})};
 const audio=Object.create(PopupAudio.prototype);audio.manager={ctx,isMuted:false,masterGain:{}};audio.context=ctx;audio.random=()=>0;audio.buffers=[{file:'test',buffer:{duration:5},scale:1}];
 assert.equal(audio.play(2.4),true);assert.deepEqual(events[0],['set',0,10]);assert.deepEqual(events.at(-1),['ramp',0,12.4]);assert.ok(events.some(e=>e[0]==='ramp'&&e[1]===.18&&e[2]>10));
 ctx.currentTime=10.5;audio.stop();const end=stops.at(-1);ctx.currentTime=10.52;audio.stop();assert.equal(stops.at(-1),end);assert.ok(end<10.6);
 audio.manager.isMuted=true;assert.equal(audio.play(2.4),false);
});
