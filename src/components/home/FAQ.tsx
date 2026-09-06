"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t("faq_title")}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Everything you need to know about booking and consulting doctors.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
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

              <AnimatePresence initial={false}>
                {openQ === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
