"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const { t } = useLanguage();
  const [openQ, setOpenQ] = useState<number | null>(0);

  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t("faq_title")}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Everything you need to know about booking and consulting doctors.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors shadow-sm"
            >
              <button
                onClick={() => setOpenQ(openQ === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                aria-expanded={openQ === i}
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`size-5 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${
                    openQ === i ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  openQ === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
