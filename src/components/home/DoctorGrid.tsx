"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Doctor } from "@/types";

interface DoctorGridProps {
  onBook: (doctor: Doctor) => void;
}

export function DoctorGrid({ onBook }: DoctorGridProps) {
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

  return (
    <section id="doctors" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-baseline gap-2">{t("doctors_title")} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(for example)</span></h2>
            <p className="text-slate-500 dark:text-slate-400">{t("doctors_subtitle")}</p>
          </div>
          <Button variant="outline" className="hidden sm:inline-flex">{t("view_all")}</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mt-3"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mt-2 w-full"></div>
              </div>
            ))
          ) : (
            doctors.slice(0, 6).map((doctor) => (
              <Card key={doctor.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <Image src={doctor.user.image} alt={doctor.user.name} width={96} height={96} className="w-24 h-24 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{doctor.user.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{doctor.specialization}</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 <span className="text-[10px] text-slate-400 font-normal">({Math.floor(doctor.experience * 12.5)} Reviews)</span></span>
                      <span className="text-slate-300 dark:text-slate-600 mx-1">•</span>
                      <span>{doctor.experience} Yrs Exp</span>
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
                <Button className="w-full" onClick={() => onBook(doctor)}>
                  {t("book_appointment")} - ₹{doctor.fee ? doctor.fee.toLocaleString() : "1,500"}
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
