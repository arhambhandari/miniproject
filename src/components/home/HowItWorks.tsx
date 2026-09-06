"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { Search, Calendar, Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { number: "01", icon: Search, title: t("hiw_step1"), desc: t("hiw_step1_desc") },
    { number: "02", icon: Calendar, title: t("hiw_step2"), desc: t("hiw_step2_desc") },
    { number: "03", icon: Stethoscope, title: t("hiw_step3"), desc: t("hiw_step3_desc") },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
            Quick & Seamless
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            {t("hiw_title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 dark:from-slate-700 dark:via-blue-800 dark:to-slate-700 -translate-y-1/2 z-0"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 group cursor-default"
            >
              <span className="absolute top-5 right-5 text-xs font-extrabold text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
                {step.number}
              </span>

              <div className="w-18 h-18 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <step.icon className="size-8 transition-transform group-hover:rotate-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
