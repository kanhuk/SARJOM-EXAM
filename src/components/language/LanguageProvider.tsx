"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_LANGUAGE,
  languageData,
  isSarjomLanguage,
  type SarjomLanguage,
} from "@/lib/i18n/translations";

type LanguageContextValue = {
  language: SarjomLanguage;
  setLanguage: (language: SarjomLanguage) => void;
  t: (typeof languageData)["en"];
};

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "sarjom_language";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] =
    useState<SarjomLanguage>(DEFAULT_LANGUAGE);

  const [languageRestored, setLanguageRestored] =
    useState(false);

  useEffect(() => {
    let savedLanguage: SarjomLanguage = DEFAULT_LANGUAGE;

    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("sarjomLanguage");

      if (isSarjomLanguage(saved)) {
        savedLanguage = saved;
      }
    } catch {
      // Keep the default language if storage is unavailable.
    }

    const restoreTimer = window.setTimeout(() => {
      setLanguageState(savedLanguage);
      setLanguageRestored(true);
    }, 0);

    return () => {
      window.clearTimeout(restoreTimer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;

    try {
      localStorage.setItem(STORAGE_KEY, language);
      localStorage.setItem("sarjomLanguage", language);
    } catch {
      // Ignore storage failures.
    }
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: languageData[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {languageRestored ? children : null}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}
export default LanguageProvider;
