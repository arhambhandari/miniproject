"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { Search, Calendar, Stethoscope } from "lucide-react";

export function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { icon: Search, title: t("hiw_step1"), desc: t("hiw_step1_desc") },
    { icon: Calendar, title: t("hiw_step2"), desc: t("hiw_step2_desc") },
    { icon: Stethoscope, title: t("hiw_step3"), desc: t("hiw_step3_desc") },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">{t("hiw_title")}</h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-[2px] bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <step.icon className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
