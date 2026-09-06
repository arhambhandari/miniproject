"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import Image from "next/image";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import type { Doctor } from "@/types";

interface DoctorGridProps {
  onBook: (doctor: Doctor) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function DoctorGrid({ onBook, searchQuery = "", onClearSearch }: DoctorGridProps) {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {
        setDoctors(Array.isArray(data) ? data : data.doctors || []);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    if (!searchQuery || !searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      doctor.user.name.toLowerCase().includes(q) ||
      doctor.specialization.toLowerCase().includes(q) ||
      (doctor.hospitalName && doctor.hospitalName.toLowerCase().includes(q))
    );
  });

  return (
    <section id="doctors" className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 scroll-mt-10">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-8"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
              Top Specialists
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 flex items-baseline gap-2">
              {t("doctors_title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t("doctors_subtitle")}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onClearSearch?.()}
            className="hidden sm:inline-flex hover:scale-[1.02] transition-transform cursor-pointer"
          >
            {t("view_all")}
          </Button>
        </motion.div>

        {/* Active Filter Pill */}
        {searchQuery.trim() && (
          <div className="mb-8 flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-300">Filtered by:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-700">
                "{searchQuery}"
              </span>
              <span className="text-xs text-slate-400 font-medium">({filteredDoctors.length} found)</span>
            </div>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mt-3"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mt-2 w-full"></div>
              </div>
            ))
          ) : filteredDoctors.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">No specialists found matching "{searchQuery}"</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try another specialty like Cardiology, Dermatology, or Pediatrics.</p>
              {onClearSearch && (
                <Button onClick={onClearSearch} className="mt-4 cursor-pointer">
                  Show All Doctors
                </Button>
              )}
            </div>
          ) : (
            filteredDoctors.slice(0, 6).map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-4 hover:shadow-xl hover:-translate-y-1.5 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 group">
                  <div className="flex gap-4">
                    <div className="overflow-hidden rounded-xl size-24 shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-200 transition-all">
                      <Image
                        src={doctor.user.image}
                        alt={doctor.user.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doctor.user.name}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-2">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">4.9</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({Math.floor(doctor.experience * 12.5)} reviews)
                        </span>
                        <span className="text-slate-300 dark:text-slate-600 mx-1">•</span>
                        <span>{doctor.experience} yrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <MapPin className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{t("location")}</p>
                        <p className="font-medium text-slate-900 dark:text-slate-300 truncate max-w-[100px]">Clinic</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Clock className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{t("available")}</p>
                        <p className="font-medium text-slate-900 dark:text-slate-300">{doctor.nextAvailable}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full group/btn relative overflow-hidden transition-all shadow-sm hover:shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
                    onClick={() => onBook(doctor)}
                  >
                    <span>{t("book_appointment")} - ₹{doctor.fee ? doctor.fee.toLocaleString() : "1,500"}</span>
                  </Button>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
