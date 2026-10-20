import { $$, prefersReducedMotion } from './utils.js';
import { scrambleOverlay } from './scramble.js';

/** Fade/slide elements in when they enter the viewport; count-up numbers; scramble section titles. */
export function initReveal() {
  // Stagger siblings that reveal together (grid cards, stats, socials…)
  for (const parent of new Set($$('[data-reveal]').map((el) => el.parentElement))) {
    [...parent.children].filter((c) => c.hasAttribute('data-reveal'))
      .forEach((el, i) => el.style.setProperty('--stagger', String(Math.min(i, 6))));
  }
  // Index editor lines for the line-by-line "typing" reveal
  $$('.editor .ln').forEach((ln, i) => ln.style.setProperty('--i', String(i)));

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-visible');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      if (e.target.matches('[data-count]')) countUp(e.target);
      const title = e.target.querySelector('[data-scramble-reveal]');
      if (title) scrambleOverlay(title);
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  $$('[data-reveal]').forEach((el) => io.observe(el));
}

function countUp(el) {
  const to = Number(el.dataset.count);
  if (!Number.isFinite(to) || prefersReducedMotion()) return;
  const from = Number(el.dataset.countFrom || 0);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = `${Math.round(from + (to - from) * eased)}${el.dataset.suffix || ''}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
