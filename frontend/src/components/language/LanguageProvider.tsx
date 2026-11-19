"use client";

import React, { createContext, useContext, useState } from "react";
import type { SarjomLanguage } from "@/lib/i18n/translations";

type LanguageContextType = {
  language: SarjomLanguage;
  setLanguage: (lang: SarjomLanguage) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SarjomLanguage>("en");

  const t = (key: string) => key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}