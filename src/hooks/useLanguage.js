import { useEffect, useState } from 'react';
import { LANG_KEY, TRANSLATIONS } from '../i18n/translations.js';
import { readString, writeString } from '../storage/storage.js';

export function useLanguage() {
  const [lang, setLang] = useState(() => readString(LANG_KEY, 'de'));
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;

  useEffect(() => {
    document.title = lang === 'de' ? 'Diät Tracker' : 'Diet Tracker';
    writeString(LANG_KEY, lang);
  }, [lang]);

  function toggleLang() {
    setLang(current => current === 'de' ? 'en' : 'de');
  }

  return { lang, t, toggleLang };
}
