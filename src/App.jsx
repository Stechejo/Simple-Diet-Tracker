import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Stats from './components/Stats.jsx';
import Insights from './components/Insights.jsx';
import RangeChart from './components/RangeChart.jsx';
import BackupBar from './components/BackupBar.jsx';
import Tabs from './components/Tabs.jsx';
import EntryModal from './components/EntryModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import Toast from './components/Toast.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import PeriodsPage from './pages/PeriodsPage.jsx';
import { LANG_KEY, TRANSLATIONS } from './i18n/translations.js';
import { START_WEIGHT_KEY, TARGET_DEFICIT_KEY, TARGET_KEY, loadEntries, loadNumber, saveEntries, saveNumber } from './storage/storage.js';
import { filterByRange, normalizeEntries } from './utils/calculations.js';
import { todayISO } from './utils/date.js';
import { fmtDateLong, formNum } from './utils/format.js';
import ConfirmModal from './components/ConfirmModal.jsx';

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem(LANG_KEY) || 'de');
  const t = TRANSLATIONS[lang];

  const [entries, setEntries] = useState(loadEntries);
  const [startWeight, setStartWeight] = useState(() => loadNumber(START_WEIGHT_KEY));
  const [targetWeight, setTargetWeight] = useState(() => loadNumber(TARGET_KEY));
  const [targetDeficit, setTargetDeficit] = useState(() => loadNumber(TARGET_DEFICIT_KEY));

  const [range, setRange] = useState(7);
  const [periodMode, setPeriodMode] = useState('weeks');
  const [showAll, setShowAll] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteDate, setDeleteDate] = useState(null);
  const [form, setForm] = useState({ date: todayISO(), verbraucht: '', intake: '', gewicht: '' });
  const [settings, setSettings] = useState({ startWeight: '', targetWeight: '', targetDeficit: '' });

  useEffect(() => {
    document.title = lang === 'de' ? 'Diät Tracker' : 'Diet Tracker';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => saveEntries(entries), [entries]);
  useEffect(() => saveNumber(START_WEIGHT_KEY, startWeight), [startWeight]);
  useEffect(() => saveNumber(TARGET_KEY, targetWeight), [targetWeight]);
  useEffect(() => saveNumber(TARGET_DEFICIT_KEY, targetDeficit), [targetDeficit]);

  useEffect(() => {
    document.body.classList.toggle('modal-open', entryOpen || settingsOpen || deleteDate);
    return () => document.body.classList.remove('modal-open');
  }, [entryOpen, settingsOpen, deleteDate]);

  useEffect(() => {
    const onKey = event => {
      if (event.key === 'Escape') {
        setEntryOpen(false);
        setSettingsOpen(false);
        setDeleteDate(null);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visibleEntries = useMemo(() => filterByRange(entries, range), [entries, range]);
  const headerSub = !entries.length ? t.headerNoEntries : `${entries.length} ${t.entries} • ${t.view} ${fmtDateLong((visibleEntries[0] || entries[0]).date)}-${fmtDateLong((visibleEntries.at(-1) || entries.at(-1)).date)}`;

  function notify(message, type = 'success') {
    setToast({ message, type });
    window.clearTimeout(window.dietTrackerToastTimer);
    window.dietTrackerToastTimer = window.setTimeout(() => setToast(null), 2600);
  }

  function openNewEntry() {
    setEditingDate(null);
    setForm({ date: todayISO(), verbraucht: '', intake: '', gewicht: '' });
    setEntryOpen(true);
  }

  function editEntry(date) {
    const entry = entries.find(item => item.date === date);
    if (!entry) return;
    setEditingDate(date);
    setForm({ date: entry.date, verbraucht: entry.verbraucht, intake: entry.intake, gewicht: entry.gewicht });
    setEntryOpen(true);
  }

  function saveEntry() {
    const entry = {
      date: form.date,
      verbraucht: formNum(form.verbraucht),
      intake: formNum(form.intake),
      gewicht: formNum(form.gewicht)
    };
    if (!entry.date || entry.verbraucht <= 0 || entry.intake < 0 || entry.gewicht <= 0) return;
    setEntries(previous => normalizeEntries([...previous.filter(item => item.date !== (editingDate || entry.date)), entry]));
    setEntryOpen(false);
    setEditingDate(null);
  }

  function deleteEntry(date) {
    setDeleteDate(date);
  }

  function confirmDeleteEntry() {
    setEntries(previous =>
      normalizeEntries(previous.filter(entry => entry.date !== deleteDate))
    );
    setDeleteDate(null);
    notify(t.toastDeleteOk);
  }

  function openSettings() {
    setSettings({ startWeight: startWeight || '', targetWeight: targetWeight || '', targetDeficit: targetDeficit || '' });
    setSettingsOpen(true);
  }

  function saveSettings() {
    setStartWeight(formNum(settings.startWeight));
    setTargetWeight(formNum(settings.targetWeight));
    setTargetDeficit(formNum(settings.targetDeficit));
    setSettingsOpen(false);
    notify(t.settingsSaved);
  }

  function exportData() {
    const data = JSON.stringify({ entries, startWeight, targetWeight, targetDeficit, exportDate: new Date().toISOString() }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `diaet-tracker-backup-${todayISO()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    notify(t.toastExportOk);
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported.entries)) return notify(t.toastImportInvalid, 'error');
        const normalized = normalizeEntries(imported.entries);
        setEntries(normalized);
        if (imported.startWeight > 0) setStartWeight(imported.startWeight);
        if (imported.targetWeight > 0) setTargetWeight(imported.targetWeight);
        if (imported.targetDeficit > 0) setTargetDeficit(imported.targetDeficit);
        notify(t.toastImportOk(normalized.length));
      } catch (error) {
        notify(t.toastImportFailed(error.message), 'error');
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <Header t={t} headerSub={headerSub} onOpenSettings={openSettings} onToggleLang={() => setLang(lang === 'de' ? 'en' : 'de')} />
      <main className="wrap">
        <Stats entries={entries} startWeight={startWeight} t={t} />
        <Insights entries={entries} targetWeight={targetWeight} targetDeficit={targetDeficit} t={t} lang={lang} />
        <RangeChart entries={visibleEntries} range={range} setRange={setRange} t={t} lang={lang} />
        <div className="quick-actions"><button className="primary-action" onClick={openNewEntry}>{t.btnAddEntry}</button></div>
        <Tabs t={t} />
        <BackupBar t={t} onExport={exportData} onImport={importData} />
        <Routes>
          <Route path="/" element={<OverviewPage entries={showAll ? entries : entries.slice(-7)} total={entries.length} showAll={showAll} setShowAll={setShowAll} editEntry={editEntry} deleteEntry={deleteEntry} targetDeficit={targetDeficit} t={t} />} />
          <Route path="/perioden" element={<PeriodsPage entries={entries} mode={periodMode} setMode={setPeriodMode} t={t} lang={lang} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <div className="footer">{t.footer}</div>
      </main>
      {entryOpen && <EntryModal form={form} setForm={setForm} editing={Boolean(editingDate)} onClose={() => setEntryOpen(false)} onSave={saveEntry} t={t} />}
      {settingsOpen && <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} onSave={saveSettings} t={t} />}
      <Toast toast={toast} />
      {deleteDate && (
        <ConfirmModal
          title={t.confirmDeleteTitle}
          message={t.confirmDelete}
          cancelLabel={t.btnCancel}
          confirmLabel={t.btnDelete}
          onCancel={() => setDeleteDate(null)}
          onConfirm={confirmDeleteEntry}
        />
      )}
    </>
  );
}
