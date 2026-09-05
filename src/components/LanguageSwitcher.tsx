"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as "en" | "es")}
      className="bg-transparent border-none text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-0 px-2 appearance-none cursor-pointer"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  );
}
