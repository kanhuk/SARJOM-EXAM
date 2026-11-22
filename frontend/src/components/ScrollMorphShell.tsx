"use client";

import React, { useEffect, useState } from "react";

interface ScrollMorphShellProps {
  brandTitle: string;
  brandSubtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  threshold?: number;
}

export default function ScrollMorphShell({
  brandTitle,
  brandSubtitle,
  rightSlot,
  children,
  threshold = 48,
}: ScrollMorphShellProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nextCompact = window.scrollY > threshold;
      setCompact((prev) => (prev === nextCompact ? prev : nextCompact));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header
        className={`sticky top-0 z-40 border-b transition-[padding,background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
          compact
            ? "border-white/15 bg-slate-950/85 py-2.5 shadow-lg backdrop-blur-md"
            : "border-white/10 bg-slate-950/60 py-5 backdrop-blur-sm"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between gap-4 transition-[max-width,padding] duration-300 ease-out motion-reduce:transition-none ${
            compact ? "max-w-[1440px] px-4 sm:px-6" : "max-w-5xl px-4 sm:px-8"
          }`}
        >
          <div className="min-w-0">
            <div
              className={`truncate font-black tracking-tight text-white transition-[font-size] duration-300 ease-out motion-reduce:transition-none ${
                compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
              }`}
            >
              {brandTitle}
            </div>
            {brandSubtitle && (
              <p
                className={`truncate font-mono text-xs text-slate-400 transition-all duration-300 ease-out motion-reduce:transition-none ${
                  compact
                    ? "max-h-0 opacity-0"
                    : "mt-0.5 max-h-6 opacity-100"
                }`}
              >
                {brandSubtitle}
              </p>
            )}
          </div>

          {rightSlot && (
            <div className="flex shrink-0 items-center gap-2">{rightSlot}</div>
          )}
        </div>
      </header>

      <main
        className={`mx-auto transition-[max-width,padding] duration-300 ease-out motion-reduce:transition-none ${
          compact
            ? "max-w-[1440px] px-4 py-5 sm:px-6"
            : "max-w-5xl px-4 py-8 sm:px-8"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
