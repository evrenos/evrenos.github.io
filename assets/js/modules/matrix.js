import { $, prefersReducedMotion, toast } from './utils.js';
import { t } from './i18n.js';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** Digital-rain easter egg. Returns a function that starts it. */
export function initMatrix() {
  const canvas = $('#matrix');
  const ctx = canvas?.getContext('2d');
  let running = false;

  const run = () => {
    if (!ctx || running) return;
    if (prefersReducedMotion()) { toast('wake up, neo…'); return; }
    running = true;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const size = 16;
    const cols = Math.ceil(w / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = 'アカサタナハマヤラワ0123456789QAΣ{}<>/=';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
    const started = performance.now();
    canvas.classList.add('is-on');
    toast(t.matrix);

    const stop = () => {
      running = false;
      canvas.classList.remove('is-on');
      window.removeEventListener('keydown', onKey);
      setTimeout(() => ctx.clearRect(0, 0, w, h), 600);
    };
    const onKey = (e) => { if (e.key === 'Escape') stop(); };
    window.addEventListener('keydown', onKey);

    const frame = (now) => {
      if (!running) return;
      ctx.fillStyle = 'rgba(10, 6, 5, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px ui-monospace, Consolas, monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * size;
        ctx.fillStyle = Math.random() > 0.96 ? '#ffffff' : `rgba(${accent}, 0.95)`;
        ctx.fillText(ch, i * size, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.9;
      }
      if (now - started > 7000) stop(); else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  let pos = 0;
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
    if (pos === KONAMI.length) { pos = 0; run(); }
  });

  return run;
}
