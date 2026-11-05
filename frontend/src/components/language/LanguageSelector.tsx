"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300">
      <span className="text-slate-400">🌐</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-semibold"
        aria-label="Language selector"
      >
        <option value="en" className="bg-slate-900 text-slate-200">GB EN</option>
        <option value="or" className="bg-slate-900 text-slate-200">ଓଡ଼ିଆ OR</option>
        <option value="hi" className="bg-slate-900 text-slate-200">हिंदी HI</option>
        <option value="sat" className="bg-slate-900 text-slate-200">ᱥᱟᱱᱛᱟᱲᱤ SAT</option>
      </select>
    </div>
  );
}
