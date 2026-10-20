import { $, $$, prefersReducedMotion } from './utils.js';

/** Role filters for the project grid (animated with View Transitions where supported). */
export function initProjects() {
  const grid = $('#project-grid');
  const chips = $$('.chip[data-filter]');
  const status = $('#filter-status');
  if (!grid || !chips.length) return;

  const items = $$('.project', grid);
  items.forEach((item, i) => { item.style.viewTransitionName = `project-${i}`; });

  const apply = (filter) => {
    let shown = 0;
    for (const item of items) {
      const match = filter === 'all' || item.dataset.role === filter;
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
    status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
  };

  for (const chip of chips) {
    chip.addEventListener('click', () => setFilter(chip.dataset.filter));
  }

  function setFilter(filter) {
    if (document.startViewTransition && !prefersReducedMotion()) {
      document.startViewTransition(() => apply(filter));
    } else {
      apply(filter);
    }
  }

  return { setFilter };
}

/** Builds the industries marquee and the "industry tags" stat from the cards themselves. */
export function initIndustries() {
  const track = $('#marquee-track');
  const stat = $('#stat-industries');
  const seen = new Map();
  for (const dd of $$('.card__meta div:last-child dd')) {
    for (const raw of dd.textContent.split(',')) {
      const label = raw.trim();
      const key = label.toLowerCase().replace(/[^a-z]/g, '');
      if (label && !seen.has(key)) seen.set(key, label);
    }
  }
  const industries = [...seen.values()];
  if (stat) {
    stat.dataset.count = String(industries.length);
    stat.textContent = String(industries.length);
  }
  if (!track) return;
  // Two copies so the -50% translate loops seamlessly.
  for (let copy = 0; copy < 2; copy++) {
    for (const label of industries) {
      const span = document.createElement('span');
      span.className = 'marquee__item';
      span.textContent = label;
      track.append(span);
    }
  }
}
