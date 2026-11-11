# Repair-Story Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-page Arabic portfolio that tells a scroll-driven "diagnose & repair" story with SVG scenes.

**Architecture:** Static Vite site. `index.html` holds 8 scene sections with inline SVG. `src/content.js` holds all copy/contacts (single source of truth). `src/scenes/*.js` each export `init(gsap)` building one ScrollTrigger timeline. `src/main.js` wires them and handles reduced motion.

**Tech Stack:** Vite 6, GSAP 3 (ScrollTrigger), vanilla JS, CSS. Tests: `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-11-repair-story-portfolio-design.md`

## Global Constraints
- `dir="rtl"`, `lang="ar"`; technical terms in English.
- No GPA anywhere; learning hours text is "+500 ساعة".
- Contacts: mubarak_almalki@outlook.com · https://wa.me/966580231353 · https://instagram.com/guum · `/cv.pdf`.
- No home address. No work-experience section.
- `prefers-reduced-motion: reduce` → all content visible, no scrub animations.

## Review Focus
- Narrow mobile viewport (360px): SVG scenes scale, info cards don't overflow → CSS check in Task 3.
- Reduced motion: content readable without GSAP → test in Task 1 (content renders from HTML, not JS-only).
- Fast scroll / refresh mid-page: timelines must use `scrub` so state matches scroll position.
- Missing `cv.pdf`: link must still point to `/cv.pdf`; copy CV into `public/`.
- Fonts failing to load: fallback to system Arabic font stack.

---

### Task 1: Scaffold + content data
**Files:** Create `package.json`, `vite.config.js`, `src/content.js`, `tests/content.test.js`, `public/cv.pdf`
**Produces:** `export const profile = { name, title, contacts:{email, whatsapp, instagram, cv}, stages:[{id, part, faultText, fixedText, info:[string]}] }`
- [ ] Test `tests/content.test.js`: asserts no string contains "4.41" or "معدل"; some stage info contains "+500"; contacts equal the Global Constraints values; `stages.map(s=>s.id)` equals `["ram","storage","network","cpu"]`.
- [ ] Run `node --test tests` → FAIL. Implement `content.js`. Run → PASS. Commit.

### Task 2: Scenes markup + styles
**Files:** `index.html`, `src/styles.css`
- [ ] Sections `#room`, `#call`, `#open`, `#stage-ram`, `#stage-storage`, `#stage-network`, `#stage-cpu`, `#resolved`; each part SVG has `.fault` (red) and `.fixed` (green) state groups; info cards `.info-card[data-stage]`.
- [ ] `npm run build` succeeds. Commit.

### Task 3: Animations
**Files:** `src/main.js`, `src/scenes/room.js`, `src/scenes/call.js`, `src/scenes/stages.js`, `src/scenes/resolved.js`
**Interfaces:** each exports `init(gsap: GSAP, ScrollTrigger): void`.
- [ ] Room: screen flicker loop + red glow; pinned zoom into screen. Call: typewriter text tied to scroll. Stages: per stage pinned timeline: scan line → fault red → part lifts/reseats → turns green → info card in. Resolved: room returns, screen green ✓, contacts in.
- [ ] Reduced motion branch in `main.js` skips `init` calls and adds `.static` class.
- [ ] Manual check in browser at 1440px and 360px. Commit.
