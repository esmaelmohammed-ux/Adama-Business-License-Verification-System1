import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SYSTEM_NAME_SHORT, SYSTEM_NAMES } from '../i18n/systemNames';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const SUPPORTED_LANGS = ['en', 'am', 'om'];

function normalizeLang(value) {
  return SUPPORTED_LANGS.includes(value) ? value : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => normalizeLang(localStorage.getItem('ketelelema_lang')));

  const systemName = SYSTEM_NAMES[lang];
  const systemNameShort = SYSTEM_NAME_SHORT[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = systemName;
  }, [lang, systemName]);

  const value = useMemo(() => ({
    lang,
    systemName,
    systemNameShort,
    setLang: (next) => {
      const safeLang = normalizeLang(next);
      localStorage.setItem('ketelelema_lang', safeLang);
      setLang(safeLang);
    },
    t: (key) => translations[lang][key] || translations.en[key] || key,
  }), [lang, systemName, systemNameShort]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
