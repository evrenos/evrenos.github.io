import { PROJECTS, INDUSTRIES } from './content/projects.mjs';
import { monthsBetween, tenure } from '../assets/js/modules/duration.js';

export const SITE = 'https://evrenos.github.io';
const EMAIL = 'evrenosevrenos@outlook.com';
const LINKEDIN = 'https://www.linkedin.com/in/evrenos-evrenos/';
const GITHUB = 'https://github.com/evrenos';
const FINBYTE = 'https://finbyte.com';
const CAREER_START = 2016;
const FINBYTE_START = '2021-06';
const STAFF_START = '2025-06';
const LEAD_END = '2025-06';

/* ---------- helpers ---------- */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
/** Escapes text, then turns **phrase** into <strong>phrase</strong>. */
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
/** JSON safe to embed inside a <script> data block. */
const jsonBlock = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const monthLabel = (ym, months) => {
  const [y, m] = ym.split('-').map(Number);
  return `${months[m - 1]} ${y}`;
};

/** "2019" or "2024 – present" */
const yearLabel = (p, t) => (p.years
  ? `${p.years[0]} – ${p.years[1] ?? t.projects.present}`
  : String(p.year));

function uniqueIndustries(lang) {
  const keys = [...new Set(PROJECTS.flatMap((p) => p.industries))];
  return keys.map((k) => INDUSTRIES[k][lang]);
}

/* ---------- structured data ---------- */
function jsonLd(t, now) {
  const url = SITE + t.path;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: t.lang,
    dateModified: now.toISOString().slice(0, 10),
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: 'Evrenos Evrenos',
      url: `${SITE}/`,
      image: `${SITE}/assets/images/profile.png`,
      jobTitle: 'Staff QA Engineer',
      description: t.meta.description,
      email: `mailto:${EMAIL}`,
      worksFor: { '@type': 'Organization', name: 'finbyte', url: FINBYTE },
      address: { '@type': 'PostalAddress', addressCountry: 'TR' },
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Staff QA Engineer',
        occupationLocation: { '@type': 'Country', name: 'Türkiye' },
        skills: [...t.experience.staff.skills, ...t.experience.lead.skills].join(', '),
      },
      knowsAbout: t.lang === 'tr'
        ? ['Fintech', 'Ödeme sistemleri', 'Kredi kartı ödemeleri', 'Taksitli ödeme', 'Şimdi al sonra öde (BNPL)', 'Dijital bankacılık', 'Vadeli mevduat', 'Sadakat sistemleri', 'Core banking', 'Açık bankacılık', 'Bankacılık API testi', 'Pazaryeri QA', 'SAMA uyumluluğu', 'Yazılım test', 'Mobil test', 'Test otomasyonu', 'Postman', 'JIRA']
        : ['Fintech', 'Payment systems', 'Credit card payments', 'Installment payments', 'Buy now pay later (BNPL)', 'Digital banking', 'Time deposits', 'Loyalty systems', 'Core banking', 'Open banking', 'Banking API testing', 'Marketplace QA', 'SAMA compliance', 'Software quality assurance', 'Mobile testing', 'Test automation', 'Postman', 'JIRA'],
      sameAs: [LINKEDIN, GITHUB],
    },
  };
}

/* ---------- sections ---------- */
function head(t, now) {
  const url = SITE + t.path;
  const other = t.lang === 'en' ? 'tr' : 'en';
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">
  <meta name="referrer" content="strict-origin-when-cross-origin">

  <title>${esc(t.meta.title)}</title>
  <meta name="description" content="${esc(t.meta.description)}">
  <meta name="author" content="Evrenos Evrenos">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${SITE}/">
  <link rel="alternate" hreflang="tr" href="${SITE}/tr/">
  <link rel="alternate" hreflang="x-default" href="${SITE}/">

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="Evrenos Evrenos">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(t.meta.ogTitle)}">
  <meta property="og:description" content="${esc(t.meta.ogDescription)}">
  <meta property="og:image" content="${SITE}/assets/images/${t.meta.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(t.meta.ogImageAlt)}">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${other === 'tr' ? 'tr_TR' : 'en_GB'}">
  <meta property="profile:first_name" content="Evrenos">
  <meta property="profile:last_name" content="Evrenos">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(t.meta.ogTitle)}">
  <meta name="twitter:description" content="${esc(t.meta.ogDescription)}">
  <meta name="twitter:image" content="${SITE}/assets/images/${t.meta.ogImage}">

  <meta name="theme-color" content="#faf9f7">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/icons/Icon-192.png">
  <link rel="manifest" href="/manifest.json">

  <link rel="preload" href="/assets/fonts/Roboto_Slab/RobotoSlab-Bold.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/fonts/Roboto_Slab/RobotoSlab-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/assets/css/main.css">

  <script type="application/ld+json">${jsonBlock(jsonLd(t, now))}</script>
  <script type="application/json" id="i18n">${jsonBlock({ lang: t.lang, dateLocale: t.dateLocale, altHref: t.lang_switch.href, ...t.runtime, boot: t.runtime.boot.map((l) => l.replace('{projects}', String(PROJECTS.length))) })}</script>

  <!-- Sets theme + boot state before first paint to avoid a flash. -->
  <script src="/assets/js/theme-init.js"></script>
  <script src="/assets/js/nomodule.js" nomodule></script>
  <script src="/assets/js/main.js" type="module"></script>
</head>`;
}

const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false">
    <symbol id="i-github" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></symbol>
    <symbol id="i-linkedin" viewBox="0 0 24 24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></g></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
    <symbol id="i-arrow-up" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m5 12 7-7 7 7M12 19V5"/></symbol>
    <symbol id="i-external" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></g></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></g></symbol>
    <symbol id="i-terminal" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m4 17 6-6-6-6M12 19h8"/></symbol>
    <symbol id="i-globe" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></g></symbol>
    <symbol id="i-card" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></g></symbol>
    <symbol id="i-bank" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z"/></symbol>
    <symbol id="i-api" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/></symbol>
    <symbol id="i-cart" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></g></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></g></symbol>
    <symbol id="i-trace" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M20 6 9 17l-5-5"/></symbol>
    <symbol id="i-replay" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/></symbol>
  </svg>`;

function header(t) {
  const links = ['about', 'experience', 'fintech', 'projects', 'contact']
    .map((id, i) => `<li><a class="nav__link" href="#${id}" data-section="${id}"><span class="nav__num">0${i + 1}</span><span data-scramble-hover>${esc(t.nav[id])}</span></a></li>`)
    .join('\n          ');
  const ls = t.lang_switch;
  return `<header class="header" id="header">
    <div class="header__inner">
      <a class="logo" href="#home" aria-label="${esc(t.a11y.home)}">
        <span class="logo__bracket" aria-hidden="true">&lt;</span><span aria-hidden="true" data-scramble-hover>EVRENOS EVRENOS</span><span class="logo__bracket" aria-hidden="true">/&gt;</span>
      </a>

      <nav class="nav" id="nav" aria-label="${esc(t.a11y.primaryNav)}">
        <ul class="nav__list" id="nav-list">
          ${links}
        </ul>
        <span class="nav__indicator" id="nav-indicator" aria-hidden="true"></span>
      </nav>

      <div class="header__actions">
        <button class="kbd-btn" type="button" data-palette-open aria-label="${esc(t.a11y.palette)}" title="${esc(t.a11y.paletteTitle)}">
          ${icon('search')}
          <kbd><span data-mod-key>Ctrl</span> K</kbd>
        </button>
        <a class="lang-btn mono" href="${ls.href}" hreflang="${ls.hreflang}" lang="${ls.hreflang}" title="${esc(ls.title)}">${icon('globe')}<span>${ls.label}</span></a>
        <button class="icon-btn theme-toggle" type="button" id="theme-toggle" aria-label="${esc(t.a11y.theme)}" title="${esc(t.a11y.theme)}">
          ${icon('sun', 'icon icon--sun')}
          ${icon('moon', 'icon icon--moon')}
        </button>
        <button class="icon-btn burger" type="button" id="burger" aria-label="${esc(t.a11y.openMenu)}" aria-expanded="false" aria-controls="nav-list">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function socials(t, extraClass = '') {
  return `<ul class="socials${extraClass}"${extraClass ? '' : ' data-reveal'} aria-label="${esc(t.a11y.socials)}">
        <li><a class="social" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" data-magnetic aria-label="${esc(t.a11y.linkedin)}">${icon('linkedin')}</a></li>
        <li><a class="social" href="${GITHUB}" target="_blank" rel="noopener noreferrer" data-magnetic aria-label="${esc(t.a11y.github)}">${icon('github')}</a></li>
        <li><a class="social" href="mailto:${EMAIL}" data-magnetic aria-label="${esc(t.a11y.email)}">${icon('mail')}</a></li>
      </ul>`;
}

function hero(t) {
  const h = t.hero;
  return `<section class="hero" id="home" aria-labelledby="hero-name">
      <div class="hero__avatar" data-reveal>
        <span class="hero__ring" aria-hidden="true"></span>
        <img src="/assets/images/profile.png" alt="${esc(t.a11y.portrait)}" width="200" height="200" fetchpriority="high">
      </div>

      <p class="hero__prompt mono" data-reveal><span class="accent">~/evrenos</span> <span class="muted">$</span> whoami</p>

      <h1 class="hero__name" id="hero-name" data-reveal>
        <span class="sr-only">Evrenos Evrenos</span>
        <span aria-hidden="true" id="hero-name-text">Evrenos Evrenos</span>
      </h1>

      <p class="hero__roles" data-reveal>
        <span class="sr-only">${esc(h.roles.join(', '))}</span>
        <span aria-hidden="true" class="hero__typed" id="typed" data-roles="${esc(JSON.stringify(h.roles))}">${esc(h.roles[0])}</span><span class="caret" aria-hidden="true"></span>
      </p>

      <p class="hero__tagline" data-reveal>${esc(h.tagline)}</p>

      <a class="currently" href="#experience" data-reveal>
        <span class="currently__dot" aria-hidden="true"></span>
        <span class="currently__label mono">${esc(h.currentlyLabel)}</span>
        <span class="currently__text"><strong>${esc(h.currentlyRole)}</strong> ${esc(h.at)} <strong class="accent">finbyte</strong></span>
      </a>

      ${socials(t)}

      <div class="hero__cta" data-reveal>
        <a class="btn btn--primary" href="#fintech" data-magnetic>
          ${icon('card')}
          <span>${esc(h.ctaPrimary)}</span>
        </a>
        <a class="btn btn--ghost" href="#projects" data-magnetic>
          <span>${esc(h.ctaSecondary)}</span>
          ${icon('external')}
        </a>
      </div>

      <a class="scroll-hint" href="#about" aria-label="${esc(t.a11y.scroll)}">
        <span class="scroll-hint__mouse" aria-hidden="true"></span>
        <span class="mono">${esc(h.scroll)}</span>
      </a>
    </section>`;
}

function strip(t, now) {
  const industries = uniqueIndustries(t.lang);
  const years = now.getFullYear() - CAREER_START;
  const finbyteYears = Math.floor(monthsBetween(FINBYTE_START, null, now) / 12);
  const marquee = [...industries, ...industries]
    .map((label) => `<span class="marquee__item">${esc(label)}</span>`).join('');
  return `<section class="strip" aria-label="${esc(t.a11y.highlights)}">
      <ul class="stats">
        <li class="stat" data-reveal><strong data-count="${years}" data-suffix="+" data-years-since="${CAREER_START}">${years}+</strong><span>${esc(t.stats.years)}</span></li>
        <li class="stat" data-reveal><strong data-count="${finbyteYears}" data-suffix="+" data-tenure-years="${FINBYTE_START}">${finbyteYears}+</strong><span>${esc(t.stats.finbyte)}</span></li>
        <li class="stat" data-reveal><strong data-count="${PROJECTS.length}">${PROJECTS.length}</strong><span>${esc(t.stats.projects)}</span></li>
        <li class="stat" data-reveal><strong data-count="${industries.length}">${industries.length}</strong><span>${esc(t.stats.industries)}</span></li>
      </ul>
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">${marquee}</div>
      </div>
    </section>`;
}

function sectionHead(index, id, title) {
  return `<header class="section__head" data-reveal>
        <span class="section__index mono">0${index}.</span>
        <h2 class="section__title" id="${id}-title" data-scramble-reveal>${esc(title)}</h2>
        <span class="section__rule" aria-hidden="true"></span>
      </header>`;
}

function about(t) {
  const a = t.about;
  const s = (v) => `<span class="tk-s">"${esc(v)}"</span>`;
  const f = (v) => `<span class="tk-f">${v}</span>`;
  const list = (arr) => arr.map(s).join(', ');
  const lines = [
    `<span class="tk-k">const</span> <span class="tk-v">evrenos</span> <span class="tk-p">=</span> {`,
    `  ${f('role')}: ${s('Staff QA Engineer')},`,
    `  ${f('company')}: ${s('finbyte')}, <span class="tk-c">// remote · Türkiye</span>`,
    `  ${f('domains')}: [${list(['payments', 'banking', 'open banking', 'marketplace'])}],`,
    `  ${f('payments')}: [${list(['credit card', 'installments', 'refunds', 'cancellations'])}],`,
    `  ${f('clients')}: [${list(['Vision Bank', 'MISPay', 'finleap connect'])}],`,
    `  ${f('compliance')}: [${s('SAMA')}],`,
    `  ${f('tools')}: [${list(['Postman', 'JIRA'])}],`,
    `  ${f('previously')}: [${list(['Lead QA Engineer', 'Product Owner', 'Flutter Developer'])}],`,
    `  ${f('since')}: <span class="tk-n">${CAREER_START}</span>,`,
    `  ${f('findBugs')}: () <span class="tk-p">=&gt;</span> ${s(a.codeFindBugs)},`,
    `} <span class="tk-k">as const</span>;`,
    '',
    `<span class="tk-c">${esc(a.codeComment)}</span>`,
  ];
  return `<section class="section" id="about" aria-labelledby="about-title">
      ${sectionHead(1, 'about', a.title)}

      <div class="about">
        <div class="about__text">
          <p class="lead" data-reveal>${rich(a.lead)}</p>
          ${a.paragraphs.map((p) => `<p data-reveal>${rich(p)}</p>`).join('\n          ')}

          <div class="resume" data-reveal>
            <h3 class="resume__title mono">${esc(a.resumeTitle)}</h3>
            <p>${esc(a.resumeBefore)} <time id="today"></time>${esc(a.resumeMiddle)}
              <a class="link" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">linkedin.com/in/evrenos-evrenos/</a>${esc(a.resumeAfter)}</p>
            <a class="btn btn--primary" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" data-magnetic>
              <span>${esc(a.openResume)}</span>
              ${icon('external')}
            </a>
          </div>
        </div>

        <figure class="editor" data-reveal aria-label="${esc(t.a11y.codeFigure)}">
          <div class="editor__bar">
            <span class="editor__dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="editor__tab mono">evrenos.ts</span>
            <span class="editor__lang mono" aria-hidden="true">TypeScript</span>
          </div>
<pre class="editor__code mono" tabindex="0"><code>${lines.map((l) => `<span class="ln">${l}</span>`).join('')}</code></pre>
        </figure>
      </div>
    </section>`;
}

function experience(t, now) {
  const x = t.experience;
  const ym = (v) => monthLabel(v, x.months);
  const ten = (from, to) => tenure(from, to, t.lang, now);
  const skills = (arr) => `<ul class="xp__skills">${arr.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;
  return `<section class="section" id="experience" aria-labelledby="experience-title">
      ${sectionHead(2, 'experience', x.title)}

      <div class="xp">
        <article class="xp__company" data-reveal>
          <header class="xp__head">
            <div class="xp__mark mono" aria-hidden="true">fb</div>
            <div>
              <h3 class="xp__name"><a class="link" href="${FINBYTE}" target="_blank" rel="noopener noreferrer">finbyte</a></h3>
              <p class="xp__meta">${esc(x.companyMeta)} · <span data-tenure-from="${FINBYTE_START}">${esc(ten(FINBYTE_START, null))}</span></p>
            </div>
          </header>

          <ol class="xp__roles">
            <li class="xp__role is-current">
              <div class="xp__role-head">
                <h4 class="xp__title">${esc(x.staff.title)}</h4>
                <span class="xp__badge mono">${esc(x.current)}</span>
              </div>
              <p class="xp__dates mono"><time datetime="${STAFF_START}">${esc(ym(STAFF_START))}</time> – ${esc(x.present)} · <span data-tenure-from="${STAFF_START}">${esc(ten(STAFF_START, null))}</span></p>
              <ul class="xp__bullets">
                ${x.staff.bullets.map((b) => `<li>${rich(b)}</li>`).join('\n                ')}
              </ul>
              <p class="xp__collab">${rich(x.staff.collab)}</p>
              ${skills(x.staff.skills)}
            </li>
            <li class="xp__role">
              <div class="xp__role-head">
                <h4 class="xp__title">${esc(x.lead.title)}</h4>
              </div>
              <p class="xp__dates mono"><time datetime="${FINBYTE_START}">${esc(ym(FINBYTE_START))}</time> – <time datetime="${LEAD_END}">${esc(ym(LEAD_END))}</time> · ${esc(ten(FINBYTE_START, LEAD_END))}</p>
              ${skills(x.lead.skills)}
            </li>
          </ol>

          <div class="xp__clients">
            <h4 class="xp__clients-title">${esc(x.clients.title)}</h4>
            <ul class="xp__client-list">
              ${PROJECTS.filter((p) => p.years && p.years[0] >= 2022).map((p) => `<li class="xp__client">
                <span class="xp__client-name">${esc(p.title)}</span>
                <span class="xp__client-years">${esc(yearLabel(p, t))}</span>
                <span class="xp__client-desc">${esc(p.platform[t.lang])}</span>
                ${p.workstreams ? `<ul class="xp__client-tags">${p.workstreams.map((w) => `<li>${esc(w[t.lang])}</li>`).join('')}</ul>` : ''}
              </li>`).join('\n              ')}
            </ul>
          </div>
        </article>

        <aside class="xp__earlier" data-reveal>
          <span class="xp__earlier-years mono">${esc(x.earlier.years)}</span>
          <p>${esc(x.earlier.text)}</p>
          <a class="link" href="#projects">${esc(x.earlier.link)} →</a>
        </aside>
      </div>
    </section>`;
}

function fintech(t) {
  const f = t.fintech;
  const pl = f.pipeline;
  const fintechProjects = PROJECTS.filter((p) => p.fintech);
  return `<section class="section fintech" id="fintech" aria-labelledby="fintech-title">
      ${sectionHead(3, 'fintech', f.title)}

      <div class="fintech__top">
        <div class="fintech__copy" data-reveal>
          <p class="eyebrow mono">${esc(f.eyebrow)}</p>
          <p class="fintech__intro">${rich(f.intro)}</p>
        </div>

        <figure class="pipeline editor" id="pipeline" data-reveal aria-label="${esc(t.a11y.pipelineFigure)}">
          <div class="editor__bar">
            <span class="editor__dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="editor__tab mono">${esc(pl.file)}</span>
            <button class="pipeline__run mono" type="button" id="pipeline-run">${icon('replay')}<span>${esc(pl.run)}</span></button>
          </div>
          <ol class="pipeline__steps">
            ${pl.steps.map((s, i) => `<li class="pipeline__step" data-step="${i}"><span class="pipeline__node">${icon('check')}</span><span class="pipeline__label">${esc(s)}</span></li>`).join('\n            ')}
          </ol>
          <pre class="pipeline__log mono" aria-live="off">${pl.logs.map(([name, note]) => `<span class="pipeline__line"><span class="ok">✓</span> <span class="tk-f">${esc(name)}</span> <span class="dim">— ${esc(note)}</span></span>`).join('')}<span class="pipeline__line pipeline__summary"><span class="ok">●</span> ${esc(pl.summary)}</span></pre>
        </figure>
      </div>

      <ul class="fx-cards">
        ${f.cards.map((c) => `<li class="fx-card" data-reveal data-tilt>
          <span class="fx-card__icon">${icon(c.icon)}</span>
          <h3 class="fx-card__title">${esc(c.title)}</h3>
          <p>${rich(c.text)}</p>
          <span class="card__glare" aria-hidden="true"></span>
        </li>`).join('\n        ')}
      </ul>

      <div class="fintech__projects" data-reveal>
        <p class="fintech__projects-label mono">${esc(f.projectsLabel)}</p>
        <ul class="fintech__chips">
          ${fintechProjects.map((p) => `<li><span>${esc(p.title)}</span><span class="mono">${esc(yearLabel(p, t))}</span></li>`).join('\n          ')}
        </ul>
        <button class="btn btn--primary" type="button" data-filter-go="fintech" data-magnetic>
          <span>${esc(f.projectsCta)}</span>
          ${icon('external')}
        </button>
      </div>
    </section>`;
}

function projects(t) {
  const p = t.projects;
  const counts = { all: PROJECTS.length, fintech: PROJECTS.filter((x) => x.fintech).length };
  for (const x of PROJECTS) counts[x.role] = (counts[x.role] || 0) + 1;
  const chips = ['all', 'fintech', 'lead', 'qa', 'pm', 'dev'].map((k) =>
    `<button class="chip${k === 'all' ? ' is-active' : ''}${k === 'fintech' ? ' chip--fintech' : ''}" type="button" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(p.filters[k])} <span class="chip__count">${counts[k]}</span></button>`,
  ).join('\n        ');
  const cards = PROJECTS.map((x) => {
    const tags = [x.role, x.fintech ? 'fintech' : ''].filter(Boolean).join(' ');
    const industries = x.industries.map((k) => INDUSTRIES[k][t.lang]).join(', ');
    const years = yearLabel(x, t);
    const alt = esc(`${x.title} — ${p.coverAlt}`);
    const media = x.cover
      ? `<img src="/assets/images/${x.cover}" alt="${alt}" width="${x.w || 1200}" height="${x.h || 630}" loading="lazy" decoding="async">`
      : `<div class="cover-art cover-art--${x.art.theme}" role="img" aria-label="${alt}"><span class="cover-art__name">${esc(x.art.name)}</span><span class="cover-art__sub">${esc(x.art.sub)}</span></div>`;
    const workstreams = x.workstreams
      ? `<ul class="card__workstreams">${x.workstreams.map((w) => `<li>${esc(w[t.lang])}</li>`).join('')}</ul>`
      : '';
    // Extra detail for the dialog; kept in the HTML so it is indexable.
    const more = x.description
      ? `<div class="card__more"><p class="card__desc">${esc(x.description[t.lang])}</p></div>`
      : '';
    return `<li class="project${x.fintech ? ' project--fintech' : ''}" data-tags="${tags}" data-reveal>
          <article class="card" data-tilt>
            <div class="card__media">${media}<span class="card__year mono">${esc(years)}</span>${x.fintech ? `<span class="card__badge mono">${icon('card')}${esc(p.fintechBadge)}</span>` : ''}</div>
            <div class="card__body">
              <h3 class="card__title">${esc(x.title)}</h3>
              <p class="card__platform">${esc(x.platform[t.lang])}</p>
              ${workstreams}
              <dl class="card__meta mono">
                <div><dt>${esc(p.labels.position)}</dt><dd>${esc(x.position[t.lang])}</dd></div>
                <div><dt>${esc(p.labels.year)}</dt><dd>${esc(years)}</dd></div>
                <div><dt>${esc(p.labels.industry)}</dt><dd>${esc(industries)}</dd></div>
              </dl>
              ${more}
              <span class="card__hint" aria-hidden="true">${esc(p.details)} →</span>
            </div>
            <button class="card__open" type="button" aria-haspopup="dialog" aria-label="${esc(`${p.detailsFor} ${x.title}`)}"></button>
            <span class="card__glare" aria-hidden="true"></span>
          </article>
        </li>`;
  }).join('\n        ');
  return `<section class="section" id="projects" aria-labelledby="projects-title">
      ${sectionHead(4, 'projects', p.title)}

      <div class="filters" role="group" aria-label="${esc(t.a11y.filterGroup)}" data-reveal>
        ${chips}
      </div>
      <p class="sr-only" id="filter-status" aria-live="polite"></p>

      <ul class="grid" id="project-grid">
        ${cards}
      </ul>
    </section>`;
}

function contact(t) {
  return `<section class="section contact" id="contact" aria-labelledby="contact-title">
      ${sectionHead(5, 'contact', t.contact.title)}

      <div class="contact__card" data-reveal>
        <p class="contact__lead">${esc(t.contact.lead)}</p>
        <div class="contact__email">
          <a class="contact__address mono" href="mailto:${EMAIL}">${EMAIL}</a>
          <button class="icon-btn" type="button" data-copy="${EMAIL}" aria-label="${esc(t.a11y.copyEmail)}" title="${esc(t.a11y.copyEmail)}">
            ${icon('copy')}
          </button>
        </div>
        ${socials(t, ' socials--inline')}
      </div>
    </section>`;
}

function footer(t, now) {
  const fo = t.footer;
  return `<footer class="footer">
    <p>${fo.madeWith ? `${esc(fo.madeWith)} ` : ''}<span class="mono accent">&lt;/&gt;</span> ${esc(fo.and)} · © <span id="year">${now.getFullYear()}</span> Evrenos Evrenos</p>
    <p class="footer__hint mono">${esc(fo.hint)} <kbd><span data-mod-key>Ctrl</span> K</kbd> · ↑↑↓↓←→←→BA</p>
  </footer>`;
}

/* ---------- page ---------- */
export function renderPage(t, now = new Date()) {
  return `<!DOCTYPE html>
<!-- Generated by build.mjs from src/ — edit the sources, not this file. -->
<html lang="${t.lang}">
${head(t, now)}
<body>
  ${SPRITE}

  <a class="skip-link" href="#main">${esc(t.a11y.skip)}</a>

  <div class="boot" aria-hidden="true">
    <div class="boot__window">
      <div class="boot__bar"><span></span><span></span><span></span><em>evrenos@portfolio: ~</em></div>
      <pre class="boot__log" id="boot-log"></pre>
    </div>
    <p class="boot__skip">${t.lang === 'tr' ? 'geçmek için bir tuşa bas' : 'press any key to skip'}</p>
  </div>

  <div class="bg-grid" aria-hidden="true"></div>
  <canvas class="bg-canvas" id="bg-canvas" aria-hidden="true"></canvas>
  <div class="progress" aria-hidden="true"><span id="progress-bar"></span></div>

  ${header(t)}

  <main id="main">
    ${hero(t)}

    ${strip(t, now)}

    ${about(t)}

    ${experience(t, now)}

    ${fintech(t)}

    ${projects(t)}

    ${contact(t)}
  </main>

  ${footer(t, now)}

  <a class="to-top" href="#home" id="to-top" aria-label="${esc(t.a11y.toTop)}">
    <svg class="to-top__ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/><circle class="to-top__progress" id="to-top-progress" cx="24" cy="24" r="22" pathLength="100"/></svg>
    ${icon('arrow-up')}
  </a>

  <dialog class="palette" id="palette" aria-label="${esc(t.a11y.palette)}">
    <div class="palette__search">
      ${icon('search')}
      <input id="palette-input" type="text" placeholder="${t.lang === 'tr' ? 'Bir komut yazın ya da arayın…' : 'Type a command or search…'}" autocomplete="off" spellcheck="false"
             role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list">
      <kbd>esc</kbd>
    </div>
    <ul class="palette__list" id="palette-list" role="listbox"></ul>
    <div class="palette__foot mono" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> ${t.lang === 'tr' ? 'gezin' : 'navigate'}</span><span><kbd>↵</kbd> ${t.lang === 'tr' ? 'çalıştır' : 'run'}</span><span><kbd>esc</kbd> ${t.lang === 'tr' ? 'kapat' : 'close'}</span></div>
  </dialog>

  <dialog class="pmodal" id="pmodal" aria-labelledby="pmodal-title">
    <div class="pmodal__media" id="pmodal-media"></div>
    <button class="pmodal__close" type="button" id="pmodal-close" aria-label="${esc(t.projects.close)}">×</button>
    <div class="pmodal__body">
      <h2 class="pmodal__title" id="pmodal-title"></h2>
      <p class="pmodal__platform" id="pmodal-platform"></p>
      <p class="pmodal__desc" id="pmodal-desc" hidden></p>
      <div id="pmodal-ws-wrap" hidden>
        <h3 class="pmodal__section-title">${esc(t.projects.workstreams)}</h3>
        <ul class="pmodal__workstreams" id="pmodal-ws"></ul>
      </div>
      <div id="pmodal-meta"></div>
    </div>
  </dialog>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <canvas class="matrix" id="matrix" aria-hidden="true"></canvas>
</body>
</html>
`;
}

export function renderSitemap(now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  const entry = (loc) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${day}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE}/tr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entry('/')}
${entry('/tr/')}
</urlset>
`;
}
