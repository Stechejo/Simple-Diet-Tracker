import { normalizeEntries } from '../utils/calculations.js';
import { todayISO } from '../utils/date.js';
import {
  LEGACY_STORAGE_KEY,
  START_WEIGHT_KEY,
  STORAGE_KEY,
  TARGET_DEFICIT_KEY,
  TARGET_KEY,
  readJSON,
  readNumber,
  writeJSON,
  writeNumber
} from '../storage/storage.js';

export function loadTrackerSnapshot() {
  const storedEntries = readJSON(STORAGE_KEY, null) ?? readJSON(LEGACY_STORAGE_KEY, []);

  return {
    entries: normalizeEntries(storedEntries),
    startWeight: readNumber(START_WEIGHT_KEY),
    targetWeight: readNumber(TARGET_KEY),
    targetDeficit: readNumber(TARGET_DEFICIT_KEY)
  };
}

export function saveEntriesSnapshot(entries) {
  writeJSON(STORAGE_KEY, normalizeEntries(entries));
}

export function saveTrackerSettings({ startWeight, targetWeight, targetDeficit }) {
  writeNumber(START_WEIGHT_KEY, startWeight);
  writeNumber(TARGET_KEY, targetWeight);
  writeNumber(TARGET_DEFICIT_KEY, targetDeficit);
}

export function upsertEntry(entries, entry, previousDate = null) {
  const dateToReplace = previousDate || entry.date;
  return normalizeEntries([
    ...entries.filter(item => item.date !== dateToReplace),
    entry
  ]);
}

export function removeEntry(entries, date) {
  return normalizeEntries(entries.filter(entry => entry.date !== date));
}

export function createBackup(snapshot) {
  return {
    filename: `diaet-tracker-backup-${todayISO()}.txt`,
    content: JSON.stringify({ ...snapshot, exportDate: new Date().toISOString() }, null, 2)
  };
}

export function parseBackup(rawText) {
  const imported = JSON.parse(rawText);
  if (!Array.isArray(imported.entries)) {
    throw new Error('NO_TRACKER_DATA');
  }

  return {
    entries: normalizeEntries(imported.entries),
    startWeight: Number(imported.startWeight) > 0 ? Number(imported.startWeight) : undefined,
    targetWeight: Number(imported.targetWeight) > 0 ? Number(imported.targetWeight) : undefined,
    targetDeficit: Number(imported.targetDeficit) > 0 ? Number(imported.targetDeficit) : undefined
  };
}
