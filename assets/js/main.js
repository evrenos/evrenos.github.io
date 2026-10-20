import { $, $$, copyText, isMac, toast } from './modules/utils.js';
import { initTheme } from './modules/theme.js';
import { runBoot } from './modules/boot.js';
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initBackground } from './modules/background.js';
import { initPointerEffects } from './modules/pointer.js';
import { TextScramble, initHoverScramble } from './modules/scramble.js';
import { initTypewriter } from './modules/typewriter.js';
import { initIndustries, initProjects } from './modules/projects.js';
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

function initStaticBits() {
  $('#year').textContent = String(new Date().getFullYear());
  const today = $('#today');
  const now = new Date();
  today.dateTime = now.toISOString().slice(0, 10);
  today.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  if (isMac) $$('[data-mod-key]').forEach((el) => { el.textContent = '⌘'; });

  for (const btn of $$('[data-copy]')) {
    btn.addEventListener('click', async () => {
      toast((await copyText(btn.dataset.copy)) ? 'Email copied ✓' : 'Copy failed — select it manually');
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
  safe('static', initStaticBits);
  safe('industries', initIndustries);
  safe('nav', initNav);
  safe('background', () => initBackground($('#bg-canvas')));
  safe('pointer', initPointerEffects);
  safe('scramble', initHoverScramble);
  const projects = safe('projects', initProjects);
  const matrix = safe('matrix', initMatrix) || (() => {});
  safe('palette', () => initPalette({ projects, matrix }));
  safe('sw', retireLegacyServiceWorker);
  safe('console', greetDevelopers);

  await runBoot().catch(() => document.documentElement.classList.remove('is-booting'));

  // Start reveals once the boot overlay is gone so the hero animates in view.
  safe('reveal', initReveal);

  // Hero intro: decrypt the name, then start cycling roles.
  const name = $('#hero-name-text');
  if (name) safe('hero', () => new TextScramble(name).set(name.textContent, { speed: 0.8 }));
  safe('typewriter', () => initTypewriter($('#typed')));
}

init().catch((err) => {
  // Anything unexpected: fall back to a fully visible, static page.
  console.error(err);
  document.documentElement.classList.remove('is-booting', 'js');
  document.documentElement.classList.add('no-fx');
});
