import { prefersReducedMotion } from './utils.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Cycles through roles: type → hold → delete → next. */
export function initTypewriter(el) {
  if (!el) return;
  let roles;
  try { roles = JSON.parse(el.dataset.roles); } catch { return; }
  if (!Array.isArray(roles) || roles.length < 2 || prefersReducedMotion()) return;

  let index = 0;
  let paused = false;
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  (async function loop() {
    await wait(2200);
    for (;;) {
      const current = roles[index];
      for (let i = current.length; i >= 0; i--) {
        el.textContent = current.slice(0, i);
        await wait(32);
      }
      index = (index + 1) % roles.length;
      const next = roles[index];
      await wait(260);
      for (let i = 1; i <= next.length; i++) {
        el.textContent = next.slice(0, i);
        await wait(55 + Math.random() * 60);
      }
      do { await wait(2200); } while (paused);
    }
  })();
}
