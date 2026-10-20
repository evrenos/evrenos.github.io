import { $, $$, goTo, prefersReducedMotion } from './utils.js';
import { fmt, t } from './i18n.js';

/** Project filters (role + fintech tags), animated with View Transitions where supported. */
export function initProjects() {
  const grid = $('#project-grid');
  const chips = $$('.chip[data-filter]');
  const status = $('#filter-status');
  if (!grid || !chips.length) return undefined;

  const items = $$('.project', grid);
  items.forEach((item, i) => { item.style.viewTransitionName = `project-${i}`; });

  const apply = (filter) => {
    let shown = 0;
    for (const item of items) {
      const tags = (item.dataset.tags || '').split(' ');
      const match = filter === 'all' || tags.includes(filter);
      item.hidden = !match;
      if (match) {
        shown++;
        item.classList.add('is-visible'); // filtered-in cards must not wait for scroll reveal
      }
    }
    for (const c of chips) {
      const on = c.dataset.filter === filter;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    }
    status.textContent = shown === 1 ? t.filterStatusOne : fmt(t.filterStatus, { n: shown });
  };

  function setFilter(filter) {
    if (document.startViewTransition && !prefersReducedMotion()) {
      document.startViewTransition(() => apply(filter));
    } else {
      apply(filter);
    }
  }

  for (const chip of chips) chip.addEventListener('click', () => setFilter(chip.dataset.filter));

  // "Show fintech projects" style shortcuts elsewhere on the page.
  for (const btn of $$('[data-filter-go]')) {
    btn.addEventListener('click', () => {
      apply(btn.dataset.filterGo);
      goTo('projects');
    });
  }

  return { setFilter };
}
