"use client";
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
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">{t("faq_title")}</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <button 
                onClick={() => setOpenQ(openQ === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-slate-900 dark:text-white">{faq.q}</span>
                <ChevronDown className={`size-5 text-slate-400 transition-transform ${openQ === i ? "rotate-180" : ""}`} />
              </button>
              {openQ === i && (
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
