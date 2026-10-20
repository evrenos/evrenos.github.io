import { $$, clamp, hasFinePointer, lerp, prefersReducedMotion } from './utils.js';

const INTERACTIVE = 'a, button, [data-tilt], input, kbd, .chip';

/** Pointer-driven effects: grid spotlight, custom cursor, magnetic elements, 3D card tilt. */
export function initPointerEffects() {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  const root = document.documentElement;

  // --- Spotlight on the dot grid (CSS reads --mx/--my) ---
  let sx = 0, sy = 0, spotQueued = false;
  window.addEventListener('pointermove', (e) => {
    sx = e.clientX; sy = e.clientY;
    if (spotQueued) return;
    spotQueued = true;
    requestAnimationFrame(() => {
      root.style.setProperty('--mx', `${sx}px`);
      root.style.setProperty('--my', `${sy}px`);
      spotQueued = false;
    });
  }, { passive: true });

  initCursor();
  initMagnetic();
  initTilt();
}

function initCursor() {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  const body = document.body;
  const pos = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pos.x = e.clientX; pos.y = e.clientY;
    body.classList.add('has-cursor');
  }, { passive: true });
  document.addEventListener('pointerleave', () => body.classList.remove('has-cursor'));
  window.addEventListener('pointerdown', () => body.classList.add('cursor-down'));
  window.addEventListener('pointerup', () => body.classList.remove('cursor-down'));
  document.addEventListener('pointerover', (e) => {
    body.classList.toggle('cursor-hover', !!e.target.closest?.(INTERACTIVE));
  });

  (function loop() {
    ringPos.x = lerp(ringPos.x, pos.x, 0.18);
    ringPos.y = lerp(ringPos.y, pos.y, 0.18);
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    requestAnimationFrame(loop);
  })();
}

function initMagnetic() {
  for (const el of $$('[data-magnetic]')) {
    const strength = el.classList.contains('btn') ? 0.22 : 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }
}

function initTilt() {
  const MAX = 7; // degrees
  for (const card of $$('[data-tilt]')) {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const px = clamp((e.clientX - r.left) / r.width, 0, 1);
        const py = clamp((e.clientY - r.top) / r.height, 0, 1);
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', `${(px - 0.5) * MAX * 2}deg`);
        card.style.setProperty('--rx', `${(0.5 - py) * MAX * 2}deg`);
        card.style.setProperty('--gx', `${px * 100}%`);
        card.style.setProperty('--gy', `${py * 100}%`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }
}
