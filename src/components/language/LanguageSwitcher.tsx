"use client";

import { useState } from "react";

import {
  languageData,
  type SarjomLanguage,
} from "@/lib/i18n/translations";

import { useLanguage } from "./LanguageProvider";

const languages: SarjomLanguage[] = [
  "en",
  "hi",
  "sat",
  "or",
];

export default function LanguageSwitcher() {
  const {
    language,
    setLanguage,
  } = useLanguage();

  const [open, setOpen] = useState(false);

  const current = languageData[language];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-w-[110px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span>{current.short}</span>
        <span className="text-slate-400">
          ▾
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close language menu"
          />

          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {languages.map((code) => {
              const item = languageData[code];
              const active = code === language;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLanguage(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                    active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>
                    {item.flag}
                  </span>

                  <span className="flex-1">
                    {item.name}
                  </span>

                  {active && (
                    <span>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}