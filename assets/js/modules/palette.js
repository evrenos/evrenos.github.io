import { $, copyText, goTo, toast } from './utils.js';
import { toggleTheme } from './theme.js';
import { t } from './i18n.js';

const EMAIL = 'evrenosevrenos@outlook.com';
const LINKEDIN = 'https://www.linkedin.com/in/evrenos-evrenos/';
const GITHUB = 'https://github.com/evrenos';
const FINBYTE = 'https://finbyte.com';

const openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer');

/** Ctrl/⌘+K command palette with fuzzy filtering and full keyboard support. */
export function initPalette({ projects, matrix }) {
  const dialog = $('#palette');
  const input = $('#palette-input');
  const list = $('#palette-list');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const L = t.palette;
  const G = L.groups;
  const commands = [
    { group: G.nav, label: L.home, icon: 'i-terminal', hint: '#home', run: () => goTo('home') },
    { group: G.nav, label: L.about, icon: 'i-terminal', hint: '#about', run: () => goTo('about') },
    { group: G.nav, label: L.experience, icon: 'i-terminal', hint: '#experience', run: () => goTo('experience') },
    { group: G.nav, label: L.fintech, icon: 'i-card', hint: '#fintech', run: () => goTo('fintech') },
    { group: G.nav, label: L.projects, icon: 'i-terminal', hint: '#projects', run: () => goTo('projects') },
    { group: G.nav, label: L.contact, icon: 'i-terminal', hint: '#contact', run: () => goTo('contact') },
    { group: G.projects, label: L.filterFintech, icon: 'i-card', run: () => filter('fintech') },
    { group: G.projects, label: L.filterAll, icon: 'i-search', run: () => filter('all') },
    { group: G.projects, label: L.filterLead, icon: 'i-search', run: () => filter('lead') },
    { group: G.projects, label: L.filterQa, icon: 'i-search', run: () => filter('qa') },
    { group: G.projects, label: L.filterPm, icon: 'i-search', run: () => filter('pm') },
    { group: G.projects, label: L.filterDev, icon: 'i-search', run: () => filter('dev') },
    { group: G.links, label: L.linkedin, icon: 'i-linkedin', hint: '↗', run: () => openExternal(LINKEDIN) },
    { group: G.links, label: L.github, icon: 'i-github', hint: '↗', run: () => openExternal(GITHUB) },
    { group: G.links, label: L.finbyte, icon: 'i-external', hint: '↗', run: () => openExternal(FINBYTE) },
    { group: G.links, label: L.email, icon: 'i-mail', run: () => { location.href = `mailto:${EMAIL}`; } },
    { group: G.links, label: L.copyEmail, icon: 'i-copy', run: async () => toast((await copyText(EMAIL)) ? t.copied : t.copyFailed) },
    { group: G.system, label: L.language, icon: 'i-globe', hint: t.lang === 'tr' ? 'EN' : 'TR', run: () => { location.href = t.altHref; } },
    { group: G.system, label: L.theme, icon: 'i-moon', run: () => toggleTheme() },
    { group: G.system, label: L.matrix, icon: 'i-terminal', hint: L.easterEgg, run: () => matrix() },
  ].filter((c) => c.label);

  function filter(name) {
    projects?.setFilter(name);
    goTo('projects');
  }

  let results = commands;
  let active = 0;

  const score = (cmd, q) => {
    if (!q) return 1;
    const hay = `${cmd.group} ${cmd.label}`.toLocaleLowerCase(t.lang);
    if (hay.includes(q)) return 2 + (cmd.label.toLowerCase().startsWith(q) ? 1 : 0);
    // subsequence match: "lnk" → "LinKedin"
    let i = 0;
    for (const ch of hay) if (ch === q[i]) i++;
    return i === q.length ? 1 : 0;
  };

  const render = () => {
    const q = input.value.trim().toLocaleLowerCase(t.lang);
    results = commands
      .map((c) => ({ c, s: score(c, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => (q ? b.s - a.s : 0))
      .map((r) => r.c);
    active = Math.min(active, Math.max(0, results.length - 1));

    list.replaceChildren();
    if (!results.length) {
      const li = document.createElement('li');
      li.className = 'palette__empty';
      li.textContent = `${t.paletteEmpty}: ${q}`;
      list.append(li);
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = '';
    results.forEach((cmd, i) => {
      if (!q && cmd.group !== lastGroup) {
        lastGroup = cmd.group;
        const g = document.createElement('li');
        g.className = 'palette__group';
        g.setAttribute('role', 'presentation');
        g.textContent = cmd.group;
        list.append(g);
      }
      const li = document.createElement('li');
      li.className = 'palette__item';
      li.id = `cmd-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'icon');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS(svgNS, 'use');
      use.setAttribute('href', `#${cmd.icon}`);
      svg.append(use);
      const label = document.createElement('span');
      label.textContent = cmd.label;
      li.append(svg, label);
      if (cmd.hint) {
        const small = document.createElement('small');
        small.textContent = cmd.hint;
        li.append(small);
      }
      li.addEventListener('pointermove', () => { if (active !== i) { active = i; highlight(); } });
      li.addEventListener('click', () => execute(i));
      list.append(li);
    });
    highlight();
  };

  const highlight = () => {
    list.querySelectorAll('.palette__item').forEach((el, i) => el.setAttribute('aria-selected', String(i === active)));
    const el = $(`#cmd-${active}`, list);
    if (el) {
      input.setAttribute('aria-activedescendant', el.id);
      el.scrollIntoView({ block: 'nearest' });
    }
  };

  const execute = (i) => {
    const cmd = results[i];
    if (!cmd) return;
    close();
    // Let the dialog close before scrolling / opening windows.
    requestAnimationFrame(() => cmd.run());
  };

  const open = () => {
    if (dialog.open) return;
    input.value = '';
    active = 0;
    render();
    dialog.showModal();
    input.focus();
  };
  const close = () => { if (dialog.open) dialog.close(); };

  input.addEventListener('input', () => { active = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(1, results.length); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + results.length) % Math.max(1, results.length); highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); execute(active); }
  });
  // Click on the backdrop closes the dialog.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      dialog.open ? close() : open();
    } else if (e.key === '/' && !dialog.open && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)) {
      e.preventDefault();
      open();
    }
  });
  document.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', open));
}
