'use strict';
// BMW M3 GTR — ULTIMATE EDITION
// Physics from mgood7123/Ultimate-BMW-M3-GTR-Race

// ─── CANVAS (TRUE FULLSCREEN, NO DPR BUGS) ───────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d', { alpha: false });
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;
window.addEventListener('resize', () => {
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  buildSprites();
});

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg:'#06060f', blue:'#1C69D4', blue2:'#00CCFF',
  red:'#FF0033', orange:'#FF7700', gold:'#FFD700',
  white:'#F8FAFF', grey:'#888', dark:'#0a0a18',
  nos:'#00FFEE', carbon:'rgba(8,8,20,0.95)',
  cyan:'#00CCFF', magenta:'#FF00CC', lime:'#AAFF00',
  neon1:'#FF3366', neon2:'#33FFCC',
};

// ─── PROFILES (7 BMW M3 GTR TUNES) ───────────────────────────────────────────
const PROFILES = {
  STOCK:      { label:'STOCK',       topSpeed:330,  mass:1300, accel:18,  grip:2.0, driftF:0.55, nos:false, nosBoost:0,   brk:1.0, unlockLv:0,  col:'#4499FF', bodyCol:'#1C5FAA', lv1:'#4499FF', lv2:'#FFFFFF', desc:'280–330 km/h  |  Stock spec M3 GTR' },
  RACE:       { label:'RACE',        topSpeed:400,  mass:1300, accel:28,  grip:2.2, driftF:0.62, nos:true,  nosBoost:1.4, brk:1.4, unlockLv:3,  col:'#00CCFF', bodyCol:'#1144BB', lv1:'#00CCFF', lv2:'#FF0022', desc:'380–400 km/h  |  Near-infinite NOS' },
  PRO:        { label:'PRO',         topSpeed:440,  mass:700,  accel:42,  grip:2.3, driftF:0.60, nos:true,  nosBoost:1.6, brk:1.5, unlockLv:5,  col:'#FF7700', bodyCol:'#CC4400', lv1:'#FF7700', lv2:'#FFDD00', desc:'400–440 km/h  |  Half mass, huge torque' },
  ULTIMATE:   { label:'ULTIMATE',    topSpeed:470,  mass:700,  accel:55,  grip:2.3, driftF:0.58, nos:true,  nosBoost:1.7, brk:1.6, unlockLv:7,  col:'#CC00FF', bodyCol:'#8800CC', lv1:'#CC00FF', lv2:'#FF44CC', desc:'440–470 km/h  |  Refined beast' },
  JUNKMAN:    { label:'JUNKMAN',     topSpeed:548,  mass:700,  accel:75,  grip:8.2, driftF:0.52, nos:true,  nosBoost:1.8, brk:3.0, unlockLv:9,  col:'#FF0033', bodyCol:'#CC0033', lv1:'#FF0033', lv2:'#FFD700', desc:'500–548 km/h  |  Monster grip & brakes' },
  TOMAHAWK_X: { label:'TOMAHAWK X',  topSpeed:780,  mass:500,  accel:140, grip:8.2, driftF:0.48, nos:true,  nosBoost:2.0, brk:4.0, unlockLv:11, col:'#00FF99', bodyCol:'#009966', lv1:'#00FF99', lv2:'#00FFFF', desc:'660–780 km/h  |  Use 0.375× speed' },
  TOMAHAWK_X2:{ label:'TOMAHAWK X2', topSpeed:1300, mass:500,  accel:280, grip:8.2, driftF:0.44, nos:true,  nosBoost:2.5, brk:4.0, unlockLv:13, col:'#FF00FF', bodyCol:'#CC00CC', lv1:'#FF00FF', lv2:'#FFFF00', desc:'980–1300 km/h  |  USE 0.175× SPEED' },
};
const P_KEYS = ['STOCK','RACE','PRO','ULTIMATE','JUNKMAN','TOMAHAWK_X','TOMAHAWK_X2'];

// ─── TRACKS ───────────────────────────────────────────────────────────────────
const TRACKS = [
  { id:'highway',  name:'ROCKPORT HIGHWAY',  laps:2, weather:'night', surf:'tarmac', grip:1.0, skyA:'#03030a', skyB:'#0a1228', curve:0.6, hill:20, unlockLv:0,  desc:'City night highway — NFS Most Wanted' },
  { id:'sprint',   name:'BAYVIEW SPRINT',    laps:1, weather:'dusk',  surf:'tarmac', grip:1.0, skyA:'#1a0800', skyB:'#cc5500', curve:0.2, hill:5,  unlockLv:0,  desc:'Flat-out sprint, minimal corners' },
  { id:'nurburgring',name:'NÜRBURGRING',     laps:2, weather:'day',   surf:'tarmac', grip:1.0, skyA:'#0d1a3a', skyB:'#2a5080', curve:0.9, hill:70, unlockLv:2,  desc:'73 turns of pure challenge' },
  { id:'desert',   name:'DESERT STRIP',      laps:3, weather:'heat',  surf:'sand',   grip:0.5, skyA:'#1a0a00', skyB:'#cc6600', curve:0.2, hill:5,  unlockLv:3,  desc:'Flat sand — 0.5× grip' },
  { id:'mountain', name:'ALPINE PASS',       laps:2, weather:'snow',  surf:'ice',    grip:0.2, skyA:'#060e1c', skyB:'#1a2a44', curve:1.1, hill:90, unlockLv:4,  desc:'Ice and snow — brutal handling' },
  { id:'circuit',  name:'GT CIRCUIT',        laps:3, weather:'day',   surf:'tarmac', grip:1.0, skyA:'#0d1a3a', skyB:'#3a5a88', curve:0.8, hill:30, unlockLv:5,  desc:'Dedicated circuit, fast corners' },
  { id:'tokyo',    name:'TOKYO MIDNIGHT',    laps:2, weather:'rain',  surf:'wet',    grip:0.7, skyA:'#020208', skyB:'#060614', curve:0.7, hill:15, unlockLv:6,  desc:'Wet neon streets — 0.7× grip' },
];

// ─── SAVE ─────────────────────────────────────────────────────────────────────
function defSave(){ return { profile:'STOCK', xp:0, lv:1, xpNext:1000, unlockedP:['STOCK'], unlockedT:['highway','sprint'], bestTimes:{}, driftBest:{}, ach:[] }; }
let SV = (() => { try{ return JSON.parse(localStorage.getItem('bmwM3GTR2')||'null')||defSave(); }catch(e){ return defSave(); }})();
function save(){ try{ localStorage.setItem('bmwM3GTR2', JSON.stringify(SV)); }catch(e){} }
function addXP(n){
  SV.xp+=n;
  while(SV.xp>=SV.xpNext){ SV.xp-=SV.xpNext; SV.lv++; SV.xpNext=Math.floor(SV.xpNext*1.4);
    P_KEYS.forEach(k=>{ if(PROFILES[k].unlockLv===SV.lv&&!SV.unlockedP.includes(k)) SV.unlockedP.push(k); });
    TRACKS.forEach(t=>{ if(t.unlockLv===SV.lv&&!SV.unlockedT.includes(t.id)) SV.unlockedT.push(t.id); });
  } save();
}

// ─── AUDIO ────────────────────────────────────────────────────────────────────
let AC,mGain,eOsc,eGain,eFilt,nGain,sqSrc,sqGain,audioOn=false;
function initAudio(){
  if(audioOn) return; audioOn=true;
  AC=new(window.AudioContext||window.webkitAudioContext)();
  mGain=AC.createGain(); mGain.gain.value=0.7; mGain.connect(AC.destination);
  eOsc=AC.createOscillator(); eOsc.type='sawtooth'; eOsc.frequency.value=80;
  const e2=AC.createOscillator(); e2.type='square'; e2.frequency.value=40;
  eFilt=AC.createBiquadFilter(); eFilt.type='lowpass'; eFilt.frequency.value=500;
  eGain=AC.createGain(); eGain.gain.value=0.1;
  eOsc.connect(eFilt); e2.connect(eFilt); eFilt.connect(eGain); eGain.connect(mGain);
  eOsc.start(); e2.start();
  const nOsc=AC.createOscillator(); nOsc.type='sine'; nOsc.frequency.value=200;
  nGain=AC.createGain(); nGain.gain.value=0; nOsc.connect(nGain); nGain.connect(mGain); nOsc.start();
}
function setEngine(rpm,maxRPM){
  if(!audioOn)return;
  const r=Math.min(1,rpm/maxRPM);
  eOsc.frequency.setTargetAtTime(80+r*550,AC.currentTime,0.04);
  eGain.gain.setTargetAtTime(0.05+r*0.2,AC.currentTime,0.04);
  eFilt.frequency.setTargetAtTime(200+r*3500,AC.currentTime,0.04);
}
function setNOS(on){ if(!audioOn)return; nGain.gain.setTargetAtTime(on?0.12:0,AC.currentTime,0.05); }
function playClick(){ if(!audioOn)return; const o=AC.createOscillator(),g=AC.createGain(); o.type='sine';o.frequency.value=660;g.gain.setValueAtTime(0.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.07);o.connect(g);g.connect(mGain);o.start();o.stop(AC.currentTime+0.07); }
function playThud(){ if(!audioOn)return; const o=AC.createOscillator(),g=AC.createGain(); o.type='sawtooth';o.frequency.value=45;g.gain.setValueAtTime(0.4,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.18);o.connect(g);g.connect(mGain);o.start();o.stop(AC.currentTime+0.18); }
function startSqueal(){ if(!audioOn||sqSrc)return; const b=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=b.getChannelData(0); for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1); sqSrc=AC.createBufferSource(); sqSrc.buffer=b; sqSrc.loop=true; const f=AC.createBiquadFilter(); f.type='bandpass'; f.frequency.value=3800; sqGain=AC.createGain(); sqGain.gain.value=0.06; sqSrc.connect(f); f.connect(sqGain); sqGain.connect(mGain); sqSrc.start(); }
function stopSqueal(){ if(!sqSrc)return; sqGain.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.2); sqSrc.stop(AC.currentTime+0.2); sqSrc=null; }

// ─── INPUT ────────────────────────────────────────────────────────────────────
const KEY={};
window.addEventListener('keydown',e=>{KEY[e.code]=true; onKey(e.code);});
window.addEventListener('keyup',e=>KEY[e.code]=false);
canvas.addEventListener('click',e=>{ const r=canvas.getBoundingClientRect(); onTap((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H); });
canvas.addEventListener('touchstart',e=>{ e.preventDefault(); initAudio(); const t=e.changedTouches[0],r=canvas.getBoundingClientRect(); onTap((t.clientX-r.left)/r.width*W,(t.clientY-r.top)/r.height*H); },{passive:false});

let joyId=-1,joyBx=0,joyBy=0,joyDx=0,joyDy=0,nosTouch=false,driftTouch=false;
canvas.addEventListener('touchstart',e=>{ e.preventDefault(); for(const t of e.changedTouches){ const r=canvas.getBoundingClientRect(),tx=(t.clientX-r.left)/r.width*W,ty=(t.clientY-r.top)/r.height*H; if(!playing())return; if(tx<W*0.4&&ty>H*0.5){joyId=t.identifier;joyBx=tx;joyBy=ty;joyDx=0;joyDy=0;} else if(tx>W*0.65&&ty>H*0.65) nosTouch=true; else if(tx>W*0.5&&ty>H*0.5) driftTouch=true; }},{passive:false});
canvas.addEventListener('touchmove',e=>{ e.preventDefault(); for(const t of e.changedTouches){ if(t.identifier===joyId){const r=canvas.getBoundingClientRect();joyDx=clamp((t.clientX-r.left)/r.width*W-joyBx,-1,1,70);joyDy=clamp((t.clientY-r.top)/r.height*H-joyBy,-1,1,70);}  }},{passive:false});
canvas.addEventListener('touchend',e=>{ e.preventDefault(); for(const t of e.changedTouches){ if(t.identifier===joyId){joyId=-1;joyDx=0;joyDy=0;} nosTouch=false; driftTouch=false; }},{passive:false});
function clamp(v,mn,mx,d=1){return Math.max(mn,Math.min(mx,d!==1?v/d:v));}
let GP=null;
window.addEventListener('gamepadconnected',e=>GP=e.gamepad);
window.addEventListener('gamepaddisconnected',()=>GP=null);
function pollGP(){if(!GP)return; const p=navigator.getGamepads&&navigator.getGamepads(); if(p)GP=p[GP.index]||GP;}
function iThrottle(){return KEY.ArrowUp||KEY.KeyW?1:joyDy<-0.2?-joyDy:GP?(GP.buttons[7]?.value||0):0;}
function iBrake(){return KEY.ArrowDown||KEY.KeyS?1:joyDy>0.2?joyDy:GP?(GP.buttons[6]?.value||0):0;}
function iSteer(){return (KEY.ArrowLeft||KEY.KeyA?-1:0)+(KEY.ArrowRight||KEY.KeyD?1:0)+joyDx+(GP?GP.axes[0]:0);}
function iHandbrake(){return KEY.Space||driftTouch||(GP?GP.buttons[0]?.pressed:false);}
function iNOS(){return KEY.ShiftLeft||KEY.ShiftRight||nosTouch||(GP?GP.buttons[1]?.pressed:false);}

// ─── GAME STATE ───────────────────────────────────────────────────────────────
const GS={
  screen:'splash', mode:'race', profile:'STOCK', trackIdx:0,
  menuSel:0, pSel:0, tSel:0,
  t:0, dt:0, lastMs:0, frame:0,
  fade:1, quality:'HIGH',
  banner:null, bannerT:0,
};
function playing(){ return GS.screen==='game'; }
function curPF(){ return PROFILES[GS.profile]; }
function curTR(){ return TRACKS[GS.trackIdx]; }

// ─── ROAD ENGINE ──────────────────────────────────────────────────────────────
const SEG=150, ROAD_W=2400, DRAW=200, CAM_H=1050, CAM_D=0.84;
let segs=[], trackLen=0, camZ=0;

function buildTrack(tr){
  segs=[];
  const N=900;
  for(let i=0;i<N;i++){
    const t2=i/N;
    const cv=Math.sin(t2*Math.PI*7)*tr.curve+Math.cos(t2*Math.PI*3)*tr.curve*0.35;
    const hl=Math.sin(t2*Math.PI*5)*tr.hill+Math.cos(t2*Math.PI*9)*tr.hill*0.25;
    const band=Math.floor(i/8)%2;
    const isIce=tr.surf==='ice', isSnow=tr.weather==='snow';
    segs.push({
      z:i*SEG, curve:cv, hill:hl,
      road:  band?'#1c1c1c':'#252525',
      grass: band?(isIce?'#b8cce0':tr.weather==='rain'?'#0a120a':'#0a1a0a'):(isIce?'#c8d8ea':'#0d200d'),
      rumble:band?'#cc2222':'#dddddd',
      lane:  band,
      px:0,py:0,pw:0,
    });
  }
  trackLen=N*SEG;
}
buildTrack(TRACKS[0]);

function projectSegs(){
  const si=Math.floor((camZ%trackLen)/SEG)%segs.length;
  // First pass: perspective scale, screen y, road width
  for(let n=0;n<DRAW;n++){
    const s=segs[(si+n)%segs.length];
    const depth=(n+1)*SEG;
    s.sc=CAM_D/depth;
    s.py=Math.round(H/2*(1+s.sc*CAM_H));
    s.pw=s.sc*ROAD_W*(W/2);
  }
  // Second pass far→near: accumulate curve x (near segments get more offset)
  let cx=0;
  for(let n=DRAW-1;n>=0;n--){
    const s=segs[(si+n)%segs.length];
    s.px=W/2+cx-PL.x*s.sc*(W/600);
    cx+=s.curve*0.28;
  }
  return si;
}

function renderRoad(){
  const si=projectSegs();
  let maxY=H;
  // near→far: each strip from s.py (top) to maxY (bottom)
  for(let n=0;n<DRAW;n++){
    const s=segs[(si+n)%segs.length];
    const py=Math.min(H,s.py);
    if(py>=maxY||py<0) continue;
    const prev=n>0?segs[(si+n-1)%segs.length]:null;
    const px2=prev?prev.px:s.px, pw2=prev?prev.pw:s.pw*1.4;
    // Grass
    ctx.fillStyle=s.grass; ctx.fillRect(0,py,W,maxY-py);
    // Road surface
    trap(s.px-s.pw,py,s.pw*2, px2-pw2,maxY,pw2*2, s.road);
    // Rumble strips
    const rw=s.pw*0.09,nrw=pw2*0.09;
    trap(s.px-s.pw,py,rw, px2-pw2,maxY,nrw, s.rumble);
    trap(s.px+s.pw-rw,py,rw, px2+pw2-nrw,maxY,nrw, s.rumble);
    // Lane divider
    if(s.lane){const lw=s.pw*0.018,nlw=pw2*0.018;trap(s.px-lw,py,lw*2,px2-nlw,maxY,nlw*2,'rgba(255,255,255,0.9)');}
    // Barriers
    ctx.fillStyle='#999'; ctx.fillRect(s.px-s.pw-5,py,4,maxY-py);
    ctx.fillRect(s.px+s.pw+1,py,4,maxY-py);
    ctx.fillStyle=s.rumble; ctx.fillRect(s.px-s.pw-5,py,4,(maxY-py)*0.45);
    ctx.fillRect(s.px+s.pw+1,py,4,(maxY-py)*0.45);
    maxY=py;
    if(maxY<=0) break;
  }
}
function trap(x1,y1,w1,x2,y2,w2,col){
  ctx.fillStyle=col;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+w1,y1);ctx.lineTo(x2+w2,y2);ctx.lineTo(x2,y2);ctx.closePath();ctx.fill();
}

// ─── PLAYER ───────────────────────────────────────────────────────────────────
let PL={};
function resetPL(){
  PL={x:0,speed:0,vx:0,angVel:0,angle:0,gear:1,rpm:800,nosLeft:999,
      nosOn:false,drift:false,driftAng:0,driftScore:0,combo:1,comboFill:0,
      lap:0,lapT:0,bestLap:Infinity,sects:[false,false,false],
      wallHits:0,pos:1,finished:false,finTimer:0,shakeX:0,shakeY:0};
  camZ=300;
}

function updatePL(dt){
  const pf=curPF(), tr=curTR();
  const grip=tr.grip*(pf.grip/8.2)*1.1;
  const th=iThrottle(), br=iBrake(), st=Math.max(-1,Math.min(1,iSteer()));
  const hb=iHandbrake(), nosBtn=iNOS();
  const kmh=PL.speed*3.6, akmh=Math.abs(kmh);

  // NOS
  PL.nosOn = nosBtn && pf.nos && PL.nosLeft>0;
  if(PL.nosOn) PL.nosLeft=Math.max(0,PL.nosLeft-dt*60);
  setNOS(PL.nosOn);

  // Acceleration
  const nosMult=PL.nosOn?(1+pf.nosBoost):1;
  const accelF=th*pf.accel*nosMult*grip*dt;
  const brakeF=br*pf.brk*50*dt;
  const drag=0.0004*PL.speed*Math.abs(PL.speed);
  PL.speed=Math.max(-(pf.topSpeed/3.6)*0.25, Math.min(pf.topSpeed/3.6, PL.speed+accelF-brakeF*Math.sign(PL.speed||1)-drag));

  // Gears & RPM
  const spd=[0,40,90,160,230,310,420,600];
  const prevG=PL.gear;
  while(PL.gear<6&&akmh>spd[PL.gear+1])PL.gear++;
  while(PL.gear>1&&akmh<spd[PL.gear]*0.55)PL.gear--;
  if(PL.gear!==prevG)playClick();
  PL.rpm=Math.min(1,(akmh-spd[PL.gear])/Math.max(1,spd[PL.gear+1]||600-spd[PL.gear]));
  setEngine(PL.rpm*(9500-800)+800, 9500);

  // Steer
  if(Math.abs(PL.speed)>0.5){
    const ss=Math.max(0.4, 2.8-akmh*0.004);
    PL.angVel += st*ss*dt*60; PL.angVel*=Math.pow(0.03,dt); PL.angle+=PL.angVel*dt;
  }

  // Drift
  const driftCond=hb||(akmh>60&&Math.abs(st)>0.25&&Math.abs(PL.angVel)>0.3);
  if(driftCond){
    PL.drift=true;
    PL.vx+=PL.speed*Math.sin(PL.angle)*(1-grip*0.3)*dt*3;
    PL.driftAng=Math.min(85,Math.abs(PL.angVel)*30);
    const dp=PL.driftAng*akmh*0.016*dt;
    PL.driftScore+=dp*PL.combo;
    PL.comboFill=Math.min(1,PL.comboFill+dp*0.07);
    if(PL.comboFill>=1){PL.combo=Math.min(8,PL.combo+1);PL.comboFill=0;}
    spawnSmoke(W/2+PL.x*0.08, H*0.72, tr.surf==='sand'?'rgba(200,160,60,':'rgba(220,220,220,');
    startSqueal();
  } else {
    PL.drift=false; PL.driftAng*=0.9;
    PL.comboFill-=dt*0.7; if(PL.comboFill<0){PL.comboFill=0;PL.combo=1;}
    PL.vx*=Math.pow(0.05,dt*grip);
    stopSqueal();
  }

  PL.x+=PL.vx*dt;
  camZ+=PL.speed*dt;
  if(camZ<0)camZ+=trackLen;

  // Wall
  if(Math.abs(PL.x)>ROAD_W*0.52){
    PL.x=Math.sign(PL.x)*ROAD_W*0.52;
    PL.speed*=0.32; PL.vx=-PL.vx*0.3; PL.angVel*=0.25;
    PL.wallHits++; PL.shakeX=(Math.random()-0.5)*14; PL.shakeY=(Math.random()-0.5)*14;
    playThud(); spawnSmoke(W/2,H*0.7,'rgba(255,150,0,');
  }
  PL.shakeX*=0.82; PL.shakeY*=0.82;

  // Lap
  PL.lapT+=dt;
  const prog=(camZ%trackLen)/trackLen;
  if(!PL.sects[0]&&prog>0.33)PL.sects[0]=true;
  if(!PL.sects[1]&&prog>0.66)PL.sects[1]=true;
  if(prog<0.04&&PL.sects[1]){
    if(PL.lapT<PL.bestLap)PL.bestLap=PL.lapT;
    PL.lap++; PL.lapT=0; PL.sects=[false,false,false];
    if(GS.mode==='trial')saveTrial();
    if(GS.mode==='race'&&PL.lap>=curTR().laps)finishRace();
    if(GS.mode==='drift'&&PL.lap>=1&&!PL.finished)finishRace();
  }
}
function saveTrial(){const k=GS.profile+'_'+curTR().id; if(!SV.bestTimes[k]||PL.bestLap<SV.bestTimes[k]){SV.bestTimes[k]=PL.bestLap;save();}}
function finishRace(){
  if(PL.finished)return; PL.finished=true; PL.finTimer=3;
  if(GS.mode==='drift'&&(!SV.driftBest[GS.profile]||PL.driftScore>SV.driftBest[GS.profile])){SV.driftBest[GS.profile]=PL.driftScore;save();}
  addXP([0,1200,800,500,300,150,80,60][PL.pos]||60);
  setTimeout(()=>GS.screen='results',2800);
}

// ─── AI ───────────────────────────────────────────────────────────────────────
let AI=[];
function initAI(){
  AI=[];
  const n=GS.quality==='LOW'?3:7;
  for(let i=0;i<n;i++){
    const pk=P_KEYS[Math.floor(Math.random()*(P_KEYS.indexOf(GS.profile)+1))];
    AI.push({z:-(i+1)*SEG*4, x:(Math.random()-0.5)*800, speed:0, lap:0, pk});
  }
}
function updateAI(dt){
  const ptot=camZ+PL.lap*trackLen;
  AI.forEach(ai=>{
    const atot=ai.z+ai.lap*trackLen, gap=ptot-atot;
    const rub=gap>6000?1.35:gap>1000?1.1:gap<-1000?0.85:1;
    const tgt=PROFILES[ai.pk].topSpeed/3.6*rub;
    ai.speed+=(tgt-ai.speed)*dt*0.35;
    ai.x+=(-ai.x/ROAD_W)*ai.speed*dt*0.35;
    ai.z+=ai.speed*dt; if(ai.z>trackLen){ai.z-=trackLen;ai.lap++;}
  });
  const all=[{e:'pl',v:camZ+PL.lap*trackLen},...AI.map(a=>({e:a,v:a.z+a.lap*trackLen}))];
  all.sort((a,b)=>b.v-a.v);
  PL.pos=all.findIndex(a=>a.e==='pl')+1;
}

// ─── SPRITES ──────────────────────────────────────────────────────────────────
const SANG=16, SW=140, SH=70;
const sSheet=new OffscreenCanvas(SW*SANG, SH*P_KEYS.length);
const sCtx=sSheet.getContext('2d');

function buildSprites(){
  sCtx.clearRect(0,0,sSheet.width,sSheet.height);
  P_KEYS.forEach((k,pi)=>{
    for(let ai=0;ai<SANG;ai++) drawCar(sCtx,ai*SW,pi*SH,SW,SH,PROFILES[k],ai/SANG);
  });
}
function drawCar(c,ox,oy,w,h,pf,an){
  c.save(); c.translate(ox+w/2,oy+h*0.58);
  const sq=1-Math.abs(an-0.5)*0.28; c.scale(sq,1);
  const bw=w*0.47, bh=h*0.31;
  const isFront=an<0.28||an>0.72, isRear=an>0.28&&an<0.72, isSide=an>0.18&&an<0.82;
  const facing=an<0.5?1:-1;
  const L1=pf.lv1||'#00CCFF', L2=pf.lv2||'#FF0022';

  // ── GROUND GLOW ────────────────────────────────────────────────────────
  const shdw=c.createRadialGradient(0,bh*0.75,2,0,bh*0.75,bw*1.0);
  shdw.addColorStop(0,'rgba(0,0,0,0.55)'); shdw.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=shdw; c.beginPath(); c.ellipse(0,bh*0.75,bw*1.0,bh*0.22,0,0,Math.PI*2); c.fill();

  // ── WHEELS (Deep-dish dark 7-spoke like reference) ────────────────────
  const wPos=[[-bw*0.71,bh*0.10],[bw*0.71,bh*0.10],[-bw*0.59,bh*0.50],[bw*0.59,bh*0.50]];
  wPos.forEach(([wx,wy])=>{
    const wr=bw*0.24, wry=bh*0.36;
    // Tyre (fat, low-profile)
    c.fillStyle='#0d0d0d'; c.beginPath(); c.ellipse(wx,wy,wr,wry,0,0,Math.PI*2); c.fill();
    c.strokeStyle='rgba(255,255,255,0.06)'; c.lineWidth=2.5;
    c.beginPath(); c.ellipse(wx,wy,wr*0.88,wry*0.88,0,0,Math.PI*2); c.stroke();
    // Brake caliper (colored per profile)
    c.fillStyle=L1; c.shadowBlur=6; c.shadowColor=L1;
    c.beginPath(); c.ellipse(wx,wy,wr*0.66,wry*0.66,0,0,Math.PI*2); c.fill(); c.shadowBlur=0;
    // Dark rim face
    const rg2=c.createRadialGradient(wx-wr*0.18,wy-wry*0.18,2,wx,wy,wr*0.64);
    rg2.addColorStop(0,'#3c3c3c'); rg2.addColorStop(0.5,'#222'); rg2.addColorStop(1,'#111');
    c.fillStyle=rg2; c.beginPath(); c.ellipse(wx,wy,wr*0.64,wry*0.64,0,0,Math.PI*2); c.fill();
    // 7-spoke (deep dish / motorsport style)
    for(let s=0;s<7;s++){
      const a=s/7*Math.PI*2-Math.PI/2;
      const a1=a-0.14, a2=a+0.14;
      c.fillStyle='#2c2c2c';
      c.beginPath();
      c.moveTo(wx+Math.cos(a)*wr*0.09,wy+Math.sin(a)*wry*0.09);
      c.lineTo(wx+Math.cos(a1)*wr*0.62,wy+Math.sin(a1)*wry*0.62);
      c.lineTo(wx+Math.cos(a2)*wr*0.62,wy+Math.sin(a2)*wry*0.62);
      c.closePath(); c.fill();
      // spoke highlight
      c.strokeStyle='rgba(90,90,90,0.6)'; c.lineWidth=0.6;
      c.beginPath(); c.moveTo(wx+Math.cos(a)*wr*0.11,wy+Math.sin(a)*wry*0.11);
      c.lineTo(wx+Math.cos(a)*wr*0.60,wy+Math.sin(a)*wry*0.60); c.stroke();
    }
    // Center cap (BMW blue)
    c.fillStyle='#111'; c.beginPath(); c.ellipse(wx,wy,wr*0.13,wry*0.13,0,0,Math.PI*2); c.fill();
    c.fillStyle='#0055cc'; c.beginPath(); c.arc(wx,wy,wr*0.09,0,Math.PI*2); c.fill();
    c.fillStyle='#fff'; c.font=`bold ${wr*0.06}px Arial`; c.textAlign='center'; c.textBaseline='middle';
    c.fillText('M',wx,wy);
    // Rim outer edge chrome
    c.strokeStyle='rgba(120,120,120,0.35)'; c.lineWidth=1.5;
    c.beginPath(); c.ellipse(wx,wy,wr*0.64,wry*0.64,0,0,Math.PI*2); c.stroke();
  });

  // ── BODY BASE PATH helper ───────────────────────────────────────────────
  function bodyPath(){
    c.beginPath();
    c.moveTo(-bw*0.92,bh*0.46);
    c.lineTo(-bw*0.92,-bh*0.04);
    c.bezierCurveTo(-bw*0.92,-bh*0.24,-bw*0.74,-bh*0.88,-bw*0.50,-bh*0.98);
    c.bezierCurveTo(-bw*0.32,-bh*1.08,-bw*0.18,-bh*1.12,0,-bh*1.12);
    c.bezierCurveTo(bw*0.18,-bh*1.12,bw*0.36,-bh*1.02,bw*0.52,-bh*0.86);
    c.bezierCurveTo(bw*0.72,-bh*0.66,bw*0.90,-bh*0.20,bw*0.92,-bh*0.04);
    c.lineTo(bw*0.92,bh*0.46);
    c.bezierCurveTo(bw*0.74,bh*0.58,bw*0.52,bh*0.56,bw*0.38,bh*0.54);
    c.lineTo(-bw*0.38,bh*0.54);
    c.bezierCurveTo(-bw*0.52,bh*0.56,-bw*0.74,bh*0.58,-bw*0.92,bh*0.46);
    c.closePath();
  }

  // Body depth shadow
  c.fillStyle='#060606'; bodyPath(); c.fill();
  // Matte dark graphite base
  const bg=c.createLinearGradient(-bw,-bh*1.1,bw*0.5,bh*0.7);
  bg.addColorStop(0,'#282828'); bg.addColorStop(0.3,'#1c1c1c'); bg.addColorStop(0.7,'#141414'); bg.addColorStop(1,'#080808');
  c.fillStyle=bg; bodyPath(); c.fill();

  // ── COLORFUL LIVERY (clipped to body) ─────────────────────────────────
  c.save(); bodyPath(); c.clip();

  // Large geometric L1 color lightning bolt / star shape (center-left of body)
  c.fillStyle=L1; c.globalAlpha=0.88;
  c.beginPath();
  c.moveTo(-bw*0.05,-bh*1.10); c.lineTo(bw*0.10,-bh*1.10);
  c.lineTo(-bw*0.15,-bh*0.40); c.lineTo(bw*0.12,-bh*0.40);
  c.lineTo(-bw*0.02,bh*0.42);  c.lineTo(-bw*0.22,bh*0.42);
  c.lineTo(-bw*0.08,-bh*0.28); c.lineTo(-bw*0.30,-bh*0.28);
  c.closePath(); c.fill();

  // Second L1 shape (right side block)
  c.beginPath();
  c.moveTo(bw*0.28,-bh*0.88); c.lineTo(bw*0.56,-bh*0.88);
  c.lineTo(bw*0.75,-bh*0.14); c.lineTo(bw*0.44,-bh*0.14);
  c.closePath(); c.fill();

  // Dot/hexagon accent cluster
  c.globalAlpha=0.40;
  for(let di=0;di<12;di++){
    const dx=(di%4-1.5)*bw*0.20+bw*0.05, dy=Math.floor(di/4)*bh*0.28-bh*0.60;
    c.beginPath(); c.arc(dx,dy,bw*0.045,0,Math.PI*2); c.fill();
  }
  c.globalAlpha=0.88;

  // L2 accent stripes
  c.fillStyle=L2;
  // Front lower aggressive splitter / bumper color
  c.fillRect(-bw*0.92,bh*0.30,bw*0.60,bh*0.18);
  // Door accent stripe (diagonal)
  c.beginPath();
  c.moveTo(-bw*0.35,-bh*0.05); c.lineTo(bw*0.28,-bh*0.05);
  c.lineTo(bw*0.22,bh*0.16);   c.lineTo(-bw*0.40,bh*0.16);
  c.closePath(); c.fill();
  // Rear upper corner
  c.beginPath();
  c.moveTo(-bw*0.80,-bh*0.10); c.lineTo(-bw*0.60,-bh*0.10);
  c.lineTo(-bw*0.55,bh*0.24); c.lineTo(-bw*0.88,bh*0.10);
  c.closePath(); c.fill();

  c.globalAlpha=1;
  c.restore(); // end livery clip

  // ── ROOF / CARBON TOP ─────────────────────────────────────────────────
  const rfG=c.createLinearGradient(-bw*0.40,-bh*1.08,bw*0.40,-bh*0.38);
  rfG.addColorStop(0,'#222'); rfG.addColorStop(0.5,'#1a1a1a'); rfG.addColorStop(1,'#0e0e0e');
  c.fillStyle=rfG;
  c.beginPath();
  c.moveTo(-bw*0.50,-bh*0.94); c.bezierCurveTo(-bw*0.38,-bh*0.98,-bw*0.18,-bh*1.10,0,-bh*1.10);
  c.bezierCurveTo(bw*0.18,-bh*1.10,bw*0.36,-bh*1.00,bw*0.50,-bh*0.94);
  c.lineTo(bw*0.44,-bh*0.36); c.lineTo(-bw*0.44,-bh*0.36); c.closePath(); c.fill();
  // Carbon weave
  c.strokeStyle='rgba(255,255,255,0.05)'; c.lineWidth=0.7;
  for(let ci=-6;ci<=6;ci++){ c.beginPath(); c.moveTo(ci*bw*0.08,-bh*1.10); c.lineTo(ci*bw*0.08,-bh*0.36); c.stroke(); }

  // ── WINDSHIELD ─────────────────────────────────────────────────────────
  const wgr=c.createLinearGradient(-bw*0.34,-bh*0.90,bw*0.34,-bh*0.36);
  wgr.addColorStop(0,'rgba(40,100,200,0.75)'); wgr.addColorStop(0.5,'rgba(20,60,160,0.50)'); wgr.addColorStop(1,'rgba(5,20,80,0.25)');
  c.fillStyle=wgr;
  c.beginPath(); c.moveTo(-bw*0.40,-bh*0.36); c.lineTo(-bw*0.46,-bh*0.88); c.lineTo(bw*0.46,-bh*0.88); c.lineTo(bw*0.40,-bh*0.36); c.closePath(); c.fill();
  c.strokeStyle='rgba(180,220,255,0.30)'; c.lineWidth=1.2;
  c.beginPath(); c.moveTo(-bw*0.40,-bh*0.36); c.lineTo(-bw*0.46,-bh*0.88); c.lineTo(bw*0.46,-bh*0.88); c.lineTo(bw*0.40,-bh*0.36); c.closePath(); c.stroke();
  // Rear window
  c.fillStyle='rgba(15,40,140,0.55)';
  c.beginPath(); c.moveTo(-bw*0.48,-bh*0.34); c.lineTo(-bw*0.54,-bh*0.86); c.lineTo(-bw*0.38,-bh*0.86); c.lineTo(-bw*0.32,-bh*0.34); c.closePath(); c.fill();

  // ── SIDE WINDOW ────────────────────────────────────────────────────────
  if(isSide){
    c.fillStyle='rgba(15,40,150,0.50)';
    c.beginPath(); c.moveTo(-bw*0.32,-bh*0.34); c.lineTo(-bw*0.38,-bh*0.84); c.lineTo(-bw*0.48,-bh*0.82); c.lineTo(-bw*0.52,-bh*0.30); c.closePath(); c.fill();
    c.strokeStyle='rgba(180,220,255,0.20)'; c.lineWidth=0.8; c.stroke();
  }

  // ── SIDE SKIRT (L2 accent line) ───────────────────────────────────────
  const skG=c.createLinearGradient(0,bh*0.40,0,bh*0.54);
  skG.addColorStop(0,'#1c1c1c'); skG.addColorStop(1,'#050505');
  c.fillStyle=skG; c.beginPath(); roundR(c,-bw*0.85,bh*0.40,bw*1.70,bh*0.16,3); c.fill();
  c.shadowBlur=6; c.shadowColor=L2; c.strokeStyle=L2; c.lineWidth=1.8;
  c.beginPath(); c.moveTo(-bw*0.85,bh*0.43); c.lineTo(bw*0.85,bh*0.43); c.stroke(); c.shadowBlur=0;

  // ── FRONT SPLITTER ────────────────────────────────────────────────────
  c.fillStyle=L2;
  c.beginPath(); roundR(c,-bw*0.92,bh*0.46,bw*0.90,bh*0.12,2); c.fill();
  c.fillStyle='#080808';
  for(let fi=0;fi<5;fi++) c.fillRect(-bw*0.90+fi*bw*0.18,bh*0.47,bw*0.14,bh*0.08);

  // ── BMW KIDNEY GRILLE (front) ─────────────────────────────────────────
  if(isFront){
    [[-bw*0.22,bh*0.08,bw*0.18,bh*0.28],[bw*0.04,bh*0.08,bw*0.18,bh*0.28]].forEach(([gx,gy,gw,gh])=>{
      c.fillStyle='#0a0a0a'; c.strokeStyle='#888'; c.lineWidth=2;
      c.beginPath(); c.moveTo(gx,gy+gh*0.15); c.bezierCurveTo(gx,gy,gx+gw,gy,gx+gw,gy+gh*0.15);
      c.lineTo(gx+gw,gy+gh*0.85); c.bezierCurveTo(gx+gw,gy+gh,gx,gy+gh,gx,gy+gh*0.85); c.closePath();
      c.fill(); c.stroke();
      // mesh lines
      c.strokeStyle='rgba(100,100,100,0.6)'; c.lineWidth=0.8;
      for(let ml=0;ml<5;ml++){ c.beginPath(); c.moveTo(gx+ml*gw/4,gy+4); c.lineTo(gx+ml*gw/4,gy+gh-4); c.stroke(); }
      for(let ml=0;ml<4;ml++){ c.beginPath(); c.moveTo(gx+2,gy+ml*gh/3); c.lineTo(gx+gw-2,gy+ml*gh/3); c.stroke(); }
    });
    // Lower bumper vents (aggressive)
    c.fillStyle='#060606'; c.strokeStyle='#333'; c.lineWidth=1;
    c.beginPath(); roundR(c,-bw*0.82,bh*0.32,bw*0.66,bh*0.13,3); c.fill(); c.stroke();
    c.beginPath(); roundR(c,bw*0.16,bh*0.32,bw*0.66,bh*0.13,3); c.fill(); c.stroke();
  }

  // ── PROJECTOR HEADLIGHTS (purple/violet like reference) ────────────────
  if(isFront){
    [[-bw*0.54,bh*0.04],[bw*0.54,bh*0.04]].forEach(([hx,hy])=>{
      c.fillStyle='#111'; c.beginPath(); c.ellipse(hx,hy,bw*0.20,bh*0.16,0,0,Math.PI*2); c.fill();
      // Violet projector glow (like the reference image)
      const hgl=c.createRadialGradient(hx,hy,1,hx,hy,bw*0.13);
      hgl.addColorStop(0,'rgba(200,140,255,0.95)'); hgl.addColorStop(0.5,'rgba(160,80,255,0.6)'); hgl.addColorStop(1,'rgba(80,0,200,0.1)');
      c.fillStyle=hgl; c.shadowBlur=14; c.shadowColor='#bb44ff';
      c.beginPath(); c.ellipse(hx,hy,bw*0.13,bh*0.10,0,0,Math.PI*2); c.fill(); c.shadowBlur=0;
      // Angel eye ring
      c.strokeStyle='rgba(220,180,255,0.90)'; c.lineWidth=2.2; c.shadowBlur=8; c.shadowColor='#cc88ff';
      c.beginPath(); c.ellipse(hx,hy,bw*0.15,bh*0.12,0,0,Math.PI*2); c.stroke(); c.shadowBlur=0;
      // Blue DRL strip
      c.strokeStyle=L1; c.lineWidth=2; c.shadowBlur=8; c.shadowColor=L1;
      c.beginPath(); c.moveTo(hx-bw*0.18,hy+bh*0.10); c.lineTo(hx+bw*0.18,hy+bh*0.10); c.stroke(); c.shadowBlur=0;
    });
  }

  // ── TAIL LIGHTS (rear) ────────────────────────────────────────────────
  if(isRear){
    [[-bw*0.62,bh*0.04],[bw*0.62,bh*0.04]].forEach(([tx,ty])=>{
      c.fillStyle='#1a0000'; c.beginPath(); c.ellipse(tx,ty,bw*0.22,bh*0.15,0,0,Math.PI*2); c.fill();
      c.fillStyle='#ff1100'; c.shadowBlur=16; c.shadowColor='#ff3300';
      c.beginPath(); c.ellipse(tx,ty,bw*0.17,bh*0.10,0,0,Math.PI*2); c.fill(); c.shadowBlur=0;
      c.fillStyle='rgba(255,200,180,0.7)'; c.beginPath(); c.arc(tx,ty,bw*0.07,0,Math.PI*2); c.fill();
    });
    // Rear diffuser
    c.fillStyle='#0a0a0a'; c.beginPath(); roundR(c,-bw*0.84,bh*0.42,bw*1.68,bh*0.15,3); c.fill();
    c.strokeStyle=L1; c.lineWidth=1;
    for(let fi=0;fi<8;fi++){ c.beginPath(); c.moveTo(-bw*0.80+fi*bw*0.22,bh*0.42); c.lineTo(-bw*0.80+fi*bw*0.22,bh*0.57); c.stroke(); }
    // Exhausts
    [[-bw*0.42,bh*0.52],[bw*0.42,bh*0.52]].forEach(([ex,ey])=>{
      const eg2=c.createRadialGradient(ex,ey,1,ex,ey,bw*0.08);
      eg2.addColorStop(0,'#666'); eg2.addColorStop(1,'#111');
      c.fillStyle=eg2; c.strokeStyle='#555'; c.lineWidth=1.5;
      c.beginPath(); c.ellipse(ex,ey,bw*0.08,bh*0.055,0,0,Math.PI*2); c.fill(); c.stroke();
      c.fillStyle='#000'; c.beginPath(); c.ellipse(ex,ey,bw*0.055,bh*0.038,0,0,Math.PI*2); c.fill();
    });
  }

  // ── GT WING ───────────────────────────────────────────────────────────
  if(isRear||isSide){
    const wy=-bh*1.00;
    c.strokeStyle='#181818'; c.lineWidth=3.5;
    [[-bw*0.28],[bw*0.28]].forEach(([sx])=>{
      c.beginPath(); c.moveTo(sx,bh*0.00); c.bezierCurveTo(sx,wy*0.25,sx*0.78,wy*0.72,sx*0.62,wy); c.stroke();
    });
    // Wing blade with livery color
    const wgG=c.createLinearGradient(-bw*0.62,wy-bh*0.13,-bw*0.62,wy+bh*0.08);
    wgG.addColorStop(0,'#1a1a1a'); wgG.addColorStop(0.5,L1); wgG.addColorStop(1,'#080808');
    c.fillStyle=wgG;
    c.beginPath();
    c.moveTo(-bw*0.66,wy); c.bezierCurveTo(-bw*0.62,wy-bh*0.14,bw*0.62,wy-bh*0.14,bw*0.66,wy);
    c.bezierCurveTo(bw*0.62,wy+bh*0.07,-bw*0.62,wy+bh*0.07,-bw*0.66,wy); c.closePath(); c.fill();
    // Gurney
    c.fillStyle=L2; c.fillRect(bw*0.60,wy-bh*0.14,bw*0.06,bh*0.16);
    c.fillRect(-bw*0.66,wy-bh*0.14,bw*0.06,bh*0.16);
  }

  // ── SIDE MIRROR ────────────────────────────────────────────────────────
  if(isSide){
    c.fillStyle='#181818'; c.beginPath(); roundR(c,bw*0.33,-bh*0.34,bw*0.18,bh*0.09,2); c.fill();
    c.fillStyle='rgba(40,100,200,0.6)'; c.beginPath(); roundR(c,bw*0.345,-bh*0.320,bw*0.14,bh*0.065,2); c.fill();
  }

  // ── TOMAHAWK PLASMA AURA ──────────────────────────────────────────────
  if(pf.label.startsWith('TOMAHAWK')){
    const tg3=c.createRadialGradient(0,0,bw*0.25,0,0,bw*1.15);
    tg3.addColorStop(0,L1+'bb'); tg3.addColorStop(0.5,L2+'55'); tg3.addColorStop(1,'transparent');
    c.fillStyle=tg3; c.beginPath(); c.ellipse(0,0,bw*1.15,bh*0.88,0,0,Math.PI*2); c.fill();
    c.shadowBlur=35; c.shadowColor=L1; c.strokeStyle=L1; c.lineWidth=3;
    c.beginPath(); c.ellipse(0,-bh*0.22,bw*0.92,bh*0.75,0,0,Math.PI*2); c.stroke();
    c.shadowColor=L2; c.strokeStyle=L2; c.lineWidth=1.5;
    c.beginPath(); c.ellipse(0,-bh*0.22,bw*0.82,bh*0.65,0,0,Math.PI*2); c.stroke();
    c.shadowBlur=0;
  }

  c.restore();
}
function roundR(c,x,y,w,h,r){ if(c.roundRect){c.roundRect(x,y,w,h,r);}else{c.rect(x,y,w,h);} }
function shiftHex(hex,amt){ const n=parseInt(hex.replace('#',''),16)||0; return '#'+[n>>16,(n>>8)&0xff,n&0xff].map(v=>Math.min(255,Math.max(0,v+amt)).toString(16).padStart(2,'0')).join(''); }
buildSprites();

// ─── PARTICLES ────────────────────────────────────────────────────────────────
let parts=[];
function spawnSmoke(x,y,col){
  if(GS.quality==='LOW') return;
  const max=GS.quality==='MEDIUM'?20:50;
  if(parts.filter(p=>p.on).length>=max) return;
  let p=parts.find(p=>!p.on);
  if(!p){p={};parts.push(p);}
  p.on=true;p.x=x;p.y=y;p.vx=(Math.random()-0.5)*55;p.vy=-32-Math.random()*28;
  p.life=0.9;p.ml=0.9;p.r=4+Math.random()*9;p.col=col;
}
function tickParts(dt){parts.forEach(p=>{if(!p.on)return;p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=14*dt;if(p.life<=0)p.on=false;});}
function drawParts(){
  parts.forEach(p=>{ if(!p.on)return; ctx.globalAlpha=(p.life/p.ml)*0.55; ctx.fillStyle=p.col+(p.life/p.ml*0.7).toFixed(2)+')'; ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill(); });
  ctx.globalAlpha=1;
}

// ─── DRAW HELPERS ─────────────────────────────────────────────────────────────
function drawBMWLogo(x,y,r,t){
  ctx.save(); ctx.translate(x,y);
  ctx.shadowBlur=20; ctx.shadowColor=C.blue;
  ctx.strokeStyle='rgba(200,200,210,0.85)'; ctx.lineWidth=r*0.08;
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(200,200,210,0.4)'; ctx.lineWidth=r*0.03;
  ctx.beginPath(); ctx.arc(0,0,r*0.88,0,Math.PI*2); ctx.stroke();
  const sp=Math.sin(t*0.5)*0.12;
  ctx.save(); ctx.rotate(sp);
  ctx.fillStyle=C.blue; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.86,-Math.PI/2,0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.86,Math.PI/2,Math.PI); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#f0f2ff'; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.86,0,Math.PI/2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.86,Math.PI,-Math.PI/2); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.strokeStyle='rgba(200,200,210,0.9)'; ctx.lineWidth=r*0.03;
  ctx.beginPath(); ctx.moveTo(-r*0.86,0); ctx.lineTo(r*0.86,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-r*0.86); ctx.lineTo(0,r*0.86); ctx.stroke();
  ctx.fillStyle=C.bg; ctx.beginPath(); ctx.arc(0,0,r*0.11,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(210,215,230,0.9)'; ctx.font=`bold ${r*0.2}px Arial`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('BMW',0,0);
  ctx.restore();
}

function card(x,y,w,h,col,border,r=10){
  ctx.fillStyle=col; ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fill();
  if(border){ctx.strokeStyle=border;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.stroke();}
}
function glowText(txt,x,y,col,size,shadow=18){
  ctx.shadowBlur=shadow; ctx.shadowColor=col; ctx.fillStyle=col; ctx.font=`bold ${size}px monospace`; ctx.textAlign='center'; ctx.fillText(txt,x,y); ctx.shadowBlur=0;
}
function label(txt,x,y,col,size,align='center'){
  ctx.fillStyle=col; ctx.font=`${size}px monospace`; ctx.textAlign=align; ctx.fillText(txt,x,y);
}

function drawBG(tr){
  // ── SKY (rich gradient) ────────────────────────────────────────────────
  const sg=ctx.createLinearGradient(0,0,0,H*0.56);
  sg.addColorStop(0,tr.skyA); sg.addColorStop(0.6,tr.skyB);
  if(tr.weather==='dusk') sg.addColorStop(1,'#ff4400');
  if(tr.weather==='day')  sg.addColorStop(1,'#1a6aaa');
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H*0.60);

  // ── STARS / ATMOSPHERE ─────────────────────────────────────────────────
  if(tr.weather==='night'||tr.weather==='rain'){
    for(let i=0;i<120;i++){
      const sx=((i*173+7)%W), sy=((i*97+13)%(H*0.46));
      const bri=0.25+((i*37)%10)*0.07+Math.sin(GS.t*2+i)*0.1;
      ctx.fillStyle=`rgba(200,210,255,${bri})`;
      ctx.fillRect(sx,sy,i%4===0?2:1,i%4===0?2:1);
    }
    // Moon
    ctx.fillStyle='rgba(230,235,255,0.92)'; ctx.shadowBlur=24; ctx.shadowColor='rgba(200,220,255,0.5)';
    ctx.beginPath(); ctx.arc(W*0.85,H*0.10,20,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  }

  // ── CITY SKYLINE (night/rain) ──────────────────────────────────────────
  if(tr.weather==='night'||tr.id==='tokyo'){
    const off=(camZ*0.04)%W;
    const BCOLS=tr.id==='tokyo'?['#050515','#080820','#060618']:['#07071c','#0a0a22','#050514'];
    for(let rep=-1;rep<=2;rep++){
      const ox=rep*W-off;
      // Far buildings layer 1
      ctx.fillStyle=BCOLS[0];
      for(let b=0;b<14;b++){
        const bx2=ox+b*95+4, bh2=40+Math.sin(b*1.7+2)*70, bw2=60+Math.cos(b*2.1)*15;
        ctx.fillRect(bx2,H*0.56-bh2,bw2,bh2);
      }
      // Closer buildings layer 2
      ctx.fillStyle=BCOLS[1];
      for(let b=0;b<10;b++){
        const bx2=ox+b*130+22, bh2=25+Math.sin(b*2.3+1)*50, bw2=85+Math.cos(b*1.8)*18;
        ctx.fillRect(bx2,H*0.56-bh2,bw2,bh2);
        // Windows glow
        if(GS.quality!=='LOW'){
          const wc=['rgba(255,220,80,0.5)','rgba(100,200,255,0.4)','rgba(255,180,255,0.35)'];
          ctx.fillStyle=wc[b%3];
          for(let wr=0;wr<Math.floor(bh2/14);wr++) for(let wcc=0;wcc<Math.floor(bw2/14);wcc++)
            if((wr*wcc+b+wr)%3!==0) ctx.fillRect(bx2+wcc*14+2,H*0.56-bh2+wr*14+2,8,8);
          ctx.fillStyle=BCOLS[1];
        }
      }
      // Neon signs on buildings
      if(GS.quality!=='LOW'){
        const nc=['#ff0088','#00ffcc','#ff7700','#00aaff','#ff00ff','#aaff00'];
        for(let n=0;n<10;n++){
          const nx2=ox+n*140+40, ny2=H*0.56-80-Math.sin(n*1.5)*40;
          ctx.fillStyle=nc[n%nc.length]; ctx.shadowBlur=10; ctx.shadowColor=nc[n%nc.length];
          ctx.globalAlpha=0.7+Math.sin(GS.t*2.5+n)*0.2;
          ctx.fillRect(nx2,ny2,40+n%20,6); ctx.globalAlpha=1; ctx.shadowBlur=0;
        }
      }
    }
  } else {
    // ── MOUNTAINS / LANDSCAPE (day/dusk/desert) ─────────────────────────
    const off2=(camZ*0.018)%W;
    const mc1=tr.surf==='ice'?'#1a2a5a':tr.weather==='heat'?'#2a1400':'#0e1e0e';
    const mc2=tr.surf==='ice'?'#1e3060':tr.weather==='heat'?'#1a0a00':'#0a180a';
    for(let rep=-1;rep<=2;rep++){
      const ox=rep*W-off2;
      // Back mountain range
      ctx.fillStyle=mc1; ctx.beginPath(); ctx.moveTo(ox,H*0.57);
      for(let m=0;m<=14;m++) ctx.lineTo(ox+m*88,H*0.57-30-Math.sin(m*1.7+tr.id.length*0.4)*90);
      ctx.lineTo(ox+14*88,H*0.57); ctx.closePath(); ctx.fill();
      // Front mountain range
      ctx.fillStyle=mc2; ctx.beginPath(); ctx.moveTo(ox,H*0.57);
      for(let m=0;m<=12;m++) ctx.lineTo(ox+m*100,H*0.57-15-Math.sin(m*2.2+1.2)*55);
      ctx.lineTo(ox+12*100,H*0.57); ctx.closePath(); ctx.fill();
    }
    // ── SUN ──
    if(tr.weather==='day'){
      const sunG=ctx.createRadialGradient(W*0.80,H*0.09,0,W*0.80,H*0.09,70);
      sunG.addColorStop(0,'rgba(255,255,210,1)'); sunG.addColorStop(0.3,'rgba(255,230,100,0.6)'); sunG.addColorStop(1,'rgba(255,180,0,0)');
      ctx.fillStyle=sunG; ctx.shadowBlur=40; ctx.shadowColor='rgba(255,220,80,0.6)';
      ctx.beginPath(); ctx.arc(W*0.80,H*0.09,26,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
      // Sun rays
      ctx.strokeStyle='rgba(255,230,100,0.18)'; ctx.lineWidth=1.5;
      for(let r=0;r<12;r++){
        const ra=r/12*Math.PI*2;
        ctx.beginPath(); ctx.moveTo(W*0.80+Math.cos(ra)*32,H*0.09+Math.sin(ra)*32);
        ctx.lineTo(W*0.80+Math.cos(ra)*70,H*0.09+Math.sin(ra)*70); ctx.stroke();
      }
    }
    // ── DUSK SUN ──
    if(tr.weather==='dusk'){
      const dg=ctx.createRadialGradient(W*0.68,H*0.18,0,W*0.68,H*0.18,120);
      dg.addColorStop(0,'rgba(255,120,0,1)'); dg.addColorStop(0.4,'rgba(255,60,0,0.5)'); dg.addColorStop(1,'rgba(255,0,0,0)');
      ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(W*0.68,H*0.18,30,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=dg; ctx.fillRect(0,0,W,H*0.55);
    }
    if(tr.weather==='heat'){
      ctx.fillStyle=`rgba(255,140,20,${0.06+Math.sin(GS.t*2.5)*0.02})`; ctx.fillRect(0,H*0.25,W,H*0.25);
    }
    // Snow mountains cap
    if(tr.surf==='ice'){
      ctx.fillStyle='rgba(230,240,255,0.6)';
      for(let m=0;m<=14;m++){
        const mx=(m*88)%W, my=H*0.57-30-Math.sin(m*1.7+tr.id.length*0.4)*90;
        ctx.beginPath(); ctx.moveTo(mx-15,my+18); ctx.lineTo(mx,my-8); ctx.lineTo(mx+15,my+18); ctx.closePath(); ctx.fill();
      }
    }
  }

  // ── RAIN ──────────────────────────────────────────────────────────────
  if(tr.weather==='rain'){
    ctx.strokeStyle='rgba(160,190,255,0.28)'; ctx.lineWidth=1;
    for(let r=0;r<55;r++){
      const rx=((r*79+GS.t*450)%W), ry=((r*113+GS.t*400)%(H*0.88));
      ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+8,ry+20); ctx.stroke();
    }
    // Wet road reflection shimmer
    if(GS.quality!=='LOW'){
      ctx.fillStyle=`rgba(80,120,255,${0.04+Math.sin(GS.t*3)*0.02})`; ctx.fillRect(0,H*0.5,W,H*0.15);
    }
  }
  // ── SNOW ──────────────────────────────────────────────────────────────
  if(tr.weather==='snow'){
    ctx.fillStyle='rgba(215,230,255,0.75)';
    for(let r=0;r<70;r++){
      const rx=((r*91+GS.t*50)%W), ry=((r*107+GS.t*42)%(H*0.88));
      ctx.beginPath(); ctx.arc(rx,ry,1.8+r%2,0,Math.PI*2); ctx.fill();
    }
  }
  // ── HORIZON GLOW (all tracks) ─────────────────────────────────────────
  const hzG=ctx.createLinearGradient(0,H*0.50,0,H*0.60);
  hzG.addColorStop(0,'rgba(0,0,0,0)');
  if(tr.weather==='night'||tr.weather==='rain') hzG.addColorStop(1,'rgba(0,20,60,0.6)');
  else if(tr.weather==='dusk') hzG.addColorStop(1,'rgba(60,10,0,0.4)');
  else hzG.addColorStop(1,'rgba(0,0,0,0.3)');
  ctx.fillStyle=hzG; ctx.fillRect(0,H*0.50,W,H*0.10);
}

// ─── DRAW PLAYER & AI CARS ────────────────────────────────────────────────────
function drawPlayerCar(){
  const pi=P_KEYS.indexOf(GS.profile);
  const an=Math.round(((PL.angVel*0.28+0.5)%1+1)%1*SANG)%SANG;
  const sc=1.65+Math.abs(PL.speed)/600;
  const dw=SW*sc, dh=SH*sc;
  const cx=W/2-dw/2+PL.x*0.075+PL.shakeX;
  const cy=H*0.67-dh+PL.shakeY;

  // NOS glow beneath car
  if(PL.nosOn){
    const ng=ctx.createRadialGradient(cx+dw/2,cy+dh,0,cx+dw/2,cy+dh,dh*2);
    ng.addColorStop(0,'rgba(0,238,255,0.35)'); ng.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ng; ctx.fillRect(cx-dh,cy-dh,dw+dh*2,dh*3);
  }
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(cx+dw/2,cy+dh*0.92,dw*0.38,9,0,0,Math.PI*2); ctx.fill();
  ctx.drawImage(sSheet,an*SW,pi*SH,SW,SH,cx,cy,dw,dh);
  // Headlight beams
  if(curTR().weather==='night'||curTR().weather==='rain'){
    [[cx+dw*0.28,cy+dh*0.72],[cx+dw*0.72,cy+dh*0.72]].forEach(([lx,ly])=>{
      const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,190);
      lg.addColorStop(0,'rgba(255,255,210,0.2)'); lg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=lg; ctx.fillRect(lx-190,ly-20,380,240);
    });
  }
  // NOS flame
  if(PL.nosOn){
    ctx.fillStyle=`rgba(0,238,255,${0.55+Math.sin(GS.t*28)*0.3})`;
    ctx.beginPath(); ctx.ellipse(cx+dw/2,cy+dh,dw*0.28,dh*0.55,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=`rgba(120,220,255,0.4)`;
    ctx.beginPath(); ctx.ellipse(cx+dw/2,cy+dh*1.25,dw*0.16,dh*0.75,0,0,Math.PI*2); ctx.fill();
  }
}
function drawAICars(){
  AI.forEach(ai=>{
    const rz=((ai.z-camZ)%trackLen+trackLen)%trackLen;
    if(rz<SEG*2||rz>DRAW*SEG) return;
    const sc2=CAM_D/rz*SEG*3.8; if(sc2<0.04)return;
    const dw2=SW*sc2*2.6, dh2=SH*sc2*2.6;
    const sx2=W/2+(ai.x-PL.x)*sc2*0.9;
    const sy2=H*0.48+(1-sc2)*H*0.22;
    const pi2=P_KEYS.indexOf(ai.pk);
    ctx.drawImage(sSheet,0,pi2*SH,SW,SH,sx2-dw2/2,sy2-dh2,dw2,dh2);
  });
}

// ─── MINIMAP ─────────────────────────────────────────────────────────────────
function drawMinimap(){
  const mx=W-70,my=70,mr=42;
  ctx.fillStyle='rgba(0,0,10,0.7)'; ctx.beginPath(); ctx.arc(mx,my,mr+5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(28,105,212,0.6)'; ctx.lineWidth=1.5;
  ctx.beginPath();
  segs.forEach((s,i)=>{ const a=(s.z/trackLen)*Math.PI*2-Math.PI/2, r=mr*(0.72+s.curve*0.06); i===0?ctx.moveTo(mx+Math.cos(a)*r,my+Math.sin(a)*r):ctx.lineTo(mx+Math.cos(a)*r,my+Math.sin(a)*r); });
  ctx.closePath(); ctx.stroke();
  const pa=(camZ/trackLen)*Math.PI*2-Math.PI/2;
  ctx.fillStyle=C.blue; ctx.shadowBlur=7; ctx.shadowColor=C.blue;
  ctx.beginPath(); ctx.arc(mx+Math.cos(pa)*mr*0.76,my+Math.sin(pa)*mr*0.76,4.5,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  AI.forEach(ai=>{ const aa=(ai.z/trackLen)*Math.PI*2-Math.PI/2; ctx.fillStyle=C.red; ctx.beginPath(); ctx.arc(mx+Math.cos(aa)*mr*0.76,my+Math.sin(aa)*mr*0.76,2.8,0,Math.PI*2); ctx.fill(); });
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function drawHUD(){
  const pf=curPF();
  const kmh=Math.abs(PL.speed)*3.6;
  const rn=Math.min(1,PL.rpm);
  const pCol=pf.lv1||C.blue2;

  // ── TOP BAR ───────────────────────────────────────────────────────────
  const tbG=ctx.createLinearGradient(0,0,0,50);
  tbG.addColorStop(0,'rgba(0,0,14,0.92)'); tbG.addColorStop(1,'rgba(0,0,8,0.60)');
  ctx.fillStyle=tbG; ctx.fillRect(0,0,W,50);
  // Colored accent line at top
  const tlG=ctx.createLinearGradient(0,0,W,0);
  tlG.addColorStop(0,pf.lv1||C.cyan); tlG.addColorStop(0.5,pf.lv2||C.red); tlG.addColorStop(1,pf.lv1||C.cyan);
  ctx.fillStyle=tlG; ctx.fillRect(0,0,W,3);

  const POSNAMES=['1ST','2ND','3RD','4TH','5TH','6TH','7TH','8TH'];
  const posCol=PL.pos===1?C.gold:PL.pos<=3?C.cyan:C.grey;
  ctx.shadowBlur=14; ctx.shadowColor=posCol; ctx.fillStyle=posCol;
  ctx.font='bold 24px monospace'; ctx.textAlign='left'; ctx.fillText(POSNAMES[PL.pos-1]||PL.pos+'TH',14,32); ctx.shadowBlur=0;
  const m=Math.floor(PL.lapT/60),s=(PL.lapT%60).toFixed(2).padStart(5,'0');
  ctx.fillStyle=C.white; ctx.font='bold 15px monospace'; ctx.textAlign='center';
  ctx.fillText(`LAP ${PL.lap+1}/${curTR().laps}   ${m}:${s}`,W/2,30);
  ctx.fillStyle=pCol; ctx.font='bold 11px monospace'; ctx.textAlign='right';
  ctx.fillText(`${pf.label}`,W-10,18);
  ctx.fillStyle=C.grey; ctx.font='10px monospace'; ctx.fillText(curTR().name,W-10,33);
  if(PL.bestLap<Infinity){ const bm=Math.floor(PL.bestLap/60),bs=(PL.bestLap%60).toFixed(2).padStart(5,'0'); ctx.shadowBlur=6; ctx.shadowColor=C.gold; ctx.fillStyle=C.gold; ctx.fillText('BEST '+bm+':'+bs,W-10,47); ctx.shadowBlur=0; }

  // ── SPEEDOMETER PANEL (bottom-left) ──────────────────────────────────
  const tx=110, ty=H-96, tr2=70;
  // Panel bg
  ctx.fillStyle='rgba(0,0,14,0.78)'; ctx.beginPath(); ctx.arc(tx,ty,tr2+14,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=pCol+'44'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(tx,ty,tr2+14,0,Math.PI*2); ctx.stroke();
  // RPM track
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=12; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(tx,ty,tr2,Math.PI*0.75,Math.PI*2.25); ctx.stroke();
  // RPM arc colored
  const rcol=rn>0.88?C.red:rn>0.65?C.orange:pCol;
  ctx.shadowBlur=18; ctx.shadowColor=rcol; ctx.strokeStyle=rcol; ctx.lineWidth=8; ctx.lineCap='round';
  if(rn>0) ctx.beginPath(), ctx.arc(tx,ty,tr2,Math.PI*0.75,Math.PI*0.75+rn*Math.PI*1.5), ctx.stroke();
  ctx.shadowBlur=0;
  // Speed number
  ctx.fillStyle=C.white; ctx.font=`bold ${kmh>999?20:24}px monospace`; ctx.textAlign='center';
  ctx.shadowBlur=8; ctx.shadowColor=pCol;
  ctx.fillText(Math.round(kmh),tx,ty+8); ctx.shadowBlur=0;
  ctx.fillStyle=pCol; ctx.font='10px monospace'; ctx.fillText('km/h',tx,ty+24);
  // Gear pill
  ctx.fillStyle=pCol; ctx.shadowBlur=10; ctx.shadowColor=pCol;
  ctx.beginPath(); ctx.roundRect(tx-18,ty-tr2+4,36,24,8); ctx.fill(); ctx.shadowBlur=0;
  ctx.fillStyle='#000'; ctx.font='bold 14px monospace'; ctx.fillText('G'+PL.gear,tx,ty-tr2+20);
  if(PL.nosOn){ ctx.fillStyle=C.nos; ctx.shadowBlur=12; ctx.shadowColor=C.nos; ctx.font='bold 11px monospace'; ctx.fillText('NOS',tx,ty+40); ctx.shadowBlur=0; }

  // ── NOS BAR ───────────────────────────────────────────────────────────
  if(pf.nos){
    const nb=22,ny=H-22,nw=190,nh=10;
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.roundRect(nb,ny,nw,nh,5); ctx.fill();
    const nf=PL.nosLeft/999;
    if(nf>0){
      const nG=ctx.createLinearGradient(nb,0,nb+nw,0);
      nG.addColorStop(0,C.cyan); nG.addColorStop(1,C.magenta);
      ctx.shadowBlur=PL.nosOn?14:0; ctx.shadowColor=C.nos; ctx.fillStyle=nG;
      ctx.beginPath(); ctx.roundRect(nb,ny,nw*nf,nh,5); ctx.fill(); ctx.shadowBlur=0;
    }
    ctx.fillStyle=C.grey; ctx.font='9px monospace'; ctx.textAlign='left'; ctx.fillText('NITROUS',nb,ny-3);
  }

  // ── DRIFT PANEL ───────────────────────────────────────────────────────
  if(GS.mode==='drift'||PL.drift){
    const dpG=ctx.createLinearGradient(W-248,H-108,W-8,H-8);
    dpG.addColorStop(0,'rgba(20,0,40,0.80)'); dpG.addColorStop(1,'rgba(0,0,16,0.70)');
    ctx.fillStyle=dpG; ctx.beginPath(); ctx.roundRect(W-248,H-108,240,100,10); ctx.fill();
    ctx.strokeStyle=C.gold+'88'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.roundRect(W-248,H-108,240,100,10); ctx.stroke();
    ctx.shadowBlur=14; ctx.shadowColor=C.gold; ctx.fillStyle=C.gold;
    ctx.font=`bold ${PL.driftScore>99999?24:28}px monospace`; ctx.textAlign='right';
    ctx.fillText(Math.round(PL.driftScore).toLocaleString(),W-12,H-65); ctx.shadowBlur=0;
    ctx.fillStyle=C.white; ctx.font='bold 14px monospace'; ctx.fillText(`×${PL.combo} COMBO`,W-12,H-42);
    if(PL.drift){ ctx.fillStyle=C.orange; ctx.shadowBlur=8; ctx.shadowColor=C.orange; ctx.font='bold 12px monospace'; ctx.fillText(Math.round(PL.driftAng)+'° DRIFT',W-12,H-22); ctx.shadowBlur=0; }
    const cbx=W-240,cby=H-14;
    ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.roundRect(cbx,cby,228,8,4); ctx.fill();
    const dG=ctx.createLinearGradient(cbx,0,cbx+228,0);
    dG.addColorStop(0,C.orange); dG.addColorStop(1,C.gold);
    ctx.fillStyle=dG; ctx.shadowBlur=8; ctx.shadowColor=C.orange;
    ctx.beginPath(); ctx.roundRect(cbx,cby,228*PL.comboFill,8,4); ctx.fill(); ctx.shadowBlur=0;
  }

  // ── TOUCH CONTROLS ────────────────────────────────────────────────────
  if(navigator.maxTouchPoints>0){
    ctx.globalAlpha=0.32;
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(85,H-90,64,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=12; ctx.shadowColor=pCol; ctx.fillStyle=pCol;
    ctx.beginPath(); ctx.arc(85+joyDx*34,H-90+joyDy*34,26,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    ctx.shadowBlur=10; ctx.shadowColor=PL.nosOn?C.nos:C.cyan; ctx.fillStyle=PL.nosOn?C.nos:C.cyan;
    ctx.beginPath(); ctx.arc(W-85,H-90,44,0,Math.PI*2); ctx.fill();
    ctx.shadowColor=PL.drift?C.orange:C.red; ctx.fillStyle=PL.drift?C.orange:C.red;
    ctx.beginPath(); ctx.arc(W-85,H-178,38,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 11px monospace'; ctx.textAlign='center';
    ctx.fillText('NOS',W-85,H-86); ctx.fillText('DRIFT',W-85,H-174);
  }

  // ── MINIMAP ───────────────────────────────────────────────────────────
  drawMinimap();

  // ── BANNER ────────────────────────────────────────────────────────────
  if(GS.banner&&GS.bannerT>0){
    GS.bannerT-=GS.dt; const a=Math.min(1,GS.bannerT*2.5);
    ctx.globalAlpha=a;
    const bnG=ctx.createLinearGradient(W/2-230,78,W/2+230,78);
    bnG.addColorStop(0,pf.lv1+'cc'||'rgba(0,180,255,0.9)'); bnG.addColorStop(1,pf.lv2+'cc'||'rgba(255,0,60,0.9)');
    ctx.fillStyle=bnG; ctx.shadowBlur=20; ctx.shadowColor=pf.lv1||C.cyan;
    ctx.beginPath(); ctx.roundRect(W/2-230,78,460,46,10); ctx.fill(); ctx.shadowBlur=0;
    ctx.fillStyle='#fff'; ctx.font='bold 16px monospace'; ctx.textAlign='center'; ctx.fillText(GS.banner,W/2,106);
    ctx.globalAlpha=1;
  }

  // Vignette
  if(GS.quality!=='LOW'){
    const vg=ctx.createRadialGradient(W/2,H/2,H*0.28,W/2,H/2,H*0.85);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,10,0.55)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
  }
  // NOS screen glow
  if(PL.nosOn){
    const eg=ctx.createRadialGradient(W/2,H/2,H*0.28,W/2,H/2,H*0.9);
    eg.addColorStop(0,'rgba(0,238,255,0)'); eg.addColorStop(1,'rgba(0,238,255,0.1)');
    ctx.fillStyle=eg; ctx.fillRect(0,0,W,H);
  }
}

// ─── SCREEN: SPLASH ──────────────────────────────────────────────────────────
function drawSplash(){
  // Full dark bg with animated gradient
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(W/2,H*0.4,0,W/2,H*0.4,W*0.75);
  rg.addColorStop(0,'rgba(28,105,212,0.12)'); rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
  // Grid
  ctx.strokeStyle='rgba(28,105,212,0.05)'; ctx.lineWidth=1;
  for(let i=0;i<W;i+=70){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
  for(let i=0;i<H;i+=70){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke();}
  // Sweeping light
  const sw=((GS.t*0.06)%1.5-0.25)*W;
  const slg=ctx.createLinearGradient(sw,0,sw+W*0.18,H);
  slg.addColorStop(0,'rgba(28,105,212,0)'); slg.addColorStop(0.5,'rgba(28,105,212,0.05)'); slg.addColorStop(1,'rgba(28,105,212,0)');
  ctx.fillStyle=slg; ctx.fillRect(0,0,W,H);

  // Big BMW logo
  drawBMWLogo(W/2,H*0.32,Math.min(110,H*0.15),GS.t);

  // Title
  ctx.textAlign='center';
  glowText('BMW M3 GTR',W/2,H*0.55,C.white,Math.min(64,W*0.06),25);
  glowText('ULTIMATE EDITION',W/2,H*0.62,C.blue,Math.min(22,W*0.022),12);

  // Profiles preview strip
  const pStrip=['STOCK','RACE','PRO','ULTIMATE','JUNKMAN'];
  const stripW=Math.min(W*0.7,600), stripX=W/2-stripW/2, cellW=stripW/pStrip.length;
  pStrip.forEach((k,i)=>{
    const pf=PROFILES[k];
    const cx2=stripX+i*cellW+cellW/2;
    ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.roundRect(cx2-cellW*0.45,H*0.67,cellW*0.9,26,4); ctx.fill();
    ctx.fillStyle=pf.col; ctx.font='bold 11px monospace'; ctx.textAlign='center';
    ctx.fillText(pf.label,cx2,H*0.67+16);
  });

  // Animated car
  const cIdx=Math.floor(GS.t*0.35)%P_KEYS.length;
  const pf=PROFILES[P_KEYS[cIdx]];
  const cx3=W/2+Math.sin(GS.t*0.5)*30;
  drawCar(ctx,cx3-100,H*0.73,200,100,pf,0.5+Math.sin(GS.t*0.25)*0.07);

  ctx.fillStyle=`rgba(255,255,255,${0.5+Math.sin(GS.t*2.5)*0.4})`;
  ctx.font='14px monospace'; ctx.textAlign='center';
  ctx.fillText('CLICK · TOUCH · ANY KEY',W/2,H-50);
  ctx.fillStyle='rgba(120,120,140,0.8)'; ctx.font='10px monospace';
  ctx.fillText('Physics: mgood7123/Ultimate-BMW-M3-GTR-Race  ·  7 Performance Profiles  ·  1300+ km/h',W/2,H-22);
}

// ─── SCREEN: MENU ────────────────────────────────────────────────────────────
const MITEMS=['QUICK RACE','DRIFT CHALLENGE','TIME TRIAL','PROFILE GARAGE','LEADERBOARD'];
function drawMenu(){
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  const rg2=ctx.createRadialGradient(W*0.2,H*0.5,0,W*0.2,H*0.5,W*0.6);
  rg2.addColorStop(0,'rgba(28,105,212,0.1)'); rg2.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg2; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(28,105,212,0.05)'; ctx.lineWidth=1;
  for(let i=0;i<W;i+=80){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
  for(let i=0;i<H;i+=80){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke();}

  // Left side: logo + car
  const lx=W*0.25;
  drawBMWLogo(lx,H*0.22,Math.min(55,H*0.1),GS.t);
  ctx.fillStyle='#fff'; ctx.font=`bold ${Math.min(32,W*0.03)}px monospace`; ctx.textAlign='center';
  ctx.fillText('BMW M3 GTR',lx,H*0.36);
  ctx.fillStyle=C.blue; ctx.font=`${Math.min(13,W*0.012)}px monospace`;
  ctx.fillText(`LEVEL ${SV.lv}  ·  ${SV.xp}/${SV.xpNext} XP`,lx,H*0.41);
  ctx.fillStyle=C.grey; ctx.font='11px monospace';
  ctx.fillText(`${SV.unlockedP.length}/${P_KEYS.length} PROFILES UNLOCKED`,lx,H*0.45);

  // Car display
  const pi=P_KEYS.indexOf(SV.profile);
  const pf=PROFILES[SV.profile];
  drawCar(ctx,lx-90,H*0.5,180,90,pf,0.5+Math.sin(GS.t*0.4)*0.06);
  ctx.fillStyle=pf.col; ctx.font='bold 12px monospace'; ctx.textAlign='center';
  ctx.shadowBlur=8; ctx.shadowColor=pf.col; ctx.fillText(pf.label,lx,H*0.67); ctx.shadowBlur=0;
  ctx.fillStyle=C.grey; ctx.font='10px monospace'; ctx.fillText(pf.topSpeed+' km/h',lx,H*0.7);

  // Right side: menu
  const mx=W*0.65;
  MITEMS.forEach((item,i)=>{
    const iy=H*0.25+i*70;
    const sel=GS.menuSel===i;
    card(mx-200,iy-28,400,55,sel?'rgba(28,105,212,0.22)':'rgba(255,255,255,0.04)',sel?C.blue:'rgba(28,105,212,0.18)');
    if(sel){ctx.fillStyle=C.blue;ctx.fillRect(mx-200,iy-28,4,55);}
    ctx.fillStyle=sel?'#fff':'#aaa'; ctx.font=`bold ${sel?19:17}px monospace`; ctx.textAlign='center';
    ctx.fillText(item,mx,iy+8);
  });
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText('↑↓ NAVIGATE  ·  ENTER / CLICK SELECT',mx,H-20);
}

// ─── SCREEN: PROFILE SELECT ───────────────────────────────────────────────────
function drawProfileSelect(){
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  const rg3=ctx.createLinearGradient(0,0,0,H);
  rg3.addColorStop(0,'rgba(28,105,212,0.06)'); rg3.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg3; ctx.fillRect(0,0,W,H);

  glowText('SELECT PROFILE',W/2,42,C.white,Math.min(26,W*0.025),15);
  ctx.fillStyle=C.grey; ctx.font='12px monospace'; ctx.textAlign='center';
  ctx.fillText('← → CYCLE  ·  ENTER/TAP CONFIRM  ·  ESC BACK',W/2,65);

  const key=P_KEYS[GS.pSel], pf=PROFILES[key], locked=!SV.unlockedP.includes(key);

  // Big car centered
  const cw=Math.min(320,W*0.35), ch=cw*0.5;
  ctx.globalAlpha=locked?0.25:1;
  drawCar(ctx,W/2-cw/2,H*0.2,cw,ch,pf,0.5+Math.sin(GS.t*0.5)*0.06);
  ctx.globalAlpha=1;
  if(locked){ glowText(`🔒 LEVEL ${pf.unlockLevel} REQUIRED`,W/2,H*0.2+ch+30,C.grey,16,0); }

  // Info card
  const cH=200, cY=H*0.55;
  card(W/2-280,cY,560,cH,C.carbon,locked?C.grey:pf.col,10);
  // Color bar left
  ctx.fillStyle=pf.col; ctx.fillRect(W/2-280,cY,5,cH);
  glowText(pf.label,W/2,cY+38,locked?C.grey:pf.col,Math.min(28,W*0.026),locked?0:14);
  ctx.fillStyle='#bbb'; ctx.font='13px monospace'; ctx.textAlign='center';
  ctx.fillText(pf.desc,W/2,cY+62);

  // Stats
  const stats=[['TOP SPEED',pf.topSpeed/1300,'#aaa'],['ACCEL',Math.min(1,pf.accel/280),'#aaa'],['GRIP',Math.min(1,pf.grip/8.2),'#aaa'],['NOS',pf.nos?1:0,'#aaa']];
  stats.forEach(([lbl,v,lc],i)=>{
    const bx=W/2-220, by=cY+82+i*24, bw=260;
    ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.roundRect(bx,by,bw,12,3); ctx.fill();
    const col2=i===3?(pf.nos?C.nos:C.grey):(locked?C.grey:pf.col);
    if(v>0){ ctx.fillStyle=col2; ctx.beginPath(); ctx.roundRect(bx,by,bw*v,12,3); ctx.fill(); }
    ctx.fillStyle='#888'; ctx.font='9px monospace'; ctx.textAlign='right'; ctx.fillText(lbl,bx-6,by+9);
  });

  // Arrows + counter
  ctx.font='32px monospace'; ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.textAlign='center';
  ctx.fillText('◀',W/2-310,H*0.38+ch*0.3); ctx.fillText('▶',W/2+310,H*0.38+ch*0.3);
  ctx.fillStyle=C.grey; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText(`${GS.pSel+1} / ${P_KEYS.length}`,W/2,H-15);
}

// ─── SCREEN: TRACK SELECT ─────────────────────────────────────────────────────
function drawTrackSelect(){
  const tr=TRACKS[GS.tSel];
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  const sg2=ctx.createLinearGradient(0,0,0,H*0.5);
  sg2.addColorStop(0,tr.skyA); sg2.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg2; ctx.fillRect(0,0,W,H*0.6);

  glowText('SELECT TRACK',W/2,42,C.white,Math.min(26,W*0.025),15);
  ctx.fillStyle=C.grey; ctx.font='12px monospace'; ctx.textAlign='center';
  ctx.fillText('← → CYCLE  ·  ENTER/TAP TO RACE  ·  ESC BACK',W/2,65);

  // Minimap
  const mx2=W/2, my2=H*0.3, mr2=Math.min(90,H*0.13);
  ctx.fillStyle='rgba(0,0,10,0.6)'; ctx.beginPath(); ctx.arc(mx2,my2,mr2+8,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=C.blue; ctx.lineWidth=2; ctx.beginPath();
  segs.forEach((s,i)=>{ const a=(s.z/trackLen)*Math.PI*2-Math.PI/2, r=mr2*(0.72+s.curve*0.06); i===0?ctx.moveTo(mx2+Math.cos(a)*r,my2+Math.sin(a)*r):ctx.lineTo(mx2+Math.cos(a)*r,my2+Math.sin(a)*r); });
  ctx.closePath(); ctx.stroke();

  const locked3=!SV.unlockedT.includes(tr.id);
  const cH2=160, cY2=H*0.52;
  card(W/2-280,cY2,560,cH2,C.carbon,locked3?C.grey:C.blue,10);
  ctx.fillStyle=locked3?C.grey:'#fff'; ctx.font=`bold ${Math.min(22,W*0.02)}px monospace`; ctx.textAlign='center';
  ctx.fillText((locked3?'🔒 ':'')+tr.name,W/2,cY2+32);
  ctx.fillStyle='#888'; ctx.font='13px monospace';
  ctx.fillText(`${tr.laps} LAP${tr.laps>1?'S':''} · ${tr.surf.toUpperCase()} · ${tr.weather.toUpperCase()} · GRIP ×${tr.grip}`,W/2,cY2+55);
  ctx.fillStyle='#666'; ctx.font='11px monospace'; ctx.fillText(tr.desc,W/2,cY2+74);
  if(locked3){ ctx.fillStyle=C.grey; ctx.font='14px monospace'; ctx.fillText('REACH LEVEL '+tr.unlockLv,W/2,cY2+100); }
  const bk=SV.profile+'_'+tr.id, bt=SV.bestTimes[bk];
  if(bt){ const m=Math.floor(bt/60),s=(bt%60).toFixed(2).padStart(5,'0'); ctx.fillStyle=C.gold; ctx.font='12px monospace'; ctx.fillText('BEST '+m+':'+s,W/2,cY2+100); }

  if(!locked3){ glowText('▶ RACE',W/2,cY2+130,C.blue,16,10); }
  ctx.font='28px monospace'; ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.textAlign='center';
  ctx.fillText('◀',W/2-300,H*0.32); ctx.fillText('▶',W/2+300,H*0.32);
  ctx.fillStyle=C.grey; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText(`${GS.tSel+1} / ${TRACKS.length}`,W/2,H-15);
}

// ─── SCREEN: PAUSE ────────────────────────────────────────────────────────────
function drawPause(){
  ctx.fillStyle='rgba(0,0,8,0.78)'; ctx.fillRect(0,0,W,H);
  glowText('PAUSED',W/2,H/2-80,C.white,Math.min(48,W*0.045),22);
  const btns=[['RESUME  (ESC)',H/2-15],['RESTART',H/2+60],['MAIN MENU',H/2+130]];
  btns.forEach(([txt,y],i)=>{
    card(W/2-160,y-32,320,56,i===0?'rgba(28,105,212,0.35)':'rgba(255,255,255,0.08)',i===0?C.blue:'rgba(28,105,212,0.2)');
    ctx.fillStyle='#fff'; ctx.font='bold 17px monospace'; ctx.textAlign='center'; ctx.fillText(txt,W/2,y+8);
  });
}

// ─── SCREEN: RESULTS ─────────────────────────────────────────────────────────
function drawResults(){
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  const rg4=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.65);
  rg4.addColorStop(0,'rgba(28,105,212,0.12)'); rg4.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg4; ctx.fillRect(0,0,W,H);

  const POSN=['1ST','2ND','3RD','4TH','5TH','6TH','7TH','8TH'];
  const pc=PL.pos===1?C.gold:PL.pos<=3?C.blue2:C.grey;
  glowText(POSN[PL.pos-1]||PL.pos+'TH',W/2,H*0.4,pc,Math.min(88,H*0.1),35);
  ctx.fillStyle='#ccc'; ctx.font=`bold ${Math.min(22,W*0.02)}px monospace`; ctx.textAlign='center';
  ctx.fillText('FINISHED '+(POSN[PL.pos-1]||PL.pos+'TH')+' PLACE',W/2,H*0.5);
  if(PL.bestLap<Infinity){ const m=Math.floor(PL.bestLap/60),s=(PL.bestLap%60).toFixed(2).padStart(5,'0'); ctx.fillStyle=C.blue2; ctx.font='15px monospace'; ctx.fillText('BEST LAP: '+m+':'+s,W/2,H*0.57); }
  const xpm=[0,1200,800,500,300,150,80,60][PL.pos]||60;
  glowText('+'+xpm+' XP',W/2,H*0.64,C.gold,Math.min(28,W*0.026),14);
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='13px monospace'; ctx.fillText('PRESS ENTER · CLICK TO CONTINUE',W/2,H-30);
  drawParts();
}

// ─── SCREEN: GARAGE ───────────────────────────────────────────────────────────
function drawGarage(){
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  glowText('PROFILE GARAGE',W/2,42,C.white,Math.min(26,W*0.025),12);
  ctx.fillStyle=C.blue; ctx.font='12px monospace'; ctx.textAlign='center';
  ctx.fillText(`LEVEL ${SV.lv}  ·  ${SV.xp}/${SV.xpNext} XP  ·  ${SV.unlockedP.length}/${P_KEYS.length} UNLOCKED`,W/2,66);

  const cols=Math.min(4,Math.floor(W/220)), rows=Math.ceil(P_KEYS.length/cols);
  const gridW=cols*200+(cols-1)*20, startX=W/2-gridW/2;
  P_KEYS.forEach((key,i)=>{
    const pf=PROFILES[key], unlocked=SV.unlockedP.includes(key), sel=key===SV.profile;
    const col=i%cols, row=Math.floor(i/cols);
    const cx2=startX+col*220+100, cy2=100+row*170;
    card(cx2-95,cy2-80,190,160,sel?'rgba(28,105,212,0.2)':unlocked?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.35)',sel?pf.col:unlocked?'rgba(28,105,212,0.25)':'rgba(255,255,255,0.07)');
    ctx.globalAlpha=unlocked?1:0.22;
    drawCar(ctx,cx2-70,cy2-72,140,70,pf,0.5);
    ctx.globalAlpha=1;
    ctx.fillStyle=unlocked?pf.col:C.grey; ctx.font='bold 12px monospace'; ctx.textAlign='center';
    ctx.shadowBlur=unlocked&&sel?8:0; ctx.shadowColor=pf.col;
    ctx.fillText(pf.label,cx2,cy2+14); ctx.shadowBlur=0;
    ctx.fillStyle='#555'; ctx.font='10px monospace'; ctx.fillText(unlocked?pf.topSpeed+' km/h':'LV'+pf.unlockLv,cx2,cy2+30);
    if(sel){ctx.fillStyle=C.gold; ctx.font='bold 10px monospace'; ctx.fillText('● SELECTED',cx2,cy2+48);}
  });
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText('CLICK A PROFILE TO SELECT  ·  ESC TO BACK',W/2,H-18);
}

// ─── SCREEN: LEADERBOARD ─────────────────────────────────────────────────────
function drawLeaderboard(){
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  glowText('LEADERBOARD',W/2,42,C.white,Math.min(26,W*0.025),12);
  // Best laps
  const laps=Object.entries(SV.bestTimes).slice(0,9);
  ctx.fillStyle=C.blue; ctx.font='bold 14px monospace'; ctx.textAlign='left'; ctx.fillText('BEST LAP TIMES:',50,82);
  if(!laps.length){ctx.fillStyle='#444'; ctx.font='13px monospace'; ctx.fillText('No times yet — go race!',50,108);}
  laps.forEach(([k,t],i)=>{
    const [pr,tr]=k.split('_'), pf=PROFILES[pr], trk=TRACKS.find(t2=>t2.id===tr);
    const m=Math.floor(t/60),s=(t%60).toFixed(2).padStart(5,'0');
    ctx.fillStyle=i===0?C.gold:i<3?C.blue2:'#bbb'; ctx.font='12px monospace'; ctx.textAlign='left';
    ctx.fillText(`${i+1}. ${pf?.label||pr} @ ${trk?.name||tr}: ${m}:${s}`,50,100+i*30);
  });
  // Drift
  const drifts=Object.entries(SV.driftBest).slice(0,7);
  ctx.fillStyle=C.orange; ctx.font='bold 14px monospace'; ctx.textAlign='left'; ctx.fillText('DRIFT HIGH SCORES:',W*0.52,82);
  if(!drifts.length){ctx.fillStyle='#444';ctx.font='13px monospace';ctx.fillText('No scores yet!',W*0.52,108);}
  drifts.forEach(([pr,sc],i)=>{
    const pf=PROFILES[pr]; ctx.fillStyle=i===0?C.gold:'#bbb'; ctx.font='12px monospace';
    ctx.fillText(`${i+1}. ${pf?.label||pr}: ${Math.round(sc).toLocaleString()}`,W*0.52,100+i*30);
  });
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText('ESC · CLICK TO BACK',W/2,H-18);
}

// ─── KEY HANDLER ─────────────────────────────────────────────────────────────
function onKey(code){
  initAudio();
  const en=code==='Enter', esc=code==='Escape';
  const up=code==='ArrowUp'||code==='KeyW', dn=code==='ArrowDown'||code==='KeyS';
  const lt=code==='ArrowLeft'||code==='KeyA', rt=code==='ArrowRight'||code==='KeyD';
  if(GS.screen==='splash'){GS.screen='menu';return;}
  if(GS.screen==='menu'){
    if(up)GS.menuSel=(GS.menuSel-1+MITEMS.length)%MITEMS.length;
    if(dn)GS.menuSel=(GS.menuSel+1)%MITEMS.length;
    if(en)menuSel(); playClick(); return;
  }
  if(GS.screen==='profileSelect'){
    if(lt)GS.pSel=(GS.pSel-1+P_KEYS.length)%P_KEYS.length;
    if(rt)GS.pSel=(GS.pSel+1)%P_KEYS.length;
    if(en)confirmProfile(); if(esc)GS.screen='menu'; playClick(); return;
  }
  if(GS.screen==='trackSelect'){
    if(lt){GS.tSel=(GS.tSel-1+TRACKS.length)%TRACKS.length;buildTrack(TRACKS[GS.tSel]);}
    if(rt){GS.tSel=(GS.tSel+1)%TRACKS.length;buildTrack(TRACKS[GS.tSel]);}
    if(en)startGame(); if(esc)GS.screen='profileSelect'; playClick(); return;
  }
  if(GS.screen==='game'){
    if(esc){GS.screen='pause';return;}
    if(code==='KeyR')resetPL();
  }
  if(GS.screen==='pause'){
    if(esc||en)GS.screen='game';
    if(code==='KeyM')GS.screen='menu';
    if(code==='KeyR')startGame();
    return;
  }
  if(GS.screen==='results'&&(en||esc)){GS.screen='menu'; return;}
  if(GS.screen==='garage'&&esc){GS.screen='menu'; return;}
  if(GS.screen==='leaderboard'&&esc){GS.screen='menu'; return;}
}
function onTap(x,y){
  initAudio(); playClick();
  if(GS.screen==='splash'){GS.screen='menu';return;}
  if(GS.screen==='menu'){
    MITEMS.forEach((_,i)=>{const iy=H*0.25+i*70;if(x>W*0.65-220&&x<W*0.65+220&&y>iy-28&&y<iy+27){GS.menuSel=i;menuSel();}});
    return;
  }
  if(GS.screen==='profileSelect'){
    if(x<W/2-80){GS.pSel=(GS.pSel-1+P_KEYS.length)%P_KEYS.length;}
    else if(x>W/2+80&&y<H*0.5) GS.pSel=(GS.pSel+1)%P_KEYS.length;
    else if(y>H*0.5) confirmProfile();
    return;
  }
  if(GS.screen==='trackSelect'){
    if(x<W/2-80){GS.tSel=(GS.tSel-1+TRACKS.length)%TRACKS.length;buildTrack(TRACKS[GS.tSel]);}
    else if(x>W/2+80&&y<H*0.48){GS.tSel=(GS.tSel+1)%TRACKS.length;buildTrack(TRACKS[GS.tSel]);}
    else if(y>H*0.48) startGame();
    return;
  }
  if(GS.screen==='pause'){
    if(y>H/2-32&&y<H/2+24)GS.screen='game';
    else if(y>H/2+28&&y<H/2+88){startGame();}
    else if(y>H/2+98&&y<H/2+158)GS.screen='menu';
    return;
  }
  if(GS.screen==='results'||GS.screen==='leaderboard'){GS.screen='menu';return;}
  if(GS.screen==='garage'){
    const cols=Math.min(4,Math.floor(W/220));
    const gridW=cols*200+(cols-1)*20,startX=W/2-gridW/2;
    P_KEYS.forEach((key,i)=>{
      if(!SV.unlockedP.includes(key))return;
      const col=i%cols,row=Math.floor(i/cols),cx2=startX+col*220+100,cy2=100+row*170;
      if(x>cx2-95&&x<cx2+95&&y>cy2-80&&y<cy2+80){SV.profile=key;GS.profile=key;save();}
    });
    if(y>H-40)GS.screen='menu';
    return;
  }
}
function menuSel(){
  switch(GS.menuSel){
    case 0:GS.mode='race'; GS.pSel=P_KEYS.indexOf(SV.profile); GS.screen='profileSelect'; break;
    case 1:GS.mode='drift'; GS.pSel=P_KEYS.indexOf(SV.profile); GS.screen='profileSelect'; break;
    case 2:GS.mode='trial'; GS.pSel=P_KEYS.indexOf(SV.profile); GS.screen='profileSelect'; break;
    case 3:GS.screen='garage'; break;
    case 4:GS.screen='leaderboard'; break;
  }
}
function confirmProfile(){
  const key=P_KEYS[GS.pSel]; if(!SV.unlockedP.includes(key))return;
  SV.profile=key; GS.profile=key; save();
  GS.tSel=Math.max(0,TRACKS.findIndex(t=>SV.unlockedT.includes(t.id)));
  buildTrack(TRACKS[GS.tSel]);
  GS.screen='trackSelect';
}
function startGame(){
  const tr=TRACKS[GS.tSel]; if(!SV.unlockedT.includes(tr.id))return;
  GS.trackIdx=GS.tSel; buildTrack(tr); resetPL(); parts=[];
  if(GS.mode==='race')initAI(); else AI=[];
  GS.screen='game'; GS.fade=1;
}

document.addEventListener('visibilitychange',()=>{if(document.hidden&&GS.screen==='game')GS.screen='pause';});

// ─── MAIN LOOP ────────────────────────────────────────────────────────────────
function loop(ts){
  if(!GS.lastMs)GS.lastMs=ts;
  GS.dt=Math.min((ts-GS.lastMs)/1000, 0.05);
  GS.lastMs=ts; GS.t+=GS.dt; GS.frame++;
  pollGP(); tickParts(GS.dt);

  switch(GS.screen){
    case 'splash':        drawSplash(); break;
    case 'menu':          drawMenu(); break;
    case 'profileSelect': drawProfileSelect(); break;
    case 'trackSelect':   drawTrackSelect(); break;
    case 'game':
      drawBG(curTR());
      renderRoad();
      if(GS.mode==='race')drawAICars();
      drawPlayerCar();
      drawParts();
      updatePL(GS.dt);
      if(GS.mode==='race')updateAI(GS.dt);
      drawHUD();
      break;
    case 'pause':
      drawBG(curTR()); renderRoad(); drawPlayerCar(); drawPause(); break;
    case 'results':       drawResults(); break;
    case 'garage':        drawGarage(); break;
    case 'leaderboard':   drawLeaderboard(); break;
  }

  // Fade overlay
  if(GS.fade>0){
    ctx.fillStyle=`rgba(0,0,8,${GS.fade})`; ctx.fillRect(0,0,W,H);
    GS.fade=Math.max(0,GS.fade-GS.dt*2.5);
  }

  requestAnimationFrame(loop);
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
(function detectQuality(){
  let f=0,t0=performance.now();
  function fr(){
    const b=new OffscreenCanvas(320,240),bx=b.getContext('2d');
    for(let i=0;i<30;i++){bx.fillStyle='#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0');bx.fillRect(Math.random()*320,Math.random()*240,50,50);}
    if(++f<7)requestAnimationFrame(fr);
    else{const fps=f/((performance.now()-t0)/1000);GS.quality=fps<25?'LOW':fps<44?'MEDIUM':'HIGH';requestAnimationFrame(loop);}
  }
  requestAnimationFrame(fr);
})();
