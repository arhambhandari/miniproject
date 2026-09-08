"use client";

import React from "react";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Building2,
  Pill,
  IndianRupee,
  CalendarCheck,
  User,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface DoctorStatCardsProps {
  totalEarnings?: number;
  appointmentCount?: number;
  upcomingCount?: number;
  patientCount?: number;
  completedCount?: number;
  onCardClick?: (target: "revenue" | "appointments" | "patients" | "completed") => void;
}

export function DoctorStatCards({
  totalEarnings = 2000,
  appointmentCount = 1,
  upcomingCount = 1,
  patientCount = 1,
  completedCount = 0,
  onCardClick,
}: DoctorStatCardsProps) {
  const hasPatients = patientCount > 0;
  const hasRevenue = hasPatients && totalEarnings > 0;
  const hasAppointments = hasPatients && appointmentCount > 0;
  const hasActivePatients = hasPatients;
  const hasCompleted = hasPatients && completedCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {/* Card 1: Practice Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.05 }}
        onClick={() => onCardClick && onCardClick("revenue")}
        className={`relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group ${
          onCardClick ? "cursor-pointer" : "cursor-default"
        }`}
        title="Click to view Practice Revenue & Bank Settlements"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform"
            >
              <IndianRupee className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Practice Revenue
            </span>
          </div>
          <button className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              ₹{totalEarnings.toLocaleString()}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              100% verified OPD fees
            </p>
          </div>

          {hasRevenue ? (
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full"
            >
              <TrendingUp className="size-3" />
              <span>+18% avg</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <span>0% activity</span>
            </div>
          )}
        </div>

        {/* Smooth Green Sparkline - only shown when doctor has patients & revenue */}
        {hasRevenue ? (
          <div className="mt-4 h-8 w-full">
            <svg className="w-full h-full text-emerald-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
              <motion.path
                d="M0 20 Q 20 18, 40 10 T 80 5 T 100 2"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              />
              <path
                d="M0 20 Q 20 18, 40 10 T 80 5 T 100 2 V 25 H 0 Z"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
          </div>
        ) : (
          <div className="mt-4 h-8 w-full flex items-center">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700/60" />
          </div>
        )}
      </motion.div>

      {/* Card 2: Total Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.12 }}
        onClick={() => onCardClick && onCardClick("appointments")}
        className={`relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group ${
          onCardClick ? "cursor-pointer" : "cursor-default"
        }`}
        title="Click to view all Scheduled Appointments"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform"
            >
              <CalendarCheck className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Total Appointments
            </span>
          </div>
          <button className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {appointmentCount}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {upcomingCount} upcoming session(s)
            </p>
          </div>

          {hasAppointments ? (
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full"
            >
              <TrendingUp className="size-3" />
              <span>+12% book</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <span>0 bookings</span>
            </div>
          )}
        </div>

        {/* Dynamic Drawing Blue Sparkline - only shown when doctor has appointments */}
        {hasAppointments ? (
          <div className="mt-4 h-8 w-full">
            <svg className="w-full h-full text-blue-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
              <motion.path
                d="M0 12 Q 25 22, 50 10 T 75 14 T 100 4"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
              />
              <path
                d="M0 12 Q 25 22, 50 10 T 75 14 T 100 4 V 25 H 0 Z"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
          </div>
        ) : (
          <div className="mt-4 h-8 w-full flex items-center">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700/60" />
          </div>
        )}
      </motion.div>

      {/* Card 3: Appointed Patients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.2 }}
        onClick={() => onCardClick && onCardClick("patients")}
        className={`relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group ${
          onCardClick ? "cursor-pointer" : "cursor-default"
        }`}
        title="Click to view Appointed Patients roster"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform"
            >
              <User className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Appointed Patients
            </span>
          </div>
          <button className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {patientCount}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              under active care & records
            </p>
          </div>

          {hasActivePatients ? (
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full"
            >
              <TrendingUp className="size-3" />
              <span>+24% flow</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <span>0 patients</span>
            </div>
          )}
        </div>

        {/* Dynamic Drawing Purple Sparkline - only shown when doctor has active patients */}
        {hasActivePatients ? (
          <div className="mt-4 h-8 w-full">
            <svg className="w-full h-full text-purple-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
              <motion.path
                d="M0 18 Q 30 6, 60 16 T 100 6"
                stroke="#A855F7"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
              <path
                d="M0 18 Q 30 6, 60 16 T 100 6 V 25 H 0 Z"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
          </div>
        ) : (
          <div className="mt-4 h-8 w-full flex items-center">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700/60" />
          </div>
        )}
      </motion.div>

      {/* Card 4: Completed Cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.28 }}
        onClick={() => onCardClick && onCardClick("completed")}
        className={`relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group ${
          onCardClick ? "cursor-pointer" : "cursor-default"
        }`}
        title="Click to view Completed Consultations"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-transform"
            >
              <CheckCircle2 className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Completed Cases
            </span>
          </div>
          <button className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {completedCount}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              discharged with care plans
            </p>
          </div>

          {hasCompleted ? (
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-full"
            >
              <TrendingUp className="size-3" />
              <span>100% done</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <span>0 completed</span>
            </div>
          )}
        </div>

        {/* Dynamic Drawing Teal Sparkline - only shown when doctor has completed cases */}
        {hasCompleted ? (
          <div className="mt-4 h-8 w-full">
            <svg className="w-full h-full text-teal-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
              <motion.path
                d="M0 15 Q 25 5, 50 18 T 100 8"
                stroke="#14B8A6"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
              />
              <path
                d="M0 15 Q 25 5, 50 18 T 100 8 V 25 H 0 Z"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
          </div>
        ) : (
          <div className="mt-4 h-8 w-full flex items-center">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700/60" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
