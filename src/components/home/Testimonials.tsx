"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function Testimonials() {
  const { t } = useLanguage();
  const reviews = [
    { name: "Sarah Jenkins", role: "Patient", text: "Incredible experience. I found a great cardiologist in under 5 minutes and booked my appointment instantly.", rating: 5 },
    { name: "Rahul Sharma", role: "Patient", text: "The online booking feature is a lifesaver. Extremely smooth and professional doctors.", rating: 5 },
    { name: "Emily Chen", role: "Patient", text: "Finally, a healthcare app that doesn't feel like it was built in 1999. Beautiful design and great service.", rating: 4 },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline justify-center gap-2">
            {t("testi_title")}{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(for example)</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Real experiences from patients who trust our verified specialists.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="p-6 h-full flex flex-col justify-between hover:-translate-y-2 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 group relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`size-4 ${
                            j < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="size-5 text-blue-100 dark:text-blue-950 group-hover:text-blue-200 dark:group-hover:text-blue-900 transition-colors" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold rounded-full flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {review.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
