"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 relative z-10">
          <div className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            {t('hero_badge')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {t('hero_title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg">
            {t('hero_subtitle')}
          </p>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 max-w-xl flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 size-5 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden sm:block w-[1px] bg-slate-200 dark:bg-slate-700 my-2"></div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3.5 size-5 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('search_location')} 
                defaultValue="Mumbai"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <Button size="lg" className="w-full sm:w-auto h-12">{t('search_btn')}</Button>
          </div>

        </div>
        
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-10 translate-y-10"></div>
          <Image 
            src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800" 
            alt="Doctor smiling"
            width={800}
            height={600}
            priority
            className="rounded-3xl shadow-2xl object-cover h-[600px] w-full"
          />
        </div>
      </div>
    </section>
  );
}
