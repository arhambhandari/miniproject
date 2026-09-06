"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Clock,
  Video,
  CalendarCheck,
  XCircle,
  ExternalLink,
  CalendarDays,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Appointment } from "@/types";

interface RightPanelProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  appointments: Appointment[];
  onCancelAppointment?: (id: string) => void;
  onBookDoctor?: (dateIso?: string) => void;
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
}: RightPanelProps) {
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
    return currentWeekRef.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentWeekRef]);

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

    const dateStr = selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (isToday) return `Today, ${dateStr}`;
    if (isTmrw) return `Tomorrow, ${dateStr}`;
    return dateStr;
  }, [selectedDate, today]);

  // Check if a given day in the calendar has any scheduled appointment
  const dayHasAppointment = (date: Date) => {
    return appointments.some((app) => {
      const appDate = parseAppointmentDate(app.date);
      return appDate ? isSameCalendarDay(appDate, date) : false;
    });
  };

  return (
    <div className="w-full xl:w-80 2xl:w-88 flex flex-col gap-5 shrink-0">
      {/* 1. MY PROFILE Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            My Profile
          </span>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            title="Edit Profile"
            className="size-7 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Edit2 className="size-3.5" />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative size-18 rounded-2xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/40 shadow-md cursor-pointer"
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-1 right-1 size-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
          </motion.div>

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-3">
            {userName}
          </h3>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Verified Patient
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Mumbai, India
          </p>

          {/* 3 Quick Details Pills (Date of Birth, Blood, Hours) */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/70 w-full text-center">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2 cursor-default">
              <span className="text-[10px] text-slate-400 block font-medium">
                Date Birth
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                17.07.86
              </span>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.02 }} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2 cursor-default">
              <span className="text-[10px] text-slate-400 block font-medium">
                Blood
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                A(II) Rh+
              </span>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.02 }} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2 cursor-default">
              <span className="text-[10px] text-slate-400 block font-medium">
                Hours
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                9am - 5pm
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 2. UP-TO-DATE MY CALENDAR Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-blue-600" />
            My Calendar
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

            const dayName = d.toLocaleDateString("en-US", { weekday: "narrow" });
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

      {/* 3. DYNAMIC SCHEDULE TIMELINE (Changes smoothly with AnimatePresence according to selected date) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex-1 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Schedule • {scheduleDateHeader}
            </span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              {selectedDateAppointments.length} {selectedDateAppointments.length === 1 ? "visit" : "visits"}
            </span>
          </div>

          {/* Timeline List with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3.5"
            >
              {selectedDateAppointments.length === 0 ? (
                <div className="py-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 p-4">
                  <CalendarCheck className="size-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No appointments for {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 mb-3">
                    Your schedule is open on this date.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onBookDoctor && onBookDoctor(selectedDate.toISOString().split("T")[0])}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Book for this date</span>
                  </motion.button>
                </div>
              ) : (
                selectedDateAppointments.map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="relative pl-4 border-l-2 border-blue-500/60 dark:border-blue-400/60 group hover:border-blue-600 transition-colors"
                  >
                    <span
                      className={`absolute -left-[5px] top-1 size-2 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                        app.status === "Upcoming"
                          ? "bg-blue-600"
                          : app.status === "Completed"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {app.time || "10:00 AM"}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          app.status === "Upcoming"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : app.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                      Consultation with {app.doctorName}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400">
                      {app.specialty}
                    </p>

                    {/* Actions */}
                    {app.status === "Upcoming" && (
                      <div className="flex items-center gap-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md cursor-pointer"
                        >
                          <Video className="size-3" /> Join Call
                        </motion.button>
                        {onCancelAppointment && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onCancelAppointment(app.id)}
                            className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            <XCircle className="size-3" /> Cancel
                          </motion.button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button at bottom */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/70 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onBookDoctor && onBookDoctor(selectedDate.toISOString().split("T")[0])}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Book New Appointment</span>
            <ExternalLink className="size-3" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
