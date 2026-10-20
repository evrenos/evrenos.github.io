/**
 * LinkedIn-style tenure ("5 yrs 5 mos"). Months are counted inclusively,
 * matching LinkedIn: Jun 2021 → Oct 2026 = 65 months = 5 yrs 5 mos.
 * Pure function — imported by both the browser and the Node build.
 */
const UNITS = {
  en: { y: ['yr', 'yrs'], m: ['mo', 'mos'] },
  tr: { y: ['yıl', 'yıl'], m: ['ay', 'ay'] },
};

/** @param {string} from "YYYY-MM"  @param {string|null} to "YYYY-MM" or null for present */
export function monthsBetween(from, to, now = new Date()) {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to ? to.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  return Math.max(1, (ty - fy) * 12 + (tm - fm) + 1);
}

export function formatTenure(months, lang = 'en') {
  const u = UNITS[lang] || UNITS.en;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} ${u.y[y === 1 ? 0 : 1]}`);
  if (m) parts.push(`${m} ${u.m[m === 1 ? 0 : 1]}`);
  return parts.join(' ');
}

export const tenure = (from, to, lang, now) => formatTenure(monthsBetween(from, to, now), lang);
