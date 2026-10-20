import { $, $$, copyText, isMac, toast } from './modules/utils.js';
import { t } from './modules/i18n.js';
import { monthsBetween, tenure } from './modules/duration.js';
import { initTheme } from './modules/theme.js';
import { runBoot } from './modules/boot.js';
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initBackground } from './modules/background.js';
import { initPointerEffects } from './modules/pointer.js';
import { initHoverScramble, scrambleOverlay } from './modules/scramble.js';
import { initTypewriter } from './modules/typewriter.js';
import { initProjects } from './modules/projects.js';
import { initPipeline } from './modules/pipeline.js';
import { initProjectModal } from './modules/project-modal.js';
import { initPalette } from './modules/palette.js';
import { initMatrix } from './modules/matrix.js';

/** Run a feature in isolation so one failure never breaks the rest of the page. */
function safe(name, fn) {
  try {
    return fn();
  } catch (err) {
    console.error(`[${name}]`, err);
    return undefined;
  }
}

/** Date-dependent text is rendered at build time; refresh it so it never goes stale. */
function initLiveDates() {
  const now = new Date();
  $('#year').textContent = String(now.getFullYear());

  const today = $('#today');
  today.dateTime = now.toISOString().slice(0, 10);
  today.textContent = now.toLocaleDateString(t.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

  for (const el of $$('[data-tenure-from]')) el.textContent = tenure(el.dataset.tenureFrom, null, t.lang, now);
  for (const el of $$('[data-years-since]')) el.dataset.count = String(now.getFullYear() - Number(el.dataset.yearsSince));
  for (const el of $$('[data-tenure-years]')) el.dataset.count = String(Math.floor(monthsBetween(el.dataset.tenureYears, null, now) / 12));
  for (const el of $$('[data-count][data-suffix]')) el.textContent = `${el.dataset.count}${el.dataset.suffix}`;
}

function initStaticBits() {
  if (isMac) $$('[data-mod-key]').forEach((el) => { el.textContent = '⌘'; });
  for (const btn of $$('[data-copy]')) {
    btn.addEventListener('click', async () => {
      toast((await copyText(btn.dataset.copy)) ? t.copied : t.copyFailed);
    });
  }
}

/** The previous Flutter build registered a service worker; make sure it is gone. */
function retireLegacyServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.getRegistrations()
    .then((regs) => regs.forEach((r) => r.unregister()))
    .catch(() => {});
}

function greetDevelopers() {
  const accent = 'color:#b4371f;font-weight:700';
  console.log(
    '%c<EVRENOS EVRENOS />%c\n\nHi fellow dev 👋  Found a bug? That is literally my job.\n' +
    'Try Ctrl/⌘+K for the command menu — or ↑↑↓↓←→←→BA.\n' +
    'Source: https://github.com/evrenos/evrenos.github.io',
    `${accent};font-size:18px;font-family:monospace`, 'color:inherit;font-family:monospace',
  );
}

async function init() {
  safe('theme', initTheme);
  safe('dates', initLiveDates);
  safe('static', initStaticBits);
  safe('nav', initNav);
  safe('background', () => initBackground($('#bg-canvas')));
  safe('pointer', initPointerEffects);
  safe('scramble', initHoverScramble);
  const projects = safe('projects', initProjects);
  safe('project-modal', initProjectModal);
  const matrix = safe('matrix', initMatrix) || (() => {});
  safe('palette', () => initPalette({ projects, matrix }));
  safe('sw', retireLegacyServiceWorker);
  safe('console', greetDevelopers);

  await runBoot().catch(() => document.documentElement.classList.remove('is-booting'));

  // Start reveals once the boot overlay is gone so the hero animates in view.
  safe('reveal', initReveal);
  safe('pipeline', initPipeline);

  // Hero intro: decrypt the name, then start cycling roles.
  const name = $('#hero-name');
  if (name) safe('hero', () => scrambleOverlay(name, { speed: 0.8 }));
  safe('typewriter', () => initTypewriter($('#typed')));
}

init().catch((err) => {
  // Anything unexpected: fall back to a fully visible, static page.
  console.error(err);
  document.documentElement.classList.remove('is-booting', 'js');
  document.documentElement.classList.add('no-fx');
});
