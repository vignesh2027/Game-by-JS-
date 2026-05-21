<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=gradient&customColorList=2,4,12,24&height=200&section=header&text=BMW%20RACING&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=60&desc=ULTIMATE%20EDITION&descSize=22&descAlignY=80&descColor=1C69D4"/>

<br/>

![LIVE](https://img.shields.io/badge/🏁_PLAY_NOW-LIVE-1C69D4?style=for-the-badge&labelColor=0d1117)
&nbsp;
![ENGINE](https://img.shields.io/badge/ENGINE-HTML5_Canvas-E63946?style=for-the-badge&labelColor=0d1117)
&nbsp;
![CARS](https://img.shields.io/badge/CARS-28_BMWs-FFD700?style=for-the-badge&labelColor=0d1117)
&nbsp;
![TRACKS](https://img.shields.io/badge/TRACKS-10_CIRCUITS-228B22?style=for-the-badge&labelColor=0d1117)
&nbsp;
![ZERO](https://img.shields.io/badge/DEPS-ZERO-00d26a?style=for-the-badge&labelColor=0d1117)

<br/>

### 🎮 [**PLAY BMW RACING — ULTIMATE EDITION**](https://vignesh2027.github.io/Game-by-JS-/)

*No install. No download. Just open and race.*

</div>

---

## ⚡ What Is This?

A **complete, professional-grade BMW racing game** packed into a single `index.html` file — zero dependencies, zero build tools, zero npm. Open it in any browser, offline, on any device.

Built with:
- **Pure HTML5 Canvas 2D** — pseudo-3D OutRun/SNES Mode 7 road rendering
- **Vanilla JavaScript only** — no React, no Three.js, no game libraries
- **Web Audio API** — engine sounds, tire squeal, gear shifts, all procedural
- **Inline JSON** — every car and track defined as structured data

---

## 🏎️ The Fleet — 28 BMW Models

<table>
<tr><th>Series</th><th>Models</th></tr>
<tr><td>🚗 Road Series</td><td>1 Series · 3 Series · 3 Series Touring · 5 Series · 7 Series · 8 Series Gran Coupe · Z4 Roadster</td></tr>
<tr><td>🔵 M Performance</td><td>M2 Competition · M3 Competition · M4 Competition · M5 CS · M8 Gran Coupe · M240i</td></tr>
<tr><td>🏁 Motorsport</td><td>M4 GT3 Race Car · M Hybrid V8 LMDh (Le Mans) · M2 CS Racing</td></tr>
<tr><td>🏔️ SUV & Terrain</td><td>X3 M · X5 M Competition · X6 M · X7 · XM Label Red</td></tr>
<tr><td>⚡ Electric</td><td>i4 M50 · i5 M60 · i7 xDrive60 · iX M60</td></tr>
<tr><td>🏆 Vintage Legends</td><td>E30 M3 (1986) · E46 M3 (2001) · E92 M3 (2008) · 2002 Turbo (1973)</td></tr>
</table>

Each car has unique `topSpeed`, `acceleration`, `handling`, `grip`, `driftFactor`, `mass`, and terrain bonuses.

---

## 🗺️ 10 Real-World Circuits

| Track | Location | Surface | Challenge |
|-------|----------|---------|-----------|
| Nürburgring Nordschleife | Germany | Tarmac | ██████████ 9/10 |
| BMW Welt Circuit | Munich | Tarmac | █████░░░░░ 5/10 |
| Silverstone GP | UK | Tarmac | ██████░░░░ 6/10 |
| Spa-Francorchamps | Belgium | Tarmac (Rain) | ████████░░ 8/10 |
| Monza Temple of Speed | Italy | Tarmac | █████░░░░░ 5/10 |
| Dubai Desert Strip | UAE | Sand | ████░░░░░░ 4/10 |
| Alpine Snow Pass | Austria | Ice/Snow | ████████░░ 8/10 |
| Tokyo Drift Circuit | Japan | Wet (Night) | ███████░░░ 7/10 |
| Cape Town Coastal | South Africa | Mixed | ██████░░░░ 6/10 |
| Dakar Off-Road Rally | Africa | Terrain | ███████░░░ 7/10 |

---

## 🕹️ 4 Game Modes

```
┌─────────────────────────────────────────────────────────────────┐
│  🏁  RACE MODE     — 8 AI opponents · 3 laps · rubber-band AI  │
│  💨  DRIFT ATTACK  — x8 combo chains · drift angle scoring      │
│  ⏱   TIME TRIAL    — ghost car replay · sector splits           │
│  🗺   FREE ROAM     — open terrain · 6 surface types · jumps    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎮 Controls

| Input | Action |
|-------|--------|
| `↑` / `W` | Throttle |
| `↓` / `S` | Brake / Reverse |
| `←` `→` / `A` `D` | Steer |
| `SPACE` | Handbrake / Drift |
| `R` | Reset car |
| `ESC` | Pause |
| 📱 **Touch** | Virtual joystick (left) + Drift button (right) |
| 🎮 **Gamepad** | Left stick + RT/LT + A button |

---

## 🔧 Technical Features

```
RENDERING          PHYSICS            AUDIO
─────────────────  ─────────────────  ─────────────────
Pseudo-3D road     Full drift physics OscillatorNode
Parallax (3 layers) ABS simulation    engine RPM sound
Particle pools     Terrain grip mod   Tire squeal (noise)
Skid marks         AABB collision     Gear shift click
Weather FX         Angular velocity   UI blips
Night headlights   Rubber-band AI     Procedural all

PERFORMANCE        PROGRESSION        PLATFORM
─────────────────  ─────────────────  ─────────────────
Auto quality bench 28 cars to unlock  Desktop
Object pooling     10 tracks unlock   Mobile (touch)
Pre-alloc vectors  XP + leveling      Gamepad
OffscreenCanvas    Achievements       Works offline
Tab blur pause     localStorage save  Single file
```

---

## 🏆 Progression System

- Start with **BMW 3 Series + 3 starter tracks**
- Earn **XP** from every race, drift session, and hot lap
- Level up to **unlock new cars and tracks** in order
- **12 Achievements** with XP rewards (Drift King, All BMWs, etc.)
- **Best laps** and **drift high scores** saved per car/track

---

## 🎨 Design System

```
BMW Blue    ████  #1C69D4
BMW Dark    ████  #1A1A2E
M Sport Red ████  #E63946
Track Gold  ████  #FFD700
Carbon      ████  #0D0D0D
```

---

## 🚀 Run Locally

```bash
# Option 1: Just open the file
open bmw-racing/index.html

# Option 2: Serve locally
python3 -m http.server 8080
# → http://localhost:8080/bmw-racing/
```

No npm. No build step. It's a single file.

---

<div align="center">

**Built with vanilla JS, zero dependencies, infinite speed.**

*Fork it. Mod it. Add your own tracks.*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,4,12&height=80&section=footer"/>

</div>
