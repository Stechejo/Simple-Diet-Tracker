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
import ConfirmModal from './components/ConfirmModal.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import PeriodsPage from './pages/PeriodsPage.jsx';
import { filterByRange } from './utils/calculations.js';
import { todayISO } from './utils/date.js';
import { fmtDateLong } from './utils/format.js';
import { useLanguage } from './hooks/useLanguage.js';
import { useToast } from './hooks/useToast.js';
import { useTrackerState } from './hooks/useTrackerState.js';

const emptyEntryForm = () => ({ date: todayISO(), verbraucht: '', intake: '', gewicht: '' });

export default function App() {
  const { lang, t, toggleLang } = useLanguage();
  const tracker = useTrackerState();
  const { toast, notify } = useToast();

  const [range, setRange] = useState(7);
  const [periodMode, setPeriodMode] = useState('weeks');
  const [showAll, setShowAll] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [deleteDate, setDeleteDate] = useState(null);
  const [form, setForm] = useState(emptyEntryForm);
  const [settings, setSettings] = useState({ startWeight: '', targetWeight: '', targetDeficit: '' });

  useEffect(() => {
    document.body.classList.toggle('modal-open', entryOpen || settingsOpen || Boolean(deleteDate));
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

  const visibleEntries = useMemo(() => filterByRange(tracker.entries, range), [tracker.entries, range]);
  const headerSub = !tracker.entries.length
    ? t.headerNoEntries
    : `${tracker.entries.length} ${t.entries} • ${t.view} ${fmtDateLong((visibleEntries[0] || tracker.entries[0]).date)}-${fmtDateLong((visibleEntries.at(-1) || tracker.entries.at(-1)).date)}`;

  function openNewEntry() {
    setEditingDate(null);
    setForm(emptyEntryForm());
    setEntryOpen(true);
  }

  function editEntry(date) {
    const entry = tracker.getEntryByDate(date);
    if (!entry) return;

    setEditingDate(date);
    setForm({ date: entry.date, verbraucht: entry.verbraucht, intake: entry.intake, gewicht: entry.gewicht });
    setEntryOpen(true);
  }

  function saveEntry() {
    const saved = tracker.addOrUpdateEntry(form, editingDate);
    if (!saved) return;

    setEntryOpen(false);
    setEditingDate(null);
  }

  function confirmDeleteEntry() {
    tracker.deleteEntry(deleteDate);
    setDeleteDate(null);
    notify(t.toastDeleteOk);
  }

  function openSettings() {
    setSettings({
      startWeight: tracker.startWeight || '',
      targetWeight: tracker.targetWeight || '',
      targetDeficit: tracker.targetDeficit || ''
    });
    setSettingsOpen(true);
  }

  function saveSettings() {
    tracker.updateSettings(settings);
    setSettingsOpen(false);
    notify(t.settingsSaved);
  }

  function exportData() {
    const backup = tracker.createBackup();
    const url = URL.createObjectURL(new Blob([backup.content], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = backup.filename;
    a.click();
    URL.revokeObjectURL(url);
    notify(t.toastExportOk);
  }

  function importData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const count = tracker.importSnapshot(event.target.result);
        notify(t.toastImportOk(count));
      } catch (error) {
        notify(error.message === 'NO_TRACKER_DATA' ? t.toastImportInvalid : t.toastImportFailed(error.message), 'error');
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <Header t={t} headerSub={headerSub} onOpenSettings={openSettings} onToggleLang={toggleLang} />
      <main className="wrap">
        <Stats entries={tracker.entries} startWeight={tracker.startWeight} t={t} />
        <Insights entries={tracker.entries} targetWeight={tracker.targetWeight} targetDeficit={tracker.targetDeficit} t={t} lang={lang} />
        <RangeChart entries={visibleEntries} range={range} setRange={setRange} t={t} lang={lang} />
        <div className="quick-actions">
          <button className="primary-action" onClick={openNewEntry}>
            {t.btnAddEntry}
          </button>
        </div>
        <Tabs t={t} />
        <BackupBar t={t} onExport={exportData} onImport={importData} />
        <Routes>
          <Route
            path="/"
            element={
              <OverviewPage
                entries={showAll ? tracker.entries : tracker.entries.slice(-7)}
                total={tracker.entries.length}
                showAll={showAll}
                setShowAll={setShowAll}
                editEntry={editEntry}
                deleteEntry={setDeleteDate}
                targetDeficit={tracker.targetDeficit}
                t={t}
              />
            }
          />
          <Route path="/perioden" element={<PeriodsPage entries={tracker.entries} mode={periodMode} setMode={setPeriodMode} t={t} lang={lang} />} />
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
