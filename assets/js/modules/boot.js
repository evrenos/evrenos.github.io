import { $, storage } from './utils.js';

const LINES = [
  ['<span class="hl">$</span> ssh evrenos@portfolio', 260],
  ['<span class="dim">› establishing secure session…</span>', 160],
  ['› loading profile ............ <span class="ok">[ok]</span>', 150],
  ['› fetching 13 projects ....... <span class="ok">[ok]</span>', 150],
  ['› running regression suite ... <span class="ok">all green ✓</span>', 220],
  ['<span class="hl">›</span> ready. welcome 👋', 260],
];

/**
 * First-visit-per-session terminal boot. Resolves when the overlay is gone.
 * theme-init.js decides whether it is shown (html.is-booting).
 */
export function runBoot() {
  const root = document.documentElement;
  if (!root.classList.contains('is-booting')) return Promise.resolve();

  const overlay = $('.boot');
  const log = $('#boot-log');
  let skipped = false;

  return new Promise((resolve) => {
    const finish = () => {
      if (finish.done) return;
      finish.done = true;
      storage.set('booted', '1', true);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      overlay.classList.add('is-leaving');
      setTimeout(() => {
        root.classList.remove('is-booting');
        overlay.remove();
        resolve();
      }, 650);
    };
    const skip = () => { skipped = true; finish(); };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });

    (async () => {
      for (const [html, delay] of LINES) {
        if (skipped) return;
        // Static, trusted markup defined above — never user input.
        log.insertAdjacentHTML('beforeend', `${html}\n`);
        await new Promise((r) => setTimeout(r, delay));
      }
      setTimeout(finish, 250);
    })();
  });
}
