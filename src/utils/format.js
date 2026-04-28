export const fmt = n => Number(n).toLocaleString('de-DE');
export const fmtWeight = n => Number(n).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtDate = dateISO => dateISO ? new Date(`${dateISO}T12:00:00`).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '-';
export const fmtDateLong = dateISO => dateISO ? new Date(`${dateISO}T12:00:00`).toLocaleDateString('de-DE') : '-';
export const formNum = v => Number(String(v || '').replace(',', '.'));
