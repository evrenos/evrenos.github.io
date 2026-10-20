import { $$, prefersReducedMotion } from './utils.js';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

/** "Decrypting" text effect. Resolves when the final text is in place. */
export class TextScramble {
  constructor(el) {
    this.el = el;
    this.frame = 0;
    this.raf = 0;
  }

  set(text, { speed = 1 } = {}) {
    if (prefersReducedMotion()) {
      this.el.textContent = text;
      return Promise.resolve();
    }
    const old = this.el.textContent;
    const length = Math.max(old.length, text.length);
    this.queue = Array.from({ length }, (_, i) => {
      const start = Math.floor((Math.random() * 18) / speed);
      const end = start + Math.floor((Math.random() * 22 + 6) / speed);
      return { from: old[i] || '', to: text[i] || '', start, end, char: '' };
    });
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.update();
    });
  }

  update = () => {
    let done = 0;
    const frag = document.createDocumentFragment();
    for (const q of this.queue) {
      if (this.frame >= q.end) {
        done++;
        frag.append(q.to);
      } else if (this.frame >= q.start) {
        if (!q.char || Math.random() < 0.28) q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const span = document.createElement('span');
        span.className = 'scramble-char';
        span.textContent = q.to === ' ' ? ' ' : q.char;
        frag.append(span);
      } else {
        frag.append(q.from);
      }
    }
    this.el.replaceChildren(frag);
    if (done === this.queue.length) {
      this.el.textContent = this.queue.map((q) => q.to).join('');
      this.resolve();
    } else {
      this.frame++;
      this.raf = requestAnimationFrame(this.update);
    }
  };
}

/** Scramble on hover/focus for elements marked [data-scramble-hover]. */
export function initHoverScramble() {
  for (const el of $$('[data-scramble-hover]')) {
    const text = el.textContent;
    const fx = new TextScramble(el);
    let busy = false;
    const host = el.closest('a, button') || el;
    const run = () => {
      if (busy) return;
      busy = true;
      fx.set(text, { speed: 2 }).then(() => { busy = false; });
    };
    host.addEventListener('pointerenter', run);
    host.addEventListener('focus', run);
  }
}
