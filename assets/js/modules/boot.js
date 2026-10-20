import { $, storage } from './utils.js';
import { t } from './i18n.js';

const DELAYS = [260, 160, 150, 220, 150, 260];

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
      for (const [i, html] of t.boot.entries()) {
        const delay = DELAYS[i] ?? 180;
        if (skipped) return;
        // Static, trusted markup from the build's i18n block — never user input.
        log.insertAdjacentHTML('beforeend', `${html}\n`);
        await new Promise((r) => setTimeout(r, delay));
      }
      setTimeout(finish, 250);
    })();
  });
}
