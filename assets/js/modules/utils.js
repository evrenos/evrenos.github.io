export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export const prefersReducedMotion = () => reducedQuery.matches;
export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Storage that never throws (private mode, blocked cookies, sandboxed previews). */
export const storage = {
  get(key, session = false) {
    try { return (session ? sessionStorage : localStorage).getItem(key); } catch { return null; }
  },
  set(key, value, session = false) {
    try { (session ? sessionStorage : localStorage).setItem(key, value); } catch { /* ignore */ }
  },
};

export const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

let toastTimer;
export function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.className = 'sr-only';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

/** Smooth-scroll to a section id and keep the URL hash in sync without jumping. */
export function goTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', id === 'home' ? location.pathname : `#${id}`);
}
