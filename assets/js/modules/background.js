import { prefersReducedMotion } from './utils.js';

/**
 * Interactive "constellation" network on a fixed canvas.
 * Nodes drift slowly, link to near neighbours and lean towards the pointer.
 * Density scales with viewport area; animation pauses when the tab is hidden.
 */
export function initBackground(canvas) {
  if (!canvas || prefersReducedMotion()) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const LINK = 130;
  const MOUSE_R = 180;
  let w = 0, h = 0, dpr = 1;
  let nodes = [];
  let rgb = '101, 13, 0';
  const mouse = { x: -9999, y: -9999 };
  let raf = 0;

  const readColor = () => {
    rgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || rgb;
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(80, Math.round((w * h) / 16000));
    while (nodes.length < target) nodes.push(spawn());
    nodes.length = target;
  };

  const spawn = () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.4 + 0.6,
  });

  const step = () => {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < MOUSE_R && d > 0.1) {
        n.vx += (dx / d) * 0.012;
        n.vy += (dy / d) * 0.012;
      }
      n.vx *= 0.985;
      n.vy *= 0.985;
      // keep a minimum drift so the field never freezes
      if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.04;
      if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.04;
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        if (dx > LINK || dx < -LINK) continue;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK) {
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / LINK) * 0.22})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < MOUSE_R) {
        ctx.strokeStyle = `rgba(${rgb}, ${(1 - md / MOUSE_R) * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${rgb}, 0.55)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(step);
  };

  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); };
  const stop = () => cancelAnimationFrame(raf);

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  document.addEventListener('themechange', readColor);

  readColor();
  resize();
  start();
}
