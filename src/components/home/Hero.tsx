"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import Image from "next/image";
import { Search, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Doctor } from "@/types";

interface HeroProps {
  onBook?: (doctor: Doctor) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function Hero({ onBook, searchQuery: externalSearch, setSearchQuery: setExternalSearch }: HeroProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const { t } = useLanguage();

  const currentSearch = externalSearch !== undefined ? externalSearch : internalSearch;
  const updateSearch = setExternalSearch || setInternalSearch;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const section = document.getElementById("doctors");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSpecialtyClick = (specialty: string) => {
    updateSearch(specialty);
    const section = document.getElementById("doctors");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="absolute top-0 left-1/4 size-96 bg-blue-400/15 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-0 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 size-96 bg-indigo-400/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] flex flex-wrap gap-x-3 gap-y-1.5">
            {t('hero_title') === "Find & Book the Best Doctors Near You" ? (
              <>
                <span className="inline-block cursor-pointer select-none text-slate-900 dark:text-white transition-transform duration-200 hover:-translate-y-1">
                  Find & Book the
                </span>
                <span className="inline-block cursor-pointer select-none text-slate-900 dark:text-white transition-transform duration-200 hover:-translate-y-1">
                  Best Doctors
                </span>
                <span className="inline-block cursor-pointer select-none text-slate-900 dark:text-white transition-transform duration-200 hover:-translate-y-1">
                  Near You
                </span>
              </>
            ) : (
              t('hero_title').split(" ").map((word, i) => (
                <span
                  key={i}
                  className="inline-block cursor-pointer select-none text-slate-900 dark:text-white transition-transform duration-200 hover:-translate-y-1"
                >
                  {word}
                </span>
              ))
            )}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed cursor-default transition-transform duration-200 hover:scale-[1.01]">
            {t('hero_subtitle')}
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200 dark:border-slate-700 max-w-xl flex flex-col sm:flex-row gap-3 transition-colors hover:shadow-blue-500/10"
          >
            <div className="flex-1 relative group">
              <Search className="absolute left-3.5 top-3.5 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all text-sm"
                value={currentSearch}
                onChange={e => updateSearch(e.target.value)}
              />
            </div>
            <div className="hidden sm:block w-[1px] bg-slate-200 dark:bg-slate-700 my-2"></div>
            <div className="flex-1 relative group">
              <MapPin className="absolute left-3.5 top-3.5 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder={t('search_location')}
                defaultValue="Mumbai"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Button type="submit" size="lg" className="w-full sm:w-auto h-12 cursor-pointer shadow-md hover:shadow-blue-500/25">
                {t('search_btn')}
              </Button>
            </div>
          </form>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Popular Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Cardiology", label: "Cardiology", icon: "🫀" },
                { name: "Dermatology", label: "Dermatology", icon: "🧬" },
                { name: "Pediatrics", label: "Pediatrics", icon: "👶" },
                { name: "Neuro-Oncology", label: "Neuro-Oncology", icon: "🧠" },
                { name: "Radiation Oncology", label: "Oncology", icon: "⚡" },
              ].map((spec) => (
                <button
                  key={spec.name}
                  type="button"
                  onClick={() => handleSpecialtyClick(spec.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span>{spec.icon}</span>
                  <span>{spec.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-semibold cursor-default transition-transform duration-200 hover:scale-[1.02] text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="size-4 text-emerald-500" /> Free Cancellation
            </span>
            <span className="flex items-center gap-1.5 font-semibold cursor-default transition-transform duration-200 hover:scale-[1.02] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="size-4 text-blue-500" /> Verified Specialists
            </span>
          </div>
        </div>

        <div className="relative hidden md:block perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/25 to-indigo-500/25 rounded-full blur-3xl opacity-75 -z-10 transform translate-x-6 translate-y-6" />
          <div className="relative cursor-pointer rounded-3xl p-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 group">
              <Image
                src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800"
                alt="Doctor consultation"
                width={800}
                height={600}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover h-[560px] w-full group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
