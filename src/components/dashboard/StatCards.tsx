"use client";

import React from "react";
import { MoreHorizontal, TrendingUp, TrendingDown, Building2, Video, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardsProps {
  completedVisits?: number;
  upcomingConsultations?: number;
  labAnalyses?: number;
}

export function StatCards({
  completedVisits = 4,
  upcomingConsultations = 9,
  labAnalyses = 19,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
      {/* Card 1: In-Clinic / Offline Work */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform"
            >
              <Building2 className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Offline Work
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
              className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {completedVisits}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              hospital patients
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-2.5 py-1 rounded-full"
          >
            <TrendingDown className="size-3" />
            <span>-6% avg</span>
          </motion.div>
        </div>

        {/* Dynamic Drawing SVG Sparkline */}
        <div className="mt-4 h-8 w-full">
          <svg className="w-full h-full text-rose-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
            <motion.path
              d="M0 15 Q 25 5, 50 18 T 100 8"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <path
              d="M0 15 Q 25 5, 50 18 T 100 8 V 25 H 0 Z"
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>
      </motion.div>

      {/* Card 2: Online Consultations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform"
            >
              <Video className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Online Work
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
              className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {upcomingConsultations}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              online consultations
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full"
          >
            <TrendingUp className="size-3" />
            <span>+21% avg</span>
          </motion.div>
        </div>

        {/* Dynamic Drawing Smooth Green Sparkline */}
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
      </motion.div>

      {/* Card 3: Laboratory Work */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 10, scale: 1.15 }}
              className="size-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform"
            >
              <FlaskConical className="size-4" />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Laboratory Work
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
              transition={{ duration: 0.4, delay: 0.35 }}
              className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {labAnalyses}
            </motion.div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              laboratory analysis
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full"
          >
            <TrendingUp className="size-3" />
            <span>+15% avg</span>
          </motion.div>
        </div>

        {/* Dynamic Drawing Blue/Indigo Sparkline */}
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
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
            <path
              d="M0 12 Q 25 22, 50 10 T 75 14 T 100 4 V 25 H 0 Z"
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
