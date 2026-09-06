"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle2 } from "lucide-react";
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
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 size-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 size-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed"
          >
            {t('hero_subtitle')}
          </motion.p>

          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200/80 dark:border-slate-700 max-w-xl flex flex-col sm:flex-row gap-3 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
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
            <Button type="submit" size="lg" className="w-full sm:w-auto h-12 cursor-pointer shadow-md hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {t('search_btn')}
            </Button>
          </motion.form>

          {/* Real Popular Specialties Shortcuts */}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900/40 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer hover:border-blue-300 active:scale-95"
                >
                  <span>{spec.icon}</span>
                  <span>{spec.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick trust metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-1"
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="size-4 text-emerald-500" /> Free Cancellation
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="size-4 text-emerald-500" /> Verified Specialists
            </span>
          </motion.div>
        </motion.div>
        
        {/* Right Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden md:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl opacity-70 -z-10 transform translate-x-10 translate-y-10"></div>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <Image 
              src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800" 
              alt="Doctor consultation"
              width={800}
              height={600}
              priority
              className="object-cover h-[560px] w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
