"use client";

import React from "react";
import Header from "@/components/Header";
import { LanguageProvider } from "@/components/language/LanguageProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
