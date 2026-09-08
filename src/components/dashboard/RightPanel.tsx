"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  QrCode,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientProfileCard } from "@/components/dashboard/PatientProfileCard";
import { useLanguage } from "@/components/LanguageContext";
import type { Appointment } from "@/types";

interface RightPanelProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  appointments: Appointment[];
  onCancelAppointment?: (id: string) => void;
  onBookDoctor?: (dateIso?: string) => void;
  onOpenPass?: (app: Appointment) => void;
  onOpenSettings?: () => void;
}

// Helper to compare two dates on day/month/year
function isSameCalendarDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Parse appointment date string to Date
function parseAppointmentDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const lower = dateStr.trim().toLowerCase();
  const today = new Date();
  if (lower === "today") return today;
  if (lower === "tomorrow") {
    const tmrw = new Date(today);
    tmrw.setDate(today.getDate() + 1);
    return tmrw;
  }
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return null;
}

export function RightPanel({
  userName = "Rahul Sharma",
  userEmail = "rahul@example.com",
  userImage,
  appointments = [],
  onCancelAppointment,
  onBookDoctor,
  onOpenPass,
  onOpenSettings,
}: RightPanelProps) {
  const { language, t } = useLanguage();
  const today = useMemo(() => new Date(), []);
  // Active week starting reference date
  const [currentWeekRef, setCurrentWeekRef] = useState<Date>(() => new Date());
  // Selected day for viewing schedule
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Calculate 7-day strip for the current week reference
  const weekDays = useMemo(() => {
    const ref = new Date(currentWeekRef);
    const dayOfWeek = ref.getDay(); // 0 is Sunday
    const sunday = new Date(ref);
    sunday.setDate(ref.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentWeekRef]);

  // Navigate to previous week
  const handlePrevWeek = () => {
    const newRef = new Date(currentWeekRef);
    newRef.setDate(currentWeekRef.getDate() - 7);
    setCurrentWeekRef(newRef);
  };

  // Navigate to next week
  const handleNextWeek = () => {
    const newRef = new Date(currentWeekRef);
    newRef.setDate(currentWeekRef.getDate() + 7);
    setCurrentWeekRef(newRef);
  };

  // Header month and year label
  const monthYearLabel = useMemo(() => {
    return currentWeekRef.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentWeekRef, language]);

  // Check which appointments match the currently selected date
  const selectedDateAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const appDate = parseAppointmentDate(app.date);
      if (!appDate) return false;
      return isSameCalendarDay(appDate, selectedDate);
    });
  }, [appointments, selectedDate]);

  // Formatted date label for schedule header
  const scheduleDateHeader = useMemo(() => {
    const isToday = isSameCalendarDay(selectedDate, today);
    const tmrw = new Date(today);
    tmrw.setDate(today.getDate() + 1);
    const isTmrw = isSameCalendarDay(selectedDate, tmrw);

    const dateStr = selectedDate.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
      month: "short",
      day: "numeric",
    });

    if (isToday) return language === "hi" ? `आज, ${dateStr}` : `Today, ${dateStr}`;
    if (isTmrw) return language === "hi" ? `कल, ${dateStr}` : `Tomorrow, ${dateStr}`;
    return dateStr;
  }, [selectedDate, today, language]);

  // Check if a given day in the calendar has any scheduled appointment
  const dayHasAppointment = (date: Date) => {
    return appointments.some((app) => {
      const appDate = parseAppointmentDate(app.date);
      return appDate ? isSameCalendarDay(appDate, date) : false;
    });
  };

  return (
    <div className="w-full xl:w-80 2xl:w-88 flex flex-col gap-5 shrink-0">
      {/* 1. UP-TO-DATE MY CALENDAR & SCHEDULE Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-blue-600" />
            {language === "hi" ? "मेरा कैलेंडर" : "My Calendar"}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mr-1">
              {monthYearLabel}
            </span>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={handlePrevWeek}
              title="Previous Week"
              className="size-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleNextWeek}
              title="Next Week"
              className="size-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Horizontal Days Strip (Dynamically Generated) */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((d) => {
            const isSelected = isSameCalendarDay(d, selectedDate);
            const isToday = isSameCalendarDay(d, today);
            const hasAppt = dayHasAppointment(d);

            const dayName = d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", { weekday: "narrow" });
            const dayNum = d.getDate();

            return (
              <motion.button
                key={d.toISOString()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedDate(d)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isSelected ? "text-white" : isToday ? "text-blue-600 dark:text-blue-400" : "opacity-60"
                  }`}
                >
                  {dayName}
                </span>
                <span className="text-xs font-extrabold">{dayNum}</span>

                {/* Appointment Indicator Dot */}
                {hasAppt && (
                  <span
                    className={`size-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-blue-600 dark:bg-blue-400 animate-pulse"
                    }`}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* 3. COMPACT DYNAMIC SCHEDULE TIMELINE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white dark:bg-slate-800/90 rounded-[24px] p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            {language === "hi" ? "शेड्यूल" : "Schedule"} • {scheduleDateHeader}
          </span>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
            {selectedDateAppointments.length} {language === "hi" ? "अपॉइंटमेंट" : selectedDateAppointments.length === 1 ? "visit" : "visits"}
          </span>
        </div>

        {/* Timeline List with Max-Height & Clean Scroll */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5 max-h-[175px] overflow-y-auto pr-1"
          >
            {selectedDateAppointments.length === 0 ? (
              <div className="py-4 px-3 text-center rounded-xl bg-slate-50/60 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === "hi"
                    ? `कोई अपॉइंटमेंट नहीं (${selectedDate.toLocaleDateString("hi-IN", { month: "short", day: "numeric" })})`
                    : `No appointments for ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-2">
                  {language === "hi" ? "इस तारीख पर कोई अपॉइंटमेंट नहीं है।" : "Your schedule is open on this date."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onBookDoctor && onBookDoctor(selectedDate.toISOString().split("T")[0])}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>{language === "hi" ? "इस तारीख के लिए बुक करें" : "Book for this date"}</span>
                </motion.button>
              </div>
            ) : (
              selectedDateAppointments.map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ x: 2, transition: { duration: 0.15 } }}
                  className="relative pl-3.5 border-l-2 border-blue-500/60 dark:border-blue-400/60 group hover:border-blue-600 transition-colors py-0.5"
                >
                  <span
                    className={`absolute -left-[5px] top-1.5 size-2 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                      app.status === "Upcoming"
                        ? "bg-blue-600"
                        : app.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <div className="flex items-center justify-between gap-1 leading-none">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {app.time || "10:00 AM"}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        app.status === "Upcoming"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : app.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}
                    >
                      {app.status === "Upcoming"
                        ? t("status_upcoming")
                        : app.status === "Completed"
                        ? t("status_completed")
                        : t("status_cancelled")}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate leading-tight">
                    {language === "hi" ? `${app.doctorName} के साथ परामर्श` : `Consultation with ${app.doctorName}`}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span className="truncate max-w-[120px]">{app.specialty}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">
                      {app.roomNumber || "Chamber 304"}
                    </span>
                  </div>

                  {/* Actions */}
                  {app.status === "Upcoming" && (
                    <div className="flex items-center gap-1.5 mt-1.5 pt-1 border-t border-slate-100/80 dark:border-slate-700/50">
                      {app.tokenNumber && (
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                          {app.tokenNumber}
                        </span>
                      )}
                      {onOpenPass && (
                        <button
                          onClick={() => onOpenPass(app)}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode className="size-2.5" /> {language === "hi" ? "ई-पास" : "E-Pass"}
                        </button>
                      )}
                      {onCancelAppointment && (
                        <button
                          onClick={() => onCancelAppointment(app.id)}
                          className="text-[10px] font-medium text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                        >
                          <XCircle className="size-2.5" /> {language === "hi" ? "रद्द करें" : "Cancel"}
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Compact Book Link at bottom */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-2 flex justify-center">
          <button
            onClick={() => onBookDoctor && onBookDoctor(selectedDate.toISOString().split("T")[0])}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="size-3" />
            <span>{t("book_appointment")}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. Patient Profile Card (Replaced Emergency Hospital Hotline) */}
      <PatientProfileCard
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}
