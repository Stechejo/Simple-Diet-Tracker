const LANG_KEY = 'diaet-tracker-lang';

const TRANSLATIONS = {
    de: {
        // Header
        appTitle: 'DIÄT TRACKER',
        headerLoading: 'LADE...',
        headerNoEntries: 'NOCH KEINE EINTRÄGE',

        // Stats
        statLost: 'Abgenommen',
        statDeficit: 'Ø Defizit',
        statTrend: '7T Gewicht',
        statToday: 'Heute',

        // Insights
        insightPlan: 'Heute im Plan?',
        insightForecast: 'Prognose',
        insightPlanEmpty: 'Trage Werte ein, um Feedback zu sehen.',
        insightForecastEmpty: 'Basierend auf deinem bisherigen Durchschnitt.',

        // Chart
        chartLabel: 'Gewichtsverlauf',
        legendWeight: 'Gewicht',
        legendTrend: '7T Trend',

        // Range select
        range7: '1 Woche',
        range14: '2 Wochen',
        range30: '1 Monat',
        range90: '3 Monate',
        range180: '6 Monate',
        range365: '12 Monate',

        // Tabs
        tabOverview: 'Übersicht',
        tabPeriods: 'Wochen/Monate',

        // Backup bar
        btnExport: 'Exportieren',
        btnImport: 'Importieren',

        // Table head
        thDay: 'Tag',
        thDate: 'Datum',
        thBurned: 'Verbraucht',
        thIntake: 'Intake',
        thDeficit: 'Defizit',
        thWeight: 'Gewicht',

        // Table toolbar
        tableLatest: n => `Letzte ${n} von`,
        tableAll: n => `Alle ${n} Einträge`,
        btnLatest7: 'Letzte 7',
        btnAll: 'Alle',

        // Empty state
        noEntries: 'Noch keine Einträge.',
        noEntriesRange: 'Keine Einträge in diesem Zeitraum.',

        // Period toolbar
        btnWeeks: 'Wochen',
        btnMonths: 'Monate',
        periodHintWeeks: n => `${n} Wochen in der aktuellen Ansicht.`,
        periodHintMonths: n => `${n} Monate in der aktuellen Ansicht.`,

        // Period card
        periodEntries: 'Einträge',
        periodAvgDeficit: 'Ø Defizit',
        periodWeight: 'Gewicht',
        periodChange: 'Änderung',
        weekFrom: date => `Woche ab ${date}`,

        // Entry modal
        modalKicker: 'Tracking',
        modalTitleNew: 'Neuer Eintrag',
        modalTitleEdit: 'Eintrag bearbeiten',
        btnAddNew: 'Eintrag hinzufügen',
        btnSave: 'Eintrag speichern',
        btnCancel: 'Abbrechen',

        // Form fields
        fieldDate: 'Datum',
        fieldBurned: 'Kalorien verbraucht (kcal)',
        fieldIntake: 'Kalorien Intake (kcal)',
        fieldWeight: 'Gewicht (kg)',
        fieldTargetWeight: 'Zielgewicht für Prognose (kg)',
        fieldTargetDeficit: 'Zieldefizit (kcal/Tag)',

        // Form placeholders
        phBurned: 'z.B. 2800',
        phIntake: 'z.B. 1900',
        phWeight: 'z.B. 90,3',
        phTargetWeight: 'z.B. 85',
        phTargetDeficit: 'z.B. 500',

        // Preview
        previewDeficit: (d, w) => `Defizit: ${d} kcal • Gewicht: ${w} kg`,
        previewDateError: 'Bitte gib ein echtes Datum ein, z.B. kein 31.04.2026.',

        // Insights text
        kcalOverTarget: n => `${n} kcal über Zieldefizit.`,
        kcalUnderTarget: n => `${n} kcal unter Zieldefizit.`,
        forecastNoDeficit: 'Für eine Prognose brauchst du ein durchschnittliches Defizit.',
        forecastSub: (kg, target, avg) => `${kg} kg bis ${target} kg bei Ø ${avg} kcal/Tag.`,

        // Plateau
        plateauLabel: 'Plateau möglich',
        plateauDetail: (min, max) => `Die letzten 7 Einträge bewegen sich nur zwischen ${min} und ${max} kg.`,
        trendFalling: 'Trend fällt',
        trendStable: 'Trend stabil/steigend',
        trendDetail: change => `7T-Veränderung: ${change} kg.`,

        // Quick actions
        btnAddEntry: '+ Eintrag hinzufügen',

        // Row actions
        btnEdit: 'Edit',

        // Confirm dialog
        confirmDelete: 'Eintrag wirklich löschen?',
        confirmCancel: 'Abbrechen',
        confirmOk: 'Löschen',

        // Toast messages
        toastExportOk: 'Export erfolgreich gespeichert.',
        toastImportOk: n => `Import erfolgreich: ${n} Einträge geladen.`,
        toastImportInvalid: 'Ungültige Datei: Keine Tracker-Daten gefunden.',
        toastImportFailed: err => 'Import fehlgeschlagen: ' + err,

        // Chart empty
        chartNeedMore: 'Mehr Einträge für Verlauf nötig',

        // Footer
        footer: '~1 kg Körperfett ≈ 7.000 kcal Defizit \u00a0•\u00a0 Daten lokal gespeichert',

        // Lang toggle
        langToggle: 'EN',
    },

    en: {
        appTitle: 'DIET TRACKER',
        headerLoading: 'LOADING...',
        headerNoEntries: 'NO ENTRIES YET',

        statLost: 'Lost',
        statDeficit: 'Avg Deficit',
        statTrend: '7D Weight',
        statToday: 'Today',

        insightPlan: 'On plan today?',
        insightForecast: 'Forecast',
        insightPlanEmpty: 'Enter values to see feedback.',
        insightForecastEmpty: 'Based on your average so far.',

        chartLabel: 'Weight History',
        legendWeight: 'Weight',
        legendTrend: '7D Trend',

        range7: '1 Week',
        range14: '2 Weeks',
        range30: '1 Month',
        range90: '3 Months',
        range180: '6 Months',
        range365: '12 Months',

        tabOverview: 'Overview',
        tabPeriods: 'Weeks/Months',

        btnExport: 'Export',
        btnImport: 'Import',

        thDay: 'Day',
        thDate: 'Date',
        thBurned: 'Burned',
        thIntake: 'Intake',
        thDeficit: 'Deficit',
        thWeight: 'Weight',

        tableLatest: n => `Last ${n} of`,
        tableAll: n => `All ${n} entries`,
        btnLatest7: 'Last 7',
        btnAll: 'All',

        noEntries: 'No entries yet.',
        noEntriesRange: 'No entries in this period.',

        btnWeeks: 'Weeks',
        btnMonths: 'Months',
        periodHintWeeks: n => `${n} weeks in the current view.`,
        periodHintMonths: n => `${n} months in the current view.`,

        periodEntries: 'Entries',
        periodAvgDeficit: 'Avg Deficit',
        periodWeight: 'Weight',
        periodChange: 'Change',
        weekFrom: date => `Week of ${date}`,

        modalKicker: 'Tracking',
        modalTitleNew: 'New Entry',
        modalTitleEdit: 'Edit Entry',
        btnAddNew: 'Add Entry',
        btnSave: 'Save Entry',
        btnCancel: 'Cancel',

        fieldDate: 'Date',
        fieldBurned: 'Calories burned (kcal)',
        fieldIntake: 'Calorie intake (kcal)',
        fieldWeight: 'Weight (kg)',
        fieldTargetWeight: 'Target weight for forecast (kg)',
        fieldTargetDeficit: 'Target deficit (kcal/day)',

        phBurned: 'e.g. 2800',
        phIntake: 'e.g. 1900',
        phWeight: 'e.g. 90.3',
        phTargetWeight: 'e.g. 85',
        phTargetDeficit: 'e.g. 500',

        previewDeficit: (d, w) => `Deficit: ${d} kcal • Weight: ${w} kg`,
        previewDateError: 'Please enter a valid date, e.g. not 31/04/2026.',

        kcalOverTarget: n => `${n} kcal above target deficit.`,
        kcalUnderTarget: n => `${n} kcal below target deficit.`,
        forecastNoDeficit: 'You need an average deficit for a forecast.',
        forecastSub: (kg, target, avg) => `${kg} kg to go until ${target} kg at avg ${avg} kcal/day.`,

        plateauLabel: 'Possible plateau',
        plateauDetail: (min, max) => `The last 7 entries range only between ${min} and ${max} kg.`,
        trendFalling: 'Trend falling',
        trendStable: 'Trend stable/rising',
        trendDetail: change => `7D change: ${change} kg.`,

        btnAddEntry: '+ Add Entry',

        btnEdit: 'Edit',

        confirmDelete: 'Really delete this entry?',
        confirmCancel: 'Cancel',
        confirmOk: 'Delete',

        toastExportOk: 'Export saved successfully.',
        toastImportOk: n => `Import successful: ${n} entries loaded.`,
        toastImportInvalid: 'Invalid file: No tracker data found.',
        toastImportFailed: err => 'Import failed: ' + err,

        chartNeedMore: 'More entries needed for chart',

        footer: '~1 kg body fat ≈ 7,000 kcal deficit \u00a0•\u00a0 Data stored locally',

        langToggle: 'DE',
    }
};

let currentLang = localStorage.getItem(LANG_KEY) || 'de';

function T(key) {
    return (TRANSLATIONS[currentLang] || TRANSLATIONS['de'])[key];
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
}

function toggleLang() {
    setLang(currentLang === 'de' ? 'en' : 'de');
    applyI18n();
    renderAll(entries, targetWeight, targetDeficit);
}

function applyI18n() {
    // Header
    document.querySelector('header h1').textContent = T('appTitle');
    document.title = T('appTitle').charAt(0) + T('appTitle').slice(1).toLowerCase().replace('tracker', 'Tracker').replace('diet', 'Diet') || T('appTitle');
    document.title = currentLang === 'de' ? 'Diät Tracker' : 'Diet Tracker';

    // Stat labels
    const statLabels = document.querySelectorAll('.stat-label');
    const keys = ['statLost', 'statDeficit', 'statTrend', 'statToday'];
    statLabels.forEach((el, i) => { if (keys[i]) el.textContent = T(keys[i]); });

    // Insight labels
    document.querySelector('#planMain')?.parentElement?.querySelector('.insight-label')?.let;
    const insightLabels = document.querySelectorAll('.insight-label');
    if (insightLabels[0]) insightLabels[0].textContent = T('insightPlan');
    if (insightLabels[1]) insightLabels[1].textContent = T('insightForecast');

    // Chart label & legend
    const chartLabel = document.querySelector('.chart-label');
    if (chartLabel) chartLabel.textContent = T('chartLabel');
    const legendSpans = document.querySelectorAll('.legend span');
    if (legendSpans[0]) legendSpans[0].textContent = T('legendWeight');
    if (legendSpans[1]) legendSpans[1].textContent = T('legendTrend');

    // Range select options
    const rangeOpts = document.querySelectorAll('#rangeSelect option');
    const rangeKeys = ['range7', 'range14', 'range30', 'range90', 'range180', 'range365'];
    rangeOpts.forEach((opt, i) => { if (rangeKeys[i]) opt.textContent = T(rangeKeys[i]); });

    // Tabs
    const tabs = document.querySelectorAll('.tab');
    if (tabs[0]) tabs[0].textContent = T('tabOverview');
    if (tabs[1]) tabs[1].textContent = T('tabPeriods');

    // Backup bar
    const exportBtn = document.querySelector('.backup-bar .backup-btn');
    if (exportBtn && exportBtn.tagName === 'BUTTON') exportBtn.textContent = T('btnExport');
    const importLabel = document.querySelector('.backup-bar label.backup-btn');
    if (importLabel) importLabel.textContent = T('btnImport');

    // Table head
    const thSpans = document.querySelectorAll('.table-head span');
    const thKeys = ['thDay', 'thDate', 'thBurned', 'thIntake', 'thDeficit', 'thWeight'];
    thSpans.forEach((el, i) => { if (thKeys[i]) el.textContent = T(thKeys[i]); });

    // Period mode buttons
    const modeWeeks = document.getElementById('mode-weeks');
    const modeMonths = document.getElementById('mode-months');
    if (modeWeeks) modeWeeks.textContent = T('btnWeeks');
    if (modeMonths) modeMonths.textContent = T('btnMonths');

    // Quick action button
    const primaryAction = document.querySelector('.primary-action');
    if (primaryAction) primaryAction.textContent = T('btnAddEntry');

    // Form labels & placeholders
    const formLabels = document.querySelectorAll('.form .field label');
    const formLabelKeys = ['fieldDate', 'fieldBurned', 'fieldIntake', 'fieldWeight'];
    formLabels.forEach((el, i) => { if (formLabelKeys[i]) el.textContent = T(formLabelKeys[i]); });

    // Two-col labels
    const twoColLabels = document.querySelectorAll('.field.two-col label');
    if (twoColLabels[0]) twoColLabels[0].textContent = T('fieldTargetWeight');
    if (twoColLabels[1]) twoColLabels[1].textContent = T('fieldTargetDeficit');

    // Placeholders
    const fV = document.getElementById('fV');
    const fI = document.getElementById('fI');
    const fG = document.getElementById('fG');
    const fTarget = document.getElementById('fTarget');
    const fTargetDeficit = document.getElementById('fTargetDeficit');
    if (fV) fV.placeholder = T('phBurned');
    if (fI) fI.placeholder = T('phIntake');
    if (fG) fG.placeholder = T('phWeight');
    if (fTarget) fTarget.placeholder = T('phTargetWeight');
    if (fTargetDeficit) fTargetDeficit.placeholder = T('phTargetDeficit');

    // Footer
    const footer = document.querySelector('.footer');
    if (footer) footer.innerHTML = T('footer');

    // Lang button
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = T('langToggle');

    // Insight empty states (only if no data rendered yet)
    const planSub = document.getElementById('planSub');
    const forecastSub = document.getElementById('forecastSub');
    if (planSub && planSub.dataset.empty === 'true') planSub.textContent = T('insightPlanEmpty');
    if (forecastSub && forecastSub.dataset.empty === 'true') forecastSub.textContent = T('insightForecastEmpty');
}
