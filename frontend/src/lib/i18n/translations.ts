export type SarjomLanguage = "en" | "hi" | "sat" | "or";

export type TranslationDictionary = {
  short: string;
  name: string;
  flag: string;

  tagline: string;

  dashboard: string;
  syllabus: string;
  exams: string;

  ai: string;
  askSarjomAI: string;

  searchPlaceholder: string;

  latestNotifications: string;
  openApplications: string;
  closingSoon: string;
  upcomingJobs: string;
  admitCards: string;
  examDates: string;
  results: string;
  answerKeys: string;

  state: string;
  district: string;
  selectState: string;
  selectDistrict: string;

  allIndia: string;
  search: string;
  viewAll: string;

  verifiedInformation: string;
  officialSource: string;
};

export const languageData: Record<
  SarjomLanguage,
  TranslationDictionary
> = {
  en: {
    short: "EN",
    name: "English",
    flag: "🇬🇧",

    tagline: "Knowledge • Opportunity • Identity",

    dashboard: "Dashboard",
    syllabus: "Syllabus",
    exams: "Exams",

    ai: "SARJOM AI",
    askSarjomAI: "Ask SARJOM AI",

    searchPlaceholder: "Ask anything about government information...",

    latestNotifications: "Latest Notifications",
    openApplications: "Open Applications",
    closingSoon: "Closing Soon",
    upcomingJobs: "Upcoming Jobs",
    admitCards: "Admit Cards",
    examDates: "Exam Dates",
    results: "Results",
    answerKeys: "Answer Keys",

    state: "State",
    district: "District",
    selectState: "Select State",
    selectDistrict: "Select District",

    allIndia: "All India",
    search: "Search",
    viewAll: "View All",

    verifiedInformation: "Verified government information",
    officialSource: "Official Source",
  },

  hi: {
    short: "हि",
    name: "हिन्दी",
    flag: "🇮🇳",

    tagline: "ज्ञान • अवसर • पहचान",

    dashboard: "डैशबोर्ड",
    syllabus: "पाठ्यक्रम",
    exams: "परीक्षाएं",

    ai: "SARJOM AI",
    askSarjomAI: "SARJOM AI से पूछें",

    searchPlaceholder:
      "सरकारी जानकारी के बारे में कुछ भी पूछें...",

    latestNotifications: "नवीनतम सूचनाएं",
    openApplications: "खुले आवेदन",
    closingSoon: "जल्द बंद होने वाले आवेदन",
    upcomingJobs: "आगामी नौकरियां",
    admitCards: "प्रवेश पत्र",
    examDates: "परीक्षा तिथियां",
    results: "परिणाम",
    answerKeys: "उत्तर कुंजी",

    state: "राज्य",
    district: "जिला",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",

    allIndia: "पूरा भारत",
    search: "खोजें",
    viewAll: "सभी देखें",

    verifiedInformation: "सत्यापित सरकारी जानकारी",
    officialSource: "आधिकारिक स्रोत",
  },

  sat: {
    short: "ᱚᱞ",
    name: "ᱚᱞ ᱪᱤᱠᱤ",
    flag: "🌿",

    tagline: "ᱜᱮᱭᱟᱱ • ᱫᱟᱣ • ᱩᱯᱨᱩᱢ",

    dashboard: "ᱰᱮᱥᱵᱚᱨᱰ",
    syllabus: "ᱥᱤᱞᱮᱵᱟᱥ",
    exams: "ᱯᱟᱹᱨᱠᱷᱟ",

    ai: "SARJOM AI",
    askSarjomAI: "SARJOM AI ᱠᱩᱞᱤ ᱭᱮᱢ",

    searchPlaceholder:
      "ᱥᱚᱨᱠᱟᱨᱤ ᱵᱤᱵᱨᱚᱬ ᱨᱮ ᱡᱟᱦᱟᱱ ᱠᱟᱛᱷᱟ ᱯᱩᱪᱷᱟ...",

    latestNotifications: "ᱱᱟᱣᱟ ᱠᱷᱚᱵᱚᱨ",
    openApplications: "ᱡᱷᱤᱡᱽ ᱟᱵᱮᱫᱚᱱ",
    closingSoon: "ᱛᱮᱦᱮᱸᱫ ᱵᱚᱸᱫ ᱜᱮᱭᱟ",
    upcomingJobs: "ᱟᱜᱟᱢ ᱪᱟᱠᱨᱤ",
    admitCards: "ᱮᱰᱢᱤᱴ ᱠᱟᱨᱰ",
    examDates: "ᱵᱤᱱᱤᱰ ᱢᱟᱹᱦᱤᱛ",
    results: "ᱚᱨᱡᱚ",
    answerKeys: "ᱟᱱᱥᱟᱨ ᱠᱤ",

    state: "ᱯᱚᱱᱚᱛ",
    district: "ᱦᱚᱱᱚᱛ",
    selectState: "ᱯᱚᱱᱚᱛ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
    selectDistrict: "ᱦᱚᱱᱚᱛ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",

    allIndia: "ᱥᱟᱱᱟᱢ ᱵᱷᱟᱨᱚᱛ",
    search: "ᱯᱟᱱᱛᱮ",
    viewAll: "ᱥᱟᱱᱟᱢ ᱧᱮᱞᱢᱮ",

    verifiedInformation: "ᱯᱩᱭᱞᱩ ᱥᱚᱨᱠᱟᱨᱤ ᱵᱤᱵᱨᱚᱬ",
    officialSource: "ᱥᱚᱨᱠᱟᱨᱤ ᱥᱚᱨᱥ",
  },

  or: {
    short: "ଓଡ଼ି",
    name: "ଓଡ଼ିଆ",
    flag: "🇮🇳",

    tagline: "ଜ୍ଞାନ • ସୁଯୋଗ • ପରିଚୟ",

    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    syllabus: "ପାଠ୍ୟକ୍ରମ",
    exams: "ପରୀକ୍ଷା",

    ai: "SARJOM AI",
    askSarjomAI: "SARJOM AI କୁ ପଚାରନ୍ତୁ",

    searchPlaceholder:
      "ସରକାରୀ ସୂଚନା ବିଷୟରେ କିଛି ପଚାରନ୍ତୁ...",

    latestNotifications: "ସର୍ବଶେଷ ସୂଚନା",
    openApplications: "ଖୋଲା ଆବେଦନ",
    closingSoon: "ଶୀଘ୍ର ବନ୍ଦ ହେବ",
    upcomingJobs: "ଆଗାମୀ ଚାକିରି",
    admitCards: "ଆଡମିଟ୍ କାର୍ଡ",
    examDates: "ପରୀକ୍ଷା ତାରିଖ",
    results: "ଫଳାଫଳ",
    answerKeys: "ଉତ୍ତର କୀ",

    state: "ରାଜ୍ୟ",
    district: "ଜିଲ୍ଲା",
    selectState: "ରାଜ୍ୟ ବାଛନ୍ତୁ",
    selectDistrict: "ଜିଲ୍ଲା ବାଛନ୍ତୁ",

    allIndia: "ସମଗ୍ର ଭାରତ",
    search: "ସନ୍ଧାନ",
    viewAll: "ସମସ୍ତ ଦେଖନ୍ତୁ",

    verifiedInformation: "ଯାଞ୍ଚ ହୋଇଥିବା ସରକାରୀ ସୂଚନା",
    officialSource: "ଅଫିସିଆଲ୍ ଉତ୍ସ",
  },
};

export const DEFAULT_LANGUAGE: SarjomLanguage = "en";

export function isSarjomLanguage(
  value: string | null | undefined,
): value is SarjomLanguage {
  return (
    value === "en" ||
    value === "hi" ||
    value === "sat" ||
    value === "or"
  );
}