'use strict';
// ═══════════════════════════════════════════════════════════════
//  BMW M3 GTR — ULTIMATE EDITION  |  game.js
//  Physics profiles sourced from mgood7123/Ultimate-BMW-M3-GTR-Race
// ═══════════════════════════════════════════════════════════════

// ── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  bg:'#030308', sky1:'#060618', sky2:'#0d1a3a', horizon:'#1a3060',
  road1:'#1a1a1a', road2:'#222', rumbleR:'#cc2222', rumbleW:'#dddddd',
  grass1:'#0a1a0a', grass2:'#0d200d',
  blue:'#1C69D4', blue2:'#00AAFF', darkblue:'#051030',
  red:'#E63946', orange:'#FF6B00', gold:'#FFD700',
  white:'#F2F4FF', grey:'#888', dark:'#111',
  nos:'#00EEFF', nosGlow:'rgba(0,238,255,0.4)',
  carbon:'rgba(20,20,30,0.92)',
};

// ── BMW M3 GTR PHYSICS PROFILES (from mod data) ──────────────────────────────
const PROFILES = {
  STOCK: {
    label:'STOCK', topSpeed:330, mass:1300,
    torque:[170,251,340,428,467,452,411,375,350],
    finalGear:3.4, gearRatios:[0,4.1,2.53,1.67,1.23,1,0.83],
    maxRPM:9500, redLine:8500, shiftSpeed:0.25,
    drag:0.32, aero:0.3, brakeF:475, brakeR:600, eBrake:925,
    dynGripF:2.0, dynGripR:2.0, statGripF:2.2, statGripR:2.3,
    nos:false, nosCapacity:0, nosFlow:0, nosTorque:0,
    handling:75, unlockLevel:0,
    col:'#4488CC', bodyCol:'#1C5FAA', stripeCol:'#FFFFFF',
    desc:'Balanced street spec. Top speed 330 km/h.',
  },
  RACE: {
    label:'RACE', topSpeed:400, mass:1300,
    torque:[170,251,340,428,467,452,511,475,450],
    finalGear:2.7, gearRatios:[0,4.8,2.53,1.67,1.23,1,0.83],
    maxRPM:10000, redLine:9500, shiftSpeed:0.10,
    drag:0.32, aero:0.3, brakeF:675, brakeR:800, eBrake:625,
    dynGripF:2.2, dynGripR:2.3, statGripF:2.2, statGripR:2.3,
    nos:true, nosCapacity:999, nosFlow:999, nosTorque:2,
    handling:99, unlockLevel:3,
    col:'#2266DD', bodyCol:'#1144BB', stripeCol:'#FF4400',
    desc:'Near-infinite NOS. Top speed 400 km/h.',
  },
  PRO: {
    label:'PRO', topSpeed:440, mass:700,
    torque:[171,251,340,428,467,452,911,975,950],
    finalGear:2.7, gearRatios:[0,4.8,2.53,1.67,1.23,1,0.83],
    maxRPM:10000, redLine:9500, shiftSpeed:0.10,
    drag:0.32, aero:0.3, brakeF:675, brakeR:800, eBrake:625,
    dynGripF:2.2, dynGripR:2.3, statGripF:2.2, statGripR:2.3,
    nos:true, nosCapacity:999, nosFlow:999, nosTorque:2,
    handling:99, unlockLevel:5,
    col:'#FF6600', bodyCol:'#CC4400', stripeCol:'#FFFF00',
    desc:'Half the mass. Top speed 440 km/h.',
  },
  ULTIMATE: {
    label:'ULTIMATE', topSpeed:470, mass:700,
    torque:[171,251,340,428,467,452,811,775,750],
    finalGear:2.7, gearRatios:[0,4.8,2.53,1.67,1.23,1,0.83],
    maxRPM:10000, redLine:9500, shiftSpeed:0.10,
    drag:0.30, aero:0.28, brakeF:675, brakeR:800, eBrake:625,
    dynGripF:2.2, dynGripR:2.3, statGripF:2.2, statGripR:2.3,
    nos:true, nosCapacity:999, nosFlow:999, nosTorque:2,
    handling:99, unlockLevel:7,
    col:'#CC00FF', bodyCol:'#8800CC', stripeCol:'#00FFFF',
    desc:'Refined beast. Top speed 470 km/h.',
  },
  JUNKMAN: {
    label:'JUNKMAN', topSpeed:548, mass:700,
    torque:[171,251,340,428,467,852,911,975,950],
    finalGear:2.0, gearRatios:[0,4.8,2.53,1.67,1.23,1,0.83],
    maxRPM:10000, redLine:9500, shiftSpeed:0.08,
    drag:0.28, aero:0.25, brakeF:1775, brakeR:1700, eBrake:425,
    dynGripF:8.2, dynGripR:8.2, statGripF:8.2, statGripR:7.1,
    nos:true, nosCapacity:999, nosFlow:999, nosTorque:2,
    handling:99, unlockLevel:9,
    col:'#FF0044', bodyCol:'#CC0033', stripeCol:'#FFFF00',
    desc:'Ridiculous grip & brakes. Top speed 548 km/h.',
  },
  TOMAHAWK_X: {
    label:'TOMAHAWK X', topSpeed:780, mass:500,
    torque:[2471,2551,2640,2728,2767,2752,3011,3075,3050],
    finalGear:1.8, gearRatios:[0,4.8,2.53,1.67,1.23,1,0.83],
    maxRPM:10000, redLine:9500, shiftSpeed:0.05,
    drag:0.20, aero:0.20, brakeF:1775, brakeR:1700, eBrake:425,
    dynGripF:8.2, dynGripR:8.2, statGripF:8.2, statGripR:7.1,
    nos:true, nosCapacity:999, nosFlow:999, nosTorque:2,
    handling:99, unlockLevel:11,
    col:'#00FFAA', bodyCol:'#009966', stripeCol:'#FF0000',
    desc:'660–780 km/h. Use 0.375x game speed.',
  },
  TOMAHAWK_X2: {
    label:'TOMAHAWK X2', topSpeed:1300, mass:500,
    torque:[4471,4551,5640,5728,5767,5752,6011,7075,8050],
    finalGear:1.4, gearRatios:[0,4.8,2.53,1.67,1.23,1,0.83],
    maxRPM:10000, redLine:9500, shiftSpeed:0.03,
    drag:0.18, aero:0.18, brakeF:1775, brakeR:1700, eBrake:425,
    dynGripF:8.2, dynGripR:8.2, statGripF:8.2, statGripR:7.1,
    nos:true, nosCapacity:999, nosFlow:999, nosTorque:2,
    handling:99, unlockLevel:13,
    col:'#FF00FF', bodyCol:'#CC00CC', stripeCol:'#00FFFF',
    desc:'980–1300+ km/h. USE 0.175x SPEED.',
  },
};
const PROFILE_ORDER = ['STOCK','RACE','PRO','ULTIMATE','JUNKMAN','TOMAHAWK_X','TOMAHAWK_X2'];

// ── TRACKS ────────────────────────────────────────────────────────────────────
const TRACKS = [
  { id:'highway',   name:'ROCKPORT HIGHWAY',    laps:2, weather:'night',  surface:'tarmac', skyTop:'#030308', skyBot:'#0a1530', hillAmp:20,  curveAmp:0.6, unlockLevel:0, desc:'City highway — NFS Most Wanted style' },
  { id:'nurburgring',name:'NÜRBURGRING',         laps:2, weather:'day',   surface:'tarmac', skyTop:'#0d1a3a', skyBot:'#2a5080', hillAmp:70,  curveAmp:0.9, unlockLevel:2, desc:'73 turns of pure challenge' },
  { id:'sprint',    name:'SPRINT — BAYVIEW',     laps:1, weather:'dusk',  surface:'tarmac', skyTop:'#1a0a00', skyBot:'#ff6600', hillAmp:10,  curveAmp:0.3, unlockLevel:0, desc:'Straight sprint track' },
  { id:'mountain',  name:'ALPINE PASS',          laps:2, weather:'snow',  surface:'ice',    skyTop:'#08101c', skyBot:'#1a2a44', hillAmp:90,  curveAmp:1.1, unlockLevel:4, desc:'Ice and snow — brutal grip loss' },
  { id:'desert',    name:'DESERT STRIP',         laps:3, weather:'heat',  surface:'sand',   skyTop:'#1a0a00', skyBot:'#cc6600', hillAmp:5,   curveAmp:0.2, unlockLevel:3, desc:'Flat and fast — sand reduces grip' },
  { id:'circuit',   name:'GT CIRCUIT',           laps:3, weather:'day',   surface:'tarmac', skyTop:'#0d1a3a', skyBot:'#3a5a88', hillAmp:30,  curveAmp:0.8, unlockLevel:5, desc:'Dedicated circuit — fast and technical' },
  { id:'tokyo',     name:'TOKYO MIDNIGHT',       laps:2, weather:'rain',  surface:'wet',    skyTop:'#020208', skyBot:'#060614', hillAmp:15,  curveAmp:0.7, unlockLevel:6, desc:'Wet neon streets — 0.8x grip' },
];

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d', { alpha: false });
let W = 0, H = 0, DPR = 1;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W   = window.innerWidth;
  H   = window.innerHeight;
  canvas.width  = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();
window.addEventListener('resize', () => { resize(); buildCarSprites(); });

// ── SAVE / LOAD ───────────────────────────────────────────────────────────────
function defSave() {
  return { profile:'STOCK', xp:0, level:1, xpNext:1000,
           unlockedProfiles:['STOCK'], unlockedTracks:['highway','sprint'],
           bestTimes:{}, driftBest:{}, achievements:[], settings:{ sfx:true, music:false } };
}
let S = (() => { try { return JSON.parse(localStorage.getItem('bmwM3GTR') || 'null') || defSave(); } catch(e){ return defSave(); }})();
function persist() { try { localStorage.setItem('bmwM3GTR', JSON.stringify(S)); } catch(e){} }
function addXP(n) {
  S.xp += n;
  while (S.xp >= S.xpNext) { S.xp -= S.xpNext; S.level++; S.xpNext = Math.floor(S.xpNext * 1.4); unlockForLevel(S.level); }
  persist();
}
function unlockForLevel(lv) {
  PROFILE_ORDER.forEach(k => { const p = PROFILES[k]; if (p.unlockLevel === lv && !S.unlockedProfiles.includes(k)) { S.unlockedProfiles.push(k); showUnlock(k); }});
  TRACKS.forEach(t => { if (t.unlockLevel === lv && !S.unlockedTracks.includes(t.id)) { S.unlockedTracks.push(t.id); }});
}
let unlockBanner = null;
function showUnlock(key) { unlockBanner = { text: '🔓 UNLOCKED: ' + PROFILES[key].label, timer: 3 }; }

// ── AUDIO ─────────────────────────────────────────────────────────────────────
let AC, masterGain, engOsc, engGain, engFilt, nosOsc, nosGain, squealSrc, squealGain;
let audioReady = false;
function initAudio() {
  if (audioReady) return;
  audioReady = true;
  AC = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = AC.createGain(); masterGain.gain.value = S.settings.sfx ? 0.8 : 0;
  masterGain.connect(AC.destination);
  // Engine oscillator stack
  engOsc  = AC.createOscillator(); engOsc.type = 'sawtooth'; engOsc.frequency.value = 80;
  const engOsc2 = AC.createOscillator(); engOsc2.type = 'square'; engOsc2.frequency.value = 40;
  engFilt = AC.createBiquadFilter(); engFilt.type = 'lowpass'; engFilt.frequency.value = 600; engFilt.Q.value = 3;
  engGain = AC.createGain(); engGain.gain.value = 0.12;
  engOsc.connect(engFilt); engOsc2.connect(engFilt); engFilt.connect(engGain); engGain.connect(masterGain);
  engOsc.start(); engOsc2.start();
  // NOS oscillator
  nosOsc  = AC.createOscillator(); nosOsc.type = 'sine'; nosOsc.frequency.value = 220;
  nosGain = AC.createGain(); nosGain.gain.value = 0;
  nosOsc.connect(nosGain); nosGain.connect(masterGain); nosOsc.start();
}
function updateEngineSound(rpm, profile) {
  if (!audioReady) return;
  const maxRPM = PROFILES[profile].maxRPM;
  const r = Math.max(0, Math.min(1, rpm / maxRPM));
  const baseFreq = profile.startsWith('TOMAHAWK') ? 200 : 80;
  engOsc.frequency.setTargetAtTime(baseFreq + r * 600, AC.currentTime, 0.04);
  engGain.gain.setTargetAtTime(0.05 + r * 0.18, AC.currentTime, 0.04);
  engFilt.frequency.setTargetAtTime(300 + r * 3000, AC.currentTime, 0.04);
}
function setNosSound(on) {
  if (!audioReady) return;
  nosGain.gain.setTargetAtTime(on ? 0.15 : 0, AC.currentTime, 0.05);
  if (on) nosOsc.frequency.setTargetAtTime(180 + Math.random() * 40, AC.currentTime, 0.1);
}
function playSFX(type) {
  if (!audioReady || !S.settings.sfx) return;
  const o = AC.createOscillator(), g = AC.createGain();
  if (type === 'click') { o.type='sine'; o.frequency.value=660; g.gain.setValueAtTime(0.2,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.07); }
  if (type === 'shift') { o.type='square'; o.frequency.value=120; g.gain.setValueAtTime(0.3,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.1); }
  if (type === 'thud')  { o.type='sawtooth'; o.frequency.value=50; g.gain.setValueAtTime(0.5,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.2); }
  if (type === 'win')   { o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(0.3,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.5); }
  o.connect(g); g.connect(masterGain); o.start(); o.stop(AC.currentTime + 0.5);
}
function startSqueal() {
  if (!audioReady || squealSrc) return;
  const bufsz = AC.sampleRate * 0.5;
  const buf = AC.createBuffer(1, bufsz, AC.sampleRate);
  const d = buf.getChannelData(0); for (let i=0;i<bufsz;i++) d[i]=(Math.random()*2-1);
  squealSrc = AC.createBufferSource(); squealSrc.buffer = buf; squealSrc.loop = true;
  const flt = AC.createBiquadFilter(); flt.type='bandpass'; flt.frequency.value=3500; flt.Q.value=0.7;
  squealGain = AC.createGain(); squealGain.gain.value = 0.07;
  squealSrc.connect(flt); flt.connect(squealGain); squealGain.connect(masterGain); squealSrc.start();
}
function stopSqueal() {
  if (!squealSrc) return;
  squealGain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 0.2);
  squealSrc.stop(AC.currentTime + 0.2); squealSrc = null;
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
const KEY = {};
window.addEventListener('keydown', e => { KEY[e.code] = true; handleKey(e.code); });
window.addEventListener('keyup',   e => { KEY[e.code] = false; });

let TOUCH = { lx:0, ly:0, lid:-1, rx:false, rid:-1, bx:false, bid:-1 };
let joyBase = { x:0, y:0 };

canvas.addEventListener('touchstart', e => { e.preventDefault(); initAudio(); for (const t of e.changedTouches) onTS(t); }, {passive:false});
canvas.addEventListener('touchmove',  e => { e.preventDefault(); for (const t of e.changedTouches) onTM(t); }, {passive:false});
canvas.addEventListener('touchend',   e => { e.preventDefault(); for (const t of e.changedTouches) onTE(t); }, {passive:false});

function gc(cx, cy) { const r = canvas.getBoundingClientRect(); return { x:(cx-r.left)/r.width*W, y:(cy-r.top)/r.height*H }; }

function onTS(t) {
  const {x,y} = gc(t.clientX, t.clientY);
  if (isPlaying()) {
    if (x < W*0.45) {
      TOUCH.lid = t.identifier; joyBase.x = x; joyBase.y = y; TOUCH.lx = 0; TOUCH.ly = 0;
    } else if (x > W*0.65 && y > H*0.6) {
      TOUCH.rid = t.identifier; TOUCH.rx = true;
    } else if (x > W*0.4 && y < H*0.5) {
      TOUCH.bid = t.identifier; TOUCH.bx = true;
    }
    return;
  }
  handleTap(x, y);
}
function onTM(t) {
  if (t.identifier === TOUCH.lid) {
    const {x,y} = gc(t.clientX, t.clientY);
    TOUCH.lx = Math.max(-1, Math.min(1, (x - joyBase.x) / 70));
    TOUCH.ly = Math.max(-1, Math.min(1, (y - joyBase.y) / 70));
  }
}
function onTE(t) {
  if (t.identifier === TOUCH.lid) { TOUCH.lid = -1; TOUCH.lx = 0; TOUCH.ly = 0; }
  if (t.identifier === TOUCH.rid) { TOUCH.rid = -1; TOUCH.rx = false; }
  if (t.identifier === TOUCH.bid) { TOUCH.bid = -1; TOUCH.bx = false; }
}

let GP = null;
window.addEventListener('gamepadconnected',    e => { GP = e.gamepad; });
window.addEventListener('gamepaddisconnected', () => { GP = null; });
function pollGP() {
  if (!GP) return;
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  GP = pads[GP.index] || GP;
}

function throttle() { return Math.max(0, KEY['ArrowUp']||KEY['KeyW']?1:0, TOUCH.ly < -0.2 ? -TOUCH.ly : 0, GP?(GP.buttons[7]?.value||0):0); }
function brake()    { return Math.max(0, KEY['ArrowDown']||KEY['KeyS']?1:0, TOUCH.ly > 0.2 ? TOUCH.ly : 0, GP?(GP.buttons[6]?.value||0):0); }
function steer()    { return (KEY['ArrowLeft']||KEY['KeyA']?-1:0)+(KEY['ArrowRight']||KEY['KeyD']?1:0) + TOUCH.lx + (GP?GP.axes[0]:0); }
function handbrake(){ return KEY['Space'] || TOUCH.rx || (GP?GP.buttons[0]?.pressed:false); }
function nosBtn()   { return KEY['ShiftLeft']||KEY['ShiftRight'] || TOUCH.bx || (GP?GP.buttons[1]?.pressed:false); }

// ── GAME STATE ────────────────────────────────────────────────────────────────
let GS = {
  screen: 'splash',  // splash|menu|profileSelect|trackSelect|game|pause|results|garage|board
  profile: 'STOCK',
  track: TRACKS[0],
  mode: 'race',      // race|drift|trial
  menuSel: 0,
  profileSel: 0,
  trackSel: 0,
  t: 0,              // global time
  dt: 0,
  lastMs: 0,
  frame: 0,
  fadeAlpha: 1,
  fadeDir: -1,       // -1 = fade in, 1 = fade out
  fadeTarget: '',
  quality: 'HIGH',
};

function isPlaying() { return ['game','drift','trial'].includes(GS.screen); }

// ── ROAD SYSTEM ───────────────────────────────────────────────────────────────
const SEG_LEN   = 200;
const ROAD_W    = 2200;
const DRAW_DIST = 220;
const CAM_H     = 1100;
const CAM_DEPTH = 0.84;
const GUARD_H   = 80;

let segs = [];
let trackLen = 0;
let camZ = 0;

function buildTrack(track) {
  segs = [];
  const N = 1000;
  for (let i = 0; i < N; i++) {
    const t2 = i / N;
    let curve = 0, hill = 0;
    const amp = track.curveAmp, ha = track.hillAmp;
    curve = Math.sin(t2*Math.PI*7)*amp + Math.cos(t2*Math.PI*3)*amp*0.4;
    hill  = Math.sin(t2*Math.PI*5)*ha + Math.cos(t2*Math.PI*9)*ha*0.3;
    if (track.id==='sprint') { curve=Math.sin(t2*Math.PI*2)*0.2; hill=0; }
    if (track.id==='desert') { curve=Math.sin(t2*Math.PI*3)*0.15; hill=Math.sin(t2*Math.PI*8)*3; }
    const band = Math.floor(i/8)%2;
    segs.push({
      z: i * SEG_LEN,
      curve, hill,
      roadC:  band ? P.road1 : P.road2,
      grassC: band ? (track.id==='mountain'?'#c8d8e8':'#0a1a0a') : (track.id==='mountain'?'#d0dcea':'#0d200d'),
      rumbleC: band ? P.rumbleR : P.rumbleW,
      laneC: band ? '#FFFFFF' : 'transparent',
      projX:0, projY:0, projW:0, projScale:0,
    });
  }
  trackLen = segs.length * SEG_LEN;
}
buildTrack(TRACKS[0]);

function projectSeg(seg, camX, camH, screenW, screenH) {
  seg.projScale = CAM_DEPTH / Math.max(0.001, seg.z - camZ);
  seg.projX = (screenW / 2) * (1 + seg.projScale * (-camX / (ROAD_W * 0.5)));
  seg.projY = (screenH / 2) * (1 - seg.projScale * (camH / CAM_H));
  seg.projW = seg.projScale * ROAD_W * screenW / 2;
}
function getSegAt(z) { return segs[Math.floor((z % trackLen) / SEG_LEN) % segs.length]; }

// ── CAR SPRITES ───────────────────────────────────────────────────────────────
const SPRITE_W = 128, SPRITE_H = 64;
const ANGLES   = 12;
const sprSheet = new OffscreenCanvas(SPRITE_W * ANGLES, SPRITE_H * PROFILES.length);
const ssCtx    = sprSheet.getContext('2d');

function buildCarSprites() {
  const pKeys = PROFILE_ORDER;
  ssCtx.clearRect(0, 0, sprSheet.width, sprSheet.height);
  pKeys.forEach((key, pi) => {
    const pf = PROFILES[key];
    for (let ai = 0; ai < ANGLES; ai++) {
      drawM3GTR(ssCtx, ai * SPRITE_W, pi * SPRITE_H, SPRITE_W, SPRITE_H, pf, ai / ANGLES);
    }
  });
}

function drawM3GTR(ctx2, ox, oy, w, h, pf, angleNorm) {
  ctx2.save();
  ctx2.translate(ox + w/2, oy + h * 0.58);
  const tilt = (angleNorm - 0.5) * Math.PI * 0.5;
  const squeeze = 1 - Math.abs(angleNorm - 0.5) * 0.3;
  ctx2.scale(squeeze, 1);

  const bw = w*0.44, bh = h*0.30;

  // Ground shadow
  ctx2.fillStyle = 'rgba(0,0,0,0.35)';
  ctx2.beginPath(); ctx2.ellipse(0, bh*0.4, bw*0.85, bh*0.25, 0, 0, Math.PI*2); ctx2.fill();

  // Body (wide E46 M3 GTR shape)
  const bodyGrad = ctx2.createLinearGradient(-bw, -bh, bw, bh*0.5);
  bodyGrad.addColorStop(0, lighten(pf.bodyCol, 60));
  bodyGrad.addColorStop(0.4, pf.bodyCol);
  bodyGrad.addColorStop(1, darken(pf.bodyCol, 40));
  ctx2.fillStyle = bodyGrad;
  ctx2.beginPath();
  ctx2.moveTo(-bw,    bh*0.3);
  ctx2.lineTo(-bw*0.95,-bh*0.0);
  ctx2.lineTo(-bw*0.7, -bh*0.8);
  ctx2.lineTo(-bw*0.1, -bh*1.0);
  ctx2.lineTo( bw*0.1, -bh*1.0);
  ctx2.lineTo( bw*0.7, -bh*0.8);
  ctx2.lineTo( bw*0.95,-bh*0.0);
  ctx2.lineTo( bw,     bh*0.3);
  ctx2.lineTo( bw*0.8, bh*0.5);
  ctx2.lineTo(-bw*0.8, bh*0.5);
  ctx2.closePath(); ctx2.fill();

  // Racing stripes
  ctx2.fillStyle = pf.stripeCol;
  ctx2.globalAlpha = 0.7;
  ctx2.fillRect(-bw*0.12, -bh*1.05, bw*0.10, bh*2.0);
  ctx2.fillRect( bw*0.04, -bh*1.05, bw*0.07, bh*2.0);
  ctx2.globalAlpha = 1;

  // Roof / cabin
  ctx2.fillStyle = 'rgba(10,10,20,0.95)';
  ctx2.beginPath();
  ctx2.moveTo(-bw*0.45, -bh*0.1);
  ctx2.lineTo(-bw*0.38, -bh*0.9);
  ctx2.lineTo( bw*0.38, -bh*0.9);
  ctx2.lineTo( bw*0.45, -bh*0.1);
  ctx2.closePath(); ctx2.fill();

  // Windshield
  const wg = ctx2.createLinearGradient(-bw*0.3,-bh*0.85, bw*0.3,-bh*0.1);
  wg.addColorStop(0,'rgba(80,150,255,0.6)'); wg.addColorStop(1,'rgba(40,80,180,0.25)');
  ctx2.fillStyle = wg;
  ctx2.beginPath();
  ctx2.moveTo(-bw*0.36, -bh*0.12);
  ctx2.lineTo(-bw*0.30, -bh*0.78);
  ctx2.lineTo( bw*0.30, -bh*0.78);
  ctx2.lineTo( bw*0.36, -bh*0.12);
  ctx2.closePath(); ctx2.fill();

  // BMW kidney grille (front)
  if (angleNorm < 0.35 || angleNorm > 0.65) {
    ctx2.fillStyle = P.blue;
    ctx2.beginPath(); ctx2.roundRect(-bw*0.18, bh*0.3, bw*0.14, bh*0.22, 4); ctx2.fill();
    ctx2.beginPath(); ctx2.roundRect( bw*0.04, bh*0.3, bw*0.14, bh*0.22, 4); ctx2.fill();
    // Headlights
    ctx2.fillStyle = '#FFFFCC';
    ctx2.shadowBlur = 8; ctx2.shadowColor = '#FFFFAA';
    ctx2.beginPath(); ctx2.roundRect(-bw*0.38, bh*0.05, bw*0.16, bh*0.18, 3); ctx2.fill();
    ctx2.beginPath(); ctx2.roundRect( bw*0.22, bh*0.05, bw*0.16, bh*0.18, 3); ctx2.fill();
    ctx2.shadowBlur = 0;
  }

  // Rear taillights
  if (angleNorm > 0.35 && angleNorm < 0.75) {
    ctx2.fillStyle = '#FF2200';
    ctx2.shadowBlur = 6; ctx2.shadowColor = '#FF4400';
    ctx2.beginPath(); ctx2.roundRect(-bw*0.42, bh*0.0, bw*0.18, bh*0.16, 3); ctx2.fill();
    ctx2.beginPath(); ctx2.roundRect( bw*0.24, bh*0.0, bw*0.18, bh*0.16, 3); ctx2.fill();
    ctx2.shadowBlur = 0;
  }

  // Rear wing
  const wingVis = angleNorm > 0.2 && angleNorm < 0.9;
  if (wingVis) {
    ctx2.fillStyle = darken(pf.bodyCol, 20);
    // Wing mounts
    ctx2.fillRect(-bw*0.28, -bh*1.05, bw*0.05, bh*0.35);
    ctx2.fillRect( bw*0.23, -bh*1.05, bw*0.05, bh*0.35);
    // Wing blade
    ctx2.fillStyle = pf.col;
    ctx2.beginPath(); ctx2.roundRect(-bw*0.45, -bh*1.12, bw*0.90, bh*0.14, 4); ctx2.fill();
  }

  // Wheels (4 corner positions)
  const wpos = [[-bw*0.75,-bh*0.0],[bw*0.75,-bh*0.0],[-bw*0.62,bh*0.45],[bw*0.62,bh*0.45]];
  wpos.forEach(([wx,wy]) => {
    const wrad = bh*0.28;
    ctx2.fillStyle = '#111';
    ctx2.beginPath(); ctx2.ellipse(wx, wy, wrad*0.55, wrad, 0, 0, Math.PI*2); ctx2.fill();
    ctx2.fillStyle = '#333';
    ctx2.beginPath(); ctx2.ellipse(wx, wy, wrad*0.3, wrad*0.72, 0, 0, Math.PI*2); ctx2.fill();
    ctx2.fillStyle = '#888';
    ctx2.beginPath(); ctx2.arc(wx, wy, wrad*0.12, 0, Math.PI*2); ctx2.fill();
  });

  // Carbon splitter
  ctx2.fillStyle = '#0a0a0a';
  ctx2.beginPath(); ctx2.roundRect(-bw*0.85, bh*0.42, bw*1.7, bh*0.12, 2); ctx2.fill();

  // Profile glow for TOMAHAWK
  if (pf.label.startsWith('TOMAHAWK')) {
    ctx2.shadowBlur = 20; ctx2.shadowColor = pf.col;
    ctx2.strokeStyle = pf.col; ctx2.lineWidth = 2;
    ctx2.beginPath(); ctx2.ellipse(0, 0, bw*0.9, bh*0.7, 0, 0, Math.PI*2); ctx2.stroke();
    ctx2.shadowBlur = 0;
  }

  ctx2.restore();
}

function lighten(hex, amt) { return shiftHex(hex, amt); }
function darken(hex, amt)  { return shiftHex(hex, -amt); }
function shiftHex(hex, amt) {
  const n = parseInt(hex.replace('#',''),16)||0;
  const r = Math.min(255,Math.max(0,(n>>16)+amt));
  const g = Math.min(255,Math.max(0,((n>>8)&0xff)+amt));
  const b = Math.min(255,Math.max(0,(n&0xff)+amt));
  return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')}`;
}
buildCarSprites();

// ── PLAYER ────────────────────────────────────────────────────────────────────
let PL = {};
function resetPlayer() {
  const pf = PROFILES[GS.profile];
  PL = {
    z: 300, x: 0,
    speed: 0, vx: 0, angVel: 0, angle: 0,
    gear: 1, rpm: 800,
    nos: pf.nosCapacity, nosActive: false,
    drifting: false, driftAngle: 0, driftScore: 0, combo: 1, comboFill: 0,
    lap: 0, lapTime: 0, bestLap: Infinity, sects: [false,false,false],
    ghostRec: [], ghostPlay: [], ghostIdx: 0,
    wallHits: 0, pos: 1, finished: false, finTimer: 0,
    shakeX: 0, shakeY: 0,
  };
  camZ = PL.z - 1500;
}

function updatePlayer(dt) {
  const pf = PROFILES[GS.profile];
  const tr = GS.track;
  const surfGrip = {tarmac:1.0,ice:0.18,sand:0.45,wet:0.72,mixed:0.8}[tr.surface] || 1.0;

  const th = throttle(), br = brake(), st = clamp(steer(),-1,1), hb = handbrake(), nos = nosBtn();
  const kmh = PL.speed * 3.6;
  const absKmh = Math.abs(kmh);

  // NOS
  PL.nosActive = nos && pf.nos && PL.nos > 0;
  if (PL.nosActive) { PL.nos = Math.max(0, PL.nos - dt * 50); }
  setNosSound(PL.nosActive);

  // Torque from curve
  const rpmNorm = Math.max(0, Math.min(1, (PL.rpm - 800) / (pf.maxRPM - 800)));
  const torqueIdx = Math.floor(rpmNorm * (pf.torque.length-1));
  const baseTorque = pf.torque[torqueIdx] || pf.torque[0];
  const nosMult = PL.nosActive ? (1 + pf.nosTorque) : 1;
  const wheelTorque = baseTorque * nosMult * pf.finalGear * (pf.gearRatios[Math.min(PL.gear, pf.gearRatios.length-1)] || 1);

  // Acceleration
  const accelForce = th * wheelTorque / (pf.mass * 3.6) * dt * 2.2;
  const brakeForce = br * (pf.brakeF + pf.brakeR) / (pf.mass * 2) * dt * 0.018;
  const drag = pf.drag * 0.0003 * PL.speed * Math.abs(PL.speed);
  const aeroDrag = pf.aero * 0.00005 * PL.speed * Math.abs(PL.speed);

  PL.speed += accelForce - brakeForce * Math.sign(PL.speed) - drag - aeroDrag;
  const maxSpd = (pf.topSpeed / 3.6);
  PL.speed = clamp(PL.speed, -maxSpd*0.3, maxSpd);

  // Gear logic
  const gearSpeeds = [0, 40, 90, 150, 220, 300, 400, 550];
  const prevG = PL.gear;
  while (PL.gear < pf.gearRatios.length-1 && absKmh > gearSpeeds[Math.min(PL.gear+1, gearSpeeds.length-1)]) PL.gear++;
  while (PL.gear > 1 && absKmh < gearSpeeds[PL.gear] * 0.55) PL.gear--;
  PL.gear = clamp(PL.gear, 1, pf.gearRatios.length-1);
  if (PL.gear !== prevG) playSFX('shift');
  // RPM
  const gearSpeedRange = gearSpeeds[Math.min(PL.gear+1,gearSpeeds.length-1)] - gearSpeeds[PL.gear];
  PL.rpm = 800 + ((absKmh - gearSpeeds[PL.gear]) / Math.max(1, gearSpeedRange)) * (pf.maxRPM - 800);
  PL.rpm = clamp(PL.rpm, 800, pf.maxRPM);
  updateEngineSound(PL.rpm, GS.profile);

  // Steering
  const steerStr = 2.8 - absKmh * 0.0035;
  if (Math.abs(PL.speed) > 0.5) {
    PL.angVel += st * Math.max(0.3, steerStr) * dt * 55;
    PL.angVel *= Math.pow(0.04, dt);
    PL.angle  += PL.angVel * dt;
  }

  // Drift / handbrake
  const driftReady = (hb || (absKmh > 80 && Math.abs(st) > 0.3));
  if (driftReady) {
    PL.drifting = true;
    const lfric = pf.dynGripR * surfGrip * 0.25;
    PL.vx += PL.speed * Math.sin(PL.angle) * (1 - lfric) * dt * 3.5;
    PL.driftAngle = clamp(Math.abs(PL.angVel) * 35, 0, 90);
    const dpts = PL.driftAngle * absKmh * 0.015 * dt;
    PL.driftScore += dpts * PL.combo;
    PL.comboFill = Math.min(1, PL.comboFill + dpts * 0.08);
    if (PL.comboFill >= 1) { PL.combo = Math.min(8, PL.combo + 1); PL.comboFill = 0; }
    startSqueal();
    spawnSmoke(W*0.5, H*0.72, GS.track.surface==='sand'?'rgba(200,160,60,0.5)':'rgba(220,220,220,0.55)');
  } else {
    PL.drifting = false; PL.driftAngle *= 0.92;
    PL.comboFill -= dt * 0.6; if (PL.comboFill < 0) { PL.comboFill=0; PL.combo=1; }
    PL.vx *= Math.pow(0.1, dt * pf.dynGripF * surfGrip);
    stopSqueal();
  }

  // Move
  PL.x += PL.vx * dt;
  camZ  += PL.speed * dt;
  if (camZ < 0) camZ += trackLen;
  PL.z   = camZ + 1500;

  // Wall collision
  if (Math.abs(PL.x) > ROAD_W * 0.52) {
    PL.x = Math.sign(PL.x) * ROAD_W * 0.52;
    PL.speed *= 0.35; PL.vx = -PL.vx * 0.35; PL.angVel *= 0.3;
    PL.wallHits++;
    PL.shakeX = (Math.random()-0.5)*12; PL.shakeY = (Math.random()-0.5)*12;
    playSFX('thud');
    spawnSmoke(W*0.5, H*0.7, 'rgba(255,180,0,0.7)');
  }
  PL.shakeX *= 0.85; PL.shakeY *= 0.85;

  // Lap
  PL.lapTime += dt;
  const prog = (camZ % trackLen) / trackLen;
  if (!PL.sects[0] && prog > 0.33) { PL.sects[0]=true; }
  if (!PL.sects[1] && prog > 0.66) { PL.sects[1]=true; }
  if (prog < 0.04 && PL.sects[1]) {
    if (PL.lapTime < PL.bestLap) PL.bestLap = PL.lapTime;
    PL.lap++; PL.lapTime = 0; PL.sects = [false,false,false];
    if (GS.mode==='trial') { saveTrial(); }
    if (GS.mode==='race' && PL.lap >= GS.track.laps) finishRace();
  }
  if (GS.mode==='drift' && PL.lap >= 1 && !PL.finished) {
    saveDrift(); finishRace();
  }
}

function saveTrial() {
  const k = GS.profile + '_' + GS.track.id;
  if (!S.bestTimes[k] || PL.bestLap < S.bestTimes[k]) { S.bestTimes[k] = PL.bestLap; persist(); }
}
function saveDrift() {
  if (!S.driftBest[GS.profile] || PL.driftScore > S.driftBest[GS.profile]) { S.driftBest[GS.profile] = PL.driftScore; persist(); }
}
function finishRace() {
  if (PL.finished) return;
  PL.finished = true; PL.finTimer = 3;
  const xpMap = {1:1200,2:800,3:500,4:300,5:150};
  addXP(xpMap[PL.pos] || 100);
  playSFX('win');
  if (PL.pos===1) checkAchievements();
  setTimeout(() => { GS.screen = 'results'; }, 3000);
}

// ── AI ────────────────────────────────────────────────────────────────────────
let AI = [];
function initAI() {
  AI = [];
  const count = GS.quality==='LOW' ? 3 : 7;
  for (let i=0; i<count; i++) {
    const pkey = PROFILE_ORDER[Math.floor(Math.random()*(PROFILE_ORDER.indexOf(GS.profile)+1))];
    AI.push({ z:-SEG_LEN*(i+1)*4, x:(Math.random()-0.5)*1000, speed:0, lap:0, pkey, pos:i+2 });
  }
}
function updateAI(dt) {
  const pl_total = PL.z + PL.lap * trackLen;
  AI.forEach(ai => {
    const ai_total = ai.z + ai.lap * trackLen;
    const gap = pl_total - ai_total;
    const rub = gap > 5000 ? 1.35 : gap > 1000 ? 1.1 : gap < -1000 ? 0.85 : 1.0;
    const pf = PROFILES[ai.pkey];
    const tgt = pf.topSpeed / 3.6 * rub;
    ai.speed += (tgt - ai.speed) * dt * 0.4;
    ai.x += (-ai.x / ROAD_W) * ai.speed * dt * 0.3;
    ai.z += ai.speed * dt;
    if (ai.z > trackLen) { ai.z -= trackLen; ai.lap++; }
  });
  // Positions
  const all = [{e:PL,total:PL.z+PL.lap*trackLen}].concat(AI.map(a=>({e:a,total:a.z+a.lap*trackLen})));
  all.sort((a,b)=>b.total-a.total);
  all.forEach((a,i)=>{ if(a.e===PL) PL.pos=i+1; else a.e.pos=i+1; });
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
const MAX_P = 60;
let particles = [];
function spawnSmoke(x, y, col) {
  if (GS.quality==='LOW') return;
  const max = GS.quality==='MEDIUM' ? 20 : MAX_P;
  if (particles.filter(p=>p.active).length >= max) return;
  let p = particles.find(p=>!p.active);
  if (!p) { p = {}; particles.push(p); }
  p.active=true; p.x=x; p.y=y; p.vx=(Math.random()-0.5)*50; p.vy=-30-Math.random()*25;
  p.life=0.9; p.maxLife=0.9; p.r=3+Math.random()*10; p.col=col;
}
function spawnSpeedLine(x, y) {
  if (GS.quality==='LOW') return;
  let p = particles.find(p=>!p.active);
  if (!p) { p = {}; particles.push(p); }
  p.active=true; p.x=x; p.y=y; p.vx=-W*3*Math.random(); p.vy=0;
  p.life=0.15; p.maxLife=0.15; p.r=-1; // -1 = line
  p.col='rgba(255,255,255,';
}
function updateParticles(dt) {
  particles.forEach(p => {
    if (!p.active) return;
    p.life -= dt; p.x += p.vx*dt; p.y += p.vy*dt;
    if (p.r > 0) p.r += 15*dt;
    if (p.life <= 0) p.active = false;
  });
}
function drawParticles() {
  particles.forEach(p => {
    if (!p.active) return;
    const a = p.life / p.maxLife;
    ctx.globalAlpha = a * 0.6;
    if (p.r > 0) {
      ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.strokeStyle = p.col + (a*0.8).toFixed(2) + ')'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx*p.life*0.5, p.y); ctx.stroke();
    }
  });
  ctx.globalAlpha = 1;
}

// skid marks
let skids = [];
function addSkid() {
  if (!PL.drifting || GS.quality==='LOW') return;
  const s = segs[Math.floor((camZ%trackLen)/SEG_LEN)%segs.length];
  skids.push({ wx: PL.x, wz: camZ, alpha:0.7 });
  if (skids.length > 60) skids.shift();
}

// ── ROAD RENDERER ─────────────────────────────────────────────────────────────
const offRoad = new OffscreenCanvas(800, 600);
const offCtx  = offRoad.getContext('2d');

function renderRoad() {
  const sw = W, sh = H;
  const startIdx = Math.floor((camZ % trackLen) / SEG_LEN) % segs.length;
  let maxY = sh, x = 0, dx = 0;

  // Project segments
  for (let n = 0; n < DRAW_DIST; n++) {
    const idx = (startIdx + n) % segs.length;
    const seg = segs[idx];
    const segZ = seg.z + (camZ < seg.z ? 0 : 0);
    // Compute relative z for projection
    const relZ = (idx - startIdx + segs.length) % segs.length * SEG_LEN;
    seg._relZ = relZ;
    seg._scale = CAM_DEPTH / Math.max(1, relZ);
    seg._px = (1 + seg._scale * (-PL.x / (ROAD_W * 0.5) + x / sw)) * sw / 2;
    seg._py = (1 - seg._scale * (CAM_H / CAM_H - seg.hill / (CAM_H))) * sh * 0.55;
    seg._pw = seg._scale * ROAD_W * sw / 2;
    x += dx; dx += seg.curve * 0.0006;
  }

  // Draw from far to near
  for (let n = DRAW_DIST - 1; n >= 0; n--) {
    const idx = (startIdx + n) % segs.length;
    const nIdx = (startIdx + n + 1) % segs.length;
    const seg = segs[idx];
    const next = segs[nIdx];
    if (seg._py >= maxY || !isFinite(seg._py)) continue;
    const y1 = Math.max(0, seg._py < 0 ? 0 : seg._py);
    const y2 = Math.min(maxY, next._py);
    if (y2 <= y1) continue;

    // Grass
    ctx.fillStyle = seg.grassC;
    ctx.fillRect(0, y1, sw, y2 - y1);

    // Draw road trapezoid
    drawTrap(ctx, seg._px-seg._pw, y1, seg._pw*2, next._px-next._pw, y2, next._pw*2, seg.roadC);

    // Rumble strips
    const rw = seg._pw * 0.08, nrw = next._pw * 0.08;
    drawTrap(ctx, seg._px-seg._pw, y1, rw, next._px-next._pw, y2, nrw, seg.rumbleC);
    drawTrap(ctx, seg._px+seg._pw-rw, y1, rw, next._px+next._pw-nrw, y2, nrw, seg.rumbleC);

    // Lane lines
    const lw = seg._pw * 0.015, nlw = next._pw * 0.015;
    if (seg.laneC !== 'transparent') {
      drawTrap(ctx, seg._px - lw, y1, lw*2, next._px - nlw, y2, nlw*2, '#FFFFFF');
    }

    // Guardrails
    const grh = (y2-y1)*0.3;
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(seg._px - seg._pw - 8, y1, 5, y2-y1);
    ctx.fillRect(seg._px + seg._pw + 3, y1, 5, y2-y1);
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(seg._px - seg._pw - 8, y1, 5, grh);
    ctx.fillRect(seg._px + seg._pw + 3, y1, 5, grh);

    maxY = y1;
  }
}

function drawTrap(ctx2, x1, y1, w1, x2, y2, w2, col) {
  ctx2.fillStyle = col;
  ctx2.beginPath();
  ctx2.moveTo(x1, y1); ctx2.lineTo(x1+w1, y1);
  ctx2.lineTo(x2+w2, y2); ctx2.lineTo(x2, y2);
  ctx2.closePath(); ctx2.fill();
}

// ── BACKGROUND ────────────────────────────────────────────────────────────────
let bgStars = Array.from({length:120},()=>({x:Math.random(),y:Math.random()*0.55,s:Math.random()*2+0.5,a:Math.random()}));

function drawBackground(track) {
  // Sky gradient
  const sg = ctx.createLinearGradient(0, 0, 0, H*0.56);
  sg.addColorStop(0, track.skyTop);
  sg.addColorStop(1, track.skyBot);
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H*0.6);

  // Stars for night/rain
  if (track.weather==='night'||track.weather==='rain') {
    bgStars.forEach(s => {
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fillRect(s.x*W, s.y*H, s.s, s.s);
    });
  }

  // Sun / moon
  if (track.weather==='day' || track.weather==='dusk') {
    const sx = W*0.75, sy = H*0.12;
    if (track.weather==='dusk') {
      const sg2 = ctx.createRadialGradient(sx,sy,0,sx,sy,80);
      sg2.addColorStop(0,'rgba(255,180,50,0.9)'); sg2.addColorStop(1,'rgba(255,80,0,0)');
      ctx.fillStyle=sg2; ctx.fillRect(sx-80,sy-80,160,160);
    } else {
      ctx.fillStyle='rgba(255,255,220,0.8)'; ctx.beginPath(); ctx.arc(sx,sy,20,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,200,0.2)'; ctx.beginPath(); ctx.arc(sx,sy,45,0,Math.PI*2); ctx.fill();
    }
  }

  // City skyline for highway track
  if (track.id==='highway' || track.id==='tokyo') {
    const pOff = (camZ * 0.04) % W;
    ctx.fillStyle = track.id==='tokyo' ? '#050510' : '#0a0a1a';
    for (let i=-1; i<=2; i++) {
      const ox = i*W - pOff;
      for (let b=0; b<10; b++) {
        const bx=ox+b*110+5, bh=40+Math.sin(b*2.3)*50, bw=70+Math.cos(b)*20;
        ctx.fillRect(bx, H*0.56-bh, bw, bh);
        // Building windows glow
        if (GS.quality!=='LOW') {
          ctx.fillStyle='rgba(255,220,100,0.5)';
          for(let wr=0;wr<Math.floor(bh/14);wr++) for(let wc=0;wc<Math.floor(bw/14);wc++) {
            if(Math.random()>0.4) ctx.fillRect(bx+wc*14+2,H*0.56-bh+wr*14+2,8,8);
          }
          ctx.fillStyle = track.id==='tokyo'?'#050510':'#0a0a1a';
        }
      }
      ctx.fillStyle = track.id==='tokyo' ? '#050510' : '#0a0a1a';
    }
    // Neon signs (tokyo)
    if (track.id==='tokyo' && GS.quality==='HIGH') {
      const neons=['#FF69B4','#00FFFF','#FF4500','#ADFF2F'];
      for(let n=0;n<15;n++){
        const nx=((n*173+camZ*0.08)%W), ny=H*0.08+(n%5)*28;
        ctx.fillStyle=neons[n%neons.length]; ctx.globalAlpha=0.5+Math.sin(GS.t*3+n)*0.3;
        ctx.fillRect(nx,ny,3+n%5,7+n%8);
      }
      ctx.globalAlpha=1;
    }
  }

  // Mountains for other tracks
  if (track.id!=='highway'&&track.id!=='tokyo'&&track.id!=='sprint'&&track.id!=='desert') {
    const pOff = (camZ * 0.025) % W;
    ctx.fillStyle = track.id==='mountain' ? '#1a2a4a' : '#0a1a0a';
    for (let i=-1; i<=2; i++) {
      const ox = i*W - pOff;
      ctx.beginPath(); ctx.moveTo(ox, H*0.56);
      for (let m=0;m<=12;m++) { ctx.lineTo(ox+m*90, H*0.56-30-Math.sin(m*1.7+track.id.length)*80); }
      ctx.lineTo(ox+12*90,H*0.56); ctx.closePath(); ctx.fill();
    }
  }

  // Rain overlay
  if (track.weather==='rain') {
    ctx.strokeStyle='rgba(180,200,240,0.25)'; ctx.lineWidth=1;
    for(let r=0;r<30;r++){
      const rx=((r*73+GS.t*400)%W), ry=((r*117+GS.t*350)%(H*0.85));
      ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+10,ry+25); ctx.stroke();
    }
  }

  // Snow
  if (track.weather==='snow') {
    ctx.fillStyle='rgba(220,235,255,0.6)';
    for(let r=0;r<40;r++){
      const rx=((r*89+GS.t*60)%W), ry=((r*113+GS.t*50)%(H*0.85));
      ctx.beginPath(); ctx.arc(rx,ry,2,0,Math.PI*2); ctx.fill();
    }
  }

  // Heat haze for desert
  if (track.weather==='heat' && GS.quality!=='LOW') {
    ctx.fillStyle=`rgba(255,180,60,${0.03+Math.sin(GS.t*3)*0.01})`; ctx.fillRect(0,H*0.35,W,H*0.15);
  }
}

// ── PLAYER CAR DRAW ───────────────────────────────────────────────────────────
function drawPlayerCar() {
  const pIdx = PROFILE_ORDER.indexOf(GS.profile);
  const angleNorm = ((PL.angVel * 0.3 + 0.5) % 1 + 1) % 1;
  const ai2 = Math.round(angleNorm * ANGLES) % ANGLES;
  const sx = ai2 * SPRITE_W, sy = pIdx * SPRITE_H;
  const scale = 1.6 + Math.abs(PL.speed)/500;
  const dw = SPRITE_W * scale, dh = SPRITE_H * scale;
  const cx = W/2 - dw/2 + PL.x * 0.08 + PL.shakeX;
  const cy = H * 0.68 - dh + PL.shakeY;

  // NOS glow under car
  if (PL.nosActive) {
    const ng = ctx.createRadialGradient(cx+dw/2,cy+dh,0,cx+dw/2,cy+dh,dh*1.5);
    ng.addColorStop(0,P.nosGlow); ng.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ng; ctx.fillRect(cx-dh,cy-dh*0.5,dw+dh*2,dh*2);
  }

  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(cx+dw/2, cy+dh*0.9, dw*0.4, 10, 0, 0, Math.PI*2); ctx.fill();

  ctx.drawImage(sprSheet, sx, sy, SPRITE_W, SPRITE_H, cx, cy, dw, dh);

  // Headlight beams (night)
  if (GS.track.weather==='night'||GS.track.weather==='rain') {
    const lx=cx+dw*0.3, rx=cx+dw*0.7, ly=cy+dh*0.7;
    const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,180);
    lg.addColorStop(0,'rgba(255,255,200,0.18)'); lg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=lg; ctx.fillRect(lx-180,ly-20,360,220);
    const rg=ctx.createRadialGradient(rx,ly,0,rx,ly,180);
    rg.addColorStop(0,'rgba(255,255,200,0.18)'); rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rg; ctx.fillRect(rx-180,ly-20,360,220);
  }

  // Speed lines at high speed
  if (Math.abs(PL.speed)*3.6 > 200 && GS.quality!=='LOW') {
    const v = (Math.abs(PL.speed)*3.6-200)/600;
    for(let i=0;i<4;i++) spawnSpeedLine(W*(0.05+Math.random()*0.9), H*(0.3+Math.random()*0.6));
  }

  // NOS exhaust flame
  if (PL.nosActive) {
    ctx.fillStyle=`rgba(0,238,255,${0.6+Math.sin(GS.t*30)*0.3})`;
    ctx.beginPath(); ctx.ellipse(cx+dw/2, cy+dh, dw*0.3, dh*0.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle=`rgba(100,200,255,0.4)`;
    ctx.beginPath(); ctx.ellipse(cx+dw/2, cy+dh*1.2, dw*0.2, dh*0.7, 0, 0, Math.PI*2); ctx.fill();
  }
}

// AI cars on road
function drawAICars() {
  AI.forEach(ai => {
    const relZ = ((ai.z - camZ) % trackLen + trackLen) % trackLen;
    if (relZ < SEG_LEN*2 || relZ > DRAW_DIST * SEG_LEN) return;
    const scale2 = CAM_DEPTH / relZ * SEG_LEN * 3.5;
    if (scale2 < 0.04) return;
    const sx2 = W/2 + (ai.x - PL.x) * scale2 * 0.9;
    const sy2 = H * 0.48 + (1 - scale2) * H * 0.22;
    const pIdx2 = PROFILE_ORDER.indexOf(ai.pkey);
    const dw2=SPRITE_W*scale2*2.5, dh2=SPRITE_H*scale2*2.5;
    ctx.drawImage(sprSheet, 0, pIdx2*SPRITE_H, SPRITE_W, SPRITE_H, sx2-dw2/2, sy2-dh2, dw2, dh2);
  });
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function drawHUD() {
  const pf = PROFILES[GS.profile];
  const kmh = Math.abs(PL.speed) * 3.6;
  const rpmN = Math.min(1, PL.rpm / pf.maxRPM);

  // ── Tachometer (bottom left) ──────────────────────────────────────────────
  const tx=100, ty=H-90, tr=72;
  // Outer glow ring
  ctx.shadowBlur=20; ctx.shadowColor=P.blue;
  ctx.strokeStyle='rgba(28,105,212,0.3)'; ctx.lineWidth=12; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(tx,ty,tr, Math.PI*0.75, Math.PI*2.25); ctx.stroke();
  ctx.shadowBlur=0;
  // RPM arc
  const rpmAngle = Math.PI*0.75 + rpmN * Math.PI*1.5;
  const rpmCol = rpmN > 0.85 ? P.red : (rpmN > 0.65 ? P.orange : P.blue2);
  ctx.shadowBlur=12; ctx.shadowColor=rpmCol;
  ctx.strokeStyle=rpmCol; ctx.lineWidth=5;
  ctx.beginPath(); ctx.arc(tx,ty,tr, Math.PI*0.75, rpmAngle); ctx.stroke();
  ctx.shadowBlur=0;
  // Speed text
  ctx.textAlign='center';
  ctx.fillStyle='#fff'; ctx.font='bold 24px monospace'; ctx.fillText(Math.round(kmh), tx, ty+7);
  ctx.fillStyle=P.grey; ctx.font='10px monospace'; ctx.fillText('km/h', tx, ty+22);
  ctx.fillStyle=P.blue; ctx.font='bold 12px monospace'; ctx.fillText('G'+PL.gear, tx, ty-tr+14);
  // RPM text
  ctx.fillStyle=rpmCol; ctx.font='9px monospace'; ctx.fillText(Math.round(PL.rpm)+'rpm', tx, ty+34);

  // ── NOS Bar ────────────────────────────────────────────────────────────────
  if (pf.nos) {
    const nosW = 160, nosH = 8, nosx = 20, nosy = H-20;
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(nosx,nosy-nosH,nosW,nosH,3); ctx.fill();
    const nosFill = PL.nos / pf.nosCapacity;
    if (nosFill > 0) {
      ctx.shadowBlur = PL.nosActive ? 10 : 0; ctx.shadowColor=P.nos;
      ctx.fillStyle = PL.nosActive ? P.nos : P.blue2;
      ctx.beginPath(); ctx.roundRect(nosx,nosy-nosH,nosW*nosFill,nosH,3); ctx.fill();
      ctx.shadowBlur=0;
    }
    ctx.fillStyle=P.grey; ctx.font='9px monospace'; ctx.textAlign='left'; ctx.fillText('NOS', nosx, nosy-12);
    if (PL.nosActive) {
      ctx.fillStyle=P.nos; ctx.font='bold 11px monospace'; ctx.shadowBlur=8; ctx.shadowColor=P.nos;
      ctx.fillText('⚡ BOOST ACTIVE', nosx, nosy-23); ctx.shadowBlur=0;
    }
  }

  // ── Position / Lap / Time (top bar) ───────────────────────────────────────
  ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,44);
  ctx.fillStyle='rgba(28,105,212,0.5)'; ctx.fillRect(0,0,W,2);
  const posStr=['1ST','2ND','3RD','4TH','5TH','6TH','7TH','8TH'][PL.pos-1]||PL.pos+'TH';
  const posCol = PL.pos===1?P.gold:PL.pos<=3?P.blue:'#ccc';
  ctx.textAlign='left'; ctx.fillStyle=posCol; ctx.font='bold 20px monospace';
  ctx.shadowBlur=8; ctx.shadowColor=posCol; ctx.fillText(posStr, 14, 28); ctx.shadowBlur=0;
  ctx.textAlign='center'; ctx.fillStyle='#fff'; ctx.font='bold 15px monospace';
  const m=Math.floor(PL.lapTime/60), s=(PL.lapTime%60).toFixed(2).padStart(5,'0');
  ctx.fillText(`LAP ${PL.lap+1}/${GS.track.laps}  ${m}:${s}`, W/2, 28);
  ctx.textAlign='right'; ctx.fillStyle=P.grey; ctx.font='12px monospace';
  ctx.fillText(GS.profile + ' · ' + GS.track.name, W-10, 16);
  ctx.fillStyle='#fff'; ctx.font='11px monospace';
  if (PL.bestLap < Infinity) {
    const bm=Math.floor(PL.bestLap/60), bs=(PL.bestLap%60).toFixed(2).padStart(5,'0');
    ctx.fillText('BEST '+bm+':'+bs, W-10, 32);
  }

  // ── Drift HUD (bottom right) ───────────────────────────────────────────────
  if (GS.mode==='drift' || PL.drifting) {
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(W-230,H-95,225,90,8); ctx.fill();
    ctx.fillStyle=P.gold; ctx.font='bold 30px monospace'; ctx.textAlign='right';
    ctx.shadowBlur=10; ctx.shadowColor=P.gold;
    ctx.fillText(Math.round(PL.driftScore).toLocaleString(), W-10, H-52); ctx.shadowBlur=0;
    ctx.fillStyle='#fff'; ctx.font='bold 16px monospace';
    ctx.fillText(`×${PL.combo} COMBO`, W-10, H-28);
    if (PL.drifting) {
      ctx.fillStyle=P.red; ctx.font='12px monospace';
      ctx.fillText(`${Math.round(PL.driftAngle)}° DRIFT`, W-10, H-12);
    }
    // Combo fill bar
    const cbx=W-225, cby=H-12, cbw=200;
    ctx.fillStyle='#333'; ctx.beginPath(); ctx.roundRect(cbx,cby-6,cbw,6,3); ctx.fill();
    ctx.fillStyle=P.orange; ctx.beginPath(); ctx.roundRect(cbx,cby-6,cbw*PL.comboFill,6,3); ctx.fill();
  }

  // ── Mini Map ──────────────────────────────────────────────────────────────
  drawMiniMap();

  // ── Touch Controls ────────────────────────────────────────────────────────
  if (navigator.maxTouchPoints > 0) drawTouchHUD();

  // ── Unlock banner ─────────────────────────────────────────────────────────
  if (unlockBanner && unlockBanner.timer > 0) {
    unlockBanner.timer -= GS.dt;
    const a = Math.min(1, unlockBanner.timer * 2);
    ctx.globalAlpha=a;
    ctx.fillStyle='rgba(28,105,212,0.9)'; ctx.beginPath(); ctx.roundRect(W/2-200,80,400,44,8); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 16px monospace'; ctx.textAlign='center';
    ctx.fillText(unlockBanner.text, W/2, 107);
    ctx.globalAlpha=1;
  }

  // ── Vignette ─────────────────────────────────────────────────────────────
  if (GS.quality!=='LOW') {
    const vg=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.8);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,10,0.55)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
  }

  // ── Screen edge NOS glow ──────────────────────────────────────────────────
  if (PL.nosActive) {
    const ng2=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.85);
    ng2.addColorStop(0,'rgba(0,238,255,0)'); ng2.addColorStop(1,'rgba(0,238,255,0.12)');
    ctx.fillStyle=ng2; ctx.fillRect(0,0,W,H);
  }
}

function drawMiniMap() {
  const mx=W-65, my=72, mr=40;
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.arc(mx,my,mr+4,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(28,105,212,0.5)'; ctx.lineWidth=1.5;
  ctx.beginPath();
  segs.forEach((seg,i) => {
    const a=(seg.z/trackLen)*Math.PI*2-Math.PI/2;
    const r2=mr*(0.7+seg.curve*0.08);
    const px=mx+Math.cos(a)*r2, py=my+Math.sin(a)*r2;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  });
  ctx.closePath(); ctx.stroke();
  // Player dot
  const pa=(camZ/trackLen)*Math.PI*2-Math.PI/2;
  ctx.fillStyle=P.blue; ctx.shadowBlur=6; ctx.shadowColor=P.blue;
  ctx.beginPath(); ctx.arc(mx+Math.cos(pa)*mr*0.75,my+Math.sin(pa)*mr*0.75,4,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  AI.forEach(ai => {
    const aa=(ai.z/trackLen)*Math.PI*2-Math.PI/2;
    ctx.fillStyle=P.red; ctx.beginPath(); ctx.arc(mx+Math.cos(aa)*mr*0.75,my+Math.sin(aa)*mr*0.75,2.5,0,Math.PI*2); ctx.fill();
  });
}

function drawTouchHUD() {
  ctx.globalAlpha=0.3;
  // Left joystick base
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(85,H-90,60,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=P.blue; ctx.beginPath(); ctx.arc(85+TOUCH.lx*30,H-90+TOUCH.ly*30,22,0,Math.PI*2); ctx.fill();
  // NOS button
  ctx.fillStyle=PL.nosActive?P.nos:P.blue2;
  ctx.beginPath(); ctx.arc(W-90,H-90,40,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1; ctx.fillStyle='#fff'; ctx.font='bold 11px monospace'; ctx.textAlign='center';
  ctx.fillText('NOS', W-90, H-86);
  // Drift button
  ctx.globalAlpha=0.3; ctx.fillStyle=TOUCH.rx?P.orange:P.red;
  ctx.beginPath(); ctx.arc(W-90,H-175,35,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1; ctx.fillStyle='#fff'; ctx.font='bold 10px monospace';
  ctx.fillText('DRIFT', W-90, H-171);
}

// ── SCREEN: SPLASH ────────────────────────────────────────────────────────────
function drawSplash() {
  ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
  // Subtle grid
  ctx.strokeStyle='rgba(28,105,212,0.07)'; ctx.lineWidth=1;
  for(let i=0;i<W;i+=60){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
  for(let i=0;i<H;i+=60){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke();}

  const cx=W/2, cy=H/2;

  // BMW logo
  drawBMWLogo(cx, cy-60, 90, GS.t);

  ctx.textAlign='center';
  ctx.font='bold 52px monospace'; ctx.fillStyle='#fff';
  ctx.shadowBlur=20; ctx.shadowColor=P.blue;
  ctx.fillText('BMW M3 GTR', cx, cy+60); ctx.shadowBlur=0;
  ctx.font='14px monospace'; ctx.fillStyle=P.blue;
  ctx.fillText('ULTIMATE EDITION — 7 PERFORMANCE PROFILES', cx, cy+88);
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='13px monospace';
  ctx.fillText('CLICK · TOUCH · ANY KEY TO START', cx, cy+130);
  ctx.fillStyle=P.grey; ctx.font='11px monospace';
  ctx.fillText('Source data: mgood7123/Ultimate-BMW-M3-GTR-Race', cx, H-20);

  // Animated car
  const cIdx = Math.floor(GS.t*0.4)%PROFILE_ORDER.length;
  const pf = PROFILES[PROFILE_ORDER[cIdx]];
  const carX = cx + Math.sin(GS.t*0.6)*40;
  drawM3GTR(ctx, carX-80, H/2+115, 160, 80, pf, 0.5+Math.sin(GS.t*0.3)*0.08);
}

function drawBMWLogo(cx, cy, r, t) {
  ctx.save(); ctx.translate(cx, cy);
  // Outer ring
  ctx.strokeStyle='rgba(200,200,200,0.8)'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='rgba(200,200,200,0.4)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(0,0,r*0.9,0,Math.PI*2); ctx.stroke();
  // Inner cross dividers
  ctx.strokeStyle='rgba(200,200,200,0.9)'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(-r*0.88,0); ctx.lineTo(r*0.88,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-r*0.88); ctx.lineTo(0,r*0.88); ctx.stroke();
  // Blue & white quadrants
  const spin = Math.sin(t*0.5)*0.15;
  ctx.save(); ctx.rotate(spin);
  ctx.fillStyle=P.blue;
  ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.87,-Math.PI/2,0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.87,Math.PI/2,Math.PI); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#F0F0F0';
  ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.87,0,Math.PI/2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.87,Math.PI,-Math.PI/2); ctx.closePath(); ctx.fill();
  ctx.restore();
  // Center cap
  ctx.fillStyle=P.bg; ctx.beginPath(); ctx.arc(0,0,r*0.12,0,Math.PI*2); ctx.fill();
  // BMW text
  ctx.fillStyle='rgba(200,200,200,0.9)'; ctx.font='bold '+(r*0.22)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('BMW',0,r*0.09);
  ctx.restore();
}

// ── SCREEN: MENU ─────────────────────────────────────────────────────────────
const MENU_ITEMS = ['QUICK RACE','DRIFT CHALLENGE','TIME TRIAL','PROFILE GARAGE','LEADERBOARD'];
function drawMenu() {
  drawMenuBG();
  const cx=W/2, cy=H/2;
  drawBMWLogo(cx, 60, 38, GS.t);
  ctx.textAlign='center'; ctx.font='bold 28px monospace'; ctx.fillStyle='#fff';
  ctx.shadowBlur=15; ctx.shadowColor=P.blue;
  ctx.fillText('BMW M3 GTR', cx, 118); ctx.shadowBlur=0;
  ctx.font='12px monospace'; ctx.fillStyle=P.blue;
  ctx.fillText(`LEVEL ${S.level}  ·  ${S.unlockedProfiles.length}/${PROFILE_ORDER.length} PROFILES  ·  ${S.xp}/${S.xpNext} XP`, cx, 138);

  MENU_ITEMS.forEach((item, i) => {
    const y = 190 + i*65;
    const sel = GS.menuSel===i;
    // Card background
    ctx.fillStyle = sel ? 'rgba(28,105,212,0.25)' : 'rgba(255,255,255,0.04)';
    ctx.strokeStyle = sel ? P.blue : 'rgba(28,105,212,0.2)';
    ctx.lineWidth = sel ? 2 : 1;
    ctx.beginPath(); ctx.roundRect(cx-200,y-24,400,50,8); ctx.fill(); ctx.stroke();
    // Left accent bar
    if (sel) { ctx.fillStyle=P.blue; ctx.fillRect(cx-200,y-24,4,50); }
    ctx.fillStyle = sel?'#fff':'#aaa'; ctx.font=`bold ${sel?18:16}px monospace`; ctx.textAlign='center';
    ctx.fillText(item, cx, y+7);
  });
  ctx.font='11px monospace'; ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.textAlign='center';
  ctx.fillText('↑↓ NAV  ·  ENTER SELECT  ·  CLICK', cx, H-15);

  // Current car preview
  const pf=PROFILES[S.profile]; const pIdx=PROFILE_ORDER.indexOf(S.profile);
  ctx.drawImage(sprSheet, SPRITE_W*6, pIdx*SPRITE_H, SPRITE_W, SPRITE_H, W-180, H-100, 160, 80);
  ctx.fillStyle=pf.col; ctx.font='bold 11px monospace'; ctx.textAlign='center';
  ctx.fillText(pf.label, W-100, H-12);
}
function drawMenuBG() {
  ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
  // Animated radial gradient
  const rg=ctx.createRadialGradient(W/2,H*0.4,0,W/2,H*0.4,W*0.7);
  rg.addColorStop(0,'rgba(28,105,212,0.08)'); rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
  // Grid
  ctx.strokeStyle='rgba(28,105,212,0.06)'; ctx.lineWidth=1;
  for(let i=0;i<W;i+=80){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
  for(let i=0;i<H;i+=80){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke();}
  // Animated diagonal light sweep
  const sweepX = ((GS.t*0.08)%1.5-0.25)*W;
  const sg=ctx.createLinearGradient(sweepX,0,sweepX+W*0.15,H);
  sg.addColorStop(0,'rgba(28,105,212,0)'); sg.addColorStop(0.5,'rgba(28,105,212,0.04)'); sg.addColorStop(1,'rgba(28,105,212,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
}

// ── SCREEN: PROFILE SELECT ───────────────────────────────────────────────────
function drawProfileSelect() {
  drawMenuBG();
  ctx.textAlign='center'; ctx.font='bold 24px monospace'; ctx.fillStyle='#fff';
  ctx.fillText('SELECT PERFORMANCE PROFILE', W/2, 45);
  ctx.font='12px monospace'; ctx.fillStyle=P.blue;
  ctx.fillText('← → BROWSE  ·  ENTER / TAP TO CONFIRM', W/2, 70);

  const key = PROFILE_ORDER[GS.profileSel];
  const pf  = PROFILES[key];
  const locked = !S.unlockedProfiles.includes(key);

  // Big car preview
  const pIdx = PROFILE_ORDER.indexOf(key);
  const preW=280, preH=140;
  ctx.save();
  if(locked){ctx.globalAlpha=0.3;}
  ctx.drawImage(sprSheet, SPRITE_W*6, pIdx*SPRITE_H, SPRITE_W, SPRITE_H, W/2-preW/2, H/2-preH/2-30, preW, preH);
  ctx.restore();

  if (locked) {
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.roundRect(W/2-140,H/2-70,280,120,8); ctx.fill();
    ctx.fillStyle=P.grey; ctx.font='bold 18px monospace'; ctx.textAlign='center';
    ctx.fillText(`🔒 REACH LEVEL ${pf.unlockLevel}`, W/2, H/2-10);
  }

  // Profile info card
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.roundRect(W/2-260,H/2+80,520,160,10); ctx.fill();
  ctx.strokeStyle=locked?P.grey:pf.col; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(W/2-260,H/2+80,520,160,10); ctx.stroke();
  ctx.textAlign='center'; ctx.fillStyle=locked?P.grey:pf.col; ctx.font='bold 22px monospace';
  ctx.shadowBlur=locked?0:12; ctx.shadowColor=pf.col;
  ctx.fillText(pf.label, W/2, H/2+110); ctx.shadowBlur=0;
  ctx.fillStyle='#ccc'; ctx.font='13px monospace';
  ctx.fillText(pf.desc, W/2, H/2+133);
  // Stats bars
  const stats=[
    ['TOP SPEED', pf.topSpeed/1300],
    ['ACCEL',     Math.min(1, pf.torque[pf.torque.length-1]/8050)],
    ['GRIP',      Math.min(1, pf.dynGripF/8.2)],
    ['HANDLING',  pf.handling/99],
    ['NOS',       pf.nos?1:0],
  ];
  stats.forEach(([label,val],i)=>{
    const bx=W/2-220, by=H/2+148+i*18, bw=260;
    ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.roundRect(bx,by,bw,10,3); ctx.fill();
    const col=i===4?(pf.nos?P.nos:P.grey):(locked?P.grey:pf.col);
    ctx.fillStyle=col; ctx.beginPath(); ctx.roundRect(bx,by,bw*val,10,3); ctx.fill();
    ctx.fillStyle='#999'; ctx.font='9px monospace'; ctx.textAlign='right'; ctx.fillText(label,bx-6,by+8);
  });

  ctx.font='30px monospace'; ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.textAlign='center';
  ctx.fillText('◀', W/2-260, H/2+20); ctx.fillText('▶', W/2+260, H/2+20);
  ctx.font='11px monospace'; ctx.fillStyle=P.grey;
  ctx.fillText(`${GS.profileSel+1} / ${PROFILE_ORDER.length}`, W/2, H-15);
}

// ── SCREEN: TRACK SELECT ─────────────────────────────────────────────────────
function drawTrackSelect() {
  const tr = TRACKS[GS.trackSel];
  drawMenuBG();
  ctx.textAlign='center'; ctx.font='bold 24px monospace'; ctx.fillStyle='#fff';
  ctx.fillText('SELECT TRACK', W/2, 45);

  // Track card
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(W/2-280,70,560,H-140,10); ctx.fill();
  ctx.strokeStyle=P.blue; ctx.lineWidth=1;
  ctx.beginPath(); ctx.roundRect(W/2-280,70,560,H-140,10); ctx.stroke();

  // Minimap
  const mx=W/2, my=H*0.38, mr=80;
  ctx.strokeStyle=P.blue; ctx.lineWidth=2;
  ctx.beginPath();
  segs.forEach((seg,i)=>{
    const a=(seg.z/trackLen)*Math.PI*2-Math.PI/2;
    const r2=mr*(0.75+seg.curve*0.05);
    const px=mx+Math.cos(a)*r2, py=my+Math.sin(a)*r2;
    if(i===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
  });
  ctx.closePath(); ctx.stroke();

  const locked2 = !S.unlockedTracks.includes(tr.id);
  ctx.fillStyle=locked2?P.grey:'#fff'; ctx.font='bold 20px monospace'; ctx.textAlign='center';
  ctx.fillText((locked2?'🔒 ':'')+tr.name, W/2, my+100);
  ctx.fillStyle='#888'; ctx.font='13px monospace';
  ctx.fillText(`${tr.laps} LAP${tr.laps>1?'S':''} · ${tr.surface.toUpperCase()} · ${tr.weather.toUpperCase()}`, W/2, my+122);
  ctx.fillStyle='#666'; ctx.font='11px monospace';
  ctx.fillText(tr.desc, W/2, my+140);
  // Best time
  const bk=S.profile+'_'+tr.id, bt=S.bestTimes[bk];
  if(bt){const m=Math.floor(bt/60),s=(bt%60).toFixed(2).padStart(5,'0'); ctx.fillStyle=P.gold; ctx.font='11px monospace'; ctx.fillText('BEST '+m+':'+s,W/2,my+158);}

  ctx.font='26px monospace'; ctx.fillStyle='rgba(255,255,255,0.6)';
  ctx.fillText('◀',W/2-280,my+20); ctx.fillText('▶',W/2+280,my+20);
  ctx.font='11px monospace'; ctx.fillStyle=P.grey;
  ctx.fillText(`${GS.trackSel+1} / ${TRACKS.length}`, W/2, H-15);
  ctx.fillText('ENTER / TAP TO RACE', W/2, H-30);
}

// ── SCREEN: PAUSE ─────────────────────────────────────────────────────────────
function drawPause() {
  ctx.fillStyle='rgba(0,0,8,0.75)'; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center'; ctx.font='bold 40px monospace'; ctx.fillStyle='#fff';
  ctx.shadowBlur=20; ctx.shadowColor=P.blue; ctx.fillText('PAUSED',W/2,H/2-60); ctx.shadowBlur=0;
  [['RESUME  (ESC)',H/2],['RESTART',H/2+65],['MAIN MENU',H/2+130]].forEach(([txt,y],i)=>{
    ctx.fillStyle=i===0?P.blue:'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.roundRect(W/2-140,y-28,280,52,8); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 16px monospace'; ctx.fillText(txt,W/2,y+7);
  });
}

// ── SCREEN: RESULTS ───────────────────────────────────────────────────────────
function drawResults() {
  ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
  drawMenuBG();
  const pf=PROFILES[GS.profile];
  const pos=PL.pos;
  const posCol=pos===1?P.gold:pos<=3?P.blue:'#888';
  const posLbl=['1ST','2ND','3RD','4TH'][pos-1]||pos+'TH';

  ctx.textAlign='center';
  if(pos===1 && GS.quality!=='LOW'){
    // Gold explosion
    for(let i=0;i<6;i++) spawnSmoke(W/2+(Math.random()-0.5)*300,H/2,`rgba(255,215,0,0.6)`);
  }
  ctx.font='bold 72px monospace'; ctx.fillStyle=posCol;
  ctx.shadowBlur=30; ctx.shadowColor=posCol;
  ctx.fillText(posLbl, W/2, H/2-20); ctx.shadowBlur=0;
  ctx.font='20px monospace'; ctx.fillStyle='#fff';
  ctx.fillText(`FINISHED ${posLbl} PLACE`, W/2, H/2+30);
  if(PL.bestLap<Infinity){
    const m=Math.floor(PL.bestLap/60),s=(PL.bestLap%60).toFixed(2).padStart(5,'0');
    ctx.font='14px monospace'; ctx.fillStyle=P.blue;
    ctx.fillText(`BEST LAP: ${m}:${s}`, W/2, H/2+60);
  }
  const xpMap={1:1200,2:800,3:500,4:300,5:150};
  ctx.font='bold 20px monospace'; ctx.fillStyle=P.gold;
  ctx.shadowBlur=10; ctx.shadowColor=P.gold;
  ctx.fillText(`+${xpMap[pos]||100} XP`, W/2, H/2+94); ctx.shadowBlur=0;
  ctx.fillStyle=P.grey; ctx.font='13px monospace';
  ctx.fillText('PRESS ENTER · CLICK TO CONTINUE', W/2, H-30);
  drawParticles();
}

// ── SCREEN: GARAGE ────────────────────────────────────────────────────────────
function drawGarage() {
  drawMenuBG();
  ctx.textAlign='center'; ctx.font='bold 26px monospace'; ctx.fillStyle='#fff';
  ctx.fillText('PROFILE GARAGE', W/2, 45);
  ctx.font='12px monospace'; ctx.fillStyle=P.blue;
  ctx.fillText(`LEVEL ${S.level} · ${S.xp}/${S.xpNext} XP · ${S.unlockedProfiles.length}/${PROFILE_ORDER.length} PROFILES`, W/2, 68);

  PROFILE_ORDER.forEach((key,i)=>{
    const pf=PROFILES[key];
    const unlocked=S.unlockedProfiles.includes(key);
    const sel=key===S.profile;
    const col=sel===i;
    const row=Math.floor(i/3), col2=i%3;
    const cx2=W/2-280+col2*190+95, cy2=110+row*200;
    // Card
    ctx.fillStyle=sel?'rgba(28,105,212,0.2)':unlocked?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.3)';
    ctx.strokeStyle=sel?pf.col:unlocked?'rgba(28,105,212,0.3)':'rgba(255,255,255,0.1)';
    ctx.lineWidth=sel?2:1;
    ctx.beginPath(); ctx.roundRect(cx2-85,cy2-80,170,165,8); ctx.fill(); ctx.stroke();
    // Car sprite
    const pIdx=i;
    ctx.globalAlpha=unlocked?1:0.25;
    ctx.drawImage(sprSheet, SPRITE_W*6, pIdx*SPRITE_H, SPRITE_W, SPRITE_H, cx2-60, cy2-70, 120, 60);
    ctx.globalAlpha=1;
    ctx.fillStyle=unlocked?pf.col:P.grey; ctx.font='bold 13px monospace'; ctx.textAlign='center';
    ctx.fillText(pf.label, cx2, cy2+4);
    ctx.fillStyle='#666'; ctx.font='10px monospace';
    ctx.fillText(`${pf.topSpeed} km/h`, cx2, cy2+19);
    if (!unlocked) {
      ctx.fillStyle='#555'; ctx.fillText(`LV${pf.unlockLevel}`, cx2, cy2+34);
    } else {
      ctx.fillStyle='#444'; ctx.fillText(pf.nos?'NOS∞':'NO NOS', cx2, cy2+34);
      if(sel){ctx.fillStyle=P.gold;ctx.font='bold 10px monospace';ctx.fillText('SELECTED',cx2,cy2+52);}
    }
  });
  ctx.fillStyle=P.grey; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText('CLICK A PROFILE TO SELECT · ESC TO BACK', W/2, H-15);
}

// ── SCREEN: LEADERBOARD ──────────────────────────────────────────────────────
function drawLeaderboard() {
  drawMenuBG();
  ctx.textAlign='center'; ctx.font='bold 26px monospace'; ctx.fillStyle='#fff';
  ctx.fillText('LEADERBOARD', W/2, 45);
  // Best lap times
  ctx.fillStyle=P.blue; ctx.font='bold 14px monospace'; ctx.textAlign='left';
  ctx.fillText('BEST LAP TIMES:', 50, 85);
  const laps=Object.entries(S.bestTimes).slice(0,10);
  if(!laps.length){ctx.fillStyle='#444';ctx.font='13px monospace';ctx.fillText('No times yet — go race!',50,110);}
  laps.forEach(([k,t],i)=>{
    const [pr,tr]=k.split('_');
    const pf=PROFILES[pr], trk=TRACKS.find(t2=>t2.id===tr);
    const m=Math.floor(t/60),s=(t%60).toFixed(2).padStart(5,'0');
    const y=100+i*32;
    ctx.fillStyle=i===0?P.gold:i<3?P.blue:'#ccc';
    ctx.font='13px monospace'; ctx.textAlign='left';
    ctx.fillText(`${i+1}. ${pf?.label||pr} @ ${trk?.name||tr}: ${m}:${s}`, 50, y);
  });
  // Drift scores
  ctx.fillStyle=P.orange; ctx.font='bold 14px monospace'; ctx.textAlign='left';
  ctx.fillText('DRIFT HIGH SCORES:', W/2+20, 85);
  const drifts=Object.entries(S.driftBest).slice(0,7);
  if(!drifts.length){ctx.fillStyle='#444';ctx.font='13px monospace';ctx.fillText('No scores — try Drift Challenge!',W/2+20,110);}
  drifts.forEach(([pr,sc],i)=>{
    const pf=PROFILES[pr];
    ctx.fillStyle=i===0?P.gold:'#ccc'; ctx.font='13px monospace'; ctx.textAlign='left';
    ctx.fillText(`${i+1}. ${pf?.label||pr}: ${Math.round(sc).toLocaleString()}`, W/2+20, 100+i*32);
  });
  ctx.fillStyle=P.grey; ctx.font='11px monospace'; ctx.textAlign='center';
  ctx.fillText('ESC · CLICK TO RETURN', W/2, H-15);
}

// ── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
function checkAchievements() {
  const unlock=(id)=>{if(!S.achievements.includes(id)){S.achievements.push(id);addXP(200);unlockBanner={text:'🏆 ACHIEVEMENT: '+id.replace(/_/g,' ').toUpperCase(),timer:4};}};
  if(PL.pos===1) unlock('first_win');
  if(PL.combo>=8) unlock('drift_king');
  if(PL.bestLap<120) unlock('sub_2min');
  if(GS.profile==='TOMAHAWK_X2'&&PL.pos===1) unlock('tomahawk_god');
  if(S.unlockedProfiles.length===PROFILE_ORDER.length) unlock('full_collection');
  if(PL.wallHits===0) unlock('clean_racer');
  persist();
}

// ── MAIN KEY HANDLER ─────────────────────────────────────────────────────────
function handleKey(code) {
  initAudio();
  const enter=code==='Enter'||code==='Space';
  const esc=code==='Escape';
  const up=code==='ArrowUp'||code==='KeyW';
  const dn=code==='ArrowDown'||code==='KeyS';
  const lt=code==='ArrowLeft'||code==='KeyA';
  const rt=code==='ArrowRight'||code==='KeyD';

  if(GS.screen==='splash'){ GS.screen='menu'; playSFX('click'); GS.fadeAlpha=1; GS.fadeDir=-1; return; }
  if(GS.screen==='menu'){
    if(up) GS.menuSel=(GS.menuSel-1+MENU_ITEMS.length)%MENU_ITEMS.length;
    if(dn) GS.menuSel=(GS.menuSel+1)%MENU_ITEMS.length;
    if(enter) handleMenuSel(); if(esc) {}
    playSFX('click'); return;
  }
  if(GS.screen==='profileSelect'){
    if(lt) GS.profileSel=(GS.profileSel-1+PROFILE_ORDER.length)%PROFILE_ORDER.length;
    if(rt) GS.profileSel=(GS.profileSel+1)%PROFILE_ORDER.length;
    if(enter){confirmProfile();}
    if(esc){GS.screen='menu';}
    playSFX('click'); return;
  }
  if(GS.screen==='trackSelect'){
    if(lt){GS.trackSel=(GS.trackSel-1+TRACKS.length)%TRACKS.length; buildTrack(TRACKS[GS.trackSel]);}
    if(rt){GS.trackSel=(GS.trackSel+1)%TRACKS.length; buildTrack(TRACKS[GS.trackSel]);}
    if(enter) startGame();
    if(esc){GS.screen='profileSelect';}
    playSFX('click'); return;
  }
  if(GS.screen==='game'){
    if(esc){ GS.screen='pause'; return; }
    if(code==='KeyR') resetPlayer();
  }
  if(GS.screen==='pause'){
    if(esc||code==='KeyP') GS.screen='game';
    if(enter) GS.screen='game';
    if(code==='KeyM') { GS.screen='menu'; }
    if(code==='KeyR') { startGame(); }
    return;
  }
  if(GS.screen==='results'){ if(enter||esc) GS.screen='menu'; return; }
  if(GS.screen==='garage'){ if(esc) GS.screen='menu'; return; }
  if(GS.screen==='leaderboard'){ if(esc) GS.screen='menu'; return; }
}

function handleMenuSel() {
  const modes=['race','drift','trial'];
  switch(GS.menuSel){
    case 0: GS.mode='race';  GS.profileSel=PROFILE_ORDER.indexOf(S.profile); GS.screen='profileSelect'; break;
    case 1: GS.mode='drift'; GS.profileSel=PROFILE_ORDER.indexOf(S.profile); GS.screen='profileSelect'; break;
    case 2: GS.mode='trial'; GS.profileSel=PROFILE_ORDER.indexOf(S.profile); GS.screen='profileSelect'; break;
    case 3: GS.screen='garage'; break;
    case 4: GS.screen='leaderboard'; break;
  }
}

function handleTap(x, y) {
  initAudio();
  playSFX('click');
  if(GS.screen==='splash'){ GS.screen='menu'; return; }
  if(GS.screen==='menu'){
    MENU_ITEMS.forEach((_,i)=>{
      const iy=190+i*65;
      if(x>W/2-200&&x<W/2+200&&y>iy-24&&y<iy+26){ GS.menuSel=i; handleMenuSel(); }
    });
    return;
  }
  if(GS.screen==='profileSelect'){
    if(x<W/2-80) GS.profileSel=(GS.profileSel-1+PROFILE_ORDER.length)%PROFILE_ORDER.length;
    else if(x>W/2+80&&y>H/2-80&&y<H/2+80) GS.profileSel=(GS.profileSel+1)%PROFILE_ORDER.length;
    else if(y>H/2+80) confirmProfile();
    return;
  }
  if(GS.screen==='trackSelect'){
    if(x<W/2-100) { GS.trackSel=(GS.trackSel-1+TRACKS.length)%TRACKS.length; buildTrack(TRACKS[GS.trackSel]); }
    else if(x>W/2+100) { GS.trackSel=(GS.trackSel+1)%TRACKS.length; buildTrack(TRACKS[GS.trackSel]); }
    else if(y>H*0.6) startGame();
    return;
  }
  if(GS.screen==='results'||GS.screen==='leaderboard'||GS.screen==='garage'){ GS.screen='menu'; return; }
  if(GS.screen==='pause'){
    if(y>H/2-28&&y<H/2+24) GS.screen='game';
    if(y>H/2+37&&y<H/2+89) startGame();
    if(y>H/2+102&&y<H/2+154) GS.screen='menu';
    return;
  }
  if(GS.screen==='garage'){
    PROFILE_ORDER.forEach((key,i)=>{
      const row=Math.floor(i/3),col=i%3;
      const cx2=W/2-280+col*190+95, cy2=110+row*200;
      if(S.unlockedProfiles.includes(key)&&x>cx2-85&&x<cx2+85&&y>cy2-80&&y<cy2+85){
        S.profile=key; GS.profile=key; persist();
      }
    });
  }
}

canvas.addEventListener('click', e => {
  const r=canvas.getBoundingClientRect();
  handleTap((e.clientX-r.left)/r.width*W, (e.clientY-r.top)/r.height*H);
});

function confirmProfile() {
  const key=PROFILE_ORDER[GS.profileSel];
  if(!S.unlockedProfiles.includes(key)) return;
  S.profile=key; GS.profile=key; persist();
  GS.screen='trackSelect'; GS.trackSel=TRACKS.findIndex(t=>S.unlockedTracks.includes(t.id));
  buildTrack(TRACKS[GS.trackSel]);
}

function startGame() {
  const tr=TRACKS[GS.trackSel];
  if(!S.unlockedTracks.includes(tr.id)) return;
  GS.track=tr; GS.screen='game';
  buildTrack(tr);
  resetPlayer();
  if(GS.mode==='race') initAI();
  else AI=[];
  particles=[]; skids=[];
}

// ── FADE ─────────────────────────────────────────────────────────────────────
function drawFade() {
  if(GS.fadeAlpha<=0) return;
  ctx.fillStyle=`rgba(0,0,8,${GS.fadeAlpha})`; ctx.fillRect(0,0,W,H);
}
function updateFade(dt) {
  if(GS.fadeDir<0) GS.fadeAlpha=Math.max(0,GS.fadeAlpha-dt*2);
  if(GS.fadeDir>0) GS.fadeAlpha=Math.min(1,GS.fadeAlpha+dt*2);
}

// ── QUALITY DETECT ────────────────────────────────────────────────────────────
function detectQuality(cb) {
  let frames=0, t0=performance.now();
  function f(){
    const bc=new OffscreenCanvas(320,240),bx=bc.getContext('2d');
    for(let i=0;i<30;i++){bx.fillStyle='#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0');bx.fillRect(Math.random()*320,Math.random()*240,50,50);}
    if(++frames<8) requestAnimationFrame(f);
    else{
      const fps=frames/((performance.now()-t0)/1000);
      GS.quality=fps<25?'LOW':fps<45?'MEDIUM':'HIGH'; cb();
    }
  }
  requestAnimationFrame(f);
}

// ── MOTION BLUR (cinematic) ───────────────────────────────────────────────────
let prevFrame = null;
function applyMotionBlur() {
  if(GS.quality!=='HIGH'||!isPlaying()) return;
  const kmh=Math.abs(PL.speed)*3.6;
  if(kmh<150) return;
  const alpha=Math.min(0.25,(kmh-150)/1200);
  if(prevFrame){ctx.globalAlpha=alpha;ctx.drawImage(prevFrame,0,0,W,H);ctx.globalAlpha=1;}
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&isPlaying())GS.screen='pause';});

// ── MAIN LOOP ─────────────────────────────────────────────────────────────────
function loop(ts) {
  if(!GS.lastMs) GS.lastMs=ts;
  GS.dt=Math.min((ts-GS.lastMs)/1000,0.05);
  GS.lastMs=ts; GS.t+=GS.dt; GS.frame++;
  pollGP();
  updateFade(GS.dt);
  updateParticles(GS.dt);

  ctx.save();

  switch(GS.screen){
    case 'splash':
      drawSplash(); break;
    case 'menu':
      drawMenu(); break;
    case 'profileSelect':
      drawProfileSelect(); break;
    case 'trackSelect':
      drawTrackSelect(); break;
    case 'game':
      drawBackground(GS.track);
      renderRoad();
      addSkid();
      if(GS.mode==='race') drawAICars();
      drawPlayerCar();
      drawParticles();
      updatePlayer(GS.dt);
      if(GS.mode==='race') updateAI(GS.dt);
      drawHUD();
      break;
    case 'pause':
      // Re-draw game underneath
      drawBackground(GS.track);
      renderRoad();
      drawPlayerCar();
      drawPause();
      break;
    case 'results':
      drawResults(); break;
    case 'garage':
      drawGarage(); break;
    case 'leaderboard':
      drawLeaderboard(); break;
  }

  drawFade();
  ctx.restore();
  requestAnimationFrame(loop);
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
detectQuality(() => { requestAnimationFrame(loop); });
