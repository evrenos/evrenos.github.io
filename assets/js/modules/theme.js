import { $, prefersReducedMotion, storage } from './utils.js';
import { t } from './i18n.js';

const META_COLORS = { light: '#faf9f7', dark: '#100c0b' };
const root = document.documentElement;

export const currentTheme = () => root.getAttribute('data-theme') || 'light';

/** Applies a theme. Only `persist` (an explicit visitor choice) is stored. */
export function setTheme(theme, { persist = false } = {}) {
  root.setAttribute('data-theme', theme);
  if (persist) storage.set('theme', theme);
  $('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme]);
  $('#theme-toggle')?.setAttribute('aria-label', theme === 'dark' ? t.themeToLight || 'Switch to light mode' : t.themeToDark || 'Switch to dark mode');
  document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

/** Toggles the theme with a circular reveal from (x, y) when View Transitions are supported. */
export function toggleTheme(x = window.innerWidth - 60, y = 36) {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  if (!document.startViewTransition || prefersReducedMotion()) {
    setTheme(next, { persist: true });
    return;
  }
  root.style.setProperty('--tx', `${x}px`);
  root.style.setProperty('--ty', `${y}px`);
  root.classList.add('theme-vt');
  const vt = document.startViewTransition(() => setTheme(next, { persist: true }));
  vt.finished.finally(() => root.classList.remove('theme-vt'));
}

export function initTheme() {
  setTheme(currentTheme());
  $('#theme-toggle')?.addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme(r.left + r.width / 2, r.top + r.height / 2);
  });
  // Follow OS changes until the visitor picks a theme explicitly.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!storage.get('theme')) setTheme(e.matches ? 'dark' : 'light');
  });
}
