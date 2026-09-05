"use client";

import React from "react";
import { MoreHorizontal, TrendingUp, TrendingDown, Building2, Video, FlaskConical } from "lucide-react";

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
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="size-4" />
            </span>
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
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completedVisits}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              hospital patients
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-2.5 py-1 rounded-full">
            <TrendingDown className="size-3" />
            <span>-6% avg</span>
          </div>
        </div>

        {/* Subtle Wave Sparkline */}
        <div className="mt-4 h-8 w-full">
          <svg className="w-full h-full text-rose-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
            <path
              d="M0 15 Q 25 5, 50 18 T 100 8"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 15 Q 25 5, 50 18 T 100 8 V 25 H 0 Z"
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Online Consultations */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Video className="size-4" />
            </span>
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
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {upcomingConsultations}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              online consultations
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
            <TrendingUp className="size-3" />
            <span>+21% avg</span>
          </div>
        </div>

        {/* Smooth Green Sparkline */}
        <div className="mt-4 h-8 w-full">
          <svg className="w-full h-full text-emerald-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
            <path
              d="M0 20 Q 20 18, 40 10 T 80 5 T 100 2"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 20 Q 20 18, 40 10 T 80 5 T 100 2 V 25 H 0 Z"
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>

      {/* Card 3: Laboratory Work */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FlaskConical className="size-4" />
            </span>
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
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {labAnalyses}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              laboratory analysis
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
            <TrendingUp className="size-3" />
            <span>+15% avg</span>
          </div>
        </div>

        {/* Blue/Indigo Sparkline */}
        <div className="mt-4 h-8 w-full">
          <svg className="w-full h-full text-blue-400/30" viewBox="0 0 100 25" preserveAspectRatio="none" fill="none">
            <path
              d="M0 12 Q 25 22, 50 10 T 75 14 T 100 4"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 12 Q 25 22, 50 10 T 75 14 T 100 4 V 25 H 0 Z"
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
