import { addDaysISO, isValidISODate, todayISO } from './date.js';
import { fmtDate } from './format.js';

export const deficit = e => Number(e.verbraucht || 0) - Number(e.intake || 0);
export const avg = arr => arr.length ? arr.reduce((sum, n) => sum + n, 0) / arr.length : 0;
export const movingAverage = (values, window = 7) => values.map((_, index) => avg(values.slice(Math.max(0, index - window + 1), index + 1)));

export function normalizeEntries(entries) {
  return (Array.isArray(entries) ? entries : [])
    .map((entry, index) => ({
      tag: index + 1,
      date: isValidISODate(entry.date) ? entry.date : addDaysISO(todayISO(), index),
      verbraucht: Number(entry.verbraucht) || 0,
      intake: Number(entry.intake) || 0,
      gewicht: Number(entry.gewicht) || 0
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry, index) => ({ ...entry, tag: index + 1 }));
}

export const getLatest = entries => entries.length ? entries.at(-1) : null;
export const getAvgDeficit = entries => entries.length ? Math.round(entries.reduce((sum, entry) => sum + deficit(entry), 0) / entries.length) : 0;
export const trendWeight = entries => entries.length ? movingAverage(entries.map(entry => entry.gewicht), 7).at(-1) : null;

export function filterByRange(entries, days) {
  if (!entries.length) return [];
  const lastDate = entries.at(-1).date;
  const startDate = addDaysISO(lastDate, -(Number(days) - 1));
  return entries.filter(entry => entry.date >= startDate && entry.date <= lastDate);
}

export function groupByWeek(entries, t) {
  const groups = new Map();
  entries.forEach(entry => {
    const d = new Date(`${entry.date}T12:00:00`);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    const key = d.toISOString().slice(0, 10);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  return [...groups.entries()].reverse().map(([key, values]) => ({ key, title: t.weekFrom(fmtDate(key)), values }));
}

export function groupByMonth(entries, lang) {
  const groups = new Map();
  entries.forEach(entry => {
    const key = entry.date.slice(0, 7);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  return [...groups.entries()].reverse().map(([key, values]) => ({
    key,
    title: new Date(`${key}-01T12:00:00`).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' }),
    values
  }));
}
