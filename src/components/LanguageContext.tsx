"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

const translations = {
  en: {
    hero_title: "Healthcare appointments, without the waiting room",
    hero_subtitle: "Browse specialists near you, see live availability, and lock in a time that works.",
    search_placeholder: "Doctor name, condition or clinic",
    search_btn: "Search",
    login: "Log in",
    get_started: "Get started",
    find_doctor: "Find a doctor",
  },
  es: {
    hero_title: "Citas médicas, sin sala de espera",
    hero_subtitle: "Busque especialistas cerca de usted, vea disponibilidad en vivo y reserve una hora.",
    search_placeholder: "Nombre del médico, condición o clínica",
    search_btn: "Buscar",
    login: "Iniciar sesión",
    get_started: "Empezar",
    find_doctor: "Encontrar médico",
  }
};

type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof Translations) => {
    return translations[language][key] || translations.en[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
