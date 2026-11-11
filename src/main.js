import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from './content.js';
import { render, renderStatic } from './render.js';
import { focusBox, coverBox, containBox, isPortrait, toViewBox } from './viewbox.js';

gsap.registerPlugin(ScrollTrigger);

const RED = '#ff3b4e';
const GREEN = '#2bffa3';
const CYAN = '#2be0ff';

// Scene geometry, in SVG units (see index.html).
const SCREEN = { x: 574, y: 314, w: 452, h: 242 };
const ROOM = { x: 0, y: 0, w: 1600, h: 900 };
const ROOM_PORTRAIT = { x: 540, y: 290, w: 520, h: 640 };
const CASE = { x: 300, y: 80, w: 1000, h: 740 };
const PARTS = {
  ram: { cx: 824, cy: 290, size: 310 },
  storage: { cx: 640, cy: 500, size: 380 },
  network: { cx: 400, cy: 330, size: 300 },
  cpu: { cx: 620, cy: 290, size: 320 },
};
const TOOL_AT = { ram: { x: 809, y: 172 }, storage: { x: 786, y: 490 }, cpu: { x: 702, y: 208 } };
const HEALTH = [34, 56, 78, 100];

const stage = document.getElementById('stage');
const aspect = () => stage.clientWidth / Math.max(1, stage.clientHeight);

const roomFull = () =>
  isPortrait(aspect()) ? containBox(ROOM_PORTRAIT, aspect(), 1.05) : coverBox(ROOM, aspect());
const roomScreen = () =>
  isPortrait(aspect()) ? containBox(SCREEN, aspect(), 1.02) : coverBox(SCREEN, aspect());
const pcFull = (pad = 1) => () =>
  containBox(CASE, aspect(), (isPortrait(aspect()) ? 1.04 : 1.12) * pad);
const vb = (fn) => () => toViewBox(fn());

/** Small always-on loops that don't depend on scroll. */
function ambient() {
  const flicker = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
  flicker
    .to('.flicker-screen, .flicker-glow', { opacity: 0.15, duration: 0.05 })
    .to('.flicker-screen, .flicker-glow', { opacity: 1, duration: 0.06 })
    .to('.flicker-screen, .flicker-glow', { opacity: 0.4, duration: 0.08, delay: 0.1 })
    .to('.flicker-screen, .flicker-glow', { opacity: 1, duration: 0.12 });
  gsap.to('#tower-led', { opacity: 0.2, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' });
  gsap.to('#fan-idle', { rotation: 360, svgOrigin: '620 290', duration: 7, repeat: -1, ease: 'none' });
  gsap.to('.spin-slow', { rotation: 360, svgOrigin: '0 0', duration: 2.5, repeat: -1, ease: 'none' });
}

function story() {
  const health = { v: 0 };
  const fill = document.getElementById('health-fill');
  const value = document.getElementById('health-value');
  const paintHealth = () => {
    fill.style.width = `${health.v}%`;
    fill.style.setProperty('--h', (health.v * 1.4).toFixed(0));
    value.textContent = `${Math.round(health.v)}%`;
  };

  const netState = { p: 0 };
  const paintNetwork = () => {
    const p = netState.p;
    // Interpolate cable endpoint and control points smoothly from unplugged to plugged-in
    const c1x = 120 + 20 * p;
    const c1y = 780;
    const c2x = 150 + 60 * p;
    const c2y = 430 - 116 * p;
    const ex = 272 + 120 * p; // 272 -> 392 (right at the RJ45 socket entrance)
    const ey = 380 - 66 * p;  // 380 -> 314 (socket center Y)
    const rot = -22 * (1 - p);
    const d = `M -60 780 C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    for (const id of ['cable-shadow', 'cable', 'cable-highlight', 'cable-pulse']) {
      document.getElementById(id).setAttribute('d', d);
    }
    document.getElementById('plug').setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${rot.toFixed(1)})`);
  };
  paintNetwork();
  gsap.set('#tool', { x: 1500, y: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: '#scroll',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  // ---- 1. Dark room → camera dives into the error screen ----
  tl.to('#hint', { opacity: 0, duration: 1 }, 0);
  tl.fromTo('#room', { attr: { viewBox: vb(roomFull) } }, { attr: { viewBox: vb(roomScreen) }, duration: 8, ease: 'power2.in' }, 0);
  tl.to('#person', { opacity: 0, duration: 3 }, 4.5);
  tl.to('#terminal', { opacity: 1, duration: 1.5 }, 7.5);
  tl.to('#room', { autoAlpha: 0, duration: 0.5 }, 9);

  // ---- 2. Terminal: the call for a technician + Decrypting / Typing Hero Name ----
  document.querySelectorAll('.term-lines p').forEach((p, i) => {
    const full = p.dataset.line;
    const o = { n: 0 };
    tl.to(o, {
      n: full.length,
      duration: 1.8,
      ease: 'none',
      onUpdate() {
        const n = Math.round(o.n);
        p.textContent = full.slice(0, n);
        p.classList.toggle('typing', n > 0 && n < full.length);
      },
    }, 9 + i * 2);
  });
  tl.to('.term-lines', { opacity: 0.22, duration: 2 }, 16.8);

  const nameEl = document.getElementById('intro-name');
  const targetName = profile.name;
  const glyphs = '01ABCDEF#%&*+<>?@[]_';
  const dec = { p: 0 };
  tl.fromTo('#intro-name', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 16.8);
  tl.to(dec, {
    p: 1,
    duration: 3.2,
    ease: 'none',
    onUpdate() {
      const prog = dec.p;
      if (prog <= 0.01) {
        nameEl.textContent = '';
        nameEl.classList.remove('decoding', 'decoded');
        return;
      }
      const locked = Math.floor(prog * targetName.length);
      let out = '';
      for (let i = 0; i < targetName.length; i++) {
        const ch = targetName[i];
        if (ch === ' ') {
          out += ' ';
        } else if (i < locked) {
          out += `<span class="char-locked">${ch}</span>`;
        } else if (i <= locked + 3) {
          const g = glyphs[(i * 7 + Math.floor(prog * 60)) % glyphs.length];
          out += `<span class="char-cipher">${g}</span>`;
        } else {
          out += `<span class="char-hidden">${ch}</span>`;
        }
      }
      nameEl.innerHTML = out;
      nameEl.classList.toggle('decoding', prog > 0 && prog < 1);
      nameEl.classList.toggle('decoded', prog >= 1);
    },
  }, 16.8);
  tl.from('#intro-title', { opacity: 0, y: 14, letterSpacing: '0.7em', duration: 2, ease: 'power3.out' }, 18.8);

  // ---- 3. Into the machine: open the case and scan ----
  tl.to('#terminal', { autoAlpha: 0, duration: 2 }, 24);
  tl.to('#pc', { opacity: 1, duration: 2 }, 24.5);
  tl.fromTo('#pc', { attr: { viewBox: vb(pcFull(0.85)) } }, { attr: { viewBox: vb(pcFull()) }, duration: 4, ease: 'power2.out' }, 24.5);
  tl.to('#hud', { opacity: 1, duration: 1 }, 25);
  tl.to(health, { v: 12, duration: 1.5, onUpdate: paintHealth }, 25.5);
  tl.to('#glass', { x: -1400, opacity: 0, duration: 3, ease: 'power2.in' }, 27);

  tl.set(['#scan', '.frames', '.statuses'], { opacity: 1 }, 30);
  tl.fromTo('#scan', { x: 0 }, { x: 1010, duration: 4, ease: 'none', immediateRender: false }, 30);
  tl.to('#scan', { opacity: 0, duration: 0.5 }, 34);
  const scanHit = { network: 30.4, storage: 30.7, cpu: 30.9, ram: 31.8 };
  for (const [id, t] of Object.entries(scanHit)) {
    tl.from(`#frame-${id}`, { opacity: 0, duration: 0.3 }, t);
    tl.from(`#status-${id}`, { opacity: 0, duration: 0.4 }, t);
  }
  tl.to('#steps li i', { backgroundColor: RED, boxShadow: `0 0 10px ${RED}`, stagger: 0.3, duration: 0.3 }, 31);

  // ---- 4. Diagnose & repair each part ----
  let lastBox = pcFull();
  profile.stages.forEach((s, i) => {
    const T = 36 + i * 14;
    const id = s.id;
    const from = lastBox;
    const to = () => focusBox(PARTS[id], aspect());
    lastBox = to;

    tl.fromTo('#pc', { attr: { viewBox: vb(from) } }, { attr: { viewBox: vb(to) }, duration: 3, immediateRender: false }, T);
    const others = profile.stages.filter((o) => o.id !== id).map((o) => `#frame-${o.id}, #status-${o.id}`).join(',');
    tl.to(others, { opacity: 0.2, duration: 1 }, T);
    tl.to(`#frame-${id}, #status-${id}`, { opacity: 1, duration: 1 }, T);

    const tool = TOOL_AT[id];
    if (tool) {
      tl.fromTo('#tool', { opacity: 0, x: tool.x + 140, y: tool.y - 140 },
        { opacity: 1, x: tool.x, y: tool.y, duration: 1.2, ease: 'power3.out', immediateRender: false }, T + 2.6);
    }

    const R = T + 4; // repair starts
    if (id === 'ram') {
      tl.to('#ram-latch-top', { rotation: -28, svgOrigin: '808 165', duration: 0.4 }, R - 0.2);
      tl.to('#ram-latch-bot', { rotation: 28, svgOrigin: '808 415', duration: 0.4 }, R - 0.2);
      tl.fromTo('#ram-bad', { y: 0 }, { y: -80, duration: 1.4, ease: 'power2.out', immediateRender: false }, R);
      tl.fromTo('#tool', { y: TOOL_AT.ram.y }, { y: TOOL_AT.ram.y - 80, duration: 1.4, ease: 'power2.out', immediateRender: false }, R);
      tl.to('#ram-bad-tint', { opacity: 0, duration: 0.6 }, R + 1.4);
      tl.fromTo('#ram-bad', { y: -80 }, { y: 0, duration: 1, ease: 'power3.in', immediateRender: false }, R + 2);
      tl.fromTo('#tool', { y: TOOL_AT.ram.y - 80 }, { y: TOOL_AT.ram.y, duration: 1, ease: 'power3.in', immediateRender: false }, R + 2);
      tl.to(['#ram-latch-top', '#ram-latch-bot'], { rotation: 0, duration: 0.3 }, R + 2.9);
      tl.to('#ram-click', { opacity: 0.85, duration: 0.2 }, R + 3);
      tl.to('#ram-click', { opacity: 0, duration: 0.6 }, R + 3.2);
      tl.to('#ram-bad-led', { attr: { fill: CYAN }, opacity: 0.85, duration: 0.4 }, R + 3);
    }
    if (id === 'storage') {
      tl.to('#ssd-screw', { rotation: -720, svgOrigin: '786 490', duration: 1.2 }, R);
      tl.fromTo('#tool', { x: TOOL_AT.storage.x }, { x: TOOL_AT.storage.x + 5, duration: 0.2, repeat: 5, yoyo: true, immediateRender: false }, R);
      tl.to('#tool', { opacity: 0, duration: 0.5 }, R + 1.2);
      tl.fromTo('#ssd', { x: 0 }, { x: 70, duration: 1, immediateRender: false }, R + 1.2);
      tl.to('#ssd-tint', { opacity: 0, duration: 0.6 }, R + 2);
      tl.fromTo('#ssd', { x: 70 }, { x: 0, duration: 1, immediateRender: false }, R + 2.2);
      tl.to('#os-progress', { opacity: 1, duration: 0.3 }, R + 2.2);
      tl.to('#os-progress-bar', { attr: { width: 140 }, duration: 1.6, ease: 'none' }, R + 2.4);
      tl.to('#os-progress', { opacity: 0, duration: 0.3 }, R + 4.2);
    }
    if (id === 'network') {
      tl.to(netState, { p: 1, duration: 1.6, ease: 'power3.inOut', onUpdate: paintNetwork }, R);
      tl.to('#net-click', { opacity: 0.75, duration: 0.18 }, R + 1.55);
      tl.to('#net-click', { opacity: 0, duration: 0.5 }, R + 1.73);
      tl.to('#nic-led-a', { attr: { fill: GREEN }, duration: 0.3 }, R + 1.65);
      tl.to('#nic-led-b', { attr: { fill: CYAN }, duration: 0.3 }, R + 1.75);
      tl.set('#cable-pulse', { opacity: 1 }, R + 1.9);
      tl.fromTo('#cable-pulse', { attr: { 'stroke-dashoffset': 0 } },
        { attr: { 'stroke-dashoffset': -1600 }, duration: 6, ease: 'none', immediateRender: false }, R + 1.9);
    }
    if (id === 'cpu') {
      tl.fromTo('#tool', { x: TOOL_AT.cpu.x }, { x: TOOL_AT.cpu.x + 5, duration: 0.2, repeat: 5, yoyo: true, immediateRender: false }, R);
      tl.to('#tool', { opacity: 0, duration: 0.5 }, R + 1.2);
      tl.to('#fan', { rotation: 2160, svgOrigin: '620 290', duration: 5, ease: 'power1.in' }, R + 1);
      tl.to('#cpu-heat', { opacity: 0, duration: 2.5 }, R + 1.5);
      tl.to('#cpu-cool', { opacity: 1, duration: 2.5 }, R + 1.5);
      const temp = { t: 98 };
      const label = document.querySelector('#status-cpu .st-fault');
      tl.to(temp, { t: 42, duration: 2.5, ease: 'power1.out', onUpdate: () => { label.textContent = `TEMP ${Math.round(temp.t)}°C`; } }, R + 1.5);
    }

    // fixed ✓
    const F = T + 8;
    tl.to(`#frame-${id}`, { attr: { stroke: GREEN }, duration: 0.5 }, F);
    tl.to(`#status-${id} .st-fault`, { opacity: 0, duration: 0.4 }, F);
    tl.to(`#status-${id} .st-fixed`, { opacity: 1, duration: 0.4 }, F + 0.2);
    tl.to(`#steps li[data-id="${id}"] i`, { backgroundColor: GREEN, boxShadow: `0 0 10px ${GREEN}`, duration: 0.4 }, F);
    tl.to(health, { v: HEALTH[i], duration: 1, onUpdate: paintHealth }, F);

    // personal info card
    const card = `.info-card[data-stage="${id}"]`;
    const offset = () => (isPortrait(aspect()) ? { x: 0, y: 40 } : { x: -50, y: 0 });
    tl.fromTo(card, { opacity: 0, x: () => offset().x, y: () => offset().y },
      { opacity: 1, x: 0, y: 0, duration: 1.4, ease: 'power3.out', immediateRender: false }, F + 0.6);
    tl.from(`${card} li`, { opacity: 0, x: -20, stagger: 0.25, duration: 0.6 }, F + 1.2);
    if (tool) tl.to('#tool', { opacity: 0, duration: 0.6 }, F + 3);
    tl.to(card, { opacity: 0, duration: 1 }, F + 4);
  });

  // ---- 5. All green → back to the room ----
  tl.fromTo('#pc', { attr: { viewBox: vb(lastBox) } }, { attr: { viewBox: vb(pcFull()) }, duration: 3, immediateRender: false }, 92);
  tl.to('.frames rect, .statuses .status', { opacity: 1, duration: 1 }, 92);

  tl.set('#screen-error, #room-glow-red', { opacity: 0 }, 95);
  tl.set('#screen-ok, #room-glow-green, #person', { opacity: 1 }, 95);
  tl.set('#tower-led', { attr: { fill: GREEN } }, 95);
  tl.to('#pc', { opacity: 0, duration: 1.5 }, 95.5);
  tl.to('#room', { autoAlpha: 1, duration: 1.5 }, 95.5);
  tl.fromTo('#room', { attr: { viewBox: vb(roomScreen) } }, { attr: { viewBox: vb(roomFull) }, duration: 6, ease: 'power2.out', immediateRender: false }, 95.5);
  tl.to('#lamp-glow', { opacity: 1, duration: 2 }, 99);
  tl.to('#lamp-bulb', { opacity: 1, duration: 1 }, 99);

  tl.to('#final', { autoAlpha: 1, duration: 2 }, 101);
  tl.from('#final > *', { opacity: 0, y: 20, stagger: 0.3, duration: 1 }, 101.5);
  tl.to({}, { duration: 3 }, 106); // hold on the final frame
}

render();
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('static');
  renderStatic();
} else {
  ambient();
  story();
}
