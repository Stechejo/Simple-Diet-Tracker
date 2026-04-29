export const STORAGE_KEY = 'diaet-tracker-v2';
export const LEGACY_STORAGE_KEY = 'diaet-tracker-v1';
export const START_WEIGHT_KEY = 'diaet-tracker-start-weight-v1';
export const TARGET_KEY = 'diaet-tracker-target-v1';
export const TARGET_DEFICIT_KEY = 'diaet-tracker-target-deficit-v1';

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

export function readNumber(key) {
  try {
    const value = Number(localStorage.getItem(key));
    return value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function writeNumber(key, value) {
  try {
    Number(value) > 0 ? localStorage.setItem(key, String(value)) : localStorage.removeItem(key);
  } catch { }
}

export function readString(key, fallback = '') {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch { }
}
