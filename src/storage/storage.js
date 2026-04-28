import { normalizeEntries } from '../utils/calculations.js';

export const STORAGE_KEY = 'diaet-tracker-v2';
export const LEGACY_STORAGE_KEY = 'diaet-tracker-v1';
export const START_WEIGHT_KEY = 'diaet-tracker-start-weight-v1';
export const TARGET_KEY = 'diaet-tracker-target-v1';
export const TARGET_DEFICIT_KEY = 'diaet-tracker-target-deficit-v1';

export function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || '[]';
    return normalizeEntries(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeEntries(entries)));
  } catch { }
}

export function loadNumber(key) {
  try {
    const value = Number(localStorage.getItem(key));
    return value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveNumber(key, value) {
  try {
    value > 0 ? localStorage.setItem(key, String(value)) : localStorage.removeItem(key);
  } catch { }
}
