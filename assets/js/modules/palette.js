import { $, copyText, goTo, toast } from './utils.js';
import { toggleTheme } from './theme.js';

const EMAIL = 'evrenosevrenos@outlook.com';
const LINKEDIN = 'https://www.linkedin.com/in/evrenos-evrenos/';
const GITHUB = 'https://github.com/evrenos';

const openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer');

/** Ctrl/⌘+K command palette with fuzzy filtering and full keyboard support. */
export function initPalette({ projects, matrix }) {
  const dialog = $('#palette');
  const input = $('#palette-input');
  const list = $('#palette-list');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const commands = [
    { group: 'Navigate', label: 'Home', icon: 'i-terminal', hint: '#home', run: () => goTo('home') },
    { group: 'Navigate', label: 'About', icon: 'i-terminal', hint: '#about', run: () => goTo('about') },
    { group: 'Navigate', label: 'Projects', icon: 'i-terminal', hint: '#projects', run: () => goTo('projects') },
    { group: 'Navigate', label: 'Contact', icon: 'i-terminal', hint: '#contact', run: () => goTo('contact') },
    { group: 'Projects', label: 'Show all projects', icon: 'i-search', run: () => filter('all') },
    { group: 'Projects', label: 'Filter: Lead QA', icon: 'i-search', run: () => filter('lead') },
    { group: 'Projects', label: 'Filter: QA Engineer', icon: 'i-search', run: () => filter('qa') },
    { group: 'Projects', label: 'Filter: QA & Project Manager', icon: 'i-search', run: () => filter('pm') },
    { group: 'Projects', label: 'Filter: Flutter Developer', icon: 'i-search', run: () => filter('dev') },
    { group: 'Links', label: 'Open LinkedIn / Resume', icon: 'i-linkedin', hint: '↗', run: () => openExternal(LINKEDIN) },
    { group: 'Links', label: 'Open GitHub', icon: 'i-github', hint: '↗', run: () => openExternal(GITHUB) },
    { group: 'Links', label: 'Send an email', icon: 'i-mail', run: () => { location.href = `mailto:${EMAIL}`; } },
    { group: 'Links', label: 'Copy email address', icon: 'i-copy', run: async () => toast((await copyText(EMAIL)) ? 'Email copied ✓' : 'Copy failed') },
    { group: 'System', label: 'Toggle dark / light theme', icon: 'i-moon', run: () => toggleTheme() },
    { group: 'System', label: 'Enter the matrix', icon: 'i-terminal', hint: 'easter egg', run: () => matrix() },
  ];

  function filter(name) {
    projects?.setFilter(name);
    goTo('projects');
  }

  let results = commands;
  let active = 0;

  const score = (cmd, q) => {
    if (!q) return 1;
    const hay = `${cmd.group} ${cmd.label}`.toLowerCase();
    if (hay.includes(q)) return 2 + (cmd.label.toLowerCase().startsWith(q) ? 1 : 0);
    // subsequence match: "lnk" → "LinKedin"
    let i = 0;
    for (const ch of hay) if (ch === q[i]) i++;
    return i === q.length ? 1 : 0;
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
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
      li.textContent = `command not found: ${q}`;
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
