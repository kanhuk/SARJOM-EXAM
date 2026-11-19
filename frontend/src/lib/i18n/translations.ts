export type SarjomLanguage = "en" | "or" | "hi" | "sat";

export type LanguageMeta = {
  code: SarjomLanguage;
  name: string;
  short: string;
  flag: string;
};

export const languageData: Record<SarjomLanguage, LanguageMeta> = {
  en: {
    code: "en",
    name: "English",
    short: "EN",
    flag: "🌐",
  },
  or: {
    code: "or",
    name: "ଓଡ଼ିଆ",
    short: "OR",
    flag: "🇮🇳",
  },
  hi: {
    code: "hi",
    name: "हिंदी",
    short: "HI",
    flag: "🇮🇳",
  },
  sat: {
    code: "sat",
    name: "ᱥᱟᱱᱛᱟᱲᱤ",
    short: "SAT",
    flag: "🌿",
  },
};