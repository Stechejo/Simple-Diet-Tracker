function fmt(n) {
    return Number(n).toLocaleString('de-DE');
}

function fmtWeight(n) {
    return Number(n).toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

function deficit(e) {
    return e.verbraucht - e.intake;
}

function avg(arr) {
    return arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : 0;
}

function movingAverage(values, window = 7) {
    return values.map((_, i) =>
        avg(values.slice(Math.max(0, i - window + 1), i + 1))
    );
}

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function addDaysISO(dateISO, days) {
    const d = new Date(`${dateISO}T12:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

function isValidISODate(dateISO) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO || ''))) return false;
    const [year, month, day] = dateISO.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

function fmtDate(dateISO) {
    if (!dateISO) return '-';
    return new Date(`${dateISO}T12:00:00`).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit'
    });
}

function fmtDateLong(dateISO) {
    if (!dateISO) return '-';
    return new Date(`${dateISO}T12:00:00`).toLocaleDateString('de-DE');
}

function daysBetween(aISO, bISO) {
    const a = new Date(`${aISO}T12:00:00`);
    const b = new Date(`${bISO}T12:00:00`);
    return Math.round((b - a) / 86400000);
}

function trendWeight(entries) {
    if (!entries.length) return null;
    return movingAverage(entries.map(e => e.gewicht), 7).at(-1);
}

function normalizeEntries(entries) {
    const clean = Array.isArray(entries) ? entries : [];
    const base = addDaysISO(todayISO(), -(clean.length - 1));

    return clean
        .map((e, i) => ({
            tag: i + 1,
            date: isValidISODate(e.date) ? e.date : addDaysISO(base, i),
            verbraucht: Number(e.verbraucht) || 0,
            intake: Number(e.intake) || 0,
            gewicht: Number(e.gewicht) || 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e, i) => ({ ...e, tag: i + 1 }));
}
