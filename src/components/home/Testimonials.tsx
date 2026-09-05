"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function Testimonials() {
  const { t } = useLanguage();
  const reviews = [
    { name: "Sarah Jenkins", role: "Patient", text: "Incredible experience. I found a great cardiologist in under 5 minutes and booked my appointment instantly.", rating: 5 },
    { name: "Rahul Sharma", role: "Patient", text: "The online booking feature is a lifesaver. Extremely smooth and professional doctors.", rating: 5 },
    { name: "Emily Chen", role: "Patient", text: "Finally, a healthcare app that doesn't feel like it was built in 1999. Beautiful design and great service.", rating: 4 },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12 flex items-baseline justify-center gap-2">{t("testi_title")} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(for example)</span></h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <Card key={i} className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`size-4 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic mb-6">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-bold rounded-full flex items-center justify-center">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{review.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
