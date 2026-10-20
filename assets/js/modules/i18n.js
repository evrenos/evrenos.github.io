/** Runtime strings embedded by the build as <script type="application/json" id="i18n">. */
const FALLBACK = { lang: 'en', dateLocale: 'en-GB', palette: { groups: {} }, boot: [] };

let data = FALLBACK;
try {
  const el = document.getElementById('i18n');
  if (el) data = { ...FALLBACK, ...JSON.parse(el.textContent) };
} catch {
  data = FALLBACK;
}

export const t = data;
/** Simple "{n}" interpolation. */
export const fmt = (str = '', vars = {}) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
