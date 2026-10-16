/* =========================================================
   경성야록 — 동작 (app.js)
   시작 화면 → 오프닝(약 11초) → 메인(다섯 면) → 사건 상세 → 목록(그 면의 옛 지면)
   내용(글·사진·연도·원문·링크)은 모두 data.js에서 옵니다.
   ========================================================= */
(function(){
'use strict';
const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const DATA=window.YAROK,ART=DATA.articles,ILL=DATA.illust,CROPS=DATA.crops,POR=DATA.portraits;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=v=>v<0?0:v>1?1:v*v*(3-2*v);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const faceOf=id=>DATA.faces.find(f=>f.id===id);
const FACE_ORDER=DATA.faces.map(f=>f.id);                           // 사회 → 사기 → 문화·예술 → 인물
const isMobile=()=>innerWidth<760;
/* 메인 면 연출 타이머 (먼저 선언) */
let frontFxT=0;const visFaces=new Set();
const faceIO=new IntersectionObserver(es=>es.forEach(e=>{const id=e.target.dataset.face;e.isIntersecting?visFaces.add(id):visFaces.delete(id)}),{threshold:.25});

/* =========================================================
   소리 (Web Audio로 직접 합성 — 클릭 전에는 절대 소리 없음)
   ========================================================= */
let ac=null,master=null,droneNodes=null,muted=false,soundOff=false;
function initAudio(){if(muted||ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=.8;master.connect(ac.destination)}catch(e){ac=null}}
function tick(vol=.35){if(!ac)return;const len=ac.sampleRate*.03|0,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,6);const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=2600;f.Q.value=4;const g=ac.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start()}
function thud(){if(!ac)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(38,t+.25);g.gain.setValueAtTime(.95,t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(master);o.start(t);o.stop(t+.5)}
function paperRustle(v=.12){if(!ac)return;const len=ac.sampleRate*.35|0,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/len)*(.5+.5*Math.random());const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=1800;const g=ac.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(master);s.start()}
function press(v=.28){if(!ac)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(master);o.start(t);o.stop(t+.2);tick(.12)}
function knock(){if(!ac)return;const t0=ac.currentTime;[0,.19,.34].forEach((dd,k)=>{const t=t0+dd,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(70,t+.09);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5-k*.1,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(master);o.start(t);o.stop(t+.2)})}
/* 호외 방울 '딸랑': near 0(아주 멀리) ~ 1.4(바로 옆, 가장 크게) */
function jingle(near=0){if(!ac)return;const t0=ac.currentTime,out=ac.createGain(),lp=ac.createBiquadFilter();
  out.gain.value=.02+Math.min(near,1.4)*.17;lp.type='lowpass';lp.frequency.value=1400+Math.min(near,1)*6500;lp.connect(out);out.connect(master);
  const dl=ac.createDelay(),fb=ac.createGain();dl.delayTime.value=.09;fb.gain.value=Math.max(0,.35*(1-near));lp.connect(dl);dl.connect(fb);fb.connect(dl);fb.connect(out);
  const hits=near>1.2?4:2+Math.floor(Math.random()*2);
  for(let h=0;h<hits;h++){const t=t0+h*(.07+Math.random()*.04);
    [2380,3530,4710,6120].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f*(1+(Math.random()-.5)*.01);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime([.5,.3,.22,.12][i],t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.38-i*.05);o.connect(g);g.connect(lp);o.start(t);o.stop(t+.42)})}}
/* 검은 잉크 방울 '똑' */
function drop(v=.18){if(!ac)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(1150+Math.random()*250,t);o.frequency.exponentialRampToValueAtTime(320,t+.07);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(master);o.start(t);o.stop(t+.14)}
/* 흘러내릴 때 낮고 질척한 소리 (아주 작게) */
function squelch(dur=1.6,v=.05){if(!ac)return;const len=ac.sampleRate*dur|0,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){last=last*.97+(Math.random()*2-1)*.03;d[i]=last*Math.sin(Math.PI*i/len)}
  const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=260;const g=ac.createGain();g.gain.value=v*14;s.connect(f);f.connect(g);g.connect(master);s.start()}
function boost(on){if(!ac||soundOff)return;const t=ac.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(on?1:.8,t+.2)}
/* 낮게 깔리는 음악(drone). 원래 최대 .09 → 최대 25%(.0225), 메인 이후 15%(.0135) */
const MUSIC={peak:.0225,low:.008,main:.0135,off:0};
function drone(on){if(!ac)return;if(on&&!droneNodes){const g=ac.createGain();g.gain.value=0;g.connect(master);const os=[55,55.6,82.4].map(fq=>{const o=ac.createOscillator();o.type='triangle';o.frequency.value=fq;o.connect(g);o.start();return o});droneNodes={g,os}}
  else if(!on&&droneNodes){const{g,os}=droneNodes;droneNodes=null;const t=ac.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+1);os.forEach(o=>o.stop(t+1.1))}}
function musicTo(v,sec){if(!ac)return;if(!droneNodes)drone(true);const g=droneNodes.g.gain,t=ac.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(v,t+Math.max(.02,sec))}
let radioPlaying=false;
function musicForView(){if(!ac)return;musicTo(radioPlaying?MUSIC.off:MUSIC.main,1.5)}

/* 음소거 버튼 (화면 구석 + 메뉴 안) */
const muteBtn=$('#muteBtn'),menuMute=$('#menuMute');
function syncMute(){const off=!ac||soundOff;[muteBtn,menuMute].forEach(b=>{b.textContent=off?'소리 켜기':'소리 끄기';b.setAttribute('aria-pressed',String(off))})}
function toggleSound(){
  if(!ac){muted=false;initAudio();if(!ac)return;if(ac.state==='suspended')ac.resume();soundOff=false;drone(true);musicForView()}
  else{soundOff=!soundOff;const t=ac.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(soundOff?0:.8,t+.3)}
  syncMute();
}
muteBtn.addEventListener('click',toggleSound);menuMute.addEventListener('click',toggleSound);

/* =========================================================
   글자 도우미: 날짜, 한 자씩 감싸기, 스크램블 번역
   ========================================================= */
function fmtDate(s){const m=String(s||'').match(/^(\d{4})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?(.*)$/);if(!m)return s||'';let r=m[1];if(m[2])r+='. '+(+m[2]);if(m[3])r+='. '+(+m[3]);return r+(m[4]||'')}
const yearOf=s=>+(String(s||'').match(/\d{4}/)||[0])[0];
function chars(s,still){return String(s).split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch${still?' still':''}">${esc(c)}</span>`).join('')}</span>`).join(' ')}
const POOL=[...'死鬼血夜哭墓骨影怨魂闇獄呪殺刑屍冥幽靈陰燐棺葬泣慘斷首妖怪腐'];
/* ---------- 한자(기본) ↔ 한글 현대어 (마우스를 올리면 먹물이 풀리듯 한글로) ----------
   화면 읽기 프로그램에는 한글(.k)만 읽히고, 한자(.h)는 숨김 */
const HD='〇一二三四五六七八九';
const yr=y=>String(y).split('').map(c=>HD[c]??c).join('');
function hnum(n){if(n<10)return HD[n];const t=Math.floor(n/10),o=n%10;return (t>1?HD[t]:'')+'十'+(o?HD[o]:'')}
function hanjaDate(s){const m=String(s||'').match(/^(\d{4})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?(년대)?/);if(!m)return s||'';let r=yr(m[1])+(m[4]?'年代':'年');if(m[2])r+=' '+hnum(+m[2])+'月';if(m[3])r+=' '+hnum(+m[3])+'日';return r}
function koDate(s){const m=String(s||'').match(/^(\d{4})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?(년대)?/);if(!m)return s||'';let r=m[1]+(m[4]?'년대':'년');if(m[2])r+=' '+(+m[2])+'월';if(m[3])r+=' '+(+m[3])+'일';return r}
function today(){const d=new Date(),W='日月火水木金土',K='일월화수목금토';
  return [`${yr(d.getFullYear())}年 ${hnum(d.getMonth()+1)}月 ${hnum(d.getDate())}日 (${W[d.getDay()]})`,`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${K[d.getDay()]})`]}
/* ---------- 한글(기본) → 마우스를 대면 한자로 ----------
   화면의 한글은 data.js '한자 대응표'로 한자를 한 글자씩 읽어서 만듦 (1:1).
   연도·날짜(一九三三年처럼 숫자)만 아라비아 숫자와 번갈아 보이는 방식 */
const RD=DATA.readings||{},WR=DATA.wordReadings||{};
const HAN=/[\u4E00-\u9FFF]/,isNumHan=h=>/〇|[一二三四五六七八九]{3,}/.test(h);
function readOf(h){let s=String(h);for(const w in WR){if([...WR[w]].length===[...w].length)s=s.split(w).join(WR[w])}return [...s].map(c=>RD[c]||c).join('')}
function pressStyle(){const o=(.74+Math.random()*.26).toFixed(2),tilt=Math.random()<.3;if(!tilt)return ` style="opacity:${o}"`;
  const r=((Math.random()<.5?-1:1)*(.5+Math.random()*.5)).toFixed(2),dx=Math.random()<.5?(Math.random()<.5?-1:1):0,dy=Math.random()<.5?(Math.random()<.5?-1:1):0;
  return ` style="opacity:${o};transform:rotate(${r}deg) translate(${dx}px,${dy}px)"`}
function hj(h,k,o={}){if(h==null)return '';h=String(h);
  if(!HAN.test(h)&&!o.press)return esc(k!=null&&!HAN.test(h)?h:(k??h));
  if(isNumHan(h)){const kk=k??h;return `<span class="hj" aria-label="${esc(kk)} (${esc(h)})"><span class="h" aria-hidden="true">${esc(h)}</span><span class="k">${esc(kk)}</span></span>`}
  const r=readOf(h),hs=[...h],rs=[...r];
  const cells=hs.map((c,i)=>{if(c===' ')return '<span class="zs"> </span>';const kc=rs[i]||c,wide=/[\u4E00-\u9FFF\uAC00-\uD7A3\u3131-\u318E]/.test(c);
    return `<span class="zc${kc===c?' same':''}${wide?'':' nw'}" data-h="${esc(c)}" data-k="${esc(kc)}"${o.press?pressStyle():''}>${esc(kc)}</span>`}).join('');
  return `<span class="hz" role="img" aria-label="${esc(r)} (${esc(h)})">${cells}</span>`}
const L=key=>{const v=DATA.labels[key];return v?hj(v[0],v[1]):''};
/* 제목: 한자 → 한글 (한 글자당 60~80ms). still이면 무작위 한자 없이 조용히 */
async function translateTitle(box,from,to,still){
  const hj=[...from],ko=[...to],n=Math.max(hj.length,ko.length);
  if(reduce){box.innerHTML=chars(to,still);return}
  box.innerHTML=Array.from({length:n},(_,i)=>`<span class="ch${still?' still':''}">${esc(hj[i]||'')}</span>`).join('');
  const sp=[...box.children];
  for(let i=0;i<n;i++){
    const s=sp[i],end=performance.now()+60+Math.random()*20;
    if(!still&&ko[i]&&ko[i]!==' '){s.classList.add('scr');while(performance.now()<end){s.textContent=pick(POOL);await wait(18)}}
    else await wait(Math.max(0,end-performance.now()));
    s.textContent=ko[i]||'';s.classList.remove('scr');
    if(!still)for(let j=i+1;j<n;j++)if(Math.random()<.12&&hj[j]&&hj[j]!==' ')sp[j].textContent=pick(POOL);
  }
  box.innerHTML=chars(to,still);
}
/* 제목 자동 번역: 화면에 나오고 1초 뒤 (한 번 번역되면 계속 한글) */
const done=new Set();
const trIO=new IntersectionObserver(es=>es.forEach(e=>{const el=e.target;
  if(e.isIntersecting){el._tt=setTimeout(()=>runTr(el),1000)}else clearTimeout(el._tt)}),{threshold:.4});
function runTr(el){const id=el.dataset.tr,a=ART[id];if(!a||el.dataset.done)return;el.dataset.done=1;done.add(id);trIO.unobserve(el);
  translateTitle(el.querySelector('.t'),a.hanja,a.ko,a.still)}
function titleHTML(id){const a=ART[id];return `<span class="t">${hj(a.hanja,a.ko,{chars:true,still:a.still})}</span>`}
function watchTitles(root){return;/* 예전 자동 번역(스크램블)은 쓰지 않음 — 마우스를 올리면 한글로 바뀜 */$$('[data-tr]',root).forEach(el=>{if(done.has(el.dataset.tr)||reduce){el.dataset.done=1;return}const pg=el.closest('.page');if(pg&&!pg.classList.contains('cur')){trIO.unobserve(el);return}trIO.observe(el)})}

/* =========================================================
   사진 그리기: 삽화(illust) · 스캔 속 사진(crop) · 타원 인물사진(portrait)
   ========================================================= */
const KIND=k=>k;   // 캡션 종류 표기 (당시 사진 / 당시 지도 / AI 재현 삽화 — data.js에서 바꿈)
const pending=s=>!s||/확인 중|준비 중/.test(s);   // '출처 확인 중' 같은 미완성 표시는 화면에 내지 않음
function capOf(m){return `<b>${esc(KIND(m.kind))}</b>${esc(m.title||'')}${pending(m.source)?'':' · '+esc(m.source)}`}
function fxHTML(m,src){return (m.fx||[]).map(f=>{
  const d=`animation-delay:${(-Math.random()*20).toFixed(1)}s`;
  if(f.t==='fog')return `<i class="fx fog" style="${d}"></i>`;
  if(f.t==='glow')return `<i class="fx glow ${f.m||''}" style="left:${f.x}%;top:${f.y}%;width:${f.r*2}%;${d}"></i>`;
  if(f.t==='cover')return `<i class="fx cover ${f.m||''}" style="left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%;${d}"></i>`;
  if(f.t==='pend')return `<i class="fx pend" style="left:${f.x-f.r}%;top:${f.y}%;width:${f.r*2}%;height:${f.len}%;${d}"><b></b></i>`;
  if(f.t==='shade')return `<i class="fx shade" style="left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%;${d}"></i>`;
  if(f.t==='wind')return `<i class="fx wind" style="background-image:url('${src}');clip-path:inset(${f.top}% 0 0 0);${d}"></i>`;
  return '';}).join('')}
function illHTML(name,o={}){const m=ILL[name];if(!m)return '';const src=m.src||`assets/illust/${m.file}`;
  const ai=/AI/.test(m.kind);
  return `<figure class="fig"${o.h?` style="flex:none;height:${o.h}px"`:''}>`
    +`<div class="ill${m.still?' still':''}${m.real?' real':''}${m.raw?' raw':''}" data-ill="${name}"><div class="ill-in"><img src="${src}" alt="${esc(m.title||m.kind)}" decoding="async">${m.still||m.real?'':fxHTML(m,src)}</div>`
    +(o.tag&&ai?`<span class="ai-tag">${esc(m.kind)}</span>`:'')+`</div>`
    +(o.cap===false?'':`<figcaption class="cap">${capOf(m)}</figcaption>`)+`</figure>`}
function cropHTML(name,o={}){const c=CROPS[name];if(!c)return '';
  return `<figure class="fig"${o.h?` style="flex:none;height:${o.h}px"`:''}><div class="bw scanph${o.cls?' '+o.cls:''}" data-photo="${name}"><span class="cropimg" data-crop="${name}"></span>${c.flag?'<span class="flagfx"><i></i></span>':''}</div>`
    +(o.cap===false||!c.kind?'':`<figcaption class="cap">${capOf(c)}</figcaption>`)+`</figure>`}
function ptHTML(key,o={}){const p=POR[key];if(!p)return '';
  return `<div class="pt${p.still?' still':''}" data-pt="${key}"><div class="ov"><img src="assets/portraits/${p.file}" alt="${esc(p.title)}" decoding="async" data-fallback="1"></div></div>`}
/* 인물사진 파일이 없으면 '寫眞 準備中' 타원 */
function wirePortraits(root){$$('img[data-fallback]',root).forEach(img=>{if(img._w)return;img._w=1;
  const miss=()=>{const ov=img.parentElement;ov.parentElement.classList.add('none');ov.innerHTML=''};
  if(img.complete&&img.naturalWidth===0&&img.src)miss();else img.addEventListener('error',miss,{once:true})})}
/* 자리 크기에 맞춰 그림 채우기 (잘라서 보여줌) */
function sizeIll(fr){const m=ILL[fr.dataset.ill],fw=fr.clientWidth,fh=fr.clientHeight;if(!m||!fw||!fh)return;
  const[bx,by,bw,bh]=m.box||[0,0,1,1],[fx,fy]=m.focus||[.5,.5];const s=Math.max(fw/(bw*m.w),fh/(bh*m.h)),W=m.w*s,H=m.h*s;
  Object.assign(fr.firstElementChild.style,{width:W+'px',height:H+'px',left:(-bx*W+(fw-bw*W)*fx)+'px',top:(-by*H+(fh-bh*H)*fy)+'px'})}
function sizeCrop(el){const c=CROPS[el.dataset.crop],ew=el.offsetWidth,eh=el.offsetHeight;if(!c||!ew||!eh)return;
  const k=(el.dataset.fit==='contain'?Math.min:Math.max)(ew/c.w,eh/c.h),ox=(c.w*k-ew)/2,oy=(c.h*k-eh)/2;
  if(el.dataset.fit==='contain')el.style.backgroundColor='transparent';
  el.style.backgroundImage=`url('assets/scans/${c.src}.jpg')`;el.style.backgroundSize=`${500*k}px auto`;el.style.backgroundPosition=`${-(c.x*k+ox)}px ${-(c.y*k+oy)}px`;
  const fl=c.flag&&el.parentElement.querySelector('.flagfx');
  if(fl)Object.assign(fl.style,{left:(c.w*k*c.flag[0]/100-ox)+'px',top:(c.h*k*c.flag[1]/100-oy)+'px',width:(c.w*k*c.flag[2]/100)+'px',height:(c.h*k*c.flag[3]/100)+'px'})}
const RO=new ResizeObserver(es=>es.forEach(e=>{const t=e.target;if(t.dataset.ill)sizeIll(t);else if(t.dataset.crop)sizeCrop(t)}));
function wireMedia(root){$$('.ill[data-ill]',root).forEach(el=>{sizeIll(el);RO.observe(el)});$$('[data-crop]',root).forEach(el=>{sizeCrop(el);RO.observe(el)});wirePortraits(root)}
/* 옛 지면 글씨 본문 */
function btHTML(k,h){const B=DATA.body;return `<span class="bt" style="background-image:url('assets/scans/_body/${B[k]||B.a}');--bs:${B.size}px;background-position:${-Math.floor(Math.random()*400)}px ${-Math.floor(Math.random()*400)}px${h?`;flex:none;height:${h}px`:''}"></span>`}

/* =========================================================
   전구 조명 + '빛이 닿으면' 판정
   ========================================================= */
const lamp=$('#lamp'),lampI=lamp.firstElementChild;
let lx=innerWidth/2,ly=innerHeight*.42,tx=lx,ty=ly,lampHold=null,lampOn=false,lampT=0,px=lx,py=ly;
function lampMode(mode){lampOn=mode!=='off';lamp.hidden=!lampOn;lamp.className=mode==='off'?'':mode;if(lampOn)lampI.style.transform=`translate(${lx}px,${ly}px)`}
function onPointer(e){px=e.clientX;py=e.clientY;if(!lampHold){tx=px;ty=py}}
addEventListener('pointermove',onPointer,{passive:true});
addEventListener('pointerdown',onPointer,{passive:true});
function lampLoop(now){
  requestAnimationFrame(lampLoop);
  if(lampHold){tx=lampHold.x;ty=lampHold.y}
  lx+=(tx-lx)*(reduce?1:.16);ly+=(ty-ly)*(reduce?1:.16);
  const j=reduce?0:1;const jx=Math.sin(now/370)*2.2*j+Math.sin(now/1130)*3*j,jy=Math.cos(now/450)*1.8*j;   // 빛이 미세하게 흔들림
  if(lampOn)lampI.style.transform=`translate(${(lx+jx).toFixed(1)}px,${(ly+jy).toFixed(1)}px)`;
  memoTick();
  if(now-lampT>120){lampT=now;litCheck()}
}
requestAnimationFrame(lampLoop);
/* 빛이 닿은 삽화만 움직임. 벗어났다 돌아오면 밝기·위치·크기가 살짝 달라져 있음 (AI 삽화만, 실제 사진은 그대로) */
function litCheck(){const v=curView&&views[curView];if(!v||v.hidden||view==='front')return;
  const cx=view==='detail'?px:lx,cy=view==='detail'?py:ly,R=Math.max(innerWidth,innerHeight)*(view==='detail'?.16:.2)*.35;
  let best=null,bd=1e9;const els=$$('.ill:not(.still):not(.real),.scanph[data-photo]',v);
  for(const el of els){const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
    const d=Math.hypot(Math.max(r.left-cx,0,cx-r.right),Math.max(r.top-cy,0,cy-r.bottom));if(d<R&&d<bd){bd=d;best=el}}
  const b=v.querySelector('.burst');if(b)best=b;            // 크게 움직이는 중에는 그것만
  for(const el of els){if(el===best){if(!el.classList.contains('lit')){el.classList.add('lit');if(el._away&&el.classList.contains('ill'))shiftIll(el)}}
    else if(el.classList.contains('lit')){el.classList.remove('lit');el._away=1}}}
function shiftIll(el){if(reduce)return;const s=el.querySelector('.ill-in');if(!s)return;
  s.style.setProperty('--sb',(0.92+Math.random()*.16).toFixed(3));s.style.setProperty('--sx',((Math.random()-.5)*3).toFixed(2)+'%');
  s.style.setProperty('--sy',((Math.random()-.5)*3).toFixed(2)+'%');s.style.setProperty('--ss',(1+Math.random()*.045).toFixed(3))}
/* 클릭하면 한 번 크게 */
function burst(el,ms=2600){if(!el||reduce)return;el.classList.remove('burst');void el.offsetWidth;el.classList.add('burst');setTimeout(()=>el.classList.remove('burst'),ms)}

/* =========================================================
   검은 전환 — '종이가 안쪽에서부터 검게 젖어든다'
   붉은 도장의 붉은색이 종이 섬유를 따라 가늘게 번지고(0.6초),
   이어서 도장을 중심으로 종이가 뒷면에서 먹물을 빨아들이듯 어두워짐(1.5초).
   가장자리는 섬유 결 노이즈를 따라 불규칙하게, 윤곽선·광택 없이 무광.
   처음엔 아주 느리게 → 화면 절반쯤에서 갑자기 빨라져 전체를 덮음 → 0.3초 정적 → 메인이 떠오름
   ========================================================= */
const Blood=(()=>{
  const cv=$('#blood'),veil=$('#fadeVeil');let busy=false;
  /* 부드러운 값 노이즈 (gx×gy 격자) — 가로·세로 격자 수를 다르게 하면 길쭉한 섬유 결이 됨 */
  function vnoise(W,H,gx,gy){const cw=gx+1,g=new Float32Array(cw*(gy+2));for(let i=0;i<g.length;i++)g[i]=Math.random();
    const o=new Float32Array(W*H);
    for(let y=0;y<H;y++){const fy=y/H*gy,iy=fy|0,ty=fy-iy,sy=ty*ty*(3-2*ty);
      for(let x=0;x<W;x++){const fx=x/W*gx,ix=fx|0,tx=fx-ix,sx=tx*tx*(3-2*tx),k=iy*cw+ix;
        const a=g[k],b=g[k+1],c=g[k+cw],d=g[k+cw+1];o[y*W+x]=a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy}}
    return o}
  /* 종이 섬유: 짧고 가는 결 수천 개를 아무 방향으로 그려 흐리게 → 결을 따라 번지는 가장자리 */
  function fibers(W,H){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,W,H);
    x.strokeStyle='#fff';x.lineCap='round';const n=Math.round(W*H/16);
    for(let i=0;i<n;i++){const X=Math.random()*W,Y=Math.random()*H,A=Math.random()*Math.PI*2,l=3+Math.random()*18,bend=(Math.random()-.5)*.9;
      x.globalAlpha=.2+Math.random()*.55;x.lineWidth=.35+Math.random()*1;x.beginPath();x.moveTo(X,Y);
      x.quadraticCurveTo(X+Math.cos(A+bend)*l*.5,Y+Math.sin(A+bend)*l*.5,X+Math.cos(A)*l,Y+Math.sin(A)*l);x.stroke()}
    try{x.globalAlpha=1;x.filter='blur(.7px)';x.drawImage(c,0,0);x.filter='none'}catch(e){}
    const d=x.getImageData(0,0,W,H).data,o=new Float32Array(W*H);for(let i=0;i<o.length;i++)o[i]=d[i*4]/255;return o}
  /* 낮은 울림이 천천히 부풀었다가 검어지는 순간 뚝 끊김 (물소리 없음) */
  function swell(dur){if(!ac)return null;const t=ac.currentTime,g=ac.createGain(),lp=ac.createBiquadFilter();
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+dur);lp.type='lowpass';lp.frequency.value=170;lp.connect(g);g.connect(master);
    const os=[36,54,72.5].map((f,i)=>{const o=ac.createOscillator(),og=ac.createGain();o.type=i?'sine':'triangle';o.frequency.value=f;og.gain.value=[1,.45,.2][i];o.connect(og);og.connect(lp);o.start(t);return o});
    return {cut(){const n=ac.currentTime;g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(0,n+.012);os.forEach(o=>o.stop(n+.05))}}}
  const anim=(el,k,o)=>{const a=el.animate(k,o);return Promise.race([a.finished.catch(()=>{}),wait(o.duration+250)])};   // 탭이 가려져도 끝까지
  async function fade(onCovered){veil.hidden=false;veil.getAnimations().forEach(a=>a.cancel());
    await anim(veil,[{opacity:0},{opacity:1}],{duration:500,fill:'forwards'});await onCovered?.();await wait(150);
    await anim(veil,[{opacity:1},{opacity:0}],{duration:700,fill:'forwards'});veil.hidden=true;veil.getAnimations().forEach(a=>a.cancel())}
  /* 메인 → 상세: 검은 화면 대신 종이색 그대로 지면이 살짝 어두워졌다(0.3초) 상세가 나타남(0.3초) */
  async function paper(onCovered){if(reduce){await onCovered?.();return}veil.hidden=false;veil.classList.add('paper');veil.getAnimations().forEach(a=>a.cancel());
    const rise=anim(veil,[{opacity:0},{opacity:1}],{duration:300,easing:'ease-out',fill:'forwards'});   // 덮개가 올라오는 동안
    await wait(130);await onCovered?.();await rise;                                                     // 상세를 미리 그리기 시작 (화면 바꿈은 덮개가 거의 다 덮은 뒤)
    await Promise.race([new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))),wait(150)]);   // 상세가 덮개 아래에서 다 그려진 뒤에 걷어냄 (걷힐 때 끊기지 않게)
    await anim(veil,[{opacity:1},{opacity:0}],{duration:300,easing:'ease-out',fill:'forwards'});veil.hidden=true;veil.classList.remove('paper');veil.getAnimations().forEach(a=>a.cancel())}
  async function run(o={}){
    if(busy)return false;busy=true;
    if(reduce){await fade(o.onCovered);busy=false;return}
    try{return await soak(o)}catch(e){cv.hidden=true;await fade(o.onCovered);busy=false}   // 무엇이 잘못돼도 멈추지 않고 부드러운 전환으로
  }
  async function soak(o){
    const short=!!o.short,mob=isMobile(),sc=mob?.25:.33;
    const W=Math.max(8,Math.ceil((innerWidth||800)*sc)),H=Math.max(8,Math.ceil((innerHeight||600)*sc));
    cv.width=W;cv.height=H;cv.getAnimations().forEach(a=>a.cancel());cv.style.opacity='1';cv.hidden=false;
    const ctx=cv.getContext('2d'),img=ctx.createImageData(W,H),px=img.data;
    const org=o.origin||{x:innerWidth/2,y:innerHeight/2,r:60};
    const ox=org.x*sc,oy=org.y*sc,sr=Math.max(6,(org.r||60)*sc*.6);
    // 큰 얼룩 + 섬유 결(가로로 길쭉, 세로로 길쭉) + 가는 실결
    const n1=vnoise(W,H,5,4),n2=vnoise(W,H,15,11),fb=fibers(W,H);
    const L=W*H,N=new Float32Array(L),F=new Float32Array(L),Dd=new Float32Array(L),Ds=new Float32Array(L);
    const Dmax=Math.max(Math.hypot(ox,oy),Math.hypot(W-ox,oy),Math.hypot(ox,H-oy),Math.hypot(W-ox,H-oy));
    for(let y=0,i=0;y<H;y++)for(let x=0;x<W;x++,i++){N[i]=n1[i]*.6+n2[i]*.4;F[i]=Math.min(1,fb[i]*.85+n2[i]*.25);const d=Math.hypot(x-ox,y-oy);Dd[i]=d/Dmax;Ds[i]=d/sr}
    const T=short?{red:.25,spread:.9,hold:.2,rise:.8}:{red:.6,spread:1.5,hold:.3,rise:1.3};
    const R=p=>p<.55?.4*Math.pow(p/.55,2.1):.4+(1.4-.4)*Math.pow((p-.55)/.45,1.15);   // 처음 아주 느리게 → 절반쯤에서 갑자기 빨라짐
    const sw=swell(T.red*.7+T.spread);
    const t0=performance.now();let black=false,done=false;
    return new Promise(resolve=>{
      const toBlack=()=>{if(black)return;black=true;sw?.cut();ctx.fillStyle='#070606';ctx.fillRect(0,0,W,H);after()};
      async function after(){if(done)return;done=true;
        await wait(T.hold*1000);                          // 완전히 검어진 뒤 정적
        await o.onCovered?.();
        await wait(60);
        await anim(cv,[{opacity:1},{opacity:0}],{duration:T.rise*1000,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
        cv.hidden=true;cv.getAnimations().forEach(a=>a.cancel());busy=false;resolve()}
      function frame(now){if(black)return;
        const t=(now-t0)/1000,pr=Math.min(1,t/T.red),ps=clamp((t-T.red*.7)/T.spread,0,1);
        const rr=ease(pr)*2.2,RB=ps>0?R(ps):-1;
        for(let i=0,j=0;i<L;i++,j+=4){
          const er=Ds[i]-(F[i]-.4)*2.2-(N[i]-.5)*.5;const ar=clamp((rr-er)/.6,0,1)*.58;           // 붉은색이 섬유를 따라 가늘게
          const eb=Dd[i]-(N[i]-.5)*.3-(F[i]-.4)*.11;let ab=clamp((RB-eb)/.09,0,1);ab=ab*Math.sqrt(ab);             // 검게 젖어듦 (윤곽선 없음)
          const a=ab+ar*(1-ab);if(a<=.003){px[j+3]=0;continue}
          const wr=ar*(1-ab)/a;
          px[j]=7+(92-7)*wr;px[j+1]=6+(18-6)*wr;px[j+2]=6+(14-6)*wr;px[j+3]=a*255}
        ctx.putImageData(img,0,0);
        if(ps>=1)toBlack();else requestAnimationFrame(frame)}
      requestAnimationFrame(frame);
      setTimeout(toBlack,(T.red*.7+T.spread)*1000+450);   // 탭이 가려져 그리기가 멈춰도 진행
    });
  }
  return {run,fade,paper,get busy(){return busy}};
})();

/* =========================================================
   오프닝 — 동아일보 자료실 마이크로필름 (약 12초)
   0) 입장: 어둠 속 검색창 하나 (東亞日報 資料室 · 오늘 날짜) · '되감기' / '소리 없이 되감기'
   1) 검색 (약 2초): 커서가 깜빡이다 '교주'가 한 글자씩 타이핑 → 엔터 딸깍
   2) 되감기 (약 5초): 검색창이 가라앉고 필름이 촤르륵 → 덜컥 멈칫 → 촤르르르륵 더 빠르게.
      가운데 '교주'는 붉은 손그림 동그라미 안에 고정, 그동안 한 글자씩 번지며 敎主로
   3) 멈춤 (약 2초): 1937에서 쿵. 모터 뚝, 완전한 정적, 필름만 미세하게 떨림 (건너뛸 수 없음)
   4) 전환 (약 3초): 敎主 자리부터 필름이 갈색으로 부풀며 타들어가고, 구멍 너머로 양면 메인.
      타는 동안 붓글씨 '사건은 끝나지 않는다. 되감길 뿐.'이 떠올랐다 타서 사라짐
   필름 칸에는 실제 당시 지면 이미지만 씀 (지어낸 지면·임시 도형 없음)
   ========================================================= */
/* ---- 타임라인 (초) — 여기 숫자만 바꾸면 전체 흐름이 바뀜 ---- */
const TL={
  caretBlink:.45,     // 1) 타이핑 전 커서가 깜빡이는 시간
  perChar:.32,        //    한 글자 타이핑 간격
  enterAfter:.35,     //    마지막 글자 뒤 엔터까지
  sink:.55,           //    검색창이 가라앉는 시간 (이 동안 필름이 흐르기 시작)
  rewind:5.0,         // 2) 되감기 전체 길이
  joltAt:1.75,        //    중간에 덜컥 멈추는 시각 (되감기 시작 기준)
  joltHold:.3,        //    덜컥 멈춰 있는 시간
  morphAt:2.6,        //    교주 → 敎主 변환 시작 (되감기 시작 기준)
  stop:2.0,           // 3) 멈춤 (정적)
  burn:3.0,           // 4) 타들어감 전체
  phraseIn:.35,       //    붓글씨 문구가 떠오르는 시각 (전환 시작 기준)
  phraseBurn:1.5      //    문구가 타서 사라지기 시작하는 시각
};
const MF_QUERY='敎主';   // 검색어 (화면에는 한글 읽기 '교주'로 타이핑된 뒤 한자로 변환)
const mfEl=$('#mf'),mfCv=$('#mfCanvas'),mfCtx=mfCv.getContext('2d');
const mfSearch=$('#mfSearch'),mfField=$('#mfField'),mfEntry=$('#mfEntry'),mfCounter=$('#mfCounter'),mfMark=$('#mfMark'),mfPhrase=$('#mfPhrase'),mfSkip=$('#mfSkip');
let opOn=false,mfStage='entry',mfRAF=0,mfP=0,mfV=0,mfTimers=[],mfL={},mfSeen=false,mfRollT0=0,mfStopT0=0,mfBurnT0=0,mfFilmA=0,mfScratch=[];
try{mfSeen=localStorage.getItem('yarok-film-seen')==='1'}catch(e){}
const mfLater=(s,fn)=>{mfTimers.push(setTimeout(fn,s*1000))};
let mfLog0=0;const mfLog=m=>{const t=mfLog0?((performance.now()-mfLog0)/1000).toFixed(2):'0.00';console.log(`[오프닝 ${t}s] ${m}`)};
/* ---- 필름 칸: assets/rewind 이미지(data.js opening.rewindImages)가 있으면 그것, 없으면 프로젝트 안의 실제 당시 지면 ---- */
const MF_FALLBACK=['sohn-gijeong/07','ok-gwanbin/03','manbosan/02','sohn-gijeong/02','doksal-miin/04','ok-gwanbin/06','poison-12days/01','hyeonhaetan/03','sohn-gijeong/05','ok-gwanbin/10','baekbaekgyo/04','baekbaekgyo/12'].map(s=>`assets/scans/${s}.jpg`);
const MF_TARGET='assets/scans/baekbaekgyo/13.jpg';   // 멈추는 칸: 1937 백백교 사건 관련 당시 지면
const MF_LIST=(()=>{const r=(DATA.opening&&DATA.opening.rewindImages)||[];const base=r.length?r.map(f=>`assets/rewind/${f}`):MF_FALLBACK;const a=[];while(a.length<30)a.push(...base);return a.slice(0,30).concat([MF_TARGET])})();
const MF_N=MF_LIST.length,MF_STOP=MF_N-1;
const mfImgs={};const mfLoad=src=>{if(!mfImgs[src]){const im=new Image();im.src=src;mfImgs[src]=im}return mfImgs[src]};MF_LIST.forEach(mfLoad);
const MF_YEAR=+(String((ART.baekbaekgyo||{}).date||'1937').slice(0,4)),MF_MD=(String((ART.baekbaekgyo||{}).date||'1937.06.08').split('.').slice(1).map(Number));
/* ---- 되감기 속도: 촤르륵 → 덜컥(멈칫) → 촤르르르르륵(더 빠르게) → 쿵 ---- */
const mfCurve=(()=>{const n=800,R=TL.rewind,j=TL.joltAt,h=TL.joltHold,a=[0];let s=0;
  const v=t=>{if(t<j*.62)return Math.pow(t/(j*.62),2);if(t<j)return Math.max(0,1-Math.pow((t-j*.62)/(j*.38),1.6));if(t<j+h)return 0;
    const t2=t-(j+h),r2=R-(j+h);if(t2<r2*.55)return 2.2*Math.pow(t2/(r2*.55),1.6);return 2.2};   // 끝은 급정거(쿵)
  for(let k=1;k<=n;k++){s+=v(k/n*R);a.push(s)}return a.map(x=>x/s)})();
const mfPos=u=>{const k=Math.min(800,Math.max(0,u*800)),i=Math.floor(k),f=k-i;return (mfCurve[i]+(mfCurve[Math.min(800,i+1)]-mfCurve[i])*f)*MF_STOP};
/* ---- 배치: 필름을 화면 높이의 90%로 세로로, 뒤에서 빛이 통과하는 라이트박스 ---- */
function mfLayout(){const dpr=Math.min(devicePixelRatio||1,1.5),W=innerWidth||1280,H=innerHeight||720;mfCv.width=Math.round(W*dpr);mfCv.height=Math.round(H*dpr);mfCv.style.width=W+'px';mfCv.style.height=H+'px';
  const FH=H*.9,fh=FH*.78,fw=fh*.746,m=fw*.13,sw=fw+m*2;
  mfL={W,H,dpr,FH,fh,fw,m,sw,sx:W/2-sw/2,top:(H-FH)/2,pitch:fh*1.07,cy:H/2};
  mfEl.style.setProperty('--sr',(W/2+sw/2)+'px');mfEl.style.setProperty('--fw',fw+'px')}
addEventListener('resize',()=>{if(!mfEl.hidden){mfLayout();mfDraw(performance.now())}});
function mfRR(x,y,w,h,r){const c=mfCtx;c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function mfDraw(now){const L=mfL,c=mfCtx;c.setTransform(L.dpr,0,0,L.dpr,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.filter='none';
  c.fillStyle='#000';c.fillRect(0,0,L.W,L.H);   // 필름 바깥은 완전한 어둠
  if(mfFilmA<=0)return;
  c.save();c.globalAlpha=mfFilmA;
  const jit=mfStage==='stop'&&!reduce?(Math.random()-.5)*.9:0;   // 멈춤: 필름만 미세하게 떨림
  c.translate(jit,jit*.6);
  // 뒤에서 비추는 빛 (필름 폭만큼만)
  c.save();c.shadowColor='rgba(255,246,220,.35)';c.shadowBlur=60;c.fillStyle='#f3ecd8';c.fillRect(L.sx,L.top,L.sw,L.FH);c.restore();
  // 필름 바탕 (빛이 통과하는 옅은 호박색)
  c.fillStyle='rgba(62,44,20,.78)';c.fillRect(L.sx,L.top,L.sw,L.FH);
  const speed=Math.abs(mfV),blurN=mfStage==='roll'?Math.min(7,Math.floor(speed/1.6)):0,spread=Math.min(L.pitch*.4,speed*L.pitch*.014);
  // 칸 (당시 지면)
  const base=Math.floor(mfP);c.save();c.beginPath();c.rect(L.sx,L.top,L.sw,L.FH);c.clip();
  for(let k=-2;k<=2;k++){const i=base+k;if(i<0||i>MF_STOP)continue;const im=mfLoad(MF_LIST[i]);if(!(im.complete&&im.naturalWidth))continue;
    const y=L.cy+(i-mfP)*L.pitch-L.fh/2,x0=L.W/2-L.fw/2;
    c.filter='grayscale(1) sepia(.35) contrast(1.15) brightness(1.02)';
    if(blurN>1){c.globalAlpha=mfFilmA/blurN;for(let b=0;b<blurN;b++)c.drawImage(im,x0,y+(b/(blurN-1)-.5)*spread,L.fw,L.fh);c.globalAlpha=mfFilmA}   // 빠를 때는 모션블러 (형태만)
    else c.drawImage(im,x0,y,L.fw,L.fh);
    c.filter='none';c.strokeStyle='rgba(20,12,4,.8)';c.lineWidth=2;c.strokeRect(x0,y,L.fw,L.fh)}
  c.restore();
  // 필름 구멍 (빛이 새어 나옴)
  const gap=L.fh*.07,hw=L.m*.5,hh=gap*.56,hoff=(mfP*L.pitch)%gap;
  c.save();c.shadowColor='rgba(255,244,214,.9)';c.shadowBlur=14;c.fillStyle='#fff8e8';
  for(let y=L.top-gap+(gap-hoff);y<L.top+L.FH;y+=gap){if(y<L.top-hh)continue;[L.sx+L.m*.25,L.sx+L.sw-L.m*.25-hw].forEach(hx=>{mfRR(hx,Math.max(L.top,y),hw,Math.min(hh,L.top+L.FH-y),3);c.fill()})}
  c.restore();
  // 흠집 · 먼지 · 깜빡임 (약하게)
  if(!reduce&&mfStage==='roll'){if(Math.random()<.1)mfScratch.push({x:L.sx+Math.random()*L.sw,life:5+Math.random()*9});
    c.strokeStyle='rgba(255,250,235,.18)';c.lineWidth=.8;mfScratch=mfScratch.filter(s=>{c.beginPath();c.moveTo(s.x,L.top);c.lineTo(s.x+Math.sin(s.life)*2,L.top+L.FH);c.stroke();return --s.life>0});
    c.fillStyle='rgba(15,10,4,.4)';for(let d=0;d<4;d++)if(Math.random()<.5){c.beginPath();c.arc(L.sx+Math.random()*L.sw,L.top+Math.random()*L.FH,Math.random()*1.5+.3,0,6.3);c.fill()}
    c.fillStyle=`rgba(0,0,0,${(Math.random()*.07).toFixed(3)})`;c.fillRect(L.sx,L.top,L.sw,L.FH)}
  // 위아래 끝은 어둠 속으로
  const fg=c.createLinearGradient(0,L.top,0,L.top+L.FH);fg.addColorStop(0,'rgba(0,0,0,.85)');fg.addColorStop(.08,'rgba(0,0,0,0)');fg.addColorStop(.92,'rgba(0,0,0,0)');fg.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=fg;c.fillRect(L.sx-2,L.top,L.sw+4,L.FH);
  c.restore();
  if(mfStage==='burn')return mfBurn(now);
  return false}
/* ---- 타들어감: 敎主 자리부터 갈색으로 부풀며 구멍이 번짐 ---- */
function mfBurn(now){const L=mfL,c=mfCtx,t=Math.min(1,(now-mfBurnT0)/(TL.burn*1000));const t2=Math.max(0,(t-.12)/.88),e=Math.pow(t2,1.7);const Rmax=Math.hypot(L.W,L.H)*.62,R=e*Rmax,sw=Math.min(1,t/.12)*40;   // 먼저 갈색으로 부풀고, 그다음 구멍
  if(t>0){const cx=L.W/2,cy=L.cy;
    const path=rr=>{c.beginPath();for(let a=0;a<=72;a++){const th=a/72*Math.PI*2,n=1+.12*Math.sin(th*5+now/250)+.07*Math.sin(th*9-now/170)+.05*Math.sin(th*14+1.3);const r=Math.max(0,rr*n);a?c.lineTo(cx+Math.cos(th)*r,cy+Math.sin(th)*r):c.moveTo(cx+Math.cos(th)*r,cy+Math.sin(th)*r)}c.closePath()};
    c.globalCompositeOperation='source-atop';path(R+12+sw);const g=c.createRadialGradient(cx,cy,Math.max(0,R-12),cx,cy,R+16+sw);g.addColorStop(0,'rgba(38,18,5,.97)');g.addColorStop(.35,'rgba(96,54,18,.88)');g.addColorStop(.72,'rgba(160,104,46,.5)');g.addColorStop(1,'rgba(160,104,46,0)');c.fillStyle=g;c.fill();
    const rnd=((s)=>()=>{s=(s*9301+49297)%233280;return s/233280})(Math.floor(now/90)+3);
    for(let q=0;q<46;q++){const th=rnd()*Math.PI*2,rr=R+8+rnd()*30,px=cx+Math.cos(th)*rr,py=cy+Math.sin(th)*rr,s=3+rnd()*10;const bg=c.createRadialGradient(px-s*.3,py-s*.3,0,px,py,s);bg.addColorStop(0,'rgba(196,136,64,.55)');bg.addColorStop(1,'rgba(60,28,6,0)');c.fillStyle=bg;c.beginPath();c.arc(px,py,s,0,6.3);c.fill()}
    if(R>0){c.globalCompositeOperation='destination-out';path(R);c.fillStyle='#000';c.fill()}c.globalCompositeOperation='source-over'}
  return t>=1}
/* ---- 기계식 날짜 카운터 (필름 오른쪽, 크게) ---- */
function mfSetCounter(y,m,d){mfCounter.innerHTML=`<span class="mc-y">${String(y).split('').map(n=>`<b>${n}</b>`).join('')}</span><span class="mc-md">${String(m).padStart(2,' ').split('').map(n=>`<b>${n.trim()||'&nbsp;'}</b>`).join('')}<i>.</i>${String(d).padStart(2,'0').split('').map(n=>`<b>${n}</b>`).join('')}</span>`}
/* ---- 소리: 파일이 있으면 assets/sound/*.mp3, 없으면 Web Audio 임시 소리 ---- */
const MF_SND={};['type','enter','rewind','clunk','thud','burn'].forEach(k=>{const a=new Audio();a.preload='auto';a.oncanplaythrough=()=>{MF_SND[k]=a};a.onerror=()=>{};a.src=`assets/sound/${k}.mp3`});
const playFile=k=>{const a=MF_SND[k];if(!a)return false;try{const b=a.cloneNode();b.play().catch(()=>{})}catch(e){}return true};
function sndType(){if(!ac||playFile('type'))return;const t=ac.currentTime,len=ac.sampleRate*.025|0,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);
  const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1800+Math.random()*600;f.Q.value=2;const g=ac.createGain();g.gain.value=.5;s.connect(f);f.connect(g);g.connect(master);s.start(t);
  const o=ac.createOscillator(),og=ac.createGain();o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(80,t+.04);og.gain.setValueAtTime(.18,t);og.gain.exponentialRampToValueAtTime(.001,t+.05);o.connect(og);og.connect(master);o.start(t);o.stop(t+.06)}   // 타닥
function sndEnter(){if(!ac||playFile('enter'))return;sndType();setTimeout(()=>tick(.45),40)}   // 딸깍
let mfMotor=null;
function mfMotorStart(){if(!ac)return;if(MF_SND.rewind){const a=MF_SND.rewind;a.currentTime=0;a.loop=true;a.playbackRate=.5;a.play().catch(()=>{});mfMotor={file:a};return}
  const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();o.type='sawtooth';o.frequency.value=60;f.type='lowpass';f.frequency.value=900;g.gain.value=0;o.connect(f);f.connect(g);g.connect(master);o.start();
  const len=ac.sampleRate,buf=ac.createBuffer(1,len,ac.sampleRate),dd=buf.getChannelData(0);for(let i=0;i<len;i++)dd[i]=Math.random()*2-1;const ns=ac.createBufferSource();ns.buffer=buf;ns.loop=true;const nf=ac.createBiquadFilter();nf.type='bandpass';nf.frequency.value=2200;nf.Q.value=.8;const ng=ac.createGain();ng.gain.value=0;ns.connect(nf);nf.connect(ng);ng.connect(master);ns.start();
  mfMotor={o,g,nf,ng,ns}}
function mfMotorSet(v){if(!mfMotor||!ac)return;const k=Math.min(1,v/16);   // 필름 속도에 맞춰 음 높이가 오르내림 (촤르륵)
  if(mfMotor.file){mfMotor.file.playbackRate=.5+k*1.4;mfMotor.file.volume=Math.min(1,.2+k);return}const t=ac.currentTime;
  mfMotor.o.frequency.setTargetAtTime(55+k*420,t,.04);mfMotor.g.gain.setTargetAtTime(k*.08,t,.04);mfMotor.nf.frequency.setTargetAtTime(1200+k*4200,t,.04);mfMotor.ng.gain.setTargetAtTime(k*.07,t,.04)}
function mfMotorStop(){if(!mfMotor)return;if(mfMotor.file){mfMotor.file.pause()}else if(ac){const t=ac.currentTime;mfMotor.g.gain.cancelScheduledValues(t);mfMotor.g.gain.setValueAtTime(0,t);mfMotor.ng.gain.cancelScheduledValues(t);mfMotor.ng.gain.setValueAtTime(0,t);mfMotor.o.stop(t+.05);mfMotor.ns.stop(t+.05)}mfMotor=null}   // 뚝
function sndClunk(){if(!ac||playFile('clunk'))return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(60,t+.1);g.gain.setValueAtTime(.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(master);o.start(t);o.stop(t+.18);tick(.3)}   // 덜컥
function sndThud(){if(!ac||playFile('thud'))return;thud()}   // 쿵
function sndBurn(){if(!ac||playFile('burn'))return;const len=ac.sampleRate*(TL.burn+.4)|0,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);let lp=0;   // 타닥 (불)
  for(let i=0;i<len;i++){lp=lp*.985+(Math.random()*2-1)*.015;const pop=Math.random()<.0011?(Math.random()*2-1)*.9:0;d[i]=(lp*6+pop)*Math.min(1,i/(ac.sampleRate*.3))*Math.min(1,(len-i)/(ac.sampleRate*.5))}
  const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=2600;const g=ac.createGain();g.gain.value=.5;s.connect(f);f.connect(g);g.connect(master);s.start()}
/* ---- 진행 ---- */
function mfLoop(now){if(!opOn)return;mfRAF=requestAnimationFrame(mfLoop);
  if(mfStage==='roll'){const t=(now-mfRollT0)/1000,u=Math.min(1,t/TL.rewind),pp=mfP;mfP=mfPos(u);mfV=(mfP-pp)*60;mfMotorSet(Math.abs(mfV));mfFilmA=Math.min(1,t/.5);
    const pn=mfP/MF_STOP;mfSetCounter(Math.max(MF_YEAR,Math.round(2026-(2026-MF_YEAR)*pn)),mfV>.05?1+Math.floor(Math.random()*12):(u<1?1+Math.floor(pn*11):MF_MD[0]),mfV>.05?1+Math.floor(Math.random()*28):(u<1?1+Math.floor(pn*27):MF_MD[1]));
    if(u>=1)mfStop()}
  if(mfDraw(now))mfDone()}
function mfBegin(fromStop){
  mfLog0=performance.now();opOn=true;mfTimers.forEach(clearTimeout);mfTimers=[];mfP=0;mfV=0;mfFilmA=0;mfBurnT0=0;
  mfLog(`시작 (본 적 있음=${mfSeen}, 멈춤부터=${!!fromStop}, 움직임줄이기=${reduce})`);
  mfEntry.classList.add('gone');mfSkip.hidden=false;muteBtn.hidden=false;syncMute();mfLayout();cancelAnimationFrame(mfRAF);mfRAF=requestAnimationFrame(mfLoop);
  mfMark.innerHTML=hj(MF_QUERY)+'<svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true"><path d="M58 52C96 22 212 18 260 52C298 80 286 150 226 172C164 192 70 186 36 146C10 114 26 70 84 44C120 30 170 26 204 34"/></svg>';mfMark.querySelector('.hz')?.setAttribute('data-nohover','');
  if(fromStop||reduce){mfSearch.hidden=true;mfP=MF_STOP;mfFilmA=1;mfSetCounter(MF_YEAR,MF_MD[0],MF_MD[1]);mfCounter.hidden=false;mfMark.hidden=false;const hz=mfMark.querySelector('.hz');if(hz)toHan(hz,true);mfStop(true);return}
  // 1) 검색: 커서 깜빡임 → '교주' 타이핑 → 엔터
  mfStage='search';mfLog('검색 시작');mfField.textContent='';mfSearch.hidden=false;mfSearch.classList.remove('sink');mfSearch.classList.add('typing');
  const q=readOf(MF_QUERY);[...q].forEach((ch,i)=>mfLater(TL.caretBlink+i*TL.perChar,()=>{mfField.textContent+=ch;sndType()}));
  const tEnter=TL.caretBlink+q.length*TL.perChar+TL.enterAfter;
  mfLater(tEnter,()=>{sndEnter();mfSearch.classList.remove('typing');mfLog('엔터');mfSearch.classList.add('sink');mfRoll()});   // 2) 검색창이 가라앉으며 되감기 시작
}
function mfRoll(){mfStage='roll';mfRollT0=performance.now()+TL.sink*400;mfLog('되감기 시작');mfMotorStart();
  mfCounter.hidden=false;mfSetCounter(2026,9,30);
  mfLater(TL.sink,()=>{mfSearch.hidden=true;mfMark.hidden=false});
  mfLater(TL.sink*.4+TL.joltAt,()=>{sndClunk();mfLog('덜컥 (멈칫)')});
  mfLater(TL.sink*.4+TL.morphAt,()=>{const hz=mfMark.querySelector('.hz');if(hz){toHan(hz);mfLog('교주 → 敎主 변환')}})}
function mfStop(quiet){mfStage='stop';mfStopT0=performance.now();mfP=MF_STOP;mfV=0;mfMotorStop();mfSetCounter(MF_YEAR,MF_MD[0],MF_MD[1]);
  mfLog('멈춤 시작 (쿵 · 정적)');if(!quiet){sndThud();mfEl.classList.remove('jolt');void mfEl.offsetWidth;mfEl.classList.add('jolt')}
  const hz=mfMark.querySelector('.hz');if(hz)toHan(hz,true);
  if(ac)musicTo(0,.05);   // 완전한 정적
  mfLater(TL.stop,()=>mfBurnStart());   // 멈춤 구간은 건너뛰지 않음
  history.replaceState(null,'','#main');render({v:'front'})}   // 메인은 쿵 하는 순간 미리 그려 두되, 필름 뒤에 가려져 타들어간 구멍으로만 보임   // 멈춤 구간은 건너뛰지 않음
function mfBurnStart(){if(mfStage!=='stop')return;mfLog('전환 시작 (타들어감)');
  if(reduce){mfFinish(true);return}
  mfStage='burn';mfBurnT0=performance.now();mfEl.classList.add('burning');sndBurn();mfMark.classList.add('burnout');mfCounter.classList.add('fade');
  mfLater(TL.phraseIn,()=>{mfPhrase.hidden=false;mfPhrase.classList.remove('burnaway');void mfPhrase.offsetWidth;mfPhrase.classList.add('show')});
  mfLater(TL.phraseBurn,()=>mfPhrase.classList.add('burnaway'));
  mfLater(TL.burn+.05,mfDone)}   // 그리기가 멈춰도 끝나게
function mfDone(){if(!opOn)return;mfLog('전환 끝 → 메인');try{localStorage.setItem('yarok-film-seen','1')}catch(e){}mfSeen=true;mfHide();if(ac)musicTo(MUSIC.main,2.5)}
async function mfFinish(){if(!opOn)return;mfTimers.forEach(clearTimeout);mfTimers=[];mfMotorStop();
  await Blood.fade(()=>{mfHide();history.replaceState(null,'','#main');render({v:'front'})});if(ac)musicTo(MUSIC.main,2)}
function mfHide(){opOn=false;cancelAnimationFrame(mfRAF);mfTimers.forEach(clearTimeout);mfTimers=[];mfMotorStop();mfEl.hidden=true;mfSkip.hidden=true;mfEl.classList.remove('burning');
  [mfMark,mfCounter,mfPhrase].forEach(e=>e.classList.remove('fade','burnout','show','burnaway'));mfPhrase.hidden=true;mfMark.hidden=true;mfCounter.hidden=true}
function stopOpening(){mfHide()}
/* ---- 입장 화면 ---- */
function mfShowEntry(){opOn=false;mfStage='entry';mfEl.hidden=false;mfEntry.classList.remove('gone');mfSearch.hidden=false;mfSearch.classList.remove('sink','typing');mfField.textContent='';
  mfMark.hidden=true;mfCounter.hidden=true;mfPhrase.hidden=true;mfSkip.hidden=true;mfFilmA=0;
  const d=new Date();$('#mfDate').textContent=`${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()}`;
  mfLayout();mfDraw(performance.now());mfEntry.querySelector('button').focus({preventScroll:true})}
let replaying=false;
function mfEnter(withSound){muted=!withSound;if(!muted){initAudio();if(ac&&ac.state==='suspended')ac.resume();soundOff=false}
  mfBegin(mfSeen&&!replaying);replaying=false}   // 다시 방문하면 3) 멈춤부터
$('#mfGo').addEventListener('click',()=>mfEnter(true));
$('#mfMute').addEventListener('click',()=>mfEnter(false));
mfSkip.addEventListener('click',e=>{e.stopPropagation();mfFinish()});
document.addEventListener('keydown',e=>{if(opOn&&e.key==='Escape'){e.preventDefault();mfFinish()}});
function showGate(){mfHide();hideAllViews();$('#top').hidden=true;muteBtn.hidden=true;modernBtn.hidden=true;lampMode('off');replaying=true;mfShowEntry();
  if(ac)musicTo(0,1);document.title='경성야록 : 자정의 호외'}

/* =========================================================
   화면 전환 (주소 뒤 #으로 기억: #main / #a/사건id / #list/면id / #appendix)
   ========================================================= */
const views={front:$('#front'),detail:$('#detail'),list:$('#list'),appendix:$('#appendixView')};
let curView=null,view=null,navBusy=false;
function hideAllViews(){Object.values(views).forEach(v=>v.hidden=true);curView=null;view=null;stopFrontFx()}
function parseHash(h=location.hash){
  let m;if((m=h.match(/^#a\/([\w-]+)/)))return {v:'detail',id:m[1]};
  if((m=h.match(/^#list\/([\w-]+)(?:\/([\w-]+))?/)))return {v:'list',face:m[1],hl:m[2]};
  if(h==='#appendix')return {v:'appendix'};
  if(h==='#main')return {v:'front'};
  return null;
}
function hashOf(s){return s.v==='detail'?'#a/'+s.id:s.v==='list'?'#list/'+s.face+(s.hl?'/'+s.hl:''):s.v==='appendix'?'#appendix':'#main'}
async function go(state,mode='fade',origin){
  if(navBusy||Blood.busy)return;navBusy=true;closePops();
  const apply=()=>{const h=hashOf(state);if(location.hash!==h)history.pushState(null,'',h);render(state)};
  try{
    if(mode==='blood'||mode==='short')await new Promise(res=>{Blood.run({short:mode==='short',origin,onCovered:()=>{apply();res()}}).then(v=>{if(v===false)res()})});
    else if(mode==='fade')await Blood.fade(apply);
    else if(mode==='paper')await Blood.paper(apply);
    else apply();
  }finally{navBusy=false}
}
addEventListener('popstate',()=>{const s=parseHash();if(!s){showGate();return}if(!mfEl.hidden)mfHide();Blood.fade(()=>render(s))});
function render(s){
  hideAllViews();$('#top').hidden=s.v==='front';muteBtn.hidden=false;modernBtn.hidden=false;syncMute();
  view=s.v;curView=s.v;
  if(s.v==='front'){views.front.hidden=false;renderFront();lampMode('off');document.title='경성야록 : 자정의 호외'}
  else if(s.v==='detail'){const a=ART[s.id];if(!a||a.status!=='ready'){return render(a?{v:'list',face:a.face,hl:s.id}:{v:'front'})}
    renderDetail(s.id);views.detail.hidden=false;lampMode('off');document.title=`${a.ko} · 경성야록`}
  else if(s.v==='list'){if(!faceOf(s.face))return render({v:'front'});renderList(s.face,s.hl);views.list.hidden=false;lampMode('off');document.title=`${faceOf(s.face).ko}면 · 경성야록`}
  else if(s.v==='appendix'){renderAppendix();views.appendix.hidden=false;lampMode('off');document.title='부록 · 경성야록'}
  markNav(s);scrollTo(0,0);
  const v=views[s.v];wireMedia(v);watchTitles(v);if(s.v==='front')startFrontFx();
  if(ac&&!opOn)musicForView();
}
/* 면 바로 가기: 그 면의 첫 번째 풀버전 사건 (없으면 목록) */
function firstFull(faceId){const f=faceOf(faceId);return f&&f.articles.find(id=>ART[id]&&ART[id].status==='ready')}
function faceTarget(faceId){if(faceId==='appendix')return {v:'appendix'};const id=firstFull(faceId);return id?{v:'detail',id}:{v:'list',face:faceId}}
/* 사건 하나가 가는 곳: 풀버전이면 상세, 아니면 그 면 목록에서 강조 */
function artState(id){const a=ART[id];return a&&a.status==='ready'?{v:'detail',id}:{v:'list',face:a?a.face:'society',hl:id}}
function goArticle(id,fromEl){const a=ART[id];if(!a)return;
  const st=artState(id);
  const r=fromEl?.getBoundingClientRect();
  go(st,view==='front'&&st.v==='detail'?'paper':'fade',r?{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width}:undefined)}

/* =========================================================
   상단 네비게이션
   ========================================================= */
const NAV=[...DATA.faces.map(f=>({id:f.id,label:f.ko,hanja:f.hanja})),{id:'appendix',label:DATA.appendix.ko,hanja:DATA.appendix.hanja}];
$('#tpTag').innerHTML=hj(DATA.site.taglineHanja,DATA.site.tagline);$('#tpEdition').innerHTML=L('edition');
(function(){const d=today();$('#tpDate').innerHTML=hj(d[0],d[1])})();
$('#tpNav').innerHTML=NAV.map(n=>`<button data-go="${n.id}">${hj(n.hanja,n.label)}</button>`).join('');
$('#mnFaces').innerHTML=NAV.map(n=>{const f=faceOf(n.id);return `<button data-go="${n.id}"><b>${hj(n.hanja,n.label)}</b><small>${f?hj(f.keywords[0][0],f.keywords[0][1]):hj('新聞 너머','신문 너머')}</small></button>`}).join('');
[['records','전체 기록 목록'],['years','1924~1937 연표'],['radio','기록을 듣다'],['about','기획 의도 · 출처 원칙 · 팀']].forEach(([k,sub])=>{const b=$(`#menu [data-panel="${k}"]`);if(b)b.innerHTML=`${L(k)} <small>${esc(sub)}</small>`});
document.addEventListener('click',e=>{if(e.target.closest('[data-search]'))openPanel('search');else if(e.target.closest('[data-menu]'))openPop($('#menu'),e.target.closest('[data-menu]'))});
/* 변환: 한 글자씩(0.1초 간격) 먹이 번지듯 흐려짐 → 아무 한자 2~3개가 빠르게 스침 → 최종 한자로 또렷하게 굳음
   스치는 한자 사이에 가끔 鬼·怨·死·血·哭 중 하나가 0.05초 섞임 */
const GHOST=[...'鬼怨死血哭'],FLICK=[...'夜影燈紙墨舊巷雨月霧街門窓樓寂雲沈古'];
const cellsOf=el=>$$('.zc:not(.same)',el);
function toHan(el,instant){const tok=el._tok=(el._tok||0)+1;const cs=cellsOf(el);
  if(instant||reduce){cs.forEach(c=>{c.textContent=c.dataset.h;c.classList.remove('ink');c.classList.add('han')});return}
  cs.forEach((c,i)=>setTimeout(()=>{if(el._tok!==tok)return;c.classList.add('ink');
    const seq=Array.from({length:2+(Math.random()<.5?1:0)},()=>[pick(FLICK),45]);if(Math.random()<.2)seq.splice(Math.floor(Math.random()*(seq.length+1)),0,[pick(GHOST),50]);
    let t=80;seq.forEach(([ch,d])=>{setTimeout(()=>{if(el._tok===tok)c.textContent=ch},t);t+=d});
    setTimeout(()=>{if(el._tok!==tok)return;c.textContent=c.dataset.h;c.classList.remove('ink');c.classList.add('han')},t)},i*100))}
function toKo(el,instant){const tok=el._tok=(el._tok||0)+1;const cs=cellsOf(el);
  cs.forEach((c,i)=>{const done=()=>{c.textContent=c.dataset.k;c.classList.remove('ink','han')};if(instant||reduce){done();return}
    setTimeout(()=>{if(el._tok!==tok)return;c.classList.add('ink');setTimeout(()=>{if(el._tok===tok)done()},80)},i*30)})}
const hzTarget=n=>{const t=n&&n.closest&&(n.closest('[data-hzg]')||n.closest('.hz'));return t&&!t.hasAttribute('data-nohover')?t:null};
document.addEventListener('pointerover',e=>{if(e.pointerType==='touch'||document.body.classList.contains('hanja'))return;const t=hzTarget(e.target);if(t&&!t.contains(e.relatedTarget))toHan(t)});
document.addEventListener('pointerout',e=>{if(e.pointerType==='touch'||document.body.classList.contains('hanja'))return;const t=hzTarget(e.target);if(t&&!t.contains(e.relatedTarget))toKo(t)});
/* 휴대폰: 한 번 탭하면 한자로, 다시 탭하면 한글로 (버튼·링크 안의 글자는 원래 동작) */
document.addEventListener('click',e=>{if(!matchMedia('(hover:none)').matches)return;const t=hzTarget(e.target)||e.target.closest('.hj');if(!t||t.closest('button,a,[data-go],[data-art]'))return;
  e.preventDefault();e.stopPropagation();if(t.classList.contains('hj')){t.classList.toggle('on');return}t.classList.toggle('is-han');t.classList.contains('is-han')?toHan(t):toKo(t)},true);
/* 漢字로 보기 (발표용): 전체를 한자로 고정 */
const modernBtn=$('#modernBtn');
function setModern(on){document.body.classList.toggle('hanja',on);modernBtn.setAttribute('aria-pressed',String(on));
  const v=DATA.labels[on?'modernOff':'modernOn'];modernBtn.textContent=on?v[1]:v[1];modernBtn.setAttribute('aria-label',on?'한글로 보기':'한자로 보기');
  $$('[data-hzg],.hz').forEach(el=>{if(el.closest('[data-hzg]')&&!el.matches('[data-hzg]'))return;on?toHan(el,true):toKo(el,true)})}
modernBtn.addEventListener('click',()=>setModern(!document.body.classList.contains('hanja')));
setModern(false);   // 들어올 때는 늘 한글이 기본
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const id=b.dataset.go;
  const st=faceTarget(id);go(st,view==='front'&&st.v==='detail'?'paper':'fade',b.getBoundingClientRect())});
function markNav(s){const cur=s.v==='detail'?ART[s.id]?.face:s.v==='list'?s.face:s.v==='appendix'?'appendix':null;
  $$('#tpNav button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.go===cur)))}
$('#homeBtn').addEventListener('click',()=>go({v:'front'},'fade'));
$('#searchBtn').addEventListener('click',()=>openPanel('search'));
$('#menuBtn').addEventListener('click',()=>openPop($('#menu'),$('#menuBtn')));
$('#replay').addEventListener('click',()=>{closePops();history.pushState(null,'',location.pathname+location.search);showGate()});

/* =========================================================
   메인: 다섯 면
   ========================================================= */
/* ---------- 메인: 한 화면에 신문 한 면 (1280×720 판을 통째로 줄였다 늘림) ----------
   이번 단계는 가만히 있는 화면만 — 사진이 움직이는 연출·깜빡임은 다음 단계에서 */
const bodyTile=k=>`assets/scans/_body/${DATA.body[k]||DATA.body.a}`;
function pil(k){return `<span class="pil" aria-hidden="true" style="background-image:url('${bodyTile(k)}');background-position:${-Math.floor(Math.random()*400)}px ${-Math.floor(Math.random()*400)}px"></span>`}
function metaOf(c){return c.illust?ILL[c.illust]:c.crop?CROPS[c.crop]:null}
function capLine(m){return m?m.cap?esc(m.cap):`<b>${esc(m.kind||'')}</b>${esc(m.title||'')}${pending(m.source)?'':' · '+esc(m.source)}`:''}
function thumbHTML(c){return c.illust?illHTML(c.illust,{cap:false}):c.crop?cropHTML(c.crop,{cap:false}):''}
/* 작은 카드 사진: 배경 이미지로 단순하게 (흑백·망점은 CSS) */
function smallThumb(c){if(c.illust){const m=ILL[c.illust],[fx,fy]=m.focus||[.5,.4];return `<span class="thimg" data-ill="${c.illust}" style="background-image:url('assets/illust/${m.file}');background-position:${fx*100}% ${fy*100}%"></span>`}
  return c.crop?`<span class="thimg crop" data-crop="${c.crop}"></span>`:''}
/* 면 제목: 굵은 명조 한자 + 아래 작은 한글 '○○면' / 면 보기: 붉은 글씨 링크 */
const faceKo=f=>f.ko.replace('·','')+'면';
function leftCol(f){return `<div class="lc"><h2 class="lc-big"><span class="lc-hz">${esc(f.hanja)}</span><span class="lc-ko">${esc(faceKo(f))}</span></h2>`
  +`<ul class="lc-cats">${f.keywords.slice(0,3).map(k=>`<li>${hj(k[0],k[1])}</li>`).join('')}</ul>`
  +`<button class="lc-btn" type="button">${esc(faceKo(f))} 보기 →</button></div>`}
/* 활판 인쇄: 글자마다 잉크 농도를 조금씩 다르게, 일부는 0.5~1도 기울거나 1px 어긋나게 */
function pressChars(t){return [...String(t)].map(c=>{if(c===' ')return ' ';const o=(.72+Math.random()*.28).toFixed(2);
  const tilt=Math.random()<.3,r=tilt?((Math.random()<.5?-1:1)*(.5+Math.random()*.5)).toFixed(2):0,dx=tilt&&Math.random()<.5?(Math.random()<.5?-1:1):0,dy=tilt&&Math.random()<.5?(Math.random()<.5?-1:1):0;
  return `<span class="pc" style="opacity:${o}${tilt?`;transform:rotate(${r}deg) translate(${dx}px,${dy}px)`:''}">${esc(c)}</span>`}).join('')}
/* 작은 카드: title이 있으면 사건 제목 대신 그 짧은 제목 / emptyThumb가 있으면 사진 대신 빈 타원 틀 + 가운데 작은 글씨 */
function cardHTML(c){const a=c.a&&ART[c.a],m=metaOf(c);
  const title=c.title?hj(c.title[0],c.title[1]):hj(a.hanja,a.ko);
  // 작은 카드는 폭이 좁아 사진 종류만 (제목·출처는 마우스를 올리면)
  const small=c.noPhoto||!m?'':`<small title="${esc([m.kind,m.title,pending(m.source)?'':m.source].filter(Boolean).join(' · '))}"><b>${esc(m.kind||'')}</b></small>`;
  return `<button class="card${c.noPhoto?' nophoto':''}" type="button"${a?` data-art="${c.a}"`:''}>`
    +(c.noPhoto?'':c.emptyThumb?`<span class="th empty"><span class="th-oval"><small>${esc(c.emptyThumb)}</small></span></span>`:`<span class="th">${smallThumb(c)}</span>`)
    +`<span class="cd"><b>${title}</b><p title="${esc((c.desc||[]).join(' '))}">${esc((c.desc||[]).join(' '))}</p>${small}</span><span class="ar" aria-hidden="true">→</span></button>`}
/* 대표 사진 오른쪽 어두운 판: 오른쪽부터 머리표 | 큰 제목 | 부제 (메인 대표 사진 패널) */
function panelHTML(p){return `<div class="hero-panel"><span class="hp-kick">${esc(p.kick)} <em>${esc(p.year)}</em></span>`
  +`<h3 class="hp-title">${p.title.map(esc).join('<br>')}</h3><p class="hp-sub">${p.sub.map(esc).join('<br>')}</p></div>`}
function faceHTML(id,marks=''){const f=faceOf(id),fp=DATA.frontPage[id],m=metaOf(fp.hero);
  return `<div class="fp-face fp-${id}" role="link" tabindex="0" data-face="${id}" aria-label="${esc(f.ko)}면 펼치기 — ${f.articles.length}개의 기록">`
    +leftCol(f)
    +`<div class="rc"><div class="hero">${thumbHTML(fp.hero)}<span class="hero-cap">${capLine(m)}</span>${marks}${panelHTML(fp.panel)}</div>`
    +`<div class="cards">${fp.cards.slice(0,2).map(cardHTML).join('')}</div></div></div>`}
/* 인물: 네 명 모두 같은 크기의 타원형 사진 틀 (사진은 images/ — 이미 톤 보정됨) */
function peopleHTML(){const f=faceOf('people');
  const cards=DATA.people.filter(p=>!p.listOnly).map(p=>`<button class="pcard" type="button" data-art="p-${p.id}">`
    +`<span class="pc-ph oval"><img src="${esc(p.photo||'assets/portraits/'+p.file)}" alt="${esc(p.name)}"></span>`
    +`<b>${hj(p.hanjaName||p.name,p.name)}</b><span class="job">${hj(p.hanjaRole||p.role,p.role)}</span><p>${esc(p.line||'')}</p>`
    +(pending(p.source)?'':`<span class="src"><b style="font-size:9px;font-weight:700">당시 사진</b> · ${esc(p.source)}</span>`)+`<span class="ar" aria-hidden="true">→</span></button>`).join('');
  return `<div class="fp-face fp-people" role="link" tabindex="0" data-face="people" aria-label="인물면 펼치기 — ${f.articles.length}개의 기록">${leftCol(f)}<div class="pcards">${cards}</div></div>`}
/* 附錄 칸: 제목 + 작품 목록 */
function apTile(t){return `<div class="ap-tile"><div class="ap-tt"><b>${hj(t.h,t.k)}</b><ul>${t.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></div>`}
/* 附錄: 왼쪽 면에는 제목과 小說·映畫, 오른쪽 면에는 冊과 '기록은 지금도 이어진다' */
function appendixLeft(){const A=DATA.appendix,T=A.tiles.filter(t=>t.items.length&&t.h!=='冊');
  return `<div class="bd-ap ap-left" role="link" tabindex="0" data-face="appendix" aria-label="부록 — ${esc(A.lead)}">`
    +`<div class="ap-l"><h2 class="lc-big"><span class="lc-hz">${esc(A.hanja)}</span><span class="lc-ko">${esc(A.ko)}</span></h2><p>${A.desc.map(esc).join('<br>')}</p><button class="lc-btn" type="button">${esc(A.ko)} 보기 →</button></div>`
    +`<div class="ap-tiles" style="grid-template-columns:repeat(${T.length},minmax(0,1fr))">${T.map(apTile).join('')}</div></div>`}
function appendixRight(){const A=DATA.appendix,T=A.tiles.filter(t=>t.h==='冊'&&t.items.length);
  return `<div class="bd-ap ap-right" role="link" tabindex="0" data-face="appendix" aria-label="부록 — ${esc(A.lead)}">`
    +`<div class="ap-tiles" style="grid-template-columns:repeat(${T.length},minmax(0,1fr))">${T.map(apTile).join('')}</div>`
    +`<div class="ap-r"><strong>${hj(A.still[0],A.still[1])}</strong><div class="ap-line">${A.timeline.map((t,i)=>(i?'<i></i>':'')+`<span>${hj(t[0],t[1])}</span>`).join('')}</div></div></div>`}
function renderFront(){const d=today();
  const nav=NAV.map(n=>`<button type="button" data-go="${n.id}">${hj(n.hanja,n.label)}</button>`).join('')
    +`<button class="ic" type="button" data-search aria-label="검색"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg></button>`
    +`<button class="ic" type="button" data-menu aria-label="메뉴 열기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>`;
  // 가만히 있는 기괴한 표식: 붉은 檢閱 도장, 먹칠 줄, 거꾸로 박힌 활자 한 자
  const censor=`<span class="censor" aria-hidden="true" style="left:12px;top:12px">檢閱</span>`;
  const layers=`<span class="bd-back" aria-hidden="true"></span><span class="bd-fox" aria-hidden="true"></span><span class="bd-wear" aria-hidden="true"></span><span class="hand" aria-hidden="true"></span>`;
  const date=`<span class="bd-date">${hj(d[0],d[1])}</span>`;
  views.front.innerHTML=`<div class="bd-stage" id="bdStage">${bgTypeHTML()}<div class="bd-scale" id="bdScale"><div class="bd-shadow" id="bdShadow"><div class="bd spread" id="fpSheet">`
    +`<section class="sheet left" aria-label="제2면">${layers}`
    +`<header class="pg-band"><button class="bd-title" id="mhHome" type="button" aria-label="경성야록 (京城夜錄)">${DATA.site.title}</button><span class="nl-stamp" aria-label="납량특집 (納涼特輯)">納涼特輯</span><span class="pg-no">${hj('第二面')}</span>${date}</header>`
    +`${faceHTML('society')}${faceHTML('fraud')}${appendixLeft()}</section>`
    +`<section class="sheet right" aria-label="제3면">${layers}`
    +`<header class="pg-band"><span class="pg-no">${hj('第三面')}</span>${date}<nav class="bd-nav" aria-label="면 바로 가기">${nav}</nav></header>`
    +`${faceHTML('culture',censor)}${peopleHTML()}${appendixRight()}</section>`
    +`</div><span class="bd-dark" aria-hidden="true"></span></div></div></div>`;
  // 활자 한 자가 거꾸로 박힌 곳 (사기면 분류의 한 글자)
  const li=views.front.querySelectorAll('.fp-fraud .lc-cats li:nth-child(3) .zc')[1];if(li)li.classList.add('flipch');
  $('#mhHome').onclick=()=>go({v:'front'},'none');
  paintFoxing();wireFront();wireBgType();wireHand();fitBoard();tearEdges();
}
/* 종이 바깥 검은 바탕: 실제 기사 제목들을 세로쓰기(오른쪽→왼쪽 열)로 아주 옅게 깔고 아주 느리게 위로 흐름.
   마우스를 1초 넘게 멈추면 반경 150px 안의 글자만 등잔불처럼 서서히 밝아짐 (같은 글씨 층을 하나 더 겹쳐 그 둘레만 보이게) */
function bgTypeHTML(){
  const titles=Object.values(ART).map(a=>a.hanja);                 // data.js의 실제 기사 제목만
  const cols=Math.ceil((innerWidth||1920)/30)+2,need=Math.ceil((innerHeight||1080)/19)*2+20;
  const col=i=>{let t='',k=i*3;while([...t].length<need){t+=titles[k%titles.length]+'　';k+=5}return t};
  const spec=Array.from({length:cols},(_,i)=>({t:col(i),d:(95+((i*37)%60)),o:-((i*53)%95)}));
  const layer=cls=>`<div class="bg-type ${cls}" aria-hidden="true">${spec.map(c=>`<div class="bg-col" style="animation-duration:${c.d}s;animation-delay:${c.o}s"><span>${esc(c.t)}</span><span>${esc(c.t)}</span></div>`).join('')}</div>`;
  return layer('base')+layer('lit');
}
let bgStill=0;
function wireBgType(){const st=$('#bdStage'),lit=st&&st.querySelector('.bg-type.lit');if(!lit)return;
  st.addEventListener('pointermove',e=>{lit.style.setProperty('--mx',e.clientX+'px');lit.style.setProperty('--my',e.clientY+'px');lit.classList.remove('glow');
    clearTimeout(bgStill);bgStill=setTimeout(()=>lit.classList.add('glow'),1000)},{passive:true});
  st.addEventListener('pointerleave',()=>{clearTimeout(bgStill);lit.classList.remove('glow')});
}
/* 가끔 일어나는 기괴한 순간 (30~45초에 한 번, 하나만): 헤드라인 한 글자가 0.3초 뒤틀림 / 檢閱 도장에서 잉크 한 줄기가 흘러내림
   人物面(실존 인물 사진)에는 적용하지 않음 */
let oddT=0;
function scheduleOdd(){clearTimeout(oddT);if(reduce)return;oddT=setTimeout(()=>{
  if(view==='front'&&!document.hidden&&!navBusy&&!Blood.busy){
    const stamp=views.front.querySelector('.censor');
    if(stamp&&Math.random()<.4){const d=document.createElement('i');d.className='stamp-drip';d.style.left=(20+Math.random()*50)+'%';stamp.appendChild(d);setTimeout(()=>d.remove(),4200)}
    else{const cs=$$('.fp-society .hero-hd .zc,.fp-culture .hero-hd .zc,.fp-fraud .hero-hd .zc',views.front);const c=pick(cs);if(c){c.classList.remove('twist');void c.offsetWidth;c.classList.add('twist');setTimeout(()=>c.classList.remove('twist'),320)}}
  }
  scheduleOdd()},30000+Math.random()*15000)}
scheduleOdd();
/* 암전 바꿔치기: 30~60초에 한 번, 지면 전체가 0.2초 촛불 꺼지듯 어두워졌다 밝아지고 그 사이 사진 하나가 바뀜 (다음 암전 때 원래대로)
   data.js swaps의 두 파일이 모두 있을 때만 바꿈. 인물면·당시 지면 실제 사진에는 쓰지 않음 */
const swapOK={};
(DATA.swaps||[]).forEach(sw=>{let n=0;[sw.base,sw.alt].forEach(f=>{const im=new Image();im.onload=()=>{if(++n===2)swapOK[sw.face]=sw};im.src='assets/illust/'+f})});
let darkT=0;
function scheduleDark(){clearTimeout(darkT);if(reduce)return;darkT=setTimeout(async()=>{
  const dk=views.front.querySelector('.bd-dark');
  if(view==='front'&&dk&&!document.hidden&&!navBusy&&!Blood.busy){
    dk.classList.remove('on');void dk.offsetWidth;dk.classList.add('on');
    setTimeout(()=>{const ok=Object.values(swapOK);if(!ok.length)return;const sw=pick(ok);
      const img=views.front.querySelector(`.fp-${sw.face} .hero .ill-in img`);if(!img)return;
      const cur=img.getAttribute('src')||'';img.setAttribute('src','assets/illust/'+(cur.endsWith(sw.alt)?sw.base:sw.alt))},90);
    setTimeout(()=>dk.classList.remove('on'),260)}
  scheduleDark()},30000+Math.random()*30000)}
scheduleDark();
/* 먹 손자국: 마우스가 10초 넘게 멈추면 지면 가장자리 여백 한 군데에 15%로 서서히 떠오르고, 움직이면 2초에 걸쳐 사라짐 */
const HAND_SPOTS=[{s:'left',css:'left:-44px;top:36%;transform:rotate(78deg)'},{s:'left',css:'left:22%;bottom:-58px;transform:rotate(-8deg)'},{s:'right',css:'left:44%;bottom:-60px;transform:rotate(12deg) scaleX(-1)'}];
let handT=0;
function wireHand(){clearTimeout(handT);if(reduce)return;const arm=()=>{clearTimeout(handT);handT=setTimeout(()=>{if(view!=='front'||document.hidden)return;
    const sp=pick(HAND_SPOTS),el=views.front.querySelector(`.sheet.${sp.s} .hand`);if(!el)return;el.style.cssText=sp.css;el.classList.add('show')},10000)};
  const hide=()=>{$$('.hand.show',views.front).forEach(h=>h.classList.remove('show'));arm()};
  views.front.onpointermove=hide;arm()}
/* 오래된 종이의 작은 갈색 반점(얼룩)과 가장자리가 타 들어간 느낌 — 한 번 그려서 배경으로 */
let foxURL='';
function paintFoxing(){const els=$$('.bd-fox',views.front);if(!els.length)return;
  if(!foxURL){const W=640,H=720,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
    // 가장자리·모서리로 갈수록 누렇게, 갈색으로 탐
    const g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.32,W/2,H/2,Math.hypot(W,H)*.56);g.addColorStop(0,'rgba(120,80,25,0)');g.addColorStop(.72,'rgba(125,82,28,.16)');g.addColorStop(1,'rgba(95,55,18,.55)');x.fillStyle=g;x.fillRect(0,0,W,H);
    [[0,0],[W,0],[0,H],[W,H]].forEach(([cx,cy])=>{const r=x.createRadialGradient(cx,cy,0,cx,cy,170+Math.random()*80);r.addColorStop(0,'rgba(80,45,12,.5)');r.addColorStop(1,'rgba(80,45,12,0)');x.fillStyle=r;x.fillRect(0,0,W,H)});
    // 얼룩덜룩한 큰 얼룩
    for(let i=0;i<26;i++){const cx=Math.random()*W,cy=Math.random()*H,rr=40+Math.random()*150,r=x.createRadialGradient(cx,cy,0,cx,cy,rr);r.addColorStop(0,`rgba(130,95,40,${(.04+Math.random()*.08).toFixed(3)})`);r.addColorStop(1,'rgba(130,95,40,0)');x.fillStyle=r;x.fillRect(cx-rr,cy-rr,rr*2,rr*2)}
    // 작은 갈색 반점
    for(let i=0;i<260;i++){const cx=Math.random()*W,cy=Math.random()*H,rr=Math.random()<.85?.6+Math.random()*1.8:2.5+Math.random()*4;x.fillStyle=`rgba(${95+Math.random()*40|0},${55+Math.random()*25|0},20,${(.12+Math.random()*.35).toFixed(3)})`;x.beginPath();x.ellipse(cx,cy,rr,rr*(.6+Math.random()*.5),Math.random()*3,0,6.3);x.fill()}
    foxURL=c.toDataURL('image/png')}
  els.forEach((el,i)=>{el.style.backgroundImage=`url(${foxURL})`;if(i)el.style.transform='scaleX(-1)'})}
/* 판을 화면에 맞춰 통째로 줄였다 늘림. 세로로 긴 화면에서는 위아래로 쌓음 */
function fitBoard(){if(view!=='front')return;const sc=$('#bdScale'),sh=$('#bdShadow');if(!sc)return;
  const W=innerWidth||1280,H=innerHeight||720,stack=W<900||W/H<1.15;
  views.front.classList.toggle('stack',stack);
  if(stack){sc.style.width=sc.style.height='';sh.style.transform='';tearEdges();return}
  const pad=Math.max(10,Math.min(W,H)*.016),foot=40,s=Math.min((W-pad*2)/1280,(H-pad-foot)/720);   // 아래에는 꼬리표 버튼 자리
  sc.style.width=1280*s+'px';sc.style.height=720*s+'px';sh.style.transform=`scale(${s})`;tearEdges()}
addEventListener('resize',fitBoard);
/* 찢긴 종이 가장자리: 간격과 깊이를 불규칙하게 */
function tearEdges(){const el=$('#fpSheet');if(!el)return;const W=el.offsetWidth,H=el.offsetHeight;if(!W||!H)return;
  const dep=()=>Math.random()<.12?4+Math.random()*7:Math.random()*3.2,st=()=>6+Math.random()*16,pts=[];
  for(let x=0;x<W;x+=st())pts.push(`${x.toFixed(1)}px ${dep().toFixed(1)}px`);
  for(let y=0;y<H;y+=st())pts.push(`${(W-dep()).toFixed(1)}px ${y.toFixed(1)}px`);
  for(let x=W;x>0;x-=st())pts.push(`${x.toFixed(1)}px ${(H-dep()).toFixed(1)}px`);
  for(let y=H;y>0;y-=st())pts.push(`${dep().toFixed(1)}px ${y.toFixed(1)}px`);
  el.style.clipPath=`polygon(${pts.join(',')})`}
function wireFront(){
  // 인물 사진이 없으면 빈 타원 틀만 (글자 없이)
  $$('.pc-ph img',views.front).forEach(img=>{const miss=()=>{img.parentElement.classList.add('empty');img.remove()};
    if(img.complete&&img.naturalWidth===0)miss();else img.addEventListener('error',miss,{once:true})});
  $$('.fp-face,.bd-ap',views.front).forEach(el=>{
    el.addEventListener('click',e=>{if(e.target.closest('[data-art]'))return;e.preventDefault();onFaceClick(el.dataset.face,el)});
    el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===el){e.preventDefault();onFaceClick(el.dataset.face,el)}});
  });
  $$('[data-art]',views.front).forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(b.classList.contains('pcard'))personClick(b,e);else goArticle(b.dataset.art,b)}));
  wireFrontFx();   // 사진 위 흔적 연출
}
/* =========================================================
   메인 사진 위 흔적 연출 — '화면 효과'가 아니라 종이와 잉크처럼
   (사진 자체는 절대 바꾸지 않고, 위에 먹·연필·붓·필름 입자만 얹음. 종이 전체는 움직이지 않음)
   1) 사회: 사진 가장자리에서 종이 쪽으로 불규칙하게 스며드는 먹 얼룩 + 위아래 붉은 연필 줄 + 손글씨 '오보'
   2) 사기: 지면 가장자리에서 사진 쪽으로 어두워지는 비네팅(사진 밝기는 그대로) + 캡션 끝 '희생자 ○○名'
   3) 문화예술: 선수 가슴 위로 끝이 갈라진 마른 붓 자국 (종이색, 군데군데 비침)
   4) 인물: 사진을 누르면 사진 위에 필름 입자가 잠깐 끓고 그 인물 페이지로 (윤심덕은 연출 없이 바로)
   켜질 때 0.6~1초 ease-out, 마우스를 떼면 0.4초 안에 원래대로 / 마우스 없는 화면은 탭으로 켜고 끄기
   움직임 줄이기: 움직임 없이 최종 상태만. 숫자·시간·위치는 data.js frontFx
   ========================================================= */
const FX=DATA.frontFx||{};
const noHover=()=>matchMedia('(hover:none)').matches;
const SVGNS='http://www.w3.org/2000/svg';
const OFF_MS=350;   // 마우스를 떼면 원래대로 돌아가는 시간
/* 사진 칸(.hero .fig)의 위치를 #fpSheet(1280×720 판) 기준 좌표로 */
function sheetRect(el){const sh=$('#fpSheet'),a=el.getBoundingClientRect(),b=sh.getBoundingClientRect(),k=(b.width/sh.offsetWidth)||1;
  return {x:(a.left-b.left)/k,y:(a.top-b.top)/k,w:a.width/k,h:a.height/k}}
/* 구멍 뚫린 덮개: 판 위 (x,y,w,h) 자리만 비워 두고 나머지를 덮음 (사진은 그대로 보임) */
function holeMask(el,box,hole){const s=el.style,mx=`${hole.w}px ${hole.h}px`,mp=`0 0,${hole.x-box.x}px ${hole.y-box.y}px`;
  s.left=box.x+'px';s.top=box.y+'px';s.width=box.w+'px';s.height=box.h+'px';
  s.webkitMaskSize=s.maskSize=`100% 100%,${mx}`;s.webkitMaskPosition=s.maskPosition=mp}
function fxLayer(cls){const sh=$('#fpSheet');let el=sh.querySelector('.'+cls);if(!el){el=document.createElement('span');el.className='fx-layer '+cls;el.setAttribute('aria-hidden','true');sh.appendChild(el)}return el}
const rnd=(a,b)=>a+Math.random()*(b-a);
/* 손으로 그은 듯 살짝 흔들리는 선 */
function wobble(x1,y,x2,amp,seg=9){let d=`M${x1.toFixed(1)} ${(y+(Math.random()-.5)*amp).toFixed(1)}`;
  for(let i=1;i<=seg;i++){const x=x1+(x2-x1)*i/seg;d+=` L${x.toFixed(1)} ${(y+(Math.random()-.5)*amp).toFixed(1)}`}return d}
function svgOn(fig,cls){fig.querySelectorAll('svg.'+cls).forEach(o=>o.remove());const s=document.createElementNS(SVGNS,'svg');s.setAttribute('class','fx-svg '+cls);s.setAttribute('aria-hidden','true');fig.appendChild(s);
  const w=fig.clientWidth,h=fig.clientHeight;s.setAttribute('viewBox',`0 0 ${w} ${h}`);return {s,w,h}}
/* 선 하나: 처음엔 길이만큼 숨겨 두고(transition 없이) → startDraw에서 0으로 → 정해진 시간 동안 그어짐 */
function drawPath(par,d,cls,sec,delay=0){const p=document.createElementNS(SVGNS,'path');p.setAttribute('d',d);p.setAttribute('class',cls);p.style.transitionProperty='none';par.appendChild(p);
  const L=Math.ceil(p.getTotalLength()+2);p.style.strokeDasharray=L+'px';p.style.strokeDashoffset=(reduce?0:L)+'px';
  p.style.transitionDuration=sec+'s';p.style.transitionDelay=delay+'s';return p}
function startDraw(ps){if(reduce)return;ps.forEach(p=>{getComputedStyle(p).strokeDashoffset;p.style.transitionProperty='stroke-dashoffset'});
  setTimeout(()=>ps.forEach(p=>{p.style.strokeDashoffset='0px'}),30)}
function fadeRemove(el){if(!el)return;el.classList.add('off');setTimeout(()=>{if(el.classList.contains('off'))el.remove()},reduce?0:OFF_MS)}
const fxT={};   // 면별 타이머
function fxClear(id){(fxT[id]||[]).forEach(clearTimeout);fxT[id]=[]}
const fxLater=(id,s,fn)=>{(fxT[id]=fxT[id]||[]).push(setTimeout(fn,reduce?0:s*1000))};
/* ---------- 1) 사회 ---------- */
function socialOn(hero){const C=FX.society||{},fig=hero.querySelector('.fig');if(!fig)return;
  // 먹 얼룩: 사진보다 조금 큰 먹 판을 index.html #inkstain 필터로 울퉁불퉁하게 → 사진 자리는 구멍으로 비움
  // (먹 얼룩은 피처럼 보여서 뺌 — 붉은 연필과 '오보'만)
  const {s,w,h}=svgOn(fig,'fx-pencil'),sec=C.pencilSec||.9;
  startDraw([h*(C.lineTop||.07),h*(C.lineBottom||.82)].map((y,i)=>drawPath(s,wobble(w*.05,y,w*.95,3.2),'pencil',sec-i*.1,i*.1)));
  let word=fig.querySelector('.fx-word');if(!word){word=document.createElement('span');word.className='fx-word';word.setAttribute('aria-hidden','true');fig.appendChild(word)}
  word.textContent=C.word||'오보';word.classList.remove('on');fxLater('society',C.wordDelay??.45,()=>word.classList.add('on'))}
function socialOff(hero){const fig=hero.querySelector('.fig');$('#fpSheet .fx-halo')?.classList.remove('on');
  if(fig){fadeRemove(fig.querySelector('svg.fx-pencil'));fig.querySelector('.fx-word')?.classList.remove('on')}}
/* ---------- 2) 사기 ---------- */
function fraudOn(hero){const C=FX.fraud||{},fig=hero.querySelector('.fig');if(!fig)return;
  // 비네팅: 사진 한가운데는 그대로, 지면 가장자리로 갈수록 최대 0.45까지 어두워짐. 사진 자리는 구멍으로 비움
  const sh=$('#fpSheet'),r=sheetRect(fig),dk=fxLayer('fx-vignette'),cx=r.x+r.w/2,cy=r.y+r.h/2,mx=C.darkMax??.45;
  holeMask(dk,{x:0,y:0,w:sh.offsetWidth,h:sh.offsetHeight},r);
  dk.style.background=`radial-gradient(ellipse farthest-corner at ${cx}px ${cy}px,rgba(38,24,9,0) 0,rgba(38,24,9,0) 22%,rgba(38,24,9,${(mx*.55).toFixed(3)}) 58%,rgba(38,24,9,${mx}) 100%)`;
  dk.style.setProperty('--on',(C.darkSec||1)+'s');dk.classList.add('on');
  const cap=hero.querySelector('.hero-cap');if(!cap)return;
  let v=cap.querySelector('.fx-count');if(!v){v=document.createElement('span');v.className='fx-count';cap.appendChild(v)}
  const N=C.numbers||[],put=n=>{v.innerHTML=`${esc(C.prefix||'희생자')} <b>${esc(n)}</b>${esc(C.suffix||'名')}`;v.setAttribute('aria-label',`${C.prefix||'희생자'} ${n}${C.suffix||'名'}`)};
  v.hidden=false;if(reduce){put(N[N.length-1]||'');return}
  N.forEach((n,i)=>fxLater('fraud',i*(C.stepSec||.25),()=>put(n)))}
function fraudOff(hero){$('#fpSheet .fx-vignette')?.classList.remove('on');const v=hero.querySelector('.fx-count');if(v)v.hidden=true}
/* ---------- 3) 문화예술: 마른 붓 ---------- */
function cultureOn(hero){const st=hero.querySelector('.censor');if(st){st.classList.remove('thump');void st.offsetWidth;st.classList.add('thump')}return;
  const C=FX.culture||{},fig=hero.querySelector('.fig');if(!fig)return;
  const {s,w,h}=svgOn(fig,'fx-brush'),y=h*(C.brushY??.52),x1=w*(C.brushX1??.08),x2=w*(C.brushX2??.5),band=C.brushWidth||26,sec=C.brushSec||.8;
  const g=document.createElementNS(SVGNS,'g');g.setAttribute('class','bristles');g.style.setProperty('--paper',C.color||'#e6dcc6');s.appendChild(g);
  const ps=[];
  // 붓 몸통: 가운데 넓은 획 (끝 30px 앞에서 멈춰 끝부분은 털만 남음)
  const body=drawPath(g,wobble(x1+4,y,x2-30,2.5,6),'stroke',sec*.9);body.style.strokeWidth=band*.62;body.style.opacity=.9;ps.push(body);
  // 붓털: 위아래로 흩어진 가는 획들, 끝나는 자리가 제각각 → 끝이 갈라짐. 투명도 0.85~0.95
  const N=C.bristles||13;
  for(let k=0;k<N;k++){const off=(k/(N-1)-.5)*band*.92+rnd(-1.2,1.2),end=x2-(Math.random()<.35?rnd(14,40):rnd(0,10));
    const p=drawPath(g,wobble(x1+rnd(0,6),y+off,end,1.6,7),'stroke',sec*rnd(.82,.95),rnd(0,sec*.05));
    p.style.strokeWidth=rnd(1.6,4.4).toFixed(2);p.style.opacity=rnd(.85,.95).toFixed(2);ps.push(p)}
  startDraw(ps)}
function cultureOff(hero){fadeRemove(hero.querySelector('svg.fx-brush'))}
const HERO_FX={society:[socialOn,socialOff],fraud:[fraudOn,fraudOff],culture:[cultureOn,cultureOff]};
function heroFx(id,hero,on){if(!!hero._fx===on)return;hero._fx=on;hero.classList.toggle('fx-on',on);fxClear(id);HERO_FX[id][on?0:1](hero)}
/* ---------- 4) 인물: 사진 위 필름 입자 ---------- */
let grainBusy=false;
function personClick(b,e){const C=FX.people||{},pid=b.dataset.art.replace(/^p-/,'');
  if(reduce||(C.skip||[]).includes(pid)){goArticle(b.dataset.art,b);return}   // 움직임 줄이기 · 윤심덕: 연출 없이 바로
  if(grainBusy)return;grainBusy=true;const ph=b.querySelector('.pc-ph'),sec=C.grainSec||1;
  if(ph){const g=document.createElement('span');g.className='fx-grain';g.setAttribute('aria-hidden','true');g.style.animationDuration=`${sec}s, .12s`;ph.appendChild(g)}
  setTimeout(()=>{grainBusy=false;goArticle(b.dataset.art,b)},sec*1000)}
function wireFrontFx(){
  ['society','fraud','culture'].forEach(id=>{const hero=views.front.querySelector(`.fp-${id} .hero`);if(!hero)return;hero._fx=false;
    hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')if(!noHover())heroFx(id,hero,true)});
    hero.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')if(!noHover())heroFx(id,hero,false)});
    // 마우스 없는 화면: 사진을 탭하면 켜고/끄기 (면 이동은 면 제목·'○○면 보기'를 눌러서)
    hero.addEventListener('click',e=>{if(!noHover())return;e.preventDefault();e.stopPropagation();heroFx(id,hero,!hero._fx)})});
}

function cacheMemos(){}function memoTick(){}   // 검열 메모 연출은 다음 단계에서
/* 면 클릭 → 종이가 검게 젖어듦 → 그 면의 첫 사건 (부록은 부드럽게) */
async function onFaceClick(id,el){
  if(navBusy||Blood.busy)return;
  if(id==='appendix'){go({v:'appendix'},'fade');return}
  const t=el.querySelector('.lc-big').getBoundingClientRect();
  const st=faceTarget(id);go(st,st.v==='detail'?'paper':'blood',{x:t.left+t.width/2,y:t.top+t.height/2,r:Math.min(80,Math.max(t.width,t.height)*.5)});   // 상세로 갈 때는 종이색 전환
}
/* =========================================================
   고쳐 쓰이는 신문 (2026-10-01 개편)
   액체·번쩍임 같은 '화면 효과'는 쓰지 않음. 인쇄물이 할 수 있는 일만 함.
   1) 안 보는 사이 바뀐다: 15~25초마다 지면이 촛불처럼 0.26초 어두워지고(.bd-dark), 그 사이 한 군데 글이 조용히 바뀜.
      바뀌는 내용은 모두 실제 기록에 근거 (사기: 本紙에 실린 희생자 수 380·300·346·309 / 사회: 本紙가 지목한 '박씨 일가').
      마우스가 올라가 있는 칸은 건드리지 않음 → 눈을 뗀 곳만 바뀜
   2) 들여다보기: 사진에 마우스를 올리면 1.2초에 걸쳐 커서 쪽으로 돋보기처럼 다가가고(망점이 보임),
      그 사이 인쇄판이 살짝 어긋났다가(두 겹) 맞춰짐
   움직임 줄이기면 1)의 글만 바뀌고 어두워짐·움직임은 없음. 인물면 사진에는 쓰지 않음
   ========================================================= */
const REWRITE=[
  {face:'fraud',  apply(h){const cap=h.querySelector('.hero-cap');if(!cap)return;let v=cap.querySelector('.fx-silent');
      if(!v){v=document.createElement('span');v.className='fx-silent';cap.appendChild(v);v._i=-1}
      const N=['三百八十','三百','三百四十六','三百九'];v._i=(v._i+1)%N.length;v.innerHTML=` · 희생자 <b>${N[v._i]}</b>名`}},
  {face:'society',apply(h){const sub=h.querySelector('.hp-sub');if(!sub)return;if(!sub._orig)sub._orig=sub.innerHTML;
      sub.innerHTML=sub._alt?sub._orig:'매립지의 새벽,<br>신문은 <span class="fx-mark">박씨 일가</span>를 지목했다';sub._alt=!sub._alt}},
  {face:'culture',apply(h){const st=h.querySelector('.censor');if(st){st.classList.toggle('moved')}}}
];
let rwI=0;
function rewriteOnce(){const fs=views.front;if(!fs)return;
  for(let k=0;k<REWRITE.length;k++){const r=REWRITE[(rwI+k)%REWRITE.length],h=fs.querySelector(`.fp-${r.face} .hero`);
    if(h&&!h._fx){rwI=(rwI+k+1)%REWRITE.length;const dk=fs.querySelector('.bd-dark');
      if(dk&&!reduce){dk.classList.remove('on');void dk.offsetWidth;dk.classList.add('on');setTimeout(()=>r.apply(h),120);setTimeout(()=>dk.classList.remove('on'),300)}
      else r.apply(h);return}}}
function wireLoupe(){if(reduce)return;['society','fraud','culture'].forEach(id=>{const hero=views.front.querySelector(`.fp-${id} .hero`),fig=hero&&hero.querySelector('.fig');if(!fig)return;
  const img=fig.querySelector('.ill-in img');if(!img)return;
  if(!fig.querySelector('.plate2')){const c=img.cloneNode();c.className='plate2';c.alt='';c.setAttribute('aria-hidden','true');img.parentElement.appendChild(c)}
  hero.addEventListener('pointermove',e=>{const r=fig.getBoundingClientRect();fig.style.setProperty('--ox',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');fig.style.setProperty('--oy',((e.clientY-r.top)/r.height*100).toFixed(1)+'%')})})}
function startFrontFx(){clearTimeout(frontFxT);wireLoupe();
  const tick=()=>{frontFxT=setTimeout(()=>{if(view==='front'&&!document.hidden&&!navBusy&&!Blood.busy)rewriteOnce();tick()},rnd(15000,25000))};
  frontFxT=setTimeout(()=>{if(view==='front')rewriteOnce();tick()},8000)}
window.__rewrite=rewriteOnce;   // 확인용: 콘솔에서 __rewrite() 로 바로 한 번 바꿔 볼 수 있음
function stopFrontFx(){clearTimeout(frontFxT);visFaces.clear();faceIO.disconnect()}
/* 가끔 0.08초 동안 실제 옛 지면이 스침 — 메인은 이번 단계에서 쉼 */
const flashEl=$('#scanFlash');let flashT=0;
(DATA.flash||[]).forEach(s=>{new Image().src=`assets/scans/${s}.jpg`});
function scheduleFlash(){clearTimeout(flashT);if(reduce)return;flashT=setTimeout(()=>{
  if(!opOn&&!document.hidden&&(view==='detail'||view==='list')&&$('#panel').hidden&&$('#menu').hidden&&!Blood.busy){
    flashEl.style.backgroundImage=`url('assets/scans/${pick(DATA.flash)}.jpg')`;flashEl.classList.add('on');setTimeout(()=>flashEl.classList.remove('on'),80)}
  scheduleFlash()},20000+Math.random()*20000)}
scheduleFlash();

/* =========================================================
   사건 상세 (공용 틀)
   ========================================================= */
const RADIO_SVG=`<svg class="rd-set" viewBox="0 0 140 120" aria-hidden="true"><defs><linearGradient id="rdW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b4424"/><stop offset="1" stop-color="#2a170a"/></linearGradient></defs>
  <path d="M14 112 V40 Q14 8 70 8 Q126 8 126 40 V112 Z" fill="url(#rdW)" stroke="#120a04" stroke-width="2"/>
  <path d="M28 70 V44 Q28 22 70 22 Q112 22 112 44 V70 Z" fill="#c9b27a" opacity=".9"/><g stroke="#5a4020" stroke-width="1.4">${Array.from({length:9},(_,i)=>`<path d="M${36+i*8.5} 28 V68"/>`).join('')}</g>
  <rect x="30" y="80" width="80" height="12" rx="2" fill="#e8d9ad"/><g stroke="#3a2a14" stroke-width=".8">${Array.from({length:12},(_,i)=>`<path d="M${34+i*6.5} 82 v${i%3?4:7}"/>`).join('')}</g><path d="M62 80 v12" stroke="#a3261b" stroke-width="1.6"/>
  <circle cx="42" cy="102" r="6" fill="#1a0f06" stroke="#8a6a36"/><circle cx="98" cy="102" r="6" fill="#1a0f06" stroke="#8a6a36"/></svg>`;
function heroHTML(a,o={}){const h=a.hero||{};return h.illust?illHTML(h.illust,o):h.crop?cropHTML(h.crop,o):''}
function renderDetail(id){
  const a=ART[id],f=faceOf(a.face);
  const fulls=f.articles.filter(x=>ART[x].status==='ready'),i=fulls.indexOf(id);
  const fi=FACE_ORDER.indexOf(f.id);
  const nextFace=FACE_ORDER[fi+1],prevFace=FACE_ORDER[fi-1];
  const prevId=fulls[i-1]||(prevFace&&[...faceOf(prevFace).articles].reverse().find(x=>ART[x].status==='ready'))||null;
  const nextId=fulls[i+1]||(nextFace&&firstFull(nextFace))||null;
  const prevLabel=fulls[i-1]?L('prev'):L('prevFace'),nextLabel=fulls[i+1]?L('next'):L('nextFace');
  const card=(xid,label,dir)=>{if(!xid){if(dir==='next'&&nextFace)return `<button class="dn-card next" data-listface="${nextFace}"><span><small>${nextLabel}</small><b>${hj(faceOf(nextFace).hanja+'面 紙面',faceOf(nextFace).ko+'면 지면')}</b><span>${esc(faceOf(nextFace).keywords.map(k=>k[1]).join(' · '))}</span></span><i class="th" style="display:flex;align-items:center;justify-content:center;font-style:normal;font-size:30px;font-weight:900">${faceOf(nextFace).hanja}</i><i class="arr">→</i></button>`;
      return `<div class="dn-card ${dir}" aria-hidden="true"></div>`}
    const x=ART[xid];const th=`<i class="th">${heroHTML(x,{cap:false})}</i>`,body=`<span><small>${label} · ${hj(yr(yearOf(x.date))+'年',yearOf(x.date)+'년')}</small><b>${hj(x.hanja,x.ko)}</b><span>${esc(x.desc)}</span></span>`;
    return dir==='prev'?`<button class="dn-card prev" data-art="${xid}"><i class="arr">←</i>${th}${body}</button>`:`<button class="dn-card next" data-art="${xid}">${body}${th}<i class="arr">→</i></button>`};
  const inf=a.info||{};
  views.detail.innerHTML=`<div class="dt-wrap">
   <section class="dt-hero" aria-label="사건 기본 정보">
     <div>
       <p class="dt-meta"><span>${hj(hanjaDate(a.date),koDate(a.date))}</span><span>${L('city')}</span><span>${hj(f.hanja+'面',f.ko+'면')}</span></p>
       <h1 class="dt-title">${titleHTML(id)}</h1>
       <p class="dt-headline">${esc(a.headline||'')}<span class="dt-grade" title="신빙성 등급">신빙성 ${esc(a.grade)}</span></p>
       <ul class="dt-sum">${(a.summary||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>
     </div>
     <div style="position:relative">
       <figure class="dt-photo">${heroHTML(a)}</figure>
       ${a.extra?`<button class="dt-extra" id="xCard" aria-label="號外 속보 카드 열기 — 이 기사에는 알려지지 않은 뒷이야기가 있습니다"><span class="xh"><b>號外</b><small>${fmtDate(a.date)}<br>京城夜錄</small></span><p>${L('extraCard')}</p><span class="go">${L('extraGo')}</span></button>`:''}
     </div>
   </section>
   <section class="dt-sec" aria-label="원문과 현대어">
     <p class="dt-lbl">${L('origMod')}</p>
     <div class="dt-main">
       <div class="dt-slider" id="slider">
         <div class="sl-img"><div class="frame"><img id="slImg" alt=""></div><div class="sl-cap"><button id="slPrev" aria-label="이전 원문 지면">‹</button><b id="slNo"></b><button id="slNext" aria-label="다음 원문 지면">›</button><span id="slCap"></span><button id="slZoom">크게 보기</button></div></div>
         <div class="sl-tag">${L('origTag')}<small>당시 신문 이미지</small></div>
         <div class="sl-text"><div class="sl-tabs" role="tablist"><button role="tab" id="tabM" aria-selected="true" data-tab="modern">${L('tabModern')}</button><button role="tab" id="tabT" aria-selected="false" data-tab="today">${L('tabToday')}</button></div><div class="sl-body" id="slBody" role="tabpanel" tabindex="0"></div></div>
         <div class="sl-handle"><button class="sl-knob" id="slKnob" role="slider" aria-label="원문 이미지 드러내기 (좌우 화살표)" aria-valuemin="8" aria-valuemax="92" aria-valuenow="46">‹ ›</button></div>
       </div>
       <aside class="dt-info" aria-label="사건 간단 정보">
         <section><h4>${L('overview')}</h4><p>${esc(inf.overview||'')}</p></section>
         <section><h4>${L('people')}</h4><ul>${(inf.people||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></section>
         <section><h4>${L('tags')}</h4><div class="tags">${(inf.tags||[]).map(t=>`<span>#${esc(t)}</span>`).join('')}</div></section>
         <section><h4>${L('source')}</h4><ul>${(inf.source||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></section>
         <section><h4>${L('grade')}</h4><div class="gr"><b>${esc(a.grade)}</b><small>${a.grade.startsWith('A')?'동아일보 지면 날짜까지 확인, 공신력 있는 출처로 뒷받침':a.grade.startsWith('B')?'2차 출처 중심, 원문 교차 확인 필요':'아직 검증하지 못함'}</small></div>${inf.caution?`<p class="warn">※ ${esc(inf.caution)}</p>`:''}</section>
       </aside>
     </div>
   </section>
   <section class="dt-sec" aria-label="라디오 경성">
     <div class="dt-radio">${RADIO_SVG}
       <div class="rd-copy"><h3>${L('radio')}<small>— ${L('radioSub')}</small></h3><p>${esc(a.radio?.text||'')}</p></div>
       <div class="rd-player"><button class="rd-play" id="rdPlay" aria-label="라디오 재생" disabled><svg viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z"/></svg></button>
         <div class="rd-wave" id="rdWave">${Array.from({length:48},()=>`<i style="height:${4+Math.random()*20}px"></i>`).join('')}</div>
         <div class="rd-time"><span id="rdCur">00:00</span><input type="range" id="rdSeek" min="0" max="100" value="0" disabled aria-label="재생 위치"><span id="rdDur">--:--</span></div>
         <p class="rd-status" id="rdStatus" aria-live="polite">방송 준비 중</p></div>
     </div>
   </section>
   <section class="dt-sec" aria-label="이전 · 다음 사건">
     <nav class="dt-nav">${card(prevId,prevLabel,'prev')}<button class="dn-list" id="toList"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>${L('toList')}</button>${card(nextId,nextLabel,'next')}</nav>
   </section>
  </div>`;
  const V=views.detail;
  // 대표 사진: 빛(마우스)이 닿으면 은은히, 클릭하면 크게
  const hero=V.querySelector('.dt-photo .ill,.dt-photo .scanph');hero?.addEventListener('click',()=>burst(hero));
  V.querySelector('#xCard')?.addEventListener('click',()=>openPanel('extra',{id}));
  V.querySelector('#toList').addEventListener('click',()=>go({v:'list',face:a.face,hl:id},'fade'));
  $$('.dn-card[data-art]',V).forEach(b=>b.addEventListener('click',()=>go({v:'detail',id:b.dataset.art},'fade')));
  $$('[data-listface]',V).forEach(b=>b.addEventListener('click',()=>go({v:'list',face:b.dataset.listface},'fade')));
  setupSlider(a,id);setupRadio(id);
}
/* ---------- 원문 ↔ 현대어 슬라이더 ---------- */
function setupSlider(a,id){
  const sl=$('#slider'),knob=$('#slKnob'),img=$('#slImg'),orig=a.originals||[];let oi=0,pos=46;
  const setPos=p=>{pos=clamp(p,8,92);sl.style.setProperty('--pos',pos+'%');knob.setAttribute('aria-valuenow',Math.round(pos))};
  if(isMobile())setPos(38);
  const showOrig=()=>{const o=orig[oi];if(!o){img.removeAttribute('src');$('#slCap').textContent='원문 지면 준비 중';return}
    img.src=o.src;img.alt=o.cap;$('#slCap').textContent=o.cap+(a.originalNote?' — '+a.originalNote:'');$('#slNo').textContent=`${oi+1}/${orig.length}`;
    $('#slPrev').disabled=oi===0;$('#slNext').disabled=oi>=orig.length-1};
  showOrig();$('#slPrev').onclick=()=>{oi=Math.max(0,oi-1);showOrig()};$('#slNext').onclick=()=>{oi=Math.min(orig.length-1,oi+1);showOrig()};
  $('#slZoom').onclick=()=>{const o=orig[oi];if(o)openPanel('zoom',{src:o.src,cap:o.cap})};
  let drag=false;
  knob.addEventListener('pointerdown',e=>{drag=true;knob.setPointerCapture(e.pointerId);e.preventDefault()});
  knob.addEventListener('pointermove',e=>{if(!drag)return;const r=sl.getBoundingClientRect();setPos((e.clientX-r.left)/r.width*100)});
  knob.addEventListener('pointerup',()=>{drag=false});knob.addEventListener('pointercancel',()=>{drag=false});
  knob.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){setPos(pos-5);e.preventDefault()}if(e.key==='ArrowRight'){setPos(pos+5);e.preventDefault()}if(e.key==='Home')setPos(8);if(e.key==='End')setPos(92)});
  // 탭
  let tab='modern',tr=null;
  const tabs=[$('#tabM'),$('#tabT')];
  tabs.forEach(b=>{b.onclick=()=>{tab=b.dataset.tab;tabs.forEach(x=>x.setAttribute('aria-selected',String(x===b)));draw()};
    b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const o=tabs.find(x=>x!==b);o.focus();o.click()}}});
  const body=$('#slBody');
  const F=DATA.transcriptFiles,file=tab==='modern'?F.modern:F.today;
  const empty=()=>`<div class="sl-empty"><b>원문 전사 준비 중</b><p>이 사건의 원문 전사가 아직 없습니다.<br>옛 기사 문장은 지어내지 않고 비워 둡니다.</p><p style="font-size:12px">팀원 안내: ${F.folder}${id}${tab==='modern'?F.original+' + '+id+F.modern:F.today} 파일을 넣으면 여기에 나타납니다.</p></div>`;
  function draw(){
    if(!tr){body.innerHTML='<p class="sl-empty">불러오는 중…</p>';return}
    const head=`<h3>${esc(tr.title||a.ko)}</h3><p class="dateline">${fmtDate(a.date)} · ${tab==='modern'?'현대어 풀이 (문단을 누르면 원문 → 현대어)':'오늘의 보도준칙으로 다시 쓴 기사 · 붉은 핀을 누르면 바뀐 이유'}</p>`;
    if(tab==='modern'){
      if(!tr.modern.length){body.innerHTML=empty();return}
      body.innerHTML=head+tr.modern.map((p,i)=>{const o=tr.original[i];return o?`<p class="para old" data-i="${i}" tabindex="0" role="button" aria-label="원문 문단 — 눌러서 현대어로">${esc(o)}</p>`:`<p>${esc(p)}</p>`}).join('');
      $$('.para',body).forEach(el=>{const go2=()=>{if(el.dataset.done)return;el.dataset.done=1;scramblePara(el,tr.original[+el.dataset.i],tr.modern[+el.dataset.i])};el.onclick=go2;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go2()}}});
    }else{
      if(!tr.today.length){body.innerHTML=empty();return}
      body.innerHTML=head+tr.today.map(p=>`<p>${pinify(p)}</p>`).join('');
      $$('.pin',body).forEach(b=>b.onclick=()=>{const nx=b.closest('p').nextElementSibling;if(nx&&nx.classList.contains('pin-pop')&&nx.dataset.k===b.dataset.k){nx.remove();return}
        body.querySelectorAll('.pin-pop').forEach(x=>x.remove());const d=document.createElement('dl');d.className='pin-pop';d.dataset.k=b.dataset.k;
        d.innerHTML=`<dt>1933년 표현</dt><dd>${esc(b.dataset.old)}</dd><dt>2026년 표현</dt><dd>${esc(b.dataset.now)}</dd><dt>이유</dt><dd>${esc(b.dataset.why)}</dd>`;b.closest('p').after(d)});
    }
  }
  draw();loadTranscript(a,id).then(t=>{tr=t;draw()});
}
/* [[2026년 표현|1933년 표현|이유]] → 붉은 핀 */
function pinify(p){let k=0;return esc(p).replace(/\[\[([^|\]]+)\|([^|\]]+)\|([^\]]+)\]\]/g,(_,now,old,why)=>`<mark style="background:rgba(163,38,27,.12);color:inherit">${now}</mark><button class="pin" data-k="${k++}" data-now="${now}" data-old="${old}" data-why="${why}" aria-label="바뀐 표현 보기: ${now}"><span>!</span></button>`)}
async function scramblePara(el,from,to){el.classList.remove('old');if(reduce){el.textContent=to;return}
  const n=Math.max(from.length,to.length);let cur=[...from];
  for(let i=0;i<n;i+=4){for(let j=i;j<Math.min(n,i+4);j++)cur[j]=to[j]||'';for(let j=i+4;j<Math.min(n,i+14);j++)if(Math.random()<.35&&cur[j]&&cur[j]!==' ')cur[j]=pick(POOL);el.textContent=cur.join('');await wait(16)}
  el.textContent=to}
/* 원문 전사 불러오기: data.js의 transcript 또는 assets/source/{id}_original.txt 등 */
const trCache={};
async function loadTranscript(a,id){
  if(trCache[id])return trCache[id];
  const T=a.transcript||{},F=DATA.transcriptFiles;
  const split=s=>String(s||'').replace(/\r/g,'').split(/\n\s*\n/).map(x=>x.trim().replace(/\n/g,' ')).filter(Boolean);
  const get=async suf=>{if(location.protocol==='file:')return '';try{const r=await fetch(F.folder+id+suf,{cache:'no-store'});return r.ok?await r.text():''}catch(e){return ''}};
  const [o,m,t]=await Promise.all([T.original?'' :get(F.original),T.modern?'':get(F.modern),T.today?'':get(F.today)]);
  let title='';const take=arr=>{if(arr[0]&&arr[0].startsWith('#')){title=title||arr[0].replace(/^#+\s*/,'');arr.shift()}return arr};
  const res={original:T.original||take(split(o)),modern:T.modern||take(split(m)),today:T.today||take(split(t)),title:T.title||title};
  return trCache[id]=res;
}
/* ---------- RADIO 京城 ---------- */
let radioAudio=null,radioT=0;
function setupRadio(id){
  if(radioAudio){radioAudio.pause();radioAudio=null}radioPlaying=false;clearInterval(radioT);
  const btn=$('#rdPlay'),seek=$('#rdSeek'),st=$('#rdStatus'),wave=$('#rdWave'),cur=$('#rdCur'),dur=$('#rdDur');
  const fmt=s=>isFinite(s)?`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`:'--:--';
  const au=new Audio();au.preload='metadata';
  au.addEventListener('loadedmetadata',()=>{btn.disabled=false;seek.disabled=false;dur.textContent=fmt(au.duration);st.textContent='';radioAudio=au});
  au.addEventListener('error',()=>{st.textContent='방송 준비 중'});
  au.addEventListener('timeupdate',()=>{cur.textContent=fmt(au.currentTime);if(au.duration)seek.value=au.currentTime/au.duration*100});
  const stop=()=>{radioPlaying=false;wave.classList.remove('on');clearInterval(radioT);btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z"/></svg>';btn.setAttribute('aria-label','라디오 재생');musicForView()};
  au.addEventListener('ended',stop);au.addEventListener('pause',stop);
  au.addEventListener('play',()=>{radioPlaying=true;wave.classList.add('on');btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';btn.setAttribute('aria-label','라디오 멈춤');if(ac)musicTo(MUSIC.off,.6);
    const bars=[...wave.children];clearInterval(radioT);if(!reduce)radioT=setInterval(()=>bars.forEach(b=>b.style.height=(3+Math.random()*30)+'px'),120)});
  btn.onclick=()=>{au.paused?au.play():au.pause()};
  seek.oninput=()=>{if(au.duration)au.currentTime=seek.value/100*au.duration};
  au.src=DATA.radioFolder+id+'.mp3';
}

/* =========================================================
   목록: 그 면의 옛 신문 지면 (세로쓰기)
   ========================================================= */
const book=$('#book'),bookBox=$('#bookBox');let listFace=null,turning=false;
function colsHTML(cols){return cols.map(col=>`<div class="col">${col.map(it=>{const[n,h]=it.split(':');const hh=h?+h:0;
  if(n[0]==='#')return btHTML(n.slice(1),hh);
  if(n[0]==='@')return illHTML(n.slice(1),{h:hh,tag:false});
  if(n[0]==='%')return cropHTML(n.slice(1),{h:hh});
  if(n[0]==='&'){const p=POR[n.slice(1)];if(!p)return '';return `<figure class="pfig"${hh?` style="height:${hh}px"`:''}>${ptHTML(n.slice(1))}<figcaption class="cap"><b>${esc(p.kind)}</b>${esc(p.title)}</figcaption></figure>`}
  return ''}).join('')}</div>`).join('')}
function blockHTML(b,f){
  const size=b.w?`width:${b.w}px`:'',grow=b.w?'':' grow';
  if(b.ad)return `<div class="blk adc${grow}" style="${size}"><span class="scan" data-fit="contain" data-crop="${b.ad}" role="img" aria-label="당시 신문 광고"></span></div>`;
  if(b.textAd)return `<div class="blk adc${grow}" style="${size}"><aside class="f-ad">${DATA.textAd.map((l,i)=>{const h=esc(l).replace(/\{n:(\d+)\}/g,(_,n)=>`<em class="num" data-v="${n}">${n}</em>`);return i===0?`<span class="k">${h}</span>`:i===1?`<b>${h}</b>`:`<span>${h}</span>`}).join('')}</aside></div>`;
  if(b.fill)return `<div class="blk fill${grow}" style="${size}"><div class="cols">${colsHTML(b.fill)}</div></div>`;
  const a=ART[b.a];if(!a)return '';const top=f.articles[0]===b.a;
  return `<article class="blk art${top?' top':''}${grow}" data-a="${b.a}" style="${size}">`
    +`<button class="hd" data-tr="${b.a}" style="font-size:${b.size||24}px" aria-label="${esc(a.ko)} ${a.status==='ready'?'(기사 보기)':'(속보 예정)'}">${titleHTML(b.a)}</button>`
    +`<p class="sub">${hj(hanjaDate(a.date),koDate(a.date))}</p><div class="cols">${colsHTML(b.cols||[])}</div></article>`;
}
function pageHTML(id){const f=faceOf(id),L=DATA.layout[id]||[];
  return `<section class="page pg-${id}" data-face="${id}" aria-label="${esc(f.ko)}면 지면">`
    +`<header class="pg-head"><b>${hj(f.hanja,f.ko)}</b><span>京城夜錄 · ${esc(DATA.site.edition)}</span><span>${hj(f.hanja+'面',f.ko+'면')}</span></header>`
    +`<div class="pg-body">${L.map(t=>`<div class="np-tier" style="${t.h?`height:${t.h}px`:''}">${t.blocks.map(b=>blockHTML(b,f)).join('')}</div>`).join('')}</div></section>`}
function renderList(faceId,hl){
  listFace=faceId;
  book.innerHTML=FACE_ORDER.map(pageHTML).join('');
  $$('.art',book).forEach(el=>el.querySelector('.hd').addEventListener('click',()=>onListTitle(el)));
  $$('.page .ill',book).forEach(el=>el.addEventListener('click',()=>burst(el)));
  $$('.page .pt:not(.still)',book).forEach(el=>el.addEventListener('click',()=>{if(reduce)return;el.classList.remove('bleed');void el.offsetWidth;el.classList.add('bleed');const c=el.parentElement.querySelector('.cap');if(c){c.innerHTML=chars(c.textContent);c.classList.remove('bleedtxt');void c.offsetWidth;c.classList.add('bleedtxt')}}));
  showPage(faceId);fitBook();
  $('#listBack').innerHTML=firstFull(faceId)?L('backToArt'):L('backMain');$('#nextBtn').innerHTML=L('nextPage');$('#prevBtn').innerHTML=L('prevPage');
  if(hl)setTimeout(()=>{const el=book.querySelector(`.art[data-a="${hl}"]`);if(el){el.classList.add('hl');setTimeout(()=>el.classList.remove('hl'),5200)}},450);
}
function showPage(faceId){listFace=faceId;$$('.page',book).forEach(p=>p.classList.toggle('cur',p.dataset.face===faceId));
  const i=FACE_ORDER.indexOf(faceId),f=faceOf(faceId);$('#pgInfo').innerHTML=`${hj(f.hanja+'面',f.ko+'면')} (${i+1}/${FACE_ORDER.length})`;$('#listTitle').innerHTML=`${hj(f.hanja+'面',f.ko+'면')} — ${f.articles.length}개의 기록`;
  $('#nextBtn').disabled=i>=FACE_ORDER.length-1;$('#prevBtn').disabled=i<=0;markNav({v:'list',face:faceId})}
function fitBook(){if(view!=='list')return;const s=Math.min((innerWidth-24)/660,(innerHeight-92-120)/920,1.1);const sc=Math.max(isMobile()?(innerWidth-24)/660:.45,s);
  book.style.transform=`scale(${sc})`;bookBox.style.width=660*sc+'px';bookBox.style.height=920*sc+'px'}
addEventListener('resize',fitBook);
async function turnFace(dir){if(turning||view!=='list')return;const i=FACE_ORDER.indexOf(listFace),to=FACE_ORDER[i+dir];if(!to)return;turning=true;paperRustle(.05);
  const p=book.querySelector('.page.cur');
  if(!reduce)await Promise.race([p.animate([{transform:'none',opacity:1},{transform:`perspective(2400px) rotateY(${dir>0?80:-80}deg)`,opacity:.2}],{duration:360,easing:'ease-in'}).finished.catch(()=>{}),wait(500)]);
  showPage(to);history.replaceState(null,'','#list/'+to);
  const q=book.querySelector('.page.cur');if(!reduce)q.animate([{transform:`perspective(2400px) rotateY(${dir>0?-80:80}deg)`,opacity:.2},{transform:'none',opacity:1}],{duration:400,easing:'ease-out'});
  wireMedia(q);watchTitles(q);turning=false}
$('#nextBtn').addEventListener('click',()=>turnFace(1));$('#prevBtn').addEventListener('click',()=>turnFace(-1));
document.addEventListener('keydown',e=>{if(view!=='list'||!$('#panel').hidden||!$('#menu').hidden)return;if(e.key==='ArrowLeft'){e.preventDefault();turnFace(1)}else if(e.key==='ArrowRight'){e.preventDefault();turnFace(-1)}});
let sx=0,sy=0;bookBox.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
bookBox.addEventListener('pointerup',e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>60&&Math.abs(dy)<50)turnFace(dx>0?1:-1)});   // 오른쪽으로 밀면 다음 면
$('#listBack').addEventListener('click',()=>{const id=firstFull(listFace);go(id?{v:'detail',id}:{v:'front'},'fade')});
async function onListTitle(el){const id=el.dataset.a,a=ART[id];
  if(a.status==='ready'){go({v:'detail',id},'fade');return}
  el.querySelector('.art-seal')?.remove();const s=document.createElement('span');s.className='seal art-seal';s.innerHTML=L('followup');el.appendChild(s)}

/* =========================================================
   부록 카드 목록
   ========================================================= */
function renderAppendix(){const A=DATA.appendix;
  views.appendix.innerHTML=`<div class="ap-wrap"><div class="ap-head"><b>${hj(A.hanja,A.ko)}</b><p>${hj(A.leadHanja,A.lead)}<br>실제 연관이 확인된 작품만 싣습니다. (표지 이미지는 저작권 때문에 싣지 않습니다)</p></div>
    <div class="ap-flow" aria-label="이어지는 흐름">${A.flow.map((s,i)=>`${i?'<i>↓</i>':''}<span>${esc(s)}</span>`).join('')}</div>
    <div class="ap-cards">${A.cards.map(c=>{const from=c.from==='many'?'여러 사건':ART[c.from]?.ko||'';
      const inner=`<span class="k">${esc(c.kind)}</span><b>${esc(c.title)}</b><small>${[c.by,c.year].filter(Boolean).map(esc).join(' · ')}</small><small>원작 기사: ${esc(from)}</small>
        <ol class="steps">${A.flow.map((s,i)=>`<li class="${i===0||i===c.stage?'on':''}">${esc(s)}</li>`).join('')}</ol>${c.link?'':'<span class="nolink">링크 준비 중</span>'}`;
      return c.link?`<a class="ap-card" href="${esc(c.link)}" target="_blank" rel="noopener">${inner}</a>`:`<div class="ap-card">${inner}</div>`}).join('')}</div>
    <button class="ap-back" id="apBack">‹ 메인으로</button></div>`;
  $('#apBack').onclick=()=>go({v:'front'},'fade')}

/* =========================================================
   메뉴 · 창 (기록 · 연도 · RADIO · 소개 · 검색 · 號外 · 원문 크게)
   ========================================================= */
let popReturn=null;
function openPop(el,from){closePops(true);popReturn=from||document.activeElement;el.hidden=false;if(el.id==='menu')$('#menuBtn').setAttribute('aria-expanded','true');
  (el.querySelector('input,button:not(.pop-close)')||el.querySelector('.pop-close')).focus({preventScroll:true})}
function closePops(silent){['#menu','#panel'].forEach(s=>{const el=$(s);if(!el.hidden){el.hidden=true;el.classList.remove('extra')}});$('#menuBtn').setAttribute('aria-expanded','false');
  if(!silent&&popReturn&&popReturn.focus){popReturn.focus({preventScroll:true});popReturn=null}}
$$('.sheet-pop').forEach(p=>{p.addEventListener('click',e=>{if(e.target===p||e.target.closest('[data-close]'))closePops()})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(!$('#menu').hidden||!$('#panel').hidden))closePops()});
$$('#menu [data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));
function artRow(id){const a=ART[id];return `<li><button data-art="${id}"><small>${hj(yr(yearOf(a.date))+'年',yearOf(a.date)+'년')}</small><span><b>${hj(a.hanja,a.ko)}</b><span class="d">${esc(a.desc||'')}</span></span><span class="st ${a.status}">${a.status==='ready'?L('full'):L('followup')}</span></button></li>`}
function openPanel(type,o={}){
  const P=$('#panel'),T=$('#pnTitle'),B=$('#pnBody');P.classList.remove('extra');
  if(type==='records'){T.innerHTML=L('records');B.innerHTML=DATA.faces.map(f=>`<p class="pn-face">${hj(f.hanja+'面',f.ko+'면')}</p><ul class="pn-list">${f.articles.map(artRow).join('')}</ul>`).join('')}
  else if(type==='years'){T.innerHTML=L('years')+' · 1924~1937';const by={};Object.keys(ART).forEach(id=>{const y=yearOf(ART[id].date);(by[y]=by[y]||[]).push(id)});
    let h='<div class="yr-line">';for(let y=1924;y<=1937;y++){const ids=by[y]||[];h+=`<div class="yr-row${ids.length?' has':''}"><span class="y">${y}</span>${ids.length?`<ul class="pn-list">${ids.map(id=>{const a=ART[id];return `<li><button data-art="${id}"><span><b>${esc(a.ko)}</b>${/년대/.test(a.date)?' <small>(1930년대)</small>':''}</span><span class="st ${a.status}">${a.status==='ready'?L('full'):L('followup')}</span></button></li>`}).join('')}</ul>`:'<span class="none">—</span>'}</div>`}
    B.innerHTML=h+'</div>'}
  else if(type==='radio'){T.innerHTML=L('radio');B.innerHTML=`<p class="ab">${esc(DATA.radioPage.text)}</p><ul class="pn-list">${Object.keys(ART).filter(id=>ART[id].status==='ready').map(id=>{const a=ART[id];return `<li><button data-art="${id}"><small>${fmtDate(a.date)}</small><span><b>${esc(a.radio?.title||a.ko)}</b><span class="d">${esc(a.ko)}</span></span><span class="st followup" data-radio="${id}">확인 중</span></button></li>`}).join('')}</ul>`;
    $$('[data-radio]',B).forEach(s=>{const au=new Audio();au.preload='metadata';au.onloadedmetadata=()=>{s.textContent='방송 있음';s.className='st ready'};au.onerror=()=>{s.textContent='방송 준비 중'};au.src=DATA.radioFolder+s.dataset.radio+'.mp3'})}
  else if(type==='about'){const A=DATA.about;T.innerHTML=L('about');B.innerHTML=`<div class="ab"><h3>기획 의도</h3>${A.intent.map(p=>`<p>${esc(p)}</p>`).join('')}<h3>출처 원칙</h3><ul>${A.principles.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><h3>만든 사람들</h3><dl>${A.team.map(t=>`<dt>${esc(t.role)}</dt><dd>${esc(t.name)}</dd>`).join('')}</dl></div>`}
  else if(type==='search'){T.innerHTML=L('search');B.innerHTML=`<div class="sr-box"><input id="srIn" type="search" placeholder="예: 죽첨정, 1936, 현진건 (한자로도 찾을 수 있어요)" aria-label="한글·한자·연도·인물 이름으로 검색" autocomplete="off"></div><p class="sr-hint">한글 · 한자 · 연도 · 인물 이름으로 찾을 수 있습니다.</p><ul class="pn-list" id="srOut" aria-live="polite"></ul>`;
    const inp=$('#srIn'),out=$('#srOut');const run=()=>{const q=inp.value.trim().toLowerCase().replace(/\s+/g,'');if(!q){out.innerHTML='';return}
      const hits=Object.keys(ART).filter(id=>{const a=ART[id],f=faceOf(a.face);const hay=[a.ko,a.hanja,a.date,String(yearOf(a.date)),a.desc,(a.people||[]).join(' '),f.ko,f.hanja,f.keywords.map(k=>k.join(' ')).join(' '),(a.info?.tags||[]).join(' ')].join(' ').toLowerCase().replace(/\s+/g,'');return hay.includes(q)});
      out.innerHTML=hits.length?hits.map(artRow).join(''):'<li style="padding:12px 2px;color:var(--nsoft)">찾는 기록이 없습니다.</li>'};
    inp.addEventListener('input',run)}
  else if(type==='extra'){const a=ART[o.id],x=a.extra;P.classList.add('extra');T.textContent=x.title;
    B.innerHTML=`<div class="xp"><span class="xp-seal" aria-hidden="true">號外</span>${x.body.map(p=>`<p>${esc(p)}</p>`).join('')}<p class="src">출처: ${esc(x.source)}</p></div>`}
  else if(type==='zoom'){T.textContent='원문 지면';B.innerHTML=`<div class="zoom"><img src="${esc(o.src)}" alt="${esc(o.cap)}"><p class="cap">${esc(o.cap)}</p></div>`}
  $$('[data-art]',B).forEach(b=>b.addEventListener('click',()=>{closePops(true);goArticle(b.dataset.art)}));
  openPop(P);
  if(type==='search')$('#srIn').focus();
}

/* =========================================================
   시작: 주소에 #이 있으면(기사에서 돌아오거나 새로고침) 시작 화면 없이 바로
   ========================================================= */
const first=parseHash();
if(first){mfEl.hidden=true;muted=true;render(first)}else mfShowEntry();
})();
