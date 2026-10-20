/**
 * Portfolio projects (newest first). Text fields are { en, tr }.
 * role:    lead | qa | pm | dev   → role filter chips
 * fintech: true                   → "Fintech & Payments" filter + badge
 * year: 2019 | years: [from, to]  → to = null means "present"
 * Optional: description { en, tr }, workstreams [{ en, tr }] → shown in the details dialog
 * Optional: art { name, sub, theme } → typographic cover when there is no cover image
 */
const P = {
  webMobile: { en: 'Web & Android & iOS Apps', tr: 'Web, Android ve iOS Uygulamaları' },
  mobile: { en: 'Android & iOS Apps', tr: 'Android ve iOS Uygulamaları' },
};

const POS = {
  staff: { en: 'Lead QA Engineer → Staff QA Engineer', tr: 'Lead QA Engineer → Staff QA Engineer' },
  lead: { en: 'Lead QA Engineer', tr: 'Lead QA Engineer' },
  qa: { en: 'Software QA Engineer', tr: 'Yazılım QA Mühendisi' },
  pm: { en: 'Software QA Engineer & Project Manager', tr: 'Yazılım QA Mühendisi & Proje Yöneticisi' },
  dev: { en: 'Flutter Developer', tr: 'Flutter Geliştirici' },
};

/** Industry labels; keys are shared so both languages dedupe identically. */
export const INDUSTRIES = {
  fintech: { en: 'Fintech', tr: 'Fintech' },
  digitalBanking: { en: 'Digital Banking', tr: 'Dijital Bankacılık' },
  islamicBanking: { en: 'Islamic Banking', tr: 'İslami Bankacılık' },
  bnpl: { en: 'Buy Now Pay Later (BNPL)', tr: 'Şimdi Al Sonra Öde (BNPL)' },
  loyalty: { en: 'Loyalty', tr: 'Sadakat Programı' },
  openBanking: { en: 'Open Banking', tr: 'Açık Bankacılık' },
  shopping: { en: 'Shopping', tr: 'Alışveriş' },
  ecommerce: { en: 'E-Commerce', tr: 'E-Ticaret' },
  payment: { en: 'Payment System', tr: 'Ödeme Sistemi' },
  autoVehicles: { en: 'Auto & Vehicles', tr: 'Otomotiv ve Araçlar' },
  tourism: { en: 'Tourism', tr: 'Turizm' },
  food: { en: 'Food & Drink', tr: 'Yeme & İçme' },
  liveCompetition: { en: 'Live Competition', tr: 'Canlı Yarışma' },
  entertainment: { en: 'Entertainment', tr: 'Eğlence' },
  sports: { en: 'Sports', tr: 'Spor' },
  blockchain: { en: 'Blockchain', tr: 'Blokzincir' },
  crypto: { en: 'Cryptocurrency', tr: 'Kripto Para' },
  health: { en: 'Health', tr: 'Sağlık' },
  video: { en: 'Video Conference', tr: 'Video Konferans' },
  telemedicine: { en: 'Tele-medicine', tr: 'Tele-tıp' },
  support: { en: 'Customer Support', tr: 'Müşteri Desteği' },
  chatbot: { en: 'Chatbot', tr: 'Chatbot' },
  automotive: { en: 'Automotive', tr: 'Otomotiv' },
  location: { en: 'Location Based', tr: 'Konum Tabanlı' },
  bigData: { en: 'Big Data', tr: 'Büyük Veri' },
  logistics: { en: 'Logistics', tr: 'Lojistik' },
  business: { en: 'Business', tr: 'İş Dünyası' },
  job: { en: 'Job', tr: 'İş İlanı' },
  career: { en: 'Career', tr: 'Kariyer' },
};

export const PROJECTS = [
  {
    title: 'Vision Bank', years: [2024, null],
    role: 'lead', position: POS.staff, fintech: true,
    art: { name: 'Vision Bank', sub: 'ISLAMIC DIGITAL BANK · KSA', theme: 'vision' },
    platform: { en: 'Islamic digital bank · Saudi Arabia', tr: 'İslami dijital banka · Suudi Arabistan' },
    industries: ['fintech', 'digitalBanking', 'islamicBanking', 'payment', 'loyalty'],
    description: {
      en: 'The first Islamic digital bank powered by AI, regulated by the Saudi Central Bank (SAMA). End-to-end QA across retail banking products, card and payment flows.',
      tr: 'Yapay zekâ destekli ilk İslami dijital banka; Suudi Merkez Bankası (SAMA) tarafından düzenlenir. Bireysel bankacılık ürünleri, kart ve ödeme akışlarında uçtan uca QA.',
    },
    workstreams: [
      { en: 'Savings & Time Deposit (TD) accounts', tr: 'Tasarruf ve Vadeli Mevduat (TD) hesapları' },
      { en: 'Credit card project', tr: 'Kredi kartı projesi' },
      { en: 'Family banking payment systems', tr: 'Aile bankacılığı ödeme sistemleri' },
      { en: 'Loyalty system', tr: 'Sadakat (loyalty) sistemi' },
    ],
  },
  {
    title: 'MISPay', years: [2023, 2024],
    role: 'lead', position: POS.lead, fintech: true,
    art: { name: 'MISPay', sub: 'BUY NOW · PAY LATER · KSA', theme: 'mispay' },
    platform: { en: 'Buy Now Pay Later (BNPL) · Saudi Arabia', tr: 'Şimdi Al Sonra Öde (BNPL) · Suudi Arabistan' },
    industries: ['fintech', 'bnpl', 'payment'],
    description: {
      en: 'Buy-now-pay-later platform that lets shoppers split purchases into installments; supervised and regulated by the Saudi Central Bank (SAMA).',
      tr: 'Alışverişleri taksitlere bölmeyi sağlayan şimdi al sonra öde (BNPL) platformu; Suudi Merkez Bankası (SAMA) denetimi ve düzenlemesi altındadır.',
    },
  },
  {
    title: 'finleap Connect – the digibank', cover: 'finleapconnectcover.png', w: 1200, h: 628, years: [2022, 2023],
    role: 'lead', position: POS.lead, fintech: true,
    platform: { en: 'Android & iOS - React Native Apps', tr: 'Android ve iOS - React Native Uygulamaları' },
    industries: ['fintech', 'openBanking', 'digitalBanking'],
  },
  {
    title: 'Vidyodan - Vcommerce', cover: 'vidyodan.png', year: 2021,
    role: 'qa', position: POS.qa, platform: P.mobile,
    industries: ['shopping', 'ecommerce'],
  },
  {
    title: 'Türkiye Petrolleri', cover: 'turkiyepetrollericover.png', year: 2020,
    role: 'dev', position: POS.dev, fintech: true,
    platform: { en: 'Flutter App (iOS & Android)', tr: 'Flutter Uygulaması (iOS ve Android)' },
    industries: ['payment', 'autoVehicles'],
  },
  {
    title: 'Pointcy', cover: 'pointcycover.png', year: 2019,
    role: 'pm', position: POS.pm, platform: P.webMobile,
    industries: ['tourism', 'food'],
  },
  {
    title: 'Saha', cover: 'sahacover.png', year: 2019,
    role: 'pm', position: POS.pm, platform: P.webMobile,
    industries: ['liveCompetition', 'entertainment', 'sports'],
  },
  {
    title: 'CoinyPro', cover: 'coinyprocover.png', year: 2019,
    role: 'qa', position: POS.qa, platform: P.webMobile, fintech: true,
    industries: ['blockchain', 'crypto', 'fintech'],
  },
  {
    title: 'Coiny', cover: 'coinycover.png', year: 2018,
    role: 'qa', position: POS.qa, platform: P.webMobile, fintech: true,
    industries: ['blockchain', 'crypto', 'fintech'],
  },
  {
    title: 'DoctorTurkey', cover: 'doctorturkeycover.png', year: 2018,
    role: 'qa', position: POS.qa, platform: P.webMobile,
    industries: ['health', 'video', 'telemedicine'],
  },
  {
    title: 'JetFix', cover: 'jetfixcover.png', year: 2018,
    role: 'qa', position: POS.qa, platform: P.webMobile,
    industries: ['support', 'chatbot'],
  },
  {
    title: 'BMW Online', cover: 'bmwonlinecover.png', year: 2017,
    role: 'qa', position: POS.qa, platform: { en: 'iOS App', tr: 'iOS Uygulaması' },
    industries: ['automotive', 'location'],
  },
  {
    title: 'PaketTaxi', cover: 'pakettaxicover.png', year: 2017,
    role: 'qa', position: POS.qa, platform: P.webMobile,
    industries: ['location', 'bigData', 'logistics', 'business'],
  },
  {
    title: 'Falbella', cover: 'falbellacover.png', year: 2017,
    role: 'qa', position: POS.qa, platform: P.mobile,
    industries: ['entertainment'],
  },
  {
    title: 'SuperCareer', cover: 'supercareercover.png', year: 2016,
    role: 'qa', position: POS.qa, platform: P.webMobile,
    industries: ['business', 'job', 'career'],
  },
];
