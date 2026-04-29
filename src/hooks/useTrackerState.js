import { useEffect, useMemo, useState } from 'react';
import { formNum } from '../utils/format.js';
import {
  createBackup,
  loadTrackerSnapshot,
  parseBackup,
  removeEntry,
  saveEntriesSnapshot,
  saveTrackerSettings,
  upsertEntry
} from '../services/trackerRepository.js';

export function useTrackerState() {
  const initialSnapshot = useMemo(() => loadTrackerSnapshot(), []);

  const [entries, setEntries] = useState(initialSnapshot.entries);
  const [startWeight, setStartWeight] = useState(initialSnapshot.startWeight);
  const [targetWeight, setTargetWeight] = useState(initialSnapshot.targetWeight);
  const [targetDeficit, setTargetDeficit] = useState(initialSnapshot.targetDeficit);

  useEffect(() => {
    saveEntriesSnapshot(entries);
  }, [entries]);

  useEffect(() => {
    saveTrackerSettings({ startWeight, targetWeight, targetDeficit });
  }, [startWeight, targetWeight, targetDeficit]);

  function addOrUpdateEntry(form, editingDate = null) {
    const entry = {
      date: form.date,
      verbraucht: formNum(form.verbraucht),
      intake: formNum(form.intake),
      gewicht: formNum(form.gewicht)
    };

    if (!entry.date || entry.verbraucht <= 0 || entry.intake < 0 || entry.gewicht <= 0) {
      return false;
    }

    setEntries(previous => upsertEntry(previous, entry, editingDate));
    return true;
  }

  function deleteEntry(date) {
    setEntries(previous => removeEntry(previous, date));
  }

  function updateSettings(settings) {
    setStartWeight(formNum(settings.startWeight));
    setTargetWeight(formNum(settings.targetWeight));
    setTargetDeficit(formNum(settings.targetDeficit));
  }

  function importSnapshot(rawText) {
    const imported = parseBackup(rawText);

    setEntries(imported.entries);
    if (imported.startWeight !== undefined) setStartWeight(imported.startWeight);
    if (imported.targetWeight !== undefined) setTargetWeight(imported.targetWeight);
    if (imported.targetDeficit !== undefined) setTargetDeficit(imported.targetDeficit);

    return imported.entries.length;
  }

  function getEntryByDate(date) {
    return entries.find(entry => entry.date === date) || null;
  }

  const snapshot = { entries, startWeight, targetWeight, targetDeficit };

  return {
    ...snapshot,
    addOrUpdateEntry,
    deleteEntry,
    updateSettings,
    importSnapshot,
    createBackup: () => createBackup(snapshot),
    getEntryByDate
  };
}
