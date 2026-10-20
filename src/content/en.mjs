/** English copy. Experience bullets are taken from the LinkedIn profile. */
export default {
  lang: 'en',
  locale: 'en_GB',
  dateLocale: 'en-GB',
  path: '/',

  meta: {
    title: 'Evrenos Evrenos — Staff QA Engineer | Fintech, Payments & Banking QA',
    description:
      'Staff QA Engineer at finbyte specialising in fintech: payment systems, credit card & installment flows, BNPL, core, open & digital banking (Vision Bank, MISPay), banking API testing and SAMA compliance.',
    ogTitle: 'Evrenos Evrenos — Fintech, Payments & Banking QA',
    ogDescription:
      'Staff QA Engineer at finbyte. Digital banking (Vision Bank), BNPL (MISPay), payment systems, open banking & banking APIs, SAMA compliance.',
    ogImage: 'og-en.png',
    ogImageAlt: 'Evrenos Evrenos — Staff QA Engineer, Fintech · Payments · Banking',
  },

  a11y: {
    skip: 'Skip to content',
    home: 'Evrenos Evrenos — home',
    primaryNav: 'Primary',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    palette: 'Open command menu',
    paletteTitle: 'Command menu (Ctrl / ⌘ + K)',
    theme: 'Toggle dark mode',
    socials: 'Social links',
    linkedin: 'LinkedIn profile (opens in a new tab)',
    github: 'GitHub profile (opens in a new tab)',
    email: 'Send an email',
    copyEmail: 'Copy email address',
    toTop: 'Back to top',
    scroll: 'Scroll to About',
    portrait: 'Portrait of Evrenos Evrenos, Staff QA Engineer',
    highlights: 'Highlights',
    filterGroup: 'Filter projects',
    codeFigure: 'Profile summary as code',
    pipelineFigure: 'Animated payment test pipeline',
  },

  lang_switch: { href: '/tr/', label: 'TR', hreflang: 'tr', title: 'Türkçe sürüm' },

  nav: { about: 'About', experience: 'Experience', fintech: 'Fintech', projects: 'Projects', contact: 'Contact' },

  hero: {
    roles: ['Staff QA Engineer', 'Fintech QA', 'Payments & Banking QA', 'Lead QA Engineer', 'Product Owner', 'Flutter Developer'],
    tagline: 'I test the parts of fintech where money moves — payment systems, banking applications and open banking APIs.',
    currentlyLabel: 'Currently',
    currentlyRole: 'Staff QA Engineer',
    at: 'at',
    ctaPrimary: 'Fintech expertise',
    ctaSecondary: 'View projects',
    scroll: 'scroll',
  },

  stats: {
    years: 'Years in QA',
    finbyte: 'Years at finbyte',
    projects: 'Shipped projects',
    industries: 'Industry tags',
  },

  about: {
    title: 'About',
    lead:
      'Staff QA Engineer at finbyte, leading quality across fintech products — payment systems, banking applications and marketplace platforms.',
    paragraphs: [
      'Experienced QA Engineer with lots of project experience and a track record of locating bugs in Web-based and Mobile applications before they are released into the marketplace.',
      'Able to troubleshoot on a variety of mobile devices, automated UI tests for mobile and web environments, exceptional problem-solving skills and ability to find creative solutions to issues. Leadership skills to train others on how to carry out the numerous processes that are needed.',
    ],
    resumeTitle: 'RESUME',
    resumeBefore: 'It’s',
    resumeMiddle: ', check this out:',
    resumeAfter: '. It’s up to date.',
    openResume: 'Open resume',
    codeComment: '// ✓ all checks passed',
    codeFindBugs: 'before your users do',
  },

  experience: {
    title: 'Experience',
    companyMeta: 'Full-time · Remote, Türkiye',
    present: 'Present',
    current: 'Current',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    staff: {
      title: 'Staff QA Engineer',
      bullets: [
        '**Leading the QA team** across multiple projects, ensuring clear priorities, smooth coordination, and consistent quality standards.',
        'Tested **complex payment systems** across banking, e-commerce, and marketplace platforms. Worked on **credit card payments**, **installment-based payment flows**, **refunds, cancellations, and transaction status validations**.',
        'Hands-on experience in **marketplace QA**, including merchant/customer journeys, **checkout flows**, order management, and **payment confirmation**.',
        'Tested **banking applications** involving **core banking integrations**, **open banking services**, **loan applications**, and **credit card operations**.',
        'Supported testing activities related to **SAMA compliance** and banking regulatory requirements.',
        '**Banking API testing**, validating integrations, request/response structures and data consistency.',
        'Ensured transparency and **traceability** through clear test cases, defect reports, test evidence, and requirement coverage.',
      ],
      collab:
        'Collaborated with product owners, developers, business analysts, and stakeholders to clarify requirements, identify risks, and support high-quality releases.',
      skills: ['Mobile Testing', 'Traceability'],
    },
    lead: {
      title: 'Lead QA Engineer',
      skills: ['Postman API', 'JIRA'],
    },
    clients: {
      title: 'Key fintech projects',
    },
    earlier: {
      years: '2016 – 2021',
      text: 'Software QA Engineer, QA & Project Manager and Flutter Developer across 12 web & mobile products.',
      link: 'See projects',
    },
  },

  fintech: {
    title: 'Fintech · Payments · Banking',
    eyebrow: 'Domain expertise',
    intro:
      'Most of my recent work sits where money moves: card payments, installments, refunds, core banking and open banking — places where a bug is never just a bug.',
    pipeline: {
      file: 'payment-flow.spec.ts',
      steps: ['Checkout', 'Card payment', 'Installments', 'Confirmation', 'Refund / Cancel'],
      logs: [
        ['checkout.flow', 'merchant → customer journey'],
        ['payment.card', 'credit card payment authorised'],
        ['payment.installments', 'installment plan applied'],
        ['transaction.status', 'CONFIRMED'],
        ['refund.cancel', 'reversal status validated'],
      ],
      summary: '5 passed · 0 failed',
      run: 'Run again',
    },
    cards: [
      { icon: 'card', title: 'Payment systems', text: 'Credit card payments, installment-based flows, refunds, cancellations and transaction status validations across banking, e-commerce and marketplace platforms.' },
      { icon: 'bank', title: 'Banking applications', text: 'Core banking integrations, loan applications and credit card operations — tested end to end.' },
      { icon: 'api', title: 'Open banking & APIs', text: 'Open banking services and banking API testing: integrations, request/response structures and data consistency, with Postman.' },
      { icon: 'cart', title: 'Marketplace & checkout', text: 'Merchant and customer journeys, checkout flows, order management and payment confirmation.' },
      { icon: 'shield', title: 'Compliance', text: 'Testing support for **SAMA compliance** and banking regulatory requirements on SAMA-regulated products such as Vision Bank and MISPay.' },
      { icon: 'trace', title: 'Traceability & QA leadership', text: 'Leading the QA team across projects with clear test cases, defect reports, test evidence and requirement coverage in JIRA.' },
    ],
    projectsLabel: 'Fintech & payment projects in the portfolio',
    projectsCta: 'Show fintech projects',
  },

  projects: {
    title: 'Projects',
    filters: { all: 'All', fintech: 'Fintech & Payments', lead: 'Lead & Staff QA', qa: 'QA Engineer', pm: 'QA & PM', dev: 'Flutter Dev' },
    labels: { position: 'position', year: 'year', industry: 'industry' },
    fintechBadge: 'Fintech',
    coverAlt: 'app cover',
    present: 'present',
    details: 'details',
    detailsFor: 'Show details:',
    workstreams: 'Workstreams',
    close: 'Close'
  },

  contact: {
    title: 'Contact',
    lead: 'Building a payment, banking or marketplace product that has to work the first time? Let’s talk.',
  },

  footer: { madeWith: 'Made with', and: '& vanilla JS', hint: 'press' },

  /** Strings consumed by the browser JS (serialised into a JSON data block). */
  runtime: {
    filterStatus: 'Showing {n} projects',
    filterStatusOne: 'Showing 1 project',
    copied: 'Email copied ✓',
    copyFailed: 'Copy failed — select it manually',
    matrix: 'wake up, neo… (esc to exit)',
    paletteEmpty: 'command not found',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    boot: [
      '<span class="hl">$</span> ssh evrenos@portfolio',
      '<span class="dim">› establishing secure session…</span>',
      '› loading profile ............ <span class="ok">[ok]</span>',
      '› running payment test suite . <span class="ok">all green ✓</span>',
      '› fetching {projects} projects ....... <span class="ok">[ok]</span>',
      '<span class="hl">›</span> ready. welcome 👋',
    ],
    palette: {
      groups: { nav: 'Navigate', projects: 'Projects', links: 'Links', system: 'System' },
      home: 'Home', about: 'About', experience: 'Experience', fintech: 'Fintech expertise', projects: 'Projects', contact: 'Contact',
      filterAll: 'Show all projects',
      filterFintech: 'Filter: Fintech & Payments',
      filterLead: 'Filter: Lead QA',
      filterQa: 'Filter: QA Engineer',
      filterPm: 'Filter: QA & Project Manager',
      filterDev: 'Filter: Flutter Developer',
      linkedin: 'Open LinkedIn / Resume',
      github: 'Open GitHub',
      finbyte: 'Open finbyte.com',
      email: 'Send an email',
      copyEmail: 'Copy email address',
      theme: 'Toggle dark / light theme',
      language: 'Türkçe sürüme geç',
      matrix: 'Enter the matrix',
      easterEgg: 'easter egg',
    },
  },
};
