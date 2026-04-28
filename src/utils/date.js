export const todayISO = () => new Date().toISOString().slice(0, 10);

export function addDaysISO(dateISO, days) {
  const d = new Date(`${dateISO}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isValidISODate(dateISO) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO || ''))) return false;
  const [year, month, day] = dateISO.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}
