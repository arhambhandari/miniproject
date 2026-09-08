"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      data-testid="language-switcher"
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 transition-all ${className}`}
      title="Select Language / भाषा चुनें"
    >
      <Globe className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0 pointer-events-none" />
      <select
        data-testid="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
        aria-label="Select Language"
        className="bg-transparent border-none text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 cursor-pointer appearance-none pr-1"
      >
        <option value="en" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
          EN
        </option>
        <option value="hi" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
          HI (हिन्दी)
        </option>
      </select>
    </div>
  );
}

