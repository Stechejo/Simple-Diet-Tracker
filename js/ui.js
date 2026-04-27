let currentRangeDays = 7;
let periodMode = 'weeks';
let tableShowAll = false;

function filterByRange(allEntries, days = currentRangeDays) {
    if (!allEntries.length) return [];
    const lastDate = allEntries.at(-1).date;
    const startDate = addDaysISO(lastDate, -(Number(days) - 1));
    return allEntries.filter(e => e.date >= startDate && e.date <= lastDate);
}

window.setRange = function (days) {
    currentRangeDays = Number(days);
    renderAll(entries, targetWeight, targetDeficit, startWeight);
};

window.setTableMode = function (mode) {
    tableShowAll = mode === 'all';
    renderAll(entries, targetWeight, targetDeficit, startWeight);
};

window.setPeriodMode = function (mode) {
    periodMode = mode === 'months' ? 'months' : 'weeks';
    document.getElementById('mode-weeks')?.classList.toggle('active', periodMode === 'weeks');
    document.getElementById('mode-months')?.classList.toggle('active', periodMode === 'months');
    renderPeriods(filterByRange(entries));
};

function renderAll(allEntries, targetWeight, targetDeficit, startWeight) {
    const visibleEntries = filterByRange(allEntries);
    renderHeader(allEntries, visibleEntries);
    renderStats(allEntries, targetWeight, targetDeficit, startWeight);
    renderInsights(allEntries, targetWeight, targetDeficit);
    renderSpark(visibleEntries);
    renderTable(tableShowAll ? allEntries : allEntries.slice(-7), allEntries.length);
    renderPeriods(visibleEntries);
    applyI18n();
}

function renderHeader(allEntries, visibleEntries) {
    const headerSub = document.getElementById('headerSub');
    const rangeSelect = document.getElementById('rangeSelect');
    if (rangeSelect) rangeSelect.value = String(currentRangeDays);
    if (!headerSub) return;
    if (!allEntries.length) {
        headerSub.textContent = T('headerNoEntries');
        return;
    }
    const first = visibleEntries[0] || allEntries[0];
    const last = visibleEntries.at(-1) || allEntries.at(-1);
    headerSub.textContent = `${allEntries.length} ${currentLang === 'de' ? 'EINTRÄGE' : 'ENTRIES'} • ${currentLang === 'de' ? 'ANSICHT' : 'VIEW'} ${fmtDateLong(first.date)}-${fmtDateLong(last.date)}`;
}

function renderStats(allEntries, targetWeight, targetDeficit, startWeight) {
    const latest = getLatest(allEntries);
    const trend = trendWeight(allEntries);
    const baseline = startWeight > 0 ? startWeight : (allEntries[0]?.gewicht || 0);
    document.getElementById('statLost').textContent = latest && baseline > 0 ? `${fmtWeight(baseline - latest.gewicht)} kg` : '-';
    document.getElementById('statDeficit').textContent = allEntries.length ? `${fmt(getAvgDeficit(allEntries))}` : '-';
    document.getElementById('statTrend').textContent = trend ? `${fmtWeight(trend)} kg` : '-';
    document.getElementById('statCurrent').textContent = latest ? `${fmtWeight(latest.gewicht)} kg` : '-';
}

function renderInsights(allEntries, targetWeight, targetDeficit) {
    const latest = getLatest(allEntries);
    const planMain = document.getElementById('planMain');
    const planSub = document.getElementById('planSub');
    const forecastMain = document.getElementById('forecastMain');
    const forecastSub = document.getElementById('forecastSub');
    if (!latest) {
        if (planSub) { planSub.textContent = T('insightPlanEmpty'); planSub.dataset.empty = 'true'; }
        if (forecastSub) { forecastSub.textContent = T('insightForecastEmpty'); forecastSub.dataset.empty = 'true'; }
        return;
    }

    const d = deficit(latest);
    const cls = targetDeficit > 0 && d >= targetDeficit ? 'green' : d >= 0 ? 'yellow' : 'red';
    planMain.innerHTML = `<span class="badge"><span class="dot ${cls}"></span>${fmt(d)} kcal ${currentLang === 'de' ? 'Defizit' : 'deficit'}</span>`;
    const gap = d - targetDeficit;
    planSub.dataset.empty = 'false';
    planSub.textContent = targetDeficit > 0 ? (gap >= 0 ? T('kcalOverTarget')(fmt(gap)) : T('kcalUnderTarget')(fmt(Math.abs(gap)))) : (currentLang === 'de' ? 'Lege dein Zieldefizit in den Einstellungen fest.' : 'Set your target deficit in settings.');

    const avgDef = getAvgDeficit(allEntries);
    if (avgDef <= 0 || targetWeight <= 0 || latest.gewicht <= targetWeight) {
        forecastMain.textContent = '-';
        forecastSub.textContent = targetWeight <= 0 ? (currentLang === 'de' ? 'Lege dein Zielgewicht in den Einstellungen fest.' : 'Set your target weight in settings.') : T('forecastNoDeficit');
        forecastSub.dataset.empty = 'true';
        return;
    }
    forecastSub.dataset.empty = 'false';
    const kgLeft = latest.gewicht - targetWeight;
    const daysLeft = Math.ceil((kgLeft * 7000) / avgDef);
    const targetDate = addDaysISO(latest.date, daysLeft);
    forecastMain.textContent = fmtDateLong(targetDate);
    forecastSub.textContent = T('forecastSub')(fmtWeight(kgLeft), fmtWeight(targetWeight), fmt(avgDef));
}

function svgPoint(x, y) { return `${x.toFixed(1)},${y.toFixed(1)}`; }

function renderSpark(list) {
    const svg = document.getElementById('sparkSvg');
    const days = document.getElementById('sparkDays');
    if (!svg || !days) return;
    svg.innerHTML = '';
    days.innerHTML = '';
    if (list.length < 2) {
        svg.innerHTML = `<text x="160" y="56" text-anchor="middle" fill="#555" font-size="10">${T('chartNeedMore')}</text>`;
        return;
    }

    const w = 320, h = 112, padX = 32, padTop = 12, padBottom = 24;
    const weights = list.map(e => e.gewicht);
    const trend = movingAverage(weights, Math.min(7, weights.length));
    const minRaw = Math.min(...weights, ...trend);
    const maxRaw = Math.max(...weights, ...trend);
    const range = Math.max(0.4, maxRaw - minRaw);
    const min = minRaw - range * 0.18;
    const max = maxRaw + range * 0.18;
    const x = i => padX + (i * (w - padX * 2)) / (list.length - 1);
    const y = v => h - padBottom - ((v - min) * (h - padTop - padBottom)) / (max - min || 1);
    const line = arr => arr.map((v, i) => svgPoint(x(i), y(v))).join(' ');
    const yTicks = [maxRaw, (minRaw + maxRaw) / 2, minRaw];
    const step = Math.max(1, Math.ceil(list.length / 8));
    const xTicks = list.filter((_, i) => i % step === 0 || i === list.length - 1);

    const deficitLabel = currentLang === 'de' ? 'kcal Defizit' : 'kcal deficit';
    const grid = yTicks.map(v => `
        <line x1="${padX}" y1="${y(v)}" x2="${w - padX}" y2="${y(v)}" class="spark-grid"></line>
        <text x="4" y="${y(v) + 3}" class="spark-axis">${fmtWeight(v)}</text>
    `).join('');
    const markers = list.map((e, i) => `
        <circle cx="${x(i)}" cy="${y(e.gewicht)}" r="2.2" class="spark-dot">
            <title>${fmtDateLong(e.date)} • ${fmtWeight(e.gewicht)} kg • ${fmt(deficit(e))} ${deficitLabel}</title>
        </circle>
    `).join('');
    const last = list.at(-1);
    const lastX = x(list.length - 1);
    const lastY = y(last.gewicht);

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = `
        ${grid}
        <polyline points="${line(weights)}" class="spark-line weight"></polyline>
        <polyline points="${line(trend)}" class="spark-line trend-line"></polyline>
        ${markers}
        <circle cx="${lastX}" cy="${lastY}" r="3.4" class="spark-dot current"></circle>
        <text x="${Math.min(w - 76, Math.max(padX, lastX - 34))}" y="${Math.max(12, lastY - 8)}" class="spark-last">${fmtWeight(last.gewicht)} kg</text>
    `;
    xTicks.forEach(e => {
        const span = document.createElement('span');
        span.textContent = fmtDate(e.date);
        days.appendChild(span);
    });
}

function ensureTableToolbar(total) {
    const panel = document.getElementById('panel-uebersicht');
    if (!panel) return;
    let toolbar = document.getElementById('tableToolbar');
    if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.id = 'tableToolbar';
        toolbar.className = 'table-toolbar';
        panel.insertBefore(toolbar, panel.firstChild);
    }
    const latestLabel = tableShowAll
        ? T('tableAll')(total)
        : `${T('tableLatest')(Math.min(7, total))} ${total} ${currentLang === 'de' ? 'Einträgen' : 'entries'}`;
    toolbar.innerHTML = `
        <span>${latestLabel}</span>
        <button class="period-mode ${!tableShowAll ? 'active' : ''}" onclick="setTableMode('latest')">${T('btnLatest7')}</button>
        <button class="period-mode ${tableShowAll ? 'active' : ''}" onclick="setTableMode('all')">${T('btnAll')}</button>
    `;
}

function renderTable(list, total = list.length) {
    const body = document.getElementById('tableBody');
    if (!body) return;
    ensureTableToolbar(total);
    body.innerHTML = '';
    body.classList.toggle('table-scroll', tableShowAll && total > 12);
    if (!list.length) {
        body.innerHTML = `<div class="empty-state">${T('noEntries')}</div>`;
        return;
    }
    [...list].reverse().forEach(e => {
        const d = deficit(e);
        const cls = targetDeficit > 0 && d >= targetDeficit ? 'green' : d >= 0 ? 'yellow' : 'red';
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `<span>${e.tag}</span><span>${fmtDate(e.date)}</span><span>${fmt(e.verbraucht)}</span><span>${fmt(e.intake)}</span><span class="${cls}">${fmt(d)}</span><span class="w-val">${fmtWeight(e.gewicht)}</span><span class="actions"><button class="mini-btn" onclick="editEntry('${e.date}')">${T('btnEdit')}</button><button class="del" onclick="deleteEntry('${e.date}')">×</button></span>`;
        body.appendChild(row);
    });
}

function groupByWeek(list) {
    const groups = new Map();
    list.forEach(e => {
        const d = new Date(`${e.date}T12:00:00`);
        const day = d.getDay() || 7;
        d.setDate(d.getDate() - day + 1);
        const key = d.toISOString().slice(0, 10);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(e);
    });
    return [...groups.entries()].reverse().map(([key, values]) => ({ key, title: T('weekFrom')(fmtDate(key)), values }));
}

function groupByMonth(list) {
    const groups = new Map();
    list.forEach(e => {
        const key = e.date.slice(0, 7);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(e);
    });
    return [...groups.entries()].reverse().map(([key, values]) => ({
        key,
        title: new Date(`${key}-01T12:00:00`).toLocaleDateString(currentLang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' }),
        values
    }));
}

function renderPeriods(list) {
    const grid = document.getElementById('periodGrid');
    const hint = document.getElementById('periodHint');
    if (!grid) return;
    grid.innerHTML = '';
    const groups = periodMode === 'months' ? groupByMonth(list) : groupByWeek(list);
    if (hint) hint.textContent = periodMode === 'months'
        ? T('periodHintMonths')(groups.length)
        : T('periodHintWeeks')(groups.length);

    if (!groups.length) {
        grid.innerHTML = `<div class="empty-state">${T('noEntriesRange')}</div>`;
        return;
    }

    groups.forEach(g => {
        const start = g.values[0];
        const end = g.values.at(-1);
        const avgDef = getAvgDeficit(g.values);
        const change = end.gewicht - start.gewicht;
        const card = document.createElement('div');
        card.className = 'period-card';
        card.innerHTML = `
            <div class="period-title">${g.title}</div>
            <div class="period-line"><span>${T('periodEntries')}</span><strong>${g.values.length}</strong></div>
            <div class="period-line"><span>${T('periodAvgDeficit')}</span><strong>${fmt(avgDef)} kcal</strong></div>
            <div class="period-line"><span>${T('periodWeight')}</span><strong>${fmtWeight(start.gewicht)} → ${fmtWeight(end.gewicht)} kg</strong></div>
            <div class="period-line"><span>${T('periodChange')}</span><strong class="${change <= 0 ? 'green' : 'yellow'}">${change >= 0 ? '+' : ''}${fmtWeight(change)} kg</strong></div>
        `;
        grid.appendChild(card);
    });
}
