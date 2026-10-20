import { $, $$, goTo } from './utils.js';

/** Header state, scroll progress, active-section indicator, mobile menu, back-to-top. */
export function initNav() {
  const header = $('#header');
  const bar = $('#progress-bar');
  const toTop = $('#to-top');
  const toTopProgress = $('#to-top-progress');
  const links = $$('.nav__link');
  const indicator = $('#nav-indicator');
  const burger = $('#burger');
  const list = $('#nav-list');

  // --- Scroll-driven state (one rAF per frame) ---
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      header.classList.toggle('is-scrolled', y > 8);
      bar.style.transform = `scaleX(${p})`;
      toTop.classList.toggle('is-visible', y > window.innerHeight * 0.6);
      toTopProgress.style.strokeDashoffset = String(100 - p * 100);
      queued = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Active section + sliding indicator ---
  const moveIndicator = (link) => {
    if (!link || getComputedStyle(indicator).display === 'none') return;
    const navRect = indicator.parentElement.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    indicator.style.width = `${r.width - 24}px`;
    indicator.style.transform = `translateX(${r.left - navRect.left + 12}px)`;
    indicator.style.opacity = '1';
  };
  const setActive = (id) => {
    let active = null;
    for (const l of links) {
      const on = l.dataset.section === id;
      l.classList.toggle('is-active', on);
      if (on) { l.setAttribute('aria-current', 'location'); active = l; } else l.removeAttribute('aria-current');
    }
    moveIndicator(active);
  };

  const sections = links.map((l) => document.getElementById(l.dataset.section)).filter(Boolean);
  const visible = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) visible.set(e.target.id, e.intersectionRatio);
    let best = null, bestRatio = 0;
    for (const s of sections) {
      const r = visible.get(s.id) || 0;
      if (r > bestRatio) { best = s.id; bestRatio = r; }
    }
    if (best) setActive(best);
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.25, 0.5, 1] });
  sections.forEach((s) => io.observe(s));
  window.addEventListener('resize', () => moveIndicator($('.nav__link.is-active')), { passive: true });

  // --- Mobile menu ---
  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    list.classList.remove('is-open');
  };
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    list.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.header')) closeMenu(); });

  // --- In-page links: smooth scroll + clean hash ---
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    closeMenu();
    goTo(id);
  });

  // --- Legacy Flutter routes (#/about, #/projects) keep working ---
  const legacy = location.hash.match(/^#\/(\w*)/);
  if (legacy) {
    const id = legacy[1] || 'home';
    history.replaceState(null, '', id === 'home' ? location.pathname : `#${id}`);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }
}
